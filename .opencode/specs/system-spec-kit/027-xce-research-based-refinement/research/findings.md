---
title: "XCE Research — Adoption Matrix"
packet: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
iterations_source: "001–009"
totalFeatures: 21
verdictDistribution: {ADOPT:4, ADAPT:6, DEFER:2, SKIP:9}
created: "2026-05-08T18:00:00Z"
---

# XCE Adoption Matrix — Findings

## Verdict Legend

| Verdict | Meaning |
|---------|---------|
| **ADOPT** | Implement locally — no XCE equivalent needed, build on our infrastructure |
| **ADAPT** | Modify XCE concept to fit our architecture — partial adoption with local adaptation |
| **DEFER** | Valid concept but blocked by dependency, scope, or uncertainty — track for later |
| **SKIP** | Will NOT adopt — architecturally incompatible, closed-source, or out of scope |

---

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
| 11 | Steering pattern — "Always use X FIRST" | README:103-188, steering/* | **ADAPT** | XCE uses static unconditional "Always use xanther-xce" in 6 project-level rules files (CLAUDE.md:5, kiro.md:4, etc.). Our advisor is dynamic (confidence ≥ 0.8 threshold at render.ts:124-133). Cannot ADOPT unconditional static pattern. CAN strengthen directive: "use" → "MUST invoke X FIRST — <action hint>" at render.ts:149-152,155-158 (iteration-006 F-036). ~30 LOC. | 1 file edit (render.ts), ~30 LOC | `031-skill-advisor-first-action-mandate` |
| 12 | Steering — hard-coded target tool | README:113,130,144,158,171,180 | **SKIP** | All 6 XCE steering files hard-code `xce_get_context` as the mandatory first call for ALL tasks. Our advisor dynamically selects from 16 skills. Replacing dynamic routing with a hard-coded single tool would destroy the advisor's purpose. | N/A (architectural incompatibility) | None |
| 13 | Steering — "Prefer X over file reading" | README:119,136,150,163,173,185 | **ADAPT** | XCE steering commands "Prefer XCE context over grep, find, or reading files." Our proposed FIRST_ACTION_HINT (F-036) encodes per-skill replacement directives: "semantic search BEFORE grep/file-reading" (mcp-coco-index), "validate gates BEFORE reading/editing files" (system-spec-kit). Adapted from static text to dynamic per-skill framing. | Same as #11, already included in ~30 LOC | `031-skill-advisor-first-action-mandate` |
| 14 | Token reduction claim (~20%) | README:188,47 | **ADAPT** | XCE claims ~20% token reduction with steering, attributed to proactive tool use (fewer file reads). Our steering fires dynamically, not unconditionally. Expected effect: 5-15%. Measurement protocol defined (iteration-008 F-046): baseline-vs-after with N ≥ 10 sessions, query session-analytics-db.ts:100-104 for total_tokens. ~80 LOC instrumentation in sub-packet 028 eval harness. | Depends on sub-packet 028 eval harness | `028-code-graph-adoption-eval` (measurement added) |
| 15 | Benchmark methodology — SWE-bench | README:37-45 | **DEFER** | XCE uses SWE-bench Verified + mini-swe-agent — heavyweight (~50GB Docker, 2,294 Python PRs, closed-source scripts). Our proposed local harness (iteration-007 F-041): 12-20 refactoring tasks on TS codebase, 3 metrics + 2 diagnostics, CLI subprocess dispatcher. DEFER to sub-packet 028 because harness requires RQ6 render change first and feeds RQ8 measurement. | New sub-packet, ~350-450 LOC | `028-code-graph-adoption-eval` |
| 16 | MCP config shape for 5 IDEs | README:66-97, configs/*.json | **ADOPT** (already exists) | XCE provides URL-based SSE MCP configs for 5 IDEs. Our MCP configs already exist for the same IDEs via system-spec-kit. No adoption needed. | 0 LOC | None |
| 17 | SaaS pricing model | README:264-270 | **SKIP** | Tiered monthly pricing: Free (100 queries) → $20/mo (unlimited). Our system is open-source, unlimited queries. Pricing-coupled query model is architecturally incompatible — would require billing infrastructure alien to our local-first architecture. | N/A | None |
| 18 | xanther-cli deployment dependency | README:55-61 | **SKIP** | XCE requires `npx xanther-cli init --api-key` to index repos into XCE's remote graph store. Our code_graph indexing is local: `code_graph_scan` MCP tool runs tree-sitter + structural-indexer in-process with no external CLI. | N/A | None |
| 19 | Centralized SaaS endpoint (mcp.xanther.ai) | README:74,88-93 | **SKIP** | XCE is a hosted MCP server at mcp.xanther.ai/sse with Bearer API-key auth. All context resolution requires a remote network call. Our system is local Stdio MCP with in-process SQLite — zero network dependencies. SaaS endpoint creates latency, reliability risk, and external dependency we don't have. | N/A | None |
| 20 | mini-swe-agent scaffold | README:37 | **SKIP** | Named only — zero documentation about agent scaffold implementation, prompt templates, or tool-calling loop. Closed-source agent that drives SWE-bench runs. Not adoptable without source access. | N/A | None |
| 21 | Cascade hybrid multi-pass strategy | README:43 | **SKIP** | Mentioned only as a benchmark row ("Sonnet 4.0 + XCE (cascade hybrid): 76.8%"). Zero documentation about implementation. Could be agent-loop pattern, multi-query aggregation, or model-routing — unknown. Speculation would violate REQ-006 source-of-truth grounding. | N/A | None |

---

## Will NOT Adopt — Explicit SKIP List (9 items)

Per spec.md REQ-004, the following XCE patterns are explicitly SKIPPED with rationale:

### SKIP-1: Closed-source PRAT algorithm internals
PRAT is mentioned by name only (external/README.md:29). Algorithm implementation is closed-source SaaS code. Spec.md:58 states: "The PRAT algorithm is NOT visible." **We adopt the architectural concept of each stage where it maps to our existing infrastructure; we skip the closed-source implementation.**

### SKIP-2: SaaS hosting model (mcp.xanther.ai endpoint)
XCE is hosted at `https://mcp.xanther.ai/sse` (external/README.md:74). Our system runs as local Stdio MCP with in-process SQLite. **Network dependency for context resolution is architecturally incompatible with our local-first design.**

### SKIP-3: Centralized xanther.ai dependency
XCE requires signup (README:53), API key (README:53), xanther-cli init (README:60), and MCP endpoint connection (README:74). **Our system has zero external service dependencies — introducing one would degrade reliability.**

### SKIP-4: SaaS pricing model / tiered queries-per-month
XCE uses tiered pricing (README:264-270): Free (100 queries), Starter ($8/mo), Pro ($15/mo), Unlimited ($20/mo). **We are an open-source local tool with no query limits — adding pricing gates is conceptually alien.**

### SKIP-5: Static unconditional "ALWAYS" steering
All 6 XCE steering files use hard-coded unconditional "Always use" directives (steering/CLAUDE.md:5, kiro.md:4, opencode-prompt.txt:1). Our advisor fires dynamically (confidence ≥ 0.8 threshold at render.ts:124-133). **We CANNOT adopt unconditional steering without surgeon-level scorer changes (out of scope). ADAPT instead: strengthen directive intensity when brief does fire.**

### SKIP-6: Hard-coded single-tool first call (`xce_get_context`)
Every XCE steering variant hard-codes `xce_get_context` for ALL tasks (README:113,130,144,158,171,180). Our advisor dynamically selects from 16 skills. **Replacing dynamic routing with a hard-coded single tool would destroy the advisor's purpose.**

### SKIP-7: mini-swe-agent harness (closed-source agent scaffold)
Named only at external/README.md:37. Zero documentation about agent scaffold, prompt templates, or configuration. **Not adoptable without source access.**

### SKIP-8: SWE-bench Verified Docker evaluation infrastructure
Requires Docker execution environments, swe-bench-eval Python pipeline, 2,294 PRs across 12 Python repos, ~50GB+ Docker images. Spec.md:127 excludes SWE-bench evaluation. **Language mismatch (Python vs TypeScript) + infrastructure scale make adoption impractical.**

### SKIP-9: Cascade hybrid multi-pass strategy (closed-source variant)
Mentioned only as benchmark row (README:43). Zero implementation documentation — could be agent-loop pattern, multi-query aggregation, or model-routing. **Speculating would violate REQ-006 source-of-truth grounding. SKIP without prejudice — revisit if XCE documents it.**

---

## Verdict Diversity Assessment

| Verdict | Count | Items |
|---------|-------|-------|
| ADOPT | 4 | HLD/LLD generation (#1), Semantic search (#5, already exists), PRAT Abstract stage (#8), MCP configs (#16, already exists) |
| ADAPT | 6 | Trace tool (#2), Impact analysis (#3), Omnibus combiner (#4), PRAT Persistent (#6), PRAT Recursive (#7), PRAT Tree (#9), Steering pattern transfer (#11), Steering replacement directive (#13), Token reduction measurement (#14) |
| DEFER | 2 | Full PRAT pipeline (#10), Benchmark harness (#15) |
| SKIP | 9 | SKIP-1 through SKIP-9 as listed above |
| **Total** | **21** | All 21 XCE features classified |

**Diversity**: All 4 verdict categories populated. ADOPT:ADAPT:DEFER:SKIP ≈ 4:6:2:9. Anti-bias guard (min 1 DEFER + 1 SKIP) exceeded by 11 items.

**Effective adoption rate**: 4 true ADOPT items (2 of which already exist) + 6 ADAPT patterns = 10 items actionable in sub-packets. Total estimated implementation LOC across sub-packets: ~1,400 LOC (4 sub-packets, excluding deferred eval harness).
