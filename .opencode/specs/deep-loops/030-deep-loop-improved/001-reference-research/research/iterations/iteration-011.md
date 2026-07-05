# Iteration 11: S2-03 Observation Threshold Before Acting

## Focus

[S2-03] How kasper uses `min_observations_for_update` so a weakness is only acted on after N confirmations, and where it is enforced, mapped to deep-loop-runtime convergence gating.

## Actions Taken

- Searched the vendored kasper repo for `min_observations_for_update`, observation thresholds, weakness aggregation, and improvement enforcement.
- Read kasper config, type, utility, state, evaluation, and test files around the threshold path.
- Read our convergence entrypoint, graph signal code, and convergence tests to identify the concrete port target.
- Checked prior iteration records for S2-03 duplication; prior iterations only left S2-03 as next focus, with no completed finding.

## Findings

### 1. Kasper makes the confirmation threshold a normal validated config value

Reference mechanism: `KasperConfig` includes `min_observations_for_update`, and `DEFAULT_CONFIG` sets it to `2` in `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:8` and `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:48`. The config loader validates the field as an integer from 1 to 10 in `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:46`.

OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: our convergence script hardcodes signal thresholds in `evaluateResearch`, `evaluateReview`, and `evaluateContext`, but has no configurable "minimum confirmations before acting" guard. A `--min-confirmations` or graph config field with default `2` would prevent one-off graph evidence from allowing STOP or auto-promotion.

Port difficulty: easy. Tag: quick-win.

### 2. Kasper enforces the threshold at the action boundary, after scoring but before queue/apply

Reference mechanism: `considerImprovement()` gathers generated suggestions, filters rejected weaknesses, reads aggregate state, calls `findMatchingWeakness(..., config.min_observations_for_update)`, and returns early when no confirmed match exists in `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1657`, `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1675`, and `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1682`.

OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.

Why it helps: the closest equivalent boundary is where `convergence.cjs` turns graph signals into `STOP_ALLOWED`, `STOP_BLOCKED`, or `CONTINUE` at `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:451`. The kasper pattern says do not mutate the upstream score math first; add a blocking guard just before actionability so unconfirmed findings can still be recorded without authorizing STOP.

Port difficulty: med. Tag: quick-win.

### 3. Kasper's count is aggregate evidence, not current-session confidence

Reference mechanism: `findMatchingWeakness()` ignores any top weakness whose `count` is below `minObservations`, then semantic-matches the current weakness against aggregate top weaknesses in `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/utils.ts:94` and `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/utils.ts:100`. The aggregate count is built from recorded sessions in `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:740`, `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:743`, and emitted as `count`/`evidence_count` in `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:804` and `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:812`.

OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.

Why it helps: our context loop already has an agreement-style count for gated findings in `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:750`, but research/review convergence does not expose a "minimum confirmation count" signal. Add graph-derived confirmation counts for FINDING/CLAIM nodes, then let `convergence.cjs` block action when high-impact findings have fewer than N confirming edges or observations.

Port difficulty: med. Tag: deep-rewrite.

### 4. Kasper tests both the negative and positive paths

Reference mechanism: the unit tests assert no pending improvement when no matching aggregate weakness exists in `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/tests/evaluate.test.ts:376`, and queue an improvement when aggregate `top_weaknesses` contains a matching count of `3` in `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/tests/evaluate.test.ts:397` and `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/tests/evaluate.test.ts:405`. E2E coverage explicitly treats the default `2` observations as the reason a single pass may not auto-apply in `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/tests/e2e/e2e-correctness.test.ts:531` and `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/tests/e2e/e2e-correctness.test.ts:565`.

OUR target file: `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts`.

Why it helps: the existing convergence tests already pin STOP/STOP_BLOCKED behavior for research novelty gates in `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts:145` and `.opencode/skills/deep-loop-runtime/tests/integration/convergence-script.vitest.ts:160`. Add one fixture where a research graph otherwise passes but has only one confirmation, and one where the same candidate reaches two confirmations.

Port difficulty: easy. Tag: quick-win.

## Questions Answered

- `min_observations_for_update` is defined in kasper config/types, defaults to `2`, and is validated as an integer in the 1..10 range.
- Enforcement happens in `considerImprovement()`, not inside scoring: a suggested improvement is ignored unless `findMatchingWeakness()` finds a semantically matching aggregate weakness with `count >= min_observations_for_update`.
- The count comes from cross-session aggregate weakness frequency and is carried into `top_weaknesses` as `count` and `evidence_count`.
- The best OUR mapping is a convergence actionability guard: record weak evidence, but block STOP/promotion until the graph has N confirmations.

## Questions Remaining

- Whether the threshold should be one shared runtime flag or loop-type-specific defaults for research, review, context, and council.
- Whether "confirmation" should count independent sources, independent executor seats, repeated iterations, or explicit graph `CONFIRMS` edges. Kasper counts sessions; our graph has richer provenance.
- Whether a force override belongs in `convergence.cjs` CLI flags, workflow YAML, or both.

## Next Focus

[S2-04] How kasper applies time-decay half-life weighting (`weight = 0.5 ** (ageDays/decayDays)`) so stale observations fade, mapped to `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.
