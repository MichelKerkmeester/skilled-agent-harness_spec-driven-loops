# Iteration 7: Skill-advisor and deep-loop suites — vitest-only trees whose cost is installation, not assertions

## Focus

The iteration-6 recommendation: run the same suffix split for the two remaining large runtime trees and read what their own workflows execute. Key questions 2 and 5 (redundant suites; overengineered harnesses).

## Actions Taken

1. Counted test files by suffix for `.skilled/skills/system-skill-advisor/runtime` and `.skilled/skills/system-deep-loop/runtime`, and sized their largest suites.
2. Counted how many suites in each tree spawn child processes, which is the harness-heavy pattern that costs per file rather than per assertion.
3. Read `skill-advisor-stress.yml` and `deep-loop-runtime.yml` end to end, including their timeout rationale and path filters.

## Findings

1. Both trees are vitest-only: the advisor runtime holds 185 test files (182 `.vitest.ts`, 3 `.test.ts`) and the deep-loop runtime 174 (166 `.vitest.ts`, 7 `.test.ts`, 1 `.test.cjs`). Neither tree contributes to the node:test corpus, so neither is reachable from the advisory job; they run only through their own workflows' `npm test`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:1] [INFERENCE: based on the per-tree suffix counts]

2. `Skill Advisor Stress Tests` spends most of its measured 457 s mean on installation, not on tests: it runs five `npm ci` installs plus a TypeScript build before the first test, while the workflow's own comment puts the stress suite at half a minute and the default suite at about 2.7 minutes. Two thirds of the run is dependency setup for three and a half minutes of assertions. [SOURCE: .github/workflows/skill-advisor-stress.yml:72] [SOURCE: .github/workflows/skill-advisor-stress.yml:82]

3. `Deep-Loop Runtime Tests` has the same shape at 472 s mean: four installs, a shared-package build, then the contract-drift check, then the full suite. The drift check does restate a fact the suite later asserts, but it is the one deliberate duplication here and it earns its place — it fails in seconds instead of after the whole run, and its comment says so. [SOURCE: .github/workflows/deep-loop-runtime.yml:71] [SOURCE: .github/workflows/deep-loop-runtime.yml:74]

4. Child-process spawning is common enough to be the real per-file cost: 31 of 185 advisor suites and 43 of 174 deep-loop suites spawn a process, so roughly one file in five pays interpreter startup and an install of overhead per assertion. That is the harness layer key question 5 asks about, and it is measurable only as a per-file floor. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/compat/python-compat.vitest.ts:1] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1]

5. `fanout-run.vitest.ts` is 6,115 lines — the largest single test file in the repository, larger than the entire spec-tree test census (111 files, about 12,000 lines in total). One suite of that size cannot be narrowed by deleting a case without losing the run it describes; the cut available is splitting it, and the earlier phases of this packet already settled per-file splits. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:1]

6. The stress suite sits behind a `SPECKIT_RUN_STRESS` switch and a separate `vitest.stress.config.ts`; the workflow comment records that nothing set the switch, so two of its tests failed for months against code that had moved on. A second config plus an env gate for a half-minute suite is the overengineered shape here, and merging it into the default run costs half a minute per advisor change while removing a silent-always-off path. [SOURCE: .github/workflows/skill-advisor-stress.yml:3] [SOURCE: .github/workflows/skill-advisor-stress.yml:94]

## Ruled Out

- Institutionalising the stress/default split: the gate is what let the suite rot unseen; the config is the workaround, not the design.
- Counting spawn-heavy suites as redundant: they are the only coverage for process-level behaviour (stdin deadlines, launcher reaping, hook contracts).
- Re-litigating CI caching to fix the install share: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`.

## Dead Ends

- Attributing the 457 s and 472 s means to specific suites without per-step durations; the install share is inferred from step order and the workflow's own quoted local test times.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the workflow comment says the stress suite "takes about half a minute" while the job timeout is sized at 25 minutes from a 6.4-minute p100. Both describe the same job at different levels (tests versus queue plus install plus variance); the finding uses the comment's local figure and labels the rest inferred.
- Missing dependencies: no per-step durations exist in the repository.
- Partial success: tree shapes and workflow step order are confirmed; per-suite seconds are not.

## Sources Consulted

- `.github/workflows/skill-advisor-stress.yml` (full)
- `.github/workflows/deep-loop-runtime.yml` (full)
- `.skilled/skills/system-skill-advisor/runtime/**` test listing (185 files)
- `.skilled/skills/system-deep-loop/runtime/**` test listing (174 files)
- `spawnSync`/`execFileSync` scan across both trees

## SCOPE VIOLATIONS

None.

## Assessment

- New information ratio: 0.88
- Questions addressed: "Which test files under `.skilled/skills/*/runtime` are redundant..." and "Which overengineered test infrastructure costs run time beyond the coverage it adds?"
- Questions answered: none fully; the install-versus-assertion split and the stress-gate finding are new, the per-suite seconds are not.

## Reflection

- What worked and why: reading the two workflows' comments. They quote local test times (half a minute, 2.7 minutes) beside a measured mean, which is the only way to split install from assertion without step timings.
- What did not work and why: looking for redundancy by name. Both trees are single-dialect and their suite names describe distinct behaviours, so the redundancy question has a negative answer for these trees and the cost question carries the finding.
- What I would do differently: count spawning suites before reading individual files, because that ratio, not any single suite, decides whether the tree is overengineered.

## Recommended Next Focus

Key question 5 directly: the shared harness and helper layers across every runtime tree — `tests/_support`, `*-test-utils.ts` helpers, fixture directories and the discovery canary — and how much of them exists to keep duplicated setup identical.
