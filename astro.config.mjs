import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { unified } from '@astrojs/markdown-remark';
import remarkObsidian from './src/lib/remark-obsidian.mjs';
import { penLight, penDark, penFrame } from './src/lib/shiki-pen.mjs';

// The blog lives at https://sohamkukreti.github.io/blog/
// If the GitHub repo gets a different name, change `base` to match it.
const base = '/blog';

export default defineConfig({
  site: 'https://sohamkukreti.github.io',
  base,
  trailingSlash: 'always',
  markdown: {
    processor: unified({
      remarkPlugins: [
        [
          remarkObsidian,
          {
            vaultDir: fileURLToPath(new URL('./vault', import.meta.url)),
            postsDir: fileURLToPath(new URL('./vault/posts', import.meta.url)),
            base: base + '/',
          },
        ],
      ],
    }),
    shikiConfig: {
      themes: { light: penLight, dark: penDark },
      defaultColor: false,
      transformers: [penFrame],
    },
  },
});
