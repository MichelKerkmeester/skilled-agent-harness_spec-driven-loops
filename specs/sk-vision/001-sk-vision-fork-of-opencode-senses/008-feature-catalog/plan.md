---
title: "Implementation Plan: sk-vision 008 feature catalog"
description: "Author the feature-catalog package: stabilize taxonomy, then root, then 16 per-feature files, then validate."
trigger_phrases:
  - "sk-vision feature catalog"
  - "sk-vision capability inventory"
  - "sk-vision catalog package"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/008-feature-catalog"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 008 plan skeleton."
    next_safe_action: "Implement per spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/feature-catalog/feature-catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-008-feature-catalog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision 008 feature catalog

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown catalog package |
| **Framework** | sk-create-feature-catalog templates + validators |
| **Storage** | None |
| **Testing** | validate_catalog_package.cjs, validate_document.py, extract_structure.py |

### Overview
Stabilize the category taxonomy and feature slugs first (already fixed in spec.md), then author the root catalog, then the 16 per-feature files, then run the full validation stack. Anchor every claim to shipped source files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — evidence: REQ-001..REQ-006 + REQ-P1..REQ-P3 satisfied; see `implementation-summary.md`
- [ ] Docs updated (spec/plan/tasks) — evidence: closeout refresh
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-first catalog with exact root↔leaf parity.

### Key Components
- **Root**: inventory + navigation, H3 per feature, links to leaves.
- **Leaves**: 16 files in 5 categories, each with OVERVIEW / HOW IT WORKS / SOURCE FILES / SOURCE METADATA.

### Data Flow
Root H3 → leaf file → source anchors → validation anchors.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| feature-catalog/ | absent | create 17 docs | validator exit 0 |
| leaf manifests | references only | unchanged | grep config |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read shipped truth
- [ ] Read template assets (root + snippet)
- [ ] Read photon.ts / runtime.py / pi factory / plugin files for anchor accuracy

### Phase 2: Author
- [ ] Root catalog from template
- [ ] 16 per-feature files (category folders first)

### Phase 3: Validate
- [ ] check_no_hyphenated_catalog_content.py
- [ ] validate_document.py root + 16 leaves
- [ ] validate_catalog_package.cjs (report-only then strict)
- [ ] anchor path existence sweep
- [ ] validate.sh --strict on this child
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | root + leaves | validate_document.py |
| Package | root/leaf bijection | validate_catalog_package.cjs |
| Manual | anchor truth | test -f each anchor |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 006 + 007 shipped | Internal | Shipped | No truth to catalog |
| sk-doc templates/scripts | Internal | Available | No scaffold/validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator failures or parity breaks.
- **Procedure**: Delete `feature-catalog/` entirely (additive package); re-author from templates. Do not touch `context/` or leaf manifests.
<!-- /ANCHOR:rollback -->
