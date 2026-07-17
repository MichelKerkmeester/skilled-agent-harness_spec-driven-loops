---
title: "Tasks: Skill Benchmark - Resume Adapter"
description: "Tasks for the Skill Benchmark sealed-ledger resume adapter: pin schema and reducer contracts, map continuity-ladder state, define stable scenario-cell re-entry, preserve skill-specific scoring evidence, consume shared recovery services, and verify idempotent replay."
trigger_phrases:
  - "Skill Benchmark resume adapter tasks"
  - "sealed ledger skill benchmark resume tasks"
  - "skill scenario re-entry task set"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/005-resume-adapter"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Separated Skill Benchmark scenario identity from retry attempts"
    next_safe_action: "Define resume-plan key and scenario-cell conflict rules"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Benchmark - Resume Adapter

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

- [ ] T001 Confirm the phase is planning-only, the target folder is scope-locked, and adjacency names predecessor `004-certificates-and-receipts` and successor `006-shadow-parity`
- [ ] T002 [P] Pin the phase-006 sealed-ledger, phase-012 shared-event, Skill Benchmark schema, and reducer contracts with version and fingerprint fields
- [ ] T003 [P] Record deep-improvement-common mode-004 ownership for evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility, and effect-recovery services
- [ ] T004 [P] Extract research obligations for receipt completion, logical versus attempt identity, branch-local success, unknown effects, paired skill lift, progressive disclosure, executable gold, and mediation metrics
- [ ] T005 Inventory design, treatment, scenario, stage, trajectory, outcome, gold, score, usage, latency, validity, receipt, and shared-status fields required for reconstruction
- [ ] T006 Define the continuity-ladder layers, sealed source frontier, projection fingerprints, and `SkillResumePlanKey` inputs
- [ ] T007 Define the scenario-cell action table for reuse, reconcile, re-execute, compensate, unknown, fork, and block outcomes
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Define seal validation and compatibility outcomes for ledger, schema, reducer, treatment, bundle, registry, executor, environment, gold, evaluator, and scoring-policy fingerprints
- [ ] T009 Define reducer-only reconstruction from the sealed finalized frontier with no mutable-file, executor, network, clock, randomness, or hidden-write dependency
- [ ] T010 Define the continuity-ladder projection from run and treatment identity through skill path, evidence, scoring, shared status, and the resumable frontier
- [ ] T011 Define stable design-cell, scenario-cell, logical-operation, event, receipt, and attempt identity rules for paired arms, progressive stages, parallel completion, and restart
- [ ] T012 Define idempotent event and resume-plan application: same identity and content hash is a no-op; conflicting identity, payload, manifest, or frontier fails closed
- [ ] T013 Define per-cell re-entry planning for compatible terminal reuse, missing-stage re-execution, shared receipt reconciliation, compensation, unknown effect, fork, and block
- [ ] T014 Define preservation of discovery, loading, invocation, resource exposure, trajectory, outcome, late evidence, invalidity, abstention, underpowered, contaminated, and negative-transfer states
- [ ] T015 Define Skill Benchmark scoring restoration for paired lift, stage mediation, constraint coverage, dynamic gold, raw axes, evaluator epoch, usage, latency, validity, and uncertainty
- [ ] T016 Define the shared resume receipt or reference payload with plan key, source seal, projection hash, selected cells, excluded reasons, stage decisions, score references, and common-service receipt refs
- [ ] T017 Define the `006-shadow-parity` handoff without clearing common vetoes or changing legacy authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Verify: Fresh and valid prefix folds over the same sealed ledger produce byte-identical run, treatment, scenario, evidence, score, status, frontier, and projection fingerprints
- [ ] T019 Verify: Event completion-order permutations, duplicate terminal events, paired-arm completion, progressive-stage order, batch boundaries, and late evidence produce identical plans or explicit safe rejection
- [ ] T020 Verify: Crashes before dispatch, after executor acceptance, after receipt, after ledger append, after projection fold, and before resume receipt produce no double-apply and preserve unknown states
- [ ] T021 Verify: Treatment, bundle, registry, executor, environment, gold, evaluator, scoring-policy, schema, reducer, and frontier changes select migrate, pin, fork, or block rather than silent reuse
- [ ] T022 Verify: Design-cell, scenario-cell, logical-operation, event, and receipt identities persist across retries while attempt identities change only after authorized re-entry
- [ ] T023 Verify: Completed control and treatment cells remain reusable and unknown effects do not become automatic duplicate executions
- [ ] T024 Verify: Skill exposure stages, trajectory evidence, gold integrity, raw scores, constraint coverage, validity, contamination, negative transfer, usage, latency, and uncertainty survive resume planning
- [ ] T025 Verify: Skill Benchmark consumes common evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility, effect-recovery, veto, rollback, and status contracts without a semantic fork
- [ ] T026 Verify: The `006-shadow-parity` handoff contains deterministic source and output fingerprints and the exact four-file scope check passes
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/property/crash-injection/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor adjacency**: See `004-certificates-and-receipts`
- **Successor adjacency**: See `006-shadow-parity`
<!-- /ANCHOR:cross-refs -->
