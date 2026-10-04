---
title: "Shared Frontmatter Value Warning"
description: "Warns, never blocks, when a document's contextType or importance_tier is outside the shared value list that system-spec-kit owns, so skill docs and spec docs are judged by the same list."
trigger_phrases:
  - "shared frontmatter value warning"
  - "frontmatter_value_outside_list"
  - "validate_document.py contextType check"
  - "importance_tier value warning"
version: 1.0.0.0
---

# Shared Frontmatter Value Warning (validate_document.py)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Warns, never blocks, when a document's contextType or importance_tier is outside the shared value list that system-spec-kit owns, so skill docs and spec docs are judged by the same list.

`validate_document.py` reads `frontmatter-values.json` from sk-create-frontmatter's `assets/` folder, the same file spec-kit's validator reads, so the value list keeps one owner. The check runs for every document type and adds a warning, never an error, so it cannot change whether a document passes.

---

## 2. HOW IT WORKS

The check reads the document's leading frontmatter block and looks at two keys. `contextType` is compared with the document `contextType` list and `importance_tier` with the `importance_tier` list, and in both an alias counts as legal. A present value outside the list adds one `frontmatter_value_outside_list` warning whose message names the field and the value, with a fix hint that names the canonical values. A missing or empty value is left to the presence checks, so this check reports only a value that is there and wrong.

A document with no frontmatter block gets no warning from this check. A checkout that does not carry system-spec-kit's list stays silent too, because the check reads the list rather than keeping a copy of it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Script | Loads the shared list and adds the `frontmatter_value_outside_list` warning for every document type |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` | Shared | The canonical values and aliases the check reads |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/scripts/tests/test_frontmatter_values.py` | Unit | Seven cases: canonical values and aliases pass, a value outside the list warns and never blocks, and a missing block or a missing list stays silent |
| `.skilled/skills/sk-doc/manual-testing-playbook/document-validation/shared-frontmatter-value-warning.md` | Manual playbook | Validates a reference copy with a value outside the list against the unedited copy |

---

## 4. SOURCE METADATA

- Group: Document Validation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `document-validation/shared-frontmatter-value-warning.md`

Related references:
- [citation-drift-census-across-doc-families.md](citation-drift-census-across-doc-families.md) - the previous document-validation entry
- [changelog-entry-frontmatter-check.md](changelog-entry-frontmatter-check.md) - the other frontmatter check in the same validator
