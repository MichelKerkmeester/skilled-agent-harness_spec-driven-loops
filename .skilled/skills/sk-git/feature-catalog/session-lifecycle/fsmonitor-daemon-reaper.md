---
title: "fsmonitor daemon reaper"
description: "A companion script that lists the git fsmonitor daemons of one repository by the worktree each watches, and ends the strays, the idle and the wedged without ever touching another repository's daemon."
trigger_phrases:
  - "fsmonitor daemon reaper"
  - "fsmonitor-daemon-reaper.sh"
  - "end stray fsmonitor daemons"
  - "wedged fsmonitor daemon"
  - "idle worktree daemon sweep"
importance_tier: "important"
version: 1.0.0.0
---

# fsmonitor daemon reaper (fsmonitor-daemon-reaper.sh)

## 1. OVERVIEW

On macOS a git fsmonitor daemon never exits while its worktree exists. Daemons of idle worktrees pile up, and a daemon that stops answering stalls every git call that reads the index. The reaper is the one place that decides which of a repository's daemons may end.

Without `--apply` it only reports. It never ends a daemon that belongs to another repository, and it never ends the daemon of a worktree a live process is still using, unless that daemon is wedged.

---

## 2. HOW IT WORKS

### Classification

Each run lists every `git fsmonitor--daemon run` process and attributes it by its lowest-numbered directory descriptor, which is the working-tree root git handed the daemon. Each daemon gets one class: `main` for the main checkout, `keep` for a registered linked worktree, `stray` for a daemon that holds this repository's worktree administrative directory but whose worktree is gone, and `out-of-scope` for anything else. A kept daemon must hold that administrative directory, so a stale registration cannot claim another repository's daemon, and a separate repository nested inside the checkout stays out of scope.

The dry run prints one `pid=<pid> class=<class> worktree=<path> started=<time>` line per daemon and a closing `mode=dry-run signalled=0 total=<n> stray=<n>` line. It signals nothing.

### Selection Rules

`--apply` ends the strays. `--worktree <path>` narrows the run to one registered linked worktree and, with `--apply`, ends its daemon. `--idle-hours <n>` selects kept daemons started more than n hours ago whose worktree no live process is using, and `--apply` ends them beside the strays. `--probe` asks each main and kept daemon to answer one bounded index read and marks the ones that miss it `wedged`, and `--probe --apply` ends them. The main checkout's daemon is never idle, and `--worktree` refuses the main checkout or a path that is not a registered worktree with exit 2.

### Ending a Daemon

A daemon ends through git's own `fsmonitor--daemon stop` first, then SIGTERM, then SIGKILL. The reaper rechecks the process command line before every step, so a reaped or recycled process id is never signalled. Each ended daemon prints an `ended pid=<pid> class=<class> worktree=<path> via=<stop|term|kill>` line. Every git and `lsof` call it makes runs under a wall-clock bound, so a wedged daemon cannot hang the reaper itself.

### Occupancy Refusal

Before it ends the daemon of a named worktree, the reaper looks for any live process whose working directory is inside that worktree, a shell included. When it finds one, or when the process listing times out, it prints `refused worktree=<path> blocker=<pid|unknown>`, signals nothing and exits 0. A wedged daemon ends regardless, because the processes inside the worktree are the ones stuck waiting on it.

### Callers

Each top-level `worktree-session.sh` launch starts a detached `--apply --idle-hours 12` sweep, so a slow sweep never delays the launch. `worktree-reaper.sh` calls `--apply --worktree` before it removes a wrapper worktree. The finish workflow in `references/finish-workflows.md` Step 5 moves to the main checkout, calls `--apply --worktree` before `git worktree remove` and then checks for a leftover daemon. The `/doctor:git setup` worktrees row runs the dry run and reports the counts as one informational line. Both launch-time callers read the script path from `SPECKIT_FSMON_REAPER` when it is set.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Script | Daemon attribution, classification, selection rules, occupancy refusal and the stop, SIGTERM and SIGKILL escalation |
| `.skilled/bin/worktree-session.sh` | Script | Starts the detached idle sweep on each top-level launch |
| `.skilled/bin/worktree-reaper.sh` | Script | Ends a wrapper worktree's daemon before removing the worktree |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Script | Reports the daemon counts on the worktrees row |
| `.skilled/skills/sk-git/references/finish-workflows.md` | Reference | Step 5 cleanup that ends the daemon before removal |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | Automated test | Attribution, classification, the apply contract, refusal, probe and idle selection against throwaway repositories |
| `.skilled/bin/tests/worktree-session.test.sh` | Automated test | The launch sweep and its `SPECKIT_FSMON_REAPER` override |
| `.skilled/bin/tests/worktree-reaper.test.sh` | Automated test | The daemon end that runs before a worktree removal |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/fsmonitor-daemon-reaper-scope-and-refusal.md` | Manual playbook | Dry run, occupied-worktree refusal and another repository's daemon in scratch repositories |

---

## 4. SOURCE METADATA

- Group: Session Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `session-lifecycle/fsmonitor-daemon-reaper.md`

Related references:
- [worktree-reaper.md](worktree-reaper.md): Worktree reaper
- [launch-wrapper-session-isolation.md](launch-wrapper-session-isolation.md): Launch-wrapper session isolation
