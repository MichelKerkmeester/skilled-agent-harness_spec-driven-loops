---
title: "Feature Specification: design-foundations impeccable adoption into sk-design"
description: "Level-3 build phase: implement the design-foundations slice of the impeccable adoption backlog (028 research) into live sk-design via cli-codex gpt-5.5 high fast, scope-locked + additive + skip-if-present, then independent fresh-Opus verification (PASS)."
trigger_phrases:
  - "031-foundations-impeccable-adoption build"
  - "impeccable foundations adoption"
  - "sk-design impeccable foundations"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/031-foundations-impeccable-adoption"
    last_updated_at: "2026-06-27T15:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built + fresh-Opus-verified the foundations adoption (PASS)"
    next_safe_action: "Finalize docs and validate the packet"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-031-foundations-impeccable-adoption"
      parent_session_id: null
    completion_pct: 100
    answered_questions:
      - "Every foundations backlog item landed and was fresh-Opus-verified (PASS)"
      - "Additive, scope-locked, evergreen-clean; no new mode"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: design-foundations impeccable adoption into sk-design

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Applies the design-foundations slice of the impeccable adoption backlog into live sk-design. Typography gains web-font loading perf, a clamp ratio bound, OpenType features, all-caps tracking, and light-on-dark compensation; color/theming gains physical-scene grounding and dangerous-color-combination warnings; layout gains the auto-fit grid recipe.

**Key Decisions**: implement via cli-codex gpt-5.5 high fast, scope-locked to the named foundations files; additive + read-first skip-if-present; no new mode; a fresh Opus agent independently verified each item landed (PASS).

**Critical Dependencies**: the 028 research backlog and the current post-adoption sk-design files.
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
| **Predecessor** | ../028-impeccable-design-research/spec.md |
| **Successor** | ../032-interface-impeccable-adoption/spec.md |
| **Handoff Criteria** | The foundations backlog items applied additively, nothing already-present duplicated, every diff scope-locked, a fresh Opus agent verified each item (PASS), and the packet passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 028 research froze an adoption backlog but applied nothing. This phase implements the design-foundations slice into the live references.

### Purpose
Apply the foundations items via scope-locked cli-codex edits, reading current state first and skipping anything already present, then verify with an independent fresh Opus agent.

> **Build note:** additive, verified by diff and by an independent fresh-Opus review (PASS).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Typography: font-loading perf, clamp <=2.5x, OpenType features, all-caps tracking 5-12%, light-on-dark compensation.
- Color/theming: physical-scene grounding, dangerous color combos + ~8% colorblindness.
- Layout: auto-fit minmax(280px,1fr) grid recipe.

### Out of Scope
- The other modes' slices (sibling phases).
- Any ruled-out structural system (second register/score, detector engine, prose validator, live-mode, document-seed).
- A new mode.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-foundations/references/type/typography_system.md` | Edit | font-loading, clamp bound, OpenType, all-caps tracking, light-on-dark |
| `sk-design/design-foundations/references/color/palette_theming.md` | Edit | physical-scene grounding; dangerous color combos + colorblindness |
| `sk-design/design-foundations/references/layout/layout_responsive.md` | Edit | auto-fit minmax grid recipe |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The foundations items land | each backlog item present at its target file, additive |
| REQ-002 | No duplication | already-present content not re-added; diff shows only net-new |
| REQ-003 | Fresh-Opus verified | an independent Opus agent confirmed each item landed (PASS) |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Scope lock holds | only the named files changed; evergreen; no new mode |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The foundations backlog items applied additively and verified by a fresh Opus agent (PASS).
- **SC-002**: Only the named files changed; the packet passes `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Codex re-adds present content | Duplication | read-first skip-if-present; verify diff |
| Risk | Scope drift | Off-target edits | scope-lock; per-diff review; fresh-Opus verify |
| Dependency | 028 backlog | No spec | read research.md before dispatch |
| Dependency | cli-codex gpt-5.5 high fast | No executor | validated from 023/025-027 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Guidance only; no runtime cost.

### Security
- **NFR-S01**: Preserves packet-local path-guard posture.

### Reliability
- **NFR-R01**: Anchor-scoped additive edits; existing guidance intact.

---

## 8. EDGE CASES

### Data Boundaries
- **Already present**: codex skips and reports it.
- **Anchor moved**: codex locates the equivalent section or reports it.

### Error Scenarios
- **Out-of-scope edit**: diff review + fresh-Opus review reject it; revert before re-dispatch.

### State Transitions
- **Research to build**: this phase consumes the foundations slice.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Three files, one mode slice |
| Risk | 11/25 | live edits; duplication-sensitive |
| Research | 5/20 | applies a known slice |
| Multi-Agent | 9/15 | codex dispatch + fresh-Opus verify |
| Coordination | 8/15 | sibling impeccable phases |
| **Total** | **45/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Duplication of present content | M | M | read-first; verify diff |
| R-002 | Scope drift | M | L | scope-lock + fresh-Opus verify |

---

## 11. USER STORIES

### US-001: Land the foundations craft (Priority: P0)
**As a** sk-design maintainer, **I want** the foundations backlog items applied, **so that** the mode gains the verified impeccable craft.
**Acceptance Criteria**:
1. Given the references, When I check the targets, Then each item is present and additive.

### US-002: Independent verification (Priority: P0)
**As a** maintainer, **I want** a fresh Opus agent to verify, **so that** the build is not self-graded.
**Acceptance Criteria**:
1. Given the edits, When the reviewer runs, Then each item is confirmed landed, additive, evergreen (PASS).

### US-003: No regression (Priority: P1)
**As a** maintainer, **I want** scope-lock + skip-if-present, **so that** prior adoptions are not duplicated.
**Acceptance Criteria**:
1. Given the diff, When I review, Then only net-new content was added.

---

## 12. OPEN QUESTIONS

- Which items the mode already covered is resolved per-edit; codex + the fresh-Opus reviewer report skips.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source backlog**: `../028-impeccable-design-research/research/research.md`
- **Plan**: See `plan.md`
