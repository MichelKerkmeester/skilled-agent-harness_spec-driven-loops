---
title: "Implementation Plan: Phase 1: state-store [template:level_1/plan.md]"
description: "Implement the passive goal plugin storage layer in mk-goal.js using per-session files, atomic writes, and queued mutations."
trigger_phrases:
  - "goal state store plan"
  - "atomic goal write"
  - "mutate goal queue"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/001-state-store"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented completed state store plan"
    next_safe_action: "Reuse state helpers from the later goal plugin phases"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:a3e7721be7af28df416e6973960b1b442005139afde38e7d81d81ff1e0b67051"
      session_id: "goal-m1-state-store-20260629"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: state-store

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM plugin |
| **Framework** | OpenCode plugin API |
| **Storage** | Per-session JSON files under `.opencode/skills/.goal-state` |
| **Testing** | `node --test` and `node --check` |

### Overview
Build the storage layer inside the committed `mk-goal.js` plugin. The implementation keeps the persistence contract small: session ids become hex-keyed file names, writes are atomic, and all mutations run through a per-file promise queue.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] State ownership boundary documented.
- [x] Session id failure mode identified.
- [x] Persistence verification path identified.

### Definition of Done
- [x] State helpers reject missing session ids.
- [x] Session isolation and set/clear behavior are covered by tests.
- [x] Full plugin unit suite passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-plugin file-backed state store.

### Key Components
- **Session keying**: `goalPathForSession` converts a required session id into a hex file name.
- **Atomic persistence**: `writeGoalAtomic` writes a temporary JSON file, syncs it, renames it, and syncs the directory.
- **Mutation queue**: `mutateGoal` serializes state transitions by state directory and session key.
- **Goal lifecycle helpers**: `setGoal` and `clearGoal` provide the primitive mutations used by tools and later phases.

### Data Flow
Tool or lifecycle code supplies a session id, the state helper resolves the hex-keyed JSON path, `readGoal` normalizes existing state, and `mutateGoal` writes the next state atomically or deletes the file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/mk-goal.js` | Owns goal plugin state and tools. | Add state directory, path, read, write, mutate, set, and clear helpers. | `node --check`; state and tool-path tests. |
| `.opencode/skills/.goal-state` | Runtime state directory. | Created on demand with private permissions. | State tests use isolated temp state directories. |
| `.opencode/plugins/tests/mk-goal-state.test.cjs` | State and passive plugin coverage. | Created. | Full plugin unit suite. |
| `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` | Tool-context path regression coverage. | Created. | Full plugin unit suite. |

Required inventories:
- Same-class producers: `ensureGoalStateDir`, `goalPathForSession`, `readGoal`, `writeGoalAtomic`, `mutateGoal`, `setGoal`, and `clearGoal` in `mk-goal.js`.
- Consumers of changed symbols: `mk_goal`, `mk_goal_status`, passive transform, lifecycle handlers, supervisor helpers, continuation helpers, and plugin tests.
- Matrix axes: missing vs present session id, same vs different session id, existing vs absent goal, set vs clear mutation.
- Algorithm invariant: no state path exists without a required session id, and no durable write lands without atomic temp-write plus rename.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify the goal plugin state directory and session id inputs.
- [x] Define the per-session file naming contract.
- [x] Define missing-session behavior as fail-closed.

### Phase 2: Core Implementation
- [x] Add `ensureGoalStateDir` and `goalPathForSession`.
- [x] Add `readGoal` and stored-goal normalization.
- [x] Add `writeGoalAtomic` with temp file, fsync, rename, and directory fsync.
- [x] Add queued `mutateGoal`, `setGoal`, and `clearGoal`.

### Phase 3: Verification
- [x] Add state isolation and missing-session tests.
- [x] Add tool-context path regression coverage.
- [x] Run full plugin unit suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Session-keyed state helpers and set/clear behavior | `node --test` |
| Regression | Tool handler session resolution | `node --test` |
| Syntax | Plugin and tests | `node --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js filesystem APIs | Runtime | Green | State cannot persist without file read, write, fsync, rename, and unlink support. |
| OpenCode session id in context | Internal runtime API | Green | Missing session ids intentionally fail closed. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: State writes corrupt goal JSON, leak across sessions, or fail to reject missing session ids.
- **Procedure**: Revert the state helper changes in `mk-goal.js` and remove the state/tool-path tests that depend on them.
<!-- /ANCHOR:rollback -->
