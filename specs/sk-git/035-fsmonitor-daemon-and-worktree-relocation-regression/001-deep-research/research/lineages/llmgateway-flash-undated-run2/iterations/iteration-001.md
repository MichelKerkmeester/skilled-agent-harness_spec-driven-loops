# Iteration 1: The sk-git/026 regression — who moved the worktrees back and where the reaper's daemon handling went

## Focus

Q1 of the packet's section 8: what unset `speckit.worktreeBase` and removed the reaper's daemon handling, and whether anything still defaults worktrees to `.worktrees/`. This iteration reads the completed sk-git/026 packet, the current worktree scripts, and the git history of the reaper and the base write-back, then re-measures the live worktree and daemon population.

## Actions Taken

1. Read `specs/sk-git/026-worktree-hygiene-and-relocation/implementation-summary.md` for the recorded outcomes (prune, fsmonitor on, configurable base set to `~/worktrees/public`, reaper "generalized daemon-orphan detection").
2. Read the resolved-base code paths: `.skilled/skills/sk-git/scripts/worktree-naming.sh` `_wn_base_dir()`, `.skilled/bin/worktree-session.sh` base resolution and config write-back, and the current `.skilled/bin/worktree-reaper.sh`.
3. Traced the reaper's history with `git log --oneline -S "daemon"` over both the pre-move `.opencode/bin/worktree-reaper.sh` and the current `.skilled/bin/worktree-reaper.sh`, then read the daemon-related diff hunks of the commit that dropped the block.
4. Traced the config write-back history with `git log --oneline -S 'config speckit.worktreeBase "$WT_BASE_DIR"'` over both path spellings.
5. Re-measured the live state: `git config --show-origin --get-regexp 'fsmonitor|untracked|worktreeBase|extensions'`, `ls -d .worktrees/*`, `ls ~/worktrees`, and a `ps -Ao pid,lstart,command` census of `fsmonitor--daemon run` processes.
6. Checked the reaper's published invariant in `.skilled/bin/README.md` and the v1.5.2.0 changelog entry for the documented default.

## Findings

1. The reaper's daemon handling was deleted by `3c7c3f83874` (2026-09-03, "refactor(runtime): remove the memory launcher, plugin, hooks and the tool-ownership commit gate"), not by the `.opencode` → `.skilled` source-root move (`330427cf30`, 2026-09-17). The diff removes `--reap-daemons`, `_daemon_worktree_path_from_cmdline()`, `_daemon_cmdline_is_orphan()`, and the whole "5. ORPHAN DAEMON REPORTING" block. [SOURCE: git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh]
2. The deleted logic only matched `pgrep -f 'context-server\.js'` and skipped any command line not matching `*node*context-server.js*` — the retired spec-memory MCP daemons, never `git fsmonitor--daemon`. The packet's premise conflates two daemon families. [SOURCE: git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh]
3. Restoring "the reaper's daemon handling" would not stop a single fsmonitor daemon; a fsmonitor reaper is new work, not a revert. [INFERENCE: from findings 1-2 plus `grep -c -i -E "daemon|fsmonitor|orphan" .skilled/bin/worktree-reaper.sh` returning 0]
4. The current reaper's published invariant is "never signals a process" (`.skilled/bin/README.md`), so re-adding daemon killing inside `worktree-reaper.sh` would break a documented contract rather than restore one. [SOURCE: .skilled/bin/README.md:168]
5. `speckit.worktreeBase` is local-only configuration: `git config --show-origin --get-regexp` prints only `file:.git/config core.fsmonitor true` and `core.untrackedcache true`, and no commit can unset an unversioned `.git/config` key. The relocation policy record simply is not in the repository. [SOURCE: git config --show-origin --get-regexp output, this session]
6. The durable in-checkout default is re-created by the launch wrapper itself. `.skilled/bin/worktree-session.sh:293-294` writes `speckit.worktreeBase = $WT_BASE_DIR` whenever the key is unset, and lines 219-227 resolve `SPECKIT_WORKTREE_BASE` → config → default `.worktrees`, absolutized to `$MAIN_ROOT/.worktrees`. One launch without the env var converts the intended `~/worktrees/public` policy into a permanent in-checkout policy. [SOURCE: .skilled/bin/worktree-session.sh:219] [SOURCE: .skilled/bin/worktree-session.sh:293]
7. The auto-pin is recent: `f83952c3a94` (2026-09-11, "fix(sk-git): keep the reaper off live sessions and record autosync rewrites") introduced the config write-back, three weeks after `a69a621a39a` (2026-08-21) introduced the configurable base. The window between the two commits is exactly when a launch could have re-pinned `.worktrees` without operator intent. [SOURCE: git log -S 'config speckit.worktreeBase "$WT_BASE_DIR"' -- .opencode/bin/worktree-session.sh .skilled/bin/worktree-session.sh]
8. `.worktrees` remains the documented code default: `_wn_base_dir()` falls back to `.worktrees` relative to the toplevel when neither env nor config names a base, and the v1.5.2.0 changelog states "The default is still in-checkout `.worktrees`". `.worktrees/` is gitignored (`.gitignore:320`) but sits inside the checkout, so the main daemon watches it. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:69] [SOURCE: .skilled/skills/sk-git/changelog/v1.5.2.0.md:21] [SOURCE: .gitignore:320]
9. The live state matches the in-checkout default: `~/worktrees` is empty and 13 worktrees sit under `Public/.worktrees/`. The empty relocated base is the residue of the relocation, not of a live policy. [SOURCE: ls -d .worktrees/*, this session] [SOURCE: ls ~/worktrees, this session]
10. Twelve `git fsmonitor--daemon run --detach --ipc-threads=8` processes are alive as of 09:54Z, the oldest started Oct 11 18:29:55 (PID 1157, 16 days), and four started today alone (08:55, 08:56, 09:25, 10:45) — the population is still growing during this research session. Nothing in the repo starts, stops, or bounds them. [SOURCE: ps -Ao pid,lstart,command output, this session]

## Questions Answered

- Q1. What unset speckit.worktreeBase and removed the reaper's daemon handling, and does anything still create worktrees under .worktrees/ by default? — Answer: two different events. The reaper's daemon block was deleted by `3c7c3f83874` (2026-09-03) in the memory-launcher refactor, and it only ever targeted MCP `context-server.js` daemons. The base key was not unset by any commit (it is unversioned local config); the launch wrapper re-pins it on any unset launch, defaulting to `.worktrees`. Yes — `.worktrees` remains the code default, 13 worktrees live there, and 12 fsmonitor daemons persist from Oct 11 onward.

## Questions Remaining

- Q2. Git 2.50.1's documented daemon lifecycle on macOS (idle exit, `fsmonitor.socketDir`, `git fsmonitor--daemon stop` on a wedged daemon).
- Q3. Event overload versus a known 2.50.1 daemon deadlock (`--ipc-threads`, cookie handshake).
- Q4. Which hook/script git call sites lack a timeout.
- Q5. Safest default shape.

## Ruled Out

- "The `.opencode` → `.skilled` move removed the daemon handling." Ruled out: `git log -S daemon` puts the deletion in `3c7c3f83874` (2026-09-03), and the move commit `330427cf30` (2026-09-17) is the only commit touching the current path.
- "A repo commit reverted the relocated worktree base." Ruled out: the key is local config; the only repo-side actor is the wrapper's write-back.
- "The relocation never happened or was rolled back by hand." Ruled out: the sk-git/026 summary records the migration and the file-count drop; `~/worktrees` exists but is empty, which is the relocation's residue.

## Dead Ends

- Git-config provenance for `speckit.worktreeBase`: `.git/config` is not versioned, so the exact unset action is unrecoverable from the repository. Recorded as an explicit UNKNOWN rather than guessed.

## Edge Cases

- Contradictory evidence: the packet's own wording calls the removed code "the reaper's daemon handling" and the current pile-up "fsmonitor daemons", which reads as one lineage of work. The code shows two unrelated daemon families. Resolution: recorded as findings 1-3 rather than smoothed over; the premise correction is load-bearing for the fix design.
- Missing dependency: no access to the pre-unset `.git/config`; the UNKNOWN stands with the check that would resolve it (a `.git/config` copy in a backup or another clone's config).

## Sources Consulted

- `specs/sk-git/026-worktree-hygiene-and-relocation/implementation-summary.md`
- `git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh`
- `git log --oneline -S "daemon" -- .opencode/bin/worktree-reaper.sh .skilled/bin/worktree-reaper.sh`
- `git log --oneline -S 'config speckit.worktreeBase "$WT_BASE_DIR"' -- .opencode/bin/worktree-session.sh .skilled/bin/worktree-session.sh`
- `git log -1 --format="%h %ad %s" --date=short a69a621a39a f83952c3a94 3c7c3f83874 330427cf308`
- `.skilled/bin/worktree-session.sh:219-229,293-294`
- `.skilled/bin/worktree-reaper.sh`
- `.skilled/bin/README.md:168`
- `.skilled/skills/sk-git/scripts/worktree-naming.sh:65-79`
- `.skilled/skills/sk-git/changelog/v1.5.2.0.md:21-24`
- `.gitignore:320`
- `ps -Ao pid,lstart,command | grep [f]smonitor--daemon run` (12 processes)
- `git config --show-origin --get-regexp "fsmonitor|untracked|worktreeBase|extensions"`
- `ls -d .worktrees/*`, `ls ~/worktrees`

## Assessment

- New information ratio: 0.85
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: `git log -S` over both path spellings, then reading the daemon-related diff hunks of the one commit that matched, converted a vague "the reaper lost something" into an exact deletion with a date and a reason. Re-measuring the live process census in the same session kept the sixteen-day-old daemon observation current instead of inherited.
- What did not work and why: chasing config provenance through git history was structurally impossible — the key is unversioned. Reading the wrapper's write-back found the real persistence mechanism instead.
- What I would do differently: start from the code path that writes the key (write-back) rather than from "who unset it", because an unset that is silently re-pinned is a different bug from an unset that stays unset.

## Recommended Next Focus

Q2 and Q3 together: git 2.50.1's fsmonitor daemon lifecycle on macOS — whether a daemon can exit on its own, what `fsmonitor.socketDir`, idle shutdown and `git fsmonitor--daemon stop` do, and whether `--ipc-threads=8` or the cookie handshake has a known wedge in this version. The `--ipc-threads=8` argument in every live process is not something this repo passes, so its origin and its deadlock surface need an authoritative answer.
