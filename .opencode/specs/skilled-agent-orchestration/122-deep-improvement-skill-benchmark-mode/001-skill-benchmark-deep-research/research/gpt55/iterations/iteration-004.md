# Focus

RQ5: define the Skill Benchmark Report for Lane C (`skill-benchmark`): report shape, scoring rollup, bottleneck ranking, and remediation taxonomy. Secondary focus: keep the report actionable for Phase 003, a follow-up packet, or Lane A remediation, while preserving the `deep-agent-improvement` -> `deep-improvement` rename surface as a reportable risk rather than loose prose.

# Actions Taken

- Read the `deep-agent-improvement` skill's two-lane contract, smart-router `INTENT_SIGNALS`/`RESOURCE_MAP`, Lane B report/state contract, scoring dimensions, stop/journal boundaries, repeatability rules, and explicit "do not hide failures" rule. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:27] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:273] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:480] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:500]
- Read `sk-doc` and its benchmark/manual-playbook templates to separate Lane C's diagnostic report from curated benchmark wayfinding and deterministic manual testing playbooks. [SOURCE: .opencode/skills/sk-doc/SKILL.md:117] [SOURCE: .opencode/skills/sk-doc/SKILL.md:147] [SOURCE: .opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md:14] [SOURCE: .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md:73]
- Read `system-skill-advisor` scoring/routing references to map bottlenecks to advisor lanes, ambiguity, graph connectivity, validation baselines, and fallback anti-patterns. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:57] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:42] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:75] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:264]
- Read packet 121's Lane B build/spec and runtime runner to reuse the report/ledger precedent without inheriting model-output assumptions. [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/context-index.md:36] [SOURCE: .opencode/specs/skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/003-build-benchmark-mode/spec.md:82] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:462] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:512]
- Read prior GPT-5.5 iterations 1-3 so this pass rolls up the existing scoring, harness, activation, scenario-authoring, and rename findings instead of restating them. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-001.md:20] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-002.md:51] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-003.md:43]
- Used external evaluation/reporting prior art for traces, evaluator feedback shape, retrieval/tool metrics, public-vs-hidden test split, deterministic vs model-graded evals, and human-readable benchmark reports. [SOURCE: https://docs.langchain.com/langsmith/evaluation-concepts] [SOURCE: https://docs.ragas.io/en/latest/concepts/metrics/available_metrics/] [SOURCE: https://mlcommons.org/ailuminate/safety-methodology/] [SOURCE: https://developers.openai.com/cookbook/examples/evaluation/getting_started_with_openai_evals]

# Findings

## f-gpt55-i4-01 - The report needs two synchronized artifacts: `report.json` for automation and `report.md` for operators.

Lane C's parent requires a ranked Skill Benchmark Report with per-dimension scores, bottlenecks, and concrete remediations, while Phase 003 says the report is diagnostic by default and should not mutate the target skill. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:129] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:46] Lane B already has the machine artifact shape: `status`, `scoringMethod`, `profileId`, `target`, `aggregateScore`, thresholds, row-level results, `failureModes`, and ledger snapshot paths. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:462] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:500] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:512] `sk-doc`'s benchmark template supplies the human narrative sections Lane C should adapt: aggregate results, methodology, findings, caveats, tiered recommendations, and reproducibility. [SOURCE: .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md:73] [SOURCE: .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md:209] [SOURCE: .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md:248] [SOURCE: .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md:270]

Recommended shape:

| Artifact | Purpose | Required sections or fields |
| --- | --- | --- |
| `report.json` | Reducer, CI, Lane A hand-off, trend comparison | `status`, `mode:"skill-benchmark"`, `scoringMethod`, `targetSkillId`, `targetSkillAliases`, `profile`, `aggregateScore`, `dimensionScores`, `gates`, `bottlenecks[]`, `remediations[]`, `scenarioRows[]`, `traceArtifacts`, `variance`, `caveats`, `provenance` |
| `report.md` | Operator triage and follow-up planning | Headline verdict, aggregate rollup, methodology, scenario coverage, ranked bottlenecks, remediation backlog, caveats, reproducibility, related artifacts |

The key design point: `report.md` must be rendered from `report.json`, not hand-authored separately. If these diverge, the follow-up packet cannot safely act on the recommendations.

## f-gpt55-i4-02 - Bottleneck ranking should be severity x prevalence x impact x confidence x remediation-readiness, with hard gates above the weighted list.

Sorting only by low dimension score is not actionable enough. A single critical false-positive activation can be more urgent than a broad but low-impact efficiency tax. The parent already frames R1-R6 as routing, discovery, efficiency, usefulness, structural connectivity, and actionable output, so the ranking needs to preserve both score impact and remediation ownership. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:124] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:129] Lane B's runner already aggregates failure modes by count, and the reducer has a top-failure helper, but Lane C needs a richer rank because frequency alone cannot distinguish "minor over-load" from "wrong skill fired on a destructive near-miss." [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:237] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/reduce-state.cjs:843]

Recommended rank formula:

```text
hard_gate_rank first, then:
rankScore =
  severityWeight
  * (1 + prevalenceRatio)
  * (1 + normalizedScoreImpact)
  * confidence
  * remediationReadiness
```

Hard gates should bypass weighted sorting and force `status:"fail"` or `status:"inconclusive"`: prompt contamination, infra failure, trace capture failure, critical advisor false positive, critical advisor false negative, zero expected-resource recall on a required-resource scenario, and skill-on outcome no better than skill-off on a critical scenario. This matches the existing evaluator contract's distinction between weak candidates and infrastructure failures. [SOURCE: .opencode/skills/deep-agent-improvement/references/model-benchmark/evaluator_contract.md:25] [SOURCE: .opencode/skills/deep-agent-improvement/references/model-benchmark/evaluator_contract.md:114] It also matches external eval practice: LangSmith experiments retain outputs, scores, and execution traces per example, while evaluator outputs include metric keys, scores/values, and optional comments; those fields are enough to compute impact plus confidence per bottleneck. [SOURCE: https://docs.langchain.com/langsmith/evaluation-concepts]

## f-gpt55-i4-03 - The remediation taxonomy must be owner-specific, not a generic "routing failed" label set.

Iteration 3 already showed that activation has at least three owner surfaces: advisor selection, in-skill router selection, and runtime utilization. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-003.md:15] The repo confirms the owner split. `system-skill-advisor` uses five scorer lanes with different remediation levers: explicit author, lexical, graph causal, derived generated, and semantic shadow. [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:42] The target skill has local `INTENT_SIGNALS`, `RESOURCE_MAP`, and `RUNTIME_ASSETS`, which are different edit targets from advisor metadata. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:124] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:135] The advisor docs also name known structural anti-patterns: stale static inventories, compatibility stubs, raw unguarded loads, and hardcoded tool ids. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:264]

Recommended taxonomy:

| Category | Labels | Primary fix target |
| --- | --- | --- |
| Advisor activation | `advisor_false_negative`, `advisor_false_positive`, `advisor_ambiguous`, `advisor_low_confidence`, `graph_lane_missing` | advisor aliases, trigger phrases, scorer boosts, graph edges, validation corpus |
| In-skill routing | `skill_intent_miss`, `skill_resource_miss`, `dead_intent_key`, `overloaded_default`, `fallback_unhelpful` | `INTENT_SIGNALS`, `RESOURCE_MAP`, loading levels, quick reference |
| Resource discoverability | `orphan_resource`, `asset_hidden`, `resource_name_mismatch`, `stale_stub_loaded`, `late_useful_resource` | reference/asset placement, names, frontmatter, router edges |
| Efficiency | `irrelevant_context_overload`, `too_many_calls_to_first_resource`, `fallback_loop`, `ambiguous_keyword_collision` | default resources, intent weights, resource split, prompt path |
| Usefulness | `resource_loaded_not_used`, `skill_on_no_delta`, `rubric_failure`, `process_step_skipped` | operator guide, reference content, examples, scenario-specific workflow |
| Harness validity | `prompt_contamination`, `private_key_leak`, `trace_capture_gap`, `insufficient_sample`, `grader_dispute` | fixture authoring, dispatcher instrumentation, repeatability profile |
| Rename/migration | `stale_old_name_live_surface`, `alias_gap`, `archive_false_positive`, `command_reference_drift` | Phase 002 rename packet, advisor rebuild, alias map, grep allowlist |

Each bottleneck should include `ownerSurface`, `evidenceRefs`, `suggestedPatchTarget`, `suggestedChange`, `verificationCommand`, and `handoffLane`. Without those fields, the report is informative but not remediable.

## f-gpt55-i4-04 - The score rollup should keep the 100-point scorecard, print raw sub-scores, and treat repeatability as confidence.

The prior scorecard still holds for the report rollup: 25 routing/activation, 25 discovery, 20 usefulness, 15 efficiency, 15 structural connectivity. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-001.md:20] The parent spec names the same five measurement areas and makes actionable output a sixth reporting requirement, not a sixth score dimension. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:124] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:129] The existing skill already uses weighted dimensions in Lane A and thresholded aggregate/minimum-fixture scoring in Lane B, so a weighted score with visible thresholds fits the local design language. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:250] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:438] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:450]

Recommended rollup:

| Dimension | Weight | Required printed sub-scores |
| --- | ---: | --- |
| Activation | 25 | `advisorActivation`, `skillRouterActivation`, `activationOutcome` |
| Discovery | 25 | expected-resource recall, irrelevant-load precision, first useful resource rank |
| Usefulness | 20 | skill-on score, skill-off score, delta, rubric pass/fail |
| Efficiency | 15 | calls/tokens to first expected resource, total calls, fallback count, dead-end count |
| Structural Connectivity | 15 | orphan resources, dead intent keys, broken edges, over-broad mappings |

Repeatability should modify confidence, not inflate the headline score. Lane B already separates repeatability from benchmark completion, and the stability helper requires multiple replays before producing a verdict. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:350] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/agent-improvement/benchmark-stability.cjs:20] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/agent-improvement/benchmark-stability.cjs:128] A clean report should therefore show `aggregateScore`, `confidence`, `variance`, and `status` separately. `92 score / 0.58 confidence / inconclusive` is a valid outcome when samples are too thin.

## f-gpt55-i4-05 - Scenario rows must be trace-to-remediation joins, not final-answer summaries.

The dispatcher requirement is trace-first: run each scenario in a hint-free harness and capture resource-load plus tool traces. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:133] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:134] LangSmith's run model supports exactly the needed evidence shape: inputs, outputs, intermediate tool/LLM steps, metadata, feedback scores, and per-example experiment traces. [SOURCE: https://docs.langchain.com/langsmith/evaluation-concepts] Ragas separates retrieval metrics such as context precision/recall from agent/tool metrics such as tool call accuracy, Tool Call F1, and agent goal accuracy, which supports Lane C's separate discovery and utilization columns. [SOURCE: https://docs.ragas.io/en/latest/concepts/metrics/available_metrics/] OpenAI's eval guidance also splits deterministic validation logic from model-graded checks, which maps to deterministic trace/resource checks plus optional semantic outcome grading. [SOURCE: https://developers.openai.com/cookbook/examples/evaluation/getting_started_with_openai_evals]

Recommended `scenarioRows[]` fields:

```json
{
  "scenarioId": "skill-benchmark.routing.gold.001",
  "origin": "gold_hand_authored",
  "negativeActivation": false,
  "expectedSkill": "deep-improvement",
  "advisorTopSkill": "deep-improvement",
  "advisorConfidence": 0.91,
  "expectedIntentKeys": ["SKILL_BENCHMARK"],
  "observedIntentKeys": ["LOOP_EXECUTION"],
  "expectedResources": ["references/skill-benchmark/operator_guide.md"],
  "loadedResources": ["references/shared/quick_reference.md"],
  "firstExpectedResourceRank": null,
  "callsToFirstExpectedResource": null,
  "irrelevantLoadCount": 1,
  "skillOnScore": 0.62,
  "skillOffScore": 0.55,
  "outcomeDelta": 0.07,
  "failureLabels": ["skill_intent_miss", "skill_resource_miss"],
  "remediationIds": ["rem-003", "rem-004"],
  "traceRefs": ["tool-trace.jsonl#L12", "router-trace.json#$.selected"]
}
```

This row shape lets the report answer "what broke, where, and what file should change?" without forcing the next agent to reread every trace.

## f-gpt55-i4-06 - The report should include a first-class rename/migration section with strict and alias-tolerant modes.

The parent packet makes the rename part of the same program: `deep-agent-improvement` becomes `deep-improvement` because the skill now spans agent, model, and skill lanes. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:41] Phase 002 scopes the rename across the skill directory, command references, agent/runtime mirrors, advisor graph, descriptions, cross-references, and internal self-references; success requires zero dangling operational old-name references plus advisor rebuild/validate. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:50]

Current live metadata still carries the old id in routing surfaces: `graph-metadata.json` has `skill_id:"deep-agent-improvement"`, derived triggers include both `deep-agent-improvement` entries and model-benchmark triggers, and derived key files point at `.opencode/skills/deep-agent-improvement/...` plus runtime agent mirrors. [SOURCE: .opencode/skills/deep-agent-improvement/graph-metadata.json:3] [SOURCE: .opencode/skills/deep-agent-improvement/graph-metadata.json:44] [SOURCE: .opencode/skills/deep-agent-improvement/graph-metadata.json:86] Active agent mirrors and configs also name the old surface. [SOURCE: .opencode/agents/deep-agent-improvement.md:44] [SOURCE: .codex/agents/deep-agent-improvement.toml:34]

Lane C should therefore report rename risk in two modes:

| Mode | Use | Failure label |
| --- | --- | --- |
| `strictOperational` | Phase 002 validation: live skill/advisor/command/mirror surfaces must use the intended new id | `stale_old_name_live_surface` |
| `aliasTolerantTrace` | Phase 003 benchmark traces during/after migration: old and new ids normalize to one target for scoring | `alias_gap` only when neither id maps cleanly |

This prevents noisy archive failures while still blocking real routing drift.

# Recommendations

1. Add a Lane C report contract under `assets/skill-benchmark/`: `report_schema.json`, `report_template.md`, and a small `remediation_taxonomy.json`. Generate `report.md` from `report.json` so human and machine artifacts cannot drift. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:48]
2. Build the report around three append-only evidence layers: `scenario-results.jsonl`, `bottlenecks.jsonl`, and `report.json`; write an immutable `report-history/` snapshot like Lane B does. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:502]
3. Implement hard gates before weighted scoring: contamination, trace failure, infra failure, critical false activation, zero required-resource recall, and no skill-on usefulness delta on critical scenarios. [SOURCE: .opencode/skills/deep-agent-improvement/references/model-benchmark/evaluator_contract.md:114]
4. Use the weighted rollup `25/25/20/15/15`, but always print raw sub-scores and confidence/variance separately. Do not hide low-confidence or weak benchmark results. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:500]
5. Make each remediation row actionable enough for a follow-up packet: `label`, `ownerSurface`, `evidenceRefs`, `suggestedPatchTarget`, `suggestedChange`, `verificationCommand`, `handoffLane`, and `blockingStatus`.
6. Include `renameSurface` in every report until Phase 002 completes: strict operational scan for live files, alias-tolerant normalization for traces, and an archive allowlist. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:52]

# Open Questions

- What exact thresholds should map `aggregateScore`, hard gates, and confidence into `pass`, `warn`, `fail`, and `inconclusive`? The local precedent supports aggregate/minimum thresholds, but Lane C needs calibration on real skills. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:441]
- Should `remediationReadiness` be human-authored in the taxonomy or computed from whether the report can name a concrete patch target and verification command?
- How should token cost be normalized across runtimes whose traces expose different token/accounting metadata? LangSmith-style traces include metadata and latency, but local CLI traces may need estimation. [SOURCE: https://docs.langchain.com/langsmith/evaluation-concepts]
- What is the minimum repeat count for a Lane C headline verdict: Lane B's stability helper defaults to three replays, but skill routing variance may require per-scenario or per-executor thresholds. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/agent-improvement/benchmark-stability.cjs:20]
- Should old-name compatibility aliases survive after Phase 002, or should `deep-agent-improvement` fail fast except in historical archives? The report can support either, but the policy decision belongs in Phase 002. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:48]
