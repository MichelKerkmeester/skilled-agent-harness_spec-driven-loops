---
title: "Post-Edit Quality: DSH tools/post-execute Adapter"
description: "DSH adapter that runs the shared checker router after an accepted write and attaches findings and the staleness banner as additional context."
trigger_phrases:
  - "dsh post edit quality"
  - "dsh quality context"
  - "dsh post execute checks"
version: 1.0.0.0
---

# Post-Edit Quality: DSH tools/post-execute Adapter

---

## 1. OVERVIEW

`dsh/` holds the DSH adapter for post-edit quality. DSH loads it through `.dsh/plugins/repo-guards/adapters/post-edit-quality.mjs`, a relative link to this file, and the bundle registers it on `tools/post-execute`. The adapter calls `next()` first, so the file is already written, then checks `write`, `edit` and `apply_patch` results that come back as `accept`. Findings and the staleness banner are wrapped in a user message by `loadDshLlm()` and appended to `additionalContexts`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`post-edit-quality.mjs`](./post-edit-quality.mjs) | `tools/post-execute` | Resolves the path from `arguments.path`, `file_path` or `filePath`, runs `resolveDispatch()`, `runChecks()` and `runDistStalenessCheck()`, and attaches one notice when anything was found. Exports `registerPostEditQuality` and `ERROR_POLICY = 'fail-open'`. | Fails open. A core throw logs a warning and returns the downstream result unchanged. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router this adapter calls.
- [`../../shared/dsh/dsh-llm.mjs`](../../shared/dsh/dsh-llm.mjs): the loader for `createUserMessage`.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that loads this adapter.
