# Iteration 8: Terminal conversations and the multi-bot conversation

## Focus

Conversations: how a terminal chat with a bot and its memory could reuse the bots CLI, run records and needs-you resume path, and which repos ship a terminal UI or conversation shell worth copying.

## Actions Taken

1. Read OpenBot's conversation summary and the coworker data model.
2. Read the skilled-bots dispatch module's headless contract and the bots CLI verb list.
3. Read Turnstone's terminal CLI front end.
4. Read the openhuman-tui README and its license.
5. Compared the four app surfaces a TUI would need with the data already stored.

## Findings

1. OpenBot's conversation is where work is given and reported, can hold more than one Bot, and each Bot takes the part of the work that is its job. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:28-34]
2. A conversation creates a channel and an Intelligence thread, two conversations with the same Bot stay separate, and a Bot's standing role is sent with every run so the job need not be restated. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md:75-80] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md:35-49]
3. Skilled bots' run path is explicitly headless: one run is one headless executor invocation, and the prompt tells the child that nobody is at a prompt and no answer can reach it. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:5-6] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:322]
4. The bots CLI has no chat or conversation verb; its verbs are run, disable, enable, pause, resume, inbox, enqueue, drain, schedule, answer and status. [SOURCE: .skilled/bin/bots.cjs:20-50]
5. Turnstone ships a real terminal front end: `TerminalUI` implementing a `SessionUI` protocol, readline setup, model auto-detection, workstream management and a REPL entry point, under Apache-2.0. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1-40]
6. openhuman ships `openhuman-tui`, a conversation-first terminal frontend built with ratatui and crossterm that already covers login, saved conversations, model/agent selection, approvals, tools, child-run inspection and diagnostics; it is GPL-3.0, so it is a design reference rather than liftable code. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:1-10] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2]
7. The smallest terminal conversation is a `bots chat` verb that keeps an append-only conversation JSONL under the user state root, sends the bot's BOT.md body as the standing role, and dispatches one headless run per user message with the transcript; several bots in one conversation need only a `botId` per message plus `@bot` routing. Size M, risk medium because it is a new surface but reuses dispatch, run records and needs-you resume. [INFERENCE: based on findings 1-4]
8. A TUI can carry all four app surfaces from data that already exists: a conversation pane over the new conversation file, an approvals pane over `bots inbox`, an activity pane over the status index, and a routine list over the BOT.md trigger plus schedule state. A desktop shell adds OS notifications, tray and global hotkey, an embedded browser and auto-update, none of which the terminal needs to match the app's information model. [INFERENCE: based on findings 1-7]

## Ruled Out

- Reusing the existing headless run path unchanged for chat: its prompt explicitly says nobody is at a prompt, so a chat surface needs a different prompt contract and a conversation store.
- Lifting openhuman-tui code: GPL-3.0 would impose copyleft, so it is a design reference only.
- Building a desktop shell first: the terminal can show conversations, approvals, activity and routines from existing stores, and a desktop shell adds delivery mechanics rather than missing primitives.

## Dead Ends

- Searching the bots CLI for a conversation verb found none; the CLI is a run-control surface, not a chat surface.
- Treating the needs-you resume path as a chat loop would lose the conversation transcript, because a needs-you item holds one question and one answer, not a history.

## Edge Cases

- Ambiguous input: none. The conversations topic is named explicitly.
- Contradictory evidence: none. OpenBot's multi-bot conversation and skilled bots' headless single-bot run describe different surfaces without conflicting.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:28-34
- specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md:35-49
- specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md:75-80
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:5-6
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:322
- .skilled/bin/bots.cjs:20-50
- specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1-40
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:1-10
- specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2

## Assessment

- New information ratio: 0.9
- Questions addressed: conversations (topic question 2)
- Questions answered: none tracked as a frontier question; this iteration broadens beyond the dealt frontier

## Reflection

- What worked and why: Reading the headless dispatch contract before the OpenBot conversation model made the size estimate honest: chat is a new surface, not a CLI flag.
- What did not work and why: Searching the bots CLI for a chat verb found none, which is the gap rather than an oversight.
- What I would do differently: Read the TUI references before designing the conversation store, so the transcript shape is informed by an existing terminal implementation.

## Recommended Next Focus

Memory and skills: how OpenBot's per-bot and shared memory and its three ways of recording a skill map onto Skilled's skills and the spec-kit, and what the smallest per-bot and shared memory store would be. Then apps and computer.
