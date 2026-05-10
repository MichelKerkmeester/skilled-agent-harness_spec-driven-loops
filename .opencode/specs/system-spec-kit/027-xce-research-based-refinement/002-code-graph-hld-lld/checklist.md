---
title: "Verification Checklist: 027/002 Code Graph HLD/LLD"
description: "QA validation checklist for the HLD/LLD narrative generator phase."
trigger_phrases:
  - "027 phase 002 checklist"
  - "code graph hld lld checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-code-graph-hld-lld"
    last_updated_at: "2026-05-09T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned checklist with pt-01/pt-02 research and active spec-kit template anchors"
    next_safe_action: "Implement Phase 002 requirements after dependency checks"
---
# Verification Checklist: 027/002 Code Graph HLD/LLD

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

- [ ] CHK-001 [P0] Requirements REQ-001 through REQ-016 are present in spec.md, including all pt-02 amendments.
- [ ] CHK-002 [P0] Plan sequences deterministic HLD/LLD generation before MCP/omni wiring.
- [ ] CHK-003 [P0] Tasks include the stable-sort, dangling-edge, primary-module, role-export, and omni-contract decisions.
- [ ] CHK-004 [P1] Dependencies on existing CodeNode, CodeEdge, QueryMode, and MCP handler APIs are verified before coding.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `generateHLD(filePath, db)` returns deterministic JSON for identical inputs.
- [ ] CHK-011 [P0] `generateLLD(symbolId, db)` returns null for a missing symbol and populated output for an existing symbol.
- [ ] CHK-012 [P0] `code_graph_hld_lld` is registered and callable through the MCP surface.
- [ ] CHK-013 [P0] Output serializes with `JSON.stringify(result)` without circular references.
- [ ] CHK-014 [P0] Stable-sort helper is applied before every capped collection.
- [ ] CHK-015 [P0] Dangling-edge policy is implemented as either filtered edges or explicit unresolved records.
- [ ] CHK-016 [P0] Primary-module selection prefers the synthetic module node where `fq_name === getModuleName(filePath)`.
- [ ] CHK-017 [P0] `classifyFileRole(filePath, db)` is exported and matches `generateHLD(filePath, db).file_role`.
- [ ] CHK-018 [P0] Omni wire contract is either fully implemented across QueryMode, ContextResult, handler parse, serialization, and integration tests, or removed from this phase scope.
- [ ] CHK-019 [P1] File-role classifications cover module, API handler, library, test, and config examples.
- [ ] CHK-020 [P1] Layer-tier classifications cover presentation, business, data, and utility examples.
- [ ] CHK-021 [P1] `complexity_hints` includes high-fan-in text when fan-in exceeds the configured threshold.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] Unit tests prove deterministic output across repeated runs on large symbol sets.
- [ ] CHK-031 [P0] Serialization, missing-symbol, dangling-edge, and primary-module fixtures pass.
- [ ] CHK-032 [P0] `npx vitest run code-graph-hld-lld.vitest.ts` passes.
- [ ] CHK-033 [P0] New Phase 002 code reaches at least 80 percent line coverage.
- [ ] CHK-034 [P0] `npm run check` passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-040 [P0] Every P0 requirement has file:line evidence in implementation-summary.md after implementation.
- [ ] CHK-041 [P0] All pt-02 amendments are mapped to tests or explicit out-of-scope decisions.
- [ ] CHK-042 [P1] Deferred P1/P2 items have rationale and owner recorded.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] MCP input validation rejects malformed file paths and symbol IDs without throwing raw errors.
- [ ] CHK-051 [P1] No command execution, network access, or unbounded file reads are introduced by this phase.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md remain synchronized.
- [ ] CHK-061 [P0] Strict spec-kit validation passes for the phase folder.
- [ ] CHK-062 [P1] Public helper behavior is documented where call sites cannot infer it from names.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] New source, test, and fixture files follow the existing mcp_server layout.
- [ ] CHK-071 [P1] No scratch or generated run artifacts are committed outside approved locations.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 24 | 0/24 |
| P1 Items | 8 | 0/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
