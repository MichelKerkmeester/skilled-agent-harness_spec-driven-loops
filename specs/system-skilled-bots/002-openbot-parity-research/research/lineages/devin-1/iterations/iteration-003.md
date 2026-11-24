# Iteration 3: Frontier F-2-006 — a terminal front end for conversation, approvals, activity and routines

## Focus
Frontier node F-2-006 (depth 2, scope openhuman-main/crates/openhuman-tui, OpenBot-main/app/src/components/channels, OpenBot-main/app/src/components/approvals): How does a terminal or TUI present a conversation with a bot together with its approvals, activity and routine list, and which repo's terminal frontend is worth copying?

## Actions Taken
- Read openhuman-tui's renderer entry points, view functions and overlay handling.
- Read its command surface from the README.
- Read OpenBot's inline approval card, approval inbox row board and conversation question notice.
- Read OpenBot's routines page contract (one list, four-part sentences).
- Read skilled bots' status index and status row vocabulary.
- Checked turnstone's "console" to confirm it is not a terminal UI.

## Findings
1. openhuman-tui's main screen is exactly two regions: a chat transcript and a bottom-anchored composer. Everything else is a tab or overlay, not a second window. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:142-264]
2. Its secondary views are drawn as plain text rows and buttons in the same frame: `config` lists editable rows with a selected marker and a hint line, `settings` and `logs` follow the same pattern. A terminal UI does not need a widget toolkit beyond rows, a selection cursor and a detail pane. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/views.rs:2-56] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/views.rs:57-175]
3. Decisions are overlays with single-key answers. The plan-review overlay draws the summary and numbered steps and states its keys inline: "a approve · r reject · e request revision · Esc leaves pending". Pending approvals and plan review share one persistent attention control. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:14-27] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:94]
4. The TUI turns app surfaces into slash commands rather than screens: `/sessions`, `/permissions`, `/skills`, `/mcp`, `/artifacts`, `/diff`, `/review`, `/usage`, `/status`, `/settings`, `/config`. This is the concrete recipe for giving a CLI an approvals inbox and an activity feed without building pages. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:103-107]
5. OpenBot's approval is drawn inline in the conversation where the action would have happened, read from the same owner-scoped inbox as the Approvals page, so a decision made in either place is the one decision; after the decision the server runs the action exactly once and continues the conversation. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/inline-approval.tsx:20-27]
6. OpenBot's approval page is a row board with a per-row menu, and a conversation's waiting question is a questionnaire with progress and next/previous navigation. Both are list-plus-detail shapes that a terminal can reproduce with rows and keys. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/waiting.tsx:1-40] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/question-notice.tsx:37-60]
7. OpenBot's routines are one list, and every row is the same sentence in four parts: What it is, Starts, Does, Until. The page merges routines, goals and check-ins on read even though they are three server stores. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:3-28]
8. Skilled bots' status index is already the data source an activity or routine list needs: a derived SQLite file under the user-level state root, built only from run records and needs-you items, readable without opening a run folder, with run rows written once and never updated. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:3-14]
9. `bots status` joins three sources — status index rows, install records and `launchctl print` — and classifies each bot row through a fixed state order: retired, missing, unreadable, needs-reinstall, held, launchd-failed, run-folder-gone, unknown. That vocabulary can back an activity feed without inventing a new one. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:3-14] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:48-58]
10. The frontend worth copying is openhuman-tui. Turnstone's "console" is a web cluster dashboard that subscribes to node SSE streams and reverse-proxies node UIs, not a terminal frontend; OpenGhost and OpenMausBot are Electron apps whose UI code is not portable to a terminal. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/console.md:3-20]
11. Smallest change: one `bots chat` (or `bots tui`) command that renders three panes from files the runtime already writes — transcript from run records and the parked-run prompt, approvals from `bots inbox`, routines from the installed schedule records — plus one overlay for a needs-you answer. No daemon, no database beyond the status index, and no new state. [INFERENCE: based on findings 1-9]

## Ruled Out
- Building a web UI first. Every surface the question names is a list or a transcript, and the runtime already stores both; a browser adds a server and a session layer without adding information.
- Copying OpenGhost's hand-written drawing engine or OpenMausBot's Electron shell. Both are large UI codebases tied to a desktop runtime.
- Copying turnstone-console. It solves multi-node cluster visibility, a problem this team does not have.

## Dead Ends
- Searching openhuman-tui for a separate approvals screen: approvals are overlays and a status control, not a page. The overlay is the model to copy.
- Looking for a routine list in openhuman-tui: it has `/sessions` and `/skills` but no routine concept; OpenBot's four-part row is the better source.

## Edge Cases
- Ambiguous input: "terminal UI" could include a full-screen TUI or a line-oriented REPL. The evidence supports both: openhuman-tui is full-screen, while the slash-command surface works line-by-line.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/views.rs
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/inline-approval.tsx
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/waiting.tsx
- specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/question-notice.tsx
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md
- specs/system-skilled-bots/context/turnstone-main/docs/console.md
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts
- .skilled/skills/system-skilled-bots/runtime/lib/status.ts

## Assessment
- New information ratio: 0.95
- Questions addressed: F-2-006 (TUI shape for conversation, approvals, activity, routines)
- Questions answered: F-2-006

## Reflection
- What worked and why: reading the renderer's function list before its bodies showed the whole information architecture in one screenful — transcript, composer, three text views. The overlay file then supplied the decision interaction in twenty lines.
- What did not work and why: turnstone's "console" looked like a TUI by name and is a web dashboard; the first paragraph settled it. Names are not evidence.
- What I would do differently: read `app/commands.rs` next to the README's command list, to see which commands are pure local rendering and which call the core.

## Recommended Next Focus
Frontier node F-2-007 (depth 2): how conversations are persisted and fanned out so several bots can share one thread, and what the smallest activity record is that can be shown after the fact.
