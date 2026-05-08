---
title: "Tasks — 027/001 code-graph HLD/LLD"
description: "Per-file tasks for the HLD/LLD narrative generator phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/001 code-graph HLD/LLD

<!-- SPECKIT_LEVEL: 2 -->

---

## P0 — Mandatory

| # | Task | File | Done |
|---|------|------|------|
| T1 | Implement `generateHLD(filePath, db)` | `mcp_server/code_graph/lib/code-graph-hld-lld.ts` (new, ~80 LOC) | [ ] |
| T2 | Implement `generateLLD(symbolId, db)` | same file (~50 LOC) | [ ] |
| T3 | Implement `generateFileNarrative(filePath, db)` composer | same file (~40 LOC) | [ ] |
| T4 | Implement `classifyFileRole()` + `classifyLayer()` heuristic helpers | same file (~30 LOC) | [ ] |
| T5 | Create handler with zod schema + readiness gate | `mcp_server/code_graph/handlers/hld-lld.ts` (new, ~50 LOC) | [ ] |
| T6 | Register `code_graph_hld_lld` MCP tool | `mcp_server/code_graph/tools/code-graph-tools.ts` (edit, +2 LOC) | [ ] |
| T7 | Integrate into `queryMode:'omni'` | `mcp_server/code_graph/lib/code-graph-context.ts` (edit, +15 LOC) | [ ] |
| T8 | Update `ContextResult` interface to include `hld_lld?` | same file | [ ] |

## P0 — Tests

| # | Task | File | Done |
|---|------|------|------|
| T9 | Unit test `generateHLD` with empty/single-symbol/multi-symbol/hub fixtures | `mcp_server/tests/code-graph-hld-lld.vitest.ts` (new) | [ ] |
| T10 | Unit test `generateLLD` with valid/missing symbolId | same | [ ] |
| T11 | Unit test omni integration | same | [ ] |
| T12 | Run `npx vitest run code-graph-hld-lld.vitest.ts --coverage` — verify ≥80% line coverage | terminal | [ ] |
| T13 | Run `npm run check` — lint + typecheck green | terminal | [ ] |

## P0 — pt-02 amendments (NEW)

| # | Task | File | Done |
|---|------|------|------|
| **T-001A** | Add stable-sort helper `sortSymbolsForCap()` + tests for 100 repeated calls with 1000+ symbols (REQ-012) | `code-graph-hld-lld.ts` + tests | [ ] |
| **T-001B** | Add dangling-edge fixture and implement chosen unresolved-dependency policy (REQ-013) | `code-graph-hld-lld.ts` + tests | [ ] |
| **T-001C** | Add primary-module-selection fixture with synthetic module + captured module-like symbol (REQ-014) | `code-graph-hld-lld.vitest.ts` | [ ] |
| **T-001D** | Export `classifyFileRole(filePath, db)` and add equality test with `generateHLD().file_role` (REQ-015) | `code-graph-hld-lld.ts` + tests | [ ] |
| **T-001E** | Context-handler JSON-parse integration test for `queryMode:'omni'` and `hld_lld` serialization, OR remove omni from scope (REQ-016) | `code-graph-context.ts` + `handlers/context.ts` + integration test | [ ] |

## P1 — Polish

| # | Task | File | Done |
|---|------|------|------|
| T14 | Add `complexity_hints` for high-fan-in flag (REQ-009) | `code-graph-hld-lld.ts` | [ ] |
| T15 | Add LLM-required placeholders (REQ-010) | `code-graph-hld-lld.ts` | [ ] |
| T16 | Update implementation-summary.md with file:line evidence per task | `implementation-summary.md` (new) | [ ] |
