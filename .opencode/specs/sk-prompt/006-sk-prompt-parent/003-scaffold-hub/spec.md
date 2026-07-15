---
title: "Feature Specification: Phase 3: scaffold-hub"
description: "Create the additive sk-prompt parent-hub skeleton so later phases can relocate prompt-improvement and model-profile content into stable packet directories without changing behavior in this phase."
trigger_phrases:
  - "sk-prompt scaffold hub"
  - "prompt parent hub scaffold"
  - "prompt-improve prompt-models scaffold"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-parent/003-scaffold-hub"
    last_updated_at: "2026-07-09T15:40:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the hub skeleton; parent-skill-check structural checks pass"
    next_safe_action: "Proceed to phase 004 onboard-prompt-improve"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/mode-registry.json"
      - ".opencode/skills/sk-prompt/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-scaffold-hub"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "parent-skill-check.cjs WIP-mode result: 2 expected FAILs (empty packet dirs), 2 expected WARNs (router resource paths, missing benchmark) — all structural checks pass"
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
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `scaffold/003-scaffold-hub` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 8 |
| **Predecessor** | 002-architecture-decision |
| **Successor** | 004-onboard-prompt-improve |
| **Handoff Criteria** | The sk-prompt hub skeleton exists with registry, router, advisor descriptor, single graph identity, thin routing-only SKILL.md, and two empty packet directories; no content relocation or command rebinding has occurred |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models specification.

**Scope Boundary**: additive scaffold only. Create or rewrite the five hub-root files and create two empty packet directories; do not move content, rebind commands, repoint benchmark paths, update runtime path joins, alter CI, or edit prose referrers in this phase.

**Dependencies**:
- Phase 002 locked the target shape: one `.opencode/skills/sk-prompt/` hub with workflow modes `prompt-improve` and `prompt-models`, no surface axis, no transport axis, and `routerPolicy.defaultMode: "prompt-improve"`.
- Parent-hub templates under `.opencode/skills/sk-doc/create-skill/assets/parent_skill/` provide the hub `SKILL.md`, registry, router, description, and graph metadata source shapes.
- The enforcement target is `.opencode/commands/doctor/scripts/parent-skill-check.cjs` in non-strict parent-hub mode for an empty-packet scaffold.

**Deliverables**:
- Five hub-root files under `.opencode/skills/sk-prompt/`: `mode-registry.json`, `hub-router.json`, `description.json`, `SKILL.md`, and `graph-metadata.json`.
- Empty `.opencode/skills/sk-prompt/prompt-improve/` and `.opencode/skills/sk-prompt/prompt-models/` packet directories for phases 004 and 005.
- Verification evidence that the parent-hub structural checks pass with empty-packet warnings accepted for this scaffold-only phase.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No parent-hub skeleton exists yet for the approved `sk-prompt` merge. Phases 004 and 005 need stable packet directories and hub-root metadata before they can relocate existing `sk-prompt` and `sk-prompt-models` content with a clean diff boundary.

### Purpose
Create the additive hub skeleton with zero risk to current skill behavior because no content moves, no command binding changes, and no benchmark write path changes occur in this phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.opencode/skills/sk-prompt/mode-registry.json` from the parent-skill registry template with exactly two `packetKind: "workflow"` modes: `prompt-improve` and `prompt-models`.
- Create `.opencode/skills/sk-prompt/hub-router.json` from the parent-skill hub-router template with the base three router outcomes only: `single`, `orderedBundle`, and `defer`.
- Modify `.opencode/skills/sk-prompt/description.json`, `.opencode/skills/sk-prompt/SKILL.md`, and `.opencode/skills/sk-prompt/graph-metadata.json` into hub-root skeleton files while preserving the single surviving `sk-prompt` identity.
- Create empty `.opencode/skills/sk-prompt/prompt-improve/` and `.opencode/skills/sk-prompt/prompt-models/` directories as relocation targets for later phases.

### Out of Scope
- Relocating any existing `sk-prompt/` content into `prompt-improve/` - phase 004 owns that move.
- Relocating any existing `sk-prompt-models/` content into `prompt-models/` - phase 005 owns that move.
- Rebinding `/prompt` to `/prompt-improve` or changing any command path - phase 004 owns command rebinding.
- Updating `/deep:model-benchmark`, advisor runtime path joins, CI prompt-card sync, install guides, or prose referrers - later integration phases own those changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/mode-registry.json` | Create | Declarative two-mode workflow registry for `prompt-improve` and `prompt-models` |
| `.opencode/skills/sk-prompt/hub-router.json` | Create | Workflow-only router policy with base-three outcomes, bidirectional mode signals, and workflow-first tie-break |
| `.opencode/skills/sk-prompt/description.json` | Modify | Advisor-facing hub descriptor for the single `sk-prompt` identity |
| `.opencode/skills/sk-prompt/SKILL.md` | Modify | Rewrite to thin routing-only parent hub; packet contracts remain in nested modes after later phases |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Modify | Rewrite the existing identity as the single hub graph metadata, preserving folded edge/domain/intent content |
| `.opencode/skills/sk-prompt/prompt-improve/` | Create | Empty packet directory reserved for phase 004 relocation |
| `.opencode/skills/sk-prompt/prompt-models/` | Create | Empty packet directory reserved for phase 005 relocation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create a workflow-only `mode-registry.json` | Registry contains exactly two modes, `prompt-improve` and `prompt-models`, both with `packetKind: "workflow"`, folder-equals-`packetSkillName`, and the enforced per-mode fields: `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, `packet`, `packetSkillName`, `grandfatheredFolderMismatch`, and `advisorRouting`; include unique `aliases` as needed to satisfy the parent-hub contract |
| REQ-002 | Create a workflow-only `hub-router.json` | Router contains only `single`, `orderedBundle`, and `defer` outcomes; omits `surfaceBundle`; sets `defaultMode` to `prompt-improve`; lists `prompt-improve` before `prompt-models` in `tieBreak`; and keeps `routerSignals` keys bidirectionally equal to registry `workflowMode` values |
| REQ-003 | Preserve exactly one graph identity | `.opencode/skills/sk-prompt/graph-metadata.json` is the only graph metadata under the hub tree, and the folded `enhances -> cli-opencode` relationship plus domain and intent-signal content from the dissolved `sk-prompt-models` identity are represented in the surviving hub metadata |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Keep the hub `SKILL.md` thin | `SKILL.md` describes when to route to `prompt-improve` or `prompt-models`, points to `mode-registry.json` and `hub-router.json`, and does not embed packet-local prompt-improvement or model-profile procedure bodies |
| REQ-005 | Create only empty packet directories | `prompt-improve/` and `prompt-models/` exist as empty relocation targets; no existing skill content, benchmark files, references, assets, scripts, or changelogs are moved in this phase |
| REQ-006 | Keep command behavior unchanged | `/prompt` is not renamed or rebound during this scaffold phase; `/prompt-improve` command work remains assigned to phase 004 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `PARENT_HUB_CHECK_STRICT=0 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` reports the parent-hub structural checks passing; empty-packet warnings are acceptable at this stage.
- **SC-002**: The future execution diff is additive with respect to content: it creates hub metadata and empty packet directories but performs zero content relocation from existing `sk-prompt/` or `sk-prompt-models/` material.
- **SC-003**: The scaffold preserves the locked workflow-only target: two workflow modes, no surface axis, no transport axis, base-three router outcomes, and `routerPolicy.defaultMode: "prompt-improve"`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 architecture decision | Scaffold shape would be unbound | Use the locked two-workflow-mode target described in the shared context and preserve workflow-only routing |
| Dependency | Parent-skill templates | Hub files could drift from validator expectations | Start from the five cited parent-skill template files and keep required fields aligned with `parent-skill-check.cjs` |
| Risk | Content relocation sneaks into scaffold phase | Later phases lose atomic rename boundaries | Restrict this phase to the five hub-root files and two empty directories listed above |
| Risk | `prompt-models` is accidentally modeled as a surface | Router contract would contradict the approved workflow-only decision | Declare both modes as `packetKind: "workflow"`; keep `prompt-models.toolSurface.mutatesWorkspace:false` without adding a surface axis |
| Risk | Graph identity split remains | Advisor could see stale or duplicated skill identities after fold-in | Rewrite only the surviving `sk-prompt/graph-metadata.json` and keep packet directories graph-metadata-free |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for phase drafting. The operator already locked the workflow-only target shape, full `git mv` relocation strategy for later phases, `/prompt-improve` command rename timing, and graph identity dissolution rule.
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
