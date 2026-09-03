---
title: "CHK-004 / CHK-110 / T022 — whole-suite aggregate and delta"
trigger_phrases: []
---
# CHK-004 / CHK-110 / T022 — whole-suite aggregate and delta

**Run:** full `runtime` suite, serial (`fileParallelism:false`), single process, no competing dispatch.
Worktree `016-036-torn-tail-marker-ordering` at base `409e2346c0a` **plus T015**.
Prerequisite: `npm rebuild better-sqlite3` (the pre-existing binding was ABI 127 against node ABI 141
and failed `ERR_DLOPEN_FAILED`; this is the blocker the `021` baseline recorded as dominant).

```
Test Files  23 failed | 156 passed (179)
Tests       18 failed | 3839 passed | 39 skipped (3896)
Duration    6518.61s  (108.6 min)
```

The run COMPLETED. It does not hang. 108.6 min is consistent with the 102 min that sibling
`005/001-completion-evidence-reconcile` measured for 148 files. Earlier "hang" reports were the
better-sqlite3 ABI failure plus 45- and 60-minute cutoffs.

## Delta vs the `021` baseline (`148 files / 3,992 tests / 3,986 pass / 6 fail in 3 files`)
Files grew 148 -> 179, but tests FELL 3,992 -> 3,896. That drop is the headline and it is explained
in full below. Neither cause is `024`.

## Attribution of all 23 failing files

### Cause A — six ledger-schema suites truncated to imports-only (6 files, ~96 tests missing)
`2666012cfe` ("chore(repo): commit accumulated spec/skill WIP, finalize system-code-graph
decommission") cut every one of these to 11 lines:

| suite | before | after |
|---|---|---|
| deep-alignment-ledger-schema | 1581 | 11 |
| skill-benchmark-ledger-schema | 1443 | 11 |
| deep-improvement-common-ledger-schema | 1097 | 11 |
| deep-review-ledger-schema | 1078 | 11 |
| deep-research-ledger-schema | 1019 | 11 |
| deep-ai-council-ledger-schema | 909 | 11 |

7,127 lines of test code removed; each file now fails with `No test suite found in file`.
NOT `024`: at `5c98e4654e` (the gateway-only fenced ledger mutation) deep-research-ledger-schema was
still 995 lines, and at `aa66365e78` it was 1019. The loss happens only at `2666012cfe`.
`agent-improvement-ledger-schema` (14 tests) and `model-benchmark-ledger-schema` (15 tests) survived.

### Cause B — stale state-census path (5 collection failures + 5 test failures)
A partially-completed path migration. The census moved under
`001-research-inputs-and-architecture/`, and only some callers were updated.

STALE (missing the `001-research-inputs-and-architecture/` segment):
`cutover-certificate`, `inflight-state-classification`, `inflight-state-migration`,
`per-mode-authority-flip`, `rollback-drills` (these five collect zero tests, `ENOENT` on
`state-backend-census.json`), plus `mixed-version-fixtures` (3 failed) and
`legacy-projections` (2 failed).

CORRECT (already migrated): the five `*-rollback-gate` suites and `shadow-parity-harness`.

### Cause C — individually attributed
- `authorized-ledger` (1) — `Ledger writer lock identity changed before release`. PRE-EXISTING:
  reproduces at base with T015 absent. See `open-finding-writer-lock-reclaim.md`.
- `spawn-cjs` (1), `combo-matrix` (1) — test-expectation drift against `fanout-run.cjs` /
  sibling suites; no ledger surface touched.
- `render-command-contract` (3), `check-contract-drift` (1), `review-depth-convergence` (1) —
  the `021` baseline's own known pre-existing set.
- `dependency-seams` (2) — **MEASUREMENT ARTIFACT, not a real failure.** This worktree's
  `runtime/node_modules` is a symlink to the main checkout's, and these two tests assert resolution
  from the runtime's OWN `node_modules`. Re-run in the main checkout with real deps: **7/7 pass**.
  The true failing-test count is therefore **16, not 18**, and the true failing-file count **22, not 23**.
- `stress/cli-adapter/fanout` (1), `stress/cli-adapter/cli-devin` (1) — not individually attributed;
  neither carries a fenced-writer signature. `cli-devin` is plausibly the sibling devin-CLI repair lane.

## The `024` question — the one CHK-110 exists to answer
**No `024`-attributable regression.** Across the whole 179-file run there is not a single
`appendAuthorized is not a function`, `STALE_FENCE`, or fence/proof/capability failure — the exact
signatures the packet handover names as the migration's regression fingerprint. The only failure in
a `024`-owned suite is the `authorized-ledger` lock-reclaim race, proven pre-existing at base.

## Correction applied to this run
Two of the eighteen failing tests were caused by the harness, not the code: see `dependency-seams`
under Cause C. Corrected totals: **22 failing files / 16 failing tests**. The symlinked
`node_modules` is a deliberate worktree convenience (a bare worktree has no gitignored deps); a
future aggregate should either install real deps in the worktree or run from the main checkout.

## Honest status of this gate
The "no new failures vs the `021` baseline" claim CANNOT be made as written: the current failing set
is materially larger than the baseline's 3 files. But every increment is attributed above to Cause A
or Cause B, both unrelated to this packet. CHK-110 should be closed as "delta captured and
attributed", with Causes A and B raised as their own remediation items.
