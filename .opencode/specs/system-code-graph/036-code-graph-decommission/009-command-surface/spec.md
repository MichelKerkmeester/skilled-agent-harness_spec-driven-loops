---
title: "Feature Specification: Phase 9: command-surface"
description: "Clear the command surface: delete the code-graph doctor route, strip graph tool grants from the deep commands and create assets, and re-render the generated command contracts from their sources rather than hand-editing them."
trigger_phrases:
  - "doctor code graph route removal"
  - "deep command allowed tools code graph"
  - "compiled command contract re-render"
  - "create asset code graph boilerplate"
  - "036 command surface"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/009-command-surface"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the phase and verified it"
    next_safe_action: "Closeout verification in phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-009-command-surface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: command-surface

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 16 |
| **Predecessor** | 008-deep-loop-and-skill-surface |
| **Successor** | 010-agent-definitions |
| **Handoff Criteria** | No command routes to, grants, or documents a removed tool, and every generated contract is re-rendered from an updated source |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the code graph decommission specification.

**Scope Boundary**: `.opencode/commands/**`, including the doctor routes, the deep command family, and the create assets.

**Dependencies**:
- Phase 002 replacement routing for the search-guidance text carried in command docs.

**Deliverables**:
- The code-graph doctor route deleted and removed from the route manifest.
- Doctor MCP install, debug, and update assets cleared of the server.
- Graph tool ids removed from the deep commands' allowed-tools and prose.
- Create and speckit asset boilerplate cleared.
- Compiled command contracts re-rendered and verified by the route guard.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The command surface is the largest single grouping outside the skills, and it mixes three kinds of file. There is a whole route dedicated to diagnosing the code graph, which becomes meaningless. There are hand-authored command docs whose allowed-tools lists grant the graph tools. And there are compiled contract files that are generated from those sources — editing them directly would be overwritten on the next sync and would fail the route guard. A single sweep that treats all three alike produces either a broken route manifest or a contract that drifts from its source.

### Purpose
Leave a command surface where no route diagnoses a removed subsystem, no command grants a tool that does not exist, and every generated file matches a re-rendered source.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deleting the code-graph doctor route asset and its manifest entry.
- Updating doctor MCP install, debug, presentation, and update assets, and the MCP doctor script.
- Removing graph tool ids from the deep commands' allowed-tools and body text.
- Clearing one-line boilerplate from create and speckit assets.
- Re-rendering compiled contracts and legacy bodies from their updated sources.

### Out of Scope
- Agent definitions — phase 010.
- Root instruction files and READMEs — phase 011.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/assets/doctor-code-graph.yaml` | Delete | Route exists only for the removed subsystem |
| `.opencode/commands/doctor/_routes.yaml` | Modify | Remove the route entry |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modify | Remove skill-dir and server checks |
| `.opencode/commands/doctor/assets/doctor-mcp-*.yaml` | Modify | Remove the server from install and debug flows |
| `.opencode/commands/deep/*.md` | Modify | Remove graph tool grants and prose |
| `.opencode/commands/deep/assets/compiled/*.contract.md` | Regenerate | Re-render from updated sources |
| `.opencode/commands/create/assets/*.yaml` | Modify | Clear boilerplate references |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The route manifest has no dangling entry | Every listed route resolves to an existing asset |
| REQ-002 | Compiled contracts are regenerated, never hand-edited | The route guard reports no drift between source and compiled output |
| REQ-003 | No command grants a removed tool | Allowed-tools lists contain no graph tool id |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Doctor flows stay coherent without the route | Install and debug flows run end to end |
| REQ-005 | Search guidance in command docs points at the replacement | No doc recommends a removed tool |
| REQ-006 | Legacy fallback bodies match their compiled counterparts | Both surfaces carry the same content |
| REQ-007 | Referential integrity checks pass | The command asset integrity check reports no broken reference |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The doctor router lists only routes that resolve.
- **SC-002**: The compiled-route guard passes with no drift after regeneration.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hand-editing a generated contract | Change lost on next sync; guard fails | REQ-002 mandates regeneration from source |
| Risk | Deleting a route without its manifest entry | Router points at a missing asset | REQ-001 verifies manifest resolution |
| Risk | Boilerplate edits change command behaviour | Unintended routing change | Restrict edits to the referenced lines; re-run the integrity check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the doctor surface need a replacement route for diagnosing the remaining two daemons, or do existing routes already cover them?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
