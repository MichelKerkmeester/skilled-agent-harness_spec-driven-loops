# Deep Research Synthesis — Jev Citation Drift Scan (Luna)

## 1. Executive Summary

The recorded Jev arm is a strong result on its fixed 40-row benchmark: Jev got 35 rows right against the identifier-overlap baseline's 13, won all 22 discordant pairs, and passed every keep gate. The exact one-sided sign-test result is `p=2.384e-7`. The sample is half live citations and half constructed shifted windows, so it supports a promising benchmark result rather than production-wide accuracy claims (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:607-630,674-707,1157-1177`; `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:28`; `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122`).

Keep the deterministic path-and-line census independent. It resolves tracked prose citations and reports missing or out-of-range references with zero model calls by default; Jev adds the separate semantic question of whether the cited window still supports the claim (`.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:18-20,26,30`).

The highest-value next steps are to validate gold-row hashes during scoring, audit the construction labels, build a larger blinded live-only holdout, report uncertainty by sample stratum, and profile/cache committed-file reads. A default-on Jev path would change the current zero-call contract. It needs a separate production mode, explicit content/retention controls, hard call and time budgets, visible skip/failure states, and human review. The measured benchmark cost was 121 Jev subprocess calls for 40 rows; dollars are unknown without provider billing terms (`goal.md:44,122`; `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1008-1036`).

## 2. Research Question

This research answers five questions: what drove the keep result; how to improve semantic accuracy or reduce cost; how to make the measurement more trustworthy; where the same judgment is useful elsewhere in `.skilled`; and what default-on operation would require, cost, and risk.

## 3. Scope and Method

Three source-based passes reviewed the scorer, its feature description, the recorded Phase 047 run, the sibling goal-criteria lint, and System Spec Kit's acceptance-criteria evidence checks. This was read-only research. The Jev measurement was not rerun, no source or label file was changed, and no performance improvement was measured here. Recommendations below are hypotheses until validated on an independent holdout.

## 4. Existing Design

The deterministic scan reads tracked skill documentation, considers prose citations, resolves paths and line ranges, and reports dead citations without calling a model. The Jev arm is explicit via `--jev`, requires `--out`, checks the Jev binary/version/provider credential, then asks whether the cited code window still shows what the sentence claims (`.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:18-30`; `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:84-85,954-1005,1261-1263`).

The benchmark's comparator is the better of flag-nothing and identifier overlap on the same labeled rows. The keep gates are at least 90% coverage, at least 80% precision, a 10-point gain, paired sign-test `p < .05`, and a Jev dissent-vote rate no higher than 10% (`cite-drift-scan.mjs:82,607-630,700-707`).

## 5. What Drove the Verdict

`K=40` rows were eligible and `M=40` were measured. `A=35` was Jev's correct count; `B=13` was the baseline's. The 22-row difference is 55 percentage points and exceeds the four-row minimum required by the margin gate. `W=22`, `L=0`; the remaining 18 measured pairs tied. Since the exact sign test uses only discordant pairs, all 22 wins yield `1/2^22 = 2.384e-7` (`cite-drift-scan.mjs:607-630,674-707`; `goal.md:122`).

`TP=26` and `FP=0` give observed precision 1.0. From `A=35`, there are 9 true negatives and 5 false negatives, so the implied recall is `26/31 ≈ 0.84`. These are derived counts from the scorer definitions, not independently re-read row-level data (`cite-drift-scan.mjs:1157-1174`; `goal.md:122`).

`F=3` counts rerun votes that disagree with a row's modal flag. Across 40 rows and three calls per row, the observed dissent rate is 3/120 = 2.5%, below the 10% gate. It does not mean three incorrect labels or three flipped rows (`cite-drift-scan.mjs:82,1009-1014,1157-1164`).

## 6. What the Result Supports

The score supports a strong Jev advantage over identifier overlap on the recorded mixed sample at the recorded source commit and label hash. The recorded run reports 121 calls, all 40 measured, p50/p95 call latency of 326/423 ms, Brier score .1053, Jev CLI 0.6.2, provider `official`, and model `jev-1.13.0` (`goal.md:122`).

The 40 labels include 20 operator-labeled live citations and 20 construction-labeled windows moved 60 lines down their own files (`citation-drift-scan.md:28`). This balanced benchmark does not estimate real-world drift prevalence or establish performance across other claim types, skills, commits, or future model versions. Zero observed false positives on 40 rows is encouraging but imprecise.

## 7. Accuracy Improvements

- Expand and stratify the live sample across skills, citation types, and claim types. Keep live and constructed results separate so the synthetic stress set cannot hide live-set errors (`cite-drift-scan.mjs:371-388,422-479`).
- Blind two human labelers to Jev and baseline outputs, adjudicate disagreements, and preserve a written supports/partial/contradicts rubric. Audit constructed cases: the code labels every moved window contradictory by construction, but an arbitrary destination could still happen to support a claim (`cite-drift-scan.mjs:404-419`; `citation-drift-scan.md:28`).
- Check `claim_sha12` and `window_sha12` against text rebuilt from each row's recorded commit before scoring. The draw records both hashes, while `buildWindows` reconstructs sentence/window text without comparing those hashes (`cite-drift-scan.mjs:404-419,574-585`).
- Reserve a holdout split by commit or skill and report precision, recall, accuracy, paired gain, coverage, and Brier score by live/constructed strata. Add confidence intervals beside the paired p-value; the existing gate and result provide point counts without intervals (`cite-drift-scan.mjs:70-82,674-707,748-767`).
- Inspect row-level false negatives before changing the prompt or threshold. The aggregate score cannot identify whether misses cluster around a claim type, a window boundary, or ambiguous language.

## 8. Measurement Trust

The benchmark has useful provenance anchors: each drawn row includes a commit and hashes of its sentence/window, and the final line includes a labels-file hash plus version/provider/model identity (`cite-drift-scan.mjs:404-419,738-745`; `goal.md:122`). Strengthen this by validating the row hashes, preserving the full labels digest and adjudication record, and reporting exclusions/unmeasured reasons per stratum.

The construction labels are known positives by assumption rather than independent human adjudication. The live half is operator-labeled, with no second-rater step described in the feature contract (`citation-drift-scan.md:28`). A larger blinded live-only holdout is necessary before treating the measured precision/recall or p-value as a deployment guarantee.

The scorer computes Brier score from the returned probabilities and logs call latency, which should remain alongside threshold accuracy (`cite-drift-scan.mjs:748-767,1177-1188`). Report uncertainty and calibration across new held-out data rather than optimizing the prompt against the same 40 labels.

## 9. Cost and Performance

For `K` ready labeled rows, the Jev arm plans one auth test plus three `noul` calls per row: `3K+1` before any one-time retry for exit code 4. At `K=40`, that is 121 planned and recorded calls. Calls are awaited serially, and a per-call timeout is 90 seconds (`cite-drift-scan.mjs:75-76,1008-1036,1047-1071,1081-1105`; `goal.md:122`). No provider price or total billing amount is recorded, so USD cost is UNKNOWN.

A staged one-call-first policy that repeats only near-threshold or unstable rows could reduce calls, but it changes the stability measure. Compare it with three reruns on an independent holdout before adopting it. A content-addressed cache could avoid duplicate calls, keyed by commit, claim/window hashes, prompt, provider, and model; it must define freshness and preserve the meaning of rerun evidence.

The zero-call structural scan has a separate runtime cost: the packet records roughly 171 seconds in an earlier run (`goal.md:90,119`). Committed-file reads spawn `git show`; `buildWindows` caches citing docs but obtains target text through `readWindow` per row (`cite-drift-scan.mjs:314-344,574-585`). Memoizing `(commit,path)` blobs is a plausible optimization; profile first and confirm byte-identical census output.

## 10. Further Uses in `.skilled`

1. **Acceptance-criteria evidence support:** System Spec Kit's `AC_COVERAGE` counts `file:line` evidence for Tested/Partially covered criteria and checks path/line resolution. Its docs state that unresolved citations still count toward coverage (`.skilled/skills/system-spec-kit/references/validation/validation-rules.md:95,101-103`; `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:438-457,567-589`). A narrow semantic advisory could assess whether resolved evidence actually demonstrates the criterion, while leaving deterministic coverage and closure rules intact.
2. **Goal criteria checkability:** `goal-criteria-lint` flags criteria that are not self-contained or require another file to check. Its default lint is lexical and advisory, and it already has 98 labeled rows, Wilson intervals, stale-label reporting, and an opt-in Jev arm (`.skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md:18-32`). Reuse its labeling and uncertainty lessons rather than building a second evaluator for the same judgment.

## 11. Recommendations

1. First, validate row hashes and audit the 20 construction labels; then collect a larger independently labeled live holdout stratified by skill and claim type.
2. Publish live-only and constructed-only metrics with confidence intervals, Brier/calibration, coverage, and paired outcomes. Keep the existing 40-row result as a benchmark result, not a release guarantee.
3. Profile committed-file reads and memoize by `(commit,path)` if the profile confirms repeated process overhead.
4. Test adaptive reruns and caching in a separate benchmark, comparing cost and stability against the three-rerun baseline.
5. Keep semantic results advisory until a representative holdout supports a predeclared threshold and false-alarm policy.
6. If product intent is default-on, amend the current zero-call contract explicitly and design a separate production semantic path with content controls, status reporting, and a bounded budget.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Read `F=3` as three mislabeled rows or three unstable rows | `F` sums dissenting rerun votes from each modal answer | `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1009-1014,1157-1164` | 1 |
| Treat the sign-test p-value as proof of future-document accuracy | It tests paired wins/losses on this fixed 40-row sample; half the rows are constructed | `cite-drift-scan.mjs:674-707`; `citation-drift-scan.md:28` | 1 |
| Replace three reruns with fewer calls without new measurement | Fewer calls can change modal stability and measured coverage | `cite-drift-scan.mjs:1008-1015,1157-1164` | 2 |
| Treat every +60-line constructed window as independently confirmed drift | The label is assigned automatically by construction | `cite-drift-scan.mjs:404-419,466-479` | 2 |
| Treat the benchmark labels as gold labels for every live citation | The benchmark has 20 live rows and 20 synthetic rows, not a production corpus | `citation-drift-scan.md:28`; `goal.md:122` | 3 |
| Enable semantic calls by silently changing the current default | The documented default is zero calls and the model arm is explicitly gated | `goal.md:44`; `citation-drift-scan.md:26,30` | 3 |
| Let semantic flags auto-edit citations or block completion on current evidence | The measured holdout is too small and model flags can be wrong | `goal.md:122`; `citation-drift-scan.md:28` | 3 |

## Divergence Map

- Saturated directions: none recorded.
- Pivots taken: none; the three passes broadened from score interpretation to measurement integrity and then adjacent uses/operation.
- Pivot failures or audited overrides: none.
- Remaining frontier: independent live-only holdout; exact historical artifact/provider retention; measured cost for a production-sized eligible set.

## 12. Open Questions

- What exact content did the historical Phase 047 `calls.jsonl` contain, and what provider/runtime retention applied? The packet says it held doc text, while the inspected caller logger records row and call metadata; the historical artifact and runtime retention terms were not reviewed (`goal.md:122`; `cite-drift-scan.mjs:1059-1071,1127-1139`).
- What live-only holdout performance and approved call budget would justify changing the zero-call default?

## 13. Default-On Requirements

A default-on semantic feature needs all of the following:

- A deliberate amendment to the current zero-call default and an explicit offline/no-model path (`goal.md:44`; `citation-drift-scan.md:26`).
- A production input definition distinct from the gold-labeled scorer; the benchmark's 40 labels are not the set of unknown live citations.
- Approved provider and credential policy, clear notice/consent, tracked-path allowlists, payload minimization/redaction, and data-retention/access rules. Jev receives the citing sentence, target path, and window (`cite-drift-scan.mjs:1025-1032,1081-1087`).
- A bounded per-run call/time budget, global deadline, circuit breaker, and freshness-aware cache. Report the budget and actual calls.
- Machine-visible `completed`, `skipped`, `partial`, and `failed` statuses. A Jev skip can still exit 0 today, so process success must not imply semantic success (`citation-drift-scan.md:30`).
- A human-reviewable advisory result with source window, probability, model/provider identity, and uncertainty. Keep deterministic dead-citation findings separate; do not auto-rewrite or block on the model alone.

## 14. Cost Model and Risks

The benchmark cost model is `3N+1` planned calls for `N` ready labels, plus a retry when Jev exits 4. At `N=40`, the recorded run used 121 calls and reported p50/p95 of 326/423 ms (`cite-drift-scan.mjs:1008-1036,1085-1105`; `goal.md:122`). A prior census counted 208 in-range citations; applying three calls to all 208 would imply 625 calls before retries. This is an unmeasured scale illustration from a different run, not a current estimate (`goal.md:90`). Dollar cost is UNKNOWN without the provider rate card.

Main risks are repository-text transmission, unclear historical artifact retention, latency and spend at larger `N`, skipped runs that look successful, drift between model versions, and false semantic flags. The deterministic scan has its own runtime cost and should be profiled separately.

## 15. Suggested Rollout

1. Reconcile the `calls.jsonl` content/retention statement and approve the data boundary.
2. Validate row hashes, audit constructed labels, and collect a blinded live-only holdout across multiple skills/commits.
3. Pre-register the operating threshold and report confidence intervals, calibration, and skip/partial counts.
4. Trial a budgeted advisory mode on a bounded eligible subset. Compare three-rerun and staged-repeat policies before reducing calls.
5. Change the public default only after product owners accept the zero-call contract change, provider policy, opt-out, output status, and measured operating cost.

## 16. Conclusion

The Jev result is compelling within its benchmark, but it does not yet justify treating semantic citation checks as a production-wide accuracy guarantee. Strengthen the gold set, validate its row identity fields, and run a representative live-only holdout first. If default-on is the intended product direction, design it as a deliberate, bounded, privacy-reviewed advisory path alongside the deterministic zero-call census.

## 17. References

- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:70-85,314-344,371-419,422-479,574-585,607-707,748-767,954-1188,1261-1369`
- `.skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md:18-30`
- `.skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md:18-32`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:95,99-103`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:438-457,567-589`
- `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:44,53-56,90,119,122`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/003-citation-drift-research/research/lineages/luna/iterations/iteration-001.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/003-citation-drift-research/research/lineages/luna/iterations/iteration-002.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/003-citation-drift-research/research/lineages/luna/iterations/iteration-003.md`

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 3
- Questions answered: 5 / 5 core questions
- Remaining follow-up questions: 2
- Last 3 iteration summaries: run 1 — score and sample (1.00); run 2 — accuracy, cost, and trust (0.90); run 3 — adjacent uses and default-on operation (0.85)
- Convergence threshold: 0.05
- Divergence summary: no pivots or saturated directions; remaining frontier is representative holdout and data-retention evidence.
- The max-iterations policy governed the stop; convergence telemetry did not stop the loop early.
