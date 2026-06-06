---
title: "Tasks: 001 — Schema + Backfill"
description: "T### task list for the schema + backfill sub-phase: derived table, BLOB reuse, resumable index-scan backfill, save-time hook."
trigger_phrases:
  - "027 phase 004 schema backfill tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/001-schema-backfill"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Extracted Sub-Phase 1 tasks from 007 leaf tasks"
    next_safe_action: "Claim T001 (schema migration)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 001 — Schema + Backfill

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

**Task Format**: `T### [P?] Description (file path)` • `REQ-NNN` = parent spec requirement
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Add `memory_trigger_embeddings` table to schema, forward-only (REQ-004) (`mcp_server/lib/search/vector-index-schema.ts`)
- [ ] T002 [P] Confirm BLOB embedding storage reuse via existing `embedding_cache` (REQ-004) (`mcp_server/lib/cache/embedding-cache.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add resumable per-memory backfill in the index-scan handler (REQ-005, REQ-006) (`mcp_server/handlers/memory-index.ts`)
- [ ] T004 Add best-effort, non-blocking save-time embedding hook (REQ-006) (`mcp_server/handlers/save/embedding-pipeline.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Migration test on existing-DB fixture (table created cleanly)
- [ ] T006 Resume-after-interrupt test (no duplicate ready rows; no partial row marked ready)
- [ ] T007 Save-flow non-blocking test (`embedding_status='failed'` recorded on provider failure)
- [ ] T008 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/001-schema-backfill --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Migration + resumable-backfill tests green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md` (semantic trigger fallback phase parent)
<!-- /ANCHOR:cross-refs -->
