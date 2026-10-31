# Jev Pi Native Classifier Transport: Luna Research

## Table of Contents

1. Executive Summary
2. Scope, Method and Inputs
3. RQ1: What Drove the Adopt Result?
4. RQ2: How to Raise Accuracy
5. RQ2: How to Lower Cost
6. RQ3: How to Make Measurement Trustworthy
7. RQ4: Other .skilled Opportunities
8. RQ5: Requirements for Default-On
9. Runtime Risk and Operating Cost
10. Cross-Lineage Agreement
11. Recommendations
Eliminated Alternatives
Divergence Map
12. Open Questions
13. Proposed Build Phases
14. Citation Verification Ledger
15. Evidence Quality and Caveats
16. References
17. Convergence Report

## 1. Executive Summary

Keep Pi opt-in while strengthening evidence and provider semantics. The feature 037 scorer returned adopt because all 111 rows were covered, 95.5% of Pi/CLI top choices agreed, and Pi’s 340 ms p95 was below the 1.5x CLI latency bound. Agreement cleared its 95% threshold by one case; the CLI arm was a recorded run from a different provider/model pairing, and CLI cost was not reported. This is an opt-in feasibility result for one choice corpus and Pi version, not proof of greater correctness, transport-only causality, or savings. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:69-80] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-67] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-50]

The highest-value next step is a frozen, human/adjudicated choice set evaluated with fresh paired runs and both-side cost/fallback instrumentation. Before any default change, preserve provider intent, bound the Pi-plus-CLI fallback budget, and retain a rollback path. Six other source-verified .skilled choice scorers are later candidates, conditional on provider and caller-contract checks; the current transport has only two confirmed imports. [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:29-80] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:32-64] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs:454-467] [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:72-80]

## 2. Scope, Method and Inputs

This lineage answered five questions using the persisted feature 037 report, its benchmark/scorer source, the shipped transport implementation and catalog entry, phase 038 integration context, and read-only inspection of candidate call sites. It did not call a model or network service, rerun the benchmark, execute tests, modify the transport, or merge sibling research. Three iterations ran to the configured maximum; maxIterationsReached is the terminal reason. The analysis distinguishes reported values, calculations from those values, and recommendations.

Two packet descriptions conflict with implementation/artifact paths: the research spec calls jev-transport.mjs the scorer and says Phase 047 measured the result; the benchmark identifies score-pi-transport.mjs as scorer, and the measured artifact is under feature 037, which phase 038 cites as its basis. The exact intended meaning of “047” is unknown. These mismatches limit provenance labeling, not the report values cited below. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/spec.md:45-72] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/README.md:7-34] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-48]

## 3. RQ1: What Drove the Adopt Result?

The scorer’s fixed keep rule requires coverage of at least 90%, top-choice agreement of at least 95%, and Pi p95 latency no greater than 1.5 times CLI p95. The judge evaluates coverage first, then agreement, then latency; cost is printed but never changes the verdict. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:69-74] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1060-1087]

The report has K=111, M=111, 100% coverage, 95.5% agreement, median absolute probability difference 0.0100, Pi p95 340 ms, recorded CLI p95 387 ms, and Pi cost $0.0022399 per 100 calls. Both arms show 333 calls and no reported timeout or exclusion. The Pi/CLI p95 ratio is about 0.88, inside the 1.5x limit. The rounded agreement rate implies 106/111 matching top choices; 105/111 would be about 94.6%, so one additional mismatch would fail the agreement gate. The integer count is calculated from the rounded percentage, not separately reported. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-67]

The implementation computes agreement by comparing each arm’s mean-ranked top key, and computes median absolute probability difference over per-order option probabilities. These measure parity and distributional similarity. The report contains no independent gold-label outcome, so the result does not show that Pi is more accurate than the CLI. The measured Pi arm used OpenRouter typesafe/jev-1.13 while the CLI used official jev-1.13.0, and phase 038 says the CLI latency side is the older recorded 019 run. Backend/version and time therefore confound a transport-only interpretation. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1031-1057] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-44] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-50]

## 4. RQ2: How to Raise Accuracy

1. **Measure correctness separately from parity.** Label representative choice cases with independent human/adjudicated answers, blind reviewers to backend, and report each backend’s accuracy and calibration alongside Pi/CLI agreement. Keep an untouched holdout after tuning and size it to distinguish acceptable degradation; show intervals rather than only point estimates. The present agreement gate is a rollout guard, not a truth set. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1031-1057]
2. **Preserve request semantics.** choiceRequestFrom recognizes a constrained choice shape, maps caller state and option descriptions, and sends unknown flags back to CLI. It consumes but discards --provider, while the Pi route is fixed to OpenRouter and typesafe/jev-1.13. Preserve explicit provider choice or route only through an allowlisted compatible provider/model. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:32-36] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:71-138]
3. **Add answer-contract diagnostics without calling them accuracy.** The adapter requires the selected key to be submitted and every submitted key to have a finite probability. Add diagnostics for out-of-range values, probability totals, and disagreement between the chosen key and maximum probability, with a specified tie rule. Reject results only when the Pi contract guarantees those invariants; validate behavior against labeled cases. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:141-172]
4. **Inspect discordant rows by domain and option order.** Keep the existing three rotations for confirmation, identify cases that flip across arms or orderings, and use them to refine instructions or option descriptions. The report gives only aggregate disagreement; row-level adjudication is needed to tell harmless parity differences from consequential mistakes. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:575-601] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1038-1057]

## 5. RQ2: How to Lower Cost

The measured Pi rate is $0.0022399 per 100 calls, about $0.0000224 per call. At unchanged model and usage mix, that scales to about $2.24 per 100,000 Pi calls or $22.40 per million. These are Pi-side estimates only. The report’s CLI cost is null, and failed Pi requests followed by CLI fallback are not represented as a comparative total-cost result; current savings and production bill are unknown. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-44] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:373-395]

For research iteration, one randomized order can screen candidate models at roughly one third the calls of three rotations, then the existing three-order replay can confirm finalists. Do not use the reduced screen as the final adoption measurement because rotations expose option-order sensitivity. In production, each eligible request makes one Pi classify call; evaluate any cheaper model against the same quality and latency gates before routing to it. Instrument CLI cost, Pi cost, fallback attempts, and complete wall time before claiming savings. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:575-599] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:373-395]

## 6. RQ3: How to Make Measurement Trustworthy

1. Freeze and identify corpus/census, scorer version, runtime versions, provider/model, option text, and source run; split tuning from holdout data.
2. Run both arms freshly in the same window against identical inputs. If provider/model cannot be held equal, label the result an end-to-end backend comparison rather than isolating transport.
3. Add independent blinded labels and report per-arm correctness, calibration, paired disagreements, and intervals. Keep coverage, agreement, and missing-result handling separate.
4. Randomize or counterbalance arm and option order; keep three rotations for confirmation. The current plan builds rotated orders. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:575-601]
5. Price both arms and include fallback calls, failure counts, and end-to-end latency. The scorer uses recorded CLI calls unless the fresh CLI arm is enabled; phase 038 confirms the existing comparison used an older CLI run. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1112-1155] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1330-1351] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-50]

## 7. RQ4: Other .skilled Opportunities

The strongest first candidate is system-skill-advisor’s score-suggested-order: it sends the same choice shape and is the source family for the recorded advisor choice replay. Further candidates are:

| Candidate | Evidence it asks a choice question | Qualification before reuse |
|---|---|---|
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs | choice command at lines 454-467 | Highest fit; verify provider and timeout seam. |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs | choice command at lines 1002-1011 | Reuse only its choice pass; broader scorer includes another question type. |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs | choice command at lines 1324-1333 | Check provider, stdin contract, and retries. |
| .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs | choice command at lines 730-739 | Check state shape and retry/timeout behavior. |
| .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs | choice command at lines 775-785 | Check selected provider and fallback semantics. |
| .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs | choice command at lines 1067-1074 | Keep severity options and published-registry gate intact. |

These are source-verified candidates, not confirmed integrations or measured gains. The only confirmed imports remain score-clarify-default.cjs:24 and leaf-route-replay.cjs:26. Feature 038 left system-deep-loop, system-skill-advisor, and system-spec-kit runtime trees to other owners, so implementation needs an owning packet and per-caller tests. [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:72-80] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:24] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:26] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:45-46] Phase 038 says 21 direct-spawn files but owner breakdown names 20; rerun a reproducible read-only inventory before using its list as a rollout denominator. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:106-124]

## 8. RQ5: Requirements for Default-On

Default-on is not supported by the current evidence. Before changing what an unset switch means:

1. Preserve the caller’s provider request or reject Pi routing for unsupported providers. Current parsing discards --provider and Pi uses one fixed OpenRouter model. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:32-36] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:87-93]
2. Pass a same-window paired run with labeled correctness, explicit coverage/latency/cost limits, and both-side costs. The current report clears agreement by one case and has no CLI cost. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-67] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:69-74]
3. Bound total caller latency across Pi attempt plus CLI fallback and expose fallback counts/reasons. The adapter falls back after Pi package/model/credential/backend errors. [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:48-64]
4. Keep an explicit CLI rollback and specify precedence. Today the per-call transport option wins over the environment, so an environment kill switch cannot override an explicit per-call Pi option without a contract change. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:49-64]
5. Canary the two existing choice callers first. Keep noul, score, auth, and unsupported shapes on CLI until each has its own mapping and measurement. [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:41-46] [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:72-80]

## 9. Runtime Risk and Operating Cost

The Pi route depends on the Pi package, fixed model availability, and Pi’s credential store. A gate or backend failure triggers CLI fallback. That preserves the caller’s CLI-shaped result but can add a failed Pi attempt, latency, and potentially a second provider charge; repeated failures can emit per-call skip output. Phase 038 requires stubbed backends and a test per gate. [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:48-70] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:89-104]

Total rollout cost cannot be calculated without eligible call volume, live fallback rates, and CLI/provider price. The measurable estimate is Pi’s recorded unit rate only; one million eligible Pi calls would be about $22.40 under the same price and usage mix. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-29]

## 10. Cross-Lineage Agreement

This is a detached Luna lineage. No sibling synthesis findings are incorporated, so cross-lineage agreement or disagreement is not assessed. The parent packet must compare lineages before presenting consensus.

## 11. Recommendations

| Rank | Recommendation | Why and evidence |
|---|---|---|
| 1 | Keep the transport opt-in; run a fresh paired, labeled benchmark before changing the default. | Agreement is 95.5%, one case above its gate; CLI timing is from an older provider/model run, and CLI cost is null. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-67] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-50] |
| 2 | Preserve provider semantics and define a hard combined timeout/fallback budget. | The adapter discards provider input, pins Pi to one model, and falls back to CLI after Pi failure. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:32-36] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:87-93] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:373-395] |
| 3 | Instrument both routes, including costs, row outcomes, fallback reason, and total latency. | Pi cost is reported but CLI cost is null, and fallback can add work. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:24-44] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:373-395] |
| 4 | Evaluate compatible choice callers one owner at a time, starting with score-suggested-order. | It uses the benchmark’s choice shape; six candidates are visible, but their providers and caller contracts remain unchecked. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs:454-467] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:99-124] |
| 5 | Correct scorer/phase references and reconcile the 21-vs-20 census during the owning build task. | The current research scope and phase 038 inventory have source-description/count conflicts. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/spec.md:45-72] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:106-124] |

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat 95.5% agreement as proven correctness | Report compares Pi with CLI and has no independent gold-label outcome; backend and version differ. | [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-67] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-50] | 1, 3 |
| Claim Pi is cheaper than CLI | Pi has a usage cost, CLI cost is null, and cost is not a verdict gate. | [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:24-44] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1083-1087] | 1, 2 |
| Route every direct Jev spawn or every question type to Pi | Adapter accepts a constrained choice shape and fixes provider/model; noul and score have no measured mapping. | [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:71-118] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:99-104] | 2, 3 |
| Use one option ordering as the confirmatory test | The benchmark rotates orders; one order would not test position sensitivity. | [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:575-599] | 2, 3 |

## Divergence Map

| Topic | Source A | Source B | Research treatment |
|---|---|---|---|
| Scorer identity | Research scope labels shared/scripts/jev-transport.mjs the scorer. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/spec.md:45-72] | README and runtime source identify benchmark/pi-transport/score-pi-transport.mjs as scorer and jev-transport.mjs as adapter. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/README.md:7-34] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:4-8] | Treat as a terminology/path conflict; use executable scorer for method claims. |
| Measured phase | Research scope says Phase 047; the cited report is under feature 037. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/spec.md:60-72] | Phase 038 says it is the integration phase and uses feature 037 as its basis. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-48] | The intended meaning of 047 remains unknown. Cite the report path directly and qualify provenance. |
| Caller inventory | Phase 038 says 21 direct-spawn files but owner breakdown names 20; its follow-up list has 13 rows. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:106-124] | Inspected code verifies six other choice call sites, not an exhaustive count. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs:454-467] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1324-1333] | Do not use the table as a complete census or rollout denominator. |

These conflicts qualify phase/scorer labels and inventory scope, not the values K=111, M=111, coverage 100.0%, agreement 95.5%, median_abs_dp 0.0100, and p95 340/387 independently recorded in the report. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:46-67]

## 12. Open Questions

- What production volume of eligible choice calls should the cost estimate cover, and what is the CLI provider’s actual usage cost?
- Can both paths run with the same provider/model, or must the next report remain an end-to-end backend comparison? [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:27-44]
- Which independent reviewers can label a representative holdout and resolve disagreements without seeing backend?
- Which candidate call sites use an allowed provider and match adapter stdin, option, and timeout semantics?
- Which direct-spawn file explains the difference between 21 found and 20 owner-mapped? [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:106-124]
- Should an emergency environment switch override an explicit per-call Pi selection? The current resolver gives the per-call option precedence. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:49-64]

## 13. Proposed Build Phases

1. **Measurement hardening:** add a fresh paired mode, frozen corpus identity, independent labels, confidence intervals, and both-side cost/fallback reporting; retain rotations for confirmation. [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:575-601] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1112-1155]
2. **Provider and failure semantics:** preserve provider input, make model support explicit, emit non-sensitive outcome/fallback telemetry, and enforce a combined latency budget. [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:32-64] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:325-395]
3. **Caller evaluation:** inventory choice calls reproducibly; test candidates one owner at a time, starting with system-skill-advisor suggested-order, and keep non-choice commands on CLI. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs:454-467] [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:41-46]
4. **Canary decision:** retain opt-in until evidence and provider gates pass; canary the two existing sk-doc callers, preserve CLI rollback, and enable broader defaults only after owner review. [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:29-39] [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:72-80]

## 14. Citation Verification Ledger

| Claim | Primary evidence |
|---|---|
| Adopt thresholds and ordering | [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:69-80] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1060-1087] |
| Report values and backend identity | [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json:16-67] |
| Recorded CLI arm and provider/model difference | [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:41-50] [SOURCE: .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs:1112-1155] |
| Choice request/result and fallback contract | [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:71-173] [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:325-395] |
| Existing transport callers | [SOURCE: .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:72-80] |
| Other choice call shapes | [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs:454-467] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1324-1333] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs:730-739] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:775-785] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs:1067-1074] |
| Packet contradictions | [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/spec.md:45-72] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md:106-124] |

## 15. Evidence Quality and Caveats

- **Directly confirmed:** scorer thresholds/formulas, report values, fixed Pi provider/model, choice-only parser, fallback behavior, two existing imports, and cited choice call shapes.
- **Derived:** 106 matching rows, one-case margin, latency ratio, and scaled Pi cost are calculations from reported values.
- **Inferred:** the result is parity rather than correctness because the inspected report compares backends and contains no independent truth outcome. A labeled holdout would confirm correctness.
- **Unverified:** other callers’ provider compatibility, production volume/cost, alternative model quality, and exact completeness of the direct-spawn inventory.
- This lineage is research-only; no live calls or transport source edits were made. Packet scorer/phase and phase inventory conflicts qualify provenance and exhaustiveness claims.

## 16. References

- .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs
- .skilled/skills/cli-classifier/benchmark/pi-transport/README.md
- .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs
- .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md
- .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
- .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs
- .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs
- .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs
- specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json
- specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md
- specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/spec.md

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Iterations completed: 3 of 3
- newInfoRatio telemetry: 1.00, 0.80, 0.72. None approached the 0.05 threshold; max-iterations governed.
- Key questions answered: 5 of 5. Production volume, true CLI cost, provider compatibility at candidate callers, and census completeness remain unknown.
- Resource-map: absent at initialization; emission disabled for this lineage.
- Terminal decision: retain opt-in until paired labeled quality/cost evidence and provider-preserving fallback semantics pass their gates.
