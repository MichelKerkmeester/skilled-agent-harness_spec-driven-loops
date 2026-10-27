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
    last_updated_at: "2026-10-27T12:50:37Z"
    last_updated_by: "generate-context"
    recent_action: "Shipped the fsmonitor daemon reaper in 8730c91ecb"
    next_safe_action: "Await the operator worktree move, phase 002 T015 to T020"
    blockers: []
    key_files:
      - ".skilled/bin/fsmonitor-daemon-reaper.sh"
      - ".skilled/bin/worktree-session.sh"
      - ".skilled/bin/worktree-reaper.sh"
    session_dedup:
      fingerprint: "sha256:4f6a71db569c6c802510038396cd8bf8ce9a70d6adcef15fa550788afb6a3124"
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
| **Fix commit** | `8730c91ecb` |
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
| `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` under bash 3.2.57 | PASS, `PASS=107 FAIL=0`, exit 0, in five runs after the flaky probe case was removed |
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
3. **The worktrees are still inside the checkout.** The main daemon on this checkout wedged six times on 2026-10-27. Moving the worktrees out, phase 002 tasks T015 to T020, is the operator's step.
<!-- /ANCHOR:limitations -->

---
