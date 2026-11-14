---
title: "Feature Specification: Phase 12: wrapper-notice-log"
description: "The wrapper says on stderr that its own file changed under a running loop, and writes nothing to relaunch.log. An unattended hop scrolls the line away, and a wrapper file that cannot be read for a moment prints a false note."
trigger_phrases:
  - "wrapper notice log"
  - "phase 12 wrapper notice log"
  - "wrapper-changed relaunch log line"
  - "false wrapper change note on unreadable file"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: wrapper-notice-log

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
| **Phase** | 12 of 14 |
| **Predecessor** | 011-goal-fallback-bound |
| **Successor** | 013-conformance-stamp-pin |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 012-wrapper-notice-log --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Close what two reviews of the eleven relaunch fixes confirmed specification.

**Scope Boundary**: The change notice block of `.skilled/bin/skilled-loop` at lines 1469 to 1472, two tests and one extended test in `tests/skilled-loop-wrapper-launch-arguments.test.cjs`, one stub option in the wrapper test harness and one README sentence. The shared wrapper only. No adapter and no relaunch record changes.

**Dependencies**:
- Phase 4 built the notice this phase extends: a checksum of the wrapper file taken before the loop and one stderr line before a hop when it differs.
- `appendLog` in `lib/relaunch-core.cjs` already writes `relaunch.log` lines. It is reused unchanged.
- The wrapper already calls the core through `node -e ... -- "$relaunch_core"` in five places. The new call takes the same form.

**Deliverables**:
- One `wrapper-changed` line in `relaunch.log` for each hop that prints the note.
- No note and no log line when the wrapper file cannot be read at the hop.
- Two tests that failed before the source edit.
- One README sentence that names the log line.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The wrapper prints one line on stderr before a hop when its own file changed after the loop started (`.skilled/bin/skilled-loop:1469` to `:1472`). The line is printed immediately before the receiver's screen starts and nothing is written to `relaunch.log`. An unattended hop, which is what the loop is for, scrolls the line away, so the operator has no later record that a loop ran old code. Review A of 2026-11-14 raised this as a P2.

The same block compares against a checksum that is empty when the file cannot be read (`.skilled/bin/skilled-loop:34` to `:36`). A checkout can replace the file for a moment, and an empty read at the hop differs from the start checksum, so the wrapper prints a note for a file that did not change. Child 004 recorded this as its known limitation 4, and review B raised it again.

### Purpose
A hop under a changed wrapper leaves one `wrapper-changed` line in `relaunch.log` beside the stderr note, and a wrapper file that cannot be read at the hop prints and logs nothing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root on 2026-11-14 at commit `be1aebb9f3`. The first command prints the notice block. The second searches the wrapper, the core, the CLI and the tests for the log event. The third shows the two uses of the start checksum.

```text
$ sed -n '1469,1472p' .skilled/bin/skilled-loop
      if [[ "$(wrapper_checksum)" != "$started_wrapper_checksum" ]]; then
        printf '%s\n' \
          'note: skilled-loop changed on disk after this loop started, restart the wrapper to run the new code' >&2
      fi
exit=0

$ rg -c 'wrapper-changed' .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin .skilled/hooks/session-relaunch/tests
exit=1

$ rg -n 'started_wrapper_checksum' .skilled/bin/skilled-loop
1208:started_wrapper_checksum=$(wrapper_checksum)
1469:      if [[ "$(wrapper_checksum)" != "$started_wrapper_checksum" ]]; then
exit=0
```

The block writes to stderr only. No file holds the string `wrapper-changed`, so no log line exists. The comparison at line 1469 has no check for an empty checksum. The false note itself was not reproduced here. It is read from the code, and the test this phase adds is what reproduces it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Append one `wrapper-changed` line with the loop id to `relaunch.log` when the note prints, through the core's `appendLog`, in the `node -e ... -- "$relaunch_core"` form the wrapper already uses.
- Skip the note and the log line when the checksum read at the hop is empty.
- Add the tests `a hop logs wrapper-changed when the wrapper file changed after the loop started` and `a hop prints and logs nothing when the wrapper file cannot be read`, both written to fail first.
- Extend `a hop prints no change notice when the wrapper file is unchanged` to assert that the log holds no `wrapper-changed` line.
- State the log line in the session-relaunch README beside the sentence on the note at line 112.

### Out of Scope
- Showing the line in the `history` command or in `/doctor:setup`: no failing case asks for it, and the log line is what either would read. Review A named it as a follow-on.
- A note for a changed `.claude/settings.json`: the receiver a hop starts is a new process that reads its settings at start, so the wrapper has nothing stale to report. This is inferred and the parent log records it as rejected.
- Refreshing the start checksum or restarting the wrapper: the parent spec keeps both out of scope, so a changed loop logs one line on each later hop.
- An empty checksum at loop start: bash has just read the file it runs, and no test can make that read fail.
- A live hop: the stubbed wrapper tests stand in for it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | The notice block reads the checksum once, skips an empty one and appends the log line after the note |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modify | Two new tests and one more assertion in the unchanged-wrapper test |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Modify | The stub can make the wrapper copy unreadable during a run, beside the option that appends to it |
| `.skilled/hooks/session-relaunch/README.md` | Modify | One sentence: the note also leaves a `wrapper-changed` line in `relaunch.log` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A hop under a wrapper file that changed after the loop started leaves exactly one line in `relaunch.log` that holds `wrapper-changed` and the loop id, and still prints the stderr note once. The test `a hop logs wrapper-changed when the wrapper file changed after the loop started` fails before the edit and passes after. |
| REQ-002 | A hop whose wrapper file cannot be read prints no `changed on disk` line, logs no `wrapper-changed` line and still launches the receiver. The test `a hop prints and logs nothing when the wrapper file cannot be read` fails before the edit and passes after. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A hop under an unchanged wrapper logs no `wrapper-changed` line. The extended test passes before and after the edit, because it guards behavior that already holds. |
| REQ-004 | A failed log write never holds the hop back: the call ends in `|| true`, as `record_hand_over` does at `.skilled/bin/skilled-loop:115`. |
| REQ-005 | The relaunch and OpenCode plugin suites pass at the final state with two more tests than the baseline taken in the first task. |
| REQ-006 | The session-relaunch README names the log line, and the commit adds no file, no module and no relaunch record key. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows 4 tests with 2 pass and 2 fail for the name pattern `wrapper file` before the edit, and `scratch/green.txt` shows 4 of 4 after it.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with the baseline count plus two.
- **SC-003**: `bash -n .skilled/bin/skilled-loop` exits 0 and `git show --stat` of the fix commit lists four files and no new file.
- **SC-004**: `validate.sh 012-wrapper-notice-log --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `appendLog` in `lib/relaunch-core.cjs` stays exported and keeps its `(event, fields)` form | The wrapper call would throw and log nothing | The call ends in `|| true`, and the new log test fails when the line is missing |
| Risk | The log call starts one `node` process on each hop under a changed wrapper | Low | It runs only when the checksum differs, and the wrapper already starts `node` several times per hop |
| Risk | The stub that makes the wrapper copy unreadable also breaks the running loop | Med | Bash keeps the script it opened, so only the fresh `cksum` read fails. The test asserts two runtime invocations, which proves the hop went ahead |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: An unchanged wrapper starts no extra process at a hop. Proven by the unchanged-wrapper test logging nothing.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The loop id reaches `node` as an argument and never as script text, as in the existing calls.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A log write that fails leaves the hop and the stderr note as they are.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty checksum at the hop prints nothing and logs nothing, which is the row the second new test fails on before the edit.
- Maximum input: a loop that keeps running after a change logs one line on each later hop, because the start checksum is never refreshed.
- Failure path: a state directory that cannot be written leaves the note on stderr and the hop goes ahead, because the log call ends in `|| true`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One block of the wrapper, two tests, one harness option and one README sentence |
| Risk | 4/25 | The block runs before every hop, and a mistake in it could hold a hop back |
| Research | 2/20 | Two review findings, both read in the code |
| **Total** | **11/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the operator see the stderr note above a full-screen receiver on Pi and OpenCode? Not run. Decision: the log line is the durable record either way, and one edited-wrapper hop on each runtime would answer it.
- Should `history` or `/doctor:setup` show the line? Not decided here. Decision: out of scope until a case asks for it.
<!-- /ANCHOR:questions -->

---
