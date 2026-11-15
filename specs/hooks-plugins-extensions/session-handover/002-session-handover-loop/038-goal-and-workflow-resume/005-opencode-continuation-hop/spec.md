---
title: "Feature Specification: Phase 5: opencode-continuation-hop"
description: "The OpenCode goal continuation can withdraw a prepared hop, and the hop's packet variable survives the one bind attempt into nested runtimes. This phase suppresses the continuation while a relaunch record names the session and deletes the variable after that attempt."
trigger_phrases:
  - "opencode continuation hop"
  - "phase 5 opencode continuation hop"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: opencode-continuation-hop

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/358-handover-goal-resume` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-claude-start-claim |
| **Successor** | 006-skilled-loop-command |
| **Handoff Criteria** | The two new lifecycle tests pass, the lifecycle, hand-over and relaunch suites pass, and every acceptance row is Met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Goals and running workflows survive a session hop on every runtime specification.

**Scope Boundary**: The OpenCode goal plugin and its lifecycle suite. The relaunch plugin, the relaunch record format and the Pi half of the packet variable leak stay unchanged.

**Dependencies**:
- Phase 004 passes validation before this phase starts.
- The relaunch core exposes a read of the pending and armed record.

**Deliverables**:
- The continuation returns `suppressed` while the session has a pending or armed relaunch record.
- The packet variable is gone after the one bind attempt at session start.
- Two lifecycle tests fail before the change and pass after it.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A prepared OpenCode hop can be withdrawn by the goal continuation. On the same idle event, the continuation sends a new user message and the relaunch plugin disarms the record as an operator message, so the hop is lost while the session works near its context limit. The hop's packet variable also stays in the environment after the one bind attempt, so a nested runtime started from a tool shell can bind the hop goal.

### Purpose
Keep a prepared OpenCode hop intact and stop the hop's packet variable at the receiver.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ if rg -q 'delete process.env.SESSION_RELAUNCH_GOAL_PACKET|SKILLED_LOOP_ID' .opencode/plugins/opencode-goal.js
> then echo "guard present"
> else echo "guard absent"
> fi
guard absent
```

The plugin that owns the continuation has no relaunch guard and no variable delete. The guard the phase adds is therefore absent from the current file.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Suppress the goal continuation when `SKILLED_LOOP_ID` is set and the relaunch record names this session as pending or armed.
- Delete `SESSION_RELAUNCH_GOAL_PACKET` after the one bind attempt at session start.
- Add two lifecycle tests that fail before the change and pass after it.
- Keep the existing lifecycle, hand-over and relaunch tests passing.

### Out of Scope
- The relaunch withdraw path and the relaunch record format. Parent decision D3 freezes the format, and the withdraw path belongs to the relaunch plugin.
- The Pi half of the packet variable leak. Phase 002 owns it.
- The cleared Claude goal, the shared goal off switch and the resend reminder. Parent decision D4 rules them out.
- README and flags documentation. Phase 007 owns it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/goal/opencode/opencode-goal.js` | Modify | Suppress the continuation and delete the packet variable. |
| `.opencode/plugins/opencode-goal.js` | Modify | The same plugin, reached through the mirror link. |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Modify | Two tests that fail first, then pass. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `OPENCODE_GOAL_AUTONOMY=active`, an active goal, `SKILLED_LOOP_ID` set and a pending or armed relaunch record for the session, `maybeContinueGoal` returns `decision: suppressed` and sends no `promptAsync`. Test: `a pending relaunch record suppresses the goal continuation` in `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | After the first top-level `session.created` event, `SESSION_RELAUNCH_GOAL_PACKET` is absent from `process.env`, so a runtime started later from the session's tool shell does not inherit it. Test: `the hand-over packet variable is deleted after the one bind attempt` in `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`. |
| REQ-003 | The existing tests keep passing. `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` still fires a continuation with no record. `.opencode/plugins/tests/opencode-goal-handover.test.cjs` still binds once per process and keeps the switch and child guards. `.opencode/plugins/tests/session-relaunch.test.cjs` still withdraws an arm on a new user message. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The lifecycle suite holds a passing test named `a pending relaunch record suppresses the goal continuation`, and that test failed with `fired` before the change.
- **SC-002**: A `session.created` event leaves `SESSION_RELAUNCH_GOAL_PACKET` undefined after the one bind attempt, and the packet goal is still bound.
- **SC-003**: The lifecycle, hand-over and relaunch suites exit 0, and strict validation prints `RESULT: PASSED` with every acceptance row Met.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `readRelaunchFile` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | No record read, so no suppression | Use the existing export. Do not copy the record format or write a second reader. |
| Risk | The guard suppresses a continuation when an armed record will never fire | Autonomy stays off and the session does not continue | Suppress only for a record that names this session. The finding limits the guard to a pending or armed record. |
| Risk | The variable is deleted before the bind completes | The receiver gets no goal | Delete it after the one bind attempt. Assert the bound goal and the absent variable in one test. |
| Risk | The new test leaves `SKILLED_LOOP_ID` or `XDG_RUNTIME_DIR` set for later tests | Later cases see a record they did not create | Save and restore both values in the test teardown. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: no latency target applies to a local event handler. The guard adds one read of an existing record file to an event that already reads goal state.

### Security
- **NFR-S01**: N/A: the change adds no credential and no request input. The record path is the existing validated path.

### Reliability
- **NFR-R01**: A missing record or a record for another session leaves the current continuation decision unchanged.
- **NFR-R02**: A failed bind still deletes the packet variable, so the next runtime starts clean.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no `SKILLED_LOOP_ID` or no record, so the continuation runs as today.
- Maximum input: a record names another loop or another session, so the continuation runs and the hop is not suppressed.
- Failure path: a corrupt record reads as absent and the continuation runs as today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two behaviors in one plugin and one test file. |
| Risk | 5/25 | The guard turns off a continuation. Autonomy is off by default. |
| Research | 4/20 | The verified finding supplies the code paths and the failing case. |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
