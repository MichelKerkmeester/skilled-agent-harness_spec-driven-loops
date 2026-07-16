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
- Topic: standalone deep-context deprecation impact and connected surfaces
- Started: 2026-07-04T11:20:19Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: rsr-2026-07-04T11-20-19Z
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
| 1 | Inventory command/YAML/agent/skill entrypoints and classify active standalone deep-context surfaces | entrypoint-inventory | 1.00 | 8 | complete |
| 2 | Advisor projection, skill graph metadata, and discoverability paths that can still recommend or expose standalone deep-context | advisor-discoverability | 0.92 | 6 | complete |
| 3 | Classify unique standalone deep-context capabilities that must migrate or be intentionally dropped | capability-migration-taxonomy | 0.86 | 7 | complete |
| 4 | Map portable deep-context capabilities into deep-research outputs and workflow surfaces | deep-research-output-mapping | 0.93 | 6 | complete |
| 5 | Map portable deep-context capabilities into deep-review outputs and verdict/report surfaces | deep-review-output-mapping | 0.96 | 7 | complete |
| 6 | classify safe cleanup/deprecation sequencing and dependency constraints | deprecation-sequencing | 0.91 | 8 | complete |
| 7 | classify generated/mirrored/historical cleanup boundaries | cleanup-boundary-classification | 0.89 | 7 | complete |
| 8 | classify tests, fixtures, benchmark retirement, generated-contract validation, runtime context branches, and CI/index refresh gates implicated by /deep:context redirect/stub and eventual standalone removal | tests-fixtures-verification-gates | 0.86 | 7 | complete |
| 9 | build implementation verification matrix and rollback/defer decisions from all prior findings | implementation-verification-matrix | 0.82 | 6 | complete |
| 10 | final cross-check and consolidation of safe/defer/archive/history/false-positive decisions | final-cross-check | 0.52 | 6 | complete |

- iterationsCompleted: 10
- keyFindings: 75
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Which live command, YAML, agent, nested skill, registry, advisor, runtime, test, and docs surfaces still expose or depend on standalone `deep-context`? [legacy-import]
- [ ] Which references are active runtime behavior versus generated metadata, tests/fixtures, mirrors, historical archives, or false positives? [legacy-import]
- [ ] What unique `deep-context` capabilities must be migrated into `deep-research` and what artifact/schema changes would carry them safely? [legacy-import]
- [ ] What unique `deep-context` capabilities must be migrated into `deep-review` and what verdict/report changes would carry them safely? [legacy-import]
- [ ] Which cleanup steps are safe now, which should be staged as redirect/archive, and which internal runtime cleanup should be deferred behind tests? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Which live command, YAML, agent, nested skill, registry, advisor, runtime, test, and docs surfaces still expose or depend on standalone `deep-context`?
- [ ] Which references are active runtime behavior versus generated metadata, tests/fixtures, mirrors, historical archives, or false positives?
- [ ] What unique `deep-context` capabilities must be migrated into `deep-research` and what artifact/schema changes would carry them safely?
- [ ] What unique `deep-context` capabilities must be migrated into `deep-review` and what verdict/report changes would carry them safely?
- [ ] Which cleanup steps are safe now, which should be staged as redirect/archive, and which internal runtime cleanup should be deferred behind tests?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▆▆▇▇▇▇▇▇▆▆▆▆▆▅▃▁
- score sparkline: █▇▇▆▆▆▇▇▇▇▇▇▆▆▆▆▆▅▃▁
- Last 3 ratios: 0.86 -> 0.82 -> 0.52
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.52
- coverageBySources: {"code":277,"other":2}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A whole-repo `deep-context` reference sweep was not attempted in this iteration because the dispatcher provided exact priority files and the iteration budget was reserved for cited entrypoint classification. (iteration 1)
- Generated compiled contracts under `.opencode/commands/deep/assets/compiled/` were not read because the active source mapping is already established by `render-command-contract.cjs` and `compile-command-contracts.cjs` in this focused pass. [INFERENCE: based on .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:17 and .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:46] (iteration 1)
- No dead-end evidence source was exhausted. Candidate for later reducer consideration: treat “manual whole-repo search before source-mapped entrypoints are classified” as low-yield for this focus. (iteration 1)
- Did not perform a whole-repo `deep-context` reference sweep because strategy marks broad whole-repo searching as blocked for this run stage; this pass used targeted advisor/projection/metadata paths instead. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:80] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:82] (iteration 2)
- Did not run live `advisor_recommend` prompt probes; static projection, graph metadata, and drift-guard sources directly answer the discoverability-path question, while live ranking confidence can be sampled in a later verification pass. [INFERENCE: based on .opencode/skills/system-skill-advisor/feature_catalog/scorer-fusion/projection.md:26 and .opencode/skills/deep-loop-workflows/graph-metadata.json:76] (iteration 2)
- Did not treat compiled generated command contracts as primary evidence because this iteration focused on advisor projection and graph metadata rather than command-contract output. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:87] (iteration 2)
- Drift-guard-only validation is insufficient for metadata-routed context deprecation, because the projection freshness hash excludes metadata modes. [INFERENCE: based on .opencode/skills/deep-loop-workflows/mode-registry.json:29 and .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:160] (iteration 2)
- Projection-map-only cleanup is a dead end for deprecating standalone `deep-context`: the mode is metadata-routed and excluded from alias projections, so generated alias projection edits alone would leave graph metadata discoverability intact. [INFERENCE: based on .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:106, .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2545, and .opencode/skills/deep-loop-workflows/graph-metadata.json:76] (iteration 2)
- Carrying `deep-context` convergence thresholds directly into sibling loops is a dead end because the context loop uses reuse-first saturation and agreement/relevance guards, while this research run's protocol separately warns that deep-loop thresholds are mode-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/feature_catalog/04--convergence-detection/context-coverage-signals.md:22] [INFERENCE: based on the deep-research agent convergence-threshold contract] (iteration 3)
- Did not exhaustively read every manual testing scenario; targeted summary and exact capability lines were sufficient for this taxonomy, while detailed test-migration classification remains separate. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/changelog/v1.0.0.0.md:43] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/05--context-report-synthesis/context-report-assembly.md:15] (iteration 3)
- Did not run a whole-repo `deep-context` reference sweep because the strategy marks that broad approach blocked for this run stage; this pass used the dispatcher-provided exact capability surfaces. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:83] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:84] (iteration 3)
- Did not use compiled generated command contracts as primary evidence because source YAML sections already define the active output paths and events for this capability classification. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:99] [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:686] (iteration 3)
- Removing only command or advisor projection surfaces is not enough to preserve behavior; the unique capabilities live in report schema, registry buckets, confidence/coverage signals, state artifacts, and downstream consumer contracts. [INFERENCE: based on Findings 1-6] (iteration 3)
- Do not migrate standalone context analyzer seats, dedicated context packet directories, or literal `lowConfidence`/agreement-gate reducer buckets as first-class `deep-research` artifacts; keep their useful outputs as methodology/confidence/gap annotations. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:35] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/references/state/state_reducer_registry.md:134] (iteration 4)
- Do not promote `resource-map.md` into a semantic Context Report replacement; the confirmed live design is a citation-derived coverage ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/feature_catalog/loop-lifecycle/resource-map-emission.md:21] (iteration 4)
- Migrating `deep-context` relevance/agreement thresholds directly into `deep-research` convergence was ruled out because the strategy marks threshold transfer as blocked and the `deep-research` agent defines a different newInfoRatio convergence semantic. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:91] [SOURCE: .opencode/agents/deep-research.md:49] (iteration 4)
- Treating the compiled generated command contract as the primary source was avoided because the strategy already blocks using compiled contracts as primary evidence for active output paths; it was used only as corroborating command-surface evidence for setup/default fields. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:116] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:168] (iteration 4)
- Writing migrated semantic fields into config was ruled out because the command contract uses config for run controls and resource-map toggles, while YAML state paths identify separate output artifacts for research and resource maps. [SOURCE: .opencode/commands/deep/assets/deep_research_presentation.txt:19] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:118] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:119] (iteration 4)
- Migrating `deep-context` agreement/relevance thresholds into `deep-review` verdict or convergence was ruled out because review verdicts are severity/gate based and claim confidence is finding-local. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/verdicts.md:25] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/feature_catalog/severity-system/claim-adjudication.md:25] (iteration 5)
- No new dead-end evidence source was exhausted. Candidate reducer promotion: do not migrate `context-report.json` or raw REUSE Catalog tables as mandatory `deep-review` artifacts; map only the subset that supports review scope, findings, gates, report seeds, or traceability. [INFERENCE: based on Findings 2-7] (iteration 5)
- Treating `review/resource-map.md` as a semantic Context Report was ruled out because the confirmed review contract emits it from review deltas as a per-file evidence ledger. [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/synthesis-save-and-guardrails/resource-map-emission.md:15] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1382] (iteration 5)
- Using compiled generated contracts as primary evidence was avoided because strategy already marks compiled contracts as blocked for active output-path classification; this iteration used the generated router only to confirm `/deep:review` command dispatch shape. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:118] [SOURCE: .opencode/commands/deep/review.md:9] (iteration 5)
- Candidate reducer promotion: internal runtime cleanup should be deferred behind a test rewrite/removal decision rather than grouped with public deprecation edits. (iteration 6)
- Deleting `.opencode/skills/deep-loop-workflows/deep-context/` before command-contract source cleanup was ruled out because `compile-command-contracts.cjs` still lists that packet's skill, references, assets, and agent as source paths. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:54] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:60] (iteration 6)
- Early runtime loop-type removal was ruled out because `convergence.cjs`, `fanout-run.cjs`, coverage-graph signals, and tests still encode `context` as a live runtime-loop branch. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:659] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:541] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:568] (iteration 6)
- No new evidence source was exhausted. Candidate reducer promotion: treat “delete packet before redirect + registry/advisor cleanup + contract-generator cleanup” as blocked. (iteration 6)
- Projection-map-only cleanup was ruled out again for sequencing because context is metadata-routed and still discoverable through hub graph metadata. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76] (iteration 6)
- A whole-repo `deep-context` sweep was not retried because strategy marks broad whole-repo sweeps as blocked; this pass used the dispatcher-provided surface classes and targeted searches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:90] (iteration 7)
- Hand-editing compiled command contracts was ruled out because the compiled contract lists source assets and packet inputs; source changes should regenerate compiled output. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24] (iteration 7)
- Sweeping historical spec packets was ruled out because they are records of prior decisions and implementation history rather than live command/docs surfaces. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-sk-prompt-models-rename/004-commands-scripts-data/implementation-summary.md:47] (iteration 7)
- Treating every `context` substring as standalone `deep-context` cleanup is a dead end; active sk-design fixture references to `context_loading_contract.md` and `contextManifestDigest` are unrelated false positives. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52] (iteration 7)
- Treating runtime mirrors as independent cleanup targets is a dead end; the skill declares OpenCode canonical plus Claude mirror and requires sync. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:279] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:283] [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:284] (iteration 7)
- A whole-repo `deep-context` reference sweep was not retried; this iteration used the dispatcher-specified targeted searches over tests, fixtures, benchmarks/playbooks, command-contract sources, advisor tests, package scripts, and runtime branches. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:93] (iteration 8)
- Candidate reducer promotion: do not remove runtime `context` validators in the public redirect stage; keep them until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1379] [SOURCE: .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1012] (iteration 8)
- Candidate reducer promotion: do not run dedicated CXB behavior benchmarks as replacement-loop validation after redirect; archive/retire them or mark them old-standalone evidence. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:4] (iteration 8)
- Hand-editing compiled generated contracts was ruled out again; the relevant evidence points to source compile/render mappings and regeneration. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:37] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:20] (iteration 8)
- Treating every `context_loading_contract` fixture as a standalone `/deep:context` hit was ruled out; the matching sk-design fixtures encode a design context manifest, not the deep-loop context mode. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-boundary-present-001.public.json:52] (iteration 8)
- A whole-repo `deep-context` reference sweep was not retried; the strategy marks broad sweeps as blocked, and this pass used prior findings plus targeted source anchors for a verification matrix. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:95] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:319] (iteration 9)
- Executing implementation edits or generated-contract writes in this iteration was ruled out because the dispatch explicitly said research only. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:40] (iteration 9)
- Hand-editing compiled generated contracts was ruled out; the compiler exposes `--write` and generated output paths, so implementation should edit sources and regenerate. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:791] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:803] (iteration 9)
- Removing internal runtime `context` support in the public redirect patch remains a dead end until runtime tests and coverage-graph branches are rewritten or explicitly retained. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:22] (iteration 9)
- Treating advisor projection drift as the only metadata cleanup gate remains a dead end because context is a metadata-routed mode and hub graph metadata still carries `deep context`, `context loop`, and `deep-context` triggers. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29] [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:76] (iteration 9)
- Treating dedicated CXB behavior benchmarks as replacement-loop validation remains a dead end; use them as old-standalone archive evidence after redirect rather than as current acceptance gates. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:20] [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/iterations/iteration-008.md:21] (iteration 9)
- Hand-editing compiled generated command contracts: compiled output lists source inputs and must be regenerated after source changes. [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:14] [SOURCE: .opencode/commands/deep/assets/compiled/deep_context.contract.md:24] (iteration 10)
- Public-patch removal of internal runtime `context` support: runtime scripts/tests still accept it. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:660] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:25] (iteration 10)
- Treating dedicated CXB behavior benchmarks as replacement-loop acceptance remains a dead end; archive them as old standalone evidence after redirect. [SOURCE: .opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/behavior_benchmark.md:32] (iteration 10)
- Treating every `context` substring as a standalone deep-context cleanup target remains a dead end; generic context manifest fixtures are false positives. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/research.md:68] (iteration 10)
- Whole-repo `deep-context` reference sweep: strategy marks this blocked, so this pass used targeted command, hub, runtime, packet, fixture, and mirror checks. [SOURCE: .opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/research/deep-research-strategy.md:97] (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Follow up on: Active fixtures/tests/benchmarks split cleanly: dedicated CXB behavior benchmarks are archive/retire candidates, active deep-loop benchmark fixtures that assert standalone context need rewrite/drop after replacement r...

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
