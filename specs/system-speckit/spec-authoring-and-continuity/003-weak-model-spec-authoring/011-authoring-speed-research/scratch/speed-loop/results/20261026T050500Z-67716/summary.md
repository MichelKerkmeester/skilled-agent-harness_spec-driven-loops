# Speed loop summary

- Results file: `results.tsv`, 24 rows, rounds: 1, 2, 3.
- Seconds are dispatch start to end. Means use valid runs only: exit 0, under the cap, not contaminated. Excluded runs are counted by reason in the first table.
- `strict` is valid runs whose strict validation passed. An untouched scaffold passes strict, so read it next to `hints`. `hints`, `anchors`, `oos`, `side`, `procs`, `refs_054` and `outside` are the worst valid run.
- Tokens come from the Devin session store. UNKNOWN means the store held no figure for at least one valid run.
- Absolute seconds are not comparable with the earlier authoring benchmark: the sandboxes, the cap, the parallel load and the hook builds differ. Compare variants within this file only.

## Runs per variant and step

| Step | Variant | Valid | Timed out | Failed rc | Contaminated | Aborted/skipped/missing | Sec min | Sec max | Sec mean | tok_in | tok_cache_read | tok_out | validate calls | tool calls | strict | hints | anchors | oos | side | procs | refs_054 | outside | applied | wt_new |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | pre054 | 3/3 | 0 | 0 | 0 | 0 | 157 | 229 | 191.3 | 140998.7 | 5127594.7 | 37578.3 | 4 | 72 | 3/3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | NA | 0 |
| author | main-no054 | 3/3 | 0 | 0 | 0 | 0 | 208 | 364 | 276 | 151668.3 | 6670250.7 | 47257 | 5 | 86.7 | 3/3 | 1 | 0 | 0 | 4 | 0 | 0 | 0 | NA | 0 |
| author | now054 | 3/3 | 0 | 0 | 0 | 0 | 190 | 358 | 259.3 | 165808.7 | 7783296 | 55488.7 | 7.3 | 81.3 | 3/3 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | NA | 0 |
| author | refined | 3/3 | 0 | 0 | 0 | 0 | 184 | 368 | 276.7 | 167208.7 | 8715904 | 53148.3 | 7 | 84.3 | 3/3 | 0 | 0 | 0 | 4 | 0 | 0 | 0 | NA | 0 |
| upkeep | pre054 | 3/3 | 0 | 0 | 0 | 0 | 54 | 82 | 68.3 | 46935 | 835200 | 10094.7 | 3 | 25.7 | 3/3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | main-no054 | 3/3 | 0 | 0 | 0 | 0 | 49 | 128 | 90.3 | 61990.7 | 2057088 | 14096.3 | 2.7 | 41.7 | 3/3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | now054 | 3/3 | 0 | 0 | 0 | 0 | 51 | 86 | 68.7 | 49134.3 | 928853.3 | 11088.3 | 3.7 | 25.7 | 3/3 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | refined | 3/3 | 0 | 0 | 0 | 0 | 52 | 87 | 69.7 | 49536.3 | 964437.3 | 13133.3 | 5.7 | 29.7 | 3/3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |

## Upkeep from a clean start

Upkeep seconds also pay for repairing whatever the author step left. These rows keep only valid upkeep runs whose author packet passed strict validation with 0 leftover hints.

| Variant | Clean-start runs | Sec min | Sec max | Sec mean |
|---|---|---|---|---|
| pre054 | 2/3 | 54 | 82 | 68 |
| main-no054 | 1/3 | 94 | 94 | 94 |
| now054 | 3/3 | 51 | 86 | 68.7 |
| refined | 3/3 | 52 | 87 | 69.7 |

## Paired difference per round

For each round where both runs are valid: variant seconds minus baseline seconds from that same round. Positive means slower than the baseline. The verdict is SLOWER or FASTER only when every pair has that sign and there are at least two pairs; otherwise INCONCLUSIVE. Against pre054 the difference includes main's drift; against main-no054 it is the authoring work alone; refined against now054 is the refinement effect.

| Step | Variant | Baseline | Meaning | Pairs | Diff min | Diff max | Diff mean | Verdict | Delta of means | tok_out delta | validate calls delta | Variant strict | Baseline strict | Variant worst hints |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | main-no054 | pre054 | main drift alone | 3 | 27 | 176 | 84.7 | SLOWER | 84.7 | 9678.7 | 1 | 3/3 | 3/3 | 1 |
| author | now054 | pre054 | includes main drift | 3 | -39 | 201 | 68 | INCONCLUSIVE | 68.0 | 17910.3 | 3.3 | 3/3 | 3/3 | 0 |
| author | refined | pre054 | includes main drift | 3 | 27 | 139 | 85.3 | SLOWER | 85.3 | 15570 | 3 | 3/3 | 3/3 | 0 |
| author | now054 | main-no054 | authoring work alone | 3 | -134 | 150 | -16.7 | INCONCLUSIVE | -16.7 | 8231.7 | 2.3 | 3/3 | 3/3 | 0 |
| author | refined | main-no054 | authoring work alone | 3 | -86 | 112 | 0.7 | INCONCLUSIVE | 0.7 | 5891.3 | 2 | 3/3 | 3/3 | 0 |
| author | refined | now054 | refinement effect | 3 | -174 | 178 | 17.3 | INCONCLUSIVE | 17.3 | -2340.3 | -0.3 | 3/3 | 3/3 | 0 |
| upkeep | main-no054 | pre054 | main drift alone | 3 | -33 | 74 | 22 | INCONCLUSIVE | 22 | 4001.7 | -0.3 | 3/3 | 3/3 | 1 |
| upkeep | now054 | pre054 | includes main drift | 3 | -13 | 17 | 0.3 | INCONCLUSIVE | 0.3 | 993.7 | 0.7 | 3/3 | 3/3 | 0 |
| upkeep | refined | pre054 | includes main drift | 3 | -17 | 16 | 1.3 | INCONCLUSIVE | 1.3 | 3038.7 | 2.7 | 3/3 | 3/3 | 0 |
| upkeep | now054 | main-no054 | authoring work alone | 3 | -77 | 20 | -21.7 | INCONCLUSIVE | -21.7 | -3008 | 1 | 3/3 | 3/3 | 0 |
| upkeep | refined | main-no054 | authoring work alone | 3 | -58 | 38 | -20.7 | INCONCLUSIVE | -20.7 | -963 | 3.0 | 3/3 | 3/3 | 0 |
| upkeep | refined | now054 | refinement effect | 3 | -34 | 19 | 1 | INCONCLUSIVE | 1 | 2045 | 2.0 | 3/3 | 3/3 | 0 |

## Rounds

Launch order, wall seconds against the 900 s round budget, and launch skew: seconds between the first and the last variant starting the same step. Near zero means the variants shared the machine load.

- round 1: order now054,refined,pre054,main-no054, wall 465 s; author skew 0 s; upkeep skew 0 s
- round 2: order refined,pre054,main-no054,now054, wall 510 s; author skew 0 s; upkeep skew 0 s
- round 3: order main-no054,now054,pre054,refined, wall 481 s; author skew 1 s; upkeep skew 0 s
