---
title: "Feature Specification: Goal operator-copy resync rule"
description: "The nested goal system now tells the working agent to resend the parent goal.md in chat whenever its durable slice changes, so the operator's session objective never drifts from the file."
trigger_phrases:
  - "goal resync rule"
  - "operator copy of goal"
  - "parent goal resend in chat"
  - "nested goal amendment"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-goal-operator-resync-rule"
    last_updated_at: "2026-09-06T16:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Added the operator-copy resync rule to the goal addon and closed the packet"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Goal operator-copy resync rule

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An operator sets a session objective by pasting a packet's durable goal slice. The file keeps evolving as the agent amends decisions and criteria, but nothing told the agent to send the new text back, so the objective the runtime judged against silently fell behind the file.

### Purpose
The goal addon template and its playbook carry one rule: when anything above the log changes, resend the full parent goal.md in chat; a child change that alters a parent decision or criterion is amended in the parent first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An "Operator copy" paragraph inside the goal template's directive anchor, rendered for every level
- A playbook section on keeping the operator's copy current, with the child-to-parent amendment rule

### Out of Scope
- A validator rule - nothing can check what an operator pasted
- Runtime goal surfaces - the rule is agent behavior, not tooling

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | Modify | Operator copy paragraph |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modify | New section 5 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A freshly scaffolded goal.md carries the rule | the template rendered through `inline-gate-renderer.ts` at Level 2 and phase contains "Operator copy" and validates strict inside a scaffolded packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The playbook states the rule and the child-to-parent amendment order | Section present; document validates |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Template suites pass after the change
- **SC-002**: A scaffold probe with the goal addon renders the paragraph and validates strict
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing goal.md files predate the rule | They lack the paragraph | The playbook binds the agent regardless; packets get it at their next goal edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->
