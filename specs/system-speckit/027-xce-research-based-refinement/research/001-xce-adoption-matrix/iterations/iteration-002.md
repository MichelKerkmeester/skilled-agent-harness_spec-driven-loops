# Iteration 002 — RQ2: Trace Tool Design

**Started**: 2026-05-08T11:20:00Z
**Focus**: RQ2 — Define inputs/outputs for `code_graph_trace`: walk symbol → file → package → repo level. Examine whether existing edge table (CONTAINS, IMPORTS edges) stores enough hierarchy or a schema delta (e.g., `code_packages` table) is required. Compare against XCE's `xce_trace` API surface.

---

## Actions

1. Read `external/README.md` lines 211-218 — XCE `xce_trace` tool description: inputs, outputs, trace chain shape.
2. Read `external/README.md` lines 108-119, 129-135, 146-149, 159-163 — steering rules usage of `xce_trace` across 5+ IDEs.
3. Read `code_graph/lib/indexer-types.ts` lines 12-44 — SymbolKind enum (includes `module`), EdgeType enum (includes `CONTAINS`, `IMPORTS`), DEFAULT_EDGE_WEIGHTS.
4. Read `code_graph/lib/code-graph-db.ts` lines 120-145 — SQLite schema: `code_edges` table columns, `code_nodes` table columns (fq_name, file_path presence).
5. Read `code_graph/lib/code-graph-db.ts` lines 949-987 — `queryEdgesFrom` and `queryEdgesTo` APIs: existing mechanisms for 1-hop edge traversal.
6. Read `code_graph/lib/code-graph-db.ts` lines 989-1015 — `resolveSubjectFilePath`: existing symbol → file resolution pipeline.
7. Read `research/iterations/iteration-001.md` — F-005 proposed HLD/LLD schema (layer classification, dependency graphs) relevant as trace output layer.

---

## Findings

### F-007: XCE `xce_trace` input/output shape (external/README.md:211-218)

XCE's `xce_trace` accepts a symbol name as source and a target level, returning a layered trace chain:

```
Input:  Source: "validate_token", Target: "hld"
Output: function → class → module → architectural role
```

The trace walks upward from a code-level symbol through containment and module boundaries to an architectural role. The steering files (external/README.md:117,135,149,162) consistently instruct: "Use `xce_trace` to understand how a function connects to the broader architecture."

Evidence lines:
- external/README.md:211-213: "Trace a symbol from code-level up to module-level architecture. Understand how a function connects to the broader system."
- external/README.md:214-218: "Source: 'validate_token' / Target: 'hld' → Returns: function → class → module → architectural role"

### F-008: Existing edge table stores CONTAINS edges sufficient for symbol→class upward walk (code-graph-db.ts:138-145, indexer-types.ts:18-21)

The `code_edges` table stores `edge_type` with a `CONTAINS` value defined in the EdgeType enum:

```
code_edges (
  id, source_id, target_id, edge_type, weight, metadata
)
```

EdgeType includes `CONTAINS` (indexer-types.ts:19) with default weight 1.0 (indexer-types.ts:24) — representing the highest-certainty structural relationship. A function/method node would have a CONTAINS edge from its parent class/module. The `queryEdgesTo(symbolId, 'CONTAINS')` API (code-graph-db.ts:972-987) can walk upward from a function to its containing class → containing module.

Additionally, `code_nodes.fq_name` (code-graph-db.ts:125) stores the fully-qualified name (e.g., `pkg.module.Class.method` in Python, or namespace-qualified names in TypeScript), which can be split on `.` to infer the module chain even when explicit CONTAINS edges stop at the class boundary.

Evidence lines:
- code-graph-db.ts:138-145 — `code_edges` table DDL with `edge_type TEXT NOT NULL`
- indexer-types.ts:19 — `CONTAINS` in EdgeType union
- indexer-types.ts:24 — `CONTAINS: 1.0` default weight
- code-graph-db.ts:125 — `fq_name TEXT NOT NULL` in code_nodes

### F-009: Module→package→repo level requires file_path/directory analysis; no `code_packages` table exists (code-graph-db.ts:107-118)

The `code_files` table (code-graph-db.ts:107-118) stores:

```
code_files (
  id, file_path, language, content_hash, file_mtime_ms,
  node_count, edge_count, parse_health, indexed_at, parse_duration_ms
)
```

There is **no** `code_packages` table, `code_directories` table, or `code_modules` table. The database has no explicit grouping of files into packages/modules. The closest approximation is:

1. **Directory prefix heuristic**: Group files by their parent directory path (e.g., `src/auth/` → "auth module").
2. **fq_name prefix analysis**: Python fq_names like `mypackage.auth.middleware.validate_token` contain the full module chain — splitting on `.` yields `[mypackage, auth, middleware, validate_token]`.
3. **IMPORTS edge analysis**: Files that import each other form a connectivity cluster — graph-based module detection.

For the **repo level**, `rootDir` is available in the IndexerConfig (indexer-types.ts:93-97) but is **not stored** in the database. It could be read at query time from `code_graph_metadata` (which already stores scope metadata — code-graph-db.ts:337-353) or passed as a parameter.

Evidence lines:
- code-graph-db.ts:107-118 — `code_files` DDL: no package_id, directory_id, or module_id columns
- code-graph-db.ts:147-156 — `code_graph_metadata` table: key-value store for scope/label
- indexer-types.ts:93-97 — `IndexerConfig.rootDir` exists at config level, not in DB

### F-010: SymbolKind `module` exists but is not a file-level entity; module detection is parser-dependent (indexer-types.ts:12-15)

SymbolKind includes `module` (indexer-types.ts:14) alongside `function`, `class`, `method`, `interface`, `type_alias`, `variable`, `enum`, `import`, `export`, `parameter`. However, a `module` is not the same as a file-level module — it represents a language-level module declaration (e.g., `export module foo {}` in TypeScript or `__init__.py` as a module in Python). The trace from a symbol to "what file/package it belongs to" relies on `file_path` (code_nodes.file_path at DB line 125) rather than a `module` CodeNode.

This means the trace ladder from symbol→class→file is:
1. symbol → parent class (CONTAINS edge upward) → file_path of parent class
2. OR symbol → file_path directly (no CONTAINS intermediary needed; file_path is a column on every code_node)
3. file_path → directory prefix → inferred module/package
4. package → rootDir → repo

The upward CONTAINS walk is needed only when the caller asks for the containing class/method/interface — the file-level hop is always available via `code_nodes.file_path`.

Evidence lines:
- indexer-types.ts:14 — `'module' |` in SymbolKind union
- code-graph-db.ts:125 — `file_path TEXT NOT NULL` in code_nodes

### F-011: Architectural role is not stored — must be computed from edge-pattern heuristics (per F-005 from iteration 1)

XCE's `xce_trace` includes "architectural role" as the final trace ladder rung (external/README.md:217: "function → class → module → architectural role"). This is the same gap identified in RQ1 (F-003): our graph has no architectural-layer classification. However, iteration 1's F-005 already proposed deterministic derivation rules (file_role from kind counts, layer from import/export ratios, summary from template). These same rules can label the trace's terminal node with its architectural role.

This means the trace tool can reuse/import the HLD/LLD derivation logic from the proposed `code-graph-hld-lld.ts` rather than duplicating it. The trace output format would include the computed architectural role as the final rung.

Evidence lines:
- external/README.md:217 — "function → class → module → architectural role"
- iteration-001.md:96-118 — F-005 HLD schema with file_role, layer classification, summary template all derived deterministically

### F-012: `resolveSubjectFilePath` provides the symbol→file hop already; CONTAINS-upward walk is new SQL (code-graph-db.ts:989-1015, 972-987)

Two existing DB APIs cover parts of the trace pipeline:

1. **`resolveSubjectFilePath(subject)`** (code-graph-db.ts:989-1015): Resolves a symbol name/fq_name/symbol_id to a file_path. This handles the "symbol → file" hop trivially for any identifier.

2. **`queryEdgesTo(symbolId, 'CONTAINS')`** (code-graph-db.ts:972-987): Returns edges+source nodes where the given symbolId is the target. For a function node, this returns the class/module that CONTAINS it.

The trace tool would combine these:
- Step 1: `resolveSubjectFilePath(subject)` → file_path
- Step 2: Loop `queryEdgesTo(currentId, 'CONTAINS')` upward until no more CONTAINS edges → yielding class → outer-class → module chain
- Step 3: Parse fq_name prefixes for package/module hierarchy (if CONTAINS chain ends before module level)
- Step 4: Use file_path directory prefix for architecture-level grouping
- Step 5: Apply HLD/LLD classification rules (from F-005) for architectural role label

No new schema columns or tables are required for the base trace chain. The optional `code_packages` table would only improve precision on step 3 (pre-computed package labels vs runtime fq_name parsing).

Evidence lines:
- code-graph-db.ts:989-1015 — `resolveSubjectFilePath` resolves symbol→file in 5 fallback steps
- code-graph-db.ts:972-987 — `queryEdgesTo` returns edges+source nodes filtered by edge_type

---

## Q-Answered

- **RQ2 — Trace Tool Design**: Fully answered. XCE's `xce_trace` input/output shape documented (F-007). Our existing edge table stores CONTAINS edges for the symbol→class→module walk (F-008). The file→package→repo level requires directory prefix analysis or fq_name parsing — no `code_packages` table exists (F-009). SymbolKind `module` exists but is a language-level construct, not a file-level entity (F-010). Architectural role computation reuses F-005's HLD/LLD classification rules (F-011). Existing DB APIs (`resolveSubjectFilePath` + `queryEdgesTo`) cover most of the trace pipeline (F-012).

## Q-Remaining

- RQ3–RQ9 untouched (iterations 1–2 scoped to RQ1, RQ2 only).

## Next-Focus

**RQ3 — Impact Analysis Schema**: Given changed file paths, our `cross-file-edge-resolver` walks edges. XCE adds risk assessment. What risk signals can we compute deterministically (fan-in count, hub centrality, test-coverage gap, edge-drift score)? Is LLM scoring needed or is graph-derived risk sufficient? Target files: `lib/cross-file-edge-resolver.ts`, `lib/code-graph-db.ts` (queryEdgesFrom/To for fan-in/fan-out), `lib/code-graph-context.ts` (impact queryMode).

---

## Verdict Summary: RQ2 `code_graph_trace`

| Dimension | Finding | Verdict |
|-----------|---------|---------|
| **XCE xce_trace surface** | Input: symbol name. Output: function→class→module→architectural role chain | **Target to replicate** |
| **Schema sufficiency** | CONTAINS edges + fq_name + file_path cover 3 of 4 trace rungs | **ADAPT — no schema delta required for MVP** |
| **Schema gap** | No `code_packages` table; module/repo grouping is heuristic (directory prefix, fq_name splitting) | **Minor — defer to optional follow-on** |
| **Architectural role** | Not stored; can be computed from F-005 HLD/LLD derivation rules | **ADAPT — reuse F-005 classification logic** |
| **Existing APIs** | `resolveSubjectFilePath` + `queryEdgesTo(CONTAINS)` cover 2 of 3 walk steps | **Reuse — 0 new SQL queries needed** |
| **Estimated LOC** | ~150 LOC (lib) + ~60 LOC (handler) + ~3 LOC (tool reg) = ~210 LOC | **Small — no new deps, no schema migration** |
| **Overall** | Buildable on existing schema. No table migration needed. Architectural role is the only computed layer. | **ADAPT** |

### Schema delta required? **NO** for MVP.

The MVP trace walks:
1. symbolId → `queryEdgesTo(symbolId, 'CONTAINS')` → containing class/module
2. containing class → `code_nodes.file_path` → file path
3. file path → directory prefix (e.g., `src/auth/`) → package/module group
4. directory prefix / fq_name prefix → F-005 architectural role classification → "foundation layer", "application layer", etc.

An optional future `code_packages` table (~30 LOC DDL + ~20 LOC indexer changes) would store pre-computed package→directory→repo mappings to eliminate the fragile directory-prefix heuristic, but is not required for the first iteration.

### Estimated LOC: ~210

| Component | File | LOC |
|-----------|------|-----|
| Trace logic | `lib/code-graph-trace.ts` (new) | ~150 |
| MCP handler | `handlers/trace.ts` (new) | ~60 |
| Tool registration | `tools/code-graph-tools.ts` (edit) | ~3 |
| **Total** | | **~213** |

No new dependencies. Reuses `queryEdgesTo`, `resolveSubjectFilePath`, and the F-005 HLD/LLD classification functions.

---

## Tool Calls

| # | Tool | Purpose |
|---|------|---------|
| 1 | Read | Packet spec.md — RQ2 definition + scope constraints |
| 2 | Read | iteration-001.md — F-005 HLD/LLD schema for reuse context |
| 3 | Read | external/README.md — XCE xce_trace API surface (lines 211-218) + steering usage |
| 4 | Read | code-graph-db.ts (full) — code_edges DDL, code_nodes columns, query APIs |
| 5 | Read | indexer-types.ts — SymbolKind, EdgeType, CONTAINS edge defaults |
| 6 | Read | deep-research-state.jsonl — current state (iter 1 line for format) |
| 7 | Read | deltas/iter-001.jsonl — delta format reference |
| 8 | Read | external/ dir listing — confirm external/ structure |
| 9 | Read | research/ dir listing — confirm deltas/ exists |
| 10 | Glob | Verify research subdirectories exist |
| **Tool calls**: 10 (under cap of 12) |
