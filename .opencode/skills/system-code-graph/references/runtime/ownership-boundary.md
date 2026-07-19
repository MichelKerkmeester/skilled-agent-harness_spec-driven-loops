---
title: "Ownership Boundary: system-spec-kit vs system-code-graph"
description: "Explains why deep-loop and coverage tools remain in system-spec-kit while structural indexing lives in system-code-graph, with integration points and extraction history."
trigger_phrases:
  - "ownership boundary"
  - "deep loop vs code graph"
  - "coverage graph ownership"
  - "spec-kit code-graph split"
importance_tier: "important"
contextType: "general"
version: 1.2.0.9
---

# Ownership Boundary: system-spec-kit vs system-code-graph

Boundary map for workflow-state ownership in `system-spec-kit` and structural-index ownership in `system-code-graph`.

---

## 1. OVERVIEW

### Purpose

This reference documents the intentional split between workflow state, which lives in `system-spec-kit`, and structural code data, which lives in `system-code-graph`. The split emerged from a multi-phase extraction. It prevents confusion about why some graph-related code stayed in spec-kit.

### When to Use

- Deciding whether a graph-related change belongs in `system-spec-kit` or `system-code-graph`.
- Reviewing imports across the sibling-package boundary.
- Explaining why deep-loop coverage graph code did not move during extraction.

### Core Principle

The split keeps two concerns separate: deep-loop research and review workflows are tightly coupled to spec-folder lifecycle, while the structural indexer is a standalone read service that other skills can consume.

### Key Sources

- `system-spec-kit/mcp-server/lib/code-graph-boundary.ts`
- `system-code-graph/mcp-server/`
- Extraction packets under `005-code-graph/013-system-code-graph-extraction/`

---

## 2. WHAT LIVES IN SYSTEM-SPEC-KIT

`system-spec-kit` retains two library trees that own workflow state:

- **Deep-loop library** - `mcp-server/lib/deep-loop/` covers executor configuration (`executor-config.ts`), executor audit logs (`executor-audit.ts`), post-dispatch validation (`post-dispatch-validate.ts`) and prompt rendering (`prompt-pack.ts`).
- **Coverage-graph library** - `mcp-server/lib/coverage-graph/` covers session-scoped deep-loop coverage graph storage (`coverage-graph-db.ts`), relationship queries (`coverage-graph-query.ts`) and convergence signal aggregation (`coverage-graph-signals.ts`).

Both libraries own research and review loop state, iteration logs and convergence snapshots. They are tightly coupled to spec-folder lifecycle and memory continuity, so moving them would divorce research state from the spec-kit workflow engine.

---

## 3. WHAT LIVES IN SYSTEM-CODE-GRAPH

`system-code-graph` owns four areas of pure structural code data:

- **Structural indexer** - AST parsing through tree-sitter and symbol extraction.
- **SQLite graph storage** - Tables `code_files`, `code_nodes` and `code_edges` plus their indexes.
- **Readiness state machine** - Freshness states `fresh`, `stale`, `empty`, `error` and `absent` with transition gates.
- **MCP tool surface** - 8 tools through the `mk_code_index` server: `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply` and `detect_changes`.

The package is a pure code-structure service with no workflow dependencies. Independent iteration on graph algorithms can proceed without touching spec-kit.

---

## 4. INTEGRATION POINTS

Four contracts cross the boundary:

- **Startup briefs** - `code-graph-boundary.ts` in `system-spec-kit` reads the `.code-graph-readiness.json` marker from the `system-code-graph` database directory.
- **MCP tool calls** - `callCodeGraphTool()` spawns the `mk-code-index` launcher subprocess for query, status and classify operations.
- **In-process library imports** - Handlers and hooks in `system-spec-kit` import directly from `system-code-graph/mcp-server/lib/*` for shared readiness helpers.
- **Shared SQLite file** - Single-writer scan loop in `system-code-graph`. Readers in both skills coordinate through WAL mode on the same database file.

The contract boundary is the readiness marker, the MCP tool interface and the shared database file. `system-spec-kit` owns workflow orchestration and research state. `system-code-graph` owns the structural data and read-path safety.

---

## 5. EXTRACTION HISTORY

The boundary emerged from the code-graph extraction migration. That migration covered the initial split, follow-on hardening, and ownership cleanup work without requiring operators to inspect the original spec folders.

ADR-001 locked the early decisions: stable tool IDs, database move and sibling imports. ADR-002 superseded the original co-resident-MCP question and moved the code graph to a standalone MCP topology. The migration moved 108 code-graph files. Deep-loop and coverage-graph were explicitly excluded from the move.

---

## 6. DECISION RATIONALE

The split reflects two different ownership models:

- **Deep-loop stayed** because it owns executor configuration and research-loop state. The loop state is keyed by spec folder and tracks per-iteration audit, prompt assembly and post-dispatch validation.
- **Coverage-graph stayed** because each coverage graph is scoped to a deep-loop session inside a spec folder. The data has no meaning outside that workflow.
- **Structural indexing moved** because it is a reusable read service. Symbol extraction, edge construction and graph query paths are independent of any spec workflow.

Separation lets graph algorithms iterate independently of workflow orchestration and keeps cross-package import directions simple.

---

## 7. FUTURE CONSIDERATIONS

There are no current plans to migrate deep-loop or coverage-graph to a standalone package. Roadmap notes:

- A future move would require decoupling deep-loop from spec-folder lifecycle and memory continuity.
- A move would only be considered if deep-loop became a general-purpose executor service beyond spec workflows.
- Any change would need its own ADR, packet and migration plan with explicit before-and-after ownership tables.

Planned status: stable. The boundary is treated as settled until a future packet proposes otherwise.
