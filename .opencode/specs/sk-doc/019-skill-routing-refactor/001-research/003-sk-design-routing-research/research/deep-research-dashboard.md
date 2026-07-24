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
- Topic: Diagnose sk-design skill-routing faults and apply the sk-doc typed-pair routing optimizations. Investigate the per-mode INTENT_SIGNALS/RESOURCE_MAP config, how the skill-benchmark scores routing, whether generating a leaf-manifest plus typed gold would lift measured routing, and concrete optimizations. Produce findings and a resource-map.
- Started: 2026-07-17T04:40:53Z
- Status: COMPLETE
- Iteration: 8 of 8
- Session ID: rsr-2026-07-17T04-40-53Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Classify each sk-design mode's router intent signals and resource leaves on the typed-pair surface, including the nested transport boundary. | architecture | 1.00 | 5 | complete |
| 2 | Leaf-manifest generator feasibility and byte stability for all six sk-design modes. | architecture | 1.00 | 5 | complete |
| 3 | Scenario classification and independent typed-gold eligibility for the current playbook and frozen benchmark corpus. | measurement | 1.00 | 5 | complete |
| 4 | Fresh benchmark execution and per-dimension loss attribution for the approximately 69 CONDITIONAL baseline. | measurement | 0.90 | 5 | complete |
| 5 | Dependency order, affected artifacts, acceptance checks, and rollback boundaries for a sibling implementation packet. | implementation-planning | 0.70 | 5 | complete |
| 6 | Canonical question closure and contradiction audit for the six-mode (workflowMode, leafResourceId) mapping. | evidence-reconciliation | 0.10 | 5 | insight |
| 7 | Stress-test nested transport attribution and dominant-mode narrowing for transport-only, design-only, and transport-plus-design scenarios. | edge-case-hardening | 0.70 | 5 | complete |
| 8 | Freeze the implementation acceptance matrix and verify reproducibility/implementability without source mutation. | acceptance-verification | 0.50 | 5 | complete |

- iterationsCompleted: 8
- keyFindings: 45
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] How do the six sk-design modes map to independent `(workflowMode, leafResourceId)` gold pairs?
- [x] Can one byte-stable leaf manifest represent the parent hub and nested design-mcp-open-design transport?
- [x] Which benchmark scenarios are genuine routing decisions eligible for independently authored typed gold?
- [x] Which scoring dimensions cause the approximately 69 CONDITIONAL baseline, and are they measurement gaps or routing faults?
- [x] What dependency-ordered optimizations can an implementation packet apply without more research?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████████▇▇▆▅▄▂▂▃▅▅▅▄
- score sparkline: ████████▇▇▆▅▄▂▂▃▅▅▅▄
- Last 3 ratios: 0.10 -> 0.70 -> 0.50
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.50
- coverageBySources: {"code":60,"other":41}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Flattening `design-mcp-open-design` into `interface`; the registry assigns it its own transport mode and backend, while its design gate composes rather than erases the judgment mode. [SOURCE: .opencode/skills/sk-design/mode-registry.json:145-162] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md:40-47] (iteration 1)
- Treating the hub's six packet `SKILL.md` entrypoints or four shared default resources as an independent seventh `workflowMode`; the registry defines only six modes and the hub explicitly routes to packet entrypoints. [SOURCE: .opencode/skills/sk-design/mode-registry.json:38-164] [SOURCE: .opencode/skills/sk-design/hub-router.json:13-18] (iteration 1)
- Using packet-qualified paths such as `design-motion/references/...` as `leafResourceId`; the canonical identity requires packet-root-relative resource IDs. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:68-84] (iteration 1)
- Excluding the transport from generation because its `packetKind` differs: the generator consumes `workflowMode` and `packet`, not `packetKind`, and the read-only probe emitted the transport namespace. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:91-108] (iteration 2)
- Treating absent `leaf-aliases.json` as a generation blocker: absence explicitly means zero aliases. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:17-19] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-67] (iteration 2)
- Using `--check` against a missing committed manifest as evidence of nondeterminism: that path reports a missing prerequisite before comparing bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:143-161] (iteration 2)
- Assigning one aggregate pair set to multi-prompt batteries was rejected because it obscures which prompt selected which mode and can exceed the selected-map union semantics. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:70-80] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:203-219] (iteration 3)
- Automatic backfilling of typed gold from benchmark traces or router predictions is invalid oracle construction and should not be promoted as an implementation path. (iteration 3)
- Gold-equals-prediction: deriving expected pairs from current router output was rejected because it makes the measured system its own oracle. [INFERENCE: based on Finding 1] (iteration 3)
- Shared hub resources cannot be made packet-local typed leaves by generic path inference; PB-006 needs an explicit contract decision rather than a guessed pair. (iteration 3)
- Treating a correct typed pair as proof of pipeline, safety, or response quality was rejected; the playbook's acceptance contract grades those independently. [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:110-127] (iteration 3)
- Typing advisor-negative scenarios as positive sk-design leaf routes was rejected because their expected outcome is another skill winning. [SOURCE: .opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:197-199] (iteration 3)
- Re-running the default current playbook through the benchmark runner cannot yield dimension evidence while its 27 feature references are unreadable. Repeating that command without first reconciling path topology is exhausted for this focus. [SOURCE: command output: non-mutating in-memory `run-skill-benchmark.cjs` execution, 2026-07-17T04:58Z] (iteration 4)
- Treating `after_d3_proxy` aggregate 100 as proof that routing improved: D3 became inapplicable and dropped out while D1-intra and D2 stayed at their prior 100 values. [SOURCE: .opencode/skills/sk-design/benchmark/after_d3_proxy/skill-benchmark-report.json:29-56] (iteration 4)
- Treating D1-inter or D4 as contributors to the 31-point baseline shortfall: both are excluded from the Mode-A denominator rather than scored zero. [SOURCE: .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json:29-61] (iteration 4)
- Treating the fresh `NO-SCENARIOS` result as a current routing score: no scenario row reached scoring, so only D5 connectivity was observed. [SOURCE: command output: non-mutating in-memory `run-skill-benchmark.cjs` execution, 2026-07-17T04:58Z] (iteration 4)
- Aggregate-only optimization is exhausted: neither 69 nor 100 identifies a router-quality change without comparable typed rows and stable dimension applicability. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-004.md:9-13] (iteration 5)
- Combining path repair, manifest generation, typed-gold authoring, and router-map edits in one change; this destroys causal attribution and makes rollback cross-contaminate measurement and quality lanes. [INFERENCE: based on Findings 1-5] (iteration 5)
- Editing `INTENT_SIGNALS`, `RESOURCE_MAP`, `mode-registry.json`, or `hub-router.json` before a valid typed run identifies a pair-level failure; current evidence does not prove such a fault. [SOURCE: .opencode/skills/sk-design/benchmark/README.md:29-39] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-004.md:9-13] (iteration 5)
- Inventing shared aliases to make a fixture pass; aliases require an explicit route contract and a demonstrated scenario need. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-002.md:9-10] (iteration 5)
- Overwriting the frozen baseline or comparing aggregates across different applicability/corpus shapes. [SOURCE: .opencode/skills/sk-design/benchmark/README.md:36-55] (iteration 5)
- A seventh hub mode: hub entrypoints and defaults do not create another `workflowMode`. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-001.md:20-25] (iteration 6)
- Flattening `design-mcp-open-design` into `interface`: the registry and later manifest evidence preserve its independent transport namespace. [SOURCE: .opencode/skills/sk-design/mode-registry.json:145-162] [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-002.md:7-10] (iteration 6)
- Packet-qualified `leafResourceId` values: the public contract requires packet-root-relative IDs. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:68-84] (iteration 6)
- A universal cardinality rule such as “one selected mode equals one typed pair” is invalid because selected modes and expected leaves are independently plural. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:70-100] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:203-219] (iteration 7)
- Assigning multiple judgment modes or all candidate leaves to an ambiguous design prompt; candidate naming triggers clarification or a stated narrowing assumption, not hedge-everything gold. [SOURCE: .opencode/skills/sk-design/SKILL.md:54-57] (iteration 7)
- Treating a RUN request as transport-only because `design-mcp-open-design` is a distinct public mode; generation still has a mandatory design-judgment precondition. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:82-96] (iteration 7)
- Treating every Open Design mention as a two-mode bundle; WIRE and bare inventory are explicit transport-only exemptions. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md:40-47] (iteration 7)
- Aggregate-only optimization remains exhausted: the frozen 69 and proxy 100 have different applicability and cannot prove routing improvement. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-005.md:18-22] (iteration 8)
- Editing router maps before a valid typed rerun exposes a pair-level failure. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-005.md:13-19] (iteration 8)
- Running manifest `--check` before authoring the manifest; the command reports a missing prerequisite, not nondeterminism. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:143-161] (iteration 8)
- Treating a correct two-mode route as complete multi-pair leaf gold when the judgment-leaf oracle is absent. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-007.md:12-13] (iteration 8)

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
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
