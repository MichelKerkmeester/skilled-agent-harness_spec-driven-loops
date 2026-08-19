---
title: "Tasks: Enablement Closeout"
description: "Task breakdown for the status sweep, supersession marking, catalog and playbook updates, and the recursive validation that closes the epic."
trigger_phrases:
  - "enablement closeout tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/006-enablement-closeout"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/006-enablement-closeout"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed closeout into three phases"
    next_safe_action: "Sweep 036 for invalidated claims"
    blockers:
      - "Predecessor 005-whole-system-gate must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Enablement Closeout

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

- [x] **T-001** Sweep `036` and list every invalidated claim, packet by packet, with evidence. → `scratch/claim-sweep.md`
- [x] **T-002** Identify packets superseded in premise rather than merely out of date. → none superseded; one claim correction, at `implementation-summary.md:139` of the flip packet
- [x] **T-003** Read the gate receipt so the closeout points at it rather than restating it. → `005-whole-system-gate/scratch/receipt.json`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-004** Reconcile each packet's status against its own evidence, individually. → the five `012` children already match their own checklists; the flip packet keeps `Completed`
- [x] **T-005** Mark superseded packets with a pointer to what superseded them. → additive item 4 in the flip packet's `implementation-summary.md`
- [B] **T-006** Update the feature catalog to describe the gateway, projection, and ledger authority. → REFUSED: requires describing an enabled runtime; the measurement says it is not enabled
- [B] **T-007** Update the manual-testing playbook so its procedures exercise the gateway path. → REFUSED: same reason
- [x] **T-008** Update mode-facing documents that still present direct appends as normal. → none require updating; both `append-mode-event` docs already cite the gateway (see T-012)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] **T-009** Re-sweep `036`; confirm no invalidated claim remains. → BLOCKED: the remaining invalidated claim is the unreachable flip
- [B] **T-010** [P] Spot-check catalog claims against named symbols in the code. → BLOCKED on T-006
- [B] **T-011** [P] Follow one playbook procedure literally; confirm it exercises the gateway. → BLOCKED on T-007
- [x] **T-012** [P] Search for any remaining document presenting a direct append as normal. → 2 docs cite `append-mode-event`, both alongside the gateway; `profiling-audit-log.md:112` writes a profiling log, not a ledger surface
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T-013** `validate.sh --recursive --strict` over `036` reports Errors: 0. → 10 folders, all Errors: 0; exit 2 from 4 pre-existing `PHASE_LINKS` warnings outside this phase
- [x] **T-014** `implementation-summary.md` records the sweep results and the supersession list.
- [x] **T-015** Confirm no runtime code or authority record changed in this phase. → runtime tree `git status` empty; diff is 8 paths, all under `specs/`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Predecessor | `../005-whole-system-gate/` |
| Parent | `../` |
<!-- /ANCHOR:cross-refs -->
