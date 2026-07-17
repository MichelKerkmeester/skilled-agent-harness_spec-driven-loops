---
title: "Screens"
description: "Search and retrieve Refero real-app screen references: platform-scoped search, full screen metadata, similar screens, and raw screenshots, read-only with metadata-first ordering and images last."
trigger_phrases:
  - "refero screens"
  - "refero search screens"
  - "refero similar screens"
  - "refero screen image"
version: 1.0.0.0
---

# Screens (refero_search_screens / refero_get_screen / refero_get_similar_screens / refero_get_screen_image)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries concrete UI patterns from real shipped apps: page structure, components, states, copy, and product-specific patterns, for both `web` and `ios` platforms. This is also the layer for app/company research and element research, through query terms plus the `site` and `ui_elements` result facets; no dedicated app or element tools exist.

All four tools are READ-ONLY. Screen IDs are UUID strings, never numbers.

---

## 2. HOW IT WORKS

`refero.refero_refero_search_screens({ query, platform, page?, response_format? })` takes a literal semantic query (screen type, component, state, company) and the required `platform: "web"|"ios"`, returning paginated UUID records with `site`, `page_url`, `refero_url`, thumbnail, `page_types`, `ux_patterns`, `ui_elements`, colors, and content. Shortlist on that metadata, then `refero.refero_refero_get_screen({ screen_id | screen_ids, response_format? })` retrieves full metadata for exactly one of the ID union; it never takes `image_size` or `include_similar` (deprecated legacy arguments). `refero.refero_refero_get_similar_screens({ screen_id, limit?, response_format? })` runs only after one screen is materially relevant (`limit` 1-20, default 10, the only tool with `limit`). `refero.refero_refero_get_screen_image({ screen_id, image_size? })` returns the raw screenshot and is the last resort when text cannot answer, `thumbnail` before `full`; it is the one tool that **never** takes `response_format`. Citations use `refero_url`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | Screen tool arguments, bounds, result shape, and the deprecated-argument negative knowledge |
| `references/mcp-wiring.md` | Shared | Doubled-prefix callable rule and the discovery-first contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/read-only/styles-funnel.md` | Manual playbook | Funnel ordering including the screens shortlist step |
| `manual-testing-playbook/pairing/sk-design-pairing.md` | Manual playbook | Screen evidence routes through sk-design before any design verdict |

---

## 4. SOURCE METADATA

- Group: Screens
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `screens/screens.md`

Per-tool leaves in this domain:
- [search-screens.md](search-screens.md) - platform-scoped screen search (metadata facets)
- [get-screen.md](get-screen.md) - full screen metadata (never `image_size`/`include_similar`)
- [get-similar-screens.md](get-similar-screens.md) - comparables after one relevant hit (`limit` 1-20)
- [get-screen-image.md](get-screen-image.md) - raw screenshot, image last (never `response_format`)

Related references:
- [styles.md](../styles/styles.md) covers visual direction, the funnel's first stop
- [flows.md](../flows/flows.md) covers the journeys screens are reconstructed from when flows are sparse
