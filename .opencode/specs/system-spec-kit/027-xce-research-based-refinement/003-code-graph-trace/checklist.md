---
title: "Verification Checklist: 027/003 Code Graph Trace"
description: "QA validation checklist for the filePath-grounded trace tool phase."
trigger_phrases:
  - "027 phase 003 checklist"
  - "code graph trace checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-code-graph-trace"
    last_updated_at: "2026-05-09T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned checklist with filePath ownership amendments from pt-02 research"
    next_safe_action: "Implement Phase 003 after Phase 002 file-role helper exists"
---
# Verification Checklist: 027/003 Code Graph Trace

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim the phase implemented until complete |
| **[P1]** | Required | Must complete or explicitly defer with approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements REQ-001 through REQ-010 are present in spec.md.
- [ ] CHK-002 [P0] Plan states `CodeNode.filePath` is the ownership truth for module/file rungs.
- [ ] CHK-003 [P0] Tasks include sparse-containment and nested-class regression fixtures.
- [ ] CHK-004 [P1] Optional package/cache work is sequenced after P0 filePath trace correctness.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `traceSymbol(symbolId, db)` returns a chain with symbol, file, and architectural_role fields.
- [ ] CHK-011 [P0] `code_graph_trace` is registered and callable through the MCP surface.
- [ ] CHK-012 [P0] Default depth cap is 5 and sets truncation metadata when exceeded.
- [ ] CHK-013 [P0] Missing symbol IDs return structured errors.
- [ ] CHK-014 [P0] `architectural_role` reuses Phase 002 `classifyFileRole` for the same file.
- [ ] CHK-015 [P0] Module rung is derived from `CodeNode.filePath`, not `fq_name` dot-splitting.
- [ ] CHK-016 [P0] Sparse-containment fixtures cover top-level TypeScript functions, Bash functions, doc symbols, module nodes, and anonymous/default exports.
- [ ] CHK-017 [P0] Nested-class parent matching uses `class.fqName + "."`, not short-name prefix matching.
- [ ] CHK-018 [P1] `trace_cache` memoization is implemented only after correctness is verified.
- [ ] CHK-019 [P1] `code_packages` is populated only from filePath/package markers/path aliases/import metadata or explicit config.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] Sparse-containment fixtures all return valid file and architectural_role output.
- [ ] CHK-031 [P0] Nested-class regression fixture passes.
- [ ] CHK-032 [P0] `npx vitest run code-graph-trace.vitest.ts` passes.
- [ ] CHK-033 [P0] New Phase 003 code reaches at least 80 percent line coverage.
- [ ] CHK-034 [P0] `npm run check` passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-040 [P0] Every P0 requirement has file:line evidence in implementation-summary.md after implementation.
- [ ] CHK-041 [P0] pt-02 filePath ownership amendments are tested and documented.
- [ ] CHK-042 [P1] Optional cache/package items are either implemented with evidence or deferred.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] MCP input validation rejects malformed symbol IDs without raw exceptions.
- [ ] CHK-051 [P1] Trace depth and traversal caps prevent unbounded graph walks.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md remain synchronized.
- [ ] CHK-061 [P0] Strict spec-kit validation passes for the phase folder.
- [ ] CHK-062 [P1] Per-language filePath/module examples are documented where implemented.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] New trace source, test, and fixture files follow the existing mcp_server layout.
- [ ] CHK-071 [P1] No generated cache or scratch artifacts are committed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 0/23 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
