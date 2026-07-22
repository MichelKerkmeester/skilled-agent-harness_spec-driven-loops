# styles/tests/engine

## 1. OVERVIEW

Tests for the flat-file retrieval engine (`../../lib/engine/`) — the default `legacy` read path.

## Key files

- `index.mjs` — the aggregator that runs the full engine suite.
- Coverage: `eligibility-first` ranking, `fallback`/degradation, `hydrate-guard`, `invalidation`,
  `proof` (corpus-use proof), `check-stable`, plus `fixtures.mjs` shared setup.

## Architecture fit

Guards the behavior every design-mode corpus consumer depends on through the facade. Kept green at each
restructure/migration state so the flat path stays authoritative regardless of the database adapter mode.
