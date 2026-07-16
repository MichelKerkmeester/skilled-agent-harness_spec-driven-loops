---
title: "Tasks: Spec Regrouping Renumber Reindex"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "renumber specs"
  - "reindex specs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-speckit/029-memory-search-intelligence/000-release-cleanup/014-spec-regrouping-renumber-reindex"
    last_updated_at: "2026-07-04T17:31:31.478Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Correction tasks executed"
    next_safe_action: "Retry reindex after daemon repair"
    blockers:
      - "memory_index_scan returns E040"
    key_files: []
    session_dedup:
      fingerprint: "sha256:a02306df0e6b930c05cc45a5f7c7da45a07e8c2229d5afc4d3265706fe987b99"
      session_id: "spec-regrouping-renumber-reindex"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Spec Regrouping Renumber Reindex

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

- [x] T001 Confirm phase folder with user.
- [x] T002 Load system-spec-kit and sk-doc guidance.
- [x] T003 [P] Inventory target spec roots with parallel read-only agents and direct reads.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build live rename maps from current direct child folders.
- [x] T005 Rename mapped folders through temporary names.
- [x] T006 Update current path references under affected roots.
- [x] T007 Add missing root `description.json` and `graph-metadata.json` files for `design` and `deep-loops`.
- [x] T012 Correct active orchestration numbering from `150`-`156` to `117`-`123`.
- [x] T013 Regenerate root orchestration `children_ids` from live archive and active directories.
- [x] T014 Refresh phase docs with migration evidence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Read resulting directory listings for affected roots.
- [x] T009 Search affected roots for stale current references.
- [B] T010 Run Spec Kit Memory reindex scans. Blocked: MCP timed out; CLI scan returned `E040`; CLI health returned `backend unavailable: timeout` with exit code `75`.
- [x] T011 Run strict validation for this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`. Blocked by T010.
- [ ] No `[B]` blocked tasks remaining. Blocked by memory daemon.
- [x] Verification evidence recorded in `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
