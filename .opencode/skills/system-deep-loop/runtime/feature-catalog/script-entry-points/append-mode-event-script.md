---
title: "append-mode-event.cjs"
description: "Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection."
trigger_phrases:
  - "append-mode-event.cjs"
  - "append mode event"
  - "mode append gateway"
  - "typed ledger append"
  - "legacy projection refresh"
version: 1.4.0.4
---

# append-mode-event.cjs

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection so existing consumers keep reading the same file.

This feature belongs to the script entry points group and is catalogued as F055 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

The append gateway is the sanctioned way every canonical record reaches a mode's state log. It authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection so existing consumers keep reading the same file. This path writes no authority record — authority is moved separately by the flip — so the gateway behaves identically before a cutover and after modes reach `new_authoritative_final`; each append authorizes against whatever durable record the mode already holds.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/append-mode-event.cjs` | Runtime | Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/mode-append-gateway.vitest.ts` | Test | Primary regression coverage for append-mode-event.cjs (11 tests; its fixture pins authority at `legacy_authoritative` and asserts the legacy projection is refreshed). |
| `scripts/check-protocol-append-sites.cjs` | Conformance | Fails any workflow asset whose appends are undeclared or uncounted. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F055
- Feature file path: `script-entry-points/append-mode-event-script.md`
- Primary sources: `scripts/append-mode-event.cjs`, `tests/unit/mode-append-gateway.vitest.ts`
