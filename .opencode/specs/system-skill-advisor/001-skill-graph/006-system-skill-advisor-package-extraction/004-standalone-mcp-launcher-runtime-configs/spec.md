---
title: "Feature Specification: Standalone MCP launcher and runtime configs"
description: "Step 3 of ADR-001's migration: add a standalone system_skill_advisor MCP launcher and register it across OpenCode, Codex, Claude, and Gemini while preserving spec_kit_memory unchanged."
trigger_phrases:
  - "standalone advisor mcp launcher"
  - "system_skill_advisor runtime config"
  - "skill advisor launcher"
  - "013/009/004"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/004-standalone-mcp-launcher-runtime-configs"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffold authored"
    next_safe_action: "Implement launcher and configs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0130090040000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-004-standalone-mcp-launcher"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Claude MCP registrations live in .claude/mcp.json for this repo."
      - "The server id is system_skill_advisor, not system-skill-advisor."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Standalone MCP launcher and runtime configs

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

ADR-001 already chose a standalone advisor MCP server with stable `advisor_*` tool ids. This packet plans the runtime integration step: add `.opencode/bin/skill-advisor-launcher.cjs` and register `system_skill_advisor` beside `spec_kit_memory` in OpenCode, Codex, Claude, and Gemini.

**Key Decisions**: standalone MCP process, snake_case server id, stable public tool ids, env-first DB path resolution, build-if-missing launcher.

**Critical Dependencies**: child 003 must have landed the advisor source, local DB resolver, and `SYSTEM_SKILL_ADVISOR_DB_DIR` support under `.opencode/skills/system-skill-advisor/mcp_server/`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Child 003 moved advisor source and DB ownership into the dedicated `system-skill-advisor` package, but the runtime still has no standalone advisor launcher or MCP registration. Current runtime configs register `spec_kit_memory`; without a sibling `system_skill_advisor` entry, advisor tools remain operationally tied to the memory server topology.

### Purpose
Make the extracted advisor package start as its own MCP server across the four supported runtimes while preserving `spec_kit_memory` registration and the legacy `advisor_*` tool ids.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/bin/skill-advisor-launcher.cjs` modeled on `.opencode/bin/spec-kit-memory-launcher.cjs`.
- Add `system_skill_advisor` MCP server registration to `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, and `.gemini/settings.json`.
- Preserve every existing `spec_kit_memory` entry unchanged in those four runtime configs.
- Verify the standalone advisor server cold-starts, builds if `system-skill-advisor/mcp_server/dist/` is missing, and registers `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`.
- Ensure the launcher sets or logs the DB path resolved from `SYSTEM_SKILL_ADVISOR_DB_DIR` or the default package-local database directory.

### Out of Scope
- Changing advisor scoring math, lane weights, schema semantics, or ranking behavior.
- Renaming any public `advisor_*` tool id.
- Removing the temporary memory-side advisor bridge.
- Updating hooks, Python shim, plugin bridge, doctor workflows, or consumer cutover paths; those belong to child 005.
- Editing runtime configs during this documentation-only scaffold dispatch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/skill-advisor-launcher.cjs` | Create | Standalone launcher for the system-skill-advisor MCP server. |
| `opencode.json` | Modify | Add `mcp.system_skill_advisor` beside existing `spec_kit_memory`. |
| `.codex/config.toml` | Modify | Add `[mcp_servers.system_skill_advisor]` beside existing `spec_kit_memory`. |
| `.claude/mcp.json` | Modify | Add `mcpServers.system_skill_advisor`; `.claude/settings.local.json` is not the MCP registration surface in this repo. |
| `.gemini/settings.json` | Modify | Add `mcpServers.system_skill_advisor` beside existing `spec_kit_memory`. |
| `.opencode/skills/system-skill-advisor/mcp_server/dist/` | Verify | Launcher should build this output when missing. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Launcher script created at `.opencode/bin/skill-advisor-launcher.cjs`. | File exists, is executable by `node`, follows the memory launcher bootstrap pattern, and launches the advisor MCP server entrypoint. |
| REQ-002 | `system_skill_advisor` entry exists in `opencode.json`. | OpenCode config contains a local MCP entry with command `node` and args pointing at `.opencode/bin/skill-advisor-launcher.cjs`. |
| REQ-003 | `system_skill_advisor` entry exists in `.codex/config.toml`. | Codex config contains `[mcp_servers.system_skill_advisor]` with command `node` and launcher args. |
| REQ-004 | `system_skill_advisor` entry exists in `.claude/mcp.json`. | Claude config uses `mcpServers.system_skill_advisor`; `.claude/settings.local.json` remains hook/permission-only unless the repo later changes its Claude MCP surface. |
| REQ-005 | `system_skill_advisor` entry exists in `.gemini/settings.json`. | Gemini config contains `mcpServers.system_skill_advisor` with `cwd`, launcher args, and trust set consistently with sibling local MCP entries. |
| REQ-006 | `spec_kit_memory` registration in all four configs is left unchanged. | Before/after diff shows no edits inside existing `spec_kit_memory` blocks in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, or `.gemini/settings.json`. |
| REQ-007 | Advisor MCP server starts cold and registers `advisor_*` tools. | Runtime/tool listing shows `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate` under `system_skill_advisor`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Cold-start build path works when `system-skill-advisor/mcp_server/dist/` is missing. | Temporarily moving/removing `dist/` triggers launcher bootstrap and produces the expected built entrypoint before server launch. |
| REQ-009 | Launcher logs the DB path it uses. | Launcher stderr includes the resolved `skill-graph.sqlite` path, identifying env override or package default. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four runtime configs contain `system_skill_advisor` beside `spec_kit_memory`.
- **SC-002**: Existing `spec_kit_memory` registrations are byte-for-byte unchanged within their MCP blocks.
- **SC-003**: The launcher starts from a clean shell and can build missing advisor dist artifacts before launching.
- **SC-004**: At least one live runtime call proves `advisor_recommend` is callable from the standalone server.
- **SC-005**: DB path visibility is present in launcher logs for default and env override paths.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 003 package move | Launcher cannot start if the advisor package entrypoint or build scripts are missing. | Verify `system-skill-advisor/mcp_server` package metadata and dist entrypoint before config edits. |
| Dependency | Runtime config formats | Each runtime uses a different MCP shape. | Mirror local MCP patterns already present in each file instead of inventing a shared schema. |
| Risk | Accidental memory MCP config change | Memory tools could fail while advisor extraction proceeds. | Diff only the new `system_skill_advisor` blocks and preserve `spec_kit_memory` unchanged. |
| Risk | Duplicate tool id confusion | Stable `advisor_*` ids may exist through a temporary memory-side bridge and the new server. | Document server boundary and verify callers target `system_skill_advisor` during child 005 cutover. |
| Risk | Cold-start build race | Multiple runtimes may start the launcher concurrently. | Use the lock/state-file pattern from `spec-kit-memory-launcher.cjs`, scoped to the advisor DB directory. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Launcher bootstrap must be idempotent under repeated runtime startup.
- **NFR-R02**: Startup failure must write actionable stderr and state-file detail when possible.

### Maintainability
- **NFR-M01**: Launcher structure should stay close to `spec-kit-memory-launcher.cjs` so future operators can compare behavior quickly.
- **NFR-M02**: Runtime config entries should use the established naming convention: `system_skill_advisor`.

### Operations
- **NFR-O01**: Launcher logs must include the resolved DB path.
- **NFR-O02**: Env override behavior must be explicit: `SYSTEM_SKILL_ADVISOR_DB_DIR` first, package-local DB directory second.

---

## 8. EDGE CASES

### Startup Boundaries
- `dist/` missing: launcher installs/builds advisor MCP artifacts before launching.
- Package folder missing: launcher fails fast with a path that names `.opencode/skills/system-skill-advisor`.
- Concurrent startup: one process holds the bootstrap lock; others wait or proceed when artifacts are ready.

### Runtime Boundaries
- Claude config surface: use `.claude/mcp.json`, not `.claude/settings.local.json`, because this repo's MCP registrations live in `mcp.json`.
- Memory registration: existing `spec_kit_memory` blocks remain untouched even when adjacent MCP entries are added.
- Env override absent: DB resolves to `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Five runtime/launcher surfaces, no scoring behavior change. |
| Risk | 17/25 | MCP startup, config syntax, cold-start build, and DB path visibility. |
| Research | 12/20 | Requires reading parent ADR, sibling 003, launcher pattern, and four runtime configs. |
| Multi-Agent | 0/15 | Single-agent packet; no delegation. |
| Coordination | 11/15 | Depends on child 003 and blocks child 005 consumer cutover. |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Config syntax error prevents a runtime from loading MCP servers. | High | Medium | Validate JSON/TOML syntax and smoke each runtime's MCP server list. |
| R-002 | Launcher builds the wrong package or checks the wrong artifact. | High | Medium | Define required advisor artifacts explicitly and keep paths rooted under `system-skill-advisor`. |
| R-003 | `spec_kit_memory` block changes during adjacent edits. | High | Low | Snapshot/diff the four config blocks before and after implementation. |
| R-004 | DB override behavior becomes invisible during ops triage. | Medium | Medium | Log the resolved DB path on every launcher start. |

---

## 11. USER STORIES

### US-001: Start Advisor Independently (Priority: P0)

**As an** operator, **I want** `system_skill_advisor` to start as its own MCP server, **so that** advisor failures and memory MCP failures can be diagnosed independently.

**Acceptance Criteria**:
1. Given a clean checkout, When a runtime starts MCP servers, Then `system_skill_advisor` launches through `.opencode/bin/skill-advisor-launcher.cjs`.
2. Given the advisor server is running, When tools are listed, Then the stable `advisor_*` ids are present.

### US-002: Preserve Memory MCP Behavior (Priority: P0)

**As an** operator, **I want** `spec_kit_memory` registration left unchanged, **so that** memory tools remain stable during advisor extraction.

**Acceptance Criteria**:
1. Given runtime config diffs, When the patch is reviewed, Then only new `system_skill_advisor` blocks are added around existing memory config.

### US-003: Diagnose DB Path Quickly (Priority: P1)

**As a** maintainer, **I want** launcher logs to show the advisor DB path, **so that** default-vs-override state is visible during startup issues.

**Acceptance Criteria**:
1. Given `SYSTEM_SKILL_ADVISOR_DB_DIR` is set, When the launcher starts, Then stderr names the override-backed `skill-graph.sqlite`.
2. Given the env override is absent, When the launcher starts, Then stderr names the package-local default path.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None for this packet. ADR-001 fixed the server topology, server id, tool-id stability, and DB override policy.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent ADR**: `001-extraction-design-and-adr/decision-record.md`
- **Parent Spec**: `../spec.md`
- **Previous Child**: `003-advisor-source-db-tests-migration/spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
