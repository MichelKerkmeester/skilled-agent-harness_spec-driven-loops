# Iteration 3: What the Test Suites Actually Assert

## Focus

The conformance table and the per-adapter suites, read for the gap between what a test's name and
its file's documentation claim and what its assertions reach. The question is not whether the
suite is green but whether a behaviour could change without a case failing.

## Actions Taken

1. Read `tests/adapter-conformance.test.cjs` end to end (315 lines): the driver table, the case
   tables, the sandbox and the environment hygiene.
2. Read `tests/README.md` against the files it describes.
3. Compared the two adapter "target lookup" cases against the core test that covers the same
   function, and against the adapters' actual call sites.
4. Checked which adapters accept an injection seam for the process table.

## Findings

1. **Two adapter tests assert the core through an alias, so neither adapter's arm path is
   covered by the case that names it.** `codex/stop-arm.mjs` re-exports the core function as
   `findCodexPid` (`[SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:143]`) and
   `hermes/session-end-arm.mjs` re-exports it as `findHermesPid`
   (`[SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:125]`). The two adapter
   tests then call those aliases with a synthetic table and the same numbers
   (`[SOURCE: .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs:504]`,
   `[SOURCE: .skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs:292]`), which is what
   `relaunch-core.test.cjs` already asserts for the function itself at
   `[SOURCE: .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:919]` — same table, same
   `pid: 41`, same `60`/`null`. The suites' own README credits each file with "the stop target
   lookup picks the ancestor directly below the loop process"
   (`[SOURCE: .skilled/hooks/session-relaunch/tests/README.md:49]`,
   `[SOURCE: .skilled/hooks/session-relaunch/tests/README.md:51]`), but the adapter call sites are
   what could drift. Hermes' arm path already takes the seam
   (`[SOURCE: .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:80]`), so its case can
   drive `armPendingRecord(payload, { pid, processTable, spawn })` and assert the spawned
   `--target-pid`; Codex's arm path passes no seams at all
   (`[SOURCE: .skilled/hooks/session-relaunch/codex/stop-arm.mjs:118]`), so the fix there is to
   hoist the call into an exported `armPendingRecord(payload, dependencies)` shaped like Hermes'
   and assert the same way. As written, deleting the target resolution from either arm path
   leaves every test green.

2. **The conformance table has no arm case, so the decision it exists to protect is outside it.**
   The file states its purpose as "one case table runs through every adapter, so a decision that
   drifts in one runtime fails here"
   (`[SOURCE: .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:6]`), and the
   table then carries three seed cases and four nudge cases
   (`[SOURCE: .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:233]`,
   `[SOURCE: .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:258]`) — all of
   them instruction text. Every row is a string the model reads. Nothing in the table arms a
   record, and the arm decision is exactly what phase 009 moved into the core: kill-target
   resolution, the note-state rule and the live-killer suppression. A fourth table,
   `ARM_CASES`, over a prepared pending record with an injected process table would put the four
   adapters' arm paths side by side. The pieces already exist — `preparePending` is called
   in-process by an existing case
   (`[SOURCE: .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:279]`) and the
   Claude and Hermes drivers already spawn their hooks as child processes.

3. **`tests/README.md` pins an exact five-line test summary that any added case invalidates.**
   Section 6 states "the summary ends with the counts below" and then prints `ℹ tests 510`,
   `ℹ pass 510`, `ℹ fail 0` and three more zero rows
   (`[SOURCE: .skilled/hooks/session-relaunch/tests/README.md:98]`). Those totals are a snapshot
   from the phase 009 gate, and the document's instruction to "add a test here" for new adapter
   behavior is in the same file (`[SOURCE: .skilled/hooks/session-relaunch/tests/README.md:82]`),
   so following the document makes its own expected result wrong. Fix: state the invariant
   instead of the totals — `fail 0`, `cancelled 0`, `skipped 0`, with the total described as
   growing as cases are added — and keep 510 only in the phase record that measured it.

## Ruled Out

- Reporting the conformance suite's environment hygiene: `ENV_KEYS` covers every variable the
  four drivers read, and `withProcessEnv` restores the previous values in a `finally`
  (`[SOURCE: .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:110]`).
- Reporting the missing per-test timeout in `runHook`: the hooks it spawns bound their own `ps`
  calls, and the suite is not the layer that owns a hung-hook budget.

## Dead Ends

- Trying to prove the README's 510 by counting `test(` calls statically: the loop-generated
  conformance cases and node's subtest accounting make a static count unreliable. The finding
  therefore rests on the number being a snapshot, not on it being wrong today.

## Edge Cases

- Ambiguous input: "asserts less than it claims" could mean a weak assertion or a missing case.
  Reported the two that change an outcome — an alias test and a table with no arm row — and left
  assertion-strength nitpicks out.
- Contradictory evidence: none. The alias duplication is exact: the core test and the two adapter
  tests use the same table, the same input pids and the same expected pid.
- Missing dependencies: none.
- Partial success: the alias finding is proven by reading three files. The consequence — deleting
  a call site leaves the suite green — is a control-flow conclusion, not a run.

## Sources Consulted

- `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:6`
- `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:110`
- `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:233`
- `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:258`
- `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:279`
- `.skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs:504`
- `.skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs:292`
- `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:919`
- `.skilled/hooks/session-relaunch/tests/README.md:49`
- `.skilled/hooks/session-relaunch/tests/README.md:51`
- `.skilled/hooks/session-relaunch/tests/README.md:82`
- `.skilled/hooks/session-relaunch/tests/README.md:98`
- `.skilled/hooks/session-relaunch/codex/stop-arm.mjs:118`
- `.skilled/hooks/session-relaunch/codex/stop-arm.mjs:143`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:80`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:140`

## Assessment

- New information ratio: 0.75
- Questions addressed: which behaviours the conformance and adapter suites leave unguarded
- Questions answered: which behaviours the conformance and adapter suites leave unguarded

## Reflection

- What worked and why: comparing the adapter tests against the core test numerically — same
  table, same `41` to `60` — established the alias duplication without inference.
- What did not work and why: attempting to verify the README's totals statically. Node's subtest
  counting and loop-generated cases make the count unreachable by grep, so the finding had to be
  reframed around the snapshot being stale-prone rather than wrong.
- What I would do differently: read the adapter test names first and pick the ones whose subject
  is an injected seam; that is where a duplicate of the core hides.

## Recommended Next Focus

Adapter parity: what each of the five adapters still decides alone — guard shapes, injection
seams, export shapes and entrypoint conventions.
