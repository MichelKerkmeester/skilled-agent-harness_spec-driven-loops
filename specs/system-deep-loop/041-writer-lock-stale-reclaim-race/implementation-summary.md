---
title: "Implementation Summary"
description: "Complete. The writer lock reclaim now removes only the lock it judged stale and retries when the lock vanished. Two writers held the lock in 10 of 200 stress rounds before the change and in none after it. The link to run 40107240026 stays unproven."
trigger_phrases:
  - "writer lock stale reclaim race implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/041-writer-lock-stale-reclaim-race"
    last_updated_at: "2026-10-25T15:20:00Z"
    last_updated_by: "claude"
    recent_action: "Fixed the reclaim path and closed the packet"
    next_safe_action: "None. The packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-041-writer-lock-stale-reclaim-race"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 041-writer-lock-stale-reclaim-race |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A contender that failed the exclusive open and then found the lock file gone used to treat that as a stale lock and remove whatever sat at the path. A peer that had just created a fresh lock lost it, and two writers then held the lock together. The reclaim path now returns a `gone` verdict for a vanished file and retries the open with no removal. A stale verdict carries the body it was formed from, and `removeJudgedLock` removes the file only while it still holds that body. Finding class: class-of-bug, a removal that follows a verdict about a file that may have changed.

### Fix the stale-lock reclaim race in the shared deep-loop writer lock

`isWriterLockStale` became `judgeWriterLock`, which answers `gone`, `held` or `stale` and hands back the body judged. The caller retries a `gone` lock up to 64 times without spending the reclaim budget, and removes a `stale` lock through `removeJudgedLock`. The exported names, the lock body format, the environment knobs and the five callers are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` | Modified | The verdict function and the reclaim branch |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/cli-guards-writer-lock.vitest.ts` | Modified | Three new tests for the interleavings |
| `specs/system-deep-loop/041-writer-lock-stale-reclaim-race/` | Modified | This packet's docs and the saved outputs in `scratch/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baselines came first, then two replay tests of the suspected interleavings, which failed on the unchanged code. A six-process driver (`scratch/lock-stress.cjs`) then measured mutual exclusion directly: two writers sat inside the critical section in 10 of 200 rounds. The fix went in as commit ef1543de45 on main, and the same tests and loops ran again on it.

The widened loop deviates from the plan. The plan asked for the nine-record case run through a preload that delays the removal. The driver checks the invariant itself, with an exclusive marker file inside the critical section, so it sees an overlap whether or not a record is lost. The plain CI-shaped case was also run 200 times before and after, as planned.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shapes A and B together | A gone lock has nothing to remove, and a stale lock is removed only while its body matches the verdict. Both keep the lock-file protocol and each has a deterministic test |
| DEFECT-ONLY cause status | The defect reproduces and the fix cures it. The CI case did not fail in 200 repeats, so the link to run 40107240026 is unproven |
| Vanished-lock retries have their own cap of 64 | Each one means a peer made progress, so it must not use up the 8 attempts that guard against a never-removable stale lock |
| Branch main | The operator named no branch in the session that built it. The handoff's push recipe targets main |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All outputs were produced against fix commit ef1543de45 and are saved in `scratch/`.

| Check | Result |
|-------|--------|
| The two reproductions on the unchanged code | Both fail with the lost-writer symptom (`repro-before.txt`) |
| The same tests on the fix | `Tests  9 passed (9)` in the lock file (`repro-after.txt`) |
| The pair of lock files | 21 passed against 18 at baseline (`after-lock-files.txt`) |
| Full runtime suite | 167 files and 2810 passed with 8 skipped, against 2807 at baseline, exit 0 |
| Typecheck | Exit 0, as at baseline |
| Direct stress driver, 200 rounds | 10 failing rounds before the fix, 0 after, with the window widened by 3 ms or not |
| CI-shaped case, 200 repeats | 0 failures before and 0 after |
| Packet validator | `validate.sh specs/system-deep-loop/041-writer-lock-stale-reclaim-race --strict --no-recursive` printed `RESULT: PASSED` with Errors 0 and Warnings 0 |
| CI on the fix commit | On main, commit ef1543de45 ran 13 workflows and none failed, including Deep-Loop Runtime Tests (read 2026-10-25 with `gh run list --commit`). One green run does not show the old failure is gone, since it was seen once in 6 runs.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The link to run 40107240026 is unproven.** The lock defect is real and fixed, but the CI case never failed in 200 repeats on the unchanged code, so no run shows this defect produced the lost record.
2. **A narrow window remains.** `removeJudgedLock` re-reads the file and then removes it. A peer would have to create a lock in the microseconds between the two, right after an aged-out holder releases or a second reclaimer clears the stale file.
3. **Two other removal sites keep their code.** The stamp-failure removal needs a failed stamp write and a peer's unstamped lock at the same instant. The release removal needs a hold longer than the 60,000 ms limit. Neither is reachable in the CI-shaped case.
4. **The fix branch was not named by the operator.** It went to main on the handoff's push recipe. A revert of the fix commit undoes it.
5. **The widened loop is a direct driver, not the nine-record case through a preload.** See How It Was Delivered.
<!-- /ANCHOR:limitations -->

---
