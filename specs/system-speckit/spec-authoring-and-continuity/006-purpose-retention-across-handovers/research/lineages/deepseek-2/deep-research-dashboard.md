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
- Started: 2026-11-13T21:03:26.000Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-deepseek-2-1794603759690-pm09h3
- Parent Session: dr-1794603751398
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Where problem, purpose and user need are written today, per level and for a phase parent, and which places are required and validated (Q1) | authoring-contract | 0.94 | 9 | complete |
| 2 | For each hop surface, what it reads and emits, and whether the purpose travels (Q2) | hop-surfaces | 0.95 | 10 | complete |
| 3 | Real packet evidence: whether purpose is restated, shortened or absent across handovers and saves, and whether phase children restate the parent purpose (Q3) | corpus-evidence | 0.94 | 9 | complete |
| 4 | Which candidate change closes the measured purpose gap at the lowest cost, testing the operator's three candidates against the failure points (Q4) | candidate-evaluation | 0.94 | 9 | complete |
| 5 | What is ruled out and why, with a stress test of the continuity-field recommendation (Q5) | ruled-out-and-stress-test | 0.87 | 11 | complete |

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
- newInfoRatio sparkline: ▇▇▇█████▇▇▇▇▇▇▇▆▅▄▂▁
- score sparkline: ▇▇▇█████▇▇▇▇▇▇▇▆▅▄▂▁
- Last 3 ratios: 0.94 -> 0.94 -> 0.87
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.87
- coverageBySources: {"code":41,"other":9}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None at the Q1 level. The mechanism is fully described above. (iteration 1)
- Searching for a dedicated "user need" template: none exists, so the answer must name the nearest existing carrier rather than a purpose field. Recorded as finding 8 rather than an unanswered question. (iteration 1)
- Treating `acceptance-criteria.md` as a purpose carrier: its sections are METADATA, CRITERIA (Given/When/Then rows) and CLOSURE STATEMENT, so it measures completion and carries no why. [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:41-83] (iteration 1)
- Searching `runtime/hooks/` for a runtime adapter that injects `spec.md` content at compaction or startup found none; every adapter emits summary, folder pointer, lookup and recovery instruction. Candidate for "Exhausted Approaches": per-runtime hook search for a purpose field. (iteration 2)
- Treating `/speckit:resume` as a purpose carrier: its output contract has no purpose field, so even a full read of spec.md cannot surface one through the resume packet. [SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:174] (iteration 2)
- Treating the compaction "Goal" facet as a purpose carrier: the code fills it from `next_safe_action`, so the label is misleading rather than a path. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:299] (iteration 2)
- Explaining child drift as a few bad packets: 700 of 1,029 measured pairs fall below 0.10 overlap, so drift is the corpus-wide default. (iteration 3)
- Searching packet-level artifacts for the relaunch note format (`## Goal` / `## Done` / `## Remaining work` / `## In-flight state`) returned zero files. The relaunch note is runtime state under `.skilled/skills/.state/`, not a packet document. Candidate for "Exhausted Approaches": looking for relaunch notes inside packets. (iteration 3)
- Treating `handover.md` as the purpose carrier across saves: the template has no purpose slot and 71 of 96 real handovers never mention purpose, problem, objective or user need. (iteration 3)
- Treating the continuity block as a purpose carrier: the block is present in 99.5% of summaries, yet the save target has no purpose section and no summary restates the purpose sentence. (iteration 3)
- Adding a new parent-level document to carry purpose: the parent already has exactly one prose document, and the measured problem is that its purpose is empty or generic, not that a document is missing. (iteration 4)
- Candidate A as a purpose mechanism: acceptance criteria measure completion and have no why slot; adding them at the parent also breaks the lean-trio contract. (iteration 4)
- Candidate C as a standalone fix: the parent template already requires root purpose; without a stamp/validation change and a real value, a template edit changes nothing measured. (iteration 4)
- Looking for a validator rule that grades the content of a purpose statement: `ANCHORS_VALID` grades presence, and `PLACEHOLDER_FILLED` grades only template tokens. No rule judges whether the sentence says anything. Candidate for "Exhausted Approaches": searching for semantic purpose validation. (iteration 4)
- `/speckit:resume` as it stands: no purpose slot, contradictory spec.md read. (iteration 5)
- `goal.md` as the general carrier: 30.5% coverage and a median 0.256 overlap with Purpose. (iteration 5)
- `handover.md` as the carrier: no slot, 71/96 real handovers omit purpose vocabulary. (iteration 5)
- A validator-only fix: presence and token checks cannot grade meaning, and fail-closed enforcement has a 297-packet migration cost. (iteration 5)
- New parent-level document (acceptance criteria or dedicated purpose file): no purpose slot, lean-trio conflict, 297-parent migration. (iteration 5)
- Parent template alone: already requires root purpose; no enforcement and a generic generator default. (iteration 5)
- Relying on children to restate the parent naturally: 0 of 1,029 pairs share a 60-character run and the median overlap is 0.067. (iteration 5)
- Searching for a real relaunch note to sample: the handoffs directory is empty and gitignored; there is no packet-level history to measure. (iteration 5)
- Searching for a semantic purpose validator: none exists; `ANCHORS_VALID` and `PLACEHOLDER_FILLED` are structural only. This is the second iteration on this path; promote to "Exhausted Approaches". (iteration 5)
- The compaction `Goal` facet: it is `next_safe_action`. (iteration 5)
- The continuity block as it stands: ubiquitous but purpose-blind. (iteration 5)
- The relaunch note: ephemeral, gitignored runtime state, unvalidated. (iteration 5)

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
