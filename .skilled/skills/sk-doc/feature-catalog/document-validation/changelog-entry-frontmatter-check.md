---
title: "Changelog Entry Frontmatter Check"
description: "Blocks a changelog entry that lacks the search metadata a spec document carries, so every entry stays findable by component and version."
trigger_phrases:
  - "changelog entry frontmatter check"
  - "changelog search metadata validation"
  - "validate_document.py changelog"
  - "changelog trigger phrases required"
version: 2.2.0.0
---

# Changelog Entry Frontmatter Check (validate_document.py)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Blocks a changelog entry that lacks the search metadata a spec document carries, so every entry stays findable by component and version.

`validate_document.py` types every document under a `changelog/` folder as a changelog and holds each entry to the five-key block that the sk-create-changelog Frontmatter Contract defines. An entry is a `v{VERSION}.md` file or a `changelog-*.md` file. Any other document in a changelog folder, such as its README, keeps the structural rules alone.

---

## 2. HOW IT WORKS

The check reads the entry's leading frontmatter block where the trigger index reads it, past leading whitespace and HTML comments. It blocks an entry with no block or an unclosed one. It blocks a block that lacks `title`, `description`, `trigger_phrases`, `importance_tier` or `contextType`, and a `trigger_phrases` key with no phrase under it. A version file must also declare a phrase naming its own version, such as `sk-git v1.0.0.0` in `v1.0.0.0.md`.

The changelog folder decides the type before any word in the file name does, so a packet changelog about install guides is checked as a changelog rather than as an install guide. The fixture-tree skip passes over a folder whose name starts with a spec number, so a phase named for its fixtures is still checked.

The five keys come from `template-rules.json`, which lists them as the changelog type's required frontmatter fields.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Script | Types the document and runs the entry check |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Shared | Lists the five required fields for the changelog type |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Shared | Defines the Frontmatter Contract the check enforces |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py` | Unit | Entry detection, each blocked case, the README exemption and the install-guide and fixture-folder names |
| `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/search-metadata/write-global-entry-metadata.md` | Manual playbook | Checks a written entry against the contract and the validator |

---

## 4. SOURCE METADATA

- Group: Document Validation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `document-validation/changelog-entry-frontmatter-check.md`

Related references:
- [packet-authored-registry-routing.md](../packet-authored-registry-routing/packet-authored-registry-routing.md) - how the hub routes a request to the changelog mode
