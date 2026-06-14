---
title: "Tasks: 001 — Schema + Backfill"
description: "T### task list for the schema + backfill sub-phase: derived table, BLOB reuse, resumable index-scan backfill, save-time hook."
trigger_phrases:
  - "027 phase 004 schema backfill tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/001-schema-backfill"
    last_updated_at: "2026-06-10T07:29:23Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed v34 schema and gated trigger backfill"
    next_safe_action: "Start 002 semantic matcher implementation"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Add `memory_trigger_embeddings` table to schema, forward-only (REQ-004) (`mcp_server/lib/search/vector-index-schema.ts`) — v34 migration and fresh bootstrap create the table.
- [x] T002 [P] Confirm BLOB embedding storage reuse via existing `embedding_cache` (REQ-004) (`mcp_server/lib/cache/embedding-cache.ts`) — backfill stores phrase vectors through `storeEmbedding()` with profile/input kind keys.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add resumable per-memory backfill in the index-scan handler (REQ-005, REQ-006) (`mcp_server/handlers/memory-index.ts`) — scan completion calls the default-off backfill helper.
- [x] T004 Reconcile save-time hook as deferred from this narrowed phase scope (REQ-006) (`mcp_server/handlers/save/embedding-pipeline.ts`) — no save-path code changed; scan backfill remains the only write path implemented here.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Migration test on existing-DB fixture (table created cleanly) — `vector-index-schema-migration-refinements.vitest.ts` covers v34.
- [x] T006 Resume-after-interrupt test (no duplicate ready rows; no partial row marked ready) — `trigger-embedding-backfill.vitest.ts` covers re-run and store failure.
- [x] T007 Default-off backfill gate validated — `trigger-embedding-backfill.vitest.ts` proves no rows or provider calls when disabled.
- [x] T008 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/001-schema-backfill --strict` — completed after doc reconciliation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Migration + resumable-backfill tests green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md` (semantic trigger fallback phase parent)
<!-- /ANCHOR:cross-refs -->
