---
title: "Feature Specification: Phase 15: advisor-lease-reclaim-flake"
description: "The advisor launcher test for two stale-lease reclaimers failed in CI because it read the daemon child's pid before the child had started. Three launcher races sat behind it: a torn owner-lease read, a reclaim that deleted a fresh lease, and a reap of an owner still starting. This phase fixes all three and makes the test wait for the child."
trigger_phrases:
  - "advisor lease reclaim flake"
  - "phase 15 advisor lease reclaim flake"
  - "stale lease reclaimers flake"
  - "owner lease torn read"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: advisor-lease-reclaim-flake

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/246-advisor-lease-reclaim-flake` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 013-killer-test-spawn-race |
| **Successor** | None |
| **Handoff Criteria** | The orphan-reaping suite passes 20 runs in a row and 20 runs four at a time, each forced race fails the old code and passes the fixed code, and the advisor default and stress suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the CI workflow efficiency packet. It fixes one flaky advisor test found in the CI run history after phase 013 closed, and the three launcher races a review traced behind it.

**Scope Boundary**: the owner-lease claim and the missing-socket bridge decision in `.skilled/bin/system-skill-advisor-launcher.cjs`, the tests in `skill-advisor-launcher-orphan-reaping.vitest.ts` and `launcher-reap-pid-reuse.vitest.ts`, and the advisor changelog and version.

**Dependencies**: None beyond the advisor runtime's vitest.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`serializes two stale lease reclaimers and leaves one writer` failed in CI run 40596294785 (attempt 1, Ubuntu, Node 22) on commit `c8e5e2d4e1`, which touched no advisor code. The test read the daemon child's pid file as soon as one launcher was left. A launcher publishes its lease before it spawns the child, and the child writes its pid only once it runs, so on a slow runner the file was not there yet.

Three launcher races decided when that read landed:

1. **Torn read.** The owner lease was created with `O_EXCL` on its final path and then written, so it sat empty during the write. A racing launcher read the empty file, and the claim code then used the launcher's own lease as the holder. That launcher took itself for the live owner and sent itself SIGTERM while it held the bootstrap lock, which cost the real owner a one-second lock retry. An empty file left by a writer that died mid-write would have stopped every later launcher.
2. **Blind reclaim.** A stale reclaim deleted the owner lease by path. A live lease that a peer published between this launcher's read and its delete was deleted too, so two launchers could each believe they owned the lease, and in the worst order no lease stayed and the real owner's heartbeat shut its daemon down.
3. **Reaping a starting owner.** The daemon opens its IPC socket only after its startup scan and embedder setup. A second launcher that found no socket asked for a respawn and reaped a healthy owner that was still starting.

### Purpose
Make the owner-lease claim publish only complete leases, reclaim only the lease it read, and give a starting owner a bounded grace to open its socket. Make the test wait for the surviving launcher's child to report in.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The CI failure, from `gh run view 40596294785 --attempt 1 --log-failed`:

```text
× serializes two stale lease reclaimers and leaves one writer 1120ms
FAIL  tests/skill-advisor-launcher-orphan-reaping.vitest.ts > skill-advisor launcher orphan reaping fixtures > serializes two stale lease reclaimers and leaves one writer
AssertionError: expected null to deeply equal Any<Number>
 ❯ tests/skill-advisor-launcher-orphan-reaping.vitest.ts:429:37
      Tests  1 failed | 1300 passed | 8 skipped (1309)
```

A diagnostic copy of the test that logged both launchers' stderr ran 12 times on the old code. In 5 runs the losing launcher logged `liveOwnerDetected: ownerPid=<its own pid>` and then reaped its own pid. In 3 runs both launchers claimed the lease and the bootstrap reprobe turned one away. In the other 4 the loser reaped the winner while the winner was still starting. On the round-0 fix, a second launcher facing an owner whose daemon opens its socket 1500 ms late logged `has no socket at ... requesting respawn` and `reaping recorded skill-advisor daemon pid 80454`, and a new child (80472) replaced the healthy one.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Publish the owner lease by writing a private temp file and hard-linking it into place, so the path is only ever absent or complete.
- On a lost claim, re-read and classify the winner instead of naming the claimant as holder; reclaim a lease file that does not parse; bound the claim at three attempts.
- Reclaim by renaming the lease aside and comparing it with the text that was read, restoring it with `link()` when it changed.
- Hold off the missing-socket respawn while the holder is a live owner inside a startup grace (default `RESPAWN_REAP_GRACE_MS`, 7000 ms, overridable by `SPECKIT_LEASE_STARTUP_GRACE_MS` up to 30000 ms), polling for its socket, and skip that wait when `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1`, because the bridge then only reports.
- Make the stale-reclaimer test wait for a live child that matches the lease, and add tests for each race.

### Out of Scope
- An owner whose daemon needs longer than the grace to open its socket. A second launcher then respawns it as before.
- The launcher state file sharing its name with the launcher lease. That is by design and documented in `refreshPaths`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | Hard-link publish, `parseOwnerLease`, `setAsideOwnerLease`, bounded claim loop, `waitForStartingHolderSocket` before the bridge decision |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts` | Modify | Fixture daemon can open its socket after a delay; readiness wait; starting-owner bridge test; grace in the missing-socket respawn test |
| `.skilled/skills/system-skill-advisor/runtime/tests/launcher-reap-pid-reuse.vitest.ts` | Modify | Empty-lease, peer-published-lease and half-written-lease claim tests |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.17.0.md`, `SKILL.md`, the Hermes copy | Create/Modify | Release note and version step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The stale-reclaimer test waits for the surviving launcher's daemon child to report in before it asserts | With the fixture child's boot delayed 400 ms, the HEAD test and launcher fail 10 of 10 with `expected null to deeply equal Any<Number>` and the fixed pair passes 10 of 10 |
| REQ-002 | A launcher that loses the owner-lease claim never names itself the holder, and the owner path never holds a half-written lease | The empty-lease and half-written-lease unit tests fail on the HEAD launcher and pass on the fixed one |
| REQ-003 | A reclaim never deletes a lease it did not read | The peer-published-lease unit test fails on the round-0 launcher (`expected true to be false`) and passes on the fixed one, naming the peer as holder with its lease intact |
| REQ-004 | A second client bridges to an owner that is still starting instead of reaping it, and a holder past the grace is still respawned | The starting-owner test fails on the round-0 launcher (the owner's child is reaped and replaced) and passes on the fixed one; the missing-socket respawn test logs the wait and then respawns |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The tests stay strict about one writer | Each two-launcher test asserts one launcher process, one advisor-server process, a live owner, and owner and launcher leases naming the same launcher |
| REQ-006 | With the bridge disabled, a second client reports a starting owner without waiting for its socket | The bridge-disabled test fails on the launcher without the guard (7203 ms, wait log printed) and passes with it, under 2000 ms against a 7000 ms grace |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run tests/skill-advisor-launcher-orphan-reaping.vitest.ts` passes 9 of 9 in 20 consecutive runs and in 20 runs started four at a time, and 10 of 10 in 10 serial runs once the bridge-disabled test was added.
- **SC-002**: The advisor default suite passes 153 files with 1306 passed and 8 skipped (the baseline 1301 plus the five new tests), and the stress suite passes 21 files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Hard links in the advisor database directory | Med: a filesystem without `link()` makes the claim throw | The deep-loop lock and the task-dispatch guard already publish this way here; the default directory lives inside the checkout |
| Risk | A second client now waits up to the grace for a starting owner | Low: up to 7 s once, only while the owner is young and its heartbeat fresh | The wait ends as soon as the socket appears or the owner dies, and the override is clamped to 30 s |
| Risk | The claim loop runs out of attempts | Low | It throws a named error that `main` logs before exiting 1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A claim adds one temp-file write and one `link()` per launcher start. The orphan-reaping file took 3.43 to 3.87 s per run with 8 tests and 5.76 to 6.03 s with 9; the added starting-owner test waits out a 1500 ms socket delay by design.
- **NFR-P02**: The startup wait polls every 50 ms and stops at the first sign of the socket.

### Security
- **NFR-S01**: The temp and set-aside files are created `0o600` in the lease directory, the same mode as the lease.
- **NFR-S02**: No new secret, permission or network call.

### Reliability
- **NFR-R01**: The owner-lease path is only ever absent or a complete lease.
- **NFR-R02**: A reclaim removes only the exact text it read; a changed lease is put back with `link()`, which never replaces a newer claim.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty owner-lease file is reclaimed, and the claimant becomes the owner.
- Maximum input: `SPECKIT_LEASE_STARTUP_GRACE_MS` above 30000 is clamped to 30000, and a negative or non-numeric value falls back to 7000.
- Failure path: three lost claims in a row throw `skill-advisor owner lease stayed contended after 3 claim attempts`, and a restore that fails with anything but `EEXIST` rethrows and keeps the set-aside file.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One launcher, two test files, one changelog |
| Risk | 12/25 | The single-writer lease every advisor session depends on |
| Research | 10/20 | Three interleavings traced from logs and forced in scratch copies |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---
