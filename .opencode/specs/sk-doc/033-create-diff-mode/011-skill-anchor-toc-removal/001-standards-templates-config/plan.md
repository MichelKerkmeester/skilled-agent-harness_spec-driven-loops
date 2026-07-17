---
title: "Implementation Plan: Standards, Templates & Config"
description: "Plan for flipping sk-doc TOC config/standards and stripping TOC/anchors from doc templates as the regression-prevention foundation for phases 002/003."
trigger_phrases:
  - "standards templates config plan"
  - "tocRequired flip plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/011-skill-anchor-toc-removal/001-standards-templates-config"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Updated standards/templates/config to forbid TOC"
    next_safe_action: "Proceed to phase 002"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Standards, Templates & Config

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON config |
| **Validator** | `sk-doc/scripts/validate_document.py` (Python) |
| **Config** | `sk-doc/assets/template_rules.json` |
| **Testing** | `validate_document.py` exit code on a sample README |

### Overview
Edit the source of truth before any bulk cleanup. The validator gates TOC enforcement on
`tocRequired` per doc type, so three flag flips neutralize the `missing_toc` blocker without
touching Python. Then strip TOC blocks + anchors from the five sk-doc doc templates and remove
TOC-mandate prose from creation references and the two `create/` command contracts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed which types have `tocRequired:true` (readme L54, install_guide L245, playbook L440)
- [x] Confirmed validator gates TOC checks on `tocRequired`
- [x] Located all template + standards files

### Definition of Done
- [ ] All three flags flipped to false
- [ ] Five templates stripped of TOC + anchors
- [ ] Standards + creation refs + command contracts updated
- [ ] `validate_document.py` exits 0 on a TOC-less README
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-driven validation: `validate_document.py` reads `template_rules.json[documentTypes][type]`
and only runs `validate_toc()` when `tocRequired` is true.

### Key Components
- **template_rules.json**: per-type `tocRequired` flag — the single lever for TOC enforcement.
- **core_standards.md**: human-facing TOC policy table.
- **sk-doc templates**: the scaffolds new docs are generated from.

### Data Flow
1. Author/generator emits a doc from a template.
2. `validate_document.py` classifies type, loads rules, runs `validate_toc()` only if `tocRequired`.
3. With `tocRequired:false`, TOC-less docs pass; templates without TOC produce TOC-less docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Config + standards
- [ ] Flip `tocRequired:false` for readme/install_guide/playbook in template_rules.json
- [ ] Update core_standards.md TOC policy table + summary to Never

### Phase 2: Templates
- [ ] Strip TOC + anchors from readme_template, readme_code_template, install_guide_template, feature_catalog_template, manual_testing_playbook_template

### Phase 3: Prose + contracts
- [ ] Update readme_creation / feature_catalog_creation / manual_testing_playbook_creation / workflows
- [ ] Remove TOC requirement from create/feature-catalog.md + create/testing-playbook.md
- [ ] Verify with `validate_document.py` on a sample README
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Config | TOC no longer required | `validate_document.py <README>` exit 0 |
| Grep | Templates clean | `rg "table of contents\|<!-- ANCHOR"` on the 5 templates |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| validate_document.py | Internal | Green | Cannot verify config flip |
| python3 | External | Green | Cannot run validator |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator behaves unexpectedly or templates break generation.
- **Procedure**: `git checkout` the touched config/template/standards files; re-run validator to confirm baseline.
<!-- /ANCHOR:rollback -->
