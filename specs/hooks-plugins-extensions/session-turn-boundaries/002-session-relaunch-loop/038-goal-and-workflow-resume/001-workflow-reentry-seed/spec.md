---
title: "Feature Specification: Phase 1: workflow-reentry-seed"
description: "After a session hop the receiver gets a note with no active command, no goal read and no release of a deep-loop lock. A resumed session continues by hand, a deep loop fails closed on a lock nobody released, and a Codex note never carries a goal."
trigger_phrases:
  - "workflow reentry seed"
  - "phase 1 workflow reentry seed"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: workflow-reentry-seed

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
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-pi-bind-once |
| **Handoff Criteria** | Phase 001 is Complete, `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0, and every row of `acceptance-criteria.md` is Met. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Goals and running workflows survive a session hop on every runtime specification.

**Scope Boundary**: The two prose builders in `nudge.cjs` and the manual mirror in `handoff.md`. No relaunch record field, no new module and no new hook.

**Dependencies**:
- None. Phase 001 lands first, and its lock release step ships with the deep-loop re-run route.

**Deliverables**:
- The active command line, the deep-loop lock release step, the seed re-run step, the goal read step and the Codex active goal line.
- Tests in `nudge.test.cjs` that fail before each builder change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A claim seed tells the receiver to continue the note's Remaining work and nothing else. The note carries no structured active command, so a resumed session cannot re-enter the command the sender was running. A deep loop holds a lock that no hop releases, so its re-run fails closed. A Codex note never carries a goal packet, so the receiver loses the goal. The seed never names the phase goal either.

### Purpose
After a hop the receiver runs the sender's command again, reads the goal of the phase it works, and a Codex sender names its goal in the note.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n 'Active command|Active goal|loop-lock\.cjs|goal\.md|Continue the work under' .skilled/hooks/session-relaunch/lib/nudge.cjs
248:    `${continueStep}. Continue the work under "Remaining work". Do not run prepare for this note; `
```

The only work step in the seed is the Continue the work line. No line names an active command, a deep-loop release or a goal read.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an `Active command:` line under `## In-flight state` in `handoffText`, with `none` when no command runs.
- Add a sender step that releases a held deep-loop lock with the captured `--lock-path`, `--owner-pid` and `--nonce` values before prepare.
- Add a seed step that runs the active command again with the same mode and arguments and leaves the step choice to the command's own state detection.
- Add a seed step that reads the bound packet's `goal.md` before the Remaining work.
- Add a Codex `Active goal:` request to `handoffText` and a `create_goal` bring-back step to `seedText`.
- Mirror the note shape and the steps in the manual command.
- Add `nudge.test.cjs` cases that fail before each builder change.

### Out of Scope
- Step state inside a command workflow - the receiver runs the command again and the command picks the step.
- A field in the relaunch record - the active command travels as a line in the note, per parent D3.
- The `prepare` stderr line that says a goal was not carried - phase 003 owns the resolver and the prepare output.
- A Codex goal reader - no reader exists and the fix is prose only.
- The review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder - parent D4 rules them out.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | Add the active command line, the lock release step, the seed re-run step, the goal read step and the Codex active goal line. |
| `.skilled/commands/speckit/handoff.md` | Modify | Describe the same note line and steps for the manual command. |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modify | Add the five cases that fail before the builder changes and keep the note shape case green. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `handoffText` asks the sender to write an `Active command:` line under `## In-flight state`, and to write `none` when no command runs. `node --test --test-name-pattern 'active command line' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0. |
| REQ-002 | `handoffText` has one step before `prepare` that releases a held deep-loop lock with `loop-lock.cjs release --lock-path <path> --owner-pid <pid> --nonce <nonce>`. `node --test --test-name-pattern 'deep-loop lock before prepare' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0. |
| REQ-003 | `seedText` has one step that runs the note's active command again with the same mode and arguments, and says the command's own state detection picks the step. `node --test --test-name-pattern 'runs the active command again' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0. |
| REQ-004 | `seedText` has one step that reads the bound spec folder's `goal.md` before the Remaining work, and says it binds the session goal. `node --test --test-name-pattern 'reads the spec folder goal' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | For `runtime === 'codex'`, `handoffText` asks for an `Active goal:` line and `seedText` has a `create_goal` bring-back step for a note that carries it. `node --test --test-name-pattern 'active goal line' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0. |
| REQ-006 | `.skilled/commands/speckit/handoff.md` names the same note line and the same four steps for the manual command. `rg -n -e 'Active command' -e 'Active goal' -e 'goal\.md' -e 'release --owner-pid' .skilled/commands/speckit/handoff.md` prints at least one line for each term. |
| REQ-007 | The existing note shape and the existing claim path keep working. `node --test --test-name-pattern 'all four sections and prepare command' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 and `node --test --test-name-pattern 'claim exits zero and prints the claimed note body' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five must-fail cases in `nudge.test.cjs` pass after the builder changes.
- **SC-002**: `handoff.md` names the same note line and the same steps as the two builders.
- **SC-003**: The note shape case and the claim case still pass, so the note format and the claim output are unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs` accepts `release --owner-pid --nonce`. | The lock step cannot be written. | Keep the step prose only and name the values the command captured. |
| Risk | Adding steps renumbers the pinned step assertions in `nudge.test.cjs`. | The existing cases fail for the wrong reason. | Update the pinned numbers in the same change and keep the note shape case green. |
| Risk | The seed claims the step will be resumed. | The receiver skips the command's own state detection. | The step says run the command again and let its state detection pick the step. |
| Risk | The active command line lands in Remaining work. | The next session treats the command as unfinished work. | The line sits under In-flight state, where the note guidance already keeps handoff steps out of Remaining work. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - the change adds string lines to two builders and no filesystem or process work.
- **NFR-P02**: N/A - the change runs no service.

### Security
- **NFR-S01**: N/A - the change adds no auth path.
- **NFR-S02**: The new lines carry no credential and the note stays private runtime state in a gitignored directory.

### Reliability
- **NFR-R01**: A missing `goal.md`, a missing command line and a failed lock cannot throw a builder. The builders stay pure string functions.
- **NFR-R02**: N/A - the change handles no request traffic.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a note with no command line and no `goal.md` still produces a seed whose Remaining work step is unchanged.
- Maximum input: a long command with many arguments stays one line under In-flight state, and the seed copies it verbatim.
- Failure path: a Codex note with no `goal_packet` and no `goal.md` keeps the `Active goal:` line as its only route, and the seed says so.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two prose builders, one command doc and one test file. |
| Risk | 6/25 | Prose only, no record or schema change. |
| Research | 6/20 | The finding supplies the line numbers and the test names. |
| **Total** | **20/70** | **Level 2** |
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
