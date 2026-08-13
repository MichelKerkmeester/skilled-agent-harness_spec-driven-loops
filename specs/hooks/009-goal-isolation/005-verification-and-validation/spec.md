---
title: "Final Phase: Goal Isolation Verification and Validation"
description: "Verified concurrent-session isolation, runtime truth, legacy safety, regressions, and Pi goal-extension rollout from the final integrated state."
status: "complete"
trigger_phrases:
  - "goal isolation verification"
  - "concurrent goal validation"
  - "pi goal re-enable gate"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation/005-verification-and-validation"
    last_updated_at: "2026-08-10T15:19:41Z"
    last_updated_by: "codex"
    recent_action: "Final verification and Pi rollout completed"
    next_safe_action: "Monitor session-isolated goals during normal Pi use"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Goal Isolation Verification and Validation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-10 |
| **Branch** | Current working branch |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 6 |
| **Predecessor** | `004-legacy-cutover-and-docs` |
| **Successor** | `006-opencode-goal-optimization-and-devin-removal` |
| **Handoff Criteria** | Full isolation and regression gates pass, documentation and metadata agree, and the operator-visible Pi re-enable/rollback decision is evidence-backed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Scope Boundary**: verification fixtures, evidence, checklist reconciliation, final metadata, and the Pi re-enable decision. Any failing behavior returns to its owning implementation phase instead of being patched ad hoc here.

**Dependencies**:
- Phases 2 through 4 report complete with focused evidence.
- Pi goal extension remains disabled until this phase authorizes re-enable.

**Deliverables**:
- Automated two-session and cross-runtime action matrix.
- Live Pi two-session transcript canaries when safe.
- Legacy, privacy, permissions, concurrency, registration, and documentation validation.
- Recursive strict packet validation and final acceptance record.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The final integrated checks now prove that native Pi management, scoped persistence, adapter injection, legacy cutover, registrations, and operator documentation use the same session-isolated contract.

### Purpose

The final phase proved the user boundary through persisted state and adapter injection, reconciled completion evidence, and re-enabled Pi after the P0 goal-isolation gates passed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Run session A/B lifecycle actions and verify non-owner state remains unchanged.
- Run same-id/different-runtime and same-id/different-workspace collision rows.
- Validate missing identity, resume, fork, malformed state, legacy-only, and repeated migration behavior.
- Inspect raw Pi transcripts for goal canary separation.
- Run focused goal, OpenCode plugin, runtime config, docs, and authoritative workspace gates.
- Verify exact artifacts, metadata, scoped diff, and absence of task-created residue.
- Decide whether to remove the Pi exclusion or keep the extension disabled with a blocker.

### Out of Scope

- Adding new features or broadening runtime support.
- Silently accepting known failures or treating focused checks as the full gate.
- Automatically re-enabling Pi when any P0 check is incomplete.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Verification fixtures/evidence under goal test surfaces | Modify/Create | Integrated matrix and receipts. |
| `.pi/settings.json` | Conditional Modify | Remove the exclusion only after every P0 acceptance gate passes. |
| Phase and parent docs/metadata | Update | Reconcile evidence, status, continuity, and completion claims. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full two-session lifecycle isolation passes. | Set, show, inject, record, verify, pause, resume, complete, clear, history, doctor, and health in A never expose or mutate B. |
| REQ-002 | Real Pi injection and management share one native identity. | Distinct A/B canaries remain separated in raw transcripts and persisted paths. |
| REQ-003 | Legacy and missing-identity paths are safe. | Neither can inject or mutate a goal without explicit validated ownership. |
| REQ-004 | All authoritative regression and configuration gates pass. | Focused goal suites, OpenCode goal plugin tests, registrations, docs, and recursive strict validation exit 0. The sk-code wrapper receipt is captured; its documented global-backlog case requires a zero-finding packet-scoped delta. |
| REQ-005 | Pi re-enable is gated on evidence. | `.pi/settings.json` exclusion is removed only after REQ-001 through REQ-004 pass; otherwise the disabled state and blocker remain documented. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Performance and privacy constraints are checked. | Scoped reads avoid repository scans; modes are restrictive; raw ids do not appear in paths/default output. |
| REQ-007 | Final packet state is internally consistent. | Parent map, child statuses, tasks, evidence, summaries, description files, and graph metadata agree. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The exact original symptom cannot be reproduced: goal B no longer replaces or injects into session A.
- **SC-002**: Every retained runtime passes its documented end-to-end identity contract.
- **SC-003**: The Pi extension is either re-enabled after all gates pass or remains disabled with an explicit failing receipt.
- **SC-004**: Recursive strict validation reports zero errors and zero warnings from final state.
- **SC-005**: Scoped diff contains only approved runtime, test, config, documentation, and packet changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Test-only isolation differs from live Pi | False confidence and cross-session steering on rollout. | Require raw transcript canaries before re-enable. |
| Risk | Dirty worktree obscures scoped changes | Unrelated edits may be misattributed or overwritten. | Inspect scoped status/diff only and preserve all unrelated work. |
| Risk | Completion metadata outruns evidence | Future sessions resume from a false state. | Reconcile all child and parent surfaces after final commands run. |
| Dependency | Stable native session ids in live Pi | Live proof cannot complete without them. | Keep Pi disabled and report the exact blocker. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No questions remain open.

- The authoritative non-spec command is `run-all-drift-guards.sh`. Its repository-wide alignment guard reports the known global backlog; the required packet delta scanned eight changed code/test files with zero findings, while stack-folder and router-sync guards passed.
- Pi was re-enabled immediately after the goal-specific P0 gates passed, matching the requested rollout sequence. The rollback is to restore the single exclusion entry in `.pi/settings.json`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Prior phase**: `../004-legacy-cutover-and-docs/spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
