---
title: "Spec: design-motion assets/ conformance"
description: "Audit the 3 assets/ files against skill-asset-template.md and remediate any confirmed gap."
trigger_phrases:
  - "design-motion assets conformance"
  - "motion assets template audit"
  - "motion fill-in cards conformance"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/003-assets"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author assets audit spec"
    next_safe_action: "Read all 3 assets files against skill-asset-template.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-motion assets/ conformance

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
| **Spec Folder** | 003-assets |
| **Parent** | 003-design-motion |
| **Predecessor** | `002-references` (map position only; no hard dependency, independently executable) |
| **Successor** | `004-procedures` (map position only; no hard dependency, independently executable) |
| **Phase** | 3 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`assets/` holds 3 files — `animate-presence-checklist.md`, `motion-pattern-cards.md`, `motion-performance-failure-card.md` — none of which was part of the 014 program's seed sample. Their conformance to `skill-asset-template.md` is unknown.

### Purpose
Read all 3 files against `skill-asset-template.md` section-by-section and fix any confirmed gap. A clean read is a legitimate outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/design-motion/assets/animate-presence-checklist.md`
- `.opencode/skills/sk-design/design-motion/assets/motion-pattern-cards.md`
- `.opencode/skills/sk-design/design-motion/assets/motion-performance-failure-card.md`
- All three against `assets/skill/skill-asset-template.md`.

### Out of Scope
- `design-motion`'s other folders (siblings 001, 002, 004-008).
- Note: `animate-presence-checklist.md` and `motion-performance-failure-card.md` also have same-named copies under `manual-testing-playbook/presence/` and `manual-testing-playbook/reduced-motion/` respectively — those playbook copies are owned by sibling `007-manual-testing-playbook`, not this child.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-motion/assets/*.md` | Audit (Modify if confirmed) | Diff each against `skill-asset-template.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 3 files exhaustively read against the template | Each file diffed section-by-section with cited evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Confirmed gaps fixed | Any real gap found under REQ-001 fixed in place |
| REQ-003 | Correct file targeted, not the playbook namesake | Edits land on `assets/*.md`, never on the same-named `manual-testing-playbook/` copies owned by sibling 007 |
| REQ-004 | Frontmatter checked against the asset template's allowed vocabulary | `importance_tier`/`contextType` enum values verified, not just field presence |
| REQ-005 | No unrelated content rewrite | Diff shows only structural/template fixes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 `assets/` files pass a `skill-asset-template.md` diff, or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Confusing the `assets/` copy with its `manual-testing-playbook/` namesake | Wrong file edited, or duplicate fix effort with sibling 007 | Edit only the `assets/` path; leave the playbook copy to 007 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Full read of all 3 files, not a sample.
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
