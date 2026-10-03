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
- Topic: Improve, refine and expand the Jev spec-track narrowing (cli-jev feature 017). Its scorer is .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs in system-spec-kit, and it measures Gate 1 retrieval, where ripgrep and the committed trigger-index lookup find which specs/<track>/ a request belongs to. Measured result: verdict jev: keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330, p50 330 ms, p95 391 ms. Real data. Jev names the right track more often than ripgrep, but both are right on well under half of the 256 questions. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
- Started: 2026-10-02T22:45:46.144Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Session ID: fanout-luna-1790979783604-cne6rp
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
| 2 | unknown | - | 0.88 | 0 | complete |
| 3 | unknown | - | 0.84 | 0 | complete |

- iterationsCompleted: 3
- keyFindings: 19
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] What drove the benchmark result, and which data, model, or metric choices explain it? [legacy-import]
- [ ] Which changes can raise accuracy or lower cost without weakening the route? [legacy-import]
- [ ] How can a new measurement better represent real Gate 1 requests and produce trustworthy estimates? [legacy-import]
- [ ] Which other .skilled routing or classification decisions could benefit from measured judging? [legacy-import]
- [ ] What controls, cost, fallback, and risks would default-on integration require? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] What drove the benchmark result, and which data, model, or metric choices explain it?
- [ ] Which changes can raise accuracy or lower cost without weakening the route?
- [ ] How can a new measurement better represent real Gate 1 requests and produce trustworthy estimates?
- [ ] Which other .skilled routing or classification decisions could benefit from measured judging?
- [ ] What controls, cost, fallback, and risks would default-on integration require?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▆▅▅▄▄▃▃▂▂▂▂▂▂▁▁▁
- score sparkline: █▇▇▆▆▅▅▄▄▃▃▂▂▂▂▂▂▁▁▁
- Last 3 ratios: 1.00 -> 0.88 -> 0.84
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.84
- coverageBySources: {"code":20}
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
No research question remains; synthesis should consolidate the five requested answers and name the unknown release inputs.

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
