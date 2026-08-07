---
title: "Research: system-code-graph Typed-Pair Routing"
description: "Eight-iteration diagnosis of system-code-graph routing, typed-pair benchmark feasibility, and dependency-ordered optimizations."
---
# Research: system-code-graph Typed-Pair Routing

## 1. Executive Summary

The current `system-code-graph` router is physically enumerable but not typed. It discovers 55 Markdown resources across four roots, scores 11 broad intents, expands directory prefixes and filename stems, loads two defaults, and returns untyped `resources`; it emits neither a `workflowMode` nor resolvable `(workflowMode, leafResourceId)` pairs. [SOURCE: `.opencode/skills/system-code-graph/SKILL.md:103-175`] [SOURCE: `.opencode/skills/system-code-graph/SKILL.md:251-299`]

The recommended target is a standalone singleton mode named `system-code-graph`, a versioned four-root leaf contract, a deterministic 53-pair non-index manifest, and an explicit intent-to-path `RESOURCE_MAP`. Selected typed leaves, support defaults, navigation indexes, and the compatibility load trace must be separate output channels. [SOURCE: `iterations/iteration-002.md:7-10`] [SOURCE: `iterations/iteration-006.md:13-27`] [SOURCE: `iterations/iteration-007.md:13-31`]

Of the 28 playbook scenarios, 23 contain exact routing prompts suitable for typed gold and 5 are behavior/integration coverage without a stable positive routing decision. No numeric baseline is claimed: the authorized pre-change benchmark remains the first implementation step. [SOURCE: `iterations/iteration-003.md:12-24`] [SOURCE: `iterations/iteration-004.md:6-41`]

## 2. Research Scope

The loop answered five charter questions:

1. How current `INTENT_SIGNALS + RESOURCE_DOMAINS` relate to typed pairs.
2. Whether selector targets can become a discrete leaf set.
3. How to establish the first benchmark baseline.
4. Which 28 scenarios deserve typed gold.
5. Which dependency-ordered changes close the gaps.

Implementation was intentionally excluded. Eight leaf iterations produced route-proof records, cited narratives, and structured deltas. [SOURCE: `../spec.md:74-101`] [SOURCE: `deep-research-state.jsonl`]

## 3. Method

The research progressed from current-state inventory to target design, then benchmark and failure analysis:

| Iteration | Focus | newInfoRatio |
|-----------|-------|--------------|
| 1 | Current router and concrete inventory | 1.00 |
| 2 | Singleton identity and native roots | 0.98 |
| 3 | Baseline and scoring boundary | 1.00 |
| 4 | Complete scenario partition | 1.00 |
| 5 | Explicit map and rollout order | 0.90 |
| 6 | Manifest/scoring conformance simulation | 0.90 |
| 7 | Acceptance matrix and risks | 0.80 |
| 8 | Evidence reconciliation | 0.70 |

Every iteration passed `verify-iteration.cjs`, including the required route-proof fields, narrative, state append, and delta artifact.

## 4. Current Router

Confirmed current behavior:

- Four discovery roots: `references/`, `assets/`, `feature_catalog/`, and `manual_testing_playbook/`.
- Eleven broad intent keys.
- Prefix/stem selector expansion rather than explicit leaf paths.
- Two always-loaded support defaults.
- At most two selected intents when scores are within `ambiguity_delta = 1`.
- Return shape: `intents`, `ambiguous`, and `resources`.
- No canonical mode identifier and no typed leaf output.

[SOURCE: `.opencode/skills/system-code-graph/SKILL.md:98-175`] [SOURCE: `.opencode/skills/system-code-graph/SKILL.md:177-299`]

The current router is under-specific for coverage-graph, doctor, edge-confidence, and plugin/hook resources; those files are reachable only through broad package intents. [SOURCE: `iterations/iteration-001.md:37-39`]

## 5. Inventory And Enumerability

The live tree contains 55 Markdown files:

| Root | Physical Markdown | Proposed typed leaves |
|------|-------------------|-----------------------|
| `references/` | 7 | 7 |
| `assets/` | 0 | 0 |
| `feature_catalog/` | 19 | 18 |
| `manual_testing_playbook/` | 29 | 28 |
| **Total** | **55** | **53** |

The two excluded files are package indexes used for navigation. All selector targets are mechanically enumerable against the current tree, but current contract v1 rejects 48 files because it permits only `references/` and `assets/`. [SOURCE: `iterations/iteration-001.md:17-39`] [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:43-96`]

## 6. Current And Target Boundary

| Concern | Current | Recommended target |
|---------|---------|--------------------|
| Topology | Standalone skill | Remain standalone |
| Mode | None emitted | `system-code-graph` |
| Legal roots | `references/`, `assets/` in typed contract v1 | Add `feature_catalog/`, `manual_testing_playbook/` in contract v2 |
| Resource authority | `RESOURCE_DOMAINS` selectors | Explicit `RESOURCE_MAP` paths |
| Manifest generation | Parent-hub and two-root only | Standalone, four-root, Markdown-only, index-excluding |
| Typed output | None | Selected typed leaves only |
| Defaults | Mixed into `resources` | Separate `supportResources` |
| Indexes | Mixed into broad resources | Separate `navigationResources` |
| Full inventory | No typed form | Explicit `FULL_INVENTORY` over 53 leaves |

The target column is a recommendation, not shipped behavior. [SOURCE: `iterations/iteration-008.md:13-24`]

## 7. Typed Identity And Contract

The durable singleton mode should be `system-code-graph`, matching the public skill identity without converting the packet into a parent hub. The two native package roots should become direct legal roots in a versioned contract rather than synthetic aliases. [SOURCE: `iterations/iteration-002.md:6-10`]

The contract and generator must change atomically. Widening only the containment grammar would not make the current hub-only generator enumerate standalone four-root resources or exclude indexes. [SOURCE: `iterations/iteration-006.md:12-18`]

## 8. Benchmark Baseline

The first authorized baseline command is:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs \
  --mode=skill-benchmark \
  --skill=.opencode/skills/system-code-graph \
  --outputs-dir=.opencode/skills/system-code-graph/benchmark/baseline \
  --trace-mode=router
```

The baseline must record the command, tree identity, loaded and scored scenario counts, parse warnings, D1/D2/D3/D5 coverage, report digest, and rerun stability. It is an untyped/flat-gold baseline because no manifest or typed scenario gold currently exists. [SOURCE: `iterations/iteration-003.md:12-24`]

Pre-contract and post-contract aggregate scores are not directly comparable because the oracle, resource representation, and measured dimensions change. Compare dimensions, error classes, exclusions, and coverage rather than aggregate score alone. [SOURCE: `iterations/iteration-003.md:14-21`]

## 9. Scenario Typed-Gold Partition

Twenty-three scenarios are eligible because each contains an exact positive prompt capable of selecting its own leaf. The complete item-by-item paths and citations are in `iterations/iteration-004.md:9-32`.

Five remain outside positive typed gold:

| Scenario | Reason |
|----------|--------|
| `code_graph_query_blast_radius.md` | Procedure without exact benchmark prompt |
| `code_graph_apply_sub_operations.md` | Multi-operation procedure without one stable prompt |
| `detect_changes_multi_file_diff.md` | Hand-constructed procedure without exact prompt |
| `code_graph_freshness_guard.md` | Automatic post-mutation trigger |
| `code_graph_plugin.md` | Session/plugin integration behavior |

[SOURCE: `iterations/iteration-004.md:34-50`]

## 10. Proposed Resource Map

The implementation proposal contains 37 intent keys and 35 unique live leaves:

- 7 reference leaves.
- 5 feature leaves.
- 23 exact scenario leaves.
- 0 dead paths.

Two paths are intentionally reused by multiple intents. Eighteen authorized leaves remain intentionally unmapped: 13 feature leaves and the 5 non-routing scenarios. `FEATURES` and `PLAYBOOK` should navigate via package indexes outside typed output; `FULL_INVENTORY` should emit all 53 authorized pairs. [SOURCE: `iterations/iteration-005.md:11-73`] [SOURCE: `iterations/iteration-006.md:20-27`]

The exact proposed `RESOURCE_MAP` is canonical in `iterations/iteration-005.md:25-66`.

## 11. Scoring Implications

Typed gold engages only when both a committed manifest and scenario-level `expected_leaf_resources` exist. A valid row without a router resource contract fails as `routing_contract_error`; malformed or unresolved oracle gold is excluded as topology error. [SOURCE: `iterations/iteration-003.md:15-16`]

If defaults remain mixed with one selected leaf, typed recall can be `1/1` while D3 precision is only `1/3`. The router and replay must therefore agree on a selected-leaf channel distinct from support defaults. With that separation, the target gate is 23/23 typed recall and selected-pair D3 of 1.0, not a fabricated current score. [SOURCE: `iterations/iteration-006.md:24-27`] [SOURCE: `iterations/iteration-007.md:23-29`]

## 12. Recommendations

1. Capture the immutable unmodified baseline before source changes.
2. Version the leaf contract and readers for four roots.
3. Add deterministic standalone manifest generation for exactly 53 non-index Markdown leaves.
4. Replace `RESOURCE_DOMAINS` with one explicit `RESOURCE_MAP`; keep no second active authority.
5. Emit four channels: compatibility load trace, selected typed leaves, support defaults, and navigation indexes.
6. Add exact-key specificity while preserving no-score fallback and genuine two-intent ambiguity.
7. Add explicit `FULL_INVENTORY` behavior.
8. Author typed gold for exactly 23 scenarios after the router can satisfy it.
9. Promote only after all topology, accuracy, efficiency, and parity gates pass.

[SOURCE: `iterations/iteration-005.md:69-73`] [SOURCE: `iterations/iteration-007.md:18-35`]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iterations |
|----------|-------------------|----------|------------|
| Treat selectors as leaf IDs | Prefixes/stems are selectors, not resolvable files | `iteration-001.md:41-49` | 1 |
| Infer a current mode | Current router emits no mode field | `iteration-001.md:17-19` | 1 |
| Count package indexes as leaves | Indexes are navigation documents | `iteration-001.md:41-45` | 1, 6 |
| Synthetic aliases | Aliases hide native ownership and require per-file indirection | `iteration-002.md:9-18` | 2 |
| Convert to parent hub | Standalone topology already supports one identity | `iteration-002.md:7-15` | 2 |
| Keep two routing authorities | `RESOURCE_DOMAINS` and `RESOURCE_MAP` would drift | `iteration-005.md:75-82` | 5 |
| Package-index broad typed routing | Indexes are unresolved under manifest replay | `iteration-006.md:24-36` | 6 |
| Aggregate-only promotion | Contract migration changes oracle and dimensions | `iteration-003.md:18-24` | 3, 7 |
| Put defaults in every typed gold row | Masks support/selection semantics and caps precision | `iteration-007.md:48-55` | 6, 7 |

## Divergence Map

No divergent pivots were run because `convergence_mode` was `off`; the loop continued to the configured eight-iteration cap. The investigated frontier broadened in a controlled sequence from inventory to identity, baseline, scenario eligibility, explicit mapping, conformance simulation, acceptance gates, and final reconciliation. No saturated direction was re-entered after being ruled out.

## 13. Open Questions

The research questions are closed. The remaining unknowns require execution, not more diagnosis:

- Actual unmodified baseline report and numeric dimensions.
- Implemented four-root manifest digest.
- Post-change typed benchmark report.
- Any contradictory evidence discovered during implementation.

No numeric baseline or post-change score is claimed. [SOURCE: `iterations/iteration-008.md:67-80`]

## 14. Risks

| Risk | Detection |
|------|-----------|
| Root syntax changes without standalone discovery | Manifest cardinality differs from 53 |
| Defaults pollute typed precision | Exact row observes three pairs instead of one |
| Indexes enter typed output | Broad route has unresolved resources |
| Map drifts after rename/addition | `35 mapped + 18 intentional-unmapped` partition changes |
| Specificity suppresses real ambiguity | Equal-specificity fixture returns one winner |
| Typed gold lands too early | Contract errors or topology exclusions appear |
| Aggregate hides exclusions | Loaded/scored denominator changes |

[SOURCE: `iterations/iteration-007.md:37-46`]

## 15. Acceptance Matrix

The implementation packet should preserve the ten executable gates from `iterations/iteration-007.md:18-29`:

- A0: immutable baseline evidence.
- A1: contract-v2 root grammar and containment negatives.
- A2: deterministic 53-pair standalone manifest.
- A3: map/startup conformance with zero dead paths.
- A4: legacy defaults, order, deduplication, and ambiguity parity.
- A5: selected typed channel with D3 `1/1`.
- A6: navigation versus `FULL_INVENTORY` separation.
- A7: all 23 exact routes and five exclusions.
- A8: negative and missing-path fail-closed guards.
- A9: post-change promotion benchmark.

## 16. Implementation Handoff

Dependency order:

1. Capture A0.
2. Atomically land A1-A2: contract/readers plus standalone generation and manifest.
3. Atomically land A3-A6 and A8: map, startup validation, four channels, replay normalization, full inventory, and parity fixtures.
4. Add A7 typed-gold coverage for the 23 eligible prompts.
5. Run A9 and promote only with zero topology errors, 23/23 recall, D3 1.0, and unchanged compatibility/fallback behavior.

This handoff is implementable without additional identity, inventory, or dependency-order research. [SOURCE: `iterations/iteration-008.md:26-33`]

## 17. References And Convergence Report

Primary evidence is indexed in `resource-map.md`. Load-bearing sources include:

- `.opencode/skills/system-code-graph/SKILL.md`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `iterations/iteration-001.md` through `iterations/iteration-008.md`

**Stop reason**: `maxIterationsReached` because convergence mode was off.  
**Iterations**: 8 / 8.  
**Questions answered**: 5 / 5 research questions.  
**newInfoRatio trend**: `1.00, 0.98, 1.00, 1.00, 0.90, 0.90, 0.80, 0.70`.  
**Corruption count**: 0.  
**Route-proof validation**: 8 / 8 passed.
