# Iteration 6: Shared helpers, process spawns and the doctor suite

## Focus

Key question 5: which test infrastructure — custom harnesses, serial lists, shared fixtures, helper layers — costs run time or maintenance without proportional coverage. Iterations 3 to 5 found dead runners, a serial config and a misclassified scratch corpus. This iteration tests the remaining hypothesis, that the shared helper layer and the multi-language test folders are the overengineered part, and measures the per-test cost driver instead.

## Actions Taken

1. Read the shared Vitest setup file that three configs load.
2. Counted test files that spawn a child process, and the spawn sites inside them, across the five largest test trees.
3. Counted the repository's tracked test files by framework suffix, excluding vendored and worktree trees.
4. Classified the doctor suite's 59 test files by language and read its aggregator runner.
5. Checked whether the doctor tree is executed in more than one workflow.

## Findings

1. The shared setup file is load-bearing, not bloat: 71 lines that force an absolute `TMPDIR` and refuse to run when `MEMORY_DB_PATH` or `SPEC_KIT_DB_DIR` points at the checked-in database directory, then hand each test file its own scratch directory. Three configs load it, so one copy serves three packages. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:32][SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:37]
2. The repository tracks 1,173 test files outside `specs/` and the vendored trees: 702 `vitest.ts`, 209 `test.cjs`, 97 `test.mjs`, 66 Python, 64 `test.ts` and 35 shell. Adding the 94 under `specs/` reproduces the packet's own ~1,270 figure, which confirms the census in `spec.md` for the tracked surface. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:69]
3. Process spawning is the dominant per-test cost, not assertion count: 121 test files in the spec-kit runtime spawn a child process across 464 call sites, the deep-loop runtime has 128 sites in 43 files, the advisor 85 in 32, and the doctor scripts 176 in 36 files. A spawned `node` costs tens of milliseconds before the test asserts anything. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/test-validation-system.cjs:1][INFERENCE: based on the measured 0.03–0.13s floor for a no-op node invocation reported in iteration 1]
4. The doctor suite has the highest spawn density in the repository: 36 of its 59 files spawn, at 176 sites, and it runs them from one bash aggregator with a three-tool dependency contract (node, python3 and the advisor runtime's vitest) and a distinct exit code 2 for a missing tool. [SOURCE: .skilled/commands/doctor/scripts/tests/run-all.sh:1]
5. The doctor folder is not three co-equal frameworks: it is 54 `node:test` CommonJS suites, 4 bash suites and 1 Python suite, so the multi-language cost is two stragglers rather than a parallel test system. [SOURCE: .skilled/commands/doctor/scripts/tests/agent-roster-mirror-check.test.cjs:1]
6. The doctor tree is wired twice: `spec-kit-check.yml` runs the aggregator, and `opencode-dual-version.yml` also runs `opencode-version-battery.test.cjs` explicitly, so one file is executed by two workflows with two separate installs. [SOURCE: .github/workflows/spec-kit-check.yml:246][SOURCE: .github/workflows/opencode-dual-version.yml:123]
7. Helper sprawl is confined to two small files: the deep-loop runtime carries its own 71-line hermetic path helper while the advisor loads the spec-kit setup, so there is no duplicated helper layer to delete. The "shared helper layer is overengineered" hypothesis is rejected on measurement. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:27][SOURCE: .skilled/skills/system-deep-loop/runtime/tests/_support/hermetic-opencode-path.ts:1]

## Ruled Out

- Deleting or merging the shared Vitest setup: it prevents tests from writing the checked-in database and fails closed when the environment points there, so removing it trades a 71-line file for production-state corruption.
- Calling the doctor folder "three parallel test frameworks": 54 of its 59 files are one framework, so the framing would overstate the maintenance cost.
- Treating spawn-heavy tests as overengineering by default: spawning is how a CLI is tested at all; the finding prices the cost without proposing removal.

## Dead Ends

- No shared-fixture duplication exists to cut. Both candidate helpers are single copies with distinct jobs, so the "helper layer" branch of key question 5 closes with a negative result.

## Edge Cases

- Ambiguous input: "overengineered test infrastructure" could mean custom harnesses, or per-test process spawns, or duplicated helpers. Selected interpretation: all three, each measured separately, because a negative result on one branch (finding 7) is as useful as a positive one.
- Contradictory evidence: the packet's file census (1,270) and this iteration's tracked count (1,173 outside specs) agree only when the 94 `specs/` files are added back. Both are recorded so the arithmetic is checkable.
- Missing dependencies: per-spawn wall-clock was not measured directly; the estimate uses iteration 1's measured node-invocation floor.
- Partial success: none.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:32`
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:37`
- `.skilled/skills/system-deep-loop/runtime/vitest.config.ts:27`
- `.skilled/skills/system-deep-loop/runtime/tests/_support/hermetic-opencode-path.ts:1`
- `.skilled/commands/doctor/scripts/tests/run-all.sh:1`
- `.skilled/commands/doctor/scripts/tests/agent-roster-mirror-check.test.cjs:1`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/test-validation-system.cjs:1`
- `.github/workflows/spec-kit-check.yml:246`
- `.github/workflows/opencode-dual-version.yml:123`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md:69`
- Measured: 1,173 tracked test files by framework suffix; spawn sites 464 / 128 / 85 / 176; doctor files 54 cjs + 4 sh + 1 py + 2 non-test entries.

## Assessment

- New information ratio: 1.0
- Questions addressed: Which test infrastructure (custom harnesses, serial lists, shared fixtures, helper layers) costs run time or maintenance without proportional coverage?
- Questions answered: Which test infrastructure (custom harnesses, serial lists, shared fixtures, helper layers) costs run time or maintenance without proportional coverage?

## Reflection

- What worked and why: counting spawn sites rather than files put a number on the per-test cost driver, and reading the setup file turned a suspected bloat item into a load-bearing guard.
- What did not work and why: the helper-layer hypothesis failed because there is only one shared helper; the negative result is worth recording so no later iteration re-opens it.
- What I would do differently: measure spawn density before reading any harness code, because density tells you where the wall clock is and the code only explains why.

## Recommended Next Focus

Turn the measurements into the ranked cut list the packet requires: for each candidate, price the saving against the workflow mean that bounds it, name the regression it stops catching, and label it delete, merge, narrow or move. Start with the six CI duplicates and the four test-infrastructure artifacts from iterations 2 to 4.
