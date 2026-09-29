import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { slugify } from './lib/slug.mjs';

// Every .md file in vault/posts is a post. The file name is the title and URL,
// unless the note's properties say otherwise.
const unset = <T extends z.ZodType>(type: T) => z.preprocess((v) => (v === null || v === '' ? undefined : v), type.optional());

const posts = defineCollection({
  loader: glob({
    base: './vault/posts',
    pattern: '**/*.md',
    generateId: ({ entry, data }) =>
      typeof data.slug === 'string' ? data.slug : slugify(entry.replace(/\.md$/, '').split('/').pop()),
  }),
  // An empty property in Obsidian (like `description:`) arrives as null; treat it as not set.
  schema: z.object({
    title: unset(z.string()),
    date: unset(z.coerce.date()),
    description: unset(z.string()),
    tags: z.array(z.string()).nullish(),
    draft: z.boolean().default(false),
    slug: unset(z.string()),
  }),
});

export const collections = { posts };
