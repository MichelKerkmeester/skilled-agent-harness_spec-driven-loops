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
    last_updated_at: "2026-08-19T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Built the driver, CLI and both suites; 12 guards proven by negative control"
    next_safe_action: "Operator decision on the missing flip transitions"
    blockers:
      - "No mode can reach cutover_ready, so no mode can be enabled"
      - "deep-improvement-common has no working name on the append CLI"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/enablement-driver.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
    completion_pct: 65
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

- [x] **T-001** Derive each mode's reader set from its own projection manifest entries; flag any mode with no entry. [EVIDENCE: `deriveModeSurfaceSet` derives each mode's set from the shared manifest by prefix ownership; all 7 sets in `scratch/dryrun.json`. No mode lacks an entry, and `skill-benchmark`'s empty projectable set is reported rather than hidden]
- [x] **T-002** Fix and record the mode order as data. [EVIDENCE: `FLEET_MODE_ORDER` — `mode-surface-map.ts:21`]
- [x] **T-003** Capture pre-run authority record bytes for all seven modes. [EVIDENCE: `scratch/authority-prerun-capture.md`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-004** Build the driver loop with external per-mode state. [EVIDENCE: `runFleetEnablement` with an external JSON state file — `enablement-driver.ts:97`]
- [ ] **T-005** Implement the per-mode step as the pilot's procedure, parameterised by mode. [PARTIAL: the step runs the reader-contract and flip checks and refuses with the on-disk state named. The pilot's procedure cannot be parameterised while the pilot's own flip is unreachable]
- [x] **T-006** Add stop-on-first-failure that names the mode and the failing check. [EVIDENCE: first failure returns with both mode and check named — `enablement-driver.ts:144`; `scratch/realrun.json`]
- [x] **T-007** Add the dry-run path that reports intent and touches no authority record. [EVIDENCE: the dry run calls `runStep` zero times and writes nothing — `enablement-driver.ts:122`; the CLI does not even construct the registry]
- [x] **T-008** Ensure each coordinator call requests exactly one mode. [EVIDENCE: one mode string per call, asserted by `requests exactly one mode per call`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-009** Dry run all six modes; diff authority records against T-003 and confirm no change. [EVIDENCE: dry run over all 7 planned modes; authority root byte-identical to the pre-run capture, sha256 `3728804f` on its single file]
- [x] **T-010** Inject a failure on one mode; confirm the stop and that later modes' records are byte-identical. [EVIDENCE: injected failure stops at the named mode; later modes never invoked and no authority record written]
- [ ] **T-011** Resume; confirm remaining modes enable and earlier ones are not re-flipped. [PARTIAL: resume proven at the driver by `resumes without re-running completed modes`; end-to-end resume needs a mode that can actually be enabled]
- [ ] **T-012** [P] Run each mode's reader contract against its own projected files. [BLOCKED: needs files projected by an enabled mode]
- [ ] **T-013** [P] Read all seven authority records independently; confirm ledger authority. [BLOCKED: all 8 records read `legacy_authoritative`]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T-014** Confirm the completed run required no operator input. [EVIDENCE: every dispatch and run in this phase completed without an operator prompt]
- [x] **T-015** Full suite re-run and reported as a delta against a captured baseline. [EVIDENCE: baseline `17 failed / 4111 passed / 39 skipped (4165)` in 7894s -> after `17 failed / 4152 passed / 39 skipped (4206)` in 7486s; +2 files and +41 tests, all passing and all this phase's; failing-file set diffed IDENTICAL, so no regression and no swap hiding behind an unchanged count]
- [x] **T-016** `validate.sh` on this folder with `--strict`; Errors: 0. [EVIDENCE: run from the final state after regenerating both metadata files; Errors: 0]
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
