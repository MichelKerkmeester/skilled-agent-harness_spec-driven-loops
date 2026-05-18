---
title: "Phase Parent: 027/003 Code Graph Trace"
description: "Lean phase-parent control file for the contract-first decomposition of code_graph_trace into contract, library implementation, handler, and test child packets."
trigger_phrases:
  - "027 phase 003"
  - "code-graph trace"
  - "code_graph_trace"
  - "trace tool"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Converted populated packet into lean phase parent with four child packets"
    next_safe_action: "Resume one child packet by explicit folder"
    blockers: []
    key_files: ["spec.md", "description.json", "graph-metadata.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-phase-parent-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: code_graph_trace Phase Parent

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | phase-parent |
| **Created** | 2026-05-08 |
| **Updated** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement` |
| **Packet ID** | `system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace` |
| **Depends on** | `system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The trace tool work combines a public MCP contract, a resolver library, handler wiring, and verification fixtures. Keeping those concerns in one populated packet made parallel execution harder and let implementation details drift across docs.

### Purpose
This phase parent coordinates four independently executable child packets for `code_graph_trace`. The target outcome is a single MCP trace call that walks from a symbol to file/module/architectural role using `CodeNode.filePath` as ownership truth, optional CONTAINS/fqName metadata for class display, and Phase 002 HLD/LLD classification for the architectural-role terminus.

> Phase-parent note: this parent keeps only the control surface. Child folders own their own plan, tasks, checklist, and implementation-summary files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Contract-first decomposition of the trace work into four child packets.
- Parent-level child map and dependency metadata.
- Preservation of the pt-04 dependency audit outcome: Phase 002 is the HLD/LLD classifier dependency for trace; Phase 001 is not the classifier source.

### Out of Scope
- Product-code implementation in this parent packet.
- Checklist or implementation evidence at the parent level.
- Changes to the 027 root packet, sibling phases, or source code outside this spec folder.

### Expected Implementation Surfaces

| File Path | Change Type | Child Phase | Description |
|-----------|-------------|-------------|-------------|
| `mcp_server/code_graph/lib/code-graph-trace-contract.ts` | Create | `001-contract` | Trace tool and result TypeScript interfaces. |
| `mcp_server/code_graph/lib/code-graph-trace.ts` | Create | `002-lib-impl` | FilePath-grounded trace resolver using Phase 002 classifier. |
| `mcp_server/code_graph/handlers/trace.ts` | Create | `003-handler` | MCP handler using the contract interface. |
| `mcp_server/tests/code-graph-trace.vitest.ts` | Create | `004-test` | Contract-driven trace behavior tests. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-contract` | TS interfaces for `TraceTool` and trace-result types. Sequential bootstrap. | spec-scaffolded |
| 002 | `002-lib-impl` | `code-graph-trace.ts` implementation conforming to the contract and consuming HLD/LLD classification. | spec-scaffolded |
| 003 | `003-handler` | `handlers/trace.ts` MCP handler using the contract interface. | spec-scaffolded |
| 004 | `004-test` | `code-graph-trace.vitest.ts` tests against the contract. | spec-scaffolded |

### Phase Transition Rules

- `001-contract` can start after `system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/001-contract` publishes.
- `002-lib-impl` starts after local `001-contract` and `system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/002-lib-impl` merge.
- `003-handler` and `004-test` depend on local `001-contract`; test work may use contract doubles until the library is ready.
- Each child validates independently with `validate.sh --strict`.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-contract` | `002-lib-impl` | Trace interfaces and result types are stable enough for implementation. | Child strict validation plus contract docs. |
| `001-contract` | `003-handler` | Handler input/output surface can compile against the contract. | Child strict validation plus handler plan. |
| `001-contract` | `004-test` | Tests can assert contract behavior without concrete implementation. | Child strict validation plus test plan. |
| `002-lib-impl` | integrated trace tool | Resolver consumes Phase 002 classifier and returns filePath-grounded trace output. | Product tests in `004-test`. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at the parent level. Child packets track their own implementation questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Graph Metadata**: `graph-metadata.json`
- **Description Metadata**: `description.json`
- **Phase children**: `001-contract/`, `002-lib-impl/`, `003-handler/`, `004-test/`
