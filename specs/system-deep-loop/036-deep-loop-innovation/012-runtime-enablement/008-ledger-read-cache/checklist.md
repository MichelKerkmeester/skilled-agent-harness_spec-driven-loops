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
    last_updated_at: "2026-08-22T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the blocking verification contract"
    next_safe_action: "Execute CHK-001 baseline and CHK-002 read-path read"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Ledger Read Cache

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
- [ ] CHK-001 [P0] Ledger-suite baseline and a before measurement of the dispatch cost and 4-vs-1 ratio captured before any edit (SC-005)
- [ ] CHK-002 [P0] Every read confirmed to take the frame store exclusive lock, and the single append commit point that must invalidate identified, by reading the code (REQ-006)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-003 [P0] The cache option is default-off; omitting it preserves today's lock-per-read behavior exactly (REQ-001, REQ-004)
- [ ] CHK-004 [P0] With the cache on, `readVerifiedEvents` and `getVerifiedHead` serve from the memo without re-acquiring the exclusive lock (REQ-002)
- [ ] CHK-005 [P0] The instance's own successful append invalidates the memo (REQ-003)
- [ ] CHK-006 [P0] The append path still validates fence, proof, idempotency, and chain under lock; only reads changed (REQ-006)
- [ ] CHK-007 [P1] The single-writer precondition is documented on the option; the flag is enabled only on the per-lineage ledgers (REQ-005)
- [ ] CHK-008 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-009 [P0] Cache-on performs one verified scan for N repeated reads and re-scans after an append, proven by a counter or injected observation (SC-001)
- [ ] CHK-010 [P0] Single-writer byte-equality: cached reads equal fresh lock-per-read reads over the same directory after each append (SC-003)
- [ ] CHK-011 [P0] Default-off inertness: the existing ledger suite passes unchanged with no flag set (SC-002)
- [ ] CHK-012 [P1] Before/after measurement recorded: per-read floor removed and the 4-vs-1 ratio no longer serialized (SC-005, REQ-007)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-013 [P0] No consumer other than the effect-dispatch helper enables the flag; concurrent-writer consumers stay lock-per-read (REQ-005)
- [ ] CHK-014 [P1] No existing test was weakened to accommodate the cache (SC-004)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] CHK-015 [P0] The cache cannot serve a value across a write it did not observe: enabled only where this instance is the sole writer, and invalidated on that instance's append (SC-003)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-016 [P1] `implementation-summary.md` records the cache design, invalidation proof, single-writer equality proof, and the before/after measurement
- [ ] CHK-017 [P2] The cross-packet authorization for editing the shared ledger primitive is recorded for the owning packet's next reader
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-018 [P2] Measurement evidence lives in this folder's `scratch/`
- [ ] CHK-019 [P2] The scoped diff touches only the ledger, the helper's enablement, and the tests (SC-006)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [ ] CHK-020 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0
- [ ] CHK-021 [P0] Every item above is `[x]` with evidence, or the phase is not complete
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Cache built default-off, invalidation proven, flag enabled only on single-writer ledgers, measurement recorded |
| Verifier | Re-ran the byte-equality proof, the default-off inertness, and the before/after measurement independently |
<!-- /ANCHOR:sign-off -->
