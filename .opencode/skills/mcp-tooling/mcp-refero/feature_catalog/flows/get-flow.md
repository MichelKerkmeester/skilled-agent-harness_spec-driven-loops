---
title: "refero_get_flow"
description: "Per-tool leaf for refero_get_flow: ordered journey steps for numeric flow IDs (exactly one of flow_id or flow_ids), each step carrying screen UUID, goal, action, system response, and related_queries; read-only."
trigger_phrases:
  - "refero get flow tool"
  - "get flow refero"
  - "flow detail refero"
version: 1.1.0.0
---

# refero_get_flow

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Ordered-step retrieval for flows shortlisted by [`refero_search_flows`](search-flows.md). READ-ONLY. Canonical callable: `refero.refero_refero_get_flow({ flow_id | flow_ids, response_format? })` (doubled prefix; confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | Exactly one of `flow_id: number` \| `flow_ids: number[]` (numeric — a UUID here is a typing violation) |
| Optional args | `response_format?` (tool_info runtime check) |
| Returns | Ordered steps: per-step screen UUID, goal, action, system response, metadata, `related_queries` |
| Batching note | A local observation caps batches at 10 IDs — a heuristic, not a published contract; confirm via `tool_info` |

---

## 2. HOW IT WORKS

Retrieves one relevant journey and reads its logic: goals, actions, system responses, completion states. `related_queries` widens the search when one journey is not enough. Each step's screen UUID can hop back into the screens layer for visual detail. Failed batches retry with fewer IDs; typings never cross (flows numeric, screens/styles UUID).

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The numeric ID union, step shape, and the batch heuristic (Sections 1, 5) |
| `../../manual_testing_playbook/read-only/flow-detail.md` | The numeric-typing and sparse-handling scenario exercising this tool |
| `../../examples/funnel-styles-screens-flows.md` | Worked Code Mode invocation |

---

## 4. SOURCE METADATA

- Group: Flows
- Canonical catalog source: `../feature_catalog.md`
- Domain overview: [flows.md](flows.md)
- Feature file path: `flows/get-flow.md`
