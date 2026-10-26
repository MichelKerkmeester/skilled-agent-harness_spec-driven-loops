# Speed loop summary

- Results file: `results.tsv`, 24 rows, rounds: 1, 2, 3.
- Seconds are dispatch start to end. Means use valid runs only: exit 0, under the cap, not contaminated. Excluded runs are counted by reason in the first table.
- `strict` is valid runs whose strict validation passed. An untouched scaffold passes strict, so read it next to `hints`. `hints`, `anchors`, `oos`, `side`, `procs`, `refs_054` and `outside` are the worst valid run.
- Tokens come from the Devin session store. UNKNOWN means the store held no figure for at least one valid run.
- Absolute seconds are not comparable with the earlier authoring benchmark: the sandboxes, the cap, the parallel load and the hook builds differ. Compare variants within this file only.

## Runs per variant and step

| Step | Variant | Valid | Timed out | Failed rc | Contaminated | Aborted/skipped/missing | Sec min | Sec max | Sec mean | tok_in | tok_cache_read | tok_out | validate calls | tool calls | strict | hints | anchors | oos | side | procs | refs_054 | outside | applied | wt_new |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | pre054 | 3/3 | 0 | 0 | 0 | 0 | 250 | 425 | 337.3 | 146525.3 | 6466005.3 | 47500.3 | 5.3 | 79.7 | 3/3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | NA | 0 |
| author | main-no054 | 3/3 | 0 | 0 | 0 | 0 | 33 | 399 | 261.3 | 131092.7 | 6145578.7 | 36041 | 3.3 | 78.3 | 3/3 | 146 | 0 | 0 | 0 | 0 | 0 | 0 | NA | 0 |
| author | now054 | 3/3 | 0 | 0 | 0 | 0 | 185 | 287 | 238 | 144525.7 | 5155072 | 38403 | 4 | 63 | 3/3 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | NA | 0 |
| author | refined | 1/3 | 0 | 0 | 0 | 2 | 293 | 293 | 293 | 148112 | 5956992 | 47450 | 3 | 80 | 1/1 | 0 | 0 | 0 | 92 | 0 | 0 | 0 | NA | 0 |
| upkeep | pre054 | 3/3 | 0 | 0 | 0 | 0 | 98 | 137 | 117 | 53151.7 | 1411498.7 | 14228.3 | 4 | 33.7 | 3/3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | main-no054 | 3/3 | 0 | 0 | 0 | 0 | 62 | 104 | 79.7 | 47011.3 | 1041450.7 | 9756.7 | 3.3 | 29.3 | 3/3 | 146 | 0 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | now054 | 3/3 | 0 | 0 | 0 | 0 | 88 | 146 | 114.3 | 62668.7 | 1969706.7 | 16912.3 | 3.3 | 48 | 3/3 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | refined | 1/3 | 0 | 0 | 0 | 2 | 80 | 80 | 80 | 71247 | 1468928 | 10458 | 5 | 34 | 1/1 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 1/1 | 0 |

## Upkeep from a clean start

Upkeep seconds also pay for repairing whatever the author step left. These rows keep only valid upkeep runs whose author packet passed strict validation with 0 leftover hints.

| Variant | Clean-start runs | Sec min | Sec max | Sec mean |
|---|---|---|---|---|
| pre054 | 1/3 | 137 | 137 | 137 |
| main-no054 | 2/3 | 62 | 73 | 67.5 |
| now054 | 3/3 | 88 | 146 | 114.3 |
| refined | 1/1 | 80 | 80 | 80 |

## Paired difference per round

For each round where both runs are valid: variant seconds minus baseline seconds from that same round. Positive means slower than the baseline. The verdict is SLOWER or FASTER only when every pair has that sign and there are at least two pairs; otherwise INCONCLUSIVE. Against pre054 the difference includes main's drift; against main-no054 it is the authoring work alone; refined against now054 is the refinement effect.

| Step | Variant | Baseline | Meaning | Pairs | Diff min | Diff max | Diff mean | Verdict | Delta of means | tok_out delta | validate calls delta | Variant strict | Baseline strict | Variant worst hints |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | main-no054 | pre054 | main drift alone | 3 | -217 | 15 | -76 | INCONCLUSIVE | -76 | -11459.3 | -2.0 | 3/3 | 3/3 | 146 |
| author | now054 | pre054 | includes main drift | 3 | -152 | -8 | -99.3 | FASTER | -99.3 | -9097.3 | -1.3 | 3/3 | 3/3 | 0 |
| author | refined | pre054 | includes main drift | 1 | -132 | -132 | -132 | INCONCLUSIVE | -44.3 | -50.3 | -2.3 | 1/1 | 3/3 | 0 |
| author | now054 | main-no054 | authoring work alone | 3 | -167 | 209 | -23.3 | INCONCLUSIVE | -23.3 | 2362 | 0.7 | 3/3 | 3/3 | 0 |
| author | refined | main-no054 | authoring work alone | 1 | -106 | -106 | -106 | INCONCLUSIVE | 31.7 | 11409 | -0.3 | 1/1 | 3/3 | 0 |
| author | refined | now054 | refinement effect | 1 | 6 | 6 | 6 | INCONCLUSIVE | 55 | 9047 | -1 | 1/1 | 3/3 | 0 |
| upkeep | main-no054 | pre054 | main drift alone | 3 | -54 | -25 | -37.3 | FASTER | -37.3 | -4471.7 | -0.7 | 3/3 | 3/3 | 146 |
| upkeep | now054 | pre054 | includes main drift | 3 | -28 | 48 | -2.7 | INCONCLUSIVE | -2.7 | 2684.0 | -0.7 | 3/3 | 3/3 | 0 |
| upkeep | refined | pre054 | includes main drift | 1 | -18 | -18 | -18 | INCONCLUSIVE | -37 | -3770.3 | 1 | 1/1 | 3/3 | 0 |
| upkeep | now054 | main-no054 | authoring work alone | 3 | 5 | 73 | 34.7 | SLOWER | 34.7 | 7155.7 | 0 | 3/3 | 3/3 | 0 |
| upkeep | refined | main-no054 | authoring work alone | 1 | 7 | 7 | 7 | INCONCLUSIVE | 0.3 | 701.3 | 1.7 | 1/1 | 3/3 | 0 |
| upkeep | refined | now054 | refinement effect | 1 | -66 | -66 | -66 | INCONCLUSIVE | -34.3 | -6454.3 | 1.7 | 1/1 | 3/3 | 0 |

## Rounds

Launch order, wall seconds against the 900 s round budget, and launch skew: seconds between the first and the last variant starting the same step. Near zero means the variants shared the machine load.

- round 1: order main-no054,refined,pre054,now054, wall 592 s; author skew 0 s; upkeep skew 0 s
- round 2: order now054,refined,main-no054,pre054, wall 486 s; author skew 0 s; upkeep skew 0 s
- round 3: order refined,now054,pre054,main-no054, wall 410 s; author skew 0 s; upkeep skew 0 s
