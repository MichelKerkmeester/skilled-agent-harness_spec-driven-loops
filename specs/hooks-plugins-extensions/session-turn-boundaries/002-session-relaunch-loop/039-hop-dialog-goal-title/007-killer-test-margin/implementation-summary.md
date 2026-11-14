---
title: "Implementation Summary"
description: "The killer grace-period test now has a 1000 ms deadline instead of 450 ms, so a late poll on a busy machine no longer fails it. A load run failed 14 of 160 before and 0 of 160 twice after."
trigger_phrases:
  - "killer test margin implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/007-killer-test-margin"
    last_updated_at: "2026-11-14T07:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the killer test margin change, the load runs and the checks run in worktree 373"
    next_safe_action: "None. The code is committed as 8a113b68ae and awaits the operator's merge"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/tests/killer.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-killer-test-margin"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the test still pass on a slower runner than the 18-core machine measured? Not run."
    answered_questions:
      - "Was the 450 ms margin the cause of the failed run? Confirmed on one 18-core machine: 14 of 160 load runs failed at 450 ms and 0 of 160 twice at 1000 ms."
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
| **Spec Folder** | 007-killer-test-margin |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The killer test that checks a record stays armed when its target exits during the grace period no longer fails on a busy machine. Its deadline went from 450 ms to 1000 ms, so one late poll cannot miss it.

### Phase 7: killer-test-margin

The test ran the killer with `idleMs: 400` and `timeoutMs: 450`. The killer polls every 100 ms, so the deadline sat 50 ms past the idle window and one late poll on a busy machine missed it. The test then failed with the target's signal file missing. The research of 2026-11-13 found one such failure and could not reproduce it.

The test now gives the killer 1000 ms and carries a two-line comment that names the poll interval. No product code changed, and the killer's polling and deadline logic are as they were. You see fewer false failures in the relaunch suite and no change in what the killer does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modified | `timeoutMs` 450 to 1000 and a two-line comment in the grace-period test |
| `scratch/killer-load.sh` | Created | Runs the one test N times at once and prints how many runs failed |
| `scratch/red.txt` | Created | The load run at 450 ms, 14 of 160 failed, with one failed run's output |
| `scratch/green.txt` | Created | Two load rounds at 1000 ms, 0 of 160 failed each, one run's output and the whole killer file passing 64 of 64 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The research of 2026-11-13 ranked the change 14 of 19 and named the margin as the likeliest cause, with no reproduction. This phase reproduced it first. `scratch/killer-load.sh 160 <output dir>` ran the one test 160 times at once on an 18-core machine. At `timeoutMs: 450` 14 of 160 runs failed, and the sample in `scratch/red.txt` fails with `ENOENT` on the target's signal file.

This child changes a test, so it has no test that failed first in the usual sense. The load run at 450 ms is its red run. After the edit the same command ran twice and failed 0 of 160 each time (`scratch/green.txt`). The whole killer file then ran alone and passed 64 of 64.

The commit message of `8a113b68ae` records the relaunch and OpenCode plugin suites at 1543 of 1543, unchanged. The code is committed on branch `worktrees/373-relaunch-gap-fixes` and not merged. These documents were written afterwards from the commit and the saved runs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reproduce under load before changing anything | The research had only a likely cause. A run that fails at 450 ms and passes at 1000 ms turns it into a measured one |
| Widen the test's deadline and leave the killer alone | The killer's 100 ms poll is correct. A test that leaves 50 ms for it is the part that was wrong |
| 1000 ms and not a smaller step | It leaves 600 ms past the idle window where 450 ms left 50 ms, and two rounds of 160 passed. A smaller value was not measured |
| Change only the one failing test | Four other `timeoutMs` values in the file were not named as failing, so none was touched |
| Name the poll interval in the test comment | A later reader who lowers the margin sees why it was 1000 ms |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Load run at 450 ms (`scratch/red.txt:2`) | `parallel runs: 160, failed runs: 14`, each failed run reading `ENOENT` on `target-signal` |
| Load run at 1000 ms (`scratch/green.txt:2` and `scratch/green.txt:3`) | `parallel runs: 160, failed runs: 0` in both rounds |
| Whole killer file alone (`scratch/green.txt:15` to `scratch/green.txt:18`) | tests 64, pass 64, fail 0 |
| Relaunch and OpenCode plugin suites | 1543 of 1543, unchanged, from the commit message. Not rerun by this author |
| `node --check` on the changed test | Exit 0 |
| Only a test changed | `git show --stat 8a113b68ae` lists one file with 3 insertions and 1 deletion, and no new file |
| Strict validation | Recorded in `goal.md` section 4 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live hop was run for this child.** The change is to a test and no runtime path changes. A live hop would confirm only that the killer still ends an idle runtime and keeps the record armed, which the test itself checks.
2. **The cause is confirmed for one machine.** The load result is from an 18-core machine. A slower runner could fail for a different reason, and `scratch/killer-load.sh` reruns the check there.
3. **The killer's log was not saved for a failed run.** `scratch/red.txt` shows the signal file missing and no `killer-timeout` line, so a late poll is the cause the load result supports and the log does not name.
4. **The suite count is not rerun here.** The 1543 of 1543 is the commit message's. The worktree holds later commits that change the count, so a rerun would not confirm the tree of this commit.
5. **A heavier load was not tried.** 160 runs at once passed twice at 1000 ms. No larger count was run, so the margin at 1000 ms is not measured to its limit.
<!-- /ANCHOR:limitations -->

---


