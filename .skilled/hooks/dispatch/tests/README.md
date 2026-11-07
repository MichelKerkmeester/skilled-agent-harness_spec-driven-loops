---
title: "Dispatch Tests: DSH Adapter Parity and Policy Suite"
description: "node --test suite that checks both DeepSeek Harness dispatch adapters against the shared cores and asserts their opposite error policies."
trigger_phrases:
  - "dsh dispatch tests"
  - "dispatch adapter parity tests"
  - "dispatch fail-closed tests"
version: 1.0.0.0
---

# Dispatch Tests: DSH Adapter Parity and Policy Suite

---

## 1. OVERVIEW

`hooks/dispatch/tests/` holds the cross-cutting test suite for the DSH dispatch adapters. The suite imports the real rule engine, the real audit core and both adapters, then drives them through the shared DSH test helpers.

The suite also proves that the preflight reads this checkout's hard rules when the session runs outside the checkout, which is the normal case for a DSH lineage folder.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dsh-dispatch.test.mjs` | `node --test` suite | Checks audit parity on a non-dispatch command, preflight parity when there are no violations, the outside-checkout rule lookup, audit fail-open with one logged warning, and preflight fail-closed with no delegation to `next()`. | Not applicable. The test helpers record log lines and whether `next()` ran. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../dsh/dispatch-preflight-lint.mjs`](../dsh/dispatch-preflight-lint.mjs): the fail-closed adapter under test.
- [`../dsh/dispatch-audit.mjs`](../dsh/dispatch-audit.mjs): the fail-open adapter under test.
- [`../../README.md`](../../README.md): the unified hooks tree this concern lives in.
