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
    last_updated_at: "2026-08-22T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Broke the phase into read-path, invalidation, enablement, and proof tasks"
    next_safe_action: "Run T-001 baseline, then T-002 read/append read"
    blockers: []
    key_files: []
    completion_pct: 0
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
- [ ] **T-001** Capture the `authorized-ledger` suite baseline and a before measurement of the effect dispatch cost and the 4-concurrent-vs-1 ratio.
- [ ] **T-002** Read `readVerifiedEvents`, `getVerifiedHead`, and the authorized append path; confirm every read takes the frame store's exclusive lock and identify the single commit point that must invalidate the cache.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] **T-003** Add a default-off constructor option enabling an in-instance verified-events cache; document the single-writer precondition on the option.
- [ ] **T-004** When on, serve `readVerifiedEvents` and `getVerifiedHead` from the memo without taking the exclusive lock; when off, leave both unchanged.
- [ ] **T-005** Invalidate the memo on the instance's own successful authorized append so the next read re-scans.
- [ ] **T-006** Enable the flag from the effect-dispatch helper on the per-lineage effect and audit ledgers it constructs, and nowhere else.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] **T-007** Prove cache-on does one verified scan for N repeated reads and re-scans after an append (scan/lock counter or injected observation).
- [ ] **T-008** [P] Prove cache-off inertness: the existing ledger suite passes unchanged with no flag set.
- [ ] **T-009** [P] Prove single-writer byte-equality: cached reads equal fresh lock-per-read reads over the same directory after each append.
- [ ] **T-010** Re-measure the dispatch cost and the 4-vs-1 ratio with the flag on; record the before/after delta.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] **T-011** Full `authorized-ledger` and effect-recording suites re-run green as a delta against T-001; no test weakened.
- [ ] **T-012** `validate.sh` on this folder `--strict`; Errors: 0.
- [ ] **T-013** `implementation-summary.md` records the cache design, the invalidation proof, the single-writer equality proof, and the before/after measurement.
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
