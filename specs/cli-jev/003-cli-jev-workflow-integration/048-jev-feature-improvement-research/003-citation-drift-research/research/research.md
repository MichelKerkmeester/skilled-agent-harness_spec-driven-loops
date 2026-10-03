---
title: "Deep Research: Improving the Jev Citation Drift Scan (feature 032)"
description: "Merged two-lineage research on why the Jev citation drift scan measured keep, how to raise its accuracy and lower its cost, how to make the measurement trustworthy, where else the judgment pays off, and what default-on would need."
trigger_phrases:
  - "jev citation drift improvement"
  - "cite-drift-scan research"
  - "citation drift default-on"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Citation Drift Scan (feature 032)

Two lineages researched the same five questions independently: DeepSeek V4.1 Flash at max thinking through cli-pi (5 iterations) and GPT-6 Luna at max reasoning on the fast tier through cli-codex (3 iterations). This report merges them. Figures marked **[session-verified]** were recomputed by the orchestrating session from the recorded call log and the committed label file. Everything else is a lineage claim with its cited source.

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

- **Feature**: 032 citation drift scan, measured `keep`
- **Measured row**: `verdict jev: keep K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=3 p=2.384e-7`, run `~/.skilled/.labels/runs/032-jev-20261001`
- **Corpus**: 20 live citations and 20 constructed rows whose window moved 60+ lines down the same file; verdicts 23 contradicts, 8 partial, 9 supports **[session-verified]**
- **Lineages**: `deepseek` 5 of 5 iterations, `luna` 3 of 3, both `maxIterationsReached`
- **Date**: 2026-10-03

## 2. Request Summary

Answer five questions with `file:line` evidence: what drove the result, how to raise accuracy or lower cost, how to make the measurement more trustworthy, where else in `.skilled` the same judgment would pay off, and what a default-on integration would need, cost and risk. Research only.

## 3. What Drove the Result

**A comparator that cannot see same-file drift.** The identifier-overlap baseline fires only when the citing line's backticked tokens vanish from the window. In every constructed row the tokens still appear, so the baseline scores 0 of 20 there and 13 of 40 overall. Most of the 22-row margin is that blindness. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:540-564] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:607-630]

**Jev is precise but misses some drift.** 26 of 26 flags are right and 26 of 31 drifted rows are caught. All five errors are misses, three near the line. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1157-1174]

**The pooled p is dominated by the constructed half, but each half keeps on its own.** Jev is right on 19 of 20 live rows and 16 of 20 constructed rows **[session-verified]**. DeepSeek reports live alone at W=6 L=0, p=0.015625, against the pooled 2.384e-7. Each half passes all five keep checks, so the decision is robust while the pooled p overstates the live evidence.

**`F=3` is dissent votes, not unstable rows.** It sums rerun votes against the modal answer: 3 of 120 votes, a 2.5% dissent rate. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1009-1014]

## 4. Raising Accuracy and Lowering Cost

1. **Change the aggregation, at zero call cost.** Over the same 120 recorded answers **[session-verified]**:

   | Flag rule | A | TP | FP |
   |---|---:|---:|---:|
   | modal p<0.5 (current) | 35 | 26 | 0 |
   | min of reruns <0.5 | 36 | 27 | 0 |
   | mean <0.6 | 37 | 29 | 1 |
   | mean <0.65 | 38 | 30 | 1 |
   | first call only | 34 | 25 | 0 |

   `min < 0.5` is the clean gain. The mean rules trade a false positive for more catches. All are rule changes that need a re-measure.
2. **Fix the claim unit.** The model receives one trimmed line as the claim. DeepSeek finds 3 of 20 live rows are bare `**Evidence**:` pointer lines with no claim, and one of them (live-17) is Jev's only live miss at every threshold up to 0.75. Send the enclosing paragraph, or exclude claim-less lines from live draws. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:160,1030]
3. **Spend reruns only near the line.** 12 of 40 rows have a call in [0.35, 0.65] **[session-verified]**. One screening call with confirmation only in that band uses about 65 calls instead of 121. A single call everywhere is worse (34/40). Luna agrees the policy needs its own holdout comparison first.
4. **Fix the read side, which is the real cost.** The model arm is 121 calls, about 41 s and about 41k input tokens. The census reads 8,667 tracked documents, one `git show` each, to find citations in 82, and the draw re-reads them: about 171 s by default and 381 s for a draw. Prefilter, batch with `git cat-file --batch`, or memoize by `(commit, path)` (Luna), confirming byte-identical census output. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:314-344,574-585]

## 5. Making the Measurement More Trustworthy

1. **Report per kind.** Publish live and constructed columns and a live-only sign test beside the pooled one.
2. **Validate row identity.** The draw records `claim_sha12` and `window_sha12`, but `buildWindows` rebuilds the text without comparing them (Luna). Check both before scoring. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:404-419,574-585]
3. **Audit the constructed labels.** They are contradictory by construction, but an arbitrary destination window could still happen to support the claim (Luna).
4. **Put label reliability in the record.** Two blind drafters and an arbiter labeled the set; the drafts sit in `042-label-drafting-and-confirmation/scratch/` as `032-luna.jsonl`, `032-swe.jsonl` and `032-arbiter.jsonl` **[session-verified: files exist]**. DeepSeek computes binary kappa 0.79 to 1.00, with every split resolved against a documented rater error. Jev's two doubtful live rows fall on two of the three rater splits, so model noise and label noise concentrate on the same rows.
5. **Make the record self-contained.** Store per-row outcomes, the kind split, and instruction, rule and row-set hashes in `report.json`. Widen requalification beyond provider and model. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:719-726]
6. **Test the decision branches.** No test covers `stop (sign test)`, `stop (flips)` or disagreeing reruns.
7. **Grow a stratified live holdout.** Luna's central ask: more live rows across skills and claim types, held out by commit or skill, with confidence intervals and calibration.

## 6. Other .skilled Judgment Opportunities

- **Spec acceptance-criteria evidence (both lineages).** DeepSeek counts 12,092 documents under `specs/` with `file:line` citations, against 82 in the skills tree. `AC_COVERAGE` checks only that the cited line exists, and unresolved citations still count toward coverage. A semantic advisory could ask whether the evidence demonstrates the criterion. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:438-457,567-589] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:95,101-103]
- **Resolution comes first.** DeepSeek finds 44 ambiguous and 103 unresolved citations in scope, mostly illustrative example paths such as `src/main.ts` in guidance prose. A wider scan needs an illustrative-reference classifier or it drowns in noise.
- **Goal-criteria lint (Luna).** It already has 98 labeled rows, Wilson intervals and an opt-in Jev arm, so reuse its labeling lessons. [SOURCE: .skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md:18-32]
- **Not the mirrors or governance docs.** They hold 1 to 3 line-anchored citations. Their dialect is path-only references, which need a path-existence check instead.

## 7. Default-On Integration: Requirements, Cost, and Risk

**Requirements.** A named reader, since the result is documented but consumed by nothing. Advisory only, never blocking. A deliberate amendment to the current zero-call default, with an offline path kept. Machine-visible `completed`, `skipped`, `partial` and `failed` states, because a skip still exits 0 today. A content and retention policy, since Jev receives the citing sentence, path and window. A bounded call and time budget. Deterministic dead-citation findings kept separate. [SOURCE: .skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:26,30] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1025-1032]

**Shape.** The 40-row set as a frozen regression benchmark, plus explicit re-draw and re-label cycles. Periodic, not per-commit: a run takes minutes today and needs labels and a credential.

**Cost.** `3N+1` calls for `N` labeled rows, p50 326 ms. Model cost scales with labeled rows, not corpus size. Dollar cost is UNKNOWN.

**Risk.** Claim-less rows, threshold-adjacent flips, silent skips, repository text leaving the machine, and model drift. DeepSeek adds that the zero-call dead check currently finds nothing actionable in live guidance, so the feature is a model-backed measurement, not a lint.

## 8. Ranked Recommendations

| # | Recommendation | Evidence | Effort |
|---|---|---|---|
| R1 | Flag on `min(reruns) < 0.5` and keep modal for reporting | 36/40, FP 0 [session-verified] | Trivial, re-measure |
| R2 | Report live and constructed columns and a live-only sign test | live 19/20, constructed 16/20 [session-verified] | Small |
| R3 | Send the enclosing paragraph as the claim, or drop claim-less lines from live draws | live-17 is a bare Evidence line | Small, re-measure |
| R4 | Validate `claim_sha12` and `window_sha12` before scoring | hashes recorded, never compared | Small |
| R5 | Make the record self-contained and widen requalification to instruction, rule and row-set hashes | `cite-drift-scan.mjs:719-726` | Small |
| R6 | Batch or memoize document reads in the census and draw | 8,667 reads for 82 citing docs | Small to medium |
| R7 | Test the stop branches and disagreeing reruns | no coverage today | Small |
| R8 | Adaptive reruns in the [0.35, 0.65] band | 12/40 rows in band [session-verified] | Medium, re-measure |
| R9 | Localize the baseline's token check or restrict the margin check to live rows | baseline 0/20 on constructed rows | Medium, re-measure |
| R10 | Integrate as periodic advisory against the frozen benchmark, with explicit status states and a content policy | zero-call contract; skips exit 0 | Medium |
| R11 | Expand to spec acceptance-criteria evidence after an illustrative-reference classifier exists | 12,092 citing spec docs; deadness-only today | Large |

## 9. Confirmed, Inferred, and Unknown

**Confirmed by the session.** The aggregation table, per-kind accuracy, the 12-row band count and the verdict mix, from `~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl` and `cite-drift-labels.jsonl`. The rater draft files exist in 042.

**Lineage claims, not re-run.** The kappa values, the live-only sign test, the claim-less row count, the census read counts and timings, and the spec citation counts.

**Unknown.** Accuracy on a larger live holdout. Whether the paragraph claim unit removes more than the one attributable miss. Dollar cost. Retention terms for the content sent.

## 10. Eliminated Alternatives

| Approach | Reason eliminated | Lineage |
|---|---|---|
| Constructed rows inflate accuracy | They are the harder half, 16/20 against 19/20 live [session-verified] | deepseek |
| The keep is an artifact of the constructed half | Each half passes all five checks alone | deepseek |
| Fewer reruns fix the misses | First call only is worse, 34/40 [session-verified] | deepseek |
| Read `F=3` as three unstable rows | It counts dissent votes | both |
| Wire into the pre-commit hook | Minutes per run; needs labels and a credential | deepseek |
| Auto-label draws with a model | The draw keeps labels human by design | deepseek |
| Silently enable semantic calls by default | The documented default is zero calls | luna |
| Auto-edit citations or block completion on model flags | Holdout too small; flags can be wrong | luna |

## 11. Divergence Map

- **Saturated.** Verdict arithmetic and baseline weakness, covered by both.
- **Pivots.** DeepSeek replayed the call log and computed rater agreement from the 042 drafts. Luna focused on row-hash validation, constructed-label audit and the default-on contract.
- **Remaining frontier.** A larger live holdout, the paragraph claim unit, and the illustrative-reference classifier.

## 12. Open Questions

1. Does the paragraph claim unit survive re-labeling and remove more than the one miss?
2. Does a localized baseline leave the keep intact?
3. Who owns the periodic advisory run, and does it feed the sk-doc verification row or a spec-phase gate?
4. Can the illustrative-reference classifier be deterministic, or does it need its own model judgment?

## 13. Lineage Agreement and Disagreement

Both lineages agree the keep is real on its fixed benchmark, that the constructed half and weak comparator shape the headline, and that default-on must be advisory, budgeted and an explicit amendment to the zero-call contract.

They disagree on label provenance. Luna states the live half has no second-rater step. The 042 folder holds blind Luna and SWE drafts and an arbiter file for 032, so DeepSeek's account of two blind raters plus an arbiter is the supported one. Luna read the feature catalog, which does not describe the 042 process.

## 14. Evidence Ledger

| Claim area | Evidence |
|---|---|
| Measured row and calls | `~/.skilled/.labels/runs/032-jev-20261001/{report.json,calls.jsonl}` |
| Scorer, baseline and gates | `cite-drift-scan.mjs:82, 160, 314-344, 404-419, 540-564, 607-707, 719-726, 1009-1014, 1157-1174` |
| Labels | `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl` |
| Rater drafts | `042-label-drafting-and-confirmation/scratch/` (`032-luna.jsonl`, `032-swe.jsonl`, `032-arbiter.jsonl`) |
| Adjacent surfaces | `check-ac-coverage.sh:438-457,567-589`; `validation-rules.md:95-103`; `goal-criteria-lint.md:18-32` |

## 15. Method and Evidence Limits

Each lineage ran in its own detached directory under `research/lineages/`. Counterfactuals are recomputations over the 120 recorded answers, evidence about this run only. The sample is 40 rows, half constructed. No live Jev call was made.

## 16. References

- `research/lineages/deepseek/research.md`
- `research/lineages/luna/research.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8 (deepseek 5, luna 3)
- Questions answered: 5 / 5
- Remaining questions: 0 of the five; open follow-ups in section 12
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Divergence summary: see section 11
