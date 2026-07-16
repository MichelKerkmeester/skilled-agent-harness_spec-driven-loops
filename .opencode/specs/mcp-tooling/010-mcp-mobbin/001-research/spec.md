---
title: "Feature Specification: Phase 1: research"
description: "Deep-research fan-out phase for the mcp-mobbin transport program. Runs a 10-iteration /deep:research loop against the official Mobbin MCP server and skills repositories to verify the tool surface, auth model, plan gating, and transport eligibility before any skill authoring begins."
trigger_phrases:
  - "mcp-mobbin research"
  - "mobbin deep research"
  - "mobbin mcp tool surface"
  - "mobbin transport eligibility"
  - "phase 001 research"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/001-research"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the planned research-phase spec docs"
    next_safe_action: "Initialize the /deep:research run when the packet is approved"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/spec.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/plan.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/tasks.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/context/website-link.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "What credential does mobbin-mcp-server require and how is it provisioned?"
      - "Which Mobbin MCP tools, if any, are Pro-plan gated?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: research

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-skill-authoring |
| **Handoff Criteria** | `research/research.md` synthesis converged with cited findings covering the Mobbin MCP tool surface, auth model, plan gating, and transport eligibility; findings registry internally consistent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the mcp-mobbin nested mode: Mobbin design-research MCP transport for the mcp-tooling hub specification.

**Scope Boundary**: This phase runs a /deep:research loop and writes ONLY workflow-owned state inside `001-research/research/` (plus phase-doc updates in this folder). It must not create or edit anything under `.opencode/skills/`, `.utcp_config.json`, or any other phase folder — authoring and integration start in phases 002 and 003.

**Dependencies**:
- Source links in `context/website-link.md`: https://github.com/mobbin/mobbin-mcp-server (official MCP server) and https://github.com/mobbin/skills (official skills)
- The /deep:research workflow (system-deep-loop research mode packet) available in this runtime

**Deliverables**:
- Workflow-owned deep-research state packet in `research/` (iteration state, deltas, logs — owned and structured by the /deep:research workflow, not hand-rolled)
- `research/research.md`: converged synthesis of the Mobbin MCP tool surface (tool names, inputs/outputs, read-only posture), auth/key model, plan gating, and transport-contract eligibility (`mutatesWorkspace:false`)
- A consistent findings registry backing the synthesis with cited sources

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.

### Fan-Out Executor Schedule (exact)

The /deep:research run executes **10 iterations** with `--stop-policy=max-iterations`:

| Lineage | Executor | Iterations |
|---------|----------|------------|
| A | cli-codex gpt-5.6-sol xhigh fast | 5 |
| B | cli-opencode zai-coding-plan/glm-5.2 max | 2 |
| C | cli-codex gpt-5.6-luna max fast | 3 |

All lineage state lands in the workflow-owned `research/` packet inside this phase folder; the synthesis is `research/research.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 002 and 003 must author a transport packet and a `.utcp_config.json` manual for an MCP server this repo has never run. The Mobbin MCP server's actual tool surface, credential model, plan gating, and read-only guarantees are unverified — authoring from assumptions would bake errors into the skill's tool_surface reference, the UTCP manual snippet, and the transport-contract claims.

### Purpose
Produce a converged, source-cited factual foundation (`research/research.md`) on the Mobbin MCP server so the transport packet and hub integration are grounded in verified findings rather than guesses.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Initialize and run the /deep:research loop with the exact 10-iteration executor schedule above against the two source repositories
- Monitor the three lineages to productive completion; intervene only through the workflow's own state machine
- Verify the synthesis converged and the findings registry is complete and internally consistent
- Close out the phase with the handoff evidence for 002-skill-authoring

### Out of Scope
- Authoring any file under `.opencode/skills/mcp-tooling/mcp-mobbin/` — that is phase 002, grounded in this phase's synthesis
- Editing `.utcp_config.json` or any hub file — that is phase 003
- Hand-rolled research state outside the workflow-owned `research/` packet — the /deep:research workflow owns its state layout

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research/research/**` | Create | Workflow-owned deep-research state packet (iterations, deltas, logs) |
| `001-research/research/research.md` | Create | Converged synthesis with cited findings |
| `001-research/spec.md`, `plan.md`, `tasks.md` | Modify | Phase-doc status updates as the run progresses |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | /deep:research run initialized with the exact fan-out schedule (5× cli-codex gpt-5.6-sol xhigh fast, 2× cli-opencode zai-coding-plan/glm-5.2 max, 3× cli-codex gpt-5.6-luna max fast; `--stop-policy=max-iterations`) against the sources in `context/website-link.md` | Run state packet exists in `research/` and records the schedule and stop policy as configured |
| REQ-002 | Converged synthesis covering tool surface, auth model, plan gating, and transport eligibility | `research/research.md` exists, every load-bearing claim cites a source, and it answers: full tool list with read-only posture, credential requirement and provisioning, Pro-plan gating, and `mutatesWorkspace:false` eligibility |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Findings registry verified consistent with the synthesis | No contradiction between registry findings and research.md claims; unresolved unknowns are explicitly marked UNKNOWN rather than papered over |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 10 iterations complete across the three lineages and the synthesis converges with cited findings sufficient for phase 002 to author `tool_surface.md` and the UTCP manual snippet without new research.
- **SC-002**: Zero files outside `001-research/` are touched during this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | External executor CLIs (cli-codex, cli-opencode) available and warm | Run cannot start or lineages stall | Verify executor availability at init; the workflow's resume path recovers interrupted lineages |
| Risk | Mobbin repos change or docs are thin, leaving auth/gating questions unresolved | Medium | Mark unresolved items UNKNOWN in the synthesis; phase 002 treats them as open install-guide caveats rather than inventing answers |
| Risk | Executor iterations drift off-topic and burn the fixed iteration budget | Medium | `--stop-policy=max-iterations` bounds the run; monitor lineages and rely on the workflow's per-iteration delta review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What credential does `mobbin-mcp-server` require (API key? OAuth?) and how is it provisioned and stored for Code Mode use?
- Which Mobbin MCP tools, if any, are gated behind a Pro plan, and what is the free-tier behavior?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
