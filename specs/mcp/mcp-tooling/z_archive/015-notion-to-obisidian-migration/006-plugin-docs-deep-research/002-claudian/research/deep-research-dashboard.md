---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
trigger_phrases: []
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Optimize the mcp-obsidian claudian file-layer reference docs for AI operation. Research the real plugin (repo YishenTu/claudian, id realclaudian, docs, and the installed main.js v2.2.4) to confirm the in-vault .claude config schemas (mcp.json, claudian-settings.json, settings.json, commands, skills), provider setup, and MCP wiring currently flagged VERIFY. Recommend concrete additions or updates to references/plugins/claudian/. BANNED OPERATIONS: do not delete, move, rename, or edit any file outside the bound spec folder's research/ directory; do NOT touch references/plugins/ or any shipped doc (this run is research-only). ALLOWED WRITE PATHS: the bound spec folder's research/ subtree only.
- Started: 2026-08-22T11:42:15Z
- Status: INITIALIZED
- Iteration: 2 of 4
- Session ID: claudian-dr-20260822T114215Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Map real claudian-settings.json / mcp.json / commands / skills schemas from source and compiled plugin | config-schema | 0.81 | 8 | complete |
| 2 | Reconcile schema facts against shipped docs + verify live vault .claudian/ vs .claude/ state | reconciliation | 0.75 | 6 | insight |

- iterationsCompleted: 2
- keyFindings: 51
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What is the complete schema of claudian-settings.json (all keys, types, defaults)?
- [x] How does Claudian write/manage mcp.json — what fields does it set, and what wiring conventions does it follow?
- [x] What provider configs does Claudian support and how are they stored (settings.json vs claudian-settings.json)?
- [x] What is the exact schema of commands and skills files that Claudian manages?
- [x] What gotchas, edge cases, or undocumented behaviors exist in the current reference docs?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▆▆▅▅▅▄▄▄▃▃▂▂▂▁▁
- score sparkline: ██▇▇▇▆▆▅▅▅▄▄▄▃▃▂▂▂▁▁
- Last 3 ratios: 0.81 -> 0.75
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.75
- coverageBySources: {"code":17,"github.com":1,"other":25}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None. The repo source (TypeScript, manifest 2.2.4 == installed) resolved every VERIFY-flagged unknown directly. No approach was exhausted this iteration. (iteration 1)
- Reading only the compiled `main.js` (5 MB, minified) as the sole source — the unminified TypeScript repo at the same version is the cleaner, equally-authoritative source; `main.js` grep was used to confirm the same strings are present in the shipped binary, not to extract schemas. (iteration 1)
- Treating the repo README as a schema source — it documents the auto-detect-first provider flow but not the on-disk JSON shapes; schemas had to come from `src/`. (iteration 1)
- Editing the shipped reference docs — out of scope by dispatch constraint (research-only); all corrections above are emitted as recommendations for the workflow's later edit phase. (iteration 2)
- None this iteration. (iteration 2)
- Re-deriving schemas from the repo — already done in iteration 1 (BLOCKED approach per strategy: don't re-read `main.js`-only or README-only). (iteration 2)

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
