# Deep Research Strategy — Luna lineage

## Research Topic

Improve, refine and expand the Jev routing clarify default for cli-jev feature 020. This run checks the scorer and its evidence against the current compiled-router code before making recommendations.

## Key Questions

- [ ] What explains the measured Jev keep result, including useful mode picks and `none_of_these`?
- [ ] Which changes could improve accuracy or reduce runtime and model cost?
- [ ] What would make the measurement representative, reproducible, and independently auditable?
- [ ] Which other `.skilled` judgment surfaces merit comparable evaluation?
- [ ] What schema, rollout, cost controls, and safeguards would a default-on integration require?

## Known Context

- The 047 report records K=54, M=54, A=28, B=15, W=17, L=4, F=10, p=0.003599; 34 rows are labeled `none_of_these`.
- Feature 020 says the front-door output drops clarify alternatives and frames `mcp-tooling` and `sk-code` as non-clarify ordinary-tie surfaces.
- The score-only path accepts a provided rows file; the separate census path replays compiled engines.
- The lineage is bounded to three iterations, convergence threshold 0.05, default convergence mode, and max-iterations stop policy. A stop candidate before iteration 3 is telemetry only.
- `resource-map.md` is absent; resource-map emission is disabled for this lineage.

## Non-goals

No code changes, label changes, production model calls, packet spec writeback, validation, repository-wide reduction, staging, or continuity save.

## Stop Conditions

Complete all three iterations. Record any convergence telemetry, but synthesize only after iteration 3. Preserve contradictions as qualified findings.

## Answered Questions

None yet.

## What Worked

To be filled from iteration evidence.

## What Failed

To be filled from iteration evidence.

## Exhausted Approaches

None yet.

## Ruled-Out Directions

None yet.

## Next Focus

Iteration 1: reproduce and interpret the arithmetic, then trace exactly what the score command measured.

## Bounded Context Snapshot

- Primary scorer: `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`.
- Measurement inputs: 047 result table, external 020 row set, scorer call log, and label card 020.
- Runtime contract: `.skilled/bin/compiled-route.cjs` plus per-hub compiled engines and runtime wrapper.
- Nearby comparisons: feature 021 leaf-route replay, feature 022 alignment suggestion, feature 031 debug-next-check.
- Constraints: read-only source examination; all lineage artifacts remain under this directory; no live Jev calls.
