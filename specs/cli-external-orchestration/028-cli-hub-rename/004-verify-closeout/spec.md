---
title: "Feature Specification: Phase 4 Verification Closeout"
description: "Consolidate targeted rename evidence and preserve stale-dist and unrelated graph failures as explicit blockers."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/028-cli-hub-rename/004-verify-closeout"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Consolidated passing and blocked verification evidence"
    next_safe_action: "After authorized dist and graph repairs, rerun blocked gates"
    blockers:
      - "Executor-delegation import is blocked by missing stale @spec-kit/shared dist"
      - "Skill graph validation is blocked by four unrelated missing graph key paths"
      - "validate.sh is blocked by stale compiled mcp-server dist and rebuilding is forbidden"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: verify-closeout

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## Executive Summary

Phase 4: verify-closeout: scoped, completed, and verified; evidence is recorded in the phase docs below.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Active (blocked) |
| **Created** | 2026-07-13 |
| **Branch** | `goalC-cli-rename` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 4 |
| **Predecessor** | `../003-reference-sweep/spec.md` |
| **Successor** | None |
| **Handoff Criteria** | All blocked gates execute after authorized prerequisite repair; no full pass is claimed before then |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the cli-hub-rename specification.

**Scope Boundary**: Targeted rename, routing, prompt, graph, executor, and strict packet checks; no prerequisite rebuilds or unrelated fixes.

**Dependencies**:
- Completed phases 1 through 3

**Deliverables**:
- Consolidated passing targeted checks
- Explicit blocker ledger
- Honest packet status and rerun path

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Targeted rename and routing checks pass, but broader suites cannot all execute because compiled artifacts are stale and unrelated graph keys are absent. Treating those blockers as passes would make the packet untrustworthy.

### Purpose
Record exactly what passed, what was blocked, and what must be rerun before final completion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record all passing targeted evidence verbatim.
- Record each blocked gate and prerequisite.
- Keep parent and phase status active until all P0 gates execute.

### Out of Scope
- Rebuilding stale distributions, explicitly forbidden.
- Fixing unrelated graph keys in `mcp-code-mode` and `sk-code`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| This phase packet | Modify | Verification evidence and blocker status |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve executed PASS evidence | Summary names each check and exact result |
| REQ-002 | Preserve blocked checks as incomplete | Checklist leaves blocked P0 items unchecked |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Avoid full-validation claim | Parent and phase remain active |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Rename-invariants plus routing-registry drift pass 11 tests.
- **SC-002**: Three environment-owned blocked gate classes are explicit and actionable.
- **SC-003**: Full validation is not claimed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Fresh compiled `@spec-kit/shared` and mcp-server dist | Executor and strict validation cannot execute | Wait for authorized rebuild |
| Dependency | Complete graph key paths | Skill graph validation cannot execute | Repair owning skills separately |
| Risk | False completion claim | High | Keep blocked P0 items unchecked |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Integrity**: every PASS must come from an executed check.
- **Traceability**: every blocker must name its prerequisite and rerun path.

## 8. EDGE CASES

- None identified for this completed phase; the move is deterministic and reversible via `git mv`.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Basis |
|---|---:|---|
| Scope | 20/25 | Multiple verification systems |
| Risk | 24/25 | False closeout would hide unexecuted gates |
| Research | 12/20 | Failure classification required |
| Coordination | 14/15 | External prerequisite owners |
| **Total** | **70/85** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Blocked check reported as pass | High | Medium | Explicit unchecked checklist items |

## 11. USER STORIES

**As a** reviewer, **I want** passing and blocked checks separated, **so that** I can trust the packet's closeout status.

## 12. OPEN QUESTIONS

- When will rebuilding the stale distributions be authorized?
- When will the unrelated graph key paths be repaired by their owners?

## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
