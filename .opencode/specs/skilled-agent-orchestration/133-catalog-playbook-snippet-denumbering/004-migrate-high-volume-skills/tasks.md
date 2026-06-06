---
title: "Tasks: Migrate High-Volume Skills (Wave B) [133/004/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "004-migrate-high-volume-skills completion"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/004-migrate-high-volume-skills"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete; all tasks executed + verified"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Migrate High-Volume Skills (Wave B)

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

- [x] T001 Confirm phase 002 tool green + worktree ready
- [x] T002 Slice per-tree manifests for this wave
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run denumber tool on all 14 trees across 7 skills --apply (548)
- [x] T004 Per-skill verify (grep + count)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Global gate: 0 numbered snippet files remain in scope
- [x] T011 R-status check: renames preserved (no stray add/delete)
- [x] T012 Scoped commit in the worktree
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification gates green; evidence in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
