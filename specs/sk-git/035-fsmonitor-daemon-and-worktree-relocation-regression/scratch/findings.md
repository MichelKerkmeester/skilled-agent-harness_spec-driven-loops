# Findings: the 30-minute push and the fsmonitor daemon pile-up

Observed on 2026-10-27 while pushing three commits to `main`. Every claim below is marked OBSERVED (a command ran and its output was read), DERIVED (follows from an observation) or INFERRED (plausible and unconfirmed, with the check that would confirm it).

## 1. Symptom

- OBSERVED: `git push origin main` sat in the pre-push hook for about 30 minutes. The push itself then landed (`e023536201..f273dba74c`).
- OBSERVED: the stuck step was the skill-root metadata gate, `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`. The hook's own comment says this gate "finishes in about a second" (`~/.config/git/hooks/pre-push`, the `SPECKIT_SKIP_PREPUSH_SKILL_GATE` block).
- OBSERVED: one child process, `git check-ignore -z --stdin` (PID 28423), stayed in sleep state for more than 16 minutes.
- OBSERVED: earlier the same morning, `git fetch` printed `error: could not read IPC response`.

## 2. Where it blocked

- OBSERVED: `sample 28423` showed the main thread in `repo_read_index → read_index_from → tweak_fsmonitor → refresh_fsmonitor → fsmonitor_ipc__send_query → ipc_client_send_command_to_connection → read_packetized_to_strbuf`. Git asked the fsmonitor daemon what changed and waited for a reply that never came.
- OBSERVED: `core.fsmonitor=true` and `core.untrackedCache=true` are set in the shared `.git/config` (`git config --show-origin --get core.fsmonitor` prints `file:.git/config true`).
- OBSERVED: `git fsmonitor--daemon stop` also hung (it uses the same IPC channel), and was killed after 15 seconds.
- OBSERVED: `lsof` showed daemon PID 23895, started about 08:34, holding `.git/fsmonitor--daemon.ipc`. `kill 23895` released the blocked `check-ignore`, and git auto-started a new daemon (PID 17228) at 08:51:33.
- OBSERVED: after the restart each `git check-ignore` took about 10 seconds (PIDs cycled at roughly that interval), against a normal fraction of a second.

## 3. Why a stalled daemon stalled the push

- OBSERVED: `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129` runs `spawnSync('git', ['check-ignore', '-z', '--stdin'], { cwd, input, encoding })` with no `timeout` option, once per skill root.
- OBSERVED: the same function already has a fallback when git fails (`fallbackIgnored`, line 136), taken on `res.error` or an exit status other than 0 or 1.
- DERIVED: a hang is not a failure, so the fallback is never reached and the push has no time ceiling.

## 4. The daemon overlap

- OBSERVED: 11 `git fsmonitor--daemon run --detach --ipc-threads=8` processes were running, all with files open under this repository's `.git`.
- OBSERVED (start times from `ps -o lstart`): Oct 11 (worktree `087-doctor-update-test-environment`), Oct 14 (`140-doctor-test-environment`), Oct 18 (`144-sk-code-skilled-rename`), Oct 19 (`145-sk-code-surface-consistency-research`), Oct 22 (`197-fork-compact-pointer-fix`), Oct 23 twice (`216-opencode-v2-orchestrator-ready`, `219-agent-local-skill-fallback-plan`), Oct 24 (a daemon whose working directory is a Claude scratchpad), and three from Oct 27 (main checkout, `230-review-mode-followups`, `231-repo-doc-debt`).
- DERIVED: `core.fsmonitor` lives in the shared config, so every worktree starts its own daemon, and nothing stops a daemon when its worktree session ends. The oldest had run for 16 days.
- OBSERVED: `git worktree list` shows 12 worktrees under `Public/.worktrees/`, plus one detached worktree in a Claude scratchpad.
- OBSERVED: `.worktrees/` is gitignored (`.gitignore:320`), but it sits inside the main checkout. `find` counted about 570,000 files in the main checkout outside `.worktrees/`, and about 2,000,000 files under `.worktrees/`, including 93 `node_modules` folders.
- DERIVED: the main daemon watches the whole checkout root, so macOS delivers it a change event for every file touched in any worktree. Ignoring happens after the event arrives. Each worktree's own daemon watches its subtree as well, so those files are watched twice.
- INFERRED: the event volume from concurrent worktree activity (other sessions' installs and commits, a 27-minute test suite, an `npm install` in the deep-loop runtime) overloaded the main daemon until it stopped answering. Confirm by running a daemon with `GIT_TRACE_FSMONITOR=1` during a heavy install in a nested worktree and watching its queue and reply latency, then repeating with the worktree outside the checkout.

## 5. The regression of sk-git/026

`specs/sk-git/026-worktree-hygiene-and-relocation` (Complete, about 8 weeks old) addressed exactly this class of problem. Its implementation summary records three outcomes.

1. Prune finished worktrees.
2. Enable `core.fsmonitor` and `core.untrackedcache`.
3. Make the worktree base configurable (`speckit.worktreeBase` or `SPECKIT_WORKTREE_BASE`, default `.worktrees`), set this repository to `~/worktrees/public`, migrate 13 idle worktrees there, and give the reaper "generalized daemon-orphan detection". Result recorded: main-checkout file count 2,794,654 to 587,282.

Current state:

- OBSERVED: `git config --get speckit.worktreeBase` prints nothing, and `SPECKIT_WORKTREE_BASE` is unset.
- OBSERVED: `~/worktrees/public` does not exist.
- OBSERVED: all 12 repo worktrees are back under `Public/.worktrees/`.
- OBSERVED: `.skilled/bin/worktree-reaper.sh` contains no `fsmonitor`, `daemon` or `orphan` handling (`grep -n -i -E "daemon|fsmonitor|orphan"` returns nothing).
- UNKNOWN: which change unset the base and removed the reaper's daemon handling. The reaper's only recent history is the `.opencode` to `.skilled` source-root move (`330427cf308`, about 6 weeks ago). Find it with `git log -S` over the reaper and the sk-git scripts, and by checking whether the config key was ever committed or only set locally.

## 5a. Recurrence the same morning

- OBSERVED: at 09:14:37 the deep-research fan-out for this packet started its containment baseline, `git -C <repo> status --porcelain=v1 -z --no-renames --untracked-files=all` (PID 47087). It blocked with the same stack as section 2 (`tweak_fsmonitor → refresh_fsmonitor → fsmonitor_ipc__send_query → read_packetized_to_strbuf`), 0% CPU, sleep state.
- OBSERVED: the replacement main daemon started at 08:51:33 (PID 17228) was gone by 09:17, and a new main daemon (PID 18482) took `.git/fsmonitor--daemon.ipc` at 09:17:59. The blocked `git status` returned at 09:17:58, and the runner logged `duration_ms: 189183` for that step.
- OBSERVED: a further worktree daemon started at 09:08:10 for `217-weak-model-spec-authoring`, so 12 daemons were running at 09:18.
- DERIVED: a freshly started main daemon wedged within about 23 minutes, so the hang is not a one-off left over from a long-lived daemon. Restarting the daemon is not a fix.
- OBSERVED: a third hang at about 09:47. The second research lane's containment `git status` (PID 51252) sat at 0% CPU in `fsmonitor_ipc__send_query` for 28 seconds and kept waiting. The main daemon then was PID 18482, started 09:17:59. `kill 18482` released the `git status` within 3 seconds.
- DERIVED: three main-checkout daemons in a row wedged: 23895 within about a minute of starting (08:34 start, blocked query from 08:35), 17228 after about 23 minutes and 18482 after about 29. Each release came only from the daemon ending (two kills, one unexplained exit).
- UNKNOWN: why daemon 17228 exited. No one killed it in this session. Git's daemon log (`GIT_TRACE_FSMONITOR`) or the unified system log around 09:17 would show whether it crashed, timed out or was replaced.

## 6. Impact

- Any git command in this checkout that reads the index can hang the same way, including `status`, `fetch`, `commit` and every hook. A hang looks like a slow tool, not an error.
- No repository data was affected. Terminating a daemon only drops its cache.

## 7. Candidate fixes, cheapest first

1. Clear leaked daemons (`pkill -f "fsmonitor--daemon run"`). Git restarts one on demand. This fixes today's pile-up only.
2. Give the hook's git call a ceiling: a `timeout` on the `spawnSync`, or `git -c core.fsmonitor=false check-ignore`, so a stalled daemon falls through to the existing fallback.
3. Reap a worktree's daemon when the worktree is removed or goes idle, and reap daemons whose worktree no longer exists.
4. Restore the worktree base outside the main checkout, so the main daemon stops receiving every worktree's events. Alternatively, disable fsmonitor for the main checkout only, which requires `extensions.worktreeConfig`.

## 8. Questions for the research phase

1. What unset `speckit.worktreeBase` and removed the reaper's daemon handling, and does anything still create worktrees under `.worktrees/` by default?
2. What is git 2.50.1's documented daemon lifecycle on macOS? Does a daemon ever exit on its own, and how do `fsmonitor.socketDir`, idle shutdown and `git fsmonitor--daemon stop` behave when the daemon is wedged?
3. Is event overload the real cause of the hang, or is there a known daemon deadlock in this git version, for example around `--ipc-threads` or the cookie-file handshake?
4. Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor?
5. What is the safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree?
