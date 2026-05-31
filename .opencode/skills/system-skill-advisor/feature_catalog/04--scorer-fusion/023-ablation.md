---
title: "Lane-by-Lane Ablation Protocol"
description: "Ablation harness that disables each lane in isolation and measures accuracy impact without mutating live routing weights."
trigger_phrases:
  - "ablation protocol"
  - "lane ablation"
  - "scorer ablation"
  - "ablation accuracy"
---

# Lane-by-Lane Ablation Protocol

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Quantify each lane's contribution to accuracy so lane weights can be reasoned about empirically. Ablation must never mutate live weights.

## 2. HOW IT WORKS

`lib/scorer/ablation.ts` drives the ablation protocol: it reads the active lane weight configuration, runs the corpus with each non-zero lane set to zero in turn and emits per-lane accuracy deltas. The live `laneWeights` (exposed via `advisor_status`) are unchanged after ablation. Results feed into `advisor_validate` ablation slices.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ablation.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-validate.vitest.ts` | Automated test | ablation slices |
| `Playbook scenario [SC-005](../../manual_testing_playbook/08--scorer-fusion/005-ablation.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/023-ablation.md`

Related references:

- [01-five-lane-fusion.md](./019-five-lane-fusion.md).
- [`06--mcp-surface/027-advisor-validate.md`](../06--mcp-surface/027-advisor-validate.md).
