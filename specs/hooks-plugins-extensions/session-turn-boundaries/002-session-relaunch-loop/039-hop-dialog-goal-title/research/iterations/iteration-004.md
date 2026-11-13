# Iteration 4: Packet 038 children 001 to 008, recorded limits against current code

## Focus

Checked every Known Limitations entry of `038-goal-and-workflow-resume` children 001 to 008 against the code as it is now. For each limit this iteration gives a verdict (CONFIRMED, REFUTED, UNCONFIRMED), the deciding `path:line`, how it fails for the operator, whether a later child of 038 or packet 039 closed it, and the smallest change. It also lists limits present in those eight summaries that the dispatch did not name.

Scope note: iteration 4 covers children 001 to 008 only. The 009 to 017 limit review stays on the plan's later iterations, so the strategy question "Packet 038 limits by child (001 to 017)" is not marked answered here.

## Actions Taken

1. Read all eight Known Limitations sections under children 001 to 008 of packet 038.
2. Read the handoff and seed builders in `.skilled/hooks/session-relaunch/lib/nudge.cjs` (133-329) and the hop parser and stderr goal reason in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` (370-410, 510-568).
3. Read the Claude goal resolver, Codex branch, headline walk and hand-over fallback in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` (600-930).
4. Read the goal slice renderer and its refusal reasons in `.skilled/hooks/session-relaunch/lib/goal-handover.cjs` (95-147).
5. Read the bind paths: `.skilled/hooks/goal/pi/goal-context.ts` (95-118), `.skilled/hooks/goal/cursor/goal-inject.mjs:51`, `.skilled/hooks/goal/devin/goal-inject.mjs:40`, and `.opencode/plugins/opencode-goal.js` (92-102, 156, 782-788, 2990-2993, 3590-3610).
6. Read the autonomy gate, the event-error logger and the SessionStart claim hook: `.opencode/plugins/opencode-goal.js:914-922`, `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:38,136,175`.
7. Read the shim contract `.skilled/bin/skilled-loop-shell.sh:6-13` and README usage at `.skilled/hooks/session-relaunch/README.md:97-101`.
8. Read the later children's Known Limitations (009 to 017) to test whether a later phase closed any 001 to 008 limit.
9. Attempted to time `goalHeadlinePackets`: it is not exported from `relaunch-core.cjs` (exports are `goalPacketProblem, goalSwitchOn, goalRoots, usableGoalPacket, resolveGoalPacket, resolveGoalPacketResult, resolveGoalPacketReason, recordGoalPacket`), so the recorded 1.5 s was not re-measured.

## Findings

### 001-workflow-reentry-seed

**F-004-001 (001 L1) The receiver is asked, not forced. CONFIRMED.**
The handoff text asks for an `Active command:` line and the seed step asks the receiver to run it again; both are prose strings with no receiver-side check. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:195] [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:305]
Operator failure: a receiver that ignores the step (or a runtime whose model drops an instruction) keeps working ad hoc; the loop chain dies with no relaunch record and no error, because `prepare` already exited 0. Not closed by a later child: 009 and 014 add note lines and Stop notices, not an execution check. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines/implementation-summary.md:117]
Smallest change: repeat the note's Active command line in the Claude start context that `claimAfterGoalStart` already emits, so the instruction reaches the receiver even if it skips the note body. That is one extra line in `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:136` reading the claimed note through the existing claim path. Enforcement (a hook that checks the command ran) is a new receiver hook, not a small change.

**F-004-002 (001 L2) A `/loop` or scheduled wakeup ends with the sender. CONFIRMED.**
The only carriers are prose: the note's `Scheduled:` line is written by `handoffText` and the restore sentence is `HOP_RESTORE_INSTRUCTION`; no code reads `Scheduled:` back. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:61] [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:204]
Operator failure: a `/loop` started by the sender is not restarted by the wrapper or any hook; the receiver must re-enter the command from the note, so the scheduled work silently stops after the hop. The README states the same behavior. [SOURCE: .skilled/hooks/session-relaunch/README.md:121] [SOURCE: .skilled/hooks/session-relaunch/README.md:122]
Not closed later: 014 records only the cron count in the Stop notice. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons/implementation-summary.md:118]
Smallest change: the same start-context line as F-004-001, extended with the note's `Scheduled:` entries; true replay needs each runtime's scheduler API and is larger.

**F-004-003 (001 L3, not named in the dispatch) Codex still carries no goal by itself. CONFIRMED.**
The Codex branch returns an empty packet with a fixed reason, and the nudge keeps only the prose `Active goal:` line. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:899] [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:173]
Operator failure: a Codex hop loses the packet; the receiver either sets no goal or relies on the model to call `create_goal` from the note line, so the goal chain is only as reliable as the prose. Not closed by 038/009-017 or 039/001-003.
Smallest change: a Codex goal reader in the existing Codex branch of `resolveGoalPacketResult` that reads `goals_1.sqlite` under the Codex home and matches the objective text with `goalHeadlinePackets`, then returns a packet. The README records the store but says no populated record has been read, so the schema and status values are UNCONFIRMED. [SOURCE: .skilled/hooks/session-relaunch/README.md:181]

### 002-pi-bind-once

**F-004-004 (002 L1) Cursor and Devin keep the per-session behaviour. CONFIRMED.**
Pi binds once per process with a module-level `Set` plus a `finally` that deletes `SESSION_RELAUNCH_GOAL_PACKET`. [SOURCE: .skilled/hooks/goal/pi/goal-context.ts:102] [SOURCE: .skilled/hooks/goal/pi/goal-context.ts:112] Cursor and Devin call `bindRelaunchGoal` directly on each injection and never delete the variable. [SOURCE: .skilled/hooks/goal/cursor/goal-inject.mjs:51] [SOURCE: .skilled/hooks/goal/devin/goal-inject.mjs:40]
Operator failure: on Cursor or Devin a second session started from the same process environment can bind the inherited packet, so a child or sibling session continues the sender's goal. OpenCode already guards this with `handOverGoalAttempted`. [SOURCE: .opencode/plugins/opencode-goal.js:3595]
Smallest change: add the OpenCode pattern to both injectors: after the bind attempt, `delete process.env.SESSION_RELAUNCH_GOAL_PACKET` in a `finally` (three lines each at the two call sites above).

**F-004-005 (002 L2) Not run on a live Pi. CONFIRMED as a verification gap.**
No later child closes it: 015 records that no full Pi hop was observed and no live Pi hop carried a mode. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/implementation-summary.md:123]
Operator failure: none until a live Pi hop runs; the unit cases drive the extension with events, so a host-level difference (process lifetime, event order) is unproven.
Smallest change: one live Pi hop, not a code change. Add it to the live-run set in a later iteration.

### 003-goal-resolver-prepare

**F-004-006 (003 L1) The search costs about a second and a half. CONFIRMED structurally; 1.5 s UNCONFIRMED numerically.**
`goalHeadlinePackets` walks every `specs/` directory for every root, reads every `goal.md` and exits only after a second match; there is no cache and no index. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:819] [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:840]
Operator failure: a hop whose Claude goal sits outside its lineage pays the walk synchronously inside `prepare`; on a large `specs/` tree the hop stalls before it arms. The exact cost could not be re-measured because the function is not exported.
Not closed later: no child adds an index. Smallest change: keep a per-repository index of `goal.md` headlines keyed by file mtime, read before the walk; absent that, no smaller correct change exists because the walk is what proves a packet outside the lineage.

**F-004-007 (003 L2) A shared headline still drops the goal. CONFIRMED.**
More than one headline match returns an empty packet and a reason naming the count. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:685] [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:687]
Operator failure: two packets with the same goal title give the receiver no goal; the reason reaches only stderr (F-004-009), so the receiver sees nothing.
Smallest change: rank the matches by longest common prefix with the note's `spec_folder` and accept a unique best; change inside `claudeGoalPacketResult` between the `matches.length === 1` check and the reason return. It keeps a tie failing closed.

**F-004-008 (003 L3, not named in the dispatch) Codex only gets the reason line. CONFIRMED.**
Same code as F-004-003: the Codex branch always returns `packet: ''` with a reason. [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:902]
Operator failure: the reason is printed to the sender's terminal by `prepare`, not delivered to the Codex receiver, so a Codex hop never learns which packet it should have carried.
Smallest change: same Codex reader as F-004-003.

**F-004-009 (003 L4, not named in the dispatch) A refused Claude slice is reported only by the wrapper. CONFIRMED.**
`prepare` resolves the goal and writes the reason once to stderr. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:402] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:410] The refusal reasons themselves (over budget, markup, control character) live in the renderer. [SOURCE: .skilled/hooks/session-relaunch/lib/goal-handover.cjs:126] [SOURCE: .skilled/hooks/session-relaunch/lib/goal-handover.cjs:132]
Operator failure: the operator sees `goal not carried: ...` in the sender's terminal; the receiver starts with the claim seed and no explanation, so a child goal or an over-budget slice looks identical to a session that never had a goal.
Smallest change: export the already-computed reason as `SKILLED_LOOP_GOAL_REASON` from the wrapper and append it to the start context in `compact-pointer.mjs:136`. Two files, no record-format change.

### 004-claude-start-claim

**F-004-010 (004 L1) Not run in a live Claude session. REFUTED as of now; partly closed by later live runs.**
The README records live runs of 2026-11-13 in which a Claude receiver claimed its note in ten of ten counted hops under an allowing goal and two of five under a forbidding goal, and states the claim reaches the receiver as start context only, which is this hook's route. [SOURCE: .skilled/hooks/session-relaunch/README.md:189]
Residual: the forbidding-goal suppression remains a separate open limit recorded by 016, not this one. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal/implementation-summary.md:114]
Smallest change: none for the basic path; the residual is 016's decision record.

**F-004-011 (004 L2) The claim needs the wrapper. CONFIRMED.**
The start claim reads `SKILLED_LOOP_CLAIM_SEED` and acts only on the `startup` source; without the wrapper there is no seed. [SOURCE: .skilled/hooks/session-relaunch/claude/compact-pointer.mjs:38] [SOURCE: .skilled/hooks/session-relaunch/claude/compact-pointer.mjs:175]
Operator failure: a session started by hand from a note gets no claim context; the operator must paste the claim command. That is the documented manual route, so this is by design rather than a defect.
Smallest change: none. The README records that a claim line in the start prompt was declined because the start-context route already worked. [SOURCE: .skilled/hooks/session-relaunch/README.md:189]

### 005-opencode-continuation-hop

**F-004-012 (005 L1) Autonomy is off by default. CONFIRMED.**
Only `active` and `smoke` pass the gate; an unset variable yields `''`, which is suppressed as `autonomy_disabled`. [SOURCE: .opencode/plugins/opencode-goal.js:156] [SOURCE: .opencode/plugins/opencode-goal.js:782] [SOURCE: .opencode/plugins/opencode-goal.js:2991]
Operator failure: an OpenCode receiver does not continue its goal unless the operator exported `OPENCODE_GOAL_AUTONOMY=active`; the defect 005 fixed cannot show up by default, so a hop can still stop at the receiver.
Smallest change: none if default-off is the safety decision. If a loop receiver should continue, set the variable for loop-started sessions in the wrapper rather than changing the plugin default, because the packet variable is deleted at bind. [SOURCE: .opencode/plugins/opencode-goal.js:3601]

**F-004-013 (005 L2) Read from the code, not seen live. CONFIRMED.**
No live OpenCode continuation hop is recorded. The later live OpenCode evidence is a bridged title rename, not the autonomy continuation. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/implementation-summary.md:114]
Operator failure: none until the path runs live; an event-order or provider difference in the real plugin is unproven.
Smallest change: one live OpenCode hop with `OPENCODE_GOAL_AUTONOMY=active`, no code change.

### 006-skilled-loop-command

**F-004-014 (006 L1, not named in the dispatch) Only in a shell that sources the shim. CONFIRMED.**
The shim is sourced explicitly and defines the runtime names as functions; calling a bare runtime name skips the wrapper. [SOURCE: .skilled/bin/skilled-loop-shell.sh:9] [SOURCE: .skilled/bin/skilled-loop-shell.sh:11] [SOURCE: .skilled/hooks/session-relaunch/README.md:101]
Operator failure: a terminal without the shim starts the runtime directly; no loop is armed and no nudge fires, with no error.
Smallest change: none in code; add the `source` line to the operator's shell profile. A PATH-installed shim that always wraps is a larger change and would surprise non-loop use.

### 007-goal-handover-docs

**F-004-015 (007 L1) Nothing here was run live. PARTIALLY CLOSED.**
The README that 007 wrote now records live goal hand-over results and a Claude claim result. [SOURCE: .skilled/hooks/session-relaunch/README.md:202] [SOURCE: .skilled/hooks/session-relaunch/README.md:189] The live runs came from 013, 014 and 016, after 007's build.
Operator failure: the historical statement is no longer accurate for the documented behavior, but nothing in the docs is known to be wrong.
Smallest change: none; 017 owns the doc refresh.

**F-004-016 (007 L2) Other documents may still describe the old behaviour. CONFIRMED with a named residue.**
017 closes the README and flags example but leaves the Pi and OpenCode playbook without checks for 013 and 015. [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/implementation-summary.md:119]
Operator failure: a playbook run cannot prove the OpenCode child/title fix or the Pi mode carry, so a regression there passes the playbook.
Smallest change: add the two check rows 017 names to the Pi and OpenCode playbook. The exact path is named in 017's spec and was not opened this iteration.

### 008-review-advisories

**F-004-017 (008 L1) No live run. CONFIRMED for the four fixes themselves.**
Later live runs cover goal claims and cron re-entry, not the four 008 changes (SessionStart name, non-open note guard, control-character stripping, command quoting, finally cleanup). [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons/implementation-summary.md:116] [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal/implementation-summary.md:111]
Operator failure: a defect in one of those four would show only in a live Claude hole or a live OpenCode bind failure.
Smallest change: fold the two cheapest checks into the live-run set: one Claude hop whose start claim carries `SessionStart` (the 008 REQ-001 case) and one OpenCode session where the bind throws.

**F-004-018 (008 L2) The throwing bind does not reject the event. CONFIRMED as intentional.**
The bind now runs in `try` with the packet delete in `finally`, so cleanup is guaranteed. [SOURCE: .opencode/plugins/opencode-goal.js:3597] [SOURCE: .opencode/plugins/opencode-goal.js:3599] Event errors are still logged as `event_error` and swallowed by the event wrapper. [SOURCE: .opencode/plugins/opencode-goal.js:914]
Operator failure: a failing bind is visible only in the events log, not as a failed session event; the receiver continues with no goal.
Smallest change: none, because rejecting the event would turn a best-effort goal bind into a failed session event. If rejection is wanted, rethrow after `logDebugEventError` in the same catch, one line.

**F-004-019 (008 L3) Two switch parsers remain. CONFIRMED, and the "agree" wording is imprecise.**
The nudge has `switchNumber`; the CLI has `numericSwitch`. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:486] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:135] On an unusable `SKILLED_LOOP_HOPS` the nudge reports the limit reached, while `prepare` throws. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:513] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:558] The operator outcome agrees (no hand-off is requested that `prepare` would refuse), but the two functions do not return the same thing.
Operator failure: none today; a future edit to one parser can silently desynchronize the nudge from `prepare`, which is exactly what 008 fixed once.
Smallest change: move `switchNumber` into `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` and have `numericSwitch` delegate to it; both call sites keep their current failure mode.

## Questions Answered

None fully: the strategy question covers children 001 to 017, and this iteration covered 001 to 008. The partial evidence is recorded above and will be combined with iterations 5 and 6.

## Questions Remaining

- Packet 038 limits by child (001 to 017): 009 to 017 remain (planned iterations 5 and 6).
- Packet and parent open ends (killer test, Codex goal reader, 002 parent goal budget, phase 033, sk-git `Commit-Id`).
- Live proof and ranking.

## Edge Cases

- Ambiguous input: the dispatch named only some limits of 001, 003 and 008, so the unnamed limits found in those files (001 L3, 003 L4, 006 L1) were included and labelled.
- Contradictory evidence: 008 L3 says the two parsers "now agree"; the code shows they agree on the operator outcome but not on the return/throw mechanism. Both readings are recorded.
- Missing dependency: `goalHeadlinePackets` is not exported, so the recorded 1.5 s could not be re-measured; the structural cost is cited instead.
- Partial success: 004 L1 is refuted for the basic claim path by later live runs, but the live runs do not cover the four 008 fixes; both are reported separately rather than collapsing into "live-proven".

## Sources Consulted

- `.skilled/hooks/session-relaunch/lib/nudge.cjs:61,173,195,204,305,486,513`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:819,840,685,687,899,902`
- `.skilled/hooks/session-relaunch/lib/goal-handover.cjs:126,132`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:135,402,410,558`
- `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:38,136,175`
- `.skilled/hooks/session-relaunch/README.md:101,121,122,181,189,202`
- `.skilled/hooks/goal/pi/goal-context.ts:102,112`
- `.skilled/hooks/goal/cursor/goal-inject.mjs:51`
- `.skilled/hooks/goal/devin/goal-inject.mjs:40`
- `.opencode/plugins/opencode-goal.js:156,782,914,2991,3595,3597,3599,3601`
- `.skilled/bin/skilled-loop-shell.sh:9,11`
- Later-child summaries: 013:114, 014:116, 016:111,017:119, 015:123, 009:117, 017:119 (paths in the findings above).

## Assessment

- New information ratio: 0.73. Fifteen verdicts are new to the packet (the 001 to 008 limits were not examined by iterations 1 to 3), five are partial refinements of recorded limits, and four are re-confirmations that add no new fact beyond the recorded text.
- Questions addressed: the per-limit verdict for packet 038 children 001 to 008.
- Questions answered: none in full (the strategy question spans 001 to 017).

## Reflection

- What worked and why: reading the four code paths that actually carry the limits (nudge builders, resolver, bind call sites, wrapper reason) turned eight prose summaries into verdicts with deciding lines. Reading the later children's summaries in the same pass separated "still true" from "already closed", which a single-snapshot read would have missed for 004 L1.
- What did not work and why: the attempt to time the headline walk failed because the function is not exported; the cost claim stays structural, not measured.
- What I would do differently: export or script around the walk next time rather than concluding the measurement is unavailable; one extra read of the module's export block would have shown that before the attempt.

## Recommended Next Focus

Iteration 5: packet 038 children 009 to 013, the same per-limit verdict format. The closure evidence gathered here (009:117, 013:114) can seed it. Iteration 6 covers 014 to 017. The Codex goal reader emerges as the single largest surviving code gap across 001 L3, 003 L3 and 008's advisories, and it needs the `goals_1.sqlite` schema read before a size estimate is possible.
