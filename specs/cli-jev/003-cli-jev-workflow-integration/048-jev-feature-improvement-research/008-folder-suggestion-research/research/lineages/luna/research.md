# Jev Spec-Folder Suggestion — Research Synthesis

## 1. Executive Summary

The supplied 40-row evaluation reports a strong Jev result against the top-alternative baseline selected by the scorer: Jev is correct on 39/40 rows (97.5%), the baseline on 30/40 (75%), and the target on 0/40. The 22.5 percentage-point difference and reported p=0.0059 support a keep verdict for this fixture. They do not establish production lift: the comparator is selected on the same labels, fixture-label provenance is not visible, and feature 022 reports only two committed low-match saves without paired final destinations. [specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/spec.md:60,72; .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:579-592,653-690; specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:81-92]

The leading explanation is that Jev sees save-state text and folder descriptions, while its comparator is a lexical folder ranking. This is plausible, not causal evidence. To improve accuracy, first measure whether the right folder is present in the candidate set. To reduce live inference cost, test one confirmed choice on eligible interactive data saves. Before enabling it by default, establish independent save-outcome labels and a held-out evaluation. [score-alignment-suggestion.ts:556-567,830-878,980-989; alignment-validator.ts:412-470,522-537,641-668]

## 2. Scope and Questions

This synthesis addresses the supplied result for the Jev alignment scorer and the feature 022 save-time checks: what explains the result, how accuracy or cost could improve, how to strengthen the measurement, which other .skilled judgments may benefit, and what default-on use would require. It evaluates the evidence and current code paths; it does not claim a new scorer run or a production experiment.

Feature 022 defines low alignment as a warning/listing case, and its notes distinguish the content and folder save paths. Its recorded real-save evidence is too small and incomplete to establish a live outcome rate or paired accuracy. [specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:69-92]

## 3. Evidence and Method

The result counters are treated as the supplied measurement. Code inspection establishes how the scorer chooses its baseline, forms choices, repeats calls, and accepts a keep verdict. Feature 022 and the save-routing implementation establish where a suggestion could affect a save. Statements about causal drivers, future accuracy, and rollout behavior are explicitly inferences or recommendations, not measured results.

The three passes broadened from scorer mechanics and save paths (iteration 1), to label provenance and evaluator cost (iteration 2), to candidate reach, adjacent applications, and rollout controls (iteration 3). Their novelty ratios were 0.82, 0.68, and 0.71; each remained above the configured 0.05 convergence threshold. [iterations/iteration-001.md; iterations/iteration-002.md; iterations/iteration-003.md; deep-research-state.jsonl:1,3-4]

## 4. Reading the Measured Result

For 40 measured rows, A=39 means 97.5% Jev accuracy and B=30 means 75% accuracy for the selected top alternative, a 9-row or 22.5-point difference. The supplied result reports W=10 and L=1 among disagreements, with p=0.0059. The target is right on zero rows, so this is not a comparison against the target. These values align with the scorer’s pairwise counters and keep gates: coverage, minimum margin, one-sided sign test, and flip limit. [specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/spec.md:72; score-alignment-suggestion.ts:618-690]

The scorer selects target or top alternative by accuracy over the effective labels, then compares Jev against that chosen baseline on those same labels. The p-value therefore describes this corpus and selected comparator; it is not an independent estimate of performance on future saves. The result should be described as a fixture-level keep signal, not as proof that the live feature should move folders automatically. [score-alignment-suggestion.ts:562-592,650-690]

## 5. Likely Drivers of the Result

The validator’s deterministic score derives topic and domain signals from the request and folder name, including a fixed infrastructure bonus. Jev receives row state and descriptions for the offered folders, and the evaluator rotates choice order across three passes. That richer semantic context can plausibly resolve intent that folder-name token overlap misses. No ablation isolates state text, descriptions, option order, or model behavior, so the cause of the measured gain remains unproven. [alignment-validator.ts:299-350,412-470; score-alignment-suggestion.ts:830-878,980-989,1011-1019,1081-1139]

The scored populations are also not interchangeable. validateContentAlignment combines conversation topics with observation keywords; validateFolderAlignment uses conversation topics alone. Their candidate generation differs, and the CLI-explicit save path preserves the caller’s folder while the data save path can accept a selected sibling. A corpus that mixes these paths can hide different opportunity and error rates. [alignment-validator.ts:477-491,522-537,601-613,641-684; folder-detector.ts:1032-1049,1148-1168]

## 6. Accuracy Improvements

**Measure candidate recall first.** Jev may choose only the target, listed alternatives, or none-of-these. The content path retains at most three numbered, non-archive folders scoring above the target; the folder path offers at most three ranked numbered siblings when the top one beats the current score. If the actual destination is absent, chooser quality cannot recover it. Record whether the independently labeled destination appears in the offered set before reporting conditional chooser accuracy. [score-alignment-suggestion.ts:556-567; alignment-validator.ts:522-537,641-668]

Then improve retrieval within an explicit scope: include suitable parent/child or cross-track candidates where packet structure permits, use stable folder descriptions and metadata, and preserve none-of-these as an abstention. Evaluate each candidate-generation change against candidate recall, distractor rate, and downstream choice accuracy. Larger candidate sets may improve recall while increasing prompt size and choice difficulty, so measure both.

Keep content-save and folder-save evaluation strata separate. Their inputs and candidate rules differ; a single aggregate score can mask a path that has poor recall or should not switch destinations. [alignment-validator.ts:477-491,522-537,601-613,641-684; folder-detector.ts:1032-1049,1148-1168]

## 7. Cost and Latency Reduction

For 40 callable evaluation rows, the scorer plans 3 × 40 + 1 = 121 calls: 120 sequential choice calls plus one authentication check. Each choice has a 90-second timeout; exit code 4 receives a two-second retry. The evaluator records backend and wall-time information, but the supplied result includes no actual per-call token totals, elapsed-time summary, or provider price, so no dollar cost is established. [score-alignment-suggestion.ts:28-67,1011-1057,1066-1140]

For a live feature, test one model choice per eligible interactive data save, with a short reason and an explicit operator confirmation. On a 40-row equivalent, one pass would use 40 choice calls instead of 120, a 67% reduction in choice calls before retries; this is a call-count projection, not a measured cost or quality result. Keep the three-pass protocol for offline evaluation and measure live p50/p95 latency, input/output tokens, retries, and actual provider charges. Reuse trusted folder metadata where possible, while measuring any added prompt size from broader candidate retrieval.

## 8. Making the Measurement Trustworthy

The row shape includes target, alternatives, state, gold, and label, but has no fields for label source, adjudicator, decision time, rationale, or final saved folder. The transcript exporter derives gold from event.pick and leaves label blank. Those mechanics do not prove how this fixture was labeled; they mean the reported counts alone cannot establish independent adjudication against final save outcomes. [score-alignment-suggestion.ts:508-567,1354-1375]

Build a new corpus from actual low-match saves and retain the final destination, save path, score band, candidate set, label author/source, timestamp, rationale, and disagreement/adjudication history. Predeclare the baseline or choose it on development rows and evaluate on held-out rows grouped by project, folder family, or time. Report candidate recall separately from conditional choice accuracy; stratify content and folder save paths; preserve raw prompts, option order, model/provider/version, calls, token use, latency, timeout, abstention, and operator correction. Use an analysis that accounts for repeated or clustered folders before making generalization claims. [score-alignment-suggestion.ts:579-592,650-690,1066-1140; 022-alignment-folder-suggestion/spec.md:79-92]

## 9. Other .skilled Judgments Worth Measuring

The closest reuse target is system-skill-advisor’s prompt-to-skill ranking. It already has a live semantic-shadow lane with default weight 0.05, a semantic rerank for close RRF scores, and confidence/uncertainty filtering. The Jev evaluation approach could test whether semantic evidence improves ambiguous prompt-to-skill choices over lexical/explicit signals and whether abstention is calibrated; it should evaluate the existing ranking pipeline rather than add an unmeasured parallel chooser. [system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8-18; system-skill-advisor/runtime/lib/scorer/fusion.ts:488-499,766-795,890-914; system-skill-advisor/runtime/handlers/advisor-recommend.ts:549-563]

A second candidate is system-spec-kit’s trigger-index retrieval: query phrases are matched and ranked per document, so a measured semantic candidate-discovery lane may help with paraphrased triggers. Measure recall and ranking against curated trigger-to-context judgments. Keep Gate 3’s write/resume classification deterministic: semantic matching may surface context, but should not silently grant or suppress a mandatory gate. [system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:155-211; system-spec-kit/shared/gate-3-classifier.ts:782-859]

## 10. Default-On Integration Design

Start with low-match, interactive data saves that have a valid candidate set. Present one suggested folder and a concise reason; let the existing explicit selection step authorize any switch. Preserve the destination for CLI-explicit saves and noninteractive runs. The current CLI path logs ALIGNMENT_BYPASSED and respects the explicit argument, while the data path can return a chosen sibling. The feature notes likewise say only the data path can switch. [folder-detector.ts:1032-1049,1148-1168; 022-alignment-folder-suggestion/spec.md:86-89]

Pass only bounded, relevant, redacted context and application-controlled folder descriptions. Treat request text and observations as untrusted data, constrain the model to offered option IDs or abstention, and revalidate any selected path against approved spec roots. On timeout, provider error, or abstention, fall back to deterministic behavior without blocking a save. Log eligibility, option set, suggestion, acceptance/correction, abstention, fallback, model/provider, tokens, retries, and latency. Define a latency budget, kill switch, and rollback trigger before enabling the feature by default. The scorer currently passes row state to the choice process and includes descriptions in options, so context minimization and path validation are concrete integration requirements. [score-alignment-suggestion.ts:830-878,980-989,1097-1107; folder-detector.ts:1151-1155]

## 11. Recommendations

1. **Before a quality claim:** establish independent final-destination labels and document their provenance; treat the existing keep result as fixture evidence only.
2. **Before tuning Jev:** measure candidate recall and break results down by content versus folder save path; expand candidates only where recall data shows a miss.
3. **Before default-on:** run a held-out evaluation with a predeclared comparator and a one-call live-shaped policy, including latency, token, cost, abstention, acceptance, and correction measurements.
4. **For a first rollout:** offer a confirmed suggestion on eligible interactive data saves; preserve explicit CLI and noninteractive behavior, validate approved roots, and keep deterministic fallback and a kill switch.
5. **For reuse:** evaluate system-skill-advisor and trigger retrieval as separate ranking experiments; retain Gate 3 as deterministic policy.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat the target as the comparator for the supplied result | The result explicitly says baseline=top and target right 0/40; this would misstate what the scorer compared. | 008-folder-suggestion-research/spec.md:72; deltas/iter-001.jsonl:6 | 1 |
| Treat p=0.0059 as proof of production superiority | The comparator is selected on the same effective labels, and the available feature record does not pair its observed low-match saves with final destinations. | score-alignment-suggestion.ts:579-592,653-690; 022-alignment-folder-suggestion/spec.md:79-92; deltas/iter-002.jsonl:6 | 2 |
| Automatically route every alignment warning to the model-selected folder | The CLI-explicit path preserves the requested destination, and the current fixture does not establish default-on safety or production quality. | folder-detector.ts:1032-1049,1148-1168; deltas/iter-003.jsonl:7 | 3 |

## Divergence Map

The investigation widened in sequence: scorer and validator mechanics; label provenance, population, and evaluator cost; then candidate recall, adjacent ranking tasks, and rollout controls. These are complementary angles, not evidence that the topic converged. The remaining frontier is an independently labeled live-save corpus, candidate-recall measurement, a held-out comparison, and a live-shaped latency/cost trial.

The reducer-owned registry currently reports zero completed iterations and no registered findings or ruled-out directions, while the lineage state and delta files contain three iteration records and the three ruled-out conclusions above. Both reducer-owned artifacts were left untouched to preserve reducer ownership and the one-lineage write boundary. The strategy still carries its pre-iteration-3 Next Focus, so this map is grounded in iteration files and deltas and does not imply that reducer artifacts were refreshed. No Council artifact or audited override is recorded in the Luna lineage. [findings-registry.json:1; deep-research-strategy.md:41-43; deep-research-state.jsonl:1-4; deltas/iter-001.jsonl:1-6; deltas/iter-002.jsonl:1-6; deltas/iter-003.jsonl:1-7]

## 12. Open Questions

- Are the 40 fixture labels independently adjudicated final destinations, and what source events produced them?
- What fraction of real low-match saves contain the correct final folder in the target-plus-alternatives set?
- Does one call preserve useful agreement and abstention quality on held-out rows from both save paths?
- What are actual per-save token use, provider charge, p50/p95 latency, acceptance rate, and correction rate?
- Do parent/child or cross-track candidates improve recall without creating enough distractors to lower choice quality?

## 13. Confidence and Evidence Gaps

**High confidence:** the reported arithmetic, same-sample baseline rule, three-call evaluation plan, candidate caps, differing save-path mechanics, and current adjacent ranking code are directly supported by the cited packet and source lines.

**Medium confidence:** richer state and folder descriptions are a plausible explanation for Jev’s result. The sources show the input difference but no ablation.

**Unknown:** independent label provenance, generalization to real saves, live one-call quality, actual provider price, latency distribution, and operator acceptance/correction behavior. The available evidence would change materially if the raw fixture, adjudication records, held-out outcomes, or live call logs were available.

## 14. Proposed Evaluation Protocol

1. Build a prospective sample of eligible low-match saves. Store the path type, target, alternatives, exact final destination, score/band, and privacy-reviewed state snapshot.
2. Have reviewers label final destinations independently; retain source, adjudicator, timestamp, rationale, and disagreements. Freeze a development/held-out split by project or folder family.
3. Report candidate recall first. On rows with the answer offered, compare Jev against a baseline declared before the held-out run; also report target and top alternative separately.
4. Evaluate one-call and three-pass policies with fixed model/provider versions and randomized option order. Track coverage, accuracy, abstention, paired wins/losses, confidence intervals, latency, tokens, retries, and actual charges.
5. Stratify by save path and score band. Include operator acceptance and correction in a shadow or confirmed-suggestion pilot; do not infer production value from offline choice accuracy alone.

## 15. Rollout and Risk Controls

A wrong folder can misfile work or break packet continuity; the model should select only an application-provided option, and the application should revalidate the destination under approved spec roots. Save context and descriptions can contain sensitive or instruction-like text; minimize and redact fields, delimit them as data, and avoid passing unnecessary conversation history. A slow or unavailable provider can disrupt saves; impose a short latency budget, deterministic fallback, and noninteractive bypass. Measure wrong-choice corrections and timeout rates, and disable the feature through a rollback switch if the predeclared limits are exceeded. These controls address observed state/description inputs and current root validation; the thresholds themselves require product-specific measurement. [score-alignment-suggestion.ts:830-878,980-989,1097-1107; folder-detector.ts:1151-1155]

## 16. Convergence Report

- **Stop reason:** maxIterationsReached.
- **Total iterations:** 3.
- **Questions answered:** 5 / 5 at the directional research level; the unknowns above remain open.
- **Last three iteration summaries:** iteration 1 mapped the result and causal hypotheses (newInfoRatio 0.82); iteration 2 established baseline/label caveats and planned evaluation cost (0.68); iteration 3 established the candidate-recall ceiling, reuse targets, and rollout boundaries (0.71).
- **Convergence threshold:** 0.05; none of the three ratios reached it. The max-iterations cap, not convergence, ended the loop.
- **Divergence summary:** the review broadened across measurement, candidate generation, reuse, and rollout; no production outcome was measured.
- **Terminal record:** the Luna state log records the synthesis completion with stopReason maxIterationsReached. [deep-research-config.json; deep-research-state.jsonl:1-5; prompts/synthesis-event.json:1]

## 17. References

- specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/008-folder-suggestion-research/spec.md:60,72 — fixture scope and supplied scorer result.
- specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:69-92,184-208 — feature thresholds, observed saves, save-path boundary, and serving/keep contract.
- .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:28-67,508-592,618-690,830-878,980-989,1011-1140,1241-1267,1354-1375 — row labels, comparator, verdict, model inputs, calls, retries, and export.
- .skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:299-350,412-491,522-537,601-684 — context extraction, folder scoring, validator inputs, and candidates.
- .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:1032-1049,1148-1168 — explicit CLI and data save paths.
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8-18; .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:488-499,766-795,890-914; .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:549-563 — existing semantic and confidence-gated skill ranking.
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:155-211; .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:782-859 — trigger retrieval and deterministic gate classification.
- iterations/iteration-001.md, iterations/iteration-002.md, iterations/iteration-003.md; deltas/iter-001.jsonl, deltas/iter-002.jsonl, deltas/iter-003.jsonl — lineage findings and eliminated directions. deep-research-state.jsonl:1-5, deep-research-strategy.md:41-43, findings-registry.json:1 — lineage completion and reducer-owned state.
