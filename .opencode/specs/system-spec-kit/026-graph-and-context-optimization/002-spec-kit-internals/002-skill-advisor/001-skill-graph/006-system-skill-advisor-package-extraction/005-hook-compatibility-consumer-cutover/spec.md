---
title: "Feature Specification: Hooks Compat And Consumer Cutover"
description: "Step 4 of ADR-001's standalone advisor migration: move advisor_* consumers from spec_kit_memory to system_skill_advisor while preserving public tool ids and one-window legacy compatibility."
trigger_phrases:
  - "013 009 005 hooks compat"
  - "advisor consumer cutover"
  - "system skill advisor hook cutover"
  - "advisor legacy proxy"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover"
    last_updated_at: "2026-05-14T12:36:34Z"
    last_updated_by: "codex"
    recent_action: "Consumer cutover implemented"
    next_safe_action: "Continue to 006 cleanup"
    blockers:
      - "Legacy hook Vitest suites still import removed ../skill_advisor test helpers outside the 005 edit whitelist."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0130090050000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-005-hooks-compat-consumer-cutover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "ADR-003 chooses proxy with deprecation log for one minor version; removal belongs to child 006."
      - "Tool ids remain advisor_*; only MCP server ownership changes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Hooks Compat And Consumer Cutover

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Child 005 moves the remaining prompt-time, plugin, shim, doctor, and documentation consumers of `advisor_*` from the memory MCP boundary to the standalone `system_skill_advisor` MCP server created by child 004. The public tool ids stay unchanged, so callers keep using `advisor_recommend`, `advisor_status`, `advisor_rebuild`, and `advisor_validate`; the server that owns those tools changes.

**Key Decisions**: preserve `advisor_*` tool ids, keep a temporary `spec_kit_memory` proxy with a deprecation log, prefer MCP-level dispatch over direct handler imports for OpenCode bridge consumers.

**Critical Dependencies**: ADR-001 accepted in child 001, source move from child 003, standalone launcher/runtime config from child 004.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented with caveats |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

ADR-001 split the advisor into a standalone package and MCP server, but live consumers still carry mixed assumptions. Current evidence shows hooks already importing some advisor helpers from `.opencode/skills/system-skill-advisor/mcp_server`, while memory MCP still registers `advisor_*` dispatchers and the OpenCode skill-advisor plugin bridge still targets the old `dist/skill_advisor/compat/index.js` path. Install and hook references also still describe an in-memory-server advisor topology.

### Purpose

Cut all `advisor_*` consumers over to the standalone `system_skill_advisor` server without renaming public tool ids, and leave a temporary compatibility bridge for callers that still bind through `spec_kit_memory`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Inventory every `advisor_*` consumer in hooks, OpenCode plugins, plugin bridges, Python shims, doctor workflows, install guides, and memory MCP registration.
- Update OpenCode plugin and bridge behavior so advisor requests dispatch through `system_skill_advisor` or its package-level public compat surface, not the old memory-owned dist layout.
- Update Python shim entrypoints so script callers use `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` as the canonical package.
- Update Claude, Codex, Gemini, and OpenCode hook wrappers that call or import advisor surfaces so their routing target is the standalone advisor package/server.
- Update `doctor:update` and skill-advisor doctor workflow references that hardcode memory-side skill graph or `spec_kit_memory.advisor_*` assumptions.
- Update both install guides: `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` and `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md`.
- Keep a temporary `spec_kit_memory` advisor proxy with deprecation logging for one migration window.

### Out of Scope

- Renaming any public `advisor_*` tool id.
- Changing advisor scoring math, lane weights, thresholds, freshness semantics, or DB schema.
- Editing runtime MCP configs already owned by child 004.
- Removing the temporary memory-side bridge; child 006 owns deprecation removal.
- Deleting old source paths beyond targeted stale bridge references required for cutover.

### Files to Change

These are future implementation targets. This dispatch only authors the 005 spec documents.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modify | Point cache signatures and bridge path assumptions at the standalone advisor package or MCP dispatch path. |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modify | Stop importing old `skill_advisor` dist paths; call the standalone advisor server/package compatibility surface. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Modify | Replace direct advisor handler registration with temporary proxy or fail-fast behavior per ADR-003. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Keep legacy tool definitions only as bridge descriptors if proxy mode requires old-server registration. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/**` | Modify | Ensure prompt-time hook wrappers route through the standalone advisor package/server. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Keep the Python shim as the canonical package-local CLI surface. |
| `.opencode/skills/system-spec-kit/scripts/skill_advisor.py` | Modify/Create shim | If present or needed for legacy callers, make it a thin package-local forwarding shim. |
| `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml` | Modify | Update scorer lane and DB target paths from system-spec-kit advisor locations to system-skill-advisor. |
| `.opencode/commands/doctor/assets/doctor_update.yaml` | Modify | Add the standalone advisor DB/server into health probes and dependency order where needed. |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modify | Describe memory MCP plus separate advisor MCP topology. |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modify | Describe standalone advisor MCP install, verification, and legacy bridge window. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All `advisor_*` callers route to `system_skill_advisor` MCP server | Grep inventory shows no production caller invoking `spec_kit_memory.advisor_*` except the explicit legacy proxy. |
| REQ-002 | Tool ids unchanged | `advisor_recommend`, `advisor_status`, `advisor_rebuild`, `advisor_validate`, and any shipped advisor ids keep the same public names in schemas, docs, and tests. |
| REQ-003 | `spec_kit_memory` advisor registrations become proxy/deprecation bridge | Memory MCP either forwards to `system_skill_advisor` with a deprecation log or returns the ADR-approved migration hint. ADR-003 selects proxy. |
| REQ-004 | `doctor:update` skill-advisor workflow points at new server | `doctor_update.yaml` probes and rebuild order refer to the standalone advisor server/package and DB path. |
| REQ-005 | Plugin bridge import paths updated | OpenCode skill-advisor bridge no longer imports `../dist/skill_advisor/compat/index.js` or reads old `skill_advisor/schemas` paths. |
| REQ-006 | Python shim points at new package | Legacy script path, if retained, delegates to `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Install guides describe dual-MCP topology | Both system-spec-kit memory and system-skill-advisor install guides document separate MCP servers, stable tool ids, and the temporary legacy bridge. |
| REQ-008 | Smoke tests pass for bridge, hooks, doctor, and shim | Plugin bridge smoke, hook smoke, Python shim smoke, and doctor invocation checks pass against the standalone server. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg "spec_kit_memory\\.advisor_|dist/skill_advisor|mcp_server/skill_advisor"` across production hook/plugin/shim/doctor surfaces returns only documented legacy proxy, tests, or historical references.
- **SC-002**: MCP tool listing for `system_skill_advisor` exposes the stable `advisor_*` ids and memory MCP no longer owns primary advisor handlers.
- **SC-003**: OpenCode skill-advisor plugin bridge smoke returns a prompt-safe brief from the standalone path and fails open cleanly when the advisor server is unavailable.
- **SC-004**: Claude, Codex, Gemini, and OpenCode prompt-time hooks either call the standalone advisor path or render the existing timeout/fallback behavior without old-server coupling.
- **SC-005**: `doctor:update --cleanup-legacy=false` exercises the new advisor health path before any legacy cleanup is attempted.
- **SC-006**: Install-guide review finds no remaining claim that advisor lives inside the memory MCP server.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 004 standalone launcher/configs | Consumers need an installed `system_skill_advisor` server to target | Run 005 only after launcher/config entry is verified. |
| Dependency | Child 003 source move | Package-local handlers, tools, schemas, compat, and scripts must exist | Treat missing package files as a halt condition, not a reason to recreate old paths. |
| Risk | Split consumers during migration | Some prompts may still hit memory MCP while others hit standalone advisor | Keep one-window proxy and log every legacy hit. |
| Risk | Direct imports bypass MCP process boundary | Plugin or hook code could keep loading advisor handlers in the host process | Prefer MCP-level dispatch for bridge paths; if direct import remains, document why and smoke it. |
| Risk | Tool-id stability mistaken for server-name stability | Operators may expect `spec_kit_memory.advisor_*` to stay primary | Install guides must state: ids stable, server ownership changed. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Legacy memory-side proxy must fail open with a migration hint rather than crash the memory MCP process.
- **NFR-R02**: Prompt-time hooks must preserve existing timeout fallback behavior.

### Maintainability

- **NFR-M01**: New consumer references should point at `system_skill_advisor` MCP or `.opencode/skills/system-skill-advisor/`, not old `system-spec-kit/mcp_server/skill_advisor/` paths.
- **NFR-M02**: Proxy code must be small, labeled deprecated, and easy for child 006 to remove.

### Observability

- **NFR-O01**: Every legacy proxy call must emit a bounded deprecation diagnostic naming the new server.
- **NFR-O02**: Doctor and smoke-test output must distinguish standalone advisor failures from memory MCP failures.

---

## 8. EDGE CASES

### Consumer Boundaries

- A caller has only tool id access, not server namespace access: keep proxy path for one minor version and document the migration hint.
- OpenCode plugin host cannot import native modules safely: keep subprocess/MCP dispatch, not in-host handler imports.
- Hook runtime has no MCP client during prompt submission: preserve package-local fallback or timeout brief behavior.

### Error Scenarios

- `system_skill_advisor` server is unavailable: proxy returns a fail-open response with deprecation and server-unavailable diagnostics.
- Both old and new servers register `advisor_*`: runtime config must prefer `system_skill_advisor`; memory registration is compatibility only.
- Doctor workflow sees old DB path and new DB path: new advisor DB under `.opencode/skills/system-skill-advisor/mcp_server/database/` is authoritative.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Hooks, plugins, shims, doctor YAMLs, install guides, memory proxy |
| Risk | 20/25 | Runtime cutover can break prompt-time routing across multiple clients |
| Research | 12/20 | Requires caller inventory and ADR alignment |
| Multi-Agent | 0/15 | Single implementation packet, no delegation required |
| Coordination | 12/15 | Depends on children 003 and 004; child 006 removes bridge |
| **Total** | **66/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | OpenCode bridge keeps old `dist/skill_advisor` import and fails after cleanup | High | High | Update bridge path and add smoke test before child 006 cleanup. |
| R-002 | Memory MCP proxy becomes permanent | Medium | Medium | Mark deprecation window in docs and add child 006 removal task. |
| R-003 | Doctor update mutates the wrong skill-graph DB | High | Medium | Update doctor assets to target `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`. |
| R-004 | Operators misread stable tool ids as stable server ownership | Medium | Medium | Install guides show dual-MCP topology and examples using `system_skill_advisor`. |

---

## 11. USER STORIES

### US-001: Prompt-Time Advisor Uses Standalone Server (Priority: P0)

**As an** operator, **I want** prompt-time hooks to route advisor recommendations through `system_skill_advisor`, **so that** the advisor no longer depends on the memory MCP process.

**Acceptance Criteria**:
1. Given a prompt-time hook runs, When it requests `advisor_recommend`, Then the primary route targets `system_skill_advisor`.
2. Given the standalone server is down, When the hook times out, Then it returns the existing prompt-safe fallback instead of crashing.

### US-002: Legacy Callers Get A Safe Migration Window (Priority: P0)

**As a** downstream caller still bound to `spec_kit_memory`, **I want** a temporary advisor proxy, **so that** the cutover does not break live sessions before child 006 removes compatibility.

**Acceptance Criteria**:
1. Given a caller invokes `spec_kit_memory.advisor_status`, When proxy mode is enabled, Then the call forwards to `system_skill_advisor.advisor_status` and logs a deprecation warning.
2. Given child 006 starts, When proxy removal is planned, Then the deprecation log and tests identify any remaining legacy callers.

### US-003: Doctor Update Checks The New Advisor Boundary (Priority: P0)

**As an** operator running `/doctor:update`, **I want** skill-advisor health probes to target the standalone server and DB, **so that** update orchestration validates the actual runtime boundary.

**Acceptance Criteria**:
1. Given `/doctor:update --cleanup-legacy=false` runs, When it reaches the advisor phase, Then it checks the standalone advisor server and package-local DB path.

### US-004: Install Guides Teach The New Topology (Priority: P1)

**As a** future maintainer, **I want** both install guides to explain memory MCP plus advisor MCP, **so that** I do not restore the old single-server assumption.

**Acceptance Criteria**:
1. Given a maintainer reads either guide, When they follow the advisor setup section, Then they see `system_skill_advisor` as a sibling MCP server with stable `advisor_*` tool ids.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None. ADR-003 in this packet selects proxy with a deprecation log for one minor version, removed by child 006.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Phase**: `../spec.md`
- **Parent ADR**: `001-extraction-design-and-adr/decision-record.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
