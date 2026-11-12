---
title: "Deep Research Strategy - test and CI bloat"
description: "Strategy and progress ledger for the opencode-go research lineage of phase 007 test-and-ci-bloat-research."
trigger_phrases:
  - "test and ci bloat research strategy"
  - "opencode-go lineage strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - test and CI bloat

## 1. OVERVIEW

### Purpose

Persistent brain for the `opencode-go` research lineage. Records what to investigate, what worked, what failed and where to focus next. The reducer owns the machine-owned sections and rewrites them after each iteration.

### Usage

- Init: topic, key questions, non-goals, stop conditions and known context are set here.
- Per iteration: the executor reads Next Focus, writes the iteration narrative, records one iteration event through the append gateway, and the reducer refreshes the machine-owned sections.

---

## 2. TOPIC
Which automated tests, CI workflows and git hook checks in this repository are bloat or overengineered, and what should be deleted, merged, narrowed or moved off the commit and push path to shorten test and workflow run time?

Read `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md` first for the inventory and CI run times. Subjects: `.github/workflows/`, `.skilled/scripts/git-hooks/`, the vitest and node:test suites under `.skilled/skills/*/runtime`, and test files under `specs/`.

Settled and not to repeat: caching, trigger hygiene and workflow consolidation in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`, and the per-file splits and CI timing in phases 001 to 005 of `specs/system-speckit/runtime-and-release/006-test-cycle-speed`.

For each proposed cut: the file path, the time it saves, and the regression it would stop catching. Research only: change no test, workflow, hook or source file.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which CI workflows duplicate a local hook, another workflow, or a guard that fires no unique regression, and how many minutes does each remove per push or PR?
- [x] Which tests under .skilled/skills/*/runtime are redundant, mirror the implementation, or re-assert the framework, and what does each suite cost on the commit and push path?
- [x] Which pre-commit and pre-push hook checks cost the most wall-clock time, and which could move to CI or run only on changed paths?
- [x] Which test files under specs/ guard retired or closed-packet code rather than shipping behavior?
- [x] Which test infrastructure (custom harnesses, serial lists, shared fixtures, helper layers) costs run time or maintenance without proportional coverage?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-litigating CI caching, trigger-path hygiene or the workflow consolidation decision settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`.
- Re-deriving the per-file test splits and CI runner timings already measured in phases 001 to 005 of this packet.
- Editing, deleting or rewriting any test, workflow, hook, script or source file. This is a research packet; a later phase builds approved cuts.
- Judging test style or naming where it costs no run time.

---

## 5. STOP CONDITIONS
- Ten iterations completed (`config.maxIterations: 10`, `stopPolicy: max-iterations`); convergence before the cap is telemetry only and widens the review angle rather than ending the run.
- Every key question has a cited answer and each recommendation names a path, an estimated saving and the regression it stops catching.
- A hard stop only if the lineage directory becomes unwritable or the append gateway refuses a record three times.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which CI workflows duplicate a local hook, another workflow, or a guard that fires no unique regression, and how many minutes does each remove per push or PR?
- Which tests under .skilled/skills/*/runtime are redundant, mirror the implementation, or re-assert the framework, and what does each suite cost on the commit and push path?
- Which pre-commit and pre-push hook checks cost the most wall-clock time, and which could move to CI or run only on changed paths?
- Which test files under specs/ guard retired or closed-packet code rather than shipping behavior?
- Which test infrastructure (custom harnesses, serial lists, shared fixtures, helper layers) costs run time or maintenance without proportional coverage?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- timing the individual read-only checkers instead of the whole hook isolated cost per gate without mutating the repository, and it overturned the premise in one pass. (iteration 1)
- mapping workflow name to checker path to hook line turned "which workflows are bloat" into a citation chain, and the setup-versus-check split fell out of the same pass. (iteration 2)
- measuring the runner layer rather than guessing at test semantics produced four deletable artifacts with line-level evidence, and the basename check prevented a wrong deletion. (iteration 3)
- reading the vitest configs before the tests found the cost multiplier (serial execution of the whole default set) and falsified the serial-list hypothesis in two reads. (iteration 4)
- splitting the tracked set by containing directory turned a plausible test corpus into scratch logs in one command, and reading three filenames confirmed what the suffix count could not. (iteration 5)
- counting spawn sites rather than files put a number on the per-test cost driver, and reading the setup file turned a suspected bloat item into a load-bearing guard. (iteration 6)
- replacing the packet's queue-inclusive workflow means with per-step `gh run view` durations turned nine candidate cuts into measured savings, and it exposed that four of them are 75-95% checkout time. (iteration 7)
- checking branch protection first removed the strongest objection to deletion in one call, and reading the naming workflow's second step found the one candidate whose deletion would take tests with it. (iteration 8)
- pricing each workflow as checkout plus install plus work turned six plausible candidates into a negative result with numbers, which is more useful than six unranked maybes. (iteration 9)
- re-running the four verification commands turned the top recommendations from "measured earlier" into "confirmed now", which is what an operator needs before deleting a merge gate. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `parent-skill-check.cjs` rejected a bare skill path, so one gate is unmeasured; the effect is negligible because the gate runs only for staged skill changes. (iteration 1)
- per-job time attribution failed because the only timing source is workflow-level and includes queue time; the finding stays bounded by that. (iteration 2)
- the duplicate-test-by-name hypothesis collapsed because the two trees were written independently; only a name-level comparison can show that cheaply. (iteration 3)
- the first census included `node_modules` and overstated file counts by 2x; pruning and cross-checking against the spec's own numbers caught it before it became a finding. (iteration 4)
- the first pass grouped by packet and produced a confident-sounding "82% in one packet" finding that was technically true and substantively misleading; the directory split corrected it before it reached the delta. (iteration 5)
- the helper-layer hypothesis failed because there is only one shared helper; the negative result is worth recording so no later iteration re-opens it. (iteration 6)
- the legacy-lane saving could not be closed, because proving overlap needs a lane-by-lane comparison that would cost more than the iteration budget. (iteration 7)
- the gate-input manifest was the wrong place to look for workflow enumerations; the script checks hook and workflow *inputs*, not a list of workflows. (iteration 8)
- the hope that the second tier held another deletable duplicate failed; their checks are unique, and only one step duplicates another inside its own workflow. (iteration 9)
- the two remaining uncertainties cannot be closed without running suites, so they stay named as measurement gates instead of becoming confident claims. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `parent-skill-check.cjs` timed with a bare skill path returned exit 2 (wrong argument shape), so its cost is not part of the measured set. The remaining checker costs are small enough that one missing sample does not change the conclusion. Candidate for promotion to "exhausted approaches" only if a later iteration needs a per-gate budget table. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `parent-skill-check.cjs` timed with a bare skill path returned exit 2 (wrong argument shape), so its cost is not part of the measured set. The remaining checker costs are small enough that one missing sample does not change the conclusion. Candidate for promotion to "exhausted approaches" only if a later iteration needs a per-gate budget table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `parent-skill-check.cjs` timed with a bare skill path returned exit 2 (wrong argument shape), so its cost is not part of the measured set. The remaining checker costs are small enough that one missing sample does not change the conclusion. Candidate for promotion to "exhausted approaches" only if a later iteration needs a per-gate budget table.

### Adding a `package.json` scripts block as a recommendation: it would change repository structure for no measured saving, and this packet is research only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Adding a `package.json` scripts block as a recommendation: it would change repository structure for no measured saving, and this packet is research only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a `package.json` scripts block as a recommendation: it would change repository structure for no measured saving, and this packet is research only.

### Any recommendation that repeats settled work: path filters, dependency caching, composite setup, and workflow merging are all named as settled rather than re-proposed. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Any recommendation that repeats settled work: path filters, dependency caching, composite setup, and workflow merging are all named as settled rather than re-proposed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any recommendation that repeats settled work: path filters, dependency caching, composite setup, and workflow merging are all named as settled rather than re-proposed.

### Arguing from branch protection: there is none, so the "required check" objection does not apply here and is recorded as a verified negative rather than an assumption. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Arguing from branch protection: there is none, so the "required check" objection does not apply here and is recorded as a verified negative rather than an assumption.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Arguing from branch protection: there is none, so the "required check" objection does not apply here and is recorded as a verified negative rather than an assumption.

### Calling `trigger-index-rebuild`'s second job wasteful: it performs the push that makes the rebuild durable, and a rebuild that is not committed is not a rebuild. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Calling `trigger-index-rebuild`'s second job wasteful: it performs the push that makes the rebuild durable, and a rebuild that is not committed is not a rebuild.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Calling `trigger-index-rebuild`'s second job wasteful: it performs the push that makes the rebuild durable, and a rebuild that is not committed is not a rebuild.

### Calling the doctor folder "three parallel test frameworks": 54 of its 59 files are one framework, so the framing would overstate the maintenance cost. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Calling the doctor folder "three parallel test frameworks": 54 of its 59 files are one framework, so the framing would overstate the maintenance cost.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Calling the doctor folder "three parallel test frameworks": 54 of its 59 files are one framework, so the framing would overstate the maintenance cost.

### Claiming that CI is unnecessary because the hooks exist: the hooks are machine-wide installs, not repository properties, so a contributor without them gets no enforcement at all. The finding keeps that regression and prices it as the cost of the deletion. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Claiming that CI is unnecessary because the hooks exist: the hooks are machine-wide installs, not repository properties, so a contributor without them gets no enforcement at all. The finding keeps that regression and prices it as the cost of the deletion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming that CI is unnecessary because the hooks exist: the hooks are machine-wide installs, not repository properties, so a contributor without them gets no enforcement at all. The finding keeps that regression and prices it as the cost of the deletion.

### Deleting `naming-standard-guard.yml` wholesale: it would take two pytest files with it, so the ranked cut must be "delete the workflow, move its two guard tests into an existing script-test workflow". -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Deleting `naming-standard-guard.yml` wholesale: it would take two pytest files with it, so the ranked cut must be "delete the workflow, move its two guard tests into an existing script-test workflow".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting `naming-standard-guard.yml` wholesale: it would take two pytest files with it, so the ranked cut must be "delete the workflow, move its two guard tests into an existing script-test workflow".

### Deleting a `tests/` copy because its basename also exists under `cli/tests/`: measured zero shared test names for the one pair that looked most alike, so the basename-collision signal is rejected as evidence of duplication. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Deleting a `tests/` copy because its basename also exists under `cli/tests/`: measured zero shared test names for the one pair that looked most alike, so the basename-collision signal is rejected as evidence of duplication.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting a `tests/` copy because its basename also exists under `cli/tests/`: measured zero shared test names for the one pair that looked most alike, so the basename-collision signal is rejected as evidence of duplication.

### Deleting or merging the shared Vitest setup: it prevents tests from writing the checked-in database and fails closed when the environment points there, so removing it trades a 71-line file for production-state corruption. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Deleting or merging the shared Vitest setup: it prevents tests from writing the checked-in database and fails closed when the environment points there, so removing it trades a 71-line file for production-state corruption.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting or merging the shared Vitest setup: it prevents tests from writing the checked-in database and fails closed when the environment points there, so removing it trades a 71-line file for production-state corruption.

### Deleting the 292 MB orca context tree as a test-bloat cut: it is untracked working material belonging to another packet, and deleting it is outside this research scope. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Deleting the 292 MB orca context tree as a test-bloat cut: it is untracked working material belonging to another packet, and deleting it is outside this research scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting the 292 MB orca context tree as a test-bloat cut: it is untracked working material belonging to another packet, and deleting it is outside this research scope.

### Deleting the deep-loop serial list as overengineering: it serializes 12 of 173 files for a documented reason (tests that measure elapsed time, kill child processes or race the graph lock), so it buys determinism for 7% of the suite. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Deleting the deep-loop serial list as overengineering: it serializes 12 of 173 files for a documented reason (tests that measure elapsed time, kill child processes or race the graph lock), so it buys determinism for 7% of the suite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting the deep-loop serial list as overengineering: it serializes 12 of 173 files for a documented reason (tests that measure elapsed time, kill child processes or race the graph lock), so it buys determinism for 7% of the suite.

### No further cut surfaced inside the 490s CLI Vitest project. Per-file timing is settled in phases 001 to 005, and iteration 3 confirmed that no single file dominates. That 490s is the work the repository actually wants to buy. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No further cut surfaced inside the 490s CLI Vitest project. Per-file timing is settled in phases 001 to 005, and iteration 3 confirmed that no single file dominates. That 490s is the work the repository actually wants to buy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No further cut surfaced inside the 490s CLI Vitest project. Per-file timing is settled in phases 001 to 005, and iteration 3 confirmed that no single file dominates. That 490s is the work the repository actually wants to buy.

### No measurement separated advisor install time from test time. The workflow mean of 457s bounds the total and includes queue time, so the split between install and suite remains estimated rather than measured. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No measurement separated advisor install time from test time. The workflow mean of 457s bounds the total and includes queue time, so the split between install and suite remains estimated rather than measured.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No measurement separated advisor install time from test time. The workflow mean of 457s bounds the total and includes queue time, so the split between install and suite remains estimated rather than measured.

### No required-check list exists to inspect, because the branch is unprotected. The verification therefore ends at "nothing requires it by name", which is the strongest statement the repository supports. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No required-check list exists to inspect, because the branch is unprotected. The verification therefore ends at "nothing requires it by name", which is the strongest statement the repository supports.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No required-check list exists to inspect, because the branch is unprotected. The verification therefore ends at "nothing requires it by name", which is the strongest statement the repository supports.

### No second-tier workflow has a deletable duplicate. Their checks are unique, and the overlap found in iteration 2 was confined to the four guard workflows plus the routing workflow. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No second-tier workflow has a deletable duplicate. Their checks are unique, and the overlap found in iteration 2 was confined to the four guard workflows plus the routing workflow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No second-tier workflow has a deletable duplicate. Their checks are unique, and the overlap found in iteration 2 was confined to the four guard workflows plus the routing workflow.

### No shared-fixture duplication exists to cut. Both candidate helpers are single copies with distinct jobs, so the "helper layer" branch of key question 5 closes with a negative result. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No shared-fixture duplication exists to cut. Both candidate helpers are single copies with distinct jobs, so the "helper layer" branch of key question 5 closes with a negative result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No shared-fixture duplication exists to cut. Both candidate helpers are single copies with distinct jobs, so the "helper layer" branch of key question 5 closes with a negative result.

### No single test file dominates runtime; the package's own CI comment states that no file dominates the CLI project's run time. A "delete the slowest test file" strategy therefore has no target and is a dead end for this tree. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No single test file dominates runtime; the package's own CI comment states that no file dominates the CLI project's run time. A "delete the slowest test file" strategy therefore has no target and is a dead end for this tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No single test file dominates runtime; the package's own CI comment states that no file dominates the CLI project's run time. A "delete the slowest test file" strategy therefore has no target and is a dead end for this tree.

### Per-job runner minutes for each workflow are not in the packet and are not derivable from `spec.md`'s per-workflow means, which include queue time. Any per-workflow saving claimed from here is an estimate bounded by the workflow mean, not a measured job time. Candidate for promotion to "exhausted approaches" if a later iteration keeps reaching for per-job attribution. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Per-job runner minutes for each workflow are not in the packet and are not derivable from `spec.md`'s per-workflow means, which include queue time. Any per-workflow saving claimed from here is an estimate bounded by the workflow mean, not a measured job time. Candidate for promotion to "exhausted approaches" if a later iteration keeps reaching for per-job attribution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-job runner minutes for each workflow are not in the packet and are not derivable from `spec.md`'s per-workflow means, which include queue time. Any per-workflow saving claimed from here is an estimate bounded by the workflow mean, not a measured job time. Candidate for promotion to "exhausted approaches" if a later iteration keeps reaching for per-job attribution.

### Pricing a `specs/` test deletion as a run-time saving: there is no execution path, so the saving is 0 minutes and claiming otherwise would inflate the ranking. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Pricing a `specs/` test deletion as a run-time saving: there is no execution path, so the saving is 0 minutes and claiming otherwise would inflate the ranking.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pricing a `specs/` test deletion as a run-time saving: there is no execution path, so the saving is 0 minutes and claiming otherwise would inflate the ranking.

### Pricing the `message-contract` narrowing in seconds: the job's cost is its checkout, so the honest number is zero and the benefit is maintenance, not time. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Pricing the `message-contract` narrowing in seconds: the job's cost is its checkout, so the honest number is zero and the benefit is maintenance, not time.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pricing the `message-contract` narrowing in seconds: the job's cost is its checkout, so the honest number is zero and the benefit is maintenance, not time.

### Pricing the legacy-lane cut at its full 161s: the overlap with the CLI Vitest project is unmeasured, so the table carries it as an upper bound with a measurement gate rather than a saving. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Pricing the legacy-lane cut at its full 161s: the overlap with the CLI Vitest project is unmeasured, so the table carries it as an upper bound with a measurement gate rather than a saving.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pricing the legacy-lane cut at its full 161s: the overlap with the CLI Vitest project is unmeasured, so the table carries it as an upper bound with a measurement gate rather than a saving.

### Pricing the specs scratch logs or the dead sharded runner as time savings: both are 0s, and presenting them as minutes would inflate the ranking. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Pricing the specs scratch logs or the dead sharded runner as time savings: both are 0s, and presenting them as minutes would inflate the ranking.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pricing the specs scratch logs or the dead sharded runner as time savings: both are 0s, and presenting them as minutes would inflate the ranking.

### Proposing that CI stop building before testing: the builds are prerequisites for `dist`-mapped checks, so the cost is real work, not waste. The cut belongs to a build-caching decision owned by `002-ci-workflow-efficiency/004-setup-caching-provisioning`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Proposing that CI stop building before testing: the builds are prerequisites for `dist`-mapped checks, so the cost is real work, not waste. The cut belongs to a build-caching decision owned by `002-ci-workflow-efficiency/004-setup-caching-provisioning`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing that CI stop building before testing: the builds are prerequisites for `dist`-mapped checks, so the cost is real work, not waste. The cut belongs to a build-caching decision owned by `002-ci-workflow-efficiency/004-setup-caching-provisioning`.

### Re-measuring per-file vitest durations: settled in phases 001 to 005 of this packet. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-measuring per-file vitest durations: settled in phases 001 to 005 of this packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-measuring per-file vitest durations: settled in phases 001 to 005 of this packet.

### Recommending `fetch-depth` changes on the four cheap workflows: their full-history checkout is 70-95% of their cost, but setup provisioning is settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`, and the deletion above removes the checkout with the workflow. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Recommending `fetch-depth` changes on the four cheap workflows: their full-history checkout is 70-95% of their cost, but setup provisioning is settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`, and the deletion above removes the checkout with the workflow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending `fetch-depth` changes on the four cheap workflows: their full-history checkout is 70-95% of their cost, but setup provisioning is settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`, and the deletion above removes the checkout with the workflow.

### Recommending a composite setup action or dependency caching: settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Recommending a composite setup action or dependency caching: settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending a composite setup action or dependency caching: settled in `002-ci-workflow-efficiency/004-setup-caching-provisioning`.

### Recommending narrower checkout or shallower clone for them: that is the settled setup work in `002-ci-workflow-efficiency/004-setup-caching-provisioning`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Recommending narrower checkout or shallower clone for them: that is the settled setup work in `002-ci-workflow-efficiency/004-setup-caching-provisioning`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending narrower checkout or shallower clone for them: that is the settled setup work in `002-ci-workflow-efficiency/004-setup-caching-provisioning`.

### Recommending path filters for the 13 unfiltered workflows: trigger hygiene is settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Recommending path filters for the 13 unfiltered workflows: trigger hygiene is settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending path filters for the 13 unfiltered workflows: trigger hygiene is settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`.

### Recommending that any two workflows be merged into one: settled as `D8 = no` in `002-ci-workflow-efficiency/008-consolidation-decision`. The cuts proposed here are deletions or narrowings of duplicate coverage, which is a different decision from merging job shapes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Recommending that any two workflows be merged into one: settled as `D8 = no` in `002-ci-workflow-efficiency/008-consolidation-decision`. The cuts proposed here are deletions or narrowings of duplicate coverage, which is a different decision from merging job shapes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending that any two workflows be merged into one: settled as `D8 = no` in `002-ci-workflow-efficiency/008-consolidation-decision`. The cuts proposed here are deletions or narrowings of duplicate coverage, which is a different decision from merging job shapes.

### Recommending that the six second-tier workflows run on a schedule instead of every push: that is trigger hygiene, settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Recommending that the six second-tier workflows run on a schedule instead of every push: that is trigger hygiene, settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending that the six second-tier workflows run on a schedule instead of every push: that is trigger hygiene, settled in `002-ci-workflow-efficiency/003-trigger-and-job-hygiene`.

### Recommending that these files be wired into CI so they "earn their keep": that would add run time to a packet whose purpose is to remove it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Recommending that these files be wired into CI so they "earn their keep": that would add run time to a packet whose purpose is to remove it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending that these files be wired into CI so they "earn their keep": that would add run time to a packet whose purpose is to remove it.

### Recommending that these workflows drop their checks: the checks are 6-39% of each workflow, so a check cut saves seconds and loses coverage. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Recommending that these workflows drop their checks: the checks are 6-39% of each workflow, so a check cut saves seconds and loses coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending that these workflows drop their checks: the checks are 6-39% of each workflow, so a check cut saves seconds and loses coverage.

### Reporting the hook gates as bloat without measurement: the measurements above show the opposite, so a "delete pre-commit gates" recommendation is ruled out on evidence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reporting the hook gates as bloat without measurement: the measurements above show the opposite, so a "delete pre-commit gates" recommendation is ruled out on evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reporting the hook gates as bloat without measurement: the measurements above show the opposite, so a "delete pre-commit gates" recommendation is ruled out on evidence.

### Reporting the tree sizes from an unpruned `find`: 381 files would have overstated the advisor tree by 106%, so the inflated count is rejected. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reporting the tree sizes from an unpruned `find`: 381 files would have overstated the advisor tree by 106%, so the inflated count is rejected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reporting the tree sizes from an unpruned `find`: 381 files would have overstated the advisor tree by 106%, so the inflated count is rejected.

### Searching for a hidden runner by packet name (`cli-jev-workflow-integration`) found only benchmark scripts and fixture indices that reference packet paths as data, never a test command. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching for a hidden runner by packet name (`cli-jev-workflow-integration`) found only benchmark scripts and fixture indices that reference packet paths as data, never a test command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a hidden runner by packet name (`cli-jev-workflow-integration`) found only benchmark scripts and fixture indices that reference packet paths as data, never a test command.

### Timing the whole hook end-to-end by running a real commit: forbidden, since this lineage may not write outside its directory and a commit writes the index and objects. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Timing the whole hook end-to-end by running a real commit: forbidden, since this lineage may not write outside its directory and a commit writes the index and objects.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Timing the whole hook end-to-end by running a real commit: forbidden, since this lineage may not write outside its directory and a commit writes the index and objects.

### Treating `message-contract.yml` as a duplicate to delete after reading only its name; its body carries PR-only coverage. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `message-contract.yml` as a duplicate to delete after reading only its name; its body carries PR-only coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `message-contract.yml` as a duplicate to delete after reading only its name; its body carries PR-only coverage.

### Treating spawn-heavy tests as overengineering by default: spawning is how a CLI is tested at all; the finding prices the cost without proposing removal. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating spawn-heavy tests as overengineering by default: spawning is how a CLI is tested at all; the finding prices the cost without proposing removal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating spawn-heavy tests as overengineering by default: spawning is how a CLI is tested at all; the finding prices the cost without proposing removal.

### Treating the advisor's two suites as a duplicate run: the include patterns are disjoint by design, and the config comment records that running them together fails on shared daemon state. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the advisor's two suites as a duplicate run: the include patterns are disjoint by design, and the config comment records that running them together fails on shared daemon state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the advisor's two suites as a duplicate run: the include patterns are disjoint by design, and the config comment records that running them together fails on shared daemon state.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Spec packet: `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md` carries the measured inventory: ~1,270 test files, ~427,643 lines, 32 CI workflow files, and per-workflow wall-clock means (Spec-Kit Check 595s, Deep-Loop Runtime Tests 472s, Skill Advisor Stress Tests 457s, CodeQL 319s, sk-doc Script Tests 279s, OpenCode Plugin Tests 255s).
- `resource-map.md not present; skipping coverage gate` (config.resource_map_present is false at init).
- Settled precedent: `specs/system-speckit/repo-operations/002-ci-workflow-efficiency` owns caching, trigger hygiene and workflow consolidation; phases 001 to 005 own per-file splits and CI timing.

### Bounded Context Snapshot

- Source pointers: `.github/workflows/*.yml` (32 files, 3,867 lines); `.skilled/scripts/git-hooks/` (pre-commit, pre-push and helpers); `.skilled/skills/system-spec-kit/runtime` (353 test files); `.skilled/skills/system-skill-advisor/runtime` (186); `.skilled/skills/system-deep-loop/runtime` (174); `.skilled/commands/doctor/scripts` (56); `.skilled/skills/sk-doc/scripts` (54); `.skilled/skills/sk-design/sk-design-md-generator` (36); ~110 under `specs/`.
- Reuse candidates: the packet's own `spec.md` measured-behavior block, and the predecessor phase timings, so this lineage does not re-measure what is already recorded.
- Integration points: hook entrypoints invoke repo test runners; CI workflows mirror several local guards (`Naming Standard Guard`, `Command Tree Parity`, `Trigger Index Rebuild`, `Routing Registry Drift Guard`, `Message Contract`).
- Constraints and risks: hook wall-clock time is unmeasured in `spec.md`, so local-hook savings start inferred until a targeted measurement or a defensible static estimate is found; CI wall-clock includes queue time, so per-workflow attribution must say so.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-12T07:32:26Z
