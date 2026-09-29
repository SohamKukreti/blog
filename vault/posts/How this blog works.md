---
title: How this blog works
date: 2026-09-29
description: A test post that shows every Obsidian feature the blog understands.
tags: [meta]
draft: true
---

This post is a **draft**, so you only see it when you run `npm run dev`. It will not go on the real site until `draft` is `false`.

## Normal Markdown

Plain text, *italics*, **bold**, [a normal link](https://sohamkukreti.github.io/), and `inline code`.

- a list
- with items

1. and a
2. numbered one

> A plain quote looks like this.

```python
# say hi to someone
def hello(name):
    if not name:
        return None
    return f"hi {name}"
```

```js
// the copy button on this block really works
const posts = await getPosts();
for (const post of posts) console.log(post.title, true);
```

| thing | works? |
| ----- | ------ |
| tables | yes |

## Obsidian bits

==Highlights== turn into a marker pen.

%%This comment is hidden on the site.%%

A link to another post: [[Second test post]]. With a label: [[Second test post|click here]]. To a heading: [[How this blog works#Obsidian bits]].

A link to a note that is not a post stays plain text: [[Some private note]].

An image, pasted into Obsidian, with a width. In dark mode, an SVG gets a white card:

![[portrait.svg|200]]

The same image with `|invert`. In dark mode, its colors flip:

![[portrait.svg|200|invert]]

> [!note] Callouts work
> Write them the Obsidian way, with `> [!note]`.

> [!warning]
> The warning type gets a different color.
