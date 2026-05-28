---
title: "Phase 003.003 — code_graph_trace Handler"
description: "Level 2 child packet for handlers/trace.ts using the trace contract interface."
trigger_phrases:
  - "027 phase 003 handler"
  - "code_graph_trace handler"
  - "trace handler"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for trace handler work"
    next_safe_action: "Implement handlers/trace.ts after local contract publishes"
    blockers:
      - "system-spec-kit/027-xce-research-based-refinement/008-code-graph-trace/001-contract"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-003-handler-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: code_graph_trace Handler

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
| **Depends on** | `001-contract` |
| **Estimated LOC** | ~60 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The MCP surface needs a handler that validates trace input, checks code-graph readiness, calls the contract-backed trace tool, and returns the standard response envelope.

### Purpose
Create `handlers/trace.ts` so `code_graph_trace` can be exposed through the existing code-graph tool surface without embedding resolver logic in the transport layer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- zod input schema for `symbolId` and `maxDepth`.
- Readiness-gate reuse.
- Handler call into a `TraceTool` implementation.
- Standard success/error response envelope.

### Out of Scope
- Trace resolver internals.
- Contract type definitions.
- Full test matrix, owned by `004-test`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/handlers/trace.ts` | Create | MCP handler for trace requests. |
| `mcp_server/code_graph/tools/code-graph-tools.ts` | Modify | Register `code_graph_trace` if registration is bundled with handler work. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Handler validates trace input. | Malformed symbol IDs and invalid depth values return structured errors. |
| REQ-002 | Handler calls the contract interface. | Transport code does not own resolver logic. |
| REQ-003 | Handler reuses code-graph readiness gates. | Unready graph returns existing readiness behavior. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Tool registration exposes `code_graph_trace`. | MCP tool list includes the trace tool. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Valid handler input invokes a `TraceTool` and returns the trace result.
- **SC-002**: Invalid input returns a structured error without raw exceptions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local trace contract | Handler shape can drift | Wait for `001-contract`. |
| Risk | Handler duplicates resolver logic | Transport becomes hard to test | Keep handler as validation + delegation only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-M01**: Handler stays thin and delegates trace behavior.
- **NFR-S01**: Input validation rejects malformed values before resolver calls.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty or malformed `symbolId`.
- `maxDepth` outside accepted bounds.
- Code graph database not initialized.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One handler plus possible registration |
| Risk | 4/25 | Input validation and readiness reuse |
| Research | 1/20 | Existing handler patterns should guide implementation |
| **Total** | **11/70** | **Level 2 for QA coordination** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at scaffold time.
<!-- /ANCHOR:questions -->
