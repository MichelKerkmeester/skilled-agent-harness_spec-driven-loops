---
title: "refero_search_flows"
description: "Per-tool leaf for refero_search_flows: platform-scoped task/journey search returning paginated summaries with numeric flow IDs, site, steps summary, problem, and description; read-only."
trigger_phrases:
  - "refero search flows tool"
  - "search flows refero"
  - "flow search refero"
version: 1.1.0.0
---

# refero_search_flows

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Task-journey search over real shipped flows — the entry point of the flows layer and the only search returning **numeric** IDs. READ-ONLY. Canonical callable: `refero.refero_refero_search_flows({ query, platform, page?, response_format? })` (doubled prefix; confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `query: string` (task/journey: "cancel subscription", "checkout"); `platform: "web"\|"ios"` |
| Optional args | `page` (default 1); `response_format?` (tool_info runtime check) |
| Returns | Paginated summaries with **numeric** flow IDs, site, steps summary, problem, description |

---

## 2. HOW IT WORKS

Searches journey logic, not visuals: step count, entry/exit states, decision points, recovery paths. The returned IDs are numbers — the one place UUID habits break — and they feed [`refero_get_flow`](get-flow.md) only. When results are sparse, the query is broadened or the journey is reconstructed from related screens with the reconstruction reported as inference. Unknown fields are preserved.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, the numeric-ID rule, and the sparse-flow discipline (Sections 1, 3) |
| `../../manual-testing-playbook/read-only/flow-detail.md` | The numeric-typing scenario exercising this tool |
| `../../examples/funnel-styles-screens-flows.md` | Worked Code Mode invocation |

---

## 4. SOURCE METADATA

- Group: Flows
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [flows.md](flows.md)
- Feature file path: `flows/search-flows.md`
