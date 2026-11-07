---
title: "Overlay Guard: Devin PreToolUse Adapter"
description: "Devin CLI adapter that refuses an edit or write to a file a vendored tree's overlay owns, using the same envelope as the Claude adapter."
trigger_phrases:
  - "devin overlay guard"
  - "devin pre write guard"
  - "overlay owned file devin"
version: 1.0.0.0
---

# Overlay Guard: Devin PreToolUse Adapter

---

## 1. OVERVIEW

`devin/` holds the Devin CLI adapter for the overlay guard. `.devin/hooks.v1.json` wires it to `PreToolUse` under the matcher `^(edit|write)$`. The payload shape and deny envelope match the Claude adapter. A whitespace-only `cwd` is treated as absent, and the session directory falls back to `DEVIN_PROJECT_DIR` then `process.cwd()`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`overlay-guard.cjs`](./overlay-guard.cjs) | `PreToolUse` | Filters on `edit` and `write`, reads `tool_input.file_path`, runs `evaluateWrite()` and emits a deny envelope with the engine's reason when the path is owned. Prints the core's notes on stderr. | Fails open. A missing payload, an engine error or an internal bug approves, with one stderr line when the path could not be judged. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
