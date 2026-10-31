# 006 label decisions

Label file: `.skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl`, the committed rows file. 98 of 100 rows are labeled with `rubric: mimo-02-strict-v1` and `labeler: operator-delegated:opus-5.5-medium`.

## Rubric

The operator adopted rubric A, strict referent resolution (`mimo-02-strict-v1`), in chat on 2026-10-01. That closes task T001 of phase 006.

## Stale rows

Two rows point at lines of `005-compaction-recall-harness/goal.md` that moved after the draw: `:91` now sits at line 94, and the `:89` criterion was reworded and no longer exists. They stay unlabeled. Editing the drawn ids would change the sample, and a label on a moved line would go to `stale=` anyway (`P/spec.md:175`).

## Method

- Each criterion line was rendered under its id and hash-checked against `text_sha12` before drafting.
- Luna 6 max and SWE 2 max labeled blind under rubric A. They agreed on both booleans for 71 of 98 by id. Five rows matched only one draft, for two reasons (`gates.md`, Single-draft rows). The parser dropped SWE's first row, `071-cli-hermes-creation/002-hermes-contract-pin/goal.md:88`, because SWE printed it on the same line as its progress text, and its raw draft reads false/false. Luna rewrote four row ids into paths that do not exist, and its values under those ids are false/false, true/true, false/false and false/false. With all nine drafts matched by hand, the drafters agree on 74 of 98. No recovered draft was matched to its row before the arbiter ran, and the arbiter judged every row from its source.
- Opus 5.5 medium, run alone and delegated by the operator, settled every row.

## Arbiter rulings

- A phase, decision or requirement id fails rule 4 when the line relies on what it stands for. A folder in a path or a commit SHA is a locator and passes. "this phase" names the packet itself.
- A named command or artifact with a stated observable property passes rule 5. An unnamed check fails both rules.
- A parent line naming child folders and a stated status passes rule 5. A line needing the children's content, such as "every acceptance criterion Met", fails it.

## Census

`score-goal-lint.cjs --labels <rows file>`: `rubric=mimo-02-strict-v1 unlabeled=2 stale=0 labeled=98`.
- Rule 4: tp=61 fp=8 fn=17 tn=12, precision 0.8841, recall 0.7821, F1 0.8299.
- Rule 5: tp=1 fp=0 fn=74 tn=23, precision 1.0000, recall 0.0133, F1 0.0263.
- `labeled_violation_rate=79/98=0.8061 wilson95=[0.7169,0.8722]`, above the 0.05 stop rule, so the model arm stays buildable. Exit 0.

The lint finds rule 4 failures well. It almost never catches rule 5 failures: it flagged 1 of 75.
