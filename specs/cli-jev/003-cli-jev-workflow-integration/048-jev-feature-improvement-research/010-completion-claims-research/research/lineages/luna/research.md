# Completion-Claim Audit Research Synthesis

## 1. Executive Summary

The reported Jev comparison is statistically favorable but does not clear the scorer's minimum practical-margin gate. The control and candidate each received 110 measured rows (K=M=110); candidate accuracy is 102/110 (92.73%) versus 93/110 (84.55%), an observed gain of 9/110, or 8.18 percentage points. The scorer requires at least an 11-row difference at this sample size, so the 9-row gain stops on margin even though the reported one-sided sign-test probability is 0.02452. All 10 labeled completion claims were missed by the current detector, so the result does not support enabling this regex as the sole gate for finding completion claims.

The main improvement path is a better labeled corpus and a carefully evaluated detector/model arm, with duplicate-ID rejection, independent annotation, an untouched holdout, and transparent runtime-stratified results. Cost can be reduced by protocol changes such as one judgment per row with targeted repeats, but those would define a new measurement and cannot be retroactively applied to this score. Existing shared completion evidence is already enabled by default as advisory guidance; a default-on model judge is a distinct future integration requiring consent, redaction, bounded nonblocking execution, an operational kill switch, telemetry, and an explicitly named reader. One Pi adapter/documentation discrepancy leaves model visibility uncertain and must be resolved before making global privacy claims.

## 2. Research Objective

Answer five questions about improving the Jev feature 026 completion-claim audit: (1) what drove the measured result, (2) how to improve accuracy or reduce cost, (3) how to make measurement more trustworthy, (4) where similar judgment is valuable elsewhere in .skilled, and (5) what a default-on integration would require, cost, and risk. The measured result and sample counts are the values supplied by the research brief and recorded in the packet; the scorer source provides the decision mechanics. The original row-level corpus, execution report, and model calls were not available in this lineage, which limits causal claims about individual misses.

## 3. Scope

This research covers feature 026's scorer and detector, its test fixtures and corpus conventions, the shared completion-evidence hook, nearby completion/validation workflows, and a prospective default-on integration. It does not propose a code patch or claim a new live evaluation. The feature's own spec keeps live model judgment out of scope pending later work and a named reader (feature 026 spec, lines 91–96 and 157–161).

## 4. Method and Evidence

Three inline research iterations examined scorer arithmetic and detector behavior, corpus/annotation quality and cost, then reuse and integration requirements. Each iteration produced a structured file and delta; iteration validators returned OK for iterations 1, 2, and 3. Each iteration's new-information ratio was 0.8, above the configured 0.05 convergence threshold; the requested three-iteration cap therefore governed completion. The exact iteration validations and the source lists are recorded in the lineage event/state records and iteration files.

Sources were inspected in the feature packet, scorer implementation, test fixtures, shared hook documentation and adapters, system-spec-kit workflows and validator configuration. This report distinguishes directly reported facts, arithmetic derived from those facts, and hypotheses that require the unavailable row-level data. No repository test suite was run because this was a research-only task. To honor the requested lineage-only write boundary, packet spec writeback was deferred and the workflow post-write strict validate.sh step was not run, as explicitly prohibited by the user.

## 5. Reported Result

The supplied run reports jev: stop (margin), K=110, M=110, A=102, B=93, W=13, L=4, F=0, and p_win=0.02452, based on 50 Pi turns and 60 Claude turns. The feature packet records the same score, sample composition, and ten missed labeled claims (completion-claim-research spec, lines 60–68). The scorer gates on the minimum margin before using the sign-test result; its required margin is 10 times the number of measured rows (score-completion-claims.mjs, lines 972–986).

Arithmetic from the report: 102/110 = 92.73%, 93/110 = 84.55%, and (102−93)/110 = 8.18 percentage points. Since 10 × (102−93) = 90, which is less than M=110, the margin condition fails. At M=110 the condition requires an 11-row difference. W−L=9 and W+L=17; the exact one-sided sign-test tail is 3214/131072 ≈ 0.0245209, consistent with the displayed p-value. Thus statistical evidence against a zero directional effect does not satisfy this scorer's predeclared practical-margin threshold. F=0 means no disagreement among the three repeated Jev outputs under the scorer's repeat rule; it does not establish that the reference labels are valid.

## 6. What Drove the Result

The directly demonstrated driver of the stop (margin) verdict is that the observed nine-row advantage is below the eleven-row margin requirement, despite a sign-test probability below 0.05 (score-completion-claims.mjs, lines 972–986). K=M indicates all rows in the supplied labeled set were measured. The reported 13 wins and four losses produce a 9-row net directional difference; the remaining rows do not contribute to the sign test. Three-run unanimity (F=0) describes repeat consistency, not semantic correctness or dataset representativeness.

The reported ten missed positive claims likely account for a material part of the detector's recall limitation, but their precise wording and distribution cannot be independently inspected here because the row-level data, final report, and captured calls were not present in the packet. The detector applies a case-insensitive list of ten whole-word completion phrases to only the final 400 characters (completion-evidence-sentinel.cjs, lines 16–29). It has no contextual understanding. Unlisted wording and claims outside the tail are plausible miss mechanisms, not confirmed explanations for those ten rows. The corpus also mixes 50 Pi and 60 Claude turns; because per-runtime outcomes were not supplied, runtime mix is a possible confound, not a demonstrated cause.

## 7. Accuracy Improvements

First, evaluate a richer detector against a clean, independently reviewed corpus. Include natural completion formulations, negated or conditional statements, quoted text, partial progress, and claims near or beyond the 400-character boundary. Measure precision, recall, and false-positive cost overall and separately by runtime. Preserve a holdout not used to tune phrases or thresholds. Because all ten labeled positive claims were reportedly missed, the current regex should not be a required positive gate for recovering those claims.

Second, consider a staged detector: a cheap lexical signal can select likely candidates, while a context-aware model or human adjudicator reviews ambiguous cases. Compare that design with a context-aware pass over every eligible turn; do not assume the cascade is more accurate without measuring false negatives at its first stage. The feature spec requires a later phase and a named reader for live judgment, so these are research options rather than authorization to integrate them now (feature 026 spec, lines 91–96 and 157–161).

A diagnostic implementation issue affects per-phrase attribution: the firstClaimWord helper uses substring indexOf while the primary detector uses whole-word matching (score-completion-claims.mjs, lines 223–235, compared with lines 16–29). A word such as “unfixed” may therefore be attributed to “fixed” in breakdown diagnostics. Fixing or explicitly labeling that diagnostic would improve analysis; it does not alter the main accuracy score.

## 8. Cost and Efficiency

The observed Jev protocol makes one authorization check and three uncached judgments per row. For 110 rows, that is 331 subprocess calls total: one authorization check plus 330 judgments, with the full final-tail input repeated for each judgment (score-completion-claims.mjs, lines 736–807 and 842–900). The scorer estimates token usage but the supplied result includes no actual token or dollar totals, so a monetary estimate is unknown.

A future protocol could use one judgment per row, then repeat only disagreements, low-confidence items, or a preregistered sample. That may reduce calls, but it changes the measurement protocol and its uncertainty; report it as a new arm and compare it against the three-run baseline rather than rewriting this result. Other savings include caching deterministic preprocessing, recording actual prompt/response token counts, and sending only the bounded evidence window needed for a decision. Cache keys must include detector/model version and input hash, and cached outputs should not silently cross evaluation arms.

## 9. Measurement Trust

The labels need stronger semantics. The synthetic “happy” fixture has rows saying “The failure occurred.” and “The outage happened.” marked as positive (labels-happy-rows.jsonl, lines 9–10; labels-happy.jsonl, lines 9–10), while the scorer question defines a positive as a turn ending by claiming the work is complete (score-completion-claims.mjs, lines 68–69) and feature 026 specifies the same construct (feature 026 spec, line 128). This is a semantic contradiction in the synthetic fixture, not evidence that the unavailable live labels are wrong. It does mean that this fixture, as written, cannot validate the intended positive construct without clarification or correction.

The parser also does not reject duplicate row IDs before indexing parsed rows and labels in maps (score-completion-claims.mjs, lines 103–125, 172–194, and 910). Duplicate IDs can overwrite earlier entries and make joins or denominators misleading. Add uniqueness checks and explicit unmatched-ID accounting. For human labels, define a written rubric, double-label a stratified sample independently, adjudicate disagreement, and publish agreement plus adjudication rates. Preserve provenance, collection window, inclusion rules, and a frozen split. Report confusion matrices and uncertainty by runtime and source, and use inference that respects clustered turns if multiple turns come from the same session.

The report's hashes and breakdowns improve reproducibility for the rows and labels that were supplied (score-completion-claims.mjs, lines 988–1009), but hashes alone do not establish how examples were sampled or labeled. The feature packet provides the aggregate outcome, but the actual row-level data, detailed report, and calls were unavailable for this review. Those limits prevent auditing individual classifications, label quality in the live corpus, or runtime-specific performance.

## 10. Reuse in .skilled

The shared completion evidence hook already provides a runtime-neutral advisory core across Claude, Codex, Devin, Cursor, Pi, and OpenCode; its documentation says it is enabled by default and advisory-only (hooks/completion/README.md, lines 18–22, 60–72, and 109–120). This is an existing reuse point for deterministic completion evidence, not proof that feature 026's model-based audit is enabled or that it should become a blocking gate.

Similar completion judgment could help execution-method guidance that asks an agent to check completion before declaring done (system-spec-kit/references/workflows/execution-methods.md, lines 54–66), acceptance-criteria validation that blocks closure while required criteria remain unmet (system-spec-kit/runtime/cli/lib/validator-registry.json, lines 88–97), and the manual-testing playbook's rule to include validation output before claiming completion (system-spec-kit/commands/create/assets/create-manual-testing-playbook-auto.yaml, lines 412–415). In each case, prefer using the domain's authoritative evidence—criteria, command output, or validation records—and use a claim detector as a prompt for review rather than a substitute for that evidence.

## 11. Ranked Recommendations

1. **Repair the measurement foundation first.** Resolve the synthetic fixture/label contradiction, reject duplicate IDs, document the annotation rubric, and retain row-level provenance. These are prerequisites to trusting a new accuracy number.
2. **Run a preregistered, stratified holdout comparison.** Compare the current regex, an expanded/context-aware candidate, and any cascade; report precision/recall, false-positive cost, per-runtime results, uncertainty, actual tokens, latency, and failure rates.
3. **Keep evidence advisory until a named reader and live policy exist.** The current score stops on the practical-margin gate and the feature spec explicitly defers live judgment. Do not make this regex the only positive gate while it reportedly misses all ten labeled positives.
4. **Reduce cost through an explicitly new evaluation arm.** Test one-pass plus targeted repeats and measure its agreement and uncertainty against the existing repeated protocol.
5. **Reconcile Pi visibility documentation before privacy claims.** The shared README says Pi's advisory is visible to the model, but the current Pi adapter calls pi.sendMessage with display:false and deliverAs:"nextTurn" (README lines 68–72; runtime/hooks/pi/completion-evidence.ts, lines 72–86), while the injection contract says advisory data does not enter model context (hooks/injection-contract.md, lines 237–241). This evidence does not settle actual model visibility; treat Pi as potentially model-visible until the contract and runtime behavior are reconciled.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Attribute all ten misses to vocabulary alone or reconstruct the miss-word distribution from aggregates | The original rows and per-word breakdown are unavailable; aggregate scores cannot establish whether wording or the 400-character boundary caused each miss. | specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60–68; .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:16–29; deltas/iter-001.jsonl:1; iterations/iteration-001.md:32 | 1 |
| Treat the synthetic happy fixture as proof of live-label quality or semantic gold for all trigger words | Two generic event statements are marked positive despite the completion-claim definition; this only disqualifies those fixture examples as proof and says nothing about live labels. | .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy-rows.jsonl:9–10; labels-happy.jsonl:9–10; .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:68–69; deltas/iter-002.jsonl:1; iterations/iteration-002.md:29 | 2 |
| Gate future Jev calls only on the existing regex | The reported regex misses all ten positive rows, so a regex-only call gate cannot recover them. | specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60–68; deltas/iter-002.jsonl:1; iterations/iteration-002.md:28 | 2 |
| Enable model judgment by default across completion hooks now | The measured arm stopped on margin and feature 026 defers live judgment pending a keep decision and named reader. | specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md:91–96, 157–161; deltas/iter-003.jsonl:1; iterations/iteration-003.md:31 | 3 |
| Use the current regex as an upstream filter for an improved model | Because the regex missed the reported positives, this filter would discard the cases the model is intended to recover. | specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60–68; deltas/iter-003.jsonl:1; iterations/iteration-003.md:32 | 3 |
| Infer live duplicate prevalence, annotation quality, runtime accuracy, or turn clustering from aggregate counts | K/M/A/B/W/L/F does not expose those properties, and no row-level data was available. | specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md:60–68; iterations/iteration-002.md:32 | 2 |
| Convert the offline 331-call count into a dollar or monthly live cost | Actual prices, call frequency, and invocation rates were not supplied. | .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:736–807, 842–900; iterations/iteration-003.md:35 | 3 |
| Treat p=0.02452 alone as sufficient to ship | The scorer checks its minimum practical margin first; a nine-row difference is below the required eleven. | .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs:972–986; deltas/iter-001.jsonl:2 | 1 / synthesis |

## Divergence Map

| Evidence sources | Divergence | Scope and impact |
|---|---|---|
| Feature 026 spec lines 128–140 vs scorer implementation at .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs | The spec names the older path runtime/lib/hooks/completion-evidence-sentinel.cjs; the scorer imports runtime/hooks/lib/completion-evidence-sentinel.cjs. | This is a path-reference mismatch, not an observed behavioral conflict. Findings about actual detector behavior are based on the imported runtime file and scorer, not the stale path. |
| Synthetic positive labels at labels-happy-rows.jsonl:9–10 and labels-happy.jsonl:9–10 vs scorer question at score-completion-claims.mjs:68–69 and feature spec line 128 | Fixture examples describe a failure/outage occurring, not an agent claiming its work is complete. | Limits fixture validity for the intended construct. It does not prove the live 110 labels are invalid. |
| hooks/completion/README.md:68–72, runtime/hooks/pi/completion-evidence.ts:72–86, and hooks/injection-contract.md:237–241 | README describes Pi advisory guidance as model-visible; adapter passes display:false, deliverAs:nextTurn; injection contract says advisory data is not in model context. | Actual visibility remains unresolved from these sources. Global privacy conclusions and default-on claims must remain qualified until runtime behavior is verified. |

## 12. Open Questions

1. Can the original 110-row corpus, detailed scorer report, and captured judgment outputs be made available for a row-level audit, including the ten missed positive examples?
2. What is the intended definition and provenance of the two synthetic fixture positives that describe a failure or outage?
3. Do duplicate IDs occur in the live inputs, and are the 50 Pi / 60 Claude examples independent turns or clustered within sessions?
4. What are actual prompt and response token totals, latency distributions, timeout rates, and expected invocation frequency under the proposed live design?
5. What exact mechanism determines whether Pi's nextTurn advisory reaches model context, and which source should define the contract?
6. Who is the named reader for a live judgment, and what action should that reader take on positive, negative, uncertain, or unavailable output?

## 13. Default-On Integration

The existing shared evidence hook is already documented as default-on, advisory-only behavior. That integration should remain distinct from a live model judge. The evidence supports reusing the shared runtime-neutral hook for deterministic evidence and review prompts, but does not support enabling the feature 026 model arm by default (hooks/completion/README.md, lines 18–22 and 60–72; feature 026 spec, lines 91–96 and 157–161).

A future default-on model integration would need: explicit operator consent for model calls; redaction/minimization rules; a named reader and action policy; bounded asynchronous execution that cannot block completion; fail-open behavior on timeout or service error; deduplication and a kill switch; versioned prompts and detector/model identity; audit logs that preserve input/output provenance without retaining unnecessary sensitive content; and telemetry for actual calls, tokens, latency, failures, disagreement, and reader usefulness. The feature spec requires consent and redaction and treats the live judgment as out of scope for the current phase (feature 026 spec, lines 87–96 and 128–140).

The scorer's three judgments per row are an offline evaluation cost, not a forecast of default-on runtime expense. Current dollar cost, live call frequency, latency, and incremental benefit are unknown. The Pi visibility discrepancy also means model-context exposure cannot be stated globally with confidence. Resolve it before describing all runtime advisories as hidden or non-injected.

## 14. Risk Controls

The main risks are missed claims, false claims caused by context-blind lexical matches, noisy or misaligned labels, runtime-specific performance differences, repeated model cost, sensitive-tail exposure, and nonblocking advice becoming an accidental gate through downstream use. Mitigations are a validated construct and fixture set, holdout evaluation, per-runtime reporting, scoped retention/redaction, explicit user consent, bounded fail-open calls, a kill switch, and a named reader who treats the output as a review signal rather than proof. Any blocking use should be separately evaluated against authoritative task evidence and an explicit acceptance threshold.

## 15. Evidence Limits

The aggregate score, sample composition, and reported ten misses come from the user-provided brief and packet summary; calculations and the margin decision are independently reproducible from those inputs and scorer code. The exact miss causes, live annotation validity, duplicate incidence, model call content, dollar cost, latency, and runtime-specific rates are unknown because the underlying rows and execution artifacts were not available. Fixture inconsistency is confirmed only for the two synthetic examples cited above. Pi model visibility is unresolved and should not be generalized beyond the conflicting sources.

A citation-path mismatch in the feature spec limits confidence in that spec's referenced implementation location, but not in the scorer's actual import path or in the separate runtime file read during the iterations. Recommendations about new protocols are proposals; they do not alter the reported run.

## 16. Conclusion

The result is a nine-row accuracy advantage with p=0.02452 that fails the scorer's eleven-row minimum-margin requirement. It is evidence of a directional improvement under the reported protocol, not evidence that the detector captures completion claims reliably: all ten labeled positives were reportedly missed, and the available synthetic fixture includes a construct mismatch. Establish a trustworthy corpus and holdout, then compare accuracy and cost under a preregistered protocol. Keep the existing shared evidence hook advisory. A default-on model judge remains unsupported until live benefit, cost, consent, redaction, named-reader behavior, and Pi visibility are resolved.

## 17. References

- Completion-claim research packet: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/010-completion-claims-research/spec.md, lines 60–68.
- Feature 026 packet: specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md, lines 87–96, 128–140, 157–161.
- Scorer: .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs, lines 16–29, 68–69, 103–125, 172–194, 223–235, 736–807, 842–900, 910, 972–1009.
- Synthetic fixtures: .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy-rows.jsonl, lines 9–10; labels-happy.jsonl, lines 9–10.
- Shared hook docs: .skilled/hooks/completion/README.md, lines 18–22, 60–72, 109–120; .skilled/hooks/injection-contract.md, lines 237–241.
- Pi adapter: .skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts, lines 72–86.
- Reuse sites: .skilled/skills/system-spec-kit/references/workflows/execution-methods.md, lines 54–66; .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json, lines 88–97; .skilled/commands/create/assets/create-manual-testing-playbook-auto.yaml, lines 412–415.
- Iteration records, deltas, strategy, and structured findings: this Luna lineage directory.

## Convergence Report

- Stop reason: maxIterationsReached.
- Iterations completed: 3 of 3.
- Primary questions answered: 5 of 5; residual evidence requests are listed in Section 12.
- New-information ratios: 0.80, 0.80, 0.80; convergence threshold: 0.05. Convergence was telemetry only and did not shorten the requested run.
- Synthesis status: all five requested questions addressed with evidence and explicit limitations. No live integration or code change was performed.
