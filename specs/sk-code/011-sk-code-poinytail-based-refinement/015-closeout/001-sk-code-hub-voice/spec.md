---
title: "Feature Specification: Phase 1: sk-code-hub-voice"
description: "Rewrite the 36 sentences the human-voice scan blocks in the sk-code hub SKILL.md without changing what the hub routes, and bump the hub once."
trigger_phrases:
  - "sk code hub voice"
  - "phase 1 sk code hub voice"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: sk-code-hub-voice

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
| **Phase** | 1 of 9 |
| **Predecessor** | None |
| **Successor** | 002-goal-criteria-refresh |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the epic closeout phase parent. It closes item 1 of the closeout list, the 36 human-voice hard blockers in the sk-code hub SKILL.md.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Rewrite the 36 sentences the human-voice scan blocks in the sk-code hub SKILL.md without changing what the hub routes, and bump the hub once.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The human-voice scan reports 36 hard blockers in `.skilled/skills/sk-code/SKILL.md`: 27 semicolons and 9 em dashes. The 013 research deferred the sweep as internal voice debt.

### Purpose
The hub doc scans at 0 hard blockers while router sync, the doctor, the compiled-route guard and both advisor batteries report what they reported before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 36 flagged sentences of the hub SKILL.md
- The hub's six version carriers, its changelog, the re-minted compiled-route manifest and its authored copy, and the Hermes copy

### Out of Scope
- Any change to routing meaning, mode tables or rules
- Soft HVR deductions and review candidates, which do not block

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/SKILL.md` | Modify | Sentences rewritten |
| sk-code ROUTER.md, README.md, description.json, hub-router.json, mode-registry.json | Modify | Version 2.2.10.0 |
| `.skilled/skills/sk-code/changelog/v2.2.10.0.md` | Create | Release note |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json and its authored copy` | Modify | Re-minted for the new inputs |
| `.hermes/skills/sk-code/SKILL.md` | Modify | Regenerated copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The hub SKILL.md has no HVR hard blocker | hvr_scan.py prints hard blockers 0 |
| REQ-002 | Routing is unchanged | router sync, the doctor and the guard pass, and both batteries match the baseline |

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
