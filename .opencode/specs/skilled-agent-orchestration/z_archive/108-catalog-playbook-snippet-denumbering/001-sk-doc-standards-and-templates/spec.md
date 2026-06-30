---
title: "Feature Specification: sk-doc Standards & Templates De-Numbering [133/001-sk-doc-standards-and-templates/spec]"
description: "Make the no-numeric-prefix snippet-filename convention canonical in sk-doc: update the two creation-standard references, four templates, two create-command docs and their YAML assets, and the stale validator comment — keeping numbered category folders."
trigger_phrases:
  - "sk-doc snippet naming standard"
  - "feature catalog template de-numbering"
  - "playbook snippet filename convention"
  - "133 phase 001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering/001-sk-doc-standards-and-templates"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 001 complete: sk-doc de-numbered, DeepSeek PASS"
    next_safe_action: "Begin phase 002: DeepSeek authors the migration tool"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-doc Standards & Templates De-Numbering

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (contract — blocks all migration phases) |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc creation standards and templates mandate a globally-sequential numeric prefix on per-feature snippet filenames (`NNN-feature-name.md`). Until that contract is rewritten, any retroactive migration would contradict the documented convention and new catalogs/playbooks would keep reintroducing numbers.

### Purpose
Make the no-prefix snippet-filename convention canonical across every sk-doc surface that defines or scaffolds catalogs and playbooks, so the migration phases (003–005) conform to documented standard rather than diverging from it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the per-feature filename rule in both creation-standard references (catalog + playbook).
- Add an explicit ordering rule: snippet order is defined by the **root catalog/playbook listing order** (and category folders keep `NN--` for section order); filenames no longer encode order.
- De-number filename placeholders in all four templates (root + snippet for catalog + playbook): `{NN}-{feature-name}.md` / `{NNN}-{feature-name}.md` → `{feature-name}.md`; example trees and example filenames updated.
- Align the two `create:*` command docs and their four YAML assets.
- Update the stale `NNN-feature.md` wording in `validate_document.py` (comment, ~line 123) and `template_rules.json` (description, ~line 556). **Validator logic is NOT changed** — it already keys document-type detection off the `^\d{2}--` category dir, so de-numbering is verified-safe.

### Out of Scope
- Renaming any actual snippet file (that is phases 003–005).
- Category-folder numbering (kept).
- Feature ID conventions inside content (`M-NNN`, `EX-NNN`).
- Any validator behavior change beyond comment/description wording.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/references/feature_catalog_creation.md` | Modify | §3 tree + invariants + naming rule; §4 numbering line; §9 wording |
| `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md` | Modify | §3 tree + invariants + numeric-slug line |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` | Modify | §1 tree, §3 table/rules (L69,L261), §4/§5 scaffold paths, §5 Related refs |
| `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md` | Modify | §3 scaffold path (L51), §4 metadata path (L117), Related refs (L120-121) |
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | Modify | §1 tree, §3 path (L100), §5/§6 Feature File links, §6 scaffold path |
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_snippet_template.md` | Modify | §2 scaffold path (L37), §5 metadata path (L132) |
| `.opencode/commands/create/feature-catalog.md` | Modify | De-number snippet-filename guidance |
| `.opencode/commands/create/testing-playbook.md` | Modify | De-number; known numbered-snippet referrer |
| `.opencode/commands/create/assets/create_feature_catalog_{auto,confirm}.yaml` | Modify | Scaffold-instruction alignment |
| `.opencode/commands/create/assets/create_testing_playbook_{auto,confirm}.yaml` | Modify | Scaffold-instruction alignment |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Modify | Comment ~L123 only (no logic change) |
| `.opencode/skills/sk-doc/assets/template_rules.json` | Modify | Description ~L556 only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both creation references state snippet filenames carry NO numeric prefix | `rg 'NNN-feature\|globally sequential\|3-digit' references/` returns zero prescriptive hits |
| REQ-002 | Category folders explicitly keep `NN--category-name` numbering | Both references + templates still show `NN--` category dirs |
| REQ-003 | All four templates show de-numbered example/scaffold filenames | `rg '[0-9]{3}-feature-name\|{NN}-{feature\|{NNN}-{feature' assets/` returns zero hits |
| REQ-004 | New ordering rule documented (root doc defines order) | Each reference has an explicit "order is defined by the root listing, not the filename" statement |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | create-command docs + YAML assets aligned | `rg '[0-9]{3}-' commands/create/` shows no prescriptive numbered-filename guidance |
| REQ-006 | Validator + template_rules wording de-stale'd; logic unchanged | `validate_document.py` test suite still passes; comment no longer implies `NNN-` files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader following the updated standard produces `NN--category/feature-name.md` (no number) with a numbered category folder.
- **SC-002**: sk-doc strict validation passes on the edited references/templates; `validate_document.py` tests stay green.
- **SC-003**: Zero prescriptive "numbered snippet filename" guidance remains in sk-doc references, templates, or create-commands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-edit removes category-folder numbering too | High — breaks validator + section order | REQ-002 guard; DeepSeek review diff before commit |
| Risk | Touching `validate_document.py` logic by accident | High — could break doc-type detection | Comment-only edit; run `scripts/tests/test_validator.py` after |
| Dependency | Phases 003–005 consume this contract | Blocking | This phase MUST land + validate first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: `validate_document.py` regression tests pass post-edit (no logic drift).

### Security
- **NFR-S01**: No secrets or external calls; doc-only edits.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Templates also contain `{NN--category}` placeholders (folders) — those KEEP the number; only the filename token changes.
- `Related references` placeholders `{NNN-1}-{neighbor}.md` / `{NNN+1}` → neutral `{neighboring-feature}.md` (no arithmetic-on-number implication).

### Error Scenarios
- A reference line mixes folder + file numbering in one sentence → split so folder rule and file rule are unambiguous.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | ~12 files, doc-only |
| Risk | 12/25 | Contract surface; over-edit could break validator/order |
| Research | 4/20 | Already mapped in 133 discovery |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Inherits parent decisions D1–D4 (this phase is unaffected by D2/D3; it defines the convention D4 references).
<!-- /ANCHOR:questions -->
