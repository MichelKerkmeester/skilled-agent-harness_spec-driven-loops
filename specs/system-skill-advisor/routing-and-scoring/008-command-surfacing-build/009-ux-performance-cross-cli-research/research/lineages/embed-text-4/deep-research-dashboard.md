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
- Topic: Embed text lane, segment four: measure what richer command embedding text buys the six no-recommendation commands, on a scratch copy of the advisor database and the owning command metadata, against the built state after phases 014 and 015
- Started: 2026-11-13T11:47:27Z
- Status: COMPLETE
- Iteration: 3 of 8
- Session ID: fanout-embed-text-4-1794570002424-6wv97k
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: all_questions_answered

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | KQ1: baseline capture on a scratch copy of the advisor database | embed-text | 0.45 | 5 | complete |
| 2 | KQ2: enriched command intent signals and re-embedded vectors on a scratch database copy | embed-text | 0.88 | 7 | complete |
| 3 | KQ3: build or decline with the exact files and the measured gain | embed-text | 0.35 | 7 | insight |

- iterationsCompleted: 3
- keyFindings: 19
- openQuestions: 0
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/3
- [x] KQ1: What are the before numbers at HEAD after phases 014 and 015, using the committed capture in `--real-embedding` mode against a scratch copy of the database: plain tune recall, false offers of 35, the holdout count, and the three doctor-family floor rows at 0.82?
- [x] KQ2: When the six no-recommendation commands get richer intent signals in scratch copies of their owning metadata and their command vectors are re-embedded with the live embedder, what changes in the same capture: tune recall, false offers of 35, holdout count, and the three doctor-family floor rows?
- [x] KQ3: Does the measured gain justify a build, with the exact files and the measured gain, or a decline, with the number; and which of the six cannot benefit until it has a scorer row?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▂▃▄▄▅▅▆▇▇██▇▆▅▅▄▃▂▂▁
- score sparkline: ▂▃▄▄▅▅▆▇▇██▇▆▅▅▄▃▂▂▁
- Last 3 ratios: 0.45 -> 0.88 -> 0.35
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.35
- coverageBySources: {"code":25,"other":18}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A plain file copy of the WAL-mode database: the `-wal` file may hold committed rows, so `.backup` was used for a consistent snapshot. (iteration 1)
- None yet. The lane has a working baseline and a scratch copy that the enrichment run can reuse. (iteration 1)
- Running the capture against the live database in place: it would measure whatever the daemon wrote and would leave no before snapshot for the after run. (iteration 1)
- Command vector enrichment alone cannot make `/create:skill-parent` reachable. This is a definitive dead end for that command until a bridge row exists. (iteration 2)
- Copying the enriched bridge projection over the tracked file so the capture's lexical lane sees it: that would modify a tracked file and break the isolation the measurement needs. (iteration 2)
- Re-embedding `/create:skill-parent`: there is no `vec_cmd_768` row and no TypeScript id, so the update would write a vector nothing reads. (iteration 2)
- Claiming the lexical half as measured: the scratch capture read the tracked bridge projection, so the lexical addition is a build-time risk, not a measured gain. (iteration 3)
- Declining the build: the measured cost of declining is 5 tune rows and 2 holdout rows left without a command, with no floor movement to justify the loss. (iteration 3)
- Enriching only the skill descriptions instead of command metadata: segment three rank 16 already declined it and measured 0 holdout gain; this lane's +2 comes from command vectors, not skill text. (iteration 3)
- Reusing the doctor route `lead_phrases` mechanism: it is for leading a passing skill, not for adding volume to the embedding text, and it carries its own state-word constraint. (iteration 3)
- Treating `/create:skill-parent` as part of the same gain: its measured gain is 0 until a scorer row exists, so folding it into the +5/+2 would overclaim. (iteration 3)

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
