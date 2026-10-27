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

- [ ] T001 Record the baseline daemon list in `scratch/baseline.txt`. Verify: `wc -l < scratch/baseline.txt` prints the count that `pgrep -f 'fsmonitor--daemon run' | wc -l` prints when run right after it.
- [ ] T002 Confirm the bounded runner on the design's own terms (no repo file, the perl alarm). Verify: `perl -e 'alarm shift; exec @ARGV or exit 127' 1 sleep 5; echo $?` prints 142, and `perl -e 'alarm shift; exec @ARGV or exit 127' 3 sleep 0.2; echo $?` prints 0.
- [ ] T003 [P] Confirm the socket rows that attribution reads, from a read-only `lsof -nP -p <pid>` of one main daemon and one worktree daemon. Verify: the main daemon shows an absolute `.git/fsmonitor--daemon.ipc` row, and a worktree daemon shows a bare `fsmonitor--daemon.ipc` row with a `DIR` row for `.git/worktrees/<name>`.
- [ ] T004 [P] Confirm that each admin entry's `gitdir` file names its worktree's `.git` path. Verify: `for d in .git/worktrees/*; do cat "$d/gitdir"; done` prints one path per admin entry, and each path ends in `/.git`.
- [ ] T005 [P] Confirm the bash 3.2 and shellcheck tooling. Verify: `/bin/bash -c 'exec -a "git fsmonitor--daemon run --detach" sleep 0.2'; echo $?` prints 0, and `shellcheck --version` prints a version line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Create `R` with the usage text, flag parsing for `--apply`, `--worktree <path>`, `--probe` and `--help`, and exit codes 0, 1 and 2. (`.skilled/bin/fsmonitor-daemon-reaper.sh`). Verify: `bash $R --help; echo $?` prints the usage text and 0, and `bash $R --bogus; echo $?` prints 2.
- [ ] T007 Add the bounded runner (perl alarm, exit 142 read as timed out) and the timing variables `FSMON_PROBE_TIMEOUT` (default 15), `FSMON_STOP_TIMEOUT` (default 5), `FSMON_TERM_WAIT` (default 5) and `FSMON_KILL_WAIT` (default 3). Each must be a positive integer. (`$R`). Verify: `FSMON_PROBE_TIMEOUT=abc bash $R --probe; echo $?` prints a message that names the variable, then 2.
- [ ] T008 Add the process list, `ps -axo pid=,lstart=,command=`, filtered by `(^|/)git fsmonitor--daemon run( |$)`. (`$R`). Verify: `bash $R` prints one `pid=` row per daemon, and its count equals `pgrep -f 'fsmonitor--daemon run' | wc -l`.
- [ ] T009 Add socket attribution from `lsof -nP -p <pid>`: an absolute socket path marks the main daemon, a bare socket name is matched to the `DIR` row under `<common>/worktrees/<name>`, a `(deleted)` marker marks a stray, and no `DIR` row marks an unattributed daemon. Apply the scope rule from REQ-002. (`$R`). Verify: `bash $R` on this checkout prints 11 `pid=` rows, one of them with `worktree=main`.
- [ ] T010 Add the classifier (keep, stray, out-of-scope, unattributed) and the dry-run summary line `mode=dry-run signalled=0`. (`$R`). Verify: `bash $R` prints `signalled=0` and `stray=0`, and `pgrep -f 'fsmonitor--daemon run'` lists the same PIDs before and after the run.
- [ ] T011 Add stop escalation: `git -C <worktree> fsmonitor--daemon stop` under a timeout, only when the worktree exists, then SIGTERM, then SIGKILL. Recheck the PID before each step, and exit 1 naming the PID when a daemon survives. (`$R`). Verify: test cases C04, C05 and C07 in `$TF` pass once T014 is in place.
- [ ] T012 Add the `--worktree <path>` mode. Normalise the path with `pwd -P`, refuse the main checkout and any unregistered path, refuse while a live process other than the target daemon has its working directory inside the worktree (`lsof -a -d cwd`), and otherwise stop that worktree's daemon. (`$R`). Verify: test cases C05 and C06 in `$TF` pass.
- [ ] T013 Add `--probe`: a bounded `git -C <worktree> --no-optional-locks diff-files --quiet` for each attributed existing daemon, with fsmonitor on. End a daemon only when the probe times out (exit 142). (`$R`). Verify: test cases C08 and C09 in `$TF` pass, and in a scratch clone `GIT_TRACE_FSMONITOR=1` shows an IPC query from this probe.
- [ ] T024 Add `--idle-hours N`: select a registered worktree's daemon, never the main checkout's, whose `lstart` is more than N hours old and whose worktree has no live process other than the daemon with its working directory inside it (`lsof -a -d cwd`). (`$R`). Verify: the idle-sweep cases in `$TF` pass.
- [ ] T025 Start `fsmonitor-daemon-reaper.sh --apply --idle-hours 12` in the background from `.skilled/bin/worktree-session.sh` on each launch, with output discarded and no effect on the launch exit code. (`.skilled/bin/worktree-session.sh`). Verify: `bash .skilled/bin/tests/worktree-session.test.sh` ends `FAIL=0`, including a case with a 30-second stub reaper that does not delay the launch.
- [ ] T026 Call `fsmonitor-daemon-reaper.sh --apply --worktree "$path"` before the `git worktree remove` at line 224, log a failure and continue, and reword the never-signal promise in `.skilled/bin/README.md`. (`.skilled/bin/worktree-reaper.sh`). Verify: `bash .skilled/bin/tests/worktree-reaper.test.sh` ends `FAIL=0`, including a case where a merged worktree's stub daemon is gone after the removal.
- [ ] T014 Write `TF` with the fixture helpers, the `core.fsmonitor=false` fixture config, the stub daemons, the PATH `git` shim that hangs on `diff-files`, and cases C01 to C12 from `plan.md` section 5. Case names describe behaviour, with no C-numbers in the code. (`$TF`). Verify: `/bin/bash $TF` prints `RESULT: PASS=<n> FAIL=0` with n at least 12, and exits 0.
- [ ] T015 Add the finish-step calls in Step 5 of `.skilled/skills/sk-git/references/finish-workflows.md`: one `--apply --worktree` call before `git worktree remove "$worktree_path"`, and one dry-run check after it. Verify: `rg -n 'fsmonitor-daemon-reaper' .skilled/skills/sk-git/references/finish-workflows.md` prints two lines.
- [ ] T016 Add one read-only dry-run line to `.skilled/commands/doctor/scripts/git-setup-check.cjs`, beside its worktree-base check. (`.skilled/commands/doctor/scripts/git-setup-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo <scratch clone>` prints the daemon line. Run it in the scratch clone only.
- [ ] T017 Add one entrypoint row for `R` beside the `worktree-reaper.sh` row in `.skilled/bin/README.md`. Verify: `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/README.md` prints one line.
- [ ] T018 [P] Run `shellcheck` on `R` and fix every finding. (`$R`). Verify: `shellcheck .skilled/bin/fsmonitor-daemon-reaper.sh; echo $?` prints 0 with no other output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run the test under the host's bash 3.2. Verify: `/bin/bash $TF; echo $?` prints `RESULT: PASS=<n> FAIL=0` and then 0.
- [ ] T020 Run the dry-run on this checkout and compare the daemon set before and after. (`$R`). Verify: `pgrep -f 'fsmonitor--daemon run'` lists the same PIDs before and after `bash $R`, the summary line shows `signalled=0`, and the run takes under 10 seconds (NFR-P01).
- [ ] T021 In a scratch clone under the session scratchpad, create one worktree, read its index with `git status` so that its daemon starts, run `bash $R --apply --worktree <WT>`, then `git worktree remove <WT>`, then `bash $R`. (`$R`). Verify: `git worktree remove` exits 0, and the last dry-run prints no line that names `<WT>`. The next `git status` in the clone starts a new daemon, which proves NFR-R02.
- [ ] T022 Answer open question 4 in a scratch clone. Run `.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs` with the arguments its header describes, and list the daemons whose socket lies under its temporary `cite-drift-base-` worktree before the `worktree remove`. (`.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs`). Verify: the lsof listing shows either no daemon or one `DIR` row for that temporary admin directory, and the answer is written into `spec.md` open question 4.
- [ ] T023 Rerun the consumer inventory, then write `implementation-summary.md` with the files changed and the fix commit SHA, and validate the packet. Verify: `rg -n 'fsmonitor' .skilled/bin .skilled/skills/sk-git .skilled/commands/doctor` lists the new call sites, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the scratch-clone removal in T021 leaves no daemon that names the removed path

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

- [ ] CHK-001 [P0] Baseline daemon list saved to `scratch/baseline.txt` before the first edit (T001).
- [ ] CHK-002 [P0] Bounded runner verified: `perl -e 'alarm shift; exec @ARGV or exit 127' 1 sleep 5; echo $?` prints 142 (T002).
- [ ] CHK-003 [P1] Required tools present: `command -v lsof ps perl` prints three paths.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n .skilled/bin/fsmonitor-daemon-reaper.sh` exits 0.
- [ ] CHK-011 [P0] `shellcheck .skilled/bin/fsmonitor-daemon-reaper.sh` exits 0 with no output.
- [ ] CHK-012 [P0] No bash 4 features: `rg -n 'mapfile|readarray|declare -A' .skilled/bin/fsmonitor-daemon-reaper.sh` prints nothing.
- [ ] CHK-013 [P0] No timeout binary is called: `rg -n 'timeout [0-9]|gtimeout ' .skilled/bin/fsmonitor-daemon-reaper.sh` prints nothing.
- [ ] CHK-014 [P0] Every signal follows an identity check: `rg -n 'kill -(TERM|KILL)|pid_matches' .skilled/bin/fsmonitor-daemon-reaper.sh` shows each kill line below a `pid_matches` call in the same function.
- [ ] CHK-015 [P1] The header comment names the dry-run default, the three flags and the exit codes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` prints `RESULT: PASS=<n> FAIL=0` with n at least 12, and exits 0 (T019).
- [ ] CHK-021 [P0] The out-of-scope daemon case leaves its PID alive (C02).
- [ ] CHK-022 [P0] The registered idle worktree daemon case leaves its PID alive (C03).
- [ ] CHK-023 [P0] The live-cwd refusal case refuses and leaves the daemon alive (C06).
- [ ] CHK-024 [P1] The probe timeout case ends its daemon, and the probe answer case ends nothing (C08 and C09).
- [ ] CHK-025 [P1] The dry-run on this checkout leaves the daemon set unchanged (T020).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential read and no network call: `rg -n 'curl|wget|token|secret|password|\.env' .skilled/bin/fsmonitor-daemon-reaper.sh` prints nothing.
- [ ] CHK-031 [P0] Bad input is refused with exit 2 and no signal: in a scratch clone, `bash $R --worktree <main checkout path>` prints a refusal and exits 2.
- [ ] CHK-032 [P1] N/A: the script runs as the operator's own user and checks no login, so no authentication applies.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria name the same `--worktree` flag: `rg -l -- '--worktree' specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle/` lists all four files.
- [ ] CHK-041 [P1] The README row exists: `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/README.md` prints one line (T017).
- [ ] CHK-042 [P2] The finish-step and setup-battery wording uses the same flags as the script header: `rg -n 'fsmonitor-daemon-reaper' .skilled` shows the same flag names in each call site.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The test removes its fixtures on exit: `ls -d "${TMPDIR:-/tmp}"/fsmon-test.* 2>/dev/null | wc -l` prints 0 after a run.
- [ ] CHK-051 [P1] `scratch/` holds only the baseline and the verification notes at closeout: `ls scratch/` shows no stub or fixture file.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is recorded as `class-of-bug`: `rg -n 'class-of-bug' specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle/plan.md` prints one line.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory is complete: `rg -n 'worktree remove' .skilled --glob '!**/tests/**'` lists the three call sites named in `plan.md` section 3, plus the documentation mentions.
- [ ] CHK-FIX-003 [P0] The consumer inventory covers the three call sites and the setup battery: `rg -n 'fsmonitor-daemon-reaper' .skilled` lists the new lines from T015, T016 and T017.
- [ ] CHK-FIX-004 [P0] Each adversarial case in `plan.md` section 3 has a named test: `rg -n 'out-of-scope|unattributed|live|normali' $TF` prints one line per case.
- [ ] CHK-FIX-005 [P1] The matrix rows are listed before completion: `plan.md` section 5 holds rows C01 to C12.
- [ ] CHK-FIX-006 [P1] The hostile environment variant runs: `FSMON_PROBE_TIMEOUT=abc bash $R --probe; echo $?` prints 2 (C12).
- [ ] CHK-FIX-007 [P1] The evidence is pinned to a fix commit SHA: `implementation-summary.md` names the SHA (T023).
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
