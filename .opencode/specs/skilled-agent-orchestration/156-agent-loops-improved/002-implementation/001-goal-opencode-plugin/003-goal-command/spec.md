---
title: "Feature Specification: Phase 3: goal-command [template:level_1/spec.md]"
description: "The root /goal command now routes passive goal operations through mk_goal and mk_goal_status with status output that includes injection_preview."
trigger_phrases:
  - "goal command"
  - "mk_goal"
  - "mk_goal_status"
  - "injection preview"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin/003-goal-command"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented completed M1 goal command implementation"
    next_safe_action: "Use lifecycle tracking after the passive /goal command remains green"
    blockers: []
    key_files:
      - ".opencode/commands/goal.md"
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/__tests__/mk-goal-state.test.cjs"
      - ".opencode/plugins/__tests__/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-m1-goal-command-20260629"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The command markdown is state-free; plugin tools own state and session resolution"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: goal-command

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
| **Branch** | `scaffold/003-goal-command` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-injection-plugin |
| **Successor** | 004-lifecycle-tracking |
| **Handoff Criteria** | Root command routing and plugin tools support set, show, clear, complete, pause, and status output with `injection_preview`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase exposes the passive goal store and injection preview through a user-facing `/goal` command. It completes M1 by giving users a root command for setting, inspecting, clearing, completing, and pausing the active session goal.

**Scope Boundary**: Own command routing and tool envelopes only. Lifecycle events, automatic verification, and continuation remain later phases.

**Dependencies**:
- Phase 1 state helpers for set, clear, complete, pause, and show operations.
- Phase 2 injection renderer for `injection_preview`.
- OpenCode command markdown and plugin tool registration.

**Deliverables**:
- `.opencode/commands/goal.md` routes command arguments to exactly one tool call.
- `mk_goal` supports `set`, `show`, `clear`, `complete`, and `pause`.
- `mk_goal_status` shows current state and exact `injection_preview`.

**Changelog**:
- The root `/goal` command and plugin tools are implemented and covered by plugin tests.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The state store and injection renderer needed a safe user-facing control surface. Without a root command and tool envelopes, users could not reliably set, inspect, pause, complete, or clear the active session goal.

### Purpose
The repository now has a root `/goal` command that delegates all stateful work to `mk_goal` and `mk_goal_status` while returning a terse machine-readable status envelope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `.opencode/commands/goal.md` as the root `/goal` command.
- Route empty args and `show` to `mk_goal_status`.
- Route `set <objective>`, bare text, `clear`, `complete`, and `pause [reason]` to `mk_goal`.
- Register `mk_goal` and `mk_goal_status` tools in `mk-goal.js`.
- Include `injection_preview` in status and mutation output.

### Out of Scope
- Direct command markdown reads or writes to `.opencode/skills/.goal-state`.
- Lifecycle token accounting, verifier execution, or active continuation.
- Shell execution derived from a goal objective.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/goal.md` | Create | Adds the root `/goal` router and hard rules for one tool call. |
| `.opencode/plugins/mk-goal.js` | Modify | Adds `mk_goal`, `mk_goal_status`, action handling, status lines, and failure envelopes. |
| `.opencode/plugins/__tests__/mk-goal-state.test.cjs` | Create | Verifies set, status, `injection_preview`, transform parity, and clear through tool calls. |
| `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs` | Create | Verifies tool-context session resolution for command-backed mutation paths. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep command markdown state-free. | `goal.md` routes to tools and never reads or writes `.goal-state` directly. |
| REQ-002 | Support passive goal mutations through `mk_goal`. | Tool action enum covers `set`, `show`, `clear`, `complete`, and `pause`. |
| REQ-003 | Show current state through `mk_goal_status`. | Status output includes `goal_present`, `status`, `objective`, usage fields, verifier fields, and `injection_preview`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Print predictable result envelopes. | Success output starts with `STATUS=OK ACTION=<action>` and failures start with `STATUS=FAIL ERROR=<message>`. |
| REQ-005 | Preserve command safety. | `goal.md` forbids shell commands, session-id inference, and direct state edits. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/goal set <objective>` routes to `mk_goal({ action: "set", objective: REST })`.
- **SC-002**: `/goal`, `/goal show`, and `mk_goal_status` expose the exact rendered `injection_preview`.
- **SC-003**: `clear`, `complete`, and `pause` mutate state only through `mk_goal`.
- **SC-004**: Tool-context session ids drive the state path used by command-backed operations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Command markdown could perform work outside the plugin tools. | State and session resolution would split across two surfaces. | Hard rule: the command makes exactly one selected tool call and prints the result verbatim. |
| Risk | Status output could diverge from injected context. | Users would inspect a preview that differs from what the model receives. | Use the same `renderGoalInjection` path for `injection_preview` and transform output. |
| Risk | Tool context may be missing a session id. | Command mutation could write shared state. | State helpers fail closed with `MISSING_SESSION_ID`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase.
<!-- /ANCHOR:questions -->
