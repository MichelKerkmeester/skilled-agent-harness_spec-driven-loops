---
title: "refero_get_screen"
description: "Per-tool leaf for refero_get_screen: full screen metadata for shortlisted UUIDs (exactly one of screen_id or screen_ids); never takes image_size or include_similar; read-only."
trigger_phrases:
  - "refero get screen tool"
  - "get screen refero"
  - "screen detail refero"
version: 1.1.0.0
---

# refero_get_screen

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Full screen-metadata retrieval for UUIDs shortlisted by [`refero_search_screens`](search-screens.md). READ-ONLY. Canonical callable: `refero.refero_refero_get_screen({ screen_id | screen_ids, response_format? })` (doubled prefix; confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | Exactly one of `screen_id: string` \| `screen_ids: string[]` (UUID strings, never numeric) |
| Optional args | `response_format?` (tool_info runtime check) |
| Returns | Full screen metadata: fonts, tags, description/layout/functions |
| Negative knowledge | **Never** takes `image_size` or `include_similar` — deprecated legacy arguments; reject on sight |

---

## 2. HOW IT WORKS

Runs only for a metadata-justified shortlist, and answers with text: fonts, tags, layout, and functions. A screenshot is a different tool ([`refero_get_screen_image`](get-screen-image.md)) and a later funnel step; comparables are [`refero_get_similar_screens`](get-similar-screens.md). Failed batches retry with fewer IDs. Citations use `refero_url`.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The ID union, result shape, and the deprecated-argument negative knowledge (Sections 1-2) |
| `../../manual_testing_playbook/read-only/funnel-walk.md` | The full-funnel scenario exercising this tool at the screens layer |
| `../../examples/metadata-first-lookup.md` | Worked shortlist-then-detail Code Mode invocation |

---

## 4. SOURCE METADATA

- Group: Screens
- Canonical catalog source: `../feature_catalog.md`
- Domain overview: [screens.md](screens.md)
- Feature file path: `screens/get-screen.md`
