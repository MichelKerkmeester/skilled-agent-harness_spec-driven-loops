---
title: "Feature Specification: Phase 5: historical-record-reference-sweep"
description: "cli-devin is mentioned in ~1760 historical files (specs/**, changelog/**, benchmark state/eval). The operator initially requested removing a"
trigger_phrases:
  - "cli-devin deprecation phase 5"
  - "historical-record-reference-sweep"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-cli-devin-deprecation/005-historical-record-reference-sweep"
    last_updated_at: "2026-06-08T17:34:13.174Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 5 complete: historical-record-reference-sweep executed and verified"
    next_safe_action: "Proceed to phase 6"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: historical-record-reference-sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-docs-agents-governance-removal |
| **Successor** | 006-delete-skill-directory-and-verify |
| **Handoff Criteria** | Coherently-editable historical refs handled (none beyond active set) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the cli-devin deprecation specification. The verified, line-resolved edit list lives in ../context/context-report.md §2.

**Scope Boundary**: Audit the historical surface for any coherently-editable active-state reference under specs/

**Dependencies**:
- Predecessor phase 004-docs-agents-governance-removal complete

**Deliverables**:
- Audit the historical surface for any coherently-editable active-state reference under specs/

**Changelog**:
- Phase work recorded in implementation-summary.md.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-devin is mentioned in ~1760 historical files (specs/**, changelog/**, benchmark state/eval). The operator initially requested removing all occurrences including history.

### Purpose
Apply the operator's broad-removal intent to the extent the Four Laws permit: edit coherently-editable references; preserve immutable records of completed work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit the historical surface for any coherently-editable active-state reference under specs/

### Out of Scope
- Narrative historical spec/plan/iteration docs (editing falsifies records of completed work)
- Machine-generated benchmark/eval *.jsonl + per-probe + eval outputs (editing corrupts recorded data)
- Spec packets whose subject IS cli-devin (z_archive/104-cli-devin-creation, 113, 135/004)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `(none edited)` | Leave | Historical records preserved per Four Laws honesty/no-fabrication mandate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No active-state historical reference left editable-but-stale | verified: descriptions.json entries are historical spec rows |
| REQ-002 | Audit trail integrity preserved | ~1760 narrative/benchmark records left intact with documented rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Coherently-editable historical refs handled (none beyond active set)
- **SC-002**: Immutable records preserved + rationale documented
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Predecessor phase 004-docs-agents-governance-removal | Blocks start | Completed before this phase |
| Risk | Dangling reference after edits | Med | Global grep verification + deep review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — phase complete and verified.
<!-- /ANCHOR:questions -->
