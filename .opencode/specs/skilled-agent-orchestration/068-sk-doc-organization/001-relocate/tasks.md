---
title: "Tasks: Phase 1: relocate"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "068/001 tasks"
  - "relocate tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "068-sk-doc-organization/001-relocate"
    last_updated_at: "2026-05-05T08:15:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored tasks.md after Phase 1 work executed"
    next_safe_action: "Author implementation-summary.md with actual outcomes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase1-authoring"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: relocate

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Verify on main branch (`git branch --show-current`)
- [x] T002 Verify target paths do not exist (no overwrite hazard)
- [x] T003 Verify source paths exist (`assets/documentation/feature_catalog/`, `assets/agents/agent_template.md`, etc.)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 git mv feature_catalog/ to assets/ root (`.opencode/skills/sk-doc/assets/feature_catalog/`)
- [x] T005 git mv testing_playbook/ to assets/ root (`.opencode/skills/sk-doc/assets/testing_playbook/`)
- [x] T006 git mv agent_template.md to assets/ root (`.opencode/skills/sk-doc/assets/agent_template.md`)
- [x] T007 git mv command_template.md to assets/ root (`.opencode/skills/sk-doc/assets/command_template.md`)
- [x] T008 rmdir empty assets/agents/ folder
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm `ls -la assets/` shows new layout (4 promoted items at root)
- [x] T010 Confirm `test ! -e assets/agents` exits 0 (folder gone)
- [x] T011 Confirm `git status --porcelain` shows 6 R-lines (renames)
- [x] T012 Commit Phase 1 work on main with `feat(sk-doc): relocate ... (068/001)` message
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001–T012 marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (commit ccd73ef55)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
