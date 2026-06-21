---
title: "Tasks: Feature Catalog Cleanup"
description: "PENDING task list for feature catalog sweep."
trigger_phrases:
  - "028 release cleanup feature catalogs tasks"
  - "feature-catalogs cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/000-release-cleanup/004-feature-catalogs"
    last_updated_at: "2026-06-19T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed cleanup tasks, all marked done"
    next_safe_action: "Phase complete, successor is ../005-manual-testing-playbooks"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-004-feature-catalogs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Feature Catalog Cleanup

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

- [x] T001 Run discovery for feature catalog sweep.
- [x] T002 Save candidate paths as phase evidence.
- [x] T003 Confirm packet 030 is not in the candidate list.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Review every candidate document against current source files.
- [x] T005 Remove stale file, feature and route claims.
- [x] T006 Apply HVR voice edits.
- [x] T007 Keep out-of-scope document families unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run em dash scan.
- [x] T009 Run semicolon character scan.
- [x] T010 Run stale-reference scan.
- [x] T011 Run strict validation for this child folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification evidence is recorded.
- [x] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
