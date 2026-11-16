---
title: "Decision Capture Tests: DSH Adapter Suite"
description: "node --test suite that covers live and late-reply answer capture, the idle reminder and the fail-open policy of the DSH decision capture adapter."
trigger_phrases:
  - "dsh decision capture tests"
  - "decision capture parity tests"
  - "dsh answer queue tests"
version: 1.0.0.0
---

# Decision Capture Tests: DSH Adapter Suite

---

## 1. OVERVIEW

`hooks/decision-capture/tests/` holds the cross-cutting test suite for the DSH decision capture adapter. The suite imports the adapter and the DSH sweep's record mapper, builds a plugin context with the shared DSH test helpers, and fires the events the adapter registers.

This folder holds no runtime adapter. The live adapters and their suites sit beside them.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dsh-decision-capture.test.mjs` | `node --test` suite | Covers an answered question queued under the key a sweep would use, an answer read from the result text, skipped failed or pending calls, a late reply from the session feed, the idle reminder and the fail-open throw policy. The kill-switch case checks that no handler registers. | Not applicable. The test helpers record queued records, injected notices and log lines. |

---

## 3. RELATED

- [`../`](../): the decision capture concern folder.
- [`../dsh/decision-capture.mjs`](../dsh/decision-capture.mjs): the adapter under test.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the queue core the adapter calls.
- [`../../README.md`](../../README.md): the unified hooks tree this concern lives in.
