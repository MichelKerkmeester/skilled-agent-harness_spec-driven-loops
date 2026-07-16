---
title: "Feature Specification: Phase 2: skill-authoring"
description: "Author the mcp-refero transport packet under .opencode/skills/mcp-tooling/ per sk-doc create-skill-parent standards, mirroring the mcp-figma transport inventory minus CLI machinery, grounded in the phase 001 research synthesis, and gated by package_skill.py --check."
trigger_phrases:
  - "mcp-refero skill authoring"
  - "refero transport packet"
  - "author mcp-refero"
  - "refero skill md"
  - "phase 002 skill-authoring"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/002-skill-authoring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the planned skill-authoring phase docs"
    next_safe_action: "Begin packet authoring once the phase 001 synthesis is accepted"
    blockers:
      - "Phase 001 research synthesis must converge first"
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/tasks.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-skill-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Exemplar is the mcp-figma transport packet inventory minus CLI machinery; mcp-refero has no CLI-primary lane"
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
| **Handoff Criteria** | `.opencode/skills/mcp-tooling/mcp-refero/` passes `package_skill.py --check` (exit 0) with the full transport inventory present and every capability claim traceable to `../001-research/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the mcp-refero nested mode: Refero design-reference MCP transport for the mcp-tooling hub specification.

**Scope Boundary**: Create `.opencode/skills/mcp-tooling/mcp-refero/**` only. Do not touch the hub's shared files (`SKILL.md`, `mode-registry.json`, `hub-router.json`, hub `description.json`/`graph-metadata.json`, hub changelog) or any sibling mode tree — those are phase 003. Do not modify `.utcp_config.json`.

**Dependencies**:
- Phase 001's converged `research/research.md`: the single grounding source for tool names, parameters, auth notes, and limits documented in the packet.
- Read-only exemplar: the existing `mcp-figma` transport packet under `.opencode/skills/mcp-tooling/mcp-figma/` (structure and tone), minus its CLI machinery — Refero is Code-Mode-only.
- sk-doc create-skill-parent standards for nested packet authoring.

**Deliverables** (the packet inventory):
- `SKILL.md` (transport contract: `mutatesWorkspace:false`, forbids Write/Edit/Task, mandatory cross-hub judgment pairing with `sk-design`, Code Mode dispatch), `README.md`, `INSTALL_GUIDE.md`.
- `assets/` including a ready-to-paste UTCP manual snippet matching the existing `refero` manual shape.
- `changelog/`, `feature_catalog/`, `scripts/`.
- `references/`: `mcp_wiring`, `tool_surface`, `troubleshooting`.
- `manual_testing_playbook/` including `intra-routing-recall/` with at least 2 holdout scenarios plus `negative.md` and `troubleshoot.md`.
- `mcp-servers/refero-mcp/README.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `refero` UTCP manual is reachable through Code Mode but has no skill surface: no SKILL.md contract, no documented tool inventory, no routing recall scenarios, no troubleshooting path. Agents that need real-product design references either do not find Refero at all or improvise raw `call_tool_chain()` calls without transport discipline or the sk-design judgment pairing.

### Purpose
Author a complete, research-grounded `mcp-refero` transport packet under the `mcp-tooling` hub so the read-only Refero design-reference surface becomes a documented, testable, hub-routable mode — structurally ready for phase 003 registration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The full packet inventory listed under Deliverables, authored per sk-doc create-skill-parent standards.
- Transport rules stated in SKILL.md frontmatter and body: `mutatesWorkspace:false`, forbidden Write/Edit/Task, mandatory `sk-design` cross-hub pairing (the transport never decides taste), Code Mode as the only dispatch path.
- Grounding every documented tool, parameter, auth note, and limit in `../001-research/research/research.md`.
- Structural gate: `package_skill.py --check` exit 0 on the new packet.

### Out of Scope
- Hub shared-file edits (mode-registry.json, hub-router.json, parent SKILL.md, hub metadata, hub changelog) — phase 003 owns registration.
- `.utcp_config.json` changes — the `refero` manual already exists; phase 003 verifies it.
- CLI machinery (CLI-primary lanes, CLI fallback scripts) present in mcp-figma but explicitly excluded here — Refero has no local CLI.
- Any Refero write-path documentation — the surface is read-only by contract.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-refero/SKILL.md` | Create | Transport contract, tool-surface summary, Code Mode dispatch, sk-design pairing |
| `.opencode/skills/mcp-tooling/mcp-refero/{README.md,INSTALL_GUIDE.md}` | Create | Overview and install/verify path for the remote MCP |
| `.opencode/skills/mcp-tooling/mcp-refero/assets/**` | Create | Ready-to-paste UTCP manual snippet and supporting assets |
| `.opencode/skills/mcp-tooling/mcp-refero/references/{mcp_wiring,tool_surface,troubleshooting}/**` | Create | Wiring, verified tool inventory, and failure-mode references |
| `.opencode/skills/mcp-tooling/mcp-refero/manual_testing_playbook/**` | Create | Playbook incl. intra-routing-recall with ≥2 holdouts, negative.md, troubleshoot.md |
| `.opencode/skills/mcp-tooling/mcp-refero/{changelog,feature_catalog,scripts}/**` | Create | Changelog seed, feature catalog, and (minimal) scripts area |
| `.opencode/skills/mcp-tooling/mcp-refero/mcp-servers/refero-mcp/README.md` | Create | Server-level notes for the remote refero-mcp endpoint |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete transport packet inventory | Every deliverable path listed in §3 exists with authored (non-placeholder) content; inventory matches the mcp-figma exemplar minus CLI machinery |
| REQ-002 | Transport contract enforced in SKILL.md | SKILL.md declares `mutatesWorkspace:false`, forbids Write/Edit/Task in allowed-tools, mandates the sk-design cross-hub judgment pairing, and routes all calls through Code Mode |
| REQ-003 | Structural gate passes | `package_skill.py --check` exits 0 on `.opencode/skills/mcp-tooling/mcp-refero/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Research-grounded content | Every documented tool name, parameter, auth note, and rate limit traces to a cited finding in `../001-research/research/research.md`; unverified claims are marked as such |
| REQ-005 | Routing-recall playbook depth | `intra-routing-recall/` contains at least 2 holdout scenarios plus `negative.md` and `troubleshoot.md` |
| REQ-006 | Ready-to-paste UTCP snippet accuracy | The assets/ manual snippet byte-matches the shape of the existing `refero` manual in `.utcp_config.json` (name-keyed, `mcp-remote` stdio transport) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check` exit 0 on the new packet, with the full inventory present.
- **SC-002**: A reader can dispatch a Refero design-reference search through Code Mode using only the packet's docs, without consulting external sources.
- **SC-003**: Zero writes outside `.opencode/skills/mcp-tooling/mcp-refero/**` and this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 synthesis quality | Packet content would be guesswork if research is thin | Handoff gate requires converged, cited research.md before authoring starts |
| Risk | Copying mcp-figma structure imports CLI machinery that does not apply | Medium — dead docs and broken references | Explicit minus-CLI inventory in §3; check references resolve during the structural gate |
| Risk | Refero tool surface drifts after research | Medium — docs go stale against the live remote | tool_surface reference records the research date and probe evidence; troubleshooting covers surface-drift symptoms |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `package_skill.py --check` impose naming constraints on `mcp-servers/refero-mcp/` that differ from the mcp-figma exemplar? (resolve at first gate run)
- How much of the free-vs-paid gating from research belongs in SKILL.md versus references/tool_surface? (author's call during the phase, biased toward SKILL.md brevity)
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
