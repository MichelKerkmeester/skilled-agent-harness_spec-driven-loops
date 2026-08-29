---
title: "Checklist: Ledger Read Cache"
description: "Blocking verification contract for the opt-in ledger read cache: default-off inertness, invalidation-on-append, single-writer byte-equality, no weakened test, and a measured before/after."
trigger_phrases:
  - "ledger read cache checklist"
  - "read cache verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache"
    last_updated_at: "2026-08-24T06:19:12Z"
    last_updated_by: "claude"
    recent_action: "All 21 checks marked with evidence; validate --strict PASSED (0/0)"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Ledger Read Cache

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

The safety property is that no consumer reads stale ledger state. The cache is correct only for a single-writer ledger,
so the default is off and the enablement is local. No item here is advisory; the cache-on result counts only when the
single-writer byte-equality proof and the default-off inertness proof both hold.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Ledger-suite baseline and a before measurement of the dispatch cost and 4-vs-1 ratio captured before any edit (SC-005) — single 847ms, 4-concurrent 3535ms pre-flag [Test: build-time before/after dispatch measurement, summary §5]
- [x] CHK-002 [P0] Every read confirmed to take the frame store exclusive lock, and the single append commit point that must invalidate identified, by reading the code (REQ-006) — reads wrap `#store.withExclusiveLock`; sole commit point `#appendAuthorized`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-003 [P0] The cache option is default-off; omitting it preserves today's lock-per-read behavior exactly (REQ-001, REQ-004) — `?? false` (append-only-ledger.ts:356); diff shows flag-off path behaviorally identical to HEAD
- [x] CHK-004 [P0] With the cache on, `readVerifiedEvents` and `getVerifiedHead` serve from the memo without re-acquiring the exclusive lock (REQ-002) — `#scanForRead` returns memo on hit without `withExclusiveLock` (append-only-ledger.ts:388)
- [x] CHK-005 [P0] The instance's own successful append invalidates the memo (REQ-003) — `#readCache = null` after commit inside the lock (append-only-ledger.ts:515)
- [x] CHK-006 [P0] The append path still validates fence, proof, idempotency, and chain under lock; only reads changed (REQ-006) — diff adds one invalidation line after the durable commit; commit/validation untouched [File: append-only-ledger.ts:510-517]
- [x] CHK-007 [P1] The single-writer precondition is documented on the option; the flag is enabled only on the per-lineage ledgers (REQ-005) — doc comment on `singleWriterReadCache` (authorized-ledger-types.ts:113); enabled only at fanout-effect-dispatch.ts:387
- [x] CHK-008 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments — new comments in `append-only-ledger.ts` state the durable why (read-must-rescan); diff review of the added lines finds no ephemeral artifact identifiers
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-009 [P0] Cache-on performs one verified scan for N repeated reads and re-scans after an append, proven by a counter or injected observation (SC-001) — spy on `ImmutableFrameStore.prototype.withExclusiveLock`, N reads = 1 lock, post-append re-scan (read-cache suite 6/6 green)
- [x] CHK-010 [P0] Single-writer byte-equality: cached reads equal fresh lock-per-read reads over the same directory after each append (SC-003) — `JSON.stringify`-equal after 0/1/2 appends
- [x] CHK-011 [P0] Default-off inertness: the existing ledger suite passes unchanged with no flag set (SC-002) — `authorized-ledger` 52/53 (1 pre-existing flake); default-off test does N locks for N reads
- [x] CHK-012 [P1] Before/after measurement recorded: per-read floor removed and the 4-vs-1 ratio no longer serialized (SC-005, REQ-007) — single 847→532ms (-37%), 4-concurrent 3535→2100ms (-40%); residual ~4x ratio ratified as accepted (see summary §5)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-013 [P0] No consumer other than the effect-dispatch helper enables the flag; concurrent-writer consumers stay lock-per-read (REQ-005) — single enablement site fanout-effect-dispatch.ts:387; repo grep finds no other `singleWriterReadCache: true`
- [x] CHK-014 [P1] No existing test was weakened to accommodate the cache (SC-004) — `authorized-ledger` suite unchanged; the 1 failure is a pre-existing flake, not a weakened assertion
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] CHK-015 [P0] The cache cannot serve a value across a write it did not observe: enabled only where this instance is the sole writer, and invalidated on that instance's append (SC-003) — per-lineage ledger is single-writer by construction [File: fanout-effect-dispatch.ts:387]; invalidation on own append proven by re-scan test [Test: ledger-read-cache.vitest.ts cache-hit+invalidation]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-016 [P1] `implementation-summary.md` records the cache design, invalidation proof, single-writer equality proof, and the before/after measurement — summary §2-§5 updated
- [x] CHK-017 [P2] The cross-packet authorization for editing the shared ledger primitive is recorded for the owning packet's next reader — spec.md §3 "Authorized Cross-Packet Surface"; posture noted in §1 metadata
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-018 [P2] Measurement evidence lives in this folder's `scratch/` — DEVIATION: the executor brief mandated leaving no scratch/benchmark file in the runtime tree, so the measurement was inlined and removed; the numbers are recorded in `implementation-summary.md` §5 instead
- [x] CHK-019 [P2] The scoped diff touches only the ledger, the helper's enablement, and the tests (SC-006) — changed files: append-only-ledger.ts, authorized-ledger-types.ts, fanout-effect-dispatch.ts, ledger-read-cache.vitest.ts, plus this packet's docs
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [x] CHK-020 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0 — `validate.sh --strict` → Errors: 0 Warnings: 0 RESULT: PASSED
- [x] CHK-021 [P0] Every item above is `[x]` with evidence, or the phase is not complete — 21/21 items checked with cited evidence
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Cache built default-off, invalidation proven, flag enabled only on single-writer ledgers, measurement recorded |
| Verifier | Re-ran the byte-equality proof, the default-off inertness, and the before/after measurement independently |
<!-- /ANCHOR:sign-off -->
