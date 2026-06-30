---
title: "Feature Specification: adopt the designer-skills-main audit findings into sk-design"
description: "Level-3 build phase: implement the design-audit slice of the 024 designer-skills-main adoption backlog into the live sk-design audit mode — visual-critique 7-dimension crosswalk, release-hardening bundle, token-tier/evidence guards, and the perceived-quality lens — via cli-codex gpt-5.5 high fast, scope-locked to the audit references. No second scoring model; crosswalk onto existing severity."
trigger_phrases:
  - "designer-skills audit adoption build"
  - "sk-design visual-critique crosswalk"
  - "audit hardening adoption"
  - "perceived-quality audit lens build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/025-audit-adoption"
    last_updated_at: "2026-06-27T11:49:46Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied and verified the design-audit adoption: crosswalk, polish lens, hardening, guards"
    next_safe_action: "Commit phases 025-027 once 026 and 027 verify"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-025-audit-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Visual-critique landed as a crosswalk onto existing P0-P3 severity, not a second score; RTL/text-expansion skipped as already present"
      - "Perceived-quality lens (Polish As Trust) + evidence-impact guard landed; 4 audit files, additive, scope-locked"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: adopt the designer-skills-main audit findings into sk-design

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

This phase applies the **design-audit** slice of the `024-designer-skills-research` adoption backlog into the live sk-design audit mode. It lands the highest-leverage finding — a visual-critique seven-dimension crosswalk mapped onto audit's existing P0-P3 severity and five dimensions (a lens set, not a second score) — plus the release-hardening bundle (component completeness, localization stress, accessibility modality coverage), the token-tier and evidence-impact guards, and the perceived-quality / aesthetic-usability lens that the research found was named but never landed.

**Key Decisions**: Implement via `cli-codex gpt-5.5 high fast`, scope-locked to the four audit reference files (ADR-001); keep visual-critique as a crosswalk onto existing severity and skip anything the mature audit mode already covers — Nielsen lens, RTL hardening, the five-dimension score (ADR-002).

**Critical Dependencies**: The 024 backlog and the current (post-023) audit references.
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
| **Predecessor** | ../024-designer-skills-research/spec.md |
| **Successor** | ../026-interface-motion-adoption/spec.md |
| **Handoff Criteria** | The audit-targeted backlog items are applied additively at their named anchors in the four audit references, nothing already-present is duplicated, the visual-critique adoption is a crosswalk onto existing severity, every diff is scope-locked, and the packet passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 024 research produced an adoption backlog but applied nothing. Its highest-leverage finding lands in audit: the visual-critique plugin's seven screen-critique dimensions are a clean strengthening source for the audit mode, and the cross-model sweep additionally confirmed a perceived-quality lens gap. The live audit mode lacks the dimension crosswalk, the full release-hardening bundle, the token-tier/evidence guards, and the perceived-quality lens.

### Purpose
Apply the audit slice of the 024 backlog into the live audit references with surgical, scope-locked edits via `cli-codex gpt-5.5 high fast`. Keep the audit mode's existing ownership intact: the visual-critique dimensions become lenses onto the existing severity, not a parallel score, and anything already present (Nielsen lens, RTL hardening) is skipped.

> **Build note:** Each edit is additive and verified by diff. The audit mode is mature; duplication is avoided by reading current state first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Visual-critique seven-dimension crosswalk → `design-audit/references/critique_hardening.md` (rank 1).
- Perceived-quality / aesthetic-usability lens → `critique_hardening.md` (rank 11).
- Release-hardening: component completeness + localization stress → `anti_patterns_production.md` (rank 3, part).
- Accessibility modality coverage + optional WCAG POUR scaffold → `accessibility_performance.md` (rank 3, part; minor).
- Token-tier/frequency guard + pseudo-localization test → `anti_patterns_production.md` (rank 9, minor).
- Evidence-impact guard → `evidence_capture.md` (rank 9, part).

### Out of Scope
- The interface, motion, and foundations slices of the 024 backlog (phases 026, 027).
- A second scoring model or a new critique mode (the research ruled these out).
- Importing usability-test programs, governance, or any lifecycle workflow.
- Re-adding already-covered audit content (Nielsen lens, RTL hardening, the five-dimension score).

### Inputs (read-only)
- `../024-designer-skills-research/research/research.md` (the backlog + sweep).
- The current post-023 audit references.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-audit/references/critique_hardening.md` | Edit | Visual-critique crosswalk; perceived-quality lens |
| `sk-design/design-audit/references/anti_patterns_production.md` | Edit | Component completeness, localization stress, token-tier, pseudo-localization |
| `sk-design/design-audit/references/accessibility_performance.md` | Edit | Modality coverage; optional POUR scaffold |
| `sk-design/design-audit/references/evidence_capture.md` | Edit | Evidence-impact guard |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The visual-critique crosswalk lands | `critique_hardening.md` carries the seven dimensions mapped onto existing severity/dimensions, as a lens set not a second score |
| REQ-002 | The perceived-quality lens lands | `critique_hardening.md` carries the polish-as-trust / consistency / error-empty-loading-quality lens |
| REQ-003 | No duplication of existing audit content | The Nielsen lens, RTL hardening, and five-dimension score are not re-added; the diff shows only net-new items |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The release-hardening + guards land | component completeness, localization stress, accessibility modality coverage, token-tier, and evidence-impact guards are present at the named files |
| REQ-005 | Scope lock holds | only the four audit files changed; each diff is additive at a fitting anchor |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The audit-targeted backlog items are applied additively in the four audit references, the visual-critique adoption is a crosswalk onto existing severity, and nothing already-present was duplicated.
- **SC-002**: Only the four audit files changed, every diff is scope-locked, and the packet passes `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Codex re-adds already-covered audit content | Duplication / bloat | Prompt instructs read-first + skip-if-present; verify the diff |
| Risk | Visual-critique becomes a second score | Conflicts with audit ownership | Land it explicitly as a crosswalk onto existing severity |
| Risk | Codex edits outside the four audit files | Scope drift | Scope-lock the dispatch; per-diff review; revert on drift |
| Dependency | The 024 backlog | The build has no spec | Read `../024-.../research/research.md` before dispatch |
| Dependency | cli-codex gpt-5.5 high fast | Edits cannot be applied as directed | Validated executor from the 023 build |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Additions are guidance only; they add no runtime cost to the audit mode and respect its per-task budget.

### Security
- **NFR-S01**: Additions preserve the audit mode's packet-local path-guard posture; the evidence guard reduces overclaim risk.

### Reliability
- **NFR-R01**: Edits are anchor-scoped and additive; the audit mode's existing checks remain intact.

---

## 8. EDGE CASES

### Data Boundaries
- **An item already present**: codex skips it and reports the skip; the diff adds only net-new content.
- **A target anchor moved since the research**: codex locates the equivalent section or reports a missing anchor rather than inventing one.

### Error Scenarios
- **A dispatch edits outside scope**: the diff review rejects it and the file is reverted before re-dispatch.

### State Transitions
- **Research to build**: this phase consumes the audit slice; the interface/motion/foundations slices follow in 026/027.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Four audit reference files, one mode |
| Risk | 12/25 | Edits the live audit mode; reversible but duplication-sensitive |
| Research | 5/20 | The research is done; this applies a known slice |
| Multi-Agent | 7/15 | One cli-codex dispatch + orchestrator verification |
| Coordination | 8/15 | Sibling to 026/027; must not duplicate 023's edits |
| **Total** | **44/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Duplication of existing audit content | M | M | Read-first + skip-if-present; verify diff |
| R-002 | Visual-critique becomes a second score | M | L | Land as a crosswalk onto existing severity |
| R-003 | Scope drift beyond the four files | M | L | Scope-lock + per-diff verification |

---

## 11. USER STORIES

### US-001: Sharper screen critique (Priority: P0)

**As a** reviewer, **I want** the seven visual-critique dimensions as audit lenses, **so that** screen critique is more systematic without changing how audit scores or routes findings.

**Acceptance Criteria**:
1. Given the audit references, When I critique a screen, Then the seven dimensions exist as lenses mapped to the existing severity.

### US-002: Catch perceived-quality failures (Priority: P0)

**As a** reviewer, **I want** the perceived-quality lens, **so that** inconsistency and neglected error/empty/loading states surface as findings.

**Acceptance Criteria**:
1. Given `critique_hardening.md`, When I run the polish lens, Then consistency and state-quality checks are present.

### US-003: Production hardening (Priority: P1)

**As a** maintainer, **I want** the release-hardening bundle and evidence guard, **so that** audits cover component completeness, localization stress, and a11y modality coverage without overclaiming impact.

**Acceptance Criteria**:
1. Given the audit references, When I audit for release, Then the hardening checks and the evidence guard exist.

---

## 12. OPEN QUESTIONS

- Which exact items the mature audit mode already covers is resolved per-edit by reading current state; codex reports any skip.
- Whether the WCAG POUR scaffold is worth adding versus skipping for compactness is a per-edit judgment recorded in the diff.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source backlog**: `../024-designer-skills-research/research/research.md`
- **Plan**: See `plan.md`
- **Sibling build phases**: `../026-interface-motion-adoption/`, `../027-foundations-adoption/`
- **Target**: `.opencode/skills/sk-design/design-audit/`

<!--
LEVEL 3 ADDENDUM
- decision-record.md carries the binding build decisions
- research/research.md in 024 is the primary evidence
-->
