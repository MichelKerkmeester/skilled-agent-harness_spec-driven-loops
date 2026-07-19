---
title: "Derived-Lane-Only Age Haircut"
description: "Age-based decay applied strictly to the derived lane so aging evidence does not dominate fresh explicit or lexical signals."
trigger_phrases:
  - "age haircut"
  - "derived age decay"
  - "age weighted derived"
  - "lifecycle age"
version: 0.8.0.13
---

# Derived-Lane-Only Age Haircut

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Keep routing sensitive to currency without discounting author-declared signals. Older skills should see their auto-generated (derived) evidence softened, but their explicit declarations (`intent_signals`, trigger phrases) remain authoritative.

## 2. HOW IT WORKS

`lib/lifecycle/age-haircut.ts` reads each skill's source modification time and applies a documented decay curve to the derived lane only. The `explicit_author`, `lexical`, `graph_causal` and `semantic_shadow` lanes are untouched. The haircut shows up as a gap between `rawScore` and `weightedScore` in lane attribution for the derived lane.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/age-haircut.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/derived.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/native-scorer.vitest.ts` | Automated test | derived-lane decay application |
| `Playbook scenario [LC-001](../../manual-testing-playbook/lifecycle-routing/age-haircut.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `lifecycle-routing/age-haircut.md`

Related references:

- [`scorer-fusion/five-lane-fusion.md`](../../feature-catalog/scorer-fusion/five-lane-fusion.md).
- [`scorer-fusion/attribution.md`](../scorer-fusion/attribution.md).
- [02-supersession.md](./supersession.md).
