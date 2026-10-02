# 032 label decisions

Label file: `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl`, the scorer's default path, 40 rows (20 live, 20 constructed).

## Method

- Draw: `cite-drift-scan.mjs --draw --seed 20260929`, written first to the ignored `scratch/build/` folder at commit `ebcc68e8ed`.
- Each row was rendered with its citing sentence and cited window read by `git show` at the drawn commit. The rows were shuffled under neutral ids R01 to R40, so no labeler or arbiter knew which rows were constructed.
- Luna 6 max and SWE 2 max labeled blind. They agreed on 29 of 40, mostly splitting `partial` against `contradicts`.
- Opus 5.5 medium, run alone and delegated by the operator, settled every row.

## Arbiter ruling

`partial` needs the window to show the claim's own subject (the named mechanism, block, row or content) with a detail off or cut off. A window showing only the right file's unrelated code is `contradicts`, even when the claimed identifier appears incidentally.

## Result

- Live: 9 supports, 3 partial, 8 contradicts. 11 of 20 live citations have drifted.
- Constructed: 15 keep the drawn `contradicts`. Five are relabeled `partial` (constructed-03, -04, -06, -12 and -18), each with labeler `relabel:operator-delegated:opus-5.5-medium`, as `P/spec.md:198` allows. Both values score as drifted, so the relabels do not change the measurement.
- The arbiter found Luna judged a different citation than the row's on R13 and R33, and was wrong on the facts for R22.

## Census

Default run: `comparator flag-nothing: 9/40`, `comparator identifier-overlap: 13/40 = 0.3250`, `baseline method: identifier-overlap`, `headroom: baseline=0.3250 margin=0.10`, exit 0. No arm ran, and a switched run needs the operator's separate yes.
