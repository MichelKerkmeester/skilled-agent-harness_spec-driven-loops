# Iteration 3: Other dropped state (Q3), report accuracy against the README (Q4), smallest changes and re-rank (Q5)

## Focus
Part (a): check every claim and path:line in the report's section 4 (`scratch/handover-gaps-research-2026-11-13.md:48-52`), plus the one-line Q3 verdict at :9. Settle whether scheduled wakeups, crons and the todo list end with the session, and check which runtimes' help offers a launch flag for permission mode, plan mode and added directories. Part (b): read `.skilled/hooks/session-relaunch/README.md` in full (370 lines), map the report's nine ranked changes (:70-79) against it, and collect every wrong citation from iterations 1 to 3. Part (c): name the smallest change per confirmed gap and re-rank.

## Actions Taken
1. Read the prompt pack, config, strategy questions, the report (1-81) and iterations 1 and 2.
2. Opened `tests/fixtures/payload-stop.json` 1-12, `tests/fixtures/codex-stop.json` 1-11, `lib/relaunch-core.cjs` 940-965 and 992-1030, `.skilled/bin/skilled-loop` 476-602 and 936-948, `lib/nudge.cjs` 160-190, `claude/stop-arm.mjs` 136-160 and `bin/session-relaunch.cjs` 630-648.
3. Grepped `lib`, `bin`, `claude`, `codex`, `pi` and the OpenCode plugin for `cron|wakeup|todo|permission_mode|permissionMode|add-dir|addDir`; then grepped the whole session-relaunch tree for `session_crons|background_tasks|permission_mode`.
4. Ran `command <binary> --help </dev/null` for claude, pi, opencode, codex, cursor-agent and devin, grepped for permission, plan, directory, schedule and todo words. All six exited 0.
5. Listed directory and file names under `~/.claude` (no content read), and checked for a project `.claude/scheduled_tasks.json`.
6. Searched the web once and fetched the official Claude Code scheduled-tasks page.
7. Read the README in full.

## Findings

### (a) Other dropped state, report section 4

1. **Permission mode, CONFIRMED.** Both fixtures carry `permission_mode`. [SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json:6] [SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/codex-stop.json:8] The record `preparePending` writes has no permission field. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:946] [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:962] The arm path copies only `model`, `provider` and `effort` from its settings. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1011] Claude's Stop calls `arm` with no settings at all. [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:152] `claude:--permission-mode` is a value-taking replay option [SOURCE: .skilled/bin/skilled-loop:488] and not record-backed [SOURCE: .skilled/bin/skilled-loop:593], so the launch value is replayed and a mid-session switch is lost. The grep for `permission_mode` matched only test files, never adapter code.
2. **Q3 verdict line at report :9, REFUTED in part.** It says the record carries "cwd, model, effort and goal only". The record also carries `name` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:953], `hops` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:955], and the Pi arm adds `provider` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1011]. It does not carry the goal: only a boolean `goalSwitch` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:961]. The goal packet travels in the note's `goal_packet` field. [SOURCE: .skilled/hooks/session-relaunch/README.md:169] The conclusion "anything else reverts to the first launch's flags" stands.
3. **Pi mode flags, CONFIRMED for the code, REFUTED in one label.** `--approve`, `--build` and `--plan` are no-value options [SOURCE: .skilled/bin/skilled-loop:545] [SOURCE: .skilled/bin/skilled-loop:546] that are not record-backed [SOURCE: .skilled/bin/skilled-loop:594], so they replay from launch only. `--approve` is not a mode flag: Pi's help reads `--approve, -a                  Trust project-local files for this run`. `--plan` and `--build` come from an extension: `Extensions can register additional flags (e.g., --plan from plan-mode extension).`, `--plan                      Start in Plan mode`, `--build                     Start in Build mode`. Whether the relaunch extension can read the plan-mode extension's live state is UNCONFIRMED. The missing evidence is the plan-mode extension's source or Pi's extension API for reading another extension's mode.
4. **Added directories, CONFIRMED, citation incomplete.** `claude:--add-dir` is value-taking [SOURCE: .skilled/bin/skilled-loop:480] and many-valued on replay [SOURCE: .skilled/bin/skilled-loop:943]. The grep for `add-dir|addDir` in adapter code matched nothing, so no adapter reads a later addition. The report misses that the wrapper also replays `codex:--add-dir` [SOURCE: .skilled/bin/skilled-loop:511] and `cursor:--add-dir` [SOURCE: .skilled/bin/skilled-loop:516].
5. **Grep for cron, wakeup and todo, CONFIRMED, but the report missed one hit.** No adapter, `lib` or `bin` file mentions them. The Claude Stop fixture does carry `"session_crons": []` [SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json:12], so Claude's Stop payload names the session's crons, and `stop-arm.mjs` ignores the field: its only payload array check is `background_tasks`. [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:120]
6. **Crons and wakeups end with the session, RESOLVED to CONFIRMED (was UNCONFIRMED).** The official page says: "Tasks are session-scoped." and "Tasks only fire while Claude Code is running and idle. Closing the terminal or letting the session exit stops them firing." It also says `--resume` or `--continue` restores `CronCreate` tasks, but "A self-paced `/loop` isn't restored". [SOURCE: https://code.claude.com/docs/en/scheduled-tasks] A hop never resumes, because the wrapper denies `claude:-c`, `--continue`, `-r` and `--resume` on replay. [SOURCE: .skilled/bin/skilled-loop:575] So every `CronCreate` task and every `ScheduleWakeup` wakeup the sender held is gone in the receiver. Claude's help has no schedule, cron or wakeup flag; the grep matched only resume and continue lines. On disk, `~/.claude` has no `todos`, `tasks`, scheduled or cron directory, and this checkout has no `.claude/scheduled_tasks.json`. The page names that file as the store only "With feature-flag fetching off".
7. **Same page, NEW: background Bash and monitors are not restarted even on resume.** "Claude Code doesn't restart the background Bash commands and monitors that were running when the session ended." [SOURCE: https://code.claude.com/docs/en/scheduled-tasks] This backs iteration 1's finding 2 (a deferred hop waits on background tasks): those tasks cannot be carried, only waited for or written down.
8. **Todo list, still UNCONFIRMED.** Nothing read this iteration says where Claude Code keeps its todo or task list or whether it survives. `~/.claude` has no `todos` directory; the listed names are `agents`, `jobs`, `plans`, `projects`, `sessions`, `tasks` absent, `teams`, `transcripts` and others. Missing evidence: Claude Code's documentation of the todo or task tools' persistence, or a scratch session that writes a todo and is then relaunched.
9. **Launch flags per runtime, from help (decides what a stamped value could replay into).**

| Runtime | Permission or approval | Plan mode | Added directories |
|---|---|---|---|
| claude | `--permission-mode <mode>              Permission mode to use for the session` (choices include `"plan"`) | via `--permission-mode plan` | `--add-dir <directories...>            Additional directories to allow tool` |
| pi | none; `--approve` is a trust flag | `--plan                      Start in Plan mode` (extension flag) | none |
| opencode (root) | `--auto                  Auto-approve permissions that are not explicitly denied` | none | none; `directory string    Directory to start OpenCode in (optional)` is the start directory |
| codex | `-s, --sandbox <SANDBOX_MODE>` and `-a, --ask-for-approval <APPROVAL_POLICY>` | none | `--add-dir <DIR>` |
| cursor-agent | `--yolo                       Alias for --force (Run Everything)`, `--sandbox <mode>` | `--mode <mode>` with `plan` and `ask`, `--plan                       Start in plan mode (shorthand for --mode=plan).` | `--add-dir <path>             Add an additional workspace root directory` |
| devin | `--permission-mode <PERMISSION_MODE>` (`auto`, `accept-edits`, `smart`, `dangerous`) | none | none |

   A stamped value can be replayed only where a flag exists and an arm event stamps it: Claude, through `--permission-mode`. Codex reports `permission_mode` (`"default"`) [SOURCE: .skilled/hooks/session-relaunch/tests/fixtures/codex-stop.json:8], but its flags are `-s` and `-a`, and the mapping from one to the other is UNCONFIRMED. Cursor and Devin have the flags but never arm. [SOURCE: .skilled/hooks/session-relaunch/README.md:58]

### (b) Report accuracy against the README

10. **None of the nine ranked changes is documented as shipped.** Three are documented as known limits or as the current scope:
    - Change 7 (scan descendants for CLI workers): a known limit, "Any other child program is not detected." [SOURCE: .skilled/hooks/session-relaunch/README.md:124]
    - Change 9 (names on the other four): stated as scope, "Claude and Pi carry their name." [SOURCE: .skilled/hooks/session-relaunch/README.md:32]
    - Change 4 (deferred-hop notice): the deferral is documented, and the README shows a mitigation the report missed. An operator prompt withdraws a deferred record, so the hop is not parked for good once the operator types. [SOURCE: .skilled/hooks/session-relaunch/README.md:126]
    - Change 2: the README documents the current step it would change: release the deep-loop lock before `prepare`. [SOURCE: .skilled/hooks/session-relaunch/README.md:116]
    - Changes 1, 3, 5, 6 and 8 are absent. The README names only Goal, Done, Remaining work and In-flight state as note sections [SOURCE: .skilled/hooks/session-relaunch/README.md:116] and says the wrapper copies the launch name to later hops. [SOURCE: .skilled/hooks/session-relaunch/README.md:285]
11. **NEW: a README sentence contradicts the code.** README:83 says "Model, effort, name, provider and Pi extension settings come from the relaunch record". [SOURCE: .skilled/hooks/session-relaunch/README.md:83] Iteration 2 showed the wrapper reads only `model`, `provider` and `effort` from `consume` and takes the name from `SKILLED_LOOP_NAME` (iteration 2, findings 4 and 8). README:17 and :285 describe the name correctly as the first launch's. The README is wrong at :83 for the name. That matters little today, because the record's name is the same environment value, but it would mislead whoever implements change 6.
12. **Wrong or weak citations, all three iterations:**
    - Report :22 cites `README.md:130` for the 3 s wait. That line says only that the killer waits its idle time; the figure is `DEFAULT_IDLE_MS = 3000` at `lib/killer.cjs:28` and README:141 (iteration 1, finding 6).
    - Report :19 says the guard denies `prepare` and `claim`. It denies seven commands. [SOURCE: .skilled/hooks/session-relaunch/README.md:211] (iteration 1, finding 3)
    - Report :26 cites `codex/shared.mjs:55` for a missing background check. The line is a comment that documents the absence (iteration 1, finding 12).
    - Report :32 treats `markOrphanedLineages` as a `fanout-run.cjs` symbol. It is defined in `fanout-pool.cjs` and only imported in `fanout-run.cjs` (iteration 1, Ruled Out).
    - Report :9 lists the record contents incorrectly (finding 2 above).
    - Report :50 calls `--approve` a Pi mode flag (finding 3 above).
    - Report :51 cites only Claude's `--add-dir` lines; Codex and Cursor also replay it (finding 4 above).
    - Report :52's grep claim holds for adapter code, but it missed `session_crons` in the Stop fixture (finding 5 above).
    - Wrapper comments at `skilled-loop:477` and `:590` say the lists follow each runtime's help, yet four runtimes list a `-n/--name` their help lacks (iteration 2, finding 14).

### (c) Smallest change per confirmed gap

Sizes: small is one function or line in one file; medium is several files with no new mechanism; large needs a new mechanism or runtime evidence first. The sizes and the ranking are judgment. What would change a rank: a run that observes the harm (an orphan, a duplicate writer, a lost cron) moves its change up; a live test showing the harm cannot happen moves it out.

| Rank | Gap (confirmed by) | Smallest change | Size | Does not cover |
|---|---|---|---|---|
| 1 | Fan-out lineages outlive the hop and are requeued live (iter 1, findings 15-19) | `lib/nudge.cjs:199-203`: the step says to stop the runner (SIGTERM to its pid, whose handlers kill the lineage groups at `fanout-run.cjs:348`) and wait for exit before releasing the lock | small | A session that ignores the step; a runner started outside this session |
| 2 | `markOrphanedLineages` has no liveness check (iter 1, finding 18; iter 2, finding 18) | `fanout-pool.cjs` `detectOrphanedLineages` (:284-305): skip a label whose latest pid-carrying liveness record (:176) answers `process.kill(pid, 0)` | medium | Pid reuse; a lineage whose liveness record was never written |
| 3 | Detached CLI workers invisible at hand-over (iter 1, findings 9-14) | `lib/nudge.cjs:183-185`: require a `Running workers:` line (pid, log path, collect step, or `none`) under In-flight state, with seed text telling the receiver to check each pid before it re-runs `Active command:`. Validating the line in `prepare` raises it to medium | small | Workers the session does not know it started; the orphan itself keeps running |
| 4 | Crons and wakeups die on a hop (this iteration, finding 6) | Same nudge block: a `Scheduled:` line listing each `CronList` entry and any self-paced `/loop`, which the receiver recreates. Optionally `claude/stop-arm.mjs:119` logs `session_crons.length` | small | Exact fire times (recreated tasks restart their schedule); the todo list (UNCONFIRMED); runtimes other than Claude |
| 5 | Permission mode reverts to the launch mode (finding 1) | `claude/stop-arm.mjs:152` passes `settings: { permissionMode: payload.permission_mode }`; `relaunch-core.cjs:1011` adds the key; `consume` prints it; `skilled-loop:593` makes `claude:--permission-mode` record-backed and `build_relaunch_arguments` replays the recorded value | medium | Codex (no 1:1 flag), Cursor and Devin (no arm), OpenCode (only `--auto`), Pi. Whether replaying `bypassPermissions` also needs `--allow-dangerously-skip-permissions` is UNCONFIRMED. Replaying `plan` into a receiver that must edit is a design choice. |
| 6 | Claude `/rename` lost (iter 2, findings 3, 4, 6, 7) | `lib/context-usage.cjs:229` `readClaudeSettings` also returns the last `custom-title.customTitle`; `bin/session-relaunch.cjs:560` prefers it over the environment; `skilled-loop:1226-1252` adds a `consumed_field name` read, so the record name beats `SKILLED_LOOP_NAME` | medium | Pi live names (needs `sessionName` at arm, `pi/session-relaunch.ts:423`); a title older than the 256 KiB tail |
| 7 | OpenCode child can outlive a parent idle (iter 1, finding 7; iter 2, finding 19) | `.opencode/plugins/session-relaunch.js`: store `session.status` for ids in `childSessions` instead of discarding child events (:335-341), and return early in the `session.idle` arm (:418) while any child is `busy` or `retry` | small | Children created before the plugin loaded; whether `session.status` fires for backgrounded children on 2.2.7 (needs a trace) |
| 8 | Deferred Claude hop gives no notice (iter 1, finding 2) | `claude/stop-arm.mjs:119-135`: emit a Stop message naming the task count and `cancel` | small | Nothing new for the operator who types, since README:126 already withdraws on a prompt |
| 9 | Launch name not suffixed per hop (iter 2, findings 2, 9) | `skilled-loop:616-617` and `:631-632`: append ` (hop N)` | small | A design preference, not a defect; a live name from rank 6 should take precedence |
| 10 | OpenCode name dropped (iter 2, finding 16) | `.opencode/plugins/session-relaunch.js:407-414`: call `client.session.update({ title })` with the record's name when the seed is detected | medium | The 1.18.34 SDK and 2.2.7 runtime gap (needs one live call); the name must reach the plugin from the record |
| 11 | Wrapper lists `-n/--name` for four runtimes whose help has none (iter 2, finding 14) | `skilled-loop:495-496` and `:596-597`: drop the codex, cursor, devin and opencode name entries, or correct the comment at :477 and :590 | small | Codex, Cursor and Devin cannot be named at all; no change gives them a name |
| 12 | Added directories revert (finding 4) | Nudge: an `Added directories:` line the receiver re-adds with `/add-dir` | small | Codex and Cursor, which have launch flags but no live read; OpenCode, Pi and Devin, which have no flag |
| 13 | Pi plan or build mode reverts (finding 3) | `pi/session-relaunch.ts:423` adds the live mode to arm settings, once the plan-mode extension's state is readable | medium, blocked | `--approve` (a trust flag, not a mode); UNCONFIRMED API |
| 14 | `prepare` sees only direct shell children (README:124) | `bin/session-relaunch.cjs:270-310`: walk all descendants of the runtime pid for non-tool workers | medium to large | Workers already reparented to init after their tool shell exited, which a descendant walk cannot see; ranks 3 and 1 cover more for less |

The report's change 9 ("names on the other four, large, blocked on help") splits into ranks 10 and 11. The help settled it: OpenCode can be named through the plugin SDK, and Codex, Cursor and Devin cannot be named at launch at all. The report's change 7 drops to rank 14, because a `&` worker leaves the runtime's tree once its tool shell exits, so a descendant scan misses the very case it targets. [INFERENCE: based on iteration 1, finding 10]

## Ruled Out
- Reading `~/.claude` file content for todo or cron storage: barred by the dispatch, and the names alone showed no such store.
- A Claude launch flag that restores crons: none exists, and `--resume` is deny-listed on a hop.

## Dead Ends
- A launch flag carrying added directories on OpenCode, Pi or Devin: their help has none.

## Edge Cases
- Ambiguous input: "Pi mode flags" in the report covers `--approve`; read as the report's list, then corrected.
- Contradictory evidence: README:83 against the wrapper's name handling (finding 11). The code is better supported; recorded, not resolved.
- Missing dependencies: todo-list persistence and Pi plan-mode state stay UNCONFIRMED, each with its missing evidence named.
- Partial success: none. One zsh glob in a grep failed (`no matches found: --include=*.mjs`) and was rerun quoted.

## SCOPE VIOLATIONS
- None. `research/research.md` was not updated: `progressiveSynthesis` is true, but the prompt pack lists only this file and the delta as allowed paths.

## Sources Consulted
- scratch/handover-gaps-research-2026-11-13.md:1-81
- .skilled/hooks/session-relaunch/README.md:1-370
- .skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json:1-12; codex-stop.json:1-11
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:940-965, :992-1030
- .skilled/hooks/session-relaunch/claude/stop-arm.mjs:120, :136-160
- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:630-648
- .skilled/hooks/session-relaunch/lib/nudge.cjs:160-190
- .skilled/bin/skilled-loop:476-602, :936-948
- `command <binary> --help` for claude, pi, opencode, codex, cursor-agent, devin
- ~/.claude directory names only
- https://code.claude.com/docs/en/scheduled-tasks

## Assessment
- New information ratio: 0.70
- Questions addressed: Session names (re-listed with exact text), Other dropped state, Report accuracy, Smallest changes
- Questions answered: all four. Two items stay UNCONFIRMED with their missing evidence named: todo-list persistence and Pi plan-mode state.

## Questions Answered
- Other dropped state: permission mode, Pi flags and added directories CONFIRMED in code with two label corrections. Crons and wakeups end with the session, CONFIRMED from Claude's documentation. Todo list UNCONFIRMED.
- Report accuracy: no change is shipped; changes 7, 9 and 4 are documented as limits or scope; nine wrong or weak citations listed; README:83 itself is wrong about the name.
- Smallest changes: 14-row re-ranked table above.

## Questions Remaining
- Todo-list persistence across a Claude relaunch.
- Pi plan-mode extension state readability.
- OpenCode 2.2.7 traces: a backgrounded child at parent idle, and `session.update` setting a title.
- The `bypassPermissions` replay requirement on Claude.

## Reflection
- What worked and why: the fixture grep found `session_crons`, which the report's adapter-only search missed, and the official page closed the cron question that no on-disk name could.
- What did not work and why: the `~/.claude` name listing could not settle the todo list, because the absence of a directory does not prove the list ends with the session.
- What I would do differently: grep test fixtures as well as adapters whenever a claim rests on "no code mentions X".

## Recommended Next Focus
The loop ends here. For synthesis: lead with ranks 1-4 (worker and schedule loss), keep the UNCONFIRMED items as named follow-ups, and fix README:83 alongside rank 6.
