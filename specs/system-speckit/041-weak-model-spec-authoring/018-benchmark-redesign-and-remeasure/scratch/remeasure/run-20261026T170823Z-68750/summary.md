# Speed loop summary

- Results file: `results.tsv`, 24 rows, rounds: 1, 2, 3.
- Seconds are dispatch start to end. Means use valid runs only: exit 0, under the cap, not contaminated. Excluded runs are counted by reason in the first table.
- `strict` is valid runs whose strict validation passed. An untouched scaffold passes strict, so read it next to `hints`. `hints`, `anchors`, `oos`, `side`, `procs`, `refs_054` and `outside` are the worst valid run.
- Tokens come from the Devin session store. UNKNOWN means the store held no figure for at least one valid run.
- Absolute seconds are not comparable with the earlier authoring benchmark: the sandboxes, the cap, the parallel load and the hook builds differ. Compare variants within this file only.

## Runs per variant and step

| Step | Variant | Valid | Timed out | Failed rc | Contaminated | Aborted/skipped/missing | Sec min | Sec max | Sec mean | tok_in | tok_cache_read | tok_out | validate calls | tool calls | strict | hints | anchors | oos | side | procs | refs_054 | outside | applied | wt_new |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | pre054 | 3/3 | 0 | 0 | 0 | 0 | 90 | 163 | 115.3 | 62708.7 | 1738410.7 | 14908.7 | 3 | 42.7 | 3/3 | 0 | NA | 0 | 0 | 0 | 0 | 0 | NA | 1 |
| author | main-no054 | 3/3 | 0 | 0 | 0 | 0 | 79 | 125 | 104.3 | 90016.3 | 2476757.3 | 18085 | 2.3 | 42.3 | 3/3 | 0 | NA | 0 | 4 | 0 | 0 | 0 | NA | 1 |
| author | now054 | 3/3 | 0 | 0 | 0 | 0 | 85 | 96 | 92.3 | 69129.7 | 1011669.3 | 16601.3 | 2.7 | 29 | 3/3 | 0 | NA | 0 | 0 | 0 | 0 | 0 | NA | 1 |
| author | refined | 3/3 | 0 | 0 | 0 | 0 | 81 | 108 | 98.3 | 61574.3 | 1470677.3 | 15922.7 | 3.3 | 35.7 | 3/3 | 0 | NA | 0 | 0 | 0 | 0 | 0 | NA | 1 |
| upkeep | pre054 | 3/3 | 0 | 0 | 0 | 0 | 36 | 45 | 39.7 | 22826.3 | 407637.3 | 5620.3 | 2.7 | 15.7 | 3/3 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | main-no054 | 3/3 | 0 | 0 | 0 | 0 | 32 | 62 | 50 | 47803.7 | 894933.3 | 8258 | 2.3 | 24.3 | 3/3 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | now054 | 3/3 | 0 | 0 | 0 | 0 | 43 | 48 | 45 | 19416.3 | 471381.3 | 5074.7 | 3.3 | 16.3 | 3/3 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | refined | 3/3 | 0 | 0 | 0 | 0 | 33 | 51 | 41.3 | 30405 | 468821.3 | 6097 | 1.3 | 17.3 | 3/3 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |

## Upkeep from a clean start

Upkeep seconds also pay for repairing whatever the author step left. These rows keep only valid upkeep runs whose author packet passed strict validation with 0 leftover hints.

| Variant | Clean-start runs | Sec min | Sec max | Sec mean |
|---|---|---|---|---|
| pre054 | 3/3 | 36 | 45 | 39.7 |
| main-no054 | 3/3 | 32 | 62 | 50 |
| now054 | 3/3 | 43 | 48 | 45 |
| refined | 3/3 | 33 | 51 | 41.3 |

## Paired difference per round

For each round where both runs are valid: variant seconds minus baseline seconds from that same round. Positive means slower than the baseline. The verdict is SLOWER or FASTER only when every pair has that sign and there are at least two pairs; otherwise INCONCLUSIVE. Against pre054 the difference includes main's drift; against main-no054 it is the authoring work alone; refined against now054 is the refinement effect. The tok_out verdict is REAL only with at least 4 valid pairs that all share one sign; otherwise INCONCLUSIVE.

| Step | Variant | Baseline | Meaning | Pairs | Diff min | Diff max | Diff mean | Verdict | Delta of means | tok_out delta | validate calls delta | Variant strict | Baseline strict | Variant worst hints | tok_out pairs | tok_out verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | main-no054 | pre054 | main drift alone | 3 | -84 | 35 | -11 | INCONCLUSIVE | -11 | 3176.3 | -0.7 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| author | now054 | pre054 | includes main drift | 3 | -67 | 3 | -23 | INCONCLUSIVE | -23 | 1692.7 | -0.3 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| author | refined | pre054 | includes main drift | 3 | -55 | 13 | -17 | INCONCLUSIVE | -17 | 1014 | 0.3 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| author | now054 | main-no054 | authoring work alone | 3 | -40 | 17 | -12 | INCONCLUSIVE | -12 | -1483.7 | 0.3 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| author | refined | main-no054 | authoring work alone | 3 | -44 | 29 | -6 | INCONCLUSIVE | -6 | -2162.3 | 1 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| author | refined | now054 | refinement effect | 3 | -4 | 12 | 6 | INCONCLUSIVE | 6 | -678.7 | 0.7 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| upkeep | main-no054 | pre054 | main drift alone | 3 | -6 | 20 | 10.3 | INCONCLUSIVE | 10.3 | 2637.7 | -0.3 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| upkeep | now054 | pre054 | includes main drift | 3 | 3 | 8 | 5.3 | SLOWER | 5.3 | -545.7 | 0.7 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| upkeep | refined | pre054 | includes main drift | 3 | -5 | 6 | 1.7 | INCONCLUSIVE | 1.7 | 476.7 | -1.3 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| upkeep | now054 | main-no054 | authoring work alone | 3 | -14 | 11 | -5 | INCONCLUSIVE | -5 | -3183.3 | 1 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| upkeep | refined | main-no054 | authoring work alone | 3 | -16 | 1 | -8.7 | INCONCLUSIVE | -8.7 | -2161 | -1.0 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |
| upkeep | refined | now054 | refinement effect | 3 | -10 | 3 | -3.7 | INCONCLUSIVE | -3.7 | 1022.3 | -2 | 3/3 | 3/3 | 0 | 3 | INCONCLUSIVE |

## Rounds

Launch order, wall seconds against the 900 s round budget, and launch skew: seconds between the first and the last variant starting the same step. Near zero means the variants shared the machine load.

- round 1: order pre054,main-no054,refined,now054, wall 238 s; author skew 0 s; upkeep skew 0 s
- round 2: order main-no054,now054,refined,pre054, wall 188 s; author skew 0 s; upkeep skew 0 s
- round 3: order now054,main-no054,refined,pre054, wall 193 s; author skew 0 s; upkeep skew 0 s
