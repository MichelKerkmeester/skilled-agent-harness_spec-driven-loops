---
title: "Feature Specification: Phase 1: research"
description: "Research-gate phase for the mcp-aside-devtools mode: a /deep:research fan-out (10 iterations across three executor lineages) that verifies the Aside browser's real CLI and MCP developer surface before any skill authoring begins. Outputs are workflow-owned and land in this phase's research/ folder."
trigger_phrases:
  - "mcp-aside research"
  - "aside deep research"
  - "aside browser surface"
  - "aside cli verification"
  - "phase 001 research"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/001-research"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase 001 research-gate spec docs"
    next_safe_action: "Init the /deep:research run with the fixed fan-out schedule when approved"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/tasks.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/001-research/context/website-link.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does Aside ship a real standalone CLI, or only the MCP server?"
      - "What is Aside's auth model and is it viable for unattended automation?"
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
| **Handoff Criteria** | `research/research.md` synthesis converged under `--stop-policy=max-iterations`, answering the CLI-vs-MCP question with cited findings; findings registry verified; human review before phase 002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the mcp-aside-devtools nested mode: Aside browser automation bridge for the mcp-tooling hub specification.

**Scope Boundary**: A /deep:research fan-out whose outputs are workflow-owned: the deep-research state packet (state JSONL, deltas, logs, findings registry) and the `research.md` synthesis land in `research/` inside this phase folder. The workflow — not manual writes — owns that packet. No file outside this phase folder is created, edited, or deleted; `.opencode/skills/**` is untouched.

**Dependencies**:
- Source link inventory in `context/website-link.md` (primary source: https://docs.aside.com/help/developers#use-mcp).
- The /deep:research workflow (a system-deep-loop mode packet) with external CLI executors available (cli-codex, cli-opencode).

**Deliverables**:
- `research/research.md` — converged synthesis answering: does Aside ship a real standalone CLI (and its command surface) or only the MCP server; the MCP server's tool list and transport; auth model (login/session/API key) and unattended-automation viability; install/launch mechanics; parity mapping against the `mcp-chrome-devtools` capability set.
- The workflow-owned deep-research state packet in `research/` (state JSONL, deltas, logs, findings registry) as convergence evidence.

**Fan-out executor schedule (fixed)**: 10 iterations, `--stop-policy=max-iterations` — 5× `cli-codex gpt-5.6-sol` xhigh fast, 2× `cli-opencode zai-coding-plan/glm-5.2` max, 3× `cli-codex gpt-5.6-luna` max fast.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Aside browser's developer surface is unverified: the program assumes an Aside CLI (primary) plus an Aside MCP server (fallback through Code Mode), but no one has confirmed the CLI exists as a real standalone binary, what tools the MCP server exposes, or how auth works. Authoring the `mcp-aside-devtools` mode against invented commands or tools would ship a broken bridge.

### Purpose
Produce a converged, citation-backed `research/research.md` synthesis of Aside's real CLI and MCP surface so phase 002 authors the mode from verified facts, not assumptions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Init and run the /deep:research loop with the exact fixed fan-out schedule above, seeded from `context/website-link.md`.
- Monitor the three executor lineages; verify the workflow's state packet lands in `research/`.
- Verify the `research/research.md` synthesis and its findings registry: every load-bearing claim cited to a source.

### Out of Scope
- Any writes to `.opencode/skills/**` — skill authoring is phase 002.
- Hub registration, `.utcp_config.json`, and advisor changes — phase 003.
- Manual `/tmp` state or direct agent dispatch bypassing the /deep:research workflow — the workflow owns its state machine.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/**` | Create | Workflow-owned deep-research state packet plus `research.md` synthesis |
| `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/tasks.md` | Modify | Mark run/monitor/verify/close-out tasks with evidence as the loop executes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the /deep:research loop with the exact 10-iteration executor schedule (5× cli-codex gpt-5.6-sol xhigh fast, 2× cli-opencode zai-coding-plan/glm-5.2 max, 3× cli-codex gpt-5.6-luna max fast) under `--stop-policy=max-iterations` | The workflow-owned state packet exists in `research/` and its iteration log shows all 10 iterations attributed to the scheduled executors |
| REQ-002 | Converged synthesis answering the surface questions | `research/research.md` states, with citations: whether a real standalone Aside CLI exists (and its command surface) or only the MCP server; the MCP tool list and transport; auth model and unattended viability; install/launch mechanics |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Findings registry verified | Every load-bearing claim in the synthesis maps to a registry finding with a source link; contradicted or unverifiable claims are marked as such rather than asserted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` is converged and answers the CLI-vs-MCP question decisively enough for phase 002 to author without inventing commands or tools (or triggers an amendment on `backendKind` if no CLI exists).
- **SC-002**: Zero files outside `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/` are touched during this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | External CLI executors (cli-codex, cli-opencode) available for the fan-out | Loop cannot run the scheduled lineages if an executor is down | Retry the affected iterations on the same executor; the schedule is fixed, so substitution requires operator approval |
| Risk | Aside's public docs are sparse or behind auth, starving the fan-out of sources | High | Widen to secondary sources (release notes, package registries, community docs) and mark low-confidence claims explicitly in the findings registry |
| Risk | No real standalone CLI exists — the `cli-plus-mcp` posture is wrong | High | Record the finding with evidence and stop for an amendment decision on `backendKind` before phase 002 begins |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does Aside ship a real standalone CLI, or only the MCP server? (this phase's central question)
- What is Aside's auth model (login/session/API key) and does it survive headless/unattended automation?
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
