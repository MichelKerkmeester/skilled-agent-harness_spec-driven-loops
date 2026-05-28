---
title: "Phase 002.004 — code_graph_trace Tests"
description: "Level 2 child packet for code-graph-trace.vitest.ts tests against the trace contract."
trigger_phrases:
  - "027 phase 003 test"
  - "code_graph_trace test"
  - "trace vitest"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for trace tests"
    next_safe_action: "Implement contract-driven trace tests after local contract publishes"
    blockers:
      - "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/001-contract"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-004-test-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: code_graph_trace Tests

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
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace` |
| **Depends on** | `001-contract` |
| **Estimated LOC** | ~80 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The trace tool is correctness-sensitive because sparse containment, filePath ownership, role equality, and depth caps are easy to regress. Tests should target the contract rather than incidental implementation details.

### Purpose
Create `code-graph-trace.vitest.ts` tests that prove the trace contract across sparse symbols, nested classes, classifier equality, missing symbols, and truncation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Contract-driven Vitest tests.
- Sparse-containment fixtures.
- Nested-class fqName prefix regression.
- Role equality with Phase 001 classifier.
- Depth cap and structured error tests.

### Out of Scope
- Resolver implementation.
- Handler implementation except through integration assertions if available.
- Coverage for optional cache/package tables unless they ship.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/code-graph-trace.vitest.ts` | Create | Trace contract and behavior tests. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Test sparse-containment behavior. | Top-level, Bash/doc, module, and default-export shapes still return file and role. |
| REQ-002 | Test nested-class matching. | Parent match uses `class.fqName + "."`, not short name. |
| REQ-003 | Test classifier equality. | Trace `architectural_role` equals Phase 001 role for the same file. |
| REQ-004 | Test depth cap. | Over-depth traces set `truncated: true`. |
| REQ-005 | Test missing symbol errors. | Missing symbol returns structured error behavior. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Track coverage for new trace code. | Coverage reaches at least 80 percent for new Phase 002 implementation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run code-graph-trace.vitest.ts --coverage` passes when implementation is present.
- **SC-002**: Tests prove filePath ownership and Phase 001 role equality.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local contract | Test target can drift | Write tests against `001-contract`. |
| Risk | Tests overfit implementation details | Refactors become noisy | Assert contract behavior and public helpers only. |
| Risk | Phase 001 unavailable | Role equality blocked | Use typed doubles only until upstream implementation is merged, then switch to real classifier. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-Q01**: Tests should be deterministic and avoid process-global state leakage.
- **NFR-C01**: Coverage target is at least 80 percent for new trace code.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Symbol with no incoming CONTAINS edge.
- Bash/doc symbol with minimal metadata.
- Nested class with ambiguous short name.
- Missing symbol id.
- Chain exceeding max depth.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One Vitest file |
| Risk | 6/25 | Fixtures must mirror graph edge semantics |
| Research | 2/20 | Parent packet defines known regressions |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at scaffold time.
<!-- /ANCHOR:questions -->
