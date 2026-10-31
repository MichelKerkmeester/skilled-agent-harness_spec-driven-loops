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
- Topic: Skill routing shape and doc clarity across every skill and hub under .skilled/skills, plus the command and agent docs that teach routing. Starting hypothesis to test, not assume: the sk-code advisor report at specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md (JSON decides stage one, one hub ROUTER.md decides leaf files, script resolvers handle the rest, each mode SKILL.md keeps a short routing section with the machine block moved to an appendix, no ROUTER.md per mode, JSON-only viable only as a hybrid). Answer with path:line evidence: (a) per skill, every routing mechanism and every place one routing decision is restated, and where copies have drifted; (b) which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current shape, and what each proposed change would break; (c) a verdict on per-mode ROUTER.md versus one hub ROUTER.md versus the advisor hybrid versus JSON-only, separately for hubs, mode packets and standalone skills; (d) readability findings per skill with quoted passages; (e) a phased implementation plan with order, risk and rollback. Read-only research: change no file outside your lineage directory.
- Started: 2026-10-28T07:26:00Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-pi-1793168730352-knacf5
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
| 1 | sk-code: test the advisor report line by line against the hub, its four mode packets and its hub-root JSON | - | 0.58 | 8 | complete |
| 2 | sk-doc: map its five routing mechanisms and test the claim that packet Keyword triggers lines are the synchronized source of truth | - | 0.62 | 8 | insight |
| 3 | sk-design and system-deep-loop: the last two hubs, the hub-level forbid copies, and the compiled-manifest staleness claim | - | 0.50 | 8 | complete |
| 4 | enforcement layer: parsers, guards, compiler, packager, pinned-prose check, canon and doctor reach | - | 0.66 | 9 | complete |
| 5 | verdict per skill type plus the phased plan with order, risk and rollback | - | 0.48 | 11 | complete |

- iterationsCompleted: 5
- keyFindings: 44
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] Which mechanisms make each of the five routing decisions in sk-code, sk-doc, sk-design and system-deep-loop, and where is each decision restated?
- [x] Where have restated copies of the same routing decision drifted, and which copy is authoritative?
- [x] Which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current shape, and what would each proposed change break?
- [x] Which routing shape wins for hubs, for mode packets and for standalone skills: per-mode ROUTER.md, one hub ROUTER.md, the advisor hybrid, or JSON-only?
- [x] What readability defects exist per skill, with quoted passages?
- [x] What phased implementation plan (order, risk, rollback) delivers the winning shape?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅▅▆▆▆▆▅▄▃▂▂▄▅▆█▇▅▄▂▁
- score sparkline: ▅▅▆▆▆▆▅▄▃▂▂▄▅▆█▇▅▄▂▁
- Last 3 ratios: 0.50 -> 0.66 -> 0.48
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.48
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
