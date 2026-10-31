# Speed loop summary

- Results file: `results.tsv`, 24 rows, rounds: 1, 2, 3.
- Seconds are dispatch start to end. Means use valid runs only: exit 0, under the cap, not contaminated. Excluded runs are counted by reason in the first table.
- `strict` is valid runs whose strict validation passed. An untouched scaffold passes strict, so read it next to `hints`. `hints`, `anchors`, `oos`, `side`, `procs`, `refs_054` and `outside` are the worst valid run.
- Tokens come from the Devin session store. UNKNOWN means the store held no figure for at least one valid run.
- Absolute seconds are not comparable with the earlier authoring benchmark: the sandboxes, the cap, the parallel load and the hook builds differ. Compare variants within this file only.

## Runs per variant and step

| Step | Variant | Valid | Timed out | Failed rc | Contaminated | Aborted/skipped/missing | Sec min | Sec max | Sec mean | tok_in | tok_cache_read | tok_out | validate calls | tool calls | strict | hints | anchors | oos | side | procs | refs_054 | outside | applied | wt_new |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | pre054 | 2/3 | 0 | 0 | 1 | 0 | 235 | 466 | 350.5 | 160744 | 8452096 | 44818.5 | 2.5 | 91 | 2/2 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | NA | 0 |
| author | main-no054 | 3/3 | 0 | 0 | 0 | 0 | 195 | 325 | 244 | 156544.3 | 6372565.3 | 38893 | 2 | 76.3 | 3/3 | 1 | 3 | 0 | 0 | 0 | 0 | 0 | NA | 0 |
| author | now054 | 3/3 | 0 | 0 | 0 | 0 | 178 | 334 | 264.7 | 138219.7 | 4709248 | 40942 | 4.3 | 60.7 | 3/3 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | NA | 0 |
| author | refined | 3/3 | 0 | 0 | 0 | 0 | 270 | 405 | 321.7 | 176522.7 | 8274816 | 51791 | 4 | 88.3 | 3/3 | 1 | 0 | 0 | 4 | 0 | 0 | 0 | NA | 0 |
| upkeep | pre054 | 3/3 | 0 | 0 | 0 | 0 | 56 | 91 | 77.7 | 52000.3 | 1093546.7 | 11662.3 | 3.3 | 29 | 3/3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | main-no054 | 3/3 | 0 | 0 | 0 | 0 | 54 | 184 | 114 | 43042 | 920021.3 | 10175.3 | 4 | 26.7 | 3/3 | 1 | 3 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | now054 | 3/3 | 0 | 0 | 0 | 0 | 73 | 79 | 75.7 | 42542.3 | 979669.3 | 10645 | 3.7 | 29.7 | 3/3 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |
| upkeep | refined | 3/3 | 0 | 0 | 0 | 0 | 45 | 184 | 105.7 | 39611.7 | 811520 | 10906 | 4.7 | 25.7 | 3/3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 3/3 | 0 |

## Upkeep from a clean start

Upkeep seconds also pay for repairing whatever the author step left. These rows keep only valid upkeep runs whose author packet passed strict validation with 0 leftover hints.

| Variant | Clean-start runs | Sec min | Sec max | Sec mean |
|---|---|---|---|---|
| pre054 | 2/3 | 86 | 91 | 88.5 |
| main-no054 | 2/3 | 54 | 184 | 119 |
| now054 | 3/3 | 73 | 79 | 75.7 |
| refined | 2/3 | 45 | 88 | 66.5 |

## Paired difference per round

For each round where both runs are valid: variant seconds minus baseline seconds from that same round. Positive means slower than the baseline. The verdict is SLOWER or FASTER only when every pair has that sign and there are at least two pairs; otherwise INCONCLUSIVE. Against pre054 the difference includes main's drift; against main-no054 it is the authoring work alone; refined against now054 is the refinement effect.

| Step | Variant | Baseline | Meaning | Pairs | Diff min | Diff max | Diff mean | Verdict | Delta of means | tok_out delta | validate calls delta | Variant strict | Baseline strict | Variant worst hints |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | main-no054 | pre054 | main drift alone | 2 | -271 | 90 | -90.5 | INCONCLUSIVE | -106.5 | -5925.5 | -0.5 | 3/3 | 2/2 | 1 |
| author | now054 | pre054 | includes main drift | 2 | -288 | 47 | -120.5 | INCONCLUSIVE | -85.8 | -3876.5 | 1.8 | 3/3 | 2/2 | 0 |
| author | refined | pre054 | includes main drift | 2 | -61 | 55 | -3 | INCONCLUSIVE | -28.8 | 6972.5 | 1.5 | 3/3 | 2/2 | 1 |
| author | now054 | main-no054 | authoring work alone | 3 | -43 | 122 | 20.7 | INCONCLUSIVE | 20.7 | 2049 | 2.3 | 3/3 | 3/3 | 0 |
| author | refined | main-no054 | authoring work alone | 3 | -35 | 210 | 77.7 | INCONCLUSIVE | 77.7 | 12898 | 2 | 3/3 | 3/3 | 1 |
| author | refined | now054 | refinement effect | 3 | -64 | 227 | 57 | INCONCLUSIVE | 57 | 10849 | -0.3 | 3/3 | 3/3 | 1 |
| upkeep | main-no054 | pre054 | main drift alone | 3 | -37 | 128 | 36.3 | INCONCLUSIVE | 36.3 | -1487 | 0.7 | 3/3 | 3/3 | 1 |
| upkeep | now054 | pre054 | includes main drift | 3 | -18 | 19 | -2 | INCONCLUSIVE | -2 | -1017.3 | 0.3 | 3/3 | 3/3 | 0 |
| upkeep | refined | pre054 | includes main drift | 3 | -46 | 128 | 28 | INCONCLUSIVE | 28 | -756.3 | 1.3 | 3/3 | 3/3 | 1 |
| upkeep | now054 | main-no054 | authoring work alone | 3 | -109 | 19 | -38.3 | INCONCLUSIVE | -38.3 | 469.7 | -0.3 | 3/3 | 3/3 | 0 |
| upkeep | refined | main-no054 | authoring work alone | 3 | -16 | 0 | -8.3 | INCONCLUSIVE | -8.3 | 730.7 | 0.7 | 3/3 | 3/3 | 1 |
| upkeep | refined | now054 | refinement effect | 3 | -28 | 109 | 30 | INCONCLUSIVE | 30 | 261 | 1.0 | 3/3 | 3/3 | 1 |

## Rounds

Launch order, wall seconds against the 900 s round budget, and launch skew: seconds between the first and the last variant starting the same step. Near zero means the variants shared the machine load.

- round 1: order refined,pre054,main-no054,now054, wall 583 s; author skew 0 s; upkeep skew 1 s
- round 2: order pre054,now054,refined,main-no054, wall 529 s; author skew 0 s; upkeep skew 0 s
- round 3: order now054,main-no054,refined,pre054, wall 577 s; author skew 0 s; upkeep skew 0 s
