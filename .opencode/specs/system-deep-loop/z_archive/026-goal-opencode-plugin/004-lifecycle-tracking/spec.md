---
title: "Feature Specification: Phase 4: lifecycle-tracking [template:level_1/spec.md]"
description: "Goal lifecycle events now restore active goals, track assistant activity, account usage once per message, mark prompt blocks, and stop active goals at the token budget."
trigger_phrases:
  - "goal lifecycle"
  - "message updated"
  - "budget limited"
  - "permission asked"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/004-lifecycle-tracking"
    last_updated_at: "2026-06-28T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented lifecycle tracking for the goal plugin"
    next_safe_action: "Continue with active continuation after lifecycle and supervisor behavior stay green"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"
    session_dedup:
      fingerprint: "sha256:d31fbab776c384a7468bb8d15278d7311fb72e534b702cf51eb5ba7bcb1c1e15"
      session_id: "goal-m2-lifecycle-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "message.updated usage is best-effort and reports unavailable when token data is absent"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: lifecycle-tracking

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `scaffold/004-lifecycle-tracking` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-goal-command |
| **Successor** | 005-completion-supervisor |
| **Handoff Criteria** | Lifecycle tests pass with usage dedupe, budget stop, and prompt blocking covered. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase extends the passive goal plugin with OpenCode lifecycle event handling while preserving M1 injection and tool behavior.

**Scope Boundary**: Track lifecycle state and usage only. Active continuation remains out of scope for the later continuation phase.

**Dependencies**:
- Existing `mk-goal.js` state helpers and passive injection behavior.
- OpenCode plugin `event({ event })` lifecycle hook shape.

**Deliverables**:
- Event switch for session, message, prompt, idle, and disposal events.
- Guarded token accounting with message-id dedupe and budget stop transition.
- Assistant transcript evidence capture for the verifier phase.

**Changelog**:
- Lifecycle behavior is implemented in the existing plugin and covered by node unit tests.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
M1 persisted and injected goals, but it did not observe session lifecycle events. Without message activity tracking and guarded usage accounting, the plugin could not expose reliable budget state or gather evidence for an automatic verifier.

### Purpose
The goal plugin now tracks lifecycle state needed for budget governance and later supervisor verification without starting autonomous continuation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `event` handling to `.opencode/plugins/mk-goal.js`.
- Track assistant activity, verifier evidence, prompt blocks, and token usage.
- Transition active goals to `budget_limited` when `tokensUsed` reaches `tokenBudget`.

### Out of Scope
- Calling `promptAsync` or continuing work automatically.
- Inferring token usage when lifecycle events do not include token data.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Adds lifecycle helpers, usage accounting, and status fields. |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Create | Covers message accounting, dedupe, budget stop, unavailable usage, and prompt blocking. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve existing passive goal behavior. | Existing `mk-goal-state` test remains green. |
| REQ-002 | Account usage only for the current active goal. | Usage is skipped unless status is `active`, the goal id matches, and the message id has not already been charged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Capture assistant evidence on `message.updated`. | Stored `lastEvidence` contains redacted assistant transcript text. |
| REQ-004 | Mark prompt blockers. | `permission.asked` and `question.asked` set `blockedByPrompt=true`. |
| REQ-005 | Flush volatile runtime locks on teardown. | `session.deleted` clears the session lock state and `*.disposed` clears all volatile lock state. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Replaying the same message id does not increase `tokensUsed`.
- **SC-002**: Crossing the configured token budget changes status to `budget_limited`.
- **SC-003**: Missing usage data records `usageSource=unavailable` without crashing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | OpenCode usage payload shape varies by event source. | Token accounting may be unavailable for some turns. | Extract common shapes and report `usageSource=unavailable` when no token count exists. |
| Risk | Message updates can repeat during streaming. | Repeated updates could double-charge usage. | Persist `lastAccountedMessageID` and skip duplicates. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. Live runtime payload coverage should be revisited during active continuation smoke testing.
<!-- /ANCHOR:questions -->
