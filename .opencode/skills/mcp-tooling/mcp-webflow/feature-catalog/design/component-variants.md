---
title: "Component variants"
description: "Webflow component-variants capability card: the eight data_component_variants_tool actions — variant reads, create/duplicate/name/reorder, style layers, and destructive delete_variant."
trigger_phrases:
  - "webflow component variants"
  - "webflow variants"
  - "webflow variant"
  - "webflow variant styles"
contextType: implementation
version: 1.1.0.0

# Component variants

<!-- sk-doc-template: skill_asset_feature_catalog -->
## 1. OVERVIEW

Operates component variant definitions on the remote surface via `data_component_variants_tool`
(read+write; page-building tool — `siteId` and `pageId` required on every action). Variants are
**style layers** on a component: each variant binds named styles (`set_variant_styles`) so a
component changes appearance per state. `delete_variant` is destructive.

---
## 2. HOW IT WORKS

### Variant Reads

`get_variant_settings` (`component_id`, `variant_id`) and `get_variant_styles` (`variant_id`,
`style_name`) — RO, no gate. Always read the current settings/styles before mutating a variant.

### Variant Mutations

`create_variant` (`component_id`, `name`), `duplicate_variant` (`component_id`,
`source_variant_id`), `set_variant_name`, `reorder_variants` (`component_id`, `variant_ids`),
`set_variant_styles` (`variant_id`, `style_name`) — DW. `delete_variant` (`component_id`,
`variant_id`) — DS, operator confirmation + before/after listing.

### Action Table (canonical surface)

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_variant_settings` | `component_id`, `variant_id` | RO |
| `get_variant_styles` | `variant_id`, `style_name` | RO |
| `create_variant` | `component_id`, `name` | DW |
| `duplicate_variant` | `component_id`, `source_variant_id` | DW |
| `set_variant_name` | `component_id`, `variant_id`, `name` | DW |
| `reorder_variants` | `component_id`, `variant_ids` | DW |
| `set_variant_styles` | `variant_id`, `style_name` | DW |
| `delete_variant` | `component_id`, `variant_id` | DS |

### Semantics

- Variants are **style layers**, not value overrides: `set_variant_styles` binds named styles;
  ensure the styles exist (see `references/designer-capabilities.md` §5) before binding.
- Read/update/read-back: `get_variant_settings` → DW mutation → `get_variant_styles`/
  `get_variant_settings` verify. `delete_variant` is irreversible via the surface.
- Variant edits are draft Designer state until the page is published (separate PB gate);
  naming and style layers are design-affecting — pair with `sk-design`.
- Example prompts: "list the variants of the 'Button' component", "create a 'hover' variant of
  the 'Card' component", "delete the 'old-state' variant" (confirmation).

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `../../references/action-reference.md` | Shared | Exact required parameters per variant action |
| `../../references/designer-capabilities.md` | Shared | Style-layer and component-view semantics |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/` | Manual playbook | Designer edit loop scenario (DRAFT-003) |

## 4. SOURCE METADATA

- Group: Components, Variants
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `design/component-variants.md`

Related references:
- [`designer.md`](designer.md) — related capability
- [`../../references/designer-capabilities.md`](../../references/designer-capabilities.md) — operational logic
