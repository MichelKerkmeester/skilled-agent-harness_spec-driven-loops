---
title: "Branch Leases and Waves"
description: "Durable fan-out admission, fenced branch ownership and immutable wave compilation for parallel branch execution."
---

# Branch Leases and Waves

---

## 1. OVERVIEW

Fan-out primitives for `system-deep-loop` modes that run parallel branches. The logical branch registry normalizes branch coordinates into a stable id and the wave plan compiles those branches into immutable sequential waves. The durable orchestrator wraps a capped worker pool with fenced lease admission so a branch can only run once per authority epoch. The ledger fold rebuilds the branch and lease projection from the same authorized-ledger events the orchestrator appends.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `durable-orchestrator.ts` | `DurableBranchOrchestrator` and `canonicalBranchLeaseResource`, adding durable admission and fenced ownership around the capped pool |
| `errors.ts` | `BranchOrchestrationError`, the typed fail-closed error for durable fan-out admission and ownership |
| `event-contract.ts` | `validateBranchOrchestrationRecord`, validating the closed discriminated payload carried by the canonical event type |
| `index.ts` | Public API surface |
| `ledger-fold.ts` | Deterministic reducer that folds ledger events into the branch, lease and wave projection |
| `logical-branch-registry.ts` | `normalizeLogicalBranchCoordinates` and logical branch id derivation |
| `types.ts` | Shared branch, lease and wave type definitions |
| `wave-plan.ts` | `compileImmutableWavePlan`, compiling immutable sequential waves from canonical branch order |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/substrate-ports.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/conditional-fanin/types.ts`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/branch-leases-waves.vitest.ts`

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`authorized-ledger`](../authorized-ledger/README.md)
- [`conditional-fanin`](../conditional-fanin/README.md)
