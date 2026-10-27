---
title: "Feature Specification: Phase 3: fsmonitor-daemon-lifecycle"
description: "Add a separate reaper that attributes each git fsmonitor daemon to its worktree by socket, ends strays and wedged daemons with bounded escalation, and runs before each worktree removal."
trigger_phrases:
  - "fsmonitor daemon lifecycle"
  - "phase 3 fsmonitor daemon lifecycle"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: fsmonitor-daemon-lifecycle

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-worktree-relocation-restore |
| **Successor** | 004-push-gate-git-timeout |
| **Handoff Criteria** | Removing a worktree leaves no fsmonitor daemon attributed to its path, and the dry-run lists no daemon for that path afterwards |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the fsmonitor daemon leak and worktree relocation regression specification. Its job is the packet goal: stop old fsmonitor daemons from running on.

**Scope Boundary**: One new script, its test, and three call-site edits. Worktree relocation (phase 002), the hook timeouts (phase 004) and any change to git itself stay out of this phase.

**Dependencies**:
- Phase 002 is not a blocker. The reaper reads the worktree registry wherever the base sits.
- Phase 004 does not depend on this phase.

**Deliverables**:
- `.skilled/bin/fsmonitor-daemon-reaper.sh`, dry-run by default, with `--apply`, `--worktree <path>` and `--probe`.
- `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, built from stub processes and scratch repositories.
- Call-site edits in the sk-git finish step, the sk-git setup battery and `.skilled/bin/README.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each git worktree that reads its index starts its own `git fsmonitor--daemon`, and macOS never retires one on its own. Nothing ends a daemon when its worktree goes away, so old daemons pile up, and a wedged daemon blocks every index-reading git call in its checkout. On 2026-10-27 eleven daemons were alive at once, and the oldest had run for 16 days.

### Purpose
Every daemon of a removed or wedged worktree ends within a bounded window, and no daemon outlives its worktree after a removal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Measured on this checkout at 10:13 UTC on 2026-10-27, which is 11:13 local time. Every command below is read-only. No command in this session signalled a process, and none read the git index. The main daemon that was alive at the start of the session (PID 5979) had exited by the second capture, and PID 89357 had started at 11:11 local. Git started it again on its own, so the daemon set churns while the count holds.

```text
$ pgrep -fl 'fsmonitor--daemon run' | wc -l
      11

$ ps -o pid,lstart,command -p "$(pgrep -f 'fsmonitor--daemon run' | tr '\n' ',' | sed 's/,$//')"
  PID STARTED                      COMMAND
 1157 Sun Oct 11 18:29:55 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
35266 Sat Oct 24 15:47:29 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
36974 Sun Oct 18 19:30:42 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
47838 Thu Oct 22 06:19:20 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
55634 Wed Oct 14 09:17:55 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
76538 Fri Oct 23 17:42:16 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
83785 Mon Oct 19 08:37:59 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
89357 Tue Oct 27 11:11:10 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
90965 Tue Oct 27 09:25:47 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
91756 Fri Oct 23 22:15:10 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8
95634 Tue Oct 27 08:56:30 2026     /Applications/Xcode.app/Contents/Developer/usr/libexec/git-core/git fsmonitor--daemon run --detach --ipc-threads=8

$ for p in $(pgrep -f 'fsmonitor--daemon run'); do lsof -nP -a -p "$p" -d cwd -Fn | grep '^n'; done | sort | uniq -c
  11 n/Users/michelkerkmeester

$ git worktree list --porcelain | grep -c '^worktree '
13
```

The 11 daemons are the main checkout (PID 89357), the detached scratchpad worktree `base-main` (PID 35266), and nine `.worktrees/` worktrees. Two registered worktrees, `217-weak-model-spec-authoring` and `230-review-mode-followups`, have no daemon. The working directory of all 11 is the home directory, so the socket each daemon holds is the only key that can attribute it. Under the registry rule in `research.md` section 6, every one of the 11 belongs to a registered entry, so a dry-run today would list no stray. The idle rule in REQ-011 closes that gap.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Attribute each `git fsmonitor--daemon run` process to the main checkout or to one registered worktree, by the socket it holds open.
- Stop a stray daemon, or the daemon of a worktree named for removal, with bounded escalation.
- Probe each attributed daemon with a bounded index-reading git call, and end a daemon whose probe times out.
- End the daemon of a registered worktree that has sat idle past a set age (`--idle-hours N`), and run that sweep on every worktree session launch, so old daemons stop accumulating.

### Out of Scope
- Worktree relocation and the base write-back. Phase 002 owns them.
- Pre-push hook timeouts and the `-c core.fsmonitor=false` opt-outs. Phase 004 owns them.
- A change to git or to its cookie wait. The unbounded wait is upstream code.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Create | 003 | Attribute daemons by socket, stop strays, probe for wedges |
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | Create | 003 | Stub-process and scratch-repository tests, bash 3.2 compatible |
| `.skilled/bin/README.md` | Modify | 003 | One entrypoint row for the new script, and the `worktree-reaper.sh` promise reworded: it never signals a process itself, and hands a worktree's daemon to the new script before removing it |
| `.skilled/bin/worktree-reaper.sh` | Modify | 003 | Call `fsmonitor-daemon-reaper.sh --apply --worktree <path>` before each removal at line 224 |
| `.skilled/skills/sk-git/references/finish-workflows.md` | Modify | 003 | Step 5 calls the reaper before and after `git worktree remove` |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | 003 | One read-only dry-run line beside the worktree-base check |
| `.skilled/bin/worktree-session.sh` | Modify | 003 | Background idle sweep on each launch. Phase 002 edits the same file's write-back, so the two land as separate hunks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The reaper attributes each `git fsmonitor--daemon run` process to the main checkout or to one registered worktree, by the socket it holds, and reports a daemon it cannot attribute without signalling it. |
| REQ-002 | The reaper signals only a daemon whose socket lies under this repository's common git directory. A daemon of another repository is never signalled. |
| REQ-003 | Dry-run is the default. Only `--apply` ends a process. |
| REQ-004 | Under `--apply`, the reaper ends only a stray, the daemon of the worktree named by `--worktree`, a daemon whose probe timed out, or an idle daemon selected by `--idle-hours`. Without `--idle-hours`, a daemon of a registered worktree that answers is never ended. |
| REQ-005 | Stop escalation runs in order: `git fsmonitor--daemon stop` under a timeout when the worktree still exists, then SIGTERM, then SIGKILL after a bounded wait. Each signal follows a recheck that the PID still runs `fsmonitor--daemon run`. |
| REQ-006 | `--worktree` refuses while a live process other than the target daemon has its working directory inside that worktree. |
| REQ-007 | `--probe` runs an index-reading git call with fsmonitor on, under a timeout, and treats only a timeout as a wedge. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | The sk-git finish step calls the reaper before and after `git worktree remove`, the sk-git setup battery prints a read-only dry-run line, and an operator can run the script by hand. |
| REQ-009 | The test file uses stub processes and scratch repositories only, and it passes under `/bin/bash` 3.2 on this host. |
| REQ-010 | The script calls no `timeout` or `gtimeout` binary. Every git call and every wait has a bound. |
| REQ-011 | `--idle-hours N` selects the daemon of a registered worktree, never the main checkout, when the daemon started more than N hours ago and no live process other than the daemon has its working directory inside that worktree. |
| REQ-012 | `.skilled/bin/worktree-session.sh` starts `fsmonitor-daemon-reaper.sh --apply --idle-hours 12` in the background on each launch, bounded and silent, so the sweep never delays or fails the launch. |
| REQ-013 | `.skilled/bin/worktree-reaper.sh` calls `fsmonitor-daemon-reaper.sh --apply --worktree <path>` before each `git worktree remove`, and a failure to end the daemon is logged and never blocks the removal. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After `--apply --worktree <path>` and then `git worktree remove <path>`, no daemon whose socket belongs to that path remains within 15 seconds.
- **SC-002**: A probe that times out ends its daemon, and a probe that answers inside its timeout ends nothing.
- **SC-003**: On this checkout, `pgrep -f 'fsmonitor--daemon run'` lists the same PIDs before and after a dry-run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `lsof` attribution. A worktree daemon's socket row shows only `fsmonitor--daemon.ipc`, and its admin directory appears on a separate `DIR` row. | Worktree daemons go unattributed if only socket rows are read. | Read the `DIR` row under `<common>/worktrees/<name>`. A daemon with no such row is reported as unattributed and never signalled. |
| Dependency | `perl` alarm as the timeout wrapper, because no `timeout` or `gtimeout` binary is installed here. | A bounded call would have no bound. | `perl -e 'alarm shift; exec @ARGV or exit 127'`. Verified on this host: exit 142 after a 1 second alarm, exit 0 for a call that finishes. |
| Risk | A false wedge ends a healthy daemon. The research saw a cold daemon answer in about 10 seconds on this tree. | Medium. Git starts a new daemon on the next index read, so the cost is a cold start. | Probe timeout of 15 seconds (open question 3). The probe runs only with `--probe`. |
| Risk | A daemon is ended while a live session works in its worktree. | High. | `--worktree` refuses on a live working directory (REQ-006). Every signal needs `--apply`. |
| Risk | PID reuse between the process list and the signal. | Medium. | The identity recheck before each signal (REQ-005). |
| Risk | `worktree-reaper.sh` removes worktrees at line 224 without ending their daemons. | Medium. The daemon of a removed worktree stays until a later sweep. | REQ-013: the reaper hands each worktree's daemon to the new script before it removes the worktree. |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A dry-run without `--probe` finishes within 10 seconds on this checkout with 11 daemons. This is a target, checked in verification task T020.
- **NFR-P02**: A `--probe` run takes at most the probe timeout of 15 seconds per attributed daemon. Eleven daemons bound the run at 165 seconds.

### Security
- **NFR-S01**: The script reads no credential and makes no network call. It writes no file, and its test fixtures live under a `mktemp -d` root that the test removes on exit.
- **NFR-S02**: Every signal goes to a PID whose command line and socket attribution were read in the same run, after the identity recheck.

### Reliability
- **NFR-R01**: An apply run exits 1 and names the PID when a daemon survives SIGKILL.
- **NFR-R02**: Ending a daemon drops only its cache. Git starts a new daemon on the next index read, and task T021 proves that in a scratch clone.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no fsmonitor daemon is running. The dry-run prints `fsmonitor-daemon: 0 daemons` and exits 0.
- Maximum input: 11 daemons on this checkout. The probe bound is 165 seconds, and `--worktree` takes one path per run.
- Failure path: `lsof` or `perl` is missing, or the run is outside a git repository. The script exits 2 with a message and signals nothing. A daemon with no admin `DIR` row is reported as unattributed and left alone. A daemon that survives SIGKILL makes the run exit 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One script, one test file, three call-site edits and one README row |
| Risk | 18/25 | The script ends processes. The scope check, the live-cwd refusal and the identity recheck carry the risk. |
| Research | 8/20 | The research is done. The lsof row format and the timeout wrapper were checked here, and the cite-drift temporary worktree is still unchecked. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Open question 1, answered: the operator's goal for this packet is to stop old daemons from running on, and the registry rule alone leaves all 11 current daemons running. The idle rule is in scope as REQ-011 and REQ-012. Ending a daemon drops only its cache, and git starts a new one on the next index read. The operator set the age to 12 hours.
- Open question 2, answered: Option B. `worktree-reaper.sh` calls this script with `--apply --worktree` before each removal at line 224, and its README promise becomes "never signals a process itself". The reaper removes the most worktrees, so without this each merged worktree would leave a daemon behind. In scope as REQ-013.
- Open question 3 (operator decision): the brief asks for a probe timeout of about 10 seconds. The research saw a cold daemon answer in about 10 seconds, so this plan uses 15 seconds. Answered 2026-10-27: 15 seconds.
- Open question 4 (verification): does the cite-drift gate's temporary worktree (`.skilled/skills/sk-doc/shared/scripts/cite-drift-gate.mjs:128`) start a daemon before its `worktree remove`? Task T022 answers it in a scratch clone.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent packet**: `../spec.md`, which holds the phase map and the handoff criteria.
- **Research synthesis**: `../001-deep-research/research/research.md`, sections 4.3, 4.4, 5, 6 (Layers 3 and 4), 7, 8, 10, 11 and 13.
- **Findings record**: `../scratch/findings.md`, sections 4 and 5a.
- **Predecessor**: `../002-worktree-relocation-restore/`.
- **Successor**: `../004-push-gate-git-timeout/`.
