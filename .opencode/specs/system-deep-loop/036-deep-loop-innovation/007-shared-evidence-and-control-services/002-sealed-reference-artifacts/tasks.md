---
title: "Tasks: Sealed Reference Artifacts"
description: "Tasks for implementing immutable sealing, reference-by-digest, verified reads, replay binding, and retention of deep-loop reference artifacts."
trigger_phrases:
  - "sealed reference artifacts tasks"
  - "deep-loop artifact sealing tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Sequenced the sealed-artifact implementation and verification tasks"
    next_safe_action: "Inventory artifact kinds and freeze the seal descriptor"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Sealed Reference Artifacts

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

- [ ] T001 Inventory initial artifact kinds, mutable input sources, replay roots, rollback holds, and archival requirements against the pinned baseline
- [ ] T002 Freeze the versioned seal descriptor, canonicalization registry, algorithm-qualified digest grammar, verified-read errors, reference-set ordering, and lifecycle records
- [ ] T003 Define the additive-dark integration boundary with phase-006 fingerprints and phase-008 input-equivalence checks without changing legacy authority
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement deterministic canonicalizers for prompt sets, fixtures, prior-run outputs, and configuration with explicit artifact-kind/version registration
- [ ] T005 Implement staged atomic sealing, descriptor derivation, immutable blob publication, post-write verification, and reference publication
- [ ] T006 Implement idempotent duplicate sealing plus typed collision, descriptor-conflict, corruption, and quarantine handling
- [ ] T007 Implement exact reference-by-digest schemas and reject mutable-only path, alias, tag, and `latest` inputs from dark replay evidence
- [ ] T008 Implement streaming verified reads that recompute size and digest before releasing a verified handle and release no bytes on failure
- [ ] T009 Bind ordered verified artifact-reference sets into ledger events, receipts/certificates, and the phase-006 replay-fingerprint descriptor
- [ ] T010 Add the phase-008 shadow-parity precondition that legacy and dark executions cite the same verified artifact-reference set
- [ ] T011 Implement append-only lifecycle records for creation, protected references, retention class, holds, quarantine, eligibility, deletion receipts, tombstones, and exact restoration
- [ ] T012 Implement conservative mark-and-sweep rooted in runs, fingerprints, receipts, rollback windows, archival readers, and holds; incomplete analysis retains data
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify equivalent inputs produce byte-identical canonical content, descriptors, and algorithm-qualified digests across supported platforms
- [ ] T014 Verify crash-stage atomicity, immutability, duplicate idempotency, collision quarantine, and no partial published reference
- [ ] T015 Verify missing, changed, truncated, substituted, wrong-kind, wrong-size, and unsupported-version objects fail before any bytes reach a consumer
- [ ] T016 Verify mutable-only or unverifiable inputs cannot produce trusted replay fingerprints, parity comparisons, receipts, or certificates
- [ ] T017 Verify identical sealed inputs plus the same replay contract reproduce effective events and projections, while any input/reference drift yields a typed mismatch
- [ ] T018 Verify retention preserves all protected roots, uncertainty deletes nothing, eligible sweep emits receipts, tombstones fail reads, and restoration requires exact bytes
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
