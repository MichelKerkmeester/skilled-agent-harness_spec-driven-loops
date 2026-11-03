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
- Topic: Close every known gap in the operator decision-capture feature and find changes that make it more maintainable and prevent overengineering. Known gaps: answers reach a decision record only when /speckit:save runs; the pending-answer nudge shows only on Claude and OpenCode, not Devin, Codex or Pi; Codex captures only at save time from its rollout, because a live hook needs hook trust; Cursor is marked unverified and Hermes is absent from the runtime matrix; chat-answer pairing depends on the saving model's judgment; process questions (Gate 3, spec folder, branch) are filtered by keyword; a Claude nudge emitted at session exit is lost; the Codex and Pi sweeps exit 0 silently on an unreadable transcript while the Claude and Devin sweeps report an error. Maintainability: five live adapters and five save-time readers each parse a storage format another tool owns (OpenCode SQLite, Codex rollout, Devin and Pi session files, Claude transcript). For each gap say whether it is worth closing, the smallest change that closes it, and what to delete or merge rather than add. Code: .skilled/hooks/decision-capture/, .opencode/plugins/decision-capture.js, .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts and decision-table-matcher.ts, runtime/cli/continuity/match-decision-table.ts, .skilled/commands/speckit/save.md. Read-only research: do not edit code.
- Started: 2026-11-02T17:22:08Z
- Status: COMPLETE
- Iteration: 2 of 2
- Session ID: fanout-luna-1793639912371-mz7z8d
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
| 1 | Runtime coverage, save boundary, nudge delivery, chat/process classification, and sweep errors | - | 0.42 | 6 | complete |
| 2 | Smallest changes and parser ownership | - | 0.58 | 5 | complete |

- iterationsCompleted: 2
- keyFindings: 11
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which capture and save-time paths currently exist for each runtime, and where does each listed gap sit?
- [x] Which gaps are confirmed by executable code or live-run evidence, and which are stale or unverified claims?
- [x] What is the smallest justified change for each confirmed gap, and what code can be merged or deleted?
- [x] Which decisions can be paired or filtered deterministically without adding a new layer?
- [x] Which storage readers can be consolidated without moving format ownership or losing failure reporting?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▁▁▂▂▂▃▃▄▄▄▅▅▅▆▆▇▇▇██
- score sparkline: ▁▁▂▂▂▃▃▄▄▄▅▅▅▆▆▇▇▇██
- Last 3 ratios: 0.42 -> 0.58
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.58
- coverageBySources: {"other":25}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

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
