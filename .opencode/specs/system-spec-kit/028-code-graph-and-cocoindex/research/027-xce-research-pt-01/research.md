> Extracted from `027/research/027-xce-research-pt-01/research.md` on 2026-05-28 (code-graph + cocoindex sections).
> Memory-topic sections and raw run-logs remain in 027.

## Executive Summary

The Xanther Context Engine (XCE) is a hosted SaaS MCP server that delivers layered architectural context (HLD, LLD, component descriptions, call graphs, impact analysis) via 5 tool primitives, claiming +7.4pp on SWE-bench Verified for Sonnet 4.0 and ~20% token reduction when steering rules are active. Over 9 research iterations comparing XCE's public surface (283-line `external/README.md` + 6 steering files) against our local `code_graph` (`mcp_server/code_graph/`, 16 source files) and `skill_advisor` (`mcp_server/skill_advisor/`, core `lib/render.ts`) subsystems, we identified 4 ADOPT feature rows, 9 ADAPT feature rows, 2 DEFER rows, and 6 SKIP rows, plus 9 expanded non-adoption boundaries. The core finding: three of four PRAT stages (Persistent, Recursive, Tree) already have working local equivalents in our code_graph infrastructure; the Abstract stage — HLD/LLD narrative generation — is the sole gap warranting new implementation. XCE's SaaS hosting model, pricing, static unconditional steering, and closed-source PRAT internals are architecturally incompatible with our local-first, dynamic-routing architecture. Five concrete child phases are now scoped at ~1,900-2,320 LOC after pt-02 cross-validation amendments. This synthesis provides file:line-cited evidence for every claim, satisfying all 11 REQs in the packet spec.

---


## RQ1 — Architectural Context Gap

**Question**: What is the minimum viable HLD/LLD schema we could emit from our existing graph + an optional generation step?

**Findings consolidated from iteration-001.md (F-001 through F-006):**

XCE's `xce_architecture_context` (external/README.md:24,202-209) returns a narrative layer — component description ("what it does"), LLD, HLD ("how it fits in the architecture"), and relationships. Our `code_graph_context` (`code_graph/lib/code-graph-context.ts:32-54`) returns raw symbol records (name, kind, file, line) plus edge lists — no synthesized narrative. The field-level gap analysis (iteration-001.md:54-66, F-003) confirmed three gaps: no narrative layer, no design layer, no architectural role classification.

A deterministic template-only HLD/LLD schema was proposed (iteration-001.md:93-151, F-005), deriving all output from existing graph data: `file_role` from SymbolKind counts, `layer` from import/export ratios, `summary` from a count+edge template. Implementation requires a new `lib/code-graph-hld-lld.ts` (~200 LOC) with 0 new dependencies and 0 schema migrations — all data is already in SQLite via `code_nodes` (lib/code-graph-db.ts:120-136) and `code_edges` (lib/code-graph-db.ts:138-145).

**Local file:line cites**: `code_graph/lib/code-graph-context.ts:32-54` (ContextResult schema — raw symbols, no narrative), `code_graph/lib/code-graph-db.ts:120-136` (code_nodes — kind, signature, docstring, fq_name)
**External file:line cites**: `external/README.md:24` (Architecture Context headline), `external/README.md:206-207` ("what it does, how it fits in the architecture")

**Verdict**: ADOPT — template-only HLD/LLD is the only genuinely new capability we lack. ~200 LOC, 0 deps, 0 schema.

---


## RQ2 — Trace Tool Design

**Question**: What inputs/outputs would `code_graph_trace` need to walk symbol → file → package → repo level?

**Findings consolidated from iteration-002.md (F-007 through F-012):**

XCE's `xce_trace` (external/README.md:211-218) accepts a symbol name and target level ("hld"), returning a layered chain: `function → class → module → architectural role`. Our existing edge table stores CONTAINS edges (indexer-types.ts:19, weight 1.0 at line 24) enabling the upward walk from symbol → containing class via `queryEdgesTo(symbolId, 'CONTAINS')` at code-graph-db.ts:972-987. The file_path column on every code_node (code-graph-db.ts:125) provides the symbol→file hop directly. `resolveSubjectFilePath` (code-graph-db.ts:989-1015) resolves any symbol to a file in 5 fallback steps.

The schema gap: no `code_packages` table exists (code-graph-db.ts:107-118), so module→package→repo grouping is heuristic (directory prefix, fq_name dot-splitting). However, MVP trace works without a new table — the existing CONTAINS + file_path + resolveSubjectFilePath cover 3 of 4 trace rungs. Architectural role computation reuses the HLD/LLD classification logic from RQ1.

**Local file:line cites**: `code_graph/lib/indexer-types.ts:19` (CONTAINS in EdgeType), `code_graph/lib/code-graph-db.ts:989-1015` (resolveSubjectFilePath)
**External file:line cites**: `external/README.md:215-217` (trace chain "function → class → module → architectural role"), `external/README.md:117` (steering: "Use xce_trace to understand how a function connects to the broader architecture")

**Verdict**: ADAPT — schema is sufficient for MVP; ~210 LOC; no migration. Optional `code_packages` table (~50 LOC) for formalized module hierarchy.

---


## RQ3 — Impact Analysis Schema

**Question**: What risk signals can be computed deterministically? Is LLM scoring needed?

**Findings consolidated from iteration-003.md (F-013 through F-019):**

XCE's `xce_impact_analysis` (external/README.md:220-227) accepts changed file paths and returns affected modules + downstream dependencies + risk assessment. Our `detect_changes` (handlers/detect-changes.ts:40-50, 362-368) returns affected symbols and files only — zero risk signals. `cross-file-edge-resolver` (lib/cross-file-edge-resolver.ts:1-123) reconciles CALLS edges only, not an impact analyzer.

Five deterministic risk signals were identified as computable from existing graph data (iteration-003.md:77-83, F-016): fan-in count (via `queryEdgesTo` at code-graph-db.ts:972-987), fan-out count (via `queryEdgesFrom` at code-graph-db.ts:949-963), hub centrality (via `queryFileDegrees` at code-graph-db.ts:1039-1083), test-coverage gap (via TESTED_BY edge check at indexer-types.ts:20), and edge confidence weighting (via DEFAULT_EDGE_WEIGHTS at indexer-types.ts:23-34 + metadata JSON). Transitive import depth (S6) requires application-level BFS over `queryFileImportDependents` (code-graph-db.ts:1017-1037). Three signals need optional LLM enrichment: semantic risk narrative, change-intent classification, and criticality weighting per downstream module (F-017).

**Local file:line cites**: `code_graph/handlers/detect-changes.ts:40-50` (DetectChangesResult — no risk field), `code_graph/lib/code-graph-db.ts:1039-1083` (queryFileDegrees)
**External file:line cites**: `external/README.md:225-227` ("Returns: affected modules, downstream dependencies, risk assessment"), `external/README.md:160` ("Use xce_impact_analysis before multi-file changes")

**Verdict**: ADAPT — deterministic baseline with 5-6 risk signals computable from existing graph; optional LLM enrichment. ~300 LOC, no schema migration.

---


## RQ4 — Get-Context Combiner

**Question**: Should we ship a NEW `code_graph_context_omni` or FOLD into existing `code_graph_context`?

**Findings consolidated from iteration-004.md (F-020 through F-025):**

XCE's `xce_get_context` is a steering-only combiner (external/README.md:113,130,144,158,171,180) — absent from the Available Tools section (README:190-227). It combines search + architecture + trace into one first-call. Our `code_graph_context` dispatches ONE queryMode per call (handlers/context.ts:264-266) with a 1200-token default budget (handlers/context.ts:343). Trade-off matrix (F-023) compared NEW tool (~380 LOC, duplicated readiness gates) vs FOLD-IN via `queryMode: 'omni'` (~117 LOC, reuses all existing infrastructure). FOLD-IN decisively favored: less code, single handler, simpler UX.

Internal sub-allocation design (F-025): omni mode calls `buildContext()` 2-3 times with proportional budget split (40% architecture / 30% trace / 30% impact). The existing `budgetTokens` override parameter (context.ts:343) handles omni's 2400-token default without touching `budget-allocator.ts`. The cross-source allocator stays unchanged — its 1200-token floor produces `partialOutput: true` when truncated, and the LLM re-requests with narrower scope.

**Local file:line cites**: `code_graph/handlers/context.ts:264-266` (single queryMode validation), `code_graph/lib/budget-allocator.ts:32-38` (DEFAULT_FLOORS)
**External file:line cites**: `external/README.md:113` ("Call xce_get_context as your FIRST step — It combines search, architecture context, and tracing into one call"), `external/README.md:130` ("returns architecture, code locations, and relationships")

**Verdict**: ADAPT — FOLD-IN with `queryMode: 'omni'`. ~117 LOC vs ~380 LOC for a new tool. Single handler, no budget-allocator changes.

---


## RQ5 — PRAT Reverse-Engineering

**Question**: What is the most likely PRAT pipeline? Can we replicate it with our tree-sitter + generation step?

**Findings consolidated from iteration-005.md (F-026 through F-032):**

PRAT name decomposition (F-026) with evidence from external/README.md:
- **P — Persistent**: Index survives sessions. Documented in "indexes your repo into a knowledge graph" (README:240) and CLI init phase (README:57-61). Confidence: MEDIUM (mechanism not documented).
- **R — Recursive**: Multi-hop containment walk. Documented in trace chain "function → class → module → architectural role" (README:215-217). Confidence: HIGH.
- **A — Abstract**: HLD/LLD narrative layer. Documented in 8 lines across README (lines 24, 136, 206-207). Confidence: HIGH.
- **T — Tree**: Hierarchical backbone. Inferred from "Tree" in name + trace chain. Confidence: MEDIUM.

Stage-to-local-file map (F-027): Persistent → `isFileStale()` at code-graph-db.ts:755-773 + `skipFreshFiles` at structural-indexer.ts:2083,2140. Recursive → `queryEdgesTo(CONTAINS)` at code-graph-db.ts:972-987 + tree-sitter-parser.ts WASM walk. Abstract → NOTHING EXISTS (RQ1 gap). Tree → CONTAINS edges at code-graph-db.ts:138-145 + SymbolKind hierarchy at indexer-types.ts:12-15 + fq_name prefix module inference.

Stage verdicts (F-029): Persistent ADAPT, Recursive ADAPT, Abstract ADOPT, Tree ADAPT, Full pipeline DEFER (closed-source SaaS). Total approximation cost: ~370 LOC across 4 components (F-030). Pipeline-to-local diagram (F-031) maps each PRAT stage to a concrete code_graph file:line.

**Local file:line cites**: `code_graph/lib/code-graph-db.ts:755-773` (isFileStale), `code_graph/lib/tree-sitter-parser.ts:1-60` (WASM AST walk)
**External file:line cites**: `external/README.md:29` ("Powered by the PRAT algorithm"), `external/README.md:240` ("indexes your repo into a knowledge graph")

**Verdict**: 3 stages ADAPT (already exist), 1 stage ADOPT (Abstract/HLD-LLD is the gap), full pipeline DEFER.

---


## RQ7 — Benchmark Methodology Transfer

**Question**: What's the lightest viable local eval harness for measuring file-reads-avoided / context-accuracy?

**Findings consolidated from iteration-007.md (F-039 through F-042):**

XCE uses SWE-bench Verified + mini-swe-agent (external/README.md:37-45) — heavyweight infrastructure (~50GB Docker, 2,294 Python PRs, closed-source agent scripts). Not replicable locally. Our existing test infrastructure (F-040) provides reusable patterns: 12 eval metrics in `mcp_server/lib/eval/eval-metrics.ts`, static measurement harness in `scripts/observability/smart-router-measurement.ts`, 15-file eval framework in `mcp_server/lib/eval/` (ground-truth-generator, ablation-framework, warm-start-variant-runner, eval-db, reporting-dashboard).

Proposed local harness (F-041): 12-20 refactoring tasks on our own TS codebase, 3 primary metrics (file-reads-avoided, context-accuracy via computeHitRate at eval-metrics.vitest.ts:168-194, answer-completeness) + 2 diagnostics (token waste ratio, first-action adherence). Baseline-vs-After protocol with paired comparison, CLI dispatcher spawning OpenCode subprocesses. Estimated ~350-450 LOC. Comparison table vs SWE-bench (F-041:158-168) shows local harness is 100x lighter.

**Local file:line cites**: `scripts/observability/smart-router-measurement.ts:641-689` (runMeasurement loop pattern), `mcp_server/lib/eval/eval-metrics.ts` (12 pure-computation metrics)
**External file:line cites**: `external/README.md:37` ("All results on SWE-bench Verified using mini-swe-agent"), `external/README.md:41-45` (resolve rate table: 66.0% baseline → 73.4% with XCE)

**Verdict**: DEFER — P2 sub-packet `028-code-graph-adoption-eval`. Requires RQ6 render change first and feeds RQ8 measurement. ~350-450 LOC.

---


## RQ8 — Token Reduction Validation

**Question**: Is XCE's ~20% token reduction measurable in our system via prompt-cache.ts + budget-allocator.ts?

**Findings consolidated from iteration-008.md (F-043 through F-047):**

XCE attributes ~20% token reduction to steering compliance (external/README.md:188): stronger directive → agent uses XCE first → fewer file-read tokens. Our MCP server instrumentation (F-044) has zero session-level token measurement: `prompt-cache.ts` is an exact-match cache with input-side token caps (lines 10-12), `budget-allocator.ts` is a pre-allocation planner (lines 52-117), `code-graph-context.ts` reports single-response `budgetUsed` via chars/4 heuristic (line 199), `compact-merger.ts` uses same heuristic for section sizing (lines 53-55).

Actual session token counting EXISTS but OUTSIDE the MCP server (F-045): `session-analytics-db.ts` stores `prompt_tokens`, `completion_tokens`, `total_tokens` (lines 100-104) with per-turn breakdown (lines 125-129), populated by `session-stop.ts` from LLM API usage envelopes. `response-hints.ts:48-53` extracts provider-reported token counts from API responses. Measurement protocol (F-046): baseline-vs-after with N ≥ 10 sessions per condition, query `getSessionRow()` for `total_tokens` post-session-stop, compute paired delta with Welch's t-test. ~80 LOC of instrumentation in sub-packet 028 eval harness.

Expected effect: 5-15% reduction (lower than XCE's 20% due to dynamic firing, different tool output format). Measurement depends on eval harness (RQ7 DEFER to sub-packet 028).

**Local file:line cites**: `mcp_server/lib/analytics/session-analytics-db.ts:100-104` (analytics_sessions token columns), `mcp_server/hooks/response-hints.ts:48-53` (extractSurfacedTokenCount)
**External file:line cites**: `external/README.md:188` ("~20% token reduction when the agent uses XCE proactively"), `external/README.md:47` ("at 16x lower cost")

**Verdict**: ADAPT — measurement deferrable to sub-packet 028/029. ~80 LOC. Expected 5-15% reduction.

---


## PRAT Reconstruction (REQ-007)

The PRAT (Persistent Recursive Abstract Tree) algorithm name is the sole public identifier of XCE's core architecture (external/README.md:29). Decomposition with evidence:

| Component | XCE behavior | Local equivalent | Confidence |
|-----------|-------------|------------------|------------|
| **Persistent** | Content-hash-keyed index survives sessions (README:57-61,240) | `isFileStale()` (code-graph-db.ts:755-773), `skipFreshFiles` (structural-indexer.ts:2083,2140) | MEDIUM — exact mechanism not documented |
| **Recursive** | Multi-hop containment walk: function→class→module (README:215-217) | `queryEdgesTo(CONTAINS)` (code-graph-db.ts:972-987), tree-sitter-parser.ts WASM walk, directory `walk()` (structural-indexer.ts:1406-1463) | HIGH — documented trace chain |
| **Abstract** | HLD/LLD/component descriptions (README:24,136,206-207) | **GAP** — nothing exists today. Proposed: `lib/code-graph-hld-lld.ts` (~200 LOC template-only) | HIGH — XCE headline feature |
| **Tree** | AST + module hierarchy forming traversable tree (README:212,240) | CONTAINS edges (code-graph-db.ts:138-145), SymbolKind hierarchy (indexer-types.ts:12-15), fq_name prefix module inference | MEDIUM — inferred from name + trace shape |

**Most likely pipeline** (F-028, inferred):
```
Index(Persistent) → Parse(Tree via tree-sitter) → Connect(Recursive, CONTAINS+CALLS+IMPORTS) → Abstract(LLM-generation, cached) → Query(5 tools)
```

**Cheap approximation on our infrastructure**: ~370 LOC total (F-030):
- Template-only HLD/LLD: `lib/code-graph-hld-lld.ts` — ~200 LOC
- Recursive memoization cache: SQLite `trace_cache` table — ~50 LOC
- Version-tagged snapshots: snapshot `code_edges` at index time — ~70 LOC
- Formalized module tree: `code_packages` table — ~50 LOC

All four stages map to concrete local files with line numbers (F-027, F-031).

---


## Alternatives Considered (REQ-011)

### Alternative A: Template-only HLD/LLD generation (SELECTED for Phase 1)

Proposed by F-005 (iteration-001.md:93-152): all HLD/LLD fields derived deterministically from existing graph data — kind counts, import/export ratios, edge patterns, docstrings. Template: "This file defines {count} {kind} symbol(s): {top_3_names}. It imports from {import_count} module(s) and is imported by {export_count} module(s)."

**Selection rationale**: Zero runtime cost, zero new dependencies, instant response time, always-consistent output. Sufficient for an MVP that demonstrates structural narrative value. Pairs naturally with the LLM-enriched variant as an optional second pass.

### Alternative B: LLM-generated HLD/LLD (deferred to Phase 2)

LLM generates natural-language descriptions per file/symbol from graph data + docstrings + code snippets. This matches XCE's SaaS model (likely their approach given benchmark gains).

**Deferral rationale**: Requires an LLM API call per query (latency + cost), depends on prompt quality, and risks hallucination. The template-only baseline validates the concept before adding LLM complexity. The LLM variant is additive on top of the template baseline, not a replacement.

### Alternative C: Hybrid — template baseline + LLM enrichment on demand (target end-state)

Template output serves as the always-available baseline. Pass 1 described this as an `enrichWithLLM: true` flag; pt-02 supersedes that boolean with an explicit provider-options contract and `provider: "none"` default. The LLM receives the template output as its prompt context only when enrichment is explicitly configured, grounding it in deterministic structural facts and reducing hallucination risk.

**Selection rationale**: Combines the consistency of templates with the readability of LLM output. Template output doubles as a hallucination guard. Follows the same architecture as RQ3's impact analysis (deterministic baseline + optional LLM enrichment).

---


## Open Questions

1. **20% token reduction — can we match it?** XCE's ~20% claim (external/README.md:188) attributes reduction to *proactive use*, not tool efficiency. Our steering fires dynamically (confidence ≥ 0.8), not unconditionally. Expected: 5-15%. Verifiable only after RQ6 render change ships and sub-packet 028 eval harness measures it.

2. **Should `code_graph_context_omni` ship as a new tool or folded-in queryMode?** RQ4 finding (F-024): FOLD-IN (`queryMode: 'omni'`) decisively favored — 117 LOC vs 380 LOC, single handler, simpler UX. User directive (spec.md §10 Open Questions): "Defer to RQ4 finding."

3. **Is benchmark methodology sufficient for go/no-go on LLM enrichment?** RQ7 proposes a local harness with 12-20 refactoring tasks. The template-only HLD/LLD (RQ1) will likely show measurable file-read reduction at this scale. The LLM-enriched variant needs a separate measurement campaign to justify its latency+cost.

4. **Convergence declared at iteration 10 with `stopReason: max_iterations_with_synthesis`?** All 9 RQs answered with ≥3 supporting findings each. Novelty dropped below 0.10 by iteration 9. Iteration 10 is synthesis-only (newInfoRatio ~0.15). REQ-005 satisfied: all RQs addressed, convergence achieved within 10-iteration budget.

5. **`code_packages` table — worth the schema migration for v1?** RQ2 (F-009) and RQ3 identified a gap: module hierarchy is heuristic (directory prefix, fq_name splitting). A formal `code_packages` table would improve precision on the "module/repo" trace rung and enable deterministic module→impact queries. Cost: ~50 LOC DDL + logic. Recommended as optional enhancement in sub-packet 029 or 030.

6. **Does the advisor brief append work for external CLI skills (cli-claude-code, cli-codex, cli-gemini, cli-opencode)?** The FIRST_ACTION_HINT map covers all 16 skills, including CLI orchestrators. But "MUST invoke cli-claude-code FIRST" may be confusing when the user's intent is code-writing, not external dispatch. The confidence threshold (≥0.8) mitigates this — external CLI skills should only fire when the prompt genuinely matches their domain (e.g., "run Claude Code on this PR").

---


## References

### External (read-only)
- `external/README.md` (283 lines) — full XCE public surface
- `external/LICENSE` (MIT)
- `external/steering/CLAUDE.md`, `kiro.md`, `opencode-prompt.txt`, `.clinerules`, `.cursorrules`, `.windsurfrules` (6 steering files)
- `external/configs/*.json` (5 MCP config files)
- `external/assets/xce-hero.png`, `xce-benchmarks.png`, `xce-integrations.png` (visual only)

### Local MCP Server (code_graph)
- `code_graph/lib/code-graph-context.ts` (642 lines) — ContextResult schema, buildContext, formatTextBrief, impact/neighborhood/outline queryModes
- `code_graph/lib/code-graph-db.ts` (~1,250 lines) — SQLite schema, queryEdgesFrom/To, isFileStale, resolveSubjectFilePath, queryFileDegrees, queryFileImportDependents, getTokenUsageRatio
- `code_graph/lib/indexer-types.ts` (198 lines) — SymbolKind, EdgeType, DEFAULT_EDGE_WEIGHTS, CodeNode, CodeEdge, EdgeEvidenceClass, generateContentHash
- `code_graph/lib/structural-indexer.ts` — recursive walk(), capturesToNodes(), skipFreshFiles, incremental indexing
- `code_graph/lib/tree-sitter-parser.ts` (1-60 lines) — cursor-based AST walk via web-tree-sitter WASM
- `code_graph/lib/budget-allocator.ts` (134 lines) — allocateBudget(), DEFAULT_FLOORS, ALLOCATION_RESULT
- `code_graph/lib/cross-file-edge-resolver.ts` (123 lines) — cross-file CALLS edge reconciliation
- `code_graph/lib/compact-merger.ts` — estimateTokens(), truncateToTokens()
- `code_graph/lib/diff-parser.ts` (317 lines) — custom unified-diff parser, rangesOverlap()
- `code_graph/handlers/context.ts` (416 lines) — MCP handler: readiness gate, seed normalization, queryMode dispatch, budgetTokens
- `code_graph/handlers/detect-changes.ts` (369 lines) — MCP handler: diff → symbol overlap → affectedSymbols[]
- `code_graph/tools/code-graph-tools.ts` (101 lines) — MCP tool registration registry

### Local MCP Server (skill_advisor)
- `skill_advisor/lib/render.ts` (174 lines) — renderAdvisorBrief(), capText, DEFAULT_TOKEN_CAP, confidence threshold gate, FIRST_ACTION_HINT proposal target
- `skill_advisor/lib/skill-advisor-brief.ts` — renderSharedBrief() integration, prompt-boundary gate
- `skill_advisor/lib/prompt-cache.ts` (192 lines) — exact-match brief cache, token cap normalization, hit/miss counter
- `skill_advisor/lib/scorer/` — scorer surface (reference only, out of scope)

### Local MCP Server (shared)
- `lib/analytics/session-analytics-db.ts:90-141` — analytics_sessions schema (prompt_tokens, completion_tokens, total_tokens), per-turn breakdown
- `hooks/response-hints.ts:40-65` — extractSurfacedTokenCount() from LLM API usage envelope
- `hooks/claude/session-stop.ts:384-385` — final token usage persistence
- `lib/eval/eval-metrics.ts` — 12 pure-computation eval metrics
- `lib/eval/ground-truth-generator.ts` — ground truth generation
- `lib/eval/ablation-framework.ts` — controlled channel ablation
- `mcp_server/tests/eval-metrics.vitest.ts` (625 lines) — 12-metric test suite
- `scripts/observability/smart-router-measurement.ts` (841 lines) — static measurement harness

### Spec folder
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md` (331 lines)
- `research/iterations/iteration-001.md` through `iteration-009.md`
- `research/deep-research-state.jsonl`
- `research/deep-research-config.json`

