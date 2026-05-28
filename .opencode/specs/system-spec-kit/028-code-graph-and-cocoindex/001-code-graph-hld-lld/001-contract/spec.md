---
title: "Phase 001 Contract: Code Graph HLD/LLD"
description: "Define the TypeScript contract for deterministic code_graph HLD/LLD generation."
trigger_phrases:
  - "027 phase 002 contract"
  - "hld lld contract"
  - "HldLldClassifier"
importance_tier: "important"
contextType: "implementation"
depends_on: []
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/001-contract"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded contract child spec"
    next_safe_action: "Implement TypeScript contract exports"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-001-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: 001 Contract

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
| **Depends On** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The HLD/LLD generator, handler, and tests need a shared TypeScript contract before they can proceed in parallel. Without the contract child, downstream phases may disagree on role labels, dependency records, sort guarantees, or serialized payload shape.

### Purpose

Publish the minimal contract for deterministic HLD/LLD generation: `HldLldClassifier`, `FileRole`, request/response payload types, supporting HLD/LLD records, and the stable sort contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Define `HldLldClassifier`.
- Define `FileRole` enum for required baseline and reserved labels while preserving open-string consumer semantics.
- Define supporting types for HLD payloads, LLD payloads, dependency records, unresolved dependency policy, and classifier inputs.
- Document deterministic ordering guarantees needed before capped lists.

### Out of Scope

- Generator implementation beyond type exports.
- MCP handler implementation.
- Tool registration.
- Vitest fixtures.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/lib/code-graph-hld-lld.ts` | Create | Export public contract and placeholders needed by children |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Export `HldLldClassifier` | Downstream children can import the interface from `code-graph-hld-lld.ts`. |
| REQ-002 | Export `FileRole` enum | Baseline labels include `module`, `api-handler`, `library`, `test`, `config`, and reserved edge label `empty`. |
| REQ-003 | Preserve open-string role contract | Public payload type allows future string labels beyond the enum values. |
| REQ-004 | Export supporting payload types | HLD, LLD, dependency, unresolved dependency, and complexity hint types are available. |
| REQ-005 | Export deterministic sort contract | Contract documents `kind priority -> start_line -> name -> symbol_id` ordering before caps. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Pin `classifyFileRole(filePath, db)` signature | Type signature is importable by handler, tests, and downstream Phase 003. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `002-lib-impl`, `003-handler`, and `004-test` can import the contract without private implementation knowledge.
- **SC-002**: Role labels are explicit but consumers are not forced into a closed enum domain.
- **SC-003**: Contract docs capture every audit constraint that downstream children must test or implement.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Closed enum drift | Downstream consumers reject future role labels | Keep enum as baseline constants and payload type as open string |
| Risk | Contract under-specifies unresolved edges | Library and tests diverge | Include unresolved dependency type and policy field in contract |
| Dependency | Existing code graph types | Contract must align with current graph rows | Import or mirror only stable public graph concepts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Contract names should describe wire behavior, not private implementation details.
- **NFR-M02**: Type exports should be stable enough for Phase 003 trace work to reuse.

### Reliability
- **NFR-R01**: Sorting and role-domain rules are documented in types or adjacent comments.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty files use reserved role label `empty`.
- Future role labels remain valid open strings.

### Error Scenarios
- Missing file and missing symbol results must be representable without throwing raw errors.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Type exports only. |
| Risk | 4/25 | Cross-phase contract drift risk. |
| Research | 1/20 | Parent research already exists. |
| **Total** | **9/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The orchestrator supplied the child decomposition and dependency graph.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
