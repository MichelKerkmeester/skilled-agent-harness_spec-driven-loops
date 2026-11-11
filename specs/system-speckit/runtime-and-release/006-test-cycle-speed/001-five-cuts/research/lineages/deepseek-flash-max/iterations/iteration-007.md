# Iteration 7: What a split of upgrade-legacy has to update, and why native sharding cannot do it

## Focus

Iteration 6 concluded that the cli lane's 400 s file is cut by splitting it, not by trimming tests. Before that recommendation is usable it needs a change surface: every place that names the file, and whether Vitest's own `--shard` flag can do the split instead of a manual one.

## Actions Taken

1. Grepped the live tree for the exact filename, excluding the spec archive.
2. Read `run-cli-tests.sh`'s include and exclude lines and its header comment.
3. Found and read `scripts/run-tests-sharded.mjs`, which already implements sharding in this repository.
4. Read the `test:cli` and `test:sharded` script entries to see how they compose.

## Findings

1. Four live lines hardcode the file: `run-cli-tests.sh` runs it as the first background process and excludes it from the second, and `spec-kit-check.yml` repeats both lines. Two feature-catalog documents also name it, but they are prose. A rename or split must update the exclude, or the second process would collect the shards and run them a second time. `[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:7]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:9]` `[SOURCE: .github/workflows/spec-kit-check.yml:153]` `[SOURCE: .github/workflows/spec-kit-check.yml:155]`
2. The repository already ships a sharded runner: `npm run test:sharded` calls `scripts/run-tests-sharded.mjs`, which defaults to twelve shards and passes Vitest's native `--shard=N/M`. `[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:15]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:31]`
3. That runner runs its shards one at a time on purpose, and its header says why: running them together contends for the same temporary directories and databases and produces failures that belong to the harness. That is a recorded precedent for this repository, and it is the same hazard the deep-loop serial group exists to avoid. `[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:9]`
4. Native `--shard` distributes test files, not tests, so it cannot divide a single 400 s file. Sharding the cli lane with it would spread the other 202 files while the one heavy file stayed whole on one shard. `[INFERENCE: from run-tests-sharded.mjs passing --shard through to run-tests.mjs, which forwards to vitest run]`
5. A split has to preserve the guarantee `run-cli-tests.sh`'s header states: the first process names the exact path, so a rename fails instead of silently passing. A glob replacement would lose that unless the command asserts a non-empty match. `[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:3]`

## Ruled Out

- **Using `npm run test:sharded` for the cli lane.** It shards by file and runs shards serially, so it neither splits the heavy file nor shortens the lane's critical path.
- **Sharding the cli lane in parallel with native `--shard`.** It would leave the heavy file whole and, per the existing runner's header, risks harness-owned failures from shared temp roots.
- **Renaming the file to a glob match.** It would break the loud-failure guarantee that the exact path provides.

## Dead Ends

- No Vitest option splits one file's tests across workers; `describe.concurrent` is the only test-level concurrency, and iteration 6 ruled it out because the tests share a sandbox.

## Edge Cases

- Ambiguous input: "splitting the file" was read as moving tests into new files, not as Vitest-level sharding, because the latter cannot divide one file.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:3`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:7`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:9`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:9`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:15`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:31`
- `.github/workflows/spec-kit-check.yml:153`
- `.github/workflows/spec-kit-check.yml:155`
- `.skilled/skills/system-spec-kit/runtime/package.json` (`test:cli`, `test:sharded`)

## Assessment

- New information ratio: 0.90
- Questions addressed: the change surface for Q2's recommendation
- Questions answered: none of the five remains open; this iteration hardens an existing answer

## Reflection

- What worked and why: grepping for the literal filename produced the whole change surface in one call, including the exclude line that would silently double the work if missed.
- What did not work and why: the existing sharded runner looked like it might solve the problem outright, and only reading its header showed that it shards by file and runs serially by design.
- What I would do differently: check for an existing mechanism before recommending a new one, the same lesson as iteration 4.

## Recommended Next Focus

The remaining structural lever not yet examined is inside the deep-loop suite: `fanout-run.vitest.ts` is 171 tests in one file, so even moved into the parallel project it would occupy one worker for its whole duration. The next iteration should test whether its tests share state, because splitting it would divide that block across workers.

## Questions Answered

- None new; all five key questions were answered by iteration 6.

## Questions Remaining

- None of the five key questions remains open.
