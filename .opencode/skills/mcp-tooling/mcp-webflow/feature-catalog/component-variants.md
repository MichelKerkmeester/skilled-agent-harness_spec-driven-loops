---
title: "Capability: Component variants"
description: "Webflow component-variants capability card: the eight data_component_variants_tool actions — variant reads, create/update, default variants, and destructive delete_variant."
trigger_phrases: ["webflow component variants", "webflow variants", "webflow variant"]
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Component variants

<!-- sk-doc-template: feature-catalog-snippet -->

---
## 1. OVERVIEW

Operates component variant definitions on the remote surface via `data_component_variants_tool`
(read+write; page-building tool — `siteId` and `pageId` required on every action). Variants let a
component change appearance per state; `delete_variant` is destructive.

---
## 2. HOW IT WORKS

| Action | Required parameters | Class |
|--------|---------------------|-------|
| `get_variant_settings` | `component_id`, `variant_id` | RO |
| variant reads (list/get variants for a component) | `component_id` | RO |
| `create_variant` | `component_id`, `name` (+ optional value overrides) | DW |
| `update_variant` / variant setting updates | `component_id`, `variant_id` | DW |
| `set_default_variant` | `component_id`, `variant_id` | DW |
| `delete_variant` | `component_id`, `variant_id` | DS |

Semantics: variant edits are draft Designer state until the page is published (gated PB
separately); variant naming and value overrides are design-affecting — pair with `sk-design`.
Delete is irreversible via the surface — operator confirmation with before/after listing.

Example prompts: "list the variants of the 'Button' component", "create a 'hover' variant of the
'Card' component", "delete the 'old-state' variant" (confirmation).

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `../references/action-reference.md` | Shared | Required parameters per action (Components) |
| `../references/tool-surface.md` | Shared | Local OSS baseline where applicable |
| `../SKILL.md` | Shared | Frozen classes and gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../manual-testing-playbook/` | Manual playbook | Relevant scenarios for this capability |

---

## 4. SOURCE METADATA

- Group: Components
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `component-variants.md`

Related references:
- [`../references/action-reference.md`](../references/action-reference.md) — complete action inventory
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates
