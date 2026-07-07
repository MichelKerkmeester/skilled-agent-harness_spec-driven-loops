# iter-006 — PERFORMANCE

**Dimension**: Performance — Advisor query latency, scoring overhead, file-watcher debounce sanity, DB cold-start
**Date**: 2026-05-15
**Files Reviewed**: fusion.ts, watcher.ts, watcher-orchestrator.ts, state-mutation.ts, lease.ts, df-idf.ts

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| P-001 | P2 | 5-lane fusion iterates ALL skills per lane with nested filter/map chains — O(skills × lanes) | `fusion.ts:88-97` (laneRawScore, laneEvidence) | performance/scoring |
| P-002 | P2 | DF-IDF update on startup scan rebuilds corpus from scratch — cold DB has no cached state | `df-idf.ts:89` (debounce 250ms) | performance/cold-start |
| P-003 | P2 | Watcher backpressure defaults are well-tuned but not configurable per-environment | `watcher.ts:102-107` | performance/tuning |

## Analysis

### Scoring overhead: ACCEPTABLE

The 5-lane fusion scorer runs lexically first (cheap), then graph-causal (in-memory lookup), explicit (regex), derived (projection lookup), and semantic-shadow (potentially expensive embedding comparison). The semantic-shadow lane gates on environment (`process.env.VITEST === 'true'` for test mode, or embedding provider availability). The `confidenceFor` function uses pre-calibrated constants from `SCORING_CALIBRATION` — no runtime math beyond simple arithmetic.

### Watcher debounce: WELL-TUNED

- **Debounce**: 2,000ms — reasonable for file system event coalescing
- **Stable write**: 1,000ms — prevents re-indexing during active writes
- **Storm circuit breaker**: 20 events in 10s window → 10s cooldown
- **Busy retry**: [250, 500, 1,000]ms exponential-ish backoff
- **Serialization**: Only one flush drain runs at a time (`flushPromise` mutex)

These defaults are solid. The watcher also has `ignoreInitial: true` on chokidar, `atomic: true` for rename handling, and `followSymlinks: false`.

### DB cold-start: ADEQUATE

On cold start, `startupSkillGraphScan` in `advisor-server.ts` indexes all skills (full scan). The DF-IDF corpus is rebuilt from scratch on first use. For the current skill count (~20 skills), this is near-instantaneous. The `skill-graph-db.ts` init creates tables via `db.exec()` with static SQL — no migration complexity.

### Query latency: NO CONCERN

The `advisor_recommend` handler is synchronous (score → sort → filter). No external API calls in the hot path. The Python bridge adds subprocess overhead (~2.5s timeout), but this is a compat path, not the primary path.

## Verdict: PASS with 3 P2 advisories
