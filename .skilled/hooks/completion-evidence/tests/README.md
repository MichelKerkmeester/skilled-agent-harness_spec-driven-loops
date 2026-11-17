---
title: "Completion Tests: DSH Adapter Parity Suite"
description: "node --test suite that drives the DSH completion-evidence adapter through the shared core and checks its fail-open throw path."
trigger_phrases:
  - "dsh completion tests"
  - "completion evidence parity tests"
  - "dsh completion fail-open tests"
version: 1.0.0.0
---

# Completion Tests: DSH Adapter Parity Suite

---

## 1. OVERVIEW

`.skilled/hooks/completion-evidence/tests/` holds the test suite for the DSH completion-evidence adapter. The folder carries no adapter of its own. The adapter sits in `../dsh/`. The decision rule it calls sits in the shared core.

A case registers the adapter on a fake DSH context. It then fires `agent/turn-stopping`. Then it reads what the handler injected and logged. No runtime starts.

The suite covers two behaviors. The parity case confirms the adapter follows the core when the core reads no completion claim. The throw case confirms a failing core cannot break the turn.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-completion-evidence.test.mjs` | The `node --test` suite for the DSH adapter. It drives the stop handler and asserts both paths. |

The file imports the real core and the real adapter. It imports the shared test helpers from `../../shared/tests/dsh-plugin-harness.mjs`.

The parity case builds a turn 2 snapshot whose last assistant message is `I will continue checking the work.` It first checks that the core reads no claim in that text. The handler then runs and the suite asserts no injection.

The throw case asserts `ERROR_POLICY` is `fail-open`. It gives the adapter a core whose `detectCompletionClaim()` throws. It fires the same event with an empty event list. The adapter catches the throw, so the suite asserts no injection and one logged warning. The adapter writes that line through `ctx.logger.warn`. The fake context records it.

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The real adapter and core modules, not a stub. The shared test helpers supply the fake context. |
| Test doubles | `adapterHarness()` keeps one handler per event and records every log line. `enabled` answers the switch check with true. |
| Ownership | The suite owns no runtime entry and no production code. The adapter and the core live outside this folder. |

A case follows one path.

```text
╭──────────────────────────────────────────╮
│ node --test                              │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ adapterHarness()                         │
│ fake context and recorded log lines      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ registerCompletionEvidence               │
│ real core, or a core that throws         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ handlers.get('agent/turn-stopping')      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ claimTextFromSession                     │
│ then detectCompletionClaim               │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ nothing injected                         │
│ plus one warning on the throw path       │
╰──────────────────────────────────────────╯
```

---

## 4. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/completion-evidence/tests/dsh-completion-evidence.test.mjs
```

Expected result: `pass 2` and `fail 0`, with exit status 0.

The suite needs only Node. It reads no fixture file and starts no runtime.

---

## 5. RELATED

- [The completion concern](../README.md) covers the adapter and its switches.
- [The adapter under test](../dsh/completion-evidence.mjs) registers the stop handler and builds the notice.
- [The shared completion core](../../../skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs) holds the claim check and the evidence decision.
- [The shared DSH test helpers](../../shared/tests/README.md) document the fake context and the recorded log lines.
