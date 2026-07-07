---
title: "Benchmark Results: Advisor RRF Fusion"
description: "Benchmarks the advisor RRF-fusion cluster against the weighted-sum baseline on routing top-1 correctness through the production scoreAdvisorPrompt path against a read-only projection copy, on a widened 42-prompt set with two bands that target the guard seams directly. RRF lifts top-1 from 37 of 42 to 38 of 42 with zero regressions and 0.976 agreement. The self-recommendation guard moves zero top-1 even on prompts built to trigger it and is behaviorally redundant with existing logic. The conflict-rerank seam, fed real conflicts_with mass through a benchmark overlay, corrects one top-1 (4 of 5 to 5 of 5) and repairs a regression RRF itself introduces, since plain RRF drops the signed conflict suppression the weighted-sum keeps natively. Default-off byte-identical, deterministic. Verdict GRADUATE for the RRF core paired with the conflict-rerank seam, CUT for the self-recommendation guard."
trigger_phrases:
  - "advisor rrf fusion benchmark"
  - "SPECKIT_ADVISOR_RRF_FUSION verdict"
  - "advisor routing top-1 correctness"
  - "advisor conflict rerank seam signal"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Advisor RRF Fusion

## Question
The skill advisor ships an RRF-fusion path (`SPECKIT_ADVISOR_RRF_FUSION`, `ADVISOR_RRF_K=8`, RRF rank order as the post-bonus tiebreak), a conflict-rerank seam that preserves graph conflict mass as a deterministic post-fusion demotion, and a self-recommendation guard (`SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`). All three are default-off and byte-identical when off. Does RRF fusion beat the weighted-sum baseline on routing top-1 correctness, and do the two guard seams show signal on a set built to trigger them?

## Method
- **Production path.** The harness imports the compiled production scorer `scoreAdvisorPrompt` and the production projection loader `loadAdvisorProjection`, the exact pair the `advisor_recommend` handler calls, and toggles only the real flag readers through the environment.
- **Read-only corpus.** The live `skill-graph.sqlite` is copied once into `results/skill-graph.backup.sqlite` and the loader opens a read-only scratch copy. The source hash is unchanged after the run. The projection loads from `sqlite` with 27 entries (21 corpus skills plus 6 command bridges).
- **Conflict overlay, not a corpus write.** The live corpus carries zero `conflicts_with` edges, so the conflict seam is dormant against it. Rather than write the live corpus, five `conflicts_with` edges modeling real routing conflicts are merged into the in-memory projection for the conflict band only. The production `scoreGraphCausalLaneSplit` conflict path runs against real mass without mutating production data.
- **Neutral embedder lane.** The semantic_shadow lane is left neutral so both arms share an identical live lane set and the comparison isolates the fusion change.
- **Widened labeled set.** 42 prompts paired with the correct skill, each gold answer grounded in the corpus trigger phrases, across five bands: 15 exact, 12 paraphrase, 6 hard, 4 self_guard (advisor-self-leaning audit prompts where a real task skill is gold), 5 conflict (near-tie prompts whose runner-up is a `conflicts_with` target of the gold skill).
- **Arms.** `baseline` (all flags off, the weighted-sum scorer), `rrf` (`SPECKIT_ADVISOR_RRF_FUSION` on), `rrf_guard` (RRF plus `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` on). The conflict band is scored against the overlay for the RRF arms and against the live projection for the baseline, since the conflict comparator demotion is RRF-gated.
- **Two differentials** isolate the seams: the self-guard differential compares RRF guard-off against RRF guard-on over the self_guard band, and the conflict differential compares RRF over the live projection against RRF over the overlay projection over the conflict band.
- **Determinism.** The scorer is deterministic, so run-to-run variance is zero and the graduate margin is exact.

## Results: RRF lifts top-1 by one prompt with zero regressions

| Metric | baseline (weighted-sum) | rrf | rrf_guard |
|--------|--------------------------|-----|-----------|
| top-1 correct | 37 / 42 | **38 / 42** | 38 / 42 |
| top-1 accuracy | 0.8810 | **0.9048** | 0.9048 |
| exact band | 0.8667 | **0.9333** | 0.9333 |
| paraphrase band | 0.75 | 0.75 | 0.75 |
| hard band | 1.00 | 1.00 | 1.00 |
| self_guard band | 1.00 | 1.00 | 1.00 |
| conflict band | 1.00 | 1.00 | 1.00 |
| agreement vs baseline | n/a | **0.9762** | 0.9762 |
| top-1 moved vs baseline | n/a | 1 (`q02`) | 1 (`q02`) |

RRF corrects one prompt and regresses none. The exact band rises from 0.8667 to 0.9333. The other four bands are unchanged. The RRF-plus-guard arm is identical to the RRF arm.

### The moved prompt: rank fusion beats lane magnitude
| id | band | prompt | gold | baseline top-1 | rrf top-1 |
|----|------|--------|------|----------------|-----------|
| q02 | exact | `codex pr review` | cli-codex | sk-code-review | **cli-codex** |

The weighted-sum baseline picked `sk-code-review` because the lexical tokens `pr` and `review` outweighed the explicit-author `codex` signal. RRF rank fusion put `cli-codex`'s explicit-author rank first and the dominant intent won. Rank fusion resists a single lane's magnitude swamping the correct dominant rank.

## The self-recommendation guard shows no signal and is behaviorally redundant

The self_guard band is four audit-recommendation-quality prompts that make `system-skill-advisor` a strong candidate, where the correct route is `sk-code-review`. If the guard had any distinct effect it would demote the advisor self-recommendation on exactly these prompts.

| differential | result |
|--------------|--------|
| top-1 moved by the guard | **0 of 4** |
| correct with guard off | 4 of 4 |
| correct with guard on | 4 of 4 |
| shows signal | **false** |

The guard changes nothing. The root cause is structural, confirmed by reading the production scorer:
- On any read-only-explainer prompt, the generic floor `if (readOnlyExplainer && !readOnlyRouteAllowed) return readOnlyExplainerFloor` pins every skill to the same floor. `system-skill-advisor` is never in the `readOnlyRouteAllowed` allowlist, so it always hits that floor with or without the guard. The guard's confidence-floor branch is unreachable as distinct behavior.
- On audit-recommendation prompts, the `auditRecsAdvisorPenalty` already fires for `system-skill-advisor` in the guard-off path via `if (!selfRecommendationGuardEnabled && recommendation.skill === 'system-skill-advisor')`. The guard only generalizes a penalty that was already applied.

So the guard is not merely inert on a thin set. It duplicates logic that already runs for the advisor corpus id on every realistic prompt shape, and adds no demotion the scorer was not already making.

## The conflict-rerank seam shows signal and repairs an RRF regression

The conflict band is five near-tie prompts whose runner-up under plain RRF is a `conflicts_with` target of the gold skill. The conflict differential compares RRF against the live projection (no conflict edges) with RRF against the overlay projection (five `conflicts_with` edges).

| differential | result |
|--------------|--------|
| top-1 moved by conflict mass | **1 of 5** |
| correct without overlay | 4 of 5 |
| correct with overlay | **5 of 5** |
| shows signal | **true** |

### The corrected prompt and the regression it repairs
| config | structural-impact prompt top-1 |
|--------|--------------------------------|
| baseline weighted-sum, no overlay | system-code-graph (correct) |
| RRF, no overlay | **sk-code (wrong)** |
| RRF, conflict overlay | system-code-graph (correct) |

On `find the structural impact of this code change across callers` the weighted-sum baseline already routes correctly to `system-code-graph`, because the graph-causal lane folds the signed conflict mass into the weighted sum natively. Plain RRF regresses it to `sk-code`, because RRF rank fusion discards the signed conflict suppression and `sk-code` wins on raw lexical rank. The conflict-rerank seam re-injects that suppression as a post-fusion comparator demotion and restores `system-code-graph`.

This is the key finding of the refinement. The conflict-rerank seam is not a luxury. It repairs a regression that RRF itself introduces on conflict-bearing prompts. On the live corpus the point is moot because no conflict edges exist, but on any corpus that carries conflict edges, RRF without the conflict seam is a regression and the seam is required to make RRF safe there. The conflict-band aggregate of 5 of 5 for both arms in the main table reflects the baseline reading conflict mass natively and the RRF arm reading it through the seam, so neither arm is worse, and the differential shows the seam is load-bearing for RRF specifically.

## Safety
- **Flag-off byte-identical.** The baseline arm is byte-identical across repeated runs over all 42 prompts. With both flags off the scorer is the unchanged weighted-sum path.
- **The conflict overlay does not change the default-off top-1.** With flags off, the overlay perturbs only lower-rank scores through the native weighted-sum graph-causal handling and changes no routed answer. This is expected native behavior, not a flag leak, since the RRF-specific conflict comparator demotion is flag-gated.
- **Deterministic.** Every arm is run-to-run top-1 stable, so the lifts exceed the zero run-to-run variance.
- **Read-only.** The source `skill-graph.sqlite` hash is unchanged after the run and git shows no change to it. No production code was edited and no flag default was flipped.

## Verdicts

**RRF core plus the conflict-rerank seam: GRADUATE.** RRF lifts top-1 from 0.8810 to 0.9048 with zero regressions on the widened set, and the conflict-rerank seam corrects the one near-tie where plain RRF regresses, taking the conflict band from 4 of 5 to 5 of 5. The two belong together. RRF rank fusion drops the signed conflict suppression that weighted-sum holds natively, and the conflict seam re-injects it, so graduating RRF without the conflict seam would ship a known regression on any corpus that grows conflict edges. Both are deterministic and byte-identical when off. The recommendation is to graduate `SPECKIT_ADVISOR_RRF_FUSION` and the conflict-rerank seam together, with the live-corpus caveat below.

**Self-recommendation guard: CUT.** The guard moves zero top-1 even on prompts purpose-built to trigger it, and reading the scorer shows why: its confidence-floor branch is unreachable behind the generic explainer floor, and its audit penalty duplicates a demotion the scorer already applies to `system-skill-advisor` without the flag. It is dead weight behind a flag, the same verdict that retired the other cut experiments. The recommendation is to delete `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` and the guard code, keeping the existing un-flagged advisor demotion that already does the job.

### Live-corpus caveat on the conflict graduation
The conflict-rerank seam was measured against a benchmark overlay because the live corpus carries no `conflicts_with` edges. Graduating the seam is safe and correct as a property of RRF (it prevents an RRF regression), and it is inert on the current corpus exactly because there are no conflict edges to demote. The seam earns its graduation as RRF's safety net, and it begins to add routing value the moment the corpus grows its first `conflicts_with` edge. Seeding those edges into the live corpus is a separate corpus-authoring decision outside this read-only benchmark.

## Reproduce
`node scripts/advisor-rrf-benchmark.mjs` rebuilds `results/metrics.json` from the read-only projection copy and the in-memory conflict overlay, exit 0.
