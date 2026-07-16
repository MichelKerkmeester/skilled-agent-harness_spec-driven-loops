---
title: "Feature Specification: Phase 2: injection-plugin [template:level_1/spec.md]"
description: "The goal plugin now passively injects a sanitized and fenced active goal block into OpenCode system context when a session has an active goal."
trigger_phrases:
  - "goal injection"
  - "active goal block"
  - "system transform"
  - "fail open injection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/002-injection-plugin"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented completed M1 injection implementation"
    next_safe_action: "Use injection_preview and transform behavior from the command phase"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
    session_dedup:
      fingerprint: "sha256:2d3e4184f24977d814d61ec62191acdc0fe1fee9beae85e6ff705262ee307277"
      session_id: "goal-m1-injection-plugin-20260629"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Injection is passive and fail-open; transform errors do not block chat"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: injection-plugin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `scaffold/002-injection-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-state-store |
| **Successor** | 003-goal-command |
| **Handoff Criteria** | Passive transform tests pass with sanitized `[active_goal]` injection, active-status gating, and fail-open behavior covered. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase turns stored goals into passive steering context. It reuses the Phase 1 state store and adds the OpenCode system transform surface without introducing autonomous continuation.

**Scope Boundary**: Own rendering and appending the passive `[active_goal]` block. Command routing, lifecycle accounting, supervisor verdicts, and active continuation remain separate phases.

**Dependencies**:
- Phase 1 state helpers in `mk-goal.js`.
- OpenCode `experimental.chat.system.transform` hook with `input` and `output.system`.

**Deliverables**:
- `renderGoalInjection` produces the exact fenced `[active_goal:<goalId>]` block for active goals.
- `appendGoalBrief` reads the current session goal and appends the rendered block once.
- `experimental.chat.system.transform` calls the append helper and fails open on missing state or transform errors.

**Changelog**:
- Passive goal injection is implemented in `mk-goal.js` and covered by the state plugin test.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Persisted goal state is inert unless the assistant receives it during a turn. The injection layer needed to expose the active objective in system context while preventing prompt injection, duplicate blocks, and chat failures caused by state read errors.

### Purpose
The plugin now passively injects a sanitized active goal block into OpenCode system context whenever a session has an active goal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Render a sanitized and length-capped `[active_goal:<goalId>]` block with status, objective, verifier state, usage, and directive lines.
- Append the injection block through `experimental.chat.system.transform` only when the stored goal status is `active`.
- Avoid duplicate blocks for the same goal id in `output.system`.
- Fail open when session id extraction, state read, or rendering cannot complete.

### Out of Scope
- `/goal` command routing and tool envelopes.
- Lifecycle usage accounting or budget transitions.
- Starting automatic continuation from the injection block.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Adds `renderGoalInjection`, `appendGoalBrief`, and `experimental.chat.system.transform`. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Create | Verifies status output includes `injection_preview` and the transform appends the same injection block. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inject only active goals. | `renderGoalInjection` returns an empty string for missing or non-active goals. |
| REQ-002 | Sanitize and fence the injected context. | The block uses `[active_goal:<goalId>]` and `[/active_goal]`, with objective and reason text sanitized and capped. |
| REQ-003 | Preserve chat availability when injection fails. | The transform catches errors and returns without throwing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Avoid duplicate injection for the same goal. | `appendGoalBrief` checks for the active goal marker before pushing to `output.system`. |
| REQ-005 | Make injection preview observable. | `mk_goal_status` and mutation outputs can render the same block through `injection_preview`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Setting a goal produces an `injection_preview` containing `[active_goal:<goalId>]`.
- **SC-002**: `experimental.chat.system.transform` appends the same preview block to `output.system`.
- **SC-003**: No block is appended when the session has no active goal.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stored objective text may contain prompt-injection language. | Injected context could alter higher-priority instructions. | Sanitize role labels, goal markers, fenced code, and instruction-overriding phrases before rendering. |
| Risk | Transform failures could block a chat turn. | `/goal` would become disruptive instead of passive. | Catch transform errors and fail open. |
| Risk | Repeated transform calls could duplicate context. | The model sees repeated goal directives in one turn. | Check for the existing `[active_goal:<goalId>]` marker before appending. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase.
<!-- /ANCHOR:questions -->
