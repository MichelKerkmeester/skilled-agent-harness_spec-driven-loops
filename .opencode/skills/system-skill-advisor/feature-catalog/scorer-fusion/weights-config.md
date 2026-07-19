---
title: "Lane Weights Configuration"
description: "Centralized weight configuration that exposes canonical lane weights as a single source of truth for fusion."
trigger_phrases:
  - "lane weights config"
  - "weights-config.ts"
  - "canonical weights"
  - "lane weight source of truth"
version: 0.8.0.14
---

# Lane Weights Configuration

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Keep the canonical lane weights in exactly one place and expose them to callers so routing behavior remains auditable.

## 2. HOW IT WORKS

`lib/scorer/weights-config.ts` defines the canonical weights from `lib/scorer/lane-registry.ts`: `explicit_author: 0.42`, `lexical: 0.28`, `graph_causal: 0.13`, `derived_generated: 0.12`, `semantic_shadow: 0.05`. These values are surfaced through `advisor_status.laneWeights` and consumed by `lib/scorer/fusion.ts`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/weights-config.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lane-registry.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-status.ts` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/native-scorer.vitest.ts` | Automated test | weight consumption |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-status.vitest.ts` | Automated test | weight exposure |
| `Playbook scenario [SC-001](../../manual-testing-playbook/scorer-fusion/five-lane-fusion.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scorer-fusion/weights-config.md`

Related references:

- [01-five-lane-fusion.md](../../feature-catalog/scorer-fusion/five-lane-fusion.md).
