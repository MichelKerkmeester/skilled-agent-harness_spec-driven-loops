---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: session 120+121 authored code + docs (29-file curated scope) (files)
- Started: 2026-05-28T17:44:33Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: review-20260528-174433
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 11 |
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | correctness | correctness | 1.00 | 0/3/0 | complete |
| run-001 | security | security | 1.00 | 0/2/1 | complete |
| run-001 | security | security | 0.33 | 0/2/1 | complete |
| run-001 | traceability | traceability | 1.00 | 0/3/0 | complete |
| run-001 | traceability | traceability | 0.00 | 0/0/0 | complete |
| run-001 | maintainability | maintainability | 1.00 | 0/0/2 | complete |
| run-001 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| run-001 | correctness cross-cutting integration | correctness | 1.00 | 0/1/0 | complete |
| run-001 | security | security | 0.00 | 0/0/0 | complete |
| review-20260528-174433 | correctness,traceability,maintainability + adversarial verification | correctness/traceability/maintainability | 0.06 | 0/4/11 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 13 |
| security | covered | 0 |
| traceability | covered | 3 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.00 -> 0.06
- convergenceScore: 0.94
- openFindings: 16
- persistentSameSeverity: 1
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=33, ruledOut=23, deferred=20, blocked=0

### Search Debt
- iteration 3 environment_inheritance (deferred): needs policy decision on minimal environment allowlist for model executors; evidence=.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173, .opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:119
- iteration 5 tst1_acceptance_evidence (deferred): covered by prior active checklist_evidence/spec_code findings; should be folded into remediation for DR-001-P1-001/DR-001-P1-002; evidence=.opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:44, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:56
- iteration 6 active_scorer_seam (deferred): pending remediation; reproduction confirmed by absence of change; evidence=.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:114
- iteration 6 promotion_mode_contract (deferred): pending remediation; no change in shipped code since iter 005; evidence=.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:168
- iteration 6 det_check_cwd_contract (deferred): pending remediation; no change in shipped code since iter 005; evidence=.opencode/skills/deep-agent-improvement/scripts/scorer/deterministic/cwd-check.cjs:142
- iteration 7 dead_or_duplicate_scorer_tree (deferred): covered by active traceability finding DR-005-P1-001; evidence=.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:114, .opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:5, .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-model-benchmark-mode-runtime/spec.md:166, .opencode/specs/skilled-agent-orchestration/122-session-120-121-deep-review/review/iterations/iteration-005.md:38, .opencode/specs/skilled-agent-orchestration/122-session-120-121-deep-review/review/iterations/iteration-006.md:24
- iteration 7 tst1_byte_identity_gap (deferred): covered by existing checklist_evidence/spec_code failures; evidence=.opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:44, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:56
- iteration 9 dispatcher_invocation (deferred): prior active P1 already captures this integration gap; evidence=.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:73, .opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118
- iteration 9 active_scorer_seam (deferred): prior active P1 already captures this seam mismatch; evidence=.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:114, .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:274, .opencode/skills/deep-agent-improvement/scripts/tests/scorer.vitest.ts:50
- iteration 9 promotion_mode_contract (deferred): prior active P1 already captures this promotion mismatch; evidence=.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:168, .opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:193

### Ruled-Out Candidates
- iteration 1 mode_routing (ruled_out): verified by direct read of implementation and test; evidence=.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:43, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:32
- iteration 1 materialize_ordering (ruled_out): verified by plan and unit test; evidence=.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:73, .opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:103, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:84
- iteration 1 hard_gate_math (ruled_out): verified by direct read of hard-gate and weighted-score logic; evidence=.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:126, .opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:220
- iteration 3 spawned_cli_arg_injection (ruled_out): verified by direct read of buildSpawnSpec and spawnSync call; evidence=.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118, .opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:133, .opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173
- iteration 4 grader_dispatch (ruled_out): confirmed safe by direct read; evidence=.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:119
- iteration 4 cache_file_writes (ruled_out): verified by direct read; evidence=.opencode/skills/deep-agent-improvement/scripts/scorer/lib/cache.cjs:184
- iteration 5 mode_field_persistence (ruled_out): verified by direct reads of success and infra_failure record construction; evidence=.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:430, .opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:622, .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:326, .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:355
- iteration 5 no_loop_discovery (ruled_out): loop-host.cjs exists and implements the mode selector entry point; evidence=.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:7, .opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:58
- iteration 5 minimax_catalog_trace (ruled_out): direct/exact search found consistent model/provider/prompt-framework references; evidence=.opencode/skills/cli-opencode/assets/prompt_quality_card.md:54, .opencode/skills/cli-opencode/assets/prompt_templates.md:451, .opencode/skills/sk-prompt/assets/model-profiles.json:187, .opencode/skills/sk-prompt-models/references/pattern-index.md:49
- iteration 6 120_skill_edit_correctness (ruled_out): direct search found no inconsistencies in slug, context_length, quota pool, prompt framework, or variant guidance; evidence=.opencode/skills/cli-opencode/SKILL.md:200, .opencode/skills/cli-opencode/changelog/v1.3.4.0.md:1, .opencode/skills/sk-prompt/assets/model-profiles.json:197, .opencode/skills/sk-prompt-models/SKILL.md:140
- iteration 6 cli-opencode_graph_metadata_consistency (ruled_out): trigger phrases present and consistent with documented MiniMax content; evidence=.opencode/skills/cli-opencode/graph-metadata.json:83, .opencode/skills/cli-opencode/graph-metadata.json:84, .opencode/skills/cli-opencode/graph-metadata.json:85, .opencode/skills/cli-opencode/graph-metadata.json:86, .opencode/skills/cli-opencode/graph-metadata.json:87, .opencode/skills/cli-opencode/graph-metadata.json:10
- iteration 6 changelog_release_note_accuracy (ruled_out): direct read confirmed all described changes are accurate; evidence=.opencode/skills/cli-opencode/changelog/v1.3.4.0.md:1, .opencode/skills/cli-opencode/changelog/v1.3.4.0.md:23, .opencode/skills/cli-opencode/changelog/v1.3.4.0.md:29
- iteration 7 doc_consistency (ruled_out): direct read found consistent names and ownership across the reviewed documentation; evidence=.opencode/skills/cli-opencode/SKILL.md:200, .opencode/skills/cli-opencode/assets/prompt_templates.md:451, .opencode/skills/sk-prompt-models/references/pattern-index.md:49, .opencode/skills/sk-prompt/assets/model-profiles.json:197
- iteration 9 mode_field_writer_persistence (ruled_out): verified by direct read of success and infra_failure record construction; evidence=.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:430, .opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:622, .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:326, .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:355
- iteration 9 backward_compat_default_mode (ruled_out): verified by direct read of resolver and tests; evidence=.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:43, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:32, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:44

### Clean Search Proof
- iteration 1 mode_routing (ruled_out): verified by direct read of implementation and test; evidence=.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:43, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:32
- iteration 1 materialize_ordering (ruled_out): verified by plan and unit test; evidence=.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:73, .opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:103, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:84
- iteration 1 hard_gate_math (ruled_out): verified by direct read of hard-gate and weighted-score logic; evidence=.opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:126, .opencode/skills/deep-agent-improvement/scripts/scorer/score-model-variant.cjs:220
- iteration 3 spawned_cli_arg_injection (ruled_out): verified by direct read of buildSpawnSpec and spawnSync call; evidence=.opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:118, .opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:133, .opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs:173
- iteration 4 grader_dispatch (ruled_out): confirmed safe by direct read; evidence=.opencode/skills/deep-agent-improvement/scripts/scorer/grader/harness.cjs:119
- iteration 4 cache_file_writes (ruled_out): verified by direct read; evidence=.opencode/skills/deep-agent-improvement/scripts/scorer/lib/cache.cjs:184
- iteration 5 mode_field_persistence (ruled_out): verified by direct reads of success and infra_failure record construction; evidence=.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:430, .opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:622, .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:326, .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:355
- iteration 5 no_loop_discovery (ruled_out): loop-host.cjs exists and implements the mode selector entry point; evidence=.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:7, .opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:58
- iteration 5 minimax_catalog_trace (ruled_out): direct/exact search found consistent model/provider/prompt-framework references; evidence=.opencode/skills/cli-opencode/assets/prompt_quality_card.md:54, .opencode/skills/cli-opencode/assets/prompt_templates.md:451, .opencode/skills/sk-prompt/assets/model-profiles.json:187, .opencode/skills/sk-prompt-models/references/pattern-index.md:49
- iteration 6 120_skill_edit_correctness (ruled_out): direct search found no inconsistencies in slug, context_length, quota pool, prompt framework, or variant guidance; evidence=.opencode/skills/cli-opencode/SKILL.md:200, .opencode/skills/cli-opencode/changelog/v1.3.4.0.md:1, .opencode/skills/sk-prompt/assets/model-profiles.json:197, .opencode/skills/sk-prompt-models/SKILL.md:140
- iteration 6 cli-opencode_graph_metadata_consistency (ruled_out): trigger phrases present and consistent with documented MiniMax content; evidence=.opencode/skills/cli-opencode/graph-metadata.json:83, .opencode/skills/cli-opencode/graph-metadata.json:84, .opencode/skills/cli-opencode/graph-metadata.json:85, .opencode/skills/cli-opencode/graph-metadata.json:86, .opencode/skills/cli-opencode/graph-metadata.json:87, .opencode/skills/cli-opencode/graph-metadata.json:10
- iteration 6 changelog_release_note_accuracy (ruled_out): direct read confirmed all described changes are accurate; evidence=.opencode/skills/cli-opencode/changelog/v1.3.4.0.md:1, .opencode/skills/cli-opencode/changelog/v1.3.4.0.md:23, .opencode/skills/cli-opencode/changelog/v1.3.4.0.md:29
- iteration 7 doc_consistency (ruled_out): direct read found consistent names and ownership across the reviewed documentation; evidence=.opencode/skills/cli-opencode/SKILL.md:200, .opencode/skills/cli-opencode/assets/prompt_templates.md:451, .opencode/skills/sk-prompt-models/references/pattern-index.md:49, .opencode/skills/sk-prompt/assets/model-profiles.json:197
- iteration 9 mode_field_writer_persistence (ruled_out): verified by direct read of success and infra_failure record construction; evidence=.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:430, .opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs:622, .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:326, .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs:355
- iteration 9 backward_compat_default_mode (ruled_out): verified by direct read of resolver and tests; evidence=.opencode/skills/deep-agent-improvement/scripts/loop-host.cjs:43, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:32, .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:44

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 11 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 10 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
