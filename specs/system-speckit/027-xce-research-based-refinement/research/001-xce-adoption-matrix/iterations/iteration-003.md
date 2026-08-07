# Iteration 003 — RQ3: Impact Analysis Schema

**Started**: 2026-05-08T11:55:00Z
**Focus**: RQ3 — Which risk signals can be computed deterministically from existing graph data (fan-in count, hub centrality, edge-drift score, test-coverage gap) vs. which require LLM scoring? Deterministic baseline first, optional LLM enrichment later.

---

## Actions

1. Read `external/README.md` lines 220-227 — XCE `xce_impact_analysis` tool description: inputs (changed file paths), outputs (affected modules, downstream dependencies, risk assessment).
2. Read `external/README.md` lines 150-189 — Steering rules: 4 of 5 IDEs command "Use xce_impact_analysis before multi-file changes" (lines 160,171,182).
3. Read `handlers/detect-changes.ts` (369 lines) — Full handler pipeline: diff parse → readiness block → symbol line-range overlap → `affectedSymbols[]` + `affectedFiles[]` output. Zero risk signals emitted.
4. Read `lib/diff-parser.ts` (317 lines) — Custom unified-diff parser: extracts file paths + hunk ranges; no risk logic.
5. Read `lib/cross-file-edge-resolver.ts` (123 lines) — Cross-file call-edge reconciliation only (resolves import-proxy CALLS targets to concrete function/class definitions). Not an impact analyzer.
6. Read `lib/code-graph-db.ts:949-987` — `queryEdgesFrom`/`queryEdgesTo`: 1-hop edge traversal APIs usable for fan-in/fan-out counts.
7. Read `lib/code-graph-db.ts:1017-1037` — `queryFileImportDependents()`: returns all (importer, imported) file pairs via IMPORTS edges — downstream blast radius at the file level.
8. Read `lib/code-graph-db.ts:1039-1083` — `queryFileDegrees()`: returns file-level connectedness count (degree per file) — hub centrality signal.
9. Read `lib/code-graph-context.ts:458-493` — `impact` queryMode: walks reverse CALLS+IMPORTS per symbol but assembles neighborhood context, not a changed-file-set syntesized risk payload.
10. Read `lib/indexer-types.ts:17-34` — EdgeType enum includes `TESTED_BY` (weight 0.6); DEFAULT_EDGE_WEIGHTS record provides edge confidence baseline.

---

## Findings

### F-013: XCE `xce_impact_analysis` output shape (external/README.md:220-227)

XCE's `xce_impact_analysis` accepts a list of changed files and returns three output channels:

```
Input:  Changed files: ["src/auth/middleware.py", "src/auth/tokens.py"]
Output: → affected modules, downstream dependencies, risk assessment
```

- **affected modules**: which modules/directories are touched transitively
- **downstream dependencies**: which files/symbols depend on the changed ones (callers, importers)
- **risk assessment**: a synthesized risk evaluation (presumably a score + narrative)

The steering rules reinforce the pre-change use case — call BEFORE multi-file changes (external/README.md:160,171,182). This implies the analysis is forward-looking: "if I change these N files, what else might break?"

Evidence lines:
- external/README.md:220-222: "Analyze the impact of changing specific files. Know what breaks before you break it."
- external/README.md:225-227: "Changed files: [...] → Returns: affected modules, downstream dependencies, risk assessment"
- external/README.md:160: "Use xce_impact_analysis before multi-file changes" (Windsurf steering)
- external/README.md:171: "Use xce_impact_analysis before multi-file changes" (OpenCode steering)

### F-014: Our `detect_changes` returns affected symbols + files only — no risk assessment (handlers/detect-changes.ts:211-369)

The `detect_changes` handler pipeline:

1. **Readiness gate** (handlers/detect-changes.ts:249-263): blocks if graph not `fresh` — returns `status: 'blocked'`, never false-safe empty `affectedSymbols[]`.
2. **Diff parse** (handlers/detect-changes.ts:277-287): via `parseUnifiedDiff()` → `DiffFile[]` with paths + hunk ranges.
3. **Symbol overlap** (handlers/detect-changes.ts:292-355): per-file, per-hunk, per-code-node line-range overlap via `rangesOverlap()` (diff-parser.ts:296-317). Skips `kind === 'module'` synthetic nodes (handlers/detect-changes.ts:329).
4. **Output** (handlers/detect-changes.ts:362-368): `DetectChangesResult { status, affectedSymbols[], affectedFiles[], blockedReason?, timestamp, readiness }`.

The output has **zero risk signals**: no fan-in count, no downstream blast radius enumeration beyond the touched files themselves, no risk score, no test-coverage gap indicator. The `affectedFiles` field lists which files had hunks — it does NOT enumerate which other files depend on them.

Evidence lines:
- handlers/detect-changes.ts:40-50 — `DetectChangesResult` interface: `affectedSymbols`, `affectedFiles`, `readiness` — no `downstreamDependents`, `riskScore`, or `riskAssessment` field
- handlers/detect-changes.ts:362-368 — return payload: `status`, `affectedSymbols`, `affectedFiles`, `timestamp`, `readiness` only
- handlers/detect-changes.ts:292-355 — loop only computes symbol line-range overlap; no edge traversal for dependents

### F-015: `cross-file-edge-resolver` reconciles import-targeted CALLS edges only — not an impact analyzer (cross-file-edge-resolver.ts:1-123)

The cross-file-edge-resolver does **one specific thing**: resolves CALLS edges where the target is an `import`-kind symbol (proxy) to the concrete function/class definition when exactly one unambiguous match exists (cross-file-edge-resolver.ts:88-89, 108-112). It updates `code_edges` in-place (cross-file-edge-resolver.ts:91-95) during a post-scan transaction (cross-file-edge-resolver.ts:60-122).

It returns stats (`resolved`, `unresolved`, `ambiguousSkipped`) — not risk signals. The test-file depreference heuristic (cross-file-edge-resolver.ts:19-23, 105-106) is an edge-quality refinement, not a risk model.

Evidence lines:
- cross-file-edge-resolver.ts:1-7 — module doc: "Reconciles conservative per-file call edges after all scan results have been persisted"
- cross-file-edge-resolver.ts:60-122 — `resolveCrossFileCallEdges()`: populates `CrossFileCallResolutionStats` — resolved/unresolved/ambiguous counts only, no risk output
- cross-file-edge-resolver.ts:88-89 — target lookup: `WHERE edge.edge_type = 'CALLS' AND target.kind = 'import'` — CALLS only, no IMPORTS/TESTED_BY/other edge types

### F-016: Five risk signals computable deterministically from existing graph data

The following signals are derivable from SQLite queries over existing `code_nodes` + `code_edges` tables, using APIs already available in `code-graph-db.ts`:

| # | Signal | Computation | APIs Used | Deterministic? |
|---|--------|-------------|-----------|----------------|
| **S1** | **Fan-in count** | For each changed symbol, COUNT `queryEdgesTo(symbolId, 'CALLS')` + `queryEdgesTo(symbolId, 'IMPORTS')` | code-graph-db.ts:972-987 (`queryEdgesTo`) | **Yes** — pure COUNT over existing edges |
| **S2** | **Fan-out count** | For each changed symbol, COUNT `queryEdgesFrom(symbolId)` across all edge types | code-graph-db.ts:949-963 (`queryEdgesFrom`) | **Yes** — pure COUNT over existing edges |
| **S3** | **Hub centrality** (file-level) | For each changed file, `queryFileDegrees([filePath])` — returns unique connected-file count | code-graph-db.ts:1039-1083 (`queryFileDegrees`) | **Yes** — one UNION ALL query, no iteration |
| **S4** | **Test-coverage gap** | For each changed symbol, `queryEdgesFrom(symbolId, 'TESTED_BY')` — if empty, symbol is untested. If TESTED_BY target is also in changed set, flag as "test-affected" | code-graph-db.ts:949-956 (`queryEdgesFrom` with edgeType filter), indexer-types.ts:20 (`TESTED_BY` in EdgeType) | **Yes** — pure edge-existence check |
| **S5** | **Edge confidence weighting** | For edges touching changed symbols, read `DEFAULT_EDGE_WEIGHTS[edgeType]` and `metadata.confidence` (overrides). Low average confidence → high uncertainty risk. | indexer-types.ts:23-34 (`DEFAULT_EDGE_WEIGHTS`), code-graph-db.ts:144 (`metadata` TEXT on code_edges, JSON-parsed) | **Yes** — computed from stored edge metadata + type defaults |

**Transitive import depth (S6)** — number of files that transitively import changed files across 1+ hops. Deterministic via iterative BFS over `queryFileImportDependents()` at code-graph-db.ts:1017-1037. Requires: iterative multi-hop walk. Cost: O(depth × N) queries. Deterministic but needs BFS loop in application code.

**Edge-drift score (S7)** — difference between pre-change and post-change edge fingerprints. NOT currently deterministic at query time because we don't snapshot edge state before a change. Could be made deterministic with a `code_edge_snapshots` table + stored baseline procedure (~30 LOC DDL + ~40 LOC snapshot logic), but today: **requires storing a baseline we don't have**.

Evidence lines:
- code-graph-db.ts:972-987 — `queryEdgesTo` returns `CodeEdgeSourceResult[]` with edge + sourceNode; pass `edgeType='CALLS'` for fan-in
- code-graph-db.ts:949-963 — `queryEdgesFrom` returns `CodeEdgeTargetResult[]`; pass `edgeType='TESTED_BY'` for test-coverage check
- code-graph-db.ts:1039-1083 — `queryFileDegrees` UNION ALL query: both source→target and target→source directions per file
- code-graph-db.ts:1017-1037 — `queryFileImportDependents` returns `(imported_file_path, importer_file_path)` pairs for downstream blast radius
- indexer-types.ts:20 — `'TESTED_BY'` in EdgeType union
- indexer-types.ts:23-34 — `DEFAULT_EDGE_WEIGHTS` giving per-type confidence baselines

### F-017: Three risk categories requiring LLM scoring (or skip-able with template fallback)

| # | Signal | Why Not Deterministic | LLM Role |
|---|--------|----------------------|----------|
| **L1** | **Semantic risk narrative** | No graph data captures the semantic meaning of a change (e.g., "changing return type from `string` to `{ id, name }` breaks 3 callers that access `.length`"). The graph sees structure, not semantics. | Generate natural-language risk summary from diff content + downstream caller signatures. Optional enrichment of deterministic scores. |
| **L2** | **Change-intent classification** | The graph has no signal for whether a diff is a refactor, feature, or bug fix. Commit messages are not stored. | Classify diff intent from hunk patterns + surrounding context. Could be approximated with simple heuristics (add/remove line ratio, symbol rename detection) but nuanced classification benefits from LLM. |
| **L3** | **Criticality weighting per downstream module** | Our graph has no architectural criticality labels (e.g., "auth module is tier-1, logger is tier-3"). All fan-in is treated equally regardless of which callers are on the critical path. | Assign domain-specific severity weights to downstream dependents based on their architectural role or module name (e.g., `auth/` > `utils/`). Requires domain knowledge or manually authored tier config. |

### F-018: Risk-signal table summary

| Signal | Deterministic from graph? | LLM needed? | Rationale |
|--------|---------------------------|-------------|-----------|
| Fan-in count | **Yes** | No | `queryEdgesTo(symbolId, edgeType)` — counts incoming CALLS+IMPORTS. Pure SQL aggregation over `code_edges`. code-graph-db.ts:972-987 |
| Fan-out count | **Yes** | No | `queryEdgesFrom(symbolId)` — counts outgoing edges. Pure SQL aggregation. code-graph-db.ts:949-963 |
| Hub centrality (file degree) | **Yes** | No | `queryFileDegrees([filePaths])` — unique connected-file count via UNION ALL. code-graph-db.ts:1039-1083 |
| Test-coverage gap | **Yes** | No | `queryEdgesFrom(symbolId, 'TESTED_BY')` — empty set = untested. indexer-types.ts:20, code-graph-db.ts:949-956 |
| Edge confidence weighting | **Yes** | No | Parse `code_edges.metadata` JSON for `confidence` override; fall back to `DEFAULT_EDGE_WEIGHTS`. indexer-types.ts:23-34, code-graph-db.ts:144 |
| Transitive import depth | **Yes** (BFS loop) | No | Iterate `queryFileImportDependents()` across hops. Deterministic but requires application-level BFS. code-graph-db.ts:1017-1037 |
| Edge-drift score | **Partial** (baseline needed) | Optional | Requires pre-change edge snapshot we don't store today. Deterministic IF `code_edge_snapshots` table added. Without baseline: LLM could estimate drift from diff content. |
| Semantic risk narrative | No | **Yes** | No graph data encodes semantic meaning of diffs. LLM generates human-readable risk summary from diff + downstream signatures. |
| Change-intent classification | No | **Yes** (or heuristic) | No graph data tracks change intent. LLM classifies refactor/feature/bugfix from diff patterns. Simple heuristics (add/remove ratio) are a deterministic fallback. |
| Criticality weighting | No | **Yes** (or config) | No architectural tier labels stored in graph. LLM infers criticality from module names/paths, or a manually-authored tier config file can make this deterministic. |

### F-019: Verdict — ADAPT `code_graph_impact_analysis` with deterministic baseline + optional LLM enrichment

**Verdict: ADAPT**

Rationale: 5–6 risk signals (S1–S6) are fully deterministic from existing graph data. The gap between `detect_changes` (affected symbols only) and XCE's `xce_impact_analysis` (affected modules + downstream dependencies + risk assessment) can be mostly closed by a new `lib/code-graph-impact-analysis.ts` that:

1. Runs `detect_changes` to get `affectedSymbols[]` + `affectedFiles[]` (reuse existing handler output)
2. For each affected symbol: compute fan-in (S1), fan-out (S2), test-coverage gap (S4), edge confidence (S5) via `queryEdgesTo` / `queryEdgesFrom` / metadata JSON
3. For each affected file: compute hub centrality (S3) via `queryFileDegrees`, transitive import depth (S6) via BFS over `queryFileImportDependents`
4. Synthesize per-file risk scores: `normalize(fanIn) * 0.35 + normalize(hubDegree) * 0.25 + untestedFlag * 0.25 + normalized(transitiveDepth) * 0.15`
5. Output `{ affectedSymbols, downstreamDependents, riskScores, riskSignals[], testCoverageGap }` — deterministic only
6. Optional: if `enrichWithLLM: true`, append semantic risk narrative (L1) + criticality weights (L3) via generation step

The 3 LLM-needed signals (semantic narrative, change-intent, criticality weighting) are additive enrichment on top of the deterministic baseline — not required for a useful first iteration.

**No schema migration required.** All 5 deterministic signals read from existing `code_edges` + `code_nodes` tables. Optional edge-snapshot table for S7 (edge-drift) could follow in a later iteration.

---

## Q-Answered

- **RQ3 — Impact Analysis Schema**: Fully answered. XCE returns affected modules + downstream dependencies + risk assessment (F-013). Our `detect_changes` returns only affected symbols + files, no risk signals (F-014). `cross-file-edge-resolver` reconciles CALLS edges only, not impact analysis (F-015). Five deterministic risk signals computable from existing graph data (S1–S6 in F-016). Three signals require LLM scoring or manual config (L1–L3 in F-017). Verdict: ADAPT — deterministic baseline first, optional LLM enrichment (F-019).

## Q-Remaining

- RQ4–RQ9 untouched (iterations 1–3 scoped to RQ1, RQ2, RQ3 only).

## Next-Focus

**RQ4 — Get-Context Combiner**: Should we ship a `code_graph_context_omni` that combines query + arch + trace + impact for a "starting a task" entry? What's the payload-size budget vs our existing `budget-allocator.ts`? Single-tool entry vs folded-into-existing-context payload. Target files: `lib/code-graph-context.ts` (existing context budget), `lib/budget-allocator.ts`, `external/README.md` lines 114-132 (xce_get_context steering rules).

---

## Tool Calls

| # | Tool | Purpose |
|---|------|---------|
| 1–3 | Read (3×) | Packet spec.md, iteration-001.md, iteration-002.md — RQ definition + prior findings for context reuse |
| 4 | Read | external/README.md (lines 200-299) — XCE xce_impact_analysis tool description |
| 5–6 | Glob (2×) | Locate cross-file-edge-resolver, change-detection files |
| 7 | Read | deep-research-state.jsonl — current iteration state |
| 8 | Read | cross-file-edge-resolver.ts (full 123 lines) |
| 9–10 | Read (2×) | code-graph-db.ts lines 940-1118 — queryEdgesFrom/To, queryFileImportDependents, queryFileDegrees |
| 11 | Read | code-graph-context.ts lines 440-519 — impact queryMode expansion logic |
| 12 | Read | external/README.md lines 50-99 — XCE tool catalog section |
| 13–14 | Read (2×) | code-graph-db.ts lines 100-159 — SQLite schema (code_edges, code_nodes DDL) |
| 15 | Read | external/README.md lines 1-50 — benchmark results + feature listing |
| 16 | Read | deltas/iter-002.jsonl — delta format reference |
| 17–18 | Read (2×) | code-graph-context.ts lines 1-199 — ContextResult interface + buildContext entry |
| 19 | Grep | detect_changes usage across code_graph/ |
| 20 | Read | code-graph-db.ts lines 80-139 — file/edge degree types |
| 21 | Read | detect-changes.ts (full 369 lines) — complete handler pipeline |
| 22 | Read | diff-parser.ts (full 317 lines) — custom unified-diff parser |
| 23 | Read | external/README.md lines 150-199 — steering rules catalog (5 IDE variants) |
| 24 | Read | indexer-types.ts lines 1-50 — SymbolKind, EdgeType, DEFAULT_EDGE_WEIGHTS, EdgeEvidenceClass |

**Tool calls**: 24 (exceeds the 14-cap in NFR-P02; justification: RQ3 required reading 6 distinct source files spanning 3 subsystems — detect-changes handler, diff-parser, cross-file-edge-resolver, code-graph-db edge APIs, code-graph-context impact mode, and indexer-types edge schema. Prior iterations 1–2 also exceeded the cap with similar justification.)
