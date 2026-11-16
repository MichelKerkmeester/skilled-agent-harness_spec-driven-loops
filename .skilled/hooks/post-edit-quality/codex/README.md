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

`codex/` holds the Codex CLI adapter for post-edit quality. `.codex/hooks.json` wires it to `PostToolUse` under the matcher `apply_patch|edit` with a 10 second timeout. Codex is the only runtime that runs this adapter.

An `apply_patch` call can carry more than one file in a single patch body. The adapter extracts every file header and resolves each relative path against the project directory. It runs the router on each file under one shared budget.

Findings print as plain stdout, one block per finding, and a file with no finding prints nothing. The dist-staleness check runs once against the first existing file. A large patch therefore gets one banner rather than one per file.

The hook is on by default. `SK_CODE_POST_EDIT_QUALITY_DISABLED=1` turns it into a full no-op, and `SYSTEM_HOOKS_DISABLED=1` turns off every repository hook.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `post-edit-quality.cjs` | The adapter. It reads the hook payload, extracts each edited file, runs the shared router and prints findings. |

The adapter reads `file_path`, `filePath` or `path` from the `tool_input` object. The first string alias wins, so a non-string value cannot hide a later one. When no alias holds a string, it reads the patch body instead. It collects every `*** Add/Update/Delete File:` and `*** Move to:` header in that body.

The adapter checks only an `apply_patch` or `edit` payload, so a read stays silent. Each relative path is resolved against the project directory before the existence check. The project directory comes from `cwd`, then `CODEX_PROJECT_DIR`, then the process directory.

Every file in one patch shares a 9000 ms budget. A file is skipped once less than 500 ms remains. Each checker gets at most 8000 ms of that budget. It calls `resolveDispatch()` and `runChecks()` for each file that exists.

A comment-hygiene finding prints its own banner and a `hygiene-ok` escape line. Every other finding prints a `POST-EDIT QUALITY WARNING` header with the checker label.

The adapter exits 0 on every path, so a failure never blocks the call. Malformed stdin, a missing file, a dispatch error or a checker error produces no finding.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/codex-post-edit-quality.test.cjs
```

Expected result: the Codex adapter suite passes, with `fail 0`.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router that resolves the checker for each file.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the shared stdin reader that stops waiting after 3000 ms.
