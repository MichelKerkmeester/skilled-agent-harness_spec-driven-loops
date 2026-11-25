# Iteration 1: Frontier F-1-001 — conversations, activity feed, and terminal versus desktop

## Focus
Frontier node F-1-001 (depth 1, scope OpenBot-main/app, OpenBot-main/desktop, OpenMausBot-main, rakazo-main, openhuman-main, turnstone-main, .skilled/bin/bots.cjs): How do OpenBot and the other reference repos give a team conversations with a bot and an activity feed, and can a terminal or TUI match the OpenBot desktop app for that, or is a desktop shell such as Tauri worth adding?

Interpretation: "conversations" means the human-to-bot work surface (one bot or several in one thread), "activity" means the after-the-fact record of what a bot did. "Terminal or TUI" means an interactive terminal program, not a browser page opened from a CLI.

## Actions Taken
- Read the OpenBot eight-part frame and its placement rules for Conversations and Activity.
- Read OpenBot's group-chat and activity-pane implementations.
- Read OpenBot Desktop's Tauri manifest, entry point and module list.
- Read openhuman's terminal frontend README, Cargo manifest and event-loop header.
- Surveyed the remaining reference repos for their shell type (Electron, Tauri, web, dashboard plugin).
- Read the skilled-bots CLI verb surface and runtime library inventory.

## Findings
1. OpenBot frames a bot as eight primitives in four pairs, and Conversations and Activity are the two ends of the work loop: Conversations is "How do I give it work?", Activity is "What did it do?". The order is fixed: Conversations, Routines, Memory, Skills, Apps, Computer, Approvals, Activity. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:6-18] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:168]
2. OpenBot supports several bots in one conversation. The group chat is a server-owned shared transcript: the person posts once, `@Name` addresses one bot, otherwise every addressed bot runs through the ordinary headless AG-UI path one after another, and each bot answers in a thread of its own that the UI draws attributed. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/channels/group-chat.tsx:42-48]
3. OpenBot's activity pane is a lifecycle view, not a raw log: entries are typed as `routine`, `responsibility`, `handoff` and related kinds, each with its own icon and label, and the pane links back to the routine, task or conversation that produced the entry. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/bot-profile/activity.tsx:67-79] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:141-154]
4. OpenBot Desktop is a Tauri 2 shell whose responsibilities are the machine around the bot, not the chat itself: the manifest depends on `tauri` with `tray-icon` and `image-png`, and the entry point's module list covers install, engine, stack, update, host folder access, telemetry, recorder and uninstall. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/Cargo.toml:28] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/src/main.rs:13-31]
5. A terminal precedent already exists in the reference set. openhuman ships `openhuman-tui`, a conversation-first terminal frontend built with ratatui and crossterm that embeds the core in-process with no HTTP server or sidecar; it covers login, saved conversations, model and agent selection, approvals, tools, child-run inspection and diagnostics. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:3-9]
6. That TUI is a real host, not a wrapper: its event loop folds the same `web_chat` broadcast stream the desktop app consumes into `TranscriptState`, alongside a crossterm keyboard reader and a spinner ticker. The README documents `/sessions`, `/resume`, `/permissions`, `/skills`, `/mcp` and `/artifacts` as first-class commands, plus a persistent attention control for pending approvals and plan review. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:8-10] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:94-107]
7. The other reference repos split between desktop shells and web apps: OpenMausBot is an Electron app described as "a local-first chat app for running a team of AI agents"; OpenGhost is Electron with its own hand-written UI; buzz ships a Tauri desktop plus web and admin-web; hermes-muse ships a dashboard plugin rather than an app; rakazo carries desktop, mobile, web, www, api and worker apps in one workspace. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/package.json:5] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/package.json:169] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/package.json:6] [SOURCE: specs/system-skilled-bots/context/buzz-main/desktop/package.json:19-25] [SOURCE: specs/system-skilled-bots/context/buzz-main/desktop/package.json:53-55] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/desktop/plugin.js:1]
8. Skilled bots today has no conversation surface at all. The `bots` CLI is a one-verb front door over the runtime: `run`, `disable`, `enable`, `pause`, `resume`, `inbox`, `enqueue`, `drain`, `schedule`, `answer`, `status`. The nearest thing to a conversation is `answer <item-id> <text>`, which answers a needs-you item and queues the run that continues it; the nearest thing to an activity feed is `status`, which shows each installed bot's last run, delivery and open needs-you items from the status index. [SOURCE: .skilled/bin/bots.cjs:19-50]
9. Verdict on terminal versus desktop for this pair: a TUI can carry all four surfaces the question names — conversations, an approvals inbox, an activity feed and a routine list — because each is text-first and event-driven, and openhuman proves the shape. What a Tauri shell adds is the machine around the terminal: a native window and tray, self-update, OS folder pickers that can grant scoped file authority, microphone capture, and supervision of a local engine or container stack. A small team that already runs the bots CLI on one machine or a shared host does not need those on day one. [INFERENCE: based on findings 2-8]

## Ruled Out
- Looking for a ratatui, bubbletea, textual or ink TUI in every reference repo: only openhuman ships a real terminal frontend (`crates/openhuman-tui`). OpenGhost and OpenMausBot are Electron; buzz and OpenBot are Tauri; hermes-muse is a Hermes dashboard plugin; turnstone and rakazo are web/api workspaces. Repeating this survey per repo would add no new signal.
- Treating the OpenBot desktop app as the parity target for conversations: its chat UI is the same web app served to the browser, and the Tauri layer's distinctive work is engine/stack management, not chat.

## Dead Ends
- Counting "which repo has a desktop app" as evidence of a better conversation surface. Electron and Tauri shells in this set mostly wrap the same web UI; the differentiator is the host contract (streaming events, approvals, sessions), not the window toolkit.
- Using OpenBot's mobile app as a comparison point. It is explicitly on the topic's skip list.

## Edge Cases
- Ambiguous input: "terminal versus desktop" was read as an interactive TUI versus a native desktop shell, not as a CLI versus a browser. Deferred alternative: whether a local web UI served by the CLI counts as "terminal experience"; the evidence in finding 9 applies to it as well.
- Contradictory evidence: none. OpenBot's docs and code agree that conversations are server-owned transcripts and activity is a separate lifecycle view.
- Missing dependencies: none. All sources were local and readable.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/channels/group-chat.tsx
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/bot-profile/activity.tsx
- specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/Cargo.toml
- specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/src/main.rs
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs
- specs/system-skilled-bots/context/OpenMausBot-main/package.json
- specs/system-skilled-bots/context/OpenGhost-main/package.json
- specs/system-skilled-bots/context/buzz-main/desktop/package.json
- specs/system-skilled-bots/context/hermes-muse-main/desktop/plugin.js
- .skilled/bin/bots.cjs

## Assessment
- New information ratio: 0.89
- Questions addressed: F-1-001 (conversations, activity feed, terminal versus desktop)
- Questions answered: F-1-001

## Reflection
- What worked and why: reading the implementation next to the docs separated the chat surface from the shell. The group-chat header comment and the Tauri module list each state their boundary explicitly, so the terminal-versus-desktop question resolved on evidence rather than taste.
- What did not work and why: the first repo-wide TUI keyword search returned mostly lockfiles and vendored third-party licences; narrowing to `crates/*/src` and READMEs produced the real hit. Broad dependency scans are noise in repos this size.
- What I would do differently: read `bot-lifecycle/activity-groups.ts` in the same pass, so the activity entry taxonomy is cited from its source rather than from the icon table.

## Recommended Next Focus
Frontier node F-1-005 (depth 1): how approvals work in OpenBot and the other repos, and the smallest small-team model of who can talk to, approve for and change a bot, compared with skilled bots' needs-you items and run records.
