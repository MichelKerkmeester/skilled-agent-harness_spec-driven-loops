---
title: "Feature Specification: Phase 009 Family Schema Migration"
description: "Make the deep-loop family name work end-to-end by migrating the skill graph schema, runtime mirrors, type/schema validators, source metadata, and SQLite database state."
trigger_phrases:
  - "070 phase 009"
  - "family schema migration"
  - "deep-loop family"
  - "skill graph check constraint"
  - "skill-graph sqlite reset"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename/009-family-schema-migration"
    last_updated_at: "2026-05-05T18:25:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 009 schema migration"
    next_safe_action: "Orchestrator can run advisor_rebuild via MCP to recreate skill-graph.sqlite"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 009 Family Schema Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `070-sk-deep-rename` |
| **Phase** | 009 |
| **Handoff Criteria** | `deep-loop` is accepted by source, dist, compiler, schemas, per-skill metadata, and a recreated SQLite schema |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 008 attempted the `sk-deep` to `deep-loop` internal family rename, but the existing SQLite-backed skill graph schema rejects `deep-loop` inserts because `skill-graph-db.ts` and its dist mirror hardcode a SQL `CHECK` constraint that still lists `sk-deep`.

### Purpose
Phase 009 performs the missing schema migration. The work updates the family taxonomy in metadata and compiler validation, updates SQL and TypeScript schema mirrors, removes the stale SQLite database so the next orchestrator rebuild recreates it with the new constraint, and records verification evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create Phase 009 Level 2 planning, checklist, decision, metadata, and implementation artifacts.
- Re-apply the `sk-deep` to `deep-loop` family rename in graph source and per-skill metadata.
- Update the TypeScript source and generated dist SQL `CHECK` constraints.
- Update type/schema enum mirrors that expose skill graph family values.
- Remove `skill-graph.sqlite` and sidecar files so the orchestrator-owned rebuild recreates the schema.
- Run compiler validation, compiler export, TypeScript/build verification where available, and strict spec validation.

### Out of Scope
- Running the orchestrator-owned `advisor_rebuild` MCP step after this packet.
- Renaming skill IDs or folders; `deep-review` and `deep-research` remain unchanged.
- Reverting to `sk-deep` or widening the schema to accept both names.
- Editing unrelated skill graph families or deep-loop coverage graph behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/009-family-schema-migration/spec.md` | Create/Update | Phase 009 scope and requirements |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/009-family-schema-migration/plan.md` | Create/Update | Schema migration execution plan |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/009-family-schema-migration/tasks.md` | Create/Update | One task per write set A-D and verification |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/009-family-schema-migration/checklist.md` | Create/Update | Level 2 verification checklist |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/009-family-schema-migration/decision-record.md` | Create | ADR-001 schema migration decision |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/009-family-schema-migration/implementation-summary.md` | Create | Final summary after verification |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/009-family-schema-migration/description.json` | Create | Canonical packet description |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/009-family-schema-migration/graph-metadata.json` | Create/Update | Canonical graph metadata |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/graph-metadata.json` | Update | Add Phase 009 child ID for strict validation |
| `.opencode/specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/graph-metadata.json` | Update | Add Phase 009 child ID in mirrored parent metadata |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Update | Rename family key to `deep-loop` |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | Update | Allow `deep-loop` instead of `sk-deep` |
| `.opencode/skills/deep-review/graph-metadata.json` | Update | Set family to `deep-loop` |
| `.opencode/skills/deep-research/graph-metadata.json` | Update | Set family to `deep-loop` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Update | Update `SkillFamily`, allow-list, and SQL `CHECK` |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/skill-graph/skill-graph-db.js` | Update | Update generated runtime allow-list and SQL `CHECK` mirror |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/skill-graph/skill-graph-db.d.ts` | Update | Update generated type union mirror |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Update | Update family enum mirror |
| `.opencode/skills/system-spec-kit/mcp_server/dist/tool-schemas.js` | Update | Update family enum mirror |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Update | Update zod family enum mirror |
| `.opencode/skills/system-spec-kit/mcp_server/dist/schemas/tool-input-schemas.js` | Update | Update zod family enum mirror |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/query.ts` | Update | Update query handler family allow-list |
| `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/skill-graph/query.js` | Update | Update query handler family allow-list mirror |
| `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite*` | Delete | Remove stale SQLite database and sidecars |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the requested rename | No active family source reverts to `sk-deep` |
| REQ-002 | Migrate schema constraints | SQL `CHECK` constraints in source and dist include `deep-loop` |
| REQ-003 | Remove stale SQLite state | `skill-graph.sqlite` and sidecars are absent before handoff |
| REQ-004 | Keep compiler validation aligned | `skill_graph_compiler.py --validate-only` passes |
| REQ-005 | Validate spec artifacts | Phase 009 and parent strict validation exit 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Update type/schema mirrors | Skill family enums in TS, JS, and d.ts mirrors use `deep-loop` |
| REQ-007 | Re-emit compiled graph source | `skill_graph_compiler.py --export-json --pretty` writes the updated graph |
| REQ-008 | Record the schema decision | ADR-001 documents why the migration updates schema and removes SQLite |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `skill-graph.json` contains `families.deep-loop` and does not contain `families.sk-deep`.
- **SC-002**: `deep-review` and `deep-research` graph metadata use `"family": "deep-loop"`.
- **SC-003**: Source and dist SQL `CHECK` constraints accept `deep-loop`.
- **SC-004**: Type/schema mirrors expose `deep-loop` as the family value.
- **SC-005**: `skill-graph.sqlite` is removed and ready for orchestrator-owned rebuild.
- **SC-006**: Compiler validation, compiler export, TypeScript/build verification, and strict spec validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing SQLite schema keeps old `CHECK` | High | Delete SQLite database and sidecars after source/dist schema update |
| Risk | Source/dist mirror divergence | High | Patch source and dist mirrors and grep both constraints |
| Risk | Enum mirror omission | Medium | `rg` the targeted family-context files before and after patching |
| Dependency | Orchestrator advisor rebuild | Medium | Do not run rebuild here; leave database absent for orchestrator handoff |
| Dependency | TypeScript/build tooling | Medium | Run the available package build or targeted compile command and record evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions. The user explicitly selected `deep-loop`, supplied the approved write set, and directed that the previous reversion must not be repeated.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Scope Safety**: Only edit the approved migration surfaces plus the required parent spec metadata mirror.
- **Traceability**: Each write set A-D maps to tasks and checklist evidence.
- **Data Integrity**: JSON files parse, Python compiler validation passes, and TypeScript surfaces compile.
- **Runtime Safety**: The SQLite database is removed only after confirming the path constant and expected location.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- `deep-loop` is a family taxonomy value; skill IDs and folder names stay `deep-review` and `deep-research`.
- Stale `sk-deep` may remain in historical docs or ADRs outside family-context surfaces; active schema, enum, metadata, and generated graph surfaces must not use it as the live family name.
- Sidecar SQLite files may not exist if the database was not open with WAL at deletion time; absence is acceptable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Axis | Rating | Reason |
|------|--------|--------|
| File Count | High | Source, dist, schema mirrors, metadata, spec docs, and database state are all touched |
| Behavioral Risk | High | A missed enum or stale SQLite schema would reject `deep-loop` at runtime |
| Verification Risk | Medium | Advisor rebuild is intentionally deferred to the orchestrator |
| Coordination Risk | Medium | Parent metadata exists in both `specs/` and `.opencode/specs/` mirrors |
<!-- /ANCHOR:complexity -->
