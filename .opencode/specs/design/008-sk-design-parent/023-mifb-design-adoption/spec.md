---
title: "Feature Specification: adopt the make-interfaces-feel-better backlog into sk-design"
description: "Level-3 build phase: implement all 16 prioritized adoption items from the 022 research backlog into the live sk-design modes (foundations rules, audit detectors, motion refinements, interface preflight, md-generator capture, shared vocabulary) plus the hub references/->shared/ doc fix. Implemented via cli-codex gpt-5.5 high fast, scope-locked to the named anchors."
trigger_phrases:
  - "mifb design adoption build"
  - "sk-design corpus adoption"
  - "implement make-interfaces-feel-better backlog"
  - "sk-design foundations audit motion edits"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/023-mifb-design-adoption"
    last_updated_at: "2026-06-27T09:26:47Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied all 16 backlog items + the hub doc fix across 12 sk-design files"
    next_safe_action: "Commit the 023 build phase and the 12 sk-design edits"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-023-mifb-design-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 16 items landed additively across 12 files with conflict decisions preserved; scope-locked, three absences confirmed"
      - "The hub references/->shared/ doc bug is fixed, touching only shared-base citations, not per-mode references/ paths"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: adopt the make-interfaces-feel-better backlog into sk-design

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This build phase applies the converged adoption backlog from `../022-mifb-design-research/research/research.md` into the live `sk-design` skill. It lands the genuinely net-new surface micro-craft (concentric-radius math, pure-rgba image-edge outlines, root-only font smoothing) and the under-covered precision items as foundations rules with matching audit detectors, adds the one real motion gap (a no-dependency icon-swap fallback) plus small motion refinements, adds interface preflight reminders, keeps md-generator to measured capture, optionally adds shared vocabulary, and fixes the hub doc bug that cites a non-existent `references/` shared base.

**Key Decisions**: Implement via `cli-codex gpt-5.5 high fast`, scope-locked to the named anchors per the 022 coverage map (ADR-001); preserve the §6 conflict decisions verbatim — shadow-as-border is a replacement (never stacked), image-outline is an optical exception (ADR-002).

**Critical Dependencies**: The 022 research backlog and coverage map, and the live `sk-design` mode packets the edits land in.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../022-mifb-design-research/spec.md |
| **Successor** | None planned |
| **Handoff Criteria** | All 16 backlog items are applied at their named anchors in the live sk-design modes, the hub references/->shared/ doc bug is fixed, every changed file preserves the 022 conflict decisions, the diff proves the three absences (no global review format, no hub per-mode logic, no wholesale numeric defaults), and the packet passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 022 research produced a corpus-traced, target-traced adoption backlog but applied nothing — by design, it was research only. The live `sk-design` family still lacks the net-new surface craft (concentric radius, image outlines, font smoothing), still phrases a few rules too broadly (text-wrap caveats, tabular framing), still misses a no-dependency icon-swap recipe, still has no audit detectors for the new rules, and the hub doc still points at a `references/` shared base that does not exist.

### Purpose
Apply the full 022 backlog into the live modes with surgical, anchor-scoped edits, using `cli-codex gpt-5.5 high fast` as the executor. Foundations gains the rules, audit gains the matching detectors, motion gains the icon-swap fallback and small refinements, interface gains preflight reminders, md-generator preserves measured evidence only, shared optionally gains vocabulary, and the hub doc bug is fixed. The 022 conflict decisions and the do-not list are preserved verbatim.

> **Build note:** Each edit lands at the anchor the 022 coverage map names. Adjacent content is not rewritten (scope lock).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Foundations rules: concentric-radius math, image-outline pure-rgba exception, root-only font smoothing, text-wrap line-count caveats, shadow-as-border decision matrix, dark-mode white-ring separator, dynamic tabular-number framing.
- Audit detectors: same-radius nested surfaces, image-outline tint/layout misuse, hit-area collision, `transition: all`, shadow-ring-vs-ghost-card.
- Motion: contextual icon-swap CSS fallback, static press-scale escape hatch, semantic split/stagger enters, small fixed-translate exits.
- Interface: optical-alignment examples and preflight reminders (alignment, image outline, nested radius, hit-area collision).
- md-generator: a measured-capture reminder (preserve outlines/shadows/radii/smoothing/hit-targets when extracted), no taste defaults.
- Shared: optional vocabulary for `image-edge outline` and `shadow ring`.
- Hub doc fix: correct `SKILL.md` shared-base references from `references/` to `shared/`.

### Out of Scope
- Any new design doctrine beyond the 022 backlog items.
- Importing the corpus's global Review Output Format; transplanting wholesale numeric defaults (40px over 44x44, universal 100ms stagger); putting per-mode logic in the hub.
- Re-adding already-covered motion rules (interruptible transitions, `initial={false}`, press scale `0.96`, zero-bounce springs).
- Touching the md-generator extraction backend logic or any non-sk-design skill.

### Inputs (read-only)
- `../022-mifb-design-research/research/research.md` (the backlog and coverage map).
- The current live sk-design mode packets and shared register.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-foundations/references/layout/layout_responsive.md` | Edit | Concentric-radius math; optical-alignment base |
| `sk-design/design-foundations/references/color/palette_theming.md` | Edit | Image-outline exception; shadow-as-border matrix; dark-mode ring |
| `sk-design/design-foundations/references/type/typography_system.md` | Edit | Root font smoothing; text-wrap caveats; tabular framing |
| `sk-design/design-audit/references/anti_patterns_production.md` | Edit | Radius/outline/hit-area/shadow detectors |
| `sk-design/design-audit/references/accessibility_performance.md` | Edit | `transition: all` static-risk detector |
| `sk-design/design-motion/references/micro_interactions.md` | Edit | Icon-swap CSS fallback; static escape hatch |
| `sk-design/design-motion/references/motion_strategy.md` | Edit | Split/stagger; fixed-translate exits |
| `sk-design/design-interface/references/design-process/mechanical_defaults.md` | Edit | Optical-alignment examples |
| `sk-design/design-interface/assets/interface_preflight_card.md` | Edit | Preflight reminders |
| `sk-design/design-md-generator/SKILL.md` | Edit | Measured-capture reminder |
| `sk-design/shared/design_token_vocabulary.md` | Edit | Optional shared vocabulary |
| `sk-design/SKILL.md` | Edit | Fix references/->shared/ shared-base citation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The net-new foundations rules land | layout/type/color foundations files carry concentric-radius math, image-outline pure-rgba exception, and root font smoothing at the named anchors |
| REQ-002 | The audit detectors land | anti_patterns_production.md and accessibility_performance.md carry the radius, image-outline, hit-area, shadow-ring, and `transition: all` detectors |
| REQ-003 | The conflict decisions are preserved | shadow-as-border is documented as a replacement only; image-outline is an optical exception; the do-not list is not contradicted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The motion gap closes | micro_interactions.md carries the no-dependency icon-swap CSS fallback and the static press-scale escape hatch |
| REQ-005 | Interface preflight gains reminders | mechanical_defaults.md / interface_preflight_card.md carry optical-alignment, image-outline, radius, and hit-area-collision prompts |
| REQ-006 | md-generator stays capture-only and the hub doc bug is fixed | md-generator gains only a measured-capture reminder; SKILL.md cites `shared/` not `references/` |
| REQ-007 | Scope lock holds | each changed file's diff only adds the named guidance at the named anchor; no adjacent rewrite |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 16 backlog items are applied at the anchors the 022 coverage map names, plus the hub doc fix, with each changed file preserving the 022 conflict decisions and the do-not list.
- **SC-002**: The diff proves the three absences (no global review-format import, no hub per-mode logic, no wholesale numeric-default transplant), and the packet passes `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Codex rewrites adjacent design guidance | sk-design voice/structure drift | Scope-lock the dispatch to the named anchor; verify every diff before accepting |
| Risk | A corpus numeric default gets transplanted wholesale | Conflicts with sk-design's stricter values | Each prompt carries the do-not list; verify 44x44 and stagger caps are preserved |
| Risk | Image-outline rule phrased as a token scale | Conflicts with tinted-neutral token guidance | Land it as an explicit optical exception, per the 022 conflict decision |
| Dependency | The 022 backlog and coverage map | The build has no spec | Read `../022-.../research/research.md` before each dispatch |
| Dependency | cli-codex gpt-5.5 high fast | The edits cannot be applied as directed | Validated executor from the 022 run; same invocation, workspace-write |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Additions must respect each target mode's existing per-task resource budget; no broadening of default loads.

### Security
- **NFR-S01**: Additions must preserve the packet-local path-guard posture of each target mode; the image-outline and shared-vocab edits add guidance, not guard bypasses.

### Reliability
- **NFR-R01**: Edits are anchor-scoped and additive; existing rules and examples remain intact so current design behavior does not regress.

---

## 8. EDGE CASES

### Data Boundaries
- **A target anchor moved since 022**: codex must locate the equivalent section and report if the anchor is missing rather than inventing one.
- **An item already partially covered**: codex adds only the missing precision (e.g. text-wrap caveats), not a duplicate rule.

### Error Scenarios
- **A dispatch edits outside scope**: the diff review rejects it and the file is reverted to the pre-dispatch state before re-dispatching with a tighter prompt.
- **A codex edit conflicts with a do-not item**: it is reverted; the do-not list governs.

### State Transitions
- **Research to build**: this phase consumes the 022 backlog; after it, the named items are live in sk-design and 9-16 lower-urgency items are also applied per the all-16 scope.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 16 items across ~12 files in four modes plus shared and the hub |
| Risk | 14/25 | Edits the live production design skill; reversible but voice/scope sensitive |
| Research | 6/20 | The research is done; this is application of a known backlog |
| Multi-Agent | 9/15 | Per-mode cli-codex dispatches with orchestrator verification |
| Coordination | 10/15 | Cross-file consistency, conflict-decision preservation, diff review |
| **Total** | **57/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Codex rewrites adjacent guidance | H | M | Scope-lock + per-diff verification |
| R-002 | Wholesale numeric default transplanted | M | M | Do-not list in every prompt; verify preserved values |
| R-003 | Image-outline phrased as token scale | M | L | Land as optical exception per the conflict decision |
| R-004 | An anchor moved and codex invents a location | M | L | Instruct codex to report missing anchors, not guess |

---

## 11. USER STORIES

### US-001: Land the net-new surface craft (Priority: P0)

**As a** sk-design maintainer, **I want** concentric-radius math, image-edge outlines, and root font smoothing in foundations, **so that** the family teaches the surface polish it currently lacks.

**Acceptance Criteria**:
1. Given the foundations files, When I read the named anchors, Then each net-new rule is present and matches sk-design's voice.

### US-002: Make the rules reviewable (Priority: P0)

**As a** reviewer, **I want** audit detectors for the new rules, **so that** violations surface as findings instead of silent polish gaps.

**Acceptance Criteria**:
1. Given the audit files, When I run a critique, Then the radius/outline/hit-area/shadow/`transition:all` detectors exist.

### US-003: Close the motion gap (Priority: P1)

**As a** builder without an animation library, **I want** the icon-swap CSS fallback in motion, **so that** I can cross-fade icons without adding a dependency.

**Acceptance Criteria**:
1. Given micro_interactions.md, When I look for the icon-swap recipe, Then the no-dependency CSS fallback is documented.

---

## 12. OPEN QUESTIONS

- Whether any item needs a sk-design-specific values caveat beyond the corpus defaults (e.g. a tighter radius or stagger value) is a per-edit judgment made during the build and recorded in the diff.
- Whether the shared vocabulary edit is worth landing now or deferring is decided when the foundations/audit edits show how often the terms recur.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source backlog**: `../022-mifb-design-research/research/research.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Target skill**: `.opencode/skills/sk-design/`

<!--
LEVEL 3 ADDENDUM
- decision-record.md carries the binding build decisions
- research/research.md in 022 is the primary evidence the edits trace to
-->
