---
title: "Feature Specification: Phase 4: onboard-existing"
description: "Bring the two existing skills (sk-design-interface, sk-design-md-generator) into the sk-design family as siblings without breaking them: add family edges, keep flat names and every legacy trigger, and lightly augment each."
trigger_phrases:
  - "onboard existing design skills"
  - "register sk-design siblings"
  - "design family edges"
  - "aesthetics presets library"
  - "sk-design-spec role"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/004-onboard-existing"
    last_updated_at: "2026-06-25T12:41:16Z"
    last_updated_by: "claude-opus"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/004-onboard-existing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: onboard-existing

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
| **Created** | 2026-06-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | ../003-scaffold-parent/spec.md |
| **Successor** | ../005-build-subskills/spec.md |
| **Handoff Criteria** | Existing references still resolve; `advisor_validate` clean; routing confidence >=0.8 for both skills |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Build the sk-design umbrella family from the corpus research specification.

**Scope Boundary**: Bring the two EXISTING skills into the family as siblings under the `sk-design` umbrella without breaking them. Family edges and light augmentation are in scope. Flat names are kept (zero reference rewrites), every legacy trigger is preserved, and no net-new child is built here (that is phase 005).

**Dependencies**:
- Phase 003 done: the `sk-design` umbrella skeleton, its `graph-metadata.json`, and the shared design-base layer exist and scan clean.
- The two existing skills on disk: `.opencode/skills/sk-design-interface/` and `.opencode/skills/sk-design-md-generator/`, which already name each other as siblings.
- The locked taxonomy (`../002-architecture-decision/`): `sk-design-interface` keeps its name; `sk-design-md-generator` keeps its name as the `sk-design-spec` role alias.

**Deliverables**:
- Family edges added to `sk-design-interface/graph-metadata.json` and `sk-design-md-generator/graph-metadata.json` plus the matching edges on the umbrella.
- `sk-design-interface`: a family-routing pointer + an aesthetics-presets references library (brutalist/minimalist/soft/apple-bento).
- `sk-design-md-generator`: cross-linked as the `sk-design-spec` role with an optional "author mode" note.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 003 the `sk-design` umbrella exists, but the two real, working design skills are not yet members of the family: they have no edges to the umbrella and the umbrella's routing does not formally claim them. They must join the family without breaking their existing references, flat names, or legacy trigger phrases that other parts of the repo already depend on.

### Purpose
Register `sk-design-interface` and `sk-design-md-generator` as siblings under the `sk-design` umbrella and lightly augment each, while keeping both flat names and every legacy trigger so the change is non-breaking and discovery improves.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add family edges so both existing skills are siblings under `sk-design` (edges on both child metadata files and the umbrella's metadata).
- Augment `sk-design-interface` with a family-routing pointer and an aesthetics-presets references library (brutalist/minimalist/soft/apple-bento).
- Cross-link `sk-design-md-generator` as the `sk-design-spec` role with an optional "author mode" note; keep its Playwright backend and cardinal-fidelity rule untouched.

### Out of Scope
- Building the 3 net-new children (`sk-design-foundations`, `sk-design-motion`, `sk-design-audit`) - phase 005.
- Renaming either skill or rewriting any reference to the flat `sk-design-*` names - kept flat on purpose (zero rewrites).
- Advisor index rebuild + family-wide regression suite - phase 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design-interface/graph-metadata.json` | Modify | Add family edges to the `sk-design` umbrella; keep existing sibling edges |
| `.opencode/skills/sk-design-md-generator/graph-metadata.json` | Modify | Add family edges + the `sk-design-spec` role link to the umbrella |
| `.opencode/skills/sk-design/graph-metadata.json` | Modify | Confirm/complete the umbrella's edges to both existing children |
| `.opencode/skills/sk-design-interface/SKILL.md` | Modify | Add a family-routing pointer to the umbrella and siblings |
| `.opencode/skills/sk-design-interface/references/aesthetics/` | Create | Aesthetics-presets library: brutalist/minimalist/soft/apple-bento |
| `.opencode/skills/sk-design-md-generator/SKILL.md` | Modify | Cross-link as the `sk-design-spec` role; add optional "author mode" note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both existing skills are registered as siblings under `sk-design` without breaking them | `sk-design-interface` and `sk-design-md-generator` `graph-metadata.json` carry family edges to the umbrella, the umbrella names both children, and every legacy trigger phrase is preserved (no trigger removed) |
| REQ-002 | All existing references still resolve and routing stays strong | `advisor_validate` runs clean; routing confidence >=0.8 for both skills; the mandatory `mcp-open-design` co-load, `mcp-figma`, `sk-code`, `sk-code-review`, and CLAUDE.md design gates still resolve |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `sk-design-interface` light augmentation | A family-routing pointer is added and a `references/aesthetics/` library exists with brutalist, minimalist, soft, and apple-bento presets; the flat name is unchanged |
| REQ-004 | `sk-design-md-generator` cross-linked as `sk-design-spec` role | The skill is cross-linked to the umbrella as the `sk-design-spec` role with an optional "author mode" note; the Playwright backend and cardinal-fidelity rule are untouched; the flat name is unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both existing skills are members of the `sk-design` family (edges both ways) with every flat name and legacy trigger preserved, and `advisor_validate` is clean.
- **SC-002**: Routing confidence is >=0.8 for both skills and all pre-existing references (mcp-open-design mandatory co-load, mcp-figma, sk-code, sk-code-review, CLAUDE.md design gates) still resolve.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 umbrella skeleton | Cannot register children without a parent to attach to | Gate this phase on a clean phase-003 `skill_graph_scan` |
| Risk | Dropping or renaming a legacy trigger phrase | Breaks existing routing and cross-repo references | Treat flat names + legacy triggers as frozen; add only, never remove |
| Risk | Augmentation bloats or rewrites an existing skill | Regresses a working skill | Keep augmentation light: a routing pointer + an additive aesthetics library + an optional author-mode note |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether `sk-design-md-generator` should expose `sk-design-spec` as a formal alias now or only cross-link the role label - confirm against the phase-002 naming/alias decision.
- Exact on-disk location for the aesthetics-presets library under `sk-design-interface/references/` - confirm it matches the umbrella's expected pointer path.
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
