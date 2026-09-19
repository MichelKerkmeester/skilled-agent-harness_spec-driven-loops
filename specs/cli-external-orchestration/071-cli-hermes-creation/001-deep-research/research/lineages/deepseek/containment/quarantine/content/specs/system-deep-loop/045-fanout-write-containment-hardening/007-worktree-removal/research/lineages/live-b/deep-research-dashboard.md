# Deep Research Dashboard

Lineage: `live-b` · Session: `fanout-live-b-1789402289626-dt269k` · Generation 1
Auto-generated from `deep-research-state.jsonl`, `findings-registry.json`, and `deep-research-strategy.md`.

## Iteration Table

| # | Status | Focus | Findings | newInfoRatio | Sources | Duration |
|---|--------|-------|----------|--------------|---------|----------|
| 1 | complete | Exhaustive exported-surface inventory of `write-containment.ts` with per-function purpose and `file:line` citation | 8 | 1.00 | 13 | 51.0 s |

Total iterations: 1 / 1 (cap reached).

## Question Status

| Question | Status | Confidence |
|----------|--------|------------|
| Which symbols does the module export, and how many of them are functions? | answered | 0.95 |
| What is each exported function's purpose, at one line each, with a `file:line` anchor? | answered | 0.90 |
| Is each stated purpose borne out by the implementation body and by a real caller? | answered (one caveat) | 0.90 |

Answered 3 / 3 · Remaining: 0 · Carried-forward verification questions: 2

## Convergence Trend

- newInfoRatio: 1.00 (iteration 1)
- rollingAvg: 1.00 · MAD score: n/a (single iteration) · compositeStop: not evaluated
- Threshold 0.05 not binding: `stopPolicy: max-iterations` reached first, so any early convergence
  signal is telemetry only and does not trigger synthesis.
- Stop reason: **maxIterationsReached** at iteration 1.

## Dead Ends

| Approach | Why it failed | Iteration |
|----------|---------------|-----------|
| Feature-catalog document as inventory/cross-check | Names none of the eight exported functions | 1 |
| Identifier-name inference for purposes | Produced two wrong claims (`classifyViolation` reach, `__internals` kind) | 1 |

## Blocked Stops

None. No quality guard blocked a stop candidate in this run (single iteration, cap-bound).

## Graph Convergence

Not evaluated (coverage-graph gate not engaged for a cap-bound single-iteration run).

## Next Focus

Sibling-verification pass: re-derive the export set mechanically in a second lineage, diff the two
name sets, and spot-check the two one-liners whose support is a doc comment plus unit tests
(`quarantineViolations`, `revertOutOfScopeViolations`) against a live run's quarantine directory.
