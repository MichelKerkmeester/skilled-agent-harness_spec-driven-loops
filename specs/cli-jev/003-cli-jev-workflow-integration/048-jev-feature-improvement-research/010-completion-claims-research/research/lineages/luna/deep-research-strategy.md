# Deep Research Strategy - Session Tracking

## Research Topic
Improve, refine and expand the Jev completion-claim audit (cli-jev feature 026), accounting for the reported 110-turn result, detector misses, measurement trust, reuse opportunities, and default-on integration requirements.

## Known Context
- The supplied result is recorded in the 010 phase spec; the real rows, labels, report and call log are not present in the checked-in packet, so its per-row cause cannot be recomputed here.
- Feature 026 defines a 400-character lexical detector and a fixed 10-point keep margin; its tests use synthetic fixtures.
- resource-map.md not present; skipping coverage gate. Resource-map emission is disabled for this lineage because the normal reducer resolves output from the packet path outside the authorized lineage write surface.
- User scope is research only; no scorer or live workflow changes and no remeasurement.

## Key Questions
- [x] What drove the reported verdict and what can the available evidence establish? (answered with row-level attribution limits; iteration 1)
- [x] How can claim accuracy improve while keeping measurement and serving costs bounded? (iteration 2; new call schedule requires preregistration)
- [x] What would make the labels, corpus and verdict more trustworthy? (iteration 2; live labels remain unaudited)
- [x] Where else in .skilled would evidence-backed completion judgment help? (iteration 3)
- [x] What would default-on integration require, cost and risk? (iteration 3; model deployment remains deferred)

## Non-Goals
- Change production code, fixtures, tests, or feature behavior.
- Re-run the 110-turn benchmark or inspect unavailable raw session text.
- Set a production model, price, or deployment decision.

## Stop Conditions
- Complete exactly three iterations and synthesize with stopReason maxIterationsReached.
- Treat early convergence only as telemetry; continue with a distinct review angle.

## Answered Questions
- Aggregate arithmetic: +8.18 points with p_win=0.02452, but the 10-point margin fails; exact miss causes remain unknown.
- Accuracy/cost: build a recall-first candidate layer from adjudicated misses; do not gate on the current regex; test any reduced-rerun schedule under a new preregistration.
- Trust: enforce unique IDs, semantic label review, dual annotation/adjudication, hashes, runtime strata and session-cluster checks. The fixture conflict is synthetic-only.
- Reuse: apply evidence checks at explicit closure gates (check-completion.sh, acceptance-criteria closure, manual-testing validation); preserve the shared advisory core.
- Default-on: existing regex hook is on and advisory-only; Jev is not approved after stop (margin). Future serving needs keep, named reader, consent, minimal payload, non-blocking fail-open work, kill switch and latency/cost/utility measures.
- Runtime privacy caveat: completion README says Pi sends model-visible advice, but injection-contract.md says none; the Pi adapter calls sendMessage with deliverAs nextTurn. Do not claim uniform no-injection until this is resolved.

## What Worked
- Source comparison across the feature specification, scorer, sentinel and synthetic fixtures.

## What Failed
- The run-local report, rows, labels, and calls log are unavailable here, preventing direct reproduction of the reported 110-row result.
- The completion README and injection contract disagree on Pi model-context visibility; the adapter shows next-turn delivery.
- The normal reducer resolves from the packet folder; it cannot be run without writing outside the authorized lineage path.

## Exhausted Approaches
- Inferring live-row miss causes, duplicate rate, per-runtime accuracy or production cost from aggregate and synthetic evidence; the required artifacts are unavailable.

## Ruled-Out Directions
- Use the current regex as the sole model-call gate: it cannot recover the ten reported silent positives (iteration 2).
- Infer live annotation quality from the synthetic fixture: two generic-event labels conflict with the frozen question (iteration 2).
- Default-on Jev judgment now: stop (margin) and no named reader (iteration 3).

## Next Focus
- Synthesis: consolidate the five answers and stop exactly at maxIterationsReached; preserve the unresolved need for the external live rows and report.
