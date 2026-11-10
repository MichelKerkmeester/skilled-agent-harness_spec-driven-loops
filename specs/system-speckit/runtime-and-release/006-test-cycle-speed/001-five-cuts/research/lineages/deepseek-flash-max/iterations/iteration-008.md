# Iteration 8: Whether fanout-run's 171 tests can be split across workers

## Focus

Iteration 2 proposed moving `fanout-run.vitest.ts` out of the serial group, but even in the parallel project it would occupy one worker for its whole duration, because Vitest parallelises files, not tests. This iteration asked whether its 171 tests share state, since a clean split would divide the suite's largest single block.

## Actions Taken

1. Counted the file's top-level `describe` blocks and their test counts.
2. Counted every hook in the file and read the one that exists.
3. Looked for module-level mutable state and for the patterns that make a test file order-dependent: `require.cache` manipulation, global stubbing, and `process.env` mutation.
4. Checked the serial project's parallelism setting to see whether a split alone would help.

## Findings

1. `fanout-run.vitest.ts` is 44 top-level `describe` blocks holding 171 tests, with exactly one hook: an `afterEach` that clears two module-level arrays of temp directories and hermetic environments. There is no `beforeAll`, no shared fixture, no `require.cache` manipulation, no global stubbing and no `process.env` mutation. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:49]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:519]`
2. The file therefore splits cleanly by describe block: each new file needs the same imports and the same `afterEach` cleanup, and nothing else carries across tests. The only shared state is the cleanup list itself, which each file would own separately. `[INFERENCE: from finding 1]`
3. A split alone would not help, because the serial project sets `fileParallelism: false` and would still run the pieces one at a time. The split pays only together with the move into the parallel project. `[SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:57]`
4. Combined, the two moves divide the suite's largest block: 157 s on one worker becomes roughly 40 s on four workers if the file is split four ways, which is larger than the entire serial-group saving iteration 2 estimated from moving two files. `[INFERENCE: from finding 2, finding 3 and the 157 s figure at spec.md:59]`
5. The blocks are already sized for it: `max-iterations stop-reason tolerance` holds 18 tests, `cli-pi adapter` 13, and four more hold eight or seven each, so a four-way split can be balanced without cutting a describe in half. `[SOURCE: measured: per-describe test counts over fanout-run.vitest.ts → 18, 13, 8, 8, 8, 7, 7, 7]`

## Ruled Out

- **Splitting fanout-run without moving it to the parallel project.** The serial project runs one file at a time, so four files would take the same wall time as one.
- **`describe.concurrent` inside the file.** It would run 171 tests at once inside one worker against shared temp-dir bookkeeping, which is more concurrency than the file was written for and gains nothing over separate files.
- **Moving the file without splitting it.** It would shorten the serial group but leave a 157 s block on one worker, which caps the suite's floor.

## Dead Ends

- No per-describe timing exists, so the four-way split's balance is inferred from test counts rather than measured seconds.

## Edge Cases

- Ambiguous input: "splitting" was read as moving describe blocks into new files, since Vitest has no test-level sharding.
- Contradictory evidence: none.
- Missing dependencies: per-describe timings.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:49`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:519`
- `.skilled/skills/system-deep-loop/runtime/vitest.config.ts:57`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:59`
- measured: per-describe test counts → 18, 13, 8, 8, 8, 7, 7, 7 across 44 describes

## Assessment

- New information ratio: 0.90
- Questions addressed: the internal structure of the suite's largest file
- Questions answered: none new; this extends Q1's answer

## Reflection

- What worked and why: counting hooks and mutation patterns is the cheapest test of order-dependence, and one `afterEach` over two cleanup arrays is about as clean as a 5925-line file can be. That turned a 157 s block into a divisible one.
- What did not work and why: test counts are not seconds, so the four-way balance is a guess about which describes are slow.
- What I would do differently: time the four largest describes before choosing the split boundary, because the 18-test block may be cheap and the 8-test adapter blocks may be expensive.

## Recommended Next Focus

The findings now form a coherent set of four cuts with estimates attached, but every estimate is arithmetic. The next iteration should turn them into a measurement protocol: the exact command, the signal that proves the cut, and the reading that would falsify it, so the packet's next step is a run rather than another analysis.

## Questions Answered

- None new; all five key questions were answered by iteration 6.

## Questions Remaining

- None of the five key questions remains open.
