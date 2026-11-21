---
title: "Authorized Ledger"
description: "Default-deny authorization gateway and immutable append-only ledger that ledger-backed runtime/lib domains write verified events through."
---

# Authorized Ledger

---

## 1. OVERVIEW

Fail-closed write substrate for `system-deep-loop` runtime domains. A transition request only reaches the append-only ledger after the authorization gateway independently evaluates it against the ledger head, the authority epoch and a registered policy. Dark-ledger callers such as `DarkLedgerAdapter.recordAfterLegacy()` invoke this authorization after the legacy result is already final and always return that legacy result unchanged, so authorization never compares against or overrides it. The immutable frame store persists each accepted event as an owner-only, single-frame file. The deterministic reducer rebuilds disposable projections by replaying those frames against an exact registered reducer version.

---

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
| `prepared-authorization-matcher.ts` | `matchesPreparedAuthorizationDecision`, true only when an allow decision is bound to the prepared request, the current authority state and both decision digests |
| `transition-authorization-gateway.ts` | `TransitionAuthorizationGateway`, the default-deny boundary between validated envelope bytes and a domain append |
| `transition-policy-registry.ts` | `TransitionPolicyRegistry`, the immutable exact-version registry for deterministic transition policies |

---

## 3. CONSUMERS

Every ledger-backed runtime library domain imports this module to append and replay its own events, including `../blinded-adjudication/`, `../claim-continuity/`, `../contradiction-supersession/`, `../cycle-detection/`, `../dispatch-receipts/`, `../deep-loop/continuity-identity/` and `../locks-and-fencing/` (through `fenced-ledger-writer.ts` and `lock-lifecycle-evidence.ts`).

---

## 4. BOUNDARIES

This folder and `../locks-and-fencing/` import each other:

- `append-only-ledger.ts` imports `resolveFenceCapability` and the `FenceCapability` types from `../locks-and-fencing/fence-capability.ts`, plus `FencedLeaseCoordinator` and `ProtectedResourceKinds` from the same folder.
- `dark-ledger-adapter.ts` imports `appendAuthorizedThroughFence` from `../locks-and-fencing/fenced-ledger-writer.ts`.
- In the other direction, `../locks-and-fencing/fenced-ledger-writer.ts` and `../locks-and-fencing/lock-lifecycle-evidence.ts` import this folder's barrel, and `fenced-ledger-writer.ts` also imports `invokeAppendAuthorized` from `append-only-ledger.ts`.

`fence-capability.ts` stays in `../locks-and-fencing/`. Moving it would re-point every file that imports it on both sides.

These catch blocks drop the caught error today. The error or denial they return carries no cause:

- `transition-authorization-gateway.ts`: the audit read, the decision build and the verified-head read each return a deny with no cause.
- `append-only-ledger.ts`: a throwing authority provider becomes `AUTHORIZATION_STALE` with no cause.

When one of these paths is next changed, carry a bounded cause code in the error `details`. Use the caught error's `code` or `name`. Never copy its raw message or any launch material into `details`, because several of these errors promise never to retain it. Leave the paths alone until then.

---

## 5. TESTS

- `../../tests/unit/authorized-ledger.vitest.ts`
- `../../tests/fixtures/authorized-ledger-fixtures.ts`
- `../../tests/fixtures/authorized-ledger-worker.ts`

---

## 6. RELATED

- [`runtime/lib README`](../README.md)
- [`event-envelope`](../event-envelope/README.md)
- [`locks-and-fencing`](../locks-and-fencing/README.md)
