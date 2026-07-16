---
title: "Tasks: Deep AI Council — Shadow Parity"
description: "Tasks for phase 009 of the Deep AI Council migration: establish paired legacy-ledger execution, canonical event-for-event projection diffing, and a blocking shadow-parity receipt."
trigger_phrases:
  - "deep ai council shadow parity tasks"
  - "council ledger parity tasks"
  - "phase 009 council shadow tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Outlined parity harness, event diff, control-plane, and fixture tasks"
    next_safe_action: "Pin council event mappings and build the deterministic parity matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep AI Council — Shadow Parity

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

- [ ] T001 Confirm predecessor `005-resume-adapter`, phase-014 shadow framework, phase 015 shared contracts, and the pinned BASE/candidate boundary
- [ ] T002 Inventory legacy `ai-council-state.jsonl` events, packet-local artifacts, terminal outcomes, failure rows, rollback rows, and resume boundaries requiring canonical mapping
- [ ] T003 Freeze the input envelope, recorded seat/tool outputs, target version, configuration digest, and versioned normalization profile
- [ ] T004 [P] Assemble deterministic fixtures for normal completion, multiple rounds, timeout/error, contradiction, non-convergence, partial persistence, rollback, resume, and council-specific evidence
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement the paired runner so legacy and ledger observers consume one frozen execution without duplicate dispatch or shadow-owned external effects
- [ ] T006 Define the canonical behavior tuple and legacy-to-ledger event mapping for round, seat, claim, decision, artifact, and lifecycle identities
- [ ] T007 Implement ordered event-for-event comparison with first-divergence reporting, required-field equality, and raw-row retention
- [ ] T008 Compare convergence, majority/minority, hard-constraint, unresolved-value, counterfactual, independence, artifact, and projection outputs where fixtures exercise them
- [ ] T009 Verify ledger transition authorization, receipt references, audit events, effect IDs, and shadow isolation as a separate control-plane result
- [ ] T010 Emit a digest-bound mismatch taxonomy and cutover-blocking parity receipt with SHAs, fixture IDs, mapping/profile versions, event digests, and projection fingerprints
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify: Both paths consume one frozen execution - the parity receipt binds BASE/candidate, input, config, target, seat-output, tool-receipt, and normalization digests
- [ ] T012 Verify: Behavior events remain event-for-event equivalent - canonical event counts, order, kinds, logical IDs, required payload, and lifecycle status match
- [ ] T013 Verify: Derived council projections remain equivalent - terminal decisions, convergence state, minority evidence, artifacts, and projection fingerprints match
- [ ] T014 Verify: Failure, resume, and rollback semantics remain equivalent - timeout/error, contradiction, non-convergence, incomplete state, rollback, and checkpoint resumes agree
- [ ] T015 Verify: Ledger control-plane additions are safe - every behavior event is authorized and receipted, with zero unauthorized transitions, duplicate effects, or shadow writes
- [ ] T016 Verify: Normalization cannot conceal semantic drift - only explicitly allowlisted metadata differences pass and profile changes invalidate old receipts
- [ ] T017 Verify: Replays and supported completion-order permutations are deterministic - parity fingerprints and first-divergence results remain stable
- [ ] T018 Verify: Parity is a hard pre-cutover gate - the final report records zero unexplained diffs and leaves legacy authority unchanged
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/replay as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Shared shadow input**: Phase-014 shadow framework named by the phase brief
- **Mode state contract**: `deep-ai-council/references/structure/state_format.md`
- **Mode workflow contract**: `deep-ai-council/references/integration/loop_protocol.md`
<!-- /ANCHOR:cross-refs -->
