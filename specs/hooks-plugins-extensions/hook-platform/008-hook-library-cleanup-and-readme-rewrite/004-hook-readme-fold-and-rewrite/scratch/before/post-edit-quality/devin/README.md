---
title: "Post-Edit Quality: Devin PostToolUse Adapter"
description: "Devin CLI adapter that runs the shared checker router after an edit or write and delivers bounded findings as PostToolUse additionalContext."
trigger_phrases:
  - "devin post edit quality"
  - "devin comment hygiene"
  - "devin posttooluse quality"
version: 1.0.0.0
---

# Post-Edit Quality: Devin PostToolUse Adapter

---

## 1. OVERVIEW

`devin/` holds the Devin CLI adapter for post-edit quality. `.devin/hooks.v1.json` wires it to `PostToolUse` under the matcher `^(edit|write)$`. The adapter resolves the file from `file_path`, `filePath` or `path`, makes a relative path absolute against the project directory, and runs `../lib/post-edit-router.cjs` under the shared budget. Findings are delivered as `hookSpecificOutput.additionalContext`, followed by the separate dist-staleness banner.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`post-edit-quality.cjs`](./post-edit-quality.cjs) | `PostToolUse` | Filters on `edit` and `write`, resolves the path and calls `resolveDispatch()` plus `runChecks()`. Formats comment-hygiene and generic warnings and adds the staleness banner. Exits 0 on every path. | Fails open. Malformed stdin, a missing file or a checker error produces no finding and never blocks the call. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader.
