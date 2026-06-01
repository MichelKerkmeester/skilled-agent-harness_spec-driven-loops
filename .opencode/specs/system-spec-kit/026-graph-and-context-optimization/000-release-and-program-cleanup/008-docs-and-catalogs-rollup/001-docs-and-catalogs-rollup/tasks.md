---
title: "Tasks: Docs and Catalogs Rollup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "docs rollup tasks"
  - "umbrella docs tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-docs-and-catalogs-rollup"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Rollup complete"
    next_safe_action: "None, packet complete"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000022"
      session_id: "docs-rollup-2026-06-01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Docs and Catalogs Rollup

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

- [x] T001 Gather 026 shipped-capability evidence from changelogs, rollups, audit
- [x] T002 Confirm the 7 umbrella docs exist and note merged-phase-map.md is gone post-reorg
- [x] T003 [P] Confirm code-graph and advisor handlers are extracted (out of scope here)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Gap analysis per umbrella doc (read-only, vs changelogs)
- [x] T005 Apply surgical additions to README.md
- [x] T006 Apply surgical additions to SKILL.md and system-spec-kit README.md
- [x] T007 Apply surgical additions to mcp_server README.md and INSTALL_GUIDE.md
- [x] T008 Apply surgical additions to feature_catalog.md and manual_testing_playbook.md
- [x] T009 Update tool counts where justified by the net-new memory_embedding_reconcile tool
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Content-preservation diff per doc (additions-only)
- [x] T011 HVR lint on added lines, fix the one INSTALL_GUIDE prose semicolon
- [x] T012 Verify all newly-referenced file paths exist
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All gaps applied, sync not aspiration
- [x] No `[B]` blocked tasks remaining
- [x] Content preserved, HVR clean, links valid
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
