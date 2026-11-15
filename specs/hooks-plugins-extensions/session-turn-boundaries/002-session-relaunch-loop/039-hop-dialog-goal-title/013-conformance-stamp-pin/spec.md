---
title: "Feature Specification: Phase 13: conformance-stamp-pin"
description: "The shared conformance case for a Stop that cannot arm drops the deferral stamp before it compares, for every runtime. Claude stamps the record and Codex does not, so either side can change and the conformance suite stays green."
trigger_phrases:
  - "conformance stamp pin"
  - "phase 13 conformance stamp pin"
  - "assertStillPending deferredAt per runtime"
  - "parked record stamp conformance case"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: conformance-stamp-pin

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
| **Branch** | `worktrees/373-relaunch-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 14 |
| **Predecessor** | 012-wrapper-notice-log |
| **Successor** | 014-review-wording-fixes |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 013-conformance-stamp-pin --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Close what two reviews of the eleven relaunch fixes confirmed specification.

**Scope Boundary**: The helper `assertStillPending` and the adapter table in `tests/adapter-conformance.test.cjs`. One test file. No adapter, no core and no document outside this folder changes.

**Dependencies**:
- Phase 5 added the stamp in the Claude Stop adapter and made the shared case set it aside, because Codex Stop does not stamp.
- The arm cases already pass the adapter to each check as a second argument (`adapter-conformance.test.cjs:494` to `:499`), so the helper can read which runtime it is checking.

**Deliverables**:
- The shared no-target case asserts a stamp for Claude and no stamp for a runtime that does not stamp.
- A saved run that shows the Claude case failing when the stamp call is taken out of the working tree, and passing when it is put back.
- A saved run that shows the Claude case failing when its mark is taken out of the table, which is the branch a runtime that starts stamping would reach.
- A comment above the helper that says which runtime stamps and why the other does not yet.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared conformance case `an arm leaves the record pending when no process below the loop is found` checks its result with `assertStillPending`. That helper removes `deferredAt` from the record before it compares, for every runtime (`.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs:412` to `:418`, used at `:465`). Claude Stop stamps the record through `markParked` (`claude/stop-arm.mjs:53` to `:59`, called at `:183` as of commit `c69f278cfc`). No file under `codex/` calls `markDeferred`. So the case pins neither behavior: Claude could stop stamping, or Codex could start, and the conformance suite would stay green. Review A of 2026-11-14 raised this as a P2.

Only the Claude half has cover elsewhere, in three tests of `claude-adapters.test.cjs` (lines 940, 1342 and 1371). Nothing states that Codex leaves the record unstamped, which child 005 records as its known limitation 1.

### Purpose
The shared case states for each runtime whether a Stop that cannot arm stamps the record, so a change on either side fails the conformance suite.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root on 2026-11-14 at commit `be1aebb9f3`. The first command prints the helper. The second lists every use of the helper and of the stamp in the conformance file. The third searches both Stop adapters for the stamp.

```text
$ sed -n '412,418p' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs
// A Stop that cannot arm leaves the record pending. Claude also stamps when it gave up, so
// the stamp is set aside and everything else must be as it was.
function assertStillPending({ record, before, spawns }) {
  const { deferredAt: _deferredAt, ...unmarked } = record;
  assert.deepEqual(unmarked, before);
  assert.deepEqual(spawns, []);
}
exit=0

$ rg -n 'assertStillPending|deferredAt' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs
414:function assertStillPending({ record, before, spawns }) {
415:  const { deferredAt: _deferredAt, ...unmarked } = record;
465:    check: assertStillPending,
exit=0

$ rg -n 'markDeferred|deferredAt' .skilled/hooks/session-relaunch/codex .skilled/hooks/session-relaunch/claude
.skilled/hooks/session-relaunch/claude/stop-arm.mjs:21:  markDeferred,
.skilled/hooks/session-relaunch/claude/stop-arm.mjs:55:    markDeferred({ loopId, env });
exit=0
```

The conformance file names `deferredAt` once, at line 415, where it is dropped. The stamp is written from the Claude adapter only. That the suite stays green when the Claude stamp is removed was not run here. It follows from line 415, and the first setup task runs it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mark in the adapter table of the conformance file which runtime stamps a record its Stop could not arm. Claude does.
- Change `assertStillPending` to read that mark from the adapter it is given: a stamping runtime must leave a `deferredAt` that parses as a time, and any other runtime must leave no `deferredAt` key. The rest of the record must equal the record before, as now.
- Prove the Claude assertion by taking the `markParked` call at `claude/stop-arm.mjs:183` (`c69f278cfc`) out of the working tree, running the case, and putting it back.
- Prove the Codex assertion by setting the mark for Codex in the working tree, running the case, and putting it back.
- Prove the branch for a runtime that should not stamp and does, by taking the mark off the Claude entry in the working tree, running the case, and putting the mark back. This mutation is in the test file only.
- Rewrite the comment above the helper to say which runtime stamps and why the other does not.

### Out of Scope
- Making Codex stamp, or moving the stamp into the core arm path: parent decision D2 bars editing the Codex adapter. Review A names this as a later packet, and this phase states the present split so that packet changes one line of the table on purpose.
- The three Claude tests in `claude-adapters.test.cjs`: they already assert the stamp and stay as they are.
- OpenCode and Pi: the case is skipped for a runtime that signals its own process (`adapter-conformance.test.cjs:485`), and Pi has no row in this file.
- Any source file: the mutation of `stop-arm.mjs` is a proof step and is reverted before the commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` | Modify | One mark in the adapter table, the helper reads it, and the comment above the helper says who stamps |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For Claude, the shared no-target case fails when the Stop adapter leaves no `deferredAt` on the record. With the `markParked` call at `claude/stop-arm.mjs:183` (`c69f278cfc`) removed from the working tree the case `claude: an arm leaves the record pending when no process below the loop is found` fails, and with the call restored it passes. The same removal leaves the case passing before the test edit. |
| REQ-002 | For Codex, the same case fails when the record carries a `deferredAt`, or when the table says Codex stamps and it does not. With the mark set for Codex in the working tree the case `codex: an arm leaves the record pending when no process below the loop is found` fails, and with the mark removed it passes. That mutation reaches only the branch where a stamp is expected and none is found. The other branch, a stamp on a record whose runtime the table does not mark, is proven on Claude, the one runtime that stamps: with the mark taken off the Claude entry in the working tree the case `claude: an arm leaves the record pending when no process below the loop is found` fails, and with the mark back it passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The fix commit changes one file. `git show --stat` of the fix commit lists `adapter-conformance.test.cjs` only, and `git diff --quiet HEAD -- .skilled/hooks/session-relaunch/claude .skilled/hooks/session-relaunch/codex .skilled/hooks/session-relaunch/lib` exits 0 before the commit. |
| REQ-004 | The relaunch and OpenCode plugin suites pass at the final state with the same test count as the baseline, because assertions change and no test is added. |
| REQ-005 | The comment above the helper says that Claude stamps so a prompt can withdraw the record and that Codex does not stamp yet. It names no packet, phase or task number. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/hole.txt` shows the Claude case passing with the stamp call removed and the old helper, `scratch/red-claude.txt` shows it failing with the stamp call removed and the new helper, and `scratch/green.txt` shows it passing with the call restored.
- **SC-002**: `scratch/red-codex.txt` shows the Codex case failing with the mark set for Codex, `scratch/red-unmarked.txt` shows the Claude case failing with the mark taken off the Claude entry, and `scratch/green.txt` shows both cases passing with the table restored.
- **SC-003**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with the baseline count.
- **SC-004**: `validate.sh 013-conformance-stamp-pin --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The arm loop keeps passing the adapter as the second argument of each check | The helper could not tell which runtime it checks | `rg -n '\}, adapter\);' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints the call in the first setup task |
| Risk | A proof mutation of `stop-arm.mjs` is left in the tree and committed | High | The task that restores it ends with `git diff --quiet HEAD -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs`, which must exit 0, and the whole suite runs after it |
| Risk | Pinning that Codex does not stamp reads as approval of the gap | Low | The comment says the runtime does not stamp yet, and the phase records the later packet that closes it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: one assertion in two test cases.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: N/A: a test file only.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: The stamp is asserted as a parseable time and never as an exact value, so the case does not depend on the clock.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a stamping runtime that leaves `deferredAt` as an empty string fails the case, because an empty string does not parse as a time.
- Maximum input: every runtime in the adapter table that runs the case is asserted, and a runtime added later without the mark is asserted as not stamping.
- Failure path: a record that changed in any other field fails the comparison with the record before, as it does now.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 2/25 | One helper and one table entry in one test file |
| Risk | 3/25 | The proof steps edit a source file in the working tree and must be reverted |
| Research | 2/20 | One review finding, read in the code |
| **Total** | **7/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which runtimes run the case today? Read from the code: Claude and Codex, because the case is skipped for a runtime whose killer target is its own process. The first setup task prints the test names and settles it.
- Should Codex stamp? Not decided here. Decision: a later packet, because parent decision D2 bars editing the Codex adapter.
<!-- /ANCHOR:questions -->

---
