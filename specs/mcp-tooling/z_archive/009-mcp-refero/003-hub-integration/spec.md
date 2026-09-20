---
title: "Feature Specification: Phase 3: hub-integration"
description: "Register mcp-refero as the fourth mcp-tooling mode: mode-registry.json transport-axis entry with sk-design crossHubPairing, hub-router.json signals/vocabulary/tie-break, parent SKILL.md, hub description and graph metadata, changelog, hub_routing scenario, verification of the existing refero UTCP manual, and advisor skill-graph regeneration. Runs SERIAL across sibling packets 008, 009, 010."
trigger_phrases:
  - "mcp-refero hub integration"
  - "refero mode registry"
  - "refero hub router"
  - "mcp-tooling fourth mode"
  - "phase 003 hub-integration"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/003-hub-integration"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the planned hub-integration phase docs"
    next_safe_action: "Start hub integration once phase 002 passes its structural gate and the 008 sibling slot is done"
    blockers:
      - "Phase 002 packet must pass package_skill.py --check first"
      - "SERIAL ordering across sibling packets: 008 must finish its hub-file slot before 009 starts"
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/tasks.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-hub-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the fourth mode need a refero-specific vocabulary class, or does hub-membership metadata routing suffice?"
    answered_questions:
      - "The refero UTCP manual already exists in .utcp_config.json (npx -y mcp-remote https://api.refero.design/mcp); this phase verifies it rather than adding it"
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
| **Handoff Criteria** | Hub valid on four modes: mode-registry.json and hub-router.json parse clean and cross-agree, parent SKILL.md and hub metadata list mcp-refero, the existing refero UTCP manual verified, and the advisor skill graph regenerated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the mcp-refero nested mode: Refero design-reference MCP transport for the mcp-tooling hub specification.

**Scope Boundary**: Modify only the mcp-tooling hub's shared files (`SKILL.md`, `mode-registry.json`, `hub-router.json`, hub `description.json`, hub `graph-metadata.json`, hub `changelog/`, hub_routing playbook scenario) plus advisor skill-graph regeneration outputs. Do not edit the mcp-refero packet content (phase 002's deliverable) beyond what registration requires, do not edit sibling mode trees, and do not modify `.utcp_config.json` — its `refero` manual is verified, not changed.

**SERIAL ordering constraint**: Sibling packets 008, 009 (this one), and 010 all touch the same hub shared files. Hub integration executes strictly in packet order 008 → 009 → 010; this phase must not start until 008's hub-file changes have landed, and 010 waits for this phase.

**Dependencies**:
- Phase 002's `mcp-refero` packet passing `package_skill.py --check` (the mode being registered must exist and be structurally valid).
- The 008 sibling packet's hub-integration slot completed (serial ordering above).

**Deliverables**:
- mode-registry.json: fourth mode entry (`workflowMode: mcp-refero`, `packetKind: transport`, metadata routingClass) plus `extensions.transport-axis.transports[]` extended with `mcp-refero` and a `crossHubPairing` mapping mcp-refero → sk-design.
- hub-router.json: mcp-refero routerSignals entry, refero vocabulary, and tieBreak extended for the fourth mode.
- Parent SKILL.md: mcp-refero listed as a routed mode with its transport summary.
- Hub description.json and graph-metadata.json refreshed (graph edge to sk-design for the new pairing).
- Hub changelog entry and a hub_routing playbook scenario covering refero routing.
- Verification record for the existing `refero` UTCP manual; advisor skill-graph regeneration run.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 002 the `mcp-refero` packet exists but is invisible: the hub's mode registry, router signals, parent SKILL.md, and graph identity all describe a three-mode hub, so no route can reach the new transport and the advisor's skill graph carries no refero awareness. Concurrent sibling packets (008, 010) touch the same hub files, so unserialized edits would conflict.

### Purpose
Make mcp-refero a first-class fourth mode of the mcp-tooling hub — registered on the transport axis with its sk-design pairing, routable through hub-router signals, and visible to the advisor — without breaking the three existing modes and while honoring the 008 → 009 → 010 serial ordering.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fourth mode entry in `mode-registry.json` incl. `extensions.transport-axis.transports[]` and `crossHubPairing: mcp-refero → sk-design`.
- `hub-router.json`: refero routerSignals, vocabulary classes, and tieBreak ordering for four modes.
- Parent `SKILL.md`, hub `description.json`, hub `graph-metadata.json` (edge to sk-design), hub changelog, and a hub_routing playbook scenario.
- Verify (read-only) the existing `refero` manual in `.utcp_config.json`: name key, `mcp-remote` args, endpoint URL.
- Advisor skill-graph regeneration so routing metadata reflects the four-mode hub.

### Out of Scope
- Creating or editing the mcp-refero packet content — phase 002 owns it.
- Adding or modifying the UTCP manual — it already exists; a defect found during verification escalates rather than being silently patched here.
- Sibling mode trees (mcp-chrome-devtools, mcp-click-up, mcp-figma) and sibling packets 008/010's hub changes.
- Lane-C routing benchmarks — out of this packet entirely (candidate follow-up).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | Fourth mode entry; transport-axis transports[] + crossHubPairing mcp-refero → sk-design |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | routerSignals entry, refero vocabulary classes, tieBreak with four modes |
| `.opencode/skills/mcp-tooling/SKILL.md` | Modify | List mcp-refero as a routed transport mode |
| `.opencode/skills/mcp-tooling/{description.json,graph-metadata.json}` | Modify | Hub identity refresh; graph edge to sk-design for the refero pairing |
| `.opencode/skills/mcp-tooling/changelog/**` | Modify | Hub changelog entry for the fourth mode |
| mcp-tooling hub_routing playbook scenario | Modify | Routing-recall scenario covering refero prompts |
| `.utcp_config.json` (`refero` manual) | Verify | Read-only verification of the existing manual; no edit expected |
| Advisor skill-graph artifacts | Regenerate | Regeneration run so the advisor sees four hub modes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Registry entry on the transport axis | mode-registry.json parses; mcp-refero appears as a mode with transport packetKind, in `extensions.transport-axis.transports[]`, and with a crossHubPairing to sk-design |
| REQ-002 | Router alignment for four modes | hub-router.json parses; mcp-refero has routerSignals with vocabulary classes and appears in tieBreak; existing three modes' entries unchanged in meaning |
| REQ-003 | Serial ordering honored | This phase's hub-file edits start only after sibling packet 008's hub slot is complete, evidenced in the execution record; 010 is notified on completion |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Hub surface consistency | Parent SKILL.md, hub description.json, and hub graph-metadata.json (incl. the sk-design edge) all list/reflect mcp-refero; grep for `mcp-refero` hits every hub routing surface |
| REQ-005 | UTCP manual verified | The existing `refero` manual's name key, transport, command (`npx -y mcp-remote https://api.refero.design/mcp`) recorded as verified; any mismatch escalated, not patched |
| REQ-006 | Advisor graph regenerated + changelog/scenario | Skill-graph regeneration run recorded; hub changelog entry and hub_routing refero scenario authored |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A refero-shaped prompt resolves through the hub to mcp-refero under the documented router policy, and non-refero prompts still resolve to their existing modes (dry-read against hub-router.json signals).
- **SC-002**: Registry and router cross-agree on exactly four workflowMode keys; JSON parse clean.
- **SC-003**: No functional change to the three existing modes' routing behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Sibling packet 008's hub slot | Hub-file merge conflicts if edited concurrently | SERIAL 008 → 009 → 010 ordering enforced before any hub write |
| Risk | tieBreak/vocabulary changes shift existing routing | High — regressions in the three live modes | Additive-only edits; dry-read existing scenarios; hub_routing playbook re-checked in phase 004 |
| Risk | Advisor skill-graph regeneration picks up unrelated concurrent edits | Medium | Run regeneration scoped/timed after hub files settle; record the regeneration output |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the fourth mode need a refero-specific vocabulary class beyond hub-identity membership, or is metadata routing sufficient? (decide from phase 001 findings during implementation)
- Should defaultMode/ambiguityDelta change with a fourth mode, or stay as-is? (bias: unchanged — additive integration only)
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
