---
title: "Phase 002 Library Implementation: Code Graph HLD/LLD"
description: "Implement code-graph-hld-lld.ts against the published contract."
trigger_phrases:
  - "027 phase 002 lib impl"
  - "code-graph-hld-lld implementation"
importance_tier: "important"
contextType: "implementation"
depends_on:
  - "001-contract"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded library child spec"
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
      session_id: "codex-2026-05-12-027-002-002-lib-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: 002 Library Implementation

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

The parent packet needs deterministic HLD/LLD output, but implementation should not proceed until the public contract exists. This child owns the generator behavior after `001-contract` publishes types and signatures.

### Purpose

Implement `mcp_server/code_graph/lib/code-graph-hld-lld.ts` so it derives file role, layer, summary, primary symbols, and per-symbol LLD records from existing code_graph data using deterministic templates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Implement `generateHLD(filePath, db)`.
- Implement `generateLLD(symbolId, db)`.
- Implement `generateFileNarrative(filePath, db)`.
- Implement `classifyFileRole(filePath, db)`.
- Implement stable sorting before caps.
- Implement primary module selection.
- Implement one explicit dangling-edge policy.
- Implement layer classification and complexity hints.

### Out of Scope

- MCP handler and tool registration.
- Handler serialization and omni input parsing.
- Test fixture authoring beyond implementation support.
- Any schema migration or parser/indexer change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/lib/code-graph-hld-lld.ts` | Create | Deterministic HLD/LLD generator and helper implementation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `generateHLD(filePath, db)` returns deterministic HLD payload | Identical DB input produces identical output across repeated calls. |
| REQ-002 | `generateLLD(symbolId, db)` returns deterministic LLD payload | Missing symbols return null; existing symbols populate required fields. |
| REQ-003 | Stable ordering happens before caps | Sort order is `kind priority -> start_line -> name -> symbol_id`. |
| REQ-004 | Dangling-edge policy is implemented | Unresolved endpoints are either filtered or emitted as structured unresolved records. |
| REQ-005 | Primary module selection is deterministic | Prefer synthetic `fq_name === getModuleName(filePath)`, then lowest `start_line`, then `symbol_id`. |
| REQ-006 | `classifyFileRole` export matches HLD role | `generateHLD(file, db).file_role` equals `classifyFileRole(file, db)`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Layer classification covers baseline tiers | Presentation, business, data, and utility examples can be classified. |
| REQ-008 | Complexity hints include high fan-in | Fan-in above threshold emits a high-fan-in hint. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The generator returns JSON-serializable `{hld, lld, summary}` data for indexed files.
- **SC-002**: The handler child can call the library through the public contract.
- **SC-003**: The test child can cover deterministic ordering, dangling edges, primary module selection, and classifier equality.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-contract` | Implementation cannot safely start | Wait for contract validation |
| Risk | Heuristic role or layer drift | Consumers receive unstable labels | Keep baseline labels documented and tests focused on contract behavior |
| Risk | N+1 edge queries | Large files perform poorly | Prefer file-scoped collection and batchable helpers where available |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `generateFileNarrative()` should complete in under 100ms p95 on a 500-symbol file.
- **NFR-P02**: Avoid an obvious N+1 query pattern for per-symbol edge collection.

### Reliability
- **NFR-R01**: Output is deterministic for identical DB state.
- **NFR-R02**: Missing file or symbol cases return structured null/error-compatible values.

### Maintainability
- **NFR-M01**: Template strings and thresholds are centralized.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or comment-only files return role `empty`.
- 1000+ symbol files are sorted before LLD caps.

### Error Scenarios
- Missing file row returns a structured not-indexed result.
- Dangling edge endpoints follow the documented policy.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One generator library with deterministic helpers. |
| Risk | 6/25 | Ordering and dangling-edge behavior are correctness-sensitive. |
| Research | 2/20 | Parent research already exists. |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The unresolved-edge policy must be selected during implementation, as already required by the parent packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Contract**: `../001-contract/spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
