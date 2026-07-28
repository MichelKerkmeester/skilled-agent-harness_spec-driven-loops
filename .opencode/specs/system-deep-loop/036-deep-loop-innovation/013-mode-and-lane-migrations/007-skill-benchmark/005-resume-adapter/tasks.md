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
    last_updated_at: "2026-07-28T00:15:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the resume adapter implementation and verification"
    next_safe_action: "Consume the frozen adapter in shadow parity"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-resume-adapter/types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-resume-adapter.vitest.ts"
    completion_pct: 100
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

- [x] T001 Confirm the implementation is additive-dark, the target folder is scope-locked, and adjacency names predecessor `004-certificates-and-receipts` and successor `006-shadow-parity` [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T002 [P] Pin the phase-006 sealed-ledger, phase-012 shared-event, Skill Benchmark schema, and reducer contracts with version and fingerprint fields [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T003 [P] Record deep-improvement-common mode-004 ownership for evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility, and effect-recovery services [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T004 [P] Extract research obligations for receipt completion, logical versus attempt identity, branch-local success, unknown effects, paired skill lift, progressive disclosure, executable gold, and mediation metrics [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T005 Inventory design, treatment, scenario, stage, trajectory, outcome, gold, score, usage, latency, validity, receipt, and shared-status fields required for reconstruction [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T006 Define the continuity-ladder layers, sealed source frontier, projection fingerprints, and `SkillResumePlanKey` inputs [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T007 Define the scenario-cell action table for reuse, reconcile, re-execute, compensate, unknown, fork, and block outcomes [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Define seal validation and compatibility outcomes for ledger, schema, reducer, treatment, bundle, registry, executor, environment, gold, evaluator, and scoring-policy fingerprints [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T009 Define reducer-only reconstruction from the sealed finalized frontier with no mutable-file, executor, network, clock, randomness, or hidden-write dependency [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T010 Define the continuity-ladder projection from run and treatment identity through skill path, evidence, scoring, shared status, and the resumable frontier [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T011 Define stable design-cell, scenario-cell, logical-operation, event, receipt, and attempt identity rules for paired arms, progressive stages, parallel completion, and restart [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T012 Define idempotent event and resume-plan application: same identity and content hash is a no-op; conflicting identity, payload, manifest, or frontier fails closed [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T013 Define per-cell re-entry planning for compatible terminal reuse, missing-stage re-execution, shared receipt reconciliation, compensation, unknown effect, fork, and block [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T014 Define preservation of discovery, loading, invocation, resource exposure, trajectory, outcome, late evidence, invalidity, abstention, underpowered, contaminated, and negative-transfer states [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T015 Define Skill Benchmark scoring restoration for paired lift, stage mediation, constraint coverage, dynamic gold, raw axes, evaluator epoch, usage, latency, validity, and uncertainty [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T016 Define the shared resume receipt or reference payload with plan key, source seal, projection hash, selected cells, excluded reasons, stage decisions, score references, and common-service receipt refs [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T017 Define the `006-shadow-parity` handoff without clearing common vetoes or changing legacy authority [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Verify: Fresh and valid prefix folds over the same sealed ledger produce byte-identical run, treatment, scenario, evidence, score, status, frontier, and projection fingerprints [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T019 Verify: Event completion-order permutations, duplicate terminal events, paired-arm completion, progressive-stage order, batch boundaries, and late evidence produce identical plans or explicit safe rejection [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T020 Verify: Crashes before dispatch, after executor acceptance, after receipt, after ledger append, after projection fold, and before resume receipt produce no double-apply and preserve unknown states [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T021 Verify: Treatment, bundle, registry, executor, environment, gold, evaluator, scoring-policy, schema, reducer, and frontier changes select migrate, pin, fork, or block rather than silent reuse [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T022 Verify: Design-cell, scenario-cell, logical-operation, event, and receipt identities persist across retries while attempt identities change only after authorized re-entry [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T023 Verify: Completed control and treatment cells remain reusable and unknown effects do not become automatic duplicate executions [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T024 Verify: Skill exposure stages, trajectory evidence, gold integrity, raw scores, constraint coverage, validity, contamination, negative transfer, usage, latency, and uncertainty survive resume planning [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T025 Verify: Skill Benchmark consumes common evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility, effect-recovery, veto, rollback, and status contracts without a semantic fork [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
- [x] T026 Verify: The `006-shadow-parity` handoff contains deterministic source and output fingerprints and the scoped runtime, test, and leaf-doc status check passes [EVIDENCE: implementation-summary.md:53 records the adapter implementation; implementation-summary.md:154 records 22 real-path vitest tests passing]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/replay/property/crash-injection/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor adjacency**: See `004-certificates-and-receipts`
- **Successor adjacency**: See `006-shadow-parity`
<!-- /ANCHOR:cross-refs -->

