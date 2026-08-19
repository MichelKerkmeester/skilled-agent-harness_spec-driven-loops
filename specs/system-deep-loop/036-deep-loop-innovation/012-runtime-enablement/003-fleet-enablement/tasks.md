---
title: "Tasks: Fleet Enablement"
description: "Task breakdown for the serial enablement driver: manifest-derived reader contracts, dry run, injected-failure stop, resume, and final fleet state verification."
trigger_phrases:
  - "fleet enablement tasks"
  - "enablement driver tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed the fleet driver into three phases"
    next_safe_action: "Derive per-mode reader sets from the manifest"
    blockers:
      - "Predecessor 002-deep-research-enablement must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Fleet Enablement

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

- [B] **T-001** Derive each mode's reader set from its own projection manifest entries; flag any mode with no entry.
- [ ] **T-002** Fix and record the mode order as data.
- [ ] **T-003** Capture pre-run authority record bytes for all seven modes.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T-004** Build the driver loop with external per-mode state.
- [ ] **T-005** Implement the per-mode step as the pilot's procedure, parameterised by mode.
- [ ] **T-006** Add stop-on-first-failure that names the mode and the failing check.
- [ ] **T-007** Add the dry-run path that reports intent and touches no authority record.
- [ ] **T-008** Ensure each coordinator call requests exactly one mode.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-009** Dry run all six modes; diff authority records against T-003 and confirm no change.
- [ ] **T-010** Inject a failure on one mode; confirm the stop and that later modes' records are byte-identical.
- [ ] **T-011** Resume; confirm remaining modes enable and earlier ones are not re-flipped.
- [ ] **T-012** [P] Run each mode's reader contract against its own projected files.
- [ ] **T-013** [P] Read all seven authority records independently; confirm ledger authority.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] **T-014** Confirm the completed run required no operator input.
- [ ] **T-015** Full suite re-run and reported as a delta against a captured baseline.
- [ ] **T-016** `validate.sh` on this folder with `--strict`; Errors: 0.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Predecessor | `../002-deep-research-enablement/` |
| Successor | `../004-legacy-writer-retirement/` |
<!-- /ANCHOR:cross-refs -->
