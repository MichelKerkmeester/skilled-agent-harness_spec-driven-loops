---
title: "Spec Gate Tests: DSH Adapter Suite"
description: "Node test suite for the DSH Gate-3 classifier and enforcement adapters against the shared policy core."
trigger_phrases:
  - "spec gate dsh tests"
  - "dsh adapter parity tests"
  - "spec gate throw policy test"
version: 1.0.0.0
---

# Spec Gate Tests: DSH Adapter Suite

---

## 1. OVERVIEW

`tests/` holds the `node --test` suite for the two DSH Spec Gate adapters. The suite imports `spec-gate-core.mjs` and drives the adapters through the fake plugin context in `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`. It checks core parity, operator-only classification, the delivery record and the two throw policies.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `dsh-spec-gate.test.mjs` | `node --test` suite | Runs `agent/pre-step` and `tools/pre-execute` handlers, compares each result with the shared core, and asserts that classify is `fail-open` and enforce is `fail-closed`. | A failed assertion exits non-zero. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Spec Gate concern, its policy core and its delivery table.
- [`../dsh/spec-gate-classify.mjs`](../dsh/spec-gate-classify.mjs): the classify adapter under test.
- [`../dsh/spec-gate-enforce.mjs`](../dsh/spec-gate-enforce.mjs): the enforce adapter under test.
- [`../../shared/tests/`](../../shared/tests/): the shared test helpers the suite uses.
