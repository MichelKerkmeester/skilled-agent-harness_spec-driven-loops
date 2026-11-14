---
title: "Feature Specification: Phase 20: question-guard-killer-gone"
description: "An armed Claude hand-over whose killer died still lets a question dialog through, so the turn stays open and no Stop arms the hop again. The guard denies only a pending record."
trigger_phrases:
  - "question guard killer gone"
  - "phase 20 question guard killer gone"
  - "armed record with no live killer denies a question dialog"
  - "subagent guard armable verdict"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: question-guard-killer-gone

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | Not chosen yet. The operator picks a worktree or the current branch before the build |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 23 |
| **Predecessor** | 019-relaunch-doc-coverage |
| **Successor** | 021-goal-scan-large-log |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 020-question-guard-killer-gone --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the hop dialog, goal and title specification, opened by the whole-epic review of 2026-11-14.

**Scope Boundary**: One condition and its comment in `claude/subagent-guard.mjs`, two tests in `tests/subagent-guard.test.cjs`, one added evidence test in the same file and one row of `claude/README.md`. The Claude adapter only. No other runtime, no relaunch record key and no log event.

**Dependencies**:
- Phase 1 built the guard and its `AskUserQuestion` binding.
- Phase 5 made a Stop that cannot arm stamp the record, so the next prompt withdraws it.
- Phase 17 added the missing-transcript notice on the same Stop.
- A killer spawn failure is the state this phase closes. The test `stop-arm logs an async killer spawn error and leaves the record armed` pins it at `tests/claude-adapters.test.cjs:1001`.

**Deliverables**:
- A guard that denies a question dialog while the record can still be armed, which covers a pending record and an armed record with no live killer.
- A guard that allows the dialog once a live killer owns the loop's lock.
- A split of the one armed-record test into a denial and a live-killer control.
- One test that a record read that throws lets the dialog through, which proves a row of phase 1 that has only a source reading today.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`pendingHandOver` denies a question dialog only when `armableRecord` reports `reason === 'pending'` (`claude/subagent-guard.mjs:84`). The verdict has a second armable state: an armed record whose killer lock has no live owner reports `armable: true, reason: 'killer-gone'` (`lib/relaunch-core.cjs:1182` to `:1184`). That state follows a killer spawn failure, because `stop-arm.mjs` logs the failure and leaves the record armed (`:74` to `:83`, returned at `:230`, test at `tests/claude-adapters.test.cjs:1001`). The next Stop re-arms such a record, but nothing ends the turn before it, so an open question dialog parks the hop exactly as a pending record does.

The test `subagent-guard lets a question dialog through once the record is armed` (`tests/subagent-guard.test.cjs:313`) arms a record with no killer and asserts that the dialog passes. It pins the one armed state where the stated reason does not hold.

### Purpose
A question dialog is refused while this session's record can still be armed, whether its status is pending or armed with no live killer. It is allowed once a live killer owns the loop's lock, because that killer ends the idle session and the hop goes ahead.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-14 at commit `fa6a56f0fc`. The first command shows the one reason the guard accepts. The second shows both armable reasons in the core. The third shows the three tests that pin the current states.

```text
$ rg -n -o "verdict.reason === 'pending'" .skilled/hooks/session-relaunch/claude/subagent-guard.mjs
84:verdict.reason === 'pending'
exit=0

$ rg -n -o "armable: true, reason: 'killer-gone'|armable: true, reason: 'pending'" .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
1180:armable: true, reason: 'pending'
1183:armable: true, reason: 'killer-gone'
exit=0

$ rg -n "subagent-guard lets a question dialog through once the record is armed|stop-arm logs an async killer spawn error and leaves the record armed|liveKillerPid returns a live lock owner" .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs
.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1677:test('liveKillerPid returns a live lock owner and null otherwise', async (t) => {
.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:313:test('subagent-guard lets a question dialog through once the record is armed', async (t) => {
.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1001:test('stop-arm logs an async killer spawn error and leaves the record armed', async (t) => {
exit=0
```

The guard accepts one of the two armable reasons. The core reports both. The test at line 313 arms a record with no killer and asserts the dialog passes, and the live-killer lock format the new control needs is pinned at `tests/relaunch-core.test.cjs:1686`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Return the record from `pendingHandOver` whenever `verdict.armable` is true, in place of the `reason === 'pending'` comparison, and correct the comment above it.
- Split `subagent-guard lets a question dialog through once the record is armed` into two tests. An armed record with no live killer is denied. An armed record with a live killer is allowed, with the lock file owned by `process.pid` as `liveKillerPid returns a live lock owner and null otherwise` writes it at `tests/relaunch-core.test.cjs:1686`.
- Add one test that a record read that throws lets the dialog through. The guard already fails open, so this test proves the path rather than changing it. It closes the source-reading-only row of phase 1.
- State the new rule in the `subagent-guard.mjs` row of `claude/README.md`.

### Out of Scope
- `ExitPlanMode`, permission prompts and the question tools of Pi, OpenCode, Codex, Cursor and Devin. Parent decision D2 keeps every other adapter unchanged.
- A change to `armableRecord`. It already reports both armable states and the live-killer refusal correctly.
- A new log event or a relaunch record key. Parent decision D3 forbids a new key, and the denial is shown to the session, not logged.
- A live hop. The state is reached through the hook process and the core, and no live run is made here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Modify | The guard returns the record for any armable verdict, and the comment names both armable states |
| `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | Modify | The armed-record test splits in two, and a throwing-read test is added |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modify | The `subagent-guard.mjs` row states the armable rule and the live-killer exception |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Given an armed record for this session and no live killer lock, When the guard sees an `AskUserQuestion` PreToolUse, Then it prints one deny envelope that names the note path and the `cancel` command. The changed test fails before the source edit and passes after. |
| REQ-002 | Given the same armed record and a lock file for the loop owned by `process.pid`, When the guard sees the same dialog, Then it exits 0 with no output. |
| REQ-003 | Given a pending record, another session's record, a record with no `handoff`, no `SKILLED_LOOP_ID` or a disabled concern, When the guard sees the dialog, Then it answers as it does today. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Given a record read that throws, When the guard runs, Then it exits 0 with no output, and a test in `tests/subagent-guard.test.cjs` proves it. The test is evidence only, because the fail-open path does not change. |
| REQ-005 | The relaunch and OpenCode plugin suites pass at the final state with two more tests than the baseline taken before the first edit, one net test from the split and one evidence test. |
| REQ-006 | The `subagent-guard.mjs` row of `claude/README.md` names both armable states and the live-killer exception. The fix adds no module, no record key and no log event, and no added code line names a packet, phase, task or finding number. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows the armed-record denial failing before the source edit, and `scratch/green.txt` shows it passing after.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with `fail 0`.
- **SC-003**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with the baseline count plus two.
- **SC-004**: `node --check` exits 0 on the adapter and on the test file, and `validate.sh 020-question-guard-killer-gone --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `armableRecord` keeps reporting `pending` and `killer-gone` as armable | The new condition would deny the wrong states | The test reads the verdict through the guard and the core, and the core's own verdict text is pinned at `lib/relaunch-core.cjs:1168` to `:1170` |
| Dependency | `liveKillerPid` reads the lock file the test writes | The live-killer control would pass for the wrong reason | The test writes the lock in the same format and path as `tests/relaunch-core.test.cjs:1686` |
| Risk | A killer is spawned between the verdict and the denial | A dialog is refused although the hop can arm | Low. The next prompt withdraws the record, and a refused dialog can be asked again after the hop |
| Risk | A record read that throws in a way the test cannot reproduce | The evidence test cannot fail on a broken build | The test removes read permission from the record file, which raises `EACCES` for the spawned hook as the same user |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: one comparison on a path that already runs per question dialog.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The denial text holds the note path and the loop id the record already carries. No payload field reaches it.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A record read that throws still lets the turn continue, and a test now proves it.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a payload with no `session_id` or no `SKILLED_LOOP_ID` reaches no record and exits 0 with no output.
- Maximum input: an armed record whose lock names a live pid is allowed, and one whose lock is empty, malformed or past its expiry is denied.
- Failure path: a record read that throws is caught, the guard exits 0 and the dialog reaches the operator.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | One condition, one comment, three tests and one README row |
| Risk | 3/25 | The verdict comes from the core that already owns the rule |
| Research | 3/20 | One finding, checked against the code and the spawn-failure test |
| **Total** | **9/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a killer spawn failure always leave the record armed? The test at `tests/claude-adapters.test.cjs:1001` proves the async error path. The synchronous throw path has its own test at `:1044`, and both leave `status: armed`.
- Does the guard see the killer lock in the same state directory as the Stop hook? The core resolves both through `stateDir(env)`, and the guard reads the record through `readRelaunchFile` with the same environment.
<!-- /ANCHOR:questions -->

---
