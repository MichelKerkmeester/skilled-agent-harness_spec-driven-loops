---
title: "Research: Test and CI bloat, and what shortens the wait"
description: "Merged synthesis of two ten-iteration lineages plus orchestrator verification. The wait after a push is set by the slowest workflow, so the cuts are ranked by wait saved and not by total runner seconds."
trigger_phrases:
  - "test and ci bloat research"
  - "which tests and workflows to cut"
  - "shorten the wait after a push"
  - "slowest workflow sets the wait"
importance_tier: important
contextType: research
---

# Research: Test and CI bloat, and what shortens the wait

## 1. Short Answer

The wait is in CI and it is set by one workflow at a time. Workflows run in parallel, so the wait after a push equals the slowest workflow that push triggers, not the sum of all of them. On six recent pushes the wait was 220 to 441 seconds when `Spec-Kit Check` did not trigger and 843 to 1,015 seconds when it did.

Three things follow from that.

1. Deleting small guard workflows saves runner minutes and no waiting time. Both lineages ranked cuts by summed seconds, which overstates what the operator gains.
2. Only two workflows set the wait. `Spec-Kit Check` sets it when spec-kit code changes. `sk-doc Script Tests` sets it on every other push, because it has no path filter.
3. The git hooks are not part of the problem. Both lineages timed the checkers independently and put a commit at one to two seconds and a push at one to three.

The test corpus holds little deletable bloat. The suites that look duplicated are not, and the test files under `specs/` never run. The overengineering is in how the checks are arranged: one long serial job, a checkout of 134,000 files in every job, a serial advisor suite, and a workflow that runs gate-critical tests in a mode that cannot fail.

## 2. Method and Trust

Two lineages ran ten iterations each on DeepSeek V4.1 Flash at max effort. `opencode-go` ran through cli-opencode on the OpenCode Go provider. `pi-llmgateway` ran through cli-pi on LLM Gateway. Neither saw the other's work. The orchestrator then checked the main claims by command. Section 9 lists what was confirmed, what was corrected and what stays inferred.

The run changed no test, workflow, hook or source file.

## 3. Where the Wait Comes From

### Per-push wall clock

Measured with `gh run list --limit 120`, push events grouped by commit, from the first run created to the last run updated.

| Commit | Runs | Wait | Sum of all runs | Slowest workflow |
|---|---|---|---|---|
| `57b392ad` | 14 | 297 s | 1,828 s | sk-doc Script Tests |
| `cd04303e` | 10 | 220 s | 1,127 s | sk-doc Script Tests |
| `6fd44fcf` | 10 | 441 s | 1,484 s | sk-doc Script Tests |
| `68297d86` | 16 | 1,015 s | 3,277 s | Spec-Kit Check |
| `e336aa3b` | 19 | 843 s | 3,816 s | Spec-Kit Check |
| `483d0e88` | 16 | 899 s | 3,307 s | Spec-Kit Check |

The wait is about a quarter to a third of the summed run time. A cut that does not touch the slowest workflow leaves the wait unchanged.

### Inside `Spec-Kit Check`

Step durations from the latest completed run, steps of 15 seconds or more.

| Step | Duration |
|---|---|
| CLI vitest project | 490 s |
| Legacy module lanes and the bash validation suites | 161 s |
| Run every doctor script suite | 110 s |
| Runtime vitest project | 79 s |
| Install and build the spec-kit packages | 73 s |
| Install test dependencies | 55 s |
| Install the workspace and build its shared package | 42 s |
| Checkout, three jobs | 25 to 27 s each |

The CLI vitest project, the legacy lanes and the runtime vitest project run one after another in one job. That job is about 830 seconds of the 843 to 1,015 second wait.

### Inside `sk-doc Script Tests`

| Step | Duration |
|---|---|
| Run the sk-doc script tests | 182 s |
| Checkout, four jobs | 58 to 61 s each |
| Install the packages the scripts load | 43 s |

The workflow's own header says it runs on every push because two of its tests walk the whole repository.

### Checkout

The repository tracks 133,851 files and 2.1 GB. About 1.8 GB of that is under `specs/`, and 88,003 of the 113,605 tracked files under `specs/` are research, review, scratch or archive artifacts. Every job checks all of it out. Checkout takes 25 to 64 seconds per job.

The earlier CI packet already measured the fix. Its probe recorded a sparse checkout at 3 seconds against a 52 second baseline and applied it to one workflow, `rule-canary-sync.yml`, which now finishes in about 10 seconds. One workflow of 32 uses it.

## 4. Ranked Recommendations

Ranked by wait saved. Each row carries a label from the packet's set: delete, merge, narrow or move.

| Rank | Path | Label | Wait saved | Regression it stops catching | Evidence |
|---|---|---|---|---|---|
| 1 | `.github/workflows/spec-kit-check.yml`, the job that runs the CLI vitest project, the legacy lanes and the runtime vitest project in sequence | move: run the three as parallel jobs | About 240 s on a spec-kit push, from about 830 s to about 590 s | None. Every test still runs | Step times confirmed. The saving is inferred: each new job pays its own checkout and install |
| 2 | `.github/workflows/spec-kit-check.yml`, legacy module lanes | narrow, after one measurement | Up to 161 s of runner time. No extra wait once rank 1 is built | Whatever the three legacy harnesses assert that the CLI vitest project does not | Duration confirmed. The overlap is unmeasured |
| 3 | `.github/workflows/sk-doc-script-tests.yml` | narrow: keep the two repository-walking tests on every push and path-filter the rest | Up to about 180 s on pushes that do not touch sk-doc | sk-doc script regressions introduced by a change outside sk-doc paths | Duration and missing path filter confirmed. Which tests walk the repository is taken from the workflow header |
| 4 | Checkout step in every workflow that does not read `specs/` | narrow: roll out the sparse cone already used in `rule-canary-sync.yml` | About 20 to 55 s per job. About 50 s off the every-push floor | None, when the cone names every path the job reads. A missing path fails the job loudly | 3 s against 52 s measured by the earlier packet. Per-workflow path lists are not yet written |
| 5 | `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`, `fileParallelism: false` | narrow: one parallel trial with the shared-state suites kept serial | Unmeasured. The serial suite step is 309 s | Nothing by design. The risk is tests that share the daemon, socket or skill-graph database | The setting is confirmed. The saving is not |
| 6 | `.github/workflows/advisory-checks.yml`, the report-only node test step | move: put the gate-critical suites into a blocking job | None. This restores enforcement | None. It adds coverage | Confirmed: all four steps carry `continue-on-error: true`, and no other workflow calls `run-node-tests.mjs` |
| 7 | `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs` and its `test:sharded` script | delete | None | None. Nothing calls it | Confirmed: the only references are its own `package.json` entry and two READMEs |
| 8 | 89 test-suffixed files under `specs/**/scratch/` | move out of the test census | None | None. No runner collects them | Confirmed: 89 of 97 non-archived matches sit under `scratch/` |

Ranks 1, 3 and 4 are the ones that shorten the wait. Together they would take a spec-kit push from about 14 to 17 minutes down to about 10, and an ordinary push from about 4 to 7 minutes down to about 2 to 3. Those totals are estimates built from the step times above and are not measured.

## 5. Where the Lineages Disagree

**Deleting the workflows that repeat a local hook.** `opencode-go` recommends deleting `comment-hygiene.yml`, `naming-standard-guard.yml` and `agent-mirror-sync.yml` for 265 seconds, and narrowing `routing-registry-drift.yml` for up to 120 more. `pi-llmgateway` rules the same deletion out, because those workflows are the only check for a commit made with `--no-verify` or from a clone without the hooks.

The two do not contradict each other on facts. Both agree the checker files are shared with the pre-commit hook, and the orchestrator confirmed that for comment hygiene and agent mirror sync. They differ on whether the backstop is worth its cost.

The orchestrator's reading is that the question matters less than either lineage thought. These workflows run for 85 to 148 seconds each, in parallel, and never set the wait. Deleting them saves runner minutes and nothing the operator feels. Given that, keeping the backstop is the cheaper choice. This is a judgement, and it changes if runner minutes are billed or capped.

## 6. Findings That Correct the Starting Picture

- **The hooks are fast.** `opencode-go` timed six pre-commit checkers at 0.09 to 0.13 seconds each and the push-time track sweep at 2.27 seconds. `pi-llmgateway` timed four checkers at 0.07 to 0.20 seconds. The 1,056-line pre-commit hook costs about one second in process starts.
- **`specs/` is not a test corpus.** The inventory counted about 110 test files there. Almost all are captured logs under `scratch/`, and no workflow or vitest config collects any of them.
- **Same-named test files are not duplicates.** `progressive-validation` exists in both `tests/` and `cli/tests/` with 64 and 68 test names and no overlap. One drives a child process and the other runs in process.
- **The shared setup file and the deep-loop serial list are not bloat.** The 71-line setup file stops tests from writing the checked-in database. The serial list covers 12 of 173 files.
- **Most of a cheap workflow is plumbing.** `playbook-operator-contract` runs 93 seconds for under 8 seconds of checking. `changed-packet-validation` runs 129 seconds for under 8. Checkout and install are the rest.

## 7. Eliminated Alternatives

| Alternative | Why it was ruled out |
|---|---|
| Cut pre-commit gates for speed | Every measured gate is under a quarter second |
| Delete test files that share a basename | The pairs test different layers and share no test names |
| Delete the shared vitest setup or the deep-loop serial list | Both guard a real failure and cost little |
| Delete test files under `specs/` to save time | They never run, so the saving is zero |
| Reopen caching, trigger hygiene or workflow merging | Settled in `repo-operations/002-ci-workflow-efficiency` |
| Rank cuts by summed workflow seconds | The wait is the slowest workflow, so the sum misleads |
| Treat `main` as having no required checks | A ruleset requires the message-contract check. See section 9 |

## 8. Divergence Map

- Saturated directions: hook timing, the `specs/` test census and same-named test pairs. Both lineages reached the same answer independently.
- Pivots taken: `opencode-go` moved from "which workflows are bloat" to "which checks cost anything at all" and pulled per-step durations. The orchestrator moved from summed seconds to per-push wait.
- Failed pivots: none recorded by either lineage.
- Audited overrides: none.
- Remaining frontier: the legacy-lane overlap, the advisor parallel trial, per-workflow sparse path lists, and local `npm test` time, which neither lineage measured.

## 9. Verification

Checked by the orchestrator after the lineages finished.

| Claim | Source | Result |
|---|---|---|
| `main` has no branch protection, so no workflow is a required check | `opencode-go` | **Corrected.** Classic protection returns 404, but two rulesets are active. `message-contract-required` requires the message-contract status check. No other workflow is required |
| Comment hygiene and agent mirror sync use the same checker file in CI and in pre-commit | both | Confirmed by `grep` in both files |
| `advisory-checks.yml` cannot fail, and it is the only caller of `run-node-tests.mjs` | `pi-llmgateway` | Confirmed: four `continue-on-error: true` steps, one caller |
| The advisor default suite runs files serially | both | Confirmed: `fileParallelism: false` at `vitest.config.ts:40` |
| `run-tests-sharded.mjs` has no callers | `opencode-go` | Confirmed |
| CLI vitest project 490 s, legacy lanes 161 s, doctor suite 110 s | `opencode-go` | Confirmed against the latest completed run |
| Test files under `specs/` never run | both | Scratch share confirmed. That no runner collects them is taken from both lineages and not re-checked |
| Hook checker timings | both | Not re-run. Two independent lineages agree |
| The wait equals the slowest workflow | orchestrator | Measured on six pushes |
| Sparse checkout takes 3 s against 52 s | earlier packet | Read from its decision record, not re-measured |

One more correction applies to the lineage totals. `pi-llmgateway` answered two of its five strategy questions and marked per-step CI timing as unavailable. `opencode-go` obtained those timings from `gh run view`, so that gap is closed.

## 10. Open Questions

1. Does the 161-second legacy lane assert anything the CLI vitest project does not? Run both with a reporter that records test names and compare.
2. Which paths does each workflow read? That list decides how far the sparse checkout can roll out.
3. Does the advisor suite pass with files in parallel once the shared-state suites are kept serial?
4. How long do the local `npm test` runs take now, and how often does the operator wait on them? Neither lineage measured this. The earlier phases put the deep-loop suite near 505 seconds and the cli lane near 200.
5. Should the 88,003 research, review, scratch and archive files under `specs/` stay tracked? They are most of the checkout cost, and this run added to them.
6. Does the operator widen the parent scope, which excludes deleting tests? Only rank 2 could delete test code, and only after its measurement.

## 11. References

- `research/lineages/opencode-go/research.md` and its `iterations/iteration-001.md` to `iteration-010.md`
- `research/lineages/pi-llmgateway/research.md` and its `iterations/iteration-001.md` to `iteration-010.md`
- `.github/workflows/spec-kit-check.yml`, `sk-doc-script-tests.yml`, `advisory-checks.yml`, `rule-canary-sync.yml`
- `.skilled/scripts/git-hooks/pre-commit`, `pre-push`, `lib/gates.tsv`
- `specs/system-speckit/repo-operations/002-ci-workflow-efficiency/004-setup-caching-provisioning/decision-record.md`, the sparse checkout probe
- `gh run list` and `gh run view` output read on 2026-11-12

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 20, ten per lineage
- Questions answered: 7 of 10 across both lineage strategies
- Remaining questions: 3, all in the `pi-llmgateway` strategy, and closed in part by the other lineage's step timings
- New-information ratio, `opencode-go`: 0.90, 0.90, 1.00, 1.00, 1.00, 0.90, 0.70, 0.85, 1.00, 0.60
- New-information ratio, `pi-llmgateway`: 0.92, 0.90, 0.92, 0.90, 0.90, 0.90, 0.88, 0.90, 0.82, 0.55
- Convergence threshold: 0.05, recorded as telemetry only because the run was held to forced depth
- Divergence summary: no divergent pivots recorded
