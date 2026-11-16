---
title: "Session Lifecycle: DSH Adapter Tests"
description: "node --test suite for the DSH session lifecycle, covering start context and advisories, compaction re-prime, stop autosave and the fail-open policy."
trigger_phrases:
  - "dsh session lifecycle tests"
  - "session lifecycle test"
  - "compaction context test"
version: 1.0.0.0
---

# Session Lifecycle: DSH Adapter Tests

---

## 1. OVERVIEW

`tests/` holds the automated checks for the DSH session lifecycle adapters. The suite drives each registration function with a fake plugin context and stubbed cores, then asserts the injected notices, the leaf gate, the concern switch and the fail-open policy. It runs under `node --test`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`dsh-session-lifecycle.test.mjs`](./dsh-session-lifecycle.test.mjs) | `node --test` suite | Covers the startup advisories and their command lines, the compaction re-prime for a completed compaction only, the stop autosave for an interactive agent only, the start context injection and every fail-open throw path. | Not applicable, the suite asserts behavior. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the per-runtime matrix.
- [`../dsh/session-start-context.mjs`](../dsh/session-start-context.mjs): one adapter under test.
- [`../../shared/tests/`](../../shared/tests/): the shared DSH test helpers.
