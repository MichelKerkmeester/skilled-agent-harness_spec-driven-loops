# Iteration 12: Terminal versus desktop — what a TUI can match and what Tauri adds

## Focus

Terminal versus desktop: whether a CLI or TUI can give the OpenBot app experience (conversations, approvals inbox, activity feed, routine list), which repos ship a terminal UI or desktop shell worth copying, and what a Tauri desktop shell adds that a terminal cannot.

## Actions Taken

1. Read OpenBot's desktop install document for what the desktop app is and does.
2. Read the desktop update document for the updater, tray and upgrade path.
3. Read the Tauri configuration and Cargo dependencies.
4. Re-read the terminal references from Turnstone and openhuman.
5. Mapped the four app surfaces onto the data sources established in iteration 8.

## Findings

1. OpenBot Desktop installs and runs OpenBot for one person on one computer with no terminal, no developer tools and no container engine of the person's own; it is standalone, has no organization sign-in and installs the default Bot. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:1-10]
2. Desktop can also connect to an OpenBot running elsewhere and show it in the app window, signing in with OAuth 2.1 authorization code plus PKCE and keeping the refresh token in the operating system's credential store. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:10-25]
3. Desktop updates itself with a signed updater: a bar or tray item offers the update, the feed is read at launch and every six hours, release images are downloaded in the background, and an upgrade takes a database dump and restores it if a step fails. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-updates.md:1-20]
4. The Tauri shell is one resizable 1000x800 window with tray-icon, image-png, deep-link, shell and single-instance plugins, bundled as dmg, nsis, appimage, deb and rpm. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1-30] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/Cargo.toml:20-40]
5. The terminal can render the four app surfaces from data that already exists: a conversation pane over the new conversation file, an approvals pane over `bots inbox`, an activity pane over the status index, and a routine list over BOT.md triggers and schedule state. [INFERENCE: based on iteration 8 findings and .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:1-14]
6. The closest liftable terminal reference is Turnstone's CLI, an Apache-2.0 `TerminalUI` with readline, a session protocol and workstreams; openhuman-tui is a richer conversation-first ratatui frontend but is GPL-3.0 and therefore a design reference only. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1-40] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:1-10] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2]
7. A desktop shell adds things a terminal cannot match: an embedded browser for the Bot's computer and its handover, tray and OS notifications, a global hotkey and deep links, the OS credential store, native file dialogs, and a signed self-updater that installs and upgrades the stack. A terminal can approximate notifications and render text, but not the embedded browser or the no-terminal install. [INFERENCE: based on findings 1-4]
8. The recommended path is terminal first: a TUI with four panes over existing stores (size L), deferring a desktop shell (size XL) until the browser view, tray notifications or a no-terminal install become must-haves; the desktop shell also adds a packaging, updater and container-engine surface that a small team must maintain. [INFERENCE: based on findings 1-7]

## Ruled Out

- Building a desktop shell first: the four app surfaces are data views a TUI can render, and the desktop's extra value is delivery and browser embedding rather than missing primitives.
- Copying OpenBot's Tauri app: it is a full installer/updater/engine manager, far larger than a small team's terminal-first scope.
- Lifting openhuman-tui code: GPL-3.0 makes it a design reference only.

## Dead Ends

- Looking for a terminal UI in OpenBot found none; its app is web and its desktop shell is Tauri, so the terminal reference has to come from another repo.
- Treating OS notifications as desktop-only would overstate the gap: a terminal can emit them, but it cannot show a tray or an embedded browser.

## Edge Cases

- Ambiguous input: none. The terminal-versus-desktop question names the four surfaces and the Tauri shell.
- Contradictory evidence: none. The desktop install and update documents describe one product at two layers without conflicting.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:1-25
- specs/system-skilled-bots/context/OpenBot-main/docs/desktop-updates.md:1-20
- specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1-30
- specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/Cargo.toml:20-40
- specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1-40
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:1-10
- specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:1-14

## Assessment

- New information ratio: 0.9
- Questions addressed: terminal versus desktop (topic question 1)
- Questions answered: none tracked as a frontier question; this iteration broadens beyond the dealt frontier

## Reflection

- What worked and why: Reading the desktop install and update documents showed that most of the desktop's extra value is delivery and browser embedding, so the recommendation separates the information model from the shell.
- What did not work and why: Looking for a terminal UI in OpenBot found none, so the reference had to come from Turnstone and openhuman.
- What I would do differently: Read the Tauri config before the install document, so the shell's feature set is concrete before its product role is described.

## Recommended Next Focus

The final gap matrix: consolidate the eight parts, the terminal-versus-desktop answer, the skip list and the reuse list into a ranked build order a first build packet can start from, and name the smallest change, size and risk for each part.
