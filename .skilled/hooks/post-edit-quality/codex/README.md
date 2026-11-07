---
title: "Post-Edit Quality: Codex PostToolUse Adapter"
description: "Codex CLI adapter that checks every file named by an apply_patch or edit and prints bounded findings as plain stdout."
trigger_phrases:
  - "codex post edit quality"
  - "codex apply patch quality"
  - "codex comment hygiene"
version: 1.0.0.0
---

# Post-Edit Quality: Codex PostToolUse Adapter

---

## 1. OVERVIEW

`codex/` holds the Codex CLI adapter for post-edit quality. `.codex/hooks.json` wires it to `PostToolUse` under the matcher `apply_patch|edit`. An `apply_patch` can carry several files, so the adapter extracts every file header, resolves relative paths against the project directory and runs the router on each file under one shared budget. Findings print as plain stdout. The dist-staleness check runs once against the first existing file so a large patch gets one banner.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`post-edit-quality.cjs`](./post-edit-quality.cjs) | `PostToolUse` | Reads `file_path`, `filePath` or `path`, falls back to `*** Add/Update/Delete File:` and `*** Move to:` headers, and runs `resolveDispatch()` plus `runChecks()` per file. Prints each finding and the staleness banner. Exits 0 on every path. | Fails open. Malformed stdin, a missing file or a checker error produces no finding and never blocks the call. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader.
