---
title: "Implementation Plan: Phase 5: opencode-continuation-hop"
description: "Add a relaunch record check to the OpenCode goal continuation and delete the hop's packet variable after the one bind attempt. Prove both with two lifecycle tests that fail before the change."
trigger_phrases:
  - "opencode continuation hop plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: opencode-continuation-hop

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript on Node.js, ESM plugin |
| **Framework** | OpenCode plugin API |
| **Storage** | JSON goal state files and one relaunch record file |
| **Testing** | `node:test` through `node --test` |

### Overview
Change one plugin at two points of its event handling. The continuation gate reads the relaunch record before it sends a prompt. The session start path deletes the packet variable after its one bind attempt. Prove both with two lifecycle tests that fail before the change, then run the guard suites.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs .opencode/plugins/tests/opencode-goal-handover.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` exits 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/005-opencode-continuation-hop --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard at the decision point.

### Key Components
- **`maybeContinueGoal`**: Owns the continuation decision. It adds the record check before any `promptAsync` call.
- **`bindRelaunchGoal` and the `session.created` handler**: Own the one bind attempt. They delete the packet variable after it.
- **`readRelaunchFile`**: The existing relaunch core read. It supplies the record status, loop id and session id.

### Data Flow
On `session.idle`, the goal plugin reads the relaunch record for `SKILLED_LOOP_ID`. A record with a matching session id and status `pending` or `armed` returns `suppressed` before any prompt. Every other record runs the existing gates. On `session.created`, the first top-level session binds the packet goal once, then the variable is deleted.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/opencode-goal.js` | Owns `maybeContinueGoal` and the one bind attempt | update | The two new lifecycle tests pass. |
| `.skilled/hooks/goal/opencode/opencode-goal.js` | Browsability link to the same plugin file | update through the link | `readlink .skilled/hooks/goal/opencode/opencode-goal.js` prints the plugin path. |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Owns the record path, the status values and the read | unchanged, read only | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0. |
| `.opencode/plugins/session-relaunch.js` | Withdraws an arm on a new user message | unchanged, not a consumer | `node --test .opencode/plugins/tests/session-relaunch.test.cjs` exits 0. |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Proves both behaviors | update | The two new tests fail first, then pass. |
| `.opencode/plugins/tests/opencode-goal-handover.test.cjs` | Proves one bind per process, the switch and the child guard | unchanged, guard | The suite exits 0. |

Required inventories:
- Same-class producers: `rg -n 'SESSION_RELAUNCH_GOAL_PACKET|SKILLED_LOOP_ID' .opencode/plugins .skilled/hooks/goal`.
- Consumers of changed symbols: `rg -n 'maybeContinueGoal|bindRelaunchGoal' .opencode/plugins .skilled/hooks/goal`.
- Matrix axes: record absent, record pending, record armed, record for another session, record for another loop. Run each row with autonomy active.
- Algorithm invariant: a continuation suppresses only when the loop id is set, the record status is `pending` or `armed`, and the record session matches. Every other row keeps today's decision.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the continuation gate and the one bind attempt in `.opencode/plugins/opencode-goal.js`, then records the current lifecycle pass. Implementation adds the record check to `maybeContinueGoal` and the variable delete after the bind attempt. Verification runs the two new tests first, then the lifecycle, hand-over and relaunch suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `maybeContinueGoal` and the `session.created` handler | `node:test` |
| Integration | The plugin event path with a real pending relaunch record file | `node --test` lifecycle suite |
| Manual | N/A: the behavior is event-driven and covered by the suite | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js runtime | Internal | Green | `node --test` cannot run. |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Internal | Green | The record read is unavailable and the guard cannot land. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A continuation is suppressed when no record names the session, or the receiver loses its goal after a bind.
- **Procedure**: Revert the phase commit. The plugin returns to the current behavior and the two new tests are removed with it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 004 passes validation | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->

---
