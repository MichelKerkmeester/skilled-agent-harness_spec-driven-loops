# 034 label decisions

Label file: `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr-reader-lens-labels.jsonl`, the scorer's default path, 150 rows, `labeler: operator-delegated:opus-5.5-medium`.

## Method

- Draw: `hvr_reader_lens.py --draw --seed 20260929`, written first to the ignored `scratch/build/` folder, 50 rows per category, candidates 0, 2 and 25 as the phase's own draw recorded. All 150 section texts hashed to their `section_sha12`.
- The `candidate` flag (the comparator's baseline) was hidden from every labeler. Rows were shuffled under neutral ids.
- Luna 6 max and SWE 2 max labeled blind. They agreed on 94 of 99 shared rows in part a and on all 49 shared rows in part b. The parser dropped SWE's first row in both parts, SY01 and FA01, because SWE printed each on the same line as its progress text. Both raw drafts read `no`, the same as Luna and the arbiter, so the drafters agree on 95 of 100 and 50 of 50 (`gates.md`, Single-draft rows).
- Opus 5.5 medium, run alone and delegated by the operator, settled every row.

## Arbiter rulings

- Synonym cycling: only referring expressions that stand in for one another count. Headings, template slots, definitions, predicates, shared-head nouns and container-versus-content pairs do not.
- Significance inflation: the passage's main content must be a claim that something matters. A mentioned or quoted banned phrase, a label such as CRITICAL PATH, or an aphorism followed by concrete steps does not count.
- False ranges: a from-X-to-Y describing a change, move or navigation is not a range. Endpoints on one ordered axis, numeric spans, positional spans and process stages are `no`.

Result: synonym cycling 1 yes, significance inflation 1 yes, false ranges 0 yes.

## Session checks

- The arbiter found that Luna's part-a reasons for SY31, SY32, SY33, SY47 and SY49 describe the matching SI rows, so Luna gave no independent read on those five. The arbiter labeled them from the passages.
- Zero-call census: `no headroom` in all three categories and `stop: fewer than 2 categories can pass`, exit 0. The phase records this as its result, not a failure. The false-range comparator flags 25 genuine ranges and is right on 25 of 50, while flag-nothing is right on all 50.
