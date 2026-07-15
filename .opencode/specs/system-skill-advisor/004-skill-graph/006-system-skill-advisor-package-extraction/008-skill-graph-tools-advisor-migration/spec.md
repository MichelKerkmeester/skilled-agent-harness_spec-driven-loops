---
title: "Feature Specification: Move skill_graph_* tools to advisor ownership"
description: "Level 3 scaffold for moving skill_graph_* MCP tools from spec_kit_memory to system_skill_advisor ownership while keeping public tool ids stable."
trigger_phrases:
  - "move skill graph tools to advisor"
  - "skill_graph tools advisor ownership"
  - "013/009/008"
  - "system_skill_advisor skill_graph"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/008-skill-graph-tools-advisor-migration"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Packet scaffolded by cli-codex"
    next_safe_action: "Dispatch 013/009/008 implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Move skill_graph_* MCP tools from spec_kit_memory to system_skill_advisor ownership

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This packet completes the 013/009 advisor extraction by moving the four `skill_graph_*` MCP tools from `spec_kit_memory` ownership to `system_skill_advisor` ownership. The public tool ids stay unchanged: `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`. Only the MCP server prefix changes for primary callers.

**Key Decisions**: stable public tool ids, advisor-local handlers, one-window `spec_kit_memory` proxy, ordered consumer cutover, physical removal after zero-caller evidence.

**Critical Dependencies**: shipped 004 standalone advisor MCP, shipped 005 proxy/cutover pattern, shipped 006 cleanup pattern, shipped 007 DB filename disambiguation, and parent ADR-001's server-ownership invariant.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
| **Spec Folder** | `008-skill-graph-tools-advisor-migration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The advisor extraction is structurally complete, but the four `skill_graph_*` MCP tools still live under `spec_kit_memory`. That leaves a cross-package coupling: skill-related graph operations remain registered on the memory server even after advisor source, DB, launcher, runtime config, and `advisor_*` ownership moved to `system_skill_advisor`.

007 intentionally deferred this broader topology move. Operator decision on 2026-05-14 picks up that deferred Option A: all skill-related tools should live under one server.

### Current Reality

Targeted live-surface grep across the consumer families named by this packet found **29 matches across 6 files**:

| Surface | Files | Matches | Notes |
|---------|-------|---------|-------|
| Doctor command routing | 3 | 12 | `doctor.md`, `doctor/update.md`, `_routes.yaml` still expose `mcp__mk_spec_memory__skill_graph_*`. |
| Doctor YAML assets | 2 | 4 | `doctor_skill-advisor.yaml` and `doctor_update.yaml` call `skill_graph_status` or `skill_graph_scan`. |
| Install guide | 1 | 13 | `SET-UP - Skill Advisor.md` still describes `skill_graph_*` availability and DB/source assumptions. |

The registration and handler ownership surface remains in system-spec-kit: `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `tools/skill-graph-tools.ts`, `handlers/skill-graph/*.ts`, and their tests. Historical spec packet references are allowed to remain when clearly historical.

### Purpose

Move primary `skill_graph_*` ownership to `system_skill_advisor`, cut known consumers over to the new server prefix, keep a short compatibility window in `spec_kit_memory`, then remove the memory-side descriptors and proxy after zero-caller evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Register `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate` descriptors and schemas on the `system_skill_advisor` MCP server.
- Implement advisor-local handlers under `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph-*.ts` or an equivalent advisor-local `handlers/skill-graph/` layout.
- Move or import logic from the existing system-spec-kit handler stack without duplicating long-lived behavior.
- Retarget live callers from `mcp__mk_spec_memory__skill_graph_*` to `mcp__system_skill_advisor__skill_graph_*`.
- Include consumer sweep coverage for system-code-graph readiness reports, hook wrappers, plugin bridges, doctor YAMLs, install guides, feature catalogs, playbooks, and architecture docs.
- Add a short one-window proxy in `spec_kit_memory` that forwards calls to `system_skill_advisor`, logs deprecation once, and uses a bounded timeout.
- Remove `skill_graph_*` descriptors, schemas, and proxy registrations from `spec_kit_memory` after zero-caller grep and operator confirmation.
- Validate all four supported runtime surfaces: OpenCode, Codex, Claude, and Gemini.

### Out of Scope

- Changing skill-graph DB schema, indexing semantics, or SQLite file location.
- Adding or removing `skill_graph_*` tool surface area; the four tools stay four tools.
- Renaming public tool ids.
- Changing advisor scoring math, semantic lane weights, or recommendation behavior.
- Editing implementation files during this scaffold dispatch.

### Files to Change During Packet Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modify | Register `skill_graph_*` descriptors and dispatch handlers. |
| `.opencode/skills/system-skill-advisor/mcp_server/tool-schemas.ts` | Modify | Add `skill_graph_*` tool descriptors and input schemas. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph-*.ts` | Create | Advisor-local handlers for scan, query, status, and validate. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/**` | Modify/Create | Add registration, handler, proxy, and smoke tests. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Modify | Add temporary proxy, then remove it after cutover. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Keep proxy descriptors during window, then remove them. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Keep proxy schemas during window, then remove them. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/skill-graph-tools.ts` | Modify/Delete | Retire memory-side primary dispatch after proxy removal. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/**` | Move/Delete | Move logic to advisor ownership or replace with removed/proxy-only stubs during window. |
| `.opencode/skills/system-code-graph/**` | Modify | Retarget readiness and structural reports to `system_skill_advisor` tool prefix. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/**` | Modify | Retarget runtime hook wrappers that call or mention skill graph tools. |
| `.opencode/plugins/**` and plugin bridges | Modify | Retarget bridge callers and docs to advisor-owned skill graph tools. |
| `.opencode/commands/doctor/**` | Modify | Retarget allowed tools and YAML probes to `system_skill_advisor`. |
| `.opencode/install_guides/**`, feature catalogs, playbooks, `ARCHITECTURE.md` | Modify | Reflect final ownership and server prefix. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 `skill_graph_*` tool descriptors registered on `system_skill_advisor` MCP server. | `advisor-server.ts` and advisor schemas expose scan, query, status, and validate with unchanged public names. |
| REQ-002 | All 4 `skill_graph_*` handlers implemented under `system-skill-advisor/mcp_server/handlers/`. | Handler source lives in advisor package and uses moved/imported logic without long-lived duplication. |
| REQ-003 | All known consumers retargeted from `mcp__mk_spec_memory__skill_graph_*` to `mcp__system_skill_advisor__skill_graph_*`. | Consumer inventory in `plan.md` is checked off and final grep shows no live old-server callers outside proxy/historical specs. |
| REQ-004 | `spec_kit_memory` exposes a one-window proxy for `skill_graph_*`. | Proxy forwards to `system_skill_advisor`, logs one bounded deprecation notice, and times out after 10 seconds. |
| REQ-005 | `spec_kit_memory` proxy and descriptors physically removed after cutover. | `tools/index.ts`, `tool-schemas.ts`, and schema/dispatch files no longer register `skill_graph_*` after zero-caller evidence. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Four-runtime smoke matrix confirms new calls are callable. | OpenCode, Codex, Claude, and Gemini each can call `mcp__system_skill_advisor__skill_graph_*` or list the tools under that server. |
| REQ-007 | Strict validation is green at packet 008, parent 013/009, and grandparent 013. | `validate.sh --strict` exits 0 for all required levels after implementation docs are updated. |
| REQ-008 | No live-code grep hits remain for `mcp__mk_spec_memory__skill_graph_`. | Historical spec docs are allowed; live code, commands, hooks, plugins, and guides are clean. |
| REQ-009 | Install guides, `ARCHITECTURE.md`, and feature catalogs reflect new ownership. | User-facing docs say skill graph tools are owned by `system_skill_advisor`; stale memory-server instructions are removed or marked historical. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system_skill_advisor` exposes `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`.
- **SC-002**: `spec_kit_memory` does not own primary `skill_graph_*` logic after cleanup.
- **SC-003**: Consumer cutover inventory is complete and final grep proves zero live old-server callers.
- **SC-004**: Short proxy window is implemented, observed, and then removed in the same packet after operator confirmation.
- **SC-005**: Four-runtime smoke matrix passes or records explicit runtime limitations approved by operator.
- **SC-006**: Strict validation passes for packet 008, parent 013/009, and grandparent 013.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 004 standalone advisor server | New tool ownership needs a working `system_skill_advisor` MCP server. | Verify launcher and runtime registration before moving callers. |
| Dependency | 005 proxy pattern | The proxy needs the same one-window behavior used for advisor tools. | Mirror 005 ADR-003: forward, log once, timeout, remove later. |
| Dependency | 006 cleanup pattern | Physical removal must follow zero-caller evidence. | Mirror 006: classify grep hits, preserve historical specs, delete live stale instructions. |
| Risk | Hidden old-server callers | Removing `spec_kit_memory` descriptors can break external runtimes. | Use proxy window, deprecation logs, and final grep plus operator confirmation. |
| Risk | Handler logic duplication | Copying code into advisor package can create two sources of truth. | Move ownership or import from a neutral helper only if dependency direction stays clean. |
| Risk | DB ownership confusion | `skill_graph_*` tools may still read system-spec-kit metadata index while advisor owns skill operations. | Document that DB schema/location is unchanged unless implementation discovers a direct ownership conflict. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Proxy forwarding must fail open with a prompt-safe migration hint if `system_skill_advisor` is unavailable.
- **NFR-R02**: Handler moves must preserve current scan/query/status/validate output shapes.
- **NFR-R03**: Runtime smoke evidence must name both server id and tool id.

### Maintainability

- **NFR-M01**: Advisor-local handler files must be named and grouped consistently with existing advisor handler conventions.
- **NFR-M02**: The memory-side proxy must be small, obviously deprecated, and easy to delete.
- **NFR-M03**: Documentation must distinguish public tool id stability from MCP server-prefix changes.

### Operations

- **NFR-O01**: Deprecation logging must be bounded to avoid prompt/log noise.
- **NFR-O02**: Final grep commands and counts must be recorded in `implementation-summary.md`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Consumer Boundaries

- A runtime only sees server-prefixed tool names: call `mcp__system_skill_advisor__skill_graph_*`.
- A legacy caller still binds through `spec_kit_memory`: proxy handles it for one window, then removal is blocked until zero-caller evidence and operator confirmation.
- Historical spec docs mention old ownership: keep if the section is clearly historical, not live instruction.

### Error Scenarios

- Advisor server unavailable during proxy forwarding: return a bounded migration hint and timeout result, not a memory MCP crash.
- `skill_graph_scan` needs trusted caller context after the move: preserve existing authorization semantics and update tests.
- Doctor route lists both old and new server prefixes: treat as a stale live instruction and retarget to `system_skill_advisor`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Tool registration, handler move, proxy, consumer cutover, docs, validation. |
| Risk | 21/25 | MCP namespace migration can break hidden callers. |
| Research | 13/20 | Requires baseline inventory across handlers, schemas, runtime docs, hooks, doctor, plugins. |
| Multi-Agent | 0/15 | Scaffold forbids SpawnAgent; implementation can remain serial unless operator changes scope. |
| Coordination | 13/15 | Depends on shipped 004, 005, 006, and 007 decisions. |
| **Total** | **70/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Old caller breaks after proxy removal. | High | Medium | Proxy window plus zero-caller grep and operator confirmation. |
| R-002 | Handler move opens the wrong DB or changes output shape. | High | Medium | Baseline handler dependency inventory and targeted tests before cutover. |
| R-003 | Runtime smoke calls memory proxy instead of advisor primary. | High | Medium | Smoke commands must record `system_skill_advisor` server id. |
| R-004 | Docs keep telling operators to call `spec_kit_memory` tools. | Medium | High | Include install guides, doctor docs, feature catalogs, and playbooks in final grep. |
| R-005 | Long-lived duplicate code survives in both packages. | Medium | Medium | Removal phase must delete memory-side primary registration and stale handlers. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Skill graph tools live with the advisor server (Priority: P0)

**As an** operator, **I want** `skill_graph_*` tools exposed by `system_skill_advisor`, **so that** skill-related tooling has one clear MCP owner.

**Acceptance Criteria**:
1. Given MCP tools are listed, When `system_skill_advisor` is inspected, Then all four `skill_graph_*` tools appear.
2. Given a caller invokes `mcp__system_skill_advisor__skill_graph_status`, Then the response preserves the current status shape.

### US-002: Existing callers have a safe migration window (Priority: P0)

**As a** maintainer, **I want** `spec_kit_memory` to proxy old calls briefly, **so that** unknown callers do not break before the cutover sweep completes.

**Acceptance Criteria**:
1. Given an old-server call reaches `spec_kit_memory`, When the proxy is active, Then it forwards to `system_skill_advisor` and logs a bounded deprecation warning.
2. Given final cleanup begins, When old-server callers remain, Then proxy removal is blocked.

### US-003: Documentation names the correct owner (Priority: P1)

**As a** future agent, **I want** guides and catalogs to name `system_skill_advisor` as the owner, **so that** new work does not reintroduce memory-server coupling.

**Acceptance Criteria**:
1. Given live docs are searched, When `mcp__mk_spec_memory__skill_graph_` is grepped, Then no live instruction remains.
2. Given historical ADRs mention old ownership, Then they are clearly historical or left in spec packets only.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None for this scaffold. Operator selected Option B: create the new 013/009/008 packet and document the topology move for implementation.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Decision Records**: See `decision-record.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:related-docs -->
