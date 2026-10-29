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
- Topic: RQ-6 only: skill advisor alignment for moving every skills MACHINE ROUTER section out of SKILL.md into a sibling ROUTER.md. Find, with file:line, everything in .skilled/skills/system-skill-advisor that must change or be checked: the freshness signature in runtime/lib/freshness.ts which hashes only SKILL.md and graph-metadata.json; SKILL.md discovery and parsing in runtime/scripts/skill_advisor_runtime.py; the skill graph compiler and its embeddings in runtime/lib/skill-graph/; the leaf inventory, leaf-manifest.config.json and leaf-scopes; the scorer lanes and whether any lane reads SKILL.md body text, keywords comments or router markers; the advisor hooks and plugin bridges; and the routing-accuracy baseline scripts (155/195, 49/66, 19/24).
- Started: 2026-10-29T08:44:48Z
- Status: COMPLETE
- Iteration: 1 of 1
- Session ID: fanout-deepseek-1793263405044-mwc96z
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
| 1 | RQ-6.1 to RQ-6.6: skill advisor alignment for a sibling ROUTER.md | - | 1.00 | 21 | complete |

- iterationsCompleted: 1
- keyFindings: 21
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] RQ-6.1: What exactly does the freshness signature in runtime/lib/freshness.ts hash, and does a router move out of SKILL.md leave a stale checkout looking fresh?
- [x] RQ-6.2: How does runtime/scripts/skill_advisor_runtime.py discover and parse a skill, and what must change for it to read a sibling ROUTER.md?
- [x] RQ-6.3: What does the skill graph compiler in runtime/lib/skill-graph/ index and embed, and does it parse SKILL.md body text, Keywords comments or router markers?
- [x] RQ-6.4: What reads the leaf inventory, leaf-manifest.config.json and leaf-scopes, and does the router move change any of them?
- [x] RQ-6.5: Does any scorer lane read SKILL.md body text, keywords comments or router markers, and does the router move change scores or accuracy?
- [x] RQ-6.6: What do the advisor hooks, the plugin bridges and the routing-accuracy baseline scripts depend on, and what is the fix for each?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":29}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Adding `ROUTER.md` to the doc-frontmatter harvest. The harvest walks `references/` and `assets/` only and is off by default. (iteration 1)
- Adding a lane for router markers. No lane has a field for them, and the projection exposes only frontmatter, keywords, metadata signals and the derived block. (iteration 1)
- Treating the derived lane as a live body consumer. Its writer is marked deprecated and off the serving path, and the fleet producer preserves curated trigger and topic fields while pruning only dead paths. (iteration 1)
- Treating the graph compiler as a body reader. The file has no `SKILL.md` read; it copies `graph-metadata.json` as authored. (iteration 1)

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
