---
title: "Cursor Overlay Guard: preToolUse Adapter"
description: "Cursor adapter that refuses a Write to a file a vendored tree's overlay owns, using Cursor's own permission envelope and exit 2."
trigger_phrases:
  - "cursor overlay guard"
  - "cursor pre tool use deny"
  - "overlay owned file cursor"
version: 1.0.0.0
---

# Cursor Overlay Guard: preToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/overlay-guard/cursor/` holds the Cursor adapter for the overlay guard concern. It runs before a write and refuses the call when the overlay engine owns the destination file. A file the engine does not own goes through, except under a manifest that sets `strictWrites`, where the engine can refuse an unowned vendored path.

Cursor registers the adapter in `.cursor/hooks.json` under `preToolUse`, with the matcher `Write` and a 10-second timeout. That entry has no fallback chain, so a refusal reaches Cursor as exit 2.

The adapter reads the concern switch before it reads stdin. `SYSTEM_OVERLAY_GUARD_DISABLED` turns this concern off. `SYSTEM_HOOKS_DISABLED` is the master switch, reached through the shared resolver in `.skilled/hooks/shared/hook-flags.mjs`. A disabled concern writes `{"permission":"allow"}` and exits 0 without parsing a payload.

A refusal writes an envelope with `permission: deny` and the engine reason in both message fields, then exits 2. Every other call writes `{"permission":"allow"}` and exits 0.

Every failure ends in an allow. A payload that will not parse allows at once. A tool name other than `Write` allows too. So does a missing path. An engine error or a timeout prints one note line on stderr and then allows. A throw from `main` prints one `overlay-guard:` line on stderr and allows.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `overlay-guard.mjs` | The adapter. It checks the concern switch, keeps `Write` calls, reads `tool_input.file_path`, calls `evaluateWrite()` and answers in Cursor's permission envelope. |

The folder is flat. `overlay-guard.mjs` is the only entry beside this README. Nothing in the folder is a symlink.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every test passes and the run prints `fail 0`. The two cursor cases drive `Write` against an owned path and an unowned path, then run the `.cursor/hooks.json` command and check that the deny envelope arrives with exit 2.

---

## 4. RELATED

- [overlay guard folder](../README.md): the concern, its decision table and its runtime matrix.
- [shared core](../lib/overlay-guard.cjs): the policy this adapter calls for each path.
- [switch resolver](../../shared/hook-flags.mjs): the module that answers the concern switch and the master switch.
- [Cursor hook registration](../../../../.cursor/hooks.json): the entry that runs this adapter at `preToolUse`.
