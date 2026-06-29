---
title: "Feature Specification: Phase 6: active-continuation"
description: "The goal plugin now has a default-off active continuation tier with ordered safety gates, JSONL observability, and hard auto-turn caps."
trigger_phrases:
  - "goal active continuation"
  - "maybe continue goal"
  - "MK_GOAL_AUTONOMY"
  - "continuation log"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin/006-active-continuation"
    last_updated_at: "2026-06-28T21:46:31Z"
    last_updated_by: "codex"
    recent_action: "Implemented default-off active continuation gates for the goal plugin"
    next_safe_action: "Run live idle smoke"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-continuation.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-m3-continuation-20260628"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether session.idle is observable in a one-shot opencode run or requires opencode serve"
    answered_questions:
      - "Autonomy remains default-off unless MK_GOAL_AUTONOMY is smoke or active"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: active-continuation

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
| **Branch** | `scaffold/006-active-continuation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-completion-supervisor |
| **Successor** | None |
| **Handoff Criteria** | Idle verifier remains first, continuation stays default-off, smoke mode logs only, and active mode submits through `promptAsync` only after every guard passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase adds the Tier 2 continuation layer on top of the existing goal store, injection, lifecycle tracking, and supervisor verifier.

**Scope Boundary**: Add guarded continuation after idle verification. Do not change `/goal` command syntax, completion semantics, or passive injection behavior.

**Dependencies**:
- Existing `session.idle` verifier path from the supervisor phase.
- Existing goal state fields for suppression, counters, budgets, and activity.
- OpenCode SDK `ctx.client.session.promptAsync` availability in plugin context.

**Deliverables**:
- `maybeContinueGoal(sessionID)` with ordered gates.
- Default-off autonomy via `MK_GOAL_AUTONOMY`.
- JSONL continuation and debug event logs under `.opencode/skills/.goal-state/`.
- Status output fields for attempts and suppression reason.
- Node unit coverage for default-off, passive, smoke, active, and cap behavior.

**Changelog**:
- Active continuation is implemented in the existing plugin and covered by plugin unit tests.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The goal plugin could verify goals on idle, but it could not continue active work after a `not_met` verifier result. Adding recursive prompting without tight guards would risk runaway turns, repeated prompts during permission waits, or unexpected behavior when autonomy is not explicitly enabled.

### Purpose
The plugin can now continue an active goal only when autonomy is explicitly enabled and every runtime, cap, cooldown, and budget guard passes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `maybeContinueGoal(sessionID)`.
- Call continuation after `maybeVerifyGoal(sessionID)` on `session.idle`.
- Enforce default-off, passive, smoke, and active autonomy modes.
- Enforce in-flight, permission, busy/retry, cooldown, auto-turn, wall-clock, and budget gates.
- Log every continuation decision to `.continuation.log`.
- Log event types to `.goal-events.log` when `MK_GOAL_DEBUG=1`.
- Surface continuation attempts and suppression reason in status output.
- Add continuation unit tests.

### Out of Scope
- New `/goal` command verbs.
- Production model selection for a supervisor verifier.
- Browser or TUI overlay behavior.
- Proving live recursive `session.idle` behavior in a one-shot OpenCode command.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Adds continuation gates, prompt dispatch, JSONL logs, event debug logging, status fields, and idle wiring. |
| `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs` | Create | Covers default-off, passive kill-switch, smoke mode, active prompt dispatch, and cap enforcement. |
| `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin/006-active-continuation/*` | Modify | Replaces scaffold phase docs with actual scope, plan, tasks, metadata, and verification summary. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep continuation default-off. | With `MK_GOAL_AUTONOMY` unset, decision is `suppressed`, reason is `autonomy_disabled`, and `promptAsync` is not called. |
| REQ-002 | Preserve the ordered gates. | `maybeContinueGoal` checks plugin enabled, autonomy, session id, active status, suppression, continuation lock, permission block, busy/retry, cooldown, caps, budget, then prompt dispatch. |
| REQ-003 | Enforce hard caps. | `autoTurnsUsed` never exceeds 8 and wall-clock continuation stops at 30 minutes. |
| REQ-004 | Increment before sending. | Active mode reserves the continuation turn before calling `ctx.client.session.promptAsync`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Support smoke mode. | `MK_GOAL_AUTONOMY=smoke` logs `would_fire` without calling `promptAsync`. |
| REQ-006 | Support passive kill-switch. | `MK_GOAL_AUTONOMY=passive` suppresses continuation before session-state gates. |
| REQ-007 | Add observability. | `.continuation.log` records every decision and `.goal-events.log` records event types when debug is enabled. |
| REQ-008 | Preserve M1/M2 behavior. | Existing state, lifecycle, and supervisor tests remain green. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Default-off mode suppresses continuation and logs `autonomy_disabled`.
- **SC-002**: Smoke mode logs `would_fire` and sends no prompt.
- **SC-003**: Active mode sends one sanitized continuation prompt only after all gates pass.
- **SC-004**: A goal already at 8 auto-turns remains at 8 after repeated continuation attempts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Recursive prompting from a plugin hook may need a long-running server session. | One-shot OpenCode runs may not expose the same idle loop. | Ship default-off, add smoke mode, and leave live serve smoke as the residual validation gap. |
| Risk | Prompt failures could loop repeatedly. | Active autonomy could consume attempts without progress. | Prompt failures persist a suppression reason and stop further continuation until the goal is reset. |
| Risk | Permission or question waits may be missed. | Continuation could run while user input is required. | Track prompt blocks from events and clear them on replies. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `session.idle` fire in a one-shot `opencode run`, or only in a long-running `opencode serve`/TUI session?
<!-- /ANCHOR:questions -->
