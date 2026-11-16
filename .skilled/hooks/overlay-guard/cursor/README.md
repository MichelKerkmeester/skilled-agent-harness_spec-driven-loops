---
title: "Overlay Guard: Cursor preToolUse Adapter"
description: "Cursor adapter that refuses a Write to a file a vendored tree's overlay owns, using Cursor's own permission envelope and exit 2."
trigger_phrases:
  - "cursor overlay guard"
  - "cursor pre tool use deny"
  - "overlay owned file cursor"
version: 1.0.0.0
---

# Overlay Guard: Cursor preToolUse Adapter

---

## 1. OVERVIEW

`cursor/` holds the Cursor adapter for the overlay guard concern. `.cursor/hooks.json` wires it to `preToolUse` under the matcher `Write`, with a 10-second timeout. The registration carries no fallback chain, because Cursor blocks on the exit code.

Cursor answers every call with its own permission envelope rather than a hook output. A refusal is the envelope `{permission: deny, user_message, agent_message}` followed by exit 2. A clean path returns `{permission: allow}` on stdout and exits 0.

The adapter reads the workspace root from `workspace_roots[0]`. When that field is empty it uses its own working directory. The concern key is `overlay-guard`, whose switch is `SYSTEM_OVERLAY_GUARD_DISABLED`. The adapter reads that switch before it reads stdin, so a disabled concern parses no payload.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `overlay-guard.mjs` | The Cursor adapter. It filters on `Write`, reads `tool_input.file_path`, runs `evaluateWrite()` and answers in Cursor's permission envelope. |

The adapter keeps only a `Write` call, so every other tool name exits 0 at once. An unreadable payload or a missing path takes the same allow path.

`evaluateWrite()` returns a decision, a reason and a list of notes. The adapter prints each note of that list on stderr. A `deny` writes the reason into both `user_message` and `agent_message` and exits 2. Every other decision prints `{permission: allow}` on stdout and exits 0.

The adapter fails open on every error path it owns. An engine error or a timeout allows the write and adds one note line. The entrypoint catches any throw from `main` and prints one `overlay-guard:` line on stderr. It then allows the write and exits 0.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every case passes and the command exits 0. The suite covers the core and this adapter. It asserts the deny envelope with exit 2 and the allow envelope with exit 0. It also runs the registered command and checks that the deny arrives intact.

---

## 4. RELATED

- [`../README.md`](../README.md): the overlay guard concern, its decision table and its per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the ESM kill-switch resolver.
