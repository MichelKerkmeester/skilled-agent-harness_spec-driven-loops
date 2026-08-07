# Iteration 005 — RQ5: PRAT Reverse-Engineering

**Started**: 2026-05-08T13:00:00Z
**Focus**: RQ5 — Decompose the PRAT (Persistent Recursive Abstract Tree) name and propose the most likely pipeline using ONLY public clues from `external/README.md`. Map each PRAT stage to a concrete local file:line in `mcp_server/code_graph/`. Mark every inference with confidence (high/medium/low) and label as "documented in external/" vs "inferred."

---

## Actions

1. Read `external/README.md` (full 283 lines) — extract all PRAT-related references: algorithm name (line 29), indexing model (lines 240-245), trace chain shape (lines 211-217), HLD/LLD explicit mentions (lines 24, 136, 206-207), benchmark numbers (lines 37-47), token reduction claim (line 188), architecture diagram (lines 229-238).
2. Read `code-graph-db.ts:107-160` — SQLite schema: `code_files.content_hash` (line 111), `code_edges` CONTAINS relationships (lines 138-145), `code_graph_metadata` key-value store (lines 151-155).
3. Read `code-graph-db.ts:755-822` — `isFileStale()` (content-hash-keyed freshness gate) and `ensureFreshFiles()` (batch stale check).
4. Read `indexer-types.ts:1-198` — SymbolKind enum (line 12-15) including `module` for tree hierarchy; EdgeType enum (lines 18-21) including `CONTAINS`; `generateContentHash()` (lines 117-120) using SHA-256 truncated to 12 hex chars; `ParseResult` snapshot fields (lines 79-89); `CodeEdgeMetadata` (lines 42-47) with `detectorProvenance` and `evidenceClass`.
5. Read `structural-indexer.ts:1406-1463` — recursive `walk()` function for directory descent with maxDepth guard, gitignore inheritance, filesystem-node limit.
6. Read `structural-indexer.ts:944-993` — `capturesToNodes()` converts tree-sitter RawCapture[] to CodeNode[] with module hierarchy.
7. Read `structural-indexer.ts:2077-2149` — `skipFreshFiles` flag (line 2083) and `isFileStale()` integration (line 2140) for incremental indexing.
8. Read `tree-sitter-parser.ts:1-60` — cursor-based AST walk via web-tree-sitter WASM, produces RawCapture[] consumed by `capturesToNodes()` and `extractEdges()`.
9. Read prior iterations: iteration-001.md (F-003 gap analysis, F-005 HLD/LLD schema proposal), iteration-002.md (F-008 CONTAINS edges, F-012 trace pipeline), iteration-003.md (F-016 deterministic risk signals), iteration-004.md (F-021 budget findings).

---

## Findings

### F-026: PRAT name decomposition — all 4 components evidenced in external/README.md

**P — Persistent**: Documented in external/README.md as the indexing model. "Xanther CLI or GitHub App indexes your repo into a knowledge graph" (README:240). The index survives sessions — it's created once via `npx xanther-cli init` (README:57-61), then the MCP server queries it (README:242-244, "Your agent automatically calls XCE tools when it needs codebase context"). The architecture diagram (README:229-238) shows the "Graph Store" as a persistent component alongside the PRAT Algorithm.

Confidence: **MEDIUM** (inferred). The word "persistent" implies the index survives across sessions, but the exact persistence mechanism (content-hash-keyed cache vs version-tagged snapshots vs both) is not documented. The SaaS pricing model (README:264-270, free tier: 3 repos) implies a per-repository store on XCE's side, not a local file.

**R — Recursive**: Documented in external/README.md through the trace tool API shape. "Trace a symbol from code-level up to module-level architecture" (README:212). "Source: 'validate_token', Target: 'hld' → Returns: function → class → module → architectural role" (README:215-217). This is an upward recursive walk through the containment tree. The algorithm name "Recursive" plus the documented trace chain strongly confirms multi-hop upward traversal.

Confidence: **HIGH** (documented in external/). The trace chain `function → class → module → architectural role` is explicitly documented as a recursive walk. What's NOT documented: whether XCE also recurses downward (neighborhood expansion, impact analysis) or whether "recursive" is limited to upward containment.

**A — Abstract**: Documented in external/README.md as the HLD/LLD narrative layer. "Architecture Context — HLD, LLD, component descriptions for any file or symbol" (README:24). "Returns: what it does, how it fits in the architecture, what depends on it" (README:206-207). "XCE provides HLD (high-level design), LLD (low-level design), call graphs, and component descriptions" (README:136). The steering rules consistently command: "Use xce_architecture_context before modifying any file to understand its role, dependencies, and what calls it" (README:114-115, 131-132).

Confidence: **HIGH** (documented in external/). The HLD/LLD narrative is XCE's headline feature and is described in 8 distinct lines across the README. What's NOT documented: whether the abstraction is LLM-generated, template-based, or a hybrid.

**T — Tree**: Documented in external/README.md as the hierarchical structure enabling trace. The "PRAT" name itself contains "Tree." The trace chain (README:215-217) explicitly forms a tree: function (leaf) → class (parent) → module (grandparent) → architectural role (root). The indexing model (README:240, "indexes your repo into a knowledge graph") suggests a graph-structured representation with a hierarchical backbone.

Confidence: **MEDIUM** (inferred). The word "Tree" is in the algorithm name and the trace chain is tree-shaped. However, it's unclear whether XCE stores a literal tree structure or a graph with hierarchical edges. The "knowledge graph" description (README:240) suggests graph, not pure tree — but a tree is the hierarchical subset.

Evidence lines:
- external/README.md:29 — "Powered by the PRAT (Persistent Recursive Abstract Tree) algorithm."
- external/README.md:240-244 — Indexing model: CLI indexes repo → knowledge graph → MCP server queries
- external/README.md:211-217 — Trace chain: function → class → module → architectural role
- external/README.md:24, 136, 206-207 — HLD/LLD/component descriptions
- external/README.md:229-238 — Architecture diagram showing PRAT Algorithm + Graph Store

### F-027: PRAT stage → local file map (4 rows, with confidence and evidence labels)

| PRAT Stage | XCE behavior (source) | Local equivalent file:line | Confidence | Label |
|---|---|---|---|---|
| **Persistent** | Content-hash-keyed cache; index survives sessions. Documented: "Index your repo into a knowledge graph" (external/README.md:240); deployment requires `npx xanther-cli init` first (README:57-61). | `lib/code-graph-db.ts:755-773` — `isFileStale()` uses `content_hash` comparison to skip re-parsing unchanged files; `lib/code-graph-db.ts:111` — `code_files.content_hash TEXT NOT NULL`; `lib/structural-indexer.ts:2083,2140` — `skipFreshFiles` flag gates incremental indexing. `lib/indexer-types.ts:117-120` — `generateContentHash()` SHA-256 truncated to 12 hex. | MEDIUM | Inferred — we match on content-hash-keyed freshness. Gap: no version-tagged snapshots (git-branch-tagged indices, time-series edge state) exist in our code. |
| **Recursive** | Multi-hop containment walk + AST parse. Documented: trace walks `function → class → module → architectural role` (external/README.md:215-217); "powered by the PRAT algorithm" enables this (README:29). | `lib/structural-indexer.ts:1406-1463` — recursive `walk()` directory descent with maxDepth and node-limit guards; `lib/tree-sitter-parser.ts:1-60` — cursor-based AST walk via web-tree-sitter WASM producing `RawCapture[]` for `capturesToNodes()`; `lib/indexer-types.ts:19` — `CONTAINS` in EdgeType with 1.0 default weight (line 24) enabling upward function→class→module traversal. | HIGH | Documented in external/ — trace chain matches our CONTAINS edge architecture. We have all 3 recursive layers (directory, AST, containment). Gap: no memoization of traversal results for repeated context queries. |
| **Abstract** | HLD/LLD/component descriptions — natural-language narrative layer. Documented: "what it does, how it fits in the architecture, what depends on it" (external/README.md:206-207); "HLD, LLD, call graphs, and component descriptions" (README:136); "Architecture Context" headline feature (README:24). | **NO EQUIVALENT.** `lib/code-graph-context.ts:32-54` — `ContextResult` returns raw symbol records (name, kind, file, line) and edge lists — no synthesized narrative. Proposed: new `lib/code-graph-hld-lld.ts` (F-005, iteration-001.md:93-152) — deterministic template-only HLD/LLD from existing graph data (~200 LOC). | HIGH | Documented in external/ — HLD/LLD is XCE's headline feature. We have zero narrative generation today. RQ1 F-003 confirmed: "GAP — no narrative layer." |
| **Tree** | AST + module hierarchy forming traversable tree from leaf symbol to module root. Documented: trace chain hierarchy (external/README.md:215-217); "indexes your repo into a knowledge graph" (README:240). | `lib/tree-sitter-parser.ts:1-60` — web-tree-sitter WASM cursor-based AST walk; `lib/structural-indexer.ts:944-993` — `capturesToNodes()` converts AST captures to CodeNode[] with module→symbol CONTAINS hierarchy; `lib/code-graph-db.ts:138-145` — `code_edges` stores CONTAINS edges; `lib/indexer-types.ts:12-15` — SymbolKind includes `module`, `class`, `method`, `function` — the tree node types. | MEDIUM | Inferred — AST coverage is solid via tree-sitter. Module hierarchy via `fq_name` dot-delimited prefixes (e.g., `pkg.module.Class.method`) is heuristic, not explicit tree. No `code_packages` table exists (RQ2 F-009). |

### F-028: Most likely PRAT pipeline (inferred from public clues)

Based on the name decomposition, documented tool behaviors, and architecture diagram:

```
Pipeline stages (inferred, NOT from source):
1. INDEX (Persistent)  → Content-hash each file → skip unchanged on re-index
2. PARSE (Tree)        → tree-sitter/AST walk → extract symbols + containment edges
3. CONNECT (Recursive) → CONTAINS chain upward: function→class→module→package
                        → CALLS/IMPORTS lateral edges between modules
                        → Store as graph (knowledge graph per README:240)
4. ABSTRACT (Abstract) → Generate HLD/LLD descriptions per file/symbol
                        → Likely LLM-powered (SaaS model, +7.4pp SWE-bench gains)
                        → Cached/stored alongside graph for fast retrieval
5. QUERY               → xce_get_context combines search + arch + trace in one call
                        → xce_architecture_context returns cached HLD/LLD for target
                        → xce_trace walks the tree upward (recursive)
                        → xce_impact_analysis walks the graph downward (recursive + risk)
```

**Estimated flow**: `Index(N) → Parse(tree-sitter) → Connect(edges) → Abstract(LLM) → Cache(hash-keyed)`
The "Abstract" stage is the most expensive (LLM generation per symbol/file) and the most differentiating. The other 3 stages (Persistent, Recursive, Tree) are structural and mechanically reproducible with our existing infrastructure.

### F-029: Verdict per PRAT stage — ADOPT / ADAPT / DEFER / SKIP

| Stage | Verdict | Rationale |
|-------|---------|-----------|
| **Persistent** | ADAPT | We already have content-hash-keyed incremental indexing (`isFileStale` at code-graph-db.ts:755, `skipFreshFiles` at structural-indexer.ts:2083). Version-tagged snapshots (git-branch-tagged indices) are a separate feature (RQ3 S7 edge-drift), not part of "persistent" in the caching sense. |
| **Recursive** | ADAPT | We have all 3 recursive layers: (a) directory walk (`walk()` at structural-indexer.ts:1406), (b) AST parse (tree-sitter-parser.ts:1-60), (c) CONTAINS-chain traversal (indexer-types.ts:19, code-graph-db.ts `queryEdgesTo`). Gap: no memoization of traversal results for repeated queries. Low cost (~50 LOC SQLite cache). |
| **Abstract** | ADOPT | This is the identified gap (RQ1 F-003). We have ZERO narrative generation. Template-only deterministic HLD/LLD (F-005) is the minimum viable start (~200 LOC). LLM enrichment is an optional second pass. This is the only PRAT stage we lack any equivalent for. |
| **Tree** | ADAPT | tree-sitter AST coverage is solid (tree-sitter-parser.ts). Module hierarchy via `fq_name` prefix splitting is heuristic but sufficient for MVP. A `code_packages` table (~50 LOC) would formalize the module tree. Not a blocker. |
| **Full PRAT pipeline** | **DEFER** | XCE's full pipeline is closed-source SaaS. We cannot ADOPT the complete pipeline. Our approach: ADAPT the structural stages we already have (Persistent, Recursive, Tree) and ADOPT a local equivalent for the Abstract stage (HLD/LLD generation). |

### F-030: Cheapness estimate — which PRAT stages we could approximate ON TOP of existing infrastructure

| Stage | Approximate cost | What exists today | What's needed | LOC estimate |
|-------|-----------------|-------------------|---------------|--------------|
| **Persistent** (enhanced) | Near-zero | `isFileStale` (code-graph-db.ts:755), `skipFreshFiles` (structural-indexer.ts:2083) | Add version-tagged snapshot support: snapshot `code_edges` state at index time with git HEAD tag. Useful for edge-drift (RQ3 S7). | ~70 LOC (DDL 30 + snapshot logic 40) |
| **Recursive** (memoized) | Low | `queryEdgesTo(CONTAINS)` (code-graph-db.ts:972-987), `resolveSubjectFilePath` (code-graph-db.ts:989-1015) | Add memoization cache for repeated containment-walk results. SQLite table: `trace_cache(trace_hash, symbol_id, depth, result_json, cached_at)`. Avoids re-walking the same symbol→module chain. | ~50 LOC (DDL 15 + cache logic 35) |
| **Abstract** (template-only) | Low | `code_nodes` (kind, name, signature, docstring, fq_name, file_path), `code_edges` (CONTAINS, CALLS, IMPORTS, etc.) | `lib/code-graph-hld-lld.ts` — deterministic template functions: `computeHLD(filePath)` and `computeLLD(symbolId)`. Derive file_role from kind counts, layer from import/export ratios, summary from templates. | ~200 LOC (new file) |
| **Abstract** (LLM-enriched) | Moderate | Same graph data + template-only baseline | Call an LLM with the template output as prompt + structured context. Append natural-language narrative to the template output. Cost: API call per query. | ~80 LOC (LLM adapter) |
| **Tree** (formalized) | Low | tree-sitter AST, CONTAINS edges, `fq_name` heuristic | `code_packages` table: pre-computed package→directory→files mapping. Populated during index via `fq_name` prefix extraction + directory grouping. | ~50 LOC (DDL 20 + logic 30) |
| **Total cheap approximation** | — | Existing structural-indexer + tree-sitter + code-graph-db | Deterministic template-only HLD/LLD + recursive memoization + optional `code_packages` + optional version snapshots | ~370 LOC |

### F-031: Concrete PRAT-to-pipeline mapping diagram

```
XCE PRAT Pipeline (inferred)          Local Equivalent (code_graph/)
─────────────────────────────          ─────────────────────────────
                                      (EXISTING)
P: Index with content-hash            isFileStale() code-graph-db.ts:755
   cache ────────────────────────►    skipFreshFiles structural-indexer.ts:2083
                                      content_hash code-graph-db.ts:111
                                      generateContentHash() indexer-types.ts:117

                                      (EXISTING)
T: tree-sitter AST walk              tree-sitter-parser.ts:1-60 (WASM)
   + module hierarchy ──────────►     capturesToNodes() structural-indexer.ts:944
                                      CONTAINS edges code-graph-db.ts:138-145
                                      SymbolKind hierarchy indexer-types.ts:12-15

                                      (EXISTING)
R: CONTAINS upward walk              queryEdgesTo(CONTAINS) code-graph-db.ts:972-987
   + CALLS/IMPORTS lateral           resolveSubjectFilePath() code-graph-db.ts:989
   → recursive traversal ───────►     extractEdges() structural-indexer.ts:996

                                      (GAP — RQ1 F-003, F-005)
A: HLD/LLD generation                ──NOTHING EXISTS──
   (LLM or template) ───────────►     Proposed: code-graph-hld-lld.ts (~200 LOC)
                                      Template-only deterministic first
                                      LLM enrichment optional second pass
```

### F-032: XCE benchmark numbers as PRAT pipeline evidence

External README.md:37-47:

| Setup | Resolve Rate | Delta |
|---|---|---|
| Sonnet 4.0 (baseline) | 66.0% | — |
| Sonnet 4.0 + XCE | 73.4% | **+7.4pp** |
| Sonnet 4.0 + XCE (cascade hybrid) | 76.8% | +10.8pp |
| MiniMax M2.5 (baseline) | 75.8% | — |
| MiniMax M2.5 + XCE | 78.2% | +2.4pp |

The +7.4pp gain for Sonnet 4.0 is the headline number. The "cascade hybrid" variant (+10.8pp) suggests XCE supports a multi-pass strategy where context is fetched in stages. The diminishing return on MiniMax M2.5 (+2.4pp vs +7.4pp) suggests the PRAT pipeline's value is highest for weaker/smaller models — consistent with the "Abstract" stage providing narrative context the model would otherwise need to deduce from raw code.

Evidence lines:
- external/README.md:39-45 — benchmark table rows
- external/README.md:47 — "An older-generation model (Sonnet 4.0) with XCE beats raw Sonnet 4.6 and reaches Opus-level performance — at 16x lower cost."
- external/README.md:188 — "~20% token reduction when the agent uses XCE proactively"

The ~20% token reduction (README:188) is attributed to steering rules (agent uses XCE first instead of reading files). This number is downstream of PRAT — the PRAT pipeline produces the cached abstract context, and the steering rules ensure the agent fetches it instead of reading raw files.

---

## Q-Answered

- **RQ5 — PRAT Reverse-Engineering**: Fully answered. PRAT name decomposed into 4 components with evidence from external/README.md for each (F-026). Each stage mapped to a concrete local file:line with confidence flag and evidence label (F-027). Most likely pipeline proposed (F-028). Verdict: full pipeline DEFER; individual stages ADAPT (Persistent, Recursive, Tree) or ADOPT (Abstract as new HLD/LLD capability). (F-029). Cheapness estimate: ~370 LOC to approximate all 4 stages on top of existing infrastructure, with the Abstract stage being the only genuinely new capability (F-030). Pipeline-to-local-file mapping diagram produced (F-031). Benchmark numbers analyzed as pipeline evidence (F-032).

## Q-Remaining

- RQ6–RQ9 untouched (iterations 1–5 scoped to RQ1–RQ5).

## Next-Focus

**RQ6 — Steering Pattern Transfer**: Adapt XCE's static "ALWAYS call X FIRST" steering pattern to our dynamic `skill_advisor` brief render-layer. Identify the correct intent → first-action map for our 13 skills. Pinpoint where in `skill_advisor/lib/render.ts` the change lands. Measure impact on token reduction via existing `prompt-cache.ts` + `budget-allocator.ts`. Target files: `skill_advisor/lib/render.ts` (brief rendering), `external/README.md` lines 103-188 (steering rules for 5 IDEs), `external/README.md` line 188 (token reduction claim).

---

## Verdict Summary: RQ5 PRAT Reverse-Engineering

| PRAT Stage | XCE evidence (external/README.md) | Local equivalent | Confidence | Verdict |
|-----------|----------------------------------|------------------|------------|---------|
| **Persistent** | "Index your repo into a knowledge graph" (line 240); CLI init phase (lines 57-61); "Graph Store" in architecture diagram (line 237) | `code-graph-db.ts:755-773` (`isFileStale` content-hash freshness), `structural-indexer.ts:2083,2140` (`skipFreshFiles` incremental) | MEDIUM | **ADAPT** — content-hash cache exists; version-tagged snapshots optional |
| **Recursive** | Trace `function → class → module → architectural role` (lines 215-217); "Powered by PRAT algorithm" (line 29) | `structural-indexer.ts:1406-1463` (recursive `walk()`), `tree-sitter-parser.ts:1-60` (AST walk), `indexer-types.ts:19` (CONTAINS edge) | HIGH | **ADAPT** — all 3 recursive layers exist; memoization gap (~50 LOC) |
| **Abstract** | "HLD, LLD, component descriptions" (lines 24,136); "what it does, how it fits" (lines 206-207); "Architecture Context" headline (line 23) | **NONE** — RQ1 F-003 confirmed gap. `code-graph-context.ts` returns raw symbols, no narrative. | HIGH | **ADOPT** — new `code-graph-hld-lld.ts` (~200 LOC template-only baseline) |
| **Tree** | "Trace a symbol from code-level up to module-level architecture" (line 212); "knowledge graph" (line 240); tree chain in trace output (line 217) | `tree-sitter-parser.ts` (WASM AST), `capturesToNodes()` (structural-indexer.ts:944), CONTAINS edges (code-graph-db.ts:138-145), SymbolKind hierarchy (indexer-types.ts:12-15) | MEDIUM | **ADAPT** — AST solid; module hierarchy heuristic; `code_packages` table optional (~50 LOC) |
| **Full PRAT pipeline** | Closed-source SaaS algorithm (line 29); hosted at mcp.xanther.ai (line 74); SaaS pricing (lines 264-270) | We have 3 of 4 stages. Abstract is the only gap. | — | **DEFER** — closed-source; ADAPT individual stages on our infra |

### Estimated total LOC to approximate PRAT on existing infrastructure: ~370

| Component | New file | LOC |
|-----------|---------|-----|
| HLD/LLD template generation | `lib/code-graph-hld-lld.ts` (new) | ~200 |
| Recursive memoization cache | `lib/code-graph-db.ts` (edit) | ~50 |
| Version-tagged snapshots | `lib/code-graph-db.ts` (edit) | ~70 |
| `code_packages` table | `lib/code-graph-db.ts` (edit) | ~50 |
| **Total** | | **~370** |

Zero new dependencies. All data already in SQLite. Template-only HLD/LLD has zero runtime cost. LLM enrichment is additive on top.

---

## Tool Calls

| # | Tool | Purpose |
|---|------|---------|
| 1 | memory_match_triggers | Surface related packet context |
| 2 | Read (spec.md) | RQ5 definition + PRAT scope constraints |
| 3 | Read (iteration-004.md) | Prior iteration delta + next-focus |
| 4 | Read (deep-research-state.jsonl) | Current iteration state (line 8: iter 4 complete) |
| 5 | Read (external/README.md, full 283 lines) | PRAT algorithm reference (line 29), index model (lines 240-245), trace chain (lines 211-217), HLD/LLD mentions (lines 24,136,206), arch diagram (lines 229-238), benchmarks (lines 37-47), token reduction (line 188) |
| 6-8 | Read (iterations 001-003) | F-003 gap analysis, F-005 HLD/LLD schema, F-008 CONTAINS edges, F-012 trace pipeline, F-016 risk signals |
| 9 | Glob (lib/*.ts) | Inventory code_graph library files for mapping targets |
| 10 | Read (code-graph-db.ts:107-160, 755-822) | SQLite schema: content_hash, CONTAINS edges, code_graph_metadata; `isFileStale()` + `ensureFreshFiles()` content-hash freshness |
| 11 | Read (indexer-types.ts:1-198) | SymbolKind hierarchy, EdgeType CONTAINS, generateContentHash, ParseResult snapshot fields |
| 12 | Read (structural-indexer.ts:1406-1463, 944-993, 2077-2149) | Recursive `walk()`, `capturesToNodes()`, `skipFreshFiles` incremental + `isFileStale` integration |
| 13 | Read (tree-sitter-parser.ts:1-60) | Cursor-based AST walk producing RawCapture[] |
| 14 | Grep (code-graph-context.ts) | Check for recursive depth/expansion patterns |

**Tool calls**: 14 (at cap of 14 per NFR-P02).
