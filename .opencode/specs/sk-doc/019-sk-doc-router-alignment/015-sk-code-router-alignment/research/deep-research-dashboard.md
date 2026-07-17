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
- Topic: Diagnose sk-code skill-routing faults and optimize them, applying the sk-doc typed-pair routing standard. Carry in verified evidence that sk-code scores about 65/100 with 18/18 surface routing but about 50% leaf-file recall; packet 015 produced leaf-manifest.json and manifest-gated typed-gold derivation with mean typedPairRecall 0.729 over 14 scenarios; investigate the untyped DEFAULT_RESOURCE preamble routing_contract_error, benchmark scoring, shared manifest qualification, and concrete routing template, logic, and JSON configuration optimizations.
- Started: 2026-07-17T03:38:47Z
- Status: INITIALIZED
- Iteration: 8 of 8
- Session ID: rsr-2026-07-17T03-38-47Z
- Parent Session: rsr-2026-07-17T03-38-47Z
- Lifecycle Mode: resume
- Generation: 1
- continuedFromRun: 1

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Trace the sk-code router configuration and manifest contract end to end, establishing the exact source of the untyped preamble and the leaf-recall gap. | architecture | 0.80 | 5 | complete |
| 2 | How does the full benchmark pipeline combine router replay, D1-D5, typed-pair recall, and fitted-versus-holdout scoring? | benchmark-architecture | 0.90 | 5 | complete |
| 3 | How do INTENT_SIGNALS, RESOURCE_MAP, and DEFAULT_RESOURCE influence recall outside the deterministic assembly path? | runtime-boundary | 0.88 | 4 | complete |
| 4 | Trace live Mode B leaf-load behavior for INTENT_SIGNALS, RESOURCE_MAP, and DEFAULT_RESOURCE, separating scored declarations from observable reads and missing causal telemetry. | live-telemetry | 0.88 | 4 | complete |
| 5 | Determine whether the universal preamble should become a real shared manifest mode, comparing declared-mode, authored-alias, and exclusion contracts and their metric invariants. | typed-contract | 0.80 | 5 | complete |
| 6 | Rank concrete INTENT_SIGNALS, RESOURCE_MAP, router-template, scoring-logic, leaf-manifest, and benchmark-JSON optimizations by recall gain, risk, and validation burden. | optimization-ranking | 0.90 | 5 | complete |
| 7 | Specify fitted, holdout, negative, topology-mutation, D3-waste, typed-contract, live-mode, and frozen 18/18 surface-routing gates that distinguish generalization from fixture fitting. | validation-anti-gaming | 0.90 | 5 | complete |
| 8 | Finalize universal-preamble ownership, live observed-leaf provenance, and synthesis-ready falsifiable recommendations. | synthesis-contract-provenance | 0.50 | 5 | complete |

- iterationsCompleted: 8
- keyFindings: 38
- openQuestions: 2
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/5
- [x] How does the skill-benchmark compute router replay, D1-D5, typed-pair recall, and fitted-versus-holdout results?
- [x] Which routing template, scoring logic, and JSON artifact changes are most likely to lift leaf-file recall?
- [x] What validation matrix can distinguish fitted gains from holdout generalization and prevent metric gaming?
- [ ] How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` actually influence leaf selection and recall? [legacy-import]
- [ ] Does packet-qualifying the universal preamble as a shared manifest mode clear `routing_contract_error` without degrading surface routing? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` actually influence leaf selection and recall?
- [ ] Does packet-qualifying the universal preamble as a shared manifest mode clear `routing_contract_error` without degrading surface routing?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▇███████▇▇▆▇████▆▄▁
- score sparkline: ▆▇███████▇▇▆▇████▆▄▁
- Last 3 ratios: 0.90 -> 0.90 -> 0.50
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.50
- coverageBySources: {"code":105,"other":9}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Simple path-prefix rewrite only:** replacing `references/...` with `shared/references/...` cannot resolve typed identity because `shared` is neither a declared packet/mode nor an authored alias. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-275] [SOURCE: .opencode/skills/sk-code/mode-registry.json:21-99] (iteration 1)
- **Treating `routing_contract_error` as the cause of low recall:** unresolved preamble entries explain the error class, but baseline hit/expected counts independently show missed expected leaves. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:431-440] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1620-1629] (iteration 1)
- Treating a Mode A aggregate as if all D1-D5 weights were always present: unavailable dimensions are excluded and measured weights are renormalized. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1078] (iteration 2)
- Using the current baseline's fitted score as evidence of holdout generalization: its holdout partition is empty. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1-65] (iteration 2)
- Assuming the parent machine-readable router directly drives hub mode/surface packet selection; the hub's documented route function uses registry and hub-router decisions instead. [SOURCE: .opencode/skills/sk-code/SKILL.md:50-57] [SOURCE: .opencode/skills/sk-code/SKILL.md:86-120] (iteration 3)
- Treating prompt-only Mode A misses as proof of live leaf-file misses when CWD/target-path evidence is intentionally absent. [SOURCE: .opencode/skills/sk-code/benchmark/fixtures/sk_code/sk-code-loadspeed-001.private.json:18] (iteration 3)
- Treating `raw.observedReads` as proof that a particular router input caused a read; this channel is path extraction from tool inputs and is diagnostic rather than scored provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:286-326] (iteration 4)
- Treating live D2/D3 labels as proof that exact observed file loads currently drive those scores; the canonical rows still declare proxy measurements. [SOURCE: .opencode/skills/sk-code/benchmark/live_final/skill-benchmark-report.json:76-100] (iteration 4)
- A manifest-only hidden `shared` entry: the generator derives modes from the registry, and the hub authority requires every registry mode in router signals and tie-break policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:111-129] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:317-329] (iteration 5)
- Multiple aliases with the same shared disk path to simulate mode-neutral ownership: shared resolution returns the first matching alias, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236] (iteration 5)
- Prefix-only rewriting and silent exclusion: the former is already blocked, and the latter is fail-open behavior absent from the authority. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:239-275] (iteration 5)
- Treating `shared` as a manifest-only non-routable mode under the current registry schema. It cannot simultaneously be an ordinary declared mode for leaf identity and remain absent from hub-router conformance. (iteration 5)
- Treating universal preamble resources as outside the typed contract without adding an explicit, validated exclusion category. (iteration 5)
- Broadly adding keywords to `INTENT_SIGNALS` before resource-map tiering: under unit weights and near-tie unioning this can only activate more monolithic rows, so it has an uncontrolled D3 cost. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:411-459] (iteration 6)
- Editing `leaf-manifest.json` or generated benchmark report JSON as a way to claim leaf recall: these alter identity/measurement artifacts after raw routing and do not select missing raw resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:629-655] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:427-475] (iteration 6)
- Generated-report editing is definitively invalid as an optimization path because it changes neither the router nor independent gold. (iteration 6)
- Manifest-only recall optimization is definitively exhausted; retain manifest work only as typed-contract remediation. (iteration 6)
- Treating the committed D3 values as an exhaustive waste oracle: authored sk-code scenarios use minimum pass criteria but the scorer assumes complete equality gold. [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/surface_detection/webflow_detection.md:84-89] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:241-291] (iteration 6)
- A holdout created or edited after candidate inspection is contaminated and must be regenerated independently rather than relabeled. (iteration 7)
- Accepting fitted-score improvement without a non-empty sealed holdout partition; the current null holdout cannot prove generalization. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:13-20] (iteration 7)
- Aggregate-only acceptance is definitively invalid: conjunctive surface, topology, suppression, and contract invariants can be averaged away. (iteration 7)
- Selecting thresholds after seeing candidate output; this turns acceptance criteria into fixture fitting. [INFERENCE: a post-hoc threshold is conditional on the candidate result and therefore is not independent evidence] (iteration 7)
- Treating generated report JSON, manifest edits, or typed-error removal as raw recall gain; those artifacts can change without selecting a missing expected leaf. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/iterations/iteration-006.md:15-17] (iteration 7)
- Using current `raw.observedReads` as actual ordered-load evidence; it is a deduplicated extraction from tool inputs without causal provenance or order metrics. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327] (iteration 7)
- An ordinary `shared` registry mode as an identity-only fix: it changes hub topology and therefore cannot inherit the raw-route/surface-invariance claim. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:463-488] (iteration 8)
- Current `raw.observedReads` as ordered actual-load or causal evidence: it regex-extracts tool inputs and deduplicates paths without success, order metrics, or router-input provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:279-327] (iteration 8)
- Multiple aliases for one shared disk path: the resolver returns the first match, making ownership order-dependent. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:227-236] (iteration 8)
- Re-running deterministic traces or editing generated manifest/report JSON to claim recall; both directions are already exhausted and do not measure live use or select a missing raw leaf. [SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment/research/deep-research-strategy.md:117-135] (iteration 8)
- Silent exclusion of the preamble from the typed contract remains fail-open and unsupported; only an explicit validated category can represent a non-leaf/shared owner. (iteration 8)
- Static source inspection cannot prove actual live leaf recall, read order, or post-change 18/18 invariance. Those require instrumented, same-revision experiments. (iteration 8)

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
How do `INTENT_SIGNALS`, `RESOURCE_MAP`, and the always-loaded `DEFAULT_RESOURCE` influence recall outside the already-confirmed deterministic assembly path?

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
