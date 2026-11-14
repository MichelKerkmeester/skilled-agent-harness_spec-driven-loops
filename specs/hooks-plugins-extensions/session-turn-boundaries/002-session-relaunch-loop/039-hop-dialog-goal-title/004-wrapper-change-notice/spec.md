---
title: "Feature Specification: Phase 4: wrapper-change-notice"
description: "A running skilled-loop wrapper keeps the code it read when it started, so a change to the wrapper file reaches no hop of a loop that is already running and nothing told the operator. The wrapper now says so on stderr before each hop that runs on stale code."
trigger_phrases:
  - "wrapper change notice"
  - "phase 4 wrapper change notice"
  - "skilled-loop changed on disk"
  - "running wrapper stale code notice"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: wrapper-change-notice

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
| **Phase** | 4 of 11 |
| **Predecessor** | 003-generated-title-carry |
| **Successor** | 005-parked-record-escape |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 004-wrapper-change-notice --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Close the research gaps of the relaunch hop dialog, goal and title fixes specification.

**Scope Boundary**: The shared wrapper `.skilled/bin/skilled-loop`, the wrapper test harness, two wrapper tests and one README paragraph. Every runtime that starts under the wrapper is covered, because the notice sits in the wrapper's hop branch and not in an adapter.

**Dependencies**:
- Parent decision D2 lets children from 004 change the shared wrapper. Parent decision D3 allows no new module and no new relaunch record key.
- The research recommendation to add a notice and not a re-execution, recorded in `../research/research.md` section 11 recommendation 2.
- The wrapper test harness `skilled-loop-wrapper-harness.cjs` already installs a copy of the wrapper into a sandbox and stubs the runtime. The new test reuses that copy.

**Deliverables**:
- A `wrapper_checksum` function and a `started_wrapper_checksum` variable in `.skilled/bin/skilled-loop`.
- One stderr line at the end of the hop branch when the checksum differs.
- A harness switch that appends to the wrapper copy while the stub runs.
- Two tests, one of them failing before the source edit.
- One README paragraph that describes the note and the restart.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A running `skilled-loop` wrapper keeps the code it read when it started, so a change to `.skilled/bin/skilled-loop` reaches no hop of a loop that is already running. Nothing told the operator, who could go on hopping on the old code after a fix had landed. The research of 2026-11-13 found four such wrappers on one machine that predated the name carry the wrapper file gained that day.

### Purpose
A hop that runs on a wrapper whose file changed since the loop started prints one line on stderr that names the restart, and the hop still goes ahead.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root against the parent of the change commit, then against the saved red run.

```text
$ git show 89e246760e^:.skilled/bin/skilled-loop | rg -n "cksum|checksum|changed on disk"
exit=1

$ git show 89e246760e^:.skilled/bin/skilled-loop | rg -n "^while true; do"
1199:while true; do
exit=0

$ sed -n 1,12p scratch/red.txt
# Command: env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs
✖ a hop says so when the wrapper file changed after the loop started (765.851334ms)
✔ a hop prints no change notice when the wrapper file is unchanged (608.988083ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1410.328042
```

Before the change the wrapper held no checksum and no notice text, and its whole loop is one top-level `while true; do` at line 1199. The red run shows the first test failing with `0 !== 1` at `scratch/red.txt:20`, which is zero notice lines where one was expected, after the stub appended to the wrapper copy during the first launch.

The operator-side observation behind the problem is in `../research/research.md` under "The running wrappers predate the fix", and the cause there is marked INFERRED. No running wrapper was inspected for this child.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Take a checksum of the wrapper file before the loop starts, with a function that prints nothing when the file cannot be read.
- Compare it at the end of the hop branch and print one stderr line that names the restart when it differs.
- Add a harness switch that appends to the wrapper copy while the runtime stub runs.
- Cover the changed and the unchanged case with one test each.
- Describe the note and the restart in the session-relaunch README.

### Out of Scope
- Restarting a running wrapper for the operator - the notice only tells them, and a restart ends their session.
- Re-executing the wrapper between hops - the loop's state lives in shell variables that are not exported, and a file caught mid-checkout could end every running loop at its next hop. The operator chose the notice on 2026-11-14.
- Stopping the hop when the file changed - the hop goes ahead on the code the loop started with.
- A notice inside a runtime adapter - the wrapper is the one place every runtime passes through.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | `wrapper_checksum`, `started_wrapper_checksum` and the stderr line in the hop branch |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Modify | The stub appends to the wrapper copy when `WRAPPER_APPEND_ON_INVOCATION` and `WRAPPER_APPEND_PATH` are set |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modify | Two tests, changed and unchanged |
| `.skilled/hooks/session-relaunch/README.md` | Modify | One paragraph after the linking-repository paragraph |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A hop whose wrapper file changed after the loop started prints exactly one line starting `note: skilled-loop changed on disk` on stderr, names the restart, and still launches the receiver. The test `a hop says so when the wrapper file changed after the loop started` fails before the edit with `0 !== 1`. |
| REQ-002 | A hop whose wrapper file is unchanged prints no `changed on disk` text. The test `a hop prints no change notice when the wrapper file is unchanged` passes before and after the edit. |
| REQ-003 | No module is added and no relaunch record key is added. The change stays inside `.skilled/bin/skilled-loop` and its tests and README. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A wrapper file that cannot be read for a moment, as while a checkout replaces it, does not stop the wrapper. `wrapper_checksum` prints nothing and returns 0 in that case. |
| REQ-005 | The relaunch and OpenCode plugin suites pass at the final state. |
| REQ-006 | The session-relaunch README describes the note and how to pick the change up. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows 2 tests with 1 pass and 1 fail before the edit, and `scratch/green.txt` shows 2 of 2 after it.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with every test passing, 1538 of 1538 on the change commit's tree per its message.
- **SC-003**: `git show --stat 89e246760e` lists four files and `git show 89e246760e | rg -c '^new file'` prints nothing.
- **SC-004**: `validate.sh 004-wrapper-change-notice --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cksum` on the operator's PATH | A host without it would see an empty checksum at start and at every hop, so the two never differ and the notice never prints | `wrapper_checksum` swallows the error and the wrapper keeps running. The worst case is a missing notice, not a stopped loop. Inferred, not run on a host without `cksum` |
| Risk | The notice repeats before every later hop of the same loop once the file differs | Low | One line per hop on stderr is the point, because the operator may miss the first. Inferred from the comparison running on each hop, not reproduced over several hops |
| Risk | A checkout that replaces the file at the moment of a hop gives an empty checksum and a false note | Low | The note is advisory and the hop goes ahead. Inferred, not reproduced |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each hop runs one more `cksum` over the wrapper file. Not measured.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The note text is fixed and carries no value read from a file or an environment variable.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: An unreadable wrapper file makes `wrapper_checksum` print nothing and return 0, so the wrapper does not exit on it.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a wrapper that has not changed prints no note, and the second test asserts the stderr holds no `changed on disk` text.
- Maximum input: a wrapper that changes before the first of several hops prints the note again at each later hop, because the start checksum is never refreshed. Inferred from the code, not run.
- Failure path: a wrapper file that cannot be read gives an empty checksum and no exit. The `|| true` in `wrapper_checksum` is the guard, and no test forces the read to fail.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | 15 lines in one shell script, a 6 line harness switch, two tests and one README paragraph |
| Risk | 5/25 | A wrong comparison would print a false note or none, and the hop is never blocked |
| Research | 4/20 | One research finding, read from the committed research and the commit |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a live hop from a wrapper edited mid-loop print the note on the operator's terminal? Not run. Decision: the stubbed test of the shared wrapper copy stands in for it.
- Does the cause the research inferred, that each wrapper runs the loop body it parsed at start, hold? Not confirmed by this child. One restarted wrapper and one hop would confirm it.
<!-- /ANCHOR:questions -->

---
