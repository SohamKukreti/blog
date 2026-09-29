// Turns a note name like "My First Post!" into "my-first-post".
// Used for page URLs and for resolving [[wikilinks]], so both always agree.
export function slugify(name) {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
