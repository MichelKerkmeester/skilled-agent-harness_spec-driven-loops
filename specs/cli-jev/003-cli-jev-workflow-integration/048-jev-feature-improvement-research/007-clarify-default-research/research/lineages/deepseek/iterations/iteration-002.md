---
title: "Iteration 2: Cost and accuracy levers, scored from the recorded calls"
trigger_phrases: []
---
# Iteration 2: Cost and accuracy levers, scored from the recorded calls

## Focus

Q2: which changes raise the column's accuracy or lower its cost, each recomputed against the recorded
163-call run and reported with its own call count and Keep Rule outcome.

## Actions Taken

- Recomputed the verdict under seven call-shape counterfactuals from `calls.jsonl` + labels only: no new
  model call was made.
- Measured single-order accuracy, the early-stop call count, tie-rule variants, and the none-recall
  ceiling.
- Classified all 22 none-row misses by prompt shape to bound the accuracy levers.

## Findings

1. **The third call never changes a pick; it only breaks ties.** When orders 0 and 1 agree, the recorded
   third vote can only produce a 2-1 majority for that same pick, so an early stop after two agreeing
   orders leaves every pick and the verdict identical. 45 of 54 rows agree on their first two orders,
   so the pass costs 45x2 + 9x3 + 1 auth = 118 calls instead of 163 — a 27.6 percent cut with byte-equal
   output. [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:597-619]

2. **A deliberate tie rule beats the implicit one.** Under the recorded three calls, a split row is
   broken by the third rotation. If instead a disagreement is answered `none_of_these`, the column's A
   rises from 28 to 31 (W=22, L=6, still F=10) while the pass falls to 109 calls — 33 percent fewer for
   three more right answers. The gain is exact: splits f020-002, 003, 013, 020 and 052 are none-rows
   (right), f020-015 and 034 are mode-rows (lost), f020-029 and 050 were already wrong.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

3. **One call is as accurate as three.** Single-order accuracy is 28/54 (order 0), 28/54 (order 1) and
   29/54 (order 2); all three keep, and order 2's sign test is the strongest (p=0.001288, W=17, L=3).
   The 108 extra calls therefore buy stability and an evidence trail, not point accuracy: the three-call
   majority's 28 is one row below the best single order. If the product only needs a best guess per
   clarify, the cheap shape is one call, or two with the abstain rule above.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

4. **The accuracy ceiling sits in one recognizer.** All 22 none-row misses are two-mode co-requests —
   prompts whose own alternatives are the two modes they name ("X and Y", "X or Y", "compare X and Y").
   With none-recall perfect and mode accuracy unchanged, A = 50 of 54; recovering half the misses gives
   A = 39 and a margin of 240 against a threshold of 54. Accuracy work should target exactly one
   behavior: "the request needs both listed modes, so neither is the default".
   [SOURCE: ~/.skilled/.labels/020-rows.jsonl]

5. **The levers for that behavior are text-level and frozen by the contract.** The `-q` instruction is
   fixed at "Which workflow mode should handle this request?" and the none option text at "None of these
   modes"; both were pinned before the run, so changing either is an amendment to REQ-006, not a knob.
   The corpus argues for it: "None of these modes" never names the both-and case, and the none-marked
   rows are that case 22 times out of 22 misses. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:45-46]
   [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md:144]

6. **The four loss rows share one instruction-shaped fix.** Each names a surface ("OpenCode TypeScript",
   "Webflow") that is itself an alternative; the label follows the requested action ("quality checks").
   A rule of the form "answer the mode that performs the requested action; a named tool or surface is
   context" targets exactly these rows — and would have to be measured, since the instruction cannot be
   changed inside a frozen run. [SOURCE: ~/.skilled/.labels/020-rows.jsonl]

7. **Live cost is dominated by latency, not tokens.** The scorer's own payload estimate is 19,446 input
   tokens for 163 calls, about 119 tokens per call; a live clarify at three calls is roughly 357 tokens
   and about one second of wall time (recorded mean 332 ms). The early stop brings the mean to ~2.2 calls
   (~0.72 s). At the measured committed-prompt rate (3 clarifies in 361 prompts), even the full shape is
   negligible in tokens; the cost that matters is adding a synchronous second to a routing path.
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev.stdout.txt]
   [SOURCE: ~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl]

8. **A two-order shape changes what F means.** The flips statistic assumes three orders (F sums order
   dissents and the gate is 10*F <= 3*M). A two-call shape has no third vote, so `F` and the `unstable`
   count would need a redefinition before the keep rule could judge it; the current run is the first
   measured pass and any redefinition re-opens the frozen Keep Rule.
   [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:642-677]

## Ruled Out

- "More calls buy accuracy": three-call majority 28 vs single-call best 29 — the extra calls buy
  stability, not point accuracy.
- "A confidence threshold can gate the suggestion": right and wrong picks have the same mean probability
  (0.678 vs 0.688), so there is nothing to threshold.
- "The cheaper shapes would change the verdict": every recomputed variant — early stop, two-call abstain,
  tie-to-first, any-none, single-order — still prints `keep`; the verdict is robust to the call shape,
  which is itself a result about what the corpus measures.

## Next Focus

Iteration 3 — Q3: what the measurement records, what it fails to record, and the checks that would make
the keep trustworthy (label digests, action verification, baseline framing, split reproducibility).

## Sources

- `~/.skilled/.labels/runs/047-020-jev-20261002/calls.jsonl`, `report.json`
- `~/.skilled/.labels/runs/047-020-jev.stdout.txt`
- `~/.skilled/.labels/020-rows.jsonl`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/spec.md`
