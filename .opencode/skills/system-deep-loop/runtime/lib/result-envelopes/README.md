---
title: "Result Envelopes"
description: "Records the durable outcome of a dispatched leaf task, including salvage and recovery evidence, as authorized ledger events."
---

# Result Envelopes

---

## 1. OVERVIEW

Records what a dispatched leaf task actually did. A leaf can succeed, fail, time out, get cancelled or finish partial. This domain turns that outcome into typed, authorized ledger events, together with salvage extraction from malformed executor stdout and recovery evidence for effects that need reconciliation. A resume reducer rebuilds the verified result state by replaying the ledger from genesis.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `errors.ts` | Result-envelope error codes and the typed refusal class |
| `event-contracts.ts` | Typed ledger-event contracts for leaf result, salvage and recovery events |
| `identity.ts` | Deterministic id and idempotency-key derivation for result, salvage and recovery events |
| `index.ts` | Public API surface |
| `legacy-shadow.ts` | Extracts result text from raw executor stdout for shadow comparison against the legacy parser |
| `recorder.ts` | Authorized writer that appends leaf result, salvage and recovery events to the ledger |
| `resume-reducer.ts` | Rebuilds verified leaf-result state by replaying the ledger from genesis |
| `types.ts` | Status, provenance, usage and cost accounting and payload type contracts |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/conditional-fanin/` (decision and reduction)
- `.opencode/skills/system-deep-loop/runtime/lib/partial-failure-policy/` (evaluator and ledger events)
- `.opencode/skills/system-deep-loop/runtime/lib/provenance-reduction/` (reducer)

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/result-envelopes.vitest.ts`
- Also exercised by `conditional-fanin.vitest.ts`, `partial-failure-policy.vitest.ts` and `provenance-reduction.vitest.ts`.

## 5. RELATED

- [`runtime/lib/README.md`](../README.md)
- [`system-deep-loop/SKILL.md`](../../../SKILL.md)
