---
title: "Research: git fsmonitor daemon pile-up and the 30-minute pre-push stall"
description: "Merged synthesis of two DeepSeek V4.1 Flash research lanes on why the main checkout's fsmonitor daemon wedges, why daemons accumulate across nested worktrees, and the four-layer fix design for phases 002-004."
trigger_phrases:
  - "fsmonitor daemon research"
  - "fsmonitor cookie infinite wait"
  - "worktree relocation regression research"
importance_tier: "important"
contextType: "research"
---

# Research: git fsmonitor daemon pile-up and the 30-minute pre-push stall

Merged from two research lanes run through cli-opencode on 2026-10-27, three iterations each, at `max` effort. Every claim keeps its source tag. Section 3 says how far the two lanes are independent, and section 9 lists what the orchestrator checked directly.

---

## 1. Summary

The 30-minute push was not a slow hook. It was an unbounded wait on both sides of git's fsmonitor handshake, made likely by a worktree layout that had quietly reverted, and left uncapped by a hook that sets no time limit.

When a git command reads the index, it asks the fsmonitor daemon what changed. The daemon answers by writing a cookie file into the watched tree and blocking until its event thread reports that file. If that event never arrives, the daemon's worker waits forever, and git's own source says so. The client that asked waits forever too, because its read has no deadline. The only release ever observed was the daemon process ending.

Four conditions turned that latent defect into repeated outages:

1. `core.fsmonitor=true` is shared config, so the main checkout and every worktree each start their own daemon.
2. The worktrees moved back inside the main checkout, so the main daemon receives an event for every file any of the 12 worktrees touches, about 2 million files on top of the checkout's own 570,000.
3. On macOS the daemon has no idle exit and its health thread is an empty stub, so daemons never retire and are never replaced when wedged. Eleven to twelve were alive at once, the oldest for 16 days.
4. The pre-push gate's `git check-ignore` call has no timeout, and its fallback only handles a returned failure, so a hang had no exit.

Three consecutive main-checkout daemons wedged on the same morning, the first within about a minute of starting. Restarting the daemon is therefore not a fix.

One framing in the packet needs correcting. The reaper code that was removed in September targeted retired MCP `context-server.js` daemons, not git fsmonitor daemons. Restoring it would stop no fsmonitor daemon, so a fsmonitor reaper is new work.

---

## 2. Symptom and evidence timeline

| Time (2026-10-27, CET) | Observation |
|---|---|
| about 07:55 | `git fetch` prints `error: could not read IPC response`. |
| about 08:27 | `git push origin main` enters the pre-push hook. The skill-root metadata gate runs `git check-ignore` once per skill root. |
| 08:34 | Main daemon PID 23895 starts. From 08:35 a `git check-ignore` (PID 28423) blocks at 0% CPU. |
| about 08:51 | A stack sample shows `tweak_fsmonitor → refresh_fsmonitor → fsmonitor_ipc__send_query → read_packetized_to_strbuf`. `git fsmonitor--daemon stop` also hangs. `kill 23895` releases the call, and git starts PID 17228 at 08:51:33. |
| after 08:51 | Each `git check-ignore` takes about 10 seconds. The push completes about 30 minutes after it began (`e023536201..f273dba74c`). |
| 09:14:37 | The research fan-out's containment `git status` blocks with the same stack. |
| 09:17:58 | PID 17228 has exited, cause unknown. PID 18482 takes the socket and the `git status` returns after 189 seconds. |
| about 09:47 | A second research lane's `git status` blocks with the same stack. `kill 18482` releases it within 3 seconds. |

[SOURCE: specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md]

---

## 3. Method and lane independence

| Lane | Model | Iterations | newInfoRatio by iteration | Outcome |
|---|---|---|---|---|
| `llmgateway-flash-1017` | `llmgateway/deepseek-v4.1-flash-1017` at max | 3 | 0.85, 0.90, 0.80 | Complete, synthesis written |
| `llmgateway-flash-undated` | `llmgateway/deepseek-v4.1-flash` at max | 1 | 0.92 | Interrupted by a network drop during iteration 2 |
| `llmgateway-flash-undated-run2` | `llmgateway/deepseek-v4.1-flash` at max | 3 | 0.85, 0.90, 0.90 | Complete, synthesis written |
| `opencode-go-flash` | `opencode-go/deepseek-v4.1-flash` at max | 0 | none | Refused: `429 Go usage limit exceeded` (monthly quota) |

The plan was three iterations on opencode-go and three on llmgateway. opencode-go serves no 1017 build and its monthly quota was exhausted, so the operator moved that lane to llmgateway's undated build. Two attempts to resume the interrupted undated lane exited with code 1 before any model call and left empty logs, so the lane was rerun under a new label.

**Independence.** The two complete lanes are not fully independent. `llmgateway-flash-undated-run2` read the finished `llmgateway-flash-1017` lane's `research.md`, iterations, state log and strategy before its own work, so its agreement on the framing and the fix design is not separate corroboration. It did read git's source itself (8 source tool calls, against 23 in the first lane) and added claims the first lane lacked: exact line ranges, the tie between `could not read IPC response` and the client read path, a wider call-site inventory, and the fact that `extensions.worktreeConfig` is unset. The interrupted lane's single iteration does not reference the first lane.

Both lanes kept to read-only git commands that do not read the index, because an index-reading command in this checkout is the failure under study.

---

## 4. Root-cause chain

**4.1 Config: fsmonitor on everywhere.** `core.fsmonitor=true` and `core.untrackedCache=true` live in the shared `.git/config`, so they apply to the main checkout and every worktree, and each working directory starts its own daemon on its first index read. [SOURCE: git config --show-origin --get core.fsmonitor]

**4.2 Topology: worktrees inside the checkout.** The relocation to `~/worktrees/public` recorded by sk-git/026 has been undone. `speckit.worktreeBase` is unset, `~/worktrees/public` does not exist, and 12 worktrees sit under `Public/.worktrees/`. The main daemon watches about 570,000 checkout files plus about 2,000,000 under `.worktrees/`, including 93 `node_modules` trees, and every worktree file is watched twice. `.worktrees/` is gitignored (`.gitignore:320`), but ignoring happens after the event is delivered. [SOURCE: specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md] [SOURCE: specs/sk-git/026-worktree-hygiene-and-relocation/implementation-summary.md]

**4.3 Lifecycle: daemons never retire.** On macOS the health functions `fsm_health__ctor`, `fsm_health__loop` and `fsm_health__stop_async` are empty, so a daemon never monitors itself and never exits on health grounds. No idle timeout or lifetime bound exists. Nothing in the repository stops a daemon when its worktree goes away. [SOURCE: compat/fsmonitor/fsm-health-darwin.c:7-24 (git v2.50.1)] [SOURCE: man git-fsmonitor--daemon (Git 2.50.1)]

**4.4 Protocol: an unbounded wait on both sides.** The daemon writes a cookie into the watched tree and waits on a condition variable until the event thread reports it. Git's source comment calls this "an infinite wait", says a `pthread_cond_timedwait()` version was wanted but thread-utils lacks it, and records that the author was "not really worried" after beta testing. The client calls `read_packetized_to_strbuf` with no deadline; only EOF or a read error unblocks it, and that error path prints `could not read IPC response`. One lost cookie event parks one daemon worker and one client indefinitely, and the eight IPC worker threads can all be parked this way, after which `status` and `stop` stop answering too. [SOURCE: builtin/fsmonitor--daemon.c:198-207 (git v2.50.1)] [SOURCE: compat/simple-ipc/ipc-unix-socket.c:210-213 (git v2.50.1)]

**4.5 Repository: the hook sets no ceiling.** `generate-leaf-manifest.cjs:129` runs `spawnSync('git', ['check-ignore', '-z', '--stdin'], { cwd, input, encoding })` with no `timeout` and no `-c core.fsmonitor=false`, once per skill root, reached from `ci-skill-root-metadata.cjs` in the pre-push gate. The fallback at line 136 runs only on a returned error or an unexpected exit status, so it cannot rescue a hang. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:51]

---

## 5. Answers to the five questions

### Q1. What unset `speckit.worktreeBase` and removed the reaper's daemon handling, and does anything still create worktrees under `.worktrees/` by default?

Two unrelated events, and yes.

- Commit `3c7c3f83874` (2026-09-03, "refactor(runtime): remove the memory launcher, plugin, hooks and the tool-ownership commit gate") removed the reaper's `--reap-daemons` option and its orphan-daemon reporting. The removed code matched only `node … context-server.js` processes, the retired spec-memory MCP servers. It never matched `git fsmonitor--daemon`. The `.opencode` to `.skilled` move (`330427cf30`, 2026-09-17) did not touch it. [SOURCE: git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh]
- `speckit.worktreeBase` is unversioned local config, so no commit unset it, and which action did is UNKNOWN. What keeps re-creating the in-checkout layout is `.skilled/bin/worktree-session.sh:293-294`: whenever the key is unset, it writes whatever base it resolved into `.git/config`, and `_wn_base_dir()` resolves to `<toplevel>/.worktrees` by default. One launch without `SPECKIT_WORKTREE_BASE` therefore pins the in-checkout default permanently. That write-back arrived in `f83952c3a94` (2026-09-11), three weeks after the base became configurable in `a69a621a39a` (2026-08-21). [SOURCE: .skilled/bin/worktree-session.sh:293] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:68]

### Q2. What is git 2.50.1's daemon lifecycle on macOS?

There is no idle shutdown and no self-exit.

- The manual describes the daemon only as long running, with `start`, `run`, `stop` and `status`. It documents no idle timeout and no lifetime bound. [SOURCE: man git-fsmonitor--daemon (Git 2.50.1)]
- `fsmonitor.socketDir` only relocates the socket when `.git` or `$HOME` is on a network mount, and has no bearing on lifecycle. [SOURCE: man git-fsmonitor--daemon (Git 2.50.1)]
- The macOS health thread is an empty stub (4.3).
- `git fsmonitor--daemon stop` sends `quit` and then polls the daemon's state every 50 ms with no deadline, so it hangs on a wedged daemon, as observed. [SOURCE: builtin/fsmonitor--daemon.c:84-101 (git v2.50.1)]
- `fsmonitor.starttimeout` (60 seconds by default) bounds startup only. [SOURCE: builtin/fsmonitor--daemon.c:35-39 (git v2.50.1)]

### Q3. Is event overload the cause, or a known daemon deadlock?

The defect is an acknowledged unbounded wait, and event volume is the likely trigger.

- The infinite wait and the deadline-free client read are in git's source (4.4).
- `--ipc-threads=8` is git's compiled default for `fsmonitor.ipcthreads`, and this checkout sets no `fsmonitor.*` key. It raises how many clients can be parked, but it is not the cause. [SOURCE: builtin/fsmonitor--daemon.c:36 (git v2.50.1)]
- The git 2.51, 2.52 and 2.53 release notes carry no fsmonitor entry, so upgrading git is not a fix path. [SOURCE: Documentation/RelNotes/2.51.0.adoc]
- That a lost cookie event under load is the actual trigger is INFERRED. Section 10 names the check that would confirm it.

### Q4. Which call sites run git without a timeout, and which should opt out of fsmonitor?

The proven hung site is `generate-leaf-manifest.cjs:129` (4.5). Close siblings need the same change:

| File | Call | Timeout | fsmonitor opt-out |
|---|---|---|---|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168` | `check-ignore --stdin -z` | none | none |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:73` | `check-ignore -q` | none | none |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:885` | `status --porcelain` | none | none |
| `.skilled/commands/doctor/scripts/git-hook-gates.cjs:180` | `execFileSync('git', …)` | none | not index-reading |
| `.skilled/skills/sk-git/scripts/validate-message.mjs:88` | `execFileSync('git', …)` | none | runs inside the message gate |

The rule: every index-reading git call in automation (`check-ignore`, `status`, `ls-files`, `diff` against the work tree) gets both a timeout and `-c core.fsmonitor=false`. Commands that never read the index (`rev-parse`, `log`, `show`, `cat-file`) need only a timeout when they run inside a gate. Both conventions already exist in the repository: `GIT_NO_FSMONITOR = ['-c', 'core.fsmonitor=false']` in `check-source-tags-helper.mjs:53`, `cite-drift-scan.mjs:145` and `continuity-freshness.ts:38`, and timeouts in `message-contract.mjs` and `git-message-gate.mjs`. The hung path simply never adopted them. About 59 files under `.skilled` spawn git, and this inventory is a bounded sample, not an exhaustive audit. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:53] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:145]

### Q5. What is the safest default?

fsmonitor stays on, with worktrees outside the checkout, plus a ceiling on every automated git call and a reaper.

- Relocation removes the trigger (the main daemon's event volume from 2 million worktree files) instead of masking it, and keeps fsmonitor's benefit on the 570,000-file checkout.
- Turning fsmonitor off for the main checkout only needs `extensions.worktreeConfig=true` plus `git config --worktree core.fsmonitor false`. `extensions.worktreeConfig` is not set today. This is the fallback if relocation cannot be held, not the default.
- Turning fsmonitor off globally is the last resort. It gives up the benefit and leaves no daemon to wedge, but that also means slower status on the large checkout.
- Under every option the hook ceiling is still required, because a worktree's own daemon can wedge its own commands.

---

## 6. Fix design

Four layers, cheapest first. Each removes part of the recurrence on its own. They map onto the packet's phases.

### Layer 1: bound the gate (phase 004)

- `generate-leaf-manifest.cjs:129`: add a `timeout` (about 20 seconds) and prepend `GIT_NO_FSMONITOR` to the arguments, the same shape as the three existing modules. A timeout makes `spawnSync` return an `error`, which the existing `fallbackIgnored` path already handles.
- Apply the same pair to `regenerate-skill-derived.cjs:73`, `verify-router-sync.cjs:168` and `behavior-bench-run.cjs:885`.
- Acceptance: with the main daemon stopped by `SIGSTOP`, the pre-push skill gate completes within its timeout and warns instead of blocking, and the manifest bytes are unchanged when git answers normally.

### Layer 2: restore the topology and remove the silent re-pin (phase 002)

- Change the write-back at `.skilled/bin/worktree-session.sh:293-294` so it only persists a base that was chosen explicitly (the environment variable or a flag). A launch that falls through to the default must not write config. It should log that the in-checkout default is in effect.
- Set `speckit.worktreeBase` to a location outside the checkout and move the worktrees there with `git worktree move` and `git worktree repair`.
- Add a doctor check that warns when the resolved base is inside the checkout and more than a few worktrees exist, naming the file-count cost.
- Acceptance: a launch without the environment variable leaves `speckit.worktreeBase` unset or unchanged, and a fresh worktree lands outside the checkout. `.skilled/bin/tests/worktree-session.test.sh` currently asserts the write-back behaviour, so it changes with this layer. [SOURCE: .skilled/bin/tests/worktree-session.test.sh:147]

### Layer 3: reap daemons deterministically (phase 003)

- A new entry point, kept apart from `worktree-reaper.sh` so that script's documented promise never to signal a process stays true. [SOURCE: .skilled/bin/README.md:168]
- Attribution: every daemon's command line is identical (`run --detach --ipc-threads=8`), so the command line cannot identify the worktree. Resolve each daemon from the socket it holds: the main daemon holds `.git/fsmonitor--daemon.ipc`, and a worktree daemon holds the socket under its own `.git/worktrees/<name>/` directory.
- Classification: keep a daemon whose worktree appears in `git worktree list --porcelain`. Treat a daemon whose worktree is gone, or whose socket file is unlinked, as a stray.
- Escalation: `git fsmonitor--daemon stop` under a short timeout, then `SIGTERM`, then `SIGKILL` after a bounded wait, because `stop` alone polls forever on a wedged daemon.
- Triggers: before every `git worktree remove`, from the doctor, and by hand.
- Acceptance: after a worktree is removed its daemon is gone within the bounded window, and the reaper never touches a daemon whose worktree is live.

### Layer 4: detect and recover from a wedge (phase 003, same script)

- Probe: run an index-reading git command against the daemon under a timeout (about 10 seconds). A timeout identifies a wedged daemon for that worktree.
- Recovery: end that daemon by its socket attribution and let git start a fresh one on the next command.
- Acceptance: a daemon stopped with `SIGSTOP` is replaced within one probe interval, and the probe never runs past its own timeout.
- A cold daemon on this tree answered slowly (about 10 seconds a call), so the probe must only act on strays and provable wedges, never on a merely slow daemon.

---

## 7. Prevention invariants

1. No automated git call waits without a ceiling.
2. No index-reading git call in repository tooling runs without `-c core.fsmonitor=false`, unless it deliberately measures fsmonitor behaviour.
3. Worktrees for this repository live outside the checkout, and the base is only written to config when a person or an explicit flag chose it.
4. No daemon outlives its worktree, enforced at removal and not only by a periodic sweep.
5. A wedged daemon is released by ending the process, never by asking it to stop.

---

## 8. Risks and limitations

- The call-site inventory is a bounded sample of the roughly 59 git-spawning files, and covers JavaScript and TypeScript spawn patterns only, not every shell `git` line in `.skilled/scripts/git-hooks/`.
- Socket attribution was checked for the main daemon and some worktree daemons, not as a full census of every PID.
- `extensions.worktreeConfig` was not exercised live.
- fsmonitor's actual status-time benefit in this checkout was not measured, because measuring it would write the index.
- The two complete lanes share framing (section 3), so their agreement counts as one line of evidence with a second reader, not two.

---

## 9. Verified by the orchestrator

These were checked directly in this session, outside both lanes:

- The reaper commit `3c7c3f83874` removed `--reap-daemons` and orphan reporting that matched `*node*context-server.js*`. [SOURCE: git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh]
- `worktree-session.sh` writes the resolved base into `.git/config` whenever `speckit.worktreeBase` is unset. [SOURCE: .skilled/bin/worktree-session.sh:293]
- `GIT_NO_FSMONITOR` exists in three modules, and `generate-leaf-manifest.cjs:129` uses neither it nor a timeout.
- In git v2.50.1, `fsm-health-darwin.c` is 24 lines of empty functions, `fsmonitor--daemon.c:198-207` carries the "infinite wait" comment, and `ipc-unix-socket.c:210-213` reads the reply with no deadline and prints `could not read IPC response` on error.

---

## 10. Unverified items and their resolving checks

| Item | Status | Resolving check |
|---|---|---|
| Whether a lost cookie event under load is the actual trigger | INFERRED | Run a daemon with `GIT_TRACE_FSMONITOR=1` during a heavy install in a nested worktree, then repeat with the worktree outside the checkout |
| Why daemon 17228 exited at about 09:17 | UNKNOWN | The unified log or `~/Library/Logs/DiagnosticReports` entry for that PID |
| Which action unset `speckit.worktreeBase` | UNKNOWN | A backup copy of `.git/config`, or shell history from the session that ran the unset |
| Shell-level git calls in hook scripts | PARTIAL | A line-by-line read of `.skilled/scripts/git-hooks/*` |
| fsmonitor's status-time benefit here | UNMEASURED | `git status` timing with and without fsmonitor in a scratch clone |

---

## 11. Eliminated Alternatives

- **Restore the reaper's removed daemon handling.** It matched MCP `context-server.js` daemons only, and the current reaper promises never to signal a process.
- **Identify daemons by command line.** Every daemon's arguments are identical, so the socket is the only attribution key.
- **Use `git fsmonitor--daemon stop` as the reaper's only escalation.** It polls forever on exactly the daemon a reaper must remove.
- **Upgrade git.** The 2.51 to 2.53 release notes carry no fsmonitor fix, and 2.50.1 still has the unbounded wait.
- **Treat `--ipc-threads=8` as the cause.** It is git's compiled default and only multiplies how many clients can be parked.
- **Restart the daemon as the fix.** Three fresh daemons wedged on the same morning.
- **Disable fsmonitor everywhere.** Kept as the last resort rather than ruled out, because it gives up a real benefit on a 570,000-file checkout.

---

## 12. Divergence Map

- Saturated directions: none.
- Pivots taken: none. Both complete lanes followed the question order (regression, then daemon lifecycle, then repository call sites).
- Failed pivots and audited overrides: none.
- Council or pivot artifacts: none.
- Remaining frontier: the measurements in section 10, and the implementation of the four layers in phases 002, 003 and 004.

---

## 13. Open Questions

1. Should the gate ceiling be a timeout, the fsmonitor opt-out, or both? The recommendation is both, because the timeout also covers hangs that have nothing to do with fsmonitor.
2. Should the write-back persist only an explicitly chosen base, or should this repository's default base move outside the checkout?
3. Should the fsmonitor reaper be a separate script or a clearly separated mode of `worktree-reaper.sh`? The recommendation is a separate script, to keep the existing script's never-signal promise intact.
4. After relocation, should the main checkout keep fsmonitor, or opt out as a second safeguard?

---

## 14. References

- `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md`: the symptom record and the five questions.
- `specs/sk-git/026-worktree-hygiene-and-relocation/implementation-summary.md`: the original relocation, fsmonitor enablement and reaper work.
- `research/resource-map.md`: the merged resource map across all lanes.
- `research/fanout-attribution.md`: which lane contributed what.
- `research/lineages/llmgateway-flash-1017/research.md` and `research/lineages/llmgateway-flash-undated-run2/research.md`: the two lane syntheses.
- git v2.50.1 sources: `builtin/fsmonitor--daemon.c`, `compat/fsmonitor/fsm-health-darwin.c`, `compat/simple-ipc/ipc-unix-socket.c`.

---

## Appendix A: Convergence Report

- Stop reason: maxIterationsReached (stop policy `max-iterations`, convergence treated as telemetry).
- Total iterations: 7 across three lanes (3, 1 and 3).
- Questions answered: 5 of 5.
- Remaining questions: none of the packet's five. Section 13 lists the implementation questions they raised.
- Last iteration ratios: 0.80 (`llmgateway-flash-1017` iteration 3), 0.92 (`llmgateway-flash-undated` iteration 1), 0.90 (`llmgateway-flash-undated-run2` iteration 3).
- Convergence threshold: 0.05.
- Divergence summary: no divergent pivots recorded.
