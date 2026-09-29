import rss from '@astrojs/rss';
import { getPosts, url } from '../lib/posts';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: "Soham's blog",
    description: 'Notes and writing by Soham Kukreti.',
    site: new URL(import.meta.env.BASE_URL, context.site).href,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.date,
      description: post.data.description,
      link: url(`${post.id}/`),
    })),
  });
}
