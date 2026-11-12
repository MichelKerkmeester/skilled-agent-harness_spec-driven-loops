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

`pi/` holds the real Pi extension for post-edit quality. Pi discovers it through the one-line entry file `.pi/extensions/post-edit-quality.ts`, which re-exports it, so it loads from this folder and its imports are relative to this folder. The extension handles `edit` and `write` results, resolves `event.input.path` against `ctx.cwd`, runs `../lib/post-edit-router.cjs` and appends the findings as `{type: 'text', text}` content on the tool result, which makes them model-visible.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`post-edit-quality.ts`](./post-edit-quality.ts) | `tool_result` | Filters on `edit` and `write`, checks the file exists and calls `resolveDispatch()`, `runChecks()` and `runDistStalenessCheck()`. Returns the original content plus one text part when anything was found. | Fails open. A missing path, an import error or a core error returns `undefined`, so the tool result is unchanged. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router this extension imports.
- [`../../../../.pi/extensions/post-edit-quality.ts`](../../../../.pi/extensions/post-edit-quality.ts): the link Pi discovers.
