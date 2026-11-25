# Iteration 11: Terminal versus desktop

## Focus
Terminal versus desktop: can a CLI or TUI give the OpenBot app experience (conversations, approvals inbox, activity feed, routine list), and what would a desktop shell add that a terminal cannot? The frontier is exhausted, so this iteration broadens to the run's first open question.

## Actions Taken
1. Searched all eight reference repos for a terminal UI library and for Tauri.
2. Read the `openhuman-tui` crate: its README, module doc, action enum, activity projection, tab set and overlay handling.
3. Read OpenBot's desktop ownership table and its install prerequisite.
4. Compared the two clients' surfaces against the four OpenBot app surfaces.

## Findings
1. openhuman ships a full terminal client as its own crate, `openhuman-tui`: "A conversation-first terminal frontend for OpenHuman, built with ratatui and crossterm", embedding the core in-process with no HTTP server or sidecar. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:3]
2. It covers login, saved conversations, model/agent selection, approvals, tools, child-run inspection and diagnostics, all through "the existing core contracts". [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:5]
3. Its module doc lists the same surfaces: "a ratatui-based conversation UI with mouse control, themes, and diagnostics, persistent thread resume, command/file pickers, approvals, plan review, agent/skill/MCP/artifact views, Git review, and a multiline composer". [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/lib.rs:3]
4. Chat in the TUI uses "the same `web_chat` surface the desktop app drives", so the terminal is not a lesser client. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/lib.rs:6]
5. It boots the core in-process — no HTTP, no sockets — through the `tui` host preset, and streams a live transcript in the terminal. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/lib.rs:9]
6. The terminal dependencies and UI code live entirely in that crate, keeping the shared core free of terminal-specific dependencies. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/lib.rs:15]
7. Approvals are an overlay with single-key decisions: a plan review overlay shows a summary plus numbered steps and the status line "a approve · r reject · e request revision · Esc leaves pending". [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:13]
8. Activity is a bounded projection with six statuses — running, done, failed, needs input, cancelled, stale — described as "Bounded, inspectable tool and child-run projections". [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:1]
9. The TUI has four tabs: Logs, Chat, Config and Settings. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/ui_state.rs:10]
10. Keyboard and pointer share one action enum and one hit test, so every control is reachable both ways. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/actions.rs:7]
11. The controls table covers commands (Ctrl+P or `/help`), send and steer (Enter), queue follow-up (Ctrl+Q), stop (Esc), scroll, jump to latest, expand tool or reasoning, and exit. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:40]
12. It needs a terminal of at least 80×24, and terminal support for modified Enter, mouse forwarding and native selection varies. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:35]
13. OpenBot's desktop app splits ownership three ways: the window owns screens and holds no credentials, the native side owns "Engine install, deployment layout, images, Compose, host processes, secrets, Stop and Quit", and the bundled Intelligence CLI owns its own topology, sign-in and license. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:165]
14. OpenBot's desktop install requires Docker Desktop or Podman Desktop first. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:17]
15. So the desktop shell's unique value is installing and supervising a container stack, not the chat surface: openhuman proves the same chat surface runs in a terminal. [INFERENCE: based on findings 4, 13 and 14]
16. A terminal can give all four OpenBot app surfaces: conversations (the Chat tab plus composer), approvals (the plan review overlay with a, r and e), activity (bounded projections with six statuses), and routines (a list, which the TUI lacks as a tab but which is a table). [INFERENCE: based on findings 3, 7, 8 and 9]
17. What a desktop shell adds that a terminal cannot is narrow: a bundled installer with SHA-256-checked children, a container supervisor, and OS-level secrets — none of which a CLI runtime that runs in-process needs. [INFERENCE: based on findings 5, 13 and 14]
18. The terminal verdict is therefore yes: a TUI matches the OpenBot app experience for a small team, and a desktop shell is only needed if the runtime ever ships as a container stack. [INFERENCE: based on findings 15 through 17]

## Ruled Out
- Building a Tauri shell first. OpenBot's native side exists to install and supervise Compose, and a runtime that boots in-process has nothing to install or supervise.
- Treating the terminal as a reduced client. openhuman's TUI drives the same `web_chat` surface as its desktop app, so the surface is shared rather than reimplemented.
- A web UI served from the CLI. The TUI needs no HTTP server or sidecar, and a served UI would add a port, a session and a browser to a tool that already runs in the terminal.
- Copying openhuman's four tabs as-is. Logs, Chat, Config and Settings are its own split; the OpenBot surfaces are conversations, approvals, activity and routines.

## Dead Ends
- Searching the other seven repos for a terminal UI. Only openhuman ships one; OpenBot, buzz and openhuman's own app are Tauri, and OpenGhost and hermes-muse are desktop shells.

## Edge Cases
- Ambiguous input: the frontier is exhausted, so the focus came from the run's first open question rather than a node. Recorded here rather than inferred silently.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:1-60
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/lib.rs:1-40
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/actions.rs:1-30
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:1-25
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/ui_state.rs:10-35
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:1-30
- specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:160-175
- specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:17

## Assessment
- New information ratio: 0.89
- Questions addressed: Can a CLI or TUI give the OpenBot app experience, and what would a desktop shell add that a terminal cannot?
- Questions answered: Can a CLI or TUI give the OpenBot app experience, and what would a desktop shell add that a terminal cannot?

## Reflection
- What worked and why: searching for a TUI library across all eight repos before reading any of them. One grep found `openhuman-tui`, which is the only terminal client in the set and settles the verdict with its own README rather than with an argument.
- What did not work and why: expecting OpenBot's desktop to be a chat client. Its ownership table shows the native side is an engine installer and container supervisor, so the desktop's value is in the stack it manages, not the screens it draws.
- What I would do differently: read the desktop ownership table before the TUI. Knowing the desktop's job is Compose supervision makes the terminal question narrow immediately: the only thing to check is whether a terminal can draw the four surfaces, and openhuman already answers that.

## Recommended Next Focus
The small-team model: who can talk to, approve for and change a bot, whether memory is shared or per-person, and the smallest sign-in and roles model that works for a few people on one machine or a shared host.
