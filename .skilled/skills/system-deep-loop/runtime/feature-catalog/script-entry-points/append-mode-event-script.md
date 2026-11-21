---
title: "append-mode-event.cjs"
description: "Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection."
trigger_phrases:
  - "append-mode-event.cjs"
  - "append mode event"
  - "mode append gateway"
  - "typed ledger append"
  - "legacy projection refresh"
version: 1.4.3.0
---

# append-mode-event.cjs

---

## 1. OVERVIEW

Authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection so existing consumers keep reading the same file.

This feature belongs to the script entry points group and is catalogued as F055 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

The append gateway is the sanctioned way every canonical record reaches a mode's state log. It authorizes a mode event against the mode's durable authority record, appends it to the typed ledger behind a fence, returns a receipt, and refreshes the legacy projection so existing consumers keep reading the same file. This path writes no authority record — authority is moved separately by the flip — so the gateway behaves identically before a cutover and after modes reach `new_authoritative_final`; each append authorizes against whatever durable record the mode already holds. In review mode it also takes the bare canonical iteration record a review worker hands over (`"type":"iteration"`, no `stem`), records it whole under `deep_review.iteration_recorded`, and the refreshed state log carries it back as the same row with one change: its `timestamp`.

A legacy research row or legacy review row (`type` of `iteration`, `iteration_start` or `event`), the shape a model writes, does not choose its own identity. The gateway drops the row's `eventId`, `idempotencyKey`, `producer`, `authorityEpoch`, `streamId`, `streamSequence`, `correlationId`, `causationId` and `recordedAt` (and their snake_case forms) and mints them: an `event-<uuid>` id, the key `deep-research:input:<sha256>` derived from the row as sent, producer `deep-loop-cli`, the admission epoch, the stream id `<mode>-ledger` and the sequence after the ledger head, a fresh correlation id, no causation id, and a recorded time from the gateway clock. None of them is kept as a claim, because `claimedTimestamp` is the only claim field. A row that reused an earlier row's key or id therefore cannot pass as its retry or collide with it, and an identical row appended twice is still stored once.

A row with a `stem` or an `event_type` gets the same strip, with two fields kept: the event id and idempotency key the caller names. The reducer and the review workflow name those two on purpose, so that a re-emitted row is recognized as the same event, and no leaf writes these rows. Such a row also keeps its own `occurredAt`. A canonical envelope (a row carrying `canonicalDigest`, `canonicalBytes`, `identity` and `envelope`) passes through as handed over, because stripping it would break its digest.

### Iteration Rows Are Timed by the Gateway Clock

A model writes the iteration row, so the time on it is a claim, not the row time. The gateway times every research iteration row (`deep_research.iteration_completed`) and every review `"type":"iteration"` record from its own clock, and ignores an `occurredAt` or `occurred_at` the row carries. The stamp the model wrote is kept as a claim. A research row's UTC `timestamp` moves to `claimedTimestamp` in the event data. A review record is stored whole, its own `timestamp` included. For both, the projected state-log row carries the gateway time as `timestamp` and the model's stamp as `claimedTimestamp`. A research stamp that is not a UTC instant is dropped with a warning. Every other row keeps its own timestamp.

### Exit Codes and Flags

The script prints one JSON object on stdout and exits with one of four codes:

| Exit | Meaning |
|---|---|
| `0` | The gateway appended the event (`ok: true`). |
| `1` | The event JSON could not be read or parsed (`code: INPUT_ERROR`), or any other thrown error (`code: RUNTIME_ERROR`): a missing required flag, a positional argument, an unsupported mode, a row shape the gateway does not recognize or a refused legacy row. |
| `2` | Authority denied the write (`code: AUTHORITY_DENIED`), an authority flip could not be bound (`code: BINDING_FAILED`), or the gateway returned `ok: false`, such as `IDEMPOTENCY_CONFLICT` or a projection refusal. |
| `3` | An unknown flag (`code: INPUT_VALIDATION`). |

The bootstrap parent that loads the TypeScript runtime exits `130` on SIGINT, `143` on SIGTERM and `1` on any other signal.

Flags: `--mode` (required), the run directory as `--run-directory`, `--run-dir` or `--spec-folder` (one is required), the event file as `--event-json` or `--event-json-path` (one is required), and an optional `--policy-id`, which defaults to `<mode>-append-policy`.

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
| `tests/unit/append-mode-event-legacy-seam.vitest.ts` | Automated test | Research iteration rows timed by the gateway clock, with the model's stamp kept as `claimedTimestamp`; a model-written research or review row's event id, idempotency key, producer and epoch minted by the gateway, a row's own stream id, sequence, correlation, causation and recorded time replaced by the gateway's on the stem, event_type, legacy research and review-record branches, an identical model-written row appended twice stored once, and a reused key with other content refused as `IDEMPOTENCY_CONFLICT`. |
| `tests/unit/append-mode-event-cli.vitest.ts` | Automated test | Review iteration records timed by the gateway clock, with the model's stamp kept as `claimedTimestamp`. |
| `scripts/check-protocol-append-sites.cjs` | Automated test | Fails any workflow asset whose appends are undeclared or uncounted. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `script-entry-points/append-mode-event-script.md`
- Primary sources: `scripts/append-mode-event.cjs`, `tests/unit/mode-append-gateway.vitest.ts`
