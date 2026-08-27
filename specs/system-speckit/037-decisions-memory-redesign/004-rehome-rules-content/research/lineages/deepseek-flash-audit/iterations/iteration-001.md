# Iteration 1: CODE sweep — includeConstitutional sites, tier config, surface hooks, learned-feedback, checkpoints

## Focus
Full code-level sweep of the mcp-server: every includeConstitutional site, constitutional tier config, surface/prime/compaction hooks, learned-feedback machinery, and checkpoint governance paths.

## Findings

### F1.1 includeConstitutional search sites — committed flip verified; 4 production `true` sites NOT flipped
- Committed flip confirmed: `handlers/memory-search.ts:1321` default `includeConstitutional: includeConstitutional = false`; `lib/search/vector-index-queries.ts:409` default `= false`; `handlers/memory-context.ts` default sites (lines 1192/1222 per grounding; interface decls at 96/134). [SOURCE: file:handlers/memory-search.ts:1321, file:lib/search/vector-index-queries.ts:409]
- **NOT flipped — still hardcode `includeConstitutional: true` (production):**
  - `tools/memory-tools.ts:81` — memory-tools dispatch (`memory_search` fallback in tool router) passes `includeConstitutional: true` unconditionally. [SOURCE: file:tools/memory-tools.ts:81]
  - `cli.ts:489` — CLI `handleMemoryIndexScan({ includeConstitutional: true })`. [SOURCE: file:cli.ts:489]
  - `lib/feedback/shadow-evaluation-runtime.ts:200` — feedback shadow eval search passes `includeConstitutional: true`. [SOURCE: file:lib/feedback/shadow-evaluation-runtime.ts:200]
  - `lib/search/active-row-predicate.ts:61` — `ACTIVE_POPULATION_SQL` passes `includeConstitutional: true` (population-wide active rows include constitutional; contrast `ACTIVE_ROW_SQL` ranked lane at :52 which passes `false`). [SOURCE: file:lib/search/active-row-predicate.ts:52,61]
- **Tool schemas still advertise `default: true`** — `tool-schemas.ts:221-223` (memory_context `includeConstitutional` default true), `tool-schemas.ts:267-269` (memory_search default true), `tool-schemas.ts:761` (memory_index_scan `includeConstitutional` default true). Handler defaults flipped but the schema layer advertises true; any caller that reads schema defaults (or tool-router default injection) still sees true. [SOURCE: file:tool-schemas.ts:221,267,761]

### F1.2 importance-tiers.ts — tier config + dead helpers
- `lib/scoring/importance-tiers.ts:21` — `'constitutional'` in `ImportanceTier` union; `:34-42` constitutional TierConfig (value 1.0, searchBoost 3.0, decay false, alwaysSurface true, maxTokens 2000); `:181-183` — `getSearchableTiersFilter` excludes constitutional when `!includeConstitutional`; `:194-197` `shouldAlwaysSurface()`; `:206-208` `getConstitutionalFilter()`; `:259` — `DOC_TYPE_TIERS.constitutional → 'constitutional'`. [SOURCE: file:lib/scoring/importance-tiers.ts:21,34,181,194,206,259]
- Confirmed: `shouldAlwaysSurface` and `getConstitutionalFilter` have NO production callers — only `tests/scoring-gaps.vitest.ts:201-254`. [SOURCE: grep getConstitutionalFilter|shouldAlwaysSurface → 10 test matches + 2 def lines]

### F1.3 vector-index-queries.ts — constitutional merge machinery still present, gated off
- `lib/search/vector-index-queries.ts:437-442` — `constitutional_results = get_constitutional_memories(...)` merge path; `:453-456` — `tier === 'constitutional'` explicit branch with ACTIVE_ROW_SQL lane constitutional; `:476-480` — "If constitutional results already satisfy limit, return them directly"; `:504` — `isConstitutional` row marking; `:516-522` — `get_constitutional_memories_public` export. All dormant under flipped default but code remains. [SOURCE: file:lib/search/vector-index-queries.ts:437,453,476,504,516]

### F1.4 stage1-candidate-gen.ts — constitutional injection block (3 paths)
- `lib/search/pipeline/stage1-candidate-gen.ts:30` invariant comment; `:683` config pass-through; `:847-859` global-channel injection via `get_constitutional_memories`; `:1256,1300` vector search hardcodes `includeConstitutional: false` ("managed separately"); `:1373-1424` vector-based injection block; `:1425-1467` lexical fallback; `:1468-1472` explicit exclusion filter. Constant `CONSTITUTIONAL_INJECT_LIMIT` at `:1399`. [SOURCE: file:lib/search/pipeline/stage1-candidate-gen.ts:30,847,1256,1373,1385,1425,1468]

### F1.5 vector-index-store.ts — get_constitutional_memories definition
- `lib/search/vector-index-store.ts:1963` — `get_constitutional_memories()` definition (46 constitutional matches in file: lines 1770-2048 tier-query + cache + validation paths, 2411). Callers: vector-index-queries.ts:440,522; stage1-candidate-gen.ts:849,1438. [SOURCE: file:lib/search/vector-index-store.ts:1963]

### F1.6 Surface hooks — LIVE compaction surface + DEAD cold-start prime
- `hooks/memory-surface.ts:33,82-84` constitutionalCache TTL 60s; `:155-187` `getConstitutionalMemories()` DB query `importance_tier = 'constitutional'`; `:229-234` token budget pops; `:322-323` autoSurfaceMemories; `:346-348` enrichWithRetrievalDirectives (PI-A4); `:429-456` primeSession; `:555` autoSurfaceAtCompaction. [SOURCE: file:hooks/memory-surface.ts:155,322,429,555]
- LIVE wiring: `context-server.ts:1066-1072` — memory_context resume invokes `autoSurfaceAtCompaction(contextHint)` / `autoSurfaceMemories(contextHint)`; `hooks/claude/compact-inject.ts:416-427` — compaction merge injects `renderConstitutionalMemories(autoSurfaced)` and logs "X constitutional and Y triggered memories". [SOURCE: file:context-server.ts:1069, file:hooks/claude/compact-inject.ts:419,422]
- DEAD cold-start: `hooks/claude/session-prime.ts:188-236` — `handleStartup` docstring says "prime new session with constitutional memories + overview" but the body only builds fallback startup surface from cached summary; NO constitutional fetch. Cold-start injection confirmed dead. [SOURCE: file:hooks/claude/session-prime.ts:188-236]

### F1.7 memory_index_scan — indexer still defaults include_constitutional TRUE
- `handlers/memory-index.ts:216-219` scan results constitutional counters; `:259` option; `:481` pass-through; `:624` `includeConstitutional: include_constitutional = true` DEFAULT; `:759` `findConstitutionalFiles` discovery; `:791` mergedFiles; `:1369` error message "Constitutional files go in .opencode/skills/*/constitutional/"; `:1374` constitutionalSet; `:1400-1404` counters; `:1459-1460` alreadyIndexed; `:1524-1529` warn-only treatment ("policy text, not evidence-bearing memory"); `:1549,1635-1641` per-file counting; `:1829` `docType !== 'constitutional'` excluded from affectedSpecFolders; `:2174,2183` `find_constitutional_files` alias export. [SOURCE: file:handlers/memory-index.ts:216,259,481,624,759,791,1369,1524,1829,2174]

### F1.8 Learned-feedback machinery (DB learned-triggers; 30-day TTL; 0 rows per grounding)
- `lib/search/learned-feedback.ts:23,81` — `FEATURE_FLAG = 'SPECKIT_LEARN_FROM_SELECTION'` graduated default ON; `:84` LEARNED_TRIGGER_WEIGHT 0.7; `:178-179` `isLearnedFeedbackEnabled()` (only disabled when explicit false). [SOURCE: file:lib/search/learned-feedback.ts:81,178]
- `ENV-REFERENCE.md:466` — flag doc "Default ON (graduated)". [SOURCE: file:ENV-REFERENCE.md:466]
- Related: `lib/feedback/edge-tier-basement.ts:21-72`, `lib/feedback/batch-learning.ts:63`, `lib/feedback/feedback-retention-reducer.ts:15` (SPECKIT_FEEDBACK_RETENTION_LEARNING master gate default OFF), `handlers/memory-learned-maintenance.ts` (to verify in later pass). [SOURCE: file:lib/feedback/edge-tier-basement.ts:21, file:lib/feedback/batch-learning.ts:63]

### F1.9 Checkpoints — constitutional path governance
- `lib/storage/checkpoints.ts:2289-2304` — checkpoint restore: if `importance_tier === 'constitutional'` and path not `isIndexableConstitutionalMemoryPath`, emits governance audit `TIER_DOWNGRADE_NON_CONSTITUTIONAL_PATH` (requestedTier constitutional → nextTier important). [SOURCE: file:lib/storage/checkpoints.ts:2289-2304]

### F1.10 Formatters — constitutionalCount in search envelopes
- `formatters/search-results.ts:997` (empty-result envelope `constitutionalCount: 0`), `:1015-1016` count from `isConstitutional`, `:1301-1303` summary "Found N memories (M constitutional)", `:1364` success envelope field, `:1381` safeExtraData exclusion. [SOURCE: file:formatters/search-results.ts:997,1015,1301,1364]

### F1.11 Search classification + retrieval directives
- `handlers/memory-search.ts:205` `CanonicalSourceKind = 'spec_doc' | 'continuity' | 'constitutional'`; `:348-349` classify row constitutional; `:391` bySourceKind counter. [SOURCE: file:handlers/memory-search.ts:205,348,391]
- `lib/search/retrieval-directives.ts:6,28,43,210-336` — constitutional retrieval_directive enrichment (9 matches). [SOURCE: file:lib/search/retrieval-directives.ts:6]
- `lib/search/search-flags.ts:531` — one constitutional reference (flag). [SOURCE: file:lib/search/search-flags.ts:531]

### F1.12 Secondary scoring/decay paths (tier-aware; lower action priority)
- `lib/cognitive/tier-classifier.ts:187-188,499-500`; `lib/cognitive/fsrs-scheduler.ts:243-446` (9); `lib/cognitive/attention-decay.ts:39,58`; `lib/scoring/composite-scoring.ts:188-251,666`; `lib/scoring/confidence-tracker.ts:71,217,247`; `lib/eval/eval-metrics.ts:42-1100` (16); `lib/config/memory-types.ts:113-454` (6); `lib/config/type-inference.ts:60-344` (4); `lib/parsing/memory-parser.ts:449-1204` (6); `lib/storage/post-insert-metadata.ts:91,110`; `lib/storage/document-helpers.ts:35,54`; `lib/storage/lineage-state.ts:537,1479`; `lib/storage/schema-downgrade.ts:135`; `lib/utils/index-scope.ts:247-259`; `lib/governance/scope-governance.ts:178-179,518`; `lib/governance/memory-retention-sweep.ts:209,271`; `lib/graph/community-summaries.ts:23`; `lib/errors/recovery-hints.ts:232,235`; `lib/search/lexical-normalizer.ts:25-29`; `lib/search/hybrid-search.ts:1379,2654`; `lib/search/graph-search-fn.ts:608-674`; `lib/search/auto-promotion.ts:82`; `lib/search/vector-index-schema.ts:370-4044` (24); `lib/search/vector-index-mutations.ts:36-940` (8); `lib/search/pipeline/types.ts:320-430`; `lib/search/pipeline/stage4-filter.ts:355-356`; `lib/search/pipeline/orchestrator.ts:393,407`; `lib/search/rerank/retrieval-rescue.ts:513`; `lib/search/validation-metadata.ts:25,29`. (Detail per-file left for verification sweep; all are constitutional-tier-aware logic that becomes inert once the tier is removed.) [SOURCE: grep -c constitutional per file, Iter 1]

### F1.13 Handlers secondary (save/crud/hooks/index)
- `handlers/memory-save.ts:283,482-492,3250-3306,4094` (10); `handlers/memory-crud-update.ts:90-540` (9); `handlers/memory-crud-delete.ts:315`; `handlers/memory-bulk-delete.ts:111-321` (7); `handlers/memory-crud-types.ts:99`; `handlers/mutation-hooks.ts:30,148,234`; `handlers/pe-gating.ts:68`; `handlers/save/response-builder.ts:663,832`; `handlers/index.ts:327`; `hooks/response-hints.ts:12-123` (6); `hooks/mutation-feedback.ts:11-60` (4); `hooks/spec-memory-cli-fallback.ts:74` (includeConstitutional site); `context-server.ts:1975`. [SOURCE: grep -c constitutional per file, Iter 1]

## Sources Consulted
- `.opencode/skills/system-spec-kit/mcp-server/` tree greps + reads (files cited above)
- `.opencode/skills/system-spec-kit/constitutional/` directory listing (20 rule files + README)

## Assessment
- newInfoRatio: 1.0 — first evidence pass; all findings new.
- Novelty justification: full code sweep surface established with file:line coordinates; no prior iteration in this lineage.
- Confidence: high on all cited lines (read/grep confirmed); medium on "schema defaults injected into args" — need to verify tool-router default application in a later iteration.

## Reflection
- Worked: targeted greps by directory (lib/handlers/hooks/formatters/tools) avoid spec-history noise.
- Failed: glob-based exclusion patterns (`!{tests,...}/**`) silently returned nothing — abandoned; use per-directory paths.
- Ruled out: whole-repo raw greps for `constitutional` (7974 md hits) as an inventory method — spec history dominates; production surfaces only.

## Recommended Next Focus
Iter 2: COMMANDS sweep — `/memory:learn`, `/memory:manage`, `/memory:search` docs + presentation assets + memory README.txt.
