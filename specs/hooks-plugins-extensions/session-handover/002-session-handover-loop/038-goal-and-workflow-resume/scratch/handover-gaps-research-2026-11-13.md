## Context Package: Session-relaunch hand-over gaps (Q1–Q3)

### Memory Context
- The packet folder holds `spec.md`, `goal.md`, `description.json` and `graph-metadata.json`, with no `handover.md`; I read none of them, since this is a code review.

**1. Verdict**
- Q1: Only Claude background tasks defer a hop; detached CLI workers and fan-out lineages are invisible to it, and the note has no field for a running worker, so the receiver re-runs `Active command:` blind.
- Q2: A launch `--name` is replayed unchanged on Claude and Pi and dropped on the other four; a mid-session rename is carried nowhere; a hop-count suffix is a one-line wrapper change for Claude and Pi.
- Q3: The record carries cwd, model, effort and goal only, so anything else changed mid-session reverts to the first launch's flags.

### Codebase Findings

**2. Q1**
- **Claude background tasks.**
  - Today: Stop defers on non-empty `payload.background_tasks`, stamps `deferredAt` and exits with no output (`claude/stop-arm.mjs:119-135`, `:39-41`). A pending record also silences nudges (`README.md:132`).
  - Lost: nothing is killed, but a task that never ends parks the hop with no operator notice.
  - Fix (small): print a Stop message naming the blocking task count and `cancel`.
- **Claude foreground sub-agents.**
  - Today: the nudge is silent for `agent_id` calls and the guard denies `prepare` and `claim` from them (`README.md:132`, `:211`; `claude/subagent-guard.mjs:73-74`).
  - Lost: nothing confirmed. Fix: none.
- **OpenCode task sessions.**
  - Today: children are skipped for nudge, seed and arm (`.opencode/plugins/session-relaunch.js:302-341`). The parent arms on `session.idle` with no child check (`:418-437`), and the killer waits 3 s with no transcript (`README.md:130`).
  - Lost: a child still running at parent idle would die unreported. UNCONFIRMED that this can happen; an event trace with a live child would confirm it.
  - Fix (small): skip the arm while a tracked child is busy.
- **External CLI workers.**
  - Today: `prepare` refuses only for a live shell child of the runtime, inside the loop (`bin/session-relaunch.cjs:270-310`, `:524`). The `&` pattern the skills prescribe is not seen (`cli-codex/SKILL.md:213`, `cli-devin/SKILL.md:258`; `README.md:124`). The killer signals one pid, not a group (`lib/killer.cjs:796`), and the Codex adapters have no background check (`codex/shared.mjs:55`).
  - Lost: the worker survives as an orphan (inferred, not observed) and its log path dies with the sender. The nudge asks only for `Active command:` (`lib/nudge.cjs:183-185`); `commands/speckit/handoff.md:132` mentions "running processes" in prose only.
  - Duplicated: the receiver re-runs the command (`README.md:160`) beside the orphan.
  - Fix (small): a required `Running workers:` line (pid, log path, collect step, or `none`) that `prepare` validates, plus seed text to check each pid before re-dispatching.
- **Fan-out lineages.**
  - Today: lineages spawn detached (`fanout-run.cjs:2113`) and die by process group only when the runner gets SIGINT or SIGTERM (`:348-351`, `:589-593`, `:715-730`). The killer never signals the runner. The nudge says to release the deep-loop lock before `prepare` (`lib/nudge.cjs:199-203`), which frees it while lineages may still run.
  - Lost or duplicated: a re-run requeues orphans (`:3520`, `:386`) and reuses the stored session id (`:631-646`), giving two writers per lineage directory. UNCONFIRMED whether `markOrphanedLineages` checks pid liveness; reading its definition would confirm.
  - Fix (small): change the nudge step to "stop the runner, wait for exit, then release".

**3. Q2**
- **Claude.**
  - Today: `-n/--name` is captured (`skilled-loop:775-787`) and replayed verbatim (`:616-617`). `/rename` is not read: `prepare` takes the name from the environment (`bin/session-relaunch.cjs:560`). `consume` returns `name` (`:641`), but the wrapper reads only model, provider and effort (`skilled-loop:1226-1252`).
  - Possible: yes for a launch name. For `/rename`, the log entry shape is UNCONFIRMED; renaming a scratch session and reading its JSONL would confirm.
  - Where: `build_relaunch_arguments`, `skilled-loop:616`, appending ` (hops+1)` in hop mode.
- **Pi.**
  - Today: same replay (`:631-632`). The adapter does not read a live name, though the fixture shows a `sessionName` field (`tests/fixtures/pi-assistant-message-end.json:9`).
  - Possible: yes. Where: `:631`, with the live name going in the arm `settings` beside model and thinking (`README.md:42`).
- **OpenCode, Codex, Cursor, Devin.**
  - Today: `-n/--name` is classed value-taking and record-backed (`skilled-loop:495-496`, `:596-597`), so it is stripped from replay (`:940`) and no arm re-adds it (`:637-674`). The name is dropped.
  - Possible: UNCONFIRMED whether any of the four accepts a name flag; each `--help` would confirm.
  - Where: OpenCode would need the plugin to set the title where it detects the seed (`plugin:407-414`); that API is UNCONFIRMED. Cursor and Devin never auto-relaunch (`README.md:58`), so only the manual template could carry it. A runtime with no flag or hook gets nothing.

**4. Q3**
- **Permission mode.** Payloads carry `permission_mode` (`tests/fixtures/payload-stop.json:6`, `codex-stop.json:8`), but the record stores no such field (`lib/relaunch-core.cjs:946-962`). Only the launch flag is replayed (`skilled-loop:488`), so a session moved into plan mode restarts in the launch mode. Fix: stamp it at arm and substitute it on replay.
- **Pi mode flags.** `--plan`, `--build` and `--approve` are replayed from launch only (`skilled-loop:545-546`). Fix: add them to the arm `settings`.
- **Added directories.** Only the launch `--add-dir` is replayed (`skilled-loop:480`, `:943`); no adapter reads later additions. Fix: an `Added directories:` note line the seed tells the receiver to re-add.
- **Wakeups, crons, todo list.** The nudge names only `Active command:` and the goal (`lib/nudge.cjs:166-186`), and a search for `cron`, `wakeup` and `todo` in `lib`, `bin`, `claude`, `codex` and `pi` matched nothing. That these end with the session is UNCONFIRMED. Fix: a `Scheduled:` note line.

### Pattern Analysis
- Live state reaches the record only where an adapter writes it at `prepare` or arm (model, effort, cwd, goal). Everything else comes from the first launch's flags (`README.md:36`, `skilled-loop:590-602`).
- Worker safety rests on three separate guards: the shell-child check, Claude's `background_tasks` and the idle wait.

### Nested Dispatch Status
- Status: `_No sub-agents dispatched (policy)_`
- Boundary: no delegation or mutation was requested, and nothing was written.

### Gaps & Unknowns
- Bash is denied to this agent, so no `<runtime> --help` was run. Every flag statement comes from the wrapper's own lists, not from help output.
- Not read: `withdraw.cjs`, `goal-handover.cjs`, the Pi adapter body, the `cli-*` reference files and the definition of `markOrphanedLineages`.
- Risk: the orphan claims in Q1 are inferred from the single-pid signal; no run observed them.

### Recommendation
- **Verdict**: proceed.

**5. Ranked changes**
1. Add the `Running workers:` note line and the receiver's pid check — small.
2. Change the fan-out nudge step to stop the runner before releasing the lock — small.
3. Add the hop-count suffix to the Claude and Pi name — small.
4. Print a notice when a Claude hop is deferred — small.
5. Put permission mode and the Pi mode flags on the record — medium.
6. Carry the live name on the record and have the wrapper read `consume`'s `name` — medium.
7. Make `prepare` scan runtime descendants for CLI workers and `fanout-run.cjs` — medium.
8. Check OpenCode children before arming, once the need is confirmed — small.
9. Carry names on OpenCode, Codex, Cursor and Devin — large, blocked on the help output.

- **Suggested next**: have the orchestrator run each runtime's `--help` to settle the Q2 unknowns before item 9.
