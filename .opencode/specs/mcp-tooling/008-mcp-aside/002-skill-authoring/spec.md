---
title: "Feature Specification: Phase 2: skill-authoring"
description: "Author the new nested mode .opencode/skills/mcp-tooling/mcp-aside-devtools/ per sk-doc create-skill-parent standards and the mcp-chrome-devtools exemplar inventory, grounded in the phase 001 research.md synthesis, gated by package_skill.py --check."
trigger_phrases:
  - "mcp-aside skill authoring"
  - "aside devtools mode authoring"
  - "aside skill packet"
  - "phase 002 skill-authoring"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/002-skill-authoring"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase 002 skill-authoring spec docs"
    next_safe_action: "Begin authoring after the phase 001 research gate is reviewed"
    blockers:
      - "Phase 001 research.md synthesis must converge and pass human review first"
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/tasks.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-skill-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: skill-authoring

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-research |
| **Successor** | 003-hub-integration |
| **Handoff Criteria** | The `mcp-aside-devtools` packet passes `package_skill.py --check` (exit 0) with the full exemplar inventory present and every capability claim grounded in `research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the mcp-aside-devtools nested mode: Aside browser automation bridge for the mcp-tooling hub specification.

**Scope Boundary**: Create `.opencode/skills/mcp-tooling/mcp-aside-devtools/**` only. No edits to the hub's own registration files (`mode-registry.json`, `hub-router.json`, parent `SKILL.md`, hub metadata) — those are phase 003. No edits to the three existing modes. `.utcp_config.json` untouched.

**Dependencies**:
- Phase 001's converged `../001-research/research/research.md` synthesis (the grounding source for every command, tool name, and auth claim).
- Read-only exemplar: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/` (structure, tone, dispatch doctrine).
- sk-doc create-skill-parent standards for nested mode packets.

**Deliverables**:
- The complete `mcp-aside-devtools` mode tree: `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, `changelog/`, `examples/`, `references/`, `scripts/`, `manual_testing_playbook/` (including `intra-routing-recall/` with at least 2 holdouts plus `negative.md` and `troubleshoot.md` scenarios), and `mcp-servers/aside-cli/` + `mcp-servers/aside-mcp/` backend documentation.
- A `package_skill.py --check` pass on the new packet.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-tooling hub has no mode packet for the Aside browser: there is no `SKILL.md` doctrine for when to reach for Aside CLI versus the Aside MCP fallback, no install guide, no routing-recall scenarios, and no backend documentation. Phase 001 produced verified surface facts, but they are not yet an authored, packageable skill.

### Purpose
Author the full `mcp-aside-devtools` nested mode packet — the 1:1 structural analog of `mcp-chrome-devtools` — grounded exclusively in the phase 001 `research.md` findings, passing `package_skill.py --check`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author every file in the exemplar inventory under `.opencode/skills/mcp-tooling/mcp-aside-devtools/`.
- CLI-primary / MCP-fallback dispatch doctrine in `SKILL.md`, citing verified Aside commands and MCP tools only.
- `manual_testing_playbook/` with `intra-routing-recall/` (≥2 holdouts, `negative.md`, `troubleshoot.md`) plus scenario docs mirroring the exemplar's playbook shape.
- `mcp-servers/aside-cli/` and `mcp-servers/aside-mcp/` backend docs (install, launch, auth, tool/command surface).

### Out of Scope
- Hub registration (`mode-registry.json`, `hub-router.json`, parent `SKILL.md`, hub `description.json`/`graph-metadata.json`, hub changelog, hub_routing scenario) — phase 003, which is SERIAL across sibling packets.
- `.utcp_config.json` `aside` manual — phase 003.
- Advisor skill-graph regeneration — phase 003.
- Strict-mode packaging and hub-level validation — phase 004 gates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md` | Create | Mode doctrine: CLI-primary, Aside MCP via Code Mode fallback, gating and dispatch rules |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/{README.md,INSTALL_GUIDE.md}` | Create | User-facing overview and verified install/auth/launch guide |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/{changelog/,examples/,references/,scripts/}` | Create | Versioned changelog, worked examples, reference docs, helper scripts |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual_testing_playbook/**` | Create | Playbook incl. `intra-routing-recall/` with ≥2 holdouts, `negative.md`, `troubleshoot.md` |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/mcp-servers/{aside-cli/,aside-mcp/}` | Create | Backend docs for both dispatch paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete exemplar inventory exists under `.opencode/skills/mcp-tooling/mcp-aside-devtools/` | Tree contains `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, `changelog/`, `examples/`, `references/`, `scripts/`, `manual_testing_playbook/`, `mcp-servers/aside-cli/`, `mcp-servers/aside-mcp/` — verified by directory listing against the `mcp-chrome-devtools` exemplar |
| REQ-002 | Every capability claim grounded in research | Each Aside command, MCP tool name, auth step, and install step in the packet traces to a cited finding in `../001-research/research/research.md`; no invented surface |
| REQ-003 | Packaging gate passes | `package_skill.py --check` on the new packet exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Routing-recall scenarios complete | `manual_testing_playbook/intra-routing-recall/` contains at least 2 holdout scenarios plus `negative.md` and `troubleshoot.md` |
| REQ-005 | Backend docs cover both dispatch paths | `mcp-servers/aside-cli/` documents the CLI-primary path and `mcp-servers/aside-mcp/` documents the Code Mode MCP fallback, each with install/launch/auth and failure modes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check` exits 0 on `.opencode/skills/mcp-tooling/mcp-aside-devtools/`.
- **SC-002**: A reviewer can trace every operational claim in the packet to a `research.md` finding; zero uncited command or tool names.
- **SC-003**: No file outside `.opencode/skills/mcp-tooling/mcp-aside-devtools/` and this phase folder is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 synthesis converged and reviewed | Authoring without it re-introduces invented-surface risk | Hard predecessor gate; do not start until the research gate passes review |
| Risk | Research found no standalone CLI, breaking the `cli-plus-mcp` analog | High | Halt and escalate for a `backendKind` amendment before authoring dispatch doctrine |
| Risk | Exemplar drift — `mcp-chrome-devtools` structure changes concurrently | Low | Snapshot the exemplar inventory at phase start; diff before the packaging gate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `scripts/` carry a lifecycle helper analogous to chrome-devtools' CLI lifecycle tooling, or is the Aside CLI self-managing? (answer from `research.md` install/launch findings)
- Version seed for the new packet's changelog: start at `v1.0.0.0` per hub convention unless the operator directs otherwise.
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
