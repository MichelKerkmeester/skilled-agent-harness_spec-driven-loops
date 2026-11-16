---
title: "Overlay Guard: Codex PreToolUse Adapter"
description: "Codex CLI adapter that refuses an apply_patch or edit touching a file a vendored tree's overlay owns, checking every file header in a patch body."
trigger_phrases:
  - "codex overlay guard"
  - "apply patch overlay deny"
  - "codex pre write guard"
version: 1.0.0.0
---

# Overlay Guard: Codex PreToolUse Adapter

---

## 1. OVERVIEW

`codex/` holds the Codex CLI adapter for the overlay guard. `.codex/hooks.json` registers it under `PreToolUse` with the matcher `apply_patch|edit` and a 10-second timeout. The hook registry binds this adapter to Codex alone.

An `edit` call names one file in a path field. The adapter reads `file_path`, `filePath` or `path`. An `apply_patch` call names its files in the patch body, so the adapter reads every `*** Add File:`, `*** Update File:`, `*** Delete File:` and `*** Move to:` line. It judges each path and denies the whole call when one path is owned.

A denial is one JSON object on stdout. It carries `hookSpecificOutput` with `hookEventName` set to `PreToolUse`, `permissionDecision` set to `deny` and `permissionDecisionReason` set to the engine's `refuse:` lines, one for each owned path. The process then exits 0. The core's notes go to stderr.

The adapter approves with no output and exit 0 when any of these holds:

- The `overlay-guard` concern is off.
- The payload is not JSON.
- The tool is not a write tool.
- The call names no path.

An internal error prints one `overlay-guard:` line on stderr and approves too. Paths resolve against the session directory, taken from `cwd`, then `CODEX_PROJECT_DIR`, then the process directory.

The core allows at once in a tree with no overlay manifest. A repository without overlays therefore pays no process start.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `overlay-guard.cjs` | Reads the payload, maps the call to paths, asks the core and prints the deny envelope or approves. |

The adapter holds no policy of its own. `evaluateWrite` in the core decides, and the adapter passes that answer on. The core asks the overlay engine's `--guard` query once per path. The engine stays the only reader of the overlay setting and the manifest.

---

## 3. VALIDATION

Run from the repository root. The suite covers the core and its adapters, including the codex patch-header case.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

The suite exits 0 when every case passes. A failure names the case that broke.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README, with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core, with `evaluateWrite`, `fileFieldPath` and `pathsFromPatch()`.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind `isHookEnabled`.
- [`../../../../.codex/hooks.json`](../../../../.codex/hooks.json): the registration that runs this adapter.
