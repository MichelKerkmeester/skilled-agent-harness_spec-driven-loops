---
title: "Tasks: whole-system gate (006 phase 013)"
description: "Tasks for phase 013 of the 006 recommendations-implementation program: execute and verify the exact-SHA whole-system acceptance gate."
trigger_phrases:
  - "whole-system gate tasks"
  - "deep-loop phase 013 tasks"
  - "exact-SHA gate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/016-whole-system-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/016-whole-system-gate"
    last_updated_at: "2026-07-15T16:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined staged execution and evidence tasks for the whole-system gate"
    next_safe_action: "Freeze the candidate and BASE pair before running gate checks"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Whole-System Gate

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

- [ ] T001 Confirm predecessor `015-legacy-writer-retirement` has landed its zero-use, rollback, and archival-reader evidence on the candidate worktree
- [ ] T002 Resolve the phase-000 BASE and freeze one candidate exact SHA with tree state, ref provenance, toolchain versions, source digests, and fixture digests
- [ ] T003 Confirm the phase-005 shadow-parity harness, phase-004 effect-recovery and adjudication contracts, phase-008 health harness, phase-009 mixed-version fixtures, eight mode gates, and phase-011/012 evidence are available
- [ ] T004 Assemble the immutable gate manifest with candidate/BASE pair, manifest hash, commands, expected outcomes, evidence paths, and failure-to-owner reopen map
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Run the `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`, `deep-alignment`, `agent-improvement`, `model-benchmark`, and `skill-benchmark` mode gates with behavior, parity, sealed-artifact/certificate, replay, resume, and rollback-switch evidence
- [ ] T006 [P] Replay all phase-009 mixed-version fixture families through upcasters, projections, archival readers, resume, replay fingerprints, and terminal-state checks
- [ ] T007 [P] Inject crashes at effect claim, dispatch, receipt commit, checkpoint, resume, and recovery boundaries; verify phase-004 recovery, idempotency, fencing, receipt integrity, and salvage
- [ ] T008 [P] Run phase-004 blinded/counterfactual adjudication cases with order/identity perturbations and phase-008 degeneration/health cases for repetition, cycles, collapse, quality decay, and stopping behavior
- [ ] T009 Run full phase-005 semantic parity against phase-000 by stable scenario ID, including budget, receipt, terminal, replay, sealed-artifact, and archival-read assertions
- [ ] T010 Record every observed delta, classify it against the protected baseline, and map any failure to the owning phase without changing the BASE or pass bar
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify every gate result carries the candidate SHA, BASE SHA, manifest hash, fixture digest, and toolchain identity
- [ ] T012 Verify all eight mode gates are green and no mode, scenario, fixture family, or rollback path is skipped
- [ ] T013 Verify mixed-version replay is deterministic and archival readers preserve historical completed packets
- [ ] T014 Verify crash recovery produces no lost, duplicated, or unauthorized effects and no stranded in-flight state
- [ ] T015 Verify counterfactual adjudication remains blinded and degeneration/health checks preserve their controls and expected outcomes
- [ ] T016 Verify full parity against phase-000 is green by semantic scenario assertion rather than package or scenario count
- [ ] T017 Run the blocking SOL verifier review against the exact candidate commit and record commands, exit codes, findings, mutation checks, and approval verdict
- [ ] T018 Run `validate.sh --strict --recursive` over the 006 parent tree and require `Errors: 0` and `Warnings: 0`
- [ ] T019 Verify the tracked worktree and index are unchanged after verification and no gate result depends on live tracked state
- [ ] T020 If any check fails, reopen its mapped owner phase, produce a new candidate SHA after correction, and rerun affected and dependent checks before phase 014
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] No `[B]` blocked tasks remain
- [ ] All eight mode gates, cross-system tests, parity checks, SOL review, and recursive strict validation pass
- [ ] Every result is bound to one candidate SHA and the phase-000 BASE SHA
- [ ] Checklist.md is fully verified with evidence
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
