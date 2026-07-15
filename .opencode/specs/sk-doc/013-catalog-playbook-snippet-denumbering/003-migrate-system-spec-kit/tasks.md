---
title: "Tasks: Migrate system-spec-kit (Wave A) [133/003/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "003-migrate-system-spec-kit completion"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/013-catalog-playbook-snippet-denumbering/003-migrate-system-spec-kit"
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
# Tasks: Migrate system-spec-kit (Wave A)

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

- [x] T003 Apply collision resolution (4 files -> distinct slugs) + rewrite their refs
- [x] T004 Run denumber tool on feature_catalog --apply (318)
- [x] T005 Run denumber tool on manual_testing_playbook --apply (377)
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
