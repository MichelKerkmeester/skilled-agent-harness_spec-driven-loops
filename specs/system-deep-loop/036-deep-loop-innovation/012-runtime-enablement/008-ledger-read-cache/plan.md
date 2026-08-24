---
title: "Implementation Plan: Ledger Read Cache"
description: "Plan to add an opt-in, default-off verified-events read cache to AppendOnlyLedger, enable it from the effect-dispatch helper, and prove the per-read lock floor and pool serialization are gone without weakening any consumer."
trigger_phrases:
  - "ledger read cache plan"
  - "read cache implementation plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache"
    last_updated_at: "2026-08-24T06:19:12Z"
    last_updated_by: "claude"
    recent_action: "Broke the fix into read-path, invalidation/enablement, and proof phases"
    next_safe_action: "Read the read and append methods, then add the default-off cache field"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Ledger Read Cache

<!-- ANCHOR:summary -->
## 1. SUMMARY

Every `AppendOnlyLedger` read takes the frame store's exclusive cross-process lock, a ~34ms round-trip that dominates
even on an empty ledger. The authorized-append pipeline takes it ~18 times per effect dispatch, which is the ~700ms cost
and the reason the fan-out pool serializes. The fix caches the verified scan in the ledger instance and serves reads from
it until the instance's own append invalidates it, behind a default-off flag enabled only for provably single-writer
ledgers.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement |
|------|-------------|
| Default-off inertness | The existing `authorized-ledger` suite passes unchanged with no flag set (SC-002, SC-004) |
| Invalidation correctness | A post-append read re-scans and reflects the new event (REQ-003, SC-001) |
| Single-writer equality | Cached reads equal fresh lock-per-read reads over the same directory after each append (SC-003) |
| Measured improvement | Before/after dispatch cost and 4-vs-1 ratio recorded; per-read floor removed (SC-005) |
| Scope | Diff touches only the ledger, the helper's enablement, and the tests (SC-006) |
| Validation | `validate.sh` on this folder `--strict` reports Errors: 0 |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The cache is a single in-instance memo of the last verified scan (`readVerifiedEvents` result, with `getVerifiedHead`
derived from it). It lives on the `AppendOnlyLedger` instance, gated by a default-off constructor option.

- **Read.** With the flag on, `readVerifiedEvents`/`getVerifiedHead` return from the memo when present; on a miss they
  take the exclusive lock, scan, populate the memo, and return. With the flag off, both are unchanged — always lock,
  always scan.
- **Invalidation.** The authorized append path already runs under the exclusive lock and commits exactly one event; on a
  successful commit it clears the memo, so the next read re-scans and observes the new event.
- **Safety boundary.** The memo is per-instance and only valid because that instance is the sole writer of its ledger
  directory. The option's contract states this precondition; it stays off for every concurrent-writer consumer, which
  keeps the lock-per-read consistency the exclusive lock provides.
- **Enablement.** The effect-dispatch helper sets the flag on the per-lineage effect and audit ledgers it constructs —
  ledgers written by exactly one process — and nowhere else.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read path
Add the default-off option and the memo; serve `readVerifiedEvents`/`getVerifiedHead` from it when on.

### Phase 2: Invalidation + enablement
Invalidate on the instance's own successful append; enable the flag on the effect-dispatch helper's per-lineage
ledgers.

### Phase 3: Proof
Cache hit/invalidation, default-off inertness, single-writer byte-equality, full ledger + effect suites, and the
before/after measurement.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- A scan/lock counter (or injected observation) proves cache-on does one scan for N reads and re-scans after an append.
- A byte-equality test compares cached reads against a fresh lock-per-read ledger over the same directory after each
  append.
- Default-off inertness is proven by the existing `authorized-ledger` suite passing unchanged.
- A before/after measurement records the dispatch cost and the 4-concurrent-vs-1 ratio.

Command: `npx vitest run tests/unit/*authorized-ledger* tests/unit/fanout-effect-recording.vitest.ts` plus the new
read-cache test, from the runtime directory.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `lib/authorized-ledger/append-only-ledger.ts` — the read/append methods the cache wraps and the append commit point
  that invalidates it.
- `lib/authorized-ledger/immutable-frame-store.ts` — the exclusive-lock read floor being avoided (read, not changed).
- `lib/deep-loop/fanout-effect-dispatch.ts` — the caller that enables the flag on its per-lineage ledgers.
- `../007-effect-enablement/` — the effect producer whose serialization this removes; the surface the speedup is proven
  against.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is additive and default-off. Reverting the helper's flag restores pre-cache behavior with no data-format
change; reverting the ledger option removes the cache entirely. No persisted state is altered, so rollback is a code
revert with no migration.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 (read path) is a prerequisite for Phase 2 (invalidation needs the memo to exist). Phase 2 enablement in the
helper depends on the ledger option from Phase 1. Phase 3 proofs depend on both: the byte-equality and hit/invalidation
tests need the read path and the invalidation; the measurement needs the helper enablement.
<!-- /ANCHOR:l2-phase-deps -->

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

Small and contained. The ledger change is an option, a memo field, two read guards, and one invalidation call
(~30-60 lines). The helper change is a flag on two constructor calls. The tests (hit/invalidation, byte-equality,
measurement) are the larger share. Total well under the Level 2 ceiling.
<!-- /ANCHOR:l2-effort -->

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

Because the flag is default-off, a partial landing is safe: if the ledger option ships but the helper does not enable
it, behavior is identical to today. If a correctness concern surfaces after enablement, disabling the flag in the helper
is a one-line revert that restores lock-per-read on the effect ledgers with no data migration and no format change. The
verified-event contract and the write path are never touched, so no consumer downstream of the ledger needs to change.
<!-- /ANCHOR:l2-rollback -->
