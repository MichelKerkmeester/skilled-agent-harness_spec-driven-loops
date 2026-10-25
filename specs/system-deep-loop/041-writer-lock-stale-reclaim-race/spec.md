---
title: "Feature Specification: Fix the stale-lock reclaim race in the shared deep-loop writer lock"
description: "One deep-loop runtime test, jsonl-repair, lost a record on main in run 40107240026 (expected 9, got 8). The suspected cause is a stale-lock reclaim race in the shared writer lock in cli-guards.cjs, inferred and not reproduced. This packet reproduces the failure first, then fixes the lock at its source if the reproduction confirms the cause."
trigger_phrases:
  - "writer lock stale reclaim race"
  - "fix the stale lock reclaim race"
  - "expected 9 records got 8"
  - "jsonl repair intermittent failure"
  - "isWriterLockStale ENOENT"
  - "two writers hold the lock"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix the stale-lock reclaim race in the shared deep-loop writer lock

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Deep-Loop Runtime Tests workflow failed once on main. Run 40107240026 (a push at `e00fef3e76` on 2026-10-24) passed 2,806 tests and failed one: the `jsonl-repair` case "does not drop a plain appendJsonlRecord write racing a concurrent mergeJsonlUnderLock", at `tests/unit/jsonl-repair.vitest.ts:461`, with `expected [ ... ] to have a length of 9 but got 8`. The test starts eight writer processes at one start barrier, and each takes the shared writer lock before it writes, so a missing record means two writers were inside the critical section together. The main runs that followed all passed with no change to the runtime, so the failure is intermittent.

The suspected cause is a check-then-act race in the stale-lock reclaim path of `acquireWriterLock` in `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs`. This cause is INFERRED. It is not reproduced, and no run has confirmed it. `isWriterLockStale` returns true when the lock file has vanished between the failed open and the read (line 351), and the caller then runs `fs.rmSync(lockPath, { force: true })` (line 536) without checking what the file at that path holds now. A peer that creates its lock inside that gap has its fresh lock deleted. A further writer then acquires and two writers hold the lock at once. The lock has five call sites in four files, so a wrong reclaim can lose a record or a graph write anywhere it is used.

### Evidence Trail
Each line carries its standing. OBSERVED means a command was run and its output read on 2026-10-25. DERIVED follows from an observation. INFERRED is unverified.

- OBSERVED: `gh run view 40107240026 --json conclusion,headSha,event,headBranch,createdAt,workflowName` reads conclusion `failure`, event `push`, branch `main`, head `e00fef3e76d21953ef7d50379348723bc5649be8`, created 2026-10-24T15:30:01Z, workflow "Deep-Loop Runtime Tests".
- OBSERVED: `gh run view 40107240026 --log-failed` shows the assertion at `tests/unit/jsonl-repair.vitest.ts:461:23`, `expected [ { type: 'iteration', …(3) }, …(7) ] to have a length of 9 but got 8`, 166 of 167 files passed, 2,806 tests passed, 1 failed, 8 skipped.
- OBSERVED: line 461 is `expect(records).toHaveLength(1 + appendWriters.length + mergeWriters.length)`, which is one seed record plus four plain appenders plus four merge writers, so nine.
- OBSERVED: `git diff --stat e00fef3e76 HEAD` over `cli-guards.cjs`, `jsonl-repair.vitest.ts` and `jsonl-repair.ts` prints nothing, and `git log e00fef3e76..HEAD` over the runtime directory lists no commit. The line numbers in this packet therefore hold at the failing commit and at the head this packet was opened on.
- OBSERVED: the main push runs after the failure (40123498287, 40125544874, 40147795961 and 40149635429) all read `success` in `gh run list --workflow deep-loop-runtime.yml`, and so does the run before it (40102448812).
- OBSERVED: the code at `cli-guards.cjs` line 351 (`if (code === 'ENOENT') return true`), line 533 (the reclaim gate), line 536 (`fs.rmSync(lockPath, { force: true })`), line 507 (the post-stamp nonce re-read) and lines 567 to 568 (release removes only when the nonce matches).
- OBSERVED: the lock is taken at `lib/deep-loop/jsonl-repair.ts` lines 264 and 289, `scripts/upsert.cjs` line 299, `scripts/convergence.cjs` line 858 and `lib/council/convergence.cjs` line 204.
- OBSERVED: `npx vitest run --no-coverage tests/unit/cli-guards-writer-lock.vitest.ts tests/unit/jsonl-repair.vitest.ts` from the runtime directory reports 2 files and 18 tests passed on the unchanged code (6 lock tests and 12 jsonl-repair tests).
- DERIVED: in this test every writer is alive and every hold lasts well under the 60,000 ms hold limit, so `isWriterLockStale` returns false for a live or half-written lock body (lines 380 to 385). The only verdict that can send a contender into the removal is the ENOENT branch at line 351. A crashed holder is not needed.
- INFERRED: that the ENOENT branch followed by the unconditional removal is what produced the 8 records in run 40107240026. What would confirm it is a test that fails on the unchanged code with the lost-writer symptom and passes after the fix (REQ-001).
- Source of the suspicion: the read-only investigation in `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md` (the "Window re-pull" section and the deep-loop-runtime row of "Root causes"). It reports six local runs of the test that all passed, so the CI failure was not reproduced there either. The operator ruled that the fix is a separate change from the CI efficiency program, which is why it has its own packet.

### Purpose
Two writers can never hold the deep-loop writer lock at the same time. A test shows it by failing on today's lock code and passing after the fix, while the existing lock and jsonl-repair tests stay unchanged and green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A reproduction first: a deterministic test of the suspected interleaving and a high-rate loop of the CI-shaped case, run on the unchanged code before any lock change.
- A confirm-or-refute verdict on the suspected cause, recorded in `plan.md` with the saved output behind it.
- A fix at the producer, in the reclaim path of `acquireWriterLock` and `isWriterLockStale` in `cli-guards.cjs`.
- Regression tests for the reproduced interleavings in the existing lock test file.

### Out of Scope
- `tests/unit/jsonl-repair.vitest.ts` and `lib/deep-loop/jsonl-repair.ts`. The failing test is the observer of the bug and stays as it is. No retry, sleep or looser assertion goes into it.
- The other lock callers (`scripts/upsert.cjs`, `scripts/convergence.cjs`, `lib/council/convergence.cjs`). They are inspected, not changed.
- The exported names of `cli-guards.cjs`, the lock body format (`pid`, `ts`, `nonce`), the three environment knobs and their defaults (1,000 ms wait, 25 ms retry, 60,000 ms hold).
- The CI workflow `.github/workflows/deep-loop-runtime.yml` and the CI efficiency program. The operator ruled the fix separate from it.
- The Dependabot failure in run 40080059696 (the zod pin). It is a different problem on a different branch.
- A different locking mechanism, such as kernel advisory locks or a database lock. A change of mechanism is a new decision and needs the operator.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` | Modify | The reclaim path in `isWriterLockStale` and `acquireWriterLock` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/cli-guards-writer-lock.vitest.ts` | Modify | The reproduction and regression tests |
| `specs/system-deep-loop/041-writer-lock-stale-reclaim-race/scratch/` | Create | Saved outputs of the baseline, reproduction, stress loop and verification runs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Reproduce first. Before any change to `cli-guards.cjs`, a test exists that fails on the unchanged lock code with the lost-writer symptom, either deterministically or at a rate high enough to fail within a stated bounded run. The failing output is saved in the packet. If no reproduction fails, the cause is recorded as refuted or unconfirmed and the lock stays unchanged until the operator decides. |
| REQ-002 | Fix at the producer. The reclaim path removes only the lock file it judged stale. A lock that another writer creates after the verdict survives, and a lock that has already vanished leads to a retry of the open without any removal. No retry, sleep or loosened assertion is added to the tests or to the callers. |
| REQ-003 | The existing tests stay green and unedited: the 6 lock tests and the 12 jsonl-repair tests. The new reproduction passes after the fix, and the full runtime suite does not drop below its baseline. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | No change outside the lock. The diff holds only `cli-guards.cjs`, the lock test file and this packet. The exported API, the lock body format, the environment knobs and the callers are unchanged. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deterministic reproduction fails on the unchanged `cli-guards.cjs` and passes after the fix, and both outputs are saved in `scratch/`.
- **SC-002**: The CI-shaped stress loop reports zero lost records over 200 rounds after the fix. Its count before the fix is recorded whatever it is, because a count of zero before the fix means the loop alone cannot prove the fix and the deterministic test carries the proof.
- **SC-003**: No suite drops below its baseline. The failing run read 166 of 167 files and 2,806 tests passed, and the unchanged pair of files reads 18 passed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The suspected cause is wrong, because it is inferred | High: a fix aimed at the wrong race would ship as a confident change that cures nothing | REQ-001 gates every lock change on a failing reproduction. If the reproduction refutes the cause, the packet stops, records the verdict and names the next candidates in `plan.md` |
| Risk | The fix narrows the race window without closing it, because a compare-then-remove is still a check-then-act | Med: a rarer version of the same failure would remain | `plan.md` names the window that is left for each candidate fix, and the stress loop runs with a widened window to measure it |
| Risk | The lock is shared by five call sites, so a change to reclaim could break crash recovery | Med: a stuck or never-reclaimed lock stalls every writer | The dead-pid and aged-out tests run unedited, and the full runtime suite runs against its baseline |
| Dependency | Node 20.11 or newer, vitest 4.1.11 and the runtime's installed `node_modules` | Low: the unchanged pair of files already ran in this worktree | The same commands run in CI through `npm --prefix .opencode/skills/system-deep-loop/runtime test` |
| Dependency | The operator's choice of the branch that carries the fix | Low: it only decides where the commit lands | Open question below |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: An uncontended acquire keeps the same file operations as today: one exclusive open, one stamp, one nonce re-read.
- **NFR-P02**: The reclaim path adds at most one extra read of the lock file before a removal. The wait, retry and hold defaults do not change.

### Security
- **NFR-S01**: Any file the fix creates sits beside the lock path and is gone before `acquireWriterLock` returns.
- **NFR-S02**: The only environment values read are the three existing lock knobs.

### Reliability
- **NFR-R01**: Mutual exclusion holds under the reproduced interleavings: at no moment do two writers pass the nonce re-read for the same lock path.
- **NFR-R02**: A lock held by a dead pid, or aged past the hold limit, is still reclaimed.
- **NFR-R03**: The release function never throws and never removes a lock that carries another writer's nonce.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The lock file vanishes between the failed open and the read: retry the open and remove nothing.
- The lock body is empty or half-written because the holder is between open and stamp: not stale inside the grace window, as today.
- A different writer's lock sits at the path when the removal runs: it survives.

### Error Scenarios
- The lock cannot be read because of permissions: not stale, the writer waits out its limit, as today.
- The removal itself fails: the attempt is counted and the loop retries, and the cap of 8 attempts stays.
- A writer is killed while it holds the lock: the dead pid is detected and the lock is reclaimed once.

### State Transitions
- A holder that outlived the hold limit but is still alive: the lock is reclaimed by age, and the old holder's release then skips the removal because the nonce differs.
- Two reclaimers judge the same stale file: only one removal takes effect, and both then compete through the exclusive open.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two code files, an estimated 150 to 250 lines, most of them the reproduction test |
| Risk | 12/25 | A lock shared by five call sites. A mistake reintroduces silent record loss or a stuck lock |
| Research | 10/20 | The cause is inferred and needs a reproduction before any fix |
| **Total** | **28/70** | **Level 2** |

Level choice: `recommend-level.sh --loc 250 --files 2` returns Level 1 (score 25 of 100, one point above the Level 0 cutoff), and the estimates of 60 and 150 lines return Level 0. The level matrix (`assets/level-decision-matrix.md`) puts 100 to 499 lines at Level 2 and names testing needs as a reason to escalate, which a multi-process reproduction is. Level 2 also scaffolds `acceptance-criteria.md`, which this packet needs for its closure gate. The script has no flag for concurrency risk, so the matrix and the "when in doubt choose the higher level" rule decided it.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which branch carries the fix? This packet was opened on `worktrees/218-ci-efficiency-build`, and the operator ruled the fix a separate change from the CI program. The operator names the branch before the first lock change.
- Does the reproduction confirm the cause? The answer is the verdict in `plan.md` and decides whether the lock is changed at all.
<!-- /ANCHOR:questions -->

---
