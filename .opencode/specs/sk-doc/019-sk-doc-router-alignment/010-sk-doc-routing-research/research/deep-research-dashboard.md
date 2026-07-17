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
- Topic: sk-doc routing foundation diagnosis and optimization
- Started: 2026-07-16T05:29:50.043Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-20260716-052950-sk-doc-routing
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Map the sk-doc hub routing surface and enumerate literal registry-to-vocabulary alias gaps. | - | 0.90 | 0 | complete |
| undefined | Resolve the ~34 premise mismatch and establish whether router-replay reads current hub config or a snapshot. | - | 0.90 | 0 | complete |
| undefined | Trace zero-recall and 65-resource Mode-B scenarios end-to-end, then classify all 19 sk-doc rows by first causal loss. | - | 0.95 | 0 | complete |
| undefined | Answer Q2 by tracing standalone packet-root paths, parent-hub-qualified paths, and their undefined serialization handoff across the six wrong-root rows. | - | 0.88 | 0 | complete |
| undefined | Answer Q4 by tracing routing-registry-drift-guard and adjacent parent-hub validators across equality, existence, namespace, leaf coverage, fixture validity, and provenance. | - | 0.86 | 0 | complete |
| undefined | Answer Q5 with the prioritized implementable sk-doc routing fix list in dependency order. | - | 0.74 | 0 | complete |
| undefined | Pressure-test typed (workflowMode, leafResourceId) public IDs across duplicate filenames, shared aliases, N-to-1 packet multiplexing, sk-code second-layer routing, migration compatibility, and regression safety. | - | 0.61 | 0 | complete |
| undefined | Pressure-test generated-manifest reproducibility, drift detection, alias ownership, orphan handling, selected-map reachability, and fixture-gate attribution. | - | 0.58 | 0 | complete |
| undefined | Final implementability review: shared normalization, single guard ownership, smallest safe file set, and acceptance matrix preserving clean rows and D5=100. | - | 0.44 | 0 | complete |
| undefined | Terminal consistency audit: exact test-command coverage, owner/file/acceptance completeness, contradiction resolution, and implementer readiness. | - | 0.24 | 0 | complete |

- iterationsCompleted: 10
- keyFindings: 82
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Q1: Are the ~34 mode-registry.json aliases that lack literal hub-router.json vocabularyClass counterparts under-scored or invisible to the benchmark scorer (router-replay.cjs projectHubRouter / buildRegistryIndex / buildHubRouteTelemetry), and does that alias-coverage gap explain sk-doc's ~19% exact-resource recall? [legacy-import]
- [ ] Q2: Do the create-skill sub-skill's routing templates (skill_smart_router.md teaching and the JSON config it emits) steer models toward the wrong path-root convention (create-* prefixed paths instead of root-relative references/… paths)? [legacy-import]
- [ ] Q3: How exactly does the skill-benchmark scorer read hub router config, gold answers, fitted-vs-holdout splits, and dimensions D1intra / D2 / D3 / D5 for a hub skill like sk-doc — and at which scoring stage does sk-doc lose the most points (path-root mismatch, over-bundling penalty, or missing alias projection)? [legacy-import]
- [ ] Q4: Does routing-registry-drift-guard already catch the alias-coverage gap between mode-registry.json and hub-router.json vocabularyClasses; if not, what specific guard check is missing? [legacy-import]
- [ ] Q5: What is the prioritized, implementable set of optimizations to hub-router.json, mode-registry.json, command-metadata.json, and the create-skill routing templates — each tied to the benchmark failure mode it addresses (wrong path-root, over-bundling, alias invisibility)? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Q1: Are the ~34 mode-registry.json aliases that lack literal hub-router.json vocabularyClass counterparts under-scored or invisible to the benchmark scorer (router-replay.cjs projectHubRouter / buildRegistryIndex / buildHubRouteTelemetry), and does that alias-coverage gap explain sk-doc's ~19% exact-resource recall?
- [ ] Q2: Do the create-skill sub-skill's routing templates (skill_smart_router.md teaching and the JSON config it emits) steer models toward the wrong path-root convention (create-* prefixed paths instead of root-relative references/… paths)?
- [ ] Q3: How exactly does the skill-benchmark scorer read hub router config, gold answers, fitted-vs-holdout splits, and dimensions D1intra / D2 / D3 / D5 for a hub skill like sk-doc — and at which scoring stage does sk-doc lose the most points (path-root mismatch, over-bundling penalty, or missing alias projection)?
- [ ] Q4: Does routing-registry-drift-guard already catch the alias-coverage gap between mode-registry.json and hub-router.json vocabularyClasses; if not, what specific guard check is missing?
- [ ] Q5: What is the prioritized, implementable set of optimizations to hub-router.json, mode-registry.json, command-metadata.json, and the create-skill routing templates — each tied to the benchmark failure mode it addresses (wrong path-root, over-bundling, alias invisibility)?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██████▇▇▇▇▆▆▅▅▄▄▄▃▂▁
- score sparkline: ██████▇▇▇▇▆▆▅▅▄▄▄▃▂▁
- Last 3 ratios: 0.58 -> 0.44 -> 0.24
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.24
- coverageBySources: {"other":19}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **A hidden router-replay snapshot:** the implementation accepts only `skillRoot` and task text and reads router files beneath that live root. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:477] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:483] (iteration 2)
- **Command aliases as the source of `~34`:** sk-doc has no `command-metadata.json`, and the only literal `~34` source explicitly describes registry aliases versus router vocabulary. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [INFERENCE: `.opencode/skills/sk-doc/command-metadata.json` was checked and is absent] (iteration 2)
- **Gold-resource or normalized-token count:** no source associates 34 with either; the canon sentence names literal vocabulary homes, while the report's resource metrics use a different 19-scenario population. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:209] [SOURCE: .opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/artifacts/tier2-sk-doc-luna-opencode.report.json:163] (iteration 2)

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
None for Q5. The exact JSON property names are implementation-level choices, but the four path roles, conversion boundary, ownership split, and validation order are fixed by the evidence.

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
- graphConvergenceScore: 0.35
- graphDecision: STOP_BLOCKED
- Blocker: source_diversity_guard
- Blocker: evidence_depth_guard
- Blocker: unverified_claims

<!-- /ANCHOR:graph-convergence -->
