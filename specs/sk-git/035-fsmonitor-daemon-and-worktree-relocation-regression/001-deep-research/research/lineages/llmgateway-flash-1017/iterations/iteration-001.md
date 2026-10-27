# Iteration 1: The sk-git/026 regression — who moved the worktrees back and where the reaper's daemon handling went

## Focus

Q1 of the packet's section 8: what unset `speckit.worktreeBase` and removed the reaper's daemon handling, and whether anything still defaults worktrees to `.worktrees/`. This iteration reads the completed sk-git/026 packet, the current worktree scripts, and the git history of the reaper, and re-measures the live daemon population.

## Actions Taken

1. Read `specs/sk-git/026-worktree-hygiene-and-relocation/implementation-summary.md` for the recorded outcomes (prune, fsmonitor on, configurable base set to `~/worktrees/public`, reaper "generalized daemon-orphan detection").
2. Read the resolved-base code paths: `.skilled/skills/sk-git/scripts/worktree-naming.sh` `_wn_base_dir()`, `.skilled/bin/worktree-session.sh` base resolution and config write-back, `.skilled/bin/worktree-reaper.sh` header and section list.
3. Traced the reaper's history with `git log --oneline -- <path>` and `git log -S "daemon"` over both the pre-move `.opencode/bin/worktree-reaper.sh` and the current `.skilled/bin/worktree-reaper.sh`, then read the full reaper diff of the commit that dropped the daemon block.
4. Traced the config write-back history with `git log -S 'config speckit.worktreeBase "$WT_BASE_DIR"'`.
5. Re-measured the live state: `git config --show-origin --get-regexp 'fsmonitor|untracked|worktreeBase|extensions'`, `ls -d .worktrees/*`, `ls ~/worktrees`, and a `ps -Ao pid,lstart,command` census of `fsmonitor--daemon run` processes.
6. Checked `~/.zsh_history` for an `unset speckit.worktreeBase` record (no hit).

## Findings

1. The reaper's daemon handling was deleted by `3c7c3f83874` (2026-09-03, "refactor(runtime): remove the memory launcher, plugin, hooks and the tool-ownership commit gate"), not by the `.opencode` → `.skilled` source-root move. That commit removed the `--reap-daemons` flag, the `_daemon_worktree_path_from_cmdline()` and `_daemon_cmdline_is_orphan()` helpers, the whole "5. ORPHAN DAEMON REPORTING" block, and the closing `orphan daemon candidates` log line from `.opencode/bin/worktree-reaper.sh`. [SOURCE: git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh]

2. The deleted logic never matched `git fsmonitor--daemon` at all. It enumerated `pgrep -f 'context-server\.js'` and skipped every process whose command line was not `*node*context-server.js*`, i.e. the retired spec-memory MCP daemons whose lease lived under a worktree DB dir. Two separate daemon populations were conflated in the packet's premise: sk-git/026 reaped MCP context-server daemons, and today's pile-up is git's own fsmonitor daemon. [SOURCE: git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh]

3. Restoring "the reaper's daemon handling" therefore would not stop a single fsmonitor daemon. A fsmonitor reaper is new work, not a revert. [INFERENCE: from findings 1-2 plus `.skilled/bin/worktree-reaper.sh` now containing no `daemon`, `fsmonitor` or `orphan` token]

4. `speckit.worktreeBase` is local-only configuration: `git config --show-origin --get-regexp` prints it nowhere for this checkout (only `file:.git/config core.fsmonitor true` and `core.untrackedcache true`), and no commit can unset an unversioned `.git/config` key. The regression was not a code revert of the relocation policy; the policy record simply is not in the repository. [SOURCE: git config --show-origin output, this session]

5. The durable in-checkout default is re-created by the launch wrapper itself. `.skilled/bin/worktree-session.sh:292-295` writes `speckit.worktreeBase = $WT_BASE_DIR` whenever the key is unset, and `_wn_base_dir()` falls back to `<toplevel>/.worktrees` when neither `SPECKIT_WORKTREE_BASE` nor the config key exists. So one launch without the env var converts the intended `~/worktrees/public` policy into a permanent `.worktrees` policy. [SOURCE: .skilled/bin/worktree-session.sh:292] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:71]

6. The auto-pin is recent: `f83952c3a94` (2026-09-11, "fix(sk-git): keep the reaper off live sessions and record autosync rewrites") introduced the config write-back, three weeks after `a69a621a39a` (2026-08-21) introduced the configurable base. The window between the two commits is exactly when a launch could have re-pinned `.worktrees` without any operator intent. [SOURCE: git log -S 'config speckit.worktreeBase "$WT_BASE_DIR"' -- .opencode/bin/worktree-session.sh .skilled/bin/worktree-session.sh]

7. Nothing else in the repo opts this checkout out of the in-checkout default. `.worktrees` is still the documented default in `worktree-naming.sh:13`, `README.md:115`, and `README.md:125`, and the only documented way back out is a manual `git config speckit.worktreeBase <abs>`; the changelog even advertises "Unset the config to return to the in-checkout `.worktrees` layout" as a supported action. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:13] [SOURCE: .skilled/skills/sk-git/changelog/v1.5.2.0.md:29]

8. The live state matches the in-checkout default: `git config --get speckit.worktreeBase` is empty, `~/worktrees` exists but is empty, and 13 worktrees sit under `Public/.worktrees/` (087, 103, 140, 144, 145, 156, 197, 216, 217, 218, 219, 230, 231). The empty `~/worktrees` directory is the residue of the relocation, not of a live policy. [SOURCE: ls -d .worktrees/*, this session] [SOURCE: ls -la ~/worktrees, this session]

9. Eleven `git fsmonitor--daemon run --detach --ipc-threads=8` processes are alive as of 09:22Z, the oldest started Oct 11 18:29:55 (PID 1157, 16 days), and every one of them is Xcode's `git-core`. Nothing in the repo starts, stops, or bounds them: the reaper is a manual CLI, and its published invariant is now "never signals a process". [SOURCE: ps -Ao pid,lstart,command output, this session] [SOURCE: .skilled/bin/README.md:168]

10. Because the reaper documents "never signals a process", re-adding daemon killing inside `worktree-reaper.sh` would break a published contract rather than restore one; a fsmonitor reap belongs in its own entry point (or in a `--reap-fsmonitor` sibling) whose invariant can be stated separately. [SOURCE: .skilled/bin/README.md:168] [SOURCE: .skilled/skills/sk-git/feature-catalog/feature-catalog.md:85]

## Questions Answered

- Q1. What unset speckit.worktreeBase and removed the reaper's daemon handling, and does anything still create worktrees under .worktrees/ by default? — Answer: two different events. The reaper's daemon block was deleted by `3c7c3f83874` (2026-09-03) in the memory-launcher refactor, and it only ever targeted MCP `context-server.js` daemons. The base key was not unset by any commit (it is unversioned local config); the launch wrapper re-pins it on any unset launch, defaulting to `.worktrees`. Yes — `.worktrees` remains the code default, all 13 worktrees live there, and 11 fsmonitor daemons persist from Oct 11 onward.

## Questions Remaining

- Q2. Git 2.50.1's documented daemon lifecycle on macOS (idle exit, `fsmonitor.socketDir`, `git fsmonitor--daemon stop` on a wedged daemon).
- Q3. Event overload versus a known 2.50.1 daemon deadlock (`--ipc-threads`, cookie handshake).
- Q4. Which hook/script git call sites lack a timeout.
- Q5. Safest default shape.

## Ruled Out

- "The `.opencode` → `.skilled` move removed the daemon handling." Ruled out: `git log -S daemon` puts the deletion in `3c7c3f83874`, and the move commit `330427cf308` is the only commit touching the current path.
- "A repo commit reverted the relocated worktree base." Ruled out: the key is local config; the only repo-side actor is the wrapper's write-back.
- "An operator shell command unset it and is recoverable from this shell's history." No hit in `~/.zsh_history`; the unset, if manual, happened in another session or before history rotation.

## Dead Ends

- Git-config provenance for `speckit.worktreeBase`: `.git/config` is not versioned, so the exact unset action is unrecoverable from the repository. Recorded as an explicit UNKNOWN rather than guessed.

## Edge Cases

- Contradictory evidence: the packet's own wording calls the removed code "the reaper's daemon handling" and the current pile-up "fsmonitor daemons", which reads as one lineage of work. The code shows two unrelated daemon families. Resolution: recorded as findings 1-3 rather than smoothed over; the premise correction is load-bearing for the fix design.
- Missing dependency: no access to the pre-unset `.git/config`; the UNKNOWN stands with the check that would resolve it (a `.git/config` copy in a backup or another clone's config).

## Sources Consulted

- `specs/sk-git/026-worktree-hygiene-and-relocation/implementation-summary.md`
- `git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh`
- `git log --oneline -S "daemon" -- .skilled/bin/worktree-reaper.sh .opencode/bin/worktree-reaper.sh`
- `git log --oneline -S 'config speckit.worktreeBase "$WT_BASE_DIR"' -- .opencode/bin/worktree-session.sh .skilled/bin/worktree-session.sh`
- `.skilled/bin/worktree-session.sh:219,292-295`
- `.skilled/bin/worktree-reaper.sh`
- `.skilled/bin/README.md:168`
- `.skilled/skills/sk-git/scripts/worktree-naming.sh:13,61-83`
- `.skilled/skills/sk-git/README.md:115,125`
- `.skilled/skills/sk-git/changelog/v1.5.2.0.md:21,29`
- `.skilled/skills/sk-git/feature-catalog/feature-catalog.md:85`
- `ps -Ao pid,lstart,command | grep [f]smonitor--daemon run` (11 processes)
- `git config --show-origin --get-regexp "fsmonitor|untracked|worktreeBase|extensions"`
- `ls -d .worktrees/*`, `ls -la ~/worktrees`

## Assessment

- New information ratio: 0.85
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: `git log -S` over both path spellings, then reading the full diff of the one commit that matched, converted a vague "the reaper lost something" into an exact deletion with a date and a reason. Re-measuring the live process census in the same session kept the fourteen-day-old daemon observation current instead of inherited.
- What did not work and why: chasing config provenance through git history was structurally impossible — the key is unversioned. Reading the wrapper's write-back found the real persistence mechanism instead.
- What I would do differently: start from the code path that writes the key (write-back) rather than from "who unset it", because an unset that is silently re-pinned is a different bug from an unset that stays unset.

## Recommended Next Focus

Q2 and Q3 together: git 2.50.1's fsmonitor daemon lifecycle on macOS — whether a daemon can exit on its own, what `fsmonitor.socketDir`, idle shutdown and `git fsmonitor--daemon stop` do, and whether `--ipc-threads=8` or the cookie handshake has a known wedge in this version. The `--ipc-threads=8` argument in every live process is not something this repo passes, so its origin and its deadlock surface need an authoritative answer.
