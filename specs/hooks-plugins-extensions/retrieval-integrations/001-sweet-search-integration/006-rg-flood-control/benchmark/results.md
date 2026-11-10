# Phase 6 benchmark: ripgrep one row per file

| Metric | Before | After | Target | Met |
|--------|--------|-------|--------|-----|
| Distinct files in the shown rows (measured query) | 2 | 14 | 14 | yes |
| Most rows from one file (measured query) | 19 of 20 | 1 | 1 | yes |
| Queries that report hidden files and matches | 0/8 | 8/8 (every query hid something) | 8/8 where anything was hidden | yes |
| Median query time (median of row medianMs, 5 runs per query) | 38.066 ms | 37.52 ms (-1.43%) | within 10% | yes |
| Total matches found, every query | unchanged | identical | identical | yes |
| Index sha256 | d024126c0b36 | d024126c0b36 | equal | yes |

## Per query

"Shown rows" before is the first 20 rows, where the human view stopped; the JSON carried every match. After, the JSON results are the shown rows.

| Phrase | Root | Matches | Files | Before: shown files / most rows from one file | After: shown files / most rows from one file | After: hidden files / matches | Before ms | After ms |
|--------|------|---------|-------|----------------|----------------|----------------|-----------|----------|
| iteration | `…/002-retrieval-lessons-research/research` | 382 | 14 | 2 / 19 | 14 / 1 | 0 / 0 | 41.418 | 41.224 |
| iteration | `…/003-retrieval-feature-design-research/research` | 465 | 14 | 1 / 20 | 14 / 1 | 0 / 0 | 45.503 | 42.259 |
| research | `…/001-sweet-search-research/research` | 422 | 24 | 4 / 8 | 20 / 1 | 4 / 112 | 44.115 | 43.184 |
| sweet search | `…/001-sweet-search-research/research` | 38 | 8 | 5 / 9 | 8 / 1 | 0 / 0 | 37.56 | 36.113 |
| fallback | `…/003-retrieval-feature-design-research/research` | 102 | 12 | 5 / 12 | 12 / 1 | 0 / 0 | 37.069 | 37.314 |
| limit | `…/003-retrieval-feature-design-research/research` | 75 | 12 | 4 / 11 | 12 / 1 | 0 / 0 | 37.25 | 36.138 |
| worktree | `.skilled/skills/sk-git/references` | 492 | 11 | 8 / 8 | 11 / 1 | 0 / 0 | 38.571 | 37.725 |
| convergence | `…/002-retrieval-lessons-research/research` | 16 | 9 | 9 / 5 | 9 / 1 | 0 / 0 | 35.477 | 34.604 |

Measured 2026-11-09T21:47:15.334Z in worktree 335; runner benchmark/run.mjs. Before measured 2026-11-09T20:59:10.732Z on the code before this phase. The before record predates the runner's `gitStatusCount` field; that count is a record only and is never compared.

Notes:

- Every query hid something, because each file now shows once: the per-row `moreInFile` values plus `hidden.matches` add up to exactly the matches not shown, on all 8 queries.
- Only "research" over the phase 1 research folder has more than 20 files (24), so it is the one query whose answer also says `+4 more files with 112 matches`.
- Scenario 491 (conversational, devin) passed 1/1; evidence in `scenario-491/`.
