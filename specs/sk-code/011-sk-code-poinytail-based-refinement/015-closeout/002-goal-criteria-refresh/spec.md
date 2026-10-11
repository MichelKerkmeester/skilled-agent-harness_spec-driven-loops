---
title: "Feature Specification: Phase 2: goal-criteria-refresh"
description: "Rerun every completed goal criterion in the 011 and 066 trees against today's tree and amend each one that fails only because a name, count or version moved on, with a dated log row."
trigger_phrases:
  - "goal criteria refresh"
  - "phase 2 goal criteria refresh"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: goal-criteria-refresh

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/098-post-092-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 9 |
| **Predecessor** | 001-sk-code-hub-voice |
| **Successor** | 003-sk-git-playbook-changelog |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the epic closeout phase parent. It closes item 2 of the closeout list, every completed goal criterion in the 011 and 066 trees.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Rerun every completed goal criterion in the 011 and 066 trees against today's tree and amend each one that fails only because a name, count or version moved on, with a dated log row.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Completed goals in the 011 and 066 trees name scripts that were since renamed to kebab case, counts that later phases grew, branch ranges such as main..HEAD that are empty once merged, and versions that later bumps replaced. Those criteria fail today although the work they prove is still in place.

### Purpose
Every completed criterion in both trees passes when run against today's tree, and every amendment carries a dated row saying what changed and why.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every goal.md under specs/sk-code/011-sk-code-poinytail-based-refinement and specs/sk-doc/066-feature-catalog-template-anchor-deprecation
- The 005 router-sync prototype script, which still called the old script names

### Out of Scope
- Criteria of goals that are not complete
- Changing what any criterion proves: amendments only follow renames, growth and released versions

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| goal.md files in the 011 tree (42 goals) | Modify | 69 criteria amended, one log row each |
| goal.md files in the 066 tree (6 goals) | Modify | 6 criteria amended, one log row each |
| `007-follow-up-fixes/005-router-sync-guard/scratch/prototype/negative-controls.sh` | Modify | Calls verify-router-sync.cjs and router-replay-lib.cjs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every completed criterion passes today | Each amended command reran and printed what its criterion names |
| REQ-002 | Every amendment is dated | 75 rows of the form Criterion N amended 2026-10-11 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-090 | Strict validation of this phase passes | validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A change reaches a caller the phase did not name | Med | The gates named in goal.md are rerun from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
