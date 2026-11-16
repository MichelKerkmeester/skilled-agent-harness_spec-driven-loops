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

`devin/` holds the Devin CLI adapter for the post-edit quality concern. `.devin/hooks.v1.json` wires it to `PostToolUse` under the matcher `^(edit|write)$`, with a 10-second timeout. The `post-edit-quality` entry in `hook-registry.json` holds the Devin binding for this file. Devin is the only runtime that runs this file.

The adapter resolves the edited file from `file_path`, `filePath` or `path`. The first string alias wins, so a non-string value cannot hide a later one. The adapter makes a relative path absolute against the project directory. The adapter then runs `../lib/post-edit-router.cjs` under the shared 9-second budget.

The project directory comes from `payload.cwd`, then `DEVIN_PROJECT_DIR`, then `process.cwd()`. A file that does not exist ends the run with no output.

The adapter writes findings as a `hookSpecificOutput.additionalContext` envelope on stdout. The separate dist-staleness banner follows it in that same envelope. A clean edit stays silent, with no envelope and no output.

The adapter fails open and exits 0 on every path. Malformed stdin, a missing file or a checker error produces no finding. None of those paths blocks the tool call this hook observes.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `post-edit-quality.cjs` | The Devin adapter. It filters on `edit` and `write`, resolves the path and calls `resolveDispatch()` plus `runChecks()`. |

The adapter formats comment-hygiene and generic warnings, then adds the staleness banner. A comment-hygiene finding names the file and lists each flagged line. It also names the escape: add `hygiene-ok` to a comment line to suppress that line.

The kill switch is the `isHookEnabled('post-edit-quality')` call, which runs first. A disabled concern returns before the adapter reads any stdin. The dist-staleness check is skipped when under 500 ms of the budget remains.

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver that gates the adapter.
