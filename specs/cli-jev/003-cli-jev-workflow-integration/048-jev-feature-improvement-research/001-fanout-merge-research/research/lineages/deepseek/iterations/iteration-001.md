---
title: "Iteration 1: Anatomy of the measured verdict — corpus geometry, baseline blindness, label composition"
trigger_phrases: []
---
# Iteration 1: Anatomy of the measured verdict — corpus geometry, baseline blindness, label composition

## Focus

What drove `verdict jev: keep K=60 M=60 A=53 B=12 W=44 L=3 F=3 p=1.232e-10`: the census geometry, the structure of the merge's own decision, the composition of the 60 labels, and the per-pair behavior the aggregate hides.

## Actions Taken

- Read `fanout-merge.cjs` (full), `score-fanout-pairs.cjs` (full), the `step_fanout_merge` step in `.skilled/commands/deep/assets/deep-research-auto.yaml`, and the state-log contract in `fanout-run.cjs`.
- Re-ran the zero-call census in this worktree; it reproduced the recorded 2026-10-02 census line for line.
- Analyzed the recorded measurement artifacts the goal cites: `~/.skilled/.labels/030-labels.jsonl` (60 rows) and `~/.skilled/.labels/runs/047-030-jev-20261002/{report.json,calls.jsonl,stdout}` (read-only, no model calls made).
- Recomputed the verdict's decomposition from the 180 recorded judgment calls.

## Findings

1. The labeled corpus is a single class. The census found `class near-line: research=0 review=0` and `class cross-body: research=19 review=105` across 57 research and 47 review tracked runs, and the recorded 60-row label set is 100% `cross-body`. The near-line class — the only class where the merge's own collapse rule (body-key equality plus title overlap ≥ 0.15) can ever apply — contributes zero measured pairs, so the verdict carries no evidence about the 0.15 threshold it is often read as validating. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:50-56] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:370-376] [SOURCE: ~/.skilled/.labels/runs/047-030-jev.stdout.txt]

2. The baseline in the measured fight is structurally constant. The merge folds two findings only when their body keys (`summary|description|finding|question|direction`) are equal; every cross-body pair differs in body key by construction, so on all 124 classed pairs the merge answered `different` under both settings — the recorded report's decision table reads `dedup-on same=0 different=124` and `dedup-off same=0 different=124`. B=12 is therefore not an achievement of a functioning deduplicator; it is exactly the count of pairs the arbiter labeled `different`, which a constant-`different` oracle would also score. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:345-354] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:399-402] [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/report.json]

3. The 48:12 same-to-different label split, not per-pair performance, sets the verdict's asymmetry. W=44 is exactly the number of `same`-labeled pairs Jev got right (a constant-`different` baseline is wrong on all of them) and L=3 is exactly the number of `different`-labeled pairs Jev called `same`. With A=53=44+9, B=12=9+3, the win/loss split is arithmetic over the label mix; the sign test is a test of "beats a constant" on a corpus that is 80% `same`. [SOURCE: ~/.skilled/.labels/030-labels.jsonl] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1188]

4. The printed p-value is the exact binomial tail for 44 wins of 47 disagreements. `decideVerdict` computes the win tail as `binomialTail(W, W+L)`; with W=44 and W+L=47 that is `(C(47,44)+C(47,45)+C(47,46)+C(47,47))/2^47 = 17344/2^47 = 1.2324e-10`, matching the printed `1.232e-10`. The margin gate passes because `10*(A-B) = 410 >= M = 60`, a quantity dominated by the label split rather than by model advantage over any real rule. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1099-1108] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1120-1129]

5. Per-pair, Jev is a high-recall, moderate-specificity judge: sensitivity 44/48 = 91.7%, specificity 9/12 = 75%, precision 44/47 = 93.6%. The four `same` misses all sit just under the 0.5 cut (mean probabilities 0.37–0.48); the three `different` misses are confident false-merges at 0.68–0.93, i.e. the errors are not symmetric noise. [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1086]

6. The AB/BA/AB call shape creates a biased tiebreak that manufactured two of Jev's four `same` misses. Two pairs split between the orders (`0.45/0.58/0.45` and `0.37/0.55/0.42`), both labeled `same`; the third call repeats AB, so the 1–1 tie was broken by a second AB vote and both pairs were decided `different`. Had BA decided the tie, or had "either order says same" been the rule, both pairs would have been correct and A would be 55. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:86-87] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:983-993]

7. The verifier accepted the Jev calls as measured with F=3 flips out of C=180 calls: three pairs were 2–1, 57 were 3–0 after three calls. The model's order-to-order stability is high; the errors are mostly threshold/calibration and tiebreak artifacts, not sampling noise. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1174-1182] [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/report.json]

8. The measured run's real cost is 181 calls (180 judgments plus one auth test), 11,752 estimated input tokens and 58.2 s of summed per-call wall time (63.1 s wall) for 60 pairs. The census itself is zero-call and reproduced identically in this worktree, so the corpus geometry is reproducible while the model verdict depends on recorded, out-of-tree artifacts. [SOURCE: ~/.skilled/.labels/runs/047-030-jev.stdout.txt] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:111-118]

## Ruled Out

- "The verdict demonstrates the merge's collapse rule is defeated on its own near-line turf": no near-line pair exists in the tracked corpus, so the class is unmeasured, not won or lost.
- "Near-duplicate dedup would have done better than the shipped default": both settings make identical decisions on all 124 classed pairs, so the `baseline=dedup-off` naming chooses between two byte-identical oracles on this corpus.

## Next Focus

Iteration 2 — cost and accuracy levers supported by the recorded calls: the redundant third call, the order-biased tiebreak, and threshold calibration.

## Sources

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.skilled/commands/deep/assets/deep-research-auto.yaml`
- `~/.skilled/.labels/030-labels.jsonl`
- `~/.skilled/.labels/runs/047-030-jev-20261002/report.json`, `calls.jsonl`, `047-030-jev.stdout.txt`
