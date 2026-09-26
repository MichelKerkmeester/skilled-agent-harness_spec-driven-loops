# Agent-interface improvements from the dogfood loop — 2026-08-24

Implements the three improvements identified in `dogfood-loop-2026-08-24.md`,
plus one runtime bug and one misleading query discovered while verifying them.

## 1. Malformed `runs` queries now error

`supercov runs <run-id> <anything-but-coverage>` (e.g. forgetting the word
`coverage`) previously printed the run listing silently. It now fails with
`UNKNOWN_COMMAND` and exact usage, in both text and `--json` envelopes.
`supercov runs <run-id>` alone errors the same way. `supercov runs [--flags]`
still lists runs. (`resolveCoverageQueryInvocation` in `src/query.ts`.)

## 2. Per-decision grouping for gap selection

`coverage file <source-file> --group decision [--sort location|missing]` lists
each decision with missing conditions as one row: location, decision ID,
`missing n/m`, waived count, and a flattened source snippet. Default order is
source order; `--sort missing` orders by unwaived missing count. Totals cover
the whole file; pagination covers rows. JSON mirrors the text. `--group` is
`file`-only and MC/DC-only (`--metric mcdc` or omitted) by explicit validation.

## 3. Reviewed MC/DC waivers (`supercov.waivers.json`)

`{"version":1,"waivers":[{file, decision?, line?, condition, reason}]}` at the
project root records that a condition has no satisfiable independence pair.
Matching: decision by ID or whitespace-insensitive source text, optional
`line` disambiguator (identical decisions can exist at several lines — found
in practice with `process.platform === "win32"`), condition by source text or
positional `C<n>` (requires a decision). Reasons are mandatory.

Waivers never change measured coverage. Raw totals keep waived conditions;
summary adds `waivers: N applied, N contradicted, N unmatched` and a separate
`MC/DC excluding waived` figure; contradicted (condition actually covered) and
unmatched entries are listed individually. Gap/file/decision views annotate
waived conditions with the reason. `src/waivers.ts`, wired through
`src/query.ts`; unit-tested in `tests/unit/waivers.test.ts` and end-to-end in
`scripts/agent-query-eval.mjs`.

This repository carries **8** reviewed waivers, all AST-structural
impossibilities: `isSourceSensitiveFunction`'s parent-node invariants (a
parent's only expression child cannot simultaneously be a different child) and
the parser's absent `createParenthesizedExpressions`.

**Rule learned by dogfooding (2026-08-24):** three further waivers were written
for browser-only and Windows-only conditions and then deliberately removed. A
waiver asserts *no satisfiable independence pair exists* — not "our CI does not
run that platform." Environment-unreachable conditions are genuine coverage
gaps that Windows CI (spike S3) and browser fixtures will close, and labelling
them "reviewed" would hide exactly what the mechanism exists to expose. The
`line` disambiguator is also brittle by design: editing anything above a
waived condition shifts it and the waiver is then reported `unmatched` — which
is how these three were caught. Prefer source-text matching without `line`.

## 4. Runtime bug: buffered evidence destination must be pinned

Found while verifying: a new transport test that briefly deletes
`SUPERCOV_SERVER_EVIDENCE_ROOT` mid-test silently lost **all 363 of its own
evidence records**. Root cause: `appendServer` captured the buffered write
path from the environment at the attempt's *first record*, while the reader
(`writeRunnerEvidence` → `readScopedServerEvidence`) re-derived the path from
the environment at *emit* — the exact divergence the comment in
`src/nodeTest.ts` claimed was prevented. Any test legitimately mutating
Supercov's public environment mid-attempt lost its coverage without a trace.

Fix: `beginBufferedServerEvidence` now pins directory and path at attempt
start; `flushBufferedServerEvidence` returns the pinned path; the node:test
adapter passes it to `writeRunnerEvidence` so readback never re-derives it.
Regression tests: "keeps buffered evidence on the destination pinned at
attempt start" (unit) and the env-mutating transport test (self-run E2E).

Debugging note: the loss was invisible in summary numbers until a diff was
taken; nothing flagged "this test produced zero evidence records despite N
assertion phases." A per-test diagnostic for empty evidence with non-empty
phases would have found this in one query — candidate future work.

## 5. `covers` no longer claims unmeasured lines are "uncovered"

`coverage covers <file:line>` for a line with no line obligation (e.g. the
middle of a multi-line condition) previously printed "uncovered; no covering
tests" — indistinguishable from a real gap; it cost this session a long false
regression hunt. It now reports "has no line obligation" and lists the
obligations anchored at that line with their coverage (e.g.
`decision 56:7 [a364b4f8] covered (10/10 conditions)`).

## State after this session

- 157 native tests, types, node:test integration, distributed merge, and the
  agent-query fixture all pass.
- Latest self-run `2026-08-24T12-24-49-530Z`: lines 56.18%, branches 36.45%,
  MC/DC 24.11% (364/1510), 24.28% excluding the 11 waived conditions,
  103 assertion-linked conditions, measurement complete.
- Harness note: running `scripts/node-test-integration.mjs` standalone wipes
  the `generic-node` fixture store that `agent-query-eval.mjs` depends on;
  re-seed with `scripts/distributed-merge-integration.mjs`. In `test:fixture`
  the order already guarantees this.

## Next

- Continue closing `src/query.ts` gaps (227 missing MC/DC — grew with these
  features; the new tests cover routing but not the view branches).
- Per-test "zero evidence despite phases" diagnostic (see §4).
- `src/runtime.ts` process-level fixture harness; `src/playwright.ts` fixture
  work; docs reconciliation still pending from the handoff.
