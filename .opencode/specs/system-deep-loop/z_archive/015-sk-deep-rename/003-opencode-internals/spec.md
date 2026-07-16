---
title: "Feature Specification: Phase 003 OpenCode Internal References"
description: "Update all non-historical .opencode references from sk-deep-review/sk-deep-research to deep-review/deep-research after the Phase 002 folder rename."
trigger_phrases:
  - "070 phase 003"
  - "opencode internal references"
  - "sk-deep-review -> deep-review"
  - "sk-deep-research -> deep-research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename/003-opencode-internals"
    last_updated_at: "2026-05-05T20:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Initialized Phase 003 planning artifacts"
    next_safe_action: "Fix critical graph metadata edges, then update allowed .opencode references"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 003 OpenCode Internal References

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
| **Phase** | 003 of 006 |
| **Handoff Criteria** | All allowed `.opencode/` references use `deep-review` and `deep-research`; critical broken graph metadata edges are fixed; excluded historical paths are untouched; grep audits and strict validation pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002 renamed the skill folders and updated the advisor graph source, but many `.opencode/` consumers still point at `sk-deep-review` and `sk-deep-research`. Three graph metadata edges are already known broken, so advisor edge resolution can remain degraded until Phase 003 updates every other active `.opencode/` reference.

### Purpose
Replace old `sk-deep-review` and `sk-deep-research` skill IDs with `deep-review` and `deep-research` across the approved `.opencode/` internal surfaces while preserving historical exclusions and keeping JSON-bearing files valid.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author Phase 003 Level 2 planning artifacts.
- Fix the critical graph metadata edges in `.opencode/skills/sk-code-review/graph-metadata.json` and `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` first.
- Update allowed `.opencode/skills/<other-skill>/SKILL.md`, `references/**/*.md`, `assets/**/*.md`, manual playbook markdown, and graph metadata references.
- Update `.opencode/agent`, `.opencode/commands/spec_kit`, MCP server TypeScript/JavaScript/Python tests, scripts, script fixtures, and active `.opencode/specs` authored docs/metadata/research/review artifacts.
- Validate JSON files after replacement and run the requested grep audits.

### Out of Scope
- `.opencode/specs/**/z_archive/**/*` - frozen historical artifacts.
- `.opencode/specs/**/runs/**/*` - historical run output text.
- `.opencode/skills/system-spec-kit/mcp_server/database/*.sqlite*` - binary caches rebuilt later.
- Phase 001 inventory files - they intentionally document old names.
- `.opencode/skills/<deep-review|deep-research>/changelog/*.md` - historical changelog entries.
- `.opencode/skills/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/graph-metadata.json` - confirmed non-skill-metadata fixture.
- Runtime mirrors, root docs, and config files owned by Phases 004 and 005.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals/spec.md` | Create/Update | Phase 003 scope and requirements |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals/plan.md` | Create/Update | Execution and verification plan |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals/tasks.md` | Create/Update | Task checklist and evidence |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals/checklist.md` | Create/Update | Level 2 verification checklist |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals/graph-metadata.json` | Create/Update | Phase graph metadata |
| `.opencode/skills/sk-code-review/graph-metadata.json` | Modify | Critical broken edge to `deep-review` |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` | Modify | Critical broken edges to `deep-review` and `deep-research` |
| `.opencode/agents/**` | Modify | Agent skill references |
| `.opencode/commands/speckit/**` | Modify | Command markdown/YAML skill references |
| `.opencode/skills/system-spec-kit/mcp_server/**` | Modify | MCP server code and test references |
| `.opencode/skills/system-spec-kit/scripts/**` | Modify | Script and fixture references |
| `.opencode/specs/**` | Modify | Active authored docs, graph metadata, descriptions, research/review artifacts only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Critical graph metadata edges are fixed first | Both high-priority graph metadata files grep clean for old names |
| REQ-002 | Allowed `.opencode/agent` and `.opencode/command` references are updated | Requested grep audit returns zero rows |
| REQ-003 | MCP server and script references are updated | Requested grep audit returns zero rows outside explicit fixture/database exclusions |
| REQ-004 | Active spec docs and metadata are updated | Requested active-spec grep audit returns zero rows outside excluded paths |
| REQ-005 | JSON-bearing edited files remain valid | JSON parse/validation completes after replacement |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Scope exclusions are preserved | No edits under `z_archive/`, `runs/`, Phase 001 inventory files, binary SQLite databases, or historical changelog files |
| REQ-007 | Documentation records evidence | `tasks.md` and `checklist.md` include grep and validation evidence |
| REQ-008 | Strict validation passes | Child and parent `validate.sh --strict` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -c "sk-deep-review" .opencode/skills/sk-code-review/graph-metadata.json` returns `0`.
- **SC-002**: `grep -c "sk-deep-research\|sk-deep-review" .opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` returns `0`.
- **SC-003**: Active `.opencode/specs` authored docs and metadata return no old-name grep rows after exclusions.
- **SC-004**: `.opencode/agent` and `.opencode/command` return no old-name grep rows.
- **SC-005**: MCP server and script grep audit returns no old-name rows outside explicit exclusions.
- **SC-006**: Child and parent strict validation exit 0.

Acceptance scenarios:
- **Given** Phase 002 renamed the folders, **When** advisor graph metadata is read, **Then** edges target `deep-review` and `deep-research`.
- **Given** an active command workflow dispatches a deep loop, **When** command markdown/YAML is inspected, **Then** skill references use the new names.
- **Given** active spec metadata is indexed, **When** graph metadata and descriptions are scanned, **Then** they do not expose old skill IDs.
- **Given** historical archives and runs are intentionally frozen, **When** Phase 003 edits run, **Then** those paths remain untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 inventory | High | Use inventory and edge-case docs to seed scoped replacement |
| Dependency | Phase 002 folder rename | High | Confirm new folders exist and old names are now references only |
| Risk | Over-editing historical outputs | High | Build replacement file list with explicit excludes |
| Risk | Invalid JSON after mechanical replacement | Medium | Parse edited JSON files after replacement |
| Risk | Generated/binary databases still contain old names | Low in this phase | Exclude binaries and leave rebuild to Phase 006 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Scope Safety
- **NFR-SCOPE-001**: Replacement must stay inside `.opencode/` plus this Phase 003 spec folder.
- **NFR-SCOPE-002**: Excluded historical paths must remain unmodified.

### Data Integrity
- **NFR-DATA-001**: JSON files touched by replacement must parse successfully.
- **NFR-DATA-002**: SQLite databases must not be edited directly.

### Traceability
- **NFR-TRACE-001**: Every completion claim must cite grep and strict-validation evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Active `.opencode/specs` includes authored docs and metadata; `runs/` is excluded by this prompt even if Phase 001 counted it.
- Active research/review artifacts are included when they live outside `runs/` and `z_archive/`.
- Phase 001 inventory artifacts intentionally keep old names as discovery evidence.

### Error Scenarios
- If JSON validation fails, stop and repair the specific file before broader audits.
- If grep finds old names only in excluded paths, record the exclusion instead of editing.
- If strict validation fails, fix the Phase 003 artifacts before claiming completion.

### State Transitions
- Partial completion is not acceptable for critical graph metadata edges; those must be fixed before the broad replacement pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 24/25 | Broad `.opencode/` text replacement across skills, commands, MCP server, scripts, and active specs |
| Risk | 18/25 | Main risks are graph metadata breakage, JSON validity, and historical overreach |
| Research | 14/20 | Phase 001 inventory and edge-case docs provide most discovery evidence |
| **Total** | **56/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. OPEN QUESTIONS

None for Phase 003. SQLite and advisor/cache rebuilds are intentionally handled in Phase 006.
<!-- /ANCHOR:questions -->
