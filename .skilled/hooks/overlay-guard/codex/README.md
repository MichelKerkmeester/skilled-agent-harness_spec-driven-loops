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

`codex/` holds the Codex CLI adapter for the overlay guard. `.codex/hooks.json` wires it to `PreToolUse` under the matcher `apply_patch|edit`. An `edit` call names one file in a path field. An `apply_patch` call can bundle several files, so the adapter extracts every `*** Add File:`, `*** Update File:`, `*** Delete File:` and `*** Move to:` path and judges each one. One owned path denies the whole call.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`overlay-guard.cjs`](./overlay-guard.cjs) | `PreToolUse` | Reads `apply_patch` and `edit`, resolves paths from a path field or `pathsFromPatch()`, and emits a deny envelope with the engine's reason when any path is owned. Prints the core's notes on stderr. | Fails open. A missing payload, an engine error or an internal bug approves, with one stderr line when a path could not be judged. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core and `pathsFromPatch()` helper.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
