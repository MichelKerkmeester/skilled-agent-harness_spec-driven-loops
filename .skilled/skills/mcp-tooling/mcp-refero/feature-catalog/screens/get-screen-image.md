---
title: "refero_get_screen_image"
description: "Per-tool leaf for refero_get_screen_image: raw screenshot retrieval for one screen UUID, thumbnail before full, the one tool that never takes response_format; read-only."
trigger_phrases:
  - "refero screen image tool"
  - "get screen image refero"
  - "refero screenshot"
version: 1.0.0.0
---

# refero_get_screen_image

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Raw screenshot retrieval — the funnel's last resort, requested only when text metadata cannot answer. READ-ONLY. Canonical callable: `refero.refero_refero_get_screen_image({ screen_id, image_size? })` (doubled prefix; confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `screen_id: string` (single UUID) |
| Optional args | `image_size: "thumbnail"\|"full"` (default thumbnail; thumbnail always tried first) |
| Returns | Raw screenshot image content |
| Negative knowledge | **Never** takes `response_format` — the one text-format exclusion in the eight-tool surface |

---

## 2. HOW IT WORKS

Sits at the end of the metadata-first ordering: search -> shortlist -> detail -> similar -> **thumbnail** -> **full**. The image is visual evidence cited alongside the screen's `refero_url`; it is never cached or copied into this repo, and reproducing it in a design is a quality and licensing failure. `image_size` belongs to this tool only — passing it to [`refero_get_screen`](get-screen.md) is deprecated-surface drift.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The image-size enum, the image-last rule, and the response_format exclusion (Sections 1-2) |
| `../../manual-testing-playbook/read-only/format-text-retrieval.md` | The scenario proving the response_format exclusion holds |
| `../../examples/screen-image-fetch.md` | Worked thumbnail-before-full Code Mode invocation |

---

## 4. SOURCE METADATA

- Group: Screens
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [screens.md](screens.md)
- Feature file path: `screens/get-screen-image.md`
