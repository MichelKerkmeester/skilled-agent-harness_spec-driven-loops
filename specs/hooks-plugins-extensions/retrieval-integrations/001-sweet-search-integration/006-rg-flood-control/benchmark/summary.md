# Benchmark summary: phases 004, 005 and 006

Each phase measured its own fixed query set before and after its change, on the same committed trigger index (sha256 prefix d024126c0b36). The tables below are copied from each phase's `benchmark/results.md`, which also holds the per-query rows.

## Phase 004: total candidates in the trigger lookup

| Metric | Before | After | Target | Met |
|--------|--------|-------|--------|-----|
| Truncated answers that state a total | 0/6 | 6/6 | 6/6 | yes |
| Untruncated human output changed | n/a | 0/6 changed (compare humanSha256 per row) | 0/6 | yes |
| Median lookup time over the 12 queries (median of row medianMs) | 83.45 ms | 78.22 ms (-6.26%) | within 10% | yes |
| Cold-lookup p95 over prompt-set.json | 109.373 ms | 129.568 ms | at or under 200 ms | yes |
| Index sha256 | d024126c0b36 | d024126c0b36 | equal | yes |

## Phase 005: zero-hit fallback to unindexed spec docs

| Metric | Before | After | Target | Met |
|--------|--------|-------|--------|-----|
| Stale phrases found (exit 0, declared only by docs the index does not list) | 0/10 | 10/10 | 10/10 | yes |
| Already-matching queries with identical output (JSON and human digests, no `staleFallback` key) | n/a | 10/10 | 10/10 | yes |
| Undeclared phrases still exit 1 | 5/5 | 5/5 | 5/5 | yes |
| Median time, matching queries (median of row medianMs) | 73.621 ms | 71.571 ms (-2.78%) | within 10% | yes |
| Cold-lookup p95 over prompt-set.json (default index, fallback live) | 121.1 ms | 151.609 ms | at or under 200 ms | yes |
| Index sha256 | d024126c0b36 | d024126c0b36 | equal | yes |

## Phase 006: ripgrep one row per file

| Metric | Before | After | Target | Met |
|--------|--------|-------|--------|-----|
| Distinct files in the shown rows (measured query) | 2 | 14 | 14 | yes |
| Most rows from one file (measured query) | 19 of 20 | 1 | 1 | yes |
| Queries that report hidden files and matches | 0/8 | 8/8 (every query hid something) | 8/8 where anything was hidden | yes |
| Median query time (median of row medianMs, 5 runs per query) | 38.066 ms | 37.52 ms (-1.43%) | within 10% | yes |
| Total matches found, every query | unchanged | identical | identical | yes |
| Index sha256 | d024126c0b36 | d024126c0b36 | equal | yes |

## Reading across the three

- The trigger lookup now says how much it cut (004) and finds packets the index has not caught up with (005). Lookups that already matched are unchanged in output and time.
- A zero-hit lookup now costs about 135-155 ms instead of about 75 ms, because it walks `specs/`. The prompt-set p95 stays under the 200 ms budget at 151.6 ms.
- The ripgrep wrapper shows each file once (006), with the same total matches and no measurable time cost.
