# Jev Clarify Default: Research Synthesis

## 1. Metadata

- **Research ID:** FANOUT-LUNA-1790994315165-PSY9BC
- **Feature/Spec:** [cli-jev feature 020](specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md)
- **Status:** Complete for the bounded research questions; implementation is not authorized by the cited feature scope.
- **Date:** 2026-10-03
- **Researcher:** Inline deep-research executor, `cli-codex` / `gpt-6-luna`
- **Iterations:** 3; convergence threshold 0.05; stop policy `max-iterations`
- **Evidence basis:** Scorer and router source, feature and measurement specs, the 047 report, fixture rows, call log, and three iteration records.

## 2. Investigation Report

### Request summary

Assess the Jev clarify-default result for feature 020 and answer five questions: what drove the result; how accuracy or cost could improve; how to make the measurement trustworthy; where similar judgments exist in `.skilled`; and what a default-on integration would require, cost, and risk.

### Current behavior

The scorer has separate census and score paths. Census can replay an engine and inspect clarify alternatives. The score command accepts a supplied labeled row file and scores its labels; the recorded 047 score invocation did not itself prove each row was a compiled-router mode clarification. The runtime wrapper returns the selected hub, action, targets, policy hash, and generation, but does not expose clarify alternatives to the front door. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:106-155,445-485,1156-1205`; `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:96-108`; `.skilled/bin/compiled-route.cjs:26-51`]

### Findings

1. The frozen keep arithmetic matches the reported values, conditional on the scored rows and labels.
2. Most of Jev’s measured advantage is recognition of `none_of_these`, not naming a mode.
3. The 54-row fixture is not shown to be the replay-verified committed-prompt population proposed by feature 020.
4. Current spec and router descriptions conflict in scope: the statement that sk-code has no clarify branch is too broad, and the 047 report’s source description does not match the scored rows’ source field.
5. The adjacent evaluation results identify one promising but underpowered routing surface, one contaminated destination-choice benchmark, and one negative result.
6. A future integration can safely offer a suggestion only if the existing clarify action and user decision remain authoritative.

## 3. Executive Overview

The reported `keep` is internally consistent with the scorer’s paired rule: Jev is correct on 28 of 54 labels versus 15 for first-alternative baseline, with 17 Jev-only wins, 4 baseline-only wins, and reported one-sided `p=0.003599`. However, the fixture has 34 `none_of_these` labels. Recomputing the recorded three-choice votes by class gives Jev 12/34 on those labels and the baseline 0/34; on 20 named-mode labels the comparison is 16/20 versus 15/20. The result therefore supports a useful abstention signal on this fixture, but only a one-row net lift in naming a mode. [SOURCE: `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/047-measure-every-jev-feature/scratch/evidence/results.md:10`; `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl:1-163`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/report.json:2-18`]

The main blocker is measurement validity, not a missing optimization. Feature 020 describes a committed-prompt census with only two mode clarifications among 359 prompts and no gold mode among alternatives, below its 30-label gate. The 047 run instead scored 54 authored prompts, all carrying `source: fixture-047`, without the score path replay-verifying the compiled router. Until eligible rows, label provenance, and a held-out evaluation are established, neither the keep nor its p-value estimates production mode-selection accuracy. [SOURCE: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:74,88-104`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`; `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1156-1205`]

### Five research questions answered

| Question | Finding |
|---|---|
| What drove the result? | The full-sample keep was driven mainly by Jev choosing `none_of_these` where the baseline always picked the first mode. Named-mode performance was 16/20 versus 15/20. |
| How can accuracy rise or cost fall? | Restrict evaluation and any future call to verified, eligible clarifications; separate mode choice from abstention; measure by hub on held-out rows. Compare one randomized call with the current three-rotation reference before adopting it. |
| How can measurement become trustworthy? | Bind each row to a pinned compiled-router replay and exact alternatives; record source and label adjudication provenance; keep a blind held-out set and publish class- and hub-level metrics. |
| Where else in `.skilled` could this judgment help? | 021 leaf-route replay is the closest candidate but tie-scarce; 022 alignment is a related destination choice whose current fixture has wrong targets; 031 debug-next-check has a negative Jev comparison. |
| What would default-on require, cost, and risk? | A scope amendment, versioned suggestion contract, supported-hub eligibility gate, user confirmation, quality holdout, latency and spend limits, fail-open behavior, privacy controls, compatibility checks, and aggregate telemetry. Production volume, billed usage, tariffs, and end-to-end latency remain unknown. |

## 4. Result and Sample Analysis

The 047 table reports `K=54, M=54, A=28, B=15, W=17, L=4, F=10, p=0.003599`. Under the scorer’s frozen keep rule, coverage passes (`M=K`), the accuracy margin passes (`10*(A-B)=130 >= 54`), the paired sign result is the reported p-value, and the call-cost bound passes (`10*F=100 <= 3*M=162`). This confirms the arithmetic under that rule; it does not validate the sample frame. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:621-672`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`]

The 54 labels comprise 34 `none_of_these` and 20 named modes. On the recorded calls, Jev’s modal result matched 12/34 abstention labels, while the first-alternative baseline matched none. For named modes, Jev matched 16/20 and the baseline 15/20. Twelve of Jev’s 17 wins are abstention wins; all four losses are named-mode rows. These class counts explain the headline and show why an aggregate keep must not be presented as mode-selection lift. [SOURCE: `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl:1-163`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/report.json:5-18`]

The row set is uneven across five hubs: cli-external-orchestration 11, mcp-tooling 12, sk-code 7, sk-design 11, and sk-doc 13. These fixture proportions are not established as live clarify traffic. At least the 12 mcp-tooling and 7 sk-code rows are not demonstrated ordinary-tie clarifications: current mcp-tooling routes near ties as bundles, and sk-code’s clarify helper is gated by a `clarify` constraint while ordinary near ties route bundles. The score-only path does not replay these inputs, so the other 35 rows also remain unverified for eligibility. [SOURCE: `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`; `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs:107-116,130-157`; `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:165-180,221-263`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1156-1205`]

## 5. Scorer and Runtime Architecture

`runCensus` replays an engine using `evaluate(snapshot, { prompt })`, reads clarify alternatives, and can select mode alternatives. `runScoreCommand` reads supplied rows, checks label membership, and scores them; it does not require a replay proof. The scorer’s `modalPick` requires at least two of three rotations to agree, and the scorer compares that modal answer with the first-alternative baseline. Its fixed constants include three orders, a 90-second per-call timeout, and a two-second backoff. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:44-54,106-155,445-485,597-612,642-672,1006-1053,1156-1205`]

The compiled runtime wrapper currently returns hub identity, action, selection kind, targets, policy hash, and generation; it drops clarify alternatives. The front door serializes the result and has a legacy sentinel fallback on resolver error. A served suggestion therefore needs a deliberate owner-approved interface change and compatibility handling; a score result alone cannot be served. [SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:96-108`; `.skilled/bin/compiled-route.cjs:26-51`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:97-104,150-166`]

## 6. Accuracy Improvement

- Evaluate only rows whose pinned router replay returns `action: clarify` with at least two valid mode alternatives. Exclude bundles and checklist alternatives from a mode-default benchmark.
- Keep `none_of_these` as a valuable abstention class, but publish it separately. For eligible named-mode rows, report exact mode accuracy and lift over the first-alternative baseline. For abstention, report precision, recall, and false-default rate. Also report coverage, confusion counts, and results by hub.
- Preserve the three-order measurement as an order-bias reference. Freeze a held-out set and stratify or predefine hub weighting before seeing results; the current small uneven fixture cannot support a pooled production estimate.
- Audit every loss and every false default. A wrong suggested mode can anchor a user even when the final action remains a clarification.
- Treat any confidence field as uncalibrated until checked on held-out labels. The current keep threshold is a decision rule, not evidence of calibrated confidence. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:597-672,1006-1053`; `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:88-104`]

## 7. Cost Envelope and Reduction

The recorded run has 163 measured call records: one auth check and 162 choice calls, or three choices for each of 54 prompts. It reports 19,446 estimated input tokens. Across the 162 choice calls, measured latency is 327.5 ms median, 380 ms nearest-rank p95, 448 ms maximum, and 53,734 ms summed. These are benchmark-call measurements, not compiled-route end-to-end latency; estimated input tokens are not billed usage. The call log has no billed-token or dollar fields, and feature 020 says live clarify volume was not measured, so per-request and monthly dollar cost are unknown. [SOURCE: `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt:9-12`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl:1-163`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:47-54,1006-1053`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:72,89,198-200,212`]

A single choice would reduce choice calls from three to one per eligible event, a calculated 67% reduction, but would also remove the current option-order stability check. It is only a candidate optimization: compare randomized single-call output against the three-rotation reference on a frozen, replay-verified holdout before changing the benchmark or production behavior. For deployment planning, use `eligible clarifications/month × calls/clarification × measured input/output usage × actual provider tariff`, plus fixed service overhead. Do not substitute the 90-second benchmark timeout for a user-facing latency budget. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:47-54,1006-1053`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:97-104,198-204`]

## 8. Trustworthy Measurement

Feature 020 describes a census of committed prompts and says it found only two mode-clarify rows among 359 prompts, with no gold mode among alternatives, so committed sources alone cannot reach the 30-label gate. The 047 results table describes 54 authored tie prompts across five hubs, while the scored JSONL rows identify every row as `source: fixture-047` and `gold: null`. This fixture may test feasibility, but it is a different population from the committed-corpus plan and has not been demonstrated to represent production traffic. [SOURCE: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:74,88-94`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`; `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`]

Make the data contract auditable: require source and row identity; pinned router build, policy hash, and generation; exact evaluated inputs and constraints; replay action; exact alternatives; and an immutable replay result. Refuse score rows that cannot be reproduced under that pinned build. Capture both blind label drafts, the adjudicated label, operator approver, decision reference, and any reason. The label card requires operator-confirmed values but its described row shape lacks a labeler field; the run report describes a delegated arbiter, while scorer stdout’s `operator=54` counts rows sourced from the `label` field, not the human who approved them. Thus approval is unknown from current evidence; it is not established that approval did not occur. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:445-485,1175-1178`; `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-020.md:71-84`; `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md:82-91`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt:1-4`]

### Material contradictions and bounded claims

| Conflict | Evidence | How it limits conclusions |
|---|---|---|
| Feature 020 says mcp-tooling never clarifies and sk-code has no clarify branch; current routers show mcp near ties becoming bundles and sk-code having a controlled clarify helper. | `020-routing-clarify-default/spec.md:70`; `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs:107-116,130-157`; `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:165-180,221-263` | Treat the feature statement as describing ordinary ties only for mcp-tooling; do not repeat the absolute sk-code claim. The 19 rows from these hubs are not proven eligible ordinary clarifications. |
| The 047 report describes committed canary/playbook/routing-corpus prompts; scored rows say `fixture-047`. | `047-measure-every-jev-feature/scratch/evidence/results.md:10`; `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54` | The keep result is fixture-conditional and cannot estimate committed-corpus or live performance. |
| Feature 020 planned source data cannot reach its 30-label gate; 047 provides 54 authored tied rows instead. | `020-routing-clarify-default/spec.md:74,88-94`; `047-measure-every-jev-feature/scratch/evidence/results.md:10` | A synthetic fixture is useful for feasibility but does not satisfy the planned census population. |
| The label policy requires operator confirmation, but artifacts do not identify the approver; `operator=54` is a scorer source-field count. | `042-label-drafting-and-confirmation/scratch/evidence/card-020.md:71-84`; `score-clarify-default.cjs:1175-1178`; `047-020-jev.stdout.txt:1-4` | Label validity/provenance is unverified, not disproved; accuracy conclusions remain conditional on label approval. |
| The YAML closeout describes a legacy `synthesis_complete` event, while the registered ledger schema has a typed `deep_research.synthesis_complete` stem and legacy upcast is restricted. | `.skilled/commands/deep/assets/deep-research-auto.yaml:2045-2067`; `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:399-405`; `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:49-60,283-297`; `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:420-429` | This lineage records the registered typed terminal event with `stopReason=maxIterationsReached`; it does not run the closeout path that stages files under `/tmp` or risks emitting the incompatible legacy form. |

## 9. Adjacent Judgment Surfaces

1. **021 leaf-route replay:** Closest routing analogue because it selects among candidate leaf intents and uses three option rotations. It is the strongest next place to reuse replay and provenance discipline, but the 047 run had only 2 tied rows among 58 and made no Jev calls. Expand only after eligible examples exist. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs:32-46`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:11`]
2. **022 alignment suggestion:** Similar choice among spec-folder destinations and potentially costly when wrong. Its 047 fixture reportedly had the target wrong on every row; Jev’s 39/40 beat the top-alternative baseline 30/40 but is not evidence of choosing the correct destination. Repair target labels and replay provenance first. [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:5-7,58-67,1115-1140`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:12`]
3. **031 debug-next-check:** Chooses a next diagnostic check, where a wrong or expensive action can waste investigation time. Jev scored 27/36 against deterministic `read_code` at 29/36, with W=6 and L=8; preserve this as a negative comparison and do not enable from current evidence. [SOURCE: `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs:5-8,68-84`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:19`]

## 10. Default-On Integration Contract

Default-on should mean a suggestion is routinely available at a supported clarification, not that Jev silently chooses or routes. Feature 020 says the current keep serves nothing and leaves a live judgment/output change out of scope. It also calls for a router-owner seam before serving. [SOURCE: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:97-104,150-166,212-214`]

A minimal additive contract would:

- Run only when compiled routing returns `action: clarify`, with at least two valid alternatives that are modes for an explicitly supported hub. Exclude mcp bundles and checklist choices.
- Preserve `action: clarify` and the existing withheld authority. Return exact alternatives plus optional `suggestedMode`; accept it only if it is one of those alternatives and bound to the same `hubId`, policy hash, and generation. User confirmation remains required.
- Leave the original clarification intact for `none_of_these`, malformed or uncalibrated output, timeout, provider error, absent credentials, or policy/generation mismatch.
- Version the additive output contract and check all stdout/JSON consumers. Keep the provider dependency behind a short request deadline, per-event and aggregate budgets, and an owner-controlled enable/disable setting.
- Start in shadow mode. Measure eligible volume, mode-selection accuracy, abstention/false-default rates, user acceptance and override, errors, latency, and actual usage; move to suggestion-on only after pre-agreed held-out and shadow criteria pass.
- Require explicit payload acceptance, redaction/minimization, and no raw prompt logging by default. The feature spec flags transcript payload/privacy and real clarify volume as unresolved. [SOURCE: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:198-204,212`; `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:96-108`; `.skilled/bin/compiled-route.cjs:26-51`]

## 11. Recommendations

1. **Do not enable the default from this keep result.** The row set and labels are not sufficiently tied to genuine compiled clarifications, and named-mode lift is only one row on the current fixture.
2. **Repair measurement before spending on integration.** Generate rows from a pinned replay; resolve the source/population and label-provenance discrepancies; hold out rows before tuning; report abstention separately from named-mode choice and stratify by hub.
3. **Retain the three-rotation reference until a cheaper strategy earns equivalence.** Test one randomized call on the frozen holdout; report quality change, latency, and usage from provider records.
4. **If evidence later supports serving, implement suggestion-only as a separate scoped phase.** Preserve the clarification, check alternatives and version bindings, require user confirmation, and instrument shadow results before making suggestions visible by default.
5. **Revisit adjacent surfaces in evidence order.** First collect enough verified 021 ties; correct 022 target truth before another score; keep 031 disabled unless a new benchmark beats its deterministic baseline.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat the aggregate `keep` as proof that default mode selection improves live routing. | 12 of 17 wins are `none_of_these`; named-mode performance is 16/20 vs 15/20, on an unverified constructed fixture. | `report.json:5-18`; `020-rows.jsonl:1-54`; `calls.jsonl:1-163`; iteration 1 | 1, 2, 3 |
| Score all supplied labels as genuine compiled clarifications without replay proof. | Score-only path checks labels against supplied alternatives but does not replay the engine; at least 19 rows are not shown to be ordinary clarifications and all 54 remain unverified by that path. | `score-clarify-default.cjs:106-155,445-485,1156-1205`; mcp/sk-code router sources cited in §4 | 1, 2 |
| Use the 047 keep as representative evidence for the committed-prompt or live population. | The reported fixture rows are `fixture-047`, whereas feature 020 planned a committed census that did not have enough labeled alternatives to meet its gate. | `020-routing-clarify-default/spec.md:74,88-94`; `047 ... results.md:10`; `020-rows.jsonl:1-54` | 1, 2 |
| Replace three rotations with one call immediately to reduce cost. | The one-call strategy removes the current order-stability check and has not been compared against the 3-rotation reference on held-out eligible rows. | `score-clarify-default.cjs:47-54,1006-1053` | 2, 3 |
| Serve a selected mode automatically after `keep`. | The feature scope says keep serves nothing; `none_of_these` cannot be a selected mode, and runtime output currently lacks the alternatives needed to validate a suggestion. | `020-routing-clarify-default/spec.md:97-104,150-166`; `compiled-route.cjs:96-108`; `report.json:5-18` | 1, 3 |
| Enable 022 or 031 on current comparisons. | 022's target is wrong throughout its current fixture; 031 loses to its deterministic baseline. | `047 ... results.md:12,19` | 3 |

## Divergence Map

The reducer registry at synthesis contains three open questions and no populated key findings or ruled-out directions (`findings-registry.json:1`). No research pivot, failed pivot, audited override, or Council artifact is recorded. The completed investigation widened its angle in order: result arithmetic and replay eligibility (iteration 1), measurement trust and cost (iteration 2), then adjacent surfaces and integration design (iteration 3). This was planned breadth, not a convergence claim. The remaining frontier is a replay-verified held-out corpus, auditable adjudication provenance, live qualifying volume and provider billing, and an owner-approved output contract. The synthesis answers are consolidated from the three iteration records despite the registry’s empty findings projection.

## 12. Open Questions

- Can a replay-verified held-out set provide enough genuine mode clarifications across supported hubs to measure mode-selection lift?
- Were all 54 labels operator-confirmed under the label policy, and can the decision receipt be recovered per row?
- What are eligible clarification volume, billed input/output usage, provider tariff, and end-to-end latency under consented sampling?
- Which compiled-router owner will approve and maintain the additive suggestion contract and runtime dependency?
- Which single-call strategy, if any, preserves performance and abstention safety against the three-rotation reference?

## 13. Validation Plan

1. Re-run a census against a pinned compiled build and retain a replay proof for every eligible row: hub, policy hash, generation, exact inputs/constraints, `action`, and alternatives.
2. Freeze a holdout before tuning. Have blind label drafts adjudicated under the operator-confirmation policy and retain approver and decision references.
3. Compare the three-rotation reference with first-alternative baseline and candidate one-call behavior. Report per-hub, named-mode, abstention, false-default, coverage, disagreement, and confidence intervals; do not pool away unsupported hubs.
4. Only after offline criteria pass, run a shadow integration without changing route authority. Record aggregate eligibility, suggestion acceptance/override, error, latency, and provider usage while omitting raw prompt text.
5. Require schema-consumer compatibility checks and failure-path verification before a suggestion is visible. Preserve the original clarification on every failure path.

## 14. Risks and Evidence Limits

- **Selection and anchoring:** a plausible but wrong suggested mode can bias a user. The available score does not establish sufficiently reliable named-mode lift.
- **Population mismatch:** authored tie prompts are not a measured sample of real routing traffic. This limits all production generalization.
- **Label uncertainty:** current artifacts do not establish the approver identity; this limits claims conditional on label correctness.
- **Privacy:** prompts may include transcript content. Provider payload acceptance, redaction, and retention behavior must be explicitly resolved before live calls. [SOURCE: `020-routing-clarify-default/spec.md:198-204`]
- **Availability and latency:** provider errors, missing credentials, or slow responses could delay a front door; use a short deadline and fail-open to the existing clarification.
- **Staleness and compatibility:** suggestions must be bound to current hub/policy/generation and additive output changes checked against consumers.
- **Cost uncertainty:** recorded estimated input tokens and call timings are not billing or production volume. Any monthly estimate based on them alone would be unsupported.

## 15. Glossary

- **Mode clarification:** A compiled router action asking between two or more mode-route alternatives.
- **`none_of_these`:** Label that neither listed option is appropriate; useful as abstention, not a mode to serve.
- **First-alternative baseline:** Deterministic comparator that selects the first option as listed.
- **Replay proof:** Recorded evaluation of a pinned compiled-router build showing the exact action and alternatives for a row.
- **False default:** A suggested mode that does not match the adjudicated label on an eligible named-mode example.
- **Shadow mode:** Compute and record a suggestion while leaving the user-visible route behavior unchanged.

## 16. Acknowledgements and Method

This synthesis consolidates the three inline iteration records. It independently joins the 54 labels with 162 choice-call records for class-level result decomposition. No production Jev call, label edit, code change, or packet-spec writeback was made. Claims about live volume, billed dollars, label approval identity, and generalization are explicitly left unknown where source artifacts do not answer them.

## 17. References

- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-020.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/report.json`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- `.skilled/bin/compiled-route.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`
- `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`
- Three lineage iteration records and `deep-research-strategy.md` under this lineage.

## Convergence Report

- **Stop reason:** `maxIterationsReached`
- **Total iterations:** 3
- **Questions answered:** 5 / 5 scoped research questions
- **Remaining questions:** 5 operational/evidence questions listed in Section 12
- **Last 3 iteration summaries:** iteration 1: result arithmetic and measurement target (0.92); iteration 2: measurement trust, accuracy, and cost (0.78); iteration 3: adjacent judgments and default-on contract (0.71)
- **Convergence threshold:** 0.05
- **Divergence summary:** No registry pivots or overrides recorded. The three planned angles broadened from score interpretation to evidence quality/cost and adjacent integration. The remaining frontier is production-representative replay data, label provenance, live volume/pricing, and an approved contract.

The stop reason is the configured iteration cap. All three novelty ratios remained above the convergence threshold; they are telemetry and do not override the max-iteration policy.
