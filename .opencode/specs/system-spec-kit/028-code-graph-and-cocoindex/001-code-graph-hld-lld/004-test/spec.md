---
title: "Phase 004 Tests: Code Graph HLD/LLD"
description: "Author Vitest coverage for the deterministic HLD/LLD contract and behavior."
trigger_phrases:
  - "027 phase 002 tests"
  - "code-graph-hld-lld vitest"
importance_tier: "important"
contextType: "implementation"
depends_on:
  - "001-contract"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded test child spec"
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
      session_id: "codex-2026-05-12-027-002-004-test-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: 004 Tests

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

The HLD/LLD layer has determinism and wire-contract risks that are easy to miss with smoke tests. The tests need to target the contract so they can be prepared in parallel after `001-contract` ships.

### Purpose

Create `mcp_server/tests/code-graph-hld-lld.vitest.ts` with fixtures for deterministic ordering, dangling edges, primary module selection, role contract behavior, JSON serialization, and handler integration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Tests for deterministic output across repeated runs and large symbol sets.
- Tests for dangling-edge policy.
- Tests for primary module selection.
- Tests for `classifyFileRole` equality with HLD role.
- Tests for baseline file-role labels and layer tiers.
- Tests for JSON serialization.
- Handler-level JSON parse integration test if omni remains.

### Out of Scope

- Generator implementation.
- Handler implementation.
- Performance benchmarking beyond fixture-scale determinism.
- Snapshot tests that bless unstable ordering.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/code-graph-hld-lld.vitest.ts` | Create | Contract, generator, and handler coverage for HLD/LLD |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deterministic-order fixture | 100+ repeated calls over 1000+ symbols produce identical capped output. |
| REQ-002 | Dangling-edge fixture | Missing edge endpoint follows the selected policy. |
| REQ-003 | Primary-module fixture | Synthetic module wins over captured module-like symbols. |
| REQ-004 | Classifier equality fixture | `classifyFileRole(file, db)` equals HLD `file_role`. |
| REQ-005 | Serialization fixture | `JSON.stringify(result)` succeeds. |
| REQ-006 | Handler integration fixture | `code_graph_hld_lld` handler returns parseable JSON. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Baseline role fixtures | module, api-handler, library, test, config, and empty labels are covered. |
| REQ-008 | Layer tier fixtures | presentation, business, data, and utility examples are covered. |
| REQ-009 | High fan-in fixture | Complexity hint appears above threshold. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Tests prove deterministic behavior and contract conformance.
- **SC-002**: Handler JSON behavior is covered if the handler child keeps omni integration.
- **SC-003**: Coverage reaches at least 80 percent for new HLD/LLD code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-contract` | Tests cannot compile against public types | Wait for contract validation |
| Dependency | `002-lib-impl` | Generator behavior unavailable | Author fixtures against contract, run after implementation |
| Dependency | `003-handler` | Handler integration unavailable | Keep handler tests isolated and runnable after handler lands |
| Risk | Tests overfit private helpers | Refactors become expensive | Prefer public contract calls |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Tests should not depend on SQLite row insertion order for expected output.

### Maintainability
- **NFR-M01**: Fixtures should be small except for the explicit large determinism fixture.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty file.
- 1000+ symbol file.
- Missing symbol ID.

### Error Scenarios
- Dangling edge endpoint.
- Malformed handler input.
- Optional omni serialization path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One focused Vitest suite with generator and handler coverage. |
| Risk | 6/25 | Flaky determinism tests are the main risk. |
| Research | 2/20 | Parent research already exists. |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Test details depend on the contract and implementation children.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Contract**: `../001-contract/spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
