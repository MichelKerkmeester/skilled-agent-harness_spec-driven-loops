---
title: "Render Checks"
description: "Flags a document that validates but reads wrong once rendered, from a joined bold label to a citation of a section that no longer exists, and fails a skill's strict packaging on any finding."
trigger_phrases:
  - "render checks"
  - "render_section_reference"
  - "doc reads wrong once rendered"
  - "package_skill strict render findings"
version: 2.9.3.0
---

# Render Checks (validate_document.py)

## 1. OVERVIEW

Flags a document that validates but reads wrong once rendered, from a joined bold label to a citation of a section that no longer exists, and fails a skill's strict packaging on any finding.

`validate_document.py` reports each finding as a `render_*` warning, so the document stays valid on its own. `package_skill.py --strict` turns the same findings into a packaging failure for the docs it scans, which is what holds a skill to them.

---

## 2. HOW IT WORKS

Sixteen checks read the rendered shape of a doc: `render_bold_label_join`, `render_setext_underline`, `render_bare_url`, `render_overview_heading`, `render_overview_orientation`, `render_overview_subsections`, `render_repeated_sentence`, `render_repeated_label`, `render_h2_numbering`, `render_h2_sequence`, `render_section_order`, `render_section_reference`, `render_intro_restates_purpose`, `render_intro_missing`, `render_intro_pointer` and `render_intro_sentence_restates`. Fenced blocks and frontmatter are skipped.

The shape checks run for the document types whose rule in `template-rules.json` sets `renderChecks`: readme, skill, reference, asset and skill_router. `render_section_reference` runs for every type, because a cited section number that does not exist misleads the reader of a playbook or a catalog too. It resolves a citation whose file is written plainly, as a code span or as a link. A type that records past state sets `sectionReferenceChecks` to false, which changelog and spec do, so their citations stay as written.

The packager scans `references/`, `assets/`, `SKILL.md`, `ROUTER.md`, `README.md`, `shared/references` and `runtime/references`. A doc in the render ledger's `exempt` map is skipped there and reported by the validator as a warning labelled with its consumer.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Script | The sixteen checks and `validate_render_checks`, which gates them by type |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Shared | `renderChecks` and `sectionReferenceChecks` per document type |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Script | `RENDER_CHECK_TYPES` and `RENDER_SCAN_SCOPES`; `--strict` fails on a render finding |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/scripts/tests/test_render_checks.py` | Unit | One positive and one negative fixture per check, plus the type gating of the citation check |
| `.skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` | Automated test | Holds every README's verdict to the recorded baseline |

---

## 4. SOURCE METADATA

- Group: Document Validation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `document-validation/render-checks.md`

Related references:
- [shared-frontmatter-value-warning.md](shared-frontmatter-value-warning.md) - the previous document-validation entry
- [render-ledger-and-rewrite-guard.md](render-ledger-and-rewrite-guard.md) - what to do with a finding a doc cannot fix
