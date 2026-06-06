---
title: "Causal depth signal"
description: "Describes the SCC-condensed longest-path depth signal that normalizes each spec-doc record's structural distance from root components to a [0,1] score, applied as a capped +0.05 additive bonus in Stage 2."
trigger_phrases:
  - "causal depth signal"
  - "SCC-condensed longest-path depth"
  - "computeCausalDepthScores"
  - "structural distance root component"
  - "causal depth additive bonus"
---

# Causal depth signal

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Describes the SCC-condensed longest-path depth signal that normalizes each spec-doc record's structural distance from root components to a [0,1] score, applied as a capped +0.05 additive bonus in Stage 2.

Not all knowledge sits at the same level. A big decision that led to five smaller tasks is a "root" while those tasks are "leaves." This feature measures how deep each spec-doc record sits in that tree of cause-and-effect relationships. It gives a small search boost based on that depth, acting as a tiebreaker when two results are otherwise equally relevant.

---

## 2. HOW IT WORKS

Not all memories sit at the same level of abstraction. A root decision that caused five downstream implementation memories occupies a different position in the knowledge graph than a leaf node.

Causal depth measures each spec-doc record's longest structural distance from a root strongly connected component. The causal graph is first condensed into SCCs, then longest-path depth is computed across the resulting DAG so shortcut edges do not suppress deeper chains and cycle members share one bounded depth layer. The raw component depth is normalized by the deepest reachable component chain to produce a [0,1] score. A spec-doc record in a component at depth 3 within a graph whose deepest reachable component chain is 6 scores 0.5.

Like momentum, the depth signal applies as an additive bonus in Stage 2, capped at +0.05. Batch computation via `computeCausalDepthScores()` shares the same session cache infrastructure as momentum. Both signals are applied together by `applyGraphSignals()`, which iterates over pipeline rows and adds the combined bonus. A single-node variant of `computeCausalDepth` was removed during Sprint 8 remediation as dead code (the batch version `computeCausalDepthScores` is the only caller).

The combined N2a+N2b adjustment is modest by design: up to +0.10 total. This keeps graph signals as a tiebreaker rather than a dominant ranking factor. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2a).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/graph/graph-signals.ts` | Lib | Graph momentum and depth signals |
| `mcp_server/lib/search/causal-boost.ts` | Lib | Causal neighbor boosting |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/causal-boost.vitest.ts` | Automated test | Causal boost tests |
| `mcp_server/tests/feature-eval-graph-signals.vitest.ts` | Automated test | Graph signal evaluation |
| `mcp_server/tests/graph-signals.vitest.ts` | Automated test | Graph signal computation |
| `mcp_server/tests/rollout-policy.vitest.ts` | Automated test | Rollout policy tests |

---

## 4. SOURCE METADATA
- Group: Graph Signal Activation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `10--graph-signal-activation/causal-depth-signal.md`
Related references:
- [graph-momentum-scoring.md](graph-momentum-scoring.md) — Graph momentum scoring
- [community-detection.md](community-detection.md) — Community detection
