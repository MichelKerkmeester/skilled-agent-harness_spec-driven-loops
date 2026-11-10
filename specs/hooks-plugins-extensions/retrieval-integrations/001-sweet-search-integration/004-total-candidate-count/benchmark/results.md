# Phase 4 benchmark: total candidates in the trigger lookup

| Metric | Before | After | Target | Met |
|--------|--------|-------|--------|-----|
| Truncated answers that state a total | 0/6 | 6/6 | 6/6 | yes |
| Untruncated human output changed | n/a | 0/6 changed (compare humanSha256 per row) | 0/6 | yes |
| Median lookup time over the 12 queries (median of row medianMs) | 83.45 ms | 78.22 ms (-6.26%) | within 10% | yes |
| Cold-lookup p95 over prompt-set.json | 109.373 ms | 129.568 ms | at or under 200 ms | yes |
| Index sha256 | d024126c0b36 | d024126c0b36 | equal | yes |

## Per query

| Limit | Query | Before candidatesLine | After candidatesLine | Before medianMs | After medianMs |
|-------|-------|-----------------------|----------------------|-----------------|----------------|
| 2 | trigger index | `candidates : 2 (truncated) from 1035 phrase(s)` | `candidates : 2 of 801 (truncated) from 1035 phrase(s)` | 77.674 | 84.826 |
| 2 | communication quality | `candidates : 2 (truncated) from 650 phrase(s)` | `candidates : 2 of 474 (truncated) from 650 phrase(s)` | 73.685 | 84.397 |
| 2 | spec folder | `candidates : 2 (truncated) from 1902 phrase(s)` | `candidates : 2 of 1614 (truncated) from 1902 phrase(s)` | 101.343 | 82.23 |
| 2 | deep research strategy | `candidates : 2 (truncated) from 3136 phrase(s)` | `candidates : 2 of 2242 (truncated) from 3136 phrase(s)` | 101.117 | 91.044 |
| 2 | skill advisor hook | `candidates : 2 (truncated) from 3127 phrase(s)` | `candidates : 2 of 2043 (truncated) from 3127 phrase(s)` | 100.88 | 116.58 |
| 2 | memory context | `candidates : 2 (truncated) from 1436 phrase(s)` | `candidates : 2 of 1181 (truncated) from 1436 phrase(s)` | 101.258 | 105.137 |
| 20 | codesight | `candidates : 6 from 23 phrase(s)` | `candidates : 6 from 23 phrase(s)` | 83.926 | 74.162 |
| 20 | tombstones | `candidates : 12 from 10 phrase(s)` | `candidates : 12 from 10 phrase(s)` | 75.23 | 73.263 |
| 20 | aggregation | `candidates : 11 from 13 phrase(s)` | `candidates : 11 from 13 phrase(s)` | 82.969 | 74.212 |
| 20 | cosine | `candidates : 11 from 13 phrase(s)` | `candidates : 11 from 13 phrase(s)` | 90.732 | 69.252 |
| 20 | graphify | `candidates : 6 from 20 phrase(s)` | `candidates : 6 from 20 phrase(s)` | 79.065 | 73.755 |
| 20 | contextador | `candidates : 7 from 10 phrase(s)` | `candidates : 7 from 10 phrase(s)` | 76.428 | 70.626 |

Measured 2026-11-09T18:07:55.513Z in worktree 335; runner benchmark/run.mjs.

Note on the p95 row: the code change adds one assignment of an array length that was already computed, so the 109 to 130 ms tail move is run-to-run noise, not a cost of counting. The repository's own `measure-cold-lookup.mjs` on the changed code reported p95 112.871 ms (exit 0, within the 200 ms budget).
