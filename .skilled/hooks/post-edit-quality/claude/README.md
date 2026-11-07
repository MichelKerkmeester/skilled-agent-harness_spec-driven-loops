---
title: "Post-Edit Quality: Claude PostToolUse Adapter"
description: "Claude Code adapter that runs the shared checker router after a Write or Edit and delivers bounded findings as PostToolUse additionalContext."
trigger_phrases:
  - "claude post edit quality"
  - "claude comment hygiene hook"
  - "posttooluse quality check"
version: 1.0.0.0
---

# Post-Edit Quality: Claude PostToolUse Adapter

---

## 1. OVERVIEW

`claude/` holds the Claude Code adapter for post-edit quality. `.claude/settings.json` wires it to `PostToolUse` under the matcher `Write|Edit` with a 10 second host timeout. The adapter resolves the edited file through `../lib/post-edit-router.cjs`, runs the matched checker under a 9000 ms hook budget and an 8000 ms per-checker cap, then runs the separate dist-staleness check. Findings are delivered through `hookSpecificOutput.additionalContext`. A clean edit produces no output at all.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`claude-posttooluse.cjs`](./claude-posttooluse.cjs) | `PostToolUse` | Reads `tool_input.file_path`, checks the file exists, calls `resolveDispatch()` and `runChecks()`, formats a comment-hygiene or generic warning, and adds the staleness banner. Exits 0 on every path. | Fails open. Malformed stdin, a missing file, a dispatch error or a checker error produces no finding and never blocks the call. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader.
