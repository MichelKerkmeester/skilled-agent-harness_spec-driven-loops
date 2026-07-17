---
title: "Feature Specification: Symlink Retirement and Validation"
description: "Phase S5: prove all no-alias cases, retire the specs alias, and run the full R1–R10 × L1–L4 validation matrix including fault injection."
trigger_phrases:
  - "symlink retirement"
  - "no-alias validation"
  - "root resolution validation matrix"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Symlink Retirement and Validation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening` |
| **Predecessor** | `004-reader-normalization` |
| **Successor** | None (terminal) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `specs` alias was already deleted in the working tree ahead of plan. This terminal phase must prove the system is correct without it across platforms, formalize the removal, and run the full validation matrix so the fix holds with and without the alias.

### Purpose
Prove all no-alias / plain-file / dangling / misdirected cases pass, commit the alias removal, and execute the R1–R10 × L1–L4 matrix (including migration/rollback fault injection) with a captured before/after strict-validate delta.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Prove R7 (dangling), R9 (plain file), R10 (misdirected) and the no-alias cases.
- Commit the alias removal (already deleted in the working tree).
- Run R1–R10 across L1 (source), L2 (clean dist), L3 (Linux/macOS/Windows), L4 (fault injection).
- Capture the before/after `validate.sh --strict` delta.

### Out of Scope
- Resolver/writer/reader changes (phases 001–004).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs` symlink | Delete | Formalize the already-applied working-tree removal |
| test fixtures + CI matrix | Create | R1–R10 × L1–L4 harness |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No-alias cases pass | R7/R9/R10 + no-alias rows green on all platforms |
| REQ-002 | Full R1–R10 × L1–L4 matrix green | Every mandatory cell passes; skips carry a named reason + count |
| REQ-003 | Alias removal committed | Tracked `specs` symlink removed; no re-materialization observed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Before/after strict-validate delta captured | Representative packets show no regression |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The system is correct with the alias absent across Linux/macOS/Windows.
- **SC-002**: No writer re-materializes `specs/` during or after retirement.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A pre-phase-003 writer re-materializes `specs/` | Split-brain returns | Retirement gated on phase 003 writer canonicalization landing |
| Dependency | Phases 001–004 complete | Retirement unsafe | 005 is terminal; runs last |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Are Linux/macOS/Windows CI runners available for the mandatory L3 rows, or must some skip with a recorded count?
<!-- /ANCHOR:questions -->
