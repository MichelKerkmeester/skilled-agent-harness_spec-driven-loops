---
title: "Post-Edit Quality: Pi tool_result Extension"
description: "Pi extension that runs the shared checker router after an edit or write and appends findings and the staleness banner to the tool result."
trigger_phrases:
  - "pi post edit quality"
  - "pi tool result findings"
  - "pi comment hygiene"
version: 1.0.0.0
---

# Post-Edit Quality: Pi tool_result Extension

---

## 1. OVERVIEW

`pi/` holds the real Pi extension for post-edit quality. Pi discovers it through the one-line entry file `.pi/extensions/post-edit-quality.ts`, which re-exports it. The extension loads from this folder, so its imports are relative to this folder.

The extension listens on `tool_result` and handles `edit` and `write` results only. It resolves `event.input.path` against `ctx.cwd` and runs `../lib/post-edit-router.cjs`. Findings come back as `{type: 'text', text}` content on the tool result, so the model sees them.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `post-edit-quality.ts` | The Pi `tool_result` extension that appends router findings to an edit or write result. |

The extension registers one handler on `tool_result` and filters on the tool name. It returns early unless that name is `edit` or `write`. It also returns early when `event.input.path` is missing or not a string. A path that does not exist on disk returns early too.

On a match it calls `resolveDispatch()`, `runChecks()` and `runDistStalenessCheck()` from the router. `runChecks()` runs under the shared budget and the checker timeout. When anything was found, it returns the original content plus one text part.

A missing path, an import error or a core error returns `undefined`. The tool result then stays exactly as it was before.

The extension returns early when the `post-edit-quality` concern is off. The `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` switch turns that concern off before the handler registers.

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router this extension imports.
- [`../../../../.pi/extensions/post-edit-quality.ts`](../../../../.pi/extensions/post-edit-quality.ts): the one-line entry file Pi discovers.
