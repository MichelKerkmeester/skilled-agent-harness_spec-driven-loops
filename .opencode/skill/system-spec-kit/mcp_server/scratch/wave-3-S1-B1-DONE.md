# Wave 3 S1-B1: T002 + T003a Complete

## Files Modified

### 1. `lib/search/graph-search-fn.ts`
- Added `DEGREE_BOOST_CAP = 0.15` constant
- Added `RELATION_WEIGHTS` map for typed degree computation (caused: 1.0, enabled: 0.8, supports: 0.6, derived_from: 0.5, supersedes: 0.4, contradicts: 0.3)
- Added `computeTypedDegree(db, memoryId)` — computes weighted degree from causal_edges
- Added `computeMaxTypedDegree(db, memoryIds)` — finds max across IDs
- Added `normalizeDegreeToBoostedScore(degree, maxDegree)` — normalizes to [0, 0.15]
- Added `computeDegreeScores(db, memoryIds)` — orchestrator with caching, returns Map<number, number>
- Added `clearDegreeCache()` — cache invalidation
- All functions exported

### 2. `lib/search/rrf-fusion.ts`
- Added `DEGREE: 'degree'` to `SOURCE_TYPES` constant (now 6 source types)

### 3. `lib/search/hybrid-search.ts`
- Added import of `computeDegreeScores` from `graph-search-fn.ts`
- Added degree channel in `hybridSearchEnhanced()` behind `SPECKIT_DEGREE_BOOST === 'true'` feature flag
- Degree channel: collects all numeric IDs from existing channels, calls `computeDegreeScores`, builds sorted RankedList, adds to fusion lists with weight 0.4
- When flag is false (default), no degree code runs — behavior identical to 4-channel

### 4. `lib/cognitive/co-activation.ts`
- Added `DEFAULT_COACTIVATION_STRENGTH = 0.25` named constant
- Changed `boostFactor` from hardcoded `0.15` to `parseFloat(process.env.SPECKIT_COACTIVATION_STRENGTH || '0.25')`
- Exported `DEFAULT_COACTIVATION_STRENGTH`

## Tests Added

### `tests/t010b-rrf-degree-channel.vitest.ts` — 26 tests
- T002 tests (18):
  - SOURCE_TYPES.DEGREE exists and equals 'degree'
  - All existing source types preserved
  - 5-channel RRF fusion produces correct results
  - Degree channel contributes to convergence bonus
  - Degree source appears in result.sources
  - 4-channel identical with/without degree
  - No degree source in 4-channel results
  - Degree scores ranked highest-first
  - All scores within [0, DEGREE_BOOST_CAP]
  - DEGREE_BOOST_CAP is 0.15
  - Degree RankedList feeds correctly into fuseResultsMulti
  - computeTypedDegree returns 0 for no edges
  - computeTypedDegree applies relation type weights
  - computeMaxTypedDegree returns max
  - normalizeDegreeToBoostedScore maps correctly
  - clearDegreeCache works
  - Empty input returns empty map
  - Cache hit returns correct values

- T003a tests (8):
  - DEFAULT_COACTIVATION_STRENGTH exported and equals 0.25
  - boostFactor defaults to 0.25
  - boostScore applies configured boostFactor
  - boostScore returns base when relatedCount=0
  - Boost proportional to relatedCount
  - decayPerHop still 0.5
  - boostScore scales with avgSimilarity
  - Higher default (0.25) produces stronger boost than old (0.15)
  - Env var support structural test

## Tests Passing

- **New tests: 26/26 passing**
- **Related existing tests: 102/102 passing** (rrf-fusion, unit-rrf-fusion, hybrid-search, graph-search-fn)
- **Known regression: 4 tests in co-activation.vitest.ts** — These tests hardcode old `0.15` value. Expected consequence of T003a raising default to `0.25`. Not in file ownership scope.

## Decisions Made

1. **Degree weight in RRF: 0.4** — Lower than vector (1.0) and FTS (0.8) but meaningful. Degree is a graph-structural signal, not a direct content match, so it should complement rather than dominate.

2. **Relation type weights** — Implemented a graduated scale from 1.0 (caused) to 0.3 (contradicts/unknown). Stronger causal relationships contribute more to degree score.

3. **Degree caching** — Added a simple Map cache that persists within a search operation. `clearDegreeCache()` is exported for manual invalidation.

4. **Co-activation `as const` preserved** — The `parseFloat()` call is evaluated at module load time, so the `as const` assertion still works (the value is readonly after initialization). The env var is read once at import.
