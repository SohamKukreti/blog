// Remark plugin that understands the Obsidian bits of Markdown:
//   [[Note]]  [[Note|label]]  [[Note#Heading]]   -> links to other posts
//   ![[image.png]]  ![[image.png|300]]          -> images from anywhere in the vault
//   ==highlight==                               -> <mark>
//   %%comment%%                                 -> removed
//   > [!note] Title                             -> callout box
import fs from 'node:fs';
import path from 'node:path';
import { visit, SKIP } from 'unist-util-visit';
import { slugify } from './slug.mjs';

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
const SKIP_DIRS = new Set(['.obsidian', '.trash', 'node_modules', '.git']);
const TOKEN = /(!?)\[\[([^\]\n]+?)\]\]|==([^=\n]+?)==/g;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function frontmatter(file) {
  const src = fs.readFileSync(file, 'utf8');
  const block = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const get = (key) => block?.[1].match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'))?.[1];
  return { slug: get('slug'), draft: get('draft') === 'true' };
}

// Re-read the vault for every file, so notes added while `npm run dev` runs are found.
function indexVault(vaultDir, postsDir, hideDrafts) {
  const posts = new Map();
  const files = new Map();
  for (const file of walk(vaultDir)) {
    const name = path.basename(file);
    if (!files.has(name.toLowerCase())) files.set(name.toLowerCase(), file);
    files.set(path.relative(vaultDir, file).toLowerCase(), file);
    if (file.startsWith(postsDir + path.sep) && name.endsWith('.md')) {
      const fm = frontmatter(file);
      if (hideDrafts && fm.draft) continue;
      posts.set(name.slice(0, -3).toLowerCase(), fm.slug || slugify(name.slice(0, -3)));
    }
  }
  return { posts, files };
}

function relativeUrl(fromFile, toFile) {
  let rel = path.relative(path.dirname(fromFile), toFile).split(path.sep).join('/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function tokenToNode(match, ctx) {
  const [whole, bang, inner, highlight] = match;
  if (highlight !== undefined) {
    return { type: 'emphasis', data: { hName: 'mark' }, children: [{ type: 'text', value: highlight }] };
  }
  const [target, ...options] = inner.split('|').map((s) => s.trim());
  const label = options[0];
  const [note, heading] = target.split('#');

  if (bang && IMAGE_EXT.test(note)) {
    const file = ctx.files.get(note.toLowerCase()) || ctx.files.get(path.basename(note).toLowerCase());
    if (!file) return { type: 'text', value: whole };
    // Options after "|": a size like 300 or 300x200, "drawing", "invert", or alt text.
    // In dark mode, "drawing" puts the image on a white card and "invert" flips its colors.
    // SVGs count as drawings on their own, unless "invert" is set.
    const props = {};
    let look = /\.svg$/i.test(note) ? 'drawing' : null;
    let alt = path.basename(note, path.extname(note));
    for (const opt of options) {
      if (/^\d+(x\d+)?$/.test(opt)) props.width = opt.split('x')[0];
      else if (opt === 'drawing' || opt === 'invert') look = opt;
      else if (opt) alt = opt;
    }
    if (look) props.className = [look === 'invert' ? 'invert-dark' : 'drawing'];
    return { type: 'image', url: relativeUrl(ctx.filePath, file), alt, data: { hProperties: props } };
  }

  const text = label || (heading && !note ? heading : note);
  const slug = note ? ctx.posts.get(path.basename(note).toLowerCase()) : ctx.currentSlug;
  if (slug === undefined) return { type: 'text', value: text };
  const hash = heading ? '#' + slugify(heading) : '';
  return { type: 'link', url: `${ctx.base}${slug}/${hash}`, children: [{ type: 'text', value: text }] };
}

function transformCallout(node) {
  const first = node.children[0];
  const lead = first?.type === 'paragraph' && first.children[0];
  if (!lead || lead.type !== 'text') return;
  const m = lead.value.match(/^\[!(\w+)\][+-]?[ \t]*([^\n]*)\n?/);
  if (!m) return;
  const type = m[1].toLowerCase();
  const title = m[2] || type.charAt(0).toUpperCase() + type.slice(1);
  lead.value = lead.value.slice(m[0].length);
  if (!lead.value) first.children.shift();
  if (!first.children.length) node.children.shift();
  node.data = { hName: 'aside', hProperties: { className: ['callout'], dataCallout: type } };
  node.children.unshift({
    type: 'paragraph',
    data: { hProperties: { className: ['callout-title'] } },
    children: [{ type: 'text', value: title }],
  });
}

export default function remarkObsidian({ vaultDir, postsDir, base }) {
  return (tree, file) => {
    const hideDrafts = process.env.NODE_ENV === 'production';
    const { posts, files } = indexVault(vaultDir, postsDir, hideDrafts);
    const filePath = file.path || file.history?.[0] || postsDir;
    const noteName = path.basename(filePath, '.md').toLowerCase();
    const ctx = { posts, files, base, filePath, currentSlug: posts.get(noteName) };

    visit(tree, 'blockquote', transformCallout);

    visit(tree, 'text', (node, index, parent) => {
      const value = node.value.replace(/%%[\s\S]*?%%/g, '');
      const out = [];
      let last = 0;
      for (const match of value.matchAll(TOKEN)) {
        if (match.index > last) out.push({ type: 'text', value: value.slice(last, match.index) });
        out.push(tokenToNode(match, ctx));
        last = match.index + match[0].length;
      }
      if (last === 0 && value === node.value) return;
      if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
      parent.children.splice(index, 1, ...out);
      return [SKIP, index + out.length];
    });

    // A paragraph that only held a %%comment%% is now empty; drop it.
    visit(tree, 'paragraph', (node, index, parent) => {
      if (node.children.every((c) => c.type === 'text' && !c.value.trim())) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
  };
}
