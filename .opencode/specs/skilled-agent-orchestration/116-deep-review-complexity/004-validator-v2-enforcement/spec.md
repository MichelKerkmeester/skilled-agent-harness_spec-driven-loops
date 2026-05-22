---
title: "Feature Specification: 116/004 — Validator v2 Enforcement"
description: "Add warning/advisory support and strict validation for explicit review-depth v2 records."
trigger_phrases:
  - "validator v2 enforcement"
  - "post-dispatch searchLedger validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/004-validator-v2-enforcement"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 004 planning packet."
    next_safe_action: "Implement warnings before strict v2 hard failures."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1160040000000000000000000000000000000000000000000000000000000000"
      session_id: "116-004-validator-v2-enforcement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 116/004 — Validator v2 Enforcement

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 8 |
| **Predecessor** | `../003-review-depth-schema-and-prompt-contract/spec.md` |
| **Successor** | `../005-search-ledger-persistence-and-reporting/spec.md` |
| **Handoff Criteria** | Legacy records warn; explicit v2 shallow records fail; valid v2 records pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase gives the v2 schema teeth without breaking legacy packet readability.

**Scope Boundary**: Post-dispatch validation and tests only.

**Dependencies**:
- Phase 002 fixtures.
- Phase 003 schema and prompt contract.

**Deliverables**:
- Validator warning/advisory result surface.
- Hard failures for bad v2 `findingsNew`, shallow `findingDetails`, missing/uncited/unlinked ledger rows, unsupported dispositions, and state/delta drift.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Current post-dispatch validation is mostly binary and shape-oriented. It cannot roll out v2 review-depth obligations gradually or reject fake search proof.

### Purpose
Add warn-only legacy handling and strict v2 enforcement so explicit standard/complex review-depth records prove real search coverage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Warning/advisory validation output.
- Strict v2 search ledger and coverage checks.
- State-log and delta-file consistency checks.

### Out of Scope
- Reducer/dashboard persistence.
- Convergence stop decisions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` | Modify | Add warning surface and v2 checks. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts` | Modify | Add invalid/valid v2 assertions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve legacy readability. | Unversioned records can warn without hard failure. |
| REQ-002 | Enforce explicit v2 shape. | Bad `findingsNew` and shallow `findingDetails` fail. |
| REQ-003 | Enforce ledger semantics. | Missing evidence, bad disposition, broken links, and mismatched coverage fail. |
| REQ-004 | Compare state and delta records. | Identity and core counter mismatches fail for v2. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Invalid shallow v2 records fail validation.
- Valid rich v2 records pass validation.
- Legacy records remain readable with typed warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Hard failures break old packets. | Gate hard checks on explicit v2 applicability. |
| Dependency | Phase 003 contract. | Do not enforce fields before the canonical contract exists. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
