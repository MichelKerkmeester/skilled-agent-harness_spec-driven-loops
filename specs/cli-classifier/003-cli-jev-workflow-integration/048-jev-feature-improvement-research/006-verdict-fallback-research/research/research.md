---
title: "Deep Research: Improving the Jev Reviewer Verdict Fallback (feature 025)"
description: "Merged two-lineage research on why the Jev reviewer verdict fallback measured keep, how to raise its accuracy and lower its cost, how to make the measurement trustworthy, where else the judgment pays off, and what default-on would need."
trigger_phrases:
  - "jev verdict fallback improvement"
  - "score-verdict-fallback research"
  - "reviewer verdict regex miss"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Reviewer Verdict Fallback (feature 025)

Two lineages researched the same five questions independently: DeepSeek V4.1 Flash at max thinking through cli-pi (5 iterations) and GPT-6 Luna at max reasoning on the fast tier through cli-codex (3 iterations). This report merges them. Figures marked **[session-verified]** were recomputed by the orchestrating session from the recorded call log, the outputs file and the shipped `extractVerdict`. Everything else is a lineage claim with its cited source.

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

- **Feature**: 025 reviewer verdict fallback, measured `keep`
- **Measured row**: `verdict jev: keep K=24 M=24 A=24 B=8 W=16 L=0 F=0 p_win=0.00001526`, baselines majority 8/24 and loose 0/24, run `~/.skilled/.labels/runs/047-025-jev-20261002`
- **Corpus**: 24 reviewer reports written so the regex misses every one
- **Lineages**: `deepseek` 5 of 5 iterations, `luna` 3 of 3, both `maxIterationsReached`
- **Date**: 2026-10-03

## 2. Request Summary

Answer five questions with `file:line` evidence: what drove the result, how to raise accuracy or lower cost, how to make the measurement more trustworthy, where else in `.skilled` the same judgment would pay off, and what a default-on integration would need, cost and risk. The fallback decides `pass`, `fail` or `block` for a reviewer output the deterministic `extractVerdict` misses. Research only.

## 3. What Drove the Result

**A perfect column on a corpus built to be missed.** Jev picked the labeled verdict on all 24 rows. The labels split exactly 8 pass, 8 fail, 8 block **[session-verified]**, so the majority baseline is fixed at K/3 = 8 by construction. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:294-311]

**Both zero-call readers are evaded by design.** The 24 reports contain no whole-word `pass`, `fail` or `block` token **[session-verified]**, while inflected forms appear. `extractVerdict` fires only on a line that is just the verdict word, optionally after `verdict`, `result` or `status`, and the loose rule reads only whole words. A human still reads the verdict easily. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:279-282]

**The sign test is the only binding gate.** p_win is 2^-16. DeepSeek notes 12 wins of 16 is the smallest passing count, so the margin and coverage gates had wide slack. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:348-357]

**Order rotation found nothing to stabilize.** All three option orders gave the same pick on all 24 rows, and the lowest `pickProb` was 0.96 **[session-verified]**.

**The shipped fixtures never miss.** The same run reports `fixture cases: 8 hits: 8 misses: 0`. Every `reviewer-*` fixture writes a `VERDICT:` line, so the scored population is the operator-supplied outputs file, not real reviewer traffic. Both lineages stress that natural miss prevalence is unmeasured.

**The labels are author intent, re-read.** The committed `025-intended.jsonl` cycles the three verdicts by row, and the blind arbiter matched it 24 of 24. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

## 4. Raising Accuracy and Lowering Cost

1. **Fix the producer first (Luna).** The reviewer schema already asks for one parseable `VERDICT:` line. A typed verdict field or enforced output schema prevents misses before any model call. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:80-88]
2. **Widen the regex only where natural misses show it.** The shipped `extractVerdict` misses `**VERDICT: FAIL**`, `Verdict: **FAIL**`, `# VERDICT: FAIL`, `Final verdict: pass` and `Verdict: FAIL (stale evidence)` **[session-verified]**. These are plausible real formats. Luna warns against matching any prose occurrence, which would read examples and negations as verdicts.
3. **One call per miss in serving.** With all orders agreeing, a one-call protocol would have used 25 calls (24 plus auth) instead of 73 with identical picks, a 66% cut. Keep three orders for offline audits until one-call quality passes its own holdout, since one corpus cannot prove order bias absent.
4. **Add an abstain outcome.** Luna separates an explicit `BLOCK` (the reviewer cannot decide) from prose with no stated verdict, which should stay unknown rather than be forced into a class. [SOURCE: .skilled/skills/cli-classifier/cli-jev/references/integration-patterns.md:61-72]
5. **Record real cost.** `calls.jsonl` drops the client's reported `usage` tokens, so the only cost figure is a character estimate. A content-hash cache exists in the same pipeline and is unused here. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:702-708,758-773] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:1-45]

## 5. Making the Measurement More Trustworthy

1. **Measure prevalence and conditional accuracy separately (Luna).** Run a zero-call census over ordinary reviewer reports for the miss rate, then judge a representative sample of natural misses. Whole-run value is roughly miss prevalence times the paired gain on natural misses. Keep the 24-row set as a stress suite. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:244-258,1030-1044]
2. **Capture outputs so the census can run.** No `reviewer-report.json` exists anywhere, and live runs keep only a 16-character output hash. The loop is designed end to end and has never run. The missing piece is capture, not code. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:190-204]
3. **Independent labels.** Two blind readers and an arbiter blind to intent, with a no-decision class kept distinct from `BLOCK`. DeepSeek finds no per-row decisions record for 025, unlike 035.
4. **Report uncertainty.** DeepSeek computes a one-sided 95% lower bound of 88.3% for 24/24 and estimates about 59 rows to surface a 5% per-class error. Treat each report as the unit, not each call.
5. **Record instrument identity.** `report.json` carries the question hash and `labels_sha256` but no repo commit, scorer version, run time or corpus provenance.

## 6. Other .skilled Judgment Opportunities

- **The reviewer scorer's grader slot (DeepSeek, best fit).** `classifyWithGrader` fires exactly on a regex miss under `--grader llm`. A `jev` grader value would reuse this frozen question and keep. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:155-171,273-279]
- **Residue-flagger skipped rows (DeepSeek).** The deep-review table parser keeps only exact `P0/P1/P2` rows and skips the rest. Severity classification would be a new question; 033 killed flagging on precision. [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs:139-206]
- **Deliverable extraction's low path.** Without tags or fences the extractor returns the whole transcript at low confidence. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/shared/extract-deliverable.cjs:8-38]
- **Hallucination grading and fan-out merge (Luna).** Already measured keeps (024, 030). Completion claims, stop rating and debug next-check show the same judgment should not be turned on everywhere: they stopped or were killed.
- **Not runtime completion detection (DeepSeek).** `fanout-run.cjs` resolves missing stop reasons from on-disk artifacts, and a model read would reintroduce self-report trust. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:907-969]

## 7. Default-On Integration: Requirements, Cost, and Risk

**Requirements.** A later, operator-approved integration phase, since 025 excludes a Jev grader, a global switch and a shared client. A natural-miss census and labeled holdout first. Deterministic parsing stays first, and Jev is called only on unresolved output. One production call per miss. A written egress and retention policy, since reviewer text leaves the machine. A pinned version, a credential check, bounded timeout and retry, and requalification on model change. Fail-closed semantics: invalid choice, timeout or missing credential stays unknown and visible, never silently `BLOCK`. A `verdictMethod` naming decision, because D4 keys on `llm-grader`. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:91-97] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:505-548,845-850]

**The only home today is inert.** In the benchmark lane, the shipped reviewer profile has 8 hits and 0 misses, so a Jev grader there would never fire until miss-case fixtures exist. [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:39-65,204-206]

**Cost.** About N×r calls for N reports at miss rate r with one call per miss. p50 334 ms. Dollar cost and r are UNKNOWN.

**Risk.** Corpus validity first. Then egress, false confidence (a fail read as pass is asymmetric), model drift, the forced three-way choice with no abstain key, and cost creep at unknown volume.

## 8. Ranked Recommendations

| # | Recommendation | Evidence | Effort |
|---|---|---|---|
| R1 | Capture reviewer outputs and run the zero-call miss census | no `reviewer-report.json` exists; prevalence unmeasured | Medium |
| R2 | Label natural misses with two blind readers and a no-decision class | labels are author intent re-read; no decisions record | Medium |
| R3 | Have the producer emit a typed verdict; keep the parser strict | schema already asks for one line | Small |
| R4 | Widen the regex for bold, heading and qualified forms observed in natural misses | five plausible forms miss [session-verified] | Small |
| R5 | Serve one call per miss and keep three orders for audits | all orders agree on 24/24 [session-verified]; 73 to 25 calls | Small, re-measure |
| R6 | Add an abstain outcome and fail-closed unknown | forced three-way choice today | Small |
| R7 | Extend the report: commit, scorer version, usage tokens, intervals, per-class confusion | report lacks instrument identity | Small |
| R8 | Add `jev` as an opt-in grader with miss-case fixtures in `reviewer-regression` | inert until fixtures miss | Small to medium |
| R9 | Reuse the question discipline for residue severity next | skipped rows feed the review ladder | Medium |

## 9. Confirmed, Inferred, and Unknown

**Confirmed by the session.** The 8/8/8 label split, zero whole-word verdict tokens, same pick across orders on 24/24 rows with minimum `pickProb` 0.96, and the five regex misses, from `~/.skilled/.labels/025-outputs.jsonl`, the 047-025 call log and the shipped `extractVerdict`.

**Lineage claims, not re-run.** The confidence bounds, the missing decisions record, the grader-slot and residue-flagger seams, and the dropped usage tokens.

**Unknown.** Natural miss prevalence. Accuracy on natural misses, including no-decision text. Token and dollar cost. Order bias beyond this corpus.

## 10. Eliminated Alternatives

| Approach | Reason eliminated | Lineage |
|---|---|---|
| Flip the grader default on this corpus | Inert on shipped fixtures; the only misses are synthetic | deepseek |
| Read 24/24 as production accuracy | Rows selected as misses; prevalence unmeasured | both |
| Match any prose occurrence of a verdict word | Reads mentions, examples and negations | luna |
| Treat no stated decision as `BLOCK` | `BLOCK` means the reviewer cannot decide | luna |
| Read `F=0` as proof order never matters | One corpus with unanimous picks | deepseek |
| Use a model in runtime completion detection | Reintroduces self-report trust | deepseek |

## 11. Divergence Map

- **Saturated.** The corpus-built keep and the unmeasured prevalence, found by both.
- **Pivots.** DeepSeek probed the regex, recomputed stability and ranked transfer seams. Luna focused on the producer contract, the abstain class and the prevalence-times-gain framing.
- **Remaining frontier.** Natural-miss capture and labels.

## 12. Open Questions

1. What is the natural regex-miss rate by reviewer and model version?
2. Do two blind readers reliably separate explicit verdicts from no-decision text?
3. Does one call per natural miss hold accuracy and abstention on a locked holdout?
4. Which egress and retention policy governs reviewer text?

## 13. Lineage Agreement and Disagreement

Both lineages agree the keep is real on a stress corpus that cannot estimate real traffic, that one call per miss is the serving shape pending its own holdout, and that default-on needs a separate approved phase.

They complement each other. DeepSeek supplied the recomputations, regex probes and the transfer seams. Luna supplied the producer-first fix, the abstain class and the prevalence-times-gain framing. No finding conflicts.

## 14. Evidence Ledger

| Claim area | Evidence |
|---|---|
| Measured row and calls | `~/.skilled/.labels/runs/047-025-jev-20261002/{report.json,calls.jsonl}`; `047.../results.md:14` |
| Corpus and labels | `~/.skilled/.labels/025-outputs.jsonl`; `047.../scratch/fixtures/025-intended.jsonl` |
| Regex and scorer | `reviewer-scorer.cjs:117-123, 155-204, 273-279`; `score-verdict-fallback.cjs:244-311, 348-357, 505-548, 700-773, 845-850, 1030-1044` |
| Producer contract | `reviewer-schema.md:80-88` |
| Seams | `score-residue-flagger.cjs:139-206`; `extract-deliverable.cjs:8-38`; `fanout-run.cjs:907-969` |

## 15. Method and Evidence Limits

Each lineage ran in its own detached directory under `research/lineages/`. The corpus is 24 synthetic rows authored to miss. No natural reviewer output exists to measure against. No live Jev call was made.

## 16. References

- `research/lineages/deepseek/research.md`
- `research/lineages/luna/research.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8 (deepseek 5, luna 3)
- Questions answered: 5 / 5
- Remaining questions: 0 of the five; open follow-ups in section 12
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Divergence summary: see section 11
