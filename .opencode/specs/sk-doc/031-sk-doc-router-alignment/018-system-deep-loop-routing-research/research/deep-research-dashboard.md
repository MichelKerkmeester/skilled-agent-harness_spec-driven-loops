---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Diagnose system-deep-loop skill-routing and apply the sk-doc typed-pair routing optimizations. It is a parent hub with 7 workflowModes over 5 child packets; each child SKILL.md carries per-mode pseudocode routers whose leaf paths are flat child-relative (references/...) rather than packet-qualified (<mode>/references/...); baseline aggregate ~71; 0 typed gold across ~319 scenarios. Investigate a hub-level surface router with packet-qualified typed pairs, how the skill-benchmark scores routing, and concrete optimizations to the routing config. Produce findings and a resource-map.
- Started: 2026-07-17T04:12:43.092Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: rsr-2026-07-17T04-12-43Z
- Parent Session: rsr-2026-07-17T04-12-43Z
- Lifecycle Mode: resume
- Generation: 1
- continuedFromRun: 5
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Map all seven workflow modes to their owning child packets and current flat leaf-resource paths, then express the implied typed-pair surface. | routing-topology | 1.00 | 5 | complete |
| 2 | Enumerate the complete set of flat child-relative leaf-ID collisions across all five child routers and validate the packet-qualified coordinate scheme. | routing-identity | 1.00 | 5 | complete |
| 3 | Trace how the skill-benchmark discovers resource manifests, validates typed routing gold, and computes mode/leaf routing scores from producer to consumer. | benchmark-scoring | 1.00 | 5 | complete |
| 4 | Classify the roughly 319 system-deep-loop playbook artifacts using benchmark-loader rules, with deterministic counts for routing candidates and typed-gold exclusions. | scenario-census | 1.00 | 5 | complete |
| 5 | Derive a dependency-ordered, implementable change plan for hub index repair, manifest generation, typed-gold authoring, hub-level routing, validation, and benchmark reruns without weakening fallback behavior. | implementation-plan | 0.90 | 5 | complete |
| 6 | Build an exact implementation verification matrix for the dependency-ordered routing plan without touching loader-ineligible files. | implementation-verification | 0.90 | 5 | complete |
| 7 | Identify the smallest mode-complete authored typed-gold slice among loader-eligible routing scenarios. | typed-gold-authoring | 1.00 | 5 | complete |
| 8 | Define the minimal authored contract for a new loader-eligible alignment routing scenario. | typed-gold-authoring | 0.80 | 5 | complete |
| 9 | Validate the complete seven-row oracle matrix for MR-001..003, IL-001..003, and proposed DA-R01. | oracle-validation | 0.80 | 5 | complete |
| 10 | Produce the final dependency-ordered resource map and implementation handoff with explicit validity transitions, acceptance gates, and residual decisions. | implementation-handoff | 0.80 | 5 | complete |

- iterationsCompleted: 10
- keyFindings: 62
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] How do the seven workflow modes currently route across the five child packets, and what typed pairs do they imply?
- [x] Which flat child-relative leaf IDs collide, and what packet-qualified coordinate scheme removes ambiguity?
- [x] How does the skill-benchmark discover, validate, and score routing gold and typed pairs?
- [x] Which of the roughly 319 scenarios are genuine routing decisions, and which must remain outside typed-gold scoring?
- [x] What dependency-ordered configuration and router changes can raise the routing score without weakening fallback behavior?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███████▇▅▅▅▅▇▇▄▁▁▁▁▁
- score sparkline: ███████▇▅▅▅▅▇▇▄▁▁▁▁▁
- Last 3 ratios: 0.80 -> 0.80 -> 0.80
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.80
- coverageBySources: {"code":120,"other":13}
- Advisory event: trend_flatline metric=newInfoRatio run=10 window=3 sparkline=▄▄▄
- Advisory event: trend_flatline metric=score run=10 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `<packet>/<leaf>` alone is a complete routing identity; three public modes share `deep-improvement`. (iteration 2)
- A packet prefix belongs inside canonical `leafResourceId`; the existing contract requires that field to begin with `references/` or `assets/` and treats packet-qualified values as legacy input. (iteration 2)
- Flat child-relative leaf IDs are globally unique; the eight-entry collision inventory disproves this. (iteration 2)
- **A scenario without typed gold should count as a typed zero.** The typed path is deliberately dormant unless the scenario declares typed gold and the target has a manifest. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1146-1168] (iteration 3)
- **Malformed or stale typed gold is a router miss.** It is an oracle fault excluded from score denominators. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1300,1499-1507] (iteration 3)
- **Typed-pair recall is an additional headline weight.** It is instead the canonical resource measure feeding the existing D1-intra, D2, and D3 lanes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1357] (iteration 3)
- “319 Markdown artifacts” means 319 normalized benchmark scenarios; the loader produces 21 today. (iteration 4)
- Broad behavior-benchmark scenario discovery does not answer this question: those fixtures are a different corpus from `manual_testing_playbook/` and do not pass through this loader. (iteration 4)
- Metadata-ineligible behavior files can safely receive inferred typed gold; typed gold is opt-in and must remain authored. (iteration 4)
- The benchmark README's 20-scenario statement is the current source of truth; the authored index and machine report both support 18. (iteration 4)
- Encoding packet prefixes inside canonical `leafResourceId`: the contract requires packet-local `references/` or `assets/` IDs. (iteration 5)
- Generating typed gold before repairing hub index paths: unreadable rows cannot be safely authored or validated. (iteration 5)
- Inferring typed gold for the 273 loader-ineligible behavior files remains blocked; no new evidence invalidated the saturated direction. (iteration 5)
- Resolving `deep-improvement` mode from packet name or declaration order: three public modes share that packet. (iteration 5)
- Treating fallback removal as a score optimization: UNKNOWN and missing-path behavior are acceptance invariants. (iteration 5)
- Accepting aggregate-score movement without the same trace mode, corpus count, D5 result, and oracle-fault count. (iteration 6)
- Loader-ineligible files remain outside this matrix. No filename-based promotion or typed-gold inference was retried. (iteration 6)
- Removing or weakening fallback branches to make typed recall appear higher. (iteration 6)
- Requiring all 35 routing candidates to receive typed gold in the first slice without scenario-intent review. (iteration 6)
- Treating the frozen 20-row README statement as the post-repair loader count; direct loader output is the count authority. (iteration 6)
- `AI-002` as one row covering three independently scored modes: the index-table derivation retains one dominant mode. (iteration 7)
- Calling the six-row seed “mode-complete”: it omits the registered alignment mode. (iteration 7)
- No existing loader-eligible scenario supplies authored alignment-route intent. This is a corpus gap, not a search gap; further filename inspection cannot close it. (iteration 7)
- Treating any `DAL-*` feature filename or narrative as alignment typed gold: those files are loader-ineligible under the current corpus contract. (iteration 7)
- `full_inventory_intent` was excluded because this is a selected scope route, not a request to enumerate the complete alignment packet. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:375-403] (iteration 8)
- Adapter-specific leaves were excluded from the minimal gold because the proposed prompt supplies neither an authority nor adapter dispatch-context field; expecting adapter resources would make the oracle depend on context it did not author. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:117-126,172-181,227-228] (iteration 8)
- Existing `DAL-*` documents remain unapproved for promotion. This iteration closed the coverage gap by specifying a new authored fixture and did not retry filename-based inference. (iteration 8)
- Packet-qualified values such as `deep-alignment/references/scoping_protocol.md` were excluded from `leaf_resource_id`; the typed parser and alignment router both operate on child-local paths. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-139] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:143-155] (iteration 8)
- Adding only `DA-R01` YAML frontmatter under the indexed hub playbook: the index branch ignores off-index files and does not parse typed frontmatter on indexed files. (iteration 9)
- Calling the seven rows oracle-valid merely because they cover seven modes: loader reachability and authored typed gold are independent gates. (iteration 9)
- Encoding packet prefixes inside canonical `leaf_resource_id`: the canonical pair remains `{workflowMode, child-local leafResourceId}`. (iteration 9)
- Further inspection of existing loader-ineligible `DAL-*` files cannot repair the hub loader-shape mismatch and was not retried. (iteration 9)
- Treating the cap as a leaf-count limit: it is a simultaneous-workflow-mode cap of two. (iteration 9)
- Aggregate-score-only acceptance remains invalid because it cannot distinguish oracle faults, routing defects, corpus drift, and fallback regression. (iteration 10)
- Embedding packet prefixes in canonical `leafResourceId` or inferring the three improvement modes from their shared packet. (iteration 10)
- Further corpus-wide filename inference remains saturated and cannot authorize typed gold or loader-ineligible promotion. (iteration 10)
- Promoting loader-ineligible files to make the first slice appear broader. (iteration 10)
- Running the scored benchmark before loader, manifest, topology, and fallback gates pass. (iteration 10)
- Treating router-derived candidate leaves as author-approved fixture gold without review. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- Blocker: ERR_MODULE_NOT_FOUND: better-sqlite3

<!-- /ANCHOR:graph-convergence -->
