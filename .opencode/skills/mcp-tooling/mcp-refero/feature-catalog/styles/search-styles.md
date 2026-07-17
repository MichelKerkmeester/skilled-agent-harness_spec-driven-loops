---
title: "refero_search_styles"
description: "Per-tool leaf for refero_search_styles: semantic style search returning paginated UUID records with title, source URL, preview URL, platform, and description; read-only, web marketing/product coverage only."
trigger_phrases:
  - "refero search styles tool"
  - "search styles refero"
  - "style search refero"
version: 1.1.0.0
---

# refero_search_styles

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Semantic search over Refero's style references — the entry point of the styles layer and the first call of any visual task. READ-ONLY. Canonical callable: `refero.refero_refero_search_styles({ query, page?, response_format? })` (doubled prefix; confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `query: string` (semantic: product/domain/audience + concrete aesthetic direction) |
| Optional args | `page` (default 1; never legacy `limit`/`offset`); `response_format?` (tool_info runtime check) |
| Returns | `{ pagination, records[] }`: style UUID, title, source `url`, `preview_url`, platform, description |
| Coverage | Web marketing/product pages ONLY — no in-app, auth/settings, or iOS style systems |

---

## 2. HOW IT WORKS

Search 3-5 semantic angles per brief, then shortlist on the returned metadata (title, description, platform) before any detail call. Records carry UUID strings — the shortlist feeds [`refero_get_style`](get-style.md), never a flow tool. With `response_format: "json"` the response is the `{ pagination: { count, page, next_page, total_count, total_pages }, records }` object; unknown fields are preserved because the provider documents that fields can grow. Citations use each record's source `url`.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the funnel role (Section 1) |
| `../../manual-testing-playbook/read-only/styles-funnel.md` | The metadata-first funnel scenario exercising this tool |
| `../../examples/funnel-styles-screens-flows.md` | Worked Code Mode invocation |

---

## 4. SOURCE METADATA

- Group: Styles
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [styles.md](styles.md)
- Feature file path: `styles/search-styles.md`
