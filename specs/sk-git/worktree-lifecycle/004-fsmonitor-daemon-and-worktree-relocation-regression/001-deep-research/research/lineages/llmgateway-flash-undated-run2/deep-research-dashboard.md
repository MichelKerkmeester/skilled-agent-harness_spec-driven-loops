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
- Started: 2026-10-27T09:52:14Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-llmgateway-flash-undated-run2-1793094321851-ufzori
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
| 1 | The sk-git/026 regression: who moved the worktrees back and where the reaper's daemon handling went | - | 0.85 | 10 | complete |
| 2 | Git 2.50.1 daemon lifecycle and the wedge: an acknowledged infinite wait, not a repo bug | - | 0.90 | 10 | complete |
| 3 | The repo's unbounded git call sites and the safest default posture | - | 0.90 | 10 | complete |

- iterationsCompleted: 3
- keyFindings: 30
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1. What unset speckit.worktreeBase and removed the reaper's daemon handling, and does anything still create worktrees under .worktrees/ by default?
- [x] Q2. What is git 2.50.1's documented fsmonitor daemon lifecycle on macOS, and how do fsmonitor.socketDir, idle shutdown and git fsmonitor--daemon stop behave when the daemon is wedged?
- [x] Q3. Is event overload the real cause of the hang, or is there a known daemon deadlock in this git version, for example around --ipc-threads or the cookie-file handshake?
- [x] Q4. Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor?
- [x] Q5. What is the safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▁▂▂▃▄▅▅▆▇███████████
- score sparkline: ▁▂▂▃▄▅▅▆▇███████████
- Last 3 ratios: 0.85 -> 0.90 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"code":39,"other":33}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- "A repo commit reverted the relocated worktree base." Ruled out: the key is local config; the only repo-side actor is the wrapper's write-back. (iteration 1)
- "The `.opencode` → `.skilled` move removed the daemon handling." Ruled out: `git log -S daemon` puts the deletion in `3c7c3f83874` (2026-09-03), and the move commit `330427cf30` (2026-09-17) is the only commit touching the current path. (iteration 1)
- "The relocation never happened or was rolled back by hand." Ruled out: the sk-git/026 summary records the migration and the file-count drop; `~/worktrees` exists but is empty, which is the relocation's residue. (iteration 1)
- Git-config provenance for `speckit.worktreeBase`: `.git/config` is not versioned, so the exact unset action is unrecoverable from the repository. Recorded as an explicit UNKNOWN rather than guessed. (iteration 1)
- "`--ipc-threads=8` is a repo or Apple-specific tuning knob that might itself deadlock." Ruled out as a repo cause: 8 is the compiled default of `fsmonitor.ipcthreads`, and the repo sets no `fsmonitor.*` key. It remains a risk multiplier, not a root cause. (iteration 2)
- "A git upgrade fixes it." Ruled out for 2.51-2.53 by their release notes; the source comment in 2.50.1 states the timed wait was not implemented. (iteration 2)
- "The daemon can be expected to exit on its own after idling." Ruled out: no idle timeout exists in the manual or the source, and the macOS health thread is an empty stub. (iteration 2)
- Locating a Darwin health-check policy: the implementation is an empty stub, so there is no policy to read. The daemon's own liveness is explicitly unmonitored on macOS. (iteration 2)
- "Disable fsmonitor everywhere." Rejected as the default rather than ruled out as an option: it discards a measured benefit on a 570k-file checkout, and per-worktree config gives the same safety with a narrower blast radius. (iteration 3)
- "Match daemons by command line." Ruled out by finding 7: argv is identical for every daemon. (iteration 3)
- "Rely on `git fsmonitor--daemon stop` in a reaper." Ruled out by iteration 2: stop hangs on exactly the daemon a reaper needs to remove. (iteration 3)
- "Restore the reaper's daemon handling." Ruled out by iteration 1: that code targeted MCP context-server daemons and the reaper now promises never to signal a process. (iteration 3)
- Trying to design a cmdline-based daemon reaper failed against the census — every daemon's argv is identical, so the reaper needs the socket path, which is a stronger requirement than sk-git/026's MCP-era design. (iteration 3)

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
