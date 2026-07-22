---
title: "Locks and Fencing: Single-Host Lease and Fence-Token Primitives"
description: "Grants leases with monotonic fence tokens and gates ledger and state writes behind them to prevent split-brain writers."
---

# Locks and Fencing

---

## 1. OVERVIEW

Runtime primitives that stop two concurrent `system-deep-loop` processes from writing the same resource at once. A lease coordinator issues leases with monotonic fence tokens over canonicalized protected resources, durable writers (ledger append, state store, shadow adapter) refuse a write whose fence token is stale. Every acquire and release is recorded as lock lifecycle evidence so a resumed process can rebuild its fencing state instead of guessing it.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `durable-file.ts` | fsync-then-rename atomic write, append and read-if-exists helpers for single-host-filesystem durability |
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

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/`
- `.opencode/skills/system-deep-loop/runtime/lib/transactional-projections/`
- `.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/`
- `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/`
- `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts`
