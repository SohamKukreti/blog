// Code block look: three "pens" (ink, blue, grey) instead of a full color theme,
// plus a handwritten language tag and a copy button around each block.

function penTheme(name, type, { ink, blue, grey }) {
  return {
    name,
    type,
    colors: { 'editor.background': '#00000000', 'editor.foreground': ink },
    tokenColors: [
      { settings: { foreground: ink } },
      {
        scope: [
          'keyword',
          'storage',
          'storage.type',
          'storage.modifier',
          'constant.language',
          'support.type.primitive',
          'entity.name.tag',
          'variable.language',
        ],
        settings: { foreground: blue },
      },
      { scope: ['keyword.operator'], settings: { foreground: ink } },
      {
        scope: ['keyword.operator.new', 'keyword.operator.expression', 'keyword.operator.logical.python'],
        settings: { foreground: blue },
      },
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: grey } },
    ],
  };
}

export const penLight = penTheme('pen-light', 'light', { ink: '#111111', blue: '#2447c7', grey: '#8a867e' });
export const penDark = penTheme('pen-dark', 'dark', { ink: '#ecebe7', blue: '#93a8ff', grey: '#8a8780' });

const PLAIN = new Set(['plaintext', 'text', 'txt', 'plain', '']);
const el = (tagName, properties, text) => ({
  type: 'element',
  tagName,
  properties,
  children: text ? [{ type: 'text', value: text }] : [],
});

export const penFrame = {
  name: 'pen-frame',
  root(root) {
    const lang = this.options.lang ?? '';
    const frame = el('div', { className: ['code'] });
    if (!PLAIN.has(lang)) frame.children.push(el('span', { className: ['code-lang'] }, lang));
    frame.children.push(el('button', { type: 'button', className: ['code-copy'] }, 'copy'));
    frame.children.push(...root.children);
    root.children = [frame];
  },
};
