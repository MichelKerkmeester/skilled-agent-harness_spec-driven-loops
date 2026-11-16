---
title: "Session Handover Handoff Protocol"
description: "Operator contract for the session-handover handoff protocol: the context nudge, the handoff note, prepare, the arm, the killer, the claim and the history lookup."
trigger_phrases:
  - "handoff protocol"
  - "session-handover prepare"
  - "handoff note"
  - "context nudge"
  - "killer timeout"
  - "history lookup"
importance_tier: "normal"
contextType: "reference"
---

# Session Handover Handoff Protocol

## 1. OVERVIEW

`prepare` writes a handoff note and arms a relaunch record. The killer ends the sending session once it goes idle. A fresh session claims the note and continues the work. This document covers that protocol, its refusals and its exit codes.

---

## 2. HANDOFF PROTOCOL

The protocol runs in one order. The nudge names the note and the prepare command. The session writes a handoff note, and `prepare` validates it and writes a pending relaunch record. The runtime's arm event arms the record and starts the killer. The killer ends the session. The next session claims the note and completes it.

### The Context Nudge

Claude's `context-nudge` handles `PostToolUse` and `UserPromptSubmit`. It reads the latest main-chain assistant usage from the Claude transcript. It compares the fill ratio with the configured threshold. The default threshold is 0.80. One more nudge fires 0.05 above that level. Each level fires once. A withdrawn or cancelled hand-over earns one extra nudge.

The adapter accepts session ids matching `[A-Za-z0-9_-]{1,128}`. Transcript read errors produce no usage. The reader starts with the last 256 KiB of the transcript. When that tail holds no assistant row, it widens the read up to 16 MiB before it reports no usage. The Codex reader widens the same way. Failed Claude settings reads are treated as absent.

The nudge reports the fill as `[session-handover] Context is about N% full.`. Above a ratio of 1 it reports `[session-handover] Context is past the configured window (over 100% full).`. It then lets the session finish instead: `If the remaining work fits in a few more steps, finish it instead and skip these steps.`

A session with more work left does the handoff steps now, before any other work. A fresh session then continues before auto-compaction has to. The nudge gives the operator the last word. If the operator has told the session not to hand off, it skips the note, continuity save and prepare steps. It keeps working and leaves auto-compaction as the fallback.

### The Handoff Note

The nudge names a handoff note under `.skilled/skills/.state/session-handover/handoffs/` and a prepare command. The path resolves under the repository that holds the concern. A runtime started in a subdirectory still writes under the repo root.

The note needs flat frontmatter and four non-empty sections: Goal, Done, Remaining work and In-flight state. The Remaining work section lists only unfinished task work.

In-flight state carries an `Active command:` line with the command, mode and arguments. With no command it reads `none`. It also carries a `Running workers:` line, each worker as `pid <pid> log <path> collect <step>`. With no worker it reads `Running workers: none`.

It carries a `Scheduled:` line for each cron or wakeup with its schedule and prompt. With none it reads `Scheduled: none`. It carries an `Added directories:` line for each directory added after launch. With none it reads `Added directories: none`.

The receiver runs `kill -0 <pid>` for each pid the `Running workers:` line lists. When one is alive it collects that worker with the line's collect step instead of starting the same work again.

After a hop it recreates each `Scheduled:` entry the note lists. When the runtime has no scheduler it tells the operator which to recreate. It re-adds each `Added directories:` entry, or asks the operator to re-add it, with `/add-dir <path>` on Claude Code.

A Codex note also carries an `Active goal:` line with the goal or packet path. With neither it reads `none`. Note creation, continuity saving and `prepare` are handoff steps.

The nudge tells a session that holds a deep-loop lock to stop a live `fanout-run.cjs` runner first with `kill -TERM <runner-pid>`. It waits until `kill -0 <runner-pid>` fails. It then releases the lock with the captured path, owner pid and nonce before `prepare`.

`fanout-pool.cjs` probes the latest `spawned` pid in the ledger for each open lineage with signal 0. `fanout-run.cjs` refuses a re-run with exit 3 while any lineage from an earlier run is still alive.

When `spec_folder` is a packet path, Claude uses `/speckit:save`. Other runtimes send the save JSON to the [continuity writer](../../../.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js) with `--stdin --full-auto <spec-folder>` before prepare.

`spec_folder` holds the repo-relative packet path. It holds `none` when Gate 3 was answered D) Skip, and empty when Gate 3 was never answered. The nudge fills it from `SYSTEM_SPEC_FOLDER` when that names a valid packet. It prints it empty otherwise, so the model never copies a placeholder that prepare rejects. A seed whose note path is not absolute adds nothing to the receiving session's context on any runtime.

### Prepare And Its Refusals

The `/speckit:handoff` command writes the note and runs `prepare`. The direct CLI form is:

```bash
node .skilled/hooks/session-handover/bin/session-handover.cjs prepare --handoff <note-path> --session <session-id> --runtime <runtime>
```

A missing `--handoff` exits 2 first. While the session-handover concern is off, prepare exits 2 inside and outside `skilled-loop`. It does so without reading or changing the note. Its one line names the cause. The cause is a master or kill switch to unset, or the runtime's own `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` holding a falsy value. With no enable flag it names both `SYSTEM_SESSION_HANDOVER_ENABLED=1` and the runtime's flag. It arms no record and prints no claim command.

`keep`, `claim`, `cancel`, `complete` and `history` do not check the switch. With the concern on, prepare validates the note, and an invalid note exits 2.

Outside `skilled-loop`, it prints a manual claim command and exits 3. It does not check for running shell children there.

Inside the loop, a live child of the runtime process exits 2. That holds when its command name is `sh`, `bash`, `zsh`, `fish`, `dash`, `ksh`, `mksh`, `tcsh`, `csh`, `nu` or `pwsh`. A leading `-` is stripped before that lookup, so a login shell still matches.

Any other child program is not detected. That includes a single simple command a tool shell replaces itself with. OpenCode runs `zsh -c 'sleep 45'` as a `sleep` child, so prepare goes ahead. `sleep 45; echo done` keeps the shell and is refused.

Prepare does not walk every descendant of the runtime, because a background worker has left the runtime's process tree by the time `prepare` runs. The note's `Running workers:` line covers work the session started itself. On Claude, Codex, Pi and OpenCode, the arm withdrawal and the killer's idle wait keep such a turn from being cut off.

The runtime pid comes from `CLAUDE_PID` while that process descends from the loop. Otherwise the check resolves the runtime as the direct child of the loop on prepare's ancestor chain. Runtimes without the variable resolve the same way. When no runtime resolves, it logs `running-work-check-skipped` and skips. A shell that is prepare's own ancestor does not count.

`--runtime` must name one of Claude, Pi, OpenCode, Codex, Cursor, Devin or Vibe. Outside `skilled-loop` it overrides the environment or Claude default. Inside the loop, a supplied value must match `SKILLED_LOOP_RUNTIME` or prepare exits 2. The nudge includes the selected runtime in its prepare command.

A successful prepare writes a pending record and exits 0. At the hop cap it writes no record. It prints the hop-limit line with the manual claim command and exits 3.

### The Arm

Every arm path asks the core whether the record is armable. Its loop id, session id and runtime must match the arming session. A record with no runtime counts as Claude's.

A pending record arms. An armed record re-arms only when no killer is live for the loop. The re-arm restamps `armedAt`, `armId` and the cwd, so a record whose killer died is fresh again at the next arm event.

Stop matches the event session id to the stored record. A pending record stays pending when `transcript_path` is missing. The hook logs `missing-transcript-path` and stamps `deferredAt` on the record. It prints one JSON line whose `systemMessage` says the hop could not arm because the Stop carried no transcript path and that the next prompt withdraws the hop, and then returns.

While background tasks remain it leaves the record as it is, pending or armed. A respawned killer then never ends live work. A pending record it defers this way gains a `deferredAt` stamp.

Each deferred Stop prints one JSON line whose `systemMessage` names the background task count. That line says the hop goes ahead at the first Stop after the tasks finish. It tells the operator to send a prompt or run `node .skilled/hooks/session-handover/bin/session-handover.cjs cancel` to call the hop off. It carries no `decision` key, so Claude shows the notice and still ends the turn.

When a record is armable and `payload.session_crons` is a non-empty array, Stop appends one `session-crons` line to `relaunch.log`. That line carries `loopId`, `sessionId` and `crons` set to the count. An empty, missing or non-array value writes nothing. A scheduled task and the todo list end with the session, so the receiver starts with neither.

After those checks, Stop resolves the killer target before it arms. It uses `CLAUDE_PID` while that process descends from the loop. Otherwise it uses the loop's direct child on the hook's ancestor chain, never the `bash -c` shell the hook runs under.

When neither resolves, it logs `stop-arm-error stage=target-pid`. The record stays pending with a `deferredAt` stamp. One notice says the hop could not arm because the Stop found no target pid. It says the next prompt withdraws the hand-over and says a later Stop tries again.

An arm that throws is logged as `stop-arm-error stage=arm` and leaves the same stamp. The notice has the same shape and names an arm that throws. The stamp is what lets the next operator prompt withdraw a record no Stop could arm. Without it the session would go on refusing question dialogs until `cancel`. Otherwise Stop arms the record and starts the detached killer.

### The Withdrawal

When the operator types a prompt in that session, the `UserPromptSubmit` nudge withdraws the session's record. It does so when the record is deferred or already armed. The killer signals an armed session after a few quiet seconds. A new turn that runs one long tool would otherwise be ended mid-turn and relaunched onto the old note.

Claude, Codex, Pi, OpenCode and `cancel` all withdraw through one helper, `lib/withdraw.cjs`. It disarms the record under the record lock with reason `user-message`, or `cancelled` for the command. It grants the extra nudge below and writes a `withdrawn` line to the hop history. The Claude and Codex hooks also log `withdrawn` and tell the session to keep working. The note stays open as it was.

The killer stands down on a record disarmed after Stop. It does so at its timeout and in its last read before the signal.

The session also gets exactly one more context nudge, whatever level it had spent. That nudge never lands on the withdraw prompt. It comes once the fill is one step (0.05) above the fill at the first check at or past the threshold after the withdraw. The withdrawn notice says so. The nudge is the cue to update the note and hand over again.

A background task's own completion arrives as a `<task-notification>` prompt and never withdraws the record. That completion is what the deferral waits for. A record that was prepared and never deferred is not withdrawn either, and neither is a Claude seed prompt.

### The Killer

Every arm path restarts a killer for an armed record that has no live killer owner. Those paths are Claude Stop, Codex Stop, OpenCode `session.idle` and Pi `agent_settled`. It does nothing while a killer owns the lock. A record left armed by a failed spawn is therefore recovered by the next arm event.

Claude and Codex write the armed state before starting the killer. A killer spawn failure therefore does not return the record to pending.

The killer polls transcript mtime every 100 ms. When the transcript stays unchanged for `--idle-ms` (3000 ms by default), it re-reads the record, and as its last check before the signal it confirms the target is a descendant of the loop.

It sends SIGTERM only when the record is still armed, below the hop cap and still fresh. Freshness is judged at the end of the SIGTERM grace period by the wrapper's own age rule. At or above the cap it unarms the record with reason `hop-cap` and logs `killer-hop-cap`. It sends neither a signal nor a notification.

A record that would be stale by then is unarmed with reason `stale` and logged as `killer-stale`. The killer never ends a session the wrapper would refuse to relaunch.

The OpenCode plugin runs on Bun, so it starts the killer with `node` instead of `process.execPath`. That path points to the OpenCode CLI. It hands the killer the loop's direct child rather than its own pid. OpenCode 2 loads plugins in a server its TUI starts, and signalling that server would leave the TUI running.

Just before the signal the killer stamps `signalledAt` on the record. That happens in the same locked step as its last check that the record is still the arm it watched. A new arm drops the stamp. The `--loop-id` value must be greater than 1.

If the record is no longer armed, the killer logs `killer-no-armed-record`. If the target exits during the SIGTERM call, it logs `target-gone`.

The idle deadline (`--timeout-ms`, 30000 ms by default) does not shorten the 15000 ms grace period after SIGTERM. That grace leaves room for an OpenCode 2 TUI measured taking about six seconds to exit.

If the idle deadline passes before the transcript is idle, the killer disarms the record with reason `killer-timeout`. The same happens when the target stays alive through the grace period. It then attempts a macOS notification with the manual claim command. Its title reads `Session handover needs attention (killer timed out)`. When `SKILLED_LOOP_MANUAL_TEMPLATE` is unusable a subtitle says the template was ignored and gives the reason.

A single failed transcript read is not a vanish. The killer gives up only when the transcript has stayed unreadable for 1 s without a break (`TRANSCRIPT_MISSING_GRACE_MS`). That give-up follows the timeout path. The record is disarmed with `killer-timeout` and the notification is attempted.

### Per-Runtime Delivery

Pi checks usage at `message_end` and holds the nudge. The message that crosses the threshold usually carries the prepare call itself. At the next `turn_end` whose tool calls ran, those tools have finished. Pi re-checks the pending or fresh armed record and the hop limit. It steers the held text into the running loop with `deliverAs: 'steer'` and `triggerTurn: true`. The model reads it before its next call, as it reads a tool hook's context on Claude Code.

A turn with no tool calls ends the loop, so `agent_end` makes the same checks. It sends the text with `deliverAs: 'followUp'` instead. Either way the nudge reaches the model without an operator turn.

Pi's advisor, goal and spec-gate extensions append their own blocks to the user's prompt after a blank line. The seed handler therefore reads the claim seed from the prompt's first block. Its adapter finds `killer.cjs` by walking up from any repository subdirectory. `tsconfig.pi.json` includes the adapter at its real path so it is type-checked.

OpenCode adds its active nudge to the system prompt on every request. It does so while this session has no pending or fresh armed record. When `SKILLED_LOOP_ID` is set but names no record, it keeps the nudge only while the planned note file does not exist. It keeps a claim seed in the system prompt until the note leaves `open` or a new non-seed user message arrives. It then arms the record on `session.idle`.

Codex reads the latest `token_count` record in the rollout named by the payload's `transcript_path`. It nudges through `additionalContext` on `PostToolUse`. Its `UserPromptSubmit` entry point handles seed prompts and runs the same nudge check, because Codex binds each script to one event. Its `Stop` adapter accepts only `hook_event_name: Stop` and passes `transcript_path` to the killer.

Codex runs its `SessionStart` hooks again with `source: compact` after it compacts a root session. That happens before the next model request. `codex/handover-compact-pointer.mjs` then resets the nudge level and points the session at its open note. For a withdrawn one it sends the stale-note text, as Claude's pointer does.

### A New Turn On An Armed Session

Pi and OpenCode both withdraw an arm when the session they armed starts a new turn. The OpenCode killer runs without `--transcript`, so it only waits its idle time. The Pi killer watches the session file. Pi writes an assistant message only once it completes, so a turn that is still thinking looks idle. A turn the operator starts just after the arm would otherwise be signalled mid-turn.

OpenCode disarms on a new user message and Pi on `agent_start`. Each goes through the shared withdraw helper, and only for an armed record whose `sessionId` is its own. The record ends `disarmed` with reason `user-message`. The session gets the extra nudge and the hop history lists the note as withdrawn. The plugin logs `arm-cancelled`, and the killer logs `killer-no-armed-record` and stands down.

Both then tell the model, with the same withdrawn notice Claude and Codex send. A model that asked for the hand-over otherwise still expects to end and goes idle with nothing armed. Pi steers it into the run from `agent_start`, which Pi awaits before the run's first model call. OpenCode adds it to the system prompt of every request in that turn. That lasts until the next operator prompt or a compaction, whose stale-note text replaces it.

The note stays open and the wrapper prints no claim command for it. `should-relaunch` reports the record as `withdrawn`. OpenCode also drops the nudge it held, so the extra nudge replaces the old one instead of repeating it on the next turn. The OpenCode goal continuation is suppressed while a relaunch record for the session is pending or armed. Its idle turn would send the user message that withdraws the prepared hop.

### Question Dialogs

A question dialog holds the turn or run open until the operator answers. A session that asks after `prepare` never reaches the event that arms its record. Claude Code, Pi and OpenCode therefore refuse a question dialog while the session's record can still be armed. That means a pending record, or an armed one with no live killer.

Claude denies `AskUserQuestion` in `PreToolUse`. Pi blocks its `question` and `ask_user_question` tools in `tool_call`. OpenCode throws from `tool.execute.before` for its `question` tool. All three take the reason from `questionHoldReason` in the shared nudge module, which names the note and the `cancel` command.

Codex needs no guard. Its question tool in a default session is `request_user_input_async`, which does not hold the turn. The turn ends and the hop runs, and the unanswered question ends with the old session.

### Suppression Rules

The shared nudge module gives every adapter the note path and the same suppression rules. Outside `skilled-loop`, with `SKILLED_LOOP_ID` unset or empty, the nudge never asks for `prepare`. Prepare could only print a manual claim command, and a session that stopped there would wait for a hand-off nobody runs. It asks for the note and `keep` instead.

A re-nudge reuses the note this session already has open. It matches on `session_id` and a `status` of `open`, and only takes a new name when no such note exists. A new note is named `<UTC stamp>-<session id>.md` with the full id. OpenCode and Pi ids start with a shared time-based prefix, so two sessions nudged in the same second would otherwise plan the same note.

An open note named with the first eight characters of the session id is also found and reused.

A record that is pending, or armed and still inside `SESSION_HANDOVER_MAX_AGE_MIN`, means the handoff steps already ran. No adapter nudges then. An armed record past the age limit is stale, cannot relaunch and no longer silences the nudge. The age limit resolves the way the wrapper resolves its switches. It comes from the hook config file with the environment taking precedence.

On Claude Code the nudge stays silent for a tool call that carries an `agent_id`. A sub-agent or fork reports its parent's session and transcript, so its fill and its note would be the parent's.

Inside the loop, no adapter nudges once `SKILLED_LOOP_HOPS` reaches `SESSION_HANDOVER_MAX_HOPS`. A record prepared there could not relaunch. Every seed handler reads the note path back out of the seed, so the claim instructions it adds name the real note.

---

## 3. HISTORY LOOKUP AFTER A CLAIM

`claim` mints a history locator for the sending session with provenance source `handover`. It prints a `## History Lookup` section after the note body. It then prints the sentence `Use it for a detail this note does not spell out, before you guess.`

The section names one read-only command, `node .skilled/hooks/session-handover/bin/history-lookup.mjs --session <id> --handle <hl1_...> <operation> <json>`. That command searches, browses, loads and pages the sender's earlier turns. Replies are capped and read-only.

Only Claude Code and Codex senders get a locator. The section is withheld in these cases, among others:

- The sender has no transcript.
- The note names another runtime.
- The sender ran in another checkout.
- The runtime is not built.

The claim then prints the note body, the `complete` line and any `Goal packet:` line, without the section.

A locator is fresh for 30 minutes from the claim. Search matches whole identifier parts, split on `-`, `.`, `/`, `:` and `_` and on case changes. A query matches whole word parts, so 'live' does not match 'delivery'.

---

## 4. OUTSIDE THE LOOP

A session started without `skilled-loop` cannot relaunch. One example is a session opened before the shell shim was sourced. Auto-compaction then shortens its context to a summary. That summary drops detail such as merge decisions, open conflicts and exact next steps.

At the threshold the nudge says the session cannot relaunch. It asks the session to write the same note and run `/speckit:save` when a packet is bound. It then asks for `keep`:

```bash
node .skilled/hooks/session-handover/bin/session-handover.cjs keep --handoff <note-path> --session <session-id> --runtime <runtime>
```

`keep` validates the note the way `prepare` does, except that it does not require the `Running workers:` line. It closes this session's earlier claimed notes and appends a `note-kept` line to the hop history. It prints the `claim` and `complete` commands and exits 0. The session keeps working.

While this session has an open note, the nudge stays quiet. Writing the note therefore does not set off the reminder 0.05 higher. Inside the loop `keep` refuses with exit 2 and names `prepare`.

On Claude Code, the `compact-pointer` hook on `SessionStart` reads the event's `source`. After a compaction it resets this session's nudge level, so the next fill nudges again. It adds the claim instructions for the session's open note, so the compacted session claims the note. That session works its Remaining work and completes it. It adds nothing while a prepared hop owns the note.

When the record for that note was withdrawn or cancelled and the session has not written to the note since, the hook logs `compact-pointer-stale-note`. It tells the session to read the note for background only and not to claim it. The note predates the work done since the withdraw, so the session updates it at the next nudge.

Pi does the same on `session_compact` and OpenCode on `session.compacted`. Each resets the session's nudge level and drops a nudge it still holds. That text quotes the fill the compaction freed. Each sends the claim instructions for the open note, with Pi's sent as a hidden message and OpenCode's added to the next system prompt. Each logs `compact-pointer`.

When the record for the note was withdrawn and the session has not written to the note since, Pi and OpenCode send the same read-only note text Claude does. They log `compact-pointer-stale-note` instead. OpenCode keeps that text in the system prompt only while the withdrawal stands.

Codex does the same through `codex/handover-compact-pointer.mjs` on `SessionStart` with `source: compact`, as described under Per-Runtime Delivery.

Before it resets the nudge level or points at a note, the hook skips in three cases. The event carries no `transcript_path`. The transcript file is not named `<session_id>.jsonl`. A forked sub-agent's transcript under `<session-folder>/subagents/` holds a compaction record from the last 5 seconds.

A fork carries its parent's session id. Without that last check a fork's compaction would point the fork at the parent's note and reset the parent's nudge level. Each skip appends a `compact-pointer-skipped` line to `relaunch.log` with its reason.

On Claude Code a `PreToolUse` guard, `claude/handover-subagent-guard.mjs`, denies seven commands. They are `claim`, `complete`, `keep`, `prepare`, `cancel`, `consume` and `hand-over`. It denies them when the call comes from a sub-agent or fork, which Claude Code marks with an `agent_id`. Such a call would act on the parent's note. `history` stays allowed.

---

## 5. SUB-AGENTS AND NESTED RUNS

An OpenCode `task` sub-agent is a child session with its own id. The plugin records every session whose `session.created` or `session.updated` event carries `info.parentID`. It skips that session everywhere, so a child never gets a nudge, a seed or an arm.

The plugin tracks each child's `parentID` and a `busy` flag in `childSessions`. A child stays `busy` from its creation until its `session.idle` or `session.deleted` event. A parent `session.idle` with a busy child is held in `deferredArms` and arms nothing. The child that ends last runs the deferred arm for its parent.

The plugin sets the session title from `SKILLED_LOOP_NAME` on a claim seed through `ctx.client.session.update`. The call is not awaited, so an absent or failing `update` still leaves the seed in the system prompt. Pi has no built-in sub-agent.

A worker an orchestrator dispatches through a CLI is marked with `AI_SESSION_CHILD=1`. On every adapter, the nudge decision returns `child-session` for it at any fill. A worker therefore never gets told to save continuity or write a handoff into its parent's packet. The claim path skips such a child the same way.

A runtime started from inside a looped session inherits `SKILLED_LOOP_ID` without being the loop's runtime. `claude -p` or `pi -p` run from a tool shell is one example. The Claude, Pi and OpenCode adapters and the `prepare`, `keep` and `cancel` commands check the process tree first. The Codex adapters do not.

When two or more processes sit between the host runtime and the loop pid, the run is nested. The host is the nearest ancestor that is neither a shell nor an OpenCode process whose parent is also an OpenCode process. OpenCode 2 runs each tool shell under a pty daemon that its serve process starts. Counting those two would read the loop's own OpenCode session as nested.

A nested run logs `loop-nested-run` and drops every `SKILLED_LOOP_` variable from its own environment. That includes `SKILLED_LOOP_MANUAL_TEMPLATE` and the carried model, name and provider values. They would otherwise make the nested run print the outer loop's command. A nested run then behaves as a session outside the loop, and `prepare` there exits 3 instead of arming the outer loop.

`cancel` drops the inherited loop id the same way. It never cancels the outer hand-over unless you pass `--loop-id`. The check fails open, so a process table it cannot read leaves the variables in place.

---

## 6. RELATED

- [`README.md`](./README.md) - the folder overview and the rest of the contract.
- [`bin/session-handover.cjs`](./bin/session-handover.cjs) - the `prepare`, `keep`, `claim`, `complete` and `cancel` commands.
- [`lib/nudge.cjs`](./lib/nudge.cjs) - the shared nudge text, the suppression rules and `questionHoldReason`.
- [`lib/killer.cjs`](./lib/killer.cjs) - the idle wait, the SIGTERM and the timeout path.
- [`lib/withdraw.cjs`](./lib/withdraw.cjs) - the one withdraw helper every runtime and `cancel` use.
- [`lib/relaunch-core.cjs`](./lib/relaunch-core.cjs) - the record, the arm rules and the history locator.
- [`bin/history-lookup.mjs`](./bin/history-lookup.mjs) - the read-only history command the claim prints.
