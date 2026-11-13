---
title: "Implementation Plan: Phase 2: pi-bind-once"
description: "Change one guard in goal-context.ts so a Pi process attempts the hand-over bind once. Add the must-fail second session_start case to goal-pi.test.mjs first. Prove it with the new case, the five guard cases and strict validation."
trigger_phrases:
  - "pi bind once plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: pi-bind-once

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript Pi extension and Node.js test (`.mjs`) |
| **Framework** | Pi extension API 1.5.2 |
| **Storage** | Per-session goal state in the goal core, no new store |
| **Testing** | `node --test` |

### Overview
Change one guard in `goal-context.ts` so a Pi process attempts the hand-over bind once. Add the must-fail second `session_start` case to `goal-pi.test.mjs` first. Prove it with the new case, the five guard cases and strict validation.
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
- [ ] `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0 with `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One guard, one process.

### Key Components
- **`bindHandOverGoal`**: the only function that changes. It fails today because it never clears the variable, so a new session id binds again.
- **`SESSION_RELAUNCH_GOAL_PACKET`**: the hop's input. It fails today because it stays set after the first bind.
- **`goal-pi.test.mjs`**: the hand-over cases. It fails today because no case starts a second session in one process.

### Data Flow
The receiver starts. `session_start` or the first `input` calls `bindHandOverGoal`. The first attempt with a session id records the session, clears the variable, and calls the core. A later session or a nested runtime finds no variable and binds nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `goal-context.ts` `bindHandOverGoal` | Producer of the hand-over bind guard. | update | The new must-fail case and the five hand-over guard cases. |
| `goal-context.ts` `input` and `session_start` handlers | Both call the guard. | unchanged, they share the changed function | The full `goal-pi.test.mjs` suite. |
| `goal-core.cjs` `bindRelaunchGoal` | Reads `SESSION_RELAUNCH_GOAL_PACKET` and binds an unbound session. | unchanged | The new case observes the variable is gone, and the guard cases still bind the first receiver. |
| `goal-pi.test.mjs` | Hand-over and lifecycle cases. | update | The new case plus the five guard cases. |
| `.opencode/plugins/opencode-goal.js`, `cursor/goal-inject.mjs` and `devin/goal-inject.mjs` | Each has its own hand-over guard. | not a consumer | `rg -n 'bindRelaunchGoal' .skilled .opencode --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.mjs'` lists each binder. |
| The relaunch record | Carries the hop state. | not a consumer | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0. |

Required inventories:
- Same-class producers: `rg -n 'SESSION_RELAUNCH_GOAL_PACKET' .skilled .opencode --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.mjs'` lists every reader. Only the Pi binder changes.
- Consumers of changed symbols: `rg -n 'bindHandOverGoal' .skilled/hooks/goal/pi` lists the function and its two callers.
- Matrix axes: event (`session_start`, `input`) x session id (same, new, empty) x variable state (set, empty, missing, off switch, child) x goal state (none, own, cleared). The new case covers `session_start` with a new id after a bind. The guard cases cover the rest.
- Algorithm invariant: the first attempt with a session id consumes the hop for the process. The variable is cleared before the core call, so a throw cannot leave it set for a later session or a nested runtime.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reads the guard and records the 28-case baseline. Implementation adds the must-fail second `session_start` case, then clears the packet variable in `goal-context.ts` on the first attempt with a session id. Verification runs the hand-over guard cases, the full file and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `bindHandOverGoal` through `session_start` and `input` with fake Pi contexts | `node --test` |
| Integration | The hand-over path from the packet variable to the session record | `node --test` |
| Manual | None, every claim is a session record assertion | n/a |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js with type stripping for the `.ts` import | Internal | Green | The suite cannot import the extension. |
| Pi 1.5.2 `session_start` and `input` events | Internal | Green | The new case cannot model a second session. |
| No new package | External | Green | None. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The first receiver stops binding, or any hand-over guard case fails.
- **Procedure**: Revert the one commit. The guard returns to a per-session set and the variable stays set.
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
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | 003-goal-resolver-prepare |
<!-- /ANCHOR:phase-deps -->

---
