---
title: "Feature Specification: Phase 1: state-store [template:level_1/spec.md]"
description: "The goal plugin now persists per-session goal state with atomic writes, queued mutations, and fail-closed session id handling."
trigger_phrases:
  - "goal state store"
  - "per-session goal state"
  - "atomic goal write"
  - "missing session id"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/001-state-store"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented completed M1 state store implementation"
    next_safe_action: "Use the state helpers from injection, command, lifecycle, supervisor, and continuation phases"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/skills/.goal-state"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:2f322416f3206047d0deb7993f19864be115046d2b65bac79a47c9543af577fe"
      session_id: "goal-m1-state-store-20260629"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Missing session ids fail closed before shared state can be read or written"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: state-store

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
| **Branch** | `scaffold/001-state-store` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-injection-plugin |
| **Handoff Criteria** | State helper tests pass with session isolation, atomic persistence, tool-context session resolution, and missing-session failure covered. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase establishes the durable storage layer for the passive `/goal` milestone. Later phases depend on this state contract for injection, tool routing, lifecycle accounting, supervisor verdicts, and continuation.

**Scope Boundary**: Own per-session JSON persistence only. System prompt injection, root command routing, lifecycle events, supervisor checks, and active continuation are out of scope for this phase.

**Dependencies**:
- Node.js filesystem primitives for directory creation, file reads, temporary writes, fsync, rename, and delete.
- OpenCode session ids supplied by tool context or transform input.

**Deliverables**:
- `ensureGoalStateDir` creates `.opencode/skills/.goal-state` with private permissions.
- `goalPathForSession` maps each session id to a hex-keyed JSON file path.
- `readGoal`, `writeGoalAtomic`, `mutateGoal`, `setGoal`, and `clearGoal` own the state lifecycle.

**Changelog**:
- State persistence is implemented in `mk-goal.js` and covered by plugin unit tests.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The goal plugin needed durable session-scoped state before it could inject or manage a goal. A shared or loosely keyed store would risk cross-session leakage, and non-atomic writes could corrupt the goal file during concurrent mutations.

### Purpose
The plugin now has a fail-closed, per-session JSON state store that safely persists, mutates, and clears one active goal per OpenCode session.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the goal state directory with `ensureGoalStateDir`.
- Resolve per-session state paths with `goalPathForSession` using hex-encoded session ids.
- Read, normalize, write, mutate, set, and clear goal records through `readGoal`, `writeGoalAtomic`, `mutateGoal`, `setGoal`, and `clearGoal`.
- Serialize mutations through the in-process `mutationQueues` map.
- Fail closed on missing session ids before state reads or writes.

### Out of Scope
- Rendering `[active_goal]` injection blocks.
- Implementing the `/goal` command markdown router.
- Handling lifecycle events, supervisor verdicts, or autonomous continuation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Adds the per-session state helpers, normalization, atomic writes, mutation queue, and set/clear operations. |
| `.opencode/skills/.goal-state` | Create | Runtime state directory for session-keyed JSON goal files. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | Create | Verifies missing-session refusal, session isolation, state paths, set/show/clear, and passive transform reuse. |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Create | Verifies tool handler session resolution and state mutation through tool context. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refuse shared state access without a session id. | `setGoal(null, ...)` rejects with `MISSING_SESSION_ID` and leaves the state directory empty. |
| REQ-002 | Store goals in session-isolated JSON files. | Distinct session ids resolve to distinct hex-keyed file names and retain separate goal records. |
| REQ-003 | Write goal files atomically. | `writeGoalAtomic` writes a temp file, fsyncs it, renames it into place, and fsyncs the directory. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Queue concurrent mutations per session file. | `mutateGoal` serializes writes by state directory and session key. |
| REQ-005 | Expose set and clear helpers for command and lifecycle phases. | `setGoal` creates or reactivates a sanitized active goal, and `clearGoal` deletes the session file. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A missing session id cannot read or write goal state.
- **SC-002**: Two session ids produce separate goal files and do not overwrite each other.
- **SC-003**: Setting the same objective reactivates the existing goal instead of creating an unrelated state shape.
- **SC-004**: Clearing a goal removes the session state file and returns an empty status.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missing or malformed session ids could route writes into shared state. | Cross-session leakage or data loss. | Require a normalized session id for every path, read, write, set, and clear operation. |
| Risk | Concurrent goal mutations could race. | Last writer wins unexpectedly or produces partial state. | Serialize `mutateGoal` calls per state directory and hex session key. |
| Risk | Process interruption during write could corrupt JSON. | Goal state becomes unreadable. | Write to a temp path, fsync, rename, and fsync the parent directory. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase.
<!-- /ANCHOR:questions -->
