---
title: "Locks and Fencing: Single-Host Lease and Fence-Token Primitives"
description: "Grants leases with monotonic fence tokens and gates ledger and state writes behind them to prevent split-brain writers."
---

# Locks and Fencing

---

## 1. OVERVIEW

Runtime primitives that stop two concurrent `system-deep-loop` processes from writing the same resource at once. A lease coordinator issues leases with monotonic fence tokens over canonicalized protected resources. Durable writers (ledger append, state store, shadow adapter) refuse a write whose fence token is stale. The coordinator keeps its lifecycle decisions (acquired, renewed, released, expired and others) in a bounded in-memory log that `readTelemetry()` returns. A caller can promote a decision to authorized ledger evidence through `recordLockLifecycleEvidence`, and replay folds that evidence into action counts plus the latest fence token per resource.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `durable-file.ts` | fsync-then-rename atomic write, append and read-if-exists helpers for single-host-filesystem durability |
| `fence-capability.ts` | `FenceCapability`, `mintFenceCapability` and `resolveFenceCapability`: an opaque process-local claim to a resource and fence token that a validator must re-check against coordinator state |
| `fenced-lease-coordinator.ts` | `FencedLeaseCoordinator`: acquires and renews leases with monotonic fence tokens over protected resources |
| `fenced-ledger-writer.ts` | `FencedLedgerWriter`: guards an append-only ledger write behind a held lease and gateway proof |
| `fenced-shadow-adapter.ts` | `FencedShadowAdapter`: serializes legacy authority and dark observation under one fencing epoch |
| `fenced-state-store.ts` | `FencedStateStore`: lease-gated durable read and replace of canonicalized JSON state for a protected resource |
| `lock-lifecycle-evidence.ts` | Records and replays lock acquire and release events as ledger evidence |
| `locks-and-fencing-errors.ts` | Stable error codes (stale fence, lease lost, lock order violation, version conflict) |
| `locks-and-fencing-types.ts` | Atomicity-domain and protected-resource-kind vocabularies plus lease, fence and mutation contracts |
| `protected-resource-registry.ts` | Canonicalizes protected resource identities into a manifest-digested schema per resource kind |
| `replay-identity.ts` | Derives an opaque resume identity from a verified or freshly derived replay fingerprint |
| `index.ts` | Public API barrel |

---

## 3. CONSUMERS

Many runtime library domains import this module. Consumers include:

- `../authorized-ledger/`
- `../transactional-projections/`
- `../legacy-projections/shadow-projection-store.ts`
- `../receipts-and-effect-recovery/`
- `../mode-contracts/`

This folder and `../authorized-ledger/` import each other. `fenced-ledger-writer.ts` and `lock-lifecycle-evidence.ts` import the `../authorized-ledger/` barrel, and `fenced-ledger-writer.ts` also imports `invokeAppendAuthorized` from `../authorized-ledger/append-only-ledger.ts`. In the other direction, `../authorized-ledger/append-only-ledger.ts` imports `fence-capability.ts`, `fenced-lease-coordinator.ts` and `locks-and-fencing-types.ts`, and `../authorized-ledger/dark-ledger-adapter.ts` imports `fenced-ledger-writer.ts`. `fence-capability.ts` stays here. Moving it would re-point every file that imports it on both sides.

---

## 4. TESTS

- `../../tests/unit/locks-and-fencing.vitest.ts`

---

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`authorized-ledger`](../authorized-ledger/README.md)
