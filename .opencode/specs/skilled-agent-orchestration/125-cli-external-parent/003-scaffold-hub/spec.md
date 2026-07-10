---
title: "Feature Specification: Phase 3: scaffold-hub"
description: "Create the additive cli-external parent-hub skeleton so later phases can relocate the two dispatch skills into stable packet directories and rewire the scorer without changing behavior in this phase."
trigger_phrases:
  - "cli-external scaffold hub"
  - "cli parent hub scaffold"
  - "cli-opencode cli-claude-code scaffold"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/003-scaffold-hub"
    last_updated_at: "2026-07-10T05:03:42Z"
    last_updated_by: "claude"
    recent_action: "Stated no-advisor-rebuild-before-006 invariant explicitly (WS-B R4)"
    next_safe_action: "Execute the additive scaffold after the decision gate is approved"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/mode-registry.json"
      - ".opencode/skills/cli-external/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-hub"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scaffold is additive-only: five hub-root files plus two empty packet dirs; zero content relocated and no scorer edits in this phase"
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
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 8 |
| **Predecessor** | 002-architecture-decision |
| **Successor** | 004-onboard-cli-opencode |
| **Handoff Criteria** | The cli-external hub skeleton exists with registry, router, advisor descriptor, single graph identity, thin routing-only SKILL.md, and two empty packet directories; no content relocation, scorer edit, or hook repoint has occurred |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code specification.

**Scope Boundary**: additive scaffold only. Create the five hub-root files and two empty packet directories; do not move content, repoint the PreToolUse hook, edit the scorer, alter CI, or edit prose referrers in this phase.

**Dependencies**:
- Phase 002 locked the target shape: one `.opencode/skills/cli-external/` hub with workflow modes `cli-opencode` and `cli-claude-code`, no surface axis, no transport axis, `family: cli`, and `routerPolicy.defaultMode: "cli-opencode"`.
- Parent-hub templates provide the hub `SKILL.md`, registry, router, description, and graph-metadata source shapes.
- The enforcement target is `parent-skill-check.cjs` in non-strict parent-hub mode for an empty-packet scaffold.

**Deliverables**:
- Five hub-root files under `.opencode/skills/cli-external/`: `mode-registry.json`, `hub-router.json`, `description.json`, `SKILL.md` (starting at version 1.0.0.0), and `graph-metadata.json`.
- Empty `.opencode/skills/cli-external/cli-opencode/` and `.opencode/skills/cli-external/cli-claude-code/` packet directories for phases 004 and 005.
- Verification evidence that the parent-hub structural checks pass with empty-packet warnings accepted for this scaffold-only phase.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No parent-hub skeleton exists yet for the approved `cli-external` merge. Phases 004 and 005 need stable packet directories and hub-root metadata before they can relocate the existing `cli-opencode` and `cli-claude-code` content with a clean diff boundary, and phase 005's scorer rewrite needs the hub `mode-registry.json` to already exist as its future source of truth.

### Purpose
Create the additive hub skeleton with zero risk to current skill behavior because no content moves, no hook repoints, and no scorer edit occurs in this phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skills/cli-external/mode-registry.json` from the parent-skill registry template with exactly two `packetKind: "workflow"` modes: `cli-opencode` and `cli-claude-code`.
- Create `.opencode/skills/cli-external/hub-router.json` from the parent-skill hub-router template with the base three router outcomes only: `single`, `orderedBundle`, and `defer`, and `defaultMode: "cli-opencode"`.
- Create `.opencode/skills/cli-external/description.json`, `.opencode/skills/cli-external/SKILL.md`, and `.opencode/skills/cli-external/graph-metadata.json` as hub-root skeleton files carrying the single `cli-external` identity with `family: cli`. **Invariant**: no advisor graph rebuild happens before phase 006, so this scaffold `graph-metadata.json` is inert for live routing until phase 006 regenerates `skill-graph.json` from it — safe to author here, before phase 005's scorer rewrite, because nothing consumes it yet.
- Create empty `.opencode/skills/cli-external/cli-opencode/` and `.opencode/skills/cli-external/cli-claude-code/` directories as relocation targets for later phases.

### Out of Scope
- Relocating any existing `cli-opencode/` content into `cli-opencode/` - phase 004 owns that move.
- Relocating any existing `cli-claude-code/` content into `cli-claude-code/` - phase 005 owns that move.
- Editing the executor-delegation scorer, its dist, or the parity fixtures - phase 005 owns the atomic scorer rewrite.
- Repointing the PreToolUse hook, the Python alias maps, CI, install guides, or prose referrers - later phases own those changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external/mode-registry.json` | Create | Declarative two-mode workflow registry for `cli-opencode` and `cli-claude-code`; also the future source of truth for the rewritten scorer |
| `.opencode/skills/cli-external/hub-router.json` | Create | Workflow-only router policy with base-three outcomes, bidirectional mode signals, `defaultMode: "cli-opencode"` |
| `.opencode/skills/cli-external/description.json` | Create | Advisor-facing hub descriptor for the single `cli-external` identity |
| `.opencode/skills/cli-external/SKILL.md` | Create | Thin routing-only parent hub SKILL.md starting at version 1.0.0.0; packet contracts remain in nested modes after later phases |
| `.opencode/skills/cli-external/graph-metadata.json` | Create | Single hub graph identity (`skill_id: cli-external`, `family: cli`); folded edge/domain/intent content lands here as phases 004/005 dissolve the children; inert for advisor routing until phase 006's rebuild (no advisor graph rebuild happens before phase 006) |
| `.opencode/skills/cli-external/cli-opencode/` | Create | Empty packet directory reserved for phase 004 relocation |
| `.opencode/skills/cli-external/cli-claude-code/` | Create | Empty packet directory reserved for phase 005 relocation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create a workflow-only `mode-registry.json` | Registry contains exactly two modes, `cli-opencode` and `cli-claude-code`, both `packetKind: "workflow"`, folder-equals-`packetSkillName`, `grandfatheredFolderMismatch: false`, and the enforced per-mode fields: `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, `packet`, `packetSkillName`, and `advisorRouting` |
| REQ-002 | Create a workflow-only `hub-router.json` | Router contains only `single`, `orderedBundle`, and `defer` outcomes; omits `surfaceBundle`; sets `defaultMode` to `cli-opencode`; and keeps `routerSignals` keys bidirectionally equal to registry `workflowMode` values |
| REQ-003 | Create exactly one graph identity | `.opencode/skills/cli-external/graph-metadata.json` is the only graph metadata under the hub tree, carries `skill_id: cli-external` and `family: cli`, and is shaped to absorb the folded children's edges and intent signals in phases 004/005 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Keep the hub `SKILL.md` thin | `SKILL.md` describes when to route to `cli-opencode` or `cli-claude-code`, points to `mode-registry.json` and `hub-router.json`, does not embed packet-local dispatch procedure bodies, and needs no self-invocation guard because it does no dispatch |
| REQ-005 | Create only empty packet directories | `cli-opencode/` and `cli-claude-code/` exist as empty relocation targets; no existing skill content, scripts, references, assets, or changelogs are moved in this phase |
| REQ-006 | Keep dispatch behavior unchanged | The two flat skills remain the live dispatch skills until phases 004/005; no hook, scorer, or referrer is touched during this scaffold phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `PARENT_HUB_CHECK_STRICT=0 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external` reports the parent-hub structural checks passing; empty-packet warnings are acceptable at this stage.
- **SC-002**: The future execution diff is additive with respect to content: it creates hub metadata and empty packet directories but performs zero content relocation and zero scorer edits.
- **SC-003**: The scaffold preserves the locked workflow-only target: two workflow modes, `family: cli`, no surface axis, no transport axis, base-three router outcomes, and `routerPolicy.defaultMode: "cli-opencode"`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 architecture decision | Scaffold shape would be unbound | Use the locked two-workflow-mode target and preserve workflow-only routing |
| Dependency | Parent-skill templates | Hub files could drift from validator expectations | Start from the parent-skill template files and keep required fields aligned with `parent-skill-check.cjs` |
| Risk | Content relocation or a scorer edit sneaks into scaffold phase | Later phases lose atomic rename and scorer boundaries | Restrict this phase to the five hub-root files and two empty directories listed above |
| Risk | A mode is accidentally modeled as a surface or transport | Router contract would contradict the approved workflow-only decision | Declare both modes as `packetKind: "workflow"`; add no surface or transport axis |
| Risk | Graph identity split remains | Advisor could see stale or duplicated skill identities after fold-in | Author only the surviving `cli-external/graph-metadata.json`; keep packet directories graph-metadata-free until the children dissolve |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for phase drafting. The operator already locked the workflow-only target shape, full `git mv` relocation strategy for later phases, no-command decision, family choice, and the scorer-rewrite contract. The shared-hook-lift sub-decision is resolved at execution time when phase 004 moves the hook.
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
