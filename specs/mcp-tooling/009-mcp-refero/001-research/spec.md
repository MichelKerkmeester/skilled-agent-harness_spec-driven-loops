---
title: "Feature Specification: Phase 1: research"
description: "Deep-research phase for the mcp-refero transport program: a 10-iteration /deep:research fan-out over the Refero MCP surface (tool inventory, auth, rate limits, free-vs-paid gating, official skill-repo conventions) whose converged synthesis grounds the phase 002 packet authoring."
trigger_phrases:
  - "mcp-refero research"
  - "refero deep research"
  - "refero mcp tool surface"
  - "refero fan-out"
  - "phase 001 research"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/001-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the planned deep-research phase docs"
    next_safe_action: "Initialize the /deep:research run when the packet is approved"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/tasks.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/context/website-link.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Refero auth model and rate limits over mcp-remote"
      - "Free vs paid tool-surface differences on the Refero MCP"
    answered_questions:
      - "Source links pinned in context/website-link.md: https://refero.design/mcp and https://github.com/referodesign/refero_skill"
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
| **Handoff Criteria** | `research/research.md` synthesis converged with cited findings and a verified findings registry covering the Refero MCP tool surface, auth, limits, and skill-repo conventions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the mcp-refero nested mode: Refero design-reference MCP transport for the mcp-tooling hub specification.

**Scope Boundary**: This phase runs a `/deep:research` loop whose state packet lands inside `001-research/research/` (workflow-owned: the deep-research state machine writes `deep-research-state.jsonl`, `deltas/`, `logs/`, and the synthesis; this phase does not hand-roll that layout). No file outside this phase folder is created or modified; in particular `.opencode/skills/**` stays untouched until phase 002.

**Dependencies**:
- Source links pinned in `context/website-link.md`: https://refero.design/mcp (product/MCP page) and https://github.com/referodesign/refero_skill (official skill repo).
- The existing `refero` manual in `.utcp_config.json` (`npx -y mcp-remote https://api.refero.design/mcp`) as the live transport under test — read-only reference for research, verified (not modified) later in phase 003.

**Deliverables**:
- A complete deep-research state packet under `research/` produced by the fan-out run.
- `research/research.md`: the converged synthesis with cited findings — Refero MCP tool inventory (names, parameters, response shapes), auth model, rate limits, free-vs-paid gating, and the official skill repo's documented conventions.
- A findings registry inside the state packet that phase 002 can trace each authored claim back to.

**Fan-out executor schedule (exact)**:
- 10 iterations total under `--stop-policy=max-iterations`:
  - 5× `cli-codex` gpt-5.6-sol xhigh fast
  - 2× `cli-opencode` zai-coding-plan/glm-5.2 max
  - 3× `cli-codex` gpt-5.6-luna max fast
- Executor CLIs are the HOW inside the `/deep:research` workflow; the workflow owns state, convergence, and synthesis.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Refero MCP is an unverified external surface: this repo has never documented its tool names, parameters, auth expectations, rate limits, or free-vs-paid gating, and the official `refero_skill` repo's conventions have not been reviewed. Authoring the phase 002 transport packet without that research would produce a skill grounded in guesses about a live remote API.

### Purpose
Produce a converged, citation-backed research synthesis of the Refero MCP surface and official skill conventions that phase 002 can author the `mcp-refero` transport packet from without further discovery.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Initialize and run the `/deep:research` loop with the exact 10-iteration executor schedule above, `--stop-policy=max-iterations`.
- Research targets: Refero MCP tool inventory and semantics; auth model over `mcp-remote`; rate limits; free-vs-paid tool-surface differences; `referodesign/refero_skill` repo structure and documented usage conventions; how existing transport modes (mcp-figma) map onto Refero's read-only search surface.
- Verify the synthesis (`research/research.md`) and findings registry after convergence.

### Out of Scope
- Any write to `.opencode/skills/**` — packet authoring is phase 002.
- Any change to `.utcp_config.json` or hub routing files — verification and integration are phase 003.
- Hand-rolled research state outside the `/deep:research` workflow-owned `research/` packet — the state machine owns its own layout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research/research/**` | Create | Workflow-owned deep-research state packet (state JSONL, deltas, logs, iteration outputs) |
| `001-research/research/research.md` | Create | Converged synthesis with cited findings |
| `001-research/tasks.md` | Modify | Track run initialization, lineage monitoring, synthesis verification, and close-out |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fan-out runs the exact executor schedule | Deep-research run log shows 10 iterations: 5× cli-codex gpt-5.6-sol xhigh fast, 2× cli-opencode zai-coding-plan/glm-5.2 max, 3× cli-codex gpt-5.6-luna max fast, under `--stop-policy=max-iterations` |
| REQ-002 | Converged synthesis with cited findings | `research/research.md` exists, cites its sources (including both pinned links), and covers tool inventory, auth, rate limits, and free-vs-paid gating with per-finding citations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Findings registry verified and traceable | The state packet's findings registry is internally consistent with the synthesis; every load-bearing claim in research.md traces to a registered finding |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` is complete enough that phase 002 can author the full transport packet without new external discovery.
- **SC-002**: Zero files outside `001-research/` are touched during this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Refero remote availability (https://api.refero.design/mcp) | Research iterations cannot probe the live surface if the remote is down | Fall back to the official skill repo and product docs; mark live-surface claims as inferred until probed |
| Risk | Executor lineage dies mid-run (external kill, rate limit) | Medium — incomplete iteration coverage | The deep-research state machine is resumable; monitor lineages and resume rather than restart |
| Risk | Free-tier research account sees a reduced tool surface | Medium — synthesis under-reports paid capabilities | Record tier context per finding; flag paid-only claims explicitly as unverified where not probed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What auth does the Refero MCP expect through `mcp-remote` (anonymous, OAuth, API key), and what rate limits apply?
- Does the free tier expose the same tool surface as paid accounts?
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
