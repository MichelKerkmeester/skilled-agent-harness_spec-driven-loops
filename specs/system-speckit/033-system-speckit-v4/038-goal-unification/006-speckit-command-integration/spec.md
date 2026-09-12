---
title: "Feature Specification: Spec-kit command integration"
description: "Make speckit plan, implement, complete, resume and save read the packet goal, update the parent when a durable fact changes, resend the stripped slice in chat, and remind without blocking work."
trigger_phrases:
  - "speckit goal auto update"
  - "parent goal resend"
  - "goal reminder cadence"
  - "speckit plan goal integration"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Spec-kit command integration

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-runtime-surfaces |
| **Successor** | 007-retirement-docs-and-verification |
| **Handoff Criteria** | See the parent Phase Handoff Criteria row for this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Goal unification: packet goal.md as the single goal surface across runtimes specification.

**Scope Boundary**: Every speckit command that changes a durable fact updates the parent goal, resends the stripped slice, and keeps reminding until set, while work continues.

**Dependencies**:
- 005-runtime-surfaces Complete

**Deliverables**:
- `.opencode/commands/speckit/{plan,implement,complete,resume,save}.md` goal steps
- `assets/speckit-plan.yaml` dispatch_by_runtime and objective_shape rewrite
- Natural-language triggers routed the same way

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No speckit command reads or updates goal.md. The resend rule is prose, and the objective-shape rule in speckit-plan.yaml says never a file body, which reads as forbidding the chat resend.

### Purpose
Every speckit command that changes a durable fact updates the parent goal, resends the stripped slice, and keeps reminding until set, while work continues.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/commands/speckit/{plan,implement,complete,resume,save}.md` goal steps
- `assets/speckit-plan.yaml` dispatch_by_runtime and objective_shape rewrite
- Natural-language triggers routed the same way
- `.claude/commands/speckit/*` mirrors if present
- `AGENTS.md` goal posture row and Quick Reference entry per ADR-8, wording shown to the operator first

### Out of Scope
- Hook code (004, 005)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/speckit/plan.md` | Modify | Goal read, update, resend |
| `.opencode/commands/speckit/implement.md` | Modify | Same |
| `.opencode/commands/speckit/complete.md` | Modify | Same |
| `.opencode/commands/speckit/resume.md` | Modify | Goal read and reminder |
| `.opencode/commands/speckit/save.md` | Modify | Goal log update |
| `.opencode/commands/speckit/assets/speckit-plan.yaml` | Modify | dispatch_by_runtime, objective_shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A decision, binding or criterion change through any of the five commands updates the parent goal.md and resends the stripped slice | Playbook: edit a decision via plan, observe resend |
| REQ-002 | When the operator has not set the goal, the next command turn reminds and continues | Playbook: skip set, observe reminder and no halt |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Resend triggers on durable-slice hash change, never on log edits | Playbook: log edit produces no resend |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five command files carry the goal steps and validate through the command contract compiler
- **SC-002**: speckit-plan.yaml objective_shape no longer contradicts the resend
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Resend spam | Operator fatigue | Hash of the durable slice as the trigger, dedup per session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Reminder cadence: every turn, every N turns, or on command entry only (ADR-4 decides)
<!-- /ANCHOR:questions -->

---


