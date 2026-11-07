---
title: "Overlay Guard: DSH Adapter Tests"
description: "node --test suite for the DSH overlay adapter, covering the deny path, apply_patch path reading, the kill switch, note logging and the fail-open throw policy."
trigger_phrases:
  - "dsh overlay guard tests"
  - "overlay guard test"
  - "apply patch path test"
version: 1.0.0.0
---

# Overlay Guard: DSH Adapter Tests

---

## 1. OVERVIEW

`tests/` holds the automated checks for the DSH overlay adapter. The suite drives `registerOverlayGuard()` with a fake plugin context and a stubbed core, then asserts the handler result and the arguments the core received. It runs under `node --test`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`dsh-overlay-guard.test.mjs`](./dsh-overlay-guard.test.mjs) | `node --test` suite | Asserts a deny for an owned path, that every `*** Add File:` and `*** Update File:` path in an `apply_patch` body is judged, that a non-write tool is ignored, that the kill switch registers nothing, that a core throw fails open with one log line, and that allowed writes log the core's notes. | Not applicable, the suite asserts behavior. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the per-runtime matrix.
- [`../dsh/overlay-guard.mjs`](../dsh/overlay-guard.mjs): the adapter under test.
- [`../lib/overlay-guard.cjs`](../lib/overlay-guard.cjs): the shared core the suite stubs.
