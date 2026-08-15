---
title: "Tasks: Skill Benchmark shadow parity"
description: "Tasks for the Skill Benchmark shadow-parity child: define paired scenario and scoring projections, compare legacy and typed-ledger events, and fail closed on drift."
trigger_phrases:
  - "Skill Benchmark shadow parity tasks"
  - "skill scenario projection parity tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/006-shadow-parity"
    last_updated_at: "2026-08-15T15:50:59Z"
    last_updated_by: "codex"
    recent_action: "Verified HEAD suite and reconciled shadow-parity completion evidence"
    next_safe_action: "Consume this completed additive-dark leaf in mode-gate verification"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm the phase-014 shadow contract, mode-004 deep-improvement-common versions, local phase-012 shared-contract freeze, and scoped worktree state [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T002 Inventory the legacy Skill Benchmark scenario runner, skill loader, emitter, scorer, gold sources, fixtures, and known behavior without changing authority [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T003 Freeze stable scenario IDs, treatment arms, executor/environment descriptors, seeds, bundle and registry digests, tool and permission surfaces, and repetition bounds [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T004 Define the paired-run identity and canonical event tuple, including the explicit volatile-field allowlist [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Define versioned Skill Benchmark scenario and treatment schemas over deep-improvement-common contracts [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T006 Add the phase-014 shadow adapter that runs legacy and ledger paths against one immutable paired input [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T007 Add skill-specific resource canaries, gold policy, causal-stage events, and score projections [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T008 Add canonical projection normalization and event-for-event comparison with typed mismatch classes [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T009 Add paired parity reports, digest-bound receipts, replay inputs, command and exit-code evidence, and withheld-result handling [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T010 Add fail-closed assertions proving shadow evidence cannot change legacy authority or emit a cutover signal [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify the full treatment matrix and negative controls preserve pair identity and bounded repetition rules [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T012 Verify event kind, logical ID, causal order, payload digest, status, score contribution, and receipt reference parity [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T013 Verify stage-specific scoring, intention-to-treat lift, valid alternative trajectories, and cost/security diagnostics [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T014 Verify scored, negative, structural-only, and pending gold behavior, empty-gold blocking, provenance, and mutation sensitivity [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T015 Verify missing, extra, reordered, payload, score, gold, cost, receipt, and replay mismatches fail closed and withhold results [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T016 Verify deterministic replay and shared-service ownership with no duplicate ledger, receipt, budget, replay, or projection implementation [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] T017 Verify the phase remains planning/implementation scope only: no resume, rollback, certificate issuance, authority cutover, or sibling concern is included [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] All requirements in spec.md met with evidence [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
- [x] Phase gate green (validate/build/test/replay/parity as applicable) [Evidence: fresh focused Vitest 20/20; tests/unit/skill-benchmark-shadow-parity.vitest.ts:841; lib/skill-benchmark-shadow-parity/harness-adapter.ts:153]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
