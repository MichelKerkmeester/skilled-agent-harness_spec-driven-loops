---
title: "Implementation Summary: Standards, Templates & Config"
description: "Flipped sk-doc TOC config/standards, stripped TOC/anchors from doc templates, and removed TOC mandates from creation references and create-command contracts."
trigger_phrases:
  - "standards templates config summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/011-skill-anchor-toc-removal/001-standards-templates-config"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Flipped TOC config/standards and templates"
    next_safe_action: "Proceed to phase 002 (bulk TOC removal)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/template_rules.json"
      - ".opencode/skills/sk-doc/references/global/core_standards.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Standards, Templates & Config

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 117-skill-anchor-toc-removal/001-standards-templates-config |
| **Completed** | 2026-05-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Changed the source of truth so TOC/anchor removal is durable. `validate_document.py` gates TOC
enforcement on `tocRequired`, so flipping three flags neutralized the `missing_toc` blocker with no
Python change. Doc templates were stripped of TOC blocks; creation references and the `/create`
command contracts no longer mandate a TOC.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/assets/template_rules.json` | Modified | `tocRequired:false` for readme/install_guide/playbook |
| `sk-doc/references/global/core_standards.md` | Modified | TOC policy → Never for all types |
| `sk-doc/assets/readme/readme_template.md` | Modified | Removed TOC block + guidance row |
| `sk-doc/assets/readme/readme_code_template.md` | Modified | Removed TOC block |
| `sk-doc/assets/readme/install_guide_template.md` | Modified | Removed TOC block + checklist row |
| `sk-doc/assets/feature_catalog/feature_catalog_template.md` | Modified | Removed TOC block + prose/checklist mandates |
| `sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | Modified | Removed TOC block + checklist row |
| `sk-doc/assets/skill/skill_readme_template.md` | Modified | Removed TOC block + guidance row |
| `sk-doc/references/{readme,feature_catalog,manual_testing_playbook,benchmark}_creation.md` | Modified | Removed TOC mandates/examples |
| `sk-doc/references/global/workflows.md` | Modified | Dropped TOC/anchor validation step |
| `sk-doc/scripts/tests/test_validator.py` | Modified | Updated 2 cases for no-TOC policy |
| `.opencode/commands/create/**` (8 files) | Modified | Removed TOC generation/validation instructions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Edited config, standards, templates, and creation references directly; delegated the two folder_readme generation YAMLs to a verified sub-agent; confirmed the validator test suite stays green (11/11).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Config flip, not Python edit | `validate_toc()` early-returns when `tocRequired` false — flags suffice |
| Carve out `system-spec-kit/templates/**` | Their anchors are a consumed spec/memory generation standard |
| Preserve sk-doc/scripts/tests fixtures | They are validator test data; tests updated instead |
| Delegate folder_readme YAML edits to a sub-agent | ~32 parallel refs across two files; diff verified after |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Validator behavior | Pass | TOC-less README exits 0; TOC no longer required |
| Test suite | Pass | sk-doc validator suite 11/11 after the 2-case update |
| Grep | Pass | No TOC mandate remains in sk-doc templates/standards/create commands |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `system-spec-kit` SKILL.md retains a ToC policy exception for `research/research.md` (spec-artifact domain, intentionally out of scope).
2. Webflow web-component references named "Table of Contents" in `sk-code` are unrelated (a web UI feature) and untouched.
<!-- /ANCHOR:limitations -->
