---
title: "Implementation Summary"
description: "Old and wedged git fsmonitor daemons now get ended: each session launch sweeps daemons of worktrees idle for 12 hours, worktree removal ends the worktree's daemon first, and a probe ends a daemon that stops answering."
trigger_phrases:
  - "fsmonitor daemon lifecycle implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle"
    last_updated_at: "2026-10-27T13:42:51Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the review P1s and P2s in the daemon reaper"
    next_safe_action: "Await the 217 and 218 sessions, then move those worktrees"
    blockers: []
    key_files:
      - ".skilled/bin/fsmonitor-daemon-reaper.sh"
      - ".skilled/bin/worktree-session.sh"
      - ".skilled/bin/worktree-reaper.sh"
    session_dedup:
      fingerprint: "sha256:f03db453e5ee29dcce52d61b0d625646e49e0d6f93c5547a64a814598bc581de"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1"
      - "Q2"
      - "Q3"
      - "Q4"
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
| **Spec Folder** | 003-fsmonitor-daemon-lifecycle |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Fix commit** | `8730c91ecb`, review fixes in the commit after `03a12a8747` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Old fsmonitor daemons no longer run on for weeks, and a daemon that stops answering can be found and ended in seconds. Every new session launch sweeps the daemons of worktrees nobody has used for 12 hours, and removing a worktree ends its daemon first.

### Phase 3: fsmonitor-daemon-lifecycle

`fsmonitor-daemon-reaper.sh` lists one repository's daemons by the worktree each one watches, read from the daemon's lowest-numbered `DIR` descriptor, and classes each as main, kept, stray, out of scope or unattributed. A plain run only reports. With `--apply` it ends strays. `--worktree` ends one worktree's daemon. `--idle-hours N` ends daemons of worktrees started more than N hours ago that no live process is using. `--probe` ends a daemon that does not answer a bounded `diff-files` read. Each end runs git's own `stop` when the worktree still exists, then SIGTERM, then SIGKILL, and checks the command line again before every step. A worktree a live process is using is refused, except when its daemon is wedged. Daemons of other repositories are never touched.

Three callers use it. `worktree-session.sh` starts a detached `--apply --idle-hours 12` sweep on each top-level launch. `worktree-reaper.sh` and the sk-git finish step end a worktree's daemon before `git worktree remove`. The doctor's worktrees row shows the daemon counts from a dry run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Created | The reaper: attribution, classes, `--apply`, `--worktree`, `--idle-hours`, `--probe` |
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | Created | Stub daemons and a git shim, 107 assertions |
| `.skilled/bin/worktree-session.sh` | Modified | Detached 12-hour sweep on each top-level launch |
| `.skilled/bin/tests/worktree-session.test.sh` | Modified | A blocking stub reaper does not delay the launch; children and dry runs never sweep |
| `.skilled/bin/worktree-reaper.sh` | Modified | Ends a worktree's daemon before removing it |
| `.skilled/bin/tests/worktree-reaper.test.sh` | Modified | A removed worktree's stub daemon is gone |
| `.skilled/bin/README.md` | Modified | Reaper row, and the worktree reaper's signal promise reworded |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | Daemon counts on the worktrees row, informational only |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | Count line, not-checked line, verdict unchanged by a stray |
| `.skilled/skills/sk-git/references/finish-workflows.md` | Modified | Step 5 ends the daemon before the removal and checks after it |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash 1017 at `max` built seven units through `cli-opencode`, with fsmonitor disabled for its git calls and with any signal outside its own test stubs banned. Units 3.5 and 3.6 ran in parallel, because their files did not overlap. The orchestrator read every diff and ran each suite itself.

It corrected six defects. The stray rule was too broad. Git's `stop` could reach the enclosing repository's daemon. An empty `lsof` listing passed the occupancy check. `--idle-hours` replaced the stray rule instead of adding to it. The occupancy check refused a wedged daemon because git calls stuck on it sat in its worktree. One test probed real git and started real daemons, which made a count fail in about one run in four. It also corrected four comments that claimed a worktree daemon outlives its worktree.

Then it ended the wedged daemon of the 231 worktree on this checkout, ran the dry run on this checkout, removed a worktree end to end in a scratch repository, and ran the real cite-drift gate with fsmonitor on.

A fresh Opus review at high effort then found two P1 gaps and several P2 items. `keep` needed no proof of ownership, so a stale registration could claim another repository's daemon. `lsof` trapped the timeout alarm and exited 1, the status the code ignored, so a partial listing passed the occupancy guard. A further builder unit (3.8) fixed both and two P2 items: paths with repeated spaces, and a daemon match that any process could satisfy through an argument. It also added a case with a real git daemon. The orchestrator fixed the finish-step snippet, confirmed that the new tests fail against the old reaper (11 failures), and reran every suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Attribute by the lowest `DIR` descriptor | The phase 001 research found it is the working-tree root git hands the daemon, and a worktree daemon also holds its `.git/worktrees/<name>` row, which marks a stray once that row is gone |
| Idle rule covers kept daemons only, at 12 hours, set by the operator | The main checkout's daemon serves every session, and ending a daemon costs only a cold start |
| A wedged daemon is ended even in an occupied worktree | Git starts a fresh daemon on the next call, and the processes inside are the ones stuck waiting on it |
| A refusal exits 0 and prints `refused` | Both callers continue with the removal either way, and the line names the blocking PID |
| Sweep detached with `nohup` in a subshell | The launch must never wait on it, and a double fork leaves no zombie under the runtime |
| The doctor line never changes the verdict | A stray daemon costs memory, not correctness |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` under bash 3.2.57 | PASS, `PASS=124 FAIL=0`, exit 0, in three runs after the review fixes, with the real-daemon case run each time. Against the old reaper the same suite fails 11 assertions |
| `bash .skilled/bin/tests/worktree-session.test.sh` | PASS, `PASS=70 FAIL=0`, up from 63 |
| `bash .skilled/bin/tests/worktree-reaper.test.sh` | PASS, `PASS=26 FAIL=0`, up from 24 |
| Doctor tests, TAP reporter | PASS, `# pass 74`, `# fail 0`, up from 71 |
| `shellcheck` on the reaper and its test | Exit 0, no output. The other two scripts carry the same findings as at HEAD (1 and 2), none new |
| Dry run on this checkout | Exit 0 in 0.8 s, `signalled=0`, the same ten PIDs before and after |
| Removal in a scratch repository | Daemon ended `via=stop`, `git worktree remove` exit 0, no daemon names the path afterwards |
| Wedged daemon of the 231 worktree on this checkout | Probe `result=wedged`, ended `via=term`; five git calls stuck since 09:42 finished |
| Cite-drift gate with fsmonitor on | Its base worktree's daemon lived about 2 s and was gone after the removal |
| `validate.sh <parent> --strict --recursive` | PASS, `RESULT: PASSED` for the parent and all four phases, 0 errors and 0 warnings each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A stranded client is invisible to the probe.** One `git commit` in a scratch repository started one second after its daemon and waited forever, while later probes of that daemon answered. Git's cookie wait has no deadline, so only the caller's own timeout, as in phase 004, frees such a call.
2. **Daemons of a deleted repository are never swept.** Daemons whose whole repository was deleted with `rm -rf` kept running, and the reaper only sees one repository's daemons. A worktree removed through git does lose its daemon within seconds. Six such daemons, left by this phase's own tests, were ended by hand.
3. **Two worktrees are still inside the checkout.** The main daemon on this checkout wedged six times on 2026-10-27. 145 moved out on 2026-10-27, and 217 and 218 wait for their sessions to end (phase 002, T015 to T020).
4. **Three review findings are left open as low cost.** Before each signal the reaper rechecks a PID's command line, not its start time, so a PID recycled into another daemon during one run would be signalled. Git's `stop` ends whichever daemon owns the worktree's socket, so with two daemons on one worktree it also ends the newer one. The worktree list is read once per run, so a worktree added mid-run has its new daemon classed as stray and ended. Each costs at most one cold start.
<!-- /ANCHOR:limitations -->

---
