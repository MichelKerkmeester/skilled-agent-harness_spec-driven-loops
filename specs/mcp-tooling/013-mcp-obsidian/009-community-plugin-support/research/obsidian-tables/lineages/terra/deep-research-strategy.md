---
title: Obsidian Tables file-layer knowledge-base research strategy
session_id: fanout-terra-1785673258726-kcaoky
---

# Deep Research Strategy

## Research Topic

Deep-dive research on `aztekgold/obsidian-tables`, concentrating on the exact `.table.md` JSON contract and safe AI operations at the file layer.

## Known Context

- The GitHub README describes a single-file JSON table format intended to be readable by AI agents, ten column types, multi-view sorting/filtering, CSV export, and interactive embeds. [SOURCE: https://github.com/aztekgold/obsidian-tables]
- The v1.4.0 release says the plugin moved to its Agentable V1.0 schema and automatically migrates older tables in memory when opened, then persists them on the next save. [SOURCE: https://github.com/aztekgold/obsidian-tables/releases]
- No prior memory context was loaded. The supplied detached-lineage boundary prohibits writes outside this directory.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What exact top-level JSON shape, stable IDs, ordering, and version fields does current source accept and emit for a `.table.md` file?
- [x] What is the persisted value/options structure for each of the ten column types, especially select colours, date settings, formula references, and note links?
- [x] How do views, filters, sort chains, visible-column state, and embed view aliases serialize and mutate the file?
- [x] What commands/settings and UI features affect file contents, including CSV import/export and row/column drag ordering?
- [x] Which file-layer AI operations are safe for create, patch, CSV ingestion, querying, migration, and recovery, and which malformed-input symptoms or edge cases must be handled?

<!-- /ANCHOR:key-questions -->

## Non-Goals

- Do not modify an Obsidian vault or install the plugin.
- Do not reverse engineer only minified installed code when the TypeScript source is available.
- Do not claim undocumented schema fields as stable without source evidence.

## Stop Conditions

- Run exactly three iterations. Convergence signals are telemetry only under `stopPolicy: max-iterations`.
- Synthesis must distinguish verified source facts from conservative file-layer guidance.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What exact top-level JSON shape, stable IDs, ordering, and version fields does current source accept and emit for a `.table.md` file?
- What is the persisted value/options structure for each of the ten column types, especially select colours, date settings, formula references, and note links?
- How do views, filters, sort chains, visible-column state, and embed view aliases serialize and mutate the file?
- What commands/settings and UI features affect file contents, including CSV import/export and row/column drag ordering?
- Which file-layer AI operations are safe for create, patch, CSV ingestion, querying, migration, and recovery, and which malformed-input symptoms or edge cases must be handled?

<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- GitHub connector source fetches provided TypeScript evidence without cloning or writing source files outside the artifact root. (iteration 1)
- fetching known TypeScript files directly through the GitHub connector avoided the blocked shell/raw-GitHub path and yielded source-level mutation evidence. (iteration 2)
- fetching the remaining formula and renderer files directly closed the prior uncertainty around formula grammar and simple cell value formats. (iteration 3)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- direct shell GitHub access failed due to DNS resolution, and timeboxing stopped deeper source collection for formula evaluator internals. (iteration 1)
- broad connector code search returned empty results, so source discovery depended on paths inferred from imports in fetched files. (iteration 2)
- the final pass still could not resolve the multi-sort README/source mismatch without runtime testing or a different source path. (iteration 3)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `ViewDef.columnOrder` was not found as the drag-reorder persistence target in the fetched column drag source; column drag writes global `data.columns` order instead. This should be treated as an unresolved schema/implementation mismatch candidate until a full repository search proves no other `columnOrder` writer exists. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `ViewDef.columnOrder` was not found as the drag-reorder persistence target in the fetched column drag source; column drag writes global `data.columns` order instead. This should be treated as an unresolved schema/implementation mismatch candidate until a full repository search proves no other `columnOrder` writer exists. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `ViewDef.columnOrder` was not found as the drag-reorder persistence target in the fetched column drag source; column drag writes global `data.columns` order instead. This should be treated as an unresolved schema/implementation mismatch candidate until a full repository search proves no other `columnOrder` writer exists. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]

### Additional network/source collection was stopped by orchestration; this iteration used the preceding source-confirmed memo and exact GitHub source URLs. [INFERENCE: based on dispatcher instruction to use the preceding memo and perform no further network collection] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Additional network/source collection was stopped by orchestration; this iteration used the preceding source-confirmed memo and exact GitHub source URLs. [INFERENCE: based on dispatcher instruction to use the preceding memo and perform no further network collection]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Additional network/source collection was stopped by orchestration; this iteration used the preceding source-confirmed memo and exact GitHub source URLs. [INFERENCE: based on dispatcher instruction to use the preceding memo and perform no further network collection]

### Direct shell GitHub access remained out of scope because iteration 1 already recorded shell DNS failure and the strategy marks that path blocked. [INFERENCE: based on prior state and strategy] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Direct shell GitHub access remained out of scope because iteration 1 already recorded shell DNS failure and the strategy marks that path blocked. [INFERENCE: based on prior state and strategy]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct shell GitHub access remained out of scope because iteration 1 already recorded shell DNS failure and the strategy marks that path blocked. [INFERENCE: based on prior state and strategy]

### Direct shell GitHub access was not available earlier because shell DNS resolution failed; GitHub source access succeeded through the GitHub connector instead. [INFERENCE: based on prior tool result `Could not resolve host: github.com` and successful GitHub connector fetches] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Direct shell GitHub access was not available earlier because shell DNS resolution failed; GitHub source access succeeded through the GitHub connector instead. [INFERENCE: based on prior tool result `Could not resolve host: github.com` and successful GitHub connector fetches]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct shell GitHub access was not available earlier because shell DNS resolution failed; GitHub source access succeeded through the GitHub connector instead. [INFERENCE: based on prior tool result `Could not resolve host: github.com` and successful GitHub connector fetches]

### Direct shell GitHub access, broad connector code search, and minified installed `main.js` were not retried because strategy marks those approaches blocked. [INFERENCE: based on current strategy exhausted approaches] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Direct shell GitHub access, broad connector code search, and minified installed `main.js` were not retried because strategy marks those approaches blocked. [INFERENCE: based on current strategy exhausted approaches]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct shell GitHub access, broad connector code search, and minified installed `main.js` were not retried because strategy marks those approaches blocked. [INFERENCE: based on current strategy exhausted approaches]

### GitHub code search through the connector returned no useful hits for broad handler queries, so known source paths were fetched directly instead. [INFERENCE: based on connector search results returning empty arrays] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: GitHub code search through the connector returned no useful hits for broad handler queries, so known source paths were fetched directly instead. [INFERENCE: based on connector search results returning empty arrays]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: GitHub code search through the connector returned no useful hits for broad handler queries, so known source paths were fetched directly instead. [INFERENCE: based on connector search results returning empty arrays]

### Minified installed `main.js` remained ruled out as evidence; this iteration used source TypeScript files. [INFERENCE: based on strategy non-goal and iteration 1 ruled-out direction] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Minified installed `main.js` remained ruled out as evidence; this iteration used source TypeScript files. [INFERENCE: based on strategy non-goal and iteration 1 ruled-out direction]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Minified installed `main.js` remained ruled out as evidence; this iteration used source TypeScript files. [INFERENCE: based on strategy non-goal and iteration 1 ruled-out direction]

### Minified installed `main.js` was not used as evidence because the dispatch required source-level evidence. [INFERENCE: based on dispatch scope and fetched TypeScript source availability] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Minified installed `main.js` was not used as evidence because the dispatch required source-level evidence. [INFERENCE: based on dispatch scope and fetched TypeScript source availability]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Minified installed `main.js` was not used as evidence because the dispatch required source-level evidence. [INFERENCE: based on dispatch scope and fetched TypeScript source availability]

### Multi-level sort rules are persisted but only `rules[0]` was source-confirmed as applied by `getSortedRows()` in fetched `SortHandler.ts`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Multi-level sort rules are persisted but only `rules[0]` was source-confirmed as applied by `getSortedRows()` in fetched `SortHandler.ts`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Multi-level sort rules are persisted but only `rules[0]` was source-confirmed as applied by `getSortedRows()` in fetched `SortHandler.ts`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]

### No source evidence found in this iteration resolves iteration 2's mismatch between persisted multi-sort rules and `SortHandler.getSortedRows()` applying only `rules[0]`; operational recipes should emulate only verified first-rule sort application unless later runtime/source evidence proves otherwise. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [INFERENCE: based on iteration 2 finding] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No source evidence found in this iteration resolves iteration 2's mismatch between persisted multi-sort rules and `SortHandler.getSortedRows()` applying only `rules[0]`; operational recipes should emulate only verified first-rule sort application unless later runtime/source evidence proves otherwise. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [INFERENCE: based on iteration 2 finding]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No source evidence found in this iteration resolves iteration 2's mismatch between persisted multi-sort rules and `SortHandler.getSortedRows()` applying only `rules[0]`; operational recipes should emulate only verified first-rule sort application unless later runtime/source evidence proves otherwise. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [INFERENCE: based on iteration 2 finding]

### Runtime testing inside Obsidian was not attempted; this iteration is source-level file-layer research only. [INFERENCE: based on research boundaries and non-goals] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Runtime testing inside Obsidian was not attempted; this iteration is source-level file-layer research only. [INFERENCE: based on research boundaries and non-goals]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime testing inside Obsidian was not attempted; this iteration is source-level file-layer research only. [INFERENCE: based on research boundaries and non-goals]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

## Research Boundaries

- Artifact root: this detached lineage only.
- Max iterations: 3.
- Convergence threshold: 0.05, telemetry only until the cap.
- Primary evidence: the `aztekgold/obsidian-tables` source repository and README/releases.
