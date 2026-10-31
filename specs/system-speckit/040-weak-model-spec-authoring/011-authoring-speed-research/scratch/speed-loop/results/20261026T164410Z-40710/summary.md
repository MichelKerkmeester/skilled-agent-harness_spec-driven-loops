# Speed loop summary

- Results file: `results.tsv`, 40 rows, rounds: 1, 2, 3, 4, 5.
- Seconds are dispatch start to end. Means use valid runs only: exit 0, under the cap, not contaminated. Excluded runs are counted by reason in the first table.
- `strict` is valid runs whose strict validation passed. An untouched scaffold passes strict, so read it next to `hints`. `hints`, `anchors`, `oos`, `side`, `procs`, `refs_054` and `outside` are the worst valid run.
- Tokens come from the Devin session store. UNKNOWN means the store held no figure for at least one valid run.
- Absolute seconds are not comparable with the earlier authoring benchmark: the sandboxes, the cap, the parallel load and the hook builds differ. Compare variants within this file only.

## Runs per variant and step

| Step | Variant | Valid | Timed out | Failed rc | Contaminated | Aborted/skipped/missing | Sec min | Sec max | Sec mean | tok_in | tok_cache_read | tok_out | validate calls | tool calls | strict | hints | anchors | oos | side | procs | refs_054 | outside | applied | wt_new |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | pre054 | 5/5 | 0 | 0 | 0 | 0 | 86 | 162 | 113.6 | 82928.8 | 2265830.4 | 18889.6 | 2.2 | 45.8 | 5/5 | 0 | NA | 0 | 4 | 0 | 0 | 0 | NA | 6 |
| author | main-no054 | 2/5 | 0 | 0 | 0 | 3 | 121 | 138 | 129.5 | 97819 | 2715776 | 25601 | 2.5 | 50.5 | 2/2 | 0 | NA | 0 | 6 | 0 | 0 | 0 | NA | 6 |
| author | now054 | 5/5 | 0 | 0 | 0 | 0 | 71 | 120 | 97.8 | 63437 | 1116646.4 | 19285.6 | 3 | 30.6 | 5/5 | 0 | NA | 0 | 4 | 0 | 0 | 0 | NA | 6 |
| author | refined | 5/5 | 0 | 0 | 0 | 0 | 70 | 164 | 104.8 | 73340 | 1369011.2 | 20263.2 | 1.8 | 36.8 | 5/5 | 0 | NA | 0 | 4 | 0 | 0 | 0 | NA | 6 |
| upkeep | pre054 | 5/5 | 0 | 0 | 0 | 0 | 41 | 86 | 59.6 | 30092 | 637132.8 | 7877.4 | 2.8 | 21.8 | 5/5 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 5/5 | 2 |
| upkeep | main-no054 | 2/5 | 0 | 0 | 0 | 3 | 30 | 59 | 44.5 | 37038.5 | 579008 | 7042 | 2.5 | 19 | 2/2 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 2/2 | 2 |
| upkeep | now054 | 5/5 | 0 | 0 | 0 | 0 | 25 | 65 | 42 | 26459 | 494848 | 5703.8 | 3.2 | 17 | 5/5 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 5/5 | 2 |
| upkeep | refined | 5/5 | 0 | 0 | 0 | 0 | 22 | 47 | 36.2 | 24731.6 | 351360 | 5584 | 1.4 | 13 | 5/5 | 0 | NA | 0 | 0 | 0 | 0 | 0 | 5/5 | 2 |

## Upkeep from a clean start

Upkeep seconds also pay for repairing whatever the author step left. These rows keep only valid upkeep runs whose author packet passed strict validation with 0 leftover hints.

| Variant | Clean-start runs | Sec min | Sec max | Sec mean |
|---|---|---|---|---|
| pre054 | 5/5 | 41 | 86 | 59.6 |
| main-no054 | 2/2 | 30 | 59 | 44.5 |
| now054 | 5/5 | 25 | 65 | 42 |
| refined | 5/5 | 22 | 47 | 36.2 |

## Paired difference per round

For each round where both runs are valid: variant seconds minus baseline seconds from that same round. Positive means slower than the baseline. The verdict is SLOWER or FASTER only when every pair has that sign and there are at least two pairs; otherwise INCONCLUSIVE. Against pre054 the difference includes main's drift; against main-no054 it is the authoring work alone; refined against now054 is the refinement effect. The tok_out verdict is REAL only with at least 4 valid pairs that all share one sign; otherwise INCONCLUSIVE.

| Step | Variant | Baseline | Meaning | Pairs | Diff min | Diff max | Diff mean | Verdict | Delta of means | tok_out delta | validate calls delta | Variant strict | Baseline strict | Variant worst hints | tok_out pairs | tok_out verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | main-no054 | pre054 | main drift alone | 2 | 0 | 30 | 15 | INCONCLUSIVE | 15.9 | 6711.4 | 0.3 | 2/2 | 5/5 | 0 | 2 | INCONCLUSIVE |
| author | now054 | pre054 | includes main drift | 5 | -58 | 29 | -15.8 | INCONCLUSIVE | -15.8 | 396 | 0.8 | 5/5 | 5/5 | 0 | 5 | INCONCLUSIVE |
| author | refined | pre054 | includes main drift | 5 | -92 | 73 | -8.8 | INCONCLUSIVE | -8.8 | 1373.6 | -0.4 | 5/5 | 5/5 | 0 | 5 | INCONCLUSIVE |
| author | now054 | main-no054 | authoring work alone | 2 | -58 | -21 | -39.5 | FASTER | -31.7 | -6315.4 | 0.5 | 5/5 | 2/2 | 0 | 2 | INCONCLUSIVE |
| author | refined | main-no054 | authoring work alone | 2 | -29 | -26 | -27.5 | FASTER | -24.7 | -5337.8 | -0.7 | 5/5 | 2/2 | 0 | 2 | INCONCLUSIVE |
| author | refined | now054 | refinement effect | 5 | -48 | 44 | 7 | INCONCLUSIVE | 7 | 977.6 | -1.2 | 5/5 | 5/5 | 0 | 5 | INCONCLUSIVE |
| upkeep | main-no054 | pre054 | main drift alone | 2 | -49 | 18 | -15.5 | INCONCLUSIVE | -15.1 | -835.4 | -0.3 | 2/2 | 5/5 | 0 | 2 | INCONCLUSIVE |
| upkeep | now054 | pre054 | includes main drift | 5 | -45 | 11 | -17.6 | INCONCLUSIVE | -17.6 | -2173.6 | 0.4 | 5/5 | 5/5 | 0 | 5 | INCONCLUSIVE |
| upkeep | refined | pre054 | includes main drift | 5 | -58 | 6 | -23.4 | INCONCLUSIVE | -23.4 | -2293.4 | -1.4 | 5/5 | 5/5 | 0 | 5 | INCONCLUSIVE |
| upkeep | now054 | main-no054 | authoring work alone | 2 | -7 | 4 | -1.5 | INCONCLUSIVE | -2.5 | -1338.2 | 0.7 | 5/5 | 2/2 | 0 | 2 | INCONCLUSIVE |
| upkeep | refined | main-no054 | authoring work alone | 2 | -12 | -8 | -10 | FASTER | -8.3 | -1458 | -1.1 | 5/5 | 2/2 | 0 | 2 | INCONCLUSIVE |
| upkeep | refined | now054 | refinement effect | 5 | -37 | 18 | -5.8 | INCONCLUSIVE | -5.8 | -119.8 | -1.8 | 5/5 | 5/5 | 0 | 5 | INCONCLUSIVE |

## Rounds

Launch order, wall seconds against the 900 s round budget, and launch skew: seconds between the first and the last variant starting the same step. Near zero means the variants shared the machine load.

- round 1: order main-no054,pre054,refined,now054, wall 220 s; author skew 0 s; upkeep skew 0 s
- round 2: order main-no054,now054,refined,pre054, wall 221 s; author skew 0 s; upkeep skew 0 s
- round 3: order main-no054,pre054,now054,refined, wall 233 s; author skew 0 s; upkeep skew 0 s
- round 4: order pre054,main-no054,now054,refined, wall 201 s; author skew 0 s; upkeep skew 0 s
- round 5: order now054,refined,main-no054,pre054, wall 226 s; author skew 0 s; upkeep skew 0 s
