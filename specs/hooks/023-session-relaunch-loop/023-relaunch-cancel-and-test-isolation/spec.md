---
title: "Feature Specification: Phase 23: relaunch-cancel-and-test-isolation"
description: "An audit of the session relaunch loop on 2026-10-24 found that its tests fail inside a looped session and write into the real relaunch log, that a deferred hand-over has no way back once the operator carries on, and that the hop history records a hand-over before the wrapper decides to make it. This phase fixes all three and makes a claim line name the session that claimed."
trigger_phrases:
  - "relaunch cancel and test isolation"
  - "phase 23 relaunch cancel and test isolation"
  - "session relaunch cancel command"
  - "withdraw deferred hand-over"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 23: relaunch-cancel-and-test-isolation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 23 |
| **Predecessor** | 022-runtime-certainty-claude-pi-opencode |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance row Met, the full relaunch suite green with and without the loop environment, and the real relaunch log untouched by a test run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the session relaunch loop specification. It fixes the defects an audit of the loop found on 2026-10-24.

**Scope Boundary**: The shared relaunch core, the relaunch CLI, the Claude hooks, the `skilled-loop` wrapper, their tests and the four docs that describe them. Pi, OpenCode and the other runtimes keep their behavior, because their withdraw-on-prompt paths already exist.

**Dependencies**:
- Phase 022, which added the Pi and OpenCode `user-message` withdraw that this phase brings to Claude.

**Deliverables**:
- Test isolation from the loop environment, a Claude withdraw on a new operator prompt, a `cancel` subcommand, a `hand-over` subcommand that records the hop after the wrapper's checks, and a session id on the `claimed` line.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Run from inside a looped session, the relaunch suite inherits the wrapper's `SKILLED_LOOP_*` variables and 13 of 682 tests fail. Two `dropNestedLoop` tests also write `loop-nested-run loopId=100` into the real `relaunch.log`. On Claude, a hand-over the Stop hook deferred for a background task stays pending after the operator carries on, so the next clean Stop arms it and ends the session onto a stale note. With no cancel command, the model improvised the wrapper-internal `consume` on 2026-10-24. Separately, `should-relaunch` writes the `handed-over` history line and the hop notice before `skilled-loop` runs its last checks, so a declined relaunch still shows as a hand-over. The `claimed` line also names no session, so a self-claim reads like a hand-over.

### Purpose
The suite passes in any environment without touching real state, a session that carries on past a prepared hand-over keeps running, and the hop history records only hand-overs that happened, with the claiming session named.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `SKILLED_LOOP_*` scrub at the top of the four test files that read the default environment, and a sandbox runtime directory for the two `dropNestedLoop` tests.
- A `deferredAt` mark on a Claude Stop deferral, and a withdraw with reason `user-message` when the operator sends a prompt while that record waits.
- A `cancel [--loop-id]` subcommand, named in the in-loop nudge text.
- A `hand-over --loop-id` subcommand that consumes the record and records the hop only when the note is open, called by the wrapper on its relaunch path.
- An eighth `session` column on the `claimed` history line, shown by `history` as `by <id>`.
- Widened by the operator after the review: one more context nudge after a withdraw or cancel, a compaction pointer that does not seed a claim of a withdrawn note, a killer that leaves a cancelled record alone, the hop line written only after the wrapper reads its decision, the nested-run check in `cancel`, a withdrawn note no longer shown as unclaimed work, and a lock around the record writes.
- Widened by the operator, the adjacent defects: a lock around note claim and complete, a spec-folder existence check at prepare and keep, every `SKILLED_LOOP_*` variable dropped by `dropNestedLoop`, and the v4.0.0.13 release note corrected where it promised Devin a `/speckit:handoff` command.

### Out of Scope
- An expiry for pending records measured from `preparedAt` - the operator chose withdraw-on-prompt instead.
- Flagging `claimed` notes that never reach `done` - dropped by the operator.
- A Devin command mirror - Devin carries no command surface by an earlier operator decision recorded in `.devin/SYNC.md`, so the release note is corrected instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | Modify | Add `markDeferred` and `withdrawDeferred` |
| .skilled/hooks/session-relaunch/lib/hop-history.cjs | Modify | Optional `session` field on `recordHop`, rendered by `readHistory` |
| .skilled/hooks/session-relaunch/lib/nudge.cjs | Modify | Name `cancel` in the in-loop hand-off text, re-arm one nudge after a withdraw or cancel, the withdrawn-note compaction text |
| .skilled/hooks/session-relaunch/lib/killer.cjs | Modify | Treat a record that is no longer armed as superseded at timeout |
| .skilled/hooks/session-relaunch/claude/compact-pointer.mjs | Modify | Point at a withdrawn note without seeding a claim |
| .skilled/changelog/skilled/v4.0.0.13.md | Modify | Say how Devin hands over without a command surface |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Modify | Add `cancel` and `hand-over`, move the hop record out of `should-relaunch`, pass the session to `claim`'s hop line |
| .skilled/hooks/session-relaunch/claude/stop-arm.mjs | Modify | Mark a deferred record |
| .skilled/hooks/session-relaunch/claude/context-nudge.mjs | Modify | Withdraw a deferred record on an operator prompt and say so |
| .skilled/bin/skilled-loop | Modify | Call `hand-over` on the relaunch path |
| .skilled/hooks/session-relaunch/tests/*.test.cjs | Modify | Isolation scrub and new behavior tests in eight files |
| .skilled/hooks/session-relaunch/README.md, tests/README.md, .skilled/bin/README.md, system-spec-kit feature catalog entry | Modify | Describe the new subcommands and behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The relaunch suite passes with the loop environment set and unset, and writes nothing to the real `relaunch.log` |
| REQ-002 | On Claude, an operator prompt that arrives while a deferred hand-over waits withdraws it, and a background-task completion does not |
| REQ-003 | The `handed-over` line and the hop notice are written only on the wrapper path that relaunches, and only when the note is open |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A `cancel` subcommand disarms the loop's pending or armed record, and the in-loop nudge names it |
| REQ-005 | The `claimed` history line names the claiming session, and older seven-column lines still read |
| REQ-006 | After a withdraw or cancel, exactly one more context nudge fires once the fill rises one step, and compaction does not seed a claim of the withdrawn note |
| REQ-007 | A withdrawn or cancelled record gets no killer timeout, no manual claim command at wrapper exit and no unclaimed-work line in `history` |
| REQ-008 | The `handed-over` line is written only after the wrapper has read an open note from the consumed record |
| REQ-009 | Record writes and note claim and complete run under a lock, and `cancel` drops an inherited loop id from a nested run |
| REQ-010 | `dropNestedLoop` drops every `SKILLED_LOOP_*` variable, and prepare and keep refuse a note whose spec folder does not exist |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full relaunch gate passes all tests in both environments, against a baseline of 669 of 682 inside the loop.
- **SC-002**: Every new-behavior test fails against main's code, so each one guards the change it names.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude sends a background task's completion as a prompt starting with `<task-notification>` | If the prefix changes, a completion would withdraw the hand-over it was waiting for | The pattern is one constant, and a test pins the completion case |
| Risk | A Stop arms the record between the withdraw's read and its write | Med | `unarm` runs with `expectedStatus: 'pending'`, so an armed record is kept |
| Risk | Older wrappers still call `consume` | Low | `consume` keeps its old behavior, and only the relaunch path moved to `hand-over` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The withdraw check reads one small record file per Claude prompt and adds no network call.
- **NFR-P02**: The hop record stays inside a `try` block, so a history write never blocks a relaunch.

### Security
- **NFR-S01**: State files keep their `0o700` directory mode.
- **NFR-S02**: The test suite writes only inside its sandboxes.

### Reliability
- **NFR-R01**: `cancel` and `withdrawDeferred` use the guarded `unarm`, so they never disarm a record that changed under them.
- **NFR-R02**: The history file stays readable by the same split for old and new lines.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No record for the loop: `cancel` prints that nothing is prepared and exits 1.
- No `--loop-id` outside a loop: `cancel` prints that the loop id is required and exits 2.
- A seven-column history line: `history` renders it without a session label.

### Error Scenarios
- A note that is no longer open at relaunch: `hand-over` consumes the record and writes no `handed-over` line.
- A record that changed during `cancel`: the command says so and exits 1.

### State Transitions
- A pending record that was never deferred: a new prompt keeps it, because the session prepared it moments ago.
- A record from another session: the withdraw keeps it.
- A note the session updated after a withdraw: compaction seeds the claim as before.
- A cancel that lands while the killer times out or is about to signal: the killer stays silent and sends no signal.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 9 code files, 9 test files, 8 docs and the release note |
| Risk | 12/25 | The wrapper's relaunch path and a shared state transition |
| Research | 6/20 | The audit that found the defects, plus one transcript check |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose withdraw-on-prompt over an expiry and dropped the stale-claim flag.
<!-- /ANCHOR:questions -->

---
