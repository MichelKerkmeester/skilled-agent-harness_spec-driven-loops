---
title: "Tasks: next-focus semantics (recommendations implementation phase 007 child 004)"
description: "Tasks for implementing typed next-focus candidates, deterministic scoring and selection, and replayable ledger recording."
trigger_phrases:
  - "next-focus semantics tasks"
  - "deep-loop focus selection tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/004-next-focus-semantics"
    last_updated_at: "2026-07-15T15:30:00Z"
    last_updated_by: "codex"
    recent_action: "Decomposed next-focus implementation and verification into bounded tasks"
    next_safe_action: "Start T001 by pinning the execution baseline and signal contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Next-Focus Semantics

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

- [ ] T001 Pin BASE and inventory the typed-ledger writer, transition gateway, replay fingerprint, projection watermark, and current-focus seams
- [ ] T002 Capture protected behavior from `runtime/lib/deep-loop/pivot-candidates.ts`, `runtime/lib/deep-loop/divergent-pivot.ts`, and the phase placement in `manifest/phase-tree.json`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Define the `NextFocusCandidate` union for coverage gaps, open contradictions, and under-covered communities with stable identity, evidence, boundary, fingerprint, provenance, watermark, and normalized signals
- [ ] T004 Implement candidate validation and pivot-compatible exact/material-similarity deduplication with typed fail-closed errors
- [ ] T005 Implement single-watermark signal adapters and checked basis-point scoring for coverage gap, contradiction urgency, and novelty decay
- [ ] T006 Implement the total deterministic comparator and order-independent selected/no-eligible outcome
- [ ] T007 Add transition-authorized `next_focus_selected` and `next_focus_unavailable` ledger events with the ranked frontier, policy version, source fingerprint, previous focus, and comparator evidence
- [ ] T008 Add replay reduction, idempotent duplicate handling, conflicting-payload refusal, and candidate-set fingerprint validation
- [ ] T009 Wire additive-dark shadow comparison without granting the new selector current-focus authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify: Candidate model completeness — all three kinds validate and every malformed field fails with a stable typed error
- [ ] T011 Verify: Snapshot consistency — mixed, stale, or unsupported watermarks and missing required evidence fail before scoring
- [ ] T012 Verify: Deterministic scoring — integer golden vectors, overflow guards, policy versions, and candidate fingerprints are stable across repeated runs
- [ ] T013 Verify: Total selection — every tie-break tier and input permutation produces the same ordered frontier and winner
- [ ] T014 Verify: Ledger replay — selected and no-eligible outcomes restore from recorded events without prompt state or live projection access
- [ ] T015 Verify: Conflict handling — same decision/same payload is idempotent and same decision/different payload is rejected
- [ ] T016 Verify: Compatibility — existing pivot candidate and divergent-pivot tests pass without altered Council quorum, veto, budgets, recursion, or artifacts
- [ ] T017 Verify: Additive-dark posture — shadow evidence is append-only and authoritative current focus remains unchanged
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
