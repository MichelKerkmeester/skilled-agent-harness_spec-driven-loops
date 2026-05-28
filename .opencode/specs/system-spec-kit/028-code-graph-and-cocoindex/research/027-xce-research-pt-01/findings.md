> Extracted from `027/research/027-xce-research-pt-01/findings.md` on 2026-05-28 (code-graph + cocoindex sections).
> Memory-topic sections and raw run-logs remain in 027.


# XCE Adoption Matrix — Findings

## Verdict Legend

| Verdict | Meaning |
|---------|---------|
| **ADOPT** | Implement locally — no XCE equivalent needed, build on our infrastructure |
| **ADAPT** | Modify XCE concept to fit our architecture — partial adoption with local adaptation |
| **DEFER** | Valid concept but blocked by dependency, scope, or uncertainty — track for later |
| **SKIP** | Will NOT adopt — architecturally incompatible, closed-source, or out of scope |


## Adoption Matrix — All 21 Features Cross-Mapped

| # | XCE Feature | Source (external/) | Verdict | Rationale | Blast Radius (files + LOC) | Suggested Sub-Packet |
|---|-------------|--------------------|....................................|---------|-----------|----------------------|
| 1 | HLD/LLD narrative generation (`xce_architecture_context`) | README:24,136,206-207 | **ADOPT** | XCE returns layered narrative (component description, HLD, LLD, relationships). Our code_graph_context returns raw symbols only (code_graph/lib/code-graph-context.ts:32-54, iteration-001 F-003). Template-only deterministic HLD/LLD is the sole genuinely new capability — all input data already in code_nodes (code-graph-db.ts:120-136) and code_edges (code-graph-db.ts:138-145). Zero deps, zero schema migration. | 1 new file, ~200 LOC | `028-code-graph-hld-lld` |
| 2 | Trace tool (`xce_trace`) — symbol→class→module→role | README:211-218 | **ADAPT** | XCE walks function→class→module→architectural role. Our CONTAINS edges (indexer-types.ts:19), resolveSubjectFilePath (code-graph-db.ts:989-1015), and queryEdgesTo (code-graph-db.ts:972-987) cover 3 of 4 trace rungs (iteration-002 F-008, F-012). Schema sufficient for MVP; no `code_packages` table needed initially. Architectural role reuses RQ1 HLD/LLD classification. | 1 new file + 1 handler + tool reg edit, ~210 LOC | `029-code-graph-trace` |
| 3 | Impact analysis w/ risk (`xce_impact_analysis`) | README:220-227 | **ADAPT** | XCE returns affected modules + downstream dependencies + risk scores. Our detect_changes returns affected symbols only — zero risk signals (handlers/detect-changes.ts:40-50, iteration-003 F-014). Five deterministic risk signals computable from existing graph via queryFileDegrees (code-graph-db.ts:1039-1083), queryEdgesFrom/To, TESTED_BY edge check, DEFAULT_EDGE_WEIGHTS. LLM enrichment optional for semantic narrative (F-017). | 1 new file + handler edit + opt. lib, ~300 LOC | `030-code-graph-impact-analysis` |
| 4 | Omnibus combiner (`xce_get_context`) | README:113,130,144,158,171,180 | **ADAPT** | XCE combines search + arch + trace in one first-call (steering-only combiner, not in Available Tools section per F-020). FOLD-IN via `queryMode: 'omni'` decisively favored over NEW tool: 117 LOC vs 380 LOC, single handler, simpler UX (iteration-004 F-023, F-024). Internal sub-allocation: proportional budget split across 2-3 buildContext() calls (F-025). Existing budgetTokens override (handlers/context.ts:343) handles omni's 2400-token default. | 2 file edits (context.ts + code-graph-context.ts), ~117 LOC | Folded into `028-code-graph-hld-lld` or `029-code-graph-trace` |
| 5 | Semantic search (`xce_search`) | README:192-199 | **ADOPT** (already exists) | XCE's semantic search finds code by meaning. Our mcp-coco-index skill provides identical CocoIndex semantic search. No adoption needed — equivalent capability already shipped. | 0 LOC | None |
| 6 | PRAT — Persistent stage (content-hash cache) | README:240,57-61 | **ADAPT** | XCE caches indexed repo in knowledge graph across sessions. Our isFileStale() (code-graph-db.ts:755-773) + skipFreshFiles (structural-indexer.ts:2083,2140) already provide content-hash-keyed freshness. Gap: no version-tagged snapshots (edge state at git HEAD). Optional ~70 LOC. | 1 file edit (code-graph-db.ts), ~70 LOC | Optional: folded into `028-code-graph-hld-lld` |
| 7 | PRAT — Recursive stage (containment walk) | README:215-217 | **ADAPT** | XCE walks upward containment chain. Our 3 recursive layers exist: directory walk() (structural-indexer.ts:1406-1463), AST parse (tree-sitter-parser.ts:1-60), CONTAINS traversal (indexer-types.ts:19, code-graph-db.ts queryEdgesTo). Gap: no memoization of repeated walks. ~50 LOC SQLite trace_cache. | 1 file edit (code-graph-db.ts), ~50 LOC | Folded into `029-code-graph-trace` |
| 8 | PRAT — Abstract stage (narrative HLD/LLD) | README:24,136,206-207 | **ADOPT** | Same as feature #1. XCE's headline feature: HLD/LLD/component descriptions. Nothing exists locally. ADOPT as new code-graph-hld-lld.ts. | Same as #1, ~200 LOC | `028-code-graph-hld-lld` |
| 9 | PRAT — Tree stage (AST + module hierarchy) | README:212,240 | **ADAPT** | XCE uses AST + module hierarchy for traversable tree. Our tree-sitter-parser.ts (WASM) + CONTAINS edges provide solid AST coverage. Gap: module hierarchy via fq_name prefix splitting is heuristic; optional code_packages table (~50 LOC) for formalized tree. | 1 file edit (code-graph-db.ts), ~50 LOC | Folded into `029-code-graph-trace` |
| 10 | PRAT — Full pipeline | README:29,74,264-270 | **DEFER** | XCE's complete PRAT pipeline is closed-source SaaS hosted at mcp.xanther.ai (README:74). We have 3 of 4 stages on local infrastructure; Abstract is the only gap. Full pipeline DEFER because closed-source + SaaS. Adopt individual stages on our infra instead. | N/A (not adoptable) | N/A |
| 14 | Token reduction claim (~20%) | README:188,47 | **ADAPT** | XCE claims ~20% token reduction with steering, attributed to proactive tool use (fewer file reads). Our steering fires dynamically, not unconditionally. Expected effect: 5-15%. Measurement protocol defined (iteration-008 F-046): baseline-vs-after with N ≥ 10 sessions, query session-analytics-db.ts:100-104 for total_tokens. ~80 LOC instrumentation in sub-packet 028 eval harness. | Depends on sub-packet 028 eval harness | `028-code-graph-adoption-eval` (measurement added) |
| 15 | Benchmark methodology — SWE-bench | README:37-45 | **DEFER** | XCE uses SWE-bench Verified + mini-swe-agent — heavyweight (~50GB Docker, 2,294 Python PRs, closed-source scripts). Our proposed local harness (iteration-007 F-041): 12-20 refactoring tasks on TS codebase, 3 metrics + 2 diagnostics, CLI subprocess dispatcher. DEFER to sub-packet 028 because harness requires RQ6 render change first and feeds RQ8 measurement. | New sub-packet, ~350-450 LOC | `028-code-graph-adoption-eval` |

## Verdict Diversity Assessment

| Verdict | Count | Items |
|---------|-------|-------|
| ADOPT | 4 | HLD/LLD generation (#1), Semantic search (#5, already exists), PRAT Abstract stage (#8), MCP configs (#16, already exists) |
| ADAPT | 9 | Trace tool (#2), Impact analysis (#3), Omnibus combiner (#4), PRAT Persistent (#6), PRAT Recursive (#7), PRAT Tree (#9), Steering pattern transfer (#11), Steering replacement directive (#13), Token reduction measurement (#14) |
| DEFER | 2 | Full PRAT pipeline (#10), Benchmark harness (#15) |
| SKIP | 6 | Feature rows #12, #17, #18, #19, #20, #21. The expanded "Will NOT adopt" rationale list below contains 9 named skip boundaries because some boundaries refine ADAPT/DEFER rows rather than standalone feature rows. |
| **Total** | **21** | All 21 XCE features classified |

**Diversity**: All 4 verdict categories populated. Feature-row verdict distribution is ADOPT:ADAPT:DEFER:SKIP = 4:9:2:6. Anti-bias guard (min 1 DEFER + 1 SKIP) exceeded by 8 feature rows, plus 9 expanded non-adoption rationale items.

**Effective adoption rate**: 4 true ADOPT items (2 of which already exist) + 9 ADAPT patterns = 13 actionable feature rows mapped into 5 implementation phases. Total estimated implementation LOC across sub-packets: ~1,900-2,300 LOC after pt-02 amendments.
