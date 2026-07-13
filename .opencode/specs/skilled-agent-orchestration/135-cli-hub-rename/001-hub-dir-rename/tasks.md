---
title: "Tasks: Phase 1 Hub Directory Rename"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename/001-hub-dir-rename"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded completed rename tasks"
    next_safe_action: "Proceed through advisor alignment"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: hub-dir-rename

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Confirm the existing hub and nested executor boundaries.
- [x] T002 Select a direct `git mv` strategy in `decision-record.md`.
- [x] T003 Define downstream advisor and reference workstreams.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rename the external CLI hub to `.opencode/skills/cli-external-orchestration/`.
- [x] T005 Preserve nested executor packet layout.
- [x] T006 Confirm the move is represented as `git mv` evidence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm the canonical destination exists.
- [x] T008 Record phase evidence and rollback.
- [x] T009 Hand off consumer alignment to phase 2.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All phase tasks are marked complete.
- [x] No blocked phase tasks remain.
- [x] Canonical hub path is established.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
