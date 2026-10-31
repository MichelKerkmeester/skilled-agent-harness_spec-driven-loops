# Iteration 1: What drove the measured result

**Focus:** Reconstruct the whole measurement chain — census -> draw -> labels -> Jev arm -> keep rule — and account for every count in `verdict jev: keep K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=3 p=2.384e-7`, using only artifacts and source that already exist.

## Findings

### F1-01 — The counts are the keep rule's own alphabet, fixed before the run
The scorer defines the rule and the letters in one place: `KEEP_RULE_LINE` (`cite-drift-scan.mjs:82`) fixes "coverage 10*M >= 9*K, then precision 5*TP >= 4*(TP+FP) with TP+FP >= 1, then margin 10*(A-B) >= M, then sign test p < 0.05, then for jev flips 10*F <= 3*M", and `decideVerdict` (`:700-708`) evaluates exactly that order. Recomputing from the report's counts: coverage 400>=360; precision 130>=104; margin 220>=40; sign p=2.384e-7<0.05; flips 30<=120. All five pass, so the verdict is `keep`, and none of the five is close except flips (30 vs 120, 4x slack). The rule's design — not a fitted threshold — produced the outcome. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:82,700-708; ~/.skilled/.labels/runs/032-jev-20261001/report.json]

### F1-02 — The baseline is weak, and that is the biggest single driver of the margin
`B=13` is identifier-overlap: flag only when the citing sentence's backticked tokens vanish from the target's ±10-line window (`:561-564`, `identifierTokens` `:540-550`). On these 40 rows it is right on 13; flag-nothing is right on 9 (the 9 supports). The baseline method line picks the better of the two (`:619-620`). `A-B = 22` is the entire margin check, so the keep rests mostly on a comparator that only catches syntactic token loss, not semantic drift. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:552-564,607-631; ~/.skilled/.labels/runs/032-jev-20261001/report.json]

### F1-03 — A=35 is relative superiority, not near-perfect absolute accuracy
The published headline compares 35 rows Jev gets right with 13 for the tie comparator, but the row set is 31 drifted (11 live + 20 constructed) against 9 supports. Jev's own confusion matrix: TP=26, FP=0 (precision 1.00), and 5 drifted rows missed (recall 26/31 = 0.839). W=22 and L=0 mean every row the baseline got right, Jev also got right; the 5 rows both miss are the shared errors. [SOURCE: ~/.skilled/.labels/runs/032-jev-20261001/report.json; replay over ~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl + labels, run by this iteration]

### F1-04 — The call log replays to the published counts exactly
Reading the 121-line `calls.jsonl` (1 auth test + 120 row calls, all exit 0, all `status=measured`, one model `jev-1.13.0`) beside the 40-row labels file and applying the scorer's own arithmetic (`:1148-1175`) reproduces the published column: M=40, A=35, TP=26, FP=0, F=3. The measurement is fully reconstructable offline from two files, with no model in the loop — a property the feature does not document today. [SOURCE: ~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl; .skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1148-1175]

### F1-05 — Constructed rows did not inflate the result; the errors concentrate there
The draw is half construction-labeled: 20 live in-range citations (±10-line window at the cited line) and 20 rows whose window moved 60+ lines down the same file (`:456-477`, constants `:88-100`). Splitting the replay by kind: live rows Jev-right 19/20 (missed 1 of 11 drifted), constructed rows Jev-right 16/20 (missed 4 of 20). All five misses are false negatives; three of the five sit at probabilities 0.49-0.59, i.e. exactly at the flag threshold (`FLAG_THRESHOLD=0.5`, `:76`). The construction rows are not the easy half — they are where the model's errors are. [SOURCE: replay over calls.jsonl + labels; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:76,456-477]

### F1-06 — p=2.384e-7 is exactly 2^-22, the sign test over W/L only
`decideVerdict` computes `binomialTail(W, W+L)` (`:701`, exact BigInt tail `:681-691`). With W=22, L=0 the tail is (1/2)^22 = 2.384185791015625e-7. The test measures Jev-vs-baseline superiority on the rows where they disagree; it says nothing about absolute accuracy against labels, and the five shared misses never enter it. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:681-691,701-705; ~/.skilled/.labels/runs/032-jev-20261001/report.json]

### F1-07 — F=3 is three 2-1 rerun splits, all in the construction half, all at the threshold
Each row is asked three times and scored by modal flag (`JEV_RERUNS=3`, `:962`; modal vote `:1161-1167`). The replay finds exactly three rows with a dissenting rerun: constructed-02 (0.55/0.44/0.44), constructed-04 (0.51/0.50/0.49), constructed-09 (0.42/0.48/0.52) — every one within 0.06 of the 0.5 flag line. No live row flipped. The closest false-positive call in the whole run is a supports row whose rerun probability is exactly 0.5 (not flagged because the test is `<`). [SOURCE: replay over calls.jsonl; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:76,962,1157-1174]

### F1-08 — The label set is the other half of the driver: 31 of 40 rows drifted by construction or label
The labels file holds 20 live (8 contradicts, 9 supports, 3 partial) and 20 constructed (15 contradicts, 5 partial, five since relabeled from contradicts to partial by the delegated arbiter). Both non-supports values score as drifted (`:613`), so the effective row set is 9 supports / 31 drifted. With that prevalence, flag-nothing scores 0.225 and the winnable set is 27 rows. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl; specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/032-decisions.md; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:609-631]

## Sources Consulted

- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (read in full, 1,398 lines; constants `:33-100`, census `:245-300`, draw `:404-480`, comparators `:540-664`, verdict `:670-708`, Jev arm `:1021-1211`)
- `~/.skilled/.labels/runs/032-jev-20261001/report.json` (full run record: census, labels hash, comparators, column, verdict line)
- `~/.skilled/.labels/runs/032-jev-20261001/calls.jsonl` (121 call records; replayed by this iteration)
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl` (40 rows, commit ebcc68e8edb4)
- `specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/scratch/evidence/labels/032-decisions.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:122` (live-run log row)
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md` (sibling measurement conventions)

## Assessment

- **newInfoRatio:** 1.0
- **Novelty justification:** First iteration of a fresh lineage; every finding here is new to this packet's research trail, and the kind-split replay (F1-05, F1-07) has not been published anywhere in the feature's records.
- **Confidence:** High for F1-01..F1-07 (source-reconstructed and independently replayed); high for F1-08 (labels file read directly). The replay depends on the calls log being the exact run that produced `report.json`, which the identical derived counts confirm.

## Reflection

- **What worked:** Reading the scorer end to end first, then replaying its arithmetic from its own call log. The replay matched the published column to the digit, so both the mechanics and the recorded run are now pinned.
- **What failed:** Nothing was attempted that failed. The kind-split question ("did construction rows inflate it?") was expected to confirm inflation and instead produced the opposite result — recorded as F1-05.
- **Ruled out:** "The constructed half is the easy half" — ruled out by the kind split (16/20 constructed vs 19/20 live). "The result is a threshold artifact" — ruled out by the five checks being fixed pre-run and passing independently (F1-01).

## Recommended Next Focus

Q2: How can the scan's accuracy be raised or its cost lowered? Start from the measured error shape (5 false negatives, threshold-adjacent, one supports row at exactly 0.5) and the cost shape (121 calls; latency p50 326ms; census and draw wall times).
