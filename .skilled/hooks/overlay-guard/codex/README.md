---
title: "Codex Overlay Guard: PreToolUse Adapter"
description: "Codex CLI adapter that refuses an apply_patch or edit touching a file a vendored tree's overlay owns, checking every file header in a patch body."
trigger_phrases:
  - "codex overlay guard"
  - "apply patch overlay deny"
  - "codex pre write guard"
version: 1.0.0.0
---

# Codex Overlay Guard: PreToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/overlay-guard/codex/` holds the Codex adapter for the overlay guard. It runs at `PreToolUse` and refuses an `apply_patch` or `edit` call when the overlay engine refuses a file the call would touch. An allowed call prints nothing.

Codex registers the adapter in `.codex/hooks.json` under the `"PreToolUse"` event, with the matcher `"apply_patch|edit"` and a 10-second timeout. The command runs `node .skilled/hooks/overlay-guard/codex/overlay-guard.cjs`, with a `||` fallback that prints one `mk-hook-drift` line on stderr and an `additionalContext` message when node cannot start the adapter.

The adapter checks the concern switch first, through `isHookEnabled('overlay-guard')`. When the concern is off it exits at once. Otherwise it reads the payload from stdin. An `edit` call names one file in `file_path`. The core also tries `filePath` and `path`. An `apply_patch` call names its files in the patch body. The adapter reads the path from each `*** Add File:` header, each `*** Update File:` header, each `*** Delete File:` header and each `*** Move to:` target.

The adapter holds no policy of its own. `evaluateWrite` in `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` asks the overlay engine's `--guard` query once for each unique path and returns a decision of `allow` or `deny`. The adapter passes that answer on. A tree with no overlay manifest allows at once, so a repository without overlays starts no engine process.

A denial is one JSON object on stdout. The object holds a `hookSpecificOutput` block for `PreToolUse`, with `permissionDecision` set to `deny` and the reason set to the engine's `refuse:` lines, one for each path the engine rejected. Notes from the core go to stderr.

Paths resolve against the session directory. The adapter takes it from `cwd` when the payload carries one. Without that field it uses `CODEX_PROJECT_DIR`, then the process working directory. A payload that is not JSON approves at once with no output. A tool name outside `apply_patch` and `edit` approves the same way. A call that names no path approves too. An internal error writes one `overlay-guard:` line on stderr and then approves. The process exits 0 in every case.

The concern key is `overlay-guard`. Its switch is `SYSTEM_OVERLAY_GUARD_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch. Both reach this adapter through the shared resolver in `.skilled/hooks/shared/hook-flags.cjs`.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `overlay-guard.cjs` | The adapter. It checks the switch, reads the payload, maps the call to paths, asks the core and writes the deny envelope. |

The folder is flat, so the table lists every entry other than this README.

---

## 3. VALIDATION

The suite in [the core test file](../lib/overlay-guard.test.cjs) copies this hook folder into a fixture tree and runs the Codex case against the copy. That case replays the patch bodies and an `edit` call, all naming an owned file. It then sends a patch for a free file and expects no output.

Run the command from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every test passes and the command exits 0. The summary line reads `fail 0`.

---

## 4. RELATED

- [The concern README](../README.md): the decision table and the per-runtime matrix.
- [The shared core](../lib/overlay-guard.cjs): the policy that judges each path this adapter names.
- [The stdin helpers](../../shared/hook-adapter-shared.cjs): the fail-open payload read.
- [The switch resolver](../../shared/hook-flags.cjs): the `isHookEnabled` function behind the concern switch.
- [The Codex registration](../../../../.codex/hooks.json): the file that runs this adapter at `PreToolUse`.
