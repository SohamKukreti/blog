import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { slugify } from './lib/slug.mjs';

// Every .md file in vault/posts is a post. The file name is the title and URL,
// unless the note's properties say otherwise.
const posts = defineCollection({
  loader: glob({
    base: './vault/posts',
    pattern: '**/*.md',
    generateId: ({ entry, data }) =>
      typeof data.slug === 'string' ? data.slug : slugify(entry.replace(/\.md$/, '').split('/').pop()),
  }),
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).nullish(),
    draft: z.boolean().default(false),
    slug: z.string().optional(),
  }),
});

export const collections = { posts };
