---
title: "Deep Research: Improving the Jev Spec-Track Narrowing (feature 017)"
description: "Merged two-lineage research on why the Jev spec-track narrowing measured keep, how to raise its accuracy and lower its cost, how to make the measurement trustworthy, where else the judgment pays off, and what default-on would need."
trigger_phrases:
  - "jev track narrowing improvement"
  - "score-track-narrowing research"
  - "gate 1 track narrowing default-on"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Improving the Jev Spec-Track Narrowing (feature 017)

Two lineages researched the same five questions independently: DeepSeek V4.1 Flash at max thinking through cli-pi (5 iterations) and GPT-6 Luna at max reasoning on the fast tier through cli-codex (3 iterations). This report merges them. Figures marked **[session-verified]** were recomputed by the orchestrating session from the recorded call log. Everything else is a lineage claim with its cited source.

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

- **Feature**: 017 spec-track narrowing, measured `keep`
- **Measured row**: `verdict jev: keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330`, p50 330 ms, p95 391 ms [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt]
- **Lineages**: `deepseek` 5 of 5 iterations, `luna` 3 of 3, both `maxIterationsReached`
- **Merge**: `fanout-merge.cjs` merged 2 lineages, 0 skipped
- **Date**: 2026-10-03

## 2. Request Summary

Answer five questions with `file:line` evidence: what drove the result, how to raise accuracy or lower cost, how to make the measurement more trustworthy, where else in `.skilled` the same judgment would pay off, and what a default-on integration would need, cost and risk. Research only.

## 3. What Drove the Result

**A relative lift over a weak baseline, with no absolute floor.** Jev named the right track on 97 of 256 questions (37.9%) against ripgrep's 68 (26.6%), a paired 78 to 49 split. The keep rule tests relative lift and has no minimum absolute accuracy, so it passes while Jev is wrong on most rows. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:880-886] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md:67-72]

**The margin is thin.** The gate `10*(A-B) >= M` is 290 >= 256, a slack of 3.4 rows **[session-verified arithmetic]**. A four-row swing flips the verdict. DeepSeek adds that margin and sign test score the same difference twice, because A-B is identically W-L. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:883] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:948]

**The questions are packet prose, not Gate 1 prompts.** Each packet description becomes a question, capped at 20 per track by a path hash: 256 kept of 1,727 usable, so system-speckit's 1,009 usable packets contribute 20 and cli-orca contributes 1. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:330]

**On paraphrases the ranking flips.** Among 14 gold-bearing Latin paraphrase probes, ripgrep is right 8 times and Jev twice, with Jev abstaining on 9. Both lineages read this as a direct transfer warning. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt:34]

**Both baselines are handicapped by construction.** The lookup needs one phrase key to cover 80% of query tokens and excludes the question's own folder, scoring 17/256. Ripgrep takes a track plurality over token presence. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:146] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:456] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:512]

**Abstention costs rows.** 57 rows have a modal `none` and 3 have no two-vote mode, all counted wrong. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:937]

## 4. Raising Accuracy and Lowering Cost

1. **Probability-aware aggregation is a free row.** Summing `pickProb` across the three orders instead of taking the modal pick scores 98 against 97 **[session-verified]**, using fields already logged and never read by scoring. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1357]
2. **Abstentions are lost, not latent.** None of the 57 `none` rows picked the gold track in any order **[session-verified]**. A softer `none` threshold does not recover them. Decided-subset accuracy is 48.7%, still under half.
3. **Attack the abstention clusters.** DeepSeek reports sk-design abstained on 16 of 20 and three tracks hold 32 of the 57. Luna's matching advice is to diagnose per-track confusion before editing track descriptions, then add contrastive descriptions and aliases only where errors show a missing distinction.
4. **Order rotation is not a tax.** Each order alone scores 94, 95 and 96 **[session-verified]**. Luna proposes one serving call per ambiguous request, a two-thirds call cut against the three-order protocol, after measuring it on a frozen holdout.
5. **Shrink the payload.** DeepSeek finds the option block is 96.8% of each ~1,118-token call. A two-stage shortlist of 5 candidates would cut input by about 68%, as a call-shape amendment. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1240]
6. **Call Jev selectively.** Keep a validated lexical answer when it is safe, call Jev only on ambiguous requests, and fall back to broad search on `none`, low confidence or out-of-domain prompts (Luna). Thresholds must come from held-out real requests.

## 5. Making the Measurement More Trustworthy

1. **Pin the row set.** `report.json` stores counts only, `calls.jsonl` stores no question text, and questions are re-derived from live `description.json`. Two runs can report K=256 over different rows. Add row ids, question hashes, gold and the option-set and model tuple. Luna adds a keyed prompt digest, since a plain hash may reveal common prompts. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1474] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:79]
2. **Stop losing history.** Reusing `--out` truncates `calls.jsonl` and overwrites `report.json`. This was already logged as an unchased P2. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1113]
3. **Treat tracks as clusters.** DeepSeek reports per-track accuracy from 0.15 (sk-design) to 1.00, so the 256 rows are 16 heterogeneous clusters, not exchangeable draws. Add a cluster-aware bootstrap and repeat the run at least twice. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:813]
4. **Build a real-request holdout.** Luna's central ask: independently labeled Gate 1 requests with consent and redaction, true `none` and cross-track cases, a time-separated holdout, and both traffic-weighted and per-track recall.
5. **Audit labels.** Labels are unaudited, and sibling feature 022 had its fixture target wrong on every row. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md]
6. **Already sound.** The exact BigInt sign test, and 811 of 811 calls measured on attempt 1 with no retry contamination. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:832]

## 6. Other .skilled Judgment Opportunities

- **Skill-advisor near-tie routing (Luna, strongest).** Offline holdout top-1 is 53/70, and a Jev tie-break evaluator already exists that runs a zero-call census by default. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs:6-35] [SOURCE: .skilled/skills/system-skill-advisor/README.md:229-230]
- **`/speckit:search` (DeepSeek).** It declares semantic matching unsupported today. [SOURCE: .skilled/commands/speckit/search.md:138]
- **The classifier family shares this scorer shape.** Spec-folder suggestion (`keep K=40 A=39 B=30`), clarify default (`keep K=54 A=28 B=15`), injection screen and completion claims use the same keep rule, so the trust upgrades in section 5 multiply when applied once. [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md:42] [SOURCE: .skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md:30]
- **Advisor suggested-order eval** already uses mean-probability ordering, a precedent for the aggregation change. [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md:28]
- **Offline trigger-phrase quality judge** (DeepSeek). The generator already buckets rejected phrases. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:256]
- **Not the lookup itself (Luna).** A track choice cannot fix a missing phrase candidate or a wrong document inside the track. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:132-210]

## 7. Default-On Integration: Requirements, Cost, and Risk

**Requirements.** An absolute accuracy and per-track recall floor set by the operator, since the relative keep rule is not a release gate. A calibrated confidence and abstention policy. Broad search preserved on `none`, low confidence, timeout, or missing Jev or auth. Shadow first, then a staged canary with a kill switch. Pinned option set and model version. Privacy-safe telemetry with no raw prompts. The fleet policy already covers availability: "Jev only, dormant unless `jev auth status` passes. Jev gets no secret". The `cli-jev` transport is already the serving substrate. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/goal.md:47] [SOURCE: .skilled/skills/cli-classifier/SKILL.md:22]

**Cost.** One call is p50 330 ms. DeepSeek notes that roughly doubles the 200 ms p95 budget the cold lookup holds itself to. Luna notes the advisor hook budget is 2,500 ms. Both point to calling Jev only when the lexical lanes miss or disagree. Dollar cost is UNKNOWN. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs:43] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:25]

**Risk.** False narrowing is the primary risk: a wrong track hides relevant specs from the scoped search, and default-on turns Gate 1's fail-open no-hit into a wrong-answer mode. Other risks are poor transfer from packet prose, prompt disclosure, and model or option drift.

## 8. Ranked Recommendations

| # | Recommendation | Evidence | Effort |
|---|---|---|---|
| R1 | Keep hard narrowing offline until a real-request holdout passes | 37.9% accuracy; paraphrase probe favors ripgrep 8 to 2 | None |
| R2 | Pin the row set and model tuple in the report, and stop `--out` truncation | report stores counts only; P2 truncation record | Small |
| R3 | Adopt probability-aware aggregation and report decided-subset accuracy plus margin slack | 98 vs 97 [session-verified]; 3.4-row slack | Small, scoring amendment |
| R4 | Build an independently labeled Gate 1 request holdout with per-track and traffic-weighted recall | packet-prose proxy; 16 heterogeneous clusters | Medium |
| R5 | Publish a per-track confusion and abstention analysis before editing track descriptions | 57 unrecoverable abstentions [session-verified]; sk-design 16/20 | Small |
| R6 | Repeat the run and add a cluster-aware bootstrap | margin of 3.4 rows; one recorded run | Medium |
| R7 | Measure one-call and shortlist serving against the three-order protocol | per-order 94/95/96 [session-verified]; 96.8% payload is options | Medium |
| R8 | Port R2, R3 and R6 to the shared classifier-family scorer pattern | five sibling scorers share the keep rule | Small to medium |
| R9 | Only then stage advisory, miss-only serving with fallback, timeout and kill switch | latency and false-narrowing risk | Medium |

## 9. Confirmed, Inferred, and Unknown

**Confirmed by the session.** Modal 97/256, probability-sum 98/256, 57 modal `none` rows with the gold track absent from every order, per-order 94, 95 and 96, and the 3.4-row margin arithmetic, from `017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl`.

**Lineage claims, not re-run.** Per-track accuracy range and abstention concentration, the 96.8% payload share and the 68% shortlist saving, the 17/256 lookup score, and the adjacent-surface figures.

**Unknown.** Real Gate 1 traffic mix and no-hit rate. Calibration of `pickProb`. Run-to-run variance. Dollar cost, backend retention and end-to-end hook latency.

## 10. Eliminated Alternatives

| Approach | Reason eliminated | Lineage |
|---|---|---|
| Rerank trigger-index candidates with Jev | Earlier work dropped it for no counted misrank; 017 excludes it | luna |
| Recover abstentions with a softer `none` cut | No abstained row picked gold in any order | deepseek, session-verified |
| Read order rotation as a cost to remove for accuracy | Each order alone scores within 2 rows of the modal answer | deepseek, session-verified |
| Default-on hard narrowing now | Wrong more often than right; no absolute gate | both |

## 11. Divergence Map

- **Saturated.** Verdict arithmetic and corpus construction, covered by both.
- **Pivots.** DeepSeek went into the call log for per-row behavior and payload. Luna focused on release contract and the advisor as the adjacent target.
- **Remaining frontier.** Real-request labels, calibration, and per-runtime end-to-end latency.

## 12. Open Questions

1. What fraction of real Gate 1 prompts are lexical misses, the only place a miss-only Jev call would serve?
2. Is `pickProb` calibrated well enough to gate on?
3. How much does a second run move A, given 3.4 rows of slack?
4. Which absolute accuracy and per-track recall floors would the operator accept for hard narrowing?

## 13. Lineage Agreement and Disagreement

Both lineages agree the keep is real as measured, that the corpus is a proxy, that the paraphrase probe is a warning, and that default-on needs a real-request holdout and broad-search fallback.

They differ in emphasis, not substance. DeepSeek found row-level improvements in the call log (aggregation, abstention, payload) and named the classifier family as the place to reuse trust fixes. Luna focused on the release contract, privacy-safe digests, and the advisor near-tie route as the strongest adjacent target. Luna's lineage registry shows 5 open questions despite answers in its deltas. The merge rebuilt the registry from the deltas.

## 14. Evidence Ledger

| Claim area | Evidence |
|---|---|
| Measured row and probes | `017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt` |
| Keep rule and corpus | `score-track-narrowing.mjs:330, 456, 512, 880-886, 937, 948` |
| Row-level behavior | `017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl` |
| Trust gaps | `score-track-narrowing.mjs:1113, 1474`; `retrieval/README.md:79` |
| Adjacent surfaces | `score-jev-tiebreak.mjs:6-35`; `speckit/search.md:138`; sibling feature catalogs |
| Integration policy | `003-cli-jev-workflow-integration/goal.md:47`; `cli-classifier/SKILL.md:22` |

## 15. Method and Evidence Limits

Each lineage ran in its own detached directory under `research/lineages/`. One recorded Jev run backs every figure, so variance is unknown. The corpus is a capped proxy. No live Jev call was made.

## 16. References

- `research/lineages/deepseek/research.md`
- `research/lineages/luna/research.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 8 (deepseek 5, luna 3)
- Questions answered: 5 / 5
- Remaining questions: 0 of the five; open follow-ups in section 12
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Divergence summary: see section 11
