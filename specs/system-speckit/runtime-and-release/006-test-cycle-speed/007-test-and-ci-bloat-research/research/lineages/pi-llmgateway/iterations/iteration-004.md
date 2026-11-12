# Iteration 4: What the report-only test runner actually covers — 253 of 1,270 files

## Focus

The iteration-3 recommendation: measure the four `advisory-checks.yml` steps and inventory what `Node test suites (report-only)` runs. This is the largest single unknown in the CI inventory, because one report-only step may be paying the full corpus cost while enforcing nothing.

## Actions Taken

1. Read `.skilled/scripts/run-node-tests.mjs` end to end (discovery, canary, dialect partition, execution).
2. Scanned the three report-only validators for write calls, then timed the two that are read-only.
3. Ran `run-node-tests.mjs --list` (prints and exits before executing tests) to get exact counts per dialect.
4. Counted test files per tree with `git ls-files`, both repo-wide and inside `.opencode`.
5. Read the vitest project `include` patterns in `.skilled/skills/system-spec-kit/vitest.config.ts` and the vitest steps in `spec-kit-check.yml`.

## Findings

1. The corpus is 1,270 test files, and 1,124 of them (88%) are under `.skilled`; `specs/` contributes 111, `.opencode` 35, `.pi` 12, and the other runtime trees none. The `.opencode` tree carries generated mirrors and links into `.skilled` rather than a second copy of the suites, so there is no mirror-doubling to cut. [SOURCE: .opencode/README.md:3] [INFERENCE: based on the git ls-files counts per tree]

2. `run-node-tests.mjs` gates 253 files: 250 `node:test` and 3 vitest, discovered under five roots (`.skilled/skills`, `.skilled/scripts`, `.opencode/plugins`, `.skilled/bin`, `.skilled/hooks`) with `specs/`, `external`, `z_archive`, `z_future` and `.worktrees` excluded wholesale. That leaves 1,017 files (80% of the corpus) that never pass through this runner. [SOURCE: .skilled/scripts/run-node-tests.mjs:32] [SOURCE: .skilled/scripts/run-node-tests.mjs:33]

3. The runner executes every node file in a single `node --test` process with a ten-minute timeout, and the vitest files in a second process, so the report-only advisory step pays the whole node corpus in two process launches rather than in per-file overhead. The discovery canary (a second `find` walk compared against the readdir walk) adds one extra traversal per run. [SOURCE: .skilled/scripts/run-node-tests.mjs:140] [SOURCE: .skilled/scripts/run-node-tests.mjs:58]

4. Two of the four advisory steps are cheap and measured: the doc-model reference validator takes `real 2.77` s over the whole tree and the trigger-index `--check` takes `real 4.53` s. Neither explains the job's 87 s mean, so the cost is the node test corpus. [SOURCE: .opencode/skills/sk-doc/scripts/validate-doc-model-refs.js:1] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:1]

5. The 777 `.vitest.ts` files reach CI only through three doors: `spec-kit-check.yml`'s `root` and `cli` vitest projects (`tests/**/*.vitest.ts`, `runtime/tests/**/*.vitest.ts`, `runtime/cli/tests/**/*.vitest.ts`), four named suites in `routing-registry-drift.yml`, and the hooks tree run by `dispatch-enforcement-guard.yml`. A `.vitest.ts` file outside those include patterns runs nowhere, and nothing reports that it is not running. [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:42] [SOURCE: .skilled/skills/system-spec-kit/vitest.config.ts:60] [SOURCE: .github/workflows/routing-registry-drift.yml:277]

6. `spec-kit-check.yml` pays for the whole CLI plus runtime test corpus in one job with eleven run steps, including the legacy and bash validation lanes that only that workflow runs. It is the 595 s mean, and it is the only door for two thirds of the `.vitest.ts` corpus, so narrowing it without moving those suites elsewhere would silently drop them. [SOURCE: .github/workflows/spec-kit-check.yml:145] [SOURCE: .github/workflows/spec-kit-check.yml:159]

## Ruled Out

- Mirror duplication as a source of bloat: `.opencode` holds 35 test files and links the rest, so cutting a duplicated test tree is not available.
- Treating the two measured advisory validators as the advisory job's cost: 2.77 s and 4.53 s are noise beside a 10-minute-timeout corpus run.

## Dead Ends

- Reading per-test timings from CI logs: no job-level or step-level durations are stored in the repository, and this research run cannot call the GitHub API (no network credential guaranteed, and no writes outside the lineage). Savings stay estimates against workflow means.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: a report-only job implies cheap, while its content is the full node corpus. The measurement resolves it: the job is cheap only if the corpus is fast, and it is not cheap by construction.
- Missing dependencies: no per-step CI durations exist, so the share of the 87 s mean taken by the corpus is inferred from the two measured steps.
- Partial success: exact file counts and two measured steps are confirmed; the corpus duration inside CI is not.

## Sources Consulted

- `.skilled/scripts/run-node-tests.mjs` (full)
- `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/vitest.config.ts:35-80`
- `.github/workflows/spec-kit-check.yml:135-170`
- `.github/workflows/routing-registry-drift.yml:277-316`
- `.opencode/README.md`
- `git ls-files` counts per tree

## SCOPE VIOLATIONS

None. One read-only runner listing and two read-only validators were executed; nothing outside the lineage was written.

## Ledger Note

An unrelated iteration-4 record reached the append ledger from a stale `/tmp/iter004-record.json` left by another run on this machine before this iteration wrote its own record; the gateway is append-only and accepts what it is handed, so the projection now carries two iteration-4 rows. The authoritative iteration 4 is the one written with this file and with `deltas/iter-004.jsonl`; the earlier row names focus "Q2 - cost, breakage and cross-runtime / child-dispatch behavior", which belongs to a different research question and must be ignored during synthesis. Later iterations use uniquely named event files to stop the collision recurring.

## Assessment

- New information ratio: 0.90
- Questions addressed: "Which CI workflows duplicate a local git hook check or another workflow..."
- Questions answered: none fully; the coverage split is now measured, and the report-only step's composition is known.

## Reflection

- What worked and why: `--list` on the discovery runner answered the coverage question in one call without executing a single test, and per-tree `git ls-files` counts killed the mirror-duplication hypothesis before it could become a wrong recommendation.
- What did not work and why: assuming the 87 s mean proved the corpus was skipped. It might be a fast corpus; only per-step durations would settle it, and they do not exist.
- What I would do differently: read the vitest `include` patterns before reading the runner, because they define the real coverage boundary and the runner only covers a fifth of it.

## Recommended Next Focus

The 111 test files under `specs/`: which packets they belong to, whether any CI path runs them, and what regression would be lost by deleting them.
