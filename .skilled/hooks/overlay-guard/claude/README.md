---
title: "Claude Overlay Guard: PreToolUse Adapter"
description: "Claude Code adapter that refuses a Write, Edit or MultiEdit to a file a vendored tree's overlay owns and names the overlay file to edit instead."
trigger_phrases:
  - "claude overlay guard"
  - "overlay owned file deny"
  - "claude pre write guard"
version: 1.0.0.0
---

# Claude Overlay Guard: PreToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/overlay-guard/claude/` holds the Claude adapter for the overlay guard. It runs at `PreToolUse` and refuses a write to a file that an overlay owns, before the write happens. The refusal names the overlay file to edit. An allowed call writes nothing on stdout.

`.claude/settings.json` registers the adapter under `PreToolUse` with the matcher `Write|Edit|MultiEdit` and a 10 second timeout. The registered command changes to `CLAUDE_PROJECT_DIR` when it holds a value and exits 0 when `.skilled/hooks` is missing. When the command cannot resolve, the wrapper prints an `mk-hook-drift` line and adds context instead of denying. The other runtime folders beside this one hold their adapters.

The adapter checks `isHookEnabled('overlay-guard')` first, so a disabled concern exits 0 with no output before stdin is read. Otherwise it reads the JSON payload on stdin and takes the path from `tool_input.file_path`, falling back to `tool_input.filePath` or `tool_input.path`. The payload's `cwd` is the session directory, with `CLAUDE_PROJECT_DIR` and then the working directory as fallbacks. A payload that is not JSON approves at once with no output. So does a tool name outside the matcher or a tool input with no path. The adapter calls `evaluateWrite()` in the shared core and writes the deny envelope only when the core returns `deny`.

The concern key is `overlay-guard`. Its switch is `SYSTEM_OVERLAY_GUARD_DISABLED` and `SYSTEM_HOOKS_DISABLED` is the master switch. Every failure approves with exit 0. An engine error or an internal bug leaves one line on stderr and still approves.

---

## 2. DIRECTORY TREE

```text
claude/
+-- README.md
`-- overlay-guard.cjs
```

| File | Responsibility |
|---|---|
| `overlay-guard.cjs` | The adapter. It checks the concern switch, reads the payload, filters the write tools and calls `evaluateWrite()` from `../lib/overlay-guard.cjs`. |

The folder is flat. It holds no test of its own, so the suite that drives the adapter lives beside the core in `../lib/overlay-guard.test.cjs`.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every test passes and the command exits 0. The Claude cases assert a deny for an owned path under each tool in the matcher. They also assert empty stdout for an unowned path and for a tree with no manifest.

---

## 4. RELATED

- [`../README.md`](../README.md): the overlay guard concern, with its switch table and runtime coverage.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core that judges each path.
- [`../lib/overlay-guard.test.cjs`](../lib/overlay-guard.test.cjs): the suite that drives this adapter.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader this adapter calls.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind `isHookEnabled`.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the file that registers this adapter under `PreToolUse`.
