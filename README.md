# My blog

I like the way my portfolio looked so I wanted to have a blog with the same vibe: goofy, experimental and artsy

## How to use

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
