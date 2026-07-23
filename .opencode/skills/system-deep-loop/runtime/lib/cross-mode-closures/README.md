---
title: "Cross-Mode Closures"
description: "Five shared-implementation closures cataloged for every deep-loop mode to invoke through the same additive-dark contract instead of reimplementing shared mechanics."
---

# Cross-Mode Closures

---

## 1. OVERVIEW

Shared behavior layer scoped to every `system-deep-loop` mode, research, review, ai-council, alignment and the deep-improvement variants, through one additive-dark contract. Each mode gets one immutable context binding its authorized service ports, then invokes the same five closures for evidence, receipts-and-effects, adjudication, budgets and projections rather than rebuilding that mechanics per mode. `catalog.ts` maps every mode ID to its closures, though no mode packet invokes them today outside the domain's own unit test. Every closure keeps the legacy path authoritative and only writes additively through the shared gateway, so a closure failure falls back to preserving the legacy result.

## 2. CLOSURE OWNERS

| Responsibility | File | Owner id |
|---|---|---|
| Evidence | `evidence.ts` | `cross-mode-closures.evidence@1` |
| Receipts and effects | `receipts-effects.ts` | `cross-mode-closures.receipts-effects@1` |
| Adjudication | `adjudication.ts` | `cross-mode-closures.adjudication@1` |
| Budgets | `budgets.ts` | `cross-mode-closures.budgets@1` |
| Projections | `projections.ts` | `cross-mode-closures.projections@1` |

## 3. CONTENTS

| File | Purpose |
|------|---------|
| `adjudication.ts` | `invokeBlindedAdjudication`, invoking the service verdict once and returning its evidence without local reduction |
| `budgets.ts` | `admitTypedBudget`, routing admission and settlement through the typed authority, failing closed |
| `catalog.ts` | `createCrossModeClosureCatalog`, the manifest-complete catalog binding closures to every supported mode id |
| `context.ts` | `createCrossModeClosureContext`, building the single immutable context shared by all five closure owners |
| `deep-improvement-common.ts` | `runDeepImprovementCommon`, the shared pipeline invoked by the deep-improvement mode variants |
| `errors.ts` | `CrossModeClosureError`, the typed closure error codes |
| `evidence.ts` | `normalizeEvidence`, attaching shared proof metadata without interpreting mode-owned evidence |
| `index.ts` | Public API surface |
| `internal.ts` | `bindClosureServicePorts` and `getClosureServicePorts`, binding validated service ports without exposing them on the public context |
| `override-seam.ts` | `defineModeDataPolicyOverride`, registering data or policy selection without exposing a safety-port capability |
| `parity.ts` | `compareAdditiveDark`, comparing shadow closure output against the legacy authoritative result |
| `projections.ts` | `updateProjectionAndGauge`, folding a verified event and committing one deterministic projection under a fence |
| `receipts-effects.ts` | `orderReceiptAndEffects`, appending the authorized fact before delegating effects and receipts to their ports |
| `types.ts` | `ClosureResponsibilities`, `ClosureOwnerIds` and the shared closure context type definitions |

## 4. CONSUMERS

No runtime code currently imports this module. `.opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts` references the closure contract only as a spec-path string, not as a code import.

## 5. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/cross-mode-closures.vitest.ts`

## 6. RELATED

- [`runtime/lib README`](../README.md)
- [`blinded-adjudication`](../blinded-adjudication/README.md)
- [`mode-contracts`](../mode-contracts/README.md)
