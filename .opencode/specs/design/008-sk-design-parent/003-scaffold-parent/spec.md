---
title: "Feature Specification: Phase 3: scaffold-parent"
description: "Stand up the sk-design umbrella-router skeleton (thin router SKILL.md, own graph-metadata, shared design-base references, family edges to the 5 children) with no design content yet, so later phases have a discoverable parent to attach to."
trigger_phrases:
  - "sk-design umbrella scaffold"
  - "design router skeleton"
  - "sk-design parent skill"
  - "design family edges"
  - "shared design-base references"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/003-scaffold-parent"
    last_updated_at: "2026-06-25T12:41:15Z"
    last_updated_by: "claude-opus"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/003-scaffold-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: scaffold-parent

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
| **Phase** | 3 of 6 |
| **Predecessor** | ../002-architecture-decision/spec.md |
| **Successor** | ../004-onboard-existing/spec.md |
| **Handoff Criteria** | `skill_graph_scan` clean; advisor discovers `sk-design`; one-graph-metadata-per-skill invariant holds |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Build the sk-design umbrella family from the corpus research specification.

**Scope Boundary**: Stand up the `sk-design` umbrella-router SKELETON only. The thin router, its own metadata, the shared design-base reference layer, and family edges are in scope. No design judgment, no aesthetic content, and no per-child SKILL bodies are written here; those belong to phases 004 and 005.

**Dependencies**:
- The locked architecture decision (`../002-architecture-decision/`): umbrella-router over a sibling family, 5 core children, flat `sk-design-*` names kept.
- The 4-model corpus research (`../001-corpus-research/research/research.md`) for the shared-base content list (anti-slop principles, design-token vocabulary, 8 cognitive laws).
- The two existing skills on disk (`sk-design-interface`, `sk-design-md-generator`) as the first two family edge targets.

**Deliverables**:
- `.opencode/skills/sk-design/SKILL.md` — thin umbrella router (WHEN TO USE, SMART ROUTING to the family, RULES).
- `.opencode/skills/sk-design/graph-metadata.json` — own metadata with `skill_id: sk-design` and `enhances`/`siblings` edges to the 5 children.
- A shared design-base reference layer under `.opencode/skills/sk-design/references/` (anti-slop principles, design-token vocabulary, the 8 cognitive laws).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The architecture decision locks `sk-design` as an umbrella-router over a sibling family, but no parent skill exists on disk yet. Without a discoverable `sk-design` router, its own `graph-metadata.json`, and a shared design-base layer, the later phases (onboard existing, build net-new) have nothing to register children against and no shared reference vocabulary to point at.

### Purpose
Stand up a thin, discoverable `sk-design` umbrella-router skeleton plus its shared design-base references so that phases 004-006 can attach real and net-new children to a parent that the advisor and skill-graph already see.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A thin `sk-design/SKILL.md` router: WHEN TO USE, SMART ROUTING to the 5-child family, and RULES (route to the smallest useful child; never co-load the whole family).
- Its own `sk-design/graph-metadata.json` (`skill_id: sk-design`) carrying `enhances` and `siblings` edges to the 5 children.
- A shared design-base reference layer: anti-slop principles, a design-token vocabulary, and the 8 cognitive laws as shared references.

### Out of Scope
- Design judgment, aesthetic presets, and per-child SKILL bodies - owned by phases 004 (existing) and 005 (net-new).
- Editing the two existing skills' files - that registration is phase 004's job.
- Advisor index rebuild and family-wide routing/regression tests - owned by phase 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/SKILL.md` | Create | Thin umbrella router: WHEN TO USE, SMART ROUTING, RULES |
| `.opencode/skills/sk-design/graph-metadata.json` | Create | Own metadata, `skill_id: sk-design`, family edges to the 5 children |
| `.opencode/skills/sk-design/references/anti_slop_principles.md` | Create | Shared anti-default / anti-slop principles |
| `.opencode/skills/sk-design/references/design_token_vocabulary.md` | Create | Shared design-token vocabulary |
| `.opencode/skills/sk-design/references/cognitive_laws.md` | Create | The 8 cognitive laws (Hick's, Miller's, Fitts's, Doherty, Aesthetic-Usability, Von Restorff, Proximity, Common Region) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `sk-design` umbrella-router SKILL.md exists as a thin router | `.opencode/skills/sk-design/SKILL.md` present with WHEN TO USE, SMART ROUTING to the 5 children, and RULES; no per-child design content embedded |
| REQ-002 | `sk-design` is discoverable and the one-graph-metadata-per-skill invariant holds | `skill_graph_scan` runs clean; advisor discovers `sk-design`; exactly one `graph-metadata.json` exists under `.opencode/skills/sk-design/` with `skill_id: sk-design` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Family edges point at the 5 children | `sk-design/graph-metadata.json` carries `enhances`/`siblings` edges naming `sk-design-interface`, `sk-design-md-generator`, `sk-design-foundations`, `sk-design-motion`, `sk-design-audit` |
| REQ-004 | Shared design-base reference layer exists | `references/` contains anti-slop principles, a design-token vocabulary, and the 8 cognitive laws, each as a resolvable file the children can point at |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A thin `sk-design` umbrella-router exists on disk and is discoverable by the advisor and `skill_graph_scan` with no scan errors.
- **SC-002**: The shared design-base layer and family edges are in place so phase 004 can register the two existing skills against a real parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Architecture decision (`../002`) | Wrong structural model would invalidate the skeleton shape | Decision is user-locked to umbrella-router; scaffold mirrors it exactly |
| Risk | Duplicate or stray `graph-metadata.json` under `sk-design/` | Breaks the one-graph-metadata-per-skill invariant and skill-graph scan | Author exactly one metadata file; verify with `skill_graph_scan` before handoff |
| Risk | Router accidentally embeds design content | Bloats the thin router and pre-empts child phases | Keep SKILL.md to WHEN TO USE / SMART ROUTING / RULES; push all judgment to children |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Final on-disk layout of the shared design-base references (single `references/` folder vs. grouped subfolders) - confirm against the children's expected pointer paths.
- Whether the optional 6th child (`sk-design-output`) gets a placeholder edge now or is added later - deferred to the phase-002 optional-child decision.
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
