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
- Topic: Audit every skill and every skill mode (workflow mode packet) in the repository for where manual-testing-playbook scenarios should adopt the json conversation scenario format played by the shared conversation runner in sk-create-manual-testing-playbook. For each skill and mode: which existing playbook scenarios should be converted from single prompt to conversation, which should stay single prompt, which existing scenarios need updating, and which multi-turn, question-tool, restart, compaction or cross-runtime behaviors lack any scenario that a conversation would add. Apply the four ordered questions in .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md section Choosing the Scenario Style, cite each candidate with a SOURCE tag and its deciding question, and rank candidates by value and cost.
- Started: 2026-11-02 17:45:00 UTC
- Status: INITIALIZED
- Iteration: 8 of 10
- Session ID: fanout-luna-1793641098433-9lyu1r
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Style decision contract, corpus baseline, current conversation prototypes, and session-relaunch candidates | - | 1.00 | 6 | insight |
| 2 | Audit CLI session-continuity and lifecycle scenarios for Q2/Q3 fit, runner parity, missing compact/restart coverage, and value versus execution cost. | - | 0.84 | 5 | insight |
| 3 | Audit question-tool and answer-dependent playbook flows, including /doctor approval paths, while distinguishing Q2 lifecycle tests from Q3 release/parity checks and Q4 one-shot contracts. | - | 0.78 | 5 | insight |
| 4 | Classify non-lifecycle code, design, documentation and MCP scenarios, distinguishing Q1 judgment and destructive confirmation from Q4 one-shot command sequences. | - | 0.65 | 5 | insight |
| 5 | Audit system-deep-loop hub, deep-ai-council, deep-research, deep-review and runtime mode packets for conversation fit versus workflow-process state. | - | 0.56 | 5 | insight |
| 6 | Complete the CLI session-continuity audit across supported and unsupported runtime packages; separate single-session resume, explicit-id resume, fork, and detached parallel work. | - | 0.72 | 5 | insight |
| 7 | Audit remaining central /doctor and skill-advisor lifecycle flows for answer-dependent branching, later-turn goal injection, and one-time session cleanup. | - | 0.71 | 5 | insight |
| 8 | Audit remaining CLI goal-hook, cross-runtime authorization and MCP interaction packages; distinguish later-turn user flows from multi-command API and process-recovery scripts. | - | 0.63 | 5 | insight |

- iterationsCompleted: 8
- keyFindings: 41
- openQuestions: 4
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/5
- [x] Which candidates can the shared runner execute across its supported runtimes, and which are constrained by runtime support or host prerequisites?
- [ ] Which of the 55 skill and mode packages and the central /doctor package have scenarios that meet Q2 or Q3, which named files merit conversion, and which stay at Q1 or Q4? [legacy-import]
- [ ] Which existing scenario contracts exercise multiple exchanges, answer branching, restart, compaction or cross-runtime behavior while remaining manual or single-prompt, and what precise updates are needed? [legacy-import]
- [ ] Which skill or mode behaviors involving questions, user answers, restart, compaction or runtime parity have no scenario that covers them? [legacy-import]
- [ ] Which conversion, update and coverage candidates provide the highest operator or release risk reduction for their authoring and execution cost? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] Which of the 55 skill and mode packages and the central /doctor package have scenarios that meet Q2 or Q3, which named files merit conversion, and which stay at Q1 or Q4?
- [ ] Which existing scenario contracts exercise multiple exchanges, answer branching, restart, compaction or cross-runtime behavior while remaining manual or single-prompt, and what precise updates are needed?
- [ ] Which skill or mode behaviors involving questions, user answers, restart, compaction or runtime parity have no scenario that covers them?
- [ ] Which conversion, update and coverage candidates provide the highest operator or release risk reduction for their authoring and execution cost?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▅▅▄▃▃▂▁▁▂▃▄▃▃▃▃▂
- score sparkline: █▇▆▅▅▅▄▃▃▂▁▁▂▃▄▃▃▃▃▂
- Last 3 ratios: 0.72 -> 0.71 -> 0.63
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.63
- coverageBySources: {"other":70}
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
Which candidates should be ranked first after considering supported runtimes, runner semantics, host prerequisites, rollback and per-pass time?

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
