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
- Topic: Deep-dive research on aztekgold/obsidian-tables: exact .table.md JSON schema, feature surface, file-layer AI workflows, edge cases, and usage recipes.
- Started: 2026-08-02T12:23:48Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-terra-1785673258726-kcaoky
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
| 1 | Canonical TableData schema, normalized types, ID/order model, markdown/json parsing/serialization, and migration for aztekgold/obsidian-tables | - | 1.00 | 10 | complete |
| 2 | Source verification of views, filters, multi-level sorts, hidden columns/order, drag reorder persistence, embed alias view mutation, commands/settings, formula handling, and remaining per-column values | view-mutations-and-column-values | 0.88 | 14 | complete |
| 3 | Source-backed file-layer AI operations, troubleshooting, CSV boundaries, malformed input symptoms, formula errors, persisted values, and concrete safe create/patch/query/migration recipes | file-layer-operations-and-troubleshooting | 0.74 | 17 | complete |

- iterationsCompleted: 3
- keyFindings: 41
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What exact top-level JSON shape, stable IDs, ordering, and version fields does current source accept and emit for a `.table.md` file?
- [x] What is the persisted value/options structure for each of the ten column types, especially select colours, date settings, formula references, and note links?
- [x] How do views, filters, sort chains, visible-column state, and embed view aliases serialize and mutate the file?
- [x] What commands/settings and UI features affect file contents, including CSV import/export and row/column drag ordering?
- [x] Which file-layer AI operations are safe for create, patch, CSV ingestion, querying, migration, and recovery, and which malformed-input symptoms or edge cases must be handled?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▆▆▆▅▅▅▄▄▃▃▃▂▂▁▁
- score sparkline: ██▇▇▇▆▆▆▅▅▅▄▄▃▃▃▂▂▁▁
- Last 3 ratios: 1.00 -> 0.88 -> 0.74
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.74
- coverageBySources: {"github.com":32}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Additional network/source collection was stopped by orchestration; this iteration used the preceding source-confirmed memo and exact GitHub source URLs. [INFERENCE: based on dispatcher instruction to use the preceding memo and perform no further network collection] (iteration 1)
- Direct shell GitHub access was not available earlier because shell DNS resolution failed; GitHub source access succeeded through the GitHub connector instead. [INFERENCE: based on prior tool result `Could not resolve host: github.com` and successful GitHub connector fetches] (iteration 1)
- Minified installed `main.js` was not used as evidence because the dispatch required source-level evidence. [INFERENCE: based on dispatch scope and fetched TypeScript source availability] (iteration 1)
- `ViewDef.columnOrder` was not found as the drag-reorder persistence target in the fetched column drag source; column drag writes global `data.columns` order instead. This should be treated as an unresolved schema/implementation mismatch candidate until a full repository search proves no other `columnOrder` writer exists. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] (iteration 2)
- Direct shell GitHub access remained out of scope because iteration 1 already recorded shell DNS failure and the strategy marks that path blocked. [INFERENCE: based on prior state and strategy] (iteration 2)
- GitHub code search through the connector returned no useful hits for broad handler queries, so known source paths were fetched directly instead. [INFERENCE: based on connector search results returning empty arrays] (iteration 2)
- Minified installed `main.js` remained ruled out as evidence; this iteration used source TypeScript files. [INFERENCE: based on strategy non-goal and iteration 1 ruled-out direction] (iteration 2)
- Multi-level sort rules are persisted but only `rules[0]` was source-confirmed as applied by `getSortedRows()` in fetched `SortHandler.ts`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] (iteration 2)
- Direct shell GitHub access, broad connector code search, and minified installed `main.js` were not retried because strategy marks those approaches blocked. [INFERENCE: based on current strategy exhausted approaches] (iteration 3)
- No source evidence found in this iteration resolves iteration 2's mismatch between persisted multi-sort rules and `SortHandler.getSortedRows()` applying only `rules[0]`; operational recipes should emulate only verified first-rule sort application unless later runtime/source evidence proves otherwise. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [INFERENCE: based on iteration 2 finding] (iteration 3)
- Runtime testing inside Obsidian was not attempted; this iteration is source-level file-layer research only. [INFERENCE: based on research boundaries and non-goals] (iteration 3)

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
