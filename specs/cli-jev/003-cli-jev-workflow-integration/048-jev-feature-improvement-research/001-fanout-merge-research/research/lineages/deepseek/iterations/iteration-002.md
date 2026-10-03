---
title: "Iteration 2: Cost and accuracy levers — call shape, tiebreak bias, threshold calibration"
trigger_phrases: []
---
# Iteration 2: Cost and accuracy levers — call shape, tiebreak bias, threshold calibration

## Focus

Which changes to the measured call shape, tiebreak rule and decision threshold are supported by the 180 recorded judgment calls: where can calls be removed without changing the verdict, and where can accuracy be raised without adding calls.

## Actions Taken

- Re-derived the modal rule's behavior over the recorded per-order calls for all 60 pairs.
- Simulated the 2-call early-stop variant and both tiebreak variants (AB-decides, BA-decides, OR, AND) against the labels.
- Swept `SAME_AT` over 0.35–0.85 and compared against three zero-call lexical rules (Jaccard and containment over the same `text_a`/`text_b` the model reads).
- Recomputed the flips gate (`10*F > C`) for the early-stop variant.

## Findings

1. The third call is decision-redundant on any pair whose first two orders agree, and 58 of the 60 recorded pairs were unanimous after two calls. Under the modal rule a pair with two agreeing calls already has its modal answer; a third call can only produce 2–1 or 3–0, so the answer cannot change. Stopping after AB+BA when they agree yields 122 judgment calls plus one auth test (123 total versus 181, −32%), while A=53, B=12, W=44, L=3 and the keep verdict are unchanged; only F drops 3→2 and C 180→122, and the flips gate still passes (`20 <= 122`). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:86-87] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1155-1188] [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl]

2. The current tiebreak is order-biased and cost two correct answers. `JEV_ORDERS` is `AB, BA, AB`, so a 1–1 split is broken by a second AB vote. Both recorded split pairs (`0.45/0.58/0.45` and `0.37/0.55/0.42`) were labeled `same` and BA held the `same` side; the AB repeat made both `different`. Scoring the first two calls with a symmetric rule — either order says same → same, or BA decides — gives A=55 instead of 53, with no extra calls. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:86-87] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1174]

3. The 0.5 cut is suboptimal on the recorded corpus and nothing between 0.35 and 0.5 is gained by it. At threshold 0.4 the column scores 57/60 (sensitivity 48/48, specificity 9/12); at 0.5 it scores 53/60 (sensitivity 44/48, specificity 9/12). All four `same` misses sit at 0.37–0.48 and no `different` pair sits between 0.35 and 0.5, so specificity is unchanged across the range. This is post-hoc on the same 60 labels and needs a pre-registered held-out set before shipping. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1086] [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl]

4. Beyond threshold, calibration is clean and the residual false-merges are model-level, not cut-level. Mean-probability bins below 0.3 are 0% `same` labels (9 pairs), 0.4–0.6 is 7/7 `same`, 0.6–0.8 is 18/19, and 0.8–0.95 is 23/25; the three false-merges sit at 0.59–0.93 and cannot be removed by any threshold that preserves the 48 `same` pairs. [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl]

5. Per-call economics: mean 323 ms, median 318 ms, max 468 ms per judgment — versus the 90,000 ms per-call timeout, a 190× headroom that turns one hung call into a two-minute wait. The 11,752 estimated input tokens over 181 calls are ~65 tokens per call because `stateText` resends both findings and the question each time; the early-stop variant cuts both calls and payload by roughly a third. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:93] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:774-778]

6. A zero-call lexical rule over the same text already ties the shipped model column: Jaccard ≥ 0.4 scores 53/60 and token-containment ≥ 0.6 scores 53/60 on the labeled set, equal to Jev at its shipped 0.5 threshold and still under the headroom gate (`baseline.right > 54` needed to close). Any claim that Jev adds measurable value must be stated against these cheap rules, not only against the structurally blind merge default. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:70] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:651-669]

7. The AB/BA sampling design also wastes its stability signal: the mean BA−AB shift is +0.029 with median absolute difference 0.04, so order effects are small but consistently tilted toward BA (the second reader position reads slightly more similar). A symmetric aggregation (mean of the two orders before the cut) keeps the noise-averaging the design pays for while removing the position asymmetry. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:86-87] [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl]

## Ruled Out

- "More calls per pair raise accuracy": 57 of 60 pairs were already unanimous after two calls; the third call changed no correct answer and harmed two.
- "Raising the threshold improves specificity": specificity is 9/12 at every threshold from 0.35 to 0.5; the residual false-merges are confident and cut-insensitive.

## Next Focus

Iteration 3 — measurement trustworthiness: what the verdict has to assume, where frame choices (baseline, class coverage, labeler, artifact location) change the reading, and what evidence would settle it.

## Sources

- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`
- `~/.skilled/.labels/030-labels.jsonl`
- `~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl`, `report.json`
