---
title: "Tasks: Phase 009 Family Schema Migration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "070 phase 009 tasks"
  - "family schema migration tasks"
  - "deep-loop schema tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename/009-family-schema-migration"
    last_updated_at: "2026-05-05T18:25:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 009 schema migration task list"
    next_safe_action: "Orchestrator can run advisor_rebuild via MCP to recreate skill-graph.sqlite"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 009 Family Schema Migration

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

- [x] T001 Read `skill-graph-db.ts` fully and identify `DB_FILENAME` (`.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`)
- [x] T002 Search approved schema/type surfaces for `sk-deep` family-context literals (`rg`)
- [x] T003 Read existing Phase 008 artifact shape (`../008-final-cleanup/`)
- [x] T004 Create Phase 009 planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `description.json`, `graph-metadata.json`)
- [x] T005 Create ADR-001 decision record (`decision-record.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Rename `families.sk-deep` to `families.deep-loop` (`skill-graph.json`)
- [x] T011 Replace compiler `ALLOWED_FAMILIES` member `sk-deep` with `deep-loop` (`skill_graph_compiler.py`)
- [x] T012 Update deep-review family field (`.opencode/skills/deep-review/graph-metadata.json`)
- [x] T013 Update deep-research family field (`.opencode/skills/deep-research/graph-metadata.json`)
- [x] T020 Update `SkillFamily`, `ALLOWED_FAMILIES`, and SQL `CHECK` in source (`skill-graph-db.ts`)
- [x] T021 Update generated JS mirror (`dist/lib/skill-graph/skill-graph-db.js`)
- [x] T022 Update generated d.ts union mirror (`dist/lib/skill-graph/skill-graph-db.d.ts`)
- [x] T030 Update tool schema enum source (`tool-schemas.ts`)
- [x] T031 Update tool schema enum dist mirror (`dist/tool-schemas.js`)
- [x] T032 Update zod input schema enum source (`schemas/tool-input-schemas.ts`)
- [x] T033 Update zod input schema enum dist mirror (`dist/schemas/tool-input-schemas.js`)
- [x] T034 Update skill graph query family allow-list source (`handlers/skill-graph/query.ts`)
- [x] T035 Update skill graph query family allow-list dist mirror (`dist/handlers/skill-graph/query.js`)
- [x] T040 Add Phase 009 child ID to `specs/` parent metadata (`../graph-metadata.json`)
- [x] T041 Add Phase 009 child ID to `.opencode/specs/` parent metadata mirror (`.opencode/specs/.../graph-metadata.json`)
- [x] T042 Delete `skill-graph.sqlite` (`.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite`)
- [x] T043 Delete SQLite WAL/SHM sidecars if present (`skill-graph.sqlite-wal`, `skill-graph.sqlite-shm`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 Run TypeScript/build verification and record evidence (evidence: `npm run typecheck` exit 0)
- [x] T051 Run Gate 1 family rename assertion (evidence: `Gate 1 PASSED`)
- [x] T052 Run Gate 2 per-skill family assertion (evidence: `Gate 2 PASSED`)
- [x] T053 Run Gate 3 compiler validate-only (evidence: `VALIDATION PASSED: all metadata files are valid`)
- [x] T054 Run compiler export-json pretty (evidence: output written to `skill-graph.json`)
- [x] T055 Run Gate 4 SQL CHECK grep in source and dist (evidence: source line 126 and dist line 53)
- [x] T056 Run Gate 5 SQLite absence check (evidence: `No such file or directory`)
- [x] T057 Run Gate 6 strict validation for Phase 009 (evidence: strict validation exit 0)
- [x] T058 Run Gate 6 strict validation for parent packet (evidence: strict validation exit 0)
- [x] T059 Author implementation summary with results (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Write sets A-D are complete with evidence.
- [x] Compiler validation, compiler export, TypeScript/build verification, and strict validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Parent Packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
