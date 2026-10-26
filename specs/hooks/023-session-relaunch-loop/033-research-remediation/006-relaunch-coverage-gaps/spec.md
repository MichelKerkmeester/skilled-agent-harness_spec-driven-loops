---
title: "Feature Specification: Phase 6: relaunch-coverage-gaps"
description: "Four relaunch paths have no test, and a note reused with the goal switch off hands on its old goal packet when the switch is on at consume. Prepare records the switch on the relaunch record and consume reads that."
trigger_phrases:
  - "relaunch coverage gaps"
  - "phase 6 relaunch coverage gaps"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: relaunch-coverage-gaps

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 (wave 4, after 004) |
| **Predecessor** | ../005-persisted-hops-validation/spec.md |
| **Successor** | ../007-compaction-pointer-staleness/spec.md |
| **Handoff Criteria** | All four new tests pass, the reused-note test failed first and passes after the record-based fix, and every row in `acceptance-criteria.md` is Met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the research remediation packet. It adds tests for the server equals form, a missing runtime binary, concurrent claims and a reused note with the goal switch off, and fixes the reused-note defect. It builds in wave 4, after phase 004 is Complete: 004 moves `usableGoalPacket` into `relaunch-core.cjs`, and this phase edits that moved copy. Phase 004 itself follows 002, which rewrites consume and shares `session-relaunch-cli.test.cjs` with this phase. The build order is the wave order in `../spec.md`, not the folder order.

**Scope Boundary**: Three test files, `preparePending` and the moved `usableGoalPacket` in `lib/relaunch-core.cjs`, and the CLI's prepare and consume calls in `bin/session-relaunch.cjs`.

**Dependencies**:
- Phase 002 Complete (consume rewrite and the shared CLI test file).
- Phase 004 Complete (`usableGoalPacket` moved into the core).

**Deliverables**:
- One failing-first test (reused note, switch on at consume) and three coverage tests that pass on current code.
- The record-based fix for the reused-note defect.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four relaunch paths have no test (research section 9, findings 6 to 9, and section 15). Three of them already behave correctly and need coverage only. The OpenCode 2 `--server=URL` branch at `.skilled/bin/skilled-loop:576` and its warning at `:625-628` are covered only for the spaced form `--server URL` (`skilled-loop.test.cjs:1056-1063`); the equals form passes on current code. A missing runtime binary at `skilled-loop:661-665` exits 127 on current code (a reviewer ran the wrapper with no runtime on PATH: exit=127), with no test. The lock in `claimHandoff` (`relaunch-core.cjs:1065-1085`) is tested only sequentially (`relaunch-core.test.cjs:278-304`); a concurrent claim passes on current code.

The fourth is a confirmed defect. With `SESSION_RELAUNCH_GOAL=0`, prepare's `recordGoalPacket` returns early (`bin/session-relaunch.cjs:388`) and leaves the note's old `goal_packet` field. Consume calls `usableGoalPacket` (`:376-381`, called at `:708`), which reads the switch again at consume time (`:378`), so with the switch on at consume it hands on the old packet. A consume-only fix cannot work: consume cannot tell a field a switch-off prepare kept from one an earlier prepare wrote, and the existing test at `session-relaunch-cli.test.cjs:2496-2516` requires the latter to be handed on.

### Purpose
Each of the four paths has a passing test, and a note prepared with the goal switch off hands on no packet at consume, whatever the switch reads then.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A wrapper test for OpenCode 2 with `--server=http://localhost:4096`.
- A wrapper test for a runtime binary absent from PATH.
- A core test with two real processes claiming one open note.
- A CLI test for a reused note with the goal switch off at prepare, then off and on at consume.
- The record-based fix: `preparePending` records the goal-switch state on the relaunch record, and consume hands on `goal_packet` only when that recorded state was on.

### Out of Scope
- Changing the claimed error message - phase 008 owns it, so tests assert only the kept prefix.
- The same exposure in `claim` (`bin/session-relaunch.cjs` ~639). A manual claim has no relaunch record to read, so it keeps reading the switch at claim time. This is a documented limit: a note prepared with the switch off and then claimed by hand with the switch on can still hand on its old packet. A fix needs the switch state on the note itself and is left to a later packet.
- The README sentence at `.skilled/hooks/session-relaunch/README.md:174` describing switch-off behavior - note any drift in the implementation summary.
- Any other wrapper, core or plugin behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modify | Equals-form server test and missing-binary test |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Two-process concurrent claim test |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Reused note with goal switch off test |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `preparePending` records the goal-switch state; the moved `usableGoalPacket` takes the recorded state |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Prepare passes the switch state to `preparePending`; consume passes the record's state to `usableGoalPacket` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A coverage test covers OpenCode 2 `--server=http://localhost:4096`: warning printed, launch arguments exactly `['--server=http://localhost:4096']` with no `--standalone`. |
| REQ-002 | A coverage test covers a missing runtime binary: exit status 127, with a PATH the test builds so no real runtime can run. |
| REQ-003 | A coverage test runs two concurrent claims on one open note behind a start barrier: one wins, the other gets the `claimed` refusal, and the note's `claimed_by` names the winner. |
| REQ-004 | A test reuses a note holding a goal packet with `SESSION_RELAUNCH_GOAL=0` at prepare, covering switch still off and switch on at consume. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `preparePending` records the goal-switch state on the relaunch record, and consume hands on `goal_packet` only when that recorded state was on; the existing consume test that reports a note's packet still passes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** `skilled-loop opencode --server=http://localhost:4096` on a stub OpenCode 2, **When** it starts, **Then** stderr has the shared-server warning and the stub's launch arguments equal `['--server=http://localhost:4096']`, with no `--standalone`. Passes on current code.
- **SC-002**: **Given** a PATH the test builds (a directory linking `node`, plus `/usr/bin:/bin`) with no runtime binary, **When** the wrapper starts the runtime, **Then** it exits 127. Passes on current code.
- **SC-003**: **Given** two child processes released by one start barrier to claim one open note, **When** both finish, **Then** exactly one returns the note, the other throws with the prefix `cannot claim handoff with status`, and the note's `claimed_by` names the winner. Passes on current code.
- **SC-004**: **Given** a note with `goal_packet` reused while `SESSION_RELAUNCH_GOAL=0` at prepare, **When** consume runs with the switch off and again with it on, **Then** neither reports `goal_packet`. The on-at-consume run fails on current code and passes after the fix.
- **SC-005**: **Given** the existing consume test at `session-relaunch-cli.test.cjs:2496-2516`, whose record carries no recorded switch state, **When** it runs after the fix, **Then** it still reports the note's packet with the switch on.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002 and 004 | 002 rewrites consume; 004 moves `usableGoalPacket` into the core | Build in wave 4, after 004 is Complete, and edit the moved copy |
| Risk | Records written before the fix, and test fixtures, carry no switch state | Med | Consume treats only a recorded `false` as off; an absent field falls back to the switch at consume, so the existing test keeps passing |
| Risk | `withAppendLock` runs the claim without the lock once its 2000 ms wait expires (`relaunch-core.cjs:26`, ~1284-1321) | Med | A slow machine can let both claims run unlocked, so the concurrency test can flake; keep the claim work tiny and note the risk in the test |
| Risk | Phase 008 changes the claimed message | Med | Assert on the kept prefix `cannot claim handoff with status` only |
| Risk | An in-process concurrency test never contends on the file lock | High | Use two separate child processes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The four new tests add under five seconds to the node test run.

### Reliability
- **NFR-R01**: The concurrency test passes on every run, with a start barrier rather than timing sleeps deciding when the claims start. Its one known flake source is the 2000 ms lock bypass named in the risks.
- **NFR-R02**: Tests write only under temporary directories and restore any environment they change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Equals form with an empty URL (`--server=`): still matched by the `--server=*` branch; not asserted here.
- A note with no `goal_packet`: consume hands on none, already covered.

### Error Scenarios
- Runtime binary missing: the shell returns 127 and the wrapper passes it on. The test PATH holds no runtime, since the harness otherwise puts its stub directory in front of the real PATH (`skilled-loop.test.cjs:299`) and every runtime binary is on this machine's PATH.
- Concurrent claims: the lock serializes them, so the second reads `claimed` and throws.
- Manual `claim` after a switch-off prepare with the switch on: still hands on the old packet; the documented limit in Out of Scope.

### State Transitions
- Switch off at prepare, on at consume: the stale packet must not be handed on (fails today).
- Switch off at both: no packet handed on (passes today; repeats the check at `session-relaunch-cli.test.cjs:2510`).
- Record with no switch field: consume uses the switch at consume, as before the fix.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Three test files, one record field across prepare and consume |
| Risk | 7/25 | Tests, plus one record field and a consume guard |
| Research | 4/20 | Paths already located by the research |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The reused-note defect is confirmed and the record-based fix is decided.
<!-- /ANCHOR:questions -->
