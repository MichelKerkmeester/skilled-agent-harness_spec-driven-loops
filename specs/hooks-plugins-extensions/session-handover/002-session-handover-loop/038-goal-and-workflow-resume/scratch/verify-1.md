# Verification of review-1.md: goals and workflows across a hop

Checked against `main` at `d563a40a6f`. The report reviewed `165e274413`. The five commits between them touch only specs, the trigger index and unrelated tests, so no cited code moved. Nothing in the repository was edited. Experiments ran in `scratchpad/review-goal/verify/` with the loop variables unset, and `git status --short` printed nothing afterwards.

Baseline, rerun here with the loop variables and `AI_SESSION_CHILD` unset:

- Relaunch suites plus the two OpenCode plugin suites: `tests 944, pass 944, fail 0`, exit 0 (`verify/relaunch-tests.tap`).
- Seven goal hook suites: `tests 199, pass 199, fail 0`, exit 0 (`verify/goal-tests.tap`).

Every file:line citation in the report was opened. All of them are accurate to the line, with one exception: `recordGoalPacket` exists twice, the CLI wrapper at `session-relaunch.cjs:389` and the note writer at `relaunch-core.cjs:785`. F4 names the right file.

## 1. Verdict table

| ID | Report title (short) | Verdict | Corrected severity | Why, in one line |
|---|---|---|---|---|
| F1 | Codex loses its goal on every hop | OVERSTATED | P2 | Real and silent, but documented as by design (README:171, 184). Half of the proposed fix cannot work: a Codex note never has a packet to point at. |
| F2 | No command workflow is re-entered | CONFIRMED | P1 | No field anywhere names the running command, and the seed only says "Continue the work under Remaining work". |
| F3 | A cleared Claude goal is set again | REFUTED | none | In all 12 real clears on this machine, Claude writes a `goal_status` with `met:true` 0 to 4 ms before "Goal cleared", and the reader already treats that as ended. The report's test shape left that entry out. |
| F4 | Cursor and Devin drop the goal at their next handoff | CONFIRMED | P2 | `prepare --session <uuidgen>` finds no record (X3). Both runtimes are manual-only. |
| F5 | Claude concern off: manual claim starts on the goal and never claims | CONFIRMED | P2 | Reproduced (X7): the start hook prints nothing with Claude off and the claim with it on. The wrapper swaps the seed anyway. |
| F6 | Active Claude goal dropped outside the packet tree | CONFIRMED, scope narrower | P3 | 43 of the 104 packets that can be a goal name their own path in the slice and are found anyway. The other 61 are dropped silently. |
| F7 | A goal that cannot be proven disappears without a word | CONFIRMED | P3 | `prepare` and `keep` print nothing about the goal on any path. |
| F8 | A refused Claude slice is reported only on stderr | CONFIRMED | P3 | Right, but the proposed log entry reaches nobody. |
| F9 | `OPENCODE_GOAL_DISABLED=1` blocks Claude's goal | REFUTED as a defect | none | It is the shared goal kill switch, every runtime honours it the same way, and the warning names it (X6). The proposed fix would make Claude the one runtime that ignores the switch. |
| F10 | A deep-loop lock blocks re-entry for up to an hour | CONFIRMED | P2 | The lock is taken before the resume step (`deep-research-auto.yaml:286` comes before `:303`), it is `transient`, and it goes stale only after 2 x 1,800,000 ms. Nothing releases it at a hop. |
| F11 | `/loop` and wakeups end with the sender | PLAUSIBLE | P3 | The relaunch code has no reference to wakeups or cron (0 matches). Not reproduced live. |
| F12 | The printed manual command does not run as printed | CONFIRMED, impact overstated | P3 | `command -v skilled-loop` prints nothing in an interactive zsh. But the shim is sourced, so a bare `claude "<seed>"` does go through the wrapper. |
| F13 | Doc drift | CONFIRMED | P3 | `handoff.md:127` contradicts the wrapper (`skilled-loop:1019-1036` is the same for every runtime) and README:193. `SESSION_RELAUNCH_GOAL` is missing from `hook-flags.env.example`. |
| F14 | Plugin receivers are told the goal "changed" | OVERSTATED | P3 (wording) | An operator `bind` shows the same reminder (X4). That is the resend-once rule, and the operator in a new terminal has not seen the goal yet. The proposed fix would turn that resend off. |

## 2. Per finding

### F1. Codex loses its goal
- **Evidence.** `relaunch-core.cjs:761-774`: only `GOAL_RECORD_RUNTIMES` and `claude` resolve, so Codex falls through to `''`. Nothing in `session-relaunch.cjs:389-403` prints anything. The README states it as design at lines 171 and 184 ("The seed instruction waits for a Codex goal reader").
- **Refutation attempt.** I looked for a Codex reader anywhere. There is none, and `goals_1.sqlite` could not be opened read-only from this sandbox (`unable to open database file (14)`). Codex does hop automatically, so the loss happens on every Codex hop that has a goal.
- **Verdict.** OVERSTATED. P0 is wrong for a documented limitation that is not a regression. P2.
- **The fix.** The signal half is right. Print it on stderr rather than stdout, because `session-relaunch-cli.test.cjs:394` pins the prepare stdout. The seed half ("read the bound packet's goal.md") cannot work, because a Codex note never carries `goal_packet`. A version that can work: in `handoffText` (`nudge.cjs:118-201`), for `runtime === 'codex'`, ask the sender to name its goal, or its packet path, on an `Active goal:` line under In-flight state. In `seedText`, have the receiver bring it back the way Codex sets goals (`create_goal`, per README:184). This is prose only, and it changes neither the note format nor the record format.
- **Tests.** `session-relaunch-cli.test.cjs`: a codex `prepare` prints one `goal not carried` line on stderr (fails today). `nudge.test.cjs`: the codex `handoffText` contains the `Active goal:` request (fails today).

### F2. No workflow re-entry
- **Evidence.** `relaunch-core.cjs:29` (four sections and no command field). `nudge.cjs:143-161` (the note shape) and `247-253` (the only work step is "Continue the work under Remaining work"). `handoff.md:100-132` (the template). The relaunch record carries no command field either (`preparePending` arguments at `session-relaunch.cjs:546-558`).
- **Refutation attempt.** I looked for any resume branch in the workflows. `speckit-resume-auto.yaml:203` only suggests "Run /speckit:implement if tasks remain". `speckit-complete.yaml:656-699` detects a folder that already exists (repair mode, healthy folder), so running it again is not catastrophic, but it has no step state. The deep commands do resume from disk (`deep-research-auto.yaml:303-321`), but only after the lock step at `:286` (see F10).
- **Can an "active command" ride without changing the record format?** Yes, two ways. (a) A line under `## In-flight state`. `claim` prints the body (`session-relaunch.cjs:350-356`), so it reaches the receiver with no code change. (b) A flat frontmatter key. `parseHandoff` (`relaunch-core.cjs:318-327`) accepts any `[A-Za-z0-9_-]` key and splits only at the first colon, so a value like `/deep:research :auto ...` parses. `validateHandoff` (`:358-388`) does not reject unknown keys. `updateFrontmatter` (`:222-246`) keeps other keys when `prepare` writes `goal_packet`. But `claim` prints only the body, so (b) needs `claim` to echo the key, the way it echoes `Goal packet:`. Neither way touches the relaunch record (`relaunch-<loop>.json`), so decision D3 of packet 036 holds. D3 sits in `036-review-remediation/goal.md:49`, and that packet is Complete. It binds a new packet only if that packet adopts it.
- **Verdict.** CONFIRMED that nothing structured is carried. What the model then does is inferred. P1 for `:autopilot` and unattended runs and for deep loops, P2 for interactive commands.
- **The fix.** Way (a) is the smallest and correct, in `nudge.cjs` (both `handoffText` and `seedText`) and `handoff.md`. Two corrections. First, tell the receiver to run the command again with the same mode and arguments, and to let the command's own state detection pick the step, rather than claiming the step will be resumed. Second, the fix must ship with F10, or the deep loops fail closed on the lock.
- **Tests.** `nudge.test.cjs`: `handoffText` asks for an `Active command:` line, and `seedText` has a re-run step (both fail today). `session-relaunch-cli.test.cjs`: a claim of a note with the line prints it (passes today; it pins that no code change is needed).

### F3. Cleared Claude goal (REFUTED)
- **Evidence.** A structural survey of the local logs (`verify/goal-clear.cjs`, `clear-prior-status.cjs`; no goal text printed). There were 12 "Goal cleared" entries. 7 had `<command-args>clear</command-args>` and 5 had empty args. Every one had a `goal_status` with `met:true` written 0 to 4 ms earlier in file order, and none had a later unmet status before the next set. So the report's claim that real logs lack the `clear` args form is also wrong: both forms occur.
- **Experiment X1** (`verify/experiments.out`): the observed empty-args shape and the observed `clear` shape both give `""`. The report's shape, which drops the `met:true` entry, gives `"specs/track/010-parent"`. The review's `work/e1/setup.cjs` builds `cleared-real` without that entry.
- **The fix.** Do not change `goalLogEntry`. An extra branch would be dead code. If a guard is wanted, add a test at `relaunch-core.test.cjs` near line 2611 that pins the observed sequence: an unmet status, a `met:true` status, an empty-args `/goal`, then "Goal cleared". It gives `''` today, so it is a regression pin, not a failing test.

### F4. Cursor and Devin drop the goal at the next handoff
- **Evidence.** `handoff.md:35` and `:72` (use `uuidgen`). The receiver hooks bind under the native id (`devin/goal-inject.mjs:65-71`, `cursor/goal-inject.mjs:73-83`). The record key hashes the session id (`goal-core.cjs:228-232`). X3: `devin` and `cursor` resolve the packet with the native id and give `""` with a uuid. Neither runtime has a relaunch hook (`.devin/hooks.v1.json` and `.cursor/hooks.json` register only `goal-inject.mjs`), so every hop is manual. A second manual claim gets no packet.
- **Refutation attempt.** The model can see the native id only inside the resend reminder (`devin/goal-inject.mjs:79-81`), and only while a resend is pending. Nothing tells it to use that id.
- **Verdict.** CONFIRMED. P2, since these are manual-only runtimes.
- **The fix.** Right idea. Put it in `resolveGoalPacket` (`relaunch-core.cjs:761`) rather than the CLI wrapper, so `keep` gets it too. Only for `devin` and `cursor`, only when no record matches, and only when `env.SESSION_RELAUNCH_GOAL_PACKET` passes `goalPacketProblem`. It must stay off for `claude`, which also inherits the variable (`skilled-loop:1202`), and for `codex`. The risk is low, because those runtimes have no command that can complete or clear the record anyway.
- **Tests.** `relaunch-core.test.cjs`: devin and cursor with an unknown id and the variable set give the packet (fails today). Claude, codex, pi and opencode with the variable set and no record give `''` (passes today, a guard).

### F5. Claude concern off: claim never delivered
- **Evidence.** The wrapper swaps the seed with no concern check (`skilled-loop:1019-1036`). `seeded_goal_packet` (`:360-393`) checks only the goal switch and the note. `compact-pointer.mjs:162-170` returns before the `startup` branch when the concern is off. This checkout's `.skilled/hooks/hook-flags.env:55` holds `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`. X7: with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` the hook exits 0 with empty stdout; with `=1` it emits 1,477 characters starting with the goal-start lead.
- **Refutation attempt.** A Claude session with the concern off cannot write a note (`prepare` refuses at `session-relaunch.cjs:504-505`), so the path needs a manual cross-runtime claim: a Pi or OpenCode note started with `claude`. That matches this operator's flags.
- **Verdict.** CONFIRMED, P2. The path is rare, but the whole hand-over is lost silently.
- **The fix.** Moving the `startup` and `SKILLED_LOOP_CLAIM_SEED` branch above the enabled check is correct and is one move in one file. The variable exists only when the wrapper has already swapped the prompt, so delivering the claim completes an action the wrapper took. The alternative, guarding the swap in the wrapper, keeps the "concern off means the hook is silent" rule but loses the native goal. Either way, README:179 must change ("only while the switch is on").
- **Tests.** `claude-adapters.test.cjs` (next to the start-claim tests at 1536-1600): concern off plus `SKILLED_LOOP_CLAIM_SEED` plus `source: startup` emits the claim (fails today).

### F6. Goal dropped outside the packet tree
- **Evidence.** `relaunch-core.cjs:617-632`. X2: a hop-two receiver with an empty spec folder gives `""`. Scope check over the real tree (`verify/hop2-headline.cjs` and an inline count): of the 104 non-scratch packets with `packet_budget=ok`, 43 slices contain their own `specs/...` path, so the `named` branch finds them wherever the session works. 61 do not, and those are dropped.
- **Verdict.** CONFIRMED with a narrower scope. The report's line "a template slice does not name its own path" is true for 59%, not all. P3: the common case, working a child of the goal's packet, is found through the lineage.
- **The fix.** A bounded search must take a match only when exactly one `goal.md` matches. There are 1,319 `goal.md` files under `specs/`, including review fixtures whose headline is `## DIRECTIVE`. Skip `scratch/`, `lineages/` and `z_archive/`, and if no single match exists, fall back to the F7 reason line.
- **Tests.** `relaunch-core.test.cjs`: spec folder `none` with a goal headline unique to one packet gives that packet, and two packets sharing the headline give `''` (the first fails today).

### F7. Silent loss
- **Evidence.** `session-relaunch.cjs:389-403` returns nothing and prints nothing. `resolveGoalPacket` collapses every failure to `''`.
- **Verdict.** CONFIRMED, P3.
- **The fix.** Do not change `resolveGoalPacket`'s return type, since tests and three callers rely on it. Add a sibling that reports why, or return the reason through an out parameter, and print on stderr, because prepare stdout is pinned at `session-relaunch-cli.test.cjs:394`.
- **Tests.** `session-relaunch-cli.test.cjs`: a Claude free-text goal gives one `goal not carried:` stderr line, while stdout is unchanged (fails today).

### F8. A refused slice shows only on stderr
- **Evidence.** `skilled-loop:332-354`. The line prints just before the runtime takes the terminal.
- **Note.** A child phase is refused on purpose: `goal-slice.cjs:326-329` says a phase child "is never set as the operator copy, so no budget applies". A real child gives `packet_budget=unknown` (`goal.cjs packet` on `036-review-remediation/001-shim-wrapper-trust`).
- **Verdict.** CONFIRMED, P3.
- **The fix.** The proposed `relaunch.log` entry is harmless and reaches nobody. If anything is done, export a `SKILLED_LOOP_`-prefixed reason from the wrapper and have `claim` append it to its `Goal packet:` line, so the model can ask the operator. That touches `skilled-loop` and `session-relaunch.cjs`. Low value.

### F9. The kill switch blocks Claude (REFUTED)
- **Evidence.** X6: with the switch set, the reason is `could not render the goal packet: STATUS=FAIL ACTION=packet ERROR="OPENCODE_GOAL_DISABLED=1 disables goal plugin execution"`. Plugin runtimes bind nothing under the same switch. The flags file describes it as "session goal tracking" (`hook-flags.env:23`), and `goal-core.cjs:160-162` applies it to every action.
- **Verdict.** REFUTED. The behaviour is the same on every runtime, and the warning names the switch. Do not apply the fix.

### F10. Deep-loop lock
- **Evidence.** `loop-lock.ts:637-644` (`transient` is never owner-dead). `loop-lock.cjs:183-186` (a CLI acquire is transient). The assets use `--ttl-ms 1800000` (`deep-research-auto.yaml:286`, `deep-review-auto.yaml:324`). Acquire runs before classification (`:286` comes before `:303`) and "fail closed" on `acquired=false` (`:287`). Nothing in any hook releases a deep-loop lock (no match in `.skilled/hooks`, `.opencode/plugins` or `.claude/settings.json`).
- **Verdict.** CONFIRMED by code. P2, and a blocker for F2's fix on deep loops.
- **The fix.** One sender step in `handoffText`, plus `handoff.md`: before `prepare`, release a held deep-loop lock with the `release --owner-pid --nonce` values the command captured, and write the re-run command on the Active command line. It is correct and prose only.

### F11. `/loop` and wakeups
- PLAUSIBLE, P3. There is no reference in the relaunch code. The F2 line covers it if it holds the loop prompt and the interval.

### F12. `skilled-loop` is not a command
- **Evidence.** `skilled-loop:684` and `relaunch-core.cjs:1344` print `skilled-loop <runtime>`. The shim defines only the runtime functions (`skilled-loop-shell.sh:312-317`). `zsh -i -c 'command -v skilled-loop'` printed nothing, while `type claude` printed "shell function from .../skilled-loop-shell.sh".
- **Verdict.** CONFIRMED, P3. The report says falling back loses the goal, but with the shim sourced, `claude "<seed>"` goes through the wrapper.
- **The fix.** Add a `skilled-loop` function to the shim that calls the wrapper with `bash`. That avoids churn in the tests that pin the printed text (`skilled-loop-wrapper-claim-goal.test.cjs:160-170`).
- **Tests.** `skilled-loop-shell.test.cjs`: `skilled-loop` is defined after sourcing (fails today).

### F13. Doc drift
- CONFIRMED, P3, both halves. The `handoff.md:127` fix fits in work package WP1, the `hook-flags.env.example` row in WP7.

### F14. The resend reminder on a fresh bind
- **Evidence.** X4: a hand-over bind and an operator `bind` both show `lastResentSliceHash=null` and the reminder. `goal-core.cjs:1159` and `1319-1323`. `speckit-resume-auto.yaml:47` asks the model to send the slice once when a resend is pending, which matches the goal posture rule for a terminal that has not seen the goal.
- **Verdict.** OVERSTATED. Only the wording ("changed above its log") is wrong. P3.
- **The fix.** Reject seeding the hash at bind: it would turn off the one resend the operator needs on Pi and OpenCode. If anything changes, give a never-resent record its own wording in `goal-slice.cjs:233-242`.

## 3. Positive claims (sections 2, 3 and 6)

| Claim | Verdict | Evidence |
|---|---|---|
| Claude gets the goal back with no typing | CONFIRMED, under conditions | Wrapper `skilled-loop:1215-1220`. X7 shows the start hook delivering the claim. A real wrapper-started receiver log from 2026-10-25 (`97b1bd70`, structure only) shows `/goal` with 1,500-character args, then `goal_status` sentinel `met:false` with a 1,500-character condition, then a kickoff turn with `UserPromptSubmit` hooks, plus the SessionStart `hook_additional_context`. Conditions: the Claude concern is on (F5), the note's spec folder is in the goal's tree or the slice names its path (F6), and the packet is not a phase child (F8 note). |
| Pi gets it back | CONFIRMED (core and code); live run recorded, not rerun | X3: `bindRelaunchGoal` binds, and `prepare` resolves it at the next hop. `goal-context.ts:233-283` binds on `session_start` and `input` and injects on every input. |
| OpenCode gets it back | CONFIRMED by passing tests; live run recorded | `opencode-goal.js:3581-3588` binds on the first top-level `session.created`. The handover suite passes in the 944. Correction to the matrix: the "guarded continuation on `session.idle`" is off unless `OPENCODE_GOAL_AUTONOMY` is `active` or `smoke` (`opencode-goal.js:155`, `2989-2992`, `.env.example:416` "unset=disabled"). |
| A parent goal carries while a child phase is worked | CONFIRMED | X2: the Claude receiver with spec folder = child resolves the parent. On record runtimes, `prepare` resolves from the record whatever the spec folder (X3). |

**Hop two and later, per runtime.**

- **Claude.** Carries. X2: the hop-one receiver's own log resolves the parent again, because the stored condition is the slice and every real packet's slice headline appears verbatim in its `goal.md` (1,311 of 1,319 files; the other 8 are 7 review-scratch fixtures and one file with no slice). It drops when the spec folder is empty or `none` (X2 `""`).
- **Pi and OpenCode.** Carry. Each receiver is a new session id with no history, so it binds, and its record is found at its own `prepare` (X3).
- **Devin and Cursor.** Drop at the second manual hop (F4).
- **Codex.** Never carries (F1).

## 4. New findings

**N1. The OpenCode goal continuation withdraws a prepared hop** (P2 when `OPENCODE_GOAL_AUTONOMY=active`; off by default. Inferred.)
- **Evidence.** On `session.idle`, the relaunch plugin arms and starts the killer (`.opencode/plugins/session-relaunch.js:418-436`). The goal plugin, on the same event, may send `promptAsync` (`opencode-goal.js:3629-3659` and `3041-3058`), which arrives as a new user message. The relaunch plugin withdraws an arm on any new user message (`session-relaunch.js:347-365` with `withdrawArmForUserMessage` at `:256-271`). The goal plugin has no relaunch awareness (no `relaunch` or `SKILLED_LOOP` reference beyond the bind).
- **Scenario.** A sender with an active goal runs `prepare` and goes idle. The continuation fires within the killer's 3 s wait, the record is disarmed with `user-message`, the hop is lost, and the session works on near its context limit.
- **Smallest fix.** In `maybeContinueGoal`, suppress the continuation when `SKILLED_LOOP_ID` is set and the relaunch record names this session as pending or armed. Change both mirrored copies (`.skilled/hooks/goal/opencode/opencode-goal.js` and `.opencode/plugins/opencode-goal.js`).
- **Test.** In the lifecycle suite: autonomy active, a pending record for the session, `session.idle` gives `decision: suppressed` (fails today with `fired`).

**N2. Pi binds the hop's goal into every new session in the receiving process** (P2, confirmed)
- **Evidence.** The Pi guard is per session id (`goal-context.ts:101-108`). Pi 1.5.2 starts new sessions in-process: `SessionStartEvent.reason` is `"startup" | "reload" | "new" | "resume" | "fork"` (`pi-coding-agent/dist/core/extensions/types.d.ts:595-600`), and `/new` is listed in `slash-commands.js:22`. X5: a second session id in the same environment gives `{"bound":true}` with the parent packet. OpenCode guards this once per process (`handOverGoalAttempted`, `opencode-goal.js:3584-3586`). Devin and Cursor hooks have the same per-session behaviour.
- **Scenario.** The operator types `/new` or `/resume <old session with no goal>` in a hopped Pi receiver, and the hop's goal is injected on every prompt of that unrelated session.
- **Smallest fix.** In `goal-context.ts`, after the first attempt that has a session id, delete `process.env.SESSION_RELAUNCH_GOAL_PACKET`, or use a process-wide flag the way OpenCode does. Deleting the variable also closes N3 for Pi.
- **Test.** `goal-pi.test.mjs`: after the receiver binds, a `session_start` with a new id binds nothing (fails today).

**N3. The packet variable leaks into nested runtimes** (P3, inferred)
- **Evidence.** The variable has no `SKILLED_LOOP_` prefix, so `dropNestedLoop` does not strip it. The claim seed got the prefix for exactly this reason (`compact-pointer.mjs:36-38`, README:179). Only `AI_SESSION_CHILD=1` stops a bind (`goal-core.cjs:1260`; X5 `child-session`).
- **Scenario.** An `opencode run` or `pi -p` started from a receiver's tool shell without `AI_SESSION_CHILD` binds the hop's goal.
- **Smallest fix.** The N2 deletion for Pi. For OpenCode, delete the variable after the one attempt at `opencode-goal.js:3585`.

**N4. A Claude sender under an unmet native goal** (P3, inferred; no loop, the hop usually wins)
- **Evidence.** `stop-arm.mjs` and `killer.cjs` know nothing about goal state. The killer treats 3 s with no transcript change as idle (`killer.cjs:176-201`) and gives up after 30 s (`:28-29`), and a disarmed record cannot be armed again (`relaunch-core.cjs:970-971`). Real repo logs (`ae286a84`, `c7832267`, structure only) show the goal continuation as a Stop-hook block: Stop `hook_success`, then 1.4 to 2.6 s, then an `isMeta` "Stop hook feedback" entry, `goal_status met:false`, `stop_hook_summary` and `api-request`. The next transcript write came 4.8 to 12 s later. No `UserPromptSubmit` fires for the continuation, so `context-nudge`'s withdraw does not trigger.
- **Outcome.** The killer usually signals during the continuation's first API call, and the hop proceeds. The hop is lost (`killer-timeout`) only if the continuation keeps writing at gaps under 3 s for 30 s. A continuation tool call that runs longer than 3 s could be killed mid-run, and that work is not in the note.
- **Fix.** None recommended. Record it as a known race in README §3.

**N5. Nothing enforces reading the child goal.md** (P3, confirmed absence)
- **Evidence.** No hook or guard checks it (search of the goal and relaunch code). Soft paths exist: the Claude slice holds the binding table, the plugin objective holds a `BINDING:` sentence when the parent has a binding anchor (`goal-slice.cjs:129-141`), and `/speckit:resume <child>` reads "the packet goal.md durable slice" of the folder it is given (`speckit-resume-auto.yaml:46`). The seed itself never mentions a goal (`nudge.cjs:204-255`).
- **Smallest fix.** One `seedText` step: when the spec folder holds a `goal.md`, read it before the Remaining work; it binds under the session goal. This goes in WP1.

**N6. On Devin and Cursor, prepare says the loop will end the session, but nothing arms** (P3, confirmed)
- **Evidence.** `session-relaunch.cjs:567-571` prints the same text for every runtime. Neither runtime registers a relaunch hook. Only the wrapper's `not-armed` decline at exit prints the manual command.
- **Smallest fix.** For `cursor` and `devin`, print "nothing ends this session; exit it and run the claim command the wrapper prints". The text is pinned at `session-relaunch-cli.test.cjs:394`, so add a runtime case there.

**N7. A phase-child goal: Claude refuses it, plugins bind it** (P3, by design)
- `goal-slice.cjs:326-329` and `goal-handover.cjs:127`. No code fix. One README line to say why the two differ.

## 5. Work packages, ranked (no file appears in two packages)

1. **WP1. Re-entering a workflow and its goal context** (F2, F10, F11, F1 seed half, N5, F13 first half)
   - Files: `.skilled/hooks/session-relaunch/lib/nudge.cjs`, `.skilled/commands/speckit/handoff.md`, `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`.
   - Must fail first: `handoffText` asks for an `Active command:` line and a deep-loop lock release; `seedText` has a re-run step and a "read the spec folder's goal.md" step; the codex `handoffText` asks for an `Active goal:` line.
2. **WP2. The Pi hand-over binds once per process** (N2, N3 for Pi)
   - Files: `.skilled/hooks/goal/pi/goal-context.ts`, `.skilled/hooks/goal/pi/goal-pi.test.mjs`.
   - Must fail first: a second `session_start` with a new id binds nothing.
3. **WP3. The goal resolver and prepare output** (F4, F7, F6, F1 signal half, N6)
   - Files: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`, `tests/relaunch-core.test.cjs`, `tests/session-relaunch-cli.test.cjs`.
   - Must fail first: devin and cursor with a uuid and the variable set give the packet; a free-text goal and a codex prepare each print one stderr reason; a unique headline outside the tree is found; the cursor and devin prepare text is the manual one.
   - Guard tests that must keep passing: claude, codex, pi and opencode give `''` with no record; stdout stays unchanged.
4. **WP4. The Claude start hook with the concern off** (F5)
   - Files: `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs`, `tests/claude-adapters.test.cjs`.
   - Must fail first: concern off plus the seed variable plus `startup` emits the claim.
5. **WP5. The OpenCode continuation stays off during a prepared hop** (N1, and N3 for OpenCode)
   - Files: `.skilled/hooks/goal/opencode/opencode-goal.js`, `.opencode/plugins/opencode-goal.js`, `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`.
   - Must fail first: a pending record means `suppressed`, not `fired`.
6. **WP6. `skilled-loop` as a shell command** (F12)
   - Files: `.skilled/bin/skilled-loop-shell.sh`, `tests/skilled-loop-shell.test.cjs`.
   - Must fail first: the function is defined after sourcing.
7. **WP7. Documentation, after WP3 and WP4** (F13 second half, F5 semantics, N4, N7)
   - Files: `.skilled/hooks/session-relaunch/README.md`, `.skilled/hooks/hook-flags.env.example`.
   - No test. Review against the shipped behaviour.

Do not do: the F3 change (dead code; at most add the regression pin from §2), the F9 change (breaks the kill switch), the F14 hash seeding (turns off the needed resend). F8 is optional and would collide with WP3's `session-relaunch.cjs`, so fold it into WP3 if wanted.
