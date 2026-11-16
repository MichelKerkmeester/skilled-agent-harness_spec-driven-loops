---
title: "Overlay Guard: Claude PreToolUse Adapter"
description: "Claude Code adapter that refuses a Write, Edit or MultiEdit to a file a vendored tree's overlay owns and names the overlay file to edit instead."
trigger_phrases:
  - "claude overlay guard"
  - "overlay owned file deny"
  - "claude pre write guard"
version: 1.0.0.0
---

# Overlay Guard: Claude PreToolUse Adapter

---

## 1. OVERVIEW

`claude/` holds the Claude Code adapter for the overlay guard. `.claude/settings.json` registers it on `PreToolUse` under the matcher `Write|Edit|MultiEdit`, with a 10-second timeout. The adapter reads `tool_input.file_path`, resolves it against the session directory and calls `../lib/overlay-guard.cjs`. When the overlay engine says the path is owned, it writes a `permissionDecision: deny` envelope. The reason is the engine's own `refuse:` line, which names the overlay file to edit.

A tree with no overlay manifest allows after two file-existence checks and starts no process. The adapter never applies an overlay, captures an edit or writes a file. A refused call leaves the tree byte-identical, because the adapter writes nothing.

The overlay guard runs on seven other runtimes, each through its own adapter and registration. Codex registers in `.codex/hooks.json`, Cursor in `.cursor/hooks.json` and Devin in `.devin/hooks.v1.json`. Pi loads `.pi/extensions/overlay-guard.ts`, DSH loads `.dsh/plugins/repo-guards/adapters/overlay-guard.mjs` and OpenCode loads `.opencode/plugins/overlay-guard.js`. Vibe registers the hook in `.vibe/hooks.toml` as a `pre_tool` hook.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `overlay-guard.cjs` | The Claude `PreToolUse` adapter. It filters the write tools, judges the named path and writes the deny envelope. |

The adapter approves at once when `isHookEnabled('overlay-guard')` reports the concern off. The switch behind that concern is `SYSTEM_OVERLAY_GUARD_DISABLED` and `SYSTEM_HOOKS_DISABLED` silences it too. The adapter also approves on a payload that is not JSON. It approves when `tool_name` is not `Write`, `Edit` or `MultiEdit`. It approves when the tool input names no path at all.

The session directory is the payload's `cwd`, then `CLAUDE_PROJECT_DIR`, then the working directory. The adapter passes the path and that directory to `evaluateWrite()`. The core's notes go to stderr, one line for each note.

A deny writes one JSON object on stdout and exits 0. The object carries `hookEventName: PreToolUse`, `permissionDecision: deny` and the engine's own reason line. Every other outcome approves with exit 0 and nothing on stdout.

A missing payload, an engine error or an internal bug approves. The engine error and the internal bug each leave one line on stderr.

---

## 3. VALIDATION

Run each of these two commands from the repository root.

```bash
printf '%s' '{"tool_name":"Write","tool_input":{"file_path":"README.md"},"cwd":"."}' | node .skilled/hooks/overlay-guard/claude/overlay-guard.cjs; echo "exit: $?"
```

Expected result: `exit: 0` and no other output, because this checkout has no overlay manifest.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every test passes, including the two that drive this adapter.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core that judges each path this adapter names.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser this adapter uses.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver that answers `isHookEnabled` for every concern.
- [`../lib/overlay-guard.test.cjs`](../lib/overlay-guard.test.cjs): the suite that covers this adapter and the shared core.
