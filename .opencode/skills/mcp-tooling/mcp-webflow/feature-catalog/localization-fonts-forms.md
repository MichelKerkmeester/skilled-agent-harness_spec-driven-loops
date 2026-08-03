---
title: "Capability: Localization, fonts, forms"
description: "Webflow localization/fonts/forms capability card: locale management, font CRUD, form submission reads."
trigger_phrases: ["webflow localization", "webflow fonts", "webflow forms"]
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Localization, fonts, forms

## What it does

Site-level content capabilities beyond pages/CMS: localization (locales + secondary-locale
content), fonts (upload/manage site fonts), and forms (read submissions).

## Actions

### `data_localization_tool` (read+write)

| Action | Class |
|--------|-------|
| locale reads (list locales, locale content) | RO |
| create/update locales and secondary-locale content (incl. `update_component_properties` per locale) | DW |
| delete locale / locale content | DS |

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
| submission exports/config | DW |

## Semantics

- Localization writes are content changes — review target locale; deletes are DS.
- Font deletes are bulk and irreversible via the surface — DS confirmation.
- Forms reads are read-only (no gate); form config writes are DW.

## Example prompts

- "list the locales of the test site"
- "add a Spanish locale to the test site"
- "list the site fonts" / "batch delete the unused 'OldFont' family" (confirmation)
- "list the form submissions of the 'Contact' form"
