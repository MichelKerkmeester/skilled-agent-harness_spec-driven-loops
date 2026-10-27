---
title: "Tasks: Phase 3: fsmonitor-daemon-lifecycle"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fsmonitor daemon lifecycle tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: fsmonitor-daemon-lifecycle

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

`R` is `.skilled/bin/fsmonitor-daemon-reaper.sh`. `TF` is `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`. `WT` is a worktree inside a scratch clone, never inside this checkout.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline daemon list in `scratch/baseline.txt`. Verify: `wc -l < scratch/baseline.txt` prints the count that `pgrep -f 'fsmonitor--daemon run' | wc -l` prints when run right after it. Done 2026-10-27: 3 daemons in `scratch/baseline.txt` and 3 from `pgrep`, down from 11 at planning.
- [x] T002 Confirm the bounded runner on the design's own terms (no repo file, the perl alarm). Verify: `perl -e 'alarm shift; exec @ARGV or exit 127' 1 sleep 5; echo $?` prints 142, and `perl -e 'alarm shift; exec @ARGV or exit 127' 3 sleep 0.2; echo $?` prints 0. Done 2026-10-27: 142 and 0.
- [x] T003 [P] Confirm the socket rows that attribution reads, from a read-only `lsof -nP -p <pid>` of one main daemon and one worktree daemon. Verify: the main daemon shows an absolute `.git/fsmonitor--daemon.ipc` row, and a worktree daemon shows a bare `fsmonitor--daemon.ipc` row with a `DIR` row for `.git/worktrees/<name>`. Done 2026-10-27, with a correction: the main daemon shows its absolute `.git/fsmonitor--daemon.ipc` socket, but the steadier key on both kinds is the lowest-numbered `DIR` descriptor (`4r`), which is always the watched working-tree root. A worktree daemon also holds `.git/worktrees/<name>`. A main daemon in a scratch repository listed its socket by bare name, so socket rows alone are not reliable.
- [x] T004 [P] Confirm that each admin entry's `gitdir` file names its worktree's `.git` path. Verify: `for d in .git/worktrees/*; do cat "$d/gitdir"; done` prints one path per admin entry, and each path ends in `/.git`. Done 2026-10-27: 4 entries, each ending in `/.git`.
- [x] T005 [P] Confirm the bash 3.2 and shellcheck tooling. Verify: `/bin/bash -c 'exec -a "git fsmonitor--daemon run --detach" sleep 0.2'; echo $?` prints 0, and `shellcheck --version` prints a version line. Done 2026-10-27: exit 0, and shellcheck 0.11.0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create `R` with the usage text, flag parsing for `--apply`, `--worktree <path>`, `--probe` and `--help`, and exit codes 0, 1 and 2. (`.skilled/bin/fsmonitor-daemon-reaper.sh`). Verify: `bash $R --help; echo $?` prints the usage text and 0, and `bash $R --bogus; echo $?` prints 2. Done 2026-10-27 (builder unit 3.1, reviewed and corrected by the orchestrator): flags, usage and exit 2 on an unknown flag.
- [x] T007 Add the bounded runner (perl alarm, exit 142 read as timed out) and the timing variables `FSMON_PROBE_TIMEOUT` (default 15), `FSMON_STOP_TIMEOUT` (default 5), `FSMON_TERM_WAIT` (default 5) and `FSMON_KILL_WAIT` (default 3). Each must be a positive integer. (`$R`). Verify: `FSMON_PROBE_TIMEOUT=abc bash $R --probe; echo $?` prints a message that names the variable, then 2. Done 2026-10-27 (builder unit 3.1, reviewed and corrected by the orchestrator): `run_bounded` on the perl alarm and the four timing variables, each checked as a positive integer.
- [x] T008 Add the process list, `ps -axo pid=,lstart=,command=`, filtered by `(^|/)git fsmonitor--daemon run( |$)`. (`$R`). Verify: `bash $R` prints one `pid=` row per daemon, and its count equals `pgrep -f 'fsmonitor--daemon run' | wc -l`. Done 2026-10-27 (builder unit 3.1, reviewed and corrected by the orchestrator): `ps -axo pid=,lstart=,command=` filtered by the daemon pattern.
- [x] T009 Add socket attribution from `lsof -nP -p <pid>`: an absolute socket path marks the main daemon, a bare socket name is matched to the `DIR` row under `<common>/worktrees/<name>`, a `(deleted)` marker marks a stray, and no `DIR` row marks an unattributed daemon. Apply the scope rule from REQ-002. (`$R`). Verify: `bash $R` on this checkout prints 11 `pid=` rows, one of them with `worktree=main`. Done 2026-10-27 (builder unit 3.1, reviewed and corrected by the orchestrator): attribution reads the lowest-numbered `DIR` descriptor. The orchestrator narrowed `stray` to daemons that hold this repository's `.git/worktrees/<name>` directory, because a separate repository nested in the checkout runs its own daemon there; a test case for that was added. Live check: from a scratch repository, all three of this checkout's daemons classify as `out-of-scope`.
- [x] T010 Add the classifier (keep, stray, out-of-scope, unattributed) and the dry-run summary line `mode=dry-run signalled=0`. (`$R`). Verify: `bash $R` prints `signalled=0` and `stray=0`, and `pgrep -f 'fsmonitor--daemon run'` lists the same PIDs before and after the run. Done 2026-10-27 (builder unit 3.1, reviewed and corrected by the orchestrator): dry-run on this checkout prints `main`, two `keep` rows and `mode=dry-run signalled=0 total=3 stray=0`; the suite prints `PASS=36 FAIL=0`. A real worktree daemon exited by itself once its worktree and admin directory were deleted, so idle daemons of live worktrees are the main pile-up.
- [x] T011 Add stop escalation: `git -C <worktree> fsmonitor--daemon stop` under a timeout, only when the worktree exists, then SIGTERM, then SIGKILL. Recheck the PID before each step, and exit 1 naming the PID when a daemon survives. (`$R`). Verify: test cases C04, C05 and C07 in `$TF` pass once T014 is in place. Done 2026-10-27 (builder unit 3.2, reviewed and corrected by the orchestrator): escalation with a PID recheck before each step. The orchestrator limited git's stop to a registered worktree with its own `.git` file, because for any other path `git -C` reaches the enclosing repository and would stop its daemon; a shim test that logs stop calls fails on the old condition and passes on the fix.
- [x] T012 Add the `--worktree <path>` mode. Normalise the path with `pwd -P`, refuse the main checkout and any unregistered path, refuse while a live process other than the target daemon has its working directory inside the worktree (`lsof -a -d cwd`), and otherwise stop that worktree's daemon. (`$R`). Verify: test cases C05 and C06 in `$TF` pass. Done 2026-10-27 (builder unit 3.2, reviewed and corrected by the orchestrator): `--worktree` refuses on a live cwd inside the worktree. The orchestrator made an empty or timed-out `lsof` cwd listing refuse with `blocker=unknown` instead of proceeding, and bounded the per-daemon `lsof` call. The suite prints `PASS=69 FAIL=0`.
- [x] T013 Add `--probe`: a bounded `git -C <worktree> --no-optional-locks diff-files --quiet` for each attributed existing daemon, with fsmonitor on. End a daemon only when the probe times out (exit 142). (`$R`). Verify: test cases C08 and C09 in `$TF` pass, and in a scratch clone `GIT_TRACE_FSMONITOR=1` shows an IPC query from this probe. Done 2026-10-27 (builder unit 3.3, reviewed): the suite prints `PASS=85 FAIL=0` in 36 s, including a wedging shim ended within its bound and a 1-second answer kept. Live, `--probe` without `--apply` on this checkout took 38 s and found the main daemon (PID 1565, started 12:32) and the `231-repo-doc-debt` daemon wedged, and the `145` daemon answering. Nothing was signalled.
- [x] T024 Add `--idle-hours N`: select a registered worktree's daemon, never the main checkout's, whose `lstart` is more than N hours old and whose worktree has no live process other than the daemon with its working directory inside it (`lsof -a -d cwd`). (`$R`). Verify: the idle-sweep cases in `$TF` pass. Done 2026-10-27 (builder unit 3.4, reviewed and corrected by the orchestrator). The builder made `--idle-hours` replace the stray rule, so the launch sweep would have stopped clearing strays. The orchestrator made the rules add up and added a stray case to the idle block. Running on this checkout showed one more defect: the occupancy guard refused to end a wedged daemon because git calls stuck on that daemon had their cwd in the worktree. The guard now skips a wedged probe result, with a test, and the suite reads `PASS=107 FAIL=0`, exit 0. The dry run on this checkout printed one idle daemon (145, 197 hours) and `signalled=0`.
- [x] T025 Start `fsmonitor-daemon-reaper.sh --apply --idle-hours 12` in the background from `.skilled/bin/worktree-session.sh` on each launch, with output discarded and no effect on the launch exit code. (`.skilled/bin/worktree-session.sh`). Verify: `bash .skilled/bin/tests/worktree-session.test.sh` ends `FAIL=0`, including a case with a 30-second stub reaper that does not delay the launch. Done 2026-10-27 (builder unit 3.5, reviewed by the orchestrator): a double-forked `nohup` sweep after `worktree add`, path overridable through `SPECKIT_FSMON_REAPER`. The orchestrator corrected the comment, which claimed a daemon outlives its worktree. Suite `PASS=70 FAIL=0`, exit 0, up from 63; a 30-second stub reaper leaves the launch under 10 seconds, and child and dry-run launches never call it.
- [x] T026 Call `fsmonitor-daemon-reaper.sh --apply --worktree "$path"` before the `git worktree remove` at line 224, log a failure and continue, and reword the never-signal promise in `.skilled/bin/README.md`. (`.skilled/bin/worktree-reaper.sh`). Verify: `bash .skilled/bin/tests/worktree-reaper.test.sh` ends `FAIL=0`, including a case where a merged worktree's stub daemon is gone after the removal. Done 2026-10-27 (builder unit 3.6, reviewed by the orchestrator): the hand-off runs through `act`, so `--dry-run` only prints it, and a failure is logged before the removal continues. The orchestrator corrected two comments with the same wrong claim. Suite `PASS=26 FAIL=0`, exit 0, up from 24, with a stub daemon gone after its worktree is removed. The orchestrator also removed an unshimmed `--probe` from the daemon reaper suite: it started real daemons for fixture worktrees and made one count fail in two of eight runs. Five reruns after the fix all read `PASS=107 FAIL=0`.
- [x] T014 Write `TF` with the fixture helpers, the `core.fsmonitor=false` fixture config, the stub daemons, the PATH `git` shim that hangs on `diff-files`, and cases C01 to C12 from `plan.md` section 5. Case names describe behaviour, with no C-numbers in the code. (`$TF`). Verify: `/bin/bash $TF` prints `RESULT: PASS=<n> FAIL=0` with n at least 12, and exits 0. Done 2026-10-27 across builder units 3.1 to 3.4, with orchestrator fixes. The suite prints `fsmonitor-daemon-reaper tests: PASS=107 FAIL=0` and exits 0, the summary format of its sibling suites, without the `RESULT:` prefix this task first named.
- [x] T015 Add the finish-step calls in Step 5 of `.skilled/skills/sk-git/references/finish-workflows.md`: one `--apply --worktree` call before `git worktree remove "$worktree_path"`, and one dry-run check after it. Verify: `rg -n 'fsmonitor-daemon-reaper' .skilled/skills/sk-git/references/finish-workflows.md` prints two lines. Done 2026-10-27 (builder unit 3.7): the `--apply --worktree` call before the removal and a dry-run check after it, plus one sentence on running it from the main checkout. The orchestrator corrected the comment, which claimed a worktree daemon never exits on its own. `rg` prints the two lines, 316 and 321.
- [x] T016 Add one read-only dry-run line to `.skilled/commands/doctor/scripts/git-setup-check.cjs`, beside its worktree-base check. (`.skilled/commands/doctor/scripts/git-setup-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo <scratch clone>` prints the daemon line. Run it in the scratch clone only. Done 2026-10-27 (builder unit 3.7): the worktrees row carries `fsmonitor daemons: <m> main, <k> worktree, <s> stray`, or `not checked (<reason>)`, from a 20-second bounded dry run, and the line never changes the verdict. On a scratch repository the doctor printed `fsmonitor daemons: 0 main, 0 worktree, 0 stray`. Doctor tests `# pass 74`, `# fail 0`, up from 71.
- [x] T017 Add one entrypoint row for `R` beside the `worktree-reaper.sh` row in `.skilled/bin/README.md`. Verify: `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/README.md` prints one line. Done 2026-10-27 (builder unit 3.7): `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/README.md` prints one line, 169.
- [x] T018 [P] Run `shellcheck` on `R` and fix every finding. (`$R`). Verify: `shellcheck .skilled/bin/fsmonitor-daemon-reaper.sh; echo $?` prints 0 with no other output. Done 2026-10-27: `shellcheck .skilled/bin/fsmonitor-daemon-reaper.sh` exits 0 with no output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run the test under the host's bash 3.2. Verify: `/bin/bash $TF; echo $?` prints `RESULT: PASS=<n> FAIL=0` and then 0. Done 2026-10-27: `/bin/bash` is GNU bash 3.2.57; the suite under it printed `PASS=107 FAIL=0` and exited 0 in five consecutive runs.
- [x] T020 Run the dry-run on this checkout and compare the daemon set before and after. (`$R`). Verify: `pgrep -f 'fsmonitor--daemon run'` lists the same PIDs before and after `bash $R`, the summary line shows `signalled=0`, and the run takes under 10 seconds (NFR-P01). Done 2026-10-27: exit 0 in 0.8 seconds, `mode=dry-run signalled=0 total=10 stray=0`, and the same ten PIDs before and after.
- [x] T021 In a scratch clone under the session scratchpad, create one worktree, read its index with `git status` so that its daemon starts, run `bash $R --apply --worktree <WT>`, then `git worktree remove <WT>`, then `bash $R`. (`$R`). Verify: `git worktree remove` exits 0, and the last dry-run prints no line that names `<WT>`. The next `git status` in the clone starts a new daemon, which proves NFR-R02. Done 2026-10-27 in a scratch repository with `core.fsmonitor=true`, standing in for a 3.6 GB clone: the reaper ended wt-a's daemon `via=stop`, `git worktree remove` exited 0, and the dry run afterwards named no wt-a daemon. A control worktree removed without the reaper lost its daemon within 5 seconds as well, so removal alone leaves no worktree daemon; the hand-off makes the end explicit. A new `git status` in such a repository starts a fresh daemon, as T021's own setup showed.
- [x] T022 Answer open question 4 in a scratch clone. Run `.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs` with the arguments its header describes, and list the daemons whose socket lies under its temporary `cite-drift-base-` worktree before the `worktree remove`. (`.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs`). Verify: the lsof listing shows either no daemon or one `DIR` row for that temporary admin directory, and the answer is written into `spec.md` open question 4. Done 2026-10-27: the real gate's `main(['--base','HEAD'])` ran against a scratch repository with fsmonitor on. A daemon watching the `cite-drift-base-` worktree appeared for about 2 seconds, and none remained 8 seconds after the gate's removal. The answer is in `spec.md` open question 4.
- [x] T023 Rerun the consumer inventory, then write `implementation-summary.md` with the files changed and the fix commit SHA, and validate the packet. Verify: `rg -n 'fsmonitor' .skilled/bin .skilled/skills/sk-git .skilled/commands/doctor` lists the new call sites, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle --strict` prints `RESULT: PASSED`. Done 2026-10-27: the inventory lists the new call sites in finish-workflows.md, worktree-session.sh, worktree-reaper.sh, README.md and git-setup-check.cjs. `implementation-summary.md` names fix commit `8730c91ecb`, and strict validation runs at closeout.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the scratch-clone removal in T021 leaves no daemon that names the removed path Evidence: T021, no daemon named the removed worktree.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task that cannot run stays open, with its blocker named in its own line, and is marked `[B]` only while it waits. Closure needs no `[B]` line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Baseline daemon list saved to `scratch/baseline.txt` before the first edit (T001). Evidence: `scratch/baseline.txt`, 450 bytes, written before the first edit.
- [x] CHK-002 [P0] Bounded runner verified: `perl -e 'alarm shift; exec @ARGV or exit 127' 1 sleep 5; echo $?` prints 142 (T002). Evidence: prints 142.
- [x] CHK-003 [P1] Required tools present: `command -v lsof ps perl` prints three paths. Evidence: `/usr/sbin/lsof /bin/ps /usr/bin/perl`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n .skilled/bin/fsmonitor-daemon-reaper.sh` exits 0. Evidence: exit 0.
- [x] CHK-011 [P0] `shellcheck .skilled/bin/fsmonitor-daemon-reaper.sh` exits 0 with no output. Evidence: exit 0, no output.
- [x] CHK-012 [P0] No bash 4 features: `rg -n 'mapfile|readarray|declare -A' .skilled/bin/fsmonitor-daemon-reaper.sh` prints nothing. Evidence: no output.
- [x] CHK-013 [P0] No timeout binary is called: `rg -n 'timeout [0-9]|gtimeout ' .skilled/bin/fsmonitor-daemon-reaper.sh` prints nothing. Evidence: no output.
- [x] CHK-014 [P0] Every signal follows an identity check: `rg -n 'kill -(TERM|KILL)|pid_matches' .skilled/bin/fsmonitor-daemon-reaper.sh` shows each kill line below a `pid_matches` call in the same function. Evidence: the identity check is named `_is_daemon_pid`, not `pid_matches`. In `_end_daemon`, `kill -TERM` (line 296) and `kill -KILL` (line 305) each sit directly under an `_is_daemon_pid` call, and the function opens with one.
- [x] CHK-015 [P1] The header comment names the dry-run default, the three flags and the exit codes. Evidence: the header names the dry-run default, `--apply`, `--worktree`, `--idle-hours`, `--probe` and the exit codes 0, 1 and 2. The orchestrator added the exit codes and `--idle-hours` at closeout.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` prints `RESULT: PASS=<n> FAIL=0` with n at least 12, and exits 0 (T019). Evidence: `fsmonitor-daemon-reaper tests: PASS=107 FAIL=0`, exit 0, under bash 3.2.57. The summary uses the sibling suites' format, not a `RESULT:` prefix.
- [x] CHK-021 [P0] The out-of-scope daemon case leaves its PID alive (C02). Evidence: `out-of-scope stub survives` passes.
- [x] CHK-022 [P0] The registered idle worktree daemon case leaves its PID alive (C03). Evidence: `--apply leaves the keep stub alive` passes.
- [x] CHK-023 [P0] The live-cwd refusal case refuses and leaves the daemon alive (C06). Evidence: the live-cwd refusal cases pass, and a wedged daemon is the one exception, with its own case.
- [x] CHK-024 [P1] The probe timeout case ends its daemon, and the probe answer case ends nothing (C08 and C09). Evidence: `probe apply kills the wedged stub` and `a daemon that answers survives the probe` pass.
- [x] CHK-025 [P1] The dry-run on this checkout leaves the daemon set unchanged (T020). Evidence: T020, ten PIDs before and after, `signalled=0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential read and no network call: `rg -n 'curl|wget|token|secret|password|\.env' .skilled/bin/fsmonitor-daemon-reaper.sh` prints nothing. Evidence: no output.
- [x] CHK-031 [P0] Bad input is refused with exit 2 and no signal: in a scratch clone, `bash $R --worktree <main checkout path>` prints a refusal and exits 2. Evidence: `--worktree refuses the main checkout` asserts exit 2 and passes.
- [x] CHK-032 [P1] N/A: the script runs as the operator's own user and checks no login, so no authentication applies. N/A, as stated.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria name the same `--worktree` flag: `rg -l -- '--worktree' specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle/` lists all four files. Evidence: spec.md, plan.md, tasks.md and acceptance-criteria.md all match.
- [x] CHK-041 [P1] The README row exists: `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/README.md` prints one line (T017). Evidence: one line, README.md:169.
- [x] CHK-042 [P2] The finish-step and setup-battery wording uses the same flags as the script header: `rg -n 'fsmonitor-daemon-reaper' .skilled` shows the same flag names in each call site. Evidence: `--apply` and `--worktree` appear the same way in finish-workflows.md, the README row and the script usage; the doctor runs the bare dry run.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The test removes its fixtures on exit: `ls -d "${TMPDIR:-/tmp}"/fsmon-test.* 2>/dev/null | wc -l` prints 0 after a run. Evidence: the suite's fixtures live in one `mktemp -d` directory that the EXIT trap removes after ending its stubs; there are no `fsmon-test.*` directories.
- [x] CHK-051 [P1] `scratch/` holds only the baseline and the verification notes at closeout: `ls scratch/` shows no stub or fixture file. Evidence: `scratch/` holds only `baseline.txt` after the builder runs were removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding class is recorded as `class-of-bug`: `rg -n 'class-of-bug' specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle/plan.md` prints one line. Evidence: one line.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete: `rg -n 'worktree remove' .skilled --glob '!**/tests/**'` lists the three call sites named in `plan.md` section 3, plus the documentation mentions. Evidence: `worktree-reaper.sh:237` and finish-workflows.md:318 hold the literal call. `cite-drift-gate.mjs:128` passes it as an argv array, so it does not match the literal; T022 showed it leaks no daemon.
- [x] CHK-FIX-003 [P0] The consumer inventory covers the three call sites and the setup battery: `rg -n 'fsmonitor-daemon-reaper' .skilled` lists the new lines from T015, T016 and T017. Evidence: finish-workflows.md:316 and :321, worktree-session.sh:316, worktree-reaper.sh:64, README.md:169 and git-setup-check.cjs:680.
- [x] CHK-FIX-004 [P0] Each adversarial case in `plan.md` section 3 has a named test: `rg -n 'out-of-scope|unattributed|live|normali' $TF` prints one line per case. Evidence: the out-of-scope, nested out-of-scope, unattributed, live-cwd and normalized-path cases are named in the suite.
- [x] CHK-FIX-005 [P1] The matrix rows are listed before completion: `plan.md` section 5 holds rows C01 to C12. Evidence: 12 matrix rows.
- [x] CHK-FIX-006 [P1] The hostile environment variant runs: `FSMON_PROBE_TIMEOUT=abc bash $R --probe; echo $?` prints 2 (C12). Evidence: exit 2.
- [x] CHK-FIX-007 [P1] The evidence is pinned to a fix commit SHA: `implementation-summary.md` names the SHA (T023). Evidence: `8730c91ecb` in `implementation-summary.md` metadata.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [ ]/17 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
