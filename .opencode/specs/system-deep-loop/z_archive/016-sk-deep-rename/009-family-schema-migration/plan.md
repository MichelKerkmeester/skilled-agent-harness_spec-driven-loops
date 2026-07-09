---
title: "Implementation Plan: Phase 009 Family Schema Migration"
description: "Execute the deep-loop schema migration in order: planning artifacts, family rename, SQL CHECK and enum mirrors, SQLite reset, compiler/build verification, and strict validation."
trigger_phrases:
  - "070 phase 009 plan"
  - "family schema migration plan"
  - "deep-loop schema plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/016-sk-deep-rename/009-family-schema-migration"
    last_updated_at: "2026-05-05T18:25:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 009 implementation plan"
    next_safe_action: "Orchestrator can run advisor_rebuild via MCP to recreate skill-graph.sqlite"
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 009 Family Schema Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, generated JavaScript, Python, JSON, SQLite, Markdown |
| **Framework** | OpenCode system code and Spec Kit Level 2 phase documentation |
| **Storage** | SQLite skill graph database plus Git-tracked metadata and generated mirrors |
| **Testing** | TypeScript/build check, compiler validate/export, JSON assertions, grep, strict spec validation |

### Overview
Phase 009 converts `deep-loop` from a reverted metadata edit into a schema-supported family value. The migration updates every active family validation surface, deletes the old SQLite schema, and leaves the orchestrator-owned advisor rebuild to recreate the database.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User pre-approved `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename`.
- [x] `skill-graph-db.ts` read fully before editing.
- [x] SQLite filename identified as `skill-graph.sqlite`.
- [x] Family-context occurrences found with `rg`.
- [x] Existing Phase 008 packet shape inspected before creating Phase 009 docs.

### Definition of Done
- [x] Family rename is present in graph source, compiler allow-list, and per-skill metadata.
- [x] SQL `CHECK` constraints are updated in TypeScript source and dist JavaScript.
- [x] Type/schema family enum mirrors are updated.
- [x] `skill-graph.sqlite` and sidecars are removed.
- [x] Compiler validate/export and TypeScript/build verification pass.
- [x] Phase 009 and parent strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Schema-first metadata migration. The live family value changes only after the database schema, type unions, tool schemas, handler allow-lists, compiler validation, and generated runtime mirrors agree on the same `deep-loop` value.

### Key Components
- **Schema source**: `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`.
- **Generated runtime mirror**: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/skill-graph/skill-graph-db.js`.
- **Type mirror**: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/skill-graph/skill-graph-db.d.ts`.
- **Compiler**: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py`.
- **Compiled graph**: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`.
- **Database state**: `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite`.

### Data Flow
Per-skill metadata declares `family: deep-loop`. The Python compiler validates that family and emits `skill-graph.json`. The MCP server accepts `deep-loop` through TypeScript type unions, zod/tool schema enums, handler allow-lists, and SQLite insertion constraints. The deleted SQLite file is recreated by the orchestrator rebuild with the updated schema.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Write Set | Surface | Action | Verification |
|-----------|---------|--------|--------------|
| A | Graph source and per-skill metadata | Re-apply `deep-loop` family rename | JSON assertions and compiler validation |
| B | SQL schema source and dist mirrors | Update `SkillFamily`, allow-list, SQL `CHECK`, JS, and d.ts | Grep source/dist and TypeScript/build check |
| C | Tool schemas and query handler mirrors | Replace family enum/allow-list values | Targeted `rg` and TypeScript/build check |
| D | SQLite database | Delete stale DB and WAL/SHM sidecars | `ls` reports no such file |
| E | Phase artifacts | Create docs and parent metadata link | Strict spec validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Planning Artifacts
- [x] Create Phase 009 folder and Level 2 artifacts.
- [x] Record ADR-001 before code migration.
- [x] Add Phase 009 child ID to parent metadata mirrors.

### Phase 2: Family Rename Re-Apply
- [x] Rename `families.sk-deep` to `families.deep-loop`.
- [x] Update `ALLOWED_FAMILIES` in the Python compiler.
- [x] Update `deep-review` and `deep-research` graph metadata.

### Phase 3: Schema and Type Mirrors
- [x] Update `SkillFamily`, `ALLOWED_FAMILIES`, and SQL `CHECK` in TypeScript source.
- [x] Update generated JS and d.ts mirrors.
- [x] Update tool schema and query handler family enums.

### Phase 4: SQLite Reset
- [x] Confirm database path from `DB_FILENAME` and configured database directory.
- [x] Delete `skill-graph.sqlite`, `skill-graph.sqlite-wal`, and `skill-graph.sqlite-shm` if present.

### Phase 5: Verification and Summary
- [x] Run TypeScript/build verification.
- [x] Run compiler validate-only.
- [x] Run compiler export-json pretty.
- [x] Run Gates 1-6.
- [x] Write implementation summary with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON assertion | Family graph and per-skill metadata | `/usr/bin/python3 -c` |
| Compiler validation | Metadata allow-list and graph compilation | `skill_graph_compiler.py --validate-only` |
| Compiler export | Compiled graph file | `skill_graph_compiler.py --export-json --pretty` |
| TypeScript/build | OpenCode MCP server source and dist alignment | Existing package scripts or available compiler command |
| Grep checks | SQL `CHECK`, enum mirrors, old family values | `grep` / `rg` |
| Database absence | SQLite reset | `ls` |
| Spec validation | Phase 009 and parent packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- `/usr/bin/python3` and `python3` are available for verification.
- The MCP server package provides the local TypeScript/build command.
- The orchestrator runs advisor rebuild after this packet; this packet does not recreate SQLite.
- Parent spec validation needs the `specs/` parent graph metadata child link.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Rollback is not the intended path because the user explicitly directed that `deep-loop` must land. If a verification failure appears, fix the missed schema or mirror surface rather than restoring `sk-deep`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Dependency | Notes |
|-------|------------|-------|
| 008 | Final cleanup | Revealed the SQL `CHECK` constraint blocker after a prior rename attempt |
| 009 | Family schema migration | Supplies the schema and database reset needed for orchestrator rebuild |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Reason |
|-----------|----------|--------|
| Planning artifacts | Medium | Level 2 docs, decision, and metadata |
| Family rename | Low | Four small metadata/compiler edits |
| Schema/type mirrors | Medium | Multiple source and dist enum surfaces |
| SQLite reset | Low | Single database plus possible sidecars |
| Verification | Medium | Build/compile, compiler, grep, database, and strict validation gates |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If the TypeScript/build check fails, keep `deep-loop` in source metadata and repair the failing mirror. If compiler validation fails, inspect rejected metadata and `ALLOWED_FAMILIES` before changing any family data.
<!-- /ANCHOR:enhanced-rollback -->
