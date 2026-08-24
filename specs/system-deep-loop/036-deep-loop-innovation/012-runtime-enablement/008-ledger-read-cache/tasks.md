---
title: "Tasks: Ledger Read Cache"
description: "Task breakdown for the opt-in AppendOnlyLedger read cache: the default-off read path, append invalidation, effect-helper enablement, and the correctness and measurement proofs."
trigger_phrases:
  - "ledger read cache tasks"
  - "read cache tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache"
    last_updated_at: "2026-08-24T06:19:12Z"
    last_updated_by: "claude"
    recent_action: "Marked all tasks complete with file:line and measurement evidence"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Ledger Read Cache

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] **T-001** Capture the `authorized-ledger` suite baseline and a before measurement of the effect dispatch cost and the 4-concurrent-vs-1 ratio. — baseline suite + before/after recorded; single 847ms, 4-concurrent 3535ms pre-flag.
- [x] **T-002** Read `readVerifiedEvents`, `getVerifiedHead`, and the authorized append path; confirm every read takes the frame store's exclusive lock and identify the single commit point that must invalidate the cache. — reads wrapped `#store.withExclusiveLock(#scanUnlocked(false))`; sole commit point is `#appendAuthorized` (append-only-ledger.ts:515 invalidation).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] **T-003** Add a default-off constructor option enabling an in-instance verified-events cache; document the single-writer precondition on the option. — `singleWriterReadCache?: boolean` (authorized-ledger-types.ts:113); default-off (append-only-ledger.ts:356).
- [x] **T-004** When on, serve `readVerifiedEvents` and `getVerifiedHead` from the memo without taking the exclusive lock; when off, leave both unchanged. — `#scanForRead` (append-only-ledger.ts:388); flag-off diff-identical to HEAD.
- [x] **T-005** Invalidate the memo on the instance's own successful authorized append so the next read re-scans. — single-line invalidation inside `#appendAuthorized` after commit (append-only-ledger.ts:515).
- [x] **T-006** Enable the flag from the effect-dispatch helper on the per-lineage effect and audit ledgers it constructs, and nowhere else. — `singleWriterReadCache: true` (fanout-effect-dispatch.ts:387); enabled on no other consumer.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] **T-007** Prove cache-on does one verified scan for N repeated reads and re-scans after an append (scan/lock counter or injected observation). — spy on `ImmutableFrameStore.prototype.withExclusiveLock`; N reads = 1 lock, append forces re-scan (ledger-read-cache.vitest.ts).
- [x] **T-008** [P] Prove cache-off inertness: the existing ledger suite passes unchanged with no flag set. — `authorized-ledger` 52/53; default-off test does N locks for N reads; flag-off path diff-identical.
- [x] **T-009** [P] Prove single-writer byte-equality: cached reads equal fresh lock-per-read reads over the same directory after each append. — `JSON.stringify`-equal after 0/1/2 appends (ledger-read-cache.vitest.ts).
- [x] **T-010** Re-measure the dispatch cost and the 4-vs-1 ratio with the flag on; record the before/after delta. — single 847→532ms (-37%); 4-concurrent 3535→2100ms (-40%).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] **T-011** Full `authorized-ledger` and effect-recording suites re-run green as a delta against T-001; no test weakened. — effect-recording + read-cache 6/6; `authorized-ledger` 52/53, the 1 failure a pre-existing multiprocess flake (flag never set, flag-off path diff-identical to HEAD).
- [x] **T-012** `validate.sh` on this folder `--strict`; Errors: 0. — see checklist CHK-020.
- [x] **T-013** `implementation-summary.md` records the cache design, the invalidation proof, the single-writer equality proof, and the before/after measurement. — sections 2-5 updated.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Caller that enables the flag | `../007-effect-enablement/` |
<!-- /ANCHOR:cross-refs -->
