---
title: "Feature Specification: adopt the designer-skills-main interface + motion findings into sk-design"
description: "Level-3 build phase: implement the interface and motion slices of the 024 designer-skills-main adoption backlog into live sk-design — compact UX quality floor, copy/state voice + formulas, media/earned-deviation, the async state-machine card, motion-token verification, and gesture-accessibility — via cli-codex gpt-5.5 high fast, scope-locked, skipping phase-023 and already-covered content."
trigger_phrases:
  - "designer-skills interface motion adoption build"
  - "sk-design state-machine card build"
  - "ux quality floor adoption"
  - "motion-token verification build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/026-interface-motion-adoption"
    last_updated_at: "2026-06-27T11:49:46Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied and verified the interface + motion adoption across five files"
    next_safe_action: "Commit phases 025-027 once 027 is finalized"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-026-interface-motion-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "State-machine card landed in motion_pattern_cards.md as net-new; already-covered motion rules (icon-swap, press-scale, duration table) were skipped"
      - "Copy formulas added only where not already present in copy_and_mock_data.md / design_principles.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: adopt the designer-skills-main interface + motion findings into sk-design

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

This phase applies the **interface** and **motion** slices of the `024-designer-skills-research` adoption backlog into live sk-design. Interface gains a compact UX quality floor (forms, search, navigation, feedback/error proximity, first-run/empty states), copy/state voice plus concrete copy formulas, a media/illustration contract, and an earned-deviation restraint. Motion gains the genuinely net-new async state-machine card for branching UI, plus motion-token verification and a gesture-accessibility rule.

**Key Decisions**: Implement via `cli-codex gpt-5.5 high fast`, scope-locked to five files (ADR-001); skip everything phase 023 already added and every already-covered motion rule — the state-machine card is the net-new structure (ADR-002).

**Critical Dependencies**: The 024 backlog and the current (post-023) interface + motion packets.
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
| **Predecessor** | ../025-audit-adoption/spec.md |
| **Successor** | ../027-foundations-adoption/spec.md |
| **Handoff Criteria** | The interface + motion backlog items are applied additively at their named anchors in the five files, phase-023 and already-covered content is skipped, the state-machine card is net-new, every diff is scope-locked, and the packet passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 024 backlog's interface and motion items had not been applied. Interface lacked a compact product-flow quality floor, concrete copy formulas, a media/illustration contract, and an earned-deviation restraint; motion lacked the async state-machine structure and a motion-token verification check. Phase 023 already edited sibling files, so duplication had to be avoided.

### Purpose
Apply the interface + motion slices into the live packets via `cli-codex gpt-5.5 high fast`, scope-locked, reading current state first and skipping anything already present (icon-swap, press-scale, the duration table, split/stagger).

> **Build note:** The state-machine card is net-new; everything already covered is skipped. Each edit is additive and verified by diff.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Compact UX quality floor → `design-interface/references/design-process/ux_quality_reference.md` (rank 2).
- Copy/state voice + error/empty/CTA formulas → `design-interface/references/design-process/copy_and_mock_data.md` (rank 6 + minor).
- Media/illustration contract + earned-deviation restraint → `design-interface/references/design-process/design_principles.md` (rank 6/10).
- Async state-machine card → `design-motion/assets/motion_pattern_cards.md` (rank 4).
- Motion-token verification + gesture-accessibility rule → `design-motion/references/motion_strategy.md` (rank 8 + minor).

### Out of Scope
- The audit and foundations slices (phases 025, 027).
- Re-adding phase-023 content (icon-swap, press-scale, split/stagger, fixed-exit, optical alignment) or already-covered motion rules.
- A new mode; the hub stays logic-free.

### Inputs (read-only)
- `../024-designer-skills-research/research/research.md` (the backlog).
- The current post-023 interface + motion packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-interface/references/design-process/ux_quality_reference.md` | Edit | Compact UX quality floor |
| `sk-design/design-interface/references/design-process/copy_and_mock_data.md` | Edit | State copy voice + error/empty/CTA formulas |
| `sk-design/design-interface/references/design-process/design_principles.md` | Edit | Media/illustration contract; earned-deviation restraint |
| `sk-design/design-motion/assets/motion_pattern_cards.md` | Edit | Async state-machine card |
| `sk-design/design-motion/references/motion_strategy.md` | Edit | Motion-token verification; gesture-accessibility |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The state-machine card lands | `motion_pattern_cards.md` carries an async state-machine card (states, events, transitions, guards, impossible states, visible UI per state) |
| REQ-002 | The UX quality floor lands | `ux_quality_reference.md` carries the compact forms/search/nav/feedback/empty floor |
| REQ-003 | No duplication of phase-023 / already-covered content | icon-swap, press-scale, duration table, split/stagger, optical alignment are not re-added |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Copy + media + motion-token items land | copy formulas, media/illustration contract, earned-deviation restraint, motion-token verification, gesture-a11y are present at the named files |
| REQ-005 | Scope lock holds | only the five named files changed; each diff is additive |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The interface + motion backlog items are applied additively in the five files, the state-machine card is net-new, and nothing phase-023/already-covered was duplicated.
- **SC-002**: Only the five files changed, every diff is scope-locked, and the packet passes `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Codex re-adds phase-023 motion content | Duplication | Prompt names the known prior additions to skip; verify diff |
| Risk | State-machine card duplicates micro_interactions | Redundancy | Card lands in motion_pattern_cards.md; icon-swap stays in micro_interactions |
| Risk | Edits drift outside the five files | Scope drift | Scope-lock; per-diff review |
| Dependency | The 024 backlog | No build spec | Read `../024-.../research/research.md` |
| Dependency | cli-codex gpt-5.5 high fast | Edits cannot apply | Validated executor from the 023/025 builds |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Guidance only; no runtime cost added to the interface or motion modes.

### Security
- **NFR-S01**: Additions preserve the packet-local path-guard posture.

### Reliability
- **NFR-R01**: Edits are anchor-scoped and additive; existing interface/motion guidance remains intact.

---

## 8. EDGE CASES

### Data Boundaries
- **An item already present**: codex skips it and reports the skip.
- **A target anchor moved**: codex locates the equivalent section or reports a missing anchor.

### Error Scenarios
- **A dispatch edits outside scope**: the diff review rejects it; the file is reverted before re-dispatch.

### State Transitions
- **Research to build**: this phase consumes the interface + motion slices; foundations follows in 027.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Five files across two modes |
| Risk | 12/25 | Live edits; duplication-sensitive vs phase 023 |
| Research | 5/20 | Applies a known slice |
| Multi-Agent | 7/15 | One cli-codex dispatch + verification |
| Coordination | 9/15 | Must not duplicate 023; sibling to 025/027 |
| **Total** | **47/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Duplication of phase-023 motion content | M | M | Name known prior additions to skip; verify diff |
| R-002 | State-machine card redundant with micro_interactions | M | L | Card in motion_pattern_cards.md only |
| R-003 | Scope drift beyond five files | M | L | Scope-lock + per-diff verification |

---

## 11. USER STORIES

### US-001: Structure branching UI behavior (Priority: P0)

**As a** builder, **I want** an async state-machine card, **so that** I can model states, events, guards, and impossible states for branching UI.

**Acceptance Criteria**:
1. Given `motion_pattern_cards.md`, When I look for the state-machine card, Then it is present and net-new.

### US-002: A product-flow quality floor (Priority: P0)

**As a** builder, **I want** a compact UX quality floor, **so that** forms, search, navigation, feedback, and empty states meet a pass/fail bar.

**Acceptance Criteria**:
1. Given `ux_quality_reference.md`, When I check a flow, Then the floor exists as one compact section.

### US-003: Concrete copy + motion tokens (Priority: P1)

**As a** builder, **I want** copy formulas and motion-token verification, **so that** state text and product-scale motion are consistent.

**Acceptance Criteria**:
1. Given the interface + motion files, When I write copy or motion, Then the formulas and token-verification checks exist.

---

## 12. OPEN QUESTIONS

- Which copy/motion items the modes already covered is resolved per-edit by reading current state; codex reports skips.
- Whether the gesture-accessibility note belongs additionally in audit is deferred (the audit a11y modality coverage is in phase 025).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Source backlog**: `../024-designer-skills-research/research/research.md`
- **Plan**: See `plan.md`
- **Sibling build phases**: `../025-audit-adoption/`, `../027-foundations-adoption/`
- **Target**: `.opencode/skills/sk-design/design-interface/`, `.opencode/skills/sk-design/design-motion/`

<!--
LEVEL 3 ADDENDUM
- decision-record.md carries the binding build decisions
- research/research.md in 024 is the primary evidence
-->
