---
title: "Feature Specification: Validate advisor extraction and remove deprecated bridge"
description: "Step 5 of ADR-001's migration validates all prior extraction deliverables, removes the temporary spec_kit_memory advisor proxy, and clears stale old-path documentation after consumers target system_skill_advisor."
trigger_phrases:
  - "013/009/006 validation cleanup"
  - "advisor extraction cleanup"
  - "remove spec_kit_memory advisor proxy"
  - "system_skill_advisor final validation"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/006-clean-validation-and-remove-deprecated-code"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "Validation cleanup landed; P0 tests blocked"
    next_safe_action: "Fix system-skill-advisor package-local Vitest/path failures, then rerun final matrix"
    blockers:
      - "Package-local system-skill-advisor Vitest failed: 153 passed / 71 failed / 38 files."
      - "Hook smoke failed one settings-driven suite because expected Claude settings file is absent."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0130090060000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-006-validation-cleanup"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Gate 3: Option A existing spec folder 013/009/006; writes scoped to this folder and its description.json."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Validate Advisor Extraction and Remove Deprecated Bridge

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Child 006 is the final validation and cleanup pass for ADR-001's standalone advisor MCP migration. It proves the extracted `.opencode/skills/system-skill-advisor/mcp_server/` package works from its new home, verifies all four runtime MCP configurations expose both required servers, and removes the temporary `spec_kit_memory` advisor proxy once caller evidence is clean.

**Key Decisions**: validate before deletion, remove the bridge only after zero-caller evidence, delete stale live docs by default.

**Critical Dependencies**: children 003, 004, and 005 must have landed the moved source, standalone launcher/runtime configs, and consumer cutover before this packet removes compatibility surfaces.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented-with-blockers |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

ADR-001 intentionally allowed a short compatibility window where `spec_kit_memory` could expose advisor proxy tools while consumers moved to the standalone `system_skill_advisor` MCP server. After child 005, that bridge becomes debt: stale old-path docs, deprecation hints, and proxy tool registrations can mislead operators into wiring the retired `mcp_server/skill_advisor/` surface back into service.

### Purpose

Run the final validation matrix across package-local tests, runtime configs, live advisor probes, hooks, Python parity, DB path behavior, and install docs, then remove compatibility code and stale live documentation that no longer describe the accepted topology.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Validate package-local Vitest execution from `.opencode/skills/system-skill-advisor/mcp_server/` using its own `tsconfig.json` and `vitest.config.ts`.
- Validate Python parity tests against the moved Python shim and run hook smoke tests for the post-cutover wrappers.
- Confirm OpenCode, Codex, Claude, and Gemini runtime MCP configs each list `spec_kit_memory` and `system_skill_advisor`.
- Probe `advisor_recommend` through all four runtime surfaces and record evidence.
- Verify advisor SQLite defaults to `.opencode/skills/system-skill-advisor/mcp_server/database/` across cold-start runs.
- Review install guides in both involved skill folders for topology accuracy.
- Remove the temporary `spec_kit_memory` advisor proxy added during child 005.
- Remove deprecation hints, fail-fast messages, and live stale doc references to `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/`.
- Confirm old `spec_kit_memory.advisor_*` registrations are absent after cleanup.

### Out of Scope

- Changing advisor scoring math, lane weights, scorer fusion behavior, or public `advisor_*` tool ids.
- Reworking the standalone launcher beyond cleanup required by validation failures.
- Editing sibling spec packets except when a future implementation run explicitly expands scope; this scaffold only documents the work.
- Renaming MCP server ids away from `spec_kit_memory` or `system_skill_advisor`.
- Keeping stale live-path warnings that say operators must not register a second MCP server.

### Files to Change During Packet Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/**` | Verify/Modify | Run package-local tests and fix package-local validation issues if found. |
| `.opencode/skills/system-spec-kit/mcp_server/**` | Modify/Delete | Remove the temporary advisor proxy and old `advisor_*` registrations from `spec_kit_memory`. |
| `.opencode/skills/system-spec-kit/**` | Modify | Remove stale live references and invalid second-server warnings in skill docs and install guides. |
| `.opencode/skills/system-skill-advisor/**` | Modify | Remove migration-era deprecation text and verify install guide accuracy. |
| Runtime MCP configs | Verify/Modify | Ensure OpenCode, Codex, Claude, and Gemini list both MCP servers. |
| `.opencode/specs/**` | Modify | Remove or annotate stale live references according to ADR-004 policy. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Package-local Vitest runs from `system-skill-advisor/mcp_server/` | `npm test` or the package-local Vitest command runs from the new folder and exits 0. |
| REQ-002 | Four runtime configs expose both MCP servers | OpenCode, Codex, Claude, and Gemini configs each list `spec_kit_memory` and `system_skill_advisor`. |
| REQ-003 | `advisor_recommend` works from every runtime | Live probes from OpenCode, Codex, Claude, and Gemini all return a valid recommendation response from `system_skill_advisor`. |
| REQ-004 | `spec_kit_memory` advisor proxy removed | Memory MCP no longer registers, imports, or dispatches advisor proxy tools added in child 005. |
| REQ-005 | Old source path absent from live code | `rg 'mcp_server/skill_advisor/'` has zero live-code hits outside explicitly historical spec sections. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | DB path verified at new location | Cold-start runs create or read `skill-graph.sqlite` under `system-skill-advisor/mcp_server/database/` unless the test-only env override is set. |
| REQ-007 | Install guides match the new topology | Both relevant skill folders describe standalone `system_skill_advisor` plus `spec_kit_memory` without contradiction. |
| REQ-008 | Deprecation messages removed | User-visible deprecation hints and fail-fast bridge messages for the old advisor surface are gone after zero-caller evidence. |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Old `spec_kit_memory.advisor_*` ids explicitly absent | Final tool-schema inspection records that `spec_kit_memory` exposes no advisor tool ids. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The package-local TypeScript/Vitest suite passes from `.opencode/skills/system-skill-advisor/mcp_server/`.
- **SC-002**: All four runtime MCP configs list both `spec_kit_memory` and `system_skill_advisor`.
- **SC-003**: `advisor_recommend` live probes pass through each runtime on the standalone advisor server.
- **SC-004**: The memory MCP server exposes no advisor proxy tools or bridge imports.
- **SC-005**: Old `mcp_server/skill_advisor/` path hits are limited to legitimate historical ADR/spec context, with live docs cleaned.
- **SC-006**: Install guides no longer warn against registering the second MCP server.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 004 runtime configs | Four-runtime smoke cannot pass if standalone MCP entries are missing. | Verify config state first and block cleanup if a runtime still lacks `system_skill_advisor`. |
| Dependency | Child 005 consumer cutover | Proxy removal can break hooks, plugin bridge, or shims if callers still target `spec_kit_memory.advisor_*`. | Require zero-caller grep evidence plus manual operator confirmation before removing the bridge. |
| Risk | Historical references get deleted incorrectly | ADR context can lose migration rationale. | Apply ADR-004: delete live stale references, annotate legitimate historical sections. |
| Risk | Runtime smoke tests are environment-sensitive | Local MCP config or launcher state may vary by runtime. | Capture exact command, runtime, server id, and response evidence for each probe. |
| Risk | DB path verification mutates operator state | Cold-start checks can create SQLite files in the real skill folder. | Prefer disposable env override for tests and separately inspect default path resolution without destructive cleanup. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Cleanup must not remove the standalone advisor server or its stable `advisor_*` public tool ids.
- **NFR-R02**: Runtime smoke evidence must distinguish failures in `spec_kit_memory` from failures in `system_skill_advisor`.

### Maintainability

- **NFR-M01**: Live docs must describe the final two-server topology without compatibility-window caveats.
- **NFR-M02**: Historical migration context may remain only when it is visibly historical and not an operator instruction.

### Safety

- **NFR-S01**: Bridge removal requires zero live callers and manual operator confirmation as defined in ADR-003.
- **NFR-S02**: DB validation must avoid deleting or overwriting existing advisor SQLite data.

---

## 8. EDGE CASES

### Validation Boundaries

- Runtime config exists but launcher command is stale: fail the runtime row and repair config or launcher wiring before cleanup.
- `advisor_recommend` works in one runtime but not another: keep the proxy removal blocked until the failing runtime is understood.
- Grep finds `mcp_server/skill_advisor/` inside ADR context: annotate as historical when the surrounding section explicitly explains the migration.
- Grep finds `mcp_server/skill_advisor/` inside install instructions, SKILL.md, README, hooks, or code: treat as stale and remove or rewrite.

### Error Scenarios

- Package-local Vitest cannot discover tests: fix package-local discovery rather than adding old-path aliases.
- Python parity fails because shim imports old modules: update the shim target to `system-skill-advisor` before deleting proxy code.
- DB cold-start writes to the old Spec Kit database directory: block completion and repair the DB resolver.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Multiple MCP configs, package tests, hooks, Python shim, docs, and cleanup. |
| Risk | 18/25 | Removing compatibility surfaces can break callers if validation is incomplete. |
| Research | 10/20 | Requires evidence from prior child packets and stale-reference inventory. |
| Multi-Agent | 0/15 | This packet can be executed serially; dispatch forbids SpawnAgent for this scaffold. |
| Coordination | 10/15 | Depends on child 003-005 deliverables and operator confirmation for bridge removal. |
| **Total** | **58/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Removing the proxy while a hidden caller still uses `spec_kit_memory.advisor_*`. | High | Medium | Require zero-caller inventory plus manual operator confirmation. |
| R-002 | Runtime smoke probes give false confidence because they call the wrong server. | High | Medium | Capture server id and tool id in each probe result. |
| R-003 | Stale install docs lead users to avoid registering `system_skill_advisor`. | Medium | High | Scan install guides and delete invalid second-server warnings. |
| R-004 | Historical spec cleanup removes useful migration evidence. | Medium | Low | Preserve ADR sections that explicitly document past decisions. |

---

## 11. USER STORIES

### US-001: Validate standalone advisor package (Priority: P0)

**As an** operator, **I want** advisor tests to run from `system-skill-advisor/mcp_server/`, **so that** the package proves it owns its build and test surface.

**Acceptance Criteria**:
1. Given the standalone package folder, When the package-local Vitest command runs, Then it discovers tests in the new location and exits 0.

### US-002: Prove runtime availability (Priority: P0)

**As an** operator, **I want** all four runtimes to expose `system_skill_advisor`, **so that** users can call advisor tools without relying on memory MCP compatibility.

**Acceptance Criteria**:
1. Given each runtime config, When MCP servers are inspected, Then both `spec_kit_memory` and `system_skill_advisor` are present.
2. Given each runtime, When `advisor_recommend` is invoked, Then the response comes from `system_skill_advisor`.

### US-003: Remove compatibility debt (Priority: P0)

**As a** maintainer, **I want** the temporary memory-side proxy removed, **so that** there is one runtime owner for advisor tools.

**Acceptance Criteria**:
1. Given zero-caller evidence and operator confirmation, When cleanup is applied, Then `spec_kit_memory` no longer exposes advisor proxy tools.

### US-004: Clean operator-facing docs (Priority: P1)

**As a** future maintainer, **I want** docs to describe the final topology, **so that** install and troubleshooting paths do not resurrect the old source path.

**Acceptance Criteria**:
1. Given live docs and install guides, When stale-reference scans run, Then no operator instruction points to `mcp_server/skill_advisor/` or says not to register a second MCP server.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None for scaffold. ADR-003 requires manual operator confirmation during execution before bridge removal.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Phase**: `../spec.md`
- **ADR-001 Source**: `001-extraction-design-and-adr/decision-record.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
