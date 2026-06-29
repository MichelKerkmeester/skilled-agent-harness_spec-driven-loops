---
title: "Registry Projection Drift Guard and workflowMode Publication"
description: "Generated deep-loop routing projection, freshness hash guard and advisor_recommend workflowMode publication."
trigger_phrases:
  - "scorer projection"
  - "skill_nodes skill_edges"
  - "graph causal projection"
  - "projection layer"
  - "workflowMode publication"
  - "routing registry drift guard"
version: 0.8.0.12
---

# Registry Projection Drift Guard and workflowMode Publication

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Expose the scorer projection data the advisor needs, including the generated deep-loop routing aliases and the resolved `workflowMode` field callers need for downstream routing.

## 2. HOW IT WORKS

`lib/scorer/projection.ts` projects the compiled skill graph into `skill_nodes` and `skill_edges` collections shaped for the graph-causal lane. The projection is side-effect-free and does not carry prompt text or raw graph prose. Bounded node counts keep memory usage stable as the corpus grows.

`scripts/skill_advisor.py --emit-routing-projection` reads the deep-loop `mode-registry.json` at generation time and emits matching TypeScript and Python projection constants. The generated section in `lib/scorer/aliases.ts` includes `DEEP_ROUTING_PROJECTION_HASH`, alias groups and `DEEP_MODE_BY_CANONICAL`; the Python surface carries the matching hash and mode table. The advisor does not read another skill's mode registry at runtime.

`routing-registry-drift-guard.vitest.ts` recomputes the registry hash and compares it with the embedded TypeScript and Python projection hashes. This makes newly added lexical or alias-fold modes fail fast when the projection has not been regenerated.

`advisor_recommend` folds the projection hash into its cache source signature and publishes `workflowMode` on recommendations when a generated deep-loop alias or merged deep-loop prompt resolves to a known mode. The response schema treats the field as optional for compatibility with non-deep skills and strict consumers.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Library | Generated deep routing projection and workflowMode mapping |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` | Handler | Publishes workflowMode and includes projection hash in cache signature |
| `.opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts` | Schema | Optional workflowMode response field |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Compatibility script | Emits the routing projection and Python parity constants |
| `.opencode/commands/create/assets/create_parent_skill_auto.yaml` | Command asset | Requires projection emission for lexical/alias-fold parent-skill modes |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Automated test | graph-causal lane behavior |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Automated test | Registry hash freshness and projection drift guard |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts` | Automated test | workflowMode publication on generated deep-loop aliases |
| `Playbook scenario [SC-002](../../manual_testing_playbook/08--scorer-fusion/projection.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/projection.md`

Related references:

- [01-five-lane-fusion.md](./five-lane-fusion.md).
- [04-attribution.md](./attribution.md).
- [`06--mcp-surface/advisor-validate.md`](../06--mcp-surface/advisor-validate.md).
