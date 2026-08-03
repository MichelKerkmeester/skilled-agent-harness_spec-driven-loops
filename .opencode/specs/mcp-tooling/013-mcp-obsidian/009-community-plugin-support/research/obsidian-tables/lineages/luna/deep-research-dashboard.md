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
- Topic: Deep-dive research on the Obsidian plugin obsidian-tables (GitHub aztekgold/obsidian-tables), an interactive JSON-table plugin, for an AI operating the vault at the FILE LAYER. Resolve the EXACT .table.md JSON schema: every top-level key (columns/rows/views + any id/order/version keys), per-column-type structure for ALL types (text, number, checkbox, select, multi-select, url, email, note-link, date, formula) including options/colors storage, formula persistence vs render-time compute, and how views/filters/sorts serialize — READ the plugin SOURCE in the aztekgold/obsidian-tables repo (the installed main.js is minified). Cover the full feature surface (multiple views, multi-level sort, complex filters, drag-reorder, CSV export, embeds via ![[Name.table.md|View]]); commands + settings; file-layer AI workflows (create a valid .table.md, add/patch rows, CSV to table import, query rows, safe in-place patch, schema migration); a full error/edge-case catalog (malformed JSON symptoms, .table.md-as-markdown parsing, formula errors); AI-usage recipes. Cite sources (repo source + README). Produce a verified data-model + workflows + troubleshooting knowledge base.
- Started: 2026-08-02T12:23:33.102Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-luna-1785673258726-kcaoky
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
| 1 | Canonical Agentable V1.0 root, column definitions, per-type cells, .table.md wrapper, and formula persistence | schema | 0.95 | 9 | complete |
| 2 | View serialization, filter/sort/search semantics, reorder behavior, CSV export, and linked/inline embeds | views | 0.90 | 8 | complete |
| 3 | Commands, settings, file routing, .table.md creation, CSV import/direct-open behavior, and smart link maintenance | features | 0.84 | 8 | complete |
| 4 | AI file-layer create, add/patch, CSV conversion, query, safe in-place patch, view/embed, and schema migration recipes | workflows | 0.72 | 8 | complete |
| 5 | Malformed wrappers, JSON/CSV parsing limits, formula tokenizer/parser/evaluator errors, ID risks, and troubleshooting recipes | edge-cases | 0.61 | 8 | complete |

- iterationsCompleted: 5
- keyFindings: 58
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] What are the exact top-level keys and per-column structures for every supported type, including option/color storage and formula behavior? [legacy-import]
- [ ] How do rows, views, filters, multi-level sorts, reordering, exports, and embeds serialize at the file layer? [legacy-import]
- [ ] What commands, settings, and user-facing feature behavior must an AI account for when operating the vault? [legacy-import]
- [ ] Which create, patch, import, query, migration, and safe in-place editing workflows are valid for an AI? [legacy-import]
- [ ] What malformed-file, parsing, formula, and edge-case symptoms are observable, and what recipes avoid them? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] What are the exact top-level keys and per-column structures for every supported type, including option/color storage and formula behavior?
- [ ] How do rows, views, filters, multi-level sorts, reordering, exports, and embeds serialize at the file layer?
- [ ] What commands, settings, and user-facing feature behavior must an AI account for when operating the vault?
- [ ] Which create, patch, import, query, migration, and safe in-place editing workflows are valid for an AI?
- [ ] What malformed-file, parsing, formula, and edge-case symptoms are observable, and what recipes avoid them?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███▇▇▇▇▆▆▆▅▅▄▄▃▃▂▂▁▁
- score sparkline: ███▇▇▇▇▆▆▆▅▅▄▄▃▃▂▂▁▁
- Last 3 ratios: 0.84 -> 0.72 -> 0.61
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.61
- coverageBySources: {"code":25,"github.com":25}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A top-level table `id` or `order` key is not part of the current `TableData` interface. (iteration 1)
- The installed minified `main.js` is not needed for the current schema resolution; repository source is authoritative for this pass. (iteration 1)
- `columnOrder` is not a reliable active per-view ordering mechanism in current `main`; it is serialized but not consumed by the renderer. (iteration 2)
- An embed alias is not arbitrary display text only; it is interpreted as a view name and may mutate the table by creating that view. (iteration 2)
- Do not overwrite a `.table.md` file with raw JSON; its frontmatter and fenced block are part of the file contract. (iteration 3)
- Do not treat `tableRenderer` as a visual renderer choice in v1.5.0. (iteration 3)
- Do not use direct `.csv` table editing when the goal is a persisted vault mutation. (iteration 3)
- Patching by row index or column name is not robust. (iteration 4)
- Replacing an entire `.table.md` with JSON is not a safe migration. (iteration 4)
- Treating persisted formula output as always fresh is not justified. (iteration 4)
- Assuming CSV multiline fields, strict IDs, policy enforcement, or exact version validation. (iteration 5)
- Treating display date formats as formula `date()` parsing formats. (iteration 5)
- Treating formula em dashes as literal stored values. (iteration 5)

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
No material source question remains for the requested current `main` scope. Version drift after the inspected repository state is an external maintenance concern.

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
