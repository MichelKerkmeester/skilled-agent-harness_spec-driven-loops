---
title: "Result Envelopes"
description: "Records the durable outcome of a dispatched leaf task, including salvage and recovery evidence, as authorized ledger events."
---

# Result Envelopes

---

## 1. OVERVIEW

Records what a dispatched leaf task actually did. A leaf can succeed, fail, time out, get cancelled or finish partial. This domain turns that outcome into typed, authorized ledger events, together with salvage extraction from malformed executor stdout and recovery evidence for effects that need reconciliation. A resume reducer rebuilds the verified result state by replaying the ledger from genesis.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `errors.ts` | Result-envelope error codes and the typed refusal class |
| `event-contracts.ts` | Typed ledger-event contracts for leaf result, salvage and recovery events |
| `identity.ts` | Deterministic id and idempotency-key derivation for result, salvage and recovery events |
| `index.ts` | Public API surface |
| `legacy-shadow.ts` | Shadow projections of the legacy sweep for comparison: result text from raw executor stdout, salvage counts, failure class and retry verdict, the reconstructed state-log registry and per-lineage attribution (label, model, iterations and verdict) |
| `recorder.ts` | Authorized writer that appends leaf result, salvage and recovery events to the ledger |
| `resume-reducer.ts` | Rebuilds verified leaf-result state by replaying the ledger from genesis |
| `types.ts` | Status, provenance, usage and cost accounting and payload type contracts |

---

## 3. CONSUMERS

- `../conditional-fanin/` (decision and reduction)
- `../partial-failure-policy/` (evaluator and ledger events)
- `../provenance-reduction/` (reducer)

---

## 4. TESTS

- `../../tests/unit/result-envelopes.vitest.ts`
- Also exercised by `conditional-fanin.vitest.ts`, `partial-failure-policy.vitest.ts` and `provenance-reduction.vitest.ts`.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../../../SKILL.md`](../../../SKILL.md)
