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

`claude/` holds the Claude Code adapter that runs the post-edit quality check. `.claude/settings.json` wires it to `PostToolUse` under the matcher `Write|Edit` with a 10 second host timeout.

The adapter returns at once unless the tool is `Write` or `Edit`. It resolves the edited file through `../lib/post-edit-router.cjs` and runs the matched checker. That run sits under a 9000 ms hook budget and an 8000 ms per-checker cap. A separate dist-staleness check runs after the checker and needs 500 ms of budget left.

The adapter delivers findings to the model through `hookSpecificOutput.additionalContext` on stdout. A clean edit produces no output at all, not even an empty envelope. The adapter exits 0 on every path, so a bug never blocks the tool call.

Cursor runs this file too, through the `postToolUse` registration in `.cursor/hooks.json`. Its proxy spawns this adapter for a `Write` and passes the findings back as `agent_message`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `post-edit-quality.cjs` | The `PostToolUse` adapter that Claude and Cursor run. |

It reads `tool_input.file_path` and checks that the edited file exists. It calls `resolveDispatch()` and `runChecks()`, then formats a comment-hygiene or generic warning. The staleness banner is appended last, after the checker findings. Malformed stdin, a missing file, a dispatch error or a checker error produces no finding. The `post-edit-quality` kill switch turns the whole adapter into a no-op.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs
```

Expected result: every test passes, with `fail 0` in the summary. The suite covers the router, the Claude adapter and the Codex adapter.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../lib/post-edit-router.cjs`](../lib/post-edit-router.cjs): the shared router that resolves the edited file and runs the checker.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the shared stdin reader that fails open on a malformed payload.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the Claude registration that runs this adapter on `PostToolUse`.
- [`../../../../.cursor/hooks.json`](../../../../.cursor/hooks.json): the Cursor registration whose proxy spawns this adapter for a `Write`.
