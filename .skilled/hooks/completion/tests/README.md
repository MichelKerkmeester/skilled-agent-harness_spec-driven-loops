---
title: "Completion Tests: DSH Adapter Parity Suite"
description: "node --test suite that checks the DeepSeek Harness completion-evidence adapter against the shared core and asserts its fail-open throw policy."
trigger_phrases:
  - "dsh completion tests"
  - "completion evidence parity tests"
  - "dsh completion fail-open tests"
version: 1.0.0.0
---

# Completion Tests: DSH Adapter Parity Suite

---

## 1. OVERVIEW

`hooks/completion/tests/` holds the cross-cutting test suite for the DSH completion adapter. The suite imports the real shared core and the adapter, builds a plugin context with the common DSH test helpers, and drives the `agent/turn-stopping` handler.

This folder holds no runtime adapter. The per-runtime suites live with their owning skills.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dsh-completion-evidence.test.mjs` | `node --test` suite | Runs two cases. The parity case checks that a message with no completion claim injects nothing. The throw case checks that `ERROR_POLICY` is `fail-open` and that a throwing core logs one warning and injects nothing. | Not applicable. The test rig records injected notices and log lines for the assertions. |

---

## 3. RELATED

- [`../README.md`](../README.md): the completion concern, the core decision rule and the runtime delivery table.
- [`../dsh/completion-evidence.mjs`](../dsh/completion-evidence.mjs): the adapter under test.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`](../../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs): the shared core the parity case compares against.
