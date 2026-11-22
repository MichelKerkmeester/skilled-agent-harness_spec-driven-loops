---
title: "Conditional Fan-In"
description: "Decides when a fan-out wave has collected sufficient branch results to proceed and plans continuation for the branches left outstanding."
---

# Conditional Fan-In

---

## 1. OVERVIEW

Decision layer for `system-deep-loop` fan-out waves that do not need to wait for every branch. Sufficiency evaluation groups accepted results by provenance and checks them against the configured policy. The decision view builds the accepted-versus-outstanding branch picture at a cut. The disposition and budget-continuation modules resolve what happens to hierarchical budgets tied to the branches that were still running when the cut landed. The shadow adapter runs this candidate decision beside the legacy wait-for-all result without changing it.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `budget-continuation.ts` | Continues or refunds hierarchical budgets tied to branches outstanding at a fan-in cut |
| `decision-event.ts` | Event schema and commit path for a finalized fan-in decision. `validateFanInDecisionFinalizedPayload` checks the payload, `prepareFanInDecisionEvent` builds the event and `commitFanInDecision` refuses a stale cut, authorizes the event through the transition-authorization gateway and appends it through the ledger fence |
| `decision-view.ts` | `buildFanInDecisionView`, building the accepted and outstanding branch view at a cut |
| `decision.ts` | `evaluateAwaitPredicate` and `finalizeFanInDecisionCandidate`, evaluating and finalizing the fan-in decision |
| `disposition.ts` | `planOutstandingDispositions`, planning what happens to branches still outstanding at a cut |
| `index.ts` | Public API surface |
| `policy.ts` | `validateConditionalFanInPolicy`, validating the policy that controls how many results are sufficient |
| `reduction.ts` | `bindReductionToDecision`, binding an ordered leaf-result reduction to one finalized decision |
| `shadow-adapter.ts` | `evaluateConditionalFanInShadow`, dark evaluation alongside the legacy wait-for-all authoritative result |
| `sufficiency.ts` | `evaluateSufficiency`, grouping accepted results by provenance and evaluating sufficiency evidence |
| `types.ts` | Shared policy, decision and disposition type definitions |

---

## 3. CONSUMERS

Non-test modules that import this folder:

- `../mode-contracts/substrate-ports.ts`
- `../partial-failure-policy/types.ts`
- `../provenance-reduction/reducer.ts`
- `../provenance-reduction/types.ts`
- `../voc-allocation/allocation.ts`
- `../voc-allocation/assessment.ts`
- `../voc-allocation/fan-in-handoff.ts`
- `../voc-allocation/types.ts`

---

## 4. TESTS

- `../../tests/unit/conditional-fanin.vitest.ts`

---

## 5. RELATED

- [`runtime/lib README`](../README.md)
