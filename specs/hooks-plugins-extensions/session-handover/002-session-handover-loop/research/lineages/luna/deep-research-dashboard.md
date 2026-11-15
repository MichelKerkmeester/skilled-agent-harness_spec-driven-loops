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
- Topic: Session relaunch loop as shipped on main through phases 024-032 (.skilled/bin/skilled-loop, .skilled/bin/skilled-loop-shell.sh, .skilled/hooks/session-relaunch/ lib, bin, claude, codex, hermes and pi adapters, .opencode/plugins session-relaunch, .hermes/plugins/repo-guards, .skilled/commands/speckit/handoff.md, their tests, README, feature catalog and playbooks). Find remaining defects and missing test coverage in four areas: (1) goal persistence across a hop on all seven runtimes (goal_packet in note and record, SESSION_RELAUNCH_GOAL_PACKET and HERMES_SPEC_FOLDER export and restore, SESSION_RELAUNCH_GOAL=0, receiver rebind); (2) model, provider and effort persistence (launch-flag capture and replay per runtime, live values from Claude log, Codex rollout, Cursor cli-config.json, Pi arm and Hermes post_api_request, precedence, validation and drop warnings, carry to later hops, OpenCode 2 and Devin limits); (3) OpenCode 2 --standalone first launch and relaunch, --server handling; (4) operator UX and edge cases: warnings and messages, manual claim command, nested runs, hop cap, cancel and withdraw, stale or racing records, odd paths and quoting, missing binaries, concurrent sessions. Every finding must cite file:line and say whether a test covers it.
- Started: 2026-10-25T11:36:21Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: fanout-luna-1792927892367-86umpv
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Goal packet sender path: note capture, SESSION_RELAUNCH_GOAL=0, and Codex boundary | - | 0.75 | 2 | complete |
| 2 | Receiver binding and manual claims for command-only runtimes | - | 0.65 | 1 | complete |
| 3 | Live model/provider precedence and carry-forward | - | 0.55 | 1 | complete |
| 4 | Cursor live model attribution across concurrent sessions | - | 0.50 | 1 | complete |
| 5 | OpenCode 2 and Devin runtime limits, including server option coverage | - | 0.38 | 1 | complete |
| 6 | Operator messages, manual commands, and missing runtime executable path | - | 0.32 | 1 | complete |
| 7 | Cancellation and withdrawal racing with wrapper consume | - | 0.45 | 1 | complete |
| 8 | Persisted hop-count validation and stale/concurrent record coverage | - | 0.24 | 1 | complete |
| 9 | Handoff path quoting and concurrent claims by receiver sessions | - | 0.22 | 1 | complete |
| 10 | Goal switch-off semantics and receiver rebinding reconciliation | - | 0.12 | 1 | complete |

- iterationsCompleted: 10
- keyFindings: 11
- openQuestions: 4
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/4
- [ ] How does each of the seven runtime adapters capture, persist, export, and rebind goal_packet across a relaunch, including SESSION_RELAUNCH_GOAL=0? [legacy-import]
- [ ] How does each runtime capture and replay model, provider, and effort, and where do precedence, validation, drop warnings, or later-hop carry-forward differ? [legacy-import]
- [ ] Does OpenCode 2 start and relaunch with --standalone, and how are --server and unsupported replay flags handled? [legacy-import]
- [ ] Which operator-facing and concurrency edge cases remain untested or defective across warnings, manual claim, nested runs, hop caps, cancel/withdraw, stale records, quoting, missing binaries, and concurrent sessions? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] How does each of the seven runtime adapters capture, persist, export, and rebind goal_packet across a relaunch, including SESSION_RELAUNCH_GOAL=0?
- [ ] How does each runtime capture and replay model, provider, and effort, and where do precedence, validation, drop warnings, or later-hop carry-forward differ?
- [ ] Does OpenCode 2 start and relaunch with --standalone, and how are --server and unsupported replay flags handled?
- [ ] Which operator-facing and concurrency edge cases remain untested or defective across warnings, manual claim, nested runs, hop caps, cancel/withdraw, stale records, quoting, missing binaries, and concurrent sessions?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▆▆▅▅▄▄▃▄▄▄▃▂▂▂▂▁
- score sparkline: █▇▇▆▆▆▅▅▄▄▃▄▄▄▃▂▂▂▂▁
- Last 3 ratios: 0.24 -> 0.22 -> 0.12
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.12
- coverageBySources: {"code":63}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None. (iteration 1)
- The automatic consume and claim paths do not expose a packet while SESSION_RELAUNCH_GOAL remains off; existing tests cover this receiver-side suppression. (iteration 1)
- The pending loop record stores the handoff path and settings, while consume reads and validates goal_packet from the note into its output. The consumer tests cover that output shape [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:747-760; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:693-738; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2495-2516]. (iteration 1)

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
Do all receiver adapters bind the consumed packet, and what happens on runtimes whose printed manual command starts a new process?

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
