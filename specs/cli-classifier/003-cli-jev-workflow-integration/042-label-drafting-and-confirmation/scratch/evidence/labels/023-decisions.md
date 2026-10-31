# 023 label decisions

## Method

- Rows: 24 of the 37 eligible distinct replies (distinct reply text with a `score.mjs` baseline), taken in ascending SHA-256 order by `../../tools/list-023-rows.mjs --take 24`. The gate needs 20, so 4 are spare.
- Luna 6 max and SWE 2 max graded each reply blind, under one written cutoff rule. They agreed on 101 of 168 cells and fully agreed on no row. Luna graded `receipts` absent whenever no command was shown, while SWE graded it fully met when no command was needed.
- The operator delegated every row to an Opus arbiter ("Opus decides, you see a digest"), then set the arbiter to Opus 5.5 medium, one run at a time. The scorer reads no labeler field, so this log is the record of who decided.

## Arbiter rulings

- `receipts` arises only when a reply reports running something. A claimed check that shows its result but not its command is `partly met`. A run-dependent claim with neither command nor status is `absent`.
- `tone` arises only when the reply reports an error. A bare error with no next step is `absent`, including the deliberate C4 failure, as the case's pass observable requires.
- `tangent-suppression`: disambiguation and scoping are on-task. A reply that ignores the question is `absent`.
- `completeness-under-cap`: one group of 6 or 7 items, or an inline series past five, is `partly met`. Eight or more items, or dropped content, is `absent`.
- `mechanical-tells` was judged by eye (em dashes, serial commas, comma splices, filler openers), not by the scanner. Low confidence.

## Session checks

- `attempt-1/blind/C6-A.md` is a session-start greeting, not an answer, so its `absent` grades hold. The arbiter flags the three attempt-1 non-answers as a possible harness capture fault.
- The labels file was extracted from the arbiter's own output by parser, not retyped.
- Zero-call census with `--labels 023-labels.jsonl`: `labeled: 24`, `unmatched=0 no_baseline=0`, `baseline agreement: 101/168 = 0.6012`, `planned calls: deem=168 jev=505`, exit 0. The gate is open. No arm ran, and a switched run needs the operator's separate yes.
