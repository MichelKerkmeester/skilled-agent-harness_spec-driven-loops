---
title: "Feature Specification: Phase 3: doctrine-pass"
description: "sk-code's always-loaded restraint ladder lacks Ponytail 5's reuse step, and its implement workflow asks for a shorter reach list than Ponytail's before editing."
trigger_phrases:
  - "doctrine pass"
  - "phase 3 doctrine pass"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: doctrine-pass

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-09 |
| **Branch** | `scaffold/003-doctrine-pass` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-surface-contract-alignment |
| **Successor** | 004-webflow-checker-fix |
| **Handoff Criteria** | Ladder and implement workflow agree; always-loaded file size measured before and after |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-code Ponytail 5 refinement specification.

**Scope Boundary**: One edit pass over the restraint ladder and the implement workflow. No test reflex.

**Dependencies**:
- 002 surface contract alignment, which edits the same paragraph of `code-quality-standards.md`
- Section 6 of `../001-ponytail-deep-research/research/research.md`

**Deliverables**:
- A seven-rung ladder with the reuse step
- A full reach list in the implement workflow
- A pointer from the ladder to the P0 tier, with accessibility added
- Never-cut items pinned in the rule-copy canary

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Ponytail 5 asks whether a helper, component, service or pattern already exists in the codebase before reaching for the standard library. sk-code's implement workflow says to reuse existing helpers, but its always-loaded ladder does not, so the two drift. sk-code also asks only for nearby conventions, callers and examples before editing, where Ponytail lists callers, tests, fixtures, config and exports.

### Purpose
The ladder and the implement workflow state the same reuse-first order and the same reach list.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the reuse step as the second rung in `code-quality-standards.md:42-53`
- Align `workflow-implement.md:66` and `:73` with the new ladder
- Widen the reach list at `workflow-implement.md:51` to callers, tests, fixtures, config and exports
- Point the ladder at the P0 tier and add accessibility to it
- Pin the never-cut items in the rule-copy canary, and add `code-quality-standards.md` to the canary tamper test's copied files so each tamper case still fails for one reason
- Update the playbook ladder scenario and the canary README to the new rungs and coverage

### Out of Scope
- Ponytail's one-small-test reflex - weaker than the P1 coverage floor at `code-quality-standards.md:90`
- The codebase map hook - deferred until the reuse step is in use

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modify | Ladder, P0 pointer, accessibility |
| `.skilled/skills/sk-code/shared/references/workflow-implement.md` | Modify | Ladder summary, reach list |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modify | Pin never-cut items |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modify | Copy the newly checked file into the tamper tree |
| `.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md` | Modify | Seven rungs |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modify | Canary coverage and output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ladder and workflow agree | Both files list the same rungs in the same order |
| REQ-002 | Coverage floor kept | `code-quality-standards.md` still carries the happy-path-plus-edge-case P1 rule unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Size measured | Always-loaded file size reported before and after |
| REQ-004 | Canary pins | The rule-copy canary fails when a never-cut item is removed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of the ladder alone sees the reuse step and what the ladder may not cut
- **SC-002**: The rule-copy canary and its tamper tests pass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The always-loaded file grows | Med | Replace the never-cut list with a pointer rather than a copy |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Accessibility joins P0, as the In Scope line says.
<!-- /ANCHOR:questions -->

---


