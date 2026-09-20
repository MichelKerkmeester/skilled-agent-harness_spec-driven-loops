---
title: "Spec: design-motion procedures/ conformance"
description: "Audit the single procedures/ file against skill-procedure-template.md and remediate any confirmed gap."
trigger_phrases:
  - "design-motion procedures conformance"
  - "interaction-states-pass template audit"
  - "motion procedure template check"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/004-procedures"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author procedures audit spec"
    next_safe_action: "Read interaction-states-pass.md against skill-procedure-template.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-motion procedures/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned — not yet audited |
| **Spec Folder** | 004-procedures |
| **Parent** | 003-design-motion |
| **Predecessor** | `003-assets` (map position only; no hard dependency, independently executable) |
| **Successor** | `005-corpus` (map position only; no hard dependency, independently executable) |
| **Phase** | 4 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`procedures/` holds exactly one file, `interaction-states-pass.md`, which was not part of the 014 program's seed sample. Its conformance to `skill-procedure-template.md` is unknown.

### Purpose
Read `interaction-states-pass.md` against `skill-procedure-template.md` section-by-section and fix any confirmed gap. A clean read is a legitimate outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md` against `assets/skill/skill-procedure-template.md`.

### Out of Scope
- `design-motion`'s other folders (siblings 001-003, 005-008).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md` | Audit (Modify if confirmed) | Diff against `skill-procedure-template.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | File exhaustively read against the template | Diffed section-by-section with cited evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Confirmed gap fixed | Any real gap found under REQ-001 fixed in place |
| REQ-003 | Full section-by-section diff performed despite the single-file scope | Every template section checked, not a spot-check |
| REQ-004 | Frontmatter checked against the procedure template's allowed vocabulary | `importance_tier`/`contextType` enum values verified, not just field presence |
| REQ-005 | No unrelated content rewrite | Diff shows only structural/template fixes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `interaction-states-pass.md` passes a `skill-procedure-template.md` diff, or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Single-file folder tempts a rubber-stamp pass | A real gap gets missed | Apply the same full section-by-section diff as multi-file folders |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Full read, not a sample, despite the folder's small size.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- None yet — the audit itself will surface any question.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
