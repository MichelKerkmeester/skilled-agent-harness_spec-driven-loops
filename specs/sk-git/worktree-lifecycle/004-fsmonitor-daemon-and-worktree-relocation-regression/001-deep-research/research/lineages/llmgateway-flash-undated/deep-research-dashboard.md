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
- Topic: Root-cause and fix design for git fsmonitor daemon pile-up and hangs in this repo: why the main checkout fsmonitor daemon stopped answering IPC and stalled a pre-push hook for 30 minutes, why 11 daemons accumulate across nested worktrees, what regressed sk-git/026 worktree relocation and reaper daemon handling, and how to prevent old daemons from running on. Start from specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md and answer its section 8 questions.
- Started: 2026-10-27T08:40:11Z
- Status: INITIALIZED
- Iteration: 1 of 3
- Session ID: fanout-llmgateway-flash-undated-1793089867710-lr8jpt
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Repo-side regression forensics: what unset speckit.worktreeBase and removed the reaper's daemon handling, and which git call sites run without a timeout | - | 0.92 | 6 | complete |

- iterationsCompleted: 1
- keyFindings: 6
- openQuestions: 3
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/5
- [x] What unset speckit.worktreeBase and removed the reaper's daemon handling, and does anything still create worktrees under .worktrees/ by default?
- [x] Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor?
- [ ] What is git 2.50.1's documented daemon lifecycle on macOS? Does a daemon ever exit on its own, and how do fsmonitor.socketDir, idle shutdown and git fsmonitor--daemon stop behave when the daemon is wedged? [legacy-import]
- [ ] Is event overload the real cause of the hang, or is there a known daemon deadlock in this git version, for example around --ipc-threads or the cookie-file handshake? [legacy-import]
- [ ] What is the safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 3
- [ ] What is git 2.50.1's documented daemon lifecycle on macOS? Does a daemon ever exit on its own, and how do fsmonitor.socketDir, idle shutdown and git fsmonitor--daemon stop behave when the daemon is wedged?
- [ ] Is event overload the real cause of the hang, or is there a known daemon deadlock in this git version, for example around --ipc-threads or the cookie-file handshake?
- [ ] What is the safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 0.92
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.92
- coverageBySources: {"code":2,"other":12}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `git log -S "fsmonitor"` across `.skilled/bin/` and `.opencode/bin/` history returns nothing — no reaper revision ever handled fsmonitor; further history search on this path is exhausted. (iteration 1)
- Blaming the `.opencode` → `.skilled` source-root move (`330427cf308`) for the lost daemon handling: the removal predates it by two weeks and is a distinct commit. (iteration 1)
- Reverting `3c7c3f83874` to "restore" the reaper's daemon handling: the removed code targeted memory-launcher daemons that no longer exist; a revert would restore dead code, not fsmonitor coverage. (iteration 1)
- Searching for a committed `speckit.worktreeBase`: the key is local-only by design; `git log -S` hits are only the scripts that read/write it. (iteration 1)

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
Follow up on: Lead to verify in iteration 2: `git check-ignore` accepts `--no-index` to skip the index read entirely, which would remove the fsmonitor dependency at the three check-ignore call sites without changing their semantics...

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
