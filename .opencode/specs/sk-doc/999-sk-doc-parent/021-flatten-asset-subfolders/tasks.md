---
title: "Tasks: Flatten redundant asset subfolders"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "flatten asset subfolders tasks"
  - "125 sk-doc phase 021 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/021-flatten-asset-subfolders"
    last_updated_at: "2026-07-07T14:54:32.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-021 tasks"
    next_safe_action: "Validate and commit"
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
# Tasks: Flatten redundant asset subfolders

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

- [x] T001 Scan all sk-doc packets; identify the six redundant single-subfolders
- [x] T002 Confirm collision-safe (each assets/ held only the one subfolder)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `git mv` 17 templates up into each packet's assets/; remove empty subdirs
- [x] T004 Anchored packet-scoped path sweep across 33 live reference files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 0 stale live subfolder refs (rg fixed-strings, specs/changelog excluded)
- [x] T006 Every rewritten template path resolves (test -e, missing=0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Six subfolders gone; 17 templates loose in assets/
- [x] 0 stale live refs; all rewritten paths resolve
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
