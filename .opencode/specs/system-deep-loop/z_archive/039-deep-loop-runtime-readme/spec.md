---
title: "Feature Specification: deep-loop-runtime README"
description: "Rewrite the deep-loop-runtime skill README in the narrative voice, leading with the shared-runtime role, the three component families and the five consumers."
trigger_phrases:
  - "deep-loop-runtime readme"
  - "deep-loop-runtime narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/039-deep-loop-runtime-readme"
    last_updated_at: "2026-06-07T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped deep-loop-runtime README via deep-context + dual-draft"
    next_safe_action: "Begin phase 010 (deep-research README)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Stale test count (27 vs 36) and entry-point count (4 vs 8) corrected; 8-script count verified accurate"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep-loop-runtime README

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
| **Phase** | 9 of 24 |
| **Predecessor** | 008-deep-improvement-readme |
| **Successor** | 010-deep-research-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9**, the deep-loop-runtime shared engine in Batch B.

**Scope Boundary**: Only `.opencode/skills/deep-loop-runtime/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `deep-loop-runtime/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop-runtime README is a tabular reference card with no problem-first entry point, and its Key Features table carries stale counts (27 vitest files when the suite has more, and four script entry points when there are eight). It does not lead with the skill's role as the shared foundation the five deep loops ride.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the shared-runtime role, the three component families and the five consumers, with stale counts corrected or dropped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `deep-loop-runtime/README.md` to the narrative skeleton; present it as a consumed runtime, not a user loop.

### Out of Scope

- Any change to SKILL.md or the runtime's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/README.md` | Modify | Narrative-voice rewrite of the shared-runtime README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Presented as a consumed runtime | QUICK START shows a consumer call, not a user slash command |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The component families, the eight scripts and the five consumers match SKILL.md and the tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model draft carries the stale test or entry-point count | Inaccurate README | Host verified 8 scripts and 4 references against the tree; corrected the counts |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Components, scripts and consumers verified during the gather.
<!-- /ANCHOR:questions -->
