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
- Topic: Session relaunch loop after phase 008 (.skilled/hooks/session-relaunch, .skilled/bin/skilled-loop, /speckit:handoff, the OpenCode plugin and runtime adapters, their tests and docs): find remaining drift between code, docs and spec records; latent bugs and edge cases; refinements; the ideal architecture of the core and adapters; and alignment gaps against the sk-code-skilled surface standards and checklists and the sk-doc document standards. Each finding needs file:line evidence and a concrete fix.
- Started: 2026-10-19T17:14:56Z
- Status: INITIALIZED
- Iteration: 1 of 5
- Session ID: fanout-luna-1792429886029-no7lpl
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Core state, filesystem boundaries and phase-record alignment | - | 1.00 | 2 | complete |

- iterationsCompleted: 1
- keyFindings: 8
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Does the core preserve session ownership, file privacy, time-boundary and lock invariants after phase 008? [legacy-import]
- [ ] Do runtime adapters translate usage, session identity and relaunch decisions consistently? [legacy-import]
- [ ] Does skilled-loop preserve handoff, claim, save, resume and relaunch behavior under failures? [legacy-import]
- [ ] Do tests cover the public behavior and edge cases claimed by docs and specs? [legacy-import]
- [ ] Which document, spec-record or standards gaps need correction? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Does the core preserve session ownership, file privacy, time-boundary and lock invariants after phase 008?
- [ ] Do runtime adapters translate usage, session identity and relaunch decisions consistently?
- [ ] Does skilled-loop preserve handoff, claim, save, resume and relaunch behavior under failures?
- [ ] Do tests cover the public behavior and edge cases claimed by docs and specs?
- [ ] Which document, spec-record or standards gaps need correction?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":9}
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
The document quality-control extractor was not run, so no structural checklist result or DQI score is claimed.

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
