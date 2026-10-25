# Speed loop summary

- Results file: `results.tsv`, 4 rows, rounds: 1.
- Seconds are dispatch start to end. Means use valid runs only: exit 0, under the cap, not contaminated. Excluded runs are counted by reason in the first table.
- `strict` is valid runs whose strict validation passed. An untouched scaffold passes strict, so read it next to `hints`. `hints`, `anchors`, `oos`, `side`, `procs`, `refs_054` and `outside` are the worst valid run.
- Tokens come from the Devin session store. UNKNOWN means the store held no figure for at least one valid run.
- Absolute seconds are not comparable with the earlier authoring benchmark: the sandboxes, the cap, the parallel load and the hook builds differ. Compare variants within this file only.

## Runs per variant and step

| Step | Variant | Valid | Timed out | Failed rc | Contaminated | Aborted/skipped/missing | Sec min | Sec max | Sec mean | tok_in | tok_cache_read | tok_out | validate calls | tool calls | strict | hints | anchors | oos | side | procs | refs_054 | outside | applied | wt_new |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | pre054 | 1/1 | 0 | 0 | 0 | 0 | 236 | 236 | 236 | 188609 | 7079936 | 53179 | 4 | 88 | 1/1 | 1 | 3 | 0 | 4 | 0 | 0 | 0 | NA | 4 |
| author | now054 | 1/1 | 0 | 0 | 0 | 0 | 144 | 144 | 144 | 125005 | 3368832 | 30436 | 4 | 46 | 1/1 | 0 | 0 | 0 | 4 | 0 | 0 | 0 | NA | 4 |
| upkeep | pre054 | 1/1 | 0 | 0 | 0 | 0 | 103 | 103 | 103 | 68504 | 2748032 | 14381 | 4 | 59 | 1/1 | 1 | 3 | 0 | 0 | 0 | 0 | 0 | 1/1 | 9 |
| upkeep | now054 | 1/1 | 0 | 0 | 0 | 0 | 40 | 40 | 40 | 34632 | 468224 | 6455 | 2 | 18 | 1/1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1/1 | 9 |

## Upkeep from a clean start

Upkeep seconds also pay for repairing whatever the author step left. These rows keep only valid upkeep runs whose author packet passed strict validation with 0 leftover hints.

| Variant | Clean-start runs | Sec min | Sec max | Sec mean |
|---|---|---|---|---|
| pre054 | 0/1 | NA | NA | NA |
| now054 | 1/1 | 40 | 40 | 40 |

## Paired difference per round

For each round where both runs are valid: variant seconds minus baseline seconds from that same round. Positive means slower than the baseline. The verdict is SLOWER or FASTER only when every pair has that sign and there are at least two pairs; otherwise INCONCLUSIVE. Against pre054 the difference includes main's drift; against main-no054 it is the authoring work alone; refined against now054 is the refinement effect.

| Step | Variant | Baseline | Meaning | Pairs | Diff min | Diff max | Diff mean | Verdict | Delta of means | tok_out delta | validate calls delta | Variant strict | Baseline strict | Variant worst hints |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| author | now054 | pre054 | includes main drift | 1 | -92 | -92 | -92 | INCONCLUSIVE | -92 | -22743 | 0 | 1/1 | 1/1 | 0 |
| upkeep | now054 | pre054 | includes main drift | 1 | -63 | -63 | -63 | INCONCLUSIVE | -63 | -7926 | -2 | 1/1 | 1/1 | 0 |

## Rounds

Launch order, wall seconds against the 900 s round budget, and launch skew: seconds between the first and the last variant starting the same step. Near zero means the variants shared the machine load.

- round 1: order pre054,now054, wall 358 s; author skew 0 s; upkeep skew 0 s
