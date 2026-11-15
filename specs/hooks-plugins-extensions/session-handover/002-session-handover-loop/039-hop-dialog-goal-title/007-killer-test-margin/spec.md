---
title: "Feature Specification: Phase 7: killer-test-margin"
description: "One killer test gave the killer a deadline only 50 ms past its idle window while the killer polls every 100 ms, so a late poll on a busy machine failed the test. A load run reproduced the failure 14 times in 160 and a wider deadline cleared it."
trigger_phrases:
  - "killer test margin"
  - "phase 7 killer test margin"
  - "killer grace period test flaky"
  - "killer timeoutMs 450"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: killer-test-margin

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
| **Phase** | 7 of 11 |
| **Predecessor** | 006-record-without-handoff |
| **Successor** | 008-history-test-database-env |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 007-killer-test-margin --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Close the research gaps of the relaunch hop dialog, goal and title fixes specification.

**Scope Boundary**: The `timeoutMs` value and a two-line comment in one test of `.skilled/hooks/session-relaunch/tests/killer.test.cjs`. No product code.

**Dependencies**:
- The research of 2026-11-13 named the margin as the likely cause of one failed run and ranked the fix 14 of 19 in its section 9. It did not reproduce the failure.
- `waitForIdle` and `POLL_INTERVAL_MS` in `.skilled/hooks/session-relaunch/lib/killer.cjs` set the polling the test has to outlast. Both are read here and unchanged.

**Deliverables**:
- One test with a 1000 ms deadline over a 400 ms idle window, and a comment that names the poll interval.
- A reproduction of the failure under load and two clean rounds after the change, saved in `scratch/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The test `killer keeps the record armed when the target exits during its grace period` ran the killer with `idleMs: 400` and `timeoutMs: 450`. The killer polls every 100 ms, so the deadline sat 50 ms past the idle window and one late poll on a busy machine missed it. The test then failed with the target's signal file missing, and a failed run in the suite looked like a fault in the killer.

The research could not reproduce the failure, because the failing run's log was not kept. It named the margin as the likeliest cause and not a confirmed one.

### Purpose
The test passes on a busy machine because its deadline leaves room for several late polls.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root against the test as it stood before the change, with `timeoutMs: 450`. The script `scratch/killer-load.sh` starts the one test the given number of times at once. The machine has 18 cores, read with `sysctl -n hw.ncpu`.

```text
$ bash scratch/killer-load.sh 160 <output dir>
parallel runs: 160, failed runs: 14

# One failed run, from scratch/red.txt:
✖ killer keeps the record armed when the target exits during its grace period (1626.675959ms)
  Error: ENOENT: no such file or directory, open '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/session-relaunch-killer-Ks4TIp/target-signal'
      at TestContext.<anonymous> (.../.skilled/hooks/session-relaunch/tests/killer.test.cjs:794:21)

# Same command with timeoutMs: 1000, two rounds, from scratch/green.txt:
round 1: parallel runs: 160, failed runs: 0
round 2: parallel runs: 160, failed runs: 0
```

At 450 ms 14 of 160 runs failed, and `scratch/red.txt` states that every failed run failed the same way. This child changes a test, so it has no test that failed first in the usual sense. The load run at 450 ms is its red run.

The saved output shows the signal file missing, which fits a killer that never reached its signal step. It does not show a `killer-timeout` line from the killer's log, so the late poll is the cause the load result supports and the log does not name.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change `timeoutMs` from 450 to 1000 in the one test.
- Add a two-line comment that names the 100 ms poll interval the old margin lost to.
- Reproduce the failure under load at 450 ms and save the run as `scratch/red.txt`.
- Run the same load twice at 1000 ms and save the result as `scratch/green.txt`.

### Out of Scope
- The killer's polling or deadline logic in `lib/killer.cjs` - the killer is correct, and only the test's margin was too thin.
- The `idleMs: 400` value - the idle window is what the test exercises, so it stays.
- Any other test in `killer.test.cjs` - none was named as failing.
- A live hop - the change is to a test and no runtime path changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modify | `timeoutMs` 450 to 1000 and a two-line comment in the grace-period test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The grace-period test passes under load. `bash scratch/killer-load.sh 160 <output dir>` prints `failed runs: 0` in two rounds at `timeoutMs: 1000`. |
| REQ-002 | No product code changes. `git show --stat 8a113b68ae` lists one file, `killer.test.cjs`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The failure is reproduced before the change. The same command at `timeoutMs: 450` prints a nonzero `failed runs` count, saved in `scratch/red.txt`. |
| REQ-004 | The relaunch and OpenCode plugin suites still pass. `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with every test passing. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows `parallel runs: 160, failed runs: 14` at 450 ms and `scratch/green.txt` shows `failed runs: 0` in both rounds at 1000 ms.
- **SC-002**: `git show --stat 8a113b68ae` lists one file with 3 insertions and 1 deletion.
- **SC-003**: The relaunch and OpenCode plugin suites exit 0 with 1543 of 1543, as the commit message records.
- **SC-004**: `validate.sh 007-killer-test-margin --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `POLL_INTERVAL_MS` at 100 ms in `lib/killer.cjs` | A shorter or longer poll changes how much margin the test needs | The comment in the test names the 100 ms interval, so a change to it points back to this margin |
| Risk | A heavier load than 160 runs at once on 18 cores could still miss a 1000 ms deadline | Low | Not measured. The 1000 ms deadline leaves 600 ms past the idle window where 450 ms left 50 ms. Two rounds of 160 passed |
| Risk | The cause is confirmed for this machine only | Low | Another machine or runner could fail for a different reason. `scratch/killer-load.sh` reruns the check there |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The whole `killer.test.cjs` file takes 40.4 s run alone after the change (`scratch/green.txt:22`). No time was recorded before the change, so no delta is claimed.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: the change touches a test and no credential path.
- **NFR-S02**: N/A: no data is stored or sent.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: The test's failure rate under 160 parallel runs on the measured machine goes from 14 of 160 to 0 of 160 in each of two rounds.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A, the test takes no input.
- Maximum input: 160 runs at once on 18 cores passed twice at 1000 ms. A heavier load was not run.
- Failure path: a run that still misses the deadline would fail the same way the 14 did, with the `ENOENT` read of `target-signal` that `scratch/red.txt` shows.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 1/25 | One value and one comment in one test file |
| Risk | 2/25 | A test-only change that no runtime path reads |
| Research | 6/20 | A load script to reproduce a failure the research could not |
| **Total** | **9/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the test still pass on a slower runner than this 18-core machine? Not run. Decision: `scratch/killer-load.sh` is the way to check, and no failure is on record at 1000 ms.
- What does the killer's own log show in a failed run at 450 ms? Not saved in this phase. The signal file missing is the only recorded symptom.
<!-- /ANCHOR:questions -->

---
