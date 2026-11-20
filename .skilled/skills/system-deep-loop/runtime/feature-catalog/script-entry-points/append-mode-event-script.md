---
title: "append-mode-event.cjs"
description: "Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection."
trigger_phrases:
  - "append-mode-event.cjs"
  - "append mode event"
  - "mode append gateway"
  - "typed ledger append"
  - "legacy projection refresh"
version: 1.4.0.5
---

# append-mode-event.cjs

---

## 1. OVERVIEW

Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection so existing consumers keep reading the same file.

This feature belongs to the script entry points group and is catalogued as F055 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

The append gateway is the sanctioned way every canonical record reaches a mode's state log. It authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection so existing consumers keep reading the same file. This path writes no authority record — authority is moved separately by the flip — so the gateway behaves identically before a cutover and after modes reach `new_authoritative_final`; each append authorizes against whatever durable record the mode already holds. In review mode it also takes the bare canonical iteration record a review worker hands over (`"type":"iteration"`, no `stem`), records it whole under `deep_review.iteration_recorded`, and the refreshed state log carries it back as the same row with one change: its `timestamp`.

### Iteration Rows Are Timed by the Gateway Clock

A model writes the iteration row, so the time on it is a claim, not the row time. The gateway times every research iteration row (`deep_research.iteration_completed`) and every review `"type":"iteration"` record from its own clock, and ignores an `occurredAt` or `occurred_at` the row carries. The stamp the model wrote is kept as a claim. A research row's UTC `timestamp` moves to `claimedTimestamp` in the event data. A review record is stored whole, its own `timestamp` included. For both, the projected state-log row carries the gateway time as `timestamp` and the model's stamp as `claimedTimestamp`. A research stamp that is not a UTC instant is dropped with a warning. Every other row keeps its own timestamp.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/append-mode-event.cjs` | Runtime | Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/mode-append-gateway.vitest.ts` | Automated test | Primary regression coverage for append-mode-event.cjs (11 tests; its fixture pins authority at `legacy_authoritative` and asserts the legacy projection is refreshed). |
| `tests/unit/append-mode-event-legacy-seam.vitest.ts` | Automated test | Research iteration rows timed by the gateway clock, with the model's stamp kept as `claimedTimestamp`. |
| `tests/unit/append-mode-event-cli.vitest.ts` | Automated test | Review iteration records timed by the gateway clock, with the model's stamp kept as `claimedTimestamp`. |
| `scripts/check-protocol-append-sites.cjs` | Automated test | Fails any workflow asset whose appends are undeclared or uncounted. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `script-entry-points/append-mode-event-script.md`
- Primary sources: `scripts/append-mode-event.cjs`, `tests/unit/mode-append-gateway.vitest.ts`
