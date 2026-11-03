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
- Topic: Close every known gap in the operator decision-capture feature and find changes that make it more maintainable and prevent overengineering. Known gaps: (1) answers reach a decision record only when /speckit:save runs; (2) the pending-answer nudge shows only on Claude and OpenCode, not Devin, Codex or Pi; (3) Codex captures only at save time from its rollout, because a live hook needs hook trust; (4) Cursor is marked unverified and Hermes is absent from the runtime matrix; (5) chat-answer pairing depends on the saving model's judgment; (6) process questions (Gate 3, spec folder, branch) are filtered by keyword; (7) a Claude nudge emitted at session exit is lost; (8) the Codex and Pi sweeps exit 0 silently on an unreadable transcript while the Claude and Devin sweeps report an error. Maintainability: five live adapters and five save-time readers each parse a storage format another tool owns (OpenCode SQLite, Codex rollout, Devin and Pi session files, Claude transcript). For each gap say whether it is worth closing, the smallest change that closes it, and what to delete or merge rather than add. Code: .skilled/hooks/decision-capture/, .opencode/plugins/decision-capture.js, .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts and decision-table-matcher.ts, runtime/cli/continuity/match-decision-table.ts, .skilled/commands/speckit/save.md. Read-only research: do not edit code.
- Started: 2026-11-02T17:21:00Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-deepseek-1793639912371-mz7z8d
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
| 1 | Live capture surface and runtime matrix (gaps 2, 3, 4, 7, 8 mechanism) | live-capture-surface | 0.88 | 10 | complete |
| 2 | Save-time readers, writer and matcher (gaps 1, 5, 6; parse-surface maintainability) | save-path | 0.80 | 11 | complete |
| 3 | Per-gap verdicts, smallest changes, and the deletion/merge surface | maintainability | 0.60 | 10 | insight |

- iterationsCompleted: 3
- keyFindings: 31
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which of the eight known gaps are worth closing, and what is the smallest change that closes each one?
- [x] How many independent storage-format parsers exist across the five live adapters and five save-time readers, and which can be deleted or merged rather than fixed?
- [x] Which gaps close by removing a surface (an adapter, a sweep, a runtime-matrix row) instead of adding code?
- [x] What does each runtime actually expose for live capture, and are the Cursor "unverified" and Hermes "absent" rows worth filling or deleting?
- [x] What test coverage guards the capture path today, and which single refactor collapses the most duplicated tests?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███▇▇▇▇▇▆▆▆▅▅▄▄▃▃▂▂▁
- score sparkline: ███▇▇▇▇▇▆▆▆▅▅▄▄▃▃▂▂▁
- Last 3 ratios: 0.88 -> 0.80 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"other":53}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Counting the pause/gate hooks as capture adapters.** They share the tree but write no queue rows. (iteration 1)
- **Treating gap 3 as a missing adapter.** Codex already receives the answers; what is missing is a live read, and the README attributes that to hook trust. Building a Codex hook would either require per-user trust or duplicate the rollout read inside the runtime, so the sweep is the correct shape and the "gap" is a documentation claim, not missing behavior. (iteration 1)
- Reading `.skilled/hooks/coverage-rationale.md` for the Codex and Cursor rationale: the file has no `decision-capture` section, so the matrix's stated documentation contract cannot answer why those two cells are empty. Recorded as finding 7 instead of pursued. (iteration 1)
- **Making the live adapter write a decision record directly.** A capture hook runs before the session has a bound packet and before the operator has agreed the wording of a `decided` sentence; writing the record at capture time would either guess the packet or write an unbound row. The autosave path (finding 2) is the smaller change that keeps the packet binding. (iteration 2)
- **Replacing the matcher's scoring with exact text equality.** The scorer exists because hand-written rows phrase the same decision differently; exact equality would regress the one case the matcher was built for. (iteration 2)
- Looking for a code-level process filter on the writer side: none exists. The only executable filter is capture-side, so gap 6's save-half enforcement is prose alone. (iteration 2)
- **A model-free decision-record writer.** The record's `decided` sentence is the feature's product value; generating it from a template would fill `decision-record.md` with prose no reader can act on. (iteration 3)
- **Adding a Hermes runtime column.** The matrix is pinned by a test constant, Hermes has no adapter and no probe, and adding the column would document an absence the repo has no plan to fill. (iteration 3)
- Searching for a Cursor probe result: none exists, and no code path probes a runtime's question surface — the folder is populated by hand. (iteration 3)

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
