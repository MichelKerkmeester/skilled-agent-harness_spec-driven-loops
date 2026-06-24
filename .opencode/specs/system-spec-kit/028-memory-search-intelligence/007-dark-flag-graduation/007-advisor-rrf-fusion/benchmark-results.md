---
title: "Benchmark Results: Advisor RRF Fusion"
description: "Benchmarks the advisor RRF-fusion cluster against the weighted-sum baseline on routing top-1 correctness through the production scoreAdvisorPrompt path against a read-only projection copy. RRF lifts top-1 from 28 of 33 to 29 of 33 with zero regressions and 0.97 agreement, the one moved prompt (codex pr review) corrected from wrong to right. The self-recommendation guard is inert on this set and the conflict-rerank seam is structurally dormant because the live corpus carries no conflicts_with edges. Default-off byte-identical, scorer deterministic. Verdict REFINE: the RRF core is the closest to graduate-ready but the one-prompt margin and two unproven seams argue for a larger labeled set and live conflict data before a flip."
trigger_phrases:
  - "advisor rrf fusion benchmark"
  - "SPECKIT_ADVISOR_RRF_FUSION verdict"
  - "advisor routing top-1 correctness"
  - "advisor rrf vs weighted sum"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Advisor RRF Fusion

## Question
The skill advisor ships an RRF-fusion path (`SPECKIT_ADVISOR_RRF_FUSION`, `ADVISOR_RRF_K=8`, RRF rank order as the post-bonus tiebreak), a conflict-rerank seam that preserves graph conflict mass as a deterministic post-fusion demotion, and a self-recommendation guard (`SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`). All three are built, pass their unit tests and are byte-identical when off, but have never been measured against the real corpus on the production routing path. Does RRF fusion plus the guards beat the weighted-sum baseline on routing top-1 correctness and the agreement spread?

## Method
- **Production path.** The harness imports the compiled production scorer `scoreAdvisorPrompt` and the production projection loader `loadAdvisorProjection` from the advisor dist bundle, the exact pair the `advisor_recommend` handler calls, and toggles only the real flag readers through the environment.
- **Read-only corpus.** The live `skill-graph.sqlite` is copied once into `results/skill-graph.backup.sqlite` and the loader opens a read-only scratch copy. The source hash is unchanged after the run. The projection loads from `sqlite` with 27 entries (21 corpus skills plus 6 command bridges).
- **Neutral embedder lane.** The semantic_shadow lane is left neutral, no prompt embedding injected, so both arms share an identical live lane set and the comparison isolates the fusion change rather than embedder noise.
- **Labeled routing set.** 33 prompts paired with the correct skill, each gold answer grounded in that skill's own corpus trigger phrases, across three difficulty bands: 15 exact (verbatim or near-verbatim triggers), 12 paraphrase (natural-language restatements), 6 hard (multi-concept or near-tie, dominant-intent gold).
- **Arms.** `baseline` (all flags off, the weighted-sum scorer), `rrf` (`SPECKIT_ADVISOR_RRF_FUSION` on), `rrf_guard` (RRF plus `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` on).
- **Metric.** Routing top-1 correctness per arm with the per-band breakdown, plus the agreement spread versus baseline (the fraction of prompts whose top-1 skill differs from the baseline arm). The scorer is deterministic, so run-to-run variance is zero and the graduate margin baseline is exact.

## Results: RRF lifts top-1 by one prompt with zero regressions

| Metric | baseline (weighted-sum) | rrf | rrf_guard |
|--------|--------------------------|-----|-----------|
| top-1 correct | 28 / 33 | **29 / 33** | 29 / 33 |
| top-1 accuracy | 0.8485 | **0.8788** | 0.8788 |
| exact band | 0.8667 | **0.9333** | 0.9333 |
| paraphrase band | 0.75 | 0.75 | 0.75 |
| hard band | 1.00 | 1.00 | 1.00 |
| agreement vs baseline | n/a | **0.9697** | 0.9697 |
| top-1 moved vs baseline | n/a | 1 (`q02`) | 1 (`q02`) |

RRF corrects exactly one prompt and regresses none. The exact band rises from 0.8667 to 0.9333. The paraphrase and hard bands are unchanged. The RRF-plus-guard arm is identical to the RRF arm.

### The one moved prompt: rank fusion beats lane magnitude
| id | band | prompt | gold | baseline top-1 | rrf top-1 |
|----|------|--------|------|----------------|-----------|
| q02 | exact | `codex pr review` | cli-codex | sk-code-review | **cli-codex** |

The weighted-sum baseline picked `sk-code-review` because the lexical tokens `pr` and `review` carried more weighted magnitude than the explicit-author `codex` signal. RRF rank fusion put `cli-codex`'s explicit-author rank first and the dominant intent won. This is the canonical case RRF is built for: rank fusion resists a single lane's magnitude swamping the correct dominant rank.

### The four shared baseline failures RRF does not move
| id | band | prompt | gold | both arms top-1 |
|----|------|--------|------|------------------|
| q15 | exact | `spec folder save context memory search` | system-spec-kit | memory:save |
| q17 | paraphrase | `open the browser developer tools and inspect why the page network requests are slow` | mcp-chrome-devtools | sk-code |
| q18 | paraphrase | `pull this site css into a reusable style reference document` | sk-design-md-generator | sk-code |
| q24 | paraphrase | `gather codebase context across the repository before planning` | deep-loop-workflows | system-spec-kit |

All four fail identically under both arms. The lane evidence itself points at the wrong skill (the `memory:save` bridge outscores `system-spec-kit` on save-context tokens, the chrome-devtools and design-md-generator paraphrases lose to `sk-code` on `inspect` and `css`, and deep-loop-workflows loses to `system-spec-kit` on `context`). RRF cannot promote a skill the lanes do not support, so these are corpus and lane-signal gaps, not a fusion failure.

## The two guard seams are dormant on the live corpus
- **Self-recommendation guard, inert.** The guard only fires for an advisor self-recommendation (`system-skill-advisor` or `skill-advisor`) on a read-only-explainer prompt. The labeled set carries no such prompt, so the guard never fires and the RRF-plus-guard arm is byte-equal to the RRF arm. The guard is built and safe, but this set cannot earn or fail it.
- **Conflict-rerank seam, structurally dormant.** The seam demotes a recommendation by the graph conflict mass the graph-causal lane emits, and that mass comes only from `conflicts_with` edges (multiplier -0.35). The live corpus carries only `enhances` (34), `siblings` (28), `prerequisite_for` (10) and `depends_on` (9) edges and zero `conflicts_with` edges. The seam has nothing to demote, so it is structurally dormant rather than measured as a win. This matches the conflict-rerank phase's own follow-up to re-check live conflict data before promotion.

## Safety
- **Default-off byte-identical.** The baseline arm is byte-identical across repeated runs over all 33 prompts (the full ranked output hash matches). With both flags off the scorer is the unchanged weighted-sum path.
- **Deterministic.** Every arm is run-to-run top-1 stable, so the one-prompt lift exceeds the zero-variance baseline.
- **Read-only.** The source `skill-graph.sqlite` hash is unchanged after the run and git shows no change to it.

## Verdict: REFINE

RRF fusion is a real, regression-free directional improvement: it corrects the one prompt where a strong lexical lane magnitude swamped the correct dominant rank, lifts top-1 from 0.8485 to 0.8788, and regresses nothing. With a deterministic scorer the lift exceeds run-to-run variance. But the margin is a single prompt of 33, the self-recommendation guard is inert on this set, and the conflict-rerank seam is structurally dormant because the live corpus carries no `conflicts_with` edges. Two of the cluster's three seams cannot earn a verdict on the current corpus, and a one-prompt win is a thin basis to graduate the cluster.

The named refinement, behind the existing default-off flags so it stays safe to ship dark:
1. Expand the labeled routing set to roughly 100 prompts with deliberate advisor-self read-only-explainer prompts, so the self-recommendation guard can earn or fail a verdict of its own, and with more near-tie paraphrases in the band where RRF and weighted-sum diverge, so the RRF margin is measured on enough divergent cases to be decisive rather than a single prompt.
2. Seed or wait for `conflicts_with` edges in the live corpus so the conflict-rerank seam has conflict mass to demote, then re-benchmark the seam on prompts where two conflicting skills compete.
3. Re-run this harness after each so the RRF core, which is the closest to graduate-ready, is graduated on a margin wider than one prompt and the two guards land their own evidence-backed verdicts.

## Reproduce
`node scripts/advisor-rrf-benchmark.mjs` rebuilds `results/metrics.json` from the read-only projection copy, exit 0.
