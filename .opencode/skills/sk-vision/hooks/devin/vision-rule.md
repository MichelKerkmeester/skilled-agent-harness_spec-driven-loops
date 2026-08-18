# sk-vision: read attached images before answering (Devin drop-in)

Devin attaches sk-vision only over MCP and has no repo-owned always-on rule slot that a
skill can wire automatically (the way `hooks/cursor/vision-rule.md` is symlinked into
`.cursor/rules/`). To make image reads reliable for a text-only Devin model, paste the
instruction below into Devin's Knowledge (or the session's guidance) for this repo.

> You may not be able to see images natively. When the user attaches an image or points
> to an image file (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.bmp`, or a `.pdf` page),
> treat its contents as unknown until you have inspected it with sk-vision:
>
> - Call `sk_vision_inspect(path="…")` for a structured scene read plus caption, and
>   `sk_vision_ocr(path="…")` when the image holds text you need to quote exactly.
> - Do this BEFORE reasoning about the image, and treat the tool output as the image's
>   ground truth. Never infer an image's contents from its filename or the surrounding
>   chat.
> - Pass the image by `path`, not a base64 `image` string — the path route is the
>   reliable one.
>
> If the `sk_vision_*` tools are unavailable, say so rather than inventing what the image
> shows.

This is a best-effort note, not a hard guarantee: nothing in the MCP transport can
compel the call the way the in-process OpenCode and Pi hooks force the analysis before a
text-only model reads the message.
