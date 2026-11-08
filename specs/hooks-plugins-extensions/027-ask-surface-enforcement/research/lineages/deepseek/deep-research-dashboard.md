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
- Topic: Research how to make an agent ask the operator for a decision through its runtime's native ask-question tool instead of ending a turn with a prose A/B/C option menu. The runtimes in scope are Claude Code (AskUserQuestion), Codex (request_user_input), Pi (the @juicesharp/rpiv-ask-user-question extension), OpenCode (its built-in question tool) and every other cli runtime in this repo that has one: Devin, Cursor, DSH (DeepSeek Harness) and Hermes. Prove for each runtime whether a tool exists and give its exact name. Read-only: write only under the research artifact directory. Cite file:line, or a binary or doc source, for every finding.
- Started: 2026-11-08T10:19:14Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-deepseek-1794132897320-q8eip1
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
| 1 | Claude Code ask surface (AskUserQuestion) and Stop-hook enforcement | - | 1.00 | 7 | complete |
| 2 | OpenCode, Pi and Codex ask surfaces and turn-end blocking | - | 1.00 | 8 | complete |
| 3 | Devin, Cursor, DSH and Hermes ask surfaces and turn-end blocking | - | 0.94 | 8 | complete |
| 4 | Detector heuristic, false-positive surface and fixtures | - | 0.90 | 9 | complete |
| 5 | Wiring, escape hatch and rule-text amendments | - | 0.85 | 10 | complete |

- iterationsCompleted: 5
- keyFindings: 42
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Per runtime: does an ask tool exist, what is its exact name, and is it always available or gated by a mode or flag?
- [x] Per runtime: which hook or plugin event can deterministically detect a turn that ends in a prose option menu with no ask-tool call, and block or re-prompt it? Which events can only observe?
- [x] What detector heuristic works (lettered or numbered option list plus a question near the end of the last assistant message, with no ask-tool call in the turn), and what is its false-positive risk on ordinary numbered steps, summaries and code blocks?
- [x] How should this be wired through hook-registry.json, sync-hook-registrations.cjs and the .skilled/hooks/<name>/<runtime>/ layout, reusing the decision-capture adapters, with the loop guard, sync versus async, and the escape hatch?
- [x] What exact rule-text amendments should go into communication-handoff.md §4/§5 and AGENTS.md Gate 3 inside the REPO RULES.md ask-surface carve-out, and should the prose fallback stay for runtimes without a tool?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██████▇▇▆▅▅▅▄▄▃▃▂▂▁▁
- score sparkline: ██████▇▇▆▅▅▅▄▄▃▃▂▂▁▁
- Last 3 ratios: 0.94 -> 0.90 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code.claude.com":2,"docs.claude.com":1,"other":39}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Blocking from `PostToolUse` on `AskUserQuestion`.** That event proves an ask happened but (iteration 1)
- **Reading `transcript_path` to recover the last message.** The hooks reference states the (iteration 1)
- None this iteration. The Claude path is fully evidenced. (iteration 1)
- **Assuming Pi `turn_end` is a supported blocking event.** `goal-context.ts` registers a (iteration 2)
- **Blocking an OpenCode turn end from the `event` hook.** The architecture table and the (iteration 2)
- **Treating Codex `PreToolUse` as the enforcement point.** It fires only when a tool runs, so (iteration 2)
- Codex Stop blocking: no repository contract, and a web search for the upstream hook contract (iteration 2)
- **Cursor as a runtime with a native ask tool.** No tool name, no sweep, no adapter. Naming (iteration 3)
- **Devin `Stop` as a blocking guard.** The repository uses Devin's blocking decision on (iteration 3)
- **Keeping Hermes in the matrix.** Verified removed, so the honest answer is "out of scope", (iteration 3)
- Cursor turn-end blocking: the hook contract documents the envelope but not which post-hoc (iteration 3)
- **A pure `last_assistant_message` check with no tool scan.** It cannot distinguish a turn (iteration 4)
- **Reusing `isProcessQuestion` as the guard's filter.** It suppresses scope, permission, gate (iteration 4)
- None. The detector's limits are documented in its own constants and tests. (iteration 4)
- **A blocking guard on every runtime.** Only Claude Code and DSH expose a turn-end seam; the (iteration 5)
- **Naming the tool in `AGENTS.md`.** It would breach the carve-out and duplicate a table that (iteration 5)
- **Removing the prose fallback entirely.** Claude subagents, DSH headless runs and (iteration 5)
- None. The wiring surface is fully mapped. (iteration 5)

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
