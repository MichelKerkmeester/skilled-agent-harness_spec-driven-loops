---
title: "Deep Research: Improving Jev Reviewer Verdict Fallback [lineage: luna]"
description: "Three inline research passes on the Jev reviewer verdict fallback result, measurement quality, adjacent bounded judgments, and default-on requirements."
trigger_phrases:
  - "Jev reviewer verdict fallback"
  - "reviewer verdict regex miss"
  - "default-on Jev reviewer classification"
importance_tier: "important"
contextType: "research"
---

# Deep Research: Improving Jev Reviewer Verdict Fallback

This three-iteration research pass answers the five requested questions. It distinguishes reported results from arithmetic inferences and rollout proposals. The 24-row set is a selected regex-miss stress corpus; it does not estimate ordinary reviewer traffic.

## Table of Contents

1. Research Metadata
2. Request Summary
3. What Drove the Result
4. Raising Accuracy and Lowering Cost
5. Making the Measurement More Trustworthy
6. Other .skilled Judgment Opportunities
7. Default-On Integration: Requirements, Cost, and Risk
8. Confirmed, Inferred, and Unknown
9. Scope and Non-Goals
10. Recommendation
11. Eliminated Alternatives
11a. Divergence Map
12. Open Questions
13. Staged Evaluation Plan
14. Evidence Ledger
15. Method and Evidence Limits
16. References
17. Convergence Report

---

## 1. Research Metadata

- **Research ID**: cli-jev/048/006, detached lineage luna
- **Feature**: cli-jev/025 reviewer verdict fallback
- **Status**: Complete for this three-iteration research pass; no production behavior or promotion decision was changed
- **Date**: 2026-10-03
- **Executor**: inline cli-codex, model gpt-6-luna
- **Iterations**: 3 of 3; new-information ratios 0.64, 0.58, 0.62
- **Stop policy**: max-iterations

## 2. Request Summary

Explain what drove Jev's measured keep; identify accuracy and cost improvements; make the measurement more trustworthy; locate other .skilled judgments with a similar payoff; and specify what default-on integration would require, cost, and risk.

The reported row is verdict jev: keep K=24 M=24 A=24 B=8 W=16 L=0 F=0 p_win=0.00001526, with majority baseline 8/24 and loose baseline 0/24. Its 24 reviewer reports were all selected because the verdict regex missed them. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

## 3. What Drove the Result

**Answer.** The test asked Jev to interpret exactly the subset where the deterministic parser had no answer. The regex accepts a standalone PASS, FAIL, or BLOCK line, optionally preceded by verdict, result, or status, and the last matching line wins. The benchmark retains only reports for which that parser returns null. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:212-219]

On those selected rows, the Jev arm matched all 24 supplied labels, compared with 8 correct for the majority rule and 0 for the loose keyword rule. The results table says the blind arbiter matched the report authors' intended verdict on all 24. The feature contract defines the target as the verdict the reviewer expressed and explicitly warns that the reviewer may itself be wrong; this is not a review-quality score. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:71,96-97]

The majority baseline is weak for this selected set. **Derived:** because the label gate requires each of three classes and the largest class is 8 in 24 rows, the label counts are 8/8/8. The measured Jev arm had 16 paired wins and no losses. Its p_win of 0.00001526 is the exact one-sided sign-test tail for 16 wins out of 16 discordant rows (1/65,536); it describes paired improvement over the chosen baseline on these labeled misses, not population-wide accuracy or fallback value. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:317-356,405-431] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

The source report bodies and row-level call records are outside the checked-in result, so the exact reasons the loose rule scored zero cannot be confirmed here. All three option orders agreed in this run (F=0), which is evidence of order stability on these rows only. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:775-815]

The corpus does not measure how often real reports miss the regex. The four-fixture reviewer profile contains eight cases and the feature spec says all eight had regex-readable verdicts; it also says no recorded live reviewer report was available and the scorer stores a truncated output hash rather than its text. The premise that ordinary reviewers rarely miss the regex therefore makes low production volume plausible, but the benchmark does not quantify that premise. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json:7-13] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:71]

## 4. Raising Accuracy and Lowering Cost

**Answer.** First make the producer's output easier to parse. The reviewer schema already asks for a single parseable line such as VERDICT: FAIL, which the current regex accepts. A typed verdict field or enforced output schema would prevent avoidable misses before spending a model call. Broaden the regex only in response to observed natural misses; matching every occurrence of pass, fail, or block could read an example or negated statement as the actual decision. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:80-88] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123]

Keep the semantic question narrow: read the reviewer's stated decision, not whether the code change deserves that decision. Distinguish an explicit BLOCK meaning the reviewer cannot decide from prose with no explicit verdict. For the latter, use unknown or abstain; do not force a category. The current three options are approval, rejection, and reviewer inability to decide. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:34-50] [SOURCE: .skilled/skills/cli-classifier/cli-jev/references/integration-patterns.md:61-72] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:96-97]

The offline benchmark uses three rotated option orders per miss to measure option-position sensitivity. A one-choice-per-miss serving policy would plan 24 judgments plus one auth check, or 25 calls for K=24, instead of 73; that is 48 fewer calls, about 66%. Keep rotations for offline testing or a small, predeclared audit sample until one-call behavior passes a separate holdout. The Jev probability is recorded but not calibrated, so it should not yet control a confidence threshold or retry policy. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:700-708,775-815,809-815,1071-1077]

A cache is only justified if duplicate misses occur often enough to measure. The current reviewer report stores a 16-hex output hash, which is not a full-content cache key; a safe cache would need an exact content digest plus prompt/options and provider/model version. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:190-204] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:845-849]

The table reports p50 334 ms and p95 377 ms per measured Jev call. Those are measured latencies, not a dollar estimate. Actual serving cost depends on natural miss rate, input/output tokens, retries, billing, and call policy, none of which is fully established by this result. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

## 5. Making the Measurement More Trustworthy

**Answer.** Measure two quantities separately: the fraction of ordinary reports the regex misses, and Jev's conditional performance on a representative sample of those natural misses. Run a zero-call census over consecutive or randomly sampled reports across reviewer versions and repositories. Keep the deliberately constructed 24-row set as a stress suite, not as the prevalence sample. The scorer already supports counting hits, misses, and per-test verdict methods from named outputs and reports. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md:28-34] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:83-88]

Label the intended target precisely: what verdict the reviewer explicitly expressed, plus an independent no-decision/ambiguous class. Use two human readers blinded to Jev's choice and adjudicate disagreements. Do not label with expectedVerdict or whether the reviewer was substantively correct; feature 025 states the fallback reads the reviewer's decision and that a reviewer can decide wrongly. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:95-97]

Treat each report as the statistical unit. The scorer asks each report in three option orders, so those calls assess within-report stability rather than supplying 72 independent samples. Hold out complete reports or lineages, and stratify accuracy and abstention by reviewer/model version and verdict class. Report a confusion table, explicit coverage, false PASS/FAIL/BLOCK counts, option-order flips, paired comparison against the current fallback behavior, and uncertainty by report or lineage. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:317-356,775-815] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

Whole-run value depends on both natural miss prevalence and conditional improvement on misses. A useful estimate is miss prevalence multiplied by the paired accuracy gain on natural misses, with error impact and cost reported separately. Neither prevalence nor this product can be inferred from a dataset selected entirely for regex misses. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:212-219] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

## 6. Other .skilled Judgment Opportunities

**Answer.** Reuse this evaluation pattern for other narrow classification gaps, but let each task earn its own labels and promotion decision.

- **Hallucination grading:** the D4 scorer asks whether an answer names a command-line flag, file, or function not provided by the task. Its measured 56-row Jev result kept at 55 correct against a 47-row majority baseline, with one flip. This is a concrete, already measured bounded judgment. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md:18-40] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:13]

- **Fan-out merge shadow:** the scorer compares same/different decisions for candidate finding pairs, and its 60 real-pair run kept against dedup-off with 53 versus 12 correct, 44 wins, and 3 losses. It is a promising semantic merge judgment with a distinct false-merge risk and its own runtime boundary. [SOURCE: .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:812-815] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:18]

- **Completion claims, stop rating, and debug next-check:** these show why the same judgment should not be turned on everywhere. Completion-claim audit stopped on margin at 102 versus 93 correct; stop second-rater was killed at 11 versus 17 on 25 real lineages; debug next-check stopped on margin at 27 versus 29. They merit task-specific follow-up only if a new representative sample or changed design addresses the measured limitation. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:15-19]

## 7. Default-On Integration: Requirements, Cost, and Risk

**Answer.** A default-on Jev path needs a later, explicitly approved integration phase. Today the reviewer scorer tries the deterministic parser first and has only a separately selected llm grader path; feature 025 explicitly excludes a Jev grader option, classifier output in the reviewer report, a global switch, a shared client, and a dollar estimate. It says wiring requires a later phase, a keep result, and an operator decision. The benchmark keep alone does not supply that decision. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:155-187] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:91-97]

Before enabling it by default, require:

1. A natural-use census and held-out labeled misses across reviewer versions, including explicit no-decision rows.
2. A typed producer verdict where possible, with deterministic parsing still first and Jev called only for unresolved outputs.
3. One production judgment per miss, with repeated option orders retained for offline audits until one-call quality is measured.
4. A written data-egress and retention policy. The Jev benchmark sends reviewer text off-machine; the current arm requires explicit payload acceptance for an untracked output file. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md:38-40]
5. A pinned Jev version/provider, credential check, bounded timeout/retry, and requalification when provider or model changes. The benchmark checks version, credentials, and payload acceptance; its report calls out model changes for requalification. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:505-547,845-849]
6. Fail-closed semantics: invalid choice, timeout, unavailable credentials, or no explicit reviewer decision must remain unknown/abstain and be visible to the caller. Never convert backend failure into BLOCK or silently switch graders.
7. A bounded call budget, latency target, privacy owner, monitoring and rollback/disable path, with a shadow or staged rollout before default-on use.

**Cost.** For N reports with observed regex-miss rate r, a one-call policy plans about N*r judgments, plus process-level authentication/health overhead and bounded retries. The selected K=24 benchmark plans 73 calls with three orders and 25 with one order including auth. The result reports per-call p50/p95 but no billing or production miss rate, so actual dollars and normal traffic volume remain UNKNOWN. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:700-708,775-794,1071-1077] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]

**Risk.** A semantic classifier can read an ambiguous report as a verdict, and any reviewer text sent to a remote provider creates a data-egress decision. Backend latency or failure can leave verdicts unknown. Provider/model drift can invalidate the benchmark result; changing provider or model already causes a requalification signal in the scorer. Default-on deployment should not begin until these risks have explicit owners and measurable gates. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:809-815,845-849] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md:38-40]

## 8. Confirmed, Inferred, and Unknown

### Confirmed

- The scorer retains labeled rows where extractVerdict returns null for the Jev fallback evaluation. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:212-219]
- The supplied 24 reports all missed the regex, and the blind arbiter matched author intent on 24/24; the reported result and latencies are in the result table. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14]
- The current regex reads a standalone verdict line and the production reviewer scorer calls its existing model grader only when explicitly selected as llm. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123,155-171]
- The reviewer schema already requests a parseable verdict line. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:80-88]

### Inferred

- The reported three-class majority of 8/24 implies an 8/8/8 class split because all three classes pass the label gate. This is derived from the result and gate, not separately printed as a class table. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:405-431]
- The exact p_win equals 1/65,536 from 16 wins and zero losses under the paired sign test. It is not a population confidence bound. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:317-356,405-431]
- One call per miss would reduce the selected 24-row plan by 48 requests, about 66%, including the same single authentication check. Its quality at one call per row remains to be measured. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:700-708,775-794,1071-1077]

### Unknown

- Natural regex-miss prevalence across ordinary reviewer outputs and how it varies by reviewer or model version.
- Why the loose baseline scored zero on the 24 rows; row-level output text was not available here.
- Accuracy on a representative natural-miss holdout, especially for no-decision and ambiguous cases.
- Provider billing, output-token volume, retries, actual production latency, retention policy, and reviewer-text egress approval.
- The acceptable error trade-off and promotion threshold for a default-on integration.

## 9. Scope and Non-Goals

This is source and artifact research for the detached luna lineage. It did not change reviewer scoring code, call Jev, save reviewer text, or wire a live fallback. The 24-row keep is conditional evidence on its labeled miss sample, not authorization to promote a production default. No resource-map was present at initialization, so this report does not cite a placeholder map.

## 10. Recommendation

First improve the producer contract with a typed verdict field while keeping the narrow deterministic parser. Next run a zero-call census on ordinary reports, then compare one Jev choice per natural miss against a blind, held-out human label set with no-decision kept distinct from BLOCK. Retain three-order calls only for benchmark audits. Consider a later shadow rollout only after quality, data-egress, versioning, failure, latency, and budget gates are approved. Do not enable the fallback by default from the current constructed-miss result alone.

## 11. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Broaden the regex to any occurrence of PASS, FAIL, or BLOCK in prose | It could mistake a mention, example, or negation for the reviewer's actual verdict. Prefer structured producer output and evidence-driven parser variants. | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:80-88] | 2 |
| Treat no explicit decision as BLOCK | BLOCK means the reviewer cannot give a verdict; absent or ambiguous language should remain unknown/abstain. | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:34-42] [SOURCE: .skilled/skills/cli-classifier/cli-jev/references/integration-patterns.md:61-72] | 2-3 |
| Treat 24/24 as production-wide accuracy or proof reviewers were correct | Every row was selected as a regex miss, labels target author intent, and prevalence is not measured. | [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:71,96-97] | 1, 3 |
| Use three Jev calls on every production miss | Rotations test position stability; one call per miss cuts the selected call plan by about 66%, pending its own holdout. | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:700-708,775-794,1071-1077] | 2-3 |
| Enable a universal default-on Jev fallback from this benchmark | The source feature excludes live Jev wiring; natural prevalence, data policy, and billing remain unknown, and adjacent judgments have mixed outcomes. | [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:91-97] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:13-19] | 1-3 |

## Divergence Map

No branch pivot or saturated direction was recorded in the Luna strategy for this three-pass sequence. The focus broadened from reconstructing the result, to accuracy and cost, to sample validity and integration. The lineage's initial findings registry contained no pivot history; no cross-lineage merge evidence is included in this report. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/006-verdict-fallback-research/research/lineages/luna/deep-research-strategy.md:1-50] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/006-verdict-fallback-research/research/lineages/luna/findings-registry.json]

## 12. Open Questions

1. What is the regex-miss rate across a privacy-approved sample of ordinary reviewer reports, by reviewer and model version?
2. Can two blinded human readers reliably distinguish explicit PASS/FAIL/BLOCK from no-decision or ambiguous text on natural misses?
3. Does one Jev call per natural miss preserve enough accuracy and abstention quality on a locked holdout?
4. What are the actual provider billing, output tokens, retry frequency, end-to-end latency, and text-retention terms?
5. Which owner sets the acceptable false verdict, unknown, and egress thresholds for default-on use?

## 13. Staged Evaluation Plan

1. **Improve deterministic inputs:** update the reviewer producer to emit a typed verdict and keep the parser strict; build examples from observed miss patterns.
2. **Measure prevalence without model calls:** census ordinary reports and reviewer-report method counts, recording aggregate hit/miss counts by version while keeping report text protected.
3. **Build natural-miss labels:** sample misses from that census, double-label the stated verdict and no-decision class blind to Jev, and adjudicate disagreements.
4. **Run a locked comparison:** compare the existing baseline, one-choice-per-miss Jev policy, and three-order audit policy; publish per-class errors, abstention, flips, paired wins/losses, uncertainty, calls, and latency by reviewer/model version.
5. **Review integration gates:** obtain data-owner approval, set a call/latency budget and error threshold, pin provider/model/client versions, and define visible unknown-on-failure behavior.
6. **Stage rollout:** use a shadow or explicitly gated trial first; enable a default only after a named operator accepts the held-out evidence and a disable path is ready.

## 14. Evidence Ledger

| Claim area | Primary evidence |
|---|---|
| Regex behavior and miss selection | .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:117-123; .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:212-219 |
| Result, baseline, label provenance, and latency | specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:14 |
| Keep arithmetic and gates | .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:317-356,405-431 |
| Producer contract and existing scorer behavior | .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:80-88; .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:155-204 |
| Cost and Jev request path | .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:700-708,775-815,1071-1077 |
| Privacy and feature scope | .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md:28-40; specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md:91-97 |
| Adjacent judgment outcomes | specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:13,15-19; .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:812-815 |

## 15. Method and Evidence Limits

Three inline iterations read the scorer, result row, reviewer contract, Jev integration guidance, and comparable .skilled measurement surfaces. Source behavior and reported benchmark values are confirmed from code and the checked-in result summary. The 8/8/8 class split, exact sign-tail derivation, one-call request reduction, and prevalence-times-lift relation are arithmetic or analytical inferences and are labeled as such. Raw reviewer texts, row-level labels, call logs, billing, and natural traffic counts were unavailable, so no independent row audit, prevalence estimate, probability calibration, or dollar estimate was made. The resource-map flag was false at init.

## 16. References

- .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md
- .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs
- .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md
- .skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md
- .skilled/skills/cli-classifier/cli-jev/references/integration-patterns.md
- .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/system-deep-loop/runtime/README.md
- .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md
- .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md
- specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/spec.md
- specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md

## 17. Convergence Report

Three iterations completed at the configured maximum of three. The convergence threshold 0.05 was telemetry only; the run continued through all three angles and then synthesized. The five requested research questions are answered; the open items above are empirical deployment questions. The terminal stop reason is maxIterationsReached. This synthesis is stored in the detached Luna lineage.
