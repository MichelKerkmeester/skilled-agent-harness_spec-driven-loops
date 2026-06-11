---
title: "Idempotency Flag-ON Correctness: Verbatim Replay and Immutable First-Write Receipts"
description: "With SPECKIT_MEMORY_IDEMPOTENCY on, replay now returns the original response verbatim, receipts are immutable first-writes via ON CONFLICT DO NOTHING, the receipt-write guard never leaves a retry-blocking receipt, and a concurrent first-write loser replays the winner. Flag stays default-off pending a dist rebuild."
trigger_phrases:
  - "023 idempotency flag on correctness changelog"
  - "verbatim replay immutable receipt"
  - "concurrent first-write loser replays winner"
  - "027 023 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/023-idempotency-flag-on-correctness` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The memory idempotency feature (`SPECKIT_MEMORY_IDEMPOTENCY`, default OFF) had correctness gaps that would surface only with the flag on, so they had to be fixed before any future enablement. Replay now returns the original stored response verbatim — the prior `replayed: true` marker is gone, so a replayed call is indistinguishable from the first call, which is the point of idempotency. Receipts are immutable first-writes: the store uses `ON CONFLICT(receipt_key) DO NOTHING` and reports whether it won the write. The receipt-write guard no longer leaves behind a receipt that would block a legitimate retry. And when two concurrent first-writes race, the loser looks up the winner's receipt and replays the winner's response instead of diverging. All of this stays gated behind the default-off flag, which remains off pending a dist rebuild and a deliberate enablement decision.

### Added

- `lookupIdempotencyReceiptByKey(database, key)` — a keyed receipt lookup used by the concurrent-loser replay path

### Changed

- `lib/storage/idempotency-receipts.ts` — `storeIdempotencyReceipt` returns whether it won the write (`info.changes > 0` after `ON CONFLICT(receipt_key) DO NOTHING`), and the keyed lookup was split out
- `handlers/memory-save.ts` — on a lost store, looks up the winner's receipt and, if it is a replay, returns the winner's response

### Fixed

- Replay returns the original response verbatim instead of stamping a `replayed: true` marker
- Receipts are immutable first-writes, so a retry never overwrites the recorded response
- The receipt-write guard never leaves a retry-blocking receipt behind
- A concurrent first-write loser replays the winner rather than diverging

### Verification

| Check | Result |
|-------|--------|
| Deep review | resolved after the flag-ON correctness remediation |
| Idempotency suite | PASS: 12/12, including won/lost-replay and flag-off no-op |
| Flag-off no-op | PASS: `isMemoryIdempotencyEnabled()` false by default, no behavior change |
| Live enablement | DEFERRED: flag stays off pending a dist rebuild and an enablement decision |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts` | Modified |

### Follow-Ups

- Enablement gating (force-retry-conflict handling, receipt TTL) is the remaining work before the flag can be turned on.
