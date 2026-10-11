---
title: "Feature Specification: Phase 2: hooks-readme-voice"
description: "Bring the HVR hard blockers in both hooks READMEs to 0 without changing a technical claim."
trigger_phrases:
  - "hooks readme voice"
  - "phase 2 hooks readme voice"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: hooks-readme-voice

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
| **Branch** | `worktrees/099-residual-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-package-strict |
| **Successor** | 003-admission-gold |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the residual closeout phase parent. It closes item 2 of the residual list: the HVR hard blockers in the hooks README.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Bring the HVR hard blockers in both hooks READMEs to 0 without changing a technical claim.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 015 ledger recorded seven HVR hard blockers in `.skilled/skills/system-spec-kit/runtime/hooks/README.md` and left them, because they predated that phase. The hub README at `.skilled/hooks/README.md`, the other file the operator named, carries fifteen more. Every one is a semicolon join.

### Purpose
Both READMEs scan with 0 hard blockers, and every path, command, count and claim reads as before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The seven semicolons in the system-spec-kit runtime hooks README
- The fifteen semicolons in the `.skilled/hooks/` hub README
- The system-spec-kit release that carries the README change

### Out of Scope
- Soft deductions and Oxford-comma candidates the scanner reports for review only
- Semicolons inside code blocks

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/README.md` | Modify | Seven rewrites |
| `.skilled/hooks/README.md` | Modify | Fifteen rewrites |
| system-spec-kit `SKILL.md`, `changelog/v2.7.9.0.md`, Hermes copy | Modify, Create | Release 2.7.9.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No hard blocker remains in either README | hvr_scan.py prints hard blockers 0 for both |
| REQ-002 | No technical claim changes | A word diff shows only punctuation and joining words |

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
