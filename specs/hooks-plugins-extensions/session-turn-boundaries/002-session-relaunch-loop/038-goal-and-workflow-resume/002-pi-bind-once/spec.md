---
title: "Feature Specification: Phase 2: pi-bind-once"
description: "Pi starts a new session inside the receiving process. The hand-over guard is keyed by session id, so a new session binds the hop's goal again and injects it on every prompt. The packet variable also survives into a nested runtime."
trigger_phrases:
  - "pi bind once"
  - "phase 2 pi bind once"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: pi-bind-once

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/358-handover-goal-resume` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-workflow-reentry-seed |
| **Successor** | 003-goal-resolver-prepare |
| **Handoff Criteria** | Phase 002 is Complete, `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0, and every row of `acceptance-criteria.md` is Met. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Goals and running workflows survive a session hop on every runtime specification.

**Scope Boundary**: The once-per-process hand-over bind in `goal-context.ts` and its cases in `goal-pi.test.mjs`. No relaunch record field, no new module and no other runtime binder.

**Dependencies**:
- Phase 001 is complete and its reentry seed lands first.
- Pi 1.5.2 fires `session_start` for a new, resumed or forked session in the same process.

**Deliverables**:
- The packet variable clearing in `goal-context.ts` after the first attempt with a session id.
- The must-fail second `session_start` case and the five hand-over guard cases in `goal-pi.test.mjs`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pi 1.5.2 starts a new session inside the receiving process. The hand-over guard is a set of session ids (`goal-context.ts:101-108`), so `/new` or `/resume` under a new id is not in the set and binds the hop's goal. That session then injects the goal on every prompt. The packet variable also has no `SKILLED_LOOP_` prefix, so a nested `pi -p` started from a receiver's shell binds the same goal.

### Purpose
After a Pi receiver binds a hopped goal, no later session and no nested runtime in that process binds it again.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n 'handOverAttempted|SESSION_RELAUNCH_GOAL_PACKET' .skilled/hooks/goal/pi/goal-context.ts
101:const handOverAttempted = new Set<string>();
105:  if (!sessionId || handOverAttempted.has(sessionId)) return;
106:  handOverAttempted.add(sessionId);
```
The guard is a set of session ids. A new id in the same process is not in the set, so the hand-over binds again. No line names the packet variable, so no line clears it after the first bind.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Clear `SESSION_RELAUNCH_GOAL_PACKET` after the first hand-over attempt that has a session id, so a later session or a nested runtime finds nothing to bind.
- Keep the existing per-session set, which still stops a repeat attempt in the same session.
- Add the must-fail case to `goal-pi.test.mjs` for a second `session_start` with a new id.
- Keep the five hand-over guard cases green.

### Out of Scope
- The OpenCode one-attempt deletion at `opencode-goal.js` - the work package names only the Pi files.
- Devin and Cursor per-session binding - other work packages own those runtimes.
- A rename of the variable to a `SKILLED_LOOP_` prefix - the deletion closes the leak for Pi without a rename every runtime must follow.
- The review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder - parent D4 rules them out.
- A relaunch record field or a new module - parent D3 rules them out.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/goal/pi/goal-context.ts` | Modify | Attempt the hand-over bind once per process and clear the packet variable after the first attempt with a session id. |
| `.skilled/hooks/goal/pi/goal-pi.test.mjs` | Modify | Add the must-fail second `session_start` case and keep the five hand-over guard cases. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The Pi hand-over binds once per process. After the first attempt that has a session id, a second `session_start` with a new id binds nothing, and `SESSION_RELAUNCH_GOAL_PACKET` is no longer set, so a nested runtime has nothing to bind. `node --test --test-name-pattern 'a second session_start with a new id binds nothing' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The five hand-over guard cases in `goal-pi.test.mjs` keep passing. They cover the first receiver bind at session start, a later input in its own session, an own or cleared goal, an `AI_SESSION_CHILD=1` child, and the off switch, an empty variable and a missing packet. `node --test --test-name-pattern 'hand-over|first input binds|session own|dispatched child|switch, an empty variable' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The must-fail case in `goal-pi.test.mjs` fails before the guard change and passes after it.
- **SC-002**: The five hand-over guard cases still pass and the full file exits 0 with `fail 0`.
- **SC-003**: `SESSION_RELAUNCH_GOAL_PACKET` is gone after the first attempt with a session id, so a nested runtime binds nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pi 1.5.2 starts new sessions in the receiving process. | A new session id looks like the receiver's session if the guard ignores the id. | Key the guard on the session id and leave the event reason unread. |
| Risk | The first attempt runs in a session that already has its own goal, so the hop is consumed for the whole process. | Medium | That is the intended precedence. The existing own-goal guard case asserts the own goal wins. |
| Risk | The first attempt runs with no session id, so the variable is not cleared. | Low | The attempt returns without clearing, and the next input with an id attempts and clears. |
| Risk | A new code comment names the spec path or a finding id. | Low | The comment names the once-per-process rule only, and a checklist check greps for the path and the id. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - the change adds one environment delete after the first attempt.
- **NFR-P02**: N/A - the change runs no service.

### Security
- **NFR-S01**: N/A - the change adds no auth path.
- **NFR-S02**: The change writes no file and the packet variable carries no credential.

### Reliability
- **NFR-R01**: A missing variable, an empty variable and an empty session id leave the bind path unchanged and cannot throw.
- **NFR-R02**: N/A - the change handles no request traffic.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `SESSION_RELAUNCH_GOAL_PACKET` is empty or missing, so the first attempt binds nothing and no variable is left behind.
- Maximum input: many `session_start` events arrive in one process, and only the first one with a session id attempts a bind.
- Failure path: `bindRelaunchGoal` throws after the attempt is recorded, the handler fails open, and no later session or nested runtime retries the packet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One guard function in one extension file and its test file. |
| Risk | 8/25 | Process-wide environment mutation, no schema or record change. |
| Research | 6/20 | The finding supplies the line numbers, the scenario and the test. |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
