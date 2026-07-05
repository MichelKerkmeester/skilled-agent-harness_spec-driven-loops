---
title: "deep_loop_graph_upsert"
description: "Coverage-graph write tool called conditionally by deep-research and deep-review YAML when latest iteration graphEvents are present."
trigger_phrases:
  - "deep_loop_graph_upsert"
  - "system-code-graph feature catalog"
importance_tier: "important"
version: 1.2.0.13
---

# deep_loop_graph_upsert

<!-- sk-doc-template: skill_asset_feature_catalog -->

> **STATUS (arc-118):** `deep_loop_graph_upsert` is NOT a registered MCP tool. It is an internal deep-loop-runtime `.cjs` script (under `.opencode/skills/deep-loop-runtime/scripts/`) and is not routed through system-spec-kit / mk-spec-memory. MCP routing for the `deep_loop_graph_*` family was removed in arc-118. The code-graph MCP surface is 8 tools and does NOT include this script.

## 1. OVERVIEW

`deep_loop_graph_upsert` stores coverage graph nodes and edges for deep research/review loops. The command workflows call it only when a reducer exposes graph events.

## 2. HOW IT WORKS

### Trigger / Invocation Path

Command-owned deep-research/deep-review YAML, conditional on `graphEvents`, invokes the internal deep-loop-runtime `.cjs` script. There is no MCP routing.

### Class

half. Command workflows can invoke the internal script conditionally; there is no MCP routing.

### Caveats / Fallback

No `graphEvents` means no upsert. The workflow skip is intentional and should not be described as a failed write.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Implementation | CLI script (argv-parsed via `parseArgs`); invoked directly from the deep YAMLs, NOT an MCP tool |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` `step_graph_upsert` | Call site | conditionally calls upsert for research graph events |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` `step_seed_coverage_graph` and `step_graph_upsert` | Call site | seeds and conditionally upserts review graph events |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/05--coverage-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/deep-loop-graph-upsert.md`

Related references:

- [04-deep-loop-graph-convergence.md](./deep-loop-graph-convergence.md)
- [../../manual_testing_playbook/05--coverage-graph/deep-loop-graph-upsert-conditional.md](../../manual_testing_playbook/05--coverage-graph/deep-loop-graph-upsert-conditional.md)
