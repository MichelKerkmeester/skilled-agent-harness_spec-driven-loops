---
title: "Plan — 027/002 code-graph trace"
description: "Phased plan: lib → handler → tool reg → optional memoization → optional code_packages → tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 027/002 code-graph trace

<!-- SPECKIT_LEVEL: 2 -->

---

## OVERVIEW

5 phases, ~310 LOC total (210 P0 + 100 P1 optional). Sequential. Wall-clock 2-3 hours.

## PHASES

### Phase 1: Lib core (REQ-001, REQ-003, REQ-004, REQ-008, REQ-009)
- Create `mcp_server/code_graph/lib/code-graph-trace.ts`.
- Implement `traceSymbol(symbolId, db, opts)`:
  - Read symbol from `code_nodes`.
  - **Resolve `file` from `CodeNode.filePath` directly** (NOT via CONTAINS walk; per B-iter002-001).
  - Build symbol/class display from available CONTAINS/fqName metadata where present (REQ-009 sparse-containment fallback).
  - For nested classes, compare against `class.fqName + "."` (REQ-010).
  - **Derive `module` from filePath policy** (REQ-008): nearest package/root segment OR basename fallback. NOT from `fq_name` dot-splitting.
  - Call Phase 001's `classifyFileRole(filePath, db)` for `architectural_role` (REQ-004 invariant: equals `generateHLD(filePath, db).file_role`).
  - Return chain object with `symbol/class?/file/module/architectural_role/truncated`.
- Implement `resolveModuleFromFilePath(filePath)` helper (REQ-008) — replaces fq_name dot-splitting fallback.
- Document module-policy examples for TS/JS, Python, Bash, doc files under current SupportedLanguage set.
- **Patch CONTAINS nested-class parent lookup**: compare `method.fqName` against `class.fqName + "."` (REQ-010) — OR defensively avoid relying on nested containment until fixed.

### Phase 2: Handler (REQ-002)
- Create `mcp_server/code_graph/handlers/trace.ts`.
- Reuse readiness gate from `handlers/context.ts:182-262`.
- zod schema: `{symbolId: string, maxDepth?: number}`.

### Phase 3: Tool registration (REQ-002)
- Edit `mcp_server/code_graph/tools/code-graph-tools.ts`. Add `code_graph_trace`.

### Phase 4: Optional memoization (P1 REQ-006)
- DDL `trace_cache(symbol_id PK, chain_json, computed_at)` in `code-graph-db.ts`.
- Cache invalidation on `isFileStale` for the symbol's file.

### Phase 5: Optional code_packages table (P1 REQ-007 — REWRITTEN per pt-02)
- **Only build AFTER P0 filePath-derived module ownership (REQ-008) is verified correct.**
- DDL `code_packages(package_name PK, files_json, depth)`.
- **Populate from file paths / package markers / path aliases / import metadata / explicit config** — NOT from fq_name prefix scan (which would persist the same wrong inference per B-iter002-008).
- If redesigning around file paths is too large, KEEP REQ-007 deferred and rely on P0 filePath policy alone.

### Phase 6: Tests + verification (REQ-005)
- Tests: file-level symbol (no class), class-level symbol, deep chain, truncation, missing symbol, role-from-Phase-001.
- ≥80% line coverage.
- `npm run check` green.

## DEPENDENCIES

- Phase 027/001 (HLD/LLD) must ship first — this phase imports `classifyFileRole`.

## OUT OF SCOPE

- Cross-repo trace.
- Downward impact tracing (Phase 003).
- LLM enrichment.
