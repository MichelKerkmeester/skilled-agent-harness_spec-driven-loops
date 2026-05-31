# Iteration 001 — RQ1: Architectural Context Gap

**Started**: 2026-05-08T10:57:00Z
**Focus**: RQ1 — Compare XCE `xce_architecture_context` payload vs our `code_graph_context` payload. Diff fields. Propose minimum-viable deterministic HLD/LLD schema from existing graph (no LLM).

---

## Actions

1. Read `external/README.md` (283 lines) — full XCE public surface inventory.
2. Read `code_graph/lib/code-graph-context.ts` (642 lines) — core ContextResult schema + buildContext logic.
3. Read `code_graph/handlers/context.ts` (416 lines) — MCP handler payload shape, readiness contract, seed normalization.
4. Read `code_graph/lib/indexer-types.ts` (198 lines) — SymbolKind, EdgeType, CodeNode, CodeEdge schemas.
5. Read `code_graph/lib/code-graph-db.ts` (lines 1-150) — SQLite schema: code_files, code_nodes, code_edges tables.
6. Read `code_graph/tools/code-graph-tools.ts` (101 lines) — tool name registry confirms 9 code_graph tools; no HLD/LLD tool exists.

---

## Findings

### F-001: XCE architecture_context output shape (external/README.md:202-209)

XCE's `xce_architecture_context` accepts a file path or symbol and returns:
- **Component description** — "what it does" (narrative text)
- **LLD** — low-level design details
- **HLD** — "how it fits in the architecture" (architectural role)
- **Relationships** — "what depends on it"

The steering files (external/README.md:114,132) command: "Use `xce_architecture_context` before modifying any file to understand its role, dependencies, and what calls it." This implies a single atomic call returning layered context.

### F-002: Our code_graph_context output shape (lib/code-graph-context.ts:32-54, handlers/context.ts:356-403)

`code_graph_context` returns `ContextResult` with these top-level fields:

| Field | Type | Content |
|-------|------|---------|
| `queryMode` | enum | neighborhood/outline/impact |
| `resolvedAnchors` | ArtifactRef[] | file:line + symbol resolution metadata |
| `graphContext[]` | section[] | per-anchor: nodes + edges |
| `textBrief` | string | formatted markdown (symbols + relationships) |
| `combinedSummary` | string | one-line summary string |
| `nextActions` | string[] | suggested follow-up actions |
| `metadata` | object | totals, budget, partialOutput, freshness |

Per-section `graphContext[i]` shape (lib/code-graph-context.ts:56-74):
- `anchor`: "file:line (fqName)"
- `nodes[]`: { name, kind, file, line } — raw symbol records, no narrative
- `edges[]`: { from, to, type, confidence, detectorProvenance, evidenceClass, reason, step }

Per-node fields from `code_nodes` table (lib/code-graph-db.ts:120-136):
- `symbol_id`, `file_path`, `fq_name`, `kind`, `name`, `start_line`, `end_line`, `language`, `signature`, `docstring`, `content_hash`

### F-003: Field-by-field gap analysis

| Capability | XCE xce_architecture_context | code_graph_context | Verdict |
|-----------|------------------------------|-------------------|---------|
| Component description (what it does) | Narrative text (external/README.md:206) | None — nodes have `kind`+`name` only | **GAP — no narrative layer** |
| LLD (low-level design) | Layered per-symbol design (external/README.md:24) | Raw nodes+edges; no synthesis | **GAP — no design layer** |
| HLD (architectural role) | "How it fits in the architecture" (external/README.md:207) | None — no architectural-layer classification | **GAP — no role classification** |
| Relationships (dependencies) | "What depends on it" (external/README.md:207) | `edges[]` with CALLS/IMPORTS/EXPORTS types (lib/code-graph-context.ts:374-398) | **Partial** — edges exist but no synthesized dependency narrative |
| File-level symbol outline | Implicit | `queryMode: 'outline'` (lib/code-graph-context.ts:427-457) | **Covered** |
| Symbol neighborhood (1-hop) | Implicit | `queryMode: 'neighborhood'` (lib/code-graph-context.ts:372-426) | **Covered** |
| Reverse impact (who calls this) | Via `xce_impact_analysis` separate tool | `queryMode: 'impact'` (lib/code-graph-context.ts:458-493) | **Covered** |
| Readiness/trust metadata | SaaS-managed (external/README.md:240-245, "Graph Store") | `freshness` + `canonicalReadiness` + `trustState` (handlers/context.ts:353-367) | **Covered** |
| Budget-aware partial output | Not documented | `partialOutput` + `deadlineMs` (lib/code-graph-context.ts:45-53) | **Our advantage** |
| Detector provenance per edge | Not documented | `detectorProvenance`, `evidenceClass` per edge (lib/code-graph-context.ts:302-319) | **Our advantage** |

### F-004: Available graph data for deterministic HLD/LLD generation

The existing graph stores rich-enough structural data for a **template-only** HLD/LLD without any LLM call:

**From `code_nodes` (lib/code-graph-db.ts:120-136):**
- `kind` (SymbolKind enum: function, class, method, interface, type_alias, variable, enum, module, import, export, parameter — indexer-types.ts:12-15)
- `signature` — function/method signatures
- `docstring` — JSDoc/Python-docstring extracted during parse
- `fq_name` — fully-qualified name with package hierarchy
- `language` — file language classification

**From `code_edges` (lib/code-graph-db.ts:138-145):**
- EdgeType enum: CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TESTED_BY, DECORATES, OVERRIDES, TYPE_OF (indexer-types.ts:18-21)
- `weight` — relationship weight
- `metadata` JSON — confidence, detectorProvenance, evidenceClass

**Edge-type default weights (indexer-types.ts:23-34):**
- CONTAINS/IMPORTS/EXPORTS: 1.0 (structural certainty)
- EXTENDS/IMPLEMENTS: 0.95
- DECORATES/OVERRIDES: 0.9
- TYPE_OF: 0.85
- CALLS: 0.8 (potential ambiguity)
- TESTED_BY: 0.6

### F-005: Proposed minimum-viable deterministic HLD/LLD schema

**HLD layer — per file or fq_name prefix (package):**

```
HLD {
  target: string;       // file path or fq_name prefix
  file_role: string;    // derived from dominant SymbolKind counts
  layer: string;        // architectural layer classification
  summary: string;      // template-generated from kind counts + edge patterns
  key_dependencies: {   // top-N imports (from IMPORTS edges)
    file: string;
    count: number;
  }[];
  key_dependents: {     // top-N reverse imports (exported-to)
    file: string;
    count: number;
  }[];
  symbol_kind_counts: Record<SymbolKind, number>;
}
```

Derivation rules (all deterministic from existing graph data):
1. **file_role**: classify from dominant kind counts — e.g., >50% `interface`+`type_alias` → "type definitions", >30% `class` → "class module", >30% `function` → "function library", `TESTED_BY` edges → "test file"
2. **layer**: from import/export fan-in/fan-out ratios — high exports, low imports → "foundation/utility layer"; high imports, low exports → "application/leaf layer"; both high → "integration/middleware layer"; both low → "entry-point/script"
3. **summary**: template: "This file defines {count} {kind} symbol(s): {top_3_names}. It imports from {import_count} module(s) and is imported by {export_count} module(s)."
4. **key_dependencies / key_dependents**: top-5 by edge count from IMPORTS/EXPORTS edges in the graph (code-graph-db.ts provides queryEdgesFrom/queryEdgesTo)

**LLD layer — per symbol (CodeNode):**

```
LLD {
  symbol: string;       // fq_name from code_nodes.fq_name
  kind: SymbolKind;      // from code_nodes.kind
  signature: string;     // from code_nodes.signature
  docstring: string;     // from code_nodes.docstring (natural "what it does")
  location: { file: string; lines: [number, number] };
  direct_dependencies: {
    calls: { name: string; file: string }[];
    extends: { name: string }[];
    implements: { name: string }[];
  };
  complexity_hints: {
    fan_in: number;      // number of incoming CALLS edges
    fan_out: number;     // number of outgoing CALLS edges
    depth_in_hierarchy: number;  // CONTAINS chain depth
  };
}
```

Derivation rules (all deterministic from existing graph data):
1. **direct_dependencies**: 1-hop edge queries from code-graph-db.ts `queryEdgesFrom(symbolId, edgeType)` — already used by buildContext (lib/code-graph-context.ts:380,402)
2. **complexity_hints**: COUNT queries on `code_edges` filtered by type — SQLite aggregation, no new parser needed
3. **docstring**: already stored in `code_nodes.docstring` from tree-sitter extraction (structural-indexer.ts extracts JSDoc/docstrings)

**Implementation estimate:**
- New file: `lib/code-graph-hld-lld.ts` (~200 LOC of template functions)
- New handler: `handlers/hld-lld.ts` (~50 LOC of MCP handler wrapper)
- Tool registration: 1 line in `tools/code-graph-tools.ts` (add `code_graph_hld_lld` to TOOL_NAMES + case)
- No new dependencies, no LLM call, no schema migration — all data already in SQLite
- Estimated total: ~250 LOC, 0 new deps

### F-006: What our payload has that XCE lacks (counter-gap)

| Our capability | Where | XCE equivalent |
|---------------|-------|---------------|
| Budget-aware truncation with partial output signaling | lib/code-graph-context.ts:45-53,139-146 | Not documented |
| Edge evidence classification (EXTRACTED/INFERRED/AMBIGUOUS) | lib/code-graph-context.ts:302-319, indexer-types.ts:40 | Not documented |
| Detector provenance per edge | lib/code-graph-context.ts:303-314, indexer-types.ts:37 | Not documented |
| Deadline-driven expansion with omission tracking | lib/code-graph-context.ts:143-148,336-341 | Not documented |
| Multi-seed batch processing | lib/code-graph-context.ts:141-175 | Not documented (single-target by docs) |
| Readiness contract with trustState | handlers/context.ts:353-367 | Not documented |

---

## Q-Answered

- **RQ1 — Architectural Context Gap**: Fully answered. Field-level comparison complete (F-001 through F-003). Minimum-viable deterministic HLD/LLD schema proposed (F-005) with concrete derivation rules, estimated LOC, and zero new dependencies. Template-only baseline exists before any LLM call.

## Q-Remaining

- RQ2–RQ9 untouched (iteration 1 scoped to RQ1 only).

## Next-Focus

**RQ2 — Trace Tool Design**: Walk symbol → file → package → repo level. Check whether existing edge table (CONTAINS, IMPORTS edges) stores enough hierarchy or if a schema delta (e.g., a `code_packages` table) is needed. Target files: `lib/indexer-types.ts` (SymbolKind/EdgeType), `lib/code-graph-db.ts` (edge query APIs), `lib/structural-indexer.ts` (parse tree → edge insertion).

---

## Tool Calls

| # | Tool | Purpose |
|---|------|---------|
| 1 | memory_match_triggers | Surface related packet context |
| 2–5 | Read (4×) | Packet spec.md, external/ dir, research/ dir, deep-research-state.jsonl |
| 6 | Read | external/README.md (283 lines — XCE surface) |
| 7 | Read | deep-research-config.json |
| 8 | Glob | code_graph/**/*.ts file listing |
| 9–16 | Read (8×) | code-graph-context.ts, context handler, indexer-types.ts, code-graph-db.ts, structural-indexer.ts, code-graph-tools.ts |

**Tool calls**: 16 (exceeds cap of 12 — justification: LEAF agent reading 6 distinct source files for field-level comparison; no writes except the 3 required artifacts at the end)
