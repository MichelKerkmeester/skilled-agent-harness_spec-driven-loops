# Iteration 5: Cross-feature proof-or-retire rule and ranked sequence

## Focus

Verify the shared Jev gate's current registry and call-site contract, compare the three scorer families' decision surfaces, and derive a common evidence standard with feature-specific next steps. This is the fifth and terminal evidence iteration; the configured stop is `maxIterationsReached`.

## Actions Taken

- Re-read the lineage state and strategy; Q1–Q4 are covered in iterations 1–4, so selected the remaining cross-feature question.
- Checked the current gate registry, switch precedence, credential readiness, and helper tests.
- Compared existing gated consumers with the candidate scorer imports and their independently implemented verdict logic.
- Consolidated candidate-specific evidence and missing prerequisites from iterations 2–4; did not run model or live Jev calls.

## Findings

1. **P0 — Keep 017, 020, and 022 out of the shared gate and out of any auto-on path.** `FEATURES` currently contains only `cite-drift`, `injection-screen`, `verdict-fallback`, and `hallucination-grader`; none of the three candidate names is registered. The helper defaults unset switches to on and `featureReady` performs the credential check only after a feature passes the switches. Consequently, registering an unproven candidate would make it eligible by default on credentialed installations; the table is not a neutral registry change. **Confirm:** add a candidate only after its evidence gate below passes and its consumer tests prove that disabled, unready, and failing Jev paths preserve the pre-Jev result. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:33-55,77-105,171-185] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:56-72,116-130,197-229]

2. **P0 — Integrate future consumers through `featureReady` and retain an explicit baseline fallback; do not copy cite-drift's bespoke readiness path as the common pattern.** Injection-screen returns without altering the hook on disabled, invalid-payload, or unready paths; the reviewer scorer selects `noop` when its auto gate is not ready; and the 5-dimensional benchmark selects `noop` when its auto gate is unavailable. By contrast, cite-drift currently calls `featureSwitch` and performs its own pinned-version/auth check. The shared gate tests prove switch precedence and that an off feature does not spawn Jev, but those helper tests do not prove a new consumer's output is unchanged on provider error. **Confirm:** a candidate's opt-in shadow call must use `featureReady(name)`, preserve its exact old behavior for off/missing-credential/error/timeout/invalid-response cases, and have consumer-level tests for each applicable path; only a separately reviewed policy change should move it from shadow to canary/live. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:171-185] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:197-229] [SOURCE: .skilled/hooks/injection-screen/claude/injection-screen-posttooluse.mjs:75-103,110] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:333-360] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:606-632] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1440-1449,1467-1475,1546-1556]

3. **P1 — Use one validity standard, but retain feature-specific measurement and verdicts.** All three candidate scorers import the shared `scorer-report.mjs` support and expose related row gates and paired keep-rule ingredients, yet their decision logic is local: feature 017's published rule is keep-or-stop on coverage, margin, sign, and flips; feature 020 has its own replay eligibility, 30-row label gate, and clarify/abstention classes; feature 022 has its own label gate, state-control arm, and explicit kill branch. A shared reporting helper therefore does not make their corpora, labels, eligible events, or a `keep` semantically interchangeable. **Confirm:** each report must retain feature-specific eligible denominators and classes, pinned row/model/router/scorer identity, label provenance, per-class performance and abstention, and the exact feature's predeclared baseline and verdict rule. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:26,55-64,816-894] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:25,45-51,637-695,1558-1573] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:59,525,745-758,1622-1627]

4. **P1 — Apply a common proof-or-retire gate before any feature advances: real, time-separated usage; independent labels; a predeclared strongest-safe baseline; adequate power; absolute and class-specific floors; and passing negative controls.** A `keep` from an authored or proxy fixture cannot answer external validity. A `stop` for too few eligible rows, margin, coverage, or missing labels is unresolved evidence, not a kill; a feature-specific `kill` on a valid prespecified control can close the tested question or backend. Integration follows shadow → canary → live, with fail-open behavior and tests at each consumer boundary. **Confirm:** publish corpus and split hashes, row and label provenance, comparator, alpha/MDE/power, overall and class floors, abstention policy, confidence intervals, and all negative-control outcomes before reading the holdout result; require user-confirmation and fallback-path tests before enabling any user-visible action. [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi/iterations/iteration-002.md:13-16] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi/iterations/iteration-003.md:13-16] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi/iterations/iteration-004.md:15-23] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:171-185]

5. **P1 — Rank the next evidence actions by what currently blocks a decision: 022 masked-state ablation first, 020 real-clarification shadow labels second, 017 powered real-request holdout third.** For 022 the current control is a state-anchoring kill and a same-row masked contrast can determine whether this question is salvageable; only then consider real saves. For 020 the 54-row authored keep collapses to 12 replay-eligible labels, below its gate, while committed prompts rarely produce mode clarifications; measure real event volume and collect user picks before another model arm. For 017 the 270-row repeat remains inconclusive (106 vs. 82 with a 95% interval spanning zero); pre-register floors and collect about 431 rows at the reported decided rate for 80% power before any deployment reconsideration. **Confirm:** each action must produce its feature-specific artifact—masked versus distractor contrast, consented event census plus shadow-choice labels, or a pinned real Gate 1 holdout and prospective power report—before it can move to the next rollout stage. [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi/iterations/iteration-004.md:15-23] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi/iterations/iteration-003.md:13-16] [SOURCE: specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi/iterations/iteration-002.md:13-16]

## Ruled Out

- Adding candidates to `FEATURES` as a harmless registration step: unset switches are on, so a ready credential can make a new entry execute.
- Treating gate-helper tests as proof that consumer output fails open; the helper only proves switch/readiness behavior.
- Using a single pooled `keep` label across features as deployment authority: each scorer has a different eligible population, labels, and threat model.
- Treating a statistical `stop` as proof of no utility, or treating one control `kill` as a population-wide estimate; distinguish insufficient evidence from a decisive prespecified failure.
- Advancing any candidate directly from fixture keep to auto-on live behavior.

## Dead Ends

- More model calls on feature 020's replay-invalid rows cannot cross its 30-eligible-label gate or create real-user-choice labels.
- More feature-022 calls with visible folder identifiers do not address state copying; first run the masked-state contrast.
- Another feature-017 run on packet prose does not fix external validity, even if row/model pins improve reproducibility.

## Edge Cases

- Feature 020's gate measures replay-eligible, labeled mode clarifications; checklist clarifications and ordinary near-tie routing cases are not substitute rows.
- Feature 022's control kill diagnoses state leakage on that treatment, while its primary keep is still a fixture result; do not infer either population accuracy from it.
- The shared gate's environment-over-config resolution and legacy cite-drift alias must remain intact if a future feature is registered.
- A manually explicit Jev request can have different failure semantics from an auto/default path; tests and rollout claims must name the actual invocation mode.

## Sources Consulted

- `.skilled/skills/cli-classifier/shared/scripts/jev-features.mjs:33-55,77-105,139-185`
- `.skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:56-72,107-130,159-229`
- `.skilled/hooks/injection-screen/claude/injection-screen-posttooluse.mjs:75-110`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs:333-360`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:606-632`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1440-1449,1467-1475,1546-1556`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:26,55-64,816-894`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:25,45-51,637-695,1558-1573`
- `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:59,525,745-758,1622-1627`
- `specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi/iterations/iteration-002.md:13-16`
- `specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi/iterations/iteration-003.md:13-16`
- `specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi/iterations/iteration-004.md:15-23`

## Assessment

- New information ratio: 0.5.
- Novelty justification: this iteration directly verifies the exact four-entry gate registry, switch-first credential readiness, helper-test limits, three distinct consumer fallback shapes, and the shared reporting/local-verdict boundary. The feature-specific proof needs largely synthesize prior iterations rather than add new population evidence.
- Questions addressed: the common shared-gate contract, proven integration patterns, and unified proof-or-retire standard.
- Questions answered: “What unified proof-or-retire rule and ranked next step applies across the three candidates?” — answered as a common evidence gate with feature-specific next experiments and staged integration; no candidate currently qualifies for live auto-on.
- Questions remaining: no research question remains unanswered within this five-iteration scope; real-traffic data, independent labels, the 022 masked-state result, and implementation validation remain future evidence, not implied completion.

## Reflection

- What worked and why: checking the registry and actual call sites exposed a subtle non-uniformity—cite-drift retains a custom readiness path while the other inspected auto paths use `featureReady`—and separated shared reporting machinery from feature-specific evidence validity.
- What did not work and why: source inspection cannot produce missing consented real traffic, independent labels, or the feature-022 ablation; these remain external evidence dependencies.
- What I would do differently: make feature-specific evidence contracts and consumer fail-open tests explicit before adding any new gate entry, so registry availability cannot outrun proof.

## Questions Answered

- What unified proof-or-retire rule and ranked next step applies across the three candidates?

## Questions Remaining

- None within the bounded research questions. The next decisions depend on future, feature-specific evidence described above.

## Next Focus

STOP — the configured five evidence iterations are complete. Record the terminal reason as `maxIterationsReached`; do not infer that any candidate passed its evidence gate or is approved for deployment.
