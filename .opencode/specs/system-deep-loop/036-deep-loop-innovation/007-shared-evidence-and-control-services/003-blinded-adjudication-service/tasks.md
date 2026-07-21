---
title: "Tasks: Blinded Adjudication Service"
description: "Tasks for implementing the shared blinded and counterfactual adjudication service and its mode adapters."
trigger_phrases:
  - "blinded adjudication tasks"
  - "counterfactual adjudication implementation tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service"
    last_updated_at: "2026-07-21T02:07:00Z"
    last_updated_by: "codex"
    recent_action: "Completed adversarial hardening and all verification tasks"
    next_safe_action: "Consume the dark adapter in the later shadow-parity phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/blinded-adjudication.vitest.ts"
    completion_pct: 100
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

- [x] T001 Confirm the phase-004 ADR and manifest invariants, bind the design to the phase-006 envelope/fingerprint contract, and inventory identity-bearing and position-bearing fields [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T002 Freeze the `AdjudicationRequest`, event vocabulary, counterfactual policy, stable/unstable/inconclusive semantics, and five mode-adapter boundaries [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement typed request validation and fail-closed transition authorization for request, presentation, raw-score, probe, reduction, verdict, invalidation, and deblinding events [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T004 Implement the separated identity vault and audit-controlled identity-map capability [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T005 Implement content-linked per-assignment opaque labels, order randomization, provenance/confidence masking, and versioned content-preserving transformation manifests [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T006 Implement mirrored A/B and B/A assignment planning with explicit tie, abstention, invalid, and insufficient-evidence outcomes [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T007 Implement the judge gateway with producer/judge separation, immutable raw scores, rationale/evidence locators, uncertainty, and self-scoring rejection [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T008 Implement linked identity, order, confidence, expertise, majority-cue, and policy-specific counterfactual probes [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T009 Implement the versioned reducer with pairwise graph, ties, cycles, vetoes, minority evidence, and stable/unstable/inconclusive verdicts [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T010 Implement effective-independence and residual-correlation evidence; keep configured seat count and Dawid-Skene-style competence estimates separate from effective vote count [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T011 Implement authorized post-verdict deblinding events and reject routine or premature identity-map access [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T012 Implement typed adapters for deep-review, deep-ai-council, deep-improvement, model-benchmark, and skill-benchmark without adapter-side re-reduction [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T013 Keep the service additive-dark and emit shadow-comparison evidence without changing legacy scoring or convergence authority [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify identity isolation and content preservation — canary fields do not reach judges, stable labels cannot be inferred across assignments, and allowed transformations preserve candidate meaning [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T015 Verify mirrored and counterfactual behavior — A/B plus B/A and each configured merit-irrelevant intervention record flip/no-flip/indeterminate evidence [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T016 Verify fail-closed reduction — missing probes, order flips, invalid assignments, insufficient quorum/independence, ties, cycles, and vetoes cannot become a stable winning verdict [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T017 Verify raw-evidence retention and replay — every verdict traverses to component events and exact event/fingerprint replay reproduces its reduction [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T018 Verify correlation guardrails — cloned/shared-provider judges do not inflate effective independence and competence weighting retains residual-correlation warnings [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T019 Verify self-scoring and deblinding controls — producer-as-judge, identity-derived weighting, premature deblinding, and unauthorized deblinding are rejected [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T020 Verify all five mode adapters preserve verdict status, evidence links, minority evidence, and mode-owned transition authority [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T021 Verify migration posture — shadow comparisons are recorded while the legacy decision remains authoritative [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] T022 Run the phase's schema, unit, integration, replay, access-control, adapter-contract, and strict spec validation gates with non-zero fixture discovery [EVIDENCE: focused Vitest 39/39 and strict packet validation passed with exit code 0; implementation-summary.md]
- [x] T023 Close adversarial blinding, planned-profile substitution, mode-required probe, authenticated deblinding, and complete-verdict replay gaps [EVIDENCE: eight new adversarial fixtures; focused Vitest 39/39 passed; TypeScript and strict validation exited 0; implementation-summary.md]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: tasks T001-T023 are checked with implementation and focused verification evidence]
- [x] All requirements in spec.md met with evidence [EVIDENCE: focused Vitest 39/39 passed; mapped contract proof in implementation-summary.md]
- [x] Phase gate green (validate/build/test as applicable) [EVIDENCE: focused Vitest 39/39, TypeScript exit 0, and strict packet validation exit 0; implementation-summary.md]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
