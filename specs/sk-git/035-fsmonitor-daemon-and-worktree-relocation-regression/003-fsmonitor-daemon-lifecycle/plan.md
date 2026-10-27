---
title: "Implementation Plan: Phase 3: fsmonitor-daemon-lifecycle"
description: "Plan for a bounded, dry-run-first script that attributes each fsmonitor daemon by socket, ends strays and wedged daemons, and runs before each worktree removal."
trigger_phrases:
  - "fsmonitor daemon lifecycle plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: fsmonitor-daemon-lifecycle

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, written for macOS `/bin/bash` 3.2.57 (no associative arrays, no `mapfile`) |
| **Framework** | None. The script calls `ps`, `lsof`, `perl` and `git` only |
| **Storage** | None. Each run reads the process table and the worktree registry, and keeps no state |
| **Testing** | A bash test file in `.skilled/bin/tests/`, in the style of `worktree-reaper.test.sh`: a fixture repository, `expect` helpers and PASS and FAIL counters |

### Overview
The change adds one script, `.skilled/bin/fsmonitor-daemon-reaper.sh`. It stays apart from `worktree-reaper.sh`, so that script's never-signal promise holds. The script attributes each daemon to a worktree through the socket it holds, ends a stray or the daemon of a worktree named for removal, and ends a daemon only when a bounded probe times out. A stub-process test and a dry-run on this checkout show the behaviour.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Open questions 1 to 4 in `spec.md` answered by the operator

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` prints `RESULT: PASS=<n> FAIL=0` with n at least 12, and exits 0
- [ ] `shellcheck .skilled/bin/fsmonitor-daemon-reaper.sh` exits 0 with no output
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single bounded script with three triggers. The one component that changes is `.skilled/bin/fsmonitor-daemon-reaper.sh`, which is new.

### Key Components
- **Process list**: `ps -axo pid=,lstart=,command=`, keeping rows whose command matches `(^|/)git fsmonitor--daemon run( |$)`. Each row gives a daemon PID and its start time.
- **Socket attribution**: `lsof -nP -p <pid>` for each daemon. The main daemon shows its socket by absolute path, `<common>/fsmonitor--daemon.ipc`. A worktree daemon shows its socket by basename only, and its admin directory appears on a `DIR` row named `<common>/worktrees/<name>`. A `(deleted)` marker on that row marks a stray.
- **Registry**: `git worktree list --porcelain` for the live entries, and `<common>/worktrees/<name>/gitdir` for each admin entry's worktree path. Task T004 confirms the `gitdir` format.
- **Classifier**: each daemon becomes `keep`, `stray`, `out-of-scope`, `unattributed`, or `wedged` after a probe timeout.
- **Stopper**: `git -C <worktree> fsmonitor--daemon stop` under a timeout, but only when the worktree still exists. Then SIGTERM, then SIGKILL. The PID identity recheck runs before each step.
- **Probe**: `git -C <worktree> --no-optional-locks diff-files --quiet`, with fsmonitor on, under a timeout. Only an existing attributed daemon is probed.
- **Bounded runner**: `perl -e 'alarm shift; exec @ARGV or exit 127' <seconds> <command...>`. Exit 142 means the alarm fired, which is SIGALRM (128 + 14). The script reads 142 as timed out.

### Design Choices
- **Dry-run default.** A tool that ends processes shows its plan first. Only `--apply` signals.
- **Separate script.** `worktree-reaper.sh` never signals a process itself. It hands a worktree's daemon to the new script before removing the worktree, so all signalling lives in one audited place.
- **Scope by common directory.** A daemon whose socket lies outside this repository's common directory is out of reach, so one repository's run cannot end another repository's daemons.
- **Stop only when the worktree exists.** `stop` finds the socket through the worktree's admin directory, so a stray with no admin directory goes straight to SIGTERM.
- **Probe timeout of 15 seconds.** The research saw a cold daemon answer in about 10 seconds. A 10 second bound would fire on healthy cold daemons. This is open question 3.
- **Probe only existing daemons.** A probe on a worktree with no daemon would start one, so the probe runs only against daemons the process list found.
- **Live-cwd refusal.** `--worktree` refuses while a live process has its working directory inside the worktree. The rule follows `worktree-reaper.sh`, which refuses to remove a worktree that a live process is using.

### Data Flow
The script reads the process list, then reads each daemon's open files. It maps each daemon to a worktree or to the main checkout, and then classifies it. With `--probe`, it runs the bounded probe on each attributed daemon that exists. Under `--apply`, it ends the daemons that the rules name. Each step re-reads the PID before it sends a signal. Each output line names the PID, the path, the class and the action. The summary line reports the counts and the number of signals sent.

### Fix Addendum: Affected Surfaces
Finding class: `class-of-bug`. Every removal path leaves its daemon running, so the fix covers the class and not one call site.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/worktree-reaper.sh`, line 224 | Removes merged wrapper worktrees, and promises it never signals a process | Update: hand the worktree's daemon to the new script before line 224 (REQ-013) | `rg -n 'worktree remove' .skilled/bin/worktree-reaper.sh` lists line 224 |
| `.skilled/skills/sk-git/references/finish-workflows.md`, Step 5, line 315 | The documented finish removal that agents run | Update: one call before and one dry-run check after | `rg -n 'fsmonitor-daemon-reaper' .skilled/skills/sk-git/references/finish-workflows.md` prints two lines |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs`, line 128 | Removes its own temporary base worktree in a `finally` block | Unchanged unless open question 4 finds a daemon. Then the stop goes before line 128. | Task T022 in a scratch clone |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | The sk-git setup battery. It is read-only and already has a worktree-base check | Update: one read-only dry-run line | Task T016 in a scratch clone |
| `.skilled/bin/README.md`, entrypoint table at line 168 | Documents `worktree-reaper.sh` and its never-signal promise | Update: one new row | `rg -n 'fsmonitor-daemon-reaper' .skilled/bin/README.md` prints one line |
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | New | Create | The test file |

**Same-class producers.** Every `git worktree remove` in repository code, run on this checkout with the test and vendored paths excluded: `.skilled/bin/worktree-reaper.sh:224`, `.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs:128`, and the documented step at `.skilled/skills/sk-git/references/finish-workflows.md:315`. Test-only removals under `.skilled/scripts/git-hooks/tests/` are excluded.

**Consumers.** `rg -n 'fsmonitor' .skilled/bin .skilled/skills/sk-git .skilled/commands/doctor` lists the files that mention daemons. Task T023 reruns it at close.

**Matrix rows.** The rows are the twelve cases in section 5, C01 to C12. They cover six daemon states (main, healthy attributed, wedged, stray, unattributed, out-of-scope), four trigger paths (`--worktree`, dry-run, `--probe`, by hand), and two modes (dry-run and apply).

**Algorithm invariant.** A process receives a signal only when all four hold: its PID still runs `fsmonitor--daemon run` at the moment of the signal; its socket attribution lies under this repository's common directory; one trigger names it (stray, the `--worktree` target, or a probe timeout); and `--apply` was given.

**Adversarial cases.**
- A socket under another repository's common directory (C02).
- A PID reused by another process between the list and the signal (checked by the identity recheck, CHK-014).
- A live process whose working directory is inside the target worktree (C06). The target daemon itself does not count as a live process.
- A `--worktree` path given with a trailing slash, a symlinked prefix, or an unregistered path. The path is normalised with `pwd -P` and matched against the registry, and the main checkout is refused.
- A daemon with no admin `DIR` row (C11).
- A probe against a daemon that exits during the probe. The run reports it and does not act on it.
- `FSMON_PROBE_TIMEOUT` set to a value that is not a positive integer (C12).

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: record the baseline daemon list in `scratch/baseline.txt`, confirm the bounded runner and the lsof row formats, and confirm the bash 3.2 constraints.
- **Implementation**: write the script, its test, and the three call-site edits, in the order `tasks.md` lists.
- **Verification**: run the test under `/bin/bash`, run the dry-run on this checkout and compare the daemon count, and run one removal in a scratch clone.

`tasks.md` owns the ordered work and the task states.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The test is `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`. Its command is `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, and it prints `RESULT: PASS=<n> FAIL=0`.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Attribution, classification and the bounded runner, checked through the CLI output and the probe-timeout cases | bash |
| Integration | Fixture repositories with `core.fsmonitor=false` set locally, stub daemons, and a PATH `git` shim that hangs on `diff-files` for the probe cases | bash, `/bin/bash` 3.2 |
| Manual | Dry-run on this checkout before and after, and one worktree removal in a scratch clone | shell |

**Stub daemons.** A stub is a perl process whose argv[0] is `git fsmonitor--daemon run --detach --ipc-threads=8`, set with `exec -a`. It holds a `DIR` row open on its admin directory and a socket-named file open, the same two rows the real daemon shows. Stubs start with their working directory outside every fixture worktree, so a stub never trips the live-cwd refusal. The test records each stub PID and kills only those PIDs at exit, after the identity recheck.

**Fixture safety.** Each fixture repository sets `core.fsmonitor=false` in its own config, so the test never starts a real daemon. The real daemons on the machine are outside every fixture's common directory, so they are out of scope by REQ-002 and the test never signals them.

**Test cases.** The names describe behaviour. The C-numbers below are plan-level labels and do not appear in the code.

| ID | Case | Expected result |
|----|------|-----------------|
| C01 | Main-style and admin-style daemons are attributed | Dry-run prints `worktree=main` and the admin worktree path |
| C02 | Out-of-scope daemon, socket under a second repository | `--apply` leaves its PID alive |
| C03 | Registered idle worktree daemon | `--apply` with no other flag leaves it alive |
| C04 | Stray whose admin directory was deleted | `--apply` ends it and the run exits 0 |
| C05 | `--worktree` target | `--apply --worktree` ends it, then `git worktree remove` succeeds and no daemon names the path |
| C06 | Live process inside the target worktree | Prints a refusal, exits 0, and the daemon stays alive |
| C07 | Daemon that ignores SIGTERM | The PID is gone after SIGKILL, and the run exits 0 |
| C08 | Probe git call hangs past the probe timeout | `--probe --apply` ends the daemon within the bounds |
| C09 | Probe git call answers in 1 second, timeout 3 seconds | The daemon stays alive |
| C10 | Stray plus `--probe` without `--apply` | Prints `mode=dry-run signalled=0`, and the PID stays alive |
| C11 | Daemon with no admin `DIR` row | Reported as `unattributed`, and the PID stays alive |
| C12 | Hostile input: `FSMON_PROBE_TIMEOUT=abc`, the main checkout as `--worktree`, an unknown flag | Each exits 2 with a message and signals nothing |

**Matrix rows.** Rows C01 to C12 cover the daemon states, triggers and modes listed in section 3.

**Verified stub shape.** On this host, a stub started with `exec -a` showed `cwd DIR` for the process working directory, a `DIR` row for the admin directory, and a `REG` row with the absolute socket path. The real main daemon shows an absolute `unix` socket row. The real worktree daemon shows a bare `unix` socket name plus its admin `DIR` row. The parser accepts both shapes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/bin/bash` 3.2.57 | System | Green. Verified on this host. | The script must stay within bash 3.2 syntax |
| `ps` at `/bin/ps` | System | Green. Verified. | No process list, so the script exits 2 |
| `lsof` at `/usr/sbin/lsof` | System | Green. Verified. | No attribution, so the script exits 2 and signals nothing |
| `perl` at `/usr/bin/perl` | System | Green. Verified: exit 142 for a 1 second alarm, exit 0 for a call that finishes. | No bounded runner, so the script exits 2 |
| `git` 2.50.1 | External | Green. Verified with `git --version`. | No attribution or probe |
| `shellcheck` at `/opt/homebrew/bin/shellcheck` | External, optional | Green. Verified. | The lint gate is skipped and the skip is reported |
| `timeout` and `gtimeout` | System | Absent. Verified with `command -v`, neither found. The script does not use them. | None |
| Phase 002 (worktree relocation) | Internal | Not a blocker. The reaper reads the registry wherever the base sits. | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the reaper ends a daemon it should have kept, or a finish step fails after the reaper call.
- **Procedure**: delete the three call sites (the finish-step edit, the setup-battery line and the README row), or run `git revert` on the phase commit. The script keeps no state, so nothing else needs restoring. A daemon the reaper ended is started again by git on the next index read, and only its cache is lost.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator answers to open questions 1 to 4 in `spec.md` | Implementation |
| Implementation | Setup, and open questions 3 and 4 | Verification |
| Verification | Implementation | Phase close and `implementation-summary.md` |
<!-- /ANCHOR:phase-deps -->

---
