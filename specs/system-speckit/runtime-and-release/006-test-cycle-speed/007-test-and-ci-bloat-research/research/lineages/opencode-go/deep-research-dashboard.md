---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Which automated tests, CI workflows and git hook checks in this repository are bloat or overengineered, and what should be deleted, merged, narrowed or moved off the commit and push path to shorten test and workflow run time? Read the inventory and CI run times in specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md first. Subjects: .github/workflows/, .skilled/scripts/git-hooks/, the vitest and node:test suites under .skilled/skills/*/runtime, and test files under specs/. Settled and not to repeat: caching, trigger hygiene and workflow consolidation in specs/system-speckit/repo-operations/002-ci-workflow-efficiency, and the per-file splits and CI timing in phases 001 to 005 of specs/system-speckit/runtime-and-release/006-test-cycle-speed. For each proposed cut give the file path, the time it saves, and the regression it would stop catching. Research only: change no test, workflow, hook or source file.
- Started: 2026-11-12T07:32:26Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-opencode-go-1794468674878-lojzwl
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | The commit and push path: which local hook checks run, what each costs, and whether hook time explains the operator wait | hooks | 0.90 | 5 | complete |
| 2 | Which CI workflows duplicate a local gate, and whether the duplicate costs more in setup than in checking | ci-workflows | 0.90 | 7 | complete |
| 3 | The spec-kit runtime test tree and its runners: file counts, entry points, custom runners and duplicate hypotheses | spec-kit-tests | 1.00 | 7 | complete |
| 4 | Advisor and deep-loop suites: whether their cost is config, serialization, install, or duplicated runs | runtime-suites | 1.00 | 7 | complete |
| 5 | Test files under specs/: what the census counted, what actually runs, and whether the surface is real | specs-tests | 1.00 | 7 | complete |
| 6 | Shared helpers, process-spawn density and the doctor suite: which infrastructure costs more than it returns | test-infrastructure | 0.90 | 7 | complete |
| 7 | Measured per-step CI times and the first ranked cut list with the regression each cut would stop catching | ranking | 0.70 | 7 | insight |
| 8 | Verify the top deletion candidates against live enforcement, checker identity and hidden coverage | verification | 0.85 | 7 | insight |
| 9 | Second tier of CI workflows: whether their cost is checkable work or plumbing, and whether any further cut exists | ci-workflows | 1.00 | 7 | complete |
| 10 | Consolidation, confirmed-versus-inferred classification and the closing ranked cut list | synthesis | 0.60 | 7 | insight |

- iterationsCompleted: 10
- keyFindings: 70
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which CI workflows duplicate a local hook, another workflow, or a guard that fires no unique regression, and how many minutes does each remove per push or PR?
- [x] Which tests under .skilled/skills/*/runtime are redundant, mirror the implementation, or re-assert the framework, and what does each suite cost on the commit and push path?
- [x] Which pre-commit and pre-push hook checks cost the most wall-clock time, and which could move to CI or run only on changed paths?
- [x] Which test files under specs/ guard retired or closed-packet code rather than shipping behavior?
- [x] Which test infrastructure (custom harnesses, serial lists, shared fixtures, helper layers) costs run time or maintenance without proportional coverage?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▆▆▇██████▇▆▄▃▄▆▇█▄▁
- score sparkline: ▆▆▆▇██████▇▆▄▃▄▆▇█▄▁
- Last 3 ratios: 0.85 -> 1.00 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":65,"other":57}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `parent-skill-check.cjs` timed with a bare skill path returned exit 2 (wrong argument shape), so its cost is not part of the measured set. The remaining checker costs are small enough that one missing sample does not change the conclusion. Candidate for promotion to "exhausted approaches" only if a later iteration needs a per-gate budget table. (iteration 1)
- Adding a `package.json` scripts block as a recommendation: it would change repository structure for no measured saving, and this packet is research only. (iteration 1)
- Reporting the hook gates as bloat without measurement: the measurements above show the opposite, so a "delete pre-commit gates" recommendation is ruled out on evidence. (iteration 1)
- Timing the whole hook end-to-end by running a real commit: forbidden, since this lineage may not write outside its directory and a commit writes the index and objects. (iteration 1)
- Per-job runner minutes for each workflow are not in the packet and are not derivable from `spec.md`'s per-workflow means, which include queue time. Any per-workflow saving claimed from here is an estimate bounded by the workflow mean, not a measured job time. Candidate for promotion to "exhausted approaches" if a later iteration keeps reaching for per-job attribution. (iteration 2)
- Recommending a composite setup action or dependency caching: settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`. (iteration 2)
- Recommending path filters for the 13 unfiltered workflows: trigger hygiene is settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`. (iteration 2)
- Recommending that any two workflows be merged into one: settled as `D8 = no` in `002-ci-workflow-efficiency/008-consolidation-decision`. The cuts proposed here are deletions or narrowings of duplicate coverage, which is a different decision from merging job shapes. (iteration 2)
- Treating `message-contract.yml` as a duplicate to delete after reading only its name; its body carries PR-only coverage. (iteration 2)
- Deleting a `tests/` copy because its basename also exists under `cli/tests/`: measured zero shared test names for the one pair that looked most alike, so the basename-collision signal is rejected as evidence of duplication. (iteration 3)
- No single test file dominates runtime; the package's own CI comment states that no file dominates the CLI project's run time. A "delete the slowest test file" strategy therefore has no target and is a dead end for this tree. (iteration 3)
- Proposing that CI stop building before testing: the builds are prerequisites for `dist`-mapped checks, so the cost is real work, not waste. The cut belongs to a build-caching decision owned by `002-ci-workflow-efficiency/004-setup-caching-provisioning`. (iteration 3)
- Re-measuring per-file vitest durations: settled in phases 001 to 005 of this packet. (iteration 3)
- Deleting the deep-loop serial list as overengineering: it serializes 12 of 173 files for a documented reason (tests that measure elapsed time, kill child processes or race the graph lock), so it buys determinism for 7% of the suite. (iteration 4)
- No measurement separated advisor install time from test time. The workflow mean of 457s bounds the total and includes queue time, so the split between install and suite remains estimated rather than measured. (iteration 4)
- Reporting the tree sizes from an unpruned `find`: 381 files would have overstated the advisor tree by 106%, so the inflated count is rejected. (iteration 4)
- Treating the advisor's two suites as a duplicate run: the include patterns are disjoint by design, and the config comment records that running them together fails on shared daemon state. (iteration 4)
- Deleting the 292 MB orca context tree as a test-bloat cut: it is untracked working material belonging to another packet, and deleting it is outside this research scope. (iteration 5)
- Pricing a `specs/` test deletion as a run-time saving: there is no execution path, so the saving is 0 minutes and claiming otherwise would inflate the ranking. (iteration 5)
- Recommending that these files be wired into CI so they "earn their keep": that would add run time to a packet whose purpose is to remove it. (iteration 5)
- Searching for a hidden runner by packet name (`cli-jev-workflow-integration`) found only benchmark scripts and fixture indices that reference packet paths as data, never a test command. (iteration 5)
- Calling the doctor folder "three parallel test frameworks": 54 of its 59 files are one framework, so the framing would overstate the maintenance cost. (iteration 6)
- Deleting or merging the shared Vitest setup: it prevents tests from writing the checked-in database and fails closed when the environment points there, so removing it trades a 71-line file for production-state corruption. (iteration 6)
- No shared-fixture duplication exists to cut. Both candidate helpers are single copies with distinct jobs, so the "helper layer" branch of key question 5 closes with a negative result. (iteration 6)
- Treating spawn-heavy tests as overengineering by default: spawning is how a CLI is tested at all; the finding prices the cost without proposing removal. (iteration 6)
- No further cut surfaced inside the 490s CLI Vitest project. Per-file timing is settled in phases 001 to 005, and iteration 3 confirmed that no single file dominates. That 490s is the work the repository actually wants to buy. (iteration 7)
- Pricing the `message-contract` narrowing in seconds: the job's cost is its checkout, so the honest number is zero and the benefit is maintenance, not time. (iteration 7)
- Pricing the legacy-lane cut at its full 161s: the overlap with the CLI Vitest project is unmeasured, so the table carries it as an upper bound with a measurement gate rather than a saving. (iteration 7)
- Recommending `fetch-depth` changes on the four cheap workflows: their full-history checkout is 70-95% of their cost, but setup provisioning is settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`, and the deletion above removes the checkout with the workflow. (iteration 7)
- Arguing from branch protection: there is none, so the "required check" objection does not apply here and is recorded as a verified negative rather than an assumption. (iteration 8)
- Claiming that CI is unnecessary because the hooks exist: the hooks are machine-wide installs, not repository properties, so a contributor without them gets no enforcement at all. The finding keeps that regression and prices it as the cost of the deletion. (iteration 8)
- Deleting `naming-standard-guard.yml` wholesale: it would take two pytest files with it, so the ranked cut must be "delete the workflow, move its two guard tests into an existing script-test workflow". (iteration 8)
- No required-check list exists to inspect, because the branch is unprotected. The verification therefore ends at "nothing requires it by name", which is the strongest statement the repository supports. (iteration 8)
- Calling `trigger-index-rebuild`'s second job wasteful: it performs the push that makes the rebuild durable, and a rebuild that is not committed is not a rebuild. (iteration 9)
- No second-tier workflow has a deletable duplicate. Their checks are unique, and the overlap found in iteration 2 was confined to the four guard workflows plus the routing workflow. (iteration 9)
- Recommending narrower checkout or shallower clone for them: that is the settled setup work in `002-ci-workflow-efficiency/004-setup-caching-provisioning`. (iteration 9)
- Recommending that the six second-tier workflows run on a schedule instead of every push: that is trigger hygiene, settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`. (iteration 9)
- Recommending that these workflows drop their checks: the checks are 6-39% of each workflow, so a check cut saves seconds and loses coverage. (iteration 9)
- Any recommendation that repeats settled work: path filters, dependency caching, composite setup, and workflow merging are all named as settled rather than re-proposed. (iteration 10)
- Pricing the specs scratch logs or the dead sharded runner as time savings: both are 0s, and presenting them as minutes would inflate the ranking. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
