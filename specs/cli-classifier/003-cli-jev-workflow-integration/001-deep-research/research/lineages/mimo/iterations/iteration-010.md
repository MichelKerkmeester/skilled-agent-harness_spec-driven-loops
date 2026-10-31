# Iteration 10 — mimo-10: Smallest-first build order, measurement view

**Lineage:** `mimo` (UX and measurement lens) — wave 4, final iteration
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-10` — Smallest-first build order, measurement view
**Angle question:** Which slice produces a usable number soonest, and which ideas must wait until a gold set exists?

## Sibling check

Both siblings complete at 10 (deepseek-010: routing arm then grader, each with LOC and rollback; grok-010: routing arm first and nothing else until its delta, with a kill radius covering the closed-set `choice` family). I agree with the first position and add the measurement view neither carried: three of the first four steps cost zero Jev calls, so the first usable numbers arrive before any spend.

## The ordered list: what each slice unlocks

| # | Slice | Cost | Unlocks (the measurement it produces) | Gate to start |
|---|---|---|---|---|
| 1 | Routing eligible-row census plus P0 corpus census (both local, no key) | 0 calls | The two unknown denominators: how many corpus rows a tie-break could move (mimo-02) and how many surviving P0s exist corpus-wide (mimo-05). These are the first genuinely new numbers and they decide whether slices 5 and 6 are alive | none |
| 2 | The shared 30 to 50 excerpt labeled set (operator labels) and the reviewer-fixture class expansion (pass and block cases) | 0 calls, operator time | Every goal, done-gate and grader measurement downstream (mimo-08's two gates) | none |
| 3 | Routing arm phase 1 with the per-call latency and cost record | first billed calls (100 to 300, cents) | Gap row 1 (latency and cost per call), grok's kill-criterion verdict on the closed-set `choice` family, and the deadline drop-or-revive decision for every hook-shaped idea (mimo-09) | slice 1 census must show eligible rows |
| 4 | Stop replay local arms (recorded versus heuristic over all eligible archived lineages) | 0 calls | The current stop model's trade curve, which nobody has measured; if the heuristic already stops at the derived gold, every stop-shaped idea dies here | none |
| 5 | Stop replay Jev arm (25-lineage sample) | 125 to 250 calls | Whether a Jev stop signal beats the heuristic at zero first-appearance loss; gates the confirm-mode suggestion | slice 4's heuristic curve exists |
| 6 | Severity replay Jev arm | 69 to a few hundred calls | P0-survival recall and reread reduction; gates the P0 reread order | slice 1's P0 census shows at least 20 surviving positives |
| 7 | Done-gate measurement on the labeled set | under 100 calls | The regex's measured false-fire rate and the fix choice, possibly ending in a regex change with zero Jev code | slice 2's set exists |
| 8 | Grader agreement runs (`llm` versus `jev`) | 40 to 100 calls | Grader agreement with oracle; the first honest number only after fixture expansion and the runner-path verification (mimo-08) | slices 2's fixture expansion and the `--scorer reviewer` path check |
| 9 | Goal shadow design review | 0 calls until built | Nothing until slices 2 and 3 land; grok-08's wrapper rule applies | labeled set, latency number, wrapper rule |

Rollback for every slice above is the same sentence: delete the new script and its reports; no existing file is modified except where a slice explicitly names one (the fixture expansion edits fixtures, the grader branch edits the factory).

## Ideas parked on a named gap

| Idea | Named gap it waits on | What frees it |
|---|---|---|
| Goal verifier shadow (mimo-03 idea 1) | "Goal verifier accuracy" gap: no labeled transcripts | Slice 2's set, plus grok-08's wrapper rule as a build constraint |
| Compaction keep-or-drop (mimo-03 idea 2) | "Compaction recovery quality" gap: no transcript-plus-must-survive-facts set, and the cache-breakage cost is unmeasured anywhere | A new transcript set (10 to 15 transcripts) and a cache-cost measurement first |
| Clarify suggested default (mimo-06 idea 2) | "Clarify and defer accuracy on 13 existing rows": 3 clarify rows and no recorded clarify rate | A 30-plus-row clarify gold build plus a breadcrumb count of real clarify frequency |
| Defer shadow recording (mimo-06 idea 3) | 10 gold rows and no decision attached | Same gold build; and an answer to who would ever read the log |
| P0 reread order (mimo-05 idea 2) | P0 positives are sparse (6 in the 12-registry sample) | Slice 1's corpus-wide P0 census; under 20 positives the recall claim is unprovable |
| Second-rater novelty column (mimo-04 idea 3) | No record of decision-relevant disagreement | Slice 5's replay disagreement analysis |
| Any live hook-shaped revival (mimo-09's lever) | "Jev latency and cost per call" gap row | Slice 3's p95 number: under a few hundred ms the 3 s-hook shapes reopen, at seconds they stay dead |
| PR-claims verify step (mimo-07 idea 6) | No labeled PR-claims corpus, and the recipe is npm `jevctl`-shaped | A port to the Python contract and a labeled corpus; advisory only, never a merge gate |

## The measurement-view disagreements with the sibling orders

1. **The grader is not slice 2 for measurement purposes.** Deepseek-010 puts the D4 `jev` grader second. Its agreement number is unquotable until two checks pass (mimo-05's 8-case single-class census; mimo-08's runner-path correction: `reviewer-regression.json` routes through `--scorer reviewer`, not `--scorer 5dim`). The grader build can be second; its number cannot be believed second. Order its measurement after slice 8's gates.
2. **Free numbers first.** Both sibling orders begin with a billed arm. Slices 1, 2 and 4 cost zero Jev calls and produce the denominators the billed arms need. The first dollar should follow the first denominator, not precede it.
3. **Agree with grok's kill criterion, extend its radius note.** A routing-arm loss kills the closed-set `choice` family (its list: severity `choice`, `next_check`, goal `choice`). My addendum: it does not kill the `score`-shaped severity replay (mimo-05 uses ordered levels, a different shape) and it does not kill measurement infrastructure; a loss changes what gets built, not what gets measured.

## Hand-off (to the synthesis)

- The ordered list above with each slice's unlocked measurement; slices 1, 2 and 4 are free and land first.
- The parked table with named gaps; nothing parked is a rejection.
- The one decision the synthesis must carry for the operator: whether to fund the measurement program at all (slices 1 to 8, cents of calls and operator labeling time) before any product surface, or to take grok's minimal bet (routing arm only) and let its kill criterion decide the quarter.
- Every keep-threshold is written in mimo-08; the synthesis ranks verdicts against those thresholds, not against hopes.
