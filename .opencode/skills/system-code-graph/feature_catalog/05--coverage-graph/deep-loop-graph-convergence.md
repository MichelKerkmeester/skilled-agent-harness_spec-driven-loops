---
title: "deep_loop_graph_convergence"
description: "Coverage-graph convergence tool auto-fired by deep-research and deep-review YAML before inline stop voting."
trigger_phrases:
  - "deep_loop_graph_convergence"
  - "system-code-graph feature catalog"
importance_tier: "important"
version: 1.2.0.13
---

# deep_loop_graph_convergence

<!-- sk-doc-template: skill_asset_feature_catalog -->

> **STATUS (arc-118):** `deep_loop_graph_convergence` is NOT a registered MCP tool. It is an internal deep-loop-runtime `.cjs` script (e.g. `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`) and is not routed through system-spec-kit / mk-spec-memory. MCP routing for the `deep_loop_graph_*` family was removed in arc-118. The code-graph MCP surface is 8 tools and does NOT include this script.

## 1. OVERVIEW

`deep_loop_graph_convergence` computes typed convergence decisions and signals for deep research/review coverage graphs.

## 2. HOW IT WORKS

### Trigger / Invocation Path

Command-owned deep-research/deep-review YAML invokes the internal deep-loop-runtime `.cjs` script. There is no MCP routing.

### Class

auto inside the deep-loop command workflows, via the internal `.cjs` script. There is no MCP routing.

### Caveats / Fallback

Auto means "inside the command YAML workflow," not globally scheduled. Empty graphs return CONTINUE.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:146-240` | Handler | validates namespace, handles empty graphs, computes signals and emits decisions |
| `.opencode/commands/deep/assets/deep_research_auto.yaml:456-467` | Implementation | calls convergence before the research stop vote |
| `.opencode/commands/deep/assets/deep_review_auto.yaml:483-502` | Implementation | calls convergence before the review stop vote |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:692-705` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/05--coverage-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/deep-loop-graph-convergence.md`

Related references:

- [03-deep-loop-graph-upsert.md](./deep-loop-graph-upsert.md)
- [../../manual_testing_playbook/05--coverage-graph/deep-loop-graph-convergence-yaml-fire.md](../../manual_testing_playbook/05--coverage-graph/deep-loop-graph-convergence-yaml-fire.md)
