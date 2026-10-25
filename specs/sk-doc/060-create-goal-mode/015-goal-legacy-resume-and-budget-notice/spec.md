---
title: "Feature Specification: Phase 15: goal-legacy-resume-and-budget-notice"
description: "Three leftovers from the no-budget-stop change: a goal record an older plugin suppressed stays suppressed, the budget option records a number and says nothing about ending nothing, and the claim that continuation needs the autonomy switch was read in docs and never run. This phase fixes the first two and proves the third live."
trigger_phrases:
  - "goal legacy resume budget notice"
  - "phase 15 goal legacy resume and budget notice"
  - "opencode goal suppressed record resume"
  - "goal budget reading only notice"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 15: goal-legacy-resume-and-budget-notice

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-24 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-goal-no-budget-stop |
| **Successor** | None |
| **Handoff Criteria** | A suppressed legacy record resumes, a recorded budget prints its notice, the autonomy claim has a live run, and the goal suites stay green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the create-goal mode specification.

**Scope Boundary**: The OpenCode goal plugin resume and budget paths, their tests, the plugin and command docs, and the limitation text in the phase 14 summary. The shared core and the other runtimes are unchanged.

**Dependencies**:
- Phase 014, which removed the budget, turn and time stops.

**Deliverables**:
- Resume that clears a suppression an older version set.
- A one-line notice when a budget is recorded.
- A corrected limitation in the phase 14 summary.
- A live run of the autonomy switch past the old 8-turn cap.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 14 left three loose ends. A record an older plugin suppressed with a cap or budget reason keeps `continuationSuppressed` true, and `/goal-opencode resume` only handles paused, usage-limited and budget-limited records, so that goal stays stuck until it is set again. The phase 14 summary says a two-day sweep clears it, but the sweep archives orphaned files, so that sentence is wrong. The `--budget` option still records a number that ends nothing and says so only in the docs. The claim that automatic continuation is off unless `OPENCODE_GOAL_AUTONOMY=active` was read in the docs and never run, so the no-ceiling behavior was never seen past the old 8-turn cap.

### Purpose
An older suppressed goal can be resumed, the budget option tells the operator it ends nothing, and the no-ceiling behavior has a live run behind it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the plugin resume path and name the suppression reasons the retired caps and budget set, then let `resume` clear a record suppressed for one of them.
- Print one line when `--budget` records a figure: recorded as a reading, never enforced. Keep the option, because callers pass it today.
- Correct limitation 2 in the phase 14 implementation summary, which names the wrong cleanup.
- Run OpenCode live with autonomy off and on, and read the iteration counter past the old 8-turn cap.

### Out of Scope
- Removing `--budget` - the recommendation is a notice, and removal would break the callers named in the plan
- Any change to the shared core, Pi, Cursor, Devin or Hermes - none of them ever stopped a goal on a limit
- Adding a new stop of any kind - the operator asked that no goal stop on a budget, a turn count or elapsed time

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/plugins/opencode-goal.js (also reachable as .skilled/plugins/opencode-goal.js) | Modify | Resume clears a legacy suppression, and a recorded budget prints its notice |
| .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs and opencode-goal-capabilities.test.cjs | Modify | Failing-first tests for both |
| .skilled/hooks/goal/goal-plugin.md and .skilled/commands/goal-opencode.md | Modify | Say how an older suppressed goal resumes and that the budget is a reading |
| specs/sk-doc/060-create-goal-mode/014-goal-no-budget-stop/implementation-summary.md | Modify | Correct limitation 2 |
| scratch/ in this folder | Create | The live autonomy run transcript |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/goal-opencode resume` on a record an older version suppressed with a retired reason clears the suppression and the goal continues |
| REQ-002 | A live OpenCode run with autonomy on shows the iteration counter past 8 with the goal still active, and a run with autonomy off shows no automatic continuation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Recording a budget prints one line saying it is a reading and is never enforced, and the option still works |
| REQ-004 | Limitation 2 in the phase 14 summary names what clears a suppressed record |
| REQ-005 | The OpenCode goal suites and the shared hook suites pass at their baselines |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A record built the way the old plugin left it resumes, and the test fails against today's plugin.
- **SC-002**: The live run reads an iteration above 8 from the plugin status, not from the model reply.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A model and quota for a run of nine or more auto turns | The live run is short | Use a cheap model and a trivial repeating objective, and record the model used |
| Risk | Resume clears a suppression the operator set on purpose | Med | Clear only a suppression whose reason is one of the retired ones, and leave a pause alone |
| Risk | A live goal with no ceiling runs on after the proof | Med | Pause and clear the goal at the end of the run and confirm it in status |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The notice and the resume check add no I/O beyond the record the plugin already reads.

### Security
- **NFR-S01**: The live run uses no bypass flag, and no key is printed.
- **NFR-S02**: State files keep their `0o700` directory mode.

### Reliability
- **NFR-R01**: Resume keeps a pause, a quota stop and a completion as they are.
- **NFR-R02**: The live run ends with the goal cleared.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A record with an unknown suppression reason: left alone by resume.
- `--budget 0`: recorded with the same notice.

### Error Scenarios
- A record that cannot be read: resume reports it and changes nothing.
- A live run that stalls before turn 9: recorded with the count reached.

### State Transitions
- A paused goal: resume behaves as before.
- A completed goal: resume refuses as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One plugin, two tests, docs |
| Risk | 8/25 | Live run with no ceiling |
| Research | 8/20 | Retired reason strings to find |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Resolved, operator-default decision: keep `--budget` with a notice. The docs and playbooks still pass the option and a removal would break those calls for a number that ends nothing anyway. The notice ships as the `notice=` line.
- Open: the live autonomy run needs a model with quota. The default route returned a 402 quota error, so REQ-002 and AC-002 wait on a rerun or an operator waiver.
- Note: `--budget 0` is rejected with `INVALID_TOKEN_BUDGET` (the existing contract and test), so it is not recorded and gets no notice, which differs from the edge case listed above.
<!-- /ANCHOR:questions -->

---
