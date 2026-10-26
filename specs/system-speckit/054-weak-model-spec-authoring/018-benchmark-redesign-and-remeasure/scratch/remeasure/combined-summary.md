# Speed loop summary

- Results file: `combined-results.tsv`, 64 rows, rounds: 1, 2, 3, 4, 5, 6, 7, 8.
- Seconds are dispatch start to end. Means use valid runs only: exit 0, under the cap, not contaminated. Excluded runs are counted by reason in the first table.
- `strict` is valid runs whose strict validation passed. An untouched scaffold passes strict, so read it next to `hints`. `hints`, `anchors`, `oos`, `side`, `procs`, `refs_054` and `outside` are the worst valid run.
- Tokens come from the Devin session store. UNKNOWN means the store held no figure for at least one valid run.
- Absolute seconds are not comparable with the earlier authoring benchmark: the sandboxes, the cap, the parallel load and the hook builds differ. Compare variants within this file only.

## Runs per variant and step

| Step | Variant | Valid | Timed out | Failed rc | Contaminated | Aborted/skipped/missing | Sec min | Sec max | Sec mean | tok_in | tok_cache_read | tok_out | validate calls | tool calls | strict | hints | anchors | oos | side | procs | refs_054 | outside | applied | wt_new |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | pre054 | 8/8 | 0 | 0 | 0 | 0 | 86 | 163 | 114.2 | 75346.2 | 2068048 | 17396.8 | 2.5 | 44.6 | 8/8 | 0 | NA | 0 | 4 | 0 | 0 | 0 | NA | 6 |
| author | main-no054 | 5/8 | 0 | 0 | 0 | 3 | 79 | 138 | 114.4 | 93137.4 | 2572364.8 | 21091.4 | 2.4 | 45.6 | 5/5 | 0 | NA | 0 | 6 | 0 | 0 | 0 | NA | 6 |
| author | now054 | 8/8 | 0 | 0 | 0 | 0 | 71 | 120 | 95.8 | 65571.8 | 1077280 | 18279 | 2.9 | 30 | 8/8 | 0 | NA | 0 | 4 | 0 | 0 | 0 | NA | 6 |
| author | refined | 8/8 | 0 | 0 | 0 | 0 | 70 | 164 | 102.4 | 68927.9 | 1407136 | 18635.5 | 2.4 | 36.4 | 8/8 | 0 | NA | 0 | 4 | 0 | 0 | 0 | NA | 6 |
| upkeep | pre054 | 8/8 | 0 | 0 | 0 | 0 | 36 | 86 | 52.1 | 27367.4 | 551072 | 7031 | 2.8 | 19.5 | 8/8 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 8/8 | 2 |
| upkeep | main-no054 | 5/8 | 0 | 0 | 0 | 3 | 30 | 62 | 47.8 | 43497.6 | 768563.2 | 7771.6 | 2.4 | 22.2 | 5/5 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 5/5 | 2 |
| upkeep | now054 | 8/8 | 0 | 0 | 0 | 0 | 25 | 65 | 43.1 | 23818 | 486048 | 5467.9 | 3.2 | 16.8 | 8/8 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 8/8 | 2 |
| upkeep | refined | 8/8 | 0 | 0 | 0 | 0 | 22 | 51 | 38.1 | 26859.1 | 395408 | 5776.4 | 1.4 | 14.6 | 8/8 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 8/8 | 2 |

## Upkeep from a clean start

Upkeep seconds also pay for repairing whatever the author step left. These rows keep only valid upkeep runs whose author packet passed strict validation with 0 leftover hints.

| Variant | Clean-start runs | Sec min | Sec max | Sec mean |
|---|---|---|---|---|
| pre054 | 8/8 | 36 | 86 | 52.1 |
| main-no054 | 5/5 | 30 | 62 | 47.8 |
| now054 | 8/8 | 25 | 65 | 43.1 |
| refined | 8/8 | 22 | 51 | 38.1 |

## Paired difference per round

For each round where both runs are valid: variant seconds minus baseline seconds from that same round. Positive means slower than the baseline. The verdict is SLOWER or FASTER only when every pair has that sign and there are at least two pairs; otherwise INCONCLUSIVE. Against pre054 the difference includes main's drift; against main-no054 it is the authoring work alone; refined against now054 is the refinement effect. The tok_out verdict is REAL only with at least 4 valid pairs that all share one sign; otherwise INCONCLUSIVE.

| Step | Variant | Baseline | Meaning | Pairs | Diff min | Diff max | Diff mean | Verdict | Delta of means | tok_out delta | validate calls delta | Variant strict | Baseline strict | Variant worst hints | tok_out pairs | tok_out verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | main-no054 | pre054 | main drift alone | 5 | -84 | 35 | -0.6 | INCONCLUSIVE | 0.2 | 3694.7 | -0.1 | 5/5 | 8/8 | 0 | 5 | INCONCLUSIVE |
| author | now054 | pre054 | includes main drift | 8 | -67 | 29 | -18.5 | INCONCLUSIVE | -18.5 | 882.2 | 0.4 | 8/8 | 8/8 | 0 | 8 | INCONCLUSIVE |
| author | refined | pre054 | includes main drift | 8 | -92 | 73 | -11.9 | INCONCLUSIVE | -11.9 | 1238.8 | -0.1 | 8/8 | 8/8 | 0 | 8 | INCONCLUSIVE |
| author | now054 | main-no054 | authoring work alone | 5 | -58 | 17 | -23 | INCONCLUSIVE | -18.7 | -2812.4 | 0.5 | 8/8 | 5/5 | 0 | 5 | INCONCLUSIVE |
| author | refined | main-no054 | authoring work alone | 5 | -44 | 29 | -14.6 | INCONCLUSIVE | -12.0 | -2455.9 | -0.0 | 8/8 | 5/5 | 0 | 5 | INCONCLUSIVE |
| author | refined | now054 | refinement effect | 8 | -48 | 44 | 6.6 | INCONCLUSIVE | 6.6 | 356.5 | -0.5 | 8/8 | 8/8 | 0 | 8 | INCONCLUSIVE |
| upkeep | main-no054 | pre054 | main drift alone | 5 | -49 | 20 | 0 | INCONCLUSIVE | -4.3 | 740.6 | -0.4 | 5/5 | 8/8 | 0 | 5 | INCONCLUSIVE |
| upkeep | now054 | pre054 | includes main drift | 8 | -45 | 11 | -9 | INCONCLUSIVE | -9 | -1563.1 | 0.5 | 8/8 | 8/8 | 0 | 8 | INCONCLUSIVE |
| upkeep | refined | pre054 | includes main drift | 8 | -58 | 6 | -14 | INCONCLUSIVE | -14 | -1254.6 | -1.4 | 8/8 | 8/8 | 0 | 8 | INCONCLUSIVE |
| upkeep | now054 | main-no054 | authoring work alone | 5 | -14 | 11 | -3.6 | INCONCLUSIVE | -4.7 | -2303.7 | 0.9 | 8/8 | 5/5 | 0 | 5 | INCONCLUSIVE |
| upkeep | refined | main-no054 | authoring work alone | 5 | -16 | 1 | -9.2 | INCONCLUSIVE | -9.7 | -1995.2 | -1.0 | 8/8 | 5/5 | 0 | 5 | REAL (fewer) |
| upkeep | refined | now054 | refinement effect | 8 | -37 | 18 | -5 | INCONCLUSIVE | -5 | 308.5 | -1.9 | 8/8 | 8/8 | 0 | 8 | INCONCLUSIVE |

## Rounds

Launch order, wall seconds against the 900 s round budget, and launch skew: seconds between the first and the last variant starting the same step. Near zero means the variants shared the machine load.

- round 1: order UNKNOWN, wall UNKNOWN s; author skew 0 s; upkeep skew 0 s
- round 2: order UNKNOWN, wall UNKNOWN s; author skew 0 s; upkeep skew 0 s
- round 3: order UNKNOWN, wall UNKNOWN s; author skew 0 s; upkeep skew 0 s
- round 4: order UNKNOWN, wall UNKNOWN s; author skew 0 s; upkeep skew 0 s
- round 5: order UNKNOWN, wall UNKNOWN s; author skew 0 s; upkeep skew 0 s
- round 6: order UNKNOWN, wall UNKNOWN s; author skew 0 s; upkeep skew 0 s
- round 7: order UNKNOWN, wall UNKNOWN s; author skew 0 s; upkeep skew 0 s
- round 8: order UNKNOWN, wall UNKNOWN s; author skew 0 s; upkeep skew 0 s
