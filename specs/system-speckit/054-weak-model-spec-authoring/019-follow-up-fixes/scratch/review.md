# Review: follow-up fixes

Reviewer verdict and findings, copied from the review pass on 2026-10-26. The remediation status at the end was added after the fix pass.

## Verdict

CHANGES NEEDED. One P1 blocks: change A dropped the executable bit from check-goal-file-manifest.sh. Its content edit is correct. Change B (loop.sh and README.md) is correct and I found no P0 or P1 in it, only three optional P2s.

### Change A

- Both git calls now pass `-c core.fsmonitor=false`: rev-parse on line 18 and ls-files on line 25. The script has no other git calls.
- The fail-closed paths are unchanged: `command -v`, `|| fail_closed` on both calls, and the exit-2 helper.
- The comment on line 24 states the durable why and names no spec path, phase or task id.
- The diff shows `old mode 100755 / new mode 100644`, and `ls -l` shows `-rw-r--r--`. That is the P1.

### Change B, what I checked

- **Order:** the round-start re-prepare (loop.sh:167) runs before R0 and before any step.sh launch. step.sh's author ABORT test (step.sh:30) therefore sees the rebuilt sandbox.
- **Head record:** H0 (loop.sh:126) is recorded after the start-of-run prepares and the leak gate.
- **Re-reading the sandbox path:** `sbx_dir` is read again after prepare.sh (loop.sh:145), so the new id is picked up. On refusal it is read once more (loop.sh:155).
- **Failed prepare:** prepare.sh removes the old directory before it builds and updates the map only on success. After a failure, the map still points to the removed directory. reprepare then recreates it empty with a DIRTY marker. In that variant, the author and upkeep steps both abort at `cd '$T'` (step.sh:28), so nothing is dispatched into a missing or half-built tree.
- **Head-mismatch refusal:** the new sandbox is mapped but marked DIRTY. The author step aborts, and the upkeep step either aborts or skips because there is no packet.
- **Interrupts:** prepare.sh runs in the foreground with SPEED_LOOP_LOCK_HELD exported. Its take_lock returns 0 without owning the lock, so its exit trap does not release the loop's lock. Ctrl-C reaches on_exit with STARTED=1, which marks the sandboxes DIRTY. If prepare had already removed the directory, that `touch` fails quietly. This is harmless: the next run's reuse check needs a `ready` file, so that sandbox gets rebuilt.
- **Dry run:** it calls prepare.sh with `--dry-run`, which writes nothing. The real dry run, `/bin/bash loop.sh --task minpct --variants pre054,main-no054 --runs 2 --dry-run --reuse-refined`, exited 0. It reused both sandboxes and printed no re-prepare line. The results folder held 8 entries before and after the run. `git status` on the loop folder still lists only README.md and loop.sh as modified.
- **Pinned heads:** prep/prep-times.tsv shows the snapshot head unchanged across repeated prepares over two days and two tasks:
  - pre054: 7433813f (3 prepares)
  - main-no054: 582d0f90 (3 prepares)
  - now054: c8ad4c98 (3 prepares)

  The pre054 snapshot tree holds no dist, node_modules or tsbuildinfo path (`ls-tree` count 0), so built and gitignored files do not enter the head.
- **bash 3.2 compatibility:** `/bin/bash` is 3.2.57 and `bash -n loop.sh` exited 0. The change uses only indexed arrays and `${!VS[@]}`, with no associative arrays and no mapfile.
- **Leak gate:** the deviation the implementer reported (requiring `task_term_refs=0` only when the task has a terms file) is correct. It matches the existing leak gate, which loop.sh:108 also applies only when a terms file is set.

I did not run a real (non-dry) re-prepare, so the refusal and recovery paths are checked by reading the code only. I edited no file and made no git writes.

## Findings

| Severity | File | Line | Issue | Fix |
|----------|------|------|-------|-----|
| P1 | `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh` | 1 | The edit changed the file mode from 100755 to 100644 (`git diff` shows `old mode 100755 / new mode 100644`; `ls -l` shows -rw-r--r--). Any caller that runs the script directly, rather than through `bash <path>`, now fails with permission denied. | `chmod +x` the script, then confirm `git diff` shows only the content change and no mode line. |
| P2 | `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop/loop.sh` | 155 | A refusal leaves the sandbox marked DIRTY, so the next round retries the full re-prepare (a tsc build, 50 to 140 s) and usually refuses again. For refined after a worktree change, or a prepare that keeps failing, this repeats every remaining round. It stays outside the timed steps but makes the run longer. The refusal message and the README also say the sandbox 'stays DIRTY', which hides that it is retried every round. | Record refused variants in an indexed array, for example `REFUSED[$i]=1`, and have reprepare return early for them. Or keep the retry, and say in the refusal message and the README section that it repeats each round. |
| P2 | same `loop.sh` | 142 | When prepare.sh fails mid-build, the new half-built directory under SBX_ROOT (a fresh id that was never written to the map) is left behind. The start-of-run path had the same gap but exited at once. Re-preparing every round can now leave one orphan per failed round. | Optional: before calling prepare.sh, list the directory names under SBX_ROOT. On failure, remove any new directory whose id is not in sandbox-map.tsv. Or note the orphans in the refusal line. |
| P2 | same `loop.sh` | 137 | In a dry run, a sandbox marked DIRTY gets a planned prepare at the start of the run and again at round 2. H0 is also read from the old ready file. A real run would already have rebuilt that sandbox at the start, so the dry output overstates the round-2 re-prepare. This only affects what the dry run prints. | Optional: in dry mode, skip the round-start re-prepare plan for variants that the start-of-run block already planned to prepare. Or add one line to the README saying the dry run shows both plans. |

## Remediation status

| Finding | Status | Evidence |
|---------|--------|----------|
| P1 executable bit | Fixed | `ls -l` prints `-rwxr-xr-x`; `git diff` shows `index c5fe8d9871c..56da9621a05 100755` and no mode lines |
| P2 refusal retried each round | Fixed by the conductor | `REFUSED` at loop.sh lines 135 and 164; the refusal line and README say the variant stays out for the rest of the run; `scratch/test/reprepare-harness.sh` prints nothing for refused variants in round 3 |
| P2 orphan directory after a failed prepare | Open, optional | Not changed |
| P2 dry run overstates the round-2 re-prepare | Fixed | `PREPPED` at loop.sh lines 93, 106 and 140; the dry run skips the round-start plan for a variant already planned. The live dry run reused both sandboxes, so it did not reach this path; a standalone snippet printed `pre054 skipped` and `main-no054 planned` |
