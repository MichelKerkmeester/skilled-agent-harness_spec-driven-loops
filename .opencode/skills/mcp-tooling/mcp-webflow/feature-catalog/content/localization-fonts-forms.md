---
title: "Localization, fonts, forms"
description: "Webflow localization/fonts/forms capability card: secondary-locale content, font CRUD, form submission reads — locale administration is out of the MCP surface."
trigger_phrases: ["webflow localization", "webflow fonts", "webflow forms"]
contextType: implementation
version: 1.0.0.0

# Localization, fonts, forms

<!-- sk-doc-template: skill_asset_feature_catalog -->
## 1. OVERVIEW

Site-level content capabilities beyond pages/CMS: localization (secondary-locale
content only — **locale administration lives in the Webflow UI, not the MCP surface**), fonts
(upload/manage site fonts), and forms (read submissions).

---
## 2. HOW IT WORKS

### Actions

### `data_localization_tool` (read+write)

| Action | Class |
|--------|-------|
| localized page/component content reads (incl. `update_component_properties` reads) | RO |
| update localized page/component content (secondary locales) | DW |
| content deletes within localization | DS |

### `data_fonts_tool` (read+write)

| Action | Class |
|--------|-------|
| font reads (list/get fonts) | RO |
| upload/add font, update font metadata | DW |
| `batch_delete_fonts` | DS |

### `data_forms_tool` (read+write)

| Action | Class |
|--------|-------|
| `list_site_form_submissions` and related reads | RO |
| `delete_form_submission` | DS |

### Semantics

- Localization writes are content changes — review target locale; deletes are DS.
- Font deletes are bulk and irreversible via the surface — DS confirmation.
- Forms reads are read-only (no gate); form config writes are DW.

### Example prompts

- "list the locales of the test site"
- "add a Spanish locale to the test site"
- "list the site fonts" / "batch delete the unused 'OldFont' family" (confirmation)
- "list the form submissions of the 'Contact' form"

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `../../references/action-reference.md` | Shared | Required parameters per action (Localization, Fonts, Forms) |
| `../../references/tool-surface.md` | Shared | Local OSS baseline where applicable |
| `../../SKILL.md` | Shared | Frozen classes and gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/` | Manual playbook | Relevant scenarios for this capability |


## 4. SOURCE METADATA

- Group: Localization, Fonts, Forms
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `content/localization-fonts-forms.md`

Related references:
- [`cms.md`](cms.md) — related capability
- [`site-pages-scripts.md`](site-pages-scripts.md) — related capability
