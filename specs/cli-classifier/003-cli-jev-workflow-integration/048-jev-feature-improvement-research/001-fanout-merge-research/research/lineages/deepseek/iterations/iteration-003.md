---
title: "Iteration 3: Measurement trustworthiness — frame dependence, oracle dropouts, contested labels"
trigger_phrases: []
---
# Iteration 3: Measurement trustworthiness — frame dependence, oracle dropouts, contested labels

## Focus

Where the recorded verdict depends on frame choices rather than measured signal, and what evidence would make the measurement trustworthy: the baseline's identity, oracle dropouts inside the labeled set, the composition of the `different` class, label contestability, and artifact provenance.

## Actions Taken

- Reconstructed every labeled pair's two source findings from the tracked registries and applied the merge's own decision rule to them (active-disposition check for review).
- Recomputed the Keep Rule for two alternative zero-cost baselines (constant-`same`, lexical-overlap) from the recorded A and label counts.
- Read the full text of all 12 `different`-labeled pairs and matched the model's confident false-merges against them.
- Checked which identity fields the report and the census do and do not record.

## Findings

1. The `keep` verdict is frame-dependent: it survives only against a baseline that is structurally blind on the labeled class. Against a constant-`same` oracle (right on 48 of 60), Jev's margin is `10*(53-48) = 50 < M = 60`, which the Keep Rule orders before the sign test — `stop (margin)`. Against a zero-call lexical rule (Jaccard ≥ 0.4, right 53), the margin is 0 and the same `stop (margin)` applies. The printed p=1.232e-10 is the tail against the constant-`different` merge default, not against a competitive rule. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1120-1129] [SOURCE: ~/.skilled/.labels/030-labels.jsonl]

2. Four of the 60 labeled pairs are `undecidable` for the merge oracle, all four are labeled `same`, and all four are near-verbatim restatements (for example "Fan-out CLI worker serializes lineages despite the concurrency cap" vs "fanout-run serializes CLI lineages despite a concurrency cap"). Jev called all four `same` at 0.73–0.94. The scorer counts an undecidable oracle as simply wrong (`onDecision === label` never matches), so these pairs enter W as free column wins and B as forced baseline misses; nothing in the report identifies them. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:488-508] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:522-537]

3. The `different` class that anchors B=12 is dominated by one review run's dimension labels. Eight of the twelve `different` pairs come from a single run (`030-mode-sk-prefix-rename`, composer-2-5 vs composer-2-5-r2) whose texts are bare dimension names — "security" vs "correctness breadth", "maintainability breadth" vs "final traceability sweep". These are trivially different to any reader; specificity of 9/12 is earned mostly there, and the remaining four `different` pairs carry the genuinely hard discrimination. [SOURCE: ~/.skilled/.labels/030-labels.jsonl]

4. Three of the twelve `different` labels are contested by confident model reads of near-verbatim pairs: "Packet completion metadata not reconciled (graph-metadata Status=planned vs impl-summary 100%)" vs "completion-metadata mismatch: graph-metadata Status=planned vs impl-summary 100%/committed"; "Maintained CLI READMEs retain retired scripts topology" vs "Current subordinate READMEs retain retired scripts topology"; and one same-defect-different-granularity pair. The model answered 0.59–0.93 `same`. If those three labels flip, the column scores 56/60; if the arbiter's notion of `same` is "same finding identity" rather than the question put to the model ("describe the same problem"), the gold and the model are answering different questions. With one arbiter and no second rating, the measurement cannot adjudicate. [SOURCE: ~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:82]

5. Label-set identity is not recorded. The report stores `labeled: { K: 60, dropped: 0 }` — no file digest, labeler, date, or per-pair oracle decision; the requalify check pins the model (`requalify: model changed`) but not the gold. A later run cannot prove which labels a verdict was measured on, and the paper trail for a re-read is the label file's existence, not its content identity. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1475-1486] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1034-1041]

6. The measurement is split across the repo boundary by design: the pair sheet refuses any path inside the repository, and the labels, report and `calls.jsonl` live under `~/.skilled/.labels/`. The census half reproduces exactly in-tree (re-run in this worktree), but the verdict half cannot be recomputed from the repository — and the census's `git ls-files` frame silently excludes uncommitted run artifacts, which is correct for shadow replay but must be stated whenever the numbers are quoted. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:560-565] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:111-118]

7. A trustworthy protocol is mostly assembly, not new machinery: pre-register the baseline and threshold before labeling; add a second rater on at least the 12 `different` labels and report agreement; stratify the label set by class so near-line pairs are manufactured or the class is declared unmeasured; record a label digest, per-pair oracle decision and per-order answers in `report.json`; and report oracle dropouts as their own bucket instead of counting them as baseline errors. All five are changes to how results are read and recorded, not to the call shape. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1475-1486] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:1226-1247]

## Ruled Out

- "The verdict is reproducible from the repository": only the census is; the labels and model calls are out-of-tree by design.
- "The 60 labels are 60 clean oracle-scorable comparisons": four are oracle-undecidable and three of the `different` set are contested.

## Next Focus

Iteration 4 — where else in `.skilled` the same same-or-different judgment pays off: surfaces that currently decide identity with exact keys, codes, or lexical overlap.

## Sources

- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`
- `~/.skilled/.labels/030-labels.jsonl`
- `~/.skilled/.labels/runs/047-030-jev-20261002/calls.jsonl`, `report.json`
