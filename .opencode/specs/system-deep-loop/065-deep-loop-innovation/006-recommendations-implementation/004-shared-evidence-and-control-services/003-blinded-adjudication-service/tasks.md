---
title: "Tasks: Blinded Adjudication Service"
description: "Tasks for implementing the shared blinded and counterfactual adjudication service and its mode adapters."
trigger_phrases:
  - "blinded adjudication tasks"
  - "counterfactual adjudication implementation tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/003-blinded-adjudication-service"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/003-blinded-adjudication-service"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined implementation and verification tasks for bias-controlled adjudication"
    next_safe_action: "Start with the request schema and the identity-bearing field inventory"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Blinded Adjudication Service

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

- [ ] T001 Confirm the phase-001 ADR and manifest invariants, bind the design to the phase-003 envelope/fingerprint contract, and inventory identity-bearing and position-bearing fields
- [ ] T002 Freeze the `AdjudicationRequest`, event vocabulary, counterfactual policy, stable/unstable/inconclusive semantics, and five mode-adapter boundaries
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement typed request validation and fail-closed transition authorization for request, presentation, raw-score, probe, reduction, verdict, invalidation, and deblinding events
- [ ] T004 Implement the separated identity vault and audit-controlled identity-map capability
- [ ] T005 Implement content-linked per-assignment opaque labels, order randomization, provenance/confidence masking, and versioned content-preserving transformation manifests
- [ ] T006 Implement mirrored A/B and B/A assignment planning with explicit tie, abstention, invalid, and insufficient-evidence outcomes
- [ ] T007 Implement the judge gateway with producer/judge separation, immutable raw scores, rationale/evidence locators, uncertainty, and self-scoring rejection
- [ ] T008 Implement linked identity, order, confidence, expertise, majority-cue, and policy-specific counterfactual probes
- [ ] T009 Implement the versioned reducer with pairwise graph, ties, cycles, vetoes, minority evidence, and stable/unstable/inconclusive verdicts
- [ ] T010 Implement effective-independence and residual-correlation evidence; keep configured seat count and Dawid-Skene-style competence estimates separate from effective vote count
- [ ] T011 Implement authorized post-verdict deblinding events and reject routine or premature identity-map access
- [ ] T012 Implement typed adapters for deep-review, deep-ai-council, deep-improvement, model-benchmark, and skill-benchmark without adapter-side re-reduction
- [ ] T013 Keep the service additive-dark and emit shadow-comparison evidence without changing legacy scoring or convergence authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify identity isolation and content preservation — canary fields do not reach judges, stable labels cannot be inferred across assignments, and allowed transformations preserve candidate meaning
- [ ] T015 Verify mirrored and counterfactual behavior — A/B plus B/A and each configured merit-irrelevant intervention record flip/no-flip/indeterminate evidence
- [ ] T016 Verify fail-closed reduction — missing probes, order flips, invalid assignments, insufficient quorum/independence, ties, cycles, and vetoes cannot become a stable winning verdict
- [ ] T017 Verify raw-evidence retention and replay — every verdict traverses to component events and exact event/fingerprint replay reproduces its reduction
- [ ] T018 Verify correlation guardrails — cloned/shared-provider judges do not inflate effective independence and competence weighting retains residual-correlation warnings
- [ ] T019 Verify self-scoring and deblinding controls — producer-as-judge, identity-derived weighting, premature deblinding, and unauthorized deblinding are rejected
- [ ] T020 Verify all five mode adapters preserve verdict status, evidence links, minority evidence, and mode-owned transition authority
- [ ] T021 Verify migration posture — shadow comparisons are recorded while the legacy decision remains authoritative
- [ ] T022 Run the phase's schema, unit, integration, replay, access-control, adapter-contract, and strict spec validation gates with non-zero fixture discovery
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
