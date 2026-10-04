# Iteration 5: Caller records, cross-surface drift, and final reconciliation

## Focus

Reconcile the live imports and calls of shared transport and scorer-report modules with each caller's route selection, call records, and tests. Cross-check the prior findings against the catalog, runtime mirrors, test fixtures, and measured-result surfaces. This is the fifth and final pass; convergence remains telemetry only under the max-iterations stop policy.

## Actions Taken

- Re-read the iteration prompt and checked the lineage steering file before starting; steer.md was absent.
- Reconciled all six transport caller surfaces, including the five external imports in sk-doc, system-deep-loop, and system-spec-kit and the cli-classifier injection-screen caller.
- Reconciled the scorer-report import sites in the clarify-default scorer, injection-screen scorer, track-narrowing scorer, score-alignment-suggestion implementation, and its test.
- Traced score-clarify-default from its process environment through spawnClassifierCall to its calls.jsonl record, then compared the record and test assertions with the feature-catalog promise.
- Rechecked the existing findings for source anchors and preserved the distinction between static evidence, historical recorded measurements, and results that remain unmeasured. No tests, benchmark arms, Jev calls, validators, builds, or generated tooling ran.

## Findings

### LUNA-F006 — The clarify-default scorer omits the answering transport from call records

- **Severity:** P2
- **Axis:** 7 — drift between docs, metadata, mirrors, code, and result visibility
- **Evidence:** score-clarify-default calls spawnClassifierCall without a per-call transport option (.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1265-1267); when JEV_TRANSPORT is unset, the shared helper resolves to auto and can return a Pi answer with transport: 'pi' (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:64-72, 534-536, 593-601). Its choice-call writeCall record hardcodes backend: 'jev' and contains no transport field (.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1366-1380). The feature catalog says all five scorers record the answering route as transport (.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md:61-63; .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:88-101). The shared test helper forces JEV_TRANSPORT='jev', while its separate Pi test forces 'pi' and checks the returned model without asserting a transport field in calls.jsonl (.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs:190-193, 958-984).
- **How confirmed:** Static tracing of the caller's process environment, shared helper route resolution/result, and the exact choice-call record object, followed by cross-checking the catalog claim and test assertions. The returned model can sometimes hint which provider answered, but the promised route field is absent and the record's backend label can mislead a benchmark reader. No test or scorer was run.

## Cross-Surface Reconciliation

- The transport caller census has six call surfaces: five external imports (cite-drift-scan.mjs, score-clarify-default.cjs, score-verdict-fallback.cjs, score-d4-agreement.cjs, and score-track-narrowing.mjs) plus the hub's score-injection-screen.mjs. The scorer-report helper is consumed by clarify-default, injection-screen, track-narrowing, and the score-alignment-suggestion implementation; the latter also has a test import. No scorer-report caller in system-deep-loop was found in the inspected search results.
- The automatic route is intentionally available to supported choice/noul calls, and the helper returns the actual transport. The call-site record fields therefore need to be checked independently from the shared helper result; F006 is a caller-level reporting gap.
- The prior six findings remain supported by their recorded source anchors. The catalog and adapter metadata align with the hub route and leaf list, though the advisor's prompt corpus had no Jev examples and recall remains unmeasured.

## Questions Answered

- The clarify-default caller does not persist the returned answering transport despite the catalog's claim.
- Its tests force Jev in the shared helper and use an explicit Pi override for the Pi test; they do not prove automatic-route call-record labeling.
- The new transport-integration replay and injection-screen inputs have no checked-in scored verdict, although the Pi integration catalog retains a historical measured comparison.

## Questions Remaining

- Would actual tests reproduce the two static transport defects and the caller-level route-record gap?
- Would a current Pi/CLI replay change the historically recorded comparison or expose a new result?
- Does every one of the 79 audited-scope Markdown documents satisfy its own complete sk-doc checklist? This lineage confirmed a concrete code-folder README omission and a shared-tier README accuracy defect, but did not execute the prohibited validators or make an exhaustive human checklist claim.

## Assessment

- **New-information ratio:** 1.00 (telemetry only; one new, fully novel caller-record finding was confirmed).
- **Novelty:** F006 connects an automatic transport outcome to a caller's fixed backend label and absent route field, and independently contradicts the catalog's five-scorer reporting claim.
- **Negative knowledge:** No new scorer-report arithmetic defect or advisor graph/manifest mismatch was confirmed in the inspected paths. No P0 or P1 issue was established in this static pass. Runtime behavior, live advisor recall, and current benchmark results remain unverified.

## Recommended Next Focus

A follow-up implementation review can decide whether the caller should pin Jev transport or record the shared helper's returned transport, then align the catalog and tests with that choice. Separate static or validator review can inspect every documentation leaf against its own sk-doc checklist, and a permitted benchmark run can publish the current comparison result.

## Sources Consulted

- .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1265-1267, 1366-1380, 1673 — shared call, choice record, and process environment.
- .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs:190-193, 958-984 — route-forcing fixtures and Pi-return-model assertion.
- .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:64-72, 534-536, 593-601 — automatic route and returned answering transport.
- .skilled/skills/cli-classifier/feature-catalog/feature-catalog.md:61-63 — five-scorer route-record claim.
- .skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md:88-101 — detailed caller and record claim.
- .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:25 — transport caller.
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs:28 — transport caller.
- .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs:25 — transport caller.
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:25-26, 1713-1720 — transport and scorer-report caller.
- .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:30 — internal transport caller.
- .skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs:107-229 — shared summary arithmetic.
- .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:525 — dynamic scorer-report consumer.
- .skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts:1003 — test import of the scorer-report module.
- steer.md was absent at the start of this pass.
