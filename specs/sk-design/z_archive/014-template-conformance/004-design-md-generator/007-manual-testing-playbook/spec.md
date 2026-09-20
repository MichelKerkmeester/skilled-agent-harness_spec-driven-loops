---
title: "Spec: design-md-generator manual-testing-playbook/ conformance"
description: "Audit the 18-file manual-testing-playbook/ tree (root + 12 subdirectories) against manual-testing-playbook-template.md and remediate any confirmed gap."
trigger_phrases:
  - "design-md-generator manual-testing-playbook conformance"
  - "md-generator playbook template audit"
  - "anti-bot escalation phantom hex detection"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/007-manual-testing-playbook"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author manual-testing-playbook audit spec"
    next_safe_action: "Enumerate and read all 18 playbook files against the template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-md-generator manual-testing-playbook/ conformance

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
| **Spec Folder** | 007-manual-testing-playbook |
| **Parent** | 004-design-md-generator |
| **Predecessor** | `006-feature-catalog` (map position only; no hard dependency, independently executable) |
| **Successor** | `008-changelog` (map position only; no hard dependency, independently executable) |
| **Phase** | 7 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`manual-testing-playbook/` is the largest folder in `design-md-generator`: a root `manual-testing-playbook.md` plus 12 subdirectories (`accessibility/`, `authoring-boundary/`, `cluster/`, `dark-mode/`, `detectors/`, `escalation/`, `extract/`, `fidelity/`, `guided-run/`, `interaction/`, `procedure-card-contract/` (3 files), `report/`, `setup/`, `source-of-truth/`, `study/`, `validate/`) holding 17 further files, 18 total. None of it was in the 014 program's seed sample.

### Purpose
Enumerate and read all 18 files against `manual-testing-playbook-template.md` and fix any confirmed gap. A clean read is a legitimate outcome.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `manual-testing-playbook.md` (root)
- `accessibility/accessibility-section.md`
- `authoring-boundary/authoring-boundary.md`
- `cluster/oklch-clustering.md`
- `dark-mode/dark-mode-gate.md`
- `detectors/framework-icon-motion-detection.md`
- `escalation/anti-bot-escalation.md`
- `extract/live-extraction.md`
- `fidelity/verbatim-value-fidelity.md`
- `guided-run/guided-run-smoke-lane.md`
- `interaction/interaction-state-matrix.md`
- `procedure-card-contract/{backend-preserving-direct-fallback,card-selection-proof,no-card-fallback}.md`
- `report/report-generation.md`
- `setup/tool-readiness.md`
- `source-of-truth/source-of-truth-card.md`
- `study/editorial-exemplar-study.md`
- `validate/phantom-hex-detection.md`
- All 18 against `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md`.

### Out of Scope
- `design-md-generator`'s other folders (siblings 001-006, 008).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-md-generator/manual-testing-playbook/**` | Audit (Modify if confirmed) | Diff each of the 18 files against `manual-testing-playbook-template.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 18 files enumerated and exhaustively read against the template | Every file diffed section-by-section with cited evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Confirmed gaps fixed | Any real gap found under REQ-001 fixed in place |
| REQ-003 | `procedure-card-contract/`'s 3-file subdirectory fully enumerated, not just its first file | All of `backend-preserving-direct-fallback.md`, `card-selection-proof.md`, `no-card-fallback.md` checked individually |
| REQ-004 | Frontmatter enum values checked across all 18 files, not just field presence | `importance_tier`/`contextType` values verified against the template's allowed vocabulary |
| REQ-005 | No unrelated content rewrite | Diff shows only structural/template fixes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 18 `manual-testing-playbook/**` files pass a template diff, or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing a file across 12 subdirectories, one of which (`procedure-card-contract/`) holds 3 files | Incomplete audit claimed complete | Enumerate all 18 files explicitly before starting, with `procedure-card-contract/` called out |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Full read of all 18 files across 12 subdirectories, not a sample.
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
