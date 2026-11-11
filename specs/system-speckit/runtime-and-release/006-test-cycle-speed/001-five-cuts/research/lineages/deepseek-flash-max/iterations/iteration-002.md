# Iteration 2: Which of the twelve serial deep-loop files actually need serial execution

## Focus

The deep-loop suite spends about 265 s in a serial group of twelve files that run after the parallel group. This iteration asked which of those twelve carry an assertion that a quiet machine is required for, and which are serial only because they spawn child processes — the latter being a precaution that parallelism does not threaten.

## Actions Taken

1. Enumerated the twelve files the `SERIAL_FILES` globs match and measured each one's size and test count.
2. Read the smallest member to see what a seven-line stress file actually does.
3. Read `db-open-close.vitest.ts` in full, because it is the file whose comment names a lock race.
4. Grepped every member for upper-bound timing assertions and for child-process timeouts.
5. Read the fanout-run header and its timing assertions to see whether any of them bound elapsed wall time.

## Findings

1. The twelve files are six real test surfaces, not twelve: seven of them (`cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`, `cli-opencode`, `cli-claude-code`, and the shared factory's callers) are 7-line wrappers that each call `defineAdapterStressSuite('<kind>')` from one fixture module. The real code is `fanout-run.vitest.ts` (5925 lines, 171 tests), `stress/cli-adapter/fanout.vitest.ts` (843 lines, 19 tests), `stress/cli-adapter/cli-codex.vitest.ts` (520 lines, 26 tests), `integration/deep-research-postflip-fanout.vitest.ts` (612 lines, 4 tests), `unit/lineage-timestamp-window.vitest.ts` (257 lines, 5 tests) and `lifecycle/db-open-close.vitest.ts` (97 lines, 2 tests). `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-cursor.vitest.ts:6]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:1]`
2. Only four files carry a load-sensitive upper bound on a child process, and those are the ones whose serial placement a timing assertion justifies: `cli-codex` bounds a spawned shim at 1000 ms, `stress/fanout` bounds its runs at 12 000 ms, `lineage-timestamp-window` bounds a child at 60 000 ms (raised from 15 s by cut 5), and `db-open-close` waits at most 1000 ms for the writer lock to appear. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-codex.vitest.ts:112]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:118]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts:128]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:31]`
3. `db-open-close` is the one file whose *purpose* is contention: its second test holds the graph writer lock for 500 ms in one child and starts a second child with `DEEP_LOOP_WRITER_LOCK_MAX_WAIT_MS=0`, then asserts the second exits 2 with `DB_ERROR`. That test needs the lock to itself, and cut 5 already gave each file its own coverage database and lock path, so the requirement is exclusivity on one file's lock rather than on the machine. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:70]`
4. `fanout-run` has no assertion that bounds elapsed wall time. Its timing-flavoured assertions are string ordering (`indexOf` comparisons), lower bounds (`slotDurationMs > 0`, `completedSlotMs >= 4_200`) and a `waitForFile` poll cap of 5000 ms; the only child bound is one spawn at 30 000 ms. Lower bounds cannot fail under load, so this file's 171 tests do not need a quiet machine to stay green. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:472]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2540]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:5112]`
5. `postflip-fanout` carries no timing bound at all: it drives the ledger and gateway through `execFileSync` and asserts state transitions. Its serial placement is not backed by any assertion this iteration could find. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/integration/deep-research-postflip-fanout.vitest.ts:1]`
6. The packet's own pre-cut profile measured `fanout-run` at 157 s, the slowest file in the suite, which makes it the single largest block inside the 265 s serial group. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:59]`
7. The arithmetic of moving the two unbound files into the parallel project is favourable and testable: the serial group falls from about 265 s to about 108 s, while `fanout-run` and `postflip-fanout` join a parallel group already near 240 s, so the suite's floor becomes roughly 240 s plus 108 s, near 348 s instead of 504-511 s. This is an estimate and must be measured, because the parallel group may stretch when 157 s of spawning work joins it. `[INFERENCE: from findings 1, 4, 5 and 6 plus the 504-511 s and 265 s figures in the research topic]`

## Ruled Out

- **Removing `db-open-close` from the serial set.** Its second test exists to make two writers contend for one lock; parallel neighbours would make the race uncontrolled rather than asserted. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:70]`
- **Removing `lineage-timestamp-window` from the serial set.** It bounds a child at 60 s and was already raised once for load; it is the clearest genuine timing dependency in the group. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts:128]`
- **Merging the seven 7-line stress wrappers into one file.** It would change which `describe` a failure is reported under and save no measurable time; the wrappers are cheap.
- **Treating "it spawns children" as a reason to stay serial.** Parallel workers spawn children normally; only an upper bound on the child's duration is threatened by load, and three of the six files have none.

## Dead Ends

- No record exists of *which* files failed when every file ran in parallel, so the current twelve-file set cannot be justified file by file from the packet. The blanket set was a precaution taken before the per-file evidence existed. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:83]`

## Edge Cases

- Ambiguous input: "the 12 serial files" was read as the exact set the config's `SERIAL_FILES` globs match, not as twelve distinct test surfaces. Finding 1 resolves the difference.
- Contradictory evidence: none. The packet's reason for the serial set (files that measure elapsed time, kill child processes or race for the lock) is broader than the assertions found here, and the difference is recorded as finding 4 rather than as a conflict.
- Missing dependencies: the per-file timing split of the 265 s is not recorded anywhere; finding 6 uses the only per-file number that exists (157 s for `fanout-run`).
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/vitest.config.ts` (SERIAL_FILES and project wiring)
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-cursor.vitest.ts:6`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts:1`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-codex.vitest.ts:112`
- `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:118`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts:128`
- `.skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:31`
- `.skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:70`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:472`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2540`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:5112`
- `.skilled/skills/system-deep-loop/runtime/tests/integration/deep-research-postflip-fanout.vitest.ts:1`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:59`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:83`

## Assessment

- New information ratio: 0.86
- Questions addressed: Q1 (which of the twelve serial files need serial execution)
- Questions answered: Q1 — the group's composition and the two files that can leave it

## Reflection

- What worked and why: grepping for upper bounds rather than reading all twelve bodies separated "spawns a child" from "asserts how long the child may take". Only the second kind is threatened by load, and the distinction collapsed a twelve-file precaution into two defensible moves.
- What did not work and why: the 265 s figure cannot be split per file from the packet, so the saving is arithmetic over one known number rather than a measured sum.
- What I would do differently: read `stress/cli-adapter/fixtures/adapter-suite.ts` fully in this iteration rather than only its head, because the seven wrappers' real cost sits inside that factory and is still unmeasured.

## Recommended Next Focus

Measure before moving: the next evidence needed is a per-file timing split of the serial group, then a single run with `fanout-run` and `postflip-fanout` moved into the `parallel` project. If that run fails, the failing assertion is the answer, and the fallback is to raise only the poll cap or keep only that test serial. After that, take the core lane's import figure (Q3), because finding 8 of iteration 1 says the metric may not mean what the packet assumes.

## Questions Answered

- Which of the 12 serial deep-loop files actually need serial execution, and what would shrink that group?

## Questions Remaining

- 4 of 5 key questions remain open.
