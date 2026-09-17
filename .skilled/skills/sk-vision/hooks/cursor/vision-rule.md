---
alwaysApply: true
---

# sk-vision: read images through the local CLI before answering

You may not be able to see images natively. When the user attaches an image or points
to an image file (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.bmp`, or a `.pdf` page),
treat its contents as unknown until you have inspected it with sk-vision:

```bash
node .opencode/skills/sk-vision/vision-runtime/dist/vision-cli.js <image-path> [question...]
```

- Run it with the image's **path**, before reasoning about the image, and treat the
  `<SK-VISION EVIDENCE>` block it prints as the image's ground truth. Never infer an image's
  contents from its filename or the surrounding chat.
- Omit the question for a full read: scene, caption and exact OCR. Pass one to get a
  direct answer instead.
- If only a pasted image is available with no path, ask the user to save it to a file
  first. The CLI reads a path and cannot see the conversation.
- Exit `1` prints a `SK_VISION_ERROR` line; report it rather than guessing. Exit `2`
  means the path did not resolve.
- The first run downloads roughly 3.9 GB of model weights and takes minutes. Tell the
  user that is what is happening instead of letting it look like a hang.

This is a best-effort rule, not a guarantee. Cursor delivers no prompt-time hook event,
so nothing here can force the call the way the in-process OpenCode and Pi hooks and the
Devin injection hook force the analysis before a text-only model reads the message. If
the CLI is missing, say so rather than inventing what the image shows. It is a build
artifact: run `bun run scripts/build.ts` in `vision-runtime/` to produce it.
