---
title: "Devin Overlay Guard: PreToolUse Adapter"
description: "Devin CLI adapter that refuses an edit or write to a file a vendored tree's overlay owns, with the same deny envelope as the Claude adapter."
trigger_phrases:
  - "devin overlay guard"
  - "devin pre write guard"
  - "overlay owned file devin"
version: 1.0.0.0
---

# Devin Overlay Guard: PreToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/overlay-guard/devin/` holds the Devin adapter for the overlay guard. Devin registers it in `.devin/hooks.v1.json` at `PreToolUse`, with the matcher `^(edit|write)$` and a 10 second timeout. That entry runs `node .skilled/hooks/overlay-guard/devin/overlay-guard.cjs` from `${DEVIN_PROJECT_DIR:-$PWD}`.

The adapter checks the `overlay-guard` switch before it reads stdin. With the concern on, it parses the payload and keeps a call only when `tool_name` reads `edit` or `write`, in any case. It takes the path from `tool_input.file_path`, and falls back to `filePath` or `path`. With a path in hand, the adapter calls `evaluateWrite()` in the shared core.

A refusal writes one JSON object to stdout, then exits 0. It carries `hookSpecificOutput` with `hookEventName` set to `PreToolUse` and `permissionDecision` set to `deny`. `permissionDecisionReason` holds the engine's refusal lines. The core's notes go to stderr, one line per note.

The concern switch is `SYSTEM_OVERLAY_GUARD_DISABLED`, and `SYSTEM_HOOKS_DISABLED` is the master switch. Every path out of the adapter approves with exit 0 and no stdout, apart from a refusal. That covers a switch that is off, a payload that is not JSON, a tool that is not a write tool and a call that names no path. An engine error, a timeout or an unreadable setting writes one note line to stderr, then approves. A throw prints one `overlay-guard:` line on stderr, then approves.

Paths resolve against a session directory. The payload `cwd` wins when it holds more than whitespace. A blank or missing `cwd` falls back to `DEVIN_PROJECT_DIR`, then to `process.cwd()`. The core allows at once in a tree with no overlay setting and no overlay folder, so a repository without overlays pays no engine start. The `overlay-guard` entry in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` carries the Devin binding, and `.devin/hooks.v1.json` is rendered from it.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `overlay-guard.cjs` | The adapter. It checks the switch, reads the payload, resolves one path and writes the refusal envelope or approves. |

The folder is flat. `overlay-guard.cjs` is the only entry beside this README. The adapter holds no policy of its own, so the core decides and the adapter passes the answer on.

---

## 3. VALIDATION

Run this command from the repository root. The suite covers the core and five adapters: Claude, Codex, Cursor, Devin and Pi. Its Devin case spawns this file with a payload on stdin.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every test passes, `fail 0`, and the `devin: edit and write map file_path` case drives this adapter.

---

## 4. RELATED

- [The concern README](../README.md): the decision table and the runtime matrix.
- [The shared core](../lib/overlay-guard.cjs): the decision function and the payload helpers.
- [The test suite](../lib/overlay-guard.test.cjs): the core cases and the adapter cases.
- [The switch resolver](../../shared/hook-flags.cjs): the module behind `isHookEnabled`.
- [The Devin registration](../../../../.devin/hooks.v1.json): the `PreToolUse` entry that runs this adapter.
