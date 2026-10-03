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
- Topic: Improve, refine and expand the Jev citation drift scan (cli-jev feature 032). Its scorer is .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs in sk-doc, and it measures sk-doc document validation, which resolves path:line citations in tracked skill docs and reports dead ones with zero calls. Measured result: verdict jev: keep K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=3 p=2.384e-7. Real data on a small sample of 40. Jev judges whether a live citation still supports its claim, which the zero-call check cannot. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
- Started: 2026-10-02T22:33:38Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Session ID: fanout-luna-1790979783604-glohfs
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | unknown | - | 1.00 | 0 | complete |
| 2 | unknown | - | 0.90 | 0 | complete |
| 3 | unknown | - | 0.85 | 0 | complete |

- iterationsCompleted: 3
- keyFindings: 21
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] What in the scorer, sample, and paired comparison drove the recorded result, and what does it not establish? [legacy-import]
- [ ] Which changes could raise semantic accuracy or reduce Jev call cost while retaining the zero-call structural scan? [legacy-import]
- [ ] What label, sampling, and reporting changes would make the measurement more trustworthy? [legacy-import]
- [ ] Where else inside `.skilled` would claim-to-source semantic judgment produce useful signal? [legacy-import]
- [ ] What would a default-on integration require, cost, and risk? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] What in the scorer, sample, and paired comparison drove the recorded result, and what does it not establish?
- [ ] Which changes could raise semantic accuracy or reduce Jev call cost while retaining the zero-call structural scan?
- [ ] What label, sampling, and reporting changes would make the measurement more trustworthy?
- [ ] Where else inside `.skilled` would claim-to-source semantic judgment produce useful signal?
- [ ] What would a default-on integration require, cost, and risk?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▆▆▅▅▄▄▃▃▃▂▂▂▂▁▁▁
- score sparkline: ██▇▇▆▆▅▅▄▄▃▃▃▂▂▂▂▁▁▁
- Last 3 ratios: 1.00 -> 0.90 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {}
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
What provider retention and exact historical output contents applied to the 047 run? The packet note and inspected call logger do not agree.

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
