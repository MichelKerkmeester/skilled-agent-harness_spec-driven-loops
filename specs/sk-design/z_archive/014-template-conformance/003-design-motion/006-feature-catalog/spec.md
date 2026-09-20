---
title: "Spec: design-motion feature-catalog/ conformance"
description: "Audit feature-catalog/ (root + build-cards, procedure-cards, restraint-gate-and-choreography subdirs) against feature-catalog-template.md and remediate any confirmed gap."
trigger_phrases:
  - "design-motion feature-catalog conformance"
  - "motion feature catalog template audit"
  - "motion restraint gate card structure"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/006-feature-catalog"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author feature-catalog audit spec"
    next_safe_action: "Read all feature-catalog/ files against feature-catalog-template.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/feature-catalog/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-motion feature-catalog/ conformance

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
| **Spec Folder** | 006-feature-catalog |
| **Parent** | 003-design-motion |
| **Predecessor** | `005-corpus` (map position only; no hard dependency, independently executable) |
| **Successor** | `007-manual-testing-playbook` (map position only; no hard dependency, independently executable) |
| **Phase** | 6 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`feature-catalog/` carries a root `feature-catalog.md` plus three subdirectories — `build-cards/` (`motion-fill-in-cards.md`), `procedure-cards/` (`motion-procedure-card-inventory.md`), and `restraint-gate-and-choreography/` (`choreography-and-reduced-motion.md`, `motion-restraint-gate.md`) — none of which was in the 014 program's seed sample.

### Purpose
Read the root file and all four subdirectory files against `feature-catalog-template.md` and fix any confirmed gap. A clean read is a legitimate outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/design-motion/feature-catalog/feature-catalog.md`
- `.opencode/skills/sk-design/design-motion/feature-catalog/build-cards/motion-fill-in-cards.md`
- `.opencode/skills/sk-design/design-motion/feature-catalog/procedure-cards/motion-procedure-card-inventory.md`
- `.opencode/skills/sk-design/design-motion/feature-catalog/restraint-gate-and-choreography/{choreography-and-reduced-motion,motion-restraint-gate}.md`
- All against `.opencode/skills/sk-doc/create-feature-catalog/assets/feature-catalog-template.md`.

### Out of Scope
- `design-motion`'s other folders (siblings 001-005, 007-008).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-motion/feature-catalog/**` | Audit (Modify if confirmed) | Diff each file against `feature-catalog-template.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 files exhaustively read against the template | Root file + 4 subdirectory files diffed section-by-section with cited evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Confirmed gaps fixed | Any real gap found under REQ-001 fixed in place |
| REQ-003 | All 5 files enumerated before diffing, none missed | Root + 3 subdirectory files each explicitly listed and checked off |
| REQ-004 | Frontmatter checked against the feature-catalog template's allowed vocabulary | `importance_tier`/`contextType` enum values verified, not just field presence |
| REQ-005 | No unrelated content rewrite | Diff shows only structural/template fixes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 `feature-catalog/**` files pass a `feature-catalog-template.md` diff, or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Subdirectory nesting (`build-cards/`, `procedure-cards/`, `restraint-gate-and-choreography/`) obscures which files are in scope | Missed file | Enumerate all 5 files explicitly before starting the diff |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Full read of all 5 files across root + 3 subdirectories, not a sample.
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
