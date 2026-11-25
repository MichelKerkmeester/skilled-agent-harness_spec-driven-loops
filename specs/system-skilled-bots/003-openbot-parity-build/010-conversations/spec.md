---
title: "Feature Specification: Phase 10: conversations"
description: "Adds `bots chat <id>` over an append-only conversation JSONL under the state root, one headless run per human message with the BOT.md body as the standing role, a `botId` per message and `@bot` routing for several bots, and the chat pane in the `bots ui` screen from phase 003."
trigger_phrases:
  - "bots chat"
  - "bot conversation"
  - "phase 10 conversations"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: conversations

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-skills |
| **Successor** | None |
| **Handoff Criteria** | `bots chat <id> --message` appends one human message, records one run and appends one reply; `@bot` routes a message to another bot; the chat pane draws the transcript; every acceptance criterion is Met and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: The `chat` verb, the conversation file it appends to, the transcript bound, `@bot` routing, and the chat pane in the phase 003 screen. The queue's own verbs, the needs-you item shape, the approval ladder, a server or database, and the desktop shell are other phases or out of scope.

**Dependencies**:
- The BOT.md body, which `buildBotPrompt` already sends as the standing role of every run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315-332]
- The request prompt join, which appends a request's own text after the body and never replaces it [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1049-1050]
- The per-identity state folders, which the conversation file joins [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-131]
- The queue's claim, retry and quarantine routing, which one chat message reuses [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:180-226]
- Phase 003's `bots ui` verb and crate, whose chat tab is a placeholder today [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:164]

**Deliverables**:
- `bots chat <id>`, `--message`, `--transcript`, `--json` and `--conversation`
- `conversation.ts`, holding the message record, the append-only write, the read that skips a torn line, the `@bot` parse and the transcript bound
- The chat pane in `crates/bots-tui/`, replacing the phase 003 placeholder
- The Apache-2.0 notice for turnstone's terminal loop
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled bots is headless by contract: one run is one executor call and the CLI has no conversation verb, so a person who wants to give a bot work and read what it said composes a `bots run` invocation and then opens the run folder by hand [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:5-6] [SOURCE: .skilled/bin/bots.cjs:18-50]. Nothing records a sequence of exchanges, so a second message cannot refer to the first, and several bots cannot share one thread: a run record holds one run and no message [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:196-206]. The `bots ui` screen from phase 003 draws a chat tab that names this phase and holds no state, so the one surface a person would use for a conversation is empty [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:164].

### Purpose
Give the operator one conversation verb and one file, so a message becomes a run and a reply becomes the next line, and several bots share the thread through `@bot`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/bin/bots.cjs chat my-bot
bots: unknown verb: chat
exit=2
$ node .skilled/bin/bots.cjs ui
bots: unknown verb: ui
exit=2
$ rg -c 'conversation' .skilled/skills/system-skilled-bots/runtime/lib/
exit=1
$ rg -c 'conversations' .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts
exit=1
```

The first two commands are the measured gap: the CLI has no `chat` verb, and the `ui` verb the chat pane would draw in does not exist yet either [SOURCE: .skilled/bin/bots.cjs:64]. The two `exit=1` lines are the third: no runtime module mentions a conversation, and the state layout has no folder for one, so the file this phase appends to has no home today [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-131].
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `bots chat <id> --message <text>` over a new append-only `conversation.ts`, which appends one human message, dispatches exactly one headless run of the addressed bot with the transcript as the request prompt, and appends one bot message carrying the run id and the reply
- Add `bots chat <id>`, a terminal loop with readline history and tab completion over `@<bot-id>` and `/` commands, one message per line
- Add `bots chat <id> --transcript [--json]` and `--conversation <name>`, so a conversation can be read and one bot can hold more than one
- Add `@<bot-id>` routing, so one conversation holds several bots and each message names the bot it addresses
- Replace the phase 003 chat placeholder with a pane that draws the transcript and sends a typed line

### Out of Scope
- A server, a database or a transcript shared across machines - the research eliminates a server for conversations, and the file is per identity under the state root [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:164]
- Streaming a run's output into the conversation as it arrives - one message is one run, and the reply is appended when the run ends; a stream needs a second writer and a partial-message state
- Attachments, files and voice - OpenBot's composer takes all three, and a small team's bot reads the checkout instead [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:28-30]
- A bot naming a peer `@Name` to hand off - OpenBot allows it under the same grants and caps; this phase routes a human message only [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:189]
- A conversation-scoped approval grant - phase 006 owns the `grants` field and the precedence ladder [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:145]
- The desktop shell - the research ranks it last and justifies it only by an embedded browser or a no-terminal install [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:151]
- A fifth hub mode - `bots chat` dispatches runs, so it belongs to the run mode beside `bots answer` [SOURCE: .skilled/skills/system-skilled-bots/SKILL.md:31]
- Rotating or compacting a conversation file - the file is append-only here, and a rotation is a later packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/conversation.ts` | Create | The message record, the append-only write, the read that skips a torn line, the `@bot` parse and the transcript bound |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | Add the `conversations` folder to the identity paths and to `ensureIdentityState` |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Modify | Add the `requestIds` filter, so one chat message runs through the same claim and routing path |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Return the final answer text on the `completed` outcome |
| `.skilled/bin/bots.cjs` | Modify | The `chat` verb: usage line, verb spec, options, the loop, the one-message path and the transcript read |
| `.opencode/bin/bots.cjs` | Modify | Byte-identical mirror of the edited CLI |
| `crates/bots-tui/src/cli.rs` | Modify | `chat_transcript` and `chat_send` over the two `bots chat` calls |
| `crates/bots-tui/src/ui_state.rs` | Modify | Chat state: the selected bot, the draft line and the scroll offset |
| `crates/bots-tui/src/render/panes.rs` | Modify | Replace the chat placeholder with the transcript body |
| `crates/bots-tui/src/keys.rs` | Modify | The chat keys and the label each one draws |
| `crates/bots-tui/tests/fixtures/bots` | Modify | Canned `chat --transcript --json` output and a recorded `--message` call |
| `.skilled/skills/system-skilled-bots/runtime/tests/conversation.vitest.ts` | Create | Append-only, torn line, `@bot` parse, bound and message shape |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-chat.vitest.ts` | Create | The verb's argv, the one-message path, the loop's `/exit` and the refusals |
| `.skilled/skills/system-skilled-bots/runtime/tests/queued-run.vitest.ts` | Modify | The `requestIds` filter runs one request and leaves the rest queued |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modify | The `completed` outcome's answer text |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | Add `conversation.ts` to the topology and the module table |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | Modify | Name `bots chat` and its flags in the verb table |
| `.skilled/skills/system-skilled-bots/bots-run/SKILL.md` | Modify | Name the chat verb in the mode's scope |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modify | One line naming `bots chat` as a run-mode verb |
| `.opencode/skills/system-skilled-bots/SKILL.md` | Modify | Byte-identical mirror of that line |
| `crates/bots-tui/README.md` | Modify | The chat tab's keys and the two verbs it calls |
| `THIRD_PARTY_NOTICES.md` | Create | The Apache-2.0 notice for turnstone's terminal loop |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bots chat <id> --message <text>` appends one human message to `<stateRoot>/<identity>/conversations/<conversation>.jsonl`, dispatches exactly one headless run of the addressed bot with the transcript as the request prompt, and appends one bot message carrying the run id and the reply text. The BOT.md body stays the standing role, and the transcript is added after it |
| REQ-002 | The conversation file is append-only. Every message is one JSON line, the file is opened for append and never rewritten, and a torn last line is skipped on read and reported on stderr rather than repaired |
| REQ-003 | Every message carries `schemaVersion`, `id`, `conversationId`, `botId`, `role`, `text`, `at`, `runId` and `by`. A human message carries the addressed bot's id and the actor; a bot message carries the replying bot's id and the run id |
| REQ-004 | `@<bot-id>` at the start of a human message routes that message to that bot, and a message with no `@` goes to the conversation's bot. A message naming a bot with no `BOT.md` is refused with `bot-unknown` and nothing is appended |
| REQ-005 | `bots chat <id>` runs a terminal loop with readline history and tab completion over `@<bot-id>` and `/` commands. `/exit` and `/quit` leave, an empty line sends nothing, and a closed stdin leaves with exit 0 |
| REQ-006 | `bots chat <id> --transcript` prints the conversation in order, and `--json` prints the messages as a JSON array |
| REQ-007 | A run that parks a needs-you question appends a bot message carrying the question and the item id, and a run that fails appends a bot message carrying the failure reason. Neither outcome is silent |
| REQ-008 | The chat pane in `bots ui` draws the transcript from `bots chat <id> --transcript --json` and sends a typed line through `bots chat <id> --message <text>`, replacing the phase 003 placeholder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | The transcript a run receives is bounded to the newest 40 messages or 8,000 characters, whichever comes first, and the bound is a named constant |
| REQ-010 | The lifted terminal loop carries an Apache-2.0 notice in `THIRD_PARTY_NOTICES.md` naming `turnstone/turnstone/cli.py`, its copyright line and a statement of changes |
| REQ-011 | A human message's id is the request's event id, so a re-sent message is a queue duplicate and dispatches no second run |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a temporary state root, `bots chat my-bot --message "hello"` exits 0, `bots chat my-bot --transcript --json` prints two messages in order, and the second carries the run id the first run wrote
- **SC-002**: `bots chat my-bot --message "@other-bot hello"` appends a human message whose `botId` is `other-bot` and dispatches `other-bot`, not `my-bot`
- **SC-003**: After a torn last line is written by hand, `bots chat my-bot --transcript --json` still prints every whole message and reports the torn line on stderr
- **SC-004**: `bots ui` draws the chat tab with the transcript's lines, and a line typed there appears in `bots chat <id> --transcript`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003's `bots ui` verb and crate | The chat pane has no screen to draw in | The pane is the last task, and the verb and the file are provable without it |
| Dependency | The queue's claim and routing | A chat message cannot reuse the retry and quarantine rules | `drainQueue` gains a `requestIds` filter, so one message runs through the same path as a drained request |
| Risk | A conversation file grows without bound | A long thread slows every read and every transcript | The transcript sent to a run is bounded; the file is read whole and a rotation is named as a later packet |
| Risk | A message text reaches a shell or a path | A crafted line writes outside the state root | The conversation id is validated as a safe segment, and the text is stored as a string only |
| Risk | A run's reply is empty | The conversation shows a bot message with no text | An empty reply appends the run's exit reason instead, so the line is never blank |
| Risk | Two chat loops write one file at once | Interleaved lines | Each message is one `appendFileSync` of one line, which the OS appends atomically below the pipe buffer size |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `bots chat <id> --transcript` over 1,000 messages prints in under 200 ms, measured with `time`
- **NFR-P02**: One message's dispatch reads the conversation file once, for the transcript it sends, and never re-reads it to build the reply

### Security
- **NFR-S01**: The conversation file is created 0600 inside a 0700 folder, the mode every other state file uses
- **NFR-S02**: The message text passes the runner's existing secret-literal check before dispatch, so a pasted token refuses the run as `body-secret` and reaches no process table

### Reliability
- **NFR-R01**: A torn last line never makes a conversation unreadable; every whole line before it still reads
- **NFR-R02**: A run that fails still appends one bot message, so the file's message count always equals the transcript's
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty line in the loop sends nothing and appends nothing; `--message ""` exits 2 with usage
- Maximum input: a 100,000-character message is stored whole, and the transcript sent to the run is cut to the bound with the newest text kept
- Failure path: a message naming an unknown bot exits 4 with `bots: bot-unknown: <id>` and appends nothing; a run that fails appends a bot message and exits 1
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One new module, one CLI verb, one drain filter, one outcome field, four crate files |
| Risk | 7/25 | A new surface, no schema migration, no auth, no network |
| Research | 5/20 | The research names the shape, the file and the liftable loop |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a conversation belong to one bot or to the identity? Decision: the identity, with the bot id as the default conversation name, so several bots share one file
- Should the reply be the run's final answer text or its whole stdout? Decision: the final answer text, through the runner's existing `finalAnswerText`, so a JSON-log executor's envelope never reaches the conversation
- Should a parked question be a bot message or an inbox item only? Decision: both, because the conversation is where the person is looking when the run parks
<!-- /ANCHOR:questions -->

---

