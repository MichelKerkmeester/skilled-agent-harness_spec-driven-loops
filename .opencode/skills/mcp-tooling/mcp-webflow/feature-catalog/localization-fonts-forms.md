---
title: "Capability: Localization, fonts, forms"
description: "Webflow localization/fonts/forms capability card: locale management, font CRUD, form submission reads."
trigger_phrases: ["webflow localization", "webflow fonts", "webflow forms"]
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Capability: Localization, fonts, forms

## 1. OVERVIEW

Site-level content capabilities beyond pages/CMS: localization (locales + secondary-locale
content), fonts (upload/manage site fonts), and forms (read submissions).

## 2. HOW IT WORKS

# Localization, fonts, forms
## Actions

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

## Semantics

- Localization writes are content changes — review target locale; deletes are DS.
- Font deletes are bulk and irreversible via the surface — DS confirmation.
- Forms reads are read-only (no gate); form config writes are DW.

## Example prompts

- "list the locales of the test site"
- "add a Spanish locale to the test site"
- "list the site fonts" / "batch delete the unused 'OldFont' family" (confirmation)
- "list the form submissions of the 'Contact' form"

## 3. SOURCE FILES

### Implementation

- [`../references/action-reference.md`](../references/action-reference.md) — groups: `Localization`, `Fonts`, `Forms`
- [`../references/tool-surface.md`](../references/tool-surface.md) — local OSS baseline where applicable
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates

### Validation And Tests

- See `../manual-testing-playbook/` for the relevant scenarios.

## 4. SOURCE METADATA

| Field | Value |
|-------|-------|
| Surface | remote (action-reference) + local OSS where noted |
| Authority | developers.webflow.com/mcp/tools/* (2026-08-03) |
| Version | 1.1.0.0 |
