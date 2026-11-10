---
title: "Feature Specification: Phase 9: open-items-ledger"
description: "Give every remaining open item a final state, fixed with a check or closed with a reason, and fix the ones a gate run surfaced."
trigger_phrases:
  - "open items ledger"
  - "phase 9 open items ledger"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: open-items-ledger

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
| **Phase** | 9 of 9 |
| **Predecessor** | 008-advisor-residuals-and-surface-hint |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the epic closeout phase parent. It closes items 11 and 13 of the closeout list, and every Known Limitation in the 012, 013, 014 and 066 trees.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Give every remaining open item a final state, fixed with a check or closed with a reason, and fix the ones a gate run surfaced.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 012, 013, 014 and 066 trees list about fifty Known Limitations, many handed to the master orchestrator or a hub owner. A gate run also surfaced a failing scaffold test, five failing deep-loop runtime tests from stale command-contract digests, a stale hub README version and two hub releases the catalog track handed off.

### Purpose
One ledger names every item with its state and its evidence or reason, and each surfaced failure is fixed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The ledger in this phase's implementation summary
- The parent-hub scaffold in init_skill.py
- The deep command contracts
- The system-deep-loop hub release and README version
- Lines in the unreleased cli-classifier, mcp-tooling and sk-create-skill entries

### Out of Scope
- Package findings in 13 units whose files are unchanged since origin/main
- Doctor alias and README warnings in hubs this closeout did not release
- Merging and pushing

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | Modify | Scaffold lists its aliases as keywords |
| `.skilled/commands/deep/assets/compiled/*.contract.md` | Modify | Recompiled |
| `system-deep-loop carriers, README.md, changelog/v1.5.6.0.md, manifests, Hermes copy` | Modify, Create | Hub release 1.5.6.0 |
| cli-classifier v0.8.1.0, mcp-tooling v1.8.1.0, sk-create-skill v1.5.2.0 changelogs | Modify | Handed-off work listed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every item has a state | The ledger lists each closeout item and each Known Limitation |
| REQ-002 | Surfaced failures are fixed | create-journey-proof and the deep-loop contract tests pass |

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
