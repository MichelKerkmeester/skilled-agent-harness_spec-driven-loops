---
title: "Injection Screen Tests: DSH Adapter Parity Suite"
description: "node --test suite that checks the DeepSeek Harness injection screen adapter against the shared core and asserts its fail-open throw policy."
trigger_phrases:
  - "dsh injection screen tests"
  - "injection screen parity tests"
  - "dsh adapter fail-open tests"
version: 1.0.0.0
---

# Injection Screen Tests: DSH Adapter Parity Suite

---

## 1. OVERVIEW

`hooks/classifier-injection-screen/tests/` holds the cross-cutting test suite for the DSH adapter. The suite imports the real shared core and the adapter, then drives the adapter through the shared DSH plugin test helpers. It confirms that the adapter and the shared library agree, and that the adapter's declared error policy holds.

This folder holds no runtime adapter. The per-runtime suites live beside their adapters.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dsh-classifier-injection-screen.test.mjs` | `node --test` suite | Runs two cases. The parity case checks that a fetched result with no text to screen stays accepted with no advisory. The throw case checks that `ERROR_POLICY` is `fail-open` and that a throwing core still returns the accepted result with one logged warning. | Not applicable. The test rig records injected notices and log lines for the assertions. |

---

## 3. RELATED

- [`../README.md`](../README.md): the injection screen concern, its decision rule and its switches.
- [`../dsh/classifier-injection-screen.mjs`](../dsh/classifier-injection-screen.mjs): the adapter under test.
- [`../lib/classifier-injection-advisory.mjs`](../lib/classifier-injection-advisory.mjs): the shared core the parity case compares against.
- [`../../shared/tests/`](../../shared/tests/): the shared DSH plugin test helpers that build the plugin context and handlers.
