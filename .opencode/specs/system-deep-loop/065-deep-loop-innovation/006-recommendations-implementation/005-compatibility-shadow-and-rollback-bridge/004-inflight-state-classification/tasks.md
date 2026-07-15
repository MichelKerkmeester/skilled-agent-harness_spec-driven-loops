---
title: "Tasks: In-Flight State Classification"
description: "Tasks for classifying every frozen phase-000 in-flight state row and producing the fail-closed phase-011 handoff."
trigger_phrases:
  - "in-flight state classification tasks"
  - "deep-loop state disposition tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification"
    last_updated_at: "2026-07-15T14:32:45Z"
    last_updated_by: "codex"
    recent_action: "Defined setup, classification, handoff, and verification tasks"
    next_safe_action: "Execute T001 after the phase-000 census is frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: In-Flight State Classification

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

- [ ] T001 Freeze the executed phase-000 in-flight-state census, BASE, row IDs, evidence digests, and rollback anchors; stop if the census is still planned, incomplete, or unstable
- [ ] T002 Pin the phase-001 transition/versioning/rollback policy and phase-tree migration model revisions consumed by classification
- [ ] T003 Define the classification-manifest schema, five-value enum, reason-code registry, canonical hash, freshness fields, and evidence-retention rules
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement read-only census ingestion with missing-row, duplicate-row, unknown-family, and unstable-ID rejection
- [ ] T005 Normalize each row's digest, shape/version, lifecycle, authority epoch, mutability, leases/locks, pending effects, identities, ordering, idempotency, checkpoint, and rollback evidence
- [ ] T006 Implement the fail-closed precedence engine with `BLOCK` veto first and no multi-class or fallback-list output
- [ ] T007 Apply the phase-000 family baseline map and assign every concrete row exactly one evidence-backed disposition
- [ ] T008 [P] Implement `UPCAST` fixtures proving pure adjacent-version conversion, source preservation, and deterministic effective-state replay
- [ ] T009 [P] Implement `PIN` fixtures proving bounded legacy completion, terminal receipts, and no dual authority
- [ ] T010 [P] Implement `FORK` fixtures proving isolated identities, shadow-only sinks, no live effects, and unchanged source state
- [ ] T011 [P] Implement `MIGRATE` fixtures proving transactional checkpoint import, semantic preservation, and executable restoration
- [ ] T012 [P] Implement `BLOCK` fixtures for missing evidence, corruption, locks, pending-effect uncertainty, lossy transforms, stale epochs, and absent rollback anchors
- [ ] T013 Bind fork rows to shadow-parity cases and bind every non-blocked row to an applicable rollback-drill scenario
- [ ] T014 Emit the canonical classification manifest and the read-only phase-011 adapter that revalidates freshness before returning a handling instruction
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify: census closure is total — every frozen row appears once, receives one allowed class, and contributes to the manifest digest
- [ ] T016 Verify: family coverage is explicit — every phase-000 state family resolves to its baseline or a reviewed evidence-backed override
- [ ] T017 Verify: positive classes satisfy their contracts — upcasts replay, pins terminate, forks isolate, and migrations restore
- [ ] T018 Verify: unsafe and unknown rows fail closed — every negative fixture yields `BLOCK` and no state or authority mutation
- [ ] T019 Verify: classification is deterministic — repeated runs over identical evidence produce byte-identical canonical manifests
- [ ] T020 Verify: freshness is enforced — state, epoch, schema, lease, effect-set, or rollback-anchor drift invalidates the row before phase-011 compare-and-swap
- [ ] T021 Verify: cutover handoff is complete — each mode binds the manifest digest, terminal pin receipts, migration receipts, fork parity evidence, rollback anchors, and zero live block rows
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
