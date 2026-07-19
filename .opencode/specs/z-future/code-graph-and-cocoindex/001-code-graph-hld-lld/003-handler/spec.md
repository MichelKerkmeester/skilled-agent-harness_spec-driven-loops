---
title: "Phase 003 Handler: Code Graph HLD/LLD"
description: "Implement the MCP handler and tool wiring using the HLD/LLD contract interface."
trigger_phrases:
  - "027 phase 002 handler"
  - "code_graph_hld_lld handler"
importance_tier: "important"
contextType: "implementation"
depends_on:
  - "001-contract"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/001-code-graph-hld-lld/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded handler child spec"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-003-handler-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: 003 Handler

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Spec-Scaffolded |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Depends On** | `001-contract` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deterministic HLD/LLD generator needs an MCP-facing surface. Handler work should use the public contract and avoid defining its own payload shape.

### Purpose

Implement `mcp_server/code_graph/handlers/hld-lld.ts`, register `code_graph_hld_lld`, reuse existing readiness behavior, validate inputs, and carry the optional omni wire contract only if it remains explicitly in scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Implement `handlers/hld-lld.ts` using the contract interface.
- Reuse readiness gate behavior from the existing context handler.
- Validate file path or symbol input.
- Register `code_graph_hld_lld` in tool metadata.
- If omni stays in scope, wire QueryMode, ContextResult, handler parsing, and serialized JSON together.

### Out of Scope

- Generator internals owned by `002-lib-impl`.
- Test fixture authoring owned by `004-test`.
- Schema migrations, parser changes, or LLM generation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/handlers/hld-lld.ts` | Create | MCP handler for HLD/LLD narrative generation |
| `mcp_server/code_graph/tools/code-graph-tools.ts` | Modify | Register `code_graph_hld_lld` |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Modify if omni remains | Add optional `hld_lld` payload contract |
| `mcp_server/code_graph/handlers/context.ts` | Modify if omni remains | Parse and serialize omni payload |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register `code_graph_hld_lld` tool | Tool metadata exposes the new MCP tool. |
| REQ-002 | Handler uses contract interface | Handler imports public types rather than redefining payload shape. |
| REQ-003 | Handler validates inputs | Malformed path or symbol inputs return structured errors. |
| REQ-004 | Handler returns JSON-serializable output | Serialized response includes HLD/LLD payload without circular data. |
| REQ-005 | Readiness failures follow existing envelope behavior | DB not-ready cases match context handler conventions. |
| REQ-006 | Omni scope is all-or-nothing | QueryMode, ContextResult, parser, serialization, and integration test are updated together, or omni is removed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Handler errors are stable | Error codes are documented and testable. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MCP callers can request `code_graph_hld_lld` and receive valid JSON.
- **SC-002**: Existing context behavior remains compatible.
- **SC-003**: If omni is kept, the handler-level serialization path preserves `hld_lld`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-contract` | Handler payload shape unstable | Wait for contract validation |
| Dependency | `002-lib-impl` | Runtime generator unavailable | Type against contract; final integration waits for generator |
| Risk | Wire contract drift | Local types include fields that serialized MCP output drops | Require handler-level JSON parse integration coverage |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Handler failures return structured errors, not raw thrown exceptions.

### Maintainability
- **NFR-M01**: Handler owns wire concerns only; generation logic stays in the library.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- DB readiness gate fails.
- Requested file is not indexed.
- Requested symbol is missing.
- Omni parsing is unsupported or intentionally removed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One handler, tool registration, and optional omni wiring. |
| Risk | 7/25 | Wire contract drift is the main risk. |
| Research | 2/20 | Parent research already exists. |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Omni must be either fully wired or removed during implementation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Contract**: `../001-contract/spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
