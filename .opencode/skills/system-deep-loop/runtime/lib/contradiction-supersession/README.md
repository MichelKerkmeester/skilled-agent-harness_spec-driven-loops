---
title: "Contradiction Supersession"
description: "Isolated shadow ledger recording contradiction and supersession relationships between claims, with an audited, replay-verified status projection."
---

# Contradiction Supersession

---

## 1. OVERVIEW

Additive-dark ledger that tracks how two claims relate, either contradicting each other or one superseding the other, on top of the shared authorized-ledger and event-envelope substrate. The event registry canonicalizes a relationship into an order-independent pair before it can enter the ledger. The projection folds those records into a disposable status view. The replay component rebuilds that view from one immutable reference snapshot for verification.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `audit.ts` | `claimRelationshipAuditAsJson`, narrowing an audit report to canonical JSON for external evidence stores |
| `errors.ts` | `ClaimRelationshipError`, the stable fail-closed error for candidate, append, fold and replay boundaries |
| `event-registry.ts` | `canonicalContradictionPair` and `createClaimRelationshipEventRegistry`, the canonical pair ordering and the closed event registry for contradiction and supersession records |
| `index.ts` | Public API surface |
| `projection.ts` | `createEmptyClaimRelationshipProjection`, the empty disposable status projection |
| `replay.ts` | `createClaimRelationshipReducerRegistry`, binding the status fold to one immutable reference snapshot |
| `service.ts` | `ContradictionSupersessionService`, the isolated shadow ledger for authorized contradiction and supersession history |
| `types.ts` | Shared relationship type definitions |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/path-coverage-termination/types.ts`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/contradiction-supersession.vitest.ts`

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`authorized-ledger`](../authorized-ledger/README.md)
