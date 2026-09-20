---
title: "Spec: design-md-generator feature-catalog/ conformance"
description: "Audit feature-catalog/ (root + 6 subdirs: cluster-classify, extract, feature-extractors, interaction-capture, procedure-cards, report-preview, validate, write-design-md) against feature-catalog-template.md."
trigger_phrases:
  - "design-md-generator feature-catalog conformance"
  - "md-generator feature catalog template audit"
  - "cluster-classify extract validate cards"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/006-feature-catalog"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author feature-catalog audit spec"
    next_safe_action: "Enumerate and read all 9 feature-catalog/ files against the template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/feature-catalog/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-md-generator feature-catalog/ conformance

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
| **Parent** | 004-design-md-generator |
| **Predecessor** | `005-backend` (map position only; no hard dependency, independently executable) |
| **Successor** | `007-manual-testing-playbook` (map position only; no hard dependency, independently executable) |
| **Phase** | 6 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`feature-catalog/` carries a root `feature-catalog.md` plus 7 subdirectories — `cluster-classify/`, `extract/`, `feature-extractors/`, `interaction-capture/`, `procedure-cards/`, `report-preview/`, `validate/`, `write-design-md/` — each holding one file, 8 subdirectory files plus the root (9 total). None of it was in the 014 program's seed sample.

### Purpose
Read the root file and all 8 subdirectory files against `feature-catalog-template.md` and fix any confirmed gap. A clean read is a legitimate outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/feature-catalog.md`
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/cluster-classify/cluster-classify.md`
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/extract/extract.md`
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/feature-extractors/feature-extractors.md`
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/interaction-capture/interaction-capture.md`
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/procedure-cards/md-generator-procedure-card-inventory.md`
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/report-preview/report-preview.md`
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/validate/validate.md`
- `.opencode/skills/sk-design/design-md-generator/feature-catalog/write-design-md/write-design-md.md`
- All 9 against `.opencode/skills/sk-doc/create-feature-catalog/assets/feature-catalog-template.md`.

### Out of Scope
- `design-md-generator`'s other folders (siblings 001-005, 007-008).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-md-generator/feature-catalog/**` | Audit (Modify if confirmed) | Diff each of the 9 files against `feature-catalog-template.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 9 files enumerated and exhaustively read against the template | Every file diffed section-by-section with cited evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Confirmed gaps fixed | Any real gap found under REQ-001 fixed in place |
| REQ-003 | Each subdirectory file mapped to the real pipeline stage it documents | `cluster-classify.md`, `extract.md`, etc. each correctly describe their corresponding `backend/scripts/*.ts` stage |
| REQ-004 | Frontmatter enum values checked, not just field presence | `importance_tier`/`contextType` values verified against the template's allowed vocabulary across all 9 files |
| REQ-005 | No unrelated content rewrite | Diff shows only structural/template fixes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 `feature-catalog/**` files pass a `feature-catalog-template.md` diff, or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 7 same-shape subdirectories (one file each) invite a fast, shallow pass | Real gaps missed | Enumerate and diff all 9 files individually before claiming completion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Full read of all 9 files across root + 7 subdirectories, not a sample.
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
