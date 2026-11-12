# Iteration 3: The spec-kit runtime test tree and its runners

## Focus

Key questions 2 and 5, narrowed to the largest tree: `.skilled/skills/system-spec-kit/runtime` carries 352 test files and 92,362 lines, and `spec-kit-check.yml` is the slowest measured workflow at a 595s mean. This iteration asks which of those tests or runners cost more than the coverage they buy, and which are duplicates of each other.

## Actions Taken

1. Counted test files and lines per subdirectory and listed the largest files.
2. Checked every duplicated basename across the two test directories for genuinely duplicated test names.
3. Counted which source modules attract the most test files.
4. Read the package's six test entry points and the two custom runners behind them.
5. Read the CI `check` job's step list to see which lanes it actually executes.
6. Searched the repository for any caller of the sharded runner.

## Findings

1. The tree holds 352 test files and 92,362 lines, and 214 of those files sit in `cli/tests`, so the CLI project is 60% of the file count. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/progressive-validation.vitest.ts:1][SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:18]
2. The slowest workflow's cost is front-loaded setup, not test count: its `check` job performs five `npm ci` installs and three package builds before the first test lane runs, under a 51-minute timeout. [SOURCE: .github/workflows/spec-kit-check.yml:114][SOURCE: .github/workflows/spec-kit-check.yml:99]
3. `test:sharded` is dead infrastructure: a 12-shard runner that no workflow and no script invokes, referenced only by `package.json` and three READMEs. Because its shards run one at a time, running it is strictly slower than the unsharded suite it wraps. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:20][SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:32]
4. `run-tests.mjs` is an overengineered timeout: 120 lines of JavaScript that embed a 40-line inline Python program solely to start the test process in its own process group and kill it at 10 minutes, then chain three more `npm run` lanes on top. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:5][SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:76]
5. Three legacy shell/CommonJS harnesses (3,561 lines: `test-validation-system.cjs` 1,478, `test-validation.sh` 937, `test-validation-extended.sh` 1,146) run as a separate lane beside the Vitest suites, and CI now runs both lanes explicitly. [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:24][SOURCE: .github/workflows/spec-kit-check.yml:151]
6. The obvious duplicate-test hypothesis is wrong: the three shared basenames across `tests/` and `cli/tests/` are not duplicates. `progressive-validation` has 64 test names in one file and 68 in the other with zero overlap, so a delete based on the filename would remove distinct coverage. [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/progressive-validation.vitest.ts:1][SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/progressive-validation.vitest.ts:1]
7. "Run the tests" has six overlapping entry points in one package (`test`, `test:core`, `test:cli`, `test:spec-validation`, `test:sharded`, `test:council`), so the local cost of the suite is defined by whichever one a person picks rather than by one contract. [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:23]

## Ruled Out

- Deleting a `tests/` copy because its basename also exists under `cli/tests/`: measured zero shared test names for the one pair that looked most alike, so the basename-collision signal is rejected as evidence of duplication.
- Re-measuring per-file vitest durations: settled in phases 001 to 005 of this packet.
- Proposing that CI stop building before testing: the builds are prerequisites for `dist`-mapped checks, so the cost is real work, not waste. The cut belongs to a build-caching decision owned by `002-ci-workflow-efficiency/004-setup-caching-provisioning`.

## Dead Ends

- No single test file dominates runtime; the package's own CI comment states that no file dominates the CLI project's run time. A "delete the slowest test file" strategy therefore has no target and is a dead end for this tree.

## Edge Cases

- Ambiguous input: "redundant tests" could mean duplicate assertions or overlapping coverage. Selected interpretation: duplicated assertions and duplicated runners, because those are deletable without a semantic judgment about coverage value. Deferred alternative: coverage-map overlap analysis, which needs a coverage run this lineage must not start.
- Contradictory evidence: the `tests/` and `cli/tests/` trees look duplicated by filename while measuring as distinct suites. Resolved by comparing test names, and the resolution is recorded as a finding so a later reader does not repeat the mistake.
- Missing dependencies: no coverage report and no per-file timing were produced; both would need running the suite, which is outside a research-only lineage with a ten-minute iteration budget.
- Partial success: none.

## SCOPE VIOLATIONS

None. Every write in this iteration is inside the lineage directory.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/package.json:23`, `:24`, `:32`
- `.skilled/skills/system-spec-kit/runtime/vitest.config.ts:18`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:5`, `:76`
- `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:20`
- `.skilled/skills/system-spec-kit/runtime/scripts/README.md:23`
- `.skilled/skills/system-spec-kit/runtime/tests/progressive-validation.vitest.ts:1`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/progressive-validation.vitest.ts:1`
- `.github/workflows/spec-kit-check.yml:99`, `:114`, `:151`
- Measured: 352 test files / 92,362 lines; 214 files in `cli/tests`; 3,561 lines across the three legacy validation harnesses; total 64 vs 68 distinct test names with 0 shared.

## Assessment

- New information ratio: 1.0
- Questions addressed: Which tests under .skilled/skills/*/runtime are redundant, mirror the implementation, or re-assert the framework, and what does each suite cost on the commit and push path? Which test infrastructure costs run time or maintenance without proportional coverage?
- Questions answered: Which tests under .skilled/skills/*/runtime are redundant, mirror the implementation, or re-assert the framework, and what does each suite cost on the commit and push path? Which test infrastructure costs run time or maintenance without proportional coverage?

## Reflection

- What worked and why: measuring the runner layer rather than guessing at test semantics produced four deletable artifacts with line-level evidence, and the basename check prevented a wrong deletion.
- What did not work and why: the duplicate-test-by-name hypothesis collapsed because the two trees were written independently; only a name-level comparison can show that cheaply.
- What I would do differently: check entry points before file counts in any future tree, because six runners explain the cost structure faster than 352 filenames do.

## Recommended Next Focus

Repeat the entry-point and runner audit on the other two large runtime trees — `system-skill-advisor/runtime` (186 files, 457s stress workflow) and `system-deep-loop/runtime` (174 files, 472s workflow) — to see whether the same custom-runner pattern repeats or whether their cost is genuinely test work.
