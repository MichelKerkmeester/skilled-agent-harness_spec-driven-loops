# Iteration 3: Model And Effort Carry, And The Two-Hook Nudge

## Focus

Two linked questions: whether the receiver starts on the sender's model and effort, and whether the nudge can arrive twice (or not at all) because two hooks can act on one session. The run's scorecard recorded `carry.* = unobservable` for Pi, so the first job was to decide whether that means "not carried" or "not measured".

## Actions Taken

- Read the wrapper's relaunch argument builder for Pi and OpenCode, including the version gate.
- Read the Pi extension's live-settings capture and its held-nudge hold/deliver paths.
- Read the OpenCode plugin's two nudge hooks and the guard between them.
- Read the receiver's own Pi session header and the harness's carry scorer.

## Findings

1. Model and effort did carry on the live Pi hop. The receiver's session header records a `model_change` to provider `llmgateway`, model `deepseek-v4.1-flash-1017`, and a `thinking_level_change` to `max`, matching the sender's launch flags. The receiver's session name `hoptest-base1-pi (2)` confirms the record was read on the same path. So the Pi 4/5 result is not a carry failure. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:459]

2. The scorecard's "unobservable" is a measurement gap, not a drop. Its carry check reads model, effort, name and provider out of the receiver process's argv, and it marks every field unobservable when the first launch's argv is a bare runtime name. Pi's process argv is exactly `pi`, so no flag is ever visible; the harness never reads the receiver's session header, which is where Pi records both values. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:60]

3. After a hop, nothing durable records what the relaunch actually used. `relaunch.log` gets `relaunch loopId=... reason=ready` with no model, provider, effort or name, and the relaunch record itself is consumed and removed. An operator therefore cannot audit carry from artifacts, and a silent drop is indistinguishable from a carried value in every file the hop leaves behind. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/relaunch.log:3]

4. OpenCode 2 carries neither model nor effort, by design. The wrapper appends `-m` only when the runtime is not OpenCode 2, and the effort appender has branches for Claude, Codex and Pi only. A receiver therefore starts on the configured default, so the 5/5 OpenCode run matched the sender's model only because the default happened to be the same model. A parity score that compares outcomes across runtimes is not testing carry at all. [SOURCE: .skilled/bin/skilled-loop:778]

5. Pi spends the nudge level before the nudge is delivered. `message_end` both stores the held text in an in-memory `Map` and writes the new level through `writeState`; delivery happens later on `turn_end` or `agent_end`. A host reload, a crash, or a run that ends between hold and delivery loses the held text while the level stays spent, so that session is never nudged again at that level and falls back to auto-compaction with no hand-over. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:594]

6. The two Pi hooks cannot double-deliver, because the held text is deleted from the map before `sendMessage`. `turn_end` steers the text into the running loop and `agent_end` sends it as a follow-up; whichever fires first consumes the entry and the second finds nothing. The charter's "double nudge from two hooks" is therefore a duplicate-delivery guard that works, while the uncovered risk on Pi is loss, not repetition. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:620]

7. OpenCode computes and delivers the nudge in two different hooks, and the pair is guarded only by record state. The `event` hook queues a nudge when an assistant message completes; `experimental.chat.system.transform` re-queues from `pendingUsage` and pushes the text, while `pendingNudge` and `handoffPending` suppress a second. But a session that claimed a note gets `claimedReminder` on every request until the note leaves `claimed`, and once its own fill crosses the threshold it also gets a fresh nudge to prepare a new note, so one system prompt can carry two instructions: close the claimed note, and prepare a hand-over. [SOURCE: .opencode/plugins/session-handover.js:590]

## Ruled Out

- "Pi dropped the model or effort on relaunch": ruled out by the receiver's own session header.
- "The two Pi nudge hooks can both deliver the same text": ruled out by the map delete before send.
- "OpenCode 2's missing model flag is a bug in the replay builder": ruled out; the version gate is deliberate, because a replayed `-m` would end the launch with a usage error.

## Dead Ends

- Auditing carry from `relaunch.log` or the relaunch record: neither holds the relaunch argv after the hop. Only the receiver's own session store does.

## Edge Cases

- Ambiguous input: "double nudge from two hooks" could mean duplicate delivery or two competing instructions. Covered both; the duplicate is guarded, the competing pair on OpenCode is not.
- Contradictory evidence: the scorecard says carry is unobservable while the receiver header shows it carried. The contradiction is resolved in favour of the session header, which is the runtime's own record; the scorecard measures argv only.
- Missing dependencies: none.
- Partial success: finding 7 is code-path evidence, not an observed live double instruction. It is stated as reachable, not as observed.

## Questions Answered

- Does model and effort carry on relaunch for each runtime, and where can it silently degrade or be dropped?

## Questions Remaining

1 of 5 remains open: the four known limits as a set (AI_SESSION_CHILD in test sandboxes is still unread).

## Sources Consulted

- .skilled/hooks/session-handover/pi/session-handover.ts:459
- .skilled/hooks/session-handover/pi/session-handover.ts:594
- .skilled/hooks/session-handover/pi/session-handover.ts:620
- .skilled/bin/skilled-loop:778
- .skilled/bin/skilled-loop:300
- .opencode/plugins/session-handover.js:590
- .opencode/plugins/session-handover.js:180
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:60
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/relaunch.log:3
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/scorecard.json
- ~/.pi/agent/sessions/--Users-michelkerkmeester-worktrees-public-422-opencode-pi-handover-parity--/2026-11-16T05-32-58-558Z_01a1e2d8-253d-75b7-978c-e205cabefd81.jsonl (header model_change and thinking_level_change entries)

## Assessment

- New information ratio: 1.0
- Questions addressed: model and effort carry; the two-hook nudge
- Questions answered: model and effort carry

## Reflection

- What worked and why: going to the receiver's own session header settled carry in one read, where the scorecard, the relaunch log and the run metadata all said nothing. The runtime's own record beats the harness's observation of the process.
- What did not work and why: reading the wrapper's argv builder could prove what would be passed but not what was passed, because the record is consumed. Only the receiver closes that gap.
- What I would do differently: for any "did X carry" question in this packet, read the receiver store first and treat argv evidence as secondary.

## Recommended Next Focus

Iteration 4: the remaining known limits and the fix set. Read `AI_SESSION_CHILD` handling in the test harness and the wrapper's environment, confirm the 160-character and directory-column findings against the fix candidates already recorded, then assemble one concrete fix per failure mode with the file and function each fix touches.
