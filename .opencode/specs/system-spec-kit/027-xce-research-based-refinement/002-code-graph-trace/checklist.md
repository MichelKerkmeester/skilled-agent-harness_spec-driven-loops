---
title: "Checklist — 027/002 code-graph trace"
description: "QA checklist for the trace tool phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 027/002 code-graph trace

<!-- SPECKIT_LEVEL: 2 -->

Mark each item `[x]` only with file:line evidence after completion.

## P0
- [ ] **C-001**: `traceSymbol(symbolId, db)` returns chain with `symbol/file/architectural_role` minimum
- [ ] **C-002**: `code_graph_trace` MCP tool registered + callable
- [ ] **C-003**: Depth cap at 5 default; truncation flag set when exceeded
- [ ] **C-004**: `architectural_role` matches Phase 001's `classifyFileRole` output for the same file
- [ ] **C-005**: Vitest ≥80% line coverage
- [ ] **C-006**: Returns structured error for missing symbolId

## P0 — pt-02 amendments (NEW)
- [ ] **C-008** (REQ-008): Module rung derived from `CodeNode.filePath` policy, NOT fq_name dot-splitting; per-language examples documented
- [ ] **C-009** (REQ-009): Sparse-containment fixtures pass: top-level TS function, Bash function, doc symbol, module node, anonymous/default exports — all return valid file + architectural_role
- [ ] **C-010** (REQ-010): Nested-class parent matching uses `class.fqName + "."` comparison (NOT short name); regression fixture passes

## P1 (optional)
- [ ] **C-007**: trace_cache table + memoization with ≥2x speedup
- [ ] **C-007b**: code_packages table populated from filePath/package markers/path aliases/import metadata (NOT fq_name); ONLY after P0 filePath policy verified

## Verification
- [ ] **C-V01**: `npm run check` green
- [ ] **C-V02**: `npx vitest run code-graph-trace.vitest.ts` all pass
- [ ] **C-V03**: strict validate passes
- [ ] **C-V04**: implementation-summary.md authored
