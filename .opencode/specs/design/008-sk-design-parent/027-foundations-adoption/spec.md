---
title: "Feature Specification: adopt the designer-skills-main foundations findings into sk-design"
description: "Level-3 build phase: implement the design-foundations slice of the 024 designer-skills-main adoption backlog into live sk-design — grid contract, density modes, containment restraint, theme-specific media verification, cultural-color note, and script-specific typography — via cli-codex gpt-5.5 high fast, scope-locked, skipping phase-023 additions and the existing data-viz coverage."
trigger_phrases:
  - "designer-skills foundations adoption build"
  - "sk-design grid contract build"
  - "density modes containment restraint"
  - "theme media verification build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/027-foundations-adoption"
    last_updated_at: "2026-06-27T11:49:46Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied and verified the foundations adoption across three files"
    next_safe_action: "Commit phases 025-027 once all three finalize"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-027-foundations-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Grid contract, density modes, and containment restraint landed in layout_responsive.md as net-new; concentric radius skipped"
      - "Theme-media verification + script typography added; phase-023 color/type additions and data-viz skipped"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: adopt the designer-skills-main foundations findings into sk-design

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

This phase applies the **design-foundations** slice of the 024 adoption backlog into live sk-design: a grid contract, density-mode spacing, and a containment restraint in layout; theme-specific media verification and a cultural-color note in color/theming; and a script-specific typography note. It skips everything phase 023 already added (concentric radius, image-edge outline, shadow-as-border, dark-mode ring, font smoothing, text-wrap, tabular numbers) and the existing data-viz coverage.

**Key Decisions**: Implement via `cli-codex gpt-5.5 high fast`, scope-locked to three foundations files (ADR-001); the additions are net-new layout/theme/type refinements, with all phase-023 and data-viz content skipped (ADR-002).

**Critical Dependencies**: The 024 backlog and the current (post-023) foundations references.
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
| **Predecessor** | ../026-interface-motion-adoption/spec.md |
| **Successor** | None (final adoption phase) |
| **Handoff Criteria** | The foundations backlog items are applied additively at their named anchors in the three files, phase-023 and data-viz content is skipped, every diff is scope-locked, and the packet passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 024 backlog's foundations items had not been applied. Layout lacked an explicit grid contract, density-mode spacing, and a containment restraint; color/theming lacked theme-specific media verification; typography lacked a non-Latin/script note. Phase 023 already edited these files, so duplication had to be avoided, and foundations already has data-viz coverage.

### Purpose
Apply the foundations slice into the live references via `cli-codex gpt-5.5 high fast`, scope-locked, reading current state first and skipping phase-023 additions and data-viz.

> **Build note:** Additions are net-new layout/theme/type refinements; everything already present is skipped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Grid contract + density modes + containment restraint → `design-foundations/references/layout/layout_responsive.md` (rank 5).
- Theme-specific media verification + cultural-color note → `design-foundations/references/color/palette_theming.md` (rank 7 + minor).
- Script-specific typography note → `design-foundations/references/type/typography_system.md` (minor).

### Out of Scope
- The audit, interface, and motion slices (phases 025, 026).
- Re-adding phase-023 content (concentric radius, image outline, shadow-as-border, dark ring, font smoothing, text-wrap, tabular) or data-visualization (already covered).
- A new mode; the hub stays logic-free.

### Inputs (read-only)
- `../024-designer-skills-research/research/research.md` (the backlog).
- The current post-023 foundations references.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-foundations/references/layout/layout_responsive.md` | Edit | Grid contract; density modes; containment restraint |
| `sk-design/design-foundations/references/color/palette_theming.md` | Edit | Theme-specific media verification; cultural-color note |
| `sk-design/design-foundations/references/type/typography_system.md` | Edit | Script-specific typography note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The layout additions land | `layout_responsive.md` carries the grid contract, density modes, and containment restraint |
| REQ-002 | No duplication of phase-023 / data-viz content | concentric radius, image outline, shadow, dark ring, font smoothing, text-wrap, tabular, and data-viz are not re-added |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Theme + type refinements land | theme-specific media verification, cultural-color note, and script-specific typography are present at the named files |
| REQ-004 | Scope lock holds | only the three foundations files changed; each diff is additive |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The foundations backlog items are applied additively in the three files, and nothing phase-023/data-viz was duplicated.
- **SC-002**: Only the three files changed, every diff is scope-locked, and the packet passes `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Codex re-adds phase-023 foundations content | Duplication | Prompt names the known prior additions + data-viz to skip; verify diff |
| Risk | Theme-media verification overlaps the dark-ring guidance | Redundancy | Focus on theme-specific MEDIA swaps, distinct from the existing dark-ring |
| Risk | Edits drift outside the three files | Scope drift | Scope-lock; per-diff review |
| Dependency | The 024 backlog | No build spec | Read `../024-.../research/research.md` |
| Dependency | cli-codex gpt-5.5 high fast | Edits cannot apply | Validated executor |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Guidance only; no runtime cost added to the foundations mode.

### Security
- **NFR-S01**: Additions preserve the packet-local path-guard posture.

### Reliability
- **NFR-R01**: Edits are anchor-scoped and additive; existing foundations guidance remains intact.

---

## 8. EDGE CASES

### Data Boundaries
- **An item already present**: codex skips it and reports the skip.
- **A target anchor moved**: codex locates the equivalent section or reports a missing anchor.

### Error Scenarios
- **A dispatch edits outside scope**: the diff review rejects it; the file is reverted before re-dispatch.

### State Transitions
- **Research to build**: this phase consumes the foundations slice; it is the final 024 adoption phase.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Three foundations files, one mode |
| Risk | 11/25 | Live edits; duplication-sensitive vs phase 023 + data-viz |
| Research | 5/20 | Applies a known slice |
| Multi-Agent | 7/15 | One cli-codex dispatch + verification |
| Coordination | 8/15 | Must not duplicate 023; sibling to 025/026 |
| **Total** | **41/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Duplication of phase-023 / data-viz content | M | M | Name known prior additions to skip; verify diff |
| R-002 | Theme-media overlaps dark-ring | M | L | Focus on theme-specific media |
| R-003 | Scope drift beyond three files | M | L | Scope-lock + per-diff verification |

---

## 11. USER STORIES

### US-001: An explicit grid + density system (Priority: P0)

**As a** builder, **I want** a grid contract and density modes, **so that** layout system handoff is concrete.

**Acceptance Criteria**:
1. Given `layout_responsive.md`, When I set up a layout, Then the grid contract, density modes, and containment restraint exist.

### US-002: Theme-correct media (Priority: P1)

**As a** builder, **I want** theme-specific media verification, **so that** logos/illustrations/screenshots are correct per theme.

**Acceptance Criteria**:
1. Given `palette_theming.md`, When I theme media, Then the verification check exists, distinct from the dark-ring guidance.

### US-003: Script-aware typography (Priority: P1)

**As a** builder, **I want** a script-specific typography note, **so that** non-Latin scripts get correct treatment beyond RTL/text-expansion.

**Acceptance Criteria**:
1. Given `typography_system.md`, When I support non-Latin scripts, Then the note exists.

---

## 12. OPEN QUESTIONS

- Which foundations items were already present is resolved per-edit by reading current state; codex reports skips.
- Whether the cultural-color note belongs additionally in audit is deferred; this phase keeps it in foundations.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source backlog**: `../024-designer-skills-research/research/research.md`
- **Plan**: See `plan.md`
- **Sibling build phases**: `../025-audit-adoption/`, `../026-interface-motion-adoption/`
- **Target**: `.opencode/skills/sk-design/design-foundations/`

<!--
LEVEL 3 ADDENDUM
- decision-record.md carries the binding build decisions
- research/research.md in 024 is the primary evidence
-->
