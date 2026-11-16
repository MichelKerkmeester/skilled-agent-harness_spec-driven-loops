---
title: "Overlay Guard: DSH tools/pre-execute Adapter"
description: "DSH adapter that denies a write, edit or apply_patch touching a file a vendored tree's overlay owns, loaded through the repo-guards bundle."
trigger_phrases:
  - "dsh overlay guard"
  - "dsh pre execute deny"
  - "overlay owned file dsh"
version: 1.0.0.0
---

# Overlay Guard: DSH tools/pre-execute Adapter

---

## 1. OVERVIEW

`dsh/` holds the DSH adapter for the overlay guard. DSH loads it through `.dsh/plugins/repo-guards/adapters/overlay-guard.mjs`, a relative link to this file, and the bundle registers it on `tools/pre-execute`. The adapter handles the `write`, `edit` and `apply_patch` tools, reads the session directory from `exec.agent.session.header.cwd`, and returns `{kind: 'deny', reason}` when the overlay engine says a path is owned. Notes from the core go to the plugin logger.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`overlay-guard.mjs`](./overlay-guard.mjs) | `tools/pre-execute` | Resolves the target paths, calls `evaluateWrite()` and returns a deny result with the engine's reason. Exports `registerOverlayGuard` and `ERROR_POLICY = 'fail-open'`. | Fails open. A core throw logs a warning and lets the write continue. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core this adapter calls.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that loads this adapter.
