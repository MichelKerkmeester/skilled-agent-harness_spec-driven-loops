---
title: "Scope Binding and Code-Graph Seeding"
description: "Extracts anchors from the operator-supplied scope and expands them via code_graph_query into a ranked SLICE frontier before the first executor sweep."
trigger_phrases:
  - "scope binding"
  - "code graph seeding"
  - "seed the frontier"
  - "SLICE nodes"
  - "frontier seeding"
  - "code graph query deep context"
---

# Scope Binding and Code-Graph Seeding

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Extracts anchors from the operator-supplied scope and expands them via the System Code Graph into a ranked SLICE frontier before any executor sees the scope.

This is the first meaningful computation after initialization. The scope string is never passed raw to executors — it is first resolved to a bounded set of `SLICE` nodes that define the iteration's shared focus. This keeps each parallel sweep tractable and prevents whole-repo noise from masking the high-signal code that actually matters for the feature.

---

## 2. HOW IT WORKS

### Anchor Extraction

`step_seed_frontier` parses `{scope}` for paths (file paths, directory names), symbols (function names, type names, constants), error strings, and domain terms. These become the seed anchors for the code graph query.

### Code Graph Expansion

The anchors are passed as 2-5 word concept descriptions to `code_graph_query` with blast-radius and calls traversal. The result is a ranked set of SLICE nodes with adjacency metadata. SLICE nodes that share a tight blast-radius cluster rank higher than loosely adjacent nodes.

### Glob + Grep Fallback

When `code_graph_query` is unavailable or returns no results (stale graph), `step_seed_frontier` falls back to Glob + Grep over the anchor terms. Findings from the fallback path are tagged `frontier_source: "glob_grep_fallback"` in the `frontier_seeded` JSONL event, and downstream citations against these anchors are labeled `freshness: unverified` until the graph comes back online.

### Frontier Output

The ranked SLICE list is written into `deep-context-strategy.md` under the "Next Focus" section as the iteration-1 focus candidates. The count is logged in a `frontier_seeded` JSONL event. The frontier is never the whole repo — it is always a tractable slice set bounded by the scope anchors.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_seed_frontier` — anchor extraction, code_graph_query expansion, Glob/Grep fallback, strategy write |
| `.opencode/commands/deep/context.md` | Command | Step 5 of UNIFIED SETUP PHASE: `code_graph_query` on 2-5 word concept descriptions to seed the frontier and load prior context |
| `.opencode/agents/deep-context.md` | Agent | `step_anchor_the_slice` — per-seat frontier resolution within the shared focus; same code_graph_query pattern |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/manual_testing_playbook/01--frontier-seeding/scope-binding-and-code-graph-seeding.md` | Manual playbook | Verifies frontier seeding via code graph and Glob/Grep fallback, and frontier_seeded event content |

---

## 4. SOURCE METADATA

- Group: Frontier Seeding
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--frontier-seeding/scope-binding-and-code-graph-seeding.md`

Related references:
- [frontier-initialization.md](frontier-initialization.md) — Session setup that precedes frontier seeding
- [config-shape-and-default-pool.md](config-shape-and-default-pool.md) — Config that carries the seeded frontier into each iteration
