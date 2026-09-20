---
title: "Feature Specification: Phase 3: hub-integration"
description: "Wire the authored mcp-mobbin transport packet into the mcp-tooling hub: mode-registry.json transport-axis entry with sk-design cross-hub pairing, hub-router.json signals and vocabulary, parent SKILL.md, hub metadata and changelog, hub_routing playbook scenario, the mobbin manual in .utcp_config.json, and advisor skill-graph regeneration. SERIAL across sibling packets 008 then 009 then 010."
trigger_phrases:
  - "mcp-mobbin hub integration"
  - "mobbin mode-registry entry"
  - "mobbin utcp manual"
  - "mobbin hub-router signals"
  - "phase 003 hub-integration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/003-hub-integration"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the planned hub-integration phase docs"
    next_safe_action: "Start hub edits after phase 002 gate and siblings 008/009 land"
    blockers:
      - "Phase 002 packet must pass package_skill.py --check first"
      - "Serial ordering: sibling packets 008 and 009 must complete their hub edits before 010 touches shared hub files"
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/plan.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/tasks.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-hub-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
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
| **Handoff Criteria** | Hub valid with registry/router aligned: mode-registry.json, hub-router.json, parent SKILL.md, hub metadata, changelog, hub_routing scenario, and the `.utcp_config.json` `mobbin` manual all reference mcp-mobbin consistently; advisor skill-graph regeneration succeeds |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the mcp-mobbin nested mode: Mobbin design-research MCP transport for the mcp-tooling hub specification.

**Scope Boundary**: This phase edits shared hub surfaces only: `.opencode/skills/mcp-tooling/` hub files (mode-registry.json, hub-router.json, SKILL.md, description.json, graph-metadata.json, changelog/, manual_testing_playbook/) plus `.utcp_config.json` and the advisor skill-graph regeneration. It must not re-edit the mcp-mobbin packet content beyond what registry alignment strictly requires, and must not touch the three existing mode packets.

**Dependencies**:
- Phase 002's `mcp-mobbin` packet passing `package_skill.py --check` (provides the ready-to-paste UTCP snippet in its assets/)
- **SERIAL ordering across sibling packets 008 → 009 → 010**: packets 008 and 009 edit the same shared hub files; 010's hub edits start only after both have landed, to avoid merge collisions on mode-registry.json / hub-router.json / `.utcp_config.json`

**Deliverables**:
- mode-registry.json: `mcp-mobbin` mode entry (packetKind `transport`, routingClass `metadata`), `extensions.transport-axis.transports[]` including mcp-mobbin, and `crossHubPairing: mcp-mobbin → sk-design`
- hub-router.json: mcp-mobbin routerSignals entry, mobbin vocabulary classes, tieBreak order extended
- Parent SKILL.md: mcp-mobbin mode row/section
- Hub description.json + graph-metadata.json: identity refresh including the edge to sk-design
- Hub changelog entry and a hub_routing playbook scenario covering mobbin routing
- `.utcp_config.json`: the `mobbin` manual added from the phase 002 snippet
- Advisor skill-graph regenerated so the new mode is discoverable

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 002 the `mcp-mobbin` packet exists but is invisible: the hub's mode registry, router, parent SKILL.md, and graph metadata do not mention it, the advisor cannot route to it, and Code Mode has no `mobbin` manual to call. An authored-but-unwired transport packet delivers no capability.

### Purpose
Make `mcp-mobbin` a live, routable fourth mode of the `mcp-tooling` hub — registered on the transport axis with its sk-design pairing, routable through hub signals, callable through the `.utcp_config.json` `mobbin` manual, and discoverable through a regenerated advisor skill graph.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All hub-surface edits listed under Deliverables, applied in the serial window after sibling packets 008 and 009
- Adding the `mobbin` manual to `.utcp_config.json` from the phase 002 assets/ snippet
- Advisor skill-graph regeneration and a consistency sweep across every edited surface

### Out of Scope
- Authoring or reworking mcp-mobbin packet content - phase 002 owns the packet; only registry-alignment fixes flow back
- Any change to mcp-chrome-devtools, mcp-click-up, or mcp-figma mode packets - the integration is additive
- Terminal strict gates and packet close-out - phase 004 owns final validation and handoff

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | Add mcp-mobbin mode (packetKind `transport`), extend `extensions.transport-axis.transports[]`, add `crossHubPairing: mcp-mobbin → sk-design` |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | Add mcp-mobbin routerSignals, mobbin vocabulary classes, extend tieBreak order |
| `.opencode/skills/mcp-tooling/SKILL.md` | Modify | Add the mcp-mobbin mode row/section to the hub contract |
| `.opencode/skills/mcp-tooling/description.json` | Modify | Refresh hub identity to include the fourth mode |
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Modify | Refresh hub graph identity including the edge to sk-design |
| `.opencode/skills/mcp-tooling/changelog/` | Modify | Hub changelog entry for the mobbin mode addition |
| `.opencode/skills/mcp-tooling/manual_testing_playbook/` | Modify | Add a hub_routing scenario exercising mobbin routing |
| `.utcp_config.json` | Modify | Add the `mobbin` manual (name-keyed) from the phase 002 snippet |
| Advisor skill graph (regenerated artifact) | Modify | Regenerate so the advisor discovers the updated hub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Serial-ordering gate honored | Hub edits begin only after sibling packets 008 and 009 have landed their hub edits; confirmed against their packet status before the first shared-file write |
| REQ-002 | mode-registry.json registers mcp-mobbin on the transport axis | Entry present with packetKind `transport`, `extensions.transport-axis.transports[]` includes mcp-mobbin, and `crossHubPairing` maps mcp-mobbin → sk-design; file parses as JSON |
| REQ-003 | `.utcp_config.json` carries the `mobbin` manual | Manual added name-keyed as `mobbin` from the phase 002 snippet; file parses as JSON and existing manuals are byte-unchanged |
| REQ-004 | hub-router.json routes mobbin queries | routerSignals entry, mobbin vocabulary classes, and tieBreak order updated consistently with the registry |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Hub docs and metadata aligned | Parent SKILL.md mode row, description.json, graph-metadata.json (edge to sk-design), hub changelog entry, and hub_routing scenario all reference mcp-mobbin consistently — zero dangling or contradictory references in a cross-file sweep |
| REQ-006 | Advisor skill graph regenerated | Regeneration command succeeds and the updated mcp-tooling hub identity is present in the regenerated graph |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A mobbin design-research query routes to the mcp-tooling hub and resolves to the mcp-mobbin mode via hub membership, matching the mcp-figma precedent.
- **SC-002**: Code Mode can address the `mobbin` manual by name from `.utcp_config.json`; all pre-existing manuals unchanged.
- **SC-003**: Every edited hub surface agrees on the mode name, packetKind, and pairing; JSON files parse; no edits landed outside the scoped hub files + `.utcp_config.json` + this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Sibling packets 008 and 009 (serial hub-edit window) | Concurrent edits to mode-registry.json / hub-router.json / .utcp_config.json collide | Hard serial gate (REQ-001); verify both siblings landed before first write |
| Dependency | Phase 002 gate passed | Wiring an unvalidated packet propagates defects into live routing | Do not start until `package_skill.py --check` exit 0 is recorded |
| Risk | Malformed JSON edit breaks live hub routing or Code Mode config | High | Parse-check every JSON file after each edit; keep edits additive; rollback via git per file |
| Risk | Registry/router/SKILL.md drift (mode named differently across surfaces) | Medium | Terminal cross-file consistency sweep is a named requirement (REQ-005) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the mobbin transport need any lexical routing carve-out in hub-router.json, or does hub-membership metadata routing suffice (mcp-figma precedent says membership suffices)?
- Which advisor skill-graph regeneration entry point is current at execution time — confirm against system-skill-advisor docs before running.
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
