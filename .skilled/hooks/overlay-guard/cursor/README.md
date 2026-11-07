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

`cursor/` holds the Cursor adapter for the overlay guard. `.cursor/hooks.json` wires it to `preToolUse` under the matcher `Write`. Cursor answers every call with its own permission envelope, so a refusal is `{permission: deny, user_message, agent_message}` followed by exit 2. A clean path returns `{permission: allow}`. The workspace root comes from `workspace_roots[0]`, and the adapter registers no fallback chain because Cursor blocks on the exit code.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`overlay-guard.mjs`](./overlay-guard.mjs) | `preToolUse` | Filters on `Write`, reads `tool_input.file_path`, runs `evaluateWrite()` and emits the Cursor deny envelope plus exit 2 when the path is owned. Prints the core's notes on stderr. | Fails open. A missing payload, an engine error or an internal bug returns `{permission: allow}`. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the ESM kill-switch resolver.
