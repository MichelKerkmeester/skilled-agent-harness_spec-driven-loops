---
title: "Feature Specification: Standards, Templates & Config (Regression Prevention)"
description: "Flip sk-doc TOC standards, strip TOC/anchors from doc templates, and set tocRequired:false so the bulk cleanup in phases 002/003 is durable and not regenerated."
trigger_phrases:
  - "sk-doc toc standards"
  - "tocRequired false"
  - "strip toc from templates"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/095-skill-anchor-toc-removal/001-standards-templates-config"
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
# Feature Specification: Standards, Templates & Config (Regression Prevention)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc standards, doc templates, and `template_rules.json` config currently mandate or allow `## TABLE OF CONTENTS` blocks and treat `ANCHOR` markers as recommended. If the bulk cleanup (phases 002/003) ran without first changing these, cleaned docs would be re-flagged by `validate_document.py` (`missing_toc` is a blocking error for readme/install_guide/playbook) and regenerated docs would reintroduce TOCs.

### Purpose
Change the source of truth FIRST so TOC/anchor removal is durable: set `tocRequired:false` for the three types that require it, strip TOC + anchors from the sk-doc doc templates, and remove the TOC mandate from creation references and the two `create/` command contracts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `sk-doc/assets/template_rules.json` — flip `tocRequired` to `false` for `readme`, `install_guide`, `playbook`.
- `sk-doc/references/global/core_standards.md` — TOC policy table + summary → Never for all types.
- Strip TOC blocks + `ANCHOR` markers from the 5 sk-doc doc templates.
- Update `readme_creation.md`, `feature_catalog_creation.md`, `manual_testing_playbook_creation.md`, `workflows.md` prose that mandates TOC/anchors.
- Remove TOC requirement from `.opencode/commands/create/feature-catalog.md` and `.opencode/commands/create/testing-playbook.md`.

### Out of Scope
- `validate_document.py` logic changes — flipping config flags is sufficient; TOC checks are gated on `tocRequired`.
- `system-spec-kit/templates/**` anchors — carved out (consumed generation standard).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/template_rules.json` | Modify | tocRequired:false ×3 |
| `.opencode/skills/sk-doc/references/global/core_standards.md` | Modify | TOC policy → Never |
| `.opencode/skills/sk-doc/assets/readme/readme_template.md` | Modify | Strip TOC + anchors |
| `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | Modify | Strip TOC |
| `.opencode/skills/sk-doc/assets/readme/install_guide_template.md` | Modify | Strip TOC |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` | Modify | Strip TOC |
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | Modify | Strip TOC |
| `.opencode/skills/sk-doc/references/readme_creation.md` | Modify | Remove TOC/anchor mandate |
| `.opencode/skills/sk-doc/references/feature_catalog_creation.md` | Modify | Remove TOC mandate |
| `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md` | Modify | Remove TOC mandate |
| `.opencode/skills/sk-doc/references/global/workflows.md` | Modify | Drop TOC/anchor validation step |
| `.opencode/commands/create/feature-catalog.md` | Modify | Remove TOC requirement |
| `.opencode/commands/create/testing-playbook.md` | Modify | Remove TOC requirement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | TOC no longer required by validator | `tocRequired:false` for readme/install_guide/playbook; `validate_document.py` exits 0 on a TOC-less README |
| REQ-002 | Doc templates ship no TOC/anchors | The 5 sk-doc templates contain no `## TABLE OF CONTENTS` and no `ANCHOR` |
| REQ-003 | Standards say "no TOC" | core_standards.md TOC policy is Never across types |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Creation refs + command contracts updated | No prose mandates a TOC in readme/feature-catalog/playbook creation refs or the two create commands |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A README with no TOC passes `validate_document.py` (exit 0).
- **SC-002**: Grep of the 5 templates shows zero TOC headings and zero anchor comments.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Validator has a non-config TOC code path | TOC still enforced | Verified: TOC checks gated on `tocRequired`; confirm via test run |
| Dependency | None | — | — |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
