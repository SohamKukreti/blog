import fs from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'> & { title: string; date: Date };

// Drafts show up in `npm run dev`, never in the built site.
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries
    .map((entry) => ({
      ...entry,
      title: entry.data.title ?? path.basename(entry.filePath ?? entry.id, '.md'),
      date: entry.data.date ?? (entry.filePath ? fs.statSync(entry.filePath).mtime : new Date()),
    }))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export const url = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p}`;

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
