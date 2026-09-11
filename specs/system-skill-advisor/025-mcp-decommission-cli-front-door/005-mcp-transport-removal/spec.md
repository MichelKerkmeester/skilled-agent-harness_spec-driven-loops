---
title: "Feature Specification: Phase 5: mcp-transport-removal"
description: "Delete the stdio transport, the SDK dependency, the plugin bridge and the MCP framing, remove all five server declarations, and reduce the launcher to a daemon supervisor"
trigger_phrases:
  - "advisor mcp removal"
  - "advisor transport delete"
  - "advisor registration removal"
  - "advisor launcher supervisor"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 5: mcp-transport-removal

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

With every caller on the CLI, the MCP layer holds nothing. This phase deletes it: the stdio server, the SDK dependency, the OpenCode bridge, the MCP JSON-RPC framing between the CLI and its own daemon, and the server declaration in all five runtime config roots. The launcher keeps daemon supervision and loses only its MCP role.

**Key Decisions**: Delete rather than deprecate; preserve-set items are checked after deletion, never assumed

**Critical Dependencies**: Phase 004's completed rewire and its empty caller sweep

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-caller-rewire |
| **Successor** | 006-runtime-package-rename |
| **Handoff Criteria** | No runtime config declares the advisor server, the SDK has no importer, and every runtime boots clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the skill advisor MCP decommission specification.

**Scope Boundary**: The transport and what exists only to serve it. The daemon, the scorer, the skill graph and the shared infrastructure all survive.

**Dependencies**:
- Phase 004 must show an empty caller sweep before anything is deleted.
- Phase 001 for the preserve set that is checked afterwards.

**Deliverables**:
- The stdio server file and the OpenCode plugin bridge, deleted.
- The MCP SDK gone from the package dependency list with no importer left.
- Five runtime config roots with no advisor server declaration.
- The launcher reduced to daemon supervision, lease and model-server duties.
- A post-deletion check confirming every preserve-set item is present.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The MCP layer is a pass-through that costs a declaration in five runtime config roots, an SDK dependency, a bridge process for OpenCode, and an MCP-shaped JSON-RPC framing that the CLI has to speak to reach its own daemon. Once phase 004 lands, nothing calls any of it. Left in place it is dead weight that every future reader has to understand and every runtime has to start.

### Purpose
Leave the advisor with one transport, one front door, and no protocol dependency.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The stdio MCP server and its SDK request handlers.
- The `@modelcontextprotocol/sdk` dependency and every importer of it in the advisor package.
- The OpenCode plugin bridge.
- The MCP JSON-RPC framing on the CLI-to-daemon socket, replaced by the phase 002 protocol.
- The advisor server declaration in opencode.json, .claude/mcp.json, .codex/config.toml, .cursor/mcp.json and .pi/mcp.json.
- The launcher's MCP responsibilities.

### Out of Scope
- The daemon itself, unless phase 002 decided otherwise on measured grounds.
- The shared HF model server, its socket, and the shared IPC socket bridge.
- Every other MCP server in the repository.
- The package rename, which is phase 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts` | Delete | The stdio transport |
| `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/` | Delete | The OpenCode MCP bridge |
| `.opencode/skills/system-skill-advisor/mcp-server/package.json` | Modify | SDK dependency removed |
| `opencode.json` | Modify | Server declaration and its env block removed |
| `.claude/mcp.json` | Modify | Server declaration and its env block removed |
| `.codex/config.toml` | Modify | Server declaration and its env block removed |
| `.cursor/mcp.json` | Modify | Server declaration and its env block removed |
| `.pi/mcp.json` | Modify | Server declaration and its env block removed |
| `.opencode/bin/system-skill-advisor-launcher.cjs` | Modify | Daemon supervisor, no MCP role |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No runtime config root declares a skill advisor MCP server |
| REQ-002 | The MCP SDK has no importer in the advisor package and is gone from its dependency list |
| REQ-003 | The stdio server file and the plugin bridge are deleted |
| REQ-004 | Every runtime starts with no advisor MCP process, no stale lock directory and no orphan child |
| REQ-005 | The advisor still resolves its embedder over the shared socket after the removal |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every preserve-set item is present and was checked rather than assumed |
| REQ-007 | Each mixed row in a shared config file was edited at source rather than token-deleted |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five config roots report zero hits for the advisor server key.
- **SC-002**: A cold boot of each runtime shows no advisor MCP process and no timeout notice.
- **SC-003**: A live CLI recommendation succeeds after the removal.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An env row in a shared config removed with its neighbours | High | Edit mixed rows at source; never delete by token match |
| Risk | The daemon loses its start trigger with the MCP client gone | High | The phase 002 warm mechanism must be in place from phase 003 before this deletion |
| Risk | A preserve-set item assumed rather than checked | Medium | Run the check after the deletion and record its output |
| Dependency | Empty caller sweep from phase 004 | Deleting earlier breaks the prompt path | Do not start until the sweep is empty |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No advisor call path gets slower than the phase 002 budget allows.

### Reliability
- **NFR-R01**: A failure in the advisor path degrades the same way it degrades today: the caller keeps working without a recommendation, and never blocks on one.

---

## 8. EDGE CASES

### Failure boundaries
- Daemon absent or not yet warm: the caller gets the documented retryable outcome, not a hang.
- Stale build output: the front door refuses with a readable message rather than serving an old answer.
- Concurrent callers: several runtimes holding sessions at once keep working, as they do today.

---

## 9. COMPLEXITY ASSESSMENT

Build phase. The risk is not in writing the code but in the blast radius: the advisor sits on the prompt path of every runtime, so a regression is visible on the next message.

---

## 12. OPEN QUESTIONS

- None open at authoring time beyond those the parent spec records; anything found during planning is raised there.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase Goal**: See `goal.md` for the durable directive this phase executes against
- **Parent Goal**: See `../goal.md` for the packet directive that outranks it
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
