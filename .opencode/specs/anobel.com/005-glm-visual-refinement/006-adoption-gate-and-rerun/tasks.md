---
title: "Tasks: adoption-gate-and-rerun"
description: "Task Format: T### [P?] Description (file path). Ordered tasks for the final adoption gate plus the measured 45-tile re-run; unchecked - implement only after phases 001-005 ship."
trigger_phrases:
  - "adoption gate tasks"
  - "rerun tasks"
  - "measured re-run task list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/006-adoption-gate-and-rerun"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Folded panel: pre-registered ADOPT rule, de-circular gate, recovered-2D floor"
    next_safe_action: "Implement adoption-gate + ground-truth calibration before the re-run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: adoption-gate-and-rerun

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm phases 001-005 ship + validate (`bash .../scripts/spec/validate.sh ../ --recursive`)
- [ ] T002 Snapshot baseline metrics + prior per-tile audit scores into a fixture (27/45, mean 81.1, ~41-pt delta) (`004-bento-visuals/research/rerun/baseline.json`)
- [ ] T002b Capture the human-labeled ground-truth set (25-30 stratified tiles) BEFORE the batch; freeze the §5 decision rule (`004-bento-visuals/research/rerun/ground-truth.json`)
- [ ] T003 [P] Assemble the 45-tile manifest with primitive labels (linear-flow vs 2D-positioned) for the delta computation (`004-bento-visuals/research/rerun/tiles-manifest.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement the adoption-gate decision: four-deterministic-sub-gate AND -> ship / keep-prior / downgrade; MiniMax recorded as shadow (non-blocking); keep-prior quality floor; record failing sub-gates (`004-bento-visuals/research/rerun/adoption-gate.mjs`)
- [ ] T005 Implement the re-run driver wiring 001-005 stages + adoption gate + per-tile JSONL ledger + aborting cost breach flag; resumable + idempotent per tile (`004-bento-visuals/research/rerun/rerun-45.mjs`)
- [ ] T006 Implement the metrics computer: SHIP rate + confidence intervals, diagram-vs-linear delta, contrast exit-0, cost totals vs the realistic ceiling (`004-bento-visuals/research/rerun/compute-lift.mjs`)
- [ ] T007 Add paired tile-level deltas + `recovered-2D` / `downgraded-to-linear` / `improved-linear` tagging + recovered-2D floor + linear-regression detection + gate-config ablation (loose/deterministic/full) (`004-bento-visuals/research/rerun/compute-lift.mjs`)
- [ ] T008 Dry-run 3-5 stratified tiles end-to-end; calibrate the gate (and MiniMax shadow) against the ground-truth labels + calibrate the realistic cost ceiling before the full batch (`004-bento-visuals/research/rerun/rerun-45.mjs`)
- [ ] T009 Run the full 45-tile batch (3 repeated runs where feasible for the sign test); record the JSONL ledger + dispatch-failure log (`004-bento-visuals/research/rerun/rerun-results.jsonl`)
- [ ] T010 Generate the lift report (new-vs-baseline with CIs + gate-tax ablation + ground-truth precision/recall + the pre-registered §5 verdict) (`004-bento-visuals/research/rerun/rerun-report.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify SHIP (with CIs) / delta / contrast / cost / recovered-2D floor / gate-tax against the SC-001..SC-007 thresholds
- [ ] T012 Human spot-check accepted tiles for RC-7 slop + confirm linear no-regression = 100% (SC-005); confirm gate precision/recall vs ground-truth (< 15% disagreed)
- [ ] T013 Reconcile spec / plan / tasks / checklist; run `validate.sh --strict` on this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (predecessor phases 001-005 shipped)
- [ ] Lift report records SHIP / delta / contrast / cost vs baseline with one adopt/iterate/reject recommendation
- [ ] Manual verification passed (no linear regressions, no locked-field regressions)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: `../../004-bento-visuals/research/iterations/iter-r4-pipeline.md` (step 11 + predicted lift), `iter-r4-risk.md` (pilot order + go/no-go bars)
<!-- /ANCHOR:cross-refs -->
