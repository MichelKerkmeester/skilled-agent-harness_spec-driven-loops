---
title: "Five-Lane Analytical Fusion"
description: "Analytical fusion of 5 lanes (explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05) that produces the live routing score."
trigger_phrases:
  - "five lane fusion"
  - "lane weights canonical"
  - "fusion scorer"
  - "advisor analytical fusion"
---

# Five-Lane Analytical Fusion

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Combine evidence from five independent lanes into a single routing score with documented, auditable weights.

## 2. HOW IT WORKS

`lib/scorer/fusion.ts` fuses five lanes using the canonical weights below. Each lane runs independently and writes `{ lane, rawScore, weight, weightedScore, shadowOnly }` metadata that the attribution path consumes.

| Lane | Weight | Source |
| --- | --- | --- |
| `explicit_author` | 0.42 | Author-declared signals via `intent_signals`, trigger_phrases and explicit mentions. |
| `lexical` | 0.28 | Token overlap weighted by IDF from the active corpus. |
| `graph_causal` | 0.13 | Graph-edge evidence projected through skill_nodes and skill_edges. |
| `derived_generated` | 0.12 | Auto-extracted derived entries under trust-lane control. |
| `semantic_shadow` | 0.05 | Semantic similarity evidence from the current lane registry. |

Weight configuration is exposed via `advisor_status.laneWeights`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/weights-config.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Automated test | fusion arithmetic and lane weights |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-status.vitest.ts` | Automated test | `laneWeights` exposure |
| `Playbook scenario [SC-001](../../manual_testing_playbook/08--scorer-fusion/037-five-lane-fusion.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/five-lane-fusion.md`

Related references:

- [02-projection.md](./projection.md).
- [04-attribution.md](./attribution.md).
