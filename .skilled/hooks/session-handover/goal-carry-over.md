---
title: "Session Handover Goal Carry-Over"
description: "How a session-handover note carries the sender's goal packet to the next session, per runtime, and how a Claude receiver binds it."
trigger_phrases:
  - "goal carry-over"
  - "goal packet hand-over"
  - "SESSION_HANDOVER_GOAL_PACKET"
  - "Claude receiver goal"
  - "killer lock takeover"
  - "goal not carried"
importance_tier: "normal"
contextType: "reference"
---

# Session Handover Goal Carry-Over

A hand-over note can carry the sending session's goal packet to the next session.

## 1. OVERVIEW

This reference covers the `goal_packet` field and the per-runtime lookup behind it. It also covers the arm race that can lose a hop and the lock that keeps a second killer off the same loop, apart from one remaining race window. Each receiver binds the packet in its own way.

---

## 2. THE ARM RACE AND THE RELAUNCH PATH

A Claude sender under an unmet native goal usually still hops. No `UserPromptSubmit` fires for the continuation, so the killer's 3 s idle wait lands in its first API call. The hop is lost with `killer-timeout` only when the continuation keeps writing less than 3 s apart for 30 s. A continuation tool call longer than 3 s can be killed mid-run. That work is not in the note.

The killer lock stores its owner pid, a creation timestamp and an expiry timestamp. The expiry is the overall timeout plus 15000 ms of signal wait, 3000 ms of notification time and a 60000 ms margin.

A lock past its expiry does not count as a live owner, even while its pid exists. The same holds for a two-field lock, with no expiry stamp, that is older than 10 minutes. That pid may by then belong to an unrelated process.

A live owner logs `killer-lock-held`. A lock younger than five seconds without a readable owner pid logs the same event.

Taking over a stale lock first acquires a takeover mutex, the `<lock>.takeover` directory. Its `owner` file records the pid and token of the killer that holds it. The mutex is reclaimed when that owner is dead or the directory is past the 10-minute hold bound. A mutex with no owner file is reclaimed once it is older than 30 s. The reclaim is an atomic rename.

A live holder keeps exclusion only while the directory stays younger than the 10-minute hold bound. A real holder holds the mutex for a re-check, an unlink and a create, never minutes. Past that bound the recorded pid counts as reused and the mutex is reclaimed.

A killer that cannot acquire the mutex logs `killer-lock-held`. The mutex holder re-checks the lock, logs `killer-lock-stale`, removes the lock and retries once. Leftover `.stale-` takeover directories older than 30 s are swept under the mutex.

The killer writes its pid and a random token to the mutex `owner` file. On release it renames the directory to a private `.stale-` name. It removes that directory only when the inode it recorded and the token both still match. Otherwise it renames the directory back.

One window remains. It needs three killers racing on the same loop's takeover. A third killer can recreate the mutex path while a mismatched directory is being renamed back. The displaced directory then stays under its `.stale-` name until the stale sweep.

While it does, two killers can both pass the re-check. One can remove the lock the other just created with its exclusive open. Both then supervise the loop. Directories offer no atomic compare-and-delete, which is why the window remains.

The killer releases the lock file the same way. It removes the file only while the recorded owner pid is its own. It logs `killer-lock-not-owned` when a contender has taken it over.

An owner file that cannot be read fails the killer with `killer-error` and exit code 1. Two exceptions apply. A non-directory at the mutex path has no owner file and is judged by age. An owner read that fails with `ENOENT`, `EACCES` or `EISDIR` counts as no owner.

If releasing the mutex fails after the takeover has finished, the killer logs `killer-mutex-release-error` with the error code. The takeover result stands. The killer keeps the lock it acquired and continues supervising.

The lock and the takeover mutex live in `lib/killer.cjs`.

After the selected runtime exits, `skilled-loop` declines unless the record is armed, fresh and below the hop limit. It consumes an eligible record, increments the hop count and launches that runtime with a seed that carries the Gate 3 answer.

~~~text
[session-handover] claim and continue handoff <note-path> | Spec folder: <spec-folder> (carried from the handoff; Gate 3 answered in the sending session)
[session-handover] claim and continue handoff <note-path> | Spec folder: none (Gate 3 answered D, Skip, in the sending session)
~~~

If the record is still pending when the runtime exits, `skilled-loop` prints the runtime-specific manual claim command on stdout. It preserves the runtime's exit code. The core fills that command from `SKILLED_LOOP_MANUAL_TEMPLATE`.

When a carried model, name, provider or Pi extension value contains the template's `@@HANDOFF@@` placeholder, the wrapper prints an error naming the value on stderr. It then prints the plain command and turns a clean runtime exit into exit 1. The CLI's `prepare` warns on stderr the same way when the template holds no placeholder or more than one.

For a valid repo-relative `spec_folder`, the wrapper adds a `Spec folder:` suffix with the packet path. When the field is `none`, it adds a Skip suffix. An empty field adds no suffix, so the receiver asks Gate 3 as usual. A valid path carries the sending session's answer across the hop. AGENTS.md states that a relaunch hop is the same session.

The receiver claims the note and reads its four sections. When the packet holds a `goal.md`, it reads that file before Remaining work. When In-flight state names an `Active command:` other than `none`, it runs that command again with the same mode and arguments. When the note names an `Active goal:` other than `none`, it calls `create_goal`. On a runtime without `create_goal` it tells the operator which goal to set.

For a packet path, it runs `/speckit:resume`. For `none`, it skips resume and treats Gate 3 as answered D) Skip. It works only on the task's Remaining work. It never runs `prepare` for the claimed note. It runs `complete` when the task work ends.

~~~bash
node .skilled/hooks/session-handover/bin/session-handover.cjs claim <note-path> --session <new-session-id>
node .skilled/hooks/session-handover/bin/session-handover.cjs complete <note-path>
~~~

---

## 3. THE GOAL PACKET FIELD

A note can carry an optional `goal_packet` frontmatter field. The field is the repo-relative directory of the packet whose `goal.md` holds the sending session's goal. `prepare` and `keep` own the field.

Each call resolves the sender's goal again and writes the result. The packet is written when the sender has a goal that can be proven. A Claude sender that never had a goal set gets the packet goal of the note's spec folder. No field is written otherwise.

A value already in the note is replaced or removed. A note prepared again after its goal ended therefore stops handing the goal on. A value written by hand does not survive.

A Claude goal that ended also leaves a `goal_ended: true` field in the note. The same two commands write and remove it.

Where the goal is found depends on the sender's runtime.

| Sender | Where the goal is read |
|---|---|
| OpenCode, Pi, Devin, Cursor | The active goal record under `.skilled/skills/.state/goal/` |
| Vibe | No goal record. The packet the Vibe goal hook renders from |
| Claude | The newest goal entry in the session log |
| Codex | Nowhere, so no field is written |

Vibe keeps no goal record. Its sender reads the packet the Vibe goal hook renders from: `VIBE_SPEC_FOLDER` when it is set, otherwise the `SESSION_HANDOVER_GOAL_PACKET` a claim exported. Either one counts only when it names a real packet.

OpenCode, Pi, Devin and Cursor read the session's active goal record under `.skilled/skills/.state/goal/`. That record names the bound packet. A paused, completed or cleared goal counts as none. Devin and Cursor have no record under the fresh native id a manual claim starts. They also keep the packet the claim exported in `SESSION_HANDOVER_GOAL_PACKET` when it names a real packet.

Claude reads the newest goal entry in the session log. A goal that is met, failed or cleared counts as none. The packet is the spec folder, one of its parent packets or a packet the goal text names. Its `goal.md` must carry the goal's opening line. When the spec folder and the named packets all miss the line, a packet under `specs/` whose `goal.md` carries it is used if exactly one does.

With no readable log no packet can be proven. A mark the note this session claimed last carries still stands. A log that holds no goal entry at all means no goal was ever set in that session.

The field then names the nearest packet whose `goal.md` still has an unticked completion criterion and a slice within the budget, trying the spec folder first, then its parent, and no packet further up, so the receiver starts on that goal without the operator typing it.

A leaf phase goal has no slice budget and gives way to its parent. A finished `goal.md` is skipped.

Past the 16 MB cap, a tail that holds no goal entry is followed by a read of the bytes before it in fixed chunks. The newest entry anywhere in the log then decides. A log with no entry at all reaches the packet goal fallback.

A goal that is met, failed or cleared is marked in the note as `goal_ended: true`. A receiver that sets no goal has a log with no goal entry. Its own hand-over reads the mark from the note it claimed last, found beside the note it hands over. That hand-over carries no packet goal and writes the mark onward. A goal set in a later session is carried as usual and takes the mark away.

Codex reads the goal nowhere, so no field is written. Codex keeps a goal per thread in `goals_1.sqlite` under its home, with the objective text and a status and no packet. No populated record has been read from it.

A spec folder that holds a `goal.md` does not show that the sender had a goal, so a Codex hand-over carries no goal packet. A Codex sender names its goal on the note's `Active goal:` line instead, because Codex still has no goal reader.

A written value is checked the way `spec_folder` is. The packet path must be repo-relative. Its directory and `goal.md` must stay inside the repository once links are followed. The packet passes when it meets these checks in this checkout or in the working directory the note names. A resolver that finds nothing, cannot prove the goal or cannot read its source leaves the field out. It never fails the hand-over.

The note carries the path and never the goal text. A copy would go stale while `goal.md` changes. When no packet is carried and the resolver has a reason, `prepare` and `keep` print one `[session-handover] goal not carried: <reason>` line on stderr. They leave the field out. A note without a `goal_packet` field claims and hands over unchanged.

`claim` prints the note body, then the `complete` command that closes the note. Some runtimes see the claim instructions only once. A model that answers straight from the body can skip that step. It ends its output with a `Goal packet: <path>` line when the packet still holds a `goal.md`. `consume` reports the packet as `goal_packet`. `skilled-loop` exports it as `SESSION_HANDOVER_GOAL_PACKET` to the relaunched session.

The wrapper removes any value an outer session left from the first launch. It does the same for any hop whose note carries no packet. A first launch started by the printed manual claim command is the one first launch that gets a packet. The wrapper finds the claim seed among the operator's arguments by its prefix. It reads the note that seed names.

It exports the packet only when that note is open, its real path is inside the handoffs directory and its packet passes the same checks `consume` applies.

On Claude it replaces that one argument with `/goal <slice>` and moves the seed to `SKILLED_LOOP_CLAIM_SEED`. Every other operator argument stays where it was. Binding the goal in the receiving runtime is the receiving adapter's work. This layer records the packet and passes it on. The wrapper itself acts for Claude as described below.

`SESSION_HANDOVER_GOAL=0` turns all of it off. `prepare` and `keep` then neither write, replace nor remove the field. `claim` and the wrapper pass nothing on. A relaunch follows the switch as it stood when `prepare` wrote the record.

A note prepared with the switch off hands on no packet, even when the switch is on again by the time the record is consumed. A manual `claim` has no record to read, so it follows the switch at claim time. Pi and OpenCode bind a hop goal once per process and delete `SESSION_HANDOVER_GOAL_PACKET` after the attempt. A later session or a nested runtime therefore cannot bind it.

The goal packet resolver and the note fields live in `lib/relaunch-core.cjs`.

---

## 4. GOAL IN A CLAUDE RECEIVER

Claude has no goal record a hook can bind. A Claude receiver therefore gets its goal as the start prompt, `/goal <slice>`. The slice is read from `goal.md` at launch with `goal.cjs packet <packet> --workspace <root>`. It is the file as it stands at launch and never a copy.

Only the `chat_slice` is sent, with no frontmatter, comments or anchors. The command must report `packet_budget=ok`. The slice must fit 4,000 characters, the limit Claude puts on a goal condition.

A start prompt can be the command and nothing else. A start hook cannot send the command in an interactive session, so the claim seed moves out of the prompt. `skilled-loop` exports it as `SKILLED_LOOP_CLAIM_SEED`. The `SessionStart` hook in `claude/handover-compact-pointer.mjs` delivers the claim instructions as start context. It carries the seed's spec folder and Gate 3 answer, before any goal work.

The hook acts only on the `startup` source. It delivers the claim even while the Claude enable switch is off, because the wrapper already swapped the start prompt. The start context is the claim's only route. The master hook switch and the concern kill switch silence the whole hook.

`SESSION_HANDOVER_GOAL=0` keeps the claim silent. So does a dispatched child (`AI_SESSION_CHILD=1`). So does a runtime started from the loop session's shell, because the variable carries the `SKILLED_LOOP_` prefix the nested-run check strips.

In the live runs of 2026-11-13, a Claude receiver claimed its note in ten of ten counted hops under a goal that allows other work. It claimed in two of five under a test goal whose text tells the session to do nothing else.

The claim reaches the receiver as start context only. The start prompt carries no claim line, because every counted receiver under the first goal claimed without one. A goal whose text forbids other work can make a receiver skip its claim.

When no slice can be sent, the receiver keeps the claim seed as its start prompt. The hop then relaunches with the claim seed and sets no goal. The wrapper prints one `warning: the goal was not set in the relaunched session: <reason>` line when a packet was named and the slice is refused.

The slice is refused when, among other reasons, the packet lost its `goal.md`, the slice is over the limit, the repository has no budget to check it against, `goal.md` has no durable slice, or the slice carries frontmatter, markup or a control character. A hop with the switch off or no packet prints nothing. A Claude receiver is a new session with no goal, so nothing replaces an existing one.

A phase child carries no durable-slice budget, so the goal command reports `packet_budget=unknown`. Claude keeps the claim seed and sets no goal, because it sets a goal only from a slice whose budget is `ok`. Pi and OpenCode bind the packet itself and do bind a phase-child goal.

Codex gets no goal packet of its own. Its start prompt cannot be the goal command. A hop always relaunches the runtime it left, so a Codex hop never carries a packet. Codex still has no goal reader, so a Codex sender names its goal on the note's `Active goal:` line instead.

A manual claim can still carry a packet. Codex can start with the claim seed of a note another runtime wrote. The wrapper then exports that note's packet as `SESSION_HANDOVER_GOAL_PACKET`. `claim` ends with its `Goal packet:` line. The seed instruction tells the receiver to call `create_goal` when the note's `Active goal:` line names one. It also tells the receiver to tell the operator which goal to set on a runtime without `create_goal`.

The chat slice renderer for a Claude receiver is `lib/goal-handover.cjs`.

---

## 5. GOAL CARRY-OVER SHOWN LIVE

Live hops on 2026-10-25 read the receiver and not the sender. Each ran in a throwaway checkout with a private tmux server and runtime directory.

- **Claude and Pi:** a sender with a goal handed it on. The receiver held it. The two controls (`SESSION_HANDOVER_GOAL=0` and a sender with no goal) left the receiver with none.
- **Codex:** a hop carries no packet by design. The control shows a note with no `goal_packet` line and an empty `SESSION_HANDOVER_GOAL_PACKET` in the receiver.
- **OpenCode 2:** a hop with a goal reached the receiver on OpenCode 2.1.4 started with `--standalone`. The receiver claimed and completed the note, bound the packet as a new goal record and saw it in `SESSION_HANDOVER_GOAL_PACKET`.
- **Devin and Cursor:** both ship on the command trigger, so nothing arms a prepared record and the wrapper never relaunches them.

On Claude the receiver's log shows a goal of 3,990 characters and a start claim. On Pi it shows a goal block with a new goal id.

The OpenCode receiver also binds a packet it is given and stays empty under the switch and with no packet. On its default background service the loop does not run at all. The plugin runs in a service no wrapper started. That service holds no `SKILLED_LOOP_ID`, so nothing arms.

The wrapper adds `--standalone` to the first launch and to every relaunch when `opencode --help` lists the flag, so the operator does not pass it. A launch that carries `--server` stays on that server, prints a warning and never arms. Running `opencode mini` or another subcommand skips the wrapper.

A manual start by the printed command goes through the first-launch path. That path exports the packet of the note its seed names as `SESSION_HANDOVER_GOAL_PACKET`. No hop ever hands Devin or Cursor a packet. The Devin receiver half bound a packet in a headless session with the variable set by hand. The Cursor receiver has no live result, because the test machine had no Cursor login.

The playbooks hold the repeatable form of each run: the Goal Carry-Over checks in the Claude, Pi and OpenCode, and command-runtime relaunch scenarios.

---

## 6. RELATED

- [`README.md`](./README.md) - the session-handover contract this document extends.
- [`lib/killer.cjs`](./lib/killer.cjs) - the killer, its lock and the takeover mutex.
- [`lib/relaunch-core.cjs`](./lib/relaunch-core.cjs) - the goal packet resolver and the note fields.
- [`lib/goal-handover.cjs`](./lib/goal-handover.cjs) - the chat slice renderer for a Claude receiver.
- [`claude/handover-compact-pointer.mjs`](./claude/handover-compact-pointer.mjs) - the `SessionStart` hook that delivers the claim.
- [`bin/session-handover.cjs`](./bin/session-handover.cjs) - the `prepare`, `keep`, `claim` and `complete` commands.
- [`bin/goal.cjs`](../goal/bin/goal.cjs) - the `packet` command that prints the slice and its budget.
