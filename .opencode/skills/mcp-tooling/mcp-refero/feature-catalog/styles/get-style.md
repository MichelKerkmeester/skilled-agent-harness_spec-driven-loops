---
title: "refero_get_style"
description: "Per-tool leaf for refero_get_style: full style reference retrieval for shortlisted UUIDs (exactly one of style_id or style_ids), batched 3-4 because full styles run 10-15k characters; read-only."
trigger_phrases:
  - "refero get style tool"
  - "get style refero"
  - "full style reference"
version: 1.1.0.0
---

# refero_get_style

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Full style-reference retrieval for UUIDs shortlisted by [`refero_search_styles`](search-styles.md). READ-ONLY. Canonical callable: `refero.refero_refero_get_style({ style_id | style_ids, response_format? })` (doubled prefix; confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | Exactly one of `style_id: string` \| `style_ids: string[]` (UUID strings, never numeric) |
| Optional args | `response_format?` (tool_info runtime check) |
| Returns | Visual thesis, color/token roles, typography, layout, spacing, surfaces/elevation, components, imagery, do/don't rules |
| Batching bound | 3-4 UUIDs per call — full styles run ~10-15k characters each; failed batches retry with fewer IDs |

---

## 2. HOW IT WORKS

Runs only after a metadata shortlist — never speculatively over a whole result page. One primary direction gets selected from the retrieved references; bounded details may be borrowed; strong references are never averaged into a generic middle. For design-affecting use, `sk-design` collapses the retrieved set to one declared critique reference. Citations use each style's source `url`.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The exactly-one-of ID union, batching bound, and result shape (Section 1) |
| `../../manual-testing-playbook/read-only/styles-funnel.md` | The bounded-batch funnel scenario exercising this tool |
| `../../examples/funnel-styles-screens-flows.md` | Worked Code Mode invocation |

---

## 4. SOURCE METADATA

- Group: Styles
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [styles.md](styles.md)
- Feature file path: `styles/get-style.md`
