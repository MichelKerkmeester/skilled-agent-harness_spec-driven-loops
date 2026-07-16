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
- Topic: Validate the behavioral claims of the skip-not-fail-on-live-owner fix to the substrate stress harness (run-substrate-stress-harness.mjs + substrate-runner-harness.vitest.ts)
- Started: 2026-05-31T08:32:19Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: dr-037-1780216339
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
| undefined | Q1 liveOwnerForService null path | - | 0.85 | 0 | insight |
| undefined | Q2 false-green guard | - | 0.25 | 0 | insight |
| undefined | Q3 TSV reproducibility | - | 0.95 | 0 | insight |
| undefined | Q4 graph-metadata attribution | - | 0.95 | 0 | insight |
| undefined | Q5 maintainer-mode leak | - | 0.95 | 0 | insight |

- iterationsCompleted: 5
- keyFindings: 85
- openQuestions: 3
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/5
- [x] Q1: Do genuine daemon crashes still FAIL? `liveOwnerForService()` must return null when nothing live owns the lease. Probe: TOCTOU, recycled PID, EPERM-as-alive, foreign-owned ownerPid. → ANSWERED iter 1
- [x] Q2: Does the false-green guard still fire in a clean env? Scenario 410 must be PASS/PARTIAL when daemons connect (no `runner:` SKIP rows). Probe: partial/zombie connect producing an all-SKIP set with no runner row. → ANSWERED iter 2
- [ ] Q3: Does the evidence TSV reproducibly show `runner:* SKIP` with owning pids and a stable explanation?
- [ ] Q4: Is the ~1437 `graph-metadata.json` churn pre-existing + operator background rescans, NOT harness-produced?
- [ ] Q5: Is the `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` leak genuinely sidestepped by skip-not-fail, or merely hidden?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 3
- [ ] Q3: Does the evidence TSV reproducibly show `runner:* SKIP` with owning pids and a stable explanation?
- [ ] Q4: Is the ~1437 `graph-metadata.json` churn pre-existing + operator background rescans, NOT harness-produced?
- [ ] Q5: Is the `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` leak genuinely sidestepped by skip-not-fail, or merely hidden?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.95 -> 0.95 -> 0.95
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.95
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q3: Does the evidence TSV reproducibly show `runner:* SKIP` with owning pids and a stable explanation?

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
