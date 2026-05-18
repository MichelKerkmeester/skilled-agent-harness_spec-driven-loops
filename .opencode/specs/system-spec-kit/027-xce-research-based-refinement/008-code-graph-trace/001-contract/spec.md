---
title: "Phase 003.001 — code_graph_trace Contract"
description: "Level 2 child packet for TraceTool and trace-result TypeScript interfaces used by code_graph_trace."
trigger_phrases:
  - "027 phase 003 contract"
  - "code_graph_trace contract"
  - "TraceTool interface"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace/001-contract"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for trace contract work"
    next_safe_action: "Define TraceTool and trace-result interfaces after upstream Phase 002 contract publishes"
    blockers:
      - "system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/001-contract"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-001-contract-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: code_graph_trace Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | spec-scaffolded |
| **Created** | 2026-05-12 |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace` |
| **Depends on** | `system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/001-contract` |
| **Estimated LOC** | ~30 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The trace library, handler, and tests need a shared typed surface before implementation starts. Without a contract-first packet, downstream work can drift on result field names, depth metadata, and architectural-role typing.

### Purpose
Define the TypeScript interfaces for `TraceTool`, trace inputs, trace chain entries, and trace-result payloads so the library, handler, and tests can proceed independently.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `TraceTool` interface.
- Trace input/options types including `symbolId` and `maxDepth`.
- Trace result and trace-chain entry types.
- Contract alignment with the Phase 002 HLD/LLD classifier result.

### Out of Scope
- Resolver implementation.
- MCP handler registration.
- Runtime tests beyond contract-level compile checks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/lib/code-graph-trace-contract.ts` | Create | Public trace contract and result interfaces. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define `TraceTool` with a typed `traceSymbol` operation. | Library and handler plans can reference one interface. |
| REQ-002 | Define trace result fields for `symbol`, `file`, `module`, `architectural_role`, `class`, `chain`, and `truncated`. | Downstream packets can assert stable output shape. |
| REQ-003 | Keep file ownership explicit in the contract. | Result type distinguishes filePath-backed `file` from optional display ancestry. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Reference Phase 002 classifier output type where available. | Architectural-role field is compatible with Phase 002 contract. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `002-lib-impl`, `003-handler`, and `004-test` can compile against the same trace contract.
- **SC-002**: Contract docs make filePath ownership and optional containment display explicit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 contract | Architectural-role type can drift | Wait for upstream contract publication before finalizing role type import. |
| Risk | Overfitting to handler shape | Library becomes transport-specific | Keep the contract centered on trace behavior, not MCP response envelope. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-M01**: Contract remains small and implementation-neutral.
- **NFR-C01**: Types must be usable by library, handler, and test packets without circular imports.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Missing symbol result shape must be representable.
- Trace truncation metadata must be representable without requiring a deep chain.
- Sparse-containment symbols must be representable with `class: null`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One small contract file |
| Risk | 3/25 | Upstream type dependency |
| Research | 1/20 | Existing parent spec defines behavior |
| **Total** | **8/70** | **Level 2 for QA coordination** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at scaffold time.
<!-- /ANCHOR:questions -->
