# Iteration 9: The Mobile App's View of a Hop, and the Smallest Live-Run Set

## Focus

Two parts. Part one is the second reading of the operator's report: a named or renamed session hops, and the mobile app then shows the new session without that name. This iteration reads how the wrapper launches the receiver, what it passes or drops for Remote Control, and what the vendor says about the remote title, a session started with `--name`, and whether a new process is a new app session. Part two inventories every shipped fix that has no live hop behind it, builds the smallest live-run set that closes them, includes the mobile rename check for both readings, names what no live run can prove, and ranks the surviving gaps by operator impact against cost.

No runtime session was started. No prepare, claim, keep, cancel or complete command was run. No live hop was run. Every runtime claim below quotes `command claude --help` or `command claude remote-control --help`; no prompt was passed to either.

## Actions Taken

1. Read the state files: `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, and the earlier iteration files under `research/iterations/` (1, 4, 5 and 6 in full; 3, 7 and 8 through the strategy summaries and carried-forward questions).
2. Read the wrapper's name and Remote Control paths in `.skilled/bin/skilled-loop`: `name_stem` at 286-292, `read_consumed_live_settings` at 319-351, `append_name_arguments` at 415-425, the option tables at 575-625, the replay classifier at 1027-1114 (including the optional value for `--remote-control` at 1077-1096), `build_relaunch_arguments` at 706-796, and the live name, mode and launch build at 1431-1457.
3. Ran `command claude --help` and `command claude remote-control --help` for the help lines only. The relevant lines are quoted in F2.
4. Fetched the three vendor pages: `https://code.claude.com/docs/en/remote-control`, `https://code.claude.com/docs/en/sessions` and `https://code.claude.com/docs/en/mobile`.
5. Read the current name and goal code: `.skilled/hooks/session-relaunch/lib/context-usage.cjs` at 229-276, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` at 601-628, 630-660 and 766-791, and `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` at 592.
6. Read the name and live-claim paragraphs in `.skilled/hooks/session-relaunch/README.md` at 49 and 189.
7. Read the manual testing playbooks: the Claude live setup and CL-1 at 452-511, the Hand-Over State Checks at 842-938 (HS-5 at 886-894 and HS-8 at 918-938), the Pi and OpenCode checks at 76-106 and PO-1 at 229-247, GR-P1 at 431-452 and GR-O1 at 467-476, and the recorded live results at 112-139 and 510-524.
8. Read the live-run harness: `028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh`, `make-goal.cjs`, and the 038 live-hop evidence folders 013, 016 and 017.
9. Read the Known Limitations and verification rows of packet 039 children 001, 002 and 003, and packet 038 children 002, 004, 005, 008, 012, 013, 016 and 017. Read the limit verdicts already recorded in iterations 4 to 6 rather than reopening every code path.
10. Built the live-run matrix and the ranking below. Nothing was executed.

## Findings

### Part 1: the second reading

#### F1. A Claude hop is launched with `--name "<stem> (<hop+1>)"`, so a successful carry shows a numbered name, not the sender's exact name. CONFIRMED.

`name_stem` removes the trailing ` (N)` only when N is at least 2 and equals the sender's own number, so a receiver never stacks suffixes [SOURCE: .skilled/bin/skilled-loop:286]. A hop then appends `--name` with the stem plus the current hop count plus one [SOURCE: .skilled/bin/skilled-loop:417]. The live name comes from the consumed record, and a name the record cannot prove leaves the launch name in place [SOURCE: .skilled/bin/skilled-loop:1435]. The README states the same result: the first receiver is `<stem> (2)` and every later receiver counts up [SOURCE: .skilled/hooks/session-relaunch/README.md:49].

Operator consequence: if the sender is named `My Task`, the app after the hop shows `My Task (2)`, not `My Task`. That is a deliberate carry, not a lost name. The report's "without that name" has three distinct shapes: no name at all, a different name (a generated title or the replayed Remote Control value), or the numbered name. The live run in F7 separates them.

#### F2. The wrapper replays `--remote-control` and its optional value, and the vendor does not rank that value against `--name`. The app title is UNCONFIRMED. CONFIRMED for the replay; UNCONFIRMED for the winner.

The wrapper's Claude value table includes `claude:--remote-control` and `claude:--remote-control-session-name-prefix` [SOURCE: .skilled/bin/skilled-loop:590]. Neither is in the deny list [SOURCE: .skilled/bin/skilled-loop:673] or the recorded list [SOURCE: .skilled/bin/skilled-loop:693], so both are replayed as extra arguments on a hop [SOURCE: .skilled/bin/skilled-loop:783]. `--remote-control` is treated as an optional-value option [SOURCE: .skilled/bin/skilled-loop:1080], and the classifier consumes one following non-option token as its value [SOURCE: .skilled/bin/skilled-loop:1086].

The help lines are explicit about the two shapes: `-n, --name <name>` is "Set a display name for this session (shown in the prompt box, /resume picker, and terminal title)" (`command claude --help`, line 139); `--remote-control [name]` is "Start an interactive session with Remote Control enabled (optionally named)" (lines 187-188); `--remote-control-session-name-prefix <prefix>` is "Prefix for auto-generated Remote Control session names (default: hostname)" (lines 189-190). The server subcommand's help says `--name <name>` is the "Name for the session (shown in claude.ai/code)" (`command claude remote-control --help`, line 7).

The vendor's title order is: "The name you passed to `--name`, `--remote-control`, or `/remote-control`", then the title set with `/rename`, then the last meaningful message, then an auto-generated name [SOURCE: https://code.claude.com/docs/en/remote-control]. All three name routes share slot 1, and the page does not say which wins when both `--name` and `--remote-control <name>` are present. The wrapper passes both on a hop: `--name` from the record, and the replayed `--remote-control` with its old value [SOURCE: .skilled/bin/skilled-loop:783] [SOURCE: .skilled/bin/skilled-loop:1435]. So the app may show the carried name, or the old Remote Control value, or a generated name. A live run decides; F7 Run B is that run.

Smallest change if the replay wins: in `.skilled/bin/skilled-loop`, beside `append_name_arguments` [SOURCE: .skilled/bin/skilled-loop:417], rewrite or drop the value that follows a replayed `--remote-control` when `SKILLED_LOOP_NAME` is non-empty, so the two name sources cannot disagree. Keep `--name`, because the same name is the resume handle. Do not add `--remote-control` to the recorded list: that would drop the flag itself and leave the receiver out of the app unless auto-connect is on.

#### F3. A hop is a new process, so the app shows a new remote session, not the old one continuing. CONFIRMED by the vendor.

Remote Control is attached to the local process: "each interactive Claude Code process registers one remote session", multiple instances each get their own remote session, and the local process must keep running or the session goes offline [SOURCE: https://code.claude.com/docs/en/remote-control]. A hop is a fresh process launched by `skilled-loop` [SOURCE: .skilled/bin/skilled-loop:1206]. Therefore the app always shows the receiver as a new session (when the receiver is a Remote Control session), and the sender goes offline. The name can continue; the session identity cannot. A new process also has no history and no live `/remote-control` command, so a receiver that is not launched with the flag and is not covered by auto-connect never appears in the app at all.

#### F4. A sender that connected with `/remote-control` leaves no launch flag to replay; the wrapper cannot re-establish Remote Control on the receiver. CONFIRMED for the missing flag; the store read is the missing evidence.

The wrapper replays only what is on the launch line [SOURCE: .skilled/bin/skilled-loop:783]. `/remote-control` typed inside the session is not a launch argument, so a hop from that sender starts a plain `claude` unless Remote Control auto-connect is on [SOURCE: https://code.claude.com/docs/en/remote-control]. The vendor says an interactive process registers a remote session only when Remote Control is explicitly started or auto-connect is enabled. The Claude session store under `~/.claude/sessions/<pid>.json` carries `bridgeSessionId` and `nameSource`, but the relaunch code searches only `~/.claude/projects` for the transcript [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:619] and reads no Claude session store; the `sessions` folder it does read at 697 is Codex's rollout tree [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:697].

Operator consequence: a hop from a session the operator was steering in the app can leave the app showing only the old, offline session. The smallest safe closure is documentation plus the launch flag: start the sender with `--remote-control` or enable auto-connect, so the receiver is a remote session. A code closure needs the store's `bridgeSessionId` read in `resolveSessionSettings` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:766] and a way to pass "was bridged" to the wrapper; that is a record-shape or derived-flag decision, not a one-line wrapper change.

#### F5. The mobile rename reading 1 is still the store-versus-transcript gap. CONFIRMED as a code gap; the mobile write path remains UNCONFIRMED.

The vendor says a rename from claude.ai or the Claude app "also updates the local title shown in `claude --resume`" and requires Claude Code v2.1.221 or later [SOURCE: https://code.claude.com/docs/en/sessions]. The local title is the `name`/`nameSource` store, as iteration 1 recorded. `prepare` ranks the transcript `custom-title`, then `SKILLED_LOOP_NAME`, then the transcript `ai-title` [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592]. The transcript reader takes the last non-empty `custom-title` and separately the last non-empty `ai-title` [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:247] [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:253]. No Claude session-store reader exists beside `claudeSessionLogPath` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:619]. A store-only rename is therefore invisible to `prepare`, and the hop falls to the launch or generated name.

Smallest change: the store reader iteration 1 named, in `resolveSessionSettings` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:766], matching `sessionId`, requiring `nameSource === 'user'` and a non-empty `name`, and taking the newest `nameSince`. Keep it below the transcript custom title and above `SKILLED_LOOP_NAME`. The live run is Run B below; it decides whether the mobile rename writes the transcript, the store, or both.

#### F6. A named session that hops can show the carried name in the app only under three conditions. CONFIRMED conditionally.

The three conditions are: (a) the record carries a replayable name, which the wrapper already validates [SOURCE: .skilled/bin/skilled-loop:276] and appends as `--name` [SOURCE: .skilled/bin/skilled-loop:417]; (b) the receiver is a Remote Control session, by the replayed flag or auto-connect [SOURCE: https://code.claude.com/docs/en/remote-control]; (c) no replayed `--remote-control <old name>` outranks the carried name, which F2 leaves UNCONFIRMED. When all three hold, the vendor's title order makes `--name` the first title source, so the app shows `<stem> (2)`. When (a) fails, the app shows a generated title; when (b) fails, the receiver is absent from the app; when (c) fails, the app shows the old value.

What the wrapper would have to pass for the app to show the carried name: `--name "<stem> (<hop+1)>"` (already passed), a Remote Control flag on the hop (replayed only if it was on the launch line, or supplied by auto-connect), and no conflicting `--remote-control` value (the rewrite in F2). What remains UNCONFIRMED is the vendor's precedence and the actual app behavior; Run B is the read-only evidence that closes both.

### Part 2: live proof

#### F7. The fixes with no live proof, and the smallest set of live runs. CONFIRMED from the packet documents and the playbooks.

The inventory of fixes that lack a live hop or a live end-to-end check:

| Fix | Child | Live status |
|---|---|---|
| Claude dialog guard refuses `AskUserQuestion` while a hand-over is pending | 039/001 | No live sender-run; the four saved runs had the harness run `prepare` [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md:127] |
| Claude sender with no goal hands on the packet goal | 039/002 | Not run live [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback/implementation-summary.md:129] |
| Generated title carried as the session name | 039/003 | Not run live [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry/implementation-summary.md:126] |
| Pi bind-once (packet variable deleted after the first bind) | 038/002 | Not run on a live Pi [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/002-pi-bind-once/implementation-summary.md:104] |
| Claude start claim with the enable switch off | 038/004 | The basic claim is live in the ten goal hops [SOURCE: .skilled/hooks/session-relaunch/README.md:189]; the switch-off path is not |
| OpenCode continuation suppression and packet cleanup | 038/005 | Read from the code, not seen live [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/005-opencode-continuation-hop/implementation-summary.md:107] |
| Start claim event name, non-open note guard, hardened note and command text, quiet nudge, OpenCode `finally` cleanup | 038/008 | No live run; the nine advisories rest on suites [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories/implementation-summary.md:121] |
| Claude custom-title name carry | 038/012 | No live run in the child; the tests are the proof [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry/implementation-summary.md:112] |
| OpenCode child-busy deferral | 038/013 | The gap was seen live before the fix; the post-fix behavior has no live run [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/implementation-summary.md:114] |
| Pi Plan or Build mode carry | 038/015 | No live hop with the mode carried [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/implementation-summary.md:123] |
| Worker hop with the playbook's `ln -s` helper link | 038/017/L3 | The live worker hop used a copy, not the link [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:118] |

The fixes that already have live evidence and need no new run: the basic Claude start claim and the receiver claim under a goal, ten of ten under an allowing goal [SOURCE: .skilled/hooks/session-relaunch/README.md:189]; the permission-mode carry, four live result lines in the child's `scratch/live-checks.md` [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:14]; the cron observation [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons/acceptance-criteria.md:54]; the OpenCode title through the bridge [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/implementation-summary.md:114]; the goal hops in 028 and 038/016 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal/implementation-summary.md:72]. Packet 038/007 is documentation only and has no runtime behavior to prove [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/007-goal-handover-docs/implementation-summary.md:102].

The smallest live-run set has five runs. Runs A and B are both Claude; C is Pi; D is OpenCode; E is the playbook's own HS-8. Each run below names the runtime, the starting state, the exact operator steps, the observation that proves each fix, and the fixes it covers.

**Run A: the three 039 fixes in one sender-run Claude hop.**

Runtime: Claude Code 2.1.323 (the version of the recorded live hops) [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:827].

Starting state: a throwaway checkout from the harness, with copies of the real hooks, wrapper and goal command [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:926]. The note's `spec_folder` is `specs/demo/001-demo`, not `none`. Its `goal.md` must carry an unticked `- [ ]` criterion in the durable slice, because the fallback requires `budgetState === 'ok'` and `OPEN_CRITERION_PATTERN` to match [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:601]. The harness demo goal has no checkbox [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/make-goal.cjs:9], so the run adds one. The sender starts with `NO_GOAL=1`, no `--name` and no `/rename`; its first prompt lets Claude write the `ai-title` that the title fallback reads [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:253]. The sender runs `prepare` itself; the harness must not run it. The HS-8 variant already moves `prepare` into the sender [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:934], so it is the base for the patch.

Exact steps:
1. `bash "$harness/build-sandbox.sh" claude "$sandbox" 3990 "$repo_root"` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:927].
2. Add `- [ ] FINISH` to `$sandbox/specs/demo/001-demo/goal.md` and keep the durable slice under 4,000 characters; confirm `goal.cjs packet specs/demo/001-demo` reports `packet_budget=ok`.
3. Patch `run-hop.sh` into `$out/run-hop-039.sh` so the sender writes the note with `spec_folder: specs/demo/001-demo`, waits until its transcript holds at least one `ai-title` entry, runs the `prepare` command with its own session id and loop id, then calls `AskUserQuestion` with one question. Remove the harness's own `prepare` call. The `ai-title` wait is what makes the generated-title case real; without it the fallback has nothing to read.
4. Run `NO_GOAL=1 bash "$out/run-hop-039.sh" claude "$sandbox" "$out" 039` and let the wrapper relaunch.
5. Read `summary.txt`, `relaunch.log`, `note-final.md`, `processes.txt`, the sender's transcript and the receiver's transcript.
6. After the note is `done`, run `prepare` or `keep` once more against the same note and confirm the status and `goal_packet` do not change.

Observation that proves each fix:
- 039/001: the `AskUserQuestion` tool result is a deny whose reason names the note path and `session-relaunch.cjs cancel --loop-id <id>`, and `relaunch.log` then shows `prepare ... status=pending`, `killer-signal` and `relaunch ... reason=ready` with no `withdrawn` line. That is the guard's denial and the turn ending.
- 039/002: `note-final.md` carries `goal_packet: specs/demo/001-demo`, and the receiver's start context or transcript carries the `/goal <slice>` start and a `goal-start-claim` line; the receiver claims the note.
- 039/003: the receiver's command line in `processes.txt`, or its session store, carries `--name "<ai-title> (2)"`; the receiver's transcript carries the same name.
- 038/016/L3: the same hop completes with a sender-run `prepare` and a dialog; the history has `handed-over`, `claimed` and `done`.
- 038/008 non-open note guard: the second `prepare`/`keep` leaves the done note and its `goal_packet` unchanged.
- 038/012 custom-title carry: a second hop after a `/rename` in the receiver shows `<rename> (2)`; the first hop proved the generated title.
- 038/004 basic claim: the receiver's `goal-start-claim` and its claim line re-confirm the already-live path.
- 038/009/L2 added directory: if the sender adds `/add-dir <path>` and writes `Added directories: <path>`, the receiver either re-adds it or asks the operator. This confirms the prompt path, not a code fix.

Run A covers: 039/001, 039/002, 039/003, 038/016/L3, 038/008 non-open note guard, 038/012 Claude custom-title carry, 038/004 basic claim, and the 009/L2 prompt path.

**Run B: the mobile rename in the app, both readings.**

Runtime: Claude Code 2.1.221 or later, signed in with a claude.ai account, with the Claude mobile app signed into the same account [SOURCE: https://code.claude.com/docs/en/sessions]. A throwaway checkout with the repo hooks and wrapper; `SESSION_RELAUNCH_MAX_HOPS=1`.

Starting state and steps, four senders in the same checkout:
1. **B1, named and renamed:** start `bash .skilled/bin/skilled-loop claude --remote-control` (bare flag, no value) under tmux; open the session in the app; rename it to `MOBILE-RENAME-1`; send a prompt that crosses the low threshold; follow the nudge; write the note; run `prepare`; end the turn; let the wrapper relaunch. Read, read-only, the sender's transcript for a `custom-title` entry and `~/.claude/sessions/<pid>.json` for `nameSource=user`; read the record's `name`; read the receiver's `ps` command line; watch the app's session list.
2. **B2, the replayed value:** start `bash .skilled/bin/skilled-loop claude --remote-control "OLD-TITLE"`; rename in the app to `MOBILE-RENAME-2`; hop the same way. Observe whether the app's new session is `OLD-TITLE`, `MOBILE-RENAME-2 (2)`, or a generated title.
3. **B3, generated title only:** start under the wrapper with no `--name`, no `/rename` and no goal; let the first prompt write the `ai-title` and wait for the entry before `prepare`; hop. Observe whether the app's new session is `<ai-title> (2)`.
4. **B4, the `/remote-control`-only path:** start under the wrapper without the flag; type `/remote-control` inside the session; hop. Observe whether the receiver appears in the app at all (auto-connect off).

Observation that proves each reading:
- Reading 1, "a mobile rename does not carry": the record's `name` after `prepare`. If it is `MOBILE-RENAME-1`, the rename reached the transcript and `prepare`; if it is empty, the rename was store-only or absent. The transcript and store reads say which side was written.
- Reading 2, "the app shows the new session without the name": the app's new-session title plus the receiver's `--name`. If the app shows `MOBILE-RENAME-1 (2)`, the carried name reached the app; if it shows a generated title, the record or the flag was empty; if it shows `OLD-TITLE`, the replayed Remote Control value won and F2's rewrite is the smallest change; if the receiver is absent, the sender had no replayed flag and auto-connect was off (F4).
- 039/003 in the app: B3's new session shows `<ai-title> (2)`.
- 038/012 custom-title carry: B1's new session shows `<rename> (2)`.
- The `--remote-control` precedence: B2's title is the deciding observation.

Run B covers: the mobile rename reading 1, the mobile rename reading 2, 039/003 in the app, 038/012 custom-title carry, and the wrapper's `--remote-control` replay behavior.

**Run C: the Pi mode and the Pi bind-once.**

Runtime: Pi 1.5.2 signed in to the `openai` provider [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/scratch/confirm-pi-mode.txt:18]. Start with `-ne -e .pi/extensions/session-relaunch.ts -e .pi/extensions/goal-context.ts --model openai/gpt-6-luna --plan` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:56]. A goal packet; `SESSION_RELAUNCH_MAX_HOPS=1`; a low threshold.

Exact steps:
1. Start the sender under `skilled-loop pi` with `--plan`; bind the goal with `/goal-pi bind specs/demo/001-demo` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:100].
2. Write the note, run `prepare`, and let the next turn end so `agent_end` arms.
3. Let the wrapper relaunch; read the receiver's launch line and pane.
4. In the receiver's process, run `/new` (or `/resume` or `/fork`) and read the goal store.

Observation that proves each fix:
- 038/015/L1: the receiver's launch line carries `--plan`, or its composer starts in Plan mode. The adapter reads the last plan-build state, and the wrapper adds `--plan` for a recorded Plan mode [SOURCE: .skilled/bin/skilled-loop:737].
- 038/002/L2: the receiver binds one goal record; after `/new`, the store gains no second record and the new session has no goal block, because the packet variable was deleted after the first attempt [SOURCE: .skilled/hooks/goal/pi/goal-context.ts:112].
- 038/012/L1 Pi live name (a limitation, not a fix): start with `--name "PI-NAME"` and attempt a live rename; the receiver keeps `PI-NAME`, because Pi carries the name from its launch line [SOURCE: .skilled/hooks/session-relaunch/README.md:49] and the adapter's only `name` occurrences are the core export check, not a title or rename path [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:190].

Run C covers: 038/015/L1, 038/002/L2, and the Pi live-name limitation.

**Run D: the OpenCode continuation, the child hold, and the cleanup.**

Runtime: OpenCode 2.2.7 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/implementation-summary.md:114]. Start the plugin with `OPENCODE_GOAL_AUTONOMY=active` and the goal packet; the wrapper's harness shim starts `--standalone` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:469]. A low threshold; `SESSION_RELAUNCH_MAX_HOPS=1`.

Exact steps:
1. Start the sender; bind the goal with `/goal-opencode bind specs/demo/001-demo` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:101].
2. Start a background sub-agent that runs long enough for the parent to go idle; let the parent idle.
3. Let the child end; let the deferred arm run; let the wrapper relaunch.
4. Read the receiver's goal block and the `relaunch.log` order; then run `/new` in the receiver and read the goal store and `SESSION_RELAUNCH_GOAL_PACKET`.

Observation that proves each fix:
- 038/005/L2: the receiver carries the goal block, and no `arm-cancelled` line or continuation user message withdrew the armed record. The continuation is suppressed while the record is pending or armed [SOURCE: .opencode/plugins/opencode-goal.js:3013].
- 038/013 child-busy: the parent's `session.idle` produces no arm line; the `arm`/`killer-signal`/`relaunch` lines follow the child's last `session.idle`, because `armOnIdle` defers while `hasBusyChild` is true [SOURCE: .opencode/plugins/session-relaunch.js:363].
- 038/008 OpenCode cleanup: after the bind attempt, the packet variable is unset, and the `/new` session binds nothing [SOURCE: .opencode/plugins/opencode-goal.js:3601].

Run D covers: 038/005/L2, 038/013 child-busy, and 038/008 OpenCode `finally` cleanup.

**Run E: HS-8 exactly as written.**

Runtime: Claude Code 2.1.323, with tmux and node [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:78].

Starting state and steps: the HS-8 block, with `ln -s "$harness/goal-records.cjs" "$out/goal-records.cjs"` and not a copy [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:922]. The sender starts a worker with `&` before `prepare`, runs `prepare`, ends, and `finish-run.sh` runs [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:927].

Observation that proves each fix:
- 038/017/L3: the patched `run-hop-worker.sh` finds `goal-records.cjs` through the link and the sender reaches `prepare`; a broken link fails before the hop.
- 038/017/L2: if the runtime writes the project folder back during shutdown, `finish-run.sh` prints its late-write line and removes it inside `FINISH_SETTLE_S` [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/finish-run.sh:29]. A run with no late write does not prove this fix; it only fails to disprove it.
- 038/009/L1: `PREPARE.exit` is 0 while the note says `Running workers: none` and the worker runs [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:936].

Run E covers: 038/017/L3, 038/017/L2 only when a late write occurs, and the 038/009/L1 limitation.

#### F8. What no live run can prove, and why. CONFIRMED from the code paths and the recorded limits.

- **038/017/L2, the late-write removal.** The late write is a shutdown race; a normal live hop may never produce it. The deterministic `test-finish-run.sh` is the negative control, and the recorded worker hop ended with no folder and no late write [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:117]. A live run can only observe the fix if the race happens; it cannot force it.
- **038/013/L2, a child that never reports an end.** The plugin clears the busy state only on `session.idle` or `session.deleted` [SOURCE: .opencode/plugins/session-relaunch.js:404]. Proving the stuck case needs a child killed without either event, which is fault injection, not a live hop. The smallest change is a child timestamp and an expiry in `hasBusyChild` (iteration 5's finding).
- **038/010/L2, a runner killed between `spawn()` and the `spawned` row.** The window is one synchronous append; a live hop cannot reliably hit it. The change is a child-written `spawned` row (iteration 5).
- **038/010/L1 and L3, a reused pid and the Windows pid-only probe.** These need a recycled pid or a Windows host; neither is a normal live hop [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:298] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:318].
- **038/003/L1, the 1.5 s headline walk.** This is a measurement, not a hop. A live run can time `prepare`, but the walk is the proof and the function is not exported.
- **038/016/L1, ten runs are a count.** More live runs add samples, not a proof of the skip rate. The limit is statistical.
- **038/016/L4, a goal that forbids other work, and 038/001/L1 and L2, the prose Active command and Scheduled lines, and 038/009/L2, the session-added directory.** These are model-obedience limits, not code paths. A live run can show one model's behavior; it cannot prove the instruction is followed in general [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal/decision-record.md:52].
- **039/001/L5, a pending record Stop cannot arm.** The guard refuses every question while the record is pending; the stuck state needs a deferred Stop plus a dialog. It is a known limitation of the fix, not a defect a live run would close without a code change [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md:131].
- **039/001/L6, other dialogs.** The binding matches `AskUserQuestion` only; a plan approval or a permission prompt is inferred to hold the turn the same way [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md:132]. A live run can show the hold, but it cannot prove the guard covers a tool it does not match.
- **039/003/L2, a title ending in the sender's hop number.** A live run with a title such as `Fix bug (2)` at hop 2 can reproduce the strip, but it is an edge of the numbering rule, not a shipped fix [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry/implementation-summary.md:127].
- **038/012/L2, a title older than the 16 MiB tail cap.** A live run can construct a >16 MiB log and rename early, but no fix exists; the cap is the current behavior [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:21].
- **039/002/L1 and L2, a cleared goal that comes back and a stale parent goal.** A live run can reproduce both with two sessions and a stale parent, but the operator chose to skip finished goal docs rather than carry the ending [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback/implementation-summary.md:127].

#### F9. The surviving gaps rank as follows, by operator impact against cost.

The ranking combines this iteration's live-proof gaps with the packet-level and parent-level survivors from iterations 7 and 8. Only the live-proof items were re-examined here; the parent-level items carry their earlier verdicts: the killer flake is a 50 ms idle/timeout margin [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-007.md:17], the Codex store has no packet column [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-007.md:31], the 002 parent slice is 3,993 characters with two honest rows [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-008.md:16], phase 033 is Complete except its own fields [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-008.md:46], and the sk-git rebase sentence is a doc defect [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-008.md:62].

| Rank | Gap or fix | Operator impact | Cost to close or prove | Why it sits here |
|---|---|---|---|---|
| 1 | Mobile app name after a hop (readings 1 and 2; 039/003; 038/012) | High: the operator's reported symptom, and the app is the only surface they see | Medium: one phone-and-app run, plus the store reader or the `--remote-control` value rewrite | The highest visibility for one run |
| 2 | 039/001 dialog guard | High: one dialog can silently lose the hop at the context limit | Low: Run A, one sender-run hop | Closes the worst failure mode with the least effort |
| 3 | 039/002 packet goal fallback | Medium-high: the receiver starts on the right goal without the operator typing it | Low: the same Run A | Shares Run A with the two neighbours |
| 4 | Codex goal reader | High for Codex users: no packet is carried at all | High: the store has no packet column and a new reader cannot produce one [SOURCE: .skilled/hooks/session-relaunch/README.md:181] | High impact, but not a small change |
| 5 | OpenCode 005 and 013 | Medium: autonomy can withdraw a prepared hop, and a busy child can keep the parent unarmed | Medium: Run D needs an OpenCode sub-agent and a goal | Real but runtime-specific |
| 6 | Pi 002 and 015 | Medium: the goal can leak into later Pi sessions; a Plan mode can be lost | Low-medium: Run C, one Pi hop plus `/new` | One run covers both |
| 7 | 038/008 residuals | Low-medium: a non-open note can be rewritten; a failed bind can leave the packet | Low: fold into Runs A and D | Cheap coverage beside the larger runs |
| 8 | 038/004 switch-off path | Low: only a manual claim with the Claude enable flag off | Low: one manual claim with the flag off | A unit case covers the code; the live value is small |
| 9 | 038/017/L3 helper link | Low: the playbook's live check fails before the hop | Very low: Run E as written | A one-line path proof |
| 10 | 038/017/L2, 038/013/L2, 038/010 races | Low: rare shutdown, child-end and pid windows | High: fault injection, not a live hop | The proof does not exist in a hop |
| 11 | 002 parent goal binding | Medium: the parent goal does not bind 037, 038 and 039 | Low: the rows and the 7-character budget, as iteration 8 found | Carried from iteration 8; a packet edit, not a run |
| 12 | Phase 033 Draft, sk-git `Commit-Id`, killer test flake | Low: documentation and one flaky test | Low for the docs, medium for the flake | Carried from iterations 7 and 8 |

## Questions Answered

- **Live proof and ranking:** answered. The inventory is in F7: 039/001, 039/002 and 039/003 have no live hop; 038/002, 005, 008, 012, 013, 015 and 017/L3 have no live end-to-end proof; 038/004's switch-off path has no live proof; the already-proven paths are named. The smallest set is five runs: A (Claude, the three 039 fixes plus 016/L3, 008 and 012), B (Claude Remote Control, both mobile readings plus 039/003 in the app and the `--remote-control` precedence), C (Pi, 002 and 015), D (OpenCode, 005, 013 and 008), and E (HS-8, 017/L3 and the late write if it happens). The ranking is in F9. The exact app title and the mobile write path stay UNCONFIRMED until Run B; the vendor precedence between `--name` and `--remote-control <name>` is the deciding unknown.

## Questions Remaining

No strategy key question remains. The live-run evidence the answers depend on is still uncollected: the exact mobile write side, the app title after a hop, the `--remote-control` precedence, the Pi Plan receiver, the OpenCode deferred arm, and the late write. Iteration 10 is the cross-check of iterations 1 to 9: reopen the citations, mark each item confirmed, refuted or unconfirmed, and confirm the ranking against the final evidence.

## Ruled Out

- **The app continues the same session after a hop.** The vendor says each interactive process registers one remote session, and a hop is a new process [SOURCE: https://code.claude.com/docs/en/remote-control]; the app shows a new session, and the name is the only thing that can continue.
- **The wrapper passes no `--name` on a hop.** It appends `--name "<stem> (<hop+1)>"` whenever the record carries a replayable name [SOURCE: .skilled/bin/skilled-loop:417]; the missing-name case is an empty record or a failed validation, not a missing code path.
- **The mobile rename is version-gated on this machine.** The transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:40]. It remains a cause for older installs.
- **One live run can prove the late-write removal.** The race may not happen; the deterministic test is the negative control [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:117].

## Dead Ends

- No newly exhausted research direction. The live-only limits from iterations 5 to 6 (015/L1, 016/L3, 017/L2, 017/L3) stay live-only; the named runs are the next step, not more reading.
- The exact mobile write cannot be attributed from the local logs: no entry type or field carries the client, as iteration 1 found [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:74]. Run B is the only closure.

## Edge Cases

- **Ambiguous input:** "the app shows the new session without that name" has three readings: no name, a different name (a generated title or the replayed `--remote-control` value), and the numbered `<stem> (n)`. All three are separated; Run B's record, launch line and app title distinguish them.
- **Contradictory evidence:** the vendor says `--name` is a title source, and the wrapper also replays `--remote-control [name]`; the vendor does not rank the two. Preserved as UNCONFIRMED; Run B decides.
- **Missing dependency:** no live run was executed, so the mobile write side, the app title and the Remote Control precedence are unconfirmed. The read-only evidence that is missing is one hop with the app open, a transcript/store diff, and the receiver's launch line.
- **Partial success:** the wrapper path, the vendor rules and the live-proof inventory are confirmed; the app behavior and the mobile write are not. The iteration is complete as research, not as live proof.

## Sources Consulted

- `.skilled/bin/skilled-loop:276`, `:286`, `:319-351`, `:415-425`, `:590`, `:673`, `:693`, `:706-796`, `:1077-1096`, `:1435-1457`
- `.skilled/hooks/session-relaunch/README.md:49`, `:181`, `:189`
- `.skilled/hooks/session-relaunch/lib/context-usage.cjs:21`, `:229-276`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:601-628`, `:630-660`, `:697`, `:766-791`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592`
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:190-192`
- `.skilled/hooks/goal/pi/goal-context.ts:106-112`
- `.opencode/plugins/session-relaunch.js:351-374`, `:404`
- `.opencode/plugins/opencode-goal.js:3013`, `:3601`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:298`, `:318`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:452-511`, `:827`, `:842-938`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:56`, `:100-101`, `:112-139`, `:229-247`, `:431-476`, `:510-524`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/make-goal.cjs:14`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/finish-run.sh:29`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare/implementation-summary.md:127-132`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback/implementation-summary.md:127-131`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry/implementation-summary.md:126-130`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/002-pi-bind-once/implementation-summary.md:104`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim/implementation-summary.md:103-104`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/005-opencode-continuation-hop/implementation-summary.md:107`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories/implementation-summary.md:121-123`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry/implementation-summary.md:112-113`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/implementation-summary.md:114-116`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons/acceptance-criteria.md:54`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/implementation-summary.md:123`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal/implementation-summary.md:72`, `:111-114`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:116-119`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md:14`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/research/iterations/iteration-001.md:40`, `:74`
- `command claude --help`, lines 139, 187-190
- `command claude remote-control --help`, line 7
- https://code.claude.com/docs/en/remote-control
- https://code.claude.com/docs/en/sessions
- https://code.claude.com/docs/en/mobile

## Assessment

- New information ratio: 0.85. Nine findings are new to the packet (the wrapper's Remote Control replay, the vendor title order and new-process rule, the `/remote-control`-only gap, the live-proof inventory, the five-run set, the no-live-proof list, the ranking, the three readings of the report, and the fallback live-run requirement). Two refine earlier findings (the numbered name, the mobile store gap). One re-confirms iteration 1's version floor.
- Questions addressed: the second reading of the operator report and the live proof and ranking key question.
- Questions answered: the live proof and ranking key question, with the app title and mobile write path marked UNCONFIRMED until Run B.

## Reflection

- **What worked and why:** reading the wrapper's replay classifier next to the vendor title order found the `--remote-control [name]` conflict that a name-only read would have missed; the help line's `[name]` proves the flag takes a value, and the value table proves the wrapper replays it. Reading the packet summaries next to the playbook's existing checks turned the live gaps into a per-runtime matrix instead of a list of slogans.
- **What did not work and why:** the vendor page does not rank `--name` against `--remote-control <name>`, so the precedence cannot be settled by reading; the app title needs a live run. The first inventory treated the ten goal hops as covering 038/004, but the summary's own limitation shows the switch-off path was never in those runs [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/004-claude-start-claim/implementation-summary.md:103].
- **What I would do differently:** for every proposed live run, state the failure branch beside the pass observation (app shows `OLD-TITLE` means the replay won; app shows a generated title means the record was empty). That is what makes Run B decisive rather than a demo.

## Recommended Next Focus

Iteration 10: the cross-check. Reopen the citations for iterations 1 to 9, mark each item confirmed, refuted or unconfirmed, check that the live-run set still matches the final code, and confirm the ranking. Do not start a runtime; the five runs are the operator's next step, not this run's.

## SCOPE VIOLATIONS

None. All writes landed in the iteration and delta paths; the research targets were read-only.
