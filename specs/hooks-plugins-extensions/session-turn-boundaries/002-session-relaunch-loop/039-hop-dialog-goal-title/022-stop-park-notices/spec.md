---
title: "Feature Specification: Phase 22: stop-park-notices"
description: "A Claude Stop that cannot resolve a target pid, or whose arm throws, parks the hand-over and says nothing. The next prompt withdraws the hop, so the operator never learns why it never came."
trigger_phrases:
  - "stop park notices"
  - "phase 22 stop park notices"
  - "claude stop cannot arm prints a notice"
  - "target pid arm error systemMessage"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: stop-park-notices

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | Not chosen yet. The operator picks a worktree or the current branch before the build |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 23 |
| **Predecessor** | 021-goal-scan-large-log |
| **Successor** | 023-epic-review-doc-fixes |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 022-stop-park-notices --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the hop dialog, goal and title specification, opened by the whole-epic review of 2026-11-14.

**Scope Boundary**: Two branches of `claude/stop-arm.mjs`, two existing tests in `tests/claude-adapters.test.cjs`, one comment, the `stop-arm.mjs` row of `claude/README.md` and one sentence of `session-relaunch/README.md`. The Claude adapter only. No other runtime, no relaunch record key and no new log event.

**Dependencies**:
- Phase 5 made both branches stamp `deferredAt`, so the next prompt withdraws the record.
- Phase 17 added the missing-transcript notice and the guarded write this phase copies.
- The background-task branch already prints a `systemMessage` through the same `dependencies.write` seam.

**Deliverables**:
- One notice on the branch that resolves no target pid.
- One notice on the branch whose arm throws.
- A failed write on either branch logged as `stop-arm-error` with `stage: 'notice'`.
- The two existing tests extended to expect the notice, and both fail before the source edit.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`stop-arm.mjs` parks a prepared hand-over on three branches. Only the missing-transcript branch prints a `systemMessage` (`claude/stop-arm.mjs:138` to `:154`). The branch that resolves no target pid logs `stop-arm-error stage=target-pid`, calls `markParked` and returns (`:196` to `:200`). The branch whose `arm` call throws logs `stop-arm-error stage=arm`, calls `markParked` and returns (`:215` to `:219`). In both, the record gains `deferredAt` and the operator's next prompt withdraws the hop through `lib/withdraw.cjs`. The prompt hook's notice reaches the model as additional context, not the operator. A hop that never comes therefore looks like a hop that is still coming, for the same reason the missing-transcript branch printed its notice.

### Purpose
Every Claude Stop that parks a prepared hand-over prints one line that names the cause, says the next prompt withdraws the hand-over and says a later Stop tries again. The stamp, the log line and the withdrawal stay as they are.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-14 at commit `fa6a56f0fc`. The first command shows the three `markParked` branches and the one notice. The second shows the two tests that assert a stamp and a log line but no stdout or write.

```text
$ rg -n -o "logEvent\('stop-arm-error', \{ stage: 'target-pid'|logEvent\('stop-arm-error', \{ stage: 'arm'|markParked\(loopId, env\)|systemMessage: 'Session relaunch could not arm" .skilled/hooks/session-relaunch/claude/stop-arm.mjs
53:markParked(loopId, env)
140:markParked(loopId, env)
146:systemMessage: 'Session relaunch could not arm
168:markParked(loopId, env)
197:logEvent('stop-arm-error', { stage: 'target-pid'
198:markParked(loopId, env)
216:logEvent('stop-arm-error', { stage: 'arm'
217:markParked(loopId, env)
exit=0

$ rg -n "when no process below the loop can be found|when arming throws" .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
1351:test('stop-arm marks the pending record deferred when no process below the loop can be found', async (t) => {
1380:test('stop-arm marks the pending record deferred when arming throws', async (t) => {
exit=0
```

The missing-transcript branch prints the only notice at line 146. The target-pid branch logs at 197 and stamps at 198. The arm branch logs at 216 and stamps at 217. Both tests assert the stamp and the log line only.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- After `markParked` in the target-pid branch, write one JSON line whose `systemMessage` says the hop could not arm because this Stop resolved no session process, the next prompt withdraws it and a later Stop tries again.
- After `markParked` in the arm-throw branch, write the same shaped line for a failed arm.
- Guard both writes in a `try` whose `catch` logs `stop-arm-error` with `stage: 'notice'`, as the missing-transcript branch does.
- Extend `stop-arm marks the pending record deferred when no process below the loop can be found` to read stdout, and `stop-arm marks the pending record deferred when arming throws` to pass a `write` seam that collects the line. Both fail before the source edit.
- Name the notice on the two branches in the `stop-arm.mjs` row of `claude/README.md` and in the Stop paragraph of `session-relaunch/README.md`.

### Out of Scope
- A new log event. The `target-pid` and `arm` events already record the cause, and the failed-write path reuses `stop-arm-error`.
- A notice on the background-task branch or the missing-transcript branch. Both already print one.
- A `decision` key. The line ends the turn, as every other notice does.
- Carrying the cause to the next prompt. That needs a relaunch record key, which parent decision D3 forbids.
- A live Stop, and every other runtime.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modify | The target-pid and arm-throw branches write one guarded `systemMessage` each, and the `write` parameter text covers every notice |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | The two parked-Stop tests expect one line with the cause, the withdrawal and the later Stop |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modify | The `stop-arm.mjs` row names the notice on all three parking branches |
| `.skilled/hooks/session-relaunch/README.md` | Modify | The Stop paragraph names the two notices and keeps the stamps and log lines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Given a pending record and a Stop whose target pid cannot be resolved, When the hook runs, Then stdout holds one JSON line whose `systemMessage` matches `could not arm`, `next prompt withdraws` and `later Stop`, with no `decision` key. The changed test fails before the source edit. |
| REQ-002 | Given the same record and a Stop whose `arm` call throws, When the hook runs, Then the injected `write` receives the same shaped line for a failed arm. The changed test fails before the source edit. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Both Stops still stamp `deferredAt`, leave every other record field as it was, and write exactly one `stop-arm-error` line with their own stage. |
| REQ-004 | A notice write that throws is logged as `stop-arm-error` with `stage: 'notice'`, and the hook still exits 0 with the record stamped. |
| REQ-005 | The missing-transcript notice and the background-task notice print what they print today. The relaunch and OpenCode plugin suites pass at the final state with the baseline count. |
| REQ-006 | Both READMEs name the notices. The fix adds no module, no record key and no log event, and no added code comment names a packet, phase, task or finding number. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows both changed tests failing before the source edit, and `scratch/green.txt` shows them passing after.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, saved to `scratch/claude-adapters.txt`.
- **SC-003**: The whole relaunch and OpenCode plugin run exits 0 with the baseline count, saved to `scratch/final-suite.txt`.
- **SC-004**: `validate.sh 022-stop-park-notices --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude shows a Stop `systemMessage` and still ends the turn when no `decision` key is set | The line would not reach the operator | The missing-transcript and background notices rely on the same contract, and both tests already pass |
| Risk | A runtime that never resolves a target pid prints the line on every Stop | Low | The record is stamped on each such Stop and the line names the cause the operator would fix |
| Risk | The arm-throw branch has no spawned hook in its test | The write seam would go unproved | The test calls `armPendingRecord` with a `write` seam and a `cwd` value that makes `arm` throw |
| Risk | Two notices reach the operator on one Stop | Confusing output | The branches return after their own notice, so at most one prints |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: one stdout write on a branch that already returns early.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: Both messages hold fixed text only. No payload field reaches them.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A failed write leaves the stamp, the log line and the exit status as they are today.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a Stop with an empty `transcript_path` takes the missing-transcript branch, not either new branch.
- Maximum input: repeated Stops that cannot arm each print one line and each stamp the record.
- Failure path: a write that throws logs `stop-arm-error stage=notice`, and the hook exits 0 with the record stamped.
- Order: one Stop takes one branch, so one line prints at most.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Two branches, two tests and two README rows |
| Risk | 3/25 | Both branches already return without arming, and each write is guarded |
| Research | 3/20 | One finding, checked against the code and two tests |
| **Total** | **10/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the target-pid notice need the transcript-path wording? No, because that branch only sees Stops that carry a path. Its cause is the missing process below the loop.
- Does the arm-throw notice reach the operator when the hook is spawned? The test uses a direct import for the throw, and the write seam proves the text. The spawned path for the same guard is proved by the target-pid test.
<!-- /ANCHOR:questions -->

---
