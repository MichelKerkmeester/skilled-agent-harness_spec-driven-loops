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

> **STATUS (arc-118):** `deep_loop_graph_convergence` is NOT a registered MCP tool. It is an internal runtime/ `.cjs` script (e.g. `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs`) and is not routed through system-spec-kit / mk-spec-memory. MCP routing for the `deep_loop_graph_*` family was removed in arc-118. The code-graph MCP surface is 8 tools and does NOT include this script.

## 1. OVERVIEW

`deep_loop_graph_convergence` computes typed convergence decisions and signals for deep research/review coverage graphs.

## 2. HOW IT WORKS

### Trigger / Invocation Path

Command-owned deep-research/deep-review YAML invokes the internal runtime/ `.cjs` script. There is no MCP routing.

### Class

auto inside the deep-loop command workflows, via the internal `.cjs` script. There is no MCP routing.

### Caveats / Fallback

Auto means "inside the command YAML workflow," not globally scheduled. Empty graphs return CONTINUE.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Implementation | CLI script (argv-parsed via `parseArgs`); invoked directly from the deep YAMLs, NOT an MCP tool |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` `step_graph_convergence` | Call site | calls convergence before the research stop vote |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` `step_graph_convergence` | Call site | calls convergence before the review stop vote |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/coverage_graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `coverage-graph/deep-loop-graph-convergence.md`

Related references:

- [03-deep-loop-graph-upsert.md](../coverage_graph/deep_loop_graph_upsert.md)
- [../../manual_testing_playbook/coverage_graph/deep_loop_graph_convergence_yaml_fire.md](../../manual_testing_playbook/coverage_graph/deep_loop_graph_convergence_yaml_fire.md)
