---
title: "Implementation Plan: Fix the stale-lock reclaim race in the shared deep-loop writer lock"
description: "Reproduce the lost-writer failure first, with a deterministic test of the suspected reclaim interleaving and a high-rate loop of the CI case. Then confirm or refute the inferred cause and fix the reclaim path in cli-guards.cjs so it removes only the lock file it judged stale. Verify against the baselines."
trigger_phrases:
  - "writer lock stale reclaim race plan"
  - "reproduce the writer lock race"
  - "reclaim removes only the file it judged stale"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix the stale-lock reclaim race in the shared deep-loop writer lock

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS for `cli-guards.cjs`, TypeScript for the vitest tests, Node 20.11 or newer |
| **Framework** | vitest 4.1.11, run from `.skilled/skills/system-deep-loop/runtime` |
| **Storage** | A file-based lock: an exclusive-create (`wx`) lock file stamped with pid, timestamp and a per-acquisition nonce. It guards JSONL state files and the graph storage |
| **Testing** | `npx vitest run --no-coverage <files>` for the lock and jsonl-repair files, and `npm --prefix .skilled/skills/system-deep-loop/runtime test` for the whole runtime suite |

### Overview
Run 40107240026 lost one of nine records in `jsonl-repair.vitest.ts` line 461. The suspected cause is a stale-lock reclaim race in `acquireWriterLock`, where the reclaim path deletes whatever file sits at the lock path after a staleness verdict about a file that may no longer be there. This plan reproduces the failure on the unchanged code first and decides whether the cause is confirmed. It changes the lock only after that, at the reclaim path in `cli-guards.cjs`.

**Cause status: INFERRED** (not reproduced as of 2026-10-25). This line changes to CONFIRMED, DEFECT-ONLY or REFUTED when task T005 completes, using the rule in section 4.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented in `spec.md`
- [ ] Success criteria measurable
- [ ] The operator has named the branch that carries the fix
- [ ] Baselines for the lock files and the full runtime suite are saved (T001)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The reproduction fails before the fix and passes after it, and both outputs are saved
- [ ] The cause status is no longer INFERRED
- [ ] Existing tests passing and unedited, full runtime suite at or above its baseline
- [ ] Docs updated (spec, plan, tasks, implementation summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
File-based mutual exclusion with a self-healing reclaim step. A writer creates the lock file with an exclusive open and stamps its pid, a timestamp and a nonce. It then re-reads the nonce to prove the file is still its own. A writer that finds the file already there decides whether it is stale and, if so, removes it and retries.

### Key Components
- **`acquireWriterLock` (`cli-guards.cjs` line 443)**: the open, stamp, re-read and reclaim loop, and the release function it returns.
- **`isWriterLockStale` (line 344)**: reads the lock and answers whether it may be removed. A dead pid or an age past the hold limit is stale, and a lock that has vanished (ENOENT) also answers true at line 351.
- **`readLockNonce` (line 398)**: the ownership read used by the re-read and by release.

### Data Flow
The suspected interleaving is INFERRED. Each step is something the code at the cited line allows. H holds the lock, and B and C are two contenders.

1. B calls `openSync(lockPath, 'wx')` (line 461) and gets EEXIST.
2. H finishes, and its release removes the lock file (line 568).
3. B calls `isWriterLockStale`, whose read gets ENOENT, so it returns true (line 351).
4. C calls `openSync(lockPath, 'wx')`, succeeds, stamps its nonce, passes the re-read at line 507 and enters the critical section.
5. B runs `fs.rmSync(lockPath, { force: true })` (line 536). The file at the path is now C's live lock, and B deletes it. B never checked that the file it removes is the one it judged, and here it judged no file at all.
6. B's next `openSync` succeeds because the path is free. B stamps, passes its own re-read and enters the critical section while C is still inside.
7. Both run the read-modify-write on the JSONL file. A merge replaces the file by an atomic rename, so any record the other writer appended to the old file is lost. The result is 8 records instead of 9.

C's release later reads B's nonce at the path, finds it is not C's own and skips the removal (line 567), so no lock file is left behind and nothing signals the overlap.

The same unconditional removal also exists for a lock that is stale by its body. B reads a dead pid or an aged timestamp. Another reclaimer removes that file and a peer creates a fresh one. B then removes the fresh one. Only the ENOENT variant is reachable in the failing test, because every writer there is alive and holds the lock well under the hold limit (DERIVED from lines 380 to 385).

### Candidate Fix Shapes
These are candidates, not decisions. The reproduction and the widened-window loop decide.

- **Shape A, ENOENT means retry, not remove.** When the read finds the file gone there is nothing to judge or remove. The loop retries the exclusive open and skips the removal. This closes the variant the DERIVED reasoning says CI can reach. No window is left for that variant.
- **Shape B, remove only what was judged stale.** The verdict carries the body it judged, and just before the removal the reclaimer reads the file again and removes only on a match. A fresh peer lock fails the match and survives. A narrow window is left between that second read and the removal. It needs a peer to create a lock in those few microseconds, right after either an aged-out live holder releases or a second reclaimer removes the file.
- **Shape C, serialize reclaimers.** A short-lived second exclusive file beside the lock, taken around the verdict and the removal, lets one reclaimer act at a time. It removes the two-reclaimer window of shape B. It adds a file that a crash can orphan, so it needs its own stale rule.
- **Set aside: rename the stale file to a private name and verify it.** If the rename grabs a peer's fresh lock, handing it back leaves a gap in which a third writer can enter, so it recreates the overlap.

Plan-level judgment, one lens, open to change by the evidence: take shape A together with shape B first, because they keep the lock-file protocol and each has a deterministic test. Take shape C only if the widened-window loop still shows an overlap after A and B.

**Chosen shape:** not chosen yet. This line records the choice and the window it leaves when task T006 completes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `acquireWriterLock` reclaim branch, `cli-guards.cjs` lines 533 to 541 | The producer: removes the lock path after a verdict, with no check of what the path holds | Update | The new reproductions fail before and pass after |
| `isWriterLockStale` ENOENT branch, line 351 | Answers true for a file that is already gone, which sends the caller into the removal | Update (or change how the caller reads the verdict) | The ENOENT reproduction |
| Stamp-failure removal (line 489) and `release` removal (line 568) | Two more removals that follow a read of the same file | Inventory first. Change only if the inventory shows the same defect is reachable | The inventory result in CHK-FIX-002 |
| `lib/deep-loop/jsonl-repair.ts` lines 264 and 289, `scripts/upsert.cjs` line 299, `scripts/convergence.cjs` line 858, `lib/council/convergence.cjs` line 204 | Callers of `acquireWriterLock(lockPath)` and its release function | Unchanged. The signature and the returned function stay the same | `rg -n "acquireWriterLock"` shows the same call shape, and their suites stay green |
| `tests/unit/cli-guards-writer-lock.vitest.ts` | The 6 existing lock tests | Add the reproductions as regression tests. Leave the 6 untouched | The file runs 6 existing tests plus the new ones, all passing |
| `tests/unit/jsonl-repair.vitest.ts` line 461 | The observer that failed in CI | Unchanged | The 12 tests pass |
| `database/README.md` line 28 | Describes the lock as `wx` acquisition, stale-lock reclamation and nonce ownership checks | Unchanged. The sentence stays true | Read at the close-out |

Required inventories:
- Same-class producers: `rg -n "rmSync|unlinkSync|renameSync" .skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs`. The first read found three removal sites, at lines 489, 536 and 568.
- Consumers of changed symbols: `rg -n "acquireWriterLock|isWriterLockStale" .skilled/skills/system-deep-loop/runtime --glob '!node_modules'`.
- Matrix axes: what the verdict read (file gone, stale body, live body), what a peer does between the verdict and the removal (nothing, creates a fresh lock, removes the stale file and creates a fresh lock) and how many reclaimers act (one or two).
- Matrix rows, 7 in all. R1: file gone and a peer creates a fresh lock (the CI-derived path, new test). R2: file gone and nothing happens (a plain retry, exercised by every contended acquire in the stress loop). R3: dead-pid body and nothing happens (existing test). R4: aged body with a live pid (existing test). R5: stale body and a peer swaps in a fresh lock before the removal (new test). R6: stale body with two reclaimers (the widened-window loop only). R7: live fresh body, which must be respected (existing test).
- Algorithm invariant: a reclaimer removes only the file it judged stale. A verdict about one file is never applied to a different file that now sits at the same path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The order is reproduce, decide, fix, verify.

**Reproduce (Setup phase).**
- Save the baselines for the lock files and the full runtime suite on the unchanged code.
- Run the CI case in a loop. The single case is `-t "does not drop a plain appendJsonlRecord"` in `jsonl-repair.vitest.ts`, repeated about 200 times with the count of failures saved. To widen the window, a scratch driver in `scratch/` runs the same nine-record case through its own writer script, with a preload that delays `fs.rmSync` on the lock path by a few milliseconds. The committed `jsonl-repair.vitest.ts` is not edited, and the preload never enters `cli-guards.cjs`.
- Write the deterministic reproduction in the lock test file. `cli-guards.cjs` calls `fs.readFileSync` and `fs.rmSync` through `const fs = require('node:fs')`, so a spy on the default `node:fs` export reaches it. Hold the lock as a live stand-in peer so B's open fails with EEXIST. On B's first read of the lock path, run the real read and let the file change right after it returns. For R1, remove the stand-in's file so the real read gets ENOENT, then create a fresh peer lock before B continues. For R5, start from a dead-pid body and swap in a fresh peer lock right after the read. Set `DEEP_LOOP_WRITER_LOCK_MAX_WAIT_MS=0` so a respected lock throws instead of waiting. On the unchanged code B acquires and the peer's lock is gone. After a correct fix B throws `DB_ERROR` and the peer's nonce is still on disk. Restore the spies and the environment in `afterEach`.

**Decide (Setup phase).** The cause status moves from INFERRED by this rule.
- CONFIRMED: the deterministic reproduction fails on the unchanged code, and the CI-shaped loop (plain or widened) also produces a lost record there. Both are then fixed by the same change.
- DEFECT-ONLY: the deterministic reproduction fails, but nothing reproduces the 8-of-9 symptom. The lock defect is real and gets fixed. The link to run 40107240026 stays unproven, and the packet says so and asks the operator.
- REFUTED: the deterministic reproduction cannot produce an overlap and the loop loses nothing. The packet stops with no lock change. The next candidates are the other two removal sites (lines 489 and 568) and, last, the JSONL helpers in `jsonl-repair.ts`, which are outside this packet and would be reported, not fixed.

**Fix (Implementation phase).** Choose the shape, record it in section 3 and implement it in `cli-guards.cjs` only. Keep the two reproductions as regression tests in the lock test file.

**Verify (Verification phase).** Rerun the reproductions, the 200-round loop with the widened window, the two lock files, the full runtime suite against its baseline and the scope check on the diff. Then run the packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit, deterministic | `acquireWriterLock` and `isWriterLockStale` under rows R1 and R5, with `node:fs` spies | vitest, `tests/unit/cli-guards-writer-lock.vitest.ts` |
| Integration, multi-process | The CI case: 1 seed record, 4 plain appenders and 4 merge writers, expecting 9 records | The existing `jsonl-repair.vitest.ts` case, unedited |
| Stress loop | The CI case repeated about 200 times before and after the fix, plain and with a widened window | A shell loop around `npx vitest run --no-coverage`, output in `scratch/` |
| Regression | The whole runtime suite against its saved baseline | `npm --prefix .skilled/skills/system-deep-loop/runtime test` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Runtime `node_modules` and vitest 4.1.11 | Internal | Green: the pair of lock files ran in this worktree on 2026-10-25 | No local run is possible until they are installed |
| The operator's choice of the fix branch | Internal | Yellow: not chosen | The first lock change waits for it |
| `.github/workflows/deep-loop-runtime.yml` | Internal | Green, unchanged | None, since it only runs the suite |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any of the 6 lock tests or the 12 jsonl-repair tests fails after the change, the full runtime suite drops below its baseline or a lock is left behind or never reclaimed.
- **Procedure**: revert the single commit that holds the change to `cli-guards.cjs` and the lock test file. Nothing else depends on it, and the packet docs stay.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: baseline, reproduce, decide) ──► Phase 2 (Implementation: fix) ──► Phase 3 (Verification)
                │
                └── cause REFUTED ──► stop, report to the operator, no lock change
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup with a cause status other than REFUTED, and the operator's branch | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

These are estimates, not measurements.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 2 to 3 hours, mostly the deterministic reproduction and the loops |
| Implementation | Low to Med | 1 to 2 hours |
| Verification | Low to Med | 1 to 2 hours |
| **Total** | | **4 to 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes): not needed, the change touches no stored data
- [ ] Feature flag configured: not applicable, the lock has no flag
- [ ] Monitoring alerts set: the next deep-loop-runtime runs on main are read with `gh run list --workflow deep-loop-runtime.yml`

### Rollback Procedure
1. Revert the fix commit with `git revert`.
2. Rerun the two lock files from the runtime directory and expect all tests to pass.
3. Read the next deep-loop-runtime runs on main for a repeat of the 8-of-9 failure.
4. Tell the operator what was reverted and why.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the lock file holds no data that outlives a run
<!-- /ANCHOR:enhanced-rollback -->

---
