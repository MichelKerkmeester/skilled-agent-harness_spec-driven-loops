---
title: "Feature Specification: deep-improvement README"
description: "Rewrite the deep-improvement skill README in the narrative voice, leading with the proposal-first evaluator, the three lanes and the five scoring dimensions."
trigger_phrases:
  - "deep-improvement readme"
  - "deep-improvement narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/042-skill-readme-standardization/003-deep-improvement-readme"
    last_updated_at: "2026-07-08T05:56:45.040Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped deep-improvement README via deep-context + dual-draft"
    next_safe_action: "Begin phase 009 (deep-loop-runtime README)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Stale feature-catalog count (4 vs 5) dropped; old name deep-agent-improvement not used; all reference paths verified"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep-improvement README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 24 |
| **Predecessor** | 002-deep-context-readme |
| **Successor** | 004-deep-loop-runtime-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8**, the deep-improvement skill in Batch B.

**Scope Boundary**: Only `.opencode/skills/deep-improvement/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `deep-improvement/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-improvement README is a tabular reference card with no problem-first entry point, and its stats carry stale facts (a feature-catalog count of 4 when the directory has 5, plus drifted playbook numbers). It does not lead with the distinctive proposal-first evaluator model and the three lanes.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the proposal-first lifecycle, the three lanes and the five scoring dimensions, with every reference path verified.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `deep-improvement/README.md` to the narrative skeleton; use only the current name and drop brittle counts.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-improvement/README.md` | Modify | Narrative-voice rewrite of the deep-improvement README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Stale facts and old name dropped | No version line, no wrong count, no "deep-agent-improvement" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean | No em dashes, semicolons, Oxford-comma lists or banned words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The three lanes, five dimensions and reference paths match SKILL.md and the tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft cites a non-existent reference path | Broken navigation | Host verified all ~20 reference and script paths against the real tree |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file:line evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Lanes, dimensions and paths verified during the gather.
<!-- /ANCHOR:questions -->
