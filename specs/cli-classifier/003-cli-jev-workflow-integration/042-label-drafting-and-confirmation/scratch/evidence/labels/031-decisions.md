# 031 label decisions

Fixture: `~/.skilled/.labels/031-fixture.jsonl` (mode 600), outside the repository as the scorer requires, 36 rows, sha256 `e7b550ebca17704b0f8eb935335bff0ed277e46831dfa389ff032d7711f7d2ec`.

## Method

The census mines 0 rows, so the fixture had to be authored, in three steps:

1. Luna 6 max wrote 36 rows from 36 distinct fix commits (`git log --grep='^fix'` since 2026-06-01). Each row freezes the moment before the fix, and about a third of the claims are meant to be wrong. All 36 source SHAs resolve. No field exceeds 300 characters, and a secret-shape scan found nothing.
2. SWE 2 max labeled the same rows blind, from symptom, claim and evidence only. Luna and SWE agreed on 12 of 36. SWE chose `read_code` on 29 rows, partly because the brief told it to break ties toward the earlier option.
3. Opus 5.5 medium, run alone and delegated by the operator, checked every row against `git show <source>`. It rejected none, edited three (d14 symptom, d18 claim, d35 claim) and settled every label. It was told not to inherit SWE's tie-break.

## Arbiter rulings

- Tie rule: a claim about what code or config says is `read_code`. A claim about a runtime value that is easy to misread (shell word splitting, CommonJS interop, git root resolution) is `run_test`.
- A nearly settled claim takes the single cheapest step that finishes it.
- The label is the first thing a careful engineer would do, not the step the real fix ended up using.

Result: read_code 29, run_test 5, reproduce 1, instrument 1. Every row is `jev_ok: true` because its text comes only from public tracked commit messages. The arbiter differs from Luna on 20 rows and from SWE on 8. The eighth is d01: the parser dropped SWE's first row because SWE printed it on the same line as its progress text, and its raw draft reads `instrument` where the arbiter chose `reproduce`. The arbiter did not see that draft, and it judged d01 against its fix commit (`gates.md`, Single-draft rows).

## Census

`score-debug-next-check.mjs --fixture ~/.skilled/.labels/031-fixture.jsonl`: `fixture: rows=36`, `labels: read_code=29 run_test=5 reproduce=1 instrument=1`, `baseline: read_code 29/36`, keep-rule line printed, exit 0. The gate is open: 29/36 is under the nine-tenths no-headroom line. No arm ran, and a switched run needs the operator's separate yes.

## Note

The rows are drawn from this repository's recorded fixes, not from the operator's own memory, which the card had expected. That is the closest public stand-in, and every row traces to its commit.
