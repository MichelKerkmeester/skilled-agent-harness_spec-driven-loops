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
- Topic: Verify and deepen the hand-over gap report at specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/scratch/handover-gaps-research-2026-11-13.md: for each claim about running workers at hand-over, session names across a hop and other state a hop drops, confirm or refute it against the code and each runtime's own help output, close the items it marks UNCONFIRMED, and name the smallest change for each confirmed gap
- Started: 2026-11-13T08:00:46Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Session ID: 2026-11-13T08:00:46Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Running-workers section (report section 2, Q1): verify each claim and citation | running-workers | 0.75 | 20 | complete |
| 2 | Session names across a hop (report section 3, Q2) with runtime help output, plus carried items: fan-out started pid and OpenCode child at parent idle | session-names | 0.80 | 8 | complete |
| 3 | Other dropped state (report section 4, Q3), report accuracy against the README (Q4), smallest changes and re-rank (Q5) | other-state-accuracy-rerank | 0.70 | 12 | complete |

- iterationsCompleted: 3
- keyFindings: 69
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Running workers: for each worker kind the report names (Claude background tasks, Claude foreground sub-agents, OpenCode task sessions, external CLI workers, fan-out lineages), does the code at hand-over do what the report says, and what do the two UNCONFIRMED items (an OpenCode child alive at parent idle, pid liveness in markOrphanedLineages) and the inferred orphan claim resolve to?
- [x] Session names: what happens to a session name on a hop per runtime, and which flag, command or API does each runtime's own help output (claude, pi, opencode, codex, cursor-agent, devin) offer for naming a session, including the shape of a Claude /rename entry?
- [x] Other dropped state: are the report's claims on permission mode, Pi mode flags, added directories and wakeups, crons and the todo list correct in the code, and do scheduled items end with the session?
- [x] Report accuracy: which claims or path:line citations in the report are refuted or wrong, and which of its proposed changes does the session-relaunch README already document as shipped?
- [x] Smallest changes: for each gap that survives verification, what is the smallest change, in which file and function, and how do the report's nine ranked changes re-rank?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅▅▅▆▆▆▇▇▇██▇▆▅▅▄▃▂▂▁
- score sparkline: ▅▅▅▆▆▆▇▇▇██▇▆▅▅▄▃▂▂▁
- Last 3 ratios: 0.75 -> 0.80 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"code":43,"code.claude.com":1,"other":19}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Looking for `markOrphanedLineages` inside `fanout-run.cjs`: it is only imported there, at line 41. The definition is in `fanout-pool.cjs:307`. (iteration 1)
- None yet. The OpenCode child-at-idle question moves to runtime help or source, not to more in-repo reads. (iteration 1)
- Using repository code to settle the OpenCode child-at-idle question: the behaviour belongs to the OpenCode runtime, not to this repo. (iteration 1)
- A launch flag for naming on Codex, Cursor, Devin and the OpenCode root command: the help output has none. Candidates for "Exhausted Approaches". (iteration 2)
- Reading `opencode session --help` for a rename: it has no title or name option. (iteration 2)
- Using `opencode run --title` on a hop: the wrapper starts the root command, not `run`. (iteration 2)
- A Claude launch flag that restores crons: none exists, and `--resume` is deny-listed on a hop. (iteration 3)
- A launch flag carrying added directories on OpenCode, Pi or Devin: their help has none. (iteration 3)
- Reading `~/.claude` file content for todo or cron storage: barred by the dispatch, and the names alone showed no such store. (iteration 3)

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
