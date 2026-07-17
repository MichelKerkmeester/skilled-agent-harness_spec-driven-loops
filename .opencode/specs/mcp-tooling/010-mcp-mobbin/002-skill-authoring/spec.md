---
title: "Feature Specification: Phase 2: skill-authoring"
description: "Author the mcp-mobbin transport packet under .opencode/skills/mcp-tooling/ per sk-doc create-skill standards, mirroring the mcp-figma exemplar inventory minus its CLI machinery, grounded in the phase 001 research synthesis, and gated by package_skill.py --check."
trigger_phrases:
  - "mcp-mobbin skill authoring"
  - "mobbin transport packet"
  - "mobbin SKILL.md"
  - "mobbin utcp manual snippet"
  - "phase 002 skill-authoring"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/002-skill-authoring"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the planned skill-authoring phase docs"
    next_safe_action: "Begin packet authoring once phase 001 research.md is converged"
    blockers:
      - "Phase 001 synthesis (research/research.md) must converge first"
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/plan.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/tasks.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/checklist.md"
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
| **Handoff Criteria** | `.opencode/skills/mcp-tooling/mcp-mobbin/` passes `package_skill.py --check` (exit 0) with the full exemplar-derived inventory present and every tool-surface claim traceable to phase 001's research.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the mcp-mobbin nested mode: Mobbin design-research MCP transport for the mcp-tooling hub specification.

**Scope Boundary**: This phase creates the new packet tree `.opencode/skills/mcp-tooling/mcp-mobbin/` and nothing else. It must not edit the hub's `mode-registry.json`, `hub-router.json`, parent `SKILL.md`, hub metadata, `.utcp_config.json`, or any sibling mode packet — those are phase 003. The UTCP manual is authored here only as a ready-to-paste snippet inside `assets/`.

**Dependencies**:
- Phase 001's converged `research/research.md` (tool surface, auth model, plan gating, transport eligibility)
- Read-only exemplar: `.opencode/skills/mcp-tooling/mcp-figma/` (transport-packet shape and inventory)
- sk-doc create-skill standards and `package_skill.py --check` as the gate

**Deliverables**:
- Complete `mcp-mobbin` transport packet: SKILL.md, README.md, install-guide.md, assets/ (incl. ready-to-paste UTCP `mobbin` manual snippet), changelog/, feature-catalog/, references/ (mcp_wiring, tool_surface, troubleshooting), scripts/, manual-testing-playbook/ (incl. intra-routing-recall/ with at least 2 holdouts plus negative.md and troubleshoot.md), and mcp-servers/mobbin-mcp/README.md
- Transport rules stated in SKILL.md: `mutatesWorkspace:false`, forbids Write/Edit/Task, mandatory cross-hub judgment pairing with `sk-design`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub has no `mcp-mobbin` packet: there is no SKILL.md contract, no tool-surface reference, no install guide, and no UTCP manual snippet for the Mobbin MCP server. Phase 001 verified the facts; without an authored transport packet those facts are not routable, testable, or installable.

### Purpose
Author a complete, `package_skill.py --check`-clean `mcp-mobbin` transport packet under `.opencode/skills/mcp-tooling/`, mirroring the proven `mcp-figma` transport inventory (minus its CLI machinery) and grounded entirely in phase 001's research synthesis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author every file of the `mcp-mobbin` packet inventory listed under Deliverables, following sk-doc create-skill(-parent) standards
- Ground every tool-surface, auth, and gating claim in `../001-research/research/research.md`
- Ship a ready-to-paste UTCP `mobbin` manual snippet in `assets/` for phase 003 to apply
- Gate the packet with `package_skill.py --check`

### Out of Scope
- Hub wiring (mode-registry.json, hub-router.json, parent SKILL.md, hub metadata/changelog/playbook) - phase 003 owns all hub edits
- Applying the `mobbin` manual to `.utcp_config.json` - phase 003, serial across sibling packets 008→009→010
- CLI machinery from the mcp-figma exemplar (daemon/connect/patch scripts, figma-cli server) - Mobbin is a plain MCP server over Code Mode with no local desktop daemon

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md` | Create | Transport contract: read-only design-research surface, no Write/Edit/Task, sk-design pairing |
| `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` | Create | Packet overview and routing entry points |
| `.opencode/skills/mcp-tooling/mcp-mobbin/install-guide.md` | Create | Server install, credential provisioning, verification steps |
| `.opencode/skills/mcp-tooling/mcp-mobbin/assets/` | Create | Ready-to-paste UTCP `mobbin` manual snippet + env template |
| `.opencode/skills/mcp-tooling/mcp-mobbin/changelog/` | Create | v1.0.0.0 changelog entry |
| `.opencode/skills/mcp-tooling/mcp-mobbin/feature-catalog/` | Create | Catalog of Mobbin research capabilities (apps, screens, flows, patterns) |
| `.opencode/skills/mcp-tooling/mcp-mobbin/references/{mcp-wiring.md,tool-surface.md,troubleshooting.md}` | Create | Wiring, verified tool surface, failure modes |
| `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/` | Create | Minimal helper scripts (doctor/print-snippet class; no daemon machinery) |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/` | Create | Playbook incl. intra-routing-recall/ with 2+ holdouts, negative.md, troubleshoot.md |
| `.opencode/skills/mcp-tooling/mcp-mobbin/mcp-servers/mobbin-mcp/README.md` | Create | Upstream server notes: repo pointer, version, auth requirement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full packet inventory authored | Every file in the Files to Change table exists with real content; no template placeholders remain (grep for bracketed placeholders returns zero) |
| REQ-002 | Transport contract stated and consistent | SKILL.md declares `mutatesWorkspace:false`, forbids Write/Edit/Task, and mandates cross-hub judgment pairing with `sk-design`; no doc in the packet contradicts it |
| REQ-003 | Grounded in research.md | Every tool named in `references/tool-surface.md` and the UTCP snippet traces to a cited finding in `../001-research/research/research.md`; residual unknowns are carried as explicit caveats, not invented |
| REQ-004 | Packaging gate passes | `package_skill.py --check` exits 0 on `.opencode/skills/mcp-tooling/mcp-mobbin/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Routing-recall playbook seeded | `manual-testing-playbook/intra-routing-recall/` contains at least 2 holdout scenarios plus `negative.md` and `troubleshoot.md` |
| REQ-006 | UTCP snippet is paste-ready | The `assets/` manual snippet is valid JSON matching `.utcp_config.json` manual conventions (name-keyed `mobbin`), so phase 003 can apply it without rework |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check` exits 0 on the new packet with the full exemplar-derived inventory present.
- **SC-002**: A reader can install and verify the Mobbin MCP server from install-guide.md alone, including credential provisioning, without consulting sources outside the packet.
- **SC-003**: Zero files outside `.opencode/skills/mcp-tooling/mcp-mobbin/` and this phase folder are modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 synthesis converged | Authoring without it re-introduces the unverified-surface problem | Hard predecessor gate; do not start until research.md is reviewed |
| Risk | Copying mcp-figma structure imports CLI/daemon machinery Mobbin does not have | Medium | Explicit minus-list in scope; exemplar is a shape reference, not a copy source |
| Risk | Auth/gating unknowns from phase 001 leak into the guide as facts | High | Carry UNKNOWNs as explicit install-guide caveats; never present unverified claims as verified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `scripts/` include a connectivity doctor script at authoring time, or defer scripting until the manual is live in phase 003 and testable end-to-end?
- How much of the Mobbin official skills repo (github.com/mobbin/skills) should be mirrored into feature-catalog/ versus linked as upstream reference?
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
