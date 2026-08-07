---
title: "Feature Specification: deep-context README"
description: "Rewrite the deep-context skill README in the narrative voice, leading with the by-model sweep and reuse-first Context Report, dropping the stale version and reference count."
trigger_phrases:
  - "deep-context readme"
  - "deep-context narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-skill-readme-standardization/002-deep-context-readme"
    last_updated_at: "2026-07-08T05:56:44.774Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped deep-context README via deep-context + dual-draft"
    next_safe_action: "Begin phase 008 (deep-improvement README)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Stale version (1.0.0 vs 1.2.0) and reference count (2 vs 10) dropped by the new template"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep-context README

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
| **Phase** | 7 of 24 |
| **Predecessor** | 001-deep-ai-council-readme |
| **Successor** | 003-deep-improvement-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7**, the deep-context skill in Batch B.

**Scope Boundary**: Only `.opencode/skills/deep-context/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `deep-context/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-context README is a tabular reference card with no problem-first entry point, and its Key Statistics carry stale facts: version 1.0.0 (the skill is 1.2.0) and 2 references (the tree has 10 across four subfolders), the latter contradicting the README's own structure section.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the by-model sweep and the reuse-first Context Report, and dropping the stale version and count.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `deep-context/README.md` to the narrative skeleton; name the four reference subfolders without a count.

### Out of Scope

- Any change to SKILL.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-context/README.md` | Modify | Narrative-voice rewrite of the deep-context README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Stale facts dropped | No version line, no contradictory reference count |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean | No em dashes, semicolons, Oxford-comma lists or banned words |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The five convergence signals and the four reference subfolders match SKILL.md and the tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft carries the stale version or count | Inaccurate README | Authoring prompt forbade version and count; host verified the tree |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file:line evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Signals, subfolders and stale facts resolved during the gather.
<!-- /ANCHOR:questions -->
