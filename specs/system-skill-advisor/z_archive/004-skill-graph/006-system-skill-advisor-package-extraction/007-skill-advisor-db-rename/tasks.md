---
title: "Tasks: Skill graph DB rename"
description: "Completed task list for renaming the spec-kit skill metadata index DB and removing old-path skill-graph.sqlite files."
trigger_phrases:
  - "skill graph db rename tasks"
  - "graph metadata index tasks"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/007-skill-advisor-db-rename"
    last_updated_at: "2026-05-14T13:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed all rename and cleanup tasks"
    next_safe_action: "Operator review and commit"
    blockers: []
---
# Tasks: Skill graph DB rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Read required spec-kit `context-server.ts`, skill-graph DB, handler, schema, migration, fixture, and 006 summary files.
- [x] T002 Confirm root cause: spec-kit `skill_graph_*` metadata indexer used `DB_FILENAME = 'skill-graph.sqlite'`.
- [x] T003 Choose Option B rename to preserve tool ownership and avoid advisor/store coupling.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Rename spec-kit DB filename to `graph-metadata-index.sqlite`.
- [x] T005 Make `context-server.ts` consume the exported DB filename constant.
- [x] T006 Update checkpoint migration scripts to use shared database config.
- [x] T007 Update schema and README references to the new filename.
- [x] T008 Migrate stale advisor fixtures from old spec-kit paths to advisor-owned or temp-local paths.
- [x] T009 Preserve temp-only bare `skill-graph.sqlite` test fixtures where they do not touch repo paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T010 Build `@spec-kit/mcp-server`.
- [x] T011 Run advisor package Vitest and record 164/224 pass count.
- [x] T012 Run targeted spec-kit skill-advisor stress Vitest.
- [x] T013 Smoke-start memory MCP and confirm new DB filename at spec-kit path.
- [x] T014 Smoke-start standalone advisor launcher and confirm canonical advisor DB path.
- [x] T015 Stop stale spec-kit memory launcher processes holding the old DB and remove only the old `skill-graph.sqlite` trio.
- [x] T016 Update parent metadata to include child 007 and point `last_active_child_id` at it.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Spec-kit build passed.
- [x] Memory MCP and advisor launcher smoke checks passed.
- [x] Old spec-kit `skill-graph.sqlite*` files are absent.
- [x] Checklist evidence is complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
