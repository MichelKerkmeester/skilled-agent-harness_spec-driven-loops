---
title: "Tasks: Revert the swimlane example widening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "swimlane revert tasks"
  - "125 sk-doc phase 018 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/018-swimlane-revert"
    last_updated_at: "2026-07-07T11:15:05.809Z"
    last_updated_by: "claude-opus"
    recent_action: "Author phase-018 tasks; edits applied"
    next_safe_action: "Validate and close"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Revert the swimlane example widening

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Confirm the pre-widening blob is an ancestor of HEAD and resolves
- [x] T002 Measure label rows + box-border widths char-accurately
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Restore original geometry (`git checkout <blob>^ -- system_architecture_swimlane.md`)
- [x] T004 Re-add the 2 `[YES]`/`[NO]` labels at constant width (lines 118, 218)
- [x] T005 Normalize the single 14-char outlier box to 18 (lines 121-126)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `validate_flowchart.sh` exit 0 (decision-labels pass, box-width consistent)
- [x] T007 `diff` vs original blob shows only the label + box lines
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Asset == original geometry + 2 labels + 1 normalized box
- [x] Validator exit 0
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
