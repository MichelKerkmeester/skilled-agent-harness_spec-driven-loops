# sk-vision on Devin: automatic injection, with a manual fallback

Devin needs no standing instruction for the common case. `hooks/devin/sk-vision.mjs` is
registered on `UserPromptSubmit` in `.devin/hooks.v1.json`, so when a prompt names an
image path that resolves on disk, the hook analyzes it and injects a `<SK-VISION EVIDENCE>` block
into the same turn. The model does not have to ask for it, and cannot decline it.

That covers the reliable path. Paste the note below into Devin's Knowledge for this repo
only if you want a fallback, because two cases leave the hook silent:

- **A cold model load.** The first analysis downloads roughly 3.9 GB of weights and takes
  minutes, which exceeds the hook's 60-second timeout. The host skips a timed-out hook, so
  that first turn arrives with no evidence. Later turns are fast.
- **A prompt with no resolvable path.** The hook only fires on a path that exists on disk,
  deliberately, so it never spins a GPU on a filename that appears in passing.

> When you need to read an image and no `<SK-VISION EVIDENCE>` block is present in the turn, run:
>
> ```bash
> node .opencode/skills/sk-vision/vision-runtime/dist/vision-cli.js <image-path> [question...]
> ```
>
> Treat the printed block as the image's ground truth. Treat OCR as exact and verbatim.
> Treat scene and caption as interpretation. Never infer an image's contents from its
> filename. Exit `1` prints a `SK_VISION_ERROR` line to report rather than guess around,
> and exit `2` means the path did not resolve.

The hook itself fails open on every path: a malformed payload, a disabled kill-switch, an
unbuilt runtime or any error resolves to an empty response, never a blocked turn. Disable
it with `SYSTEM_SK_VISION_DISABLED=1`, or every hook here with `SYSTEM_HOOKS_DISABLED=1`.
