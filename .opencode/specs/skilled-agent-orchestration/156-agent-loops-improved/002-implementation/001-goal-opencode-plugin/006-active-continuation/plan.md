---
title: "Implementation Plan: Phase 6: active-continuation"
description: "Add a default-off active continuation tier to mk-goal with ordered gates, JSONL observability, and Node unit coverage."
trigger_phrases:
  - "goal continuation plan"
  - "active continuation gates"
  - "promptAsync continuation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/001-goal-opencode-plugin/006-active-continuation"
    last_updated_at: "2026-06-28T21:46:31Z"
    last_updated_by: "codex"
    recent_action: "Planned and implemented guarded goal continuation"
    next_safe_action: "Run a live serve/TUI smoke with MK_GOAL_AUTONOMY=smoke before enabling active mode"
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
      - "Live idle observability in one-shot OpenCode run versus opencode serve"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: active-continuation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ESM OpenCode plugin |
| **Framework** | `@opencode-ai/plugin` hooks and SDK client |
| **Storage** | Flat JSON goal records plus append-only JSONL logs |
| **Testing** | Node built-in test runner with CommonJS test files |

### Overview
Extend the existing committed `mk-goal.js` rather than adding a sibling plugin. The implementation adds one exported continuation helper, wires it after idle verification, logs each decision, and keeps real prompting behind `MK_GOAL_AUTONOMY=active`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing plugin and research synthesis read.
- [x] Prior M1/M2 tests pass before changes.
- [x] SDK `promptAsync` and `session.status` shapes confirmed locally.

### Definition of Done
- [x] Continuation helper implemented with ordered gates.
- [x] Default-off, passive, smoke, active, and cap behavior covered by unit test.
- [x] Full plugin unit suite green.
- [x] Syntax, alignment, and spec validation checks run.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-plugin additive extension.

### Key Components
- **`maybeContinueGoal(sessionID)`**: Reads the goal fresh, applies gates in order, logs a decision, and optionally dispatches `promptAsync`.
- **Runtime continuation state**: Tracks in-flight continuations, prompt blocks, and latest `session.status` event values.
- **Decision logs**: Append-only JSONL files in the goal state directory for test and smoke observability.
- **Continuation test**: Uses injected fake clients and temp state directories to prove env modes and cap behavior.

### Data Flow
`session.idle` runs `maybeVerifyGoal(sessionID)` first. If the goal remains active, `maybeContinueGoal(sessionID)` checks env, goal state, runtime guards, caps, and budget before reserving an auto-turn and sending a sanitized text part through `ctx.client.session.promptAsync`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/mk-goal.js` | Owns goal state, injection, lifecycle, supervisor, and tools. | Add continuation gates, logs, prompt dispatch, status fields, and event handling. | `node --check`, plugin tests, alignment drift check. |
| `.opencode/plugins/__tests__/` | Guards plugin behavior with Node scripts. | Add continuation test and keep existing tests green. | `node --test .opencode/plugins/__tests__/*.test.cjs`. |
| `.opencode/skills/.goal-state/` | Runtime state directory. | Add `.continuation.log` and optional `.goal-events.log`. | Unit test reads `.continuation.log`; debug event log remains runtime-observable. |
| `/goal` command | User-facing router. | Unchanged. | Existing state test still exercises tools. |

Required inventories:
- Same-class producers checked with `rg -n "maybeVerifyGoal|session.idle|promptAsync|continuation" .opencode/plugins/mk-goal.js .opencode/plugins/__tests__`.
- Consumers of changed symbols checked through exported `__test` helpers and `mk_goal_status`.
- Matrix axes: env mode, session id, goal status, suppression, lock, prompt block, session status, cooldown, caps, budget, prompt availability.
- Algorithm invariant: no prompt dispatch unless all gates pass, and `autoTurnsUsed` never exceeds 8.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research and baseline
- [x] Read `mk-goal.js` and goal plugin research synthesis.
- [x] Read existing goal plugin tests.
- [x] Run baseline plugin tests and syntax checks.

### Phase 2: Core implementation
- [x] Add continuation constants and JSONL log helpers.
- [x] Normalize continuation state fields on read.
- [x] Add `maybeContinueGoal(sessionID)`.
- [x] Wire idle events to verifier first, continuation second.
- [x] Track `session.status` and permission/question replies.
- [x] Surface status fields for attempts and suppression reason.

### Phase 3: Verification
- [x] Add continuation unit test.
- [x] Run full plugin unit tests.
- [x] Run syntax, alignment, and spec validation checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Env gates, smoke mode, active prompt dispatch, hard cap | `node --test` |
| Regression | Existing state, lifecycle, supervisor behavior | `node --test` |
| Syntax | Plugin and test files | `node --check` |
| Alignment | OpenCode code style drift | `verify_alignment_drift.py --root .opencode/plugins` |
| Spec | Phase docs strict validation | `validate.sh .../006-active-continuation --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `ctx.client.session.promptAsync` | OpenCode SDK | Green in installed types | Active mode cannot submit continuation without it. |
| `session.idle` event | OpenCode runtime | Type-confirmed, live one-shot observability unproven | Continuation may need `opencode serve` or TUI smoke to observe. |
| Goal verifier phase | Internal | Green | Continuation must not run before verifier. |
| Goal state JSON | Internal | Green | Continuation counters and suppression rely on existing state. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Plugin tests fail, active mode prompts unexpectedly, or live smoke shows recursive idle behavior is unsafe.
- **Procedure**: Revert the `mk-goal.js` continuation helper and idle continuation call, remove `mk-goal-continuation.test.cjs`, and leave M1/M2 state, lifecycle, and verifier behavior unchanged.
<!-- /ANCHOR:rollback -->
