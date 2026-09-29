# Soham's blog

Write in Obsidian, get a site that looks like the portfolio.

## Write a post

1. Open the `vault/` folder in Obsidian ("Open folder as vault").
2. Make a new note in `vault/posts/`, then run **Templates: Insert template → post**.
3. Write. Paste images straight in; they land in `vault/attachments/`.
4. When it is ready, set `draft: false`.

The file name becomes the URL: `My First Post.md` → `/blog/my-first-post/`.
Set `slug:` in the properties to pick a different one.

## See it

```sh
npm run dev      # http://localhost:4321/blog/ — shows drafts too
npm run build    # real site in dist/ — drafts left out
```

## Obsidian things that work

| You write                   | You get                               |
| --------------------------- | ------------------------------------- |
| `[[Other post]]`            | link to that post                     |
| `[[Other post\|label]]`     | link with your own text               |
| `[[Other post#Heading]]`    | link to a heading                     |
| `[[Private note]]`          | plain text (not a post, so no link)   |
| `![[image.png]]`            | the image, resized and optimised      |
| `![[image.png\|300]]`       | the image, 300px wide                 |
| `![[sketch.png\|drawing]]`  | white card behind it in dark mode (SVGs get this on their own) |
| `![[sketch.png\|invert]]`   | colors flipped in dark mode (black lines turn white), no card |
| `==text==`                  | highlight                             |
| `%%text%%`                  | hidden                                |
| `> [!note] Title`           | callout box (`warning` is orange)     |

Only notes in `vault/posts/` become pages. Anything else in the vault stays private.

## Publish (later)

1. Make a GitHub repo called `blog` and push this folder to it.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` builds and deploys to https://sohamkukreti.github.io/blog/
   (see `.github/workflows/deploy.yml`).

If the repo gets a different name, change `base` in `astro.config.mjs`.
