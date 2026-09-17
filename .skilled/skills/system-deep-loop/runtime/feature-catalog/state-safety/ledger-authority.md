---
title: "Ledger authority"
description: "AuthorityRegistry is the sole production writer of per-mode authority records; every canonical append is authorized against the mode's durable record."
trigger_phrases:
  - "ledger authority"
  - "ledger-authority"
  - "ledger authority runtime"
  - "state safety ledger authority"
version: 1.4.0.15
---

# Ledger authority

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`AuthorityRegistry` is the sole production writer of per-mode authority records, one JSON file per mode under its root. Every canonical append is authorized against the mode's record.

This feature belongs to the state safety group and is catalogued as F054 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

`AUTHORITY_FLIP_MODE_ORDER` freezes the mode order. A mode outside it is refused: the gateway CLI exits 2 with `AUTHORITY_DENIED` and writes nothing. The record states the type admits are `legacy_authoritative`, `shadowing`, `cutover_ready`, `new_authoritative_reversible`, `new_authoritative_final`, and `rollback_pending`.

Constructing the registry writes no record. A mode with no persisted record reads as `legacy_authoritative`, the default a read falls back to rather than a stored value. As the system ships, every mode in the frozen order holds a stored `new_authoritative_final` record: authority has moved to the ledger and the legacy shadow writer has been dropped. A `legacy_authoritative` read now means an absent record, not the shipped state of an enabled mode.

The exit contract of the gateway CLI is: 0 = the event is durable in the ledger, 1 = script error where the input never reached authority, 2 = refused at the authority boundary. Exit 0 speaks only to ledger durability; it says nothing about the legacy projection.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/per-mode-authority-flip/authority-registry.ts` | Runtime | Per-mode authority records, one JSON file per mode under its root. |
| `lib/mode-append-gateway/append-mode-event.ts` | Runtime | Authorizes each append against the mode's record. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/per-mode-authority-flip.vitest.ts` | Test | Primary regression coverage for Ledger authority. |
| `tests/unit/mode-append-gateway.vitest.ts` | Test | Append-gateway authorization coverage. |
| `tests/unit/deep-research-authority-composition.vitest.ts` | Test | Deep-research authority composition coverage. |

---

## 4. SOURCE METADATA

- Group: State safety
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F054
- Feature file path: `state-safety/ledger-authority.md`
- Primary sources: `lib/per-mode-authority-flip/authority-registry.ts`, `tests/unit/per-mode-authority-flip.vitest.ts`
Related references:
- [state safety](../../feature-catalog/state-safety) — State safety category
