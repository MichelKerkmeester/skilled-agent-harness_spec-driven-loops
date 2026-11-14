---
title: "Session relaunch loop: gaps, unknowns and open ends of packets 038 and 039"
trigger_phrases:
  - "mobile rename does not carry over a hop"
  - "stale relaunch wrapper keeps old code"
  - "packet 038 and 039 open ends"
  - "relaunch live proof run set"
  - "cleared goal comes back after a hop"
---
# Session relaunch loop: gaps, unknowns and open ends of packets 038 and 039

<!-- ANCHOR:deep-research-relaunch-gaps -->

Synthesis of a ten-iteration deep-research run over packets `038-goal-and-workflow-resume` and `039-hop-dialog-goal-title`. The iterations read the code, the packet documents, each runtime's own help output and three vendor pages. They started no runtime session and ran no relaunch command. Section 3 also carries what the orchestrating session observed on this machine about its own hop, which no iteration could see.

## 1. Executive Summary

The operator asked why a Claude rename does not carry over in the mobile app. The run found one cause that explains every hop on this machine today, three further conditions that decide what the app shows, and 23 ranked changes.

1. **Every relaunch wrapper running today predates the name-carry code.** The four wrappers in this repository started between 10:16 and 10:52 on 2026-11-13. The code that reads the session name from the relaunch record and passes `--name` landed at 12:52. A wrapper runs the code it parsed at start, so none of them can carry a name. No session they launched has a `--name` flag. This is observed on the machine, and the cause is inferred. One hop from a freshly started wrapper confirms or refutes it.
2. **A fresh wrapper is necessary, and may not be sufficient.** Three things still decide the app title: whether an app rename is written to the transcript that `prepare` reads, whether the receiver is a Remote Control session, and whether a replayed `--remote-control <old name>` outranks `--name`. None is settled without a live run.
3. **Packet 039's three fixes hold in the code, and the eight limits this run checked are all real.** The worst: a pending record that Stop cannot arm blocks every question until `cancel`, and a goal cleared by hand comes back one hop later.
4. **Packet 038's 49 recorded limits each have a verdict.** Five are refuted, most are confirmed and accepted, and a handful have a small fix.
5. **Three parent-level items are documentation defects.** The 002 parent goal binds neither 038 nor 039. Phase 033 says Draft while its nine children say Complete. One sentence in the sk-git skill about a rebase keeping a `Commit-Id` is wrong.
6. **Ten shipped fixes or groups of fixes have no live hop behind them.** Six live runs close what a live run can close.

Section 9 ranks the changes. Section 10 groups them into work packages and names the five operator decisions they need.

## 2. Scope, Method and Terms

- **In scope:** the mobile rename report, the recorded Known Limitations of packet 039 children 001 to 003 and packet 038 children 001 to 017, the once-failing killer test, the missing Codex goal reader, the 002 parent goal's missing binding rows, phase 033's Draft status, the sk-git `Commit-Id` rebase claim, and which fixes lack live proof.
- **Evidence used by the iterations:** repository code and tests, packet documents, `command claude --help`, `command codex --help`, the schema and row counts of `~/.codex/goals_1.sqlite`, entry types and field names in Claude's local stores (no conversation text), and the vendor pages for Remote Control, sessions, mobile and hooks.
- **Evidence added by the orchestrator:** process start times and command lines from `ps`, the title fields of two sessions in `~/.claude/sessions`, the title entries of the sending and receiving transcripts, the wrapper file's git history, and one call of `readClaudeSettings` on the sending transcript. All read-only.
- **Not done:** no runtime session was started for the research, and `prepare`, `claim`, `keep`, `cancel` and `complete` were not run by any iteration. Nothing was committed, merged or pushed.
- **Verdict words:** CONFIRMED means the cited code, document or command output says it. REFUTED means it says otherwise. UNCONFIRMED means no read-only evidence settles it, and the missing evidence is named. OBSERVED, DERIVED and INFERRED mark the orchestrator's own evidence in section 3.
- **A hop** is one relaunch: the sender writes a note, `prepare` records it, a killer ends the idle runtime and the wrapper starts a receiver that claims the note. **The wrapper** is `.skilled/bin/skilled-loop`, a bash script that stays alive across hops.

## 3. The Name That Does Not Carry

<!-- ANCHOR:findings -->

### The running wrappers predate the fix: OBSERVED, cause INFERRED

This finding comes from the orchestrating session, which is itself the receiver of a hop.

- **OBSERVED:** four `skilled-loop claude --dangerously-skip-permissions` processes run from this repository. `ps -o lstart=` gives their starts as 10:16:48, 10:19:08, 10:49:18 and 10:52:25 on 2026-11-13, local time. They have done between 1 and 6 hops.
- **OBSERVED:** commit `76f1ebe1b6`, dated 12:52:27 the same day, added the name carry to the wrapper. `git show <commit>:.skilled/bin/skilled-loop` holds `consumed_field name` zero times in the two versions before it and once from that commit on. `append_name_arguments` goes from zero to three occurrences.
- **OBSERVED:** every Claude process under those wrappers, including two started at 22:33 and 23:08, has no `--name` on its command line and no `SKILLED_LOOP_NAME` in its environment.
- **OBSERVED:** the session that sent the 22:33 hop holds 47 `custom-title` entries in its transcript, all `IN SESSION HANDOVER`. The first follows an entry stamped 20:41:45Z, within a minute of that session's start. The last precedes its `prepare`.
- **OBSERVED:** `readClaudeSettings`, the reader `prepare` uses, returns `name: "IN SESSION HANDOVER"` for that transcript today.
- **OBSERVED:** the receiver of that hop has `name: "skilled-9a"` and `nameSource: "derived"` in `~/.claude/sessions/2591.json`, with a bridge session id. Its transcript has no `custom-title` entry.
- **DERIVED:** the relaunch record carried the name. `prepare` is a fresh `node` process on every call and runs the current reader over the same transcript. The record itself is consumed and gone, and the `prepare` log line does not print the name.
- **INFERRED:** the wrapper never read it. Its main loop is one top-level `while true; do ... done` from `.skilled/bin/skilled-loop:1199` to the end of the file. Bash parses a whole compound command before running it, so each wrapper runs the loop body and the functions it parsed at start, which had no name step.

**What confirms it:** start one wrapper on the current file, rename the session, hand over once, and read the receiver's command line. `--name "<name> (2)"` present confirms the cause. Absent refutes it, and the next read is the record before `consume` runs.

**What follows:**

- No hop on this machine has yet run the name carry of 038/012 or the generated-title carry of 039/003. The wrapper file was also changed at 12:05 (permission mode carry) and 13:16 (Pi mode carry) the same day. Wrappers started before those times lack them as well. Hook-side and `prepare`-side fixes are unaffected, because each runs as a fresh process.
- The wrapper has no check of its own file. A fix to it reaches a running loop only after a restart, and nothing tells the operator.
- The report was made while every wrapper predated the fix. It therefore says nothing yet about whether the shipped code carries a name.

A second reviewer, Fable 5.2 at medium effort through a separate account, was given the observations without the conclusion. It ranked the stale wrapper as by far the likeliest explanation and named the same confirming check. It added one discriminator: the current wrapper always exports `SKILLED_LOOP_NAME` (`.skilled/bin/skilled-loop:1446`), so its absence from the receiver's environment points at old code, not at a dropped name. The reviewer and the orchestrator are the same model family, so this is a check of the reasoning, not independent corroboration.

### Where `prepare` reads a name: CONFIRMED

`resolveSessionSettings` sends a Claude session to `claudeSessionLogPath`, which scans `~/.claude/projects/*/<sessionId>.jsonl` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:619`, `:766`). `readClaudeSettings` takes the last non-empty `custom-title` entry and separately the last non-empty `ai-title` entry (`.skilled/hooks/session-relaunch/lib/context-usage.cjs:247`, `:253`). `prepare` ranks them as transcript rename, then launch name, then generated title (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592`). Nothing in this path reads any other store.

### A second title store that nothing reads: CONFIRMED

`~/.claude/sessions/<pid>.json` holds `name`, `nameSource`, `nameSince` and `bridgeSessionId`. No relaunch code reads it. The only `sessions` folder the code opens is Codex's rollout tree (`relaunch-core.cjs:697`). The vendor says a rename from claude.ai or the app "also updates the local title shown in `claude --resume`", from Claude Code 2.1.221. It does not say the rename writes a transcript entry.

On this machine, five of six live sessions had `nameSource: "user"`, and in all five the store name equalled the last transcript `custom-title`. So a user rename on a bridged session does reach the transcript here. No field records which client made the rename, so none of the five can be attributed to the mobile app.

### What an app rename writes: UNCONFIRMED

Three shapes fit the report, and the code makes each silent:

1. **A store-only rename.** The app updates the store and no transcript entry follows. `prepare` reads the old transcript value and falls back to the launch name or the generated title.
2. **A cloud-session rename.** The mobile Code tab also lists cloud sessions, which do not run on this machine. No local file changes and no hop can carry it.
3. **A rename after `prepare`.** `prepare` snapshots the name when it runs.

One read after one app rename decides between the first shape and a rename that reaches the transcript: the transcript tail and the session store, compared with the record.

### What the app shows after a hop: CONFIRMED in part, UNCONFIRMED for the title

- **A carried name is numbered.** A hop appends `--name "<stem> (<hop + 1>)"` (`.skilled/bin/skilled-loop:417-421`). A sender named `My Task` yields `My Task (2)`. That is deliberate.
- **A hop is a new app session.** The vendor says each interactive Claude Code process registers one remote session. The sender goes offline and the receiver appears as a new session. The name can continue. The session identity cannot.
- **The receiver must be a Remote Control session.** The wrapper replays `--remote-control` only when it was on the launch line (`.skilled/bin/skilled-loop:590`, `:1080`). A sender that connected with `/remote-control` inside the session leaves nothing to replay. On this machine the receiver is bridged with no such flag on its command line, so Remote Control auto-connect appears to be on. That removes this condition here.
- **A replayed `--remote-control <old name>` may outrank `--name`.** The vendor lists `--name`, `--remote-control <name>` and `/remote-control <name>` as one title source and does not rank them. Which wins is UNCONFIRMED.
- **Whether `--name` reaches the app title at all is UNCONFIRMED.** The server subcommand's help says its `--name` is "shown in claude.ai/code". No help line or vendor sentence says the same of the interactive `--name` for a bridged session.

### The tail cap and the version floor: ruled out as mobile causes

A rename older than 16 MiB from the end of the transcript is missed (`context-usage.cjs:21`). That applies to any old rename, not to a mobile one. Local transcripts show versions 2.1.295 to 2.1.325, above the 2.1.221 floor.

## 4. Packet 039 Residual Gaps

### 001, the question dialog after `prepare`

- **A pending record Stop cannot arm: CONFIRMED.** The guard denies the dialog whenever `armableRecord` reports `pending` (`.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:65`, `:84`, `:117`). Stop leaves a record pending without changing it when the transcript path is missing, when no kill target resolves and when arming fails (`.skilled/hooks/session-relaunch/claude/stop-arm.mjs:124`, `:169`, `:196`). Only the background-task deferral stamps `deferredAt` (`stop-arm.mjs:143`), and only a stamped record is withdrawn by the next prompt (`.skilled/hooks/session-relaunch/lib/withdraw.cjs:27`). The other three states clear only through `cancel` or a later Stop that succeeds. The packet's own example, a deferred Stop, is the one state that already has a way out.
- **Other dialogs: CONFIRMED in code, inferred for behaviour.** The guard is bound to `AskUserQuestion` only (`subagent-guard.mjs:25`). `ExitPlanMode` is a tool a PreToolUse hook can see, and it holds the turn the same way. A permission prompt needs the `PermissionRequest` event, which the Claude `eventOrder` in the hook registry lacks.
- **An unreadable record: CONFIRMED, and one case is worse than recorded.** Invalid JSON is logged and read as no record, so the dialog is allowed and Stop does not arm. A record that parses but has no `handoff` is treated as pending: the guard prints `undefined` as the note path, and Stop can arm a hop with no note (`relaunch-core.cjs:1125`, `:1046`). No test covers either case at the guard or at Stop.
- **Pi, OpenCode and Codex: CONFIRMED.** Each has a question tool and none is guarded. Codex already has a PreToolUse event. OpenCode needs a `tool.execute.before` hook. Pi needs a `tool_call` handler. Their withdrawal on a user message takes only an armed record, so answering the question does not clear a pending one.

### 002, the packet goal fallback

- **A cleared goal comes back: CONFIRMED.** In the clearing session the newest goal entry is the clear, so nothing is carried. The next session has no goal entry at all, and the fallback picks the first ancestor whose `goal.md` is within budget and has an unticked criterion (`relaunch-core.cjs:601`, `:653-656`). The clear suppresses exactly one hop. A goal recorded as met or failed returns the same way when its `goal.md` still has an unticked box. The tests cover the clearing hop and not the hop after it.
- **A stale ancestor can be picked: CONFIRMED.** `packetLineage` walks every parent up to `specs` (`relaunch-core.cjs:509`), and the fallback checks budget and an unticked box, never that the packet relates to the note. The active-goal path does require the goal's opening line in the packet's `goal.md` (`relaunch-core.cjs:671-675`).
- **Today the fallback carries nothing for this lineage.** Packets 039 and 002 have every criterion ticked, and the folders above 002 hold no `goal.md`.

### 003, the generated title

- **A title ending in the sender's own hop number loses it: CONFIRMED for that one case.** `name_stem` strips a trailing ` (N)` when N is at least 2 and equals the sender's number (`.skilled/bin/skilled-loop:286-288`). It cannot tell a number the wrapper wrote from one in the title's own text. Any other number survives. How often a generated title ends that way is UNCONFIRMED.
- **The cost of the added log search: CONFIRMED in structure, estimated in size.** A Claude `prepare` runs four tail searches, three for settings and one for the goal. Each starts at 256 KiB and widens by four up to 16 MiB. A miss on a 16 MiB log reads about 21 MiB in four passes. The figure is derived from the constants, not measured.

## 5. Packet 038 Limits by Child

Every recorded limit was checked against the current code. The table gives the ones that change something. Limits that are confirmed and accepted as recorded are listed after it.

| Child | Limit | Verdict | What it means for the operator |
|---|---|---|---|
| 001 | The receiver is asked to re-run the active command, not forced | CONFIRMED | A receiver that skips the step keeps working with no loop and no error |
| 001 | A `/loop` or wakeup ends with the sender | CONFIRMED | Only the note's `Scheduled:` line carries it. No code reads that line back |
| 001, 003 | Codex carries no goal packet | CONFIRMED, by design | See section 6 |
| 002 | Cursor and Devin keep the per-session bind | CONFIRMED | Neither clears `SESSION_RELAUNCH_GOAL_PACKET` after a bind, so a later session in the same process can bind the sender's goal. Pi and OpenCode clear it |
| 003 | A headline shared by two packets drops the goal | CONFIRMED | The reason is printed only in the sender's terminal. The receiver sees nothing |
| 003 | The headline search costs about 1.5 s | CONFIRMED in structure | The walk reads every `goal.md` under `specs/`. The figure was not re-measured |
| 004 | Not run in a live Claude session | REFUTED | Ten of ten receivers claimed under an allowing goal on 2026-11-13 |
| 005 | OpenCode autonomy is off by default | CONFIRMED | A receiver continues its goal only with `OPENCODE_GOAL_AUTONOMY=active` |
| 008 | Two switch parsers remain | CONFIRMED | They agree on the outcome and not on the mechanism. A later edit can split them |
| 009 | `prepare` has no liveness check | CONFIRMED | A note that says `Running workers: none` while one runs is accepted |
| 009 | The README and playbook keep the old wording | REFUTED | Closed by child 017 |
| 009, 013 | The full suite needs `OPENCODE_DB` unset | CONFIRMED | One test inherits the ambient database name. It is a test defect, not a relaunch defect |
| 010 | A reused pid can refuse a run | CONFIRMED, accepted | The operator chose refusal with no override |
| 010 | A runner killed before the `spawned` row leaves no pid | CONFIRMED | A live lane can be requeued, which gives two writers in one lineage |
| 011 | The two live facts are unrecorded | REFUTED | The child's own `scratch/live-checks.md` and acceptance row say they are met. The summary is stale |
| 011 | A live `default` mode is not mapped | REFUTED | The wrapper accepts `default` (`.skilled/bin/skilled-loop:224-231`). The summary is stale |
| 012 | Pi live names stay out | CONFIRMED | A Pi hop keeps the launch name after a live rename. OpenCode was closed by child 013 |
| 012 | A title older than the 16 MiB cap is missed | CONFIRMED | A very long session loses an early rename |
| 013 | A child that never reports an end keeps the parent unarmed | CONFIRMED, accepted risk | The hop never arms and the session falls through to compaction |
| 014 | The cron list is not in the Stop notice | CONFIRMED | Only the count is logged. If the note omits the crons, their prompts are gone |
| 015 | No live Pi hop carried the mode | CONFIRMED | Each layer is tested. The hop as a whole is not |
| 016 | A sender can fail to hand over under a goal | CLOSED in code by 039/001 | No hop where the sender itself ran `prepare` has confirmed it live |
| 017 | The playbook's helper link was not run | CONFIRMED | The live run used a copy, not the `ln -s` the playbook prints |
| 017 | The Pi and OpenCode playbook has no checks for 013 and 015 | REFUTED as a coverage gap | The suite commands run the files that hold those cases. Only their names are missing from the evidence lines |

Confirmed and accepted as recorded, with no change proposed: 004 (the claim needs the wrapper), 006 (the shell must source the shim), 007 (documentation only), 008 (a throwing bind does not reject the event), 010 (Windows liveness), 011 (the planned baseline moved), 014 (the notice repeats at every deferred Stop, and the cron hop ran after the build), 015 (a shell below a non-shell child, a mode flag used as another option's value, a hop that records no mode), 016 (ten runs are a count, one run is weaker, a forbidding goal can suppress the claim) and 017 (the late write was not seen live).

## 6. Packet and Parent Open Ends

### The killer test that failed once: CONFIRMED in code, UNCONFIRMED as the cause

The test `killer keeps the record armed when the target exits during its grace period` runs the killer with `idleMs: 400` and `timeoutMs: 450` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs:787-788`). The killer polls every 100 ms and checks for idle only inside `while (Date.now() < deadline)` (`.skilled/hooks/session-relaunch/lib/killer.cjs:22`, `:180`). A poll delayed by about 50 ms under load misses the window, `waitForIdle` returns false and the run is recorded as a timeout. The orchestrator read the same lines and reached the same margin. The failing run's log was not kept, so this is the likeliest cause and not a reproduced one. The earlier spawn race is refuted for the current failure, because the test now waits for the target's ready line.

### A Codex goal reader: CONFIRMED as a limit by design

Codex keeps its goal in `~/.codex/goals_1.sqlite`, table `thread_goals`, keyed by thread, with an objective and a status and no packet column. `select count(*)` returned 0 on this machine, in the iteration and again for the orchestrator. `resolveGoalPacketResult` returns no packet for Codex with a fixed reason (`relaunch-core.cjs:899-903`). A reader could copy only the objective text, which the note's `Active goal:` line already asks the sender to write.

### The 002 parent goal's binding rows: CONFIRMED

`goal.cjs packet` prints `packet_durable_chars=3993` and `packet_budget=ok`, so seven characters remain. The binding table ends at phase 036. Phases 038 and 039 each hold a `goal.md` and have no row. Phase 037 has no `goal.md`, so a row for it would point at a missing file. `check-goal.cjs` reads only the second cell of a row and accepts exactly one path (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:165`), which rules out one grouped row. Two rows fit only with cuts to decision and criterion wording: two compact rows plus shorter D1 and D7 land at 3,981 characters.

### Phase 033 says Draft: CONFIRMED mismatch

The parent `spec.md` says Draft in its status field and in all nine rows of its phase map, with `completion_pct: 0`. All nine child specs say Complete. The parent's own handoff criterion says the children are Complete. The iterations could not run the recursive validation, so "Complete" rests on the children's status rows and not on a fresh `RESULT: PASSED`.

### The sk-git rebase sentence: CONFIRMED as a documentation defect

`.skilled/skills/sk-git/SKILL.md:322` says "A rebase keeps the id". The hook stamps an id when the pending message has none or when a cherry-pick is in progress (`.skilled/scripts/git-hooks/prepare-commit-msg:286`). It keeps an id only when the replayed message still carries one. The three packet 039 commits show it: the first kept `0013887`, and the two that were replayed carry `0013892` and `0013893`. The hook behaves as designed. The sentence is wrong.

<!-- /ANCHOR:findings -->

## 7. Live Proof

### Fixes with no live hop behind them

| Fix | Child | State |
|---|---|---|
| Name carry and generated-title carry | 038/012, 039/003 | Never run in a wrapper hop on this machine (section 3) |
| The dialog guard | 039/001 | The four saved runs had the harness run `prepare`, not the sender |
| The packet goal fallback | 039/002 | Not run live |
| Pi bind once | 038/002 | Not run on a live Pi |
| The start claim with the enable switch off | 038/004 | The basic claim is live. The switch-off path is not |
| OpenCode continuation and packet cleanup | 038/005, 038/008 | Read from the code |
| The nine review advisories | 038/008 | Suites only |
| OpenCode child-busy deferral | 038/013 | The gap was seen live before the fix. The fixed behaviour was not |
| Pi mode carry | 038/015 | No hop with the mode carried |
| The playbook's helper link | 038/017 | The live run used a copy |

Already live and needing no new run: the Claude start claim, the receiver claim under a goal, the permission-mode carry, the cron observation and the OpenCode title through the bridge.

### The smallest set of runs

| Run | Runtime | What it does | What it proves |
|---|---|---|---|
| 0 | Claude | Restart one wrapper, rename the session, hand over once, read the receiver's command line | Whether the stale wrapper is the cause. It is a precondition for runs A and B |
| A | Claude | One hop where the sender runs `prepare` itself, has no goal set, has only a generated title and then opens a question | 039/001, 039/002, 039/003, 038/016, the non-open note guard of 038/008 |
| B | Claude with the mobile app | Four senders: renamed in the app, launched with `--remote-control "OLD"` then renamed, generated title only, connected with `/remote-control` only | What an app rename writes, what the app shows after a hop and which name source wins |
| C | Pi | One hop started with `--plan`, then `/new` in the receiver | 038/015 and 038/002 |
| D | OpenCode | One hop with autonomy on and a busy child | 038/005, 038/013, the cleanup of 038/008 |
| E | Claude | The playbook's HS-8 block exactly as written | The helper link of 038/017 |

### What no live run can prove

The late-write removal of 038/017 and the races of 038/010 and 038/013 need fault injection, because a normal hop may never hit the window. The claim rate of 038/016 is a sample and stays one. The prose instructions of 038/001 and 038/009 depend on the model following them, which one run shows for one model.

## 8. Cross-Iteration Agreement and Conflict

- **No finding was reversed.** Iteration 10 reopened the ten most load-bearing citations. All ten held, and eight line anchors had drifted by one to nine lines. This document uses the corrected anchors.
- **One finding changed the reading of another.** Iteration 1 named a store-only rename as the likeliest cause of the report. The orchestrator's observation in section 3 shows that on this machine the rename was in the transcript and the wrapper could not have carried it either way. The store gap remains a real code gap. It is no longer the leading explanation here.
- **One condition from iteration 9 does not apply here.** It warned that a receiver may be absent from the app when the sender connected without a launch flag. The receiver observed in section 3 is bridged with no such flag.
- **One iteration disagreed with a packet document and was right.** Iteration 5 found the 011 summary contradicted by that child's own live checks and acceptance row.
- **Two iterations gave different advice on Codex.** Iteration 4 proposed a reader as the smallest change. Iteration 7 read the store's schema and found no packet column. The schema settles it in favour of iteration 7.

## 9. Ranked Changes

Ranked by operator impact against cost. The order is the orchestrator's, built on iteration 10's ranking with the stale wrapper added at the top. Sizes are judgment.

| Rank | Change | Where | Size | Needs first |
|---|---|---|---|---|
| 1 | Restart the running wrappers | Operator action, no code | none | Nothing |
| 2 | Tell the operator when the wrapper file changed since the loop started | `.skilled/bin/skilled-loop`: hash at start, one stderr line before each hop launch | small | Decision 1 |
| 3 | Give every parked record a prompt escape | `claude/stop-arm.mjs`: call `markDeferred` on the three paths that leave a record pending | small | Nothing |
| 4 | Refuse `ExitPlanMode` while a hand-over is pending | `claude/subagent-guard.mjs` and the registry matcher | small | Decision 3 |
| 5 | Reject a record with no `handoff` at the read | `relaunch-core.cjs` `readRelaunchFile`, with a guard test and a Stop test | small | Nothing |
| 6 | Stop a cleared goal coming back | A note field written by `recordGoalPacket` and read by the fallback | small to medium | Decision 4 |
| 7 | Bound the goal fallback to the note's folder and its parent | `relaunch-core.cjs:656` | small | Decision 4 |
| 8 | Read the Claude session store for a user rename | `relaunch-core.cjs` `resolveSessionSettings` | small to medium | Run B, decision 2 |
| 9 | Stop a replayed `--remote-control <old>` competing with `--name` | `.skilled/bin/skilled-loop` replay classifier | small | Run B, decision 2 |
| 10 | Strip only a number the wrapper wrote | `.skilled/bin/skilled-loop:286` `name_stem` | small | Nothing |
| 11 | Bind 038 and 039 in the 002 parent goal | `002-session-relaunch-loop/goal.md` | small | Operator sees the amendment |
| 12 | Set phase 033 to Complete | Parent `spec.md`, phase map, continuity, goal boxes | small | A recursive strict validation |
| 13 | Correct the sk-git rebase sentence | `.skilled/skills/sk-git/SKILL.md:322` | one sentence | Nothing |
| 14 | Widen the killer test's timeout | `killer.test.cjs:788`, 450 to 1000 | one line | Nothing |
| 15 | Clear the packet variable after a bind on Cursor and Devin | `goal/cursor/goal-inject.mjs:51`, `goal/devin/goal-inject.mjs:40` | small | Nothing |
| 16 | Unset `OPENCODE_DB` in the history-lookup test | `.opencode/plugins/tests/session-history-lookup.test.cjs:135` | one line | Nothing |
| 17 | Rewrite the two stale rows of the 011 summary | `038/011-permission-mode-carry/implementation-summary.md` | small | Nothing |
| 18 | Carry the Pi live name and fall back to the carried mode | `pi/session-relaunch.ts` | medium | Run C |
| 19 | Expire an OpenCode child that never ends | `.opencode/plugins/session-relaunch.js` `hasBusyChild` | small | Nothing |
| 20 | Probe the pids a note lists | `bin/session-relaunch.cjs:421` | small | Nothing |
| 21 | Scan backwards for a title past the 16 MiB cap | `lib/context-usage.cjs` | medium | Nothing |
| 22 | Guard the question tool on Codex, OpenCode and Pi | Three adapters | large | Decision 3 |
| 23 | Name the 013 and 015 cases in the playbook, and use `cp` in HS-8 | Two playbook files | small | Nothing |

## 10. Work Packages and Operator Decisions

| Package | Ranks | Runtime |
|---|---|---|
| A. Wrapper freshness and app name | 1, 2, 8, 9, 10, 21 | Claude and the shared wrapper |
| B. Hop-dialog safety | 3, 4, 5, 22 | Claude first |
| C. Goal continuity | 6, 7 | Claude |
| D. Runtime coverage | 15, 18, 19 | Cursor, Devin, Pi, OpenCode |
| E. Reliability residue | 14, 16, 20 | Tests and `prepare` |
| F. Documents and metadata | 11, 12, 13, 17, 23 | Documents |

Five decisions belong to the operator:

1. **How a running wrapper learns of a fix.** A documented restart, a notice or a re-execution between hops. See section 11.
2. **Which name wins.** When the transcript rename and the session store disagree, and whether a replayed `--remote-control <old name>` is rewritten or dropped.
3. **How far the dialog guard goes.** Claude only, or all four runtimes.
4. **Whether a goal's ending is carried.** Packet 039 child 002 recorded the choice to skip finished goal documents and not to carry an ending. Ranks 6 and 7 change that, so they are an amendment.
5. **Whether Codex gets a goal reader.** The evidence says to keep it a documented limit.

## 11. Recommendations

1. **Restart the wrappers and run check 0 before anything is built.** It costs one hop and decides whether package A is needed at all beyond the notice.
2. **Add the notice, not the re-execution.** The loop's state lives in shell variables that are not exported (`.skilled/bin/skilled-loop:1196-1197`), and start-up unsets `SKILLED_LOOP_NAME` and re-parses the arguments. Re-execution would have to serialise that state, and a file caught mid-merge would end every running loop at its next hop. A notice makes staleness visible at the moment it matters and puts no loop at risk. This is a judgment. What would change it: loops that routinely run for days, or a wrapper fix that is safety-critical.
3. **Take ranks 3 and 5 next.** Both close a silent failure with a few lines and a test, and neither needs a decision.
4. **Batch package F.** Five document fixes, none of which touches code.
5. **Hold ranks 8 and 9 until run B.** They fix a cause that no evidence yet shows on this machine.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| The version floor as the cause of the lost rename | Local transcripts are above 2.1.221 | Transcript `version` values 2.1.295 to 2.1.325 | 1, 9 |
| `~/.claude/history.jsonl` or `~/.claude/transcripts` as a title source | Neither holds a title field | Entry types and keys | 1 |
| The 16 MiB tail cap as a mobile-specific cause | It applies to any old rename | `context-usage.cjs:21` | 1 |
| Reading the store name whatever its `nameSource` | It would put a derived title above the launch name | `session-relaunch.cjs:592` | 1 |
| A store-only rename as the cause of the 22:33 hop | The rename was in the transcript and the reader returns it | Section 3, orchestrator | none |
| Widening prompt withdrawal to any pending record | It would withdraw a hand-over the same turn prepared | `withdraw.cjs:21` | 2 |
| A Claude `PermissionRequest` binding as today's smallest fix | The Claude `eventOrder` has no such event | `hook-registry.json:9` | 2 |
| The ask-surface guard as the multi-runtime hop guard | It re-prompts prose menus and cannot refuse a pending hop | `ask-surface-guard/pi/ask-surface-guard.ts:4` | 2 |
| A relaunch record key or a new module for a goal's ending | Decision D3 of packet 039 forbids both | `039-hop-dialog-goal-title/goal.md:49` | 3 |
| Reading the cleared packet from the clear entry | The entry carries no condition | `relaunch-core.cjs:563` | 3 |
| A Codex goal reader as a gap fix | The store has no packet column | `~/.codex/goals_1.sqlite` schema | 4, 7 |
| The descendant walk for unnamed workers | ADR-002 of 038/015 declines it. A worker started with `&` leaves the runtime's process tree | `038/015/decision-record.md:60` | 5, 6 |
| A product fix for the `OPENCODE_DB` coupling | It is one test's inherited environment | `session-history-lookup.test.cjs:135` | 5 |
| Suppressing the repeating Stop notice | A long deferral would become silent | `stop-arm.mjs:132-154` | 6 |
| New tests for the 013 and 015 playbook gap | The suite commands already run those cases | `session-relaunch-pi-opencode.md:76`, `:84` | 6 |
| The spawn race as the cause of the killer failure | The test waits for the target's ready line | `killer.test.cjs:781` | 7 |
| A shared file, port or pid as the cause of the killer failure | Every test has its own sandbox and opens no port | `killer.test.cjs:40`, `:52` | 7 |
| One grouped binding row for 037 to 039 | The parser accepts exactly one path per row | `check-goal.cjs:165` | 8 |
| A binding row for 037 | It would point at a missing `goal.md` | Phase 037 folder | 8 |
| Treating the fresh `Commit-Id` values as a hook defect | The hook mints only when the message lacks an id | `prepare-commit-msg:286` | 8 |
| The app continuing the same session after a hop | Each process registers its own remote session | Remote Control vendor page | 9 |
| One live run as proof of the late-write removal | The race may not occur | `038/017/implementation-summary.md:117` | 9 |
| Re-executing the wrapper between hops | Unexported loop state, and a mid-merge file would end every loop | `.skilled/bin/skilled-loop:1196-1197`, `:872-901` | Orchestrator, second reviewer |

## Divergence Map

- Saturated directions: none recorded. The run used the default convergence mode, with no divergent pivot.
- Pivots taken: none. Pivot failures and audited overrides: none.
- Remaining frontier: the open questions in section 12, each of which needs a live run.

## 12. Open Questions

1. Does a hop from a freshly started wrapper pass `--name`? Run 0 settles it.
2. What does a rename in the mobile app write: a transcript `custom-title`, the session store or both? Run B, first sender.
3. Does the app title of a bridged session follow the interactive `--name`? Run B.
4. Which wins when `--name` and a replayed `--remote-control <old name>` are both present? Run B, second sender.
5. Does a sender that runs `prepare` itself and then opens a question complete its hop? Run A.
6. Does the live `/goal clear` log entry have the shape the test fixture assumes? Run A, with one clear.
7. What did the killer test's one failure log? One run of `killer.test.cjs` under the full suite's load, reading `relaunch.log` for `killer-timeout`.
8. Does the recursive strict validation of phase 033 print `RESULT: PASSED`? One command outside the research boundary.

## 13. References

- `research/iterations/iteration-001.md` to `iteration-010.md`
- `research/resource-map.md` (emitted by this run)
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/` (children 001 to 017)
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/` (children 001 to 003)
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` and `033-research-remediation/spec.md`
- `.skilled/bin/skilled-loop`
- `.skilled/hooks/session-relaunch/` (README, `bin/`, `lib/`, `claude/`, `codex/`, `pi/`, `tests/`)
- `.skilled/hooks/goal/` (`cursor/`, `devin/`, `pi/`, `lib/goal-slice.cjs`)
- `.opencode/plugins/session-relaunch.js`, `.opencode/plugins/opencode-goal.js`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs` and `fanout-run.cjs`
- `.skilled/skills/sk-git/SKILL.md`, `.skilled/scripts/git-hooks/prepare-commit-msg`
- `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`
- https://code.claude.com/docs/en/remote-control
- https://code.claude.com/docs/en/sessions
- https://code.claude.com/docs/en/mobile
- https://docs.claude.com/en/docs/claude-code/hooks

## 14. Answered Questions

All five key questions were answered within what read-only evidence allows.

1. **Mobile rename:** `prepare` reads the transcript only, a second store exists that nothing reads, and what the app writes is unconfirmed. The orchestrator added that no running wrapper could carry a name today.
2. **Packet 039 residual gaps:** the eight limits the run was asked to check are real in the code. Each has a failure description and a smallest change. The three children record sixteen limitation rows in all. The other rows say a fix was not run live or covers Claude only, and sections 3 and 7 cover those.
3. **Packet 038 limits by child:** every recorded limit of children 001 to 017 has a verdict.
4. **Packet and parent open ends:** the killer margin, the Codex store, the 002 binding budget, the 033 status and the sk-git sentence are each settled or named as unconfirmed.
5. **Live proof and ranking:** the inventory, the run set and the ranking are in sections 7 and 9.

## 15. Limitations and Confidence

- **One model family did the reading.** All ten iterations ran on DeepSeek V4.1 Flash at the `max` variant through OpenCode 1.19.4. Its verdicts on what the code says are factual and checkable. Its sizes, its ranking and its choice of smallest change are judgment and carry one lens.
- **What the orchestrator reopened.** After each iteration returned, the orchestrator opened the lines behind its main findings. For iterations 3 to 9 that covered `relaunch-core.cjs`, `context-usage.cjs`, `session-relaunch.cjs`, `skilled-loop`, `stop-arm.mjs`, `killer.cjs`, `killer.test.cjs`, the three goal injectors, the two OpenCode plugins, `fanout-pool.cjs`, `nudge.cjs`, `prepare-commit-msg` and the cited packet lines of 011, 033 and 039. It reran the 002 goal budget command, the Codex row count and the three 039 commit trailers. An earlier orchestrating session checked iterations 1 and 2 the same way. Each opened line said what the iteration claimed.
- **What was not reopened.** The vendor pages, the `claude --help` lines, most playbook lines and most packet 038 document lines rest on the iterations alone. A resolved citation proves that line, not the others.
- **Section 3 is one observation of one hop.** The cause is inferred from process start times, the file history and the missing flag. It was not reproduced. The second reviewer shares the orchestrator's model family.
- **Nothing was run live.** Every statement about what a runtime does at run time is read from code, help output, documentation or the local stores.
- **Graph convergence** reported the stop as blocked by the source-diversity and evidence-depth guards throughout. The stop policy was the iteration cap, so those guards are recorded here as evidence and were not acted on.

## 16. Implementation Decision

None is taken here. Packets 038 and 039 are Complete and their scope is frozen, so every change in section 9 needs a new child or a related packet. Ranks 11 and 12 change parent goal and status documents, which the operator must see as amendments. Nothing in the worktree that holds this run was committed, merged or pushed.

<!-- /ANCHOR:deep-research-relaunch-gaps -->

## 17. Convergence Report

<!-- ANCHOR:convergence-report -->

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 8: parent-level open ends (0.85), run 9: the app's view of a hop and the live-run set (0.85), run 10: cross-check, final verdicts and ranking (0.60)
- Convergence threshold: 0.05, telemetry only under stop policy `max-iterations`
- Divergence summary: no divergent pivots recorded
- Graph convergence reported the stop as blocked by the source-diversity and evidence-depth guards before every iteration from 4 to 10. The iteration cap ends the run regardless, and those guards are recorded here as evidence, not acted on.
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

<!-- /ANCHOR:convergence-report -->
