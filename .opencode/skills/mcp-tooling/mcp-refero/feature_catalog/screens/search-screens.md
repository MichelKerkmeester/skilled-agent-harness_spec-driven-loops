---
title: "refero_search_screens"
description: "Per-tool leaf for refero_search_screens: platform-scoped literal screen search returning paginated UUID records with site, refero_url, page_types, ux_patterns, ui_elements, colors, and content; read-only."
trigger_phrases:
  - "refero search screens tool"
  - "search screens refero"
  - "screen search refero"
version: 1.1.0.0
---

# refero_search_screens

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Literal semantic search over real shipped app screens — the entry point of the screens layer and the home of app/company and element research (through query terms plus the `site` and `ui_elements` facets; no `search_apps`/`search_elements` tools exist). READ-ONLY. Canonical callable: `refero.refero_refero_search_screens({ query, platform, page?, response_format? })` (doubled prefix; confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `query: string` (screen type, component, state, company); `platform: "web"\|"ios"` |
| Optional args | `page` (default 1); `response_format?` (tool_info runtime check) |
| Returns | Paginated UUID records with `site`, `page_url`, `refero_url`, thumbnail, `page_types`, `ux_patterns`, `ui_elements`, colors, content |

---

## 2. HOW IT WORKS

Most screen questions are answered from this tool's metadata alone: which sites ship the pattern, which `ux_patterns` and `ui_elements` appear, which `page_types` carry it. Shortlist on that metadata, then fetch detail only for justified UUIDs via [`refero_get_screen`](get-screen.md). Unknown fields are preserved; citations use each record's `refero_url`.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, the required platform enum, result shape, and the facet rule (Section 1) |
| `../../manual_testing_playbook/read-only/format-text-retrieval.md` | The response_format discipline scenario exercising this tool |
| `../../examples/metadata-first-lookup.md` | Worked metadata-first Code Mode invocation |

---

## 4. SOURCE METADATA

- Group: Screens
- Canonical catalog source: `../feature_catalog.md`
- Domain overview: [screens.md](screens.md)
- Feature file path: `screens/search-screens.md`
