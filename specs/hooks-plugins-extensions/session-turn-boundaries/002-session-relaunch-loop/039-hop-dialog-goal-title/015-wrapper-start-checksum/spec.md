---
title: "Feature Specification: Phase 15: wrapper-start-checksum"
description: "The wrapper compares the hop-time checksum of its own file with the one it took at loop start and guards only the hop side. A start read that came back empty makes the first readable hop print a change note and log wrapper-changed for a file that never changed."
trigger_phrases:
  - "wrapper start checksum"
  - "phase 15 wrapper start checksum"
  - "empty start checksum false wrapper change note"
  - "cksum stub wrapper test"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: wrapper-start-checksum

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
| **Phase** | 15 of 19 |
| **Predecessor** | 014-review-wording-fixes |
| **Successor** | 016-ended-goal-mark-match |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 015-wrapper-start-checksum --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the hop dialog, goal and title specification. It opens the third review round, held on 2026-11-14 against the merge of this packet to `main`.

**Scope Boundary**: The comparison at `.skilled/bin/skilled-loop:1472` and the comment above it, one new test in `tests/skilled-loop-wrapper-launch-arguments.test.cjs`, and a check of one README sentence. The shared wrapper only. No adapter, no relaunch record key and no harness change.

**Dependencies**:
- Phase 4 built the checksum and the stderr note. Phase 12 added the `wrapper-changed` log line and the guard for an empty read at the hop.
- Phase 12 decision D4 left the start read unguarded because no test could make it fail. A `cksum` stub on the sandbox `PATH` can, so this phase amends that child decision. No parent decision changes.
- The wrapper harness already puts `sandbox.binDir` first on `PATH` for the runtime stubs. The new test writes its `cksum` stub there.

**Deliverables**:
- A comparison that reports a change only when both checksums were read.
- One test that failed before the source edit.
- A README sentence that holds for both reads, checked and edited only if it does not.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The wrapper takes a checksum of its own file before the first launch (`.skilled/bin/skilled-loop:1208`) and compares it before each hop (`:1472`). `wrapper_checksum` prints nothing when `cksum` cannot read the file (`:34` to `:36`). The guard at `:1472` checks only that the hop checksum is not empty. A start read that came back empty followed by a hop read that succeeds therefore differs, and the wrapper prints the change note and logs `wrapper-changed` for a file that never changed. No test covers this case.

The session-relaunch README says an empty checksum "is not a change and prints and logs nothing" (`.skilled/hooks/session-relaunch/README.md:112`). That holds only for the hop side today. The alignment run (finding X-4), the deep review (R1-P2-001, refined in iteration 8) and both independent reviews of 2026-11-14 raised this as a P2.

### Purpose
The wrapper reports a change of its own file only when it read a checksum at loop start and at the hop and the two differ.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-14 at commit `99d197475d`. The first command prints the start read and the hop guard. The second counts the places that call `cksum`. The third prints the README sentence.

```text
$ rg -n -o 'started_wrapper_checksum=\$\(wrapper_checksum\)|if \[\[ -n "\$hop_wrapper_checksum" && "\$hop_wrapper_checksum" != "\$started_wrapper_checksum" \]\]' .skilled/bin/skilled-loop
1208:started_wrapper_checksum=$(wrapper_checksum)
1472:if [[ -n "$hop_wrapper_checksum" && "$hop_wrapper_checksum" != "$started_wrapper_checksum" ]]
exit=0

$ rg -c '\bcksum\b' .skilled/bin/skilled-loop
1
exit=0

$ rg -n -o 'A checksum that comes back empty[^.]*' .skilled/hooks/session-relaunch/README.md
112:A checksum that comes back empty, because a checkout replaced the file for a moment, is not a change and prints and logs nothing
exit=0
```

The guard tests the hop value only, and the start value is never checked. One line calls `cksum`, so a stub that shadows it on `PATH` reaches only the checksum reads. The false note was not reproduced here. It is read from the code, and the test this phase adds is what reproduces it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Require a non-empty start checksum as well as a non-empty hop checksum before the comparison at `.skilled/bin/skilled-loop:1472`.
- Rewrite the comment above the comparison so it names both reads.
- Add the test `a hop prints and logs nothing when the wrapper file could not be read at loop start`, written to fail first. It writes a `cksum` stub into `sandbox.binDir` that prints nothing and exits 1 on its first call and runs the real `cksum` on later calls.
- Check the README sentence at line 112 against the fixed code, and edit it only if it is still wrong.

### Out of Scope
- Adopting the first readable hop checksum as the baseline when the start read was empty: it would catch a later change in such a loop, but no failing case asks for it and the review's spec seed asks only that an empty read on either side is never a change. A loop whose start read failed reports no change for its whole life, and the edge case below records it.
- A new harness option for the stub: one test uses it, so the test writes it itself.
- Showing the line in `history` or `/doctor:setup`, and a live hop: child 012 already keeps both out.
- The hooks README count of test files at `.skilled/hooks/README.md:206`: it predates this packet, and the parent log records it as out of scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | The comparison at line 1472 also requires `started_wrapper_checksum`, and the comment above it names both reads |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modify | One new test with an inline `cksum` stub |
| `.skilled/hooks/session-relaunch/README.md` | Check | Line 112 is read against the fixed code. No edit is expected, because the sentence already says an empty checksum prints and logs nothing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A hop whose start checksum came back empty and whose hop checksum was read prints no `changed on disk` line, logs no `wrapper-changed` line and still launches the receiver. The test `a hop prints and logs nothing when the wrapper file could not be read at loop start` fails before the edit and passes after. |
| REQ-002 | The four existing tests the name pattern `wrapper file` selects still pass after the edit: a changed file prints and logs once, a file unreadable at the hop prints and logs nothing and an unchanged file prints and logs nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The relaunch and OpenCode plugin suites pass at the final state with one more test than the baseline taken in the first task. |
| REQ-004 | `bash -n .skilled/bin/skilled-loop` exits 0, and the fix commit changes the wrapper and the test file and adds no file, no module and no relaunch record key. |
| REQ-005 | The comment above the comparison says why an empty read on either side is not a change and names no packet, phase, task or finding number. |
| REQ-006 | `.skilled/hooks/session-relaunch/README.md:112` holds for both reads after the fix. If it does not, it is corrected in the same commit and the commit lists three files. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows tests 5, pass 4 and fail 1 for the name pattern `wrapper file` before the edit, and `scratch/green.txt` shows 5 of 5 after it.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with the baseline count plus one.
- **SC-003**: `bash -n .skilled/bin/skilled-loop` exits 0 and `git show --stat` of the fix commit lists two files and no new file.
- **SC-004**: `validate.sh 015-wrapper-start-checksum --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `installRuntimeStub` puts `sandbox.binDir` first on `PATH` | The stub would not shadow `cksum` and the test would pass for the wrong reason | The red run must fail on the false note before the source edit. A red run that passes stops the build |
| Risk | The stub finds no real `cksum` to run on later calls | Med | The test resolves the real path with `command -v cksum` before it changes `PATH`, and the hop read is asserted non-empty through the existing changed-file test |
| Risk | The extra condition holds a hop back | Low | The block only prints and logs, and the new test asserts two runtime invocations |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the change adds one string test to a block that already runs before each hop.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The stub lives in the test sandbox only. No production code reads a test variable.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A hop goes ahead in every row of the matrix, which each test asserts with two runtime invocations.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: both reads empty prints and logs nothing, as does an empty start read with a readable hop read, which is the row the new test fails on before the edit.
- Maximum input: a loop whose start read failed never reports a change for its life, because the start checksum is never read again. That is accepted and recorded in the goal log.
- Failure path: a stub that always fails leaves both reads empty, so nothing prints and the hop goes ahead.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | One condition and one comment in the wrapper, one test |
| Risk | 3/25 | The block runs before every hop, and it only prints and logs |
| Research | 2/20 | One finding raised by four sources, read in the code |
| **Total** | **8/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Can a real checkout make the start read fail? Not known. Decision: guard it anyway, because the stub shows the path exists and the guard costs one condition.
- Does the README sentence need an edit? Decision: no edit is expected, and task T008 checks it against the fixed code.
<!-- /ANCHOR:questions -->

---
