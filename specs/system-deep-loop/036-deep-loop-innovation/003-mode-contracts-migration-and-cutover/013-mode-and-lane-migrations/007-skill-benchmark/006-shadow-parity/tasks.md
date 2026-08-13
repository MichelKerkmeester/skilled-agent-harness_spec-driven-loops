---
title: "Tasks: Skill Benchmark shadow parity"
description: "Tasks for the Skill Benchmark shadow-parity child: define paired scenario and scoring projections, compare legacy and typed-ledger events, and fail closed on drift."
trigger_phrases:
  - "Skill Benchmark shadow parity tasks"
  - "skill scenario projection parity tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity"
    last_updated_at: "2026-07-15T21:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Sequenced setup, shadow adapter, comparator, and verification tasks"
    next_safe_action: "Inventory the legacy runner and pin shared service contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Benchmark Shadow Parity

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

- [ ] T001 Confirm the phase-014 shadow contract, mode-004 deep-improvement-common versions, local phase-012 shared-contract freeze, and scoped worktree state
- [ ] T002 Inventory the legacy Skill Benchmark scenario runner, skill loader, emitter, scorer, gold sources, fixtures, and known behavior without changing authority
- [ ] T003 Freeze stable scenario IDs, treatment arms, executor/environment descriptors, seeds, bundle and registry digests, tool and permission surfaces, and repetition bounds
- [ ] T004 Define the paired-run identity and canonical event tuple, including the explicit volatile-field allowlist
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Define versioned Skill Benchmark scenario and treatment schemas over deep-improvement-common contracts
- [ ] T006 Add the phase-014 shadow adapter that runs legacy and ledger paths against one immutable paired input
- [ ] T007 Add skill-specific resource canaries, gold policy, causal-stage events, and score projections
- [ ] T008 Add canonical projection normalization and event-for-event comparison with typed mismatch classes
- [ ] T009 Add paired parity reports, digest-bound receipts, replay inputs, command and exit-code evidence, and withheld-result handling
- [ ] T010 Add fail-closed assertions proving shadow evidence cannot change legacy authority or emit a cutover signal
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify the full treatment matrix and negative controls preserve pair identity and bounded repetition rules
- [ ] T012 Verify event kind, logical ID, causal order, payload digest, status, score contribution, and receipt reference parity
- [ ] T013 Verify stage-specific scoring, intention-to-treat lift, valid alternative trajectories, and cost/security diagnostics
- [ ] T014 Verify scored, negative, structural-only, and pending gold behavior, empty-gold blocking, provenance, and mutation sensitivity
- [ ] T015 Verify missing, extra, reordered, payload, score, gold, cost, receipt, and replay mismatches fail closed and withhold results
- [ ] T016 Verify deterministic replay and shared-service ownership with no duplicate ledger, receipt, budget, replay, or projection implementation
- [ ] T017 Verify the phase remains planning/implementation scope only: no resume, rollback, certificate issuance, authority cutover, or sibling concern is included
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/replay/parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
