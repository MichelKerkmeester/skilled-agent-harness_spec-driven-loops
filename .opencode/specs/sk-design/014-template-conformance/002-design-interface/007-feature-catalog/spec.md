---
title: "Feature Specification: design-interface feature-catalog conformance"
description: "Audit the 5 category dirs and 11 feature files under design-interface/feature-catalog/ against feature-catalog-template.md; sampling shows strong conformance with one confirmed dead cross-reference."
trigger_phrases:
  - "design-interface feature-catalog conformance"
  - "feature catalog template audit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/007-feature-catalog"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Grep-confirmed a 10-file wrong-filename cross-reference"
    next_safe_action: "Fix the confirmed typo, then audit all files against the template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/feature-catalog/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: design-interface feature-catalog conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance/002-design-interface` |
| **Predecessor** | `006-scripts` |
| **Successor** | `008-manual-testing-playbook` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`feature-catalog/` has 5 kebab-case category directories with no numeric prefix (`adaptation-and-data/`, `aesthetic-direction-process/`, `delivery-gates/`, `procedure-cards/`, `token-system/`) holding 11 feature files, plus the root `feature-catalog.md` (`last_updated: "2026-07-06"` present). Reading `token-system/oklch-color-and-token-system.md` in full found it fully structurally conformant with `feature-catalog-template.md` §5's per-feature scaffold (`1. OVERVIEW`, `2. HOW IT WORKS`, `3. SOURCE FILES`, `4. SOURCE METADATA`) — but its own `## 4. SOURCE METADATA` section cites `Canonical catalog source: feature_catalog.md` (underscore), when the actual root file on disk is `feature-catalog.md` (hyphen). A follow-up `rg -rn "feature_catalog.md"` across the folder confirmed this is not a one-off: **10 of the 11 feature files** carry the identical wrong-filename line (`delivery-gates/interface-writing-rules.md:54`, `aesthetic-direction-process/register-and-dials-intake.md:53`, `procedure-cards/interface-procedure-card-inventory.md:53`, `delivery-gates/mechanical-delivery-gates.md:54`, `adaptation-and-data/data-visualization-discipline.md:58`, `aesthetic-direction-process/two-pass-grounding-and-critique.md:53`, `procedure-cards/foundations-procedure-card-inventory.md:54`, `token-system/typography-and-spacing-scale.md:58`, `token-system/oklch-color-and-token-system.md:59`, `adaptation-and-data/context-adaptation-matrix.md:58`) — evidence of a copy-paste template stamp that was never corrected to match the real root filename.

### Purpose
Fix the confirmed `feature_catalog.md` → `feature-catalog.md` typo across all 10 affected files (plus the 11th if it turns out to share it), then read every feature file and the root `feature-catalog.md` against §3 (category/file naming) and §5 (per-feature scaffold) for any other deviation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `feature-catalog/feature-catalog.md` (root)
- 11 feature files across `adaptation-and-data/`, `aesthetic-direction-process/`, `delivery-gates/`, `procedure-cards/`, `token-system/`

### Out of Scope
- `references/`, `assets/`, `procedures/`, `corpus/`, `scripts/`, `manual-testing-playbook/`, `changelog/` — sibling children.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 10 feature files (listed above) | Modify | Fix confirmed `Canonical catalog source: feature_catalog.md` → `feature-catalog.md` (grep-verified) |
| 11th feature file (not yet identified in this pass) | Audit | Confirm whether it shares the typo or was already correct |
| `feature-catalog/feature-catalog.md` (root) | Audit | Not yet re-read against §4 root-scaffold requirements in this pass |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Grep all feature files for `feature_catalog.md` (underscore) and fix every occurrence | Zero matches remain after fix |
| REQ-002 | All 11 feature files + root read against `feature-catalog-template.md` §3, §5 | Per-file verdict recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Root `feature-catalog.md` confirmed to carry `last_updated: YYYY-MM-DD` and match §4's root scaffold | Confirmed or fixed |
| REQ-004 | Confirm all 5 category directories and 11 feature files remain kebab-case with no numeric prefix after any edit | Fresh directory listing matches the naming rule |
| REQ-005 | Cross-references between feature files (`Related references` sections) still resolve after the typo fix | `rg` spot-check across all 11 feature files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No feature file references the root catalog by the wrong filename.
- **SC-002**: Every category dir and feature file is kebab-case with no numeric prefix (already confirmed at directory-listing level; re-confirm at audit time).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Other feature files may repeat the same underscore typo since they likely came from the same authoring pass | Multiple dead references | Grep-wide fix, not a single-file patch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- None yet — the remaining 10-file audit may surface more.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Parent Spec**: `../spec.md`
- **Governing template**: `.opencode/skills/sk-doc/create-feature-catalog/assets/feature-catalog-template.md`
