---
title: "Feature Specification: Phase 3: hub-integration"
description: "Register the mcp-aside-devtools mode in the mcp-tooling hub: mode-registry.json entry, hub-router.json signals/vocab/tieBreak, parent SKILL.md, hub description.json and graph-metadata.json, hub changelog and hub_routing scenario, the new aside manual in .utcp_config.json, and advisor skill-graph regeneration. Runs SERIAL across sibling packets 008 → 009 → 010."
trigger_phrases:
  - "mcp-aside hub integration"
  - "aside mode registry entry"
  - "aside utcp manual"
  - "phase 003 hub-integration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/003-hub-integration"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase 003 hub-integration spec docs"
    next_safe_action: "Begin hub registration when the serial window opens"
    blockers:
      - "Phase 002 package_skill.py --check must exit 0 first"
      - "SERIAL constraint: sibling packets 009/010 must not edit hub files concurrently"
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/tasks.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-hub-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Exact serialization mechanics with sibling packets 009/010 (ordering 008→009→010 is fixed; coordination mechanics are operator-owned)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: hub-integration

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
| **Phase** | 3 of 4 |
| **Predecessor** | 002-skill-authoring |
| **Successor** | 004-validation-and-handoff |
| **Handoff Criteria** | Hub valid: mode-registry/hub-router/parent SKILL.md/hub metadata aligned on `mcp-aside-devtools`; `.utcp_config.json` `aside` manual parses; hub changelog and hub_routing scenario landed; advisor skill-graph regenerated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the mcp-aside-devtools nested mode: Aside browser automation bridge for the mcp-tooling hub specification.

**Scope Boundary**: Hub-level registration only. Edits are confined to `.opencode/skills/mcp-tooling/` hub files (mode-registry.json, hub-router.json, SKILL.md, description.json, graph-metadata.json, changelog/, manual_testing_playbook/hub_routing/), `.utcp_config.json`, and advisor skill-graph regeneration outputs. The `mcp-aside-devtools` packet content authored in phase 002 is not re-edited here, nor are the three existing modes.

**SERIAL constraint**: This phase edits shared hub files that sibling packets 009 and 010 also target. Execution order across the siblings is fixed 008 → 009 → 010; this phase must complete (and validate) before 009's hub-integration phase begins, and no concurrent hub edits are permitted during its window.

**Dependencies**:
- Phase 002 delivered a `package_skill.py --check`-clean `mcp-aside-devtools` packet.
- The hub's current registration shape: `mode-registry.json` discriminator (workflowMode/packetKind/backendKind) and `hub-router.json` signals/vocab/tieBreak.
- Advisor skill-graph regeneration tooling.

**Deliverables**:
- `mcp-aside-devtools` registered as the hub's fourth mode (`packetKind: "workflow"`, `backendKind: "cli-plus-mcp"`).
- Router, parent SKILL.md, hub metadata, hub changelog, and hub_routing scenario aligned.
- A new name-keyed `aside` manual in `.utcp_config.json` exposing the Aside MCP server to Code Mode.
- Regenerated advisor skill-graph reflecting the hub's new mode.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 002 the `mcp-aside-devtools` packet exists but is invisible: the hub's mode-registry and router do not know it, the parent SKILL.md does not document it, Code Mode has no `aside` manual to reach the Aside MCP server, and the advisor skill-graph still reflects a three-mode hub. An unregistered mode can never be routed to.

### Purpose
Wire the authored mode into every hub and runtime surface — registry, router, parent doctrine, hub metadata, changelog, hub_routing playbook, `.utcp_config.json`, and the advisor skill-graph — inside the 008-first serial window.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mode-registry.json` entry for `mcp-aside-devtools` (workflow axis, cli-plus-mcp backend) consistent with the registry's discriminator and advisorRouting contract.
- `hub-router.json` signals/vocab/tieBreak updates so Aside-shaped queries resolve to the new mode.
- Parent `SKILL.md` mode documentation, hub `description.json` + `graph-metadata.json` refresh.
- Hub `changelog/` entry and a `manual_testing_playbook/hub_routing/` scenario covering the new mode.
- New name-keyed `aside` manual in `.utcp_config.json`.
- Advisor skill-graph regeneration.

### Out of Scope
- Any edit to the `mcp-aside-devtools` packet content itself — phase 002 owns it; defects found here loop back as phase 002 follow-ups.
- Any edit to `mcp-chrome-devtools`, `mcp-click-up`, or `mcp-figma` content.
- Sibling packets 009/010's hub entries — they run their own hub-integration phases after this one.
- Strict/terminal gates — phase 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | Add the `mcp-aside-devtools` mode entry (packetKind workflow, backendKind cli-plus-mcp) |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | Signals/vocab/tieBreak for Aside routing |
| `.opencode/skills/mcp-tooling/SKILL.md` | Modify | Document the fourth mode in the parent doctrine |
| `.opencode/skills/mcp-tooling/{description.json,graph-metadata.json}` | Modify | Refresh hub identity metadata for the new mode |
| `.opencode/skills/mcp-tooling/changelog/**` | Create/Modify | Hub changelog entry for the mode addition |
| `.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/**` | Create/Modify | hub_routing scenario exercising aside-query resolution |
| `.utcp_config.json` | Modify | New name-keyed `aside` manual for the Aside MCP server via Code Mode |
| Advisor skill-graph artifacts | Regenerate | Reflect the hub's new mode in advisor routing metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Registry entry lands and parses | `mode-registry.json` contains an `mcp-aside-devtools` entry with `packetKind: "workflow"`, `backendKind: "cli-plus-mcp"`, folder == packetSkillName; the file parses as valid JSON |
| REQ-002 | Router resolves the new mode | `hub-router.json` signals/vocab/tieBreak updated; the file parses and an aside-shaped query resolves to `mcp-aside-devtools` per the hub_routing scenario |
| REQ-003 | Parent doctrine and hub metadata aligned | Hub `SKILL.md` documents the fourth mode; `description.json` and `graph-metadata.json` refreshed consistently with the registry |
| REQ-004 | Code Mode reaches Aside | `.utcp_config.json` gains a name-keyed `aside` manual; the file parses as valid JSON and the manual follows the existing manual-naming convention |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Hub changelog + hub_routing scenario | Changelog entry describes the mode addition; a hub_routing scenario exercises aside-query resolution to the new mode |
| REQ-006 | Advisor skill-graph regenerated | Regeneration command run and recorded; advisor metadata reflects the four-mode hub |
| REQ-007 | Serial window honored | Evidence (operator confirmation or coordination record) that 009/010 made no concurrent hub edits during this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All touched JSON files (`mode-registry.json`, `hub-router.json`, hub metadata, `.utcp_config.json`) parse cleanly and are mutually consistent on the new mode.
- **SC-002**: The hub_routing scenario resolves an aside query to `mcp-aside-devtools`; existing scenarios for the three live modes still resolve unchanged.
- **SC-003**: Hub-integration writes stay within the declared file scope; the phase completes inside the 008-first serial window.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 packaging gate green | Registering an invalid packet propagates breakage into the hub | Hard predecessor gate on `package_skill.py --check` exit 0 |
| Risk | Concurrent hub edits from sibling packets 009/010 corrupt shared files | High | Fixed serial order 008→009→010; confirm the window before editing and re-diff hub files before commit |
| Risk | Router vocab changes regress routing for the three existing modes | Medium | Re-run the existing hub_routing scenarios after the change; revert the vocab delta if any live-mode scenario regresses |
| Risk | `.utcp_config.json` edit breaks Code Mode for existing manuals | High | JSON parse + minimal additive diff; existing manuals byte-unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact serialization mechanics for the 008→009→010 hub window (operator-owned coordination; the ordering itself is fixed).
- Whether the aside routing vocab needs a lexical carve-out against `mcp-chrome-devtools` browser terms, or hub tieBreak rules suffice (answered empirically by the hub_routing scenario runs).
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
