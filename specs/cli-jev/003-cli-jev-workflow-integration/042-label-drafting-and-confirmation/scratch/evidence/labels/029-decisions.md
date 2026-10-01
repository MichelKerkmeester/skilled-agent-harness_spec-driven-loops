# 029 label decisions

The label file carries finding text, so it lives outside the repository at the operator-named folder: `~/.skilled/.labels/029-labels.jsonl` (mode 600). This log carries no finding text.

## Method

- Sheet: `score-severity-replay.cjs --write-label-sheet`, 95 P0 rows, written to the session scratchpad.
- Rendered blind under ids F001 to F095. Finding ids and severity fields were hidden because ids carry the recorded severity. Each row showed registry, dimension, title, location, description, evidence refs and recommendation (54 rows record no recommendation).
- Luna 6 max and SWE 2 max labeled blind in two parts. They agreed on 86 of 94 shared rows. The parser dropped SWE's first row, F001, because SWE printed it on the same line as its progress text. The raw draft reads `real`, so the drafters split on it and agree on 86 of 95. The arbiter did not see that draft. Its fixture ruling below settles the row either way (`gates.md`, Single-draft rows).
- Opus 5.5 medium, run alone and delegated by the operator, settled every row.

## Arbiter rulings

- A test-fixture registry row is synthetic input, so F001 is `not_a_finding`.
- Shipped code, config or a gate breaking the normative contract, or a tool reporting a false PASS, is `real`. One doc disagreeing with another is P2 for stale status text and P1 for stale normative requirements or an unproven Complete claim.
- Thin evidence counts only when the title names a concrete reachable failure, or a sibling lineage or archived iteration supplies the mechanism.
- `real` needs a reachable wrong result, crash, hang, data loss or escaped trust boundary. Test or validation gaps, churn, recoverable flaps and unreached defaults are P1.

Result: real 73, P1 12, P2 9, not_a_finding 1. The arbiter differs from Luna on 5 rows and from SWE on 9, counting the recovered F001.

## Census

`score-severity-replay.cjs --labels ~/.skilled/.labels/029-labels.jsonl`: `labels dropped: 0`, `baseline: right 73 of 95`, `gate: open K=95 negatives=22`, exit 0. No arm ran, and a switched run needs the operator's separate yes.
