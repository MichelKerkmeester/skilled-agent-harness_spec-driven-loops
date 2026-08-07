---
title: "Feature Specification: deep-ai-council README"
description: "Rewrite the deep-ai-council skill README in the narrative voice, leading with the planning-only multi-seat council, the six lenses, three critique roles and two-of-three convergence."
trigger_phrases:
  - "deep-ai-council readme"
  - "ai council skill readme"
  - "council narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-skill-readme-standardization/001-deep-ai-council-readme"
    last_updated_at: "2026-07-08T05:56:44.530Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped deep-ai-council README via deep-context + dual-draft"
    next_safe_action: "Begin phase 007 (deep-context README)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Reference paths and the nine playbook categories verified against the real tree before commit"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep-ai-council README

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
| **Phase** | 6 of 24 |
| **Predecessor** | N/A |
| **Successor** | 002-deep-context-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; reference paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6**, the first skill of Batch B (the deep loops).

**Scope Boundary**: Only `.opencode/skills/deep-ai-council/README.md`. No SKILL.md or behavior change.

**Dependencies**:
- The narrative template and golden example from phase 001.
- The deep-context gather in this folder's `context/`.

**Deliverables**:
- A rewritten `deep-ai-council/README.md` in the narrative voice.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-ai-council README is a tabular reference card with no problem-first entry point. It does not lead with the skill's distinctive value: a planning-only council where seats with distinct lenses disagree, critique and converge on a two-of-three rule with an auditable artifact trail.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the council model (six lenses, three critique roles, two-of-three convergence) and the planning-only boundary, with every reference path verified against the real tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `deep-ai-council/README.md` to the narrative skeleton.
- Lead with the council model and the planning-only boundary; cite only references that resolve.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-ai-council/README.md` | Modify | Narrative-voice rewrite of the council skill README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Reference paths resolve | Every cited `references/**` and `assets/**` path exists |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean | No em dashes, semicolons, Oxford-comma lists or banned words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The council model (lenses, critique roles, convergence) matches SKILL.md and the references.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft cites a non-existent reference path | Broken navigation | Host verified all reference and asset paths against the real tree before commit |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file:line evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Council model and paths verified during the gather.
<!-- /ANCHOR:questions -->
