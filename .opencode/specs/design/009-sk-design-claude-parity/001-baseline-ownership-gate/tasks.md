---
title: "Tasks: Phase 001 — Baseline Ownership Gate"
description: "Level 2 task list for inspecting sk-design status, capturing baseline evidence, resolving ownership, and marking gates before implementation."
trigger_phrases:
  - "tasks"
  - "baseline"
  - "ownership"
  - "sk-design"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/design/009-sk-design-claude-parity/001-baseline-ownership-gate/"
    last_updated_at: "2026-07-05"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Created planned Level 2 baseline ownership gate docs."
    next_safe_action: "Collect read-only sk-design status and benchmark baseline before implementation."
---
# Tasks: Phase 001 — Baseline Ownership Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or evidence target) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Collect read-only worktree status for `sk-design` paths (status evidence) [10m]
- [ ] T002 List every touched `sk-design` file with owner/disposition columns (`checklist.md` or inventory table) [15m]
- [ ] T003 [P] Identify pending changes that belong to parent, sibling, user, or later phase scope (inventory notes) [10m]
- [ ] T004 Mark any out-of-scope touched files as blockers (gate notes) [5m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Baseline Evidence
- [ ] T005 Record the canonical baseline command or accepted baseline artifact (baseline notes) [10m]
- [ ] T006 Capture benchmark baseline output with timestamp and environment notes (baseline artifact) [20m]
- [ ] T007 [P] Record current parent invariants that benchmark thresholds must protect (`spec.md`) [10m]

### Acceptance Thresholds
- [ ] T008 Define later-phase pass/fail thresholds for parity, benchmark score, and regression tolerance (`plan.md`) [15m]
- [ ] T009 Identify authority for accepting threshold deltas (`checklist.md`) [5m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Ownership Classification
- [ ] T010 Assign each pending change to preserve, revert, absorb, defer, or block (inventory table) [30m]
- [ ] T011 Record the rationale for each preserve/revert/absorb/defer/block decision (`implementation-summary.md`) [20m]
- [ ] T012 Confirm no implementation writes are allowed while any P0 ownership row is unresolved (`checklist.md`) [5m]

### Authority
- [ ] T013 Confirm release authority for accepting the baseline gate (`checklist.md`) [10m]
- [ ] T014 Confirm threshold authority for benchmark deltas (`plan.md`) [10m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Gate Marking and Handoff (20-30 minutes)

### Verification
- [ ] T015 Run strict spec validation for this phase folder (validation evidence) [5m]
- [ ] T016 Update checklist P0/P1 rows with evidence or approved deferral (`checklist.md`) [15m]
- [ ] T017 Record go/no-go status for later implementation (`implementation-summary.md`) [5m]

### Documentation
- [ ] T018 Ensure docs do not claim implementation completion (`implementation-summary.md`) [5m]
- [ ] T019 Record rollback path and stop triggers (`plan.md`) [5m]

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 ownership gates are verified with evidence.
- [ ] No `[B]` blocked tasks remain without user-approved deferral.
- [ ] Baseline benchmark evidence is captured or deferral is approved.
- [ ] Rollback path is named and non-destructive first.
- [ ] Later implementation phases have an explicit go/no-go statement.
- [ ] Checklist.md reflects current evidence state.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
