---
title: "Session-relaunch hand-over gaps: verification of the 2026-11-13 gap report"
trigger_phrases:
  - "hand-over gap report verification"
  - "running workers at hand-over"
  - "session name across a hop"
  - "state a session hop drops"
---
# Session-relaunch hand-over gaps: verification of the 2026-11-13 gap report

<!-- ANCHOR:deep-research-handover-gaps -->

Synthesis of a three-iteration deep-research run over `scratch/handover-gaps-research-2026-11-13.md`. Each iteration read the code the report cites and each runtime's own `--help` output. No runtime session was started and no session-relaunch command was run, so every claim about what happens at run time is read from code, help output, SDK types or vendor documentation, never observed.

## 1. Executive Summary

The report holds up. Every gap it names is confirmed in the code, with nine wrong or weak citations and two wrong labels. The run closed five of its seven UNCONFIRMED items and found five gaps the report did not have.

1. **Fan-out lineages are the worst loss.** A hop ends the runtime, the detached lineages keep running, and a re-run of the same command requeues them while they are alive. `markOrphanedLineages` has no process check, so two writers can share one lineage directory.
2. **A detached CLI worker is invisible at hand-over.** `prepare` sees only a shell that is a direct child of the runtime, the killer signals one pid, and the note has no line for a running worker. The receiver re-runs the active command blind.
3. **Only Claude and Pi can be named at launch.** The other four runtimes' help has no name flag. OpenCode can be titled through the plugin SDK. Codex, Cursor and Devin cannot be named by any launch flag.
4. **A Claude `/rename` is readable.** It is a `custom-title` transcript entry, and `prepare` already tails that transcript for model and effort.
5. **Crons and wakeups end with the session.** Claude's documentation says scheduled tasks are session-scoped, and a hop never resumes a session. The Stop payload already lists them in `session_crons`, which the adapter ignores.

None of the report's nine changes is already shipped. The re-ranked list in section 9 has fourteen changes, nine of them small.

## 2. Scope, Method and Terms

- **In scope:** the three sections of the report (running workers, session names, other dropped state), its nine ranked changes, and the README check its brief asked for.
- **Evidence used:** repository code and tests, `command <binary> --help` for claude, pi, opencode, codex, cursor-agent and devin, the installed OpenCode SDK types under `.opencode/node_modules`, entry types and key names in existing Claude session logs (no message content), and one vendor page, the Claude Code scheduled-tasks documentation.
- **Not done:** no runtime session was started, and `prepare`, `claim`, `keep`, `cancel` and `complete` were not run. Nothing was committed or pushed.
- **Verdict words:** CONFIRMED means the cited code or help line says it. REFUTED means it says otherwise. UNCONFIRMED means no read-only evidence settles it, and the missing evidence is named.
- **A hop** is one relaunch: the sender writes a note, `prepare` records it, a killer ends the idle runtime and the wrapper starts a receiver that claims the note.

## 3. Running Workers at Hand-over (report section 2)

<!-- ANCHOR:findings -->

### Claude background tasks: CONFIRMED

The Stop hook defers the hop while `payload.background_tasks` is non-empty and prints nothing. [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:119] [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:135] Its only trace is a log line. A task that never ends parks the hop with no notice. The report missed one mitigation: a prompt from the operator withdraws a deferred record, so the hop is not stuck once the operator types. [SOURCE: .skilled/hooks/session-relaunch/README.md:126]

### Claude foreground sub-agents: CONFIRMED, guard understated

The guard denies seven commands from a sub-agent, not only `prepare` and `claim`. [SOURCE: .skilled/hooks/session-relaunch/README.md:211] [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:73] Nothing is lost here and no change is needed.

### OpenCode task sessions: CONFIRMED in code, one item narrowed

Child sessions are put in a skip set that holds no busy or idle state, and every later event for them is dropped. [SOURCE: .opencode/plugins/session-relaunch.js:335] [SOURCE: .opencode/plugins/session-relaunch.js:341] The parent arms on `session.idle` with no child check. [SOURCE: .opencode/plugins/session-relaunch.js:418] The killer then waits three seconds, a figure that comes from `DEFAULT_IDLE_MS`, not from the README line the report cites. [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:28]

Whether a child can still run when the parent goes idle was UNCONFIRMED and is now narrowed. The installed SDK documents a call that detaches blocking sub-agents and continues them in the background. [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/sdk.gen.js:284] So OpenCode supports a child that outlives the parent's turn. That the parent's `session.idle` fires while such a child is busy is inferred, not traced. Missing evidence: an event trace on OpenCode 2.2.7 with a backgrounded sub-agent.

### External CLI workers: CONFIRMED, orphan claim still inferred

`prepare` refuses only for a direct child of the runtime whose command is a known shell. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:277] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:280] The README states the limit: any other child program is not detected. [SOURCE: .skilled/hooks/session-relaunch/README.md:124] The dispatch skills prescribe starting workers with `&`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:213] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:258] The killer signals one pid, not a process group. [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:796] The nudge asks only for an `Active command:` line. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:183]

Nothing in the hop path signals a `&` worker, so it survives the runtime. That is still an inference from the code. Missing evidence: the process table after a hop that left a `&` child running.

### Fan-out lineages: CONFIRMED, pid-liveness item resolved

Lineages spawn detached, each in its own process group. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2113] They are killed by group only from the runner's SIGINT and SIGTERM handlers. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:348] The killer never signals the runner. The nudge tells the session to release the deep-loop lock before `prepare` and says nothing about stopping the runner. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:199]

The report asked whether `markOrphanedLineages` checks that a process is alive. It does not. The function lives in `fanout-pool.cjs`, not `fanout-run.cjs`, and builds its list from the ledger alone: a label with a `started` event and no later `completed`, `failed` or `orphan_requeued` counts as orphaned. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:284] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:307] A re-run calls it before spawning. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3520] A lineage that is still running is therefore requeued, and the stored session id is reused, which gives two writers in one lineage directory.

The `started` event carries no pid, because it fires before the spawn. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:369] A liveness check must read the pid from the pool's later liveness records or from a new event written after the spawn.

## 4. Session Names Across a Hop (report section 3)

### What the wrapper does today: CONFIRMED

The wrapper captures `-n/--name` into `SKILLED_LOOP_NAME` on every runtime, replays it for Claude and Pi, and strips it for the other four. [SOURCE: .skilled/bin/skilled-loop:775] [SOURCE: .skilled/bin/skilled-loop:616] [SOURCE: .skilled/bin/skilled-loop:631] [SOURCE: .skilled/bin/skilled-loop:940] `prepare` takes the name from the environment only. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:560] `consume` returns `name`, but the wrapper reads only model, provider and effort from it. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:641] [SOURCE: .skilled/bin/skilled-loop:1226] So the record carries a name on all six runtimes and nothing reads it back.

### What each runtime's help offers: resolved

| Runtime | Launch name flag | Help line or reason |
|---|---|---|
| claude | yes | `-n, --name <name>   Set a display name for this session` |
| pi | yes | `--name, -n <name>   Set session display name` |
| opencode | no on the root command | `--title string   Session title` exists on `opencode run` only, and a hop starts the root command with `--prompt` [SOURCE: .skilled/bin/skilled-loop:647] |
| codex | no | Sessions have names (`Session id (UUID) or session name` in `codex resume --help`), but no flag sets one |
| cursor-agent | no | `-w, --worktree [name]` names a worktree, not a session |
| devin | no | Sessions have names (`rm   Delete a session by id or name`), but no flag sets one |

The wrapper lists `-n/--name` for codex, cursor, devin and opencode, under a comment that says the lists follow each runtime's help. [SOURCE: .skilled/bin/skilled-loop:477] [SOURCE: .skilled/bin/skilled-loop:495] Their help has no such flag. The effect on a hop is harmless, because the option is stripped. Whether a first launch that passes `-n` to one of these runtimes fails was not tested.

### A Claude `/rename`: resolved

A rename writes a `custom-title` entry with keys `customTitle`, `sessionId` and `type`, paired with an `agent-name` entry. An `ai-title` entry type also exists. These were read from existing session logs by entry type and key name only. `prepare` already tails the Claude transcript for model and effort in `readClaudeSettings`, so the same pass can take the last `customTitle`. [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:229] Whether a launch `--name` alone writes a `custom-title` entry is UNCONFIRMED. Missing evidence: a log from a session started with `--name` and never renamed.

### Pi and OpenCode live names

Pi's event carries a `sessionName` field, and the adapter's arm settings do not read it. [SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/pi-assistant-message-end.json:9] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:423]

An OpenCode plugin can set a title. The installed SDK types the session update with `title?: string`. [SOURCE: .opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts:1916] Other plugins in this repository already call `client.session`. [SOURCE: .opencode/plugins/ask-surface-guard.js:80] The installed SDK is 1.18.34 and the runtime is 2.2.7, so one live call is needed before relying on it.

## 5. Other Dropped State (report section 4)

### Permission mode: CONFIRMED

The Stop payload carries `permission_mode`. [SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json:6] The record has no field for it, the arm path copies only model, provider and effort, and Claude's Stop hook calls `arm` with no settings. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:946] [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1011] [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:152] A session moved into another mode restarts in the launch mode.

Only Claude can replay a stamped mode today. It has `--permission-mode <mode>`, with `plan` among its values, and an arm event that can stamp it. Codex reports `permission_mode` but its flags are `-s` and `-a`, and the mapping between them is UNCONFIRMED. Cursor and Devin have mode flags but never arm. OpenCode's root command has only `--auto`.

### The report's summary of the record: REFUTED in part

The report says the record carries cwd, model, effort and goal only. It also carries `name` and `hops`, and `provider` on Pi. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:953] [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:955] It does not carry the goal, only a `goalSwitch` boolean. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:961] The goal packet travels in the note. The report's conclusion stands: everything else reverts to the first launch's flags.

### Pi mode flags: CONFIRMED, one label wrong

`--plan` and `--build` replay from launch only. [SOURCE: .skilled/bin/skilled-loop:545] `--approve` is not a mode flag. Pi's help reads `--approve, -a   Trust project-local files for this run`. Both mode flags come from an extension. Whether the relaunch extension can read that extension's live state is UNCONFIRMED. Missing evidence: the plan-mode extension's source or Pi's API for reading another extension's state.

### Added directories: CONFIRMED, citation incomplete

Only the launch `--add-dir` is replayed, and no adapter reads a later addition. [SOURCE: .skilled/bin/skilled-loop:480] [SOURCE: .skilled/bin/skilled-loop:943] The report cites Claude only. The wrapper also replays `--add-dir` for Codex and Cursor. [SOURCE: .skilled/bin/skilled-loop:511] [SOURCE: .skilled/bin/skilled-loop:516]

### Crons and wakeups: resolved to CONFIRMED

Claude's scheduled-tasks page says "Tasks are session-scoped" and that a self-paced `/loop` is not restored even on resume. [SOURCE: https://code.claude.com/docs/en/scheduled-tasks] A hop never resumes, because the wrapper denies `--resume` and `--continue` on replay. [SOURCE: .skilled/bin/skilled-loop:575] Every cron and wakeup the sender held is gone in the receiver.

The report's search found no adapter code that mentions crons. That holds, but it missed the test fixture: the Claude Stop payload carries `session_crons`, and the adapter ignores it. [SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json:12]

The same page says background Bash commands and monitors are not restarted even on resume. A deferred hop can therefore only wait for a background task or write it down. It cannot carry one.

### Todo list: still UNCONFIRMED

Nothing read says where Claude Code keeps its todo list or whether it survives a relaunch. Missing evidence: Claude's documentation on todo persistence, or a relaunch test with a todo written first.

<!-- /ANCHOR:findings -->

## 6. Report Accuracy

### Against the README

None of the nine ranked changes is documented as shipped. Three touch things the README already states:

- **Change 7** (scan descendants for workers) is a documented limit. [SOURCE: .skilled/hooks/session-relaunch/README.md:124]
- **Change 9** (names on the other four runtimes) is stated as scope: Claude and Pi carry their name. [SOURCE: .skilled/hooks/session-relaunch/README.md:32]
- **Change 4** (a notice for a deferred hop) is partly covered, because an operator prompt withdraws a deferred record. [SOURCE: .skilled/hooks/session-relaunch/README.md:126]

One README sentence contradicts the code. It says the name comes from the relaunch record. [SOURCE: .skilled/hooks/session-relaunch/README.md:83] The wrapper takes it from the environment. The effect is nil today, because the record's name is the same value, but the sentence would mislead whoever builds the rename carry-over.

### Wrong or weak citations in the report

1. The three-second killer wait is cited to `README.md:130`. The figure is `DEFAULT_IDLE_MS` at `lib/killer.cjs:28`.
2. The sub-agent guard is said to deny `prepare` and `claim`. It denies seven commands.
3. `codex/shared.mjs:55` is cited for a missing background check. The line is a comment that documents the absence.
4. `markOrphanedLineages` is treated as a `fanout-run.cjs` symbol. It is defined in `fanout-pool.cjs`.
5. The record's contents are listed wrongly (section 5).
6. `--approve` is called a Pi mode flag. It is a trust flag.
7. Only Claude's `--add-dir` lines are cited. Codex and Cursor replay it too.
8. The cron search missed `session_crons` in the Stop fixture.
9. The report takes the wrapper's flag lists as a stand-in for help output. Four `-n/--name` entries in those lists are not in the help.

## 7. Gaps the Report Did Not Have

1. `markOrphanedLineages` requeues a live lineage, and the `started` event has no pid to check.
2. The Claude Stop payload already names the session's crons, and nothing reads them.
3. The wrapper's option lists claim a name flag for four runtimes that have none.
4. The launch name reaches the record on all six runtimes and is read back on none.
5. The README says the name comes from the record, which the wrapper does not do.

## 8. Cross-Iteration Agreement and Conflict

The three iterations did not contradict each other. Two points changed as evidence came in:

- Iteration 1 proposed a cheap liveness fix that assumed the `started` event could carry a pid. Iteration 2 showed the event fires before the spawn, which raises that change from small to medium.
- Iteration 1 left the OpenCode child question to runtime evidence. Iteration 2 found the background call in the SDK, which makes the gap likely but still not observed.

## 9. Ranked Changes

Small means one function or line in one file. Medium means several files with no new mechanism. The sizes and the order are judgment from reading the code, by one model family. A run that shows the harm would move a change up, and a live test showing the harm cannot happen would remove it.

| Rank | Gap | Smallest change | Size | Does not cover |
|---|---|---|---|---|
| 1 | Fan-out lineages outlive the hop and are requeued alive | `lib/nudge.cjs:199-203`: the step says to stop the runner, wait for it to exit, then release the lock | small | A session that ignores the step. A runner started outside the session |
| 2 | `markOrphanedLineages` has no liveness check | `fanout-pool.cjs` `detectOrphanedLineages` (:284-305): skip a label whose latest pid-carrying liveness record answers `process.kill(pid, 0)` | medium | Pid reuse. A lineage with no liveness record yet |
| 3 | Detached CLI workers are invisible | `lib/nudge.cjs:183-185`: require a `Running workers:` line (pid, log path, collect step, or `none`), with seed text telling the receiver to check each pid before re-running the active command. Validating the line in `prepare` makes it medium | small | A worker the session does not know it started. The orphan keeps running |
| 4 | Crons and wakeups die on a hop | The same nudge block: a `Scheduled:` line the receiver recreates. `claude/stop-arm.mjs` can log `session_crons.length` | small | Exact fire times. The todo list. Runtimes other than Claude |
| 5 | Permission mode reverts | `claude/stop-arm.mjs:152` passes the payload's mode to `arm`, `relaunch-core.cjs:1011` keeps the key, `consume` prints it and `skilled-loop` replays it as `--permission-mode` | medium | Every runtime but Claude. Whether replaying `bypassPermissions` needs a second flag is UNCONFIRMED. Replaying `plan` into a receiver that must edit is a design choice |
| 6 | Claude `/rename` is lost | `lib/context-usage.cjs:229` returns the last `customTitle`, `bin/session-relaunch.cjs:560` prefers it over the environment, and `skilled-loop:1226-1252` reads `name` from `consume` | medium | Pi live names. A title older than the transcript tail |
| 7 | An OpenCode child can outlive a parent idle | `.opencode/plugins/session-relaunch.js`: keep `session.status` for child ids instead of dropping their events (:335-341), and return early at the idle arm (:418) while a child is busy | small | Children created before the plugin loaded. Needs the 2.2.7 trace |
| 8 | A deferred Claude hop gives no notice | `claude/stop-arm.mjs:119-135`: print a Stop message with the task count and `cancel` | small | Little for an operator who types, since a prompt already withdraws the record |
| 9 | The launch name has no hop suffix | `skilled-loop:616-617` and `:631-632`: append the hop count | small | A preference, not a defect. A live name from rank 6 should win |
| 10 | OpenCode drops the name | `.opencode/plugins/session-relaunch.js:407-414`: call the session update with the record's name when the seed is detected | medium | Needs one live call on 2.2.7, and the name must reach the plugin |
| 11 | The wrapper lists a name flag four runtimes lack | `skilled-loop:495-496` and `:596-597`: drop those entries, or correct the comments at :477 and :590 | small | Codex, Cursor and Devin still cannot be named |
| 12 | Added directories revert | Nudge: an `Added directories:` line the receiver re-adds | small | Runtimes with no flag or command for it |
| 13 | Pi plan or build mode reverts | `pi/session-relaunch.ts:423` adds the live mode to the arm settings | medium, blocked | Blocked on the unconfirmed extension API |
| 14 | `prepare` sees only direct shell children | `bin/session-relaunch.cjs:270-310`: walk all descendants of the runtime | medium to large | A `&` worker is reparented once its tool shell exits, so a walk misses the case it targets. This is inferred |

Against the report's nine: its change 9 splits into ranks 10 and 11, because the help output settled it. Its change 7 drops to last. Ranks 2, 4, 11 and 12 are new or raised.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| A launch name flag on Codex, Cursor, Devin or the OpenCode root command | Their help output has none | `command <binary> --help` for each | 2 |
| `opencode run --title` on a hop | A hop starts the root command with `--prompt`, not `run` | `.skilled/bin/skilled-loop:647` | 2 |
| A pid on the fan-out `started` event as a one-field fix | The event fires before the spawn, so no pid exists yet | `fanout-pool.cjs:369` | 1, 2 |
| A Claude launch flag that restores crons | None exists, and `--resume` is denied on a hop | `claude --help`, `.skilled/bin/skilled-loop:575` | 3 |
| A launch flag for added directories on OpenCode, Pi or Devin | Their help has none | `command <binary> --help` for each | 3 |
| Settling the OpenCode child question from repository code | The behaviour belongs to the OpenCode runtime | `.opencode/plugins/session-relaunch.js:158` | 1 |
| Settling todo persistence from directory names under `~/.claude` | The absence of a directory proves nothing about the list | Directory names only | 3 |
| A descendant scan as the main fix for CLI workers | A `&` worker leaves the runtime's process tree (inferred) | `bin/session-relaunch.cjs:277` | 1, 3 |

## Divergence Map

- Saturated directions: none recorded. The run used the default convergence mode, with no divergent pivot.
- Pivots taken: none. Pivot failures and audited overrides: none.
- Remaining frontier: the four items in section 12, each of which needs a live runtime or vendor documentation.

## 12. Open Questions

1. Does an OpenCode parent emit `session.idle` while a backgrounded child is busy on 2.2.7? An event trace settles it.
2. Does Claude's todo list survive a relaunch? Vendor documentation or a relaunch test settles it.
3. Can the Pi relaunch extension read the plan-mode extension's live state? That extension's source settles it.
4. Does a launch `--name` alone write a `custom-title` entry, and does replaying `bypassPermissions` need a second flag? One scratch session each settles them.
5. Does the OpenCode session update set a title on 2.2.7, given the installed SDK is 1.18.34? One live call settles it.

## 13. References

- `scratch/handover-gaps-research-2026-11-13.md` and its brief, `scratch/handover-gaps-research-brief-2026-11-13.txt`
- `research/iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`
- `research/resource-map.md` (emitted by this run)
- `.skilled/hooks/session-relaunch/` (README, `bin/`, `lib/`, `claude/`, `codex/`, `pi/`, `tests/fixtures/`)
- `.opencode/plugins/session-relaunch.js`, `.opencode/plugins/opencode-goal.js`
- `.skilled/bin/skilled-loop`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and `fanout-pool.cjs`
- https://code.claude.com/docs/en/scheduled-tasks

## 14. Answered Questions

All five key questions were answered within what read-only evidence allows.

1. Running workers: confirmed per worker kind. The pid-liveness item is resolved (no check). The OpenCode child item is narrowed. The orphan claim stays an inference.
2. Session names: confirmed per runtime, with the help line for each and the shape of a rename entry.
3. Other dropped state: confirmed, with crons and wakeups resolved from documentation and the todo list left open.
4. Report accuracy: nine wrong or weak citations, no change already shipped, one README sentence wrong.
5. Smallest changes: the fourteen-row list in section 9.

## 15. Limitations and Confidence

- **Nothing was run.** Every statement about run-time behaviour is read from code, help, types or documentation. The orphan claims in particular rest on what the code does not do.
- **One model family.** All three iterations ran on the same model. The verdicts on what the code says are factual and checkable. The sizes and the ranking are judgment and carry one lens.
- **Citations reopened by the orchestrator:** every repository `path:line` tag in sections 3 to 6 was opened a second time after the iterations returned, and the root help of all six runtimes was rerun for a name flag. Not reopened: the `opencode run --help` line, which a repository hook blocks, the other help lines quoted in sections 4 and 5, the Claude log entry shapes and the vendor page. Those rest on the iteration agents' reading alone.
- **Executor.** The run was requested on the `cli-claude-code` executor with `claude-fable-5-2` at medium effort. The orchestrating session is itself Claude Code, so the deep-loop recursion guard refused that dispatch, and a second hook refused a Fable sub-agent. The iterations ran on the native `deep-research` agent with the Opus model at medium effort. The note in `deep-research-config.json` that says the requested model was passed on the dispatch was written before the second refusal and is wrong on that point.
- **Record defects.** Iteration 3's record carries a timestamp of 09:30Z and an estimated duration. The gateway committed it at 08:15Z.

## 16. Implementation Decision

None is taken here. Packet 038 is Complete, and these changes fall outside its frozen scope, so they need a new or related packet. Ranks 1, 3 and 4 are three edits to one nudge block and one seed text, which makes them the natural first packet. Rank 2 is the only change that protects a run when the note is ignored.

<!-- /ANCHOR:deep-research-handover-gaps -->

## 17. Convergence Report

<!-- ANCHOR:convergence-report -->

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 1: running-workers section (0.75), run 2: session names with runtime help output (0.80), run 3: other dropped state, report accuracy and re-ranked changes (0.70)
- Convergence threshold: 0.05, telemetry only under stop policy `max-iterations`
- Divergence summary: no divergent pivots recorded
- Graph convergence before iteration 3 reported the stop as blocked by source-diversity and evidence-depth guards. The iteration cap ends the run regardless, and those guards are recorded here as evidence, not acted on.
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

<!-- /ANCHOR:convergence-report -->
