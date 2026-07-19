---
title: "Tasks: 001 Exemplars Schema"
description: "Task list for Coco exemplar schema child phase."
trigger_phrases:
  - "027 011 001 tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/008-coco-memory-context-extras/001-exemplars-schema"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child tasks"
    next_safe_action: "Start T001 after dependency lands"
    blockers: ["system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork"]
    key_files: ["tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-001-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 001 Exemplars Schema

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read CocoIndex fork schema/indexer paths (`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/`) [45m]
- [ ] T002 Define exemplar package path and exports (`cocoindex_code/exemplars/__init__.py`) [15m]
- [ ] T003 Confirm vector dimension source for exemplar embeddings (`schema.py` or fork equivalent) [30m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `examples_schema.py` schema constants and table name [1h]
- [ ] T005 Implement idempotent SQLite/vec0 migration helper [2h]
- [ ] T006 Implement schema validation helper for required columns [1h]
- [ ] T007 Add privacy guard so comments cannot be accepted by exemplar row builders [1h]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Add pytest coverage for empty-database migration [45m]
- [ ] T009 Add pytest coverage for repeat migration [30m]
- [ ] T010 Add privacy grep or row-shape test for absent comment fields [30m]
- [ ] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras/001-exemplars-schema --strict` [15m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked complete.
- [ ] `examples_schema.py` has schema and migration tests.
- [ ] Child strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
