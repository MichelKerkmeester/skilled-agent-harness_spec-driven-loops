---
title: "Blinded Adjudication"
description: "Reviewer-blind adjudication service comparing a baseline judgment with a policy-linked intervention without exposing candidate identity or content."
---

# Blinded Adjudication

---

## 1. OVERVIEW

Additive-dark service for `system-deep-loop` modes that need a counterfactual verdict without leaking who or what was judged. The identity vault separates a candidate's identity from its judgment and the reducer folds every component into one fail-closed verdict. The service layers this over the shared event envelope, authorized-ledger gateway and replay contracts so a verdict is reproducible from the ledger alone.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `blinding.ts` | `CandidateIdentityVault`, a separately controlled candidate identity map with unforgeable read capabilities |
| `contracts.ts` | `AdjudicationError`, the bounded service error that never includes candidate identities or content |
| `event-data.ts` | `requestEventData`, serializing a validated request without changing its field vocabulary |
| `event-registry.ts` | `createAdjudicationEventRegistry`, the immutable validator-bound registry for adjudication evidence |
| `index.ts` | Public API surface |
| `judging.ts` | `evaluateCounterfactual`, comparing one baseline judgment with one policy-linked intervention |
| `mode-adapters.ts` | `createDeepReviewAdjudicationRequest`, binding review validity and severity comparisons to reviewer-blind controls |
| `reducer.ts` | `reduceAdjudication`, deriving a fail-closed verdict while retaining every component evidence identity |
| `replay.ts` | `createAdjudicationReducerRegistry`, exact-version reducers for every registered adjudication event |
| `service.ts` | `BlindedAdjudicationService`, additive-dark orchestration over the shared envelope, gateway, ledger and replay contracts |
| `validation.ts` | Input guards such as `isPlainRecord` shared by the service and reducer |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/provenance-reduction/reducer.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/adjudication.ts` (shared adjudication closure)

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/blinded-adjudication.vitest.ts`

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`authorized-ledger`](../authorized-ledger/README.md)
- [`cross-mode-closures`](../cross-mode-closures/README.md)
