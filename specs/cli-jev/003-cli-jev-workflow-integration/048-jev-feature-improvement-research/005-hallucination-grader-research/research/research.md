---
title: "Deep Research: Improving the Jev Hallucination Grader (feature 024)"
description: "Merged two-lineage research on why the Jev hallucination grader measured keep, how to raise its accuracy and lower its cost, how to make the measurement trustworthy, where else the judgment pays off, and what default-on would need."
trigger_phrases:
  - "jev hallucination grader improvement"
  - "score-d4-agreement research"
  - "d4 grader default-on"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Hallucination Grader (feature 024)

Two lineages researched the same five questions independently: DeepSeek V4.1 Flash at max thinking through cli-pi (5 iterations) and GPT-6 Luna at max reasoning on the fast tier through cli-codex (3 iterations). Luna's lineage completed all three iterations, then hit the Codex usage limit before writing its own synthesis, so this report merges DeepSeek's synthesis with Luna's three iteration files. Figures marked **[session-verified]** were recomputed by the orchestrating session. Everything else is a lineage claim with its cited source.

## Table of Contents

1. Research Metadata
2. Request Summary
3. What Drove the Result
4. Raising Accuracy and Lowering Cost
5. Making the Measurement More Trustworthy
6. Other .skilled Judgment Opportunities
7. Default-On Integration: Requirements, Cost, and Risk
8. Ranked Recommendations
9. Confirmed, Inferred, and Unknown
10. Eliminated Alternatives
11. Divergence Map
12. Open Questions
13. Lineage Agreement and Disagreement
14. Evidence Ledger
15. Method and Evidence Limits
16. References
17. Convergence Report

---

## 1. Research Metadata

- **Feature**: 024 hallucination grader, measured `keep`
- **Measured row**: `verdict jev: keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906`, baselines majority 47/56 and deterministic check 22/56, run `~/.skilled/.labels/runs/047-024-jev-20261002`
- **Corpus**: 42 honest DeepSeek answers and 14 deliberately careless ones; all 9 hallucinations are in the careless set
- **Lineages**: `deepseek` 5 of 5 iterations; `luna` 3 of 3 iterations, no lineage synthesis (usage limit)
- **Date**: 2026-10-03

## 2. Request Summary

Answer five questions with `file:line` evidence: what drove the result, how to raise accuracy or lower cost, how to make the measurement more trustworthy, where else in `.skilled` the same judgment would pay off, and what a default-on integration would need, cost and risk. Research only.

## 3. What Drove the Result

**The grader separated the classes cleanly on this corpus.** 55/56 is 47 of 47 honest rows plus 8 of 9 hallucinating rows. Only 8 of the 168 grader calls fall in [0.40, 0.60) **[session-verified]**. The single miss is a real hallucination just under the line (0.43, 0.43, 0.40). [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:13]

**The baseline collapsed to majority-only.** The scorer takes the better of the deterministic check and the majority class. None of the 21 benchmark fixtures carries an allowlist **[session-verified]**, so the check treats every extracted name as unverified and flags the tasks' own function names. DeepSeek reproduced its 22/56 as tp=9, tn=13, fp=34, fn=0. Majority (47) wins, so W=8 and L=0 follow structurally. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:240-258] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:9-27]

**The corpus is designed high-signal.** All 9 positives are one hallucination family, invented local module paths and helpers produced by one careless prompt. The win is eight discordant pairs, and `p_win = 1/256` speaks only to those eight. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md:70-72]

## 4. Raising Accuracy and Lowering Cost

1. **Populate fixture allowlists.** This repairs the deterministic baseline, makes it a same-question comparator, and feeds the production grader, whose rubric compares against `fixture.allowlist`. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader.md:22-27]
2. **Close the context seam (Luna).** The agreement arm builds the grader input from the task, visible spec, allowlist and output. The 5-dimension D4 path passes a virtual fixture into `harness.gradeD4` instead, so the shipped grader does not receive the same context the measured one did. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:188-195] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:218-229]
3. **Confidence-aware reruns.** With only 8 of 168 calls near the line, a fourth call on borderline rows is cheap. `dispute.cjs` already supports a skeptic second call below confidence 0.7, but the 5-dimension adapter calls the primary harness directly and never reaches it (Luna). Calibrate the 0.5 line per model on a held-out split as a pre-registered hypothesis. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs:35,52-82]
4. **Cascade once allowlists land.** The check is perfectly sensitive here (fn=0), so sending only check-flagged rows to the model would route 43 of 56 rows today, 130 calls instead of 169, with no true positive dropped (DeepSeek, derived). With allowlists cutting false positives the routed set shrinks further. Needs a re-measure.
5. **Cost as measured.** 169 calls (1 auth plus 3 per row), about 93k estimated input tokens, p50 326 ms. Dollar cost is UNKNOWN. Luna warns that `F=1` and `M=56` say nothing about single-call error, so a one-call policy is a candidate to measure, not a validated saving. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:679-712]

## 5. Making the Measurement More Trustworthy

1. **Second rater.** DeepSeek reports the labels came from one delegated arbiter with no second rater. Re-label the 9 positive rows and every disagreement independently and record agreement. Luna asks for the same: blind independent annotation and adjudication. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md:44]
2. **Report per class with intervals.** DeepSeek derives 55/56 CP95 [0.905, 1.000] and 8/9 CP95 [0.518, 0.997]. Rows cluster by fixture, so the independence-assuming sign test overstates, and `p_win` sits above a 15-feature Bonferroni threshold of 0.0033.
3. **Requalify on labels too.** A rerun compares provider and model only. The labels SHA is printed but never compared, so a changed label set would silently re-verdict. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:841-845]
4. **Broaden the corpus.** Add fake packages, URLs, config keys, versions and adversarial outputs, and keep an untouched multi-source holdout.
5. **Repeat the run.** Feature 027's counts were stable across four runs. Do the same here to show the verdict is stable, not only the counts.

## 6. Other .skilled Judgment Opportunities

- **Deep-review findings (both lineages).** Every new P0/P1 already requires a claim, evidence references and a confidence. The review agent promises "no hallucinated or false-positive issues" but enforces it by self-attestation. A source check before a release gate fits. [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:73-75] [SOURCE: .skilled/agents/review.md:351-356]
- **Deep-research claim-to-source links (Luna).** The evidence graph distinguishes claims from sources with SUPPORTS, CONTRADICTS and CITES relations, a natural audit target. [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:50-52]
- **Citation drift (both).** sk-doc's scan already asks whether a cited window supports its sentence. Reuse the evaluation pattern with its own rubric. [SOURCE: .skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:18-30]
- **Benchmark reviewer-output grading (DeepSeek).** `reviewer-scorer.cjs` already loads reviewer fixtures with expected verdicts. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:46-51]
- **Route once through the cli-classifier hub** rather than hand-rolled prompts per site. [SOURCE: .skilled/skills/cli-classifier/SKILL.md:3]
- **Not planning documents**, where naming not-yet-existing artifacts is normal.

## 7. Default-On Integration: Requirements, Cost, and Risk

**Requirements.** Choose the backend and measure that backend: the keep validates the `jev` column, and the `llm` grader is a different implementation never measured here. Give grader failure a real state: today a dispatch or parse failure scores 0.0 **[session-verified at `score-model-variant.cjs:228`]**, maximal hallucination for a measurement that never happened, which with D4 weighted 0.15 can cost up to 15 aggregate points. Forward task, spec and allowlist. Wire low-confidence escalation. Keep model-family independence. Define a payload policy, since the grader prompt carries the full candidate output. Add a call budget and keep offline runs a hermetic no-op. Version and re-baseline reports, which stamp `scoringMethod` and `grader`. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:569-660,733-740] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/goal.md:48,52]

**Cost.** One primary grader call per new scored output, cached by a run-scoped identity, plus an escalation call on low confidence. A 40-output capability profile implies 40 D4 calls per uncached pass. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:388-417]

**Risk.** Evidence transfer across backends, failure-as-zero deflation, noise read as signal, same-family inflation, cache staleness behind a placeholder build hash, and injection from graded outputs. The autonomous benchmark is advisory only and cannot invoke promotion, which bounds the blast radius today. [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:233-245]

## 8. Ranked Recommendations

| # | Recommendation | Evidence | Effort |
|---|---|---|---|
| R1 | Populate `allowlist` on the 21 benchmark fixtures | 0 of 21 carry one [session-verified]; check fp=34 | Small |
| R2 | Give grader failure an unmeasured state instead of 0.0, with a retry | `score-model-variant.cjs:228` [session-verified] | Small |
| R3 | Forward task, spec and allowlist into the 5-dimension D4 path | context seam between arms | Small |
| R4 | Wire `dispute.cjs` low-confidence escalation into the 5-dimension adapter | adapter bypasses it | Small |
| R5 | Second rater on positives and disagreements; record agreement | single arbiter | Medium |
| R6 | Report per class with intervals; compare the labels SHA on requalify; repeat the run | clustered rows; SHA never compared | Small |
| R7 | Cascade check-flagged rows to the model once allowlists land | 130 vs 169 calls today | Medium, re-measure |
| R8 | Broaden the corpus beyond one hallucination family, with a holdout | all 9 positives one family | Medium |
| R9 | Measure the chosen backend before default-on; keep it advisory | `llm` grader never measured | Medium |
| R10 | Reuse the judgment for review findings and research claim links through the classifier hub | self-attested promises today | Medium |

## 9. Confirmed, Inferred, and Unknown

**Confirmed by the session.** 0 of 21 fixtures carry an allowlist. The failure path returns `score: 0.0`. 8 of 168 calls fall in [0.40, 0.60), from `~/.skilled/.labels/runs/047-024-jev-20261002/calls.jsonl`.

**Lineage claims, not re-run.** The check's tp/tn/fp/fn reproduction, the cascade arithmetic, the intervals and Bonferroni figure, the single-arbiter provenance, and the context-seam reading.

**Unknown.** Check and cascade behavior with populated allowlists. The `llm` grader's agreement. Inter-rater reliability. Robustness to hostile text. Dollar cost.

## 10. Eliminated Alternatives

| Approach | Reason eliminated | Lineage |
|---|---|---|
| Drop to two reruns | Saves a third but loses the flip signal; 1-1 ties need a third call anyway | deepseek |
| Cache answers in agreement claims | Freezes the sampling the flip count measures | deepseek |
| Treat a one-call policy as validated | `F=1` does not estimate single-call error | luna |
| Default-on by flipping one flag | Context, failure semantics, escalation and payload policy all change | luna |
| Apply the grader to planning docs | Naming future artifacts is normal there | deepseek |

## 11. Divergence Map

- **Saturated.** Verdict arithmetic and the allowlist-starved baseline, found by both lineages independently.
- **Pivots.** DeepSeek reproduced the check and derived cascade and interval figures. Luna traced the production D4 seam, the unwired escalation, and the review and research evidence structures.
- **Remaining frontier.** A re-run with allowlists, a measured `llm` arm, and an adversarial corpus.

## 12. Open Questions

1. With allowlists populated, does the deterministic check become a competitive baseline, and does the keep survive?
2. Does the `llm` grader agree with the labels as well as `jev` does?
3. What do the 9 positives and the disagreements look like under a second rater?
4. Which payload policy applies to hosted grading of benchmark output?

## 13. Lineage Agreement and Disagreement

Both lineages independently found that no fixture carries an allowlist, that this starves the baseline, and that the corpus is negative-heavy and narrow. Both put review findings and citation drift on the reuse list.

They complement each other on integration. DeepSeek led on failure-as-zero, requalification and cost arithmetic. Luna led on the context seam between the measured and shipped paths and the unwired escalation module. No finding conflicts.

Luna's lineage ended without its own synthesis because the Codex usage limit hit after iteration 3, so its contribution here comes from its three iteration files.

## 14. Evidence Ledger

| Claim area | Evidence |
|---|---|
| Measured row and calls | `~/.skilled/.labels/runs/047-024-jev-20261002/{report.json,calls.jsonl}`; `047.../results.md:13` |
| Scorer and baseline | `score-d4-agreement.cjs:188-195, 240-258, 679-712, 841-845`; `hallucination-flag.cjs:9-27` |
| Production D4 path | `score-model-variant.cjs:53-60, 214-230`; `harness.cjs:202-220, 388-417`; `dispute.cjs:35, 52-82` |
| Fixtures | `deep-improvement/assets/model-benchmark/benchmark-fixtures/` (21 files, 0 allowlists) |
| Adjacent surfaces | `deep-review/assets/prompt-pack-iteration.md.tmpl:73-75`; `deep-research/assets/prompt-pack-iteration.md.tmpl:50-52`; `agents/review.md:351-356` |

## 15. Method and Evidence Limits

Each lineage ran in its own detached directory under `research/lineages/`. The corpus is 56 fixture outputs with one hallucination family. Counterfactuals are arithmetic over the recorded run. No live Jev call was made.

## 16. References

- `research/lineages/deepseek/research.md`
- `research/lineages/luna/iterations/iteration-001.md` to `iteration-003.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8 (deepseek 5, luna 3)
- Questions answered: 5 / 5
- Remaining questions: 0 of the five; open follow-ups in section 12
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Divergence summary: see section 11
- Lineage note: luna completed its three iterations; its own synthesis step did not run because of the Codex usage limit
