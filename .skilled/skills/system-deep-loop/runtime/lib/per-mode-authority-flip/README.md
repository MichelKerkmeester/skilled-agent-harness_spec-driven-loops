---
title: "per-mode-authority-flip: Mode Authority Records and Route Selection"
description: "Durable mode-keyed authority records with a lock-guarded compare-and-swap store, plus a pure selector that resolves one canonical writer route per mode."
trigger_phrases:
  - "per-mode authority flip"
  - "authority registry"
  - "authority selector"
  - "mode authority record"
---

# per-mode-authority-flip: Mode Authority Records and Route Selection

---

## 1. OVERVIEW

`per-mode-authority-flip/` owns one durable authority record per canonical mode and the route decision a mode adapter would consult at its persistence boundary. A record binds a mode to an authority state, an epoch, a selected writer, a policy version, a candidate digest and a record digest.

Every helper here is pure or file-scoped, and no mode adapter is wired to the folder. A mode the registry has never written reads back as the default of `legacy_authoritative` at epoch 1 with selected writer `legacy`.

Current state:

- Route selection is a pure function over an already-read record, so its contract holds while adapter wiring stays open.
- Transitions are serialized across one registry root by a single lock file, and a lock left by a dead process or aged past the stale TTL is reclaimed rather than blocking later transactions.
- The exact compare-and-swap input is written to disk before any ledger append, so a crash between the append and the publish can be completed or aborted from disk alone.
- A malformed record, an unknown mode, a wrong-mode binding, a policy drift or a stale record digest denies rather than silently picking a writer.

---

## 2. FILES

The folder is flat, so every direct file is listed here.

| File | Responsibility |
|---|---|
| `types.ts` | Mode union, route union, denial reason codes, `AuthorityFlipError`, record and selector interfaces, the authority state set and the frozen mode order |
| `authority-registry.ts` | `AuthorityRegistry`, the file-scoped, lock-guarded, mode-keyed store over `authority-<mode>.json` and its prepared-transition markers |
| `authority-selector.ts` | `selectAuthorityRoute` and `isValidAuthorityRecord`, the pure integrity check and route resolution |
| `index.ts` | Public re-exports for the folder |

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `../event-envelope/index.js` for canonical bytes and hashing, `../locks-and-fencing/durable-file.js` for atomic writes, `../authorized-ledger/index.js` for the authority state type |
| Exports | Only the names re-exported from `index.ts` |
| Ownership | Durable per-mode authority records and the route decision belong here. Ledger appends, cutover policy and mode adapters belong elsewhere |

Read and select:

```text
caller holds an already-read authority record
                  │
                  ▼
┌──────────────────────────────────────────┐
│ selectAuthorityRoute(record, expectation)│
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ recompute the record digest and verify   │
│ mode, policy version and digest match    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ selected route, shadow route, admission  │
│ flag, state and epoch, or a denied       │
│ reason code                              │
└──────────────────────────────────────────┘
```

Record a transition:

```text
read(mode)                 returns the durable record or the default
       │
       ▼
withTransactionLock        serializes the attempt across the root
       │
       ▼
preparePendingTransition   writes the exact input to
       │                   authority-flip-prepare-<mode>.json
       ▼
caller appends the ledger event, then publishes the record
       │
       ▼
clearPendingTransition     removes the prepared marker
```

State to route mapping used by the selector:

| Record state | Canonical route | Shadow route |
|---|---|---|
| `legacy_authoritative` | `legacy` | none |
| `shadowing` | `legacy` | `dark` |
| `cutover_ready` | `legacy` | `dark` |
| `new_authoritative_reversible` | `dark` | `legacy` |
| `new_authoritative_final` | `dark` | none |
| `rollback_pending` | denied with `ACTIVE_TRANSACTION_CONFLICT` | none |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `AuthorityRegistry` | Class | Construct over a root directory, an optional clock and an optional stale lock TTL |
| `AuthorityRegistry.read(mode)` | Method | Return the durable record, or the default legacy record when none was ever written |
| `AuthorityRegistry.withTransactionLock(operation)` | Method | Serialize one transition across the registry root and release the lock even when the operation throws |
| `AuthorityRegistry.preparePendingTransition(input, preparedAt)` | Method | Persist the exact compare-and-swap input before the ledger append |
| `AuthorityRegistry.readPendingTransition(mode)` | Method | Read a leftover prepared transition, or `null` when none is outstanding |
| `AuthorityRegistry.clearPendingTransition(mode)` | Method | Clear the prepared marker once the transition is completed or aborted |
| `isValidAuthorityRecord(value)` | Function | Recompute the record digest and confirm the record's own binding |
| `selectAuthorityRoute(record, expectation)` | Function | Resolve one route, shadow route, admission flag, state and epoch, or deny with a reason code |
| `AuthorityFlipError` | Class | Fail-closed error carrying a reason code and scalar details, never a raw state payload |

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../authorized-ledger/README.md`](../authorized-ledger/README.md)
- [`../event-envelope/README.md`](../event-envelope/README.md)
