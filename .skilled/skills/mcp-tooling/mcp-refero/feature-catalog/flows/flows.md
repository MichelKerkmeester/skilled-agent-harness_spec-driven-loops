---
title: "Flows"
description: "Search and retrieve Refero user-flow references: platform-scoped journey search and ordered step detail with numeric flow IDs, read-only, with sparse-flow reconstruction reported as inference."
trigger_phrases:
  - "refero flows"
  - "refero search flows"
  - "refero get flow"
  - "user flow reference"
version: 1.0.0.0
---

# Flows (refero_search_flows / refero_get_flow)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries multi-step journeys: step count, entry and exit states, decision points, and recovery paths from real shipped apps, for both `web` and `ios` platforms. Flows answer journey-logic questions, not visual-style questions.

Both tools are READ-ONLY. Flow IDs are **numeric**, the only numeric layer; styles and screens use UUID strings, and the typings are never interchangeable.

---

## 2. HOW IT WORKS

`refero.refero_refero_search_flows({ query, platform, page?, response_format? })` searches task journeys ("cancel subscription", "checkout") with the required platform and returns paginated summaries with numeric flow IDs, site, steps summary, problem, and description. `refero.refero_refero_get_flow({ flow_id | flow_ids, response_format? })` retrieves exactly one of `flow_id` (number) or `flow_ids` (number array) and returns the ordered steps: per-step screen UUID, goal, action, system response, metadata, and `related_queries` for widening. A local observation caps flow batches at 10 IDs; that is a batching heuristic, not a published contract, and is confirmed via `tool_info`. When flows are sparse, the query is broadened or the journey is reconstructed from related screens, and the reconstruction is **reported as inference**, never presented as retrieved fact.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | Flow tool arguments, the numeric-ID rule, and the sparse-flow discipline |
| `references/mcp-wiring.md` | Shared | Doubled-prefix callable rule and the discovery-first contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/read-only/flow-detail.md` | Manual playbook | A numeric-ID flow detail returns ordered steps read-only |

---

## 4. SOURCE METADATA

- Group: Flows
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `flows/flows.md`

Per-tool leaves in this domain:
- [search-flows.md](search-flows.md) - task/journey search (numeric flow IDs)
- [get-flow.md](get-flow.md) - ordered step retrieval (numeric ID union; batch heuristic 10)

Related references:
- [screens.md](../screens/screens.md) covers the screens used to reconstruct sparse journeys
- [styles.md](../styles/styles.md) covers visual direction, which flows never carry
