---
title: "Tasks — 027/002 code-graph trace"
description: "Per-file tasks for the trace tool phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/002 code-graph trace

<!-- SPECKIT_LEVEL: 2 -->

## P0
| # | Task | File | Done |
|---|------|------|------|
| T1 | Implement `traceSymbol(symbolId, db, opts)` | `mcp_server/code_graph/lib/code-graph-trace.ts` (new, ~100 LOC) | [ ] |
| T2 | Implement `resolveModuleFromFqName()` helper | same | [ ] |
| T3 | Wire architectural_role via Phase 001 `classifyFileRole` | same | [ ] |
| T4 | Cap depth at maxDepth + truncation flag | same | [ ] |
| T5 | Create handler with zod schema + readiness gate | `mcp_server/code_graph/handlers/trace.ts` (new, ~60 LOC) | [ ] |
| T6 | Register `code_graph_trace` MCP tool | `mcp_server/code_graph/tools/code-graph-tools.ts` (edit, +3 LOC) | [ ] |

## P0 — pt-02 amendments (NEW)

| # | Task | File | Done |
|---|------|------|------|
| **T-002A** | Implement filePath-derived file/module resolution helper (`resolveModuleFromFilePath()`) + unit tests (REQ-001, REQ-008) | `code-graph-trace.ts` + tests | [ ] |
| **T-002B** | Add sparse symbol fixtures: top-level TS function, Bash function, doc symbol/no node, module node, star re-export, named default class, anonymous default class (REQ-009) | `code-graph-trace.vitest.ts` | [ ] |
| **T-002C** | Add nested-class fixture proving fqName-based parent matching (REQ-010) | `code-graph-trace.vitest.ts` | [ ] |
| **T-002D** | Add shared-contract test with Phase 001: `trace.architectural_role === classifyFileRole(filePath, db)` (REQ-004) | `code-graph-trace.vitest.ts` | [ ] |
| **REMOVED** | ~~Implement `code_packages` table from fq_name prefix splitting~~ — DEFERRED unless redesigned around filePath/package metadata | n/a | n/a |

## P1 — Optional optimization
| # | Task | File | Done |
|---|------|------|------|
| T7 | DDL `trace_cache` table + cache layer | `mcp_server/code_graph/lib/code-graph-db.ts` (+50 LOC) | [ ] |
| T8 | DDL `code_packages` table — populate from filePath/package markers/path aliases/import metadata (NOT fq_name) | same (+50 LOC); only after P0 filePath policy verified | [ ] |

## P0 — Tests + Verification
| # | Task | File | Done |
|---|------|------|------|
| T9 | Unit test trace chains (file-level, class-level, deep, truncated, missing) | `mcp_server/tests/code-graph-trace.vitest.ts` (new) | [ ] |
| T10 | Integration test: trace's role matches Phase 001's HLD role | same | [ ] |
| T11 | `npx vitest run code-graph-trace.vitest.ts --coverage` ≥80% | terminal | [ ] |
| T12 | `npm run check` green | terminal | [ ] |
| T13 | Write `implementation-summary.md` with file:line evidence | new | [ ] |
