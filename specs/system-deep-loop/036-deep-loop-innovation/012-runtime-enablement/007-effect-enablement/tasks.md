---
title: "Tasks: Effect Enablement"
description: "Task breakdown for wiring the fail-closed effect producer at the dispatch seam, the fail-closed negative control, and the coverage-reads-records proof."
trigger_phrases:
  - "effect enablement tasks"
  - "fail-closed producer tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement"
    last_updated_at: "2026-08-21T15:30:00Z"
    last_updated_by: "claude"
    recent_action: "Broke the phase into setup, wiring, and verification tasks"
    next_safe_action: "Run T-001 baseline and T-002 contract read at the seam"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Effect Enablement

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

- [ ] **T-001** Capture the runtime suite baseline before any edit.
- [ ] **T-002** Read the effect gateway, event contracts, the audited executor input contract, and restart-facts reader; record the effect-ledger id, the intent payload shape, and how `fanout-run.cjs` binds `loopType`/`lineageDir`.
- [ ] **T-003** Confirm by execution that the live launcher spawns unaudited, the audited path has zero callers, and the reader refuses over the absent ledger.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T-004** Route the live executor spawn in `fanout-run.cjs` through the audited executor path, passing the mode and run directory.
- [ ] **T-005** Construct the per-run effect ledger at `${lineageDir}/${mode}-effect-ledger`; append a fail-closed effect intent before the spawn and do not spawn on a failed durable append.
- [ ] **T-006** Append an effect confirmation after the dispatch settles, keyed to the intent's effect id.
- [ ] **T-007** Confirm the fan-out behavior and the best-effort receipt pair are untouched.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-008** Prove intent-before-spawn by sequence on a real dispatch.
- [ ] **T-009** Run the fail-closed negative control: perturb only the durable append, assert zero spawns, restore, assert a spawn; record both outcomes.
- [ ] **T-010** [P] Run the restart-facts reader over the populated ledger; confirm non-empty coverage rather than the empty-list pass.
- [ ] **T-011** [P] Confirm the scoped diff touches only the seam, its effect-ledger construction, and the tests.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] **T-012** Full suite re-run and reported as a delta against the T-001 baseline.
- [ ] **T-013** `validate.sh` on this folder with `--strict`; Errors: 0.
- [ ] **T-014** `implementation-summary.md` records the intent/confirm evidence, the fail-closed negative control, and the coverage proof.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Consumer of this evidence | `../002-deep-research-enablement/` and `../003-fleet-enablement/` |
| Downstream stranding decision | `../004-legacy-writer-retirement/` |
<!-- /ANCHOR:cross-refs -->
