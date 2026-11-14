---
title: "Feature Specification: Phase 5: parked-record-escape"
description: "A Claude Stop that could not arm a prepared hand-over left the relaunch record pending with no mark. A pending record refuses every question dialog and only a stamped or armed record is withdrawn by the operator's next prompt, so the session stayed parked until cancel."
trigger_phrases:
  - "parked record escape"
  - "phase 5 parked record escape"
  - "stop arm deferred stamp"
  - "pending relaunch record prompt withdraw"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: parked-record-escape

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/373-relaunch-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 11 |
| **Predecessor** | 004-wrapper-change-notice |
| **Successor** | 006-record-without-handoff |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 005-parked-record-escape --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Close the research gaps of the relaunch hop dialog, goal and title fixes specification.

**Scope Boundary**: The Claude Stop hook `claude/stop-arm.mjs`, two test files and one README paragraph. Claude Code only. The shared relaunch core, the wrapper and every other runtime adapter are not edited.

**Dependencies**:
- `markDeferred` in `lib/relaunch-core.cjs` already stamps `deferredAt` on a pending record under the state lock. It is reused unchanged.
- `lib/withdraw.cjs` already withdraws a pending record that carries a `deferredAt` stamp when the operator sends a prompt. It is reused unchanged.
- The question-dialog guard in `claude/subagent-guard.mjs` is the reason a pending record matters. Phase 1 built it and this phase does not touch it.

**Deliverables**:
- A helper `markParked` in `stop-arm.mjs` that stamps `deferredAt` on the pending record.
- `markParked` called on three paths that leave a record pending: a Stop event with no transcript path, a Stop where no kill target resolves and a Stop where the arm throws.
- The existing background-task deferral calls the same helper.
- Three tests, all failing before the source edit.
- One README paragraph that names the stamp on the three paths and what it is for.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On Claude Code a Stop that cannot arm a prepared hand-over left the relaunch record pending with no mark. A pending record makes the guard refuse every question dialog, and the operator's next prompt withdraws only a record that carries `deferredAt` or is armed. A record parked this way therefore stayed pending and the dialog stayed refused until someone ran `cancel`.

The research that asked for this change names the three paths. Stop leaves a record pending without changing it when the transcript path is missing, when no kill target resolves and when arming fails. Only the background-task deferral stamped `deferredAt`, so it was the one parked state that already had a way out (`research/research.md` section 4 under "001, the question dialog after `prepare`", and rank 3 of section 9).

### Purpose
A Stop that leaves a prepared hand-over pending stamps it, so the operator's next prompt withdraws the record and question dialogs work again without `cancel`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root. The three tests are the renamed or new tests of this change. The run is the one saved in `scratch/red.txt`, taken before the edit to `stop-arm.mjs`.

```text
$ env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='marks the pending record deferred' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
✖ stop-arm logs missing-transcript-path and marks the pending record deferred (67.81725ms)
✖ stop-arm marks the pending record deferred when no process below the loop can be found (74.96675ms)
✖ stop-arm marks the pending record deferred when arming throws (37.319375ms)
ℹ tests 3
ℹ pass 0
ℹ fail 3
```

Each failure is `assert.ok(Number.isFinite(Date.parse(deferredAt)), deferredAt)` receiving no `deferredAt` on the record that Stop left behind (`scratch/red.txt:17`, `scratch/red.txt:35`, `scratch/red.txt:53`). After the edit the same command prints `ℹ tests 3`, `ℹ pass 3` and `ℹ fail 0` (`scratch/green.txt:5`, `scratch/green.txt:7`, `scratch/green.txt:8`).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `markParked` to `stop-arm.mjs`. It calls `markDeferred` and logs `stop-arm-error stage=defer` when the stamp itself fails.
- Call `markParked` when the Stop event has no transcript path, when no kill target resolves and when the arm throws.
- Replace the inline stamp of the background-task deferral with a call to `markParked`.
- Rename two existing tests to expect the stamp and add one in-process test that makes the arm throw.
- Let the shared conformance case for a Stop with no target set the stamp aside.
- Name the stamp on the three paths in the session-relaunch README.

### Out of Scope
- The Codex adapter - Codex Stop still leaves such a record unmarked, and parent decision D2 forbids editing a Codex adapter.
- The question-dialog guard in `claude/subagent-guard.mjs` - the pending record still refuses a dialog until a prompt withdraws it, which is the intended hold.
- A record that arms and returns no armed record - nothing is left pending on that path, so no stamp is needed.
- A new record key or module - parent decision D3 allows none, and `deferredAt` already exists.
- A live hop - the unit tests and the suite stand in for it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modify | Add `markParked` and call it on the three paths and in the background-task deferral |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | Rename two tests to expect the stamp and add one test where the arm throws |
| `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` | Modify | Add `assertStillPending` for the shared no-target case |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Name the stamp on the three paths and its purpose |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A Stop event with no transcript path leaves the record pending, logs `missing-transcript-path` and stamps `deferredAt`. The test `stop-arm logs missing-transcript-path and marks the pending record deferred` fails before the edit. |
| REQ-002 | A Stop where no kill target resolves leaves the record pending, logs `stop-arm-error stage=target-pid` and stamps `deferredAt`. The test `stop-arm marks the pending record deferred when no process below the loop can be found` fails before the edit. |
| REQ-003 | A Stop where the arm throws leaves the record pending, logs `stop-arm-error stage=arm`, starts no killer and stamps `deferredAt`. The test `stop-arm marks the pending record deferred when arming throws` fails before the edit. |
| REQ-004 | No module and no record key is added, and no adapter other than the Claude Stop hook changes. The stamp is the existing `deferredAt` written by the existing `markDeferred`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The background-task deferral stamps through `markParked`, so one helper owns every stamp Stop writes. |
| REQ-006 | The shared conformance case for a Stop with no target keeps asserting that the record is otherwise unchanged and that no killer started, for every runtime it runs on, without requiring Codex to stamp. |
| REQ-007 | The relaunch and OpenCode plugin suites pass at the final state. |
| REQ-008 | The session-relaunch README names the stamp on the three paths and says what it is for. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows 3 tests with 0 passing and 3 failing before the edit, and `scratch/green.txt` shows 3 of 3 passing after it.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1539 of 1539, from 1538 before this commit.
- **SC-003**: `git show --stat eaf24f999e` lists four files, none of them a Codex adapter, and no new file.
- **SC-004**: `validate.sh 005-parked-record-escape --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `markDeferred` stamps only a record whose status is `pending` | A stamp on a record that was meanwhile armed or withdrawn would be wrong | `markDeferred` reads the record under the state lock and returns null for any other status (`lib/relaunch-core.cjs:1229`), so `markParked` cannot stamp a record that left `pending` |
| Risk | A stamped record is withdrawn by the operator's next prompt, so a prompt sent before the next Stop calls the hop off | Low | That is the intended escape. A hop the operator no longer wants is called off by typing, and `cancel` still works |
| Risk | The stamp write itself fails | Low | `markParked` catches the error and logs `stop-arm-error stage=defer`, so Stop still returns without a thrown error. Covered by inspection of the helper, not by a test |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each of the three paths adds one locked read and one atomic write of the record. Not measured.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The stamp is an ISO timestamp written by `markDeferred`. No hook input reaches the record through it.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A failed stamp is logged and never thrown, so a Stop hook that cannot stamp still exits 0 as before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a Stop with no loop id or no armable record for its session returns before any of the three paths, so nothing is stamped (`stop-arm.mjs:108` and `stop-arm.mjs:118`).
- Maximum input: a record already stamped by an earlier background-task deferral is stamped again with a later time, because `markDeferred` rewrites the field.
- Failure path: an arm that throws after the target resolved starts no killer, writes `stop-arm-error stage=arm` to the log and leaves the record pending with the stamp.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One source file with one helper and four call sites, two test files and one README paragraph |
| Risk | 5/25 | A wrong stamp would let a prompt withdraw a record the operator meant to keep |
| Research | 3/20 | The research names the three paths and the one-call fix |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a live Claude session that Stop could not arm get its dialog back after one prompt? Not run. Decision: the unit tests and the suite stand in for it.
- Should Codex Stop stamp such a record too? Not in scope, because parent decision D2 forbids editing a Codex adapter. Recorded as a known limitation.
<!-- /ANCHOR:questions -->

---
