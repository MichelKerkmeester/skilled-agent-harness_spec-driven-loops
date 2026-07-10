---
title: "Feature Specification: Phase 3: scaffold-hub"
description: "Additive-only scaffold of the mcp-tooling hub skeleton: mode-registry.json, hub-router.json, description.json, a thin routing SKILL.md at version 1.0.0.0, and empty packet directories. Zero content is moved in this phase."
trigger_phrases:
  - "mcp-tooling hub scaffold"
  - "mode-registry hub-router scaffold"
  - "thin routing skill.md"
  - "additive hub skeleton"
  - "phase 003 scaffold-hub"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled scaffold-hub docs to reflect executed hub skeleton"
    next_safe_action: "No further action required"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-hub"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Hub SKILL.md starts at 1.0.0.0; packets are scaffolded as empty directories with no content moved"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: scaffold-hub

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
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 8 |
| **Predecessor** | 002-architecture-decision |
| **Successor** | 004-onboard-chrome-devtools |
| **Handoff Criteria** | Hub skeleton exists (`mode-registry.json`, `hub-router.json`, `description.json`, thin `SKILL.md`, empty packet dirs); zero content relocated; `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=0` shows structural checks passing with empty-packet warnings acceptable |
| **Execution Note** | Hub root also carries `changelog/`, `manual_testing_playbook/` (4 scenarios), and `benchmark/` — canon-required support scaffolding verified by `parent-skill-check.cjs` STRICT checks 7a/9a/9b |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Merge mcp-chrome-devtools mcp-click-up and mcp-figma into one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure specification.

**Scope Boundary**: Additive-only scaffold of `.opencode/skills/mcp-tooling/` root files and empty packet directories. This phase creates NEW files only; it does not move, edit, or delete any existing `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`, or `mcp-code-mode` file.

**Dependencies**:
- Phase 002's accepted decision record and its frozen `mode-registry.json`/`hub-router.json` target shape.

**Deliverables**:
- Hub root `SKILL.md` (thin, routing-only, `version: 1.0.0.0`, `family: mcp`).
- `mode-registry.json` with three modes (two workflow, one transport) and the `transport-axis` extension listing `mcp-figma`.
- `hub-router.json` with base three outcomes and `defaultMode: "mcp-chrome-devtools"`.
- `description.json` for the hub.
- Empty packet directories `mcp-chrome-devtools/`, `mcp-click-up/`, `mcp-figma/` under the hub, ready to receive content in phases 004-005.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 004-005 need a hub skeleton to move content INTO, but that skeleton does not exist yet. Creating the routing metadata and thin hub `SKILL.md` first — before any content moves — keeps each later move a pure relocation against a stable target and lets the parent-hub structural checks run early against an empty-but-valid hub.

### Purpose
Stand up a valid, additive-only `mcp-tooling` hub skeleton that phases 004-005 can relocate content into without re-deriving any structural decision.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the hub root `SKILL.md` (thin routing-only, `version: 1.0.0.0`) that dispatches by `workflowMode` through `mode-registry.json`.
- Create `mode-registry.json` and `hub-router.json` copied from phase 002's frozen target, including the `transport-axis` extension and the cross-hub pairing note.
- Create the hub `description.json` and empty packet directories for the three modes.

### Out of Scope
- Moving any content from the three bridge trees - that starts in phase 004.
- Deleting the three child `graph-metadata.json` files - that happens in phase 006 after content moves.
- Any change to `mcp-code-mode` or the `code_mode` registration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/SKILL.md` | Create | Thin routing-only hub SKILL.md at version 1.0.0.0 |
| `.opencode/skills/mcp-tooling/mode-registry.json` | Create | Three modes plus transport-axis extension |
| `.opencode/skills/mcp-tooling/hub-router.json` | Create | Base three outcomes, default mcp-chrome-devtools |
| `.opencode/skills/mcp-tooling/description.json` | Create | Hub description metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hub routing metadata matches the phase 002 frozen target | `mode-registry.json` has three modes with correct `packetKind` and the `transport-axis` extension; `hub-router.json` has base three outcomes and `defaultMode: "mcp-chrome-devtools"` |
| REQ-002 | Zero content relocated in this phase | The three source bridge trees are byte-unchanged; only new `mcp-tooling/` files and empty packet dirs are created |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Structural checks pass against the empty hub | `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=0` shows structural checks passing; empty-packet warnings are acceptable at this stage |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The hub skeleton exists and its routing metadata matches the phase 002 frozen target exactly.
- **SC-002**: No file outside `.opencode/skills/mcp-tooling/` is created, moved, or edited in this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 accepted decision record | High | Do not scaffold until the frozen target is approved |
| Risk | Registry drifts from the frozen target during hand-copy | Medium | Copy the phase 002 target JSON verbatim, then adjust only syntax |
| Risk | An accidental content move breaks the additive-only guarantee | High | Restrict this phase to `Write` of new `mcp-tooling/` files only; no `git mv` in this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved by phase 002: the registry uses `routingClass: "metadata"` for all three modes; the figma transport routing carve-out is owned by phase 007.
- None open for the scaffold itself; the skeleton is a direct copy of the phase 002 frozen target.
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
