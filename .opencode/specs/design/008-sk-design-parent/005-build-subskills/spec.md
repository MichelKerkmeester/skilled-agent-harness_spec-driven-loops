---
title: "Feature Specification: Phase 5: build-subskills"
description: "The sk-design family has its umbrella router and two onboarded children, but the three net-new design domains (foundations, motion, audit) named in the locked taxonomy do not exist yet. This phase authors them from their corpus clusters so the family covers the full design surface."
trigger_phrases:
  - "build sk-design subskills"
  - "sk-design-foundations skill"
  - "sk-design-motion skill"
  - "sk-design-audit skill"
  - "net-new design children"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/005-build-subskills"
    last_updated_at: "2026-06-25T12:41:17Z"
    last_updated_by: "claude-opus"
    recent_action: "Populated the Level-1 spec for the net-new sub-skill build phase"
    next_safe_action: "Build the foundations, motion, and audit children"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../001-corpus-research/research/research.md"
      - "../002-architecture-decision/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/005-build-subskills"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether to split sk-design-foundations into color/layout children (deferred from 002; structure internals as color/, type/, layout/ to keep a split mechanical)"
    answered_questions:
      - "Taxonomy and per-child scope are locked by 002; this phase only builds the three net-new children"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: build-subskills

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
| **Branch** | `design/008-sk-design-parent/005-build-subskills` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | ../004-onboard-existing/spec.md |
| **Successor** | ../006-integration-validation/spec.md |
| **Handoff Criteria** | All three net-new children exist with SKILL.md + references + feature_catalog + manual_testing_playbook + changelog; each passes `validate.sh --strict`; a routing query for each domain resolves to the right child at confidence >=0.8. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Build the sk-design umbrella family from the corpus research specification.

By this point 003 has stood up the `sk-design` umbrella router and shared base, and 004 has onboarded the two existing children (`sk-design-interface`, `sk-design-spec`). This phase fills the remaining gaps in the locked taxonomy by authoring the three net-new children from their corpus clusters. It builds only; it does not run the family-wide integration sweep, which is 006.

**Scope Boundary**: Author the three net-new sub-skills (`sk-design-foundations`, `sk-design-motion`, `sk-design-audit`) and their per-skill packages only. No changes to the umbrella router, the two onboarded children, the parent shared base, or any cross-repo reference. Family-wide advisor/skill-graph rebuild and regression testing are deferred to 006.

**Note**: This phase MAY sub-divide into one sub-phase per skill during execution (e.g. `001-foundations`, `002-motion`, `003-audit`). Each net-new child is independently authored and independently validated, so a per-skill sub-phase split is mechanical and does not change the gate.

**Dependencies**:
- `../002-architecture-decision/spec.md` — the locked taxonomy, per-child scope, and naming/compat policy this phase builds against.
- `../001-corpus-research/research/research.md` §4 — the corpus source clusters for each net-new child.
- `../004-onboard-existing/spec.md` — the umbrella + onboarded children must exist so the new children register into a live family.

**Deliverables**:
- `sk-design-foundations` — the static visual system (color, typography, layout/spacing/grid, responsive).
- `sk-design-motion` — the temporal layer (purposeful animation, micro-interactions, transitions, reduced-motion).
- `sk-design-audit` — the cross-cutting QA/critique child with a shared P0-P3 severity + 5-dimension `/20` contract aligned with `sk-code-review`.
- Each child ships `SKILL.md` + `references/` + `feature_catalog/` + `manual_testing_playbook/` + a changelog entry.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The locked taxonomy (002) names five core children, but only two exist after onboarding: `sk-design-interface` and `sk-design-spec`. The three net-new design domains the corpus research identified as deep, independently-invokable, and backed by their own source clusters (foundations, motion, audit) have no skill yet, so the umbrella family cannot route color/type/layout questions, motion questions, or QA/critique requests to a dedicated child. Until they exist, those queries either misroute to the interface child or fall through to a generic response.

### Purpose
Author the three net-new sub-skills from their corpus clusters so the sk-design family covers the full design surface, with each child independently validated and routable at confidence >=0.8.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `sk-design-foundations` from the color/type/layout corpus clusters (`oklch-skill`, `colorize`, `layout`, `baseline`, `adapt`, plus designer-skills `ui-design`/`design-systems` token+theming). Structure internals as `color/`, `type/`, `layout/` so a later split into discrete children is mechanical.
- Author `sk-design-motion` from the motion corpus clusters (`animate`, `interaction-design`, `delight`, `morphing-icons`, `12-principles-of-animation`, `mastering-animate-presence`), covering purposeful animation, micro-interactions, transitions, and reduced-motion.
- Author `sk-design-audit` from the QA/critique corpus clusters (`audit`, `critique`, `polish`, `harden`, `optimize`, `fixing-accessibility`, `fixing-motion-performance`, `clarify`, `pseudo-elements`, plus designer-skills `visual-critique`), including anti-slop detection and a shared P0-P3 severity + 5-dimension `/20` contract aligned with `sk-code-review`.
- For each child: `SKILL.md` with "When to use / When not to use / Pairs well with", a `references/` library, a `feature_catalog/`, a `manual_testing_playbook/`, and a changelog entry.

### Out of Scope
- The umbrella router, the parent shared base, and the two onboarded children (`sk-design-interface`, `sk-design-spec`) - they belong to 003/004; this phase does not modify them.
- Family-wide advisor rebuild, skill-graph scan, routing/regression sweep, and `validate.sh --recursive` - that is the terminal 006 phase. (Per-child `validate.sh --strict` and a single per-child routing check are in scope here as the gate.)
- The optional `sk-design-output` child - deferred at 002; not built in this phase.
- Splitting `sk-design-foundations` into color/layout children - deferred; only the mechanical-split-ready internal structure is in scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design-foundations/SKILL.md` | Create | Foundations child entry: color/type/layout scope, routing frontmatter, when-to-use boundaries |
| `.opencode/skills/sk-design-foundations/references/` | Create | Color (OKLCH, palettes, contrast, theming, dark mode), typography, and layout/grid reference library structured as `color/`, `type/`, `layout/` |
| `.opencode/skills/sk-design-foundations/feature_catalog/` | Create | Capability catalog for the foundations child |
| `.opencode/skills/sk-design-foundations/manual_testing_playbook/` | Create | Manual verification playbook for the foundations child |
| `.opencode/skills/sk-design-motion/SKILL.md` | Create | Motion child entry: animation/micro-interaction/transition/reduced-motion scope and routing frontmatter |
| `.opencode/skills/sk-design-motion/references/` | Create | Motion reference library (purposeful animation, micro-interactions, transitions, reduced-motion) |
| `.opencode/skills/sk-design-motion/feature_catalog/` | Create | Capability catalog for the motion child |
| `.opencode/skills/sk-design-motion/manual_testing_playbook/` | Create | Manual verification playbook for the motion child |
| `.opencode/skills/sk-design-audit/SKILL.md` | Create | Audit child entry: a11y/perf/critique/harden + anti-slop scope, P0-P3 + 5-dimension `/20` contract, routing frontmatter |
| `.opencode/skills/sk-design-audit/references/` | Create | Audit reference library (a11y, performance, critique, hardening, anti-slop heuristics) |
| `.opencode/skills/sk-design-audit/feature_catalog/` | Create | Capability catalog for the audit child |
| `.opencode/skills/sk-design-audit/manual_testing_playbook/` | Create | Manual verification playbook for the audit child |
| `.opencode/skills/sk-design-foundations/changelog/` | Create | Initial changelog entry for the foundations child |
| `.opencode/skills/sk-design-motion/changelog/` | Create | Initial changelog entry for the motion child |
| `.opencode/skills/sk-design-audit/changelog/` | Create | Initial changelog entry for the audit child |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `sk-design-foundations` exists with SKILL.md + references + feature_catalog + manual_testing_playbook + changelog, built from its corpus clusters. | `.opencode/skills/sk-design-foundations/SKILL.md` and the four package dirs are present; `validate.sh --strict` on the child passes. |
| REQ-002 | `sk-design-motion` exists with SKILL.md + references + feature_catalog + manual_testing_playbook + changelog, built from its corpus clusters. | `.opencode/skills/sk-design-motion/SKILL.md` and the four package dirs are present; `validate.sh --strict` on the child passes. |
| REQ-003 | `sk-design-audit` exists with SKILL.md + references + feature_catalog + manual_testing_playbook + changelog, and carries the shared P0-P3 severity + 5-dimension `/20` contract aligned with `sk-code-review`. | `.opencode/skills/sk-design-audit/SKILL.md` documents the P0-P3 + `/20` contract; the four package dirs are present; `validate.sh --strict` on the child passes. |
| REQ-004 | Each net-new child routes to the correct skill. | A domain-representative query for each child (a color/type/layout prompt, a motion prompt, a critique/a11y prompt) resolves to that child at advisor confidence >=0.8. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each child declares explicit "When to use / When not to use / Pairs well with" boundaries against its siblings. | Each SKILL.md names the boundary to interface/foundations/motion/audit/spec so overlapping queries route deterministically. |
| REQ-006 | `sk-design-foundations` internals are split-ready. | Its references are organized under `color/`, `type/`, `layout/` so a future split into discrete children is mechanical (per the 002 deferral). |
| REQ-007 | Each child cites its corpus sources for traceability. | Each child's references or SKILL.md trace back to the corpus clusters named in `../001-corpus-research/research/research.md` §4. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three net-new children (`sk-design-foundations`, `sk-design-motion`, `sk-design-audit`) exist as complete packages and each passes `validate.sh --strict`.
- **SC-002**: A domain-representative routing query for each new child resolves to the right child at confidence >=0.8, with no misroute to the interface child.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 003 umbrella + 004 onboarded children | New children must register into a live family; if 003/004 are incomplete the routing gate cannot be met | Treat 003+004 completion as a hard precondition; do not start a child build until the umbrella and onboarded siblings validate |
| Risk | Sibling routing overlap (foundations vs. interface, motion vs. audit's motion-perf review) | Med | Author explicit "When not to use / Pairs well with" boundaries (REQ-005); the routing test (REQ-004) catches misroutes before the gate |
| Risk | `sk-design-audit` `/20` contract drifts from `sk-code-review` | Med | Mirror the P0-P3 + 5-dimension `/20` scoring shape from `sk-code-review` directly rather than inventing a parallel scale |
| Risk | Foundations grain decision (one child vs. color+layout split) reopens mid-build | Low | Structure internals as `color/`, `type/`, `layout/` (REQ-006) so the deferred split stays mechanical and does not block this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `sk-design-foundations` ship as one child or split into `sk-design-color` + `sk-design-layout`? Deferred from 002; this phase keeps it as one child with split-ready internals and revisits only if routing telemetry shows the seam matters.
- Should this phase formally sub-divide into per-skill sub-phases (`001-foundations`, `002-motion`, `003-audit`), or stay a single phase with three deliverables? Decided at execution start based on review cadence; the gate is identical either way.
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
