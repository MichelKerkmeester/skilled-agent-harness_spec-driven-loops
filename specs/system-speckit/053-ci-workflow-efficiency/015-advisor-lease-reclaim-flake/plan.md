---
title: "Implementation Plan: advisor lease reclaim flake"
description: "Publish the advisor owner lease with a temp file and one hard link, reclaim only the lease that was read, give a starting owner a bounded grace to open its socket, and make the stale-reclaimer test wait for the surviving launcher's daemon child."
trigger_phrases:
  - "advisor lease reclaim flake plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: advisor lease reclaim flake

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS launcher), TypeScript tests |
| **Framework** | vitest 4 |
| **Storage** | The owner-lease and launcher-lease JSON files in the advisor database directory |
| **Testing** | `npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` |

### Overview
Change the owner-lease claim and the missing-socket bridge decision in the launcher, one end-to-end test and its fixture, and add one end-to-end and three unit tests. Prove each race fails the old code in a forced scratch copy and passes the fixed code, then run the file 20 times in a row and 20 times four at a time, and run the advisor default and stress suites.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx vitest run tests/skill-advisor-launcher-orphan-reaping.vitest.ts` prints `Tests  9 passed (9)` in 20 of 20 runs and in 20 of 20 runs four at a time, and `Tests  10 passed (10)` in 10 of 10 serial runs after the bridge-disabled test
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Atomic lease publish.

### Key Components
- **`writeOwnerLeaseFileExclusive`**: writes and fsyncs the lease in a private temp file, then `linkSync` puts it at the owner path; `EEXIST` means another launcher holds it.
- **`setAsideOwnerLease`**: renames the lease to `<path>.reclaiming.<pid>.<random>` and compares it with the text that was read. The same text is deleted; changed text goes back with `link()`, and `EEXIST` there leaves a newer claim standing.
- **`acquireOwnerLeaseFile`**: one read tells an absent lease from one that does not parse; a stale or unparseable lease is set aside and reclaimed; a lost claim or a changed lease loops to re-read, at most three times.
- **`waitForStartingHolderSocket`**: before the bridge decision, when the holder is a live owner whose lease started inside the grace, polls every 50 ms for its socket until the socket appears, the grace ends or the owner dies. It returns at once when `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1`, the same check the bridge makes before it reports without reading any socket.

### Data Flow
Two launchers read a stale owner lease. Each moves it aside only if it is still the lease it read, and one link of a fresh lease succeeds. The loser reads the winner's complete lease and waits for the winner's daemon to open its socket, then bridges to it and exits when its client does. The test waits until the lease names a live child that has written its own pid.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `writeOwnerLeaseFileExclusive` | Publishes a claim for `acquireOwnerLeaseFile` and the dead-socket respawn | update | half-written-lease unit test; orphan-reaping respawn tests pass |
| `acquireOwnerLeaseFile` and `setAsideOwnerLease` | Decide who owns the advisor | update | empty-lease, peer-lease and live-owner unit tests |
| `bridgeOrReportLeaseHeld` | Bridges or respawns for all four `checkStrictSingleWriter` call sites | update | starting-owner and missing-socket tests; the wedged-child test still reaps |
| `hf-local.ts` owner-lease read | Reads the supervision field from the owner lease | not a consumer of the change, and now never sees a partial file | `hf-local-client.vitest.ts` passes |
| The orphan-reaping fixture | Stands in for the daemon | update: optional delayed socket | the 9 tests pass |

Required inventories:
- Same-class producers: `rg -n "writeOwnerLeaseFile|unlinkSync\(currentOwnerLeasePath" .skilled/bin/system-skill-advisor-launcher.cjs` lists the exclusive claim, the heartbeat rewrite (already temp file plus rename) and no remaining delete by path.
- Consumers of changed symbols: `rg -n "acquireOwnerLeaseFile\(|writeOwnerLeaseFileExclusive\(|bridgeOrReportLeaseHeld\("` lists one claim call, two exclusive writes and four bridge call sites, all in the launcher.
- Matrix axes: lease state (absent, stale, unparseable, live, changed after read) by claim outcome (won, lost); holder state (young with no socket, past the grace with no socket, socket present, wedged child).
- Algorithm invariant: the owner path holds either nothing or one complete lease, and a launcher deletes only the exact lease text it classified.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Forced races run on scratch copies of the tests, which go into `tests/` only for the run and are deleted afterwards. The HEAD launcher and test come from `git show HEAD:`. The round-0 launcher is the current file with the two round-1 call sites put back, so the helpers stay but never run. A 400 ms busy wait ahead of the fixture child's pid write stands in for a slow runner, and a copy of the fixed launcher sleeps 300 ms before the bootstrap lock. The unit tests run against an older launcher by requiring it from the scratch path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. The launcher already uses `fs`, and `linkSync` and `renameSync` are in Node's core.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a launcher fails with a `link` error or the claim error on a host's filesystem, or a client waits on a daemon that never opens its socket. Revert the one commit that touches `system-skill-advisor-launcher.cjs`; the two test files revert with it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The CI log and the worktree at `b2823d726a` | Implementation |
| Implementation | Each race reproduced or traced | Verification |
| Verification | All fixes applied | Close |
<!-- /ANCHOR:phase-deps -->

---
