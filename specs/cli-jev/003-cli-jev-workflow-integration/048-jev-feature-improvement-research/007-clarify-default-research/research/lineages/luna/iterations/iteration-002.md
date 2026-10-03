# Iteration 2: Measurement Trust, Accuracy, and Cost

## Focus

Audit the scorer's sample and labels against feature 020's stated measurement plan, then separate observed measurement cost from unmeasured production cost.

## Actions Taken

- Compared the planned committed-prompt census and label process with the 047 run description and actual scored rows.
- Read the scorer's row validation, three-order voting, keep gate, and timeout constants.
- Recomputed call counts and latency distribution from the 163-line call log; separated those measurements from any live traffic or dollar estimate.

## Findings

1. **The 54-row result is an exploratory tie fixture, not the committed-corpus sample feature 020 specified.** The spec reports just 2 mode-clarify rows across 359 committed prompts, with no gold in alternatives, and says committed sources alone cannot reach the 30-label gate. Its scope calls for replaying committed canaries, playbooks, and 241 routing-corpus prompts. The 047 result instead describes 54 prompts authored by Luna 6 to produce ties across five hubs; the hidden rows are all `source: "fixture-047"`, have `gold: null`, and are labeled. This is not evidence that the fixture is useless, but it changes the target population and should be reported as a synthetic feasibility result until replay-verified traffic is measured. [SOURCE: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:74,88-94`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`; `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`]

2. **Current input validation checks label membership, not the evidence chain for a row or label.** `readRows` parses JSONL; `labelRows` accepts a `label` or `gold` if it is among the alternatives or `none_of_these`. It does not require a router build fingerprint, replay result, labeler, second draft, operator approval receipt, or reason. The label card says its schema has no labeler field and only operator-confirmed values may enter `label`; the result table says “delegated arbiter.” The stdout's `operator=54` is only the count of rows whose value came from `label`, as the scorer code confirms. This leaves confirmation provenance UNKNOWN; it does not prove the labels were not approved. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:445-485,1175-1178`; `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-020.md:71-84`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt:1-4`]

3. **A stronger accuracy measure must separate choosing a mode from abstaining.** Keep `none_of_these` as a safe abstention outcome, but report it separately from mode-selection accuracy and from the first-alternative baseline. On rows eligible to receive a default, score only named mode labels; also publish abstention precision/recall, false-default rate, coverage, and per-hub confusion counts. Preserve the 3-rotation measurement as an order-bias check; the scorer takes the modal result only when at least 2 of 3 agree. The five-hub sample sizes (11, 12, 7, 11, 13) are too small and uneven to support a pooled result as a substitute for hub-level reporting. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:597-612,642-672,1006-1053`; `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl:1-54`; `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:10`]

4. **The measurement becomes auditable if row creation and scoring share a replay proof.** Build the benchmark from the scorer's existing census path, and require each row to carry the selected hub, source identity, compiled generation or policy hash, evaluated prompt inputs/constraints, `action: clarify`, and the exact two-or-more mode alternatives returned. Reject a row if its proof does not match the pinned router build or if it is a checklist clarification. Add label provenance fields for both blind drafts, the adjudicated value, approver, and decision reference; keep an immutable held-out split. This directly addresses the current distinction where census extracts clarify alternatives but score-only loading trusts the supplied file. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:106-155,445-485,1156-1205`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:88-94`; `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md:82-91`]

5. **Observed benchmark cost is 3 choices per row, but live monthly spend cannot be inferred yet.** The stdout records 163 planned calls (162 choices plus one auth check) and 19,446 estimated input tokens. All 163 call rows are marked measured. Choice-call latency is 327.5 ms median, 380 ms nearest-rank p95, 448 ms maximum, and 53,734 ms summed across calls. The scorer serially rotates three option orders, and its per-call timeout is 90 seconds. These are scorer-run measurements, not compiled-route end-to-end latency. The call log has no billed-token or dollar field, the feature spec says real clarify rate was not measured, and the front door persists no events. Exact per-request and monthly dollar cost are therefore UNKNOWN. [SOURCE: `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt:9-12`; `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl:1-163`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:47-54,1006-1053`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:72,89,198-200,212`]

6. **Lowering cost safely requires validating a cheaper inference mode before adopting it.** A production request should run only after the current router returns a genuine mode `clarify` with valid alternatives. The benchmark's 3 rotations guard against option order, so replacing them with one call would reduce benchmark-style calls from 3 to 1 per eligible event (an inferred 67% choice-call reduction) but would abandon that measured stability check. Compare single-call, randomized-order suggestions against the 3-call reference on a held-out eligible set first. For a user-facing route, add a strict latency budget, rate limit, and fail-open behavior that leaves the existing clarification intact on timeout, missing credential, malformed pick, or `none_of_these`. Monthly cost then depends on the unmeasured number of eligible clarifications and actual provider usage rates. [SOURCE: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:47-54,1006-1053`; `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:97-104,198-204`]

## Questions Answered

- **How can accuracy improve?** Evaluate only replay-verified clarifications; preserve abstention but isolate its score; stratify by hub and answer class; freeze a held-out set; record label adjudication provenance; measure false defaults as well as accuracy.
- **How can cost be lowered?** Gate calls on a real, supported mode clarification and test one randomized choice against the current 3-rotation reference. Keep the existing user question when the call is slow or cannot produce a valid mode. Real volume and actual price are unknown.
- **How can measurement become trustworthy?** Bind every scored row to a pinned compiled-router replay and an auditable label decision; resolve the declared-scope versus synthetic-fixture difference before reusing the headline keep result.

## Questions Remaining

- Which `.skilled` decision tasks have enough eligible, representative cases to justify a parallel evaluation?
- Can the router return a typed, validated suggestion while preserving its clarify authority and compatibility?
- What is the real clarify volume, provider tariff, input/output usage, and end-to-end latency under consented production sampling?

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/card-020.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`
- `/Users/michelkerkmeester/.skilled/.labels/020-rows.jsonl`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `/Users/michelkerkmeester/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl`
- Prompt pack: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/085-jev-feature-improvement-research/specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/lineages/luna/prompts/iteration-002.md`

## Assessment

- `newInfoRatio`: 0.78
- Novelty: established the explicit difference between the original committed-corpus plan and the 54-row authored fixture, and measured the exact call/time profile from the recorded run.
- Confidence: high for scorer mechanics and recorded call counts/timings; medium-high for the fixture population because result text and row source agree; low for labeler identity and production cost because no approval receipt, usage billing, or real-use volume is present.
- Convergence telemetry: novelty remains well above the 0.05 threshold. Regardless of any other stop candidate, this lineage continues to iteration 3.

## Reflection

The experiment's 3-order design is a useful defense against option-position effects, and it costs three model choices for every labeled row. Do not remove that control from the measurement simply to lower spend. First determine the live population; then compare cheaper production behavior against the more conservative benchmark. A statistical p-value cannot make the fixture representative or identify who approved its labels.

## Recommended Next Focus

Compare adjacent `.skilled` judgment surfaces and specify a safe default-on contract, staged rollout, per-event cost model, and failure/privacy controls.
