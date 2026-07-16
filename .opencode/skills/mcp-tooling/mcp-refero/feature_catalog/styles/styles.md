---
title: "Styles"
description: "Search and retrieve Refero visual-direction style references: semantic style search plus full style detail, read-only, web marketing/product coverage only, batched 3-4 UUIDs."
trigger_phrases:
  - "refero styles"
  - "refero search styles"
  - "refero get style"
  - "visual direction reference"
version: 1.1.0.0
---

# Styles (refero_search_styles / refero_get_style)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries visual direction: typography, color and token roles, layout, spacing, surfaces and elevation, components, imagery, and do/don't rules from real shipped web pages. Styles are the official **first stop for any visual task** in the styles -> screens -> flows funnel.

Both tools are READ-ONLY. Coverage is **web marketing/product pages ONLY** (landing, pricing, editorial, SaaS sites), not in-app dashboards, auth/settings screens, or iOS style systems; in-app and iOS material lives in the screens layer.

---

## 2. HOW IT WORKS

`refero.refero_refero_search_styles({ query, page?, response_format? })` runs a semantic search: 3-5 angles combining product/domain/audience with a concrete aesthetic direction. It returns `{ pagination, records[] }` where each record carries the style UUID, title, source `url`, `preview_url`, platform, and description. Shortlist on that metadata, then `refero.refero_refero_get_style({ style_id | style_ids, response_format? })` retrieves the full reference for exactly one of `style_id` (string UUID) or `style_ids` (string array). Full styles are large, roughly 10-15k characters each, so batches stay at 3-4 UUIDs; a failed batch is retried with fewer IDs. One primary direction gets selected, bounded details may be borrowed, and strong references are never averaged into a generic middle. For design-affecting use, `sk-design` collapses the shortlist to one declared critique reference; citations use the record's source `url`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool_surface.md` | Shared | Style tool arguments, bounds, result shape, and the funnel role |
| `references/mcp_wiring.md` | Shared | Doubled-prefix callable rule and the discovery-first contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/read_only/styles_funnel.md` | Manual playbook | The metadata-first styles funnel returns cited evidence read-only |

---

## 4. SOURCE METADATA

- Group: Styles
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `styles/styles.md`

Per-tool leaves in this domain:
- [search_styles.md](search_styles.md) - semantic style search (paginated UUID records)
- [get_style.md](get_style.md) - full style retrieval (batched 3-4 UUIDs)

Related references:
- [screens.md](../screens/screens.md) covers the in-app and iOS patterns styles do not
- [flows.md](../flows/flows.md) covers multi-step journeys
