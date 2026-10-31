---
title: "Implementation Summary"
description: "Advisor launchers that start together now settle on one owner without stopping themselves, a reclaim deletes only the lease it read, a second client bridges to an owner still starting, and the stale-reclaimer test waits for the daemon."
trigger_phrases:
  - "advisor lease reclaim flake implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/015-advisor-lease-reclaim-flake"
    last_updated_at: "2026-10-28T01:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Skipped the startup wait when the bridge is disabled"
    next_safe_action: "None; the conductor lands the commit"
    blockers: []
    key_files:
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/launcher-reap-pid-reuse.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-015-advisor-lease-reclaim-flake"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-advisor-lease-reclaim-flake |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two advisor launchers that start together now settle on one owner without either one stopping itself or killing the other's daemon, and the CI test for that case waits for the daemon to start. The CI failure (`expected null to deeply equal Any<Number>`) came from the test reading the daemon child's pid before the child ran. A review of the first fix found two more races in the same claim and bridge path, and this phase fixes those too.

### A claim that is only ever absent or complete

The owner lease used to be created with `O_EXCL` on its final path and then written, so it stayed empty during the write. A racing launcher read the empty file, used its own lease as the holder, and sent itself SIGTERM while it held the bootstrap lock. The lease is now written to a private temp file and linked into place, which fails with `EEXIST` just as `O_EXCL` did. A launcher that loses the link re-reads the winner. An unparseable lease, such as the empty one a launcher killed mid-write used to leave, is reclaimed.

### A reclaim that removes only what it read

A stale reclaim used to delete the lease by path, so a live lease a peer published between the read and the delete went with it. The reclaim now renames the lease aside and compares it with the text it read. The same text is deleted and the claim goes ahead. Changed text is linked back, and if a third launcher has claimed the path by then, its claim stands. This mirrors the deep-loop lock's `tryReclaimStaleLoopLock`.

### A grace for an owner that is still starting

The daemon opens its IPC socket only after its startup scan and embedder setup. A second launcher that found no socket asked for a respawn and reaped the starting daemon. Now, when the holder is a live owner whose lease started within the grace, the second launcher polls every 50 ms for the socket and bridges once it appears. The grace defaults to `RESPAWN_REAP_GRACE_MS` (7000 ms), `SPECKIT_LEASE_STARTUP_GRACE_MS` overrides it up to 30000 ms, and a holder past the grace is respawned as before. With `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1` the bridge only reports the holder and never reads a socket, so the wait is skipped and the report comes at once.

### Tests that wait for the writer to settle

The stale-reclaimer test waits for one launcher, then for the lease's `childPid` to name a live child that has written its own pid, and asserts one launcher, one advisor-server, a live owner and matching leases. Its fixture daemon now opens its socket as the real one does. A new test starts an owner whose daemon opens its socket 1500 ms late and checks the second client is bridged and served. The missing-socket respawn test now gets a 1500 ms grace and checks the wait comes before the respawn. A bridge-disabled test checks that a second client reports a starting owner without waiting. Three unit tests cover the empty lease, a peer lease published after the read, and a half-written lease.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modified | Hard-link publish, `parseOwnerLease`, `setAsideOwnerLease`, bounded claim loop, `waitForStartingHolderSocket` |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts` | Modified | Delayed-socket fixture, readiness wait, starting-owner test, grace in the respawn test |
| `.skilled/skills/system-skill-advisor/runtime/tests/launcher-reap-pid-reuse.vitest.ts` | Modified | Three owner-lease claim tests |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.17.0.md` | Created | Release note |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `.hermes/skills/system-skill-advisor/SKILL.md` | Modified | Version 0.17.16.0 to 0.17.17.0, Hermes copy synced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I read the CI log and logged both launchers' stderr over 12 runs of the HEAD code. Then I forced each race in scratch copies: a 400 ms boot delay in the fixture child, a 300 ms sleep before the bootstrap lock, a live lease written right after the claim's first read, and a daemon that opens its socket 1500 ms late. Each forced test failed on the code before its fix and passed after. Then I ran the file 20 times in a row and 20 times four at a time, and ran the default and stress suites after the build and graph scan CI runs first.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the launcher as well as the test | The test fix alone leaves a launcher that kills itself, deletes a peer's lease or reaps a starting daemon |
| Temp file plus `linkSync`, not `rename` | `rename` overwrites an existing holder; `link` keeps the `EEXIST` exclusivity the claim depends on |
| Rename aside and compare, then restore with `link` | A delete by path cannot tell the lease it read from one published since; a restore by `rename` could overwrite a newer claim |
| Grace measured from the owner lease's start, default 7000 ms | It reuses the launcher's existing reap grace, bounds the wait for a daemon that never opens a socket, and ends early on the socket or the owner's death |
| Verification checklist inside `tasks.md`, no `checklist.md` | `folder-structure.md` section 3 lists the Level 2 required files as `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` and `acceptance-criteria.md`, with no `checklist.md`; `upgrade-level.sh` put the checklist in `tasks.md` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| HEAD code, 12 diagnostic runs | 5 self-reaps after a torn read, 3 double claims caught by the bootstrap reprobe, 4 losers reaping the starting winner |
| HEAD test and launcher, 400 ms child delay | 0 of 10 pass, all `expected null to deeply equal Any<Number>` |
| Fixed code under the child delay, alone and with the 300 ms lock delay | 10 of 10 and 10 of 10 |
| Fixed launcher, test without the readiness wait, child delay | 10 of 10; the loser now waits for the socket, which needs the child running, so the wait is a guard rather than the fix |
| Torn-read unit tests on the HEAD launcher | fail: `expected 97276 not to be 97276`, `expected [ 'unreadable' ] to not include 'unreadable'`; pass on the fix |
| Peer-lease unit test on the round-0 launcher | fails: `expected true to be false`; passes on the fix |
| Starting-owner test on the round-0 launcher | fails: daemon 80454 reaped and replaced by 80472; passes on the fix |
| Bridge-disabled test without the guard, then with it | fails in 7203 ms with the wait log; passes in 315 ms |
| HEAD launcher swapped into the worktree, then restored | the three new unit tests and the starting-owner test fail 4 of 4; `cmp` on the restored file exits 0; the same four plus the bridge-disabled test then pass 5 of 5 |
| Orphan-reaping file, 20 in a row and 20 four at a time | 40 of 40 exit 0, `Tests  9 passed (9)` |
| Orphan-reaping file with the bridge-disabled test, 10 in a row | 10 of 10 exit 0, `Tests  10 passed (10)` |
| Advisor default suite after build | `Test Files  153 passed (153)`, 1306 tests passed and 8 skipped of 1314, exit 0 |
| Ephemeral-id scan of the 61 added comment lines | no match; gate comment-hygiene `RAN_CLEAN` |
| Advisor stress suite | `Test Files  21 passed (21)`, `Tests  65 passed (65)`, exit 0 |
| system-spec-kit tests that load the launcher | 2 files, 57 passed |
| Quality gate on the 3 code files | `gate=NO_BLOCKER_FOUND`, findings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The owner-lease directory needs hard links.** A filesystem without `link()` makes the claim throw. The default directory sits inside the checkout, and `SYSTEM_SKILL_ADVISOR_DB_DIR` can point a launcher elsewhere.
2. **A daemon slower than the grace is still respawned.** An owner whose socket takes longer than 7000 ms is treated as dead by a second client, as before; raise `SPECKIT_LEASE_STARTUP_GRACE_MS`, up to 30000, on such a host.
3. **A second client can wait up to the grace once.** That only happens while the owner is young, alive and fresh, and the wait ends the moment the socket appears.
<!-- /ANCHOR:limitations -->

---
