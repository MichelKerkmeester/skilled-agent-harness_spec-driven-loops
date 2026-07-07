---
title: "Feature Specification: Rename system_skill_advisor MCP server to mk_skill_advisor"
description: "Level 3 packet for renaming the Skill Advisor MCP runtime identity to mk_skill_advisor while preserving folder and tool-id stability."
trigger_phrases:
  - "013/009/015"
  - "mk_skill_advisor"
  - "mcp_mk-skill-advisor"
  - "system_skill_advisor rename"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/015-mcp-server-mk-skill-advisor-rename"
    last_updated_at: "2026-05-14T20:45:00Z"
    last_updated_by: "codex"
    recent_action: "mk_skill_advisor rename implemented and verified"
    next_safe_action: "Commit scoped rename"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0130090150000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-015-mk-skill-advisor-rename-2026-05-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-answered by operator: Option B, new sub-phase packet 015."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Rename system_skill_advisor MCP server to mk_skill_advisor

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The Skill Advisor MCP server currently advertises the runtime id `system_skill_advisor`, while the custom MCP naming pattern has moved to `mk_*` ids such as `mk_code_index`. This packet renames only the MCP runtime identity and launcher surface to `mk_skill_advisor`.

**Key Decisions**: use snake_case `mk_skill_advisor`, keep `.opencode/skills/system-skill-advisor/`, keep `advisor_*` and `skill_graph_*` tool ids.

**Critical Dependencies**: the rename must mirror the `system_code_graph` to `mk_code_index` pattern and stay atomic across runtime configs, launcher state, source registration, and live consumer namespace references.

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
| **Spec Folder** | `015-mcp-server-mk-skill-advisor-rename` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The advisor runtime is still registered as `system_skill_advisor`, which no longer matches the custom MCP identity pattern established by `mk_code_index`. That mismatch makes the advisor feel like a system-owned internal surface instead of a custom MakerKit-style MCP server, and it leaves live consumer references under `mcp__system_skill_advisor__*`.

### Purpose

Rename the MCP server id, launcher, state file, and live namespace references to `mk_skill_advisor` while preserving the skill folder, graph `skill_id`, and public tool ids.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename runtime MCP config keys from `system_skill_advisor` to `mk_skill_advisor` in all four runtime config files.
- Rename `.opencode/bin/skill-advisor-launcher.cjs` to `.opencode/bin/mk-skill-advisor-launcher.cjs`.
- Rename launcher log prefix, lockdir, state file, and state payload command values.
- Rename package-local launcher state file from `.skill-advisor-launcher.json` to `.mk-skill-advisor-launcher.json`.
- Update `advisor-server.ts` registration name to `mk_skill_advisor`.
- Sweep live `mcp__system_skill_advisor__*` namespace references to `mcp__mk_skill_advisor__*`.
- Update live docs and bridges that name the MCP server id.
- Update parent 013/009 continuity metadata to include child 015 and make it active.

### Out of Scope

- Renaming `.opencode/skills/system-skill-advisor/`; filesystem identity stays unchanged.
- Renaming `skill_id` values in graph metadata; `system-skill-advisor` still matches the skill folder.
- Renaming public MCP tool ids such as `advisor_recommend`, `advisor_status`, or `skill_graph_scan`.
- Rewriting historical specs or changelog entries that describe older states.
- Touching unrelated dirty files in `.opencode/skills/system-spec-kit/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `opencode.json` | Modify | Rename MCP block, launcher path, and namespace note. |
| `.claude/mcp.json` | Modify | Rename MCP block, launcher path, and namespace note. |
| `.codex/config.toml` | Modify | Rename MCP block, launcher path, and namespace note. |
| `.gemini/settings.json` | Modify | Rename MCP block, launcher path, and namespace note. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Rename/Modify | Launcher filename and internal identity. |
| `.opencode/skills/system-skill-advisor/mcp_server/database/.mk-skill-advisor-launcher.json` | Rename/Modify | Launcher state file identity. |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modify | MCP server registration name. |
| Live `.opencode/` consumers | Modify | Namespace and server-id references. |
| Packet 015 docs | Create/Modify | Level 3 documentation and verification evidence. |
| Parent `013/009/handover.md` and `graph-metadata.json` | Modify | Continuity update for child 015. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The MCP server id is `mk_skill_advisor` everywhere runtime configs register the advisor. | `rg -n 'system_skill_advisor' opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json` returns no hits. |
| REQ-002 | The launcher is renamed to `mk-skill-advisor-launcher.cjs` and writes `.mk-skill-advisor-launcher.json`. | `timeout 8 node .opencode/bin/mk-skill-advisor-launcher.cjs` reaches startup logs and creates/updates the mk-prefixed state file. |
| REQ-003 | The advisor MCP server registers as `mk_skill_advisor`. | `advisor-server.ts` contains `{ name: 'mk_skill_advisor' }` and the package typecheck passes. |
| REQ-004 | Live MCP namespace references use `mcp__mk_skill_advisor__*`. | Final grep for `mcp__system_skill_advisor__` outside specs/changelog/dist/node_modules is zero or only documented historical text. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Tool ids remain stable. | Final diff contains no rename of `advisor_*` or `skill_graph_*` tool ids. |
| REQ-006 | The skill folder and graph `skill_id` remain stable. | No `git mv` of `.opencode/skills/system-skill-advisor/`; packet docs state the boundary. |
| REQ-007 | Cross-package consumers remain type-safe. | Advisor package `npm run typecheck` and spec-kit MCP `npx tsc --noEmit` both pass. |
| REQ-008 | Parent continuity points at the new active child. | Parent `graph-metadata.json` includes child 015 and `derived.last_active_child_id` points at it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `opencode mcp list` shows `mk_skill_advisor` connected.
- **SC-002**: No live `mcp__system_skill_advisor__` namespace references remain outside historical specs and changelog.
- **SC-003**: Both required typechecks pass.
- **SC-004**: Strict validation for packet 015 passes.
- **SC-005**: A scoped commit lands on `main` with no force push and no branch creation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Built advisor dist | Launcher smoke depends on the compiled entrypoint existing or building cleanly. | Run advisor package typecheck and launcher smoke before commit. |
| Risk | Confusing MCP server id with skill folder id | Renaming the folder would break graph metadata and 010's folder/id invariant. | Keep folder and `skill_id` unchanged; document ADR-002. |
| Risk | Caller churn from tool-id rename | Renaming tool ids would break stable external callers. | Keep `advisor_*` and `skill_graph_*` unchanged; document ADR-003. |
| Risk | Runtime cache state | Existing MCP children may keep old server name until reconnect. | Update configs and state file; note reconnect behavior if list output lags. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Runtime identity must follow the `mk_*` custom MCP pattern without changing package ownership.
- **NFR-M02**: Live docs must describe the current MCP topology clearly enough for operator use.

### Reliability

- **NFR-R01**: Runtime configs, launcher state, and server registration must agree on the same id.
- **NFR-R02**: Verification must include typechecks plus a launcher smoke test.

### Compatibility

- **NFR-C01**: Existing callers keep the same tool ids after selecting the new MCP namespace.
- **NFR-C02**: Historical packet docs remain historical rather than rewritten.

---

## 8. EDGE CASES

### Identity Boundaries

- `mk_skill_advisor` is the MCP server id and namespace segment.
- `system-skill-advisor` remains the skill folder and graph skill id.
- `mk-skill-advisor-launcher` is only the launcher process/state identity.

### Runtime Boundaries

- Existing long-lived MCP sessions may need restart or reconnect to see the new server id.
- The old `.skill-advisor-launcher.json` file is renamed rather than archived.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Four runtime configs, launcher rename, source registration, docs, bridges, parent continuity. |
| Risk | 18/25 | MCP naming affects runtime discovery and allowed-tool namespace references. |
| Research | 16/20 | Requires prior `mk_code_index` rename template and sibling packet review. |
| Multi-Agent | 0/15 | Single-agent dispatch; nested agents forbidden. |
| Coordination | 12/15 | Parent phase metadata and parallel dirty-worktree boundaries matter. |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A stale runtime config still launches the old binary path. | H | M | Sweep all four runtime configs and grep for old launcher path. |
| R-002 | A live command allowed-tools list keeps the old namespace. | H | M | Final grep for `mcp__system_skill_advisor__` outside specs/changelog. |
| R-003 | Verification mutates unrelated dirty database files. | M | M | Stage only dispatch-owned paths and keep unrelated dirty files out of commit. |

---

## 11. USER STORIES

### US-001: Runtime Operator Sees mk_skill_advisor (Priority: P0)

**As an** operator, **I want** the advisor MCP server to register as `mk_skill_advisor`, **so that** it matches the custom MCP naming convention.

**Acceptance Criteria**:
1. Given the runtime config is loaded, When MCP servers are listed, Then `mk_skill_advisor` is the advisor server id.

---

### US-002: Existing Tool Callers Keep Stable Tool Names (Priority: P0)

**As a** caller of advisor tools, **I want** `advisor_*` and `skill_graph_*` tool names to remain unchanged, **so that** the namespace migration is bounded to the server prefix.

**Acceptance Criteria**:
1. Given a caller moves from `mcp__system_skill_advisor__skill_graph_status` to `mcp__mk_skill_advisor__skill_graph_status`, When it calls the tool, Then the tool id remains `skill_graph_status`.

---

## 12. OPEN QUESTIONS

None. The operator locked the architecture and pre-approved Gate 3 as Option B.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
