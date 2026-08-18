---
alwaysApply: true
---

# sk-vision: read attached images before answering

You may not be able to see images natively. When the user attaches an image or points
to an image file (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.bmp`, or a `.pdf` page),
treat its contents as unknown until you have inspected it with sk-vision:

- Call `sk_vision_inspect(path="…")` for a structured scene read plus caption, and
  `sk_vision_ocr(path="…")` when the image holds text you need to quote exactly.
- Do this BEFORE reasoning about the image, and treat the tool output as the image's
  ground truth. Never infer an image's contents from its filename or the surrounding
  chat.
- Pass the image by `path`, not a base64 `image` string — the path route is the
  reliable one. If only a pasted/clipboard image is available with no path, ask the
  user to save it to a file first.

This is a best-effort rule, not a hard guarantee. Cursor attaches sk-vision only over
MCP, so — unlike the in-process OpenCode and Pi hooks, which force the analysis before
a text-only model reads the message — nothing here can compel the call. If the
`sk_vision_*` tools are unavailable, say so rather than inventing what the image shows.
