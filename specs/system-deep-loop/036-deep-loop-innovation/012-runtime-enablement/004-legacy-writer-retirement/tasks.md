---
title: "Tasks: Legacy Writer Retirement"
description: "Task breakdown for inventorying and removing direct-append paths, adding the enforcement guard, and confirming legacy files remain produced by the projection."
trigger_phrases:
  - "legacy writer retirement tasks"
  - "direct append removal tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed retirement into three phases"
    next_safe_action: "Inventory direct-append paths tree-wide"
    blockers:
      - "Predecessor 003-fleet-enablement must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Legacy Writer Retirement

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

- [B] **T-001** Inventory every direct-append path tree-wide: protocol documents and executable code.
- [ ] **T-002** Capture, per mode, the current contents of every manifest-named legacy file.
- [ ] **T-003** Capture authority record bytes for all seven modes.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T-004** Remove direct-append instructions from every mode's protocol documents.
- [ ] **T-005** Remove or neutralise each executable direct-append path; record per path which and why.
- [ ] **T-006** Add the enforcement guard that fails a post-retirement direct append.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-007** Re-run tree-wide searches; confirm nothing remains, including untouched files.
- [ ] **T-008** Attempt a real direct append; confirm the guard fires.
- [ ] **T-009** [P] Run each mode; confirm every manifest-named legacy file exists and is current versus T-002.
- [ ] **T-010** [P] Run every consumer of every legacy file; record exit statuses.
- [ ] **T-011** [P] Diff all seven authority records against T-003.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] **T-012** Full suite re-run and reported as a delta against a captured baseline.
- [ ] **T-013** `validate.sh` on this folder with `--strict`; Errors: 0.
- [ ] **T-014** `implementation-summary.md` records the inventory, the per-path decisions, and the guard firing.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Predecessor | `../003-fleet-enablement/` |
| Successor | `../005-whole-system-gate/` |
<!-- /ANCHOR:cross-refs -->
