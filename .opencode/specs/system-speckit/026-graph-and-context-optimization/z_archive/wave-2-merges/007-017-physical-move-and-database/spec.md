---
title: "Feature Specification: Physical move: code_graph source tree + database to system-code-graph (no consumer rewiring)"
description: "Move the code_graph source tree, stress-test tree, code-graph bridge, and copied SQLite database into system-code-graph. Update only the moved database config resolution; consumer rewiring is Phase 004."
trigger_phrases:
  - "003 physical move code graph"
  - "code graph database copy"
  - "system-code-graph source move"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/017-physical-move-and-database"
    last_updated_at: "2026-05-14T08:15:39Z"
    last_updated_by: "codex"
    recent_action: "Completed physical source move, stress-test move, bridge move, DB copy, and DB config update"
    next_safe_action: "Use Phase 004 rewired consumers and run validation cleanup in later phases"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140003"
      session_id: "003-physical-move-and-database"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001 Q2 selects moved DB ownership with SPECKIT_CODE_GRAPH_DB_DIR fallback."
      - "DB files are copied, not deleted from system-spec-kit, until later validation cleanup."
      - "Consumer rewiring is handled atomically by sibling Phase 004 in this dispatch."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Physical move: code_graph source tree + database to system-code-graph (no consumer rewiring)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `003-physical-move-and-database` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
ADR-001 accepted `.opencode/skills/system-code-graph/` as the new owner of the code-graph source tree and database. Phase 002 created the empty skill scaffold. The live implementation still resides under `.opencode/skills/system-spec-kit/mcp_server/code_graph/`, which prevents the new skill from owning its runtime source.

### Purpose
Physically move the code-graph-owned source and stress-test trees into the system-code-graph skill, copy the live code-graph SQLite files into the new skill database directory, and make the moved `code-graph-db.ts` resolve `DATABASE_DIR` from the new skill config. This phase is structural only and does not change parsing, scoring, scan-scope policy, query semantics, or consumer behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove Phase 002 placeholder `.gitkeep` files under the destination `mcp_server/code_graph/` tree.
- `git mv` `.opencode/skills/system-spec-kit/mcp_server/code_graph/` to `.opencode/skills/system-code-graph/mcp_server/code_graph/`.
- `git mv` `.opencode/skills/system-spec-kit/mcp_server/stress_test/code-graph/` to `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/`.
- Move the code-graph-specific bridge `.mjs` into the new skill bridge folder.
- Copy `code-graph.sqlite` plus WAL/SHM when present to `.opencode/skills/system-code-graph/mcp_server/database/`.
- Add `.opencode/skills/system-code-graph/mcp_server/core/config.ts` with `SPECKIT_CODE_GRAPH_DB_DIR` fallback resolution.
- Update the moved `code-graph-db.ts` import to use the new skill config.

### Out of Scope
- Consumer import rewiring in system-spec-kit handlers, hooks, tests, and tool registration.
- Code-graph algorithm, query, parser, scoring, scan-scope, or readiness behavior changes.
- Deleting the old database files from system-spec-kit.
- Phase 005+ packet scaffolding or documentation migration.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Source tree moves by `git mv`. | Destination has the moved `code_graph/` tree with at least the original source file count. |
| REQ-002 | Stress-test tree moves by `git mv`. | Destination has the moved `stress_test/code-graph/` files. |
| REQ-003 | DB is copied, not removed. | Main DB copy is byte-equal by `cmp`; source DB remains present. |
| REQ-004 | New config resolves the code-graph DB directory. | `mcp_server/core/config.ts` exports `DATABASE_DIR` with env override and default database folder. |
| REQ-005 | Moved code imports the new config. | `code-graph-db.ts` imports `DATABASE_DIR` from `../../core/config.js`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `code_graph/` exists under system-code-graph and no longer exists under system-spec-kit.
- **SC-002**: Stress-test code-graph files exist under system-code-graph.
- **SC-003**: Main SQLite DB copy is byte-equal; WAL/SHM copied when present.
- **SC-004**: No source DB fallback files are deleted in this phase.
- **SC-005**: Strict validation passes for this packet.
- **SC-006**: Evidence recorded: source files moved 108; stress-test files moved 13; DB copy byte-equal with WAL/SHM present.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Broken import window after move | Consumers still point at old paths until rewired | Execute Phase 003 and 004 atomically in one dispatch. |
| Risk | Live index loss | Graph appears empty after migration | Copy DB and verify byte equality; do not delete old DB. |
| Risk | Placeholder destination blocks `git mv` | Move fails or nests incorrectly | Remove `.gitkeep` placeholders and empty dirs before moving. |
| Dependency | Phase 002 scaffold exists | Destination package shape is required | Use the established Phase 002 tree. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. ADR-001 and this dispatch lock the shape.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-Q01 | Quality | Preserve git history via `git mv`. |
| NFR-S01 | Safety | Copy DB files and leave old DB fallback in place. |
| NFR-C01 | Compatibility | Preserve stable tool IDs and behavior; consumer rewiring remains Phase 004. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- WAL/SHM may be absent in some worktrees; absence is acceptable if the main DB copy passes.
- `.opencode/plugins/` auto-loads plugin entrypoints; plugin placement is resolved during Phase 004 rather than forced by this physical move.
- Internal imports that intentionally cross into system-spec-kit utilities must become explicit sibling-skill imports if discovered.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | Small code/config delta plus moved files | Structural move with one new config resolver |
| **Surface area** | Medium | Source tree, stress tests, bridge, DB files |
| **Risk** | Medium | Import paths break until Phase 004 completes |
| **Reversibility** | High | Git move plus copied DB can be reverted; source DB remains |
<!-- /ANCHOR:complexity -->
