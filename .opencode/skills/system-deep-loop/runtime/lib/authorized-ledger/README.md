---
title: "Authorized Ledger"
description: "Default-deny authorization gateway and immutable append-only ledger that ledger-backed runtime/lib domains write verified events through."
---

# Authorized Ledger

---

## 1. OVERVIEW

Fail-closed write substrate for `system-deep-loop` runtime domains. A transition request only reaches the append-only ledger after the authorization gateway independently evaluates it against the ledger head, the authority epoch and a registered policy. Dark-ledger callers such as `DarkLedgerAdapter.recordAfterLegacy()` invoke this authorization after the legacy result is already final and always return that legacy result unchanged, so authorization never compares against or overrides it. The immutable frame store persists each accepted event as an owner-only, single-frame file. The deterministic reducer rebuilds disposable projections by replaying those frames against an exact registered reducer version.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `append-only-ledger.ts` | `AppendOnlyLedger`, the typed immutable writer with no proof-free domain append operation |
| `authorization-decision-event.ts` | Schema-closed event registry for gateway authorization decisions |
| `authorization-replay.ts` | `verifyAuthorizationReplay`, replays stored audit records against the policy registry to confirm every decision reproduces |
| `authorized-ledger-errors.ts` | `AuthorizedLedgerError`, the typed fail-closed error shared by the ledger, gateway and replay boundary |
| `authorized-ledger-types.ts` | Shared ledger, gateway and policy type definitions, including `LedgerHead` |
| `dark-ledger-adapter.ts` | `DarkLedgerAdapter`, runs typed authorization and append only after the legacy result is already final |
| `deterministic-reducer.ts` | `TypedReducerRegistry`, the exact event-type and reducer-version registry used to rebuild disposable projections |
| `immutable-frame-store.ts` | `ImmutableFrameStore`, the exclusive owner-only filesystem store for immutable single-frame files |
| `index.ts` | Public API surface |
| `transition-authorization-gateway.ts` | `TransitionAuthorizationGateway`, the default-deny boundary between validated envelope bytes and a domain append |
| `transition-policy-registry.ts` | `TransitionPolicyRegistry`, the immutable exact-version registry for deterministic transition policies |

## 3. CONSUMERS

Every ledger-backed `runtime/lib/` domain imports this module to append and replay its own events, including `blinded-adjudication`, `branch-leases-waves`, `claim-continuity`, `contradiction-supersession`, `cycle-detection`, `dispatch-receipts`, `deep-loop/continuity-identity` and `locks-and-fencing/protected-resource-registry.ts`.

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/fixtures/authorized-ledger-fixtures.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/fixtures/authorized-ledger-worker.ts`

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`event-envelope`](../event-envelope/README.md)
