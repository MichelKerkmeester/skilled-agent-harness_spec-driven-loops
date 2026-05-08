---
title: "Plan — 027/001 code-graph HLD/LLD"
description: "Phased plan for the deterministic HLD/LLD narrative generator: lib → handler → tool reg → omni → tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 027/001 code-graph HLD/LLD

<!-- SPECKIT_LEVEL: 2 -->

---

## OVERVIEW

7 phases, ~320-370 LOC total after pt-02 amendments. Sequential. Wall-clock target: 3-4 hours.

---

## PHASES

### Phase 0: Define deterministic helpers FIRST (REQ-012, REQ-013, REQ-014)
**Define BEFORE generator implementation:**
- Add stable-sort helper: `sortSymbolsForCap(symbols)` returns array sorted by `kind priority → start_line ascending → name ascending → symbol_id ascending`. Use this BEFORE every capped array is returned (primary_symbols, LLD direct_dependencies).
- Choose unresolved-edge policy: filter OR emit structured `{type: "unresolved", target_id}` records. Document the choice in module-level constants. Single helper `renderDependencyRow(edge, db)` shares this between HLD and LLD.
- Define role-domain documentation: open string + baseline labels (`module / api-handler / library / test / config`) + reserved edge labels (`empty`). Include empty-file/comment-only fixture in test plan.

### Phase 1: Library implementation (REQ-001, REQ-002, REQ-007, REQ-008)
- Create `mcp_server/code_graph/lib/code-graph-hld-lld.ts`.
- Export `classifyFileRole(filePath: string, db: CodeGraphDbLike): string` (REQ-015 — Phase 002 imports this).
- Implement `generateHLD(filePath, db)`:
  - Query `code_files` by path.
  - Query `code_nodes WHERE file_path = ?` for symbol kind counts.
  - Query `queryEdgesFrom(filePath, 'IMPORTS')` and `queryEdgesTo(filePath, 'IMPORTS')` for in/out import counts.
  - Resolve primary module via REQ-014 selection: prefer synthetic file module where `fq_name === getModuleName(filePath)`, else lowest `start_line`, then `symbol_id`.
  - Compute `file_role` via `classifyFileRole(filePath, db)` (kind counts + path heuristic). MUST equal `generateHLD(file, db).file_role` (REQ-015 invariant).
  - Compute `layer` from import/export ratio (high-out/low-in = utility, high-in/low-out = presentation, etc.).
  - Render `summary` template from above counts.
  - Apply `sortSymbolsForCap()` BEFORE primary-symbols cap.
  - Return JSON.
- Implement `generateLLD(symbolId, db)`:
  - Query `code_nodes WHERE id = ?`.
  - Query `queryEdgesFrom(symbolId)` for direct_dependencies.
  - Apply unresolved-edge policy via `renderDependencyRow()` (REQ-013).
  - Compute complexity_hints from fan-in/fan-out counts (REQ-009).
  - Apply `sortSymbolsForCap()` BEFORE direct_dependencies cap.
  - Return JSON.
- Implement `generateFileNarrative(filePath, db)`: composes HLD + per-symbol LLD for top-N symbols.

### Phase 2: Handler implementation (REQ-003)
- Create `mcp_server/code_graph/handlers/hld-lld.ts`.
- Reuse readiness gate pattern from `handlers/context.ts:182-262`.
- Define zod schema for input: `{path: string, maxSymbols?: number, includeLLD?: boolean}`.
- Dispatch to `generateFileNarrative()` or `generateHLD()` based on `includeLLD`.
- Return MCP-compatible response envelope.

### Phase 3: Tool registration (REQ-003)
- Edit `mcp_server/code_graph/tools/code-graph-tools.ts`.
- Add `code_graph_hld_lld` entry alongside existing `code_graph_context`.

### Phase 4: Omni context wire contract — full integration (REQ-004, REQ-016)
**Critical: update ALL of these together in ONE PR, with a handler-level JSON parse integration test:**
- Edit `mcp_server/code_graph/lib/code-graph-context.ts` queryMode dispatch.
- When `queryMode === 'omni'`, call `generateFileNarrative()` for the resolved subject file and attach to `ContextResult.hld_lld`.
- Update `QueryMode` enum to include `'omni'`.
- Update `ContextResult` interface to include optional `hld_lld?` field.
- Update `handlers/context.ts` input parsing to accept `queryMode:'omni'`.
- Update serialized handler JSON output so `hld_lld` is preserved through the wire (NOT dropped).
- Add handler-level integration test that calls the MCP tool, parses the JSON response, and asserts `hld_lld` is present + structurally valid.
- **Alternative**: if scope is too large, REMOVE `omni` from Phase 001 scope (REQ-004 + REQ-016 deferred to a future phase) — document the deferral in the same PR.

### Phase 5: Tests + verification (REQ-005, REQ-006, REQ-012, REQ-013, REQ-014, REQ-015)
- Create `mcp_server/tests/code-graph-hld-lld.vitest.ts`.
- Cover:
  - Empty file (`file_role: "empty"` per reserved edge label).
  - Single-symbol file.
  - Multi-symbol file.
  - Hub symbol (high fan-in flag REQ-009).
  - Stale db.
  - Missing file (FILE_NOT_INDEXED structured error).
  - Omni integration (handler JSON parse).
  - **Stable-sort fixture: 1000+ symbols across 100 repeated calls — assert identical output (REQ-012).**
  - **Dangling-edge fixture: edge endpoint missing from `code_nodes`; assert chosen filter-or-unresolved policy (REQ-013).**
  - **Multi-module fixture: synthetic + captured module-like symbols on one file; assert primary module selection (REQ-014).**
  - **Classifier-contract fixture: `classifyFileRole(file, db) === generateHLD(file, db).file_role` (REQ-015).**
- Target ≥80% line coverage.
- Run `npm run check` (lint + typecheck).
- Run `vitest run code-graph-hld-lld.vitest.ts`.
- Commit + push.

---

## DEPENDENCIES

- Existing `code-graph-db.ts` query APIs (already shipped, stable).
- Existing `indexer-types.ts` SymbolKind/EdgeType enums (already shipped).
- Existing `handlers/context.ts` readiness gate (reused, not modified).

## OUT OF SCOPE

- LLM-generated narrative (deferred to a future phase).
- Schema migrations.
- `structural-indexer.ts` or `tree-sitter-parser.ts` changes.

## ROLLBACK PLAN

Single commit covering all 5 phases. Revert via `git revert <sha>` if regressions surface in downstream consumers (`code_graph_context`).
