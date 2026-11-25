# Terminal screen expansion: advice and operator decisions

Source: a fresh read-only Opus high advisory on 2026-11-25, after reading phase 003's docs, the parent spec, phases 010 and 011, both research syntheses and the UI sources in the context repos. Claims about the context repos cite file:line. The design-only rule holds: openhuman-tui is GPL-3.0, so we copy its design, never its code or text.

## Operator decisions (2026-11-25)

1. Phase 003 becomes a Level 3 phase parent with six nested children. Its plan, tasks, acceptance criteria and goal move into the children. The old docs are kept locally in `context/legacy-003/`.
2. Approved: free-text answers in the overlay when an item has no options (single-key shortcuts pause while typing, as `ask-card.js:265`). Approved: `[` and `]` as fallback tab keys beside Alt+1..4, and Ctrl+C closes an open overlay or quits and never writes. Approved: the new glyphs and an ASCII fallback set.
3. Not approved: `insta`. Snapshot tests assert the ratatui `TestBackend` buffer directly.
4. Screenshots: link the four existing images, and also build openhuman's `--demo` locally to capture its TUI into the gitignored `context/screenshots/`.

## Defects in 003 as written, to fix during the expansion

- `1` has two meanings: REQ-006 picks option 1, REQ-009 binds `1` to approve once. Digits pick options only inside an overlay.
- Alt+1..4 is unreliable on macOS (Terminal.app and iTerm send `¡™£¢` unless Option is Meta), and Ctrl+Tab (`app.rs:356-358`) is rarely delivered. Hence the `[` `]` fallback.
- Selection by row index is unsafe because the 5 s poll reorders rows. Select by item id.
- Blocking spawns freeze input: `bots status --json` took 0.18 to 0.34 s, so several sequential spawns on the loop thread freeze input about a second every 5 s. Use a worker thread.
- Bot text is drawn unsanitized. Strip control characters, as openhuman (`theme.rs:87-93`) and turnstone (`ui/colors.py:4-6`) do.
- An item with no options can only get y/n although `bots answer` takes free text (now approved). `?` marks scheduled, recurring and unknown alike (now separate glyphs). The banner should name the inbox tab key, not Ctrl+P.

## The six children

| Child | Scope | Exit |
| --- | --- | --- |
| 001-ux-and-component-map | ASCII mockups per state at 80x24 and 120x40, the key map, the glyph table, the component inventory, in a tracked `design/` folder in our own words with file:line pointers | Operator approves the key map, and every component lists its states |
| 002-architecture-and-contracts | Crate, terminal guard, worker data layer, `cli.rs`, the fixture, the `ui` verb, the CI job | CI green on an empty frame, the cli client test passes, both refusals proven |
| 003-shell-and-navigation | Header, tabs, footer generated from `keys.rs`, status row, palette and help, the too-small screen, Mono palette | Key-label test passes, plus shell buffer snapshots |
| 004-panes | Activity, inbox, routines, chat placeholder, each with loading, empty, error and stale states | One buffer snapshot per pane per state, and 2,000 rows drawn in under 16 ms |
| 005-answer-flow | Banner, decision and choice overlays, free-text entry, the in-flight lock, refusal display, closed input | The argv log matches exactly, Esc and closed input write nothing, the hand check passes |
| 006-hardening-and-proof | fmt, clippy, the GPL grep, README, validate | Every gate passes |

Skip as separate phases: accessibility, themes and the test harness (each child carries its part), mouse support, a theme picker, a demo binary and a bench flag.

## Architecture

- Modules: `lib`, `main`, `app` (the loop), `event`, `keys` (context, key, action, label), `state` (a pure reducer), `data` (the worker thread), `cli`, `model` (serde with defaults, an unknown state kept as `Unknown(raw)`), `view/{header,tabs,footer,panes,overlay}`, `theme`, `sanitize`, `terminal`.
- State: `update(state, msg) -> Vec<Effect>`, with effects `Fetch` and `Answer{id,text,scope}`, so the closed-input and Esc tests assert that no `Answer` effect is produced, with no process involved. Each surface is `Remote<T>{rows, last_ok_at, error, in_flight}`. Selection is `Option<ItemId>`.
- Loop: a crossterm reader thread polls every 100 ms (the openhuman pattern, `app.rs:113-120`), and a worker thread runs the CLI calls. Both feed one mpsc channel tagged with a generation number so stale results drop. Redraw only on change. No tokio.
- Refresh every 5 s, after a tab switch and after an answer: the inbox (it drives the banner), the visible tab and status, at most 3 spawns, never a second fetch for a surface already in flight. The child runs with stdin null and never with `--as`, because 001 refuses `--as` without a tty.
- Errors: the first stderr line goes to the status row, rows stay, and the header shows "stale 2m".
- Tests: reducer unit tests, key-label assertions generated from `keys.rs`, `TestBackend` buffer snapshots per state at both sizes, the fixture integration test and a panic-restore test.
- Take from openhuman as design: the RAII terminal guard with a chained panic hook (`terminal.rs:75-118`), the minimum-size screen (`render.rs:26-35`), the footer key line (`render.rs:99`), the banner above the input (`render.rs:221-229`), the overlay layout of list, detail, prompt, status and buttons (`render/overlay.rs:2-142`), System and Mono palettes (`theme.rs:61-82`), and `NO_COLOR` starting in Mono (README).
- Change from openhuman: no async, no hit testing, digits only inside overlays, Esc never denies.

## Components

| Component | Reads | Keys | States |
| --- | --- | --- | --- |
| Header | status (bot count, stale flag) | none | ok, stale, error |
| Tab bar | none | Alt+1..4, `[` `]` | active |
| Activity | activity groups in order (`activity-groups.ts:28-39`) | Up, Down, PgUp, PgDn | loading, empty, rows, error with rows kept |
| Inbox | inbox items | Up, Down, Enter | open, expired (dimmed, cannot answer), empty |
| Routines | the routines list (002 REQ-007) | Up, Down | rows, empty that says what a routine is |
| Chat | none | none | placeholder naming phase 010 |
| Banner | open item count | the inbox tab key | hidden, count |
| Decision overlay | item | y, n, Esc | idle, sending, refused, gone |
| Choice overlay | item options | 1 to n, n, Esc, free text when no options | same as above |
| Palette and help | `keys.rs` | Ctrl+P, `?`, type to filter, Enter | filtered list |
| Status row | last error | none | blank, message |
| Too-small screen | none | Ctrl+D | below 24x8 |

## UX rules

- Keys: Ctrl+D quits. Ctrl+C closes an open overlay, else quits, and never writes. Tabs Alt+1..4 and `[` `]`. Lists Up, Down, Enter. Ctrl+P and `?` open the palette, which is also help. Overlay: `y` approve once, `n` deny, `1` to `n` pick an option, Esc close. Every key is drawn on screen.
- Layout at 80x24: header, tabs, rule, body, banner, status, footer, with detail in the overlay. At 120 columns or wider the selected row's detail shows as a right column.
- Glyphs: `·` working, `✓` done, `✗` failed, `!` needs_you, `–` stopped, `○` scheduled, `↻` recurring, `?` unknown plus the raw value. ASCII fallback `* + x ! - o r ?`.
- Colour: System by default, Mono under `NO_COLOR`. Meaning is always in the glyph and label, never colour alone. Focus is a `›` mark plus reverse video.
- Approvals: the overlay captures the item id and, if the item is no longer open after a refresh, says so and disables keys (`inline-approval.tsx:78-80`). Keys lock after the first press until the result returns (`approval-card.js:140,186`). Expired items are visible but cannot be answered (`ApprovalCard.tsx:95,467`). Refusals show stderr in the status row (011 REQ-021). Deny is placed first (`approval-card.js:130`). An unbound key does nothing, never a default deny (unlike `cli.py:476-487`).

## Context folder

`context/` in this phase is gitignored (`.gitignore:417-421`) and holds symlinks to the exact sources: `openhuman-tui`, `turnstone-cli.py`, `turnstone-colors.py`, `openghost-ask-card.js`, `openghost-approval-card.js`, `openbot-activity-groups.ts`, `openbot-needs-you`, `openbot-approvals`, `openbot-routines`, `openmaus-ActivityPanel.tsx`, `openmaus-ApprovalCard.tsx`, `rakazo-routine-list.tsx`, and `screenshots/` (OpenMausBot approval card, expired card and routines, rakazo routines). No repository has a TUI screenshot; openhuman's `docs/demo.gif` shows the desktop app. Captures of openhuman's `--demo` go in `screenshots/` too. `legacy-003/` holds the pre-expansion docs.

## Risks

- No real JSON exists yet (001 and 002 are Draft, `bots activity` is unknown today), so the work is fixture-first.
- Answers can be refused (`item-answered-differently` from 006, `answer-not-approver` from 011).
- Context links dangle for anyone without the reference repos.
- The key changes amend REQ-004, REQ-006 and REQ-009, while goal decisions D4 and D5 still hold.
