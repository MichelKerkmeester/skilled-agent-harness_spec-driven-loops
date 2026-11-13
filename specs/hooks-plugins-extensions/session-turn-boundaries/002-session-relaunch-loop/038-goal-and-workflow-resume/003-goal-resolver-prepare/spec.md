---
title: "Feature Specification: Phase 3: goal-resolver-prepare"
description: "Devin and Cursor lose a handed-over goal at their next manual hop, the resolver stays silent when it cannot carry a goal, and a goal is dropped when its packet sits outside the spec folder lineage. Prepare also tells those two runtimes that a loop ends a session that has no relaunch hook."
trigger_phrases:
  - "goal resolver prepare"
  - "phase 3 goal resolver prepare"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: goal-resolver-prepare

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
| **Phase** | 3 of 7 |
| **Predecessor** | 002-pi-bind-once |
| **Successor** | 004-claude-start-claim |
| **Handoff Criteria** | Phase 003 is Complete, both session-relaunch suites exit 0, and every row of `acceptance-criteria.md` is Met. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Goals and running workflows survive a session hop on every runtime specification.

**Scope Boundary**: The goal resolver and its reason sibling in `relaunch-core.cjs`, the goal reason and the prepared text in `session-relaunch.cjs`, and the two session-relaunch test files. No record field, no new module, no note prose and no manual command change.

**Dependencies**:
- Phase 002 is Complete.
- Phase 001 owns the Codex note prose, so this phase prints the signal only.
- The goal record readers and `goalPacketProblem` already exist and are not rewritten.

**Deliverables**:
- A hand-over packet fallback for Devin and Cursor on a record miss.
- A stderr reason when a goal is known and cannot be carried.
- A bounded find for the one packet whose `goal.md` carries the goal headline.
- The manual route in the Cursor and Devin prepare text.
- Tests that fail before each change, and guard tests that stay green.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Devin and Cursor receivers start under a fresh native id, so the goal record the sender wrote under the old id never matches and the next manual hop carries no goal. The resolver returns an empty string for every failure, so prepare prints nothing while a goal is lost, and a Claude goal whose packet sits outside the spec folder lineage is dropped even when one packet carries its headline. Prepare also tells Devin and Cursor that the loop will end the session, though neither runtime registers a relaunch hook.

### Purpose
Prepare carries the sender's goal on Devin and Cursor, finds the one packet whose `goal.md` carries the headline, and says in one stderr line why a goal was not carried.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node -e "console.log(JSON.stringify(['devin','cursor','claude','codex'].map((runtime)=>require('./.skilled/hooks/session-relaunch/lib/relaunch-core.cjs').resolveGoalPacket({runtime,sessionId:'uuid-1',roots:['.'],env:{SESSION_RELAUNCH_GOAL_PACKET:'specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume'}}))))"
["","","",""]
```

Four runtimes answer `''` for a uuid with the hand-over variable set and a packet that holds `goal.md`. Devin and Cursor should answer the packet after the change, and Claude and Codex should stay `''`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `SESSION_RELAUNCH_GOAL_PACKET` for a `devin` or `cursor` session whose id has no record, and only when `goalPacketProblem` accepts the value.
- Report the resolver's reason through a sibling and print one `goal not carried:` line on stderr when the goal switch is on and the sender had a goal.
- Find a packet outside the lineage when exactly one `goal.md` under `specs/` carries the goal headline, skipping `scratch/`, `lineages/` and `z_archive/`.
- Print the manual route for a `cursor` or `devin` prepare under the loop.
- Add the must-fail cases and the guard cases to the two session-relaunch test files.

### Out of Scope
- A Codex goal reader and the Codex `Active goal:` note prose - no reader exists, and the note prose belongs to phase 001.
- A relaunch record field or a new module - parent D3 rules them out.
- The review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder - parent D4 rules them out.
- A change to `resolveGoalPacket`'s string return - the CLI path and the existing cases read a string.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Add the Devin and Cursor hand-over fallback, the reason sibling and the bounded headline search. |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Print one goal reason on stderr and branch the prepared text for Cursor and Devin. |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Add the fallback, search and guard cases. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Add the reason, manual-route and stdout guard cases. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `resolveGoalPacket` returns the packet named by `SESSION_RELAUNCH_GOAL_PACKET` for a `devin` or `cursor` session whose id has no record, only when `goalPacketProblem` accepts the value, and a matching record still wins. `node --test --test-name-pattern 'hands a devin or cursor session the hand-over packet' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0. |
| REQ-002 | `prepare` prints exactly one `goal not carried:` line on stderr when the goal switch is on and either an active Claude goal names no packet or the sender is Codex, and stdout keeps the pinned prepared text. `node --test --test-name-pattern 'one goal reason on stderr' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0. |
| REQ-003 | `resolveGoalPacket` returns the one packet outside the spec folder lineage whose `goal.md` carries the goal headline, and returns `''` when two packets carry it. `node --test --test-name-pattern 'finds a goal headline outside the packet lineage' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0. |
| REQ-004 | For a `cursor` or `devin` session under the loop, `prepare` prints a text that says nothing ends the session and tells the operator to exit it and run the claim command the wrapper prints. `node --test --test-name-pattern 'manual route for a cursor or devin session' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The hand-over packet variable stays off for `claude`, `codex`, `pi` and `opencode` when no record matches, and the pinned prepared text for `claude` stays unchanged. `node --test --test-name-pattern 'keeps the hand-over packet off' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 and `node --test --test-name-pattern 'prepared handoff and the stop instruction' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every must-fail case fails before its change and passes after it.
- **SC-002**: The guard cases pass before and after the change.
- **SC-003**: Both session-relaunch suites exit 0 and strict validation prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `goal-core.cjs` record readers for Devin and Cursor | The fallback cannot prove a record miss. | The fallback reads only the environment after the record lookup, and the tests use a uuid with no record. |
| Risk | The `specs/` headline search reads many files or follows a link outside a root. | A slow prepare or a packet from outside the repository. | Bound the walk, skip the three folders, take only one match, and pass every candidate through `goalPacketProblem`. |
| Risk | The reason line fires when the operator had no goal. | Noise on every prepare. | The sibling reports a reason only for a known goal, and the switch-off path returns before the print. |
| Risk | The Cursor and Devin text breaks the pinned stdout case. | The prepare contract fails for every runtime. | Assert the exact text per runtime and keep the Claude case unchanged. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - the change runs no service.
- **NFR-P02**: The headline search runs only when the record and the lineage both miss, and it is bounded to `specs/`.

### Security
- **NFR-S01**: N/A - the change adds no auth path.
- **NFR-S02**: The hand-over variable is a path and reaches no reader before `goalPacketProblem` accepts it.

### Reliability
- **NFR-R01**: The resolver never throws. A failed record read, log read or search returns `''`, and a known goal that cannot be carried adds one reason.
- **NFR-R02**: N/A - the change handles no request traffic.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a sender with no goal prints no reason and the note loses no field.
- Maximum input: a headline carried by two packets returns `''` and one reason.
- Failure path: a hand-over packet variable that names no `goal.md` is ignored, prepare still arms, and the sender's goal case decides whether a reason prints.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two source files and two test files. |
| Risk | 7/25 | A bounded path search and one user-visible text branch. |
| Research | 8/20 | The finding and the existing cases supply the line numbers and the runtime rows. |
| **Total** | **25/70** | **Level 2** |
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
