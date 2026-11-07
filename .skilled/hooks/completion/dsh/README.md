---
title: "DSH Completion Hook: Turn-Stopping Evidence Adapter"
description: "DeepSeek Harness adapter that checks a stopping turn's completion claim against packet evidence and injects the advisory instead of blocking."
trigger_phrases:
  - "dsh completion evidence"
  - "dsh turn stopping sentinel"
  - "dsh completion claim check"
version: 1.0.0.0
---

# DSH Completion Hook: Turn-Stopping Evidence Adapter

---

## 1. OVERVIEW

`hooks/completion/dsh/` holds the DSH adapter for the completion concern. It exports `registerCompletionEvidence`, which registers one `agent/turn-stopping` handler. The handler reads the stopping turn's assistant message, detects a trailing completion claim, resolves the spec folder from that text and asks the shared core for a verdict.

A verdict of `advise` writes one line to the bounded advisory log and injects a user message with the detail. The module declares `ERROR_POLICY = 'fail-open'`. The `repo-guards` bundle loads the same real file from `system-spec-kit/runtime/hooks/dsh/`, which this folder links to.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `completion-evidence.mjs` | `agent/turn-stopping` | Reads the assistant message for the stopping turn from `agent.session.snapshotEvents()`, checks the kill switch, evaluates the claim with `evaluateCompletionEvidence`, appends the advisory log line and calls `agent.inject` with the advisory notice. | Fails open. A throw is logged through `ctx.logger.warn`, and the turn continues without an injection. |

---

## 3. RELATED

- [`../README.md`](../README.md): the completion concern, the core decision rule and the runtime delivery table.
- [`../tests/dsh-completion-evidence.test.mjs`](../tests/dsh-completion-evidence.test.mjs): the parity and fail-open tests for this adapter.
- [`../../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`](../../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs): the shared core this adapter calls.
