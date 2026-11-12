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
- Started: 2026-11-12T07:31:35Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-pi-llmgateway-1794468674878-lojzwl
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
| 1 | Local git hook surface: pre-commit and pre-push gate inventory, measured checker costs, advisory checks | git-hooks | 0.92 | 6 | complete |
| 2 | Pricing every hook gate: measured checker costs, fixed overhead, and the re-mint engines | git-hooks | 0.90 | 5 | insight |
| 3 | The CI workflow inventory: duplicate guards, report-only jobs, and scope mismatches | ci-workflows | 0.92 | 6 | complete |
| 4 | What the report-only test runner actually covers: 253 of 1,270 files, and the vitest include boundary | test-coverage | 0.90 | 6 | complete |
| 5 | The 111 spec-tree test files: inventory bloat that costs no minutes | test-coverage | 0.90 | 5 | complete |
| 6 | The system-spec-kit runtime suites: 339 blocking vitest files and 13 that cannot block | test-suites | 0.90 | 6 | complete |
| 7 | Skill-advisor and deep-loop suites: vitest-only trees whose cost is installation, not assertions | test-suites | 0.88 | 6 | complete |
| 8 | Test infrastructure: nine configs, a serial advisor suite, and a hand-maintained serial list | test-infrastructure | 0.90 | 6 | complete |
| 9 | Where the minutes actually are: the top six workflows are 58 percent of a sweep | ci-workflows | 0.82 | 6 | complete |
| 10 | The ranked cut list: seven candidates, their classes, savings and risks, with the negative results ranked | synthesis | 0.55 | 7 | insight |

- iterationsCompleted: 10
- keyFindings: 59
- openQuestions: 3
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/5
- [x] Which test files under `specs/` belong to closed packets, and what unique regression coverage would be lost by deleting them?
- [x] Which overengineered test infrastructure (custom harnesses, serial lists, fixtures, helper layers) costs run time or maintenance beyond the coverage it adds?
- [ ] Which CI workflows duplicate a local git hook check or another workflow, and how many seconds per run would deleting or merging them save? [legacy-import]
- [ ] Which test files under `.skilled/skills/*/runtime` are redundant, mirror the implementation, or re-assert framework behavior, and how long does each suite take? [legacy-import]
- [ ] Which git hook checks under `.skilled/scripts/git-hooks/` can move to CI or narrow to changed paths, and how much wall clock per commit and push does each cost? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 3
- [ ] Which CI workflows duplicate a local git hook check or another workflow, and how many seconds per run would deleting or merging them save?
- [ ] Which test files under `.skilled/skills/*/runtime` are redundant, mirror the implementation, or re-assert framework behavior, and how long does each suite take?
- [ ] Which git hook checks under `.skilled/scripts/git-hooks/` can move to CI or narrow to changed paths, and how much wall clock per commit and push does each cost?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████████████▇▇▇▇▇▆▃▁
- score sparkline: ████████████▇▇▇▇▇▆▃▁
- Last 3 ratios: 0.90 -> 0.82 -> 0.55
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.55
- coverageBySources: {"code":8,"other":101}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Invoking `check-comment-hygiene.sh` with `bash`: the script's shebang is `python3`, so the bash invocation produced a syntax error. Re-run under `python3`; the failed attempt is not a checker defect. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1] (iteration 1)
- Running the hooks themselves to time them: the hooks can re-mint and stage files (findings 1 and 4), so a measured run would mutate the tree. Timing was limited to read-only checkers. (iteration 1)
- Timing the re-mint gates by execution. They write to the index, so they cannot be measured without a scope violation. Their cost must be inferred from the engines they spawn, or measured by the operator in a scratch clone. (iteration 1)
- Hook-gate elimination for speed. Every measured gate is cheap; deleting one would save under a second and could only lose a check. Pre-commit gate deletion is rejected as a time optimisation and survives only as a maintenance simplification argument. (iteration 2)
- Timing `frontmatter-version.mjs` and `check-mcp-mutation-class.sh`: both contain write calls. (iteration 2)
- Timing the full `pre-commit` end to end: four of its gates rewrite the index, so the run cannot stay inside the research scope. (iteration 2)
- Treating hook latency as the primary time sink: measurement puts the whole hook path at about two seconds, against minutes in CI. (iteration 2)
- Deleting the hook-backstop workflows outright. Measured cost per run is 66-148 s for the guard cluster, but each one covers the uninstalled-hook case, which is the normal case for a fresh clone. (iteration 3)
- Re-arguing triggers, caching, or a workflow-consolidation decision: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`. (iteration 3)
- Treating every duplicate as deletable: `comment-hygiene.yml` and `agent-mirror-sync.yml` are the only backstop for a contributor whose hooks are not installed or trusted, so the cut is to stop paying for them on every run, not to remove them. (iteration 3)
- Mirror duplication as a source of bloat: `.opencode` holds 35 test files and links the rest, so cutting a duplicated test tree is not available. (iteration 4)
- Reading per-test timings from CI logs: no job-level or step-level durations are stored in the repository, and this research run cannot call the GitHub API (no network credential guaranteed, and no writes outside the lineage). Savings stay estimates against workflow means. (iteration 4)
- Treating the two measured advisory validators as the advisory job's cost: 2.77 s and 4.53 s are noise beside a 10-minute-timeout corpus run. (iteration 4)
- Counting them as "coverage to preserve": nothing runs them, so there is no coverage to lose. (iteration 5)
- Listing spec-tree test files as a time-saving cut: measured at zero run time. (iteration 5)
- Treating the phase's 1,270-file figure as the corpus size. It is a `git ls-files` census including archives, not the runnable set. (iteration 5)
- Deleting the three same-named suite pairs as duplicates: their imports show different layers and different mechanisms. (iteration 6)
- Ranking suites by line count as a proxy for run time. A 2,689-line in-process suite can be faster than a 299-line suite that spawns processes, and no per-file timing exists to settle it. (iteration 6)
- Treating the 13 `.test.mjs` files as a small tail: they include the largest and most behaviour-heavy suite in the tree. (iteration 6)
- Attributing the 457 s and 472 s means to specific suites without per-step durations; the install share is inferred from step order and the workflow's own quoted local test times. (iteration 7)
- Counting spawn-heavy suites as redundant: they are the only coverage for process-level behaviour (stdin deadlines, launcher reaping, hook contracts). (iteration 7)
- Institutionalising the stress/default split: the gate is what let the suite rot unseen; the config is the workaround, not the design. (iteration 7)
- Re-litigating CI caching to fix the install share: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`. (iteration 7)
- Deleting the stress configs without moving their suites: the suites catch real behaviour, and the week they were left unrun is what let them rot. (iteration 8)
- Pricing parallelism from the repository alone. Without per-config timing, a parallelism change is a hypothesis with a plausible mechanism, not a measured cut. (iteration 8)
- Treating the serial list as redundant configuration: several of those suites genuinely share a database or a port, so the list is necessary; what is missing is a check that it is complete. (iteration 8)
- Estimating per-step savings inside a workflow from its mean. The means include queue time, so a step-level number cannot be read from them. (iteration 9)
- Merging the guard workflows into one job: workflow consolidation is settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency` and is not re-opened here. (iteration 9)
- Ranking the small guards as the primary cuts: 23% of the sweep combined, and several of them cover the uninstalled-hook case that no other path covers. (iteration 9)
- Treating `CodeQL` as a cut candidate. (iteration 9)
- A cut inside `Spec-Kit Check`: the 339 vitest files it carries have no other door, so narrowing it without relocating them is coverage loss, not a saving. (iteration 10)
- Any cut that re-proposes trigger changes, caching, workflow consolidation or per-file splits: settled in `002-ci-workflow-efficiency` and phases 001-005. (iteration 10)
- Finding a single cut worth several minutes. The measured sweep is 4,129 s across 21 workflows with no duplication large enough to remove: the expensive workflows are expensive because of test volume and installs, both of which are real work or settled ground. (iteration 10)
- Summing candidate 1 with candidates 3 and 4: they are steps inside the same 87 s workflow mean, so adding them double-counts. (iteration 10)

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
Follow up on: **Leave the git hooks alone.** Paths `.skilled/scripts/git-hooks/*`. Class: **no cut**. Time saved by any hook deletion: under 1 s per commit, against a measured 1-2 s total. Regression it stops catching: whichever ga...

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
