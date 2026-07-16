---
title: "refero_get_similar_screens"
description: "Per-tool leaf for refero_get_similar_screens: comparable screens for one materially relevant hit, the only tool carrying limit (1-20, default 10); read-only."
trigger_phrases:
  - "refero similar screens tool"
  - "get similar screens refero"
  - "comparable screens refero"
version: 1.1.0.0
---

# refero_get_similar_screens

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Comparable-screen retrieval, run only AFTER one screen has proven materially relevant — never as a first-pass search substitute. READ-ONLY. Canonical callable: `refero.refero_refero_get_similar_screens({ screen_id, limit?, response_format? })` (doubled prefix; confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `screen_id: string` (single UUID) |
| Optional args | `limit` 1-20, default 10 — **the only tool with `limit`** (search pagination uses `page`); `response_format?` |
| Returns | Comparable screen records |

---

## 2. HOW IT WORKS

Widens from one confirmed hit sideways: visually and functionally similar shipped screens. Its `limit` is the lone survivor of the legacy `limit`/`offset` era — using `limit` on any search tool is deprecated-surface drift and gets rejected. Similarity is evidence of convention, never a taste verdict; ranking stays out of design judgment. Citations use each record's `refero_url`.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool_surface.md` | The 1-20 bound and the only-tool-with-limit rule (Sections 1-2) |
| `../../manual_testing_playbook/read_only/styles_funnel.md` | The funnel-order discipline (similar only after one relevant hit) |
| `../../examples/funnel_styles_screens_flows.md` | Worked Code Mode invocation |

---

## 4. SOURCE METADATA

- Group: Screens
- Canonical catalog source: `../feature_catalog.md`
- Domain overview: [screens.md](screens.md)
- Feature file path: `screens/get_similar_screens.md`
