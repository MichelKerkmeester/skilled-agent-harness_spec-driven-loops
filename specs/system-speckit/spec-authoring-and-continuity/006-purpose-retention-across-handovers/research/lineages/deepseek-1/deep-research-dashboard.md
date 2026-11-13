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
- Topic: Where a spec packet's problem, purpose and user need are dropped across session handovers, relaunch hops and context compactions in system-spec-kit, and which smallest change to its logic or templates keeps them. Answer the five numbered questions in section 7 OPEN QUESTIONS of specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md. Read-only research over .skilled/skills/system-spec-kit, .skilled/commands/speckit, .skilled/skills/system-deep-loop and specs. Cite every claim as [SOURCE: path:line]. The operator's candidate changes (parent-level acceptance criteria, a parent-level user story or purpose and problem section, an improved parent-specific spec template) are hypotheses to test against evidence, not conclusions.
- Started: 2026-11-13T22:05:00.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: fanout-deepseek-1-1794603759690-pm09h3
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1 — where a packet's problem, purpose and user need are written per level and for a phase parent, and which of those places is required and validated | purpose-surfaces | 1.00 | 9 | complete |
| 2 | Q2 — what each hop surface reads and emits, and whether the packet's purpose travels | hop-surfaces | 1.00 | 11 | complete |
| 3 | Q3 — measured purpose retention in the real packet corpus: handovers, continuity saves and phase-parent to child drift | corpus-measurement | 1.00 | 8 | complete |
| 4 | Q4 — ranking the operator's three candidates plus two evidence-supported alternatives by gap closure and cost | candidate-ranking | 0.80 | 10 | complete |
| 5 | Q5 — what is ruled out and why, plus the consumer-trace correction to iteration 4's recommendation | rule-outs | 0.70 | 10 | insight |

- iterationsCompleted: 5
- keyFindings: 48
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Where are a packet's problem, purpose and user need written today, per level and for a phase parent, and which of those places is required and validated?
- [x] For each hop surface, what does it read and what does it emit, and does the purpose travel? Surfaces: the Claude compaction hooks (`runtime/hooks/claude/compact-inject.ts`, `session-prime.ts`) and their counterparts for other runtimes under `runtime/hooks/`, `/speckit:resume`, `/speckit:handoff` and the session relaunch, `/speckit:save` with `generate-context.js`, the deep-loop iteration prompts and child-dispatch briefs.
- [x] In real packets under `specs/` that have a `handover.md` or several continuity saves, is the purpose restated, shortened or absent? Do phase children restate the parent's purpose or drift from it?
- [x] Which candidate change closes the measured gap at the lowest cost? The operator's candidates, to be tested and not assumed: acceptance criteria at the parent spec level, a user story or purpose and problem section at the parent level and an improved parent-specific spec template. Add any other candidate the evidence supports, for example a purpose field in the continuity block or in the compaction brief.
- [x] What is ruled out, and why?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███████████▇▆▅▄▃▂▂▁▁
- score sparkline: ███████████▇▆▅▄▃▂▂▁▁
- Last 3 ratios: 1.00 -> 0.80 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"code":50,"other":41}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Searching for a dedicated "user need" or "user story" token below Level 3. The template emits USER STORIES only for `level:3,3+`; there is no L1/L2 equivalent to find. (iteration 1)
- Treating `acceptance-criteria.md` as a purpose surface. Its schema has no purpose or user-need column, so parent-level acceptance criteria would not, by themselves, carry the purpose. (iteration 1)
- Treating `PLACEHOLDER_FILLED` as a purpose check. It only detects `[YOUR_VALUE_HERE:`/`[NEEDS_CLARIFICATION:` tokens; a filled but meaningless sentence passes, so it cannot be offered as the current purpose gate. (iteration 1)
- Looking for a "purpose" field in the continuity schema. `ThinContinuityRecord` has six fields and none is a purpose; a purpose string has no slot to occupy. (iteration 2)
- The hypothesis that a purpose paragraph in handover.md reaches the next session through the ladder. The parser extracts four labelled fields only; an unlabelled paragraph is not part of the signal shape. (iteration 2)
- The hypothesis that a runtime's compaction hook rehydrates the packet's spec.md. Every hook was grepped for ladder/authored-snapshot usage; the only importer is Claude's opt-in snapshot, and no hook reads spec.md. (iteration 2)
- Looking for a packet family where several continuity saves preserved the purpose by convention. The convention does not exist: the only recurring carriers are `spec.md` and, in one packet, `goal.md` pointers. (iteration 3)
- The hypothesis that continuity saves accumulate purpose over time because they are written repeatedly. 0 purpose-like keys exist in any continuity block in the corpus. (iteration 3)
- The hypothesis that handovers in practice restate the purpose because the template gives room for it. 0 of 97 have a heading and only one carries a restatement bullet, which no parser reads. (iteration 3)
- A new continuity field as the cheapest option: it is the most expensive of the five and still leaves handover-only packets uncovered. (iteration 4)
- A parent-level user story section as a standalone change: the parent template already has the purpose section, so the candidate is a no-op without a reader. (iteration 4)
- Looking for a hop that already reads `goal.md`. None exists; the durable directive has no consumer today. (iteration 4)
- Parent-level acceptance criteria as the closing change: no purpose column, only 10 of 319 parents have the file, and enabling it touches four or more edit points. (iteration 4)
- All seven candidates and habits listed in findings 4-10. (iteration 5)
- Treating the programmatic ladder as the brief's renderer. It is consumed only by the opt-in authored snapshot; the operator-facing brief is assembled by the command workflow from its reply format. (iteration 5)

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
