---
title: "Acceptance Criteria: Phase 3: terminal-screen"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "terminal screen acceptance criteria"
  - "bots ui acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: terminal-screen

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/003-terminal-screen
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `BOTS_UI_BIN` naming a stub binary, When `node .skilled/bin/bots.cjs ui --repo .` runs, Then the stub starts with `--repo . --skilled-tree <root>` and the CLI exits with the stub's code; with `BOTS_UI_BIN` unset and a `--skilled-tree` holding `crates/bots-tui` but no binary it refuses `ui-not-built`, prints the build command and exits 4; with `BOTS_UI_BIN` unset and a `--skilled-tree` holding no `crates/bots-tui` it refuses `ui-unavailable` and exits 4 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts` prints one passing test per case: the stub records its argv and exits 7, so the CLI's status is 7, and both refusals run against a temp `--skilled-tree`, so no file is moved and no tty is needed | Unmet | - |
| AC-002 | REQ-002 | Given the crate, When its manifest and sources are read, Then the manifest declares MIT and no source file carries openhuman code | `rg -n '^license' crates/bots-tui/Cargo.toml` prints `license = "MIT"`, and `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines | Unmet | - |
| AC-003 | REQ-003 | Given the binary running, When it refreshes, Then every read is one `bots ... --json` call through a client that takes the program and its arguments, defaulting to `node <skilled-tree>/.skilled/bin/bots.cjs`, and no state file is opened | `rg -n 'Command::new' crates/bots-tui/src` prints only `cli.rs`, `rg -n 'bots\.cjs' crates/bots-tui/src/cli.rs` prints the default program, and `rg -n 'read_to_string\|File::open\|fs::read' crates/bots-tui/src` prints nothing outside `#[cfg(test)]` blocks | Unmet | - |
| AC-004 | REQ-004 | Given the screen open, When Alt+2 is pressed, Then the inbox tab is active; Ctrl+P opens the palette and Ctrl+D exits | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` prints `test result: ok` and names `alt_2_selects_inbox`, `ctrl_p_opens_palette` and `ctrl_d_exits` | Unmet | - |
| AC-005 | REQ-005 | Given `bots activity --json` returns a done row, When the activity pane draws, Then the row carries `✓` and the label `done`; given a `scheduled` row and a `recurring` row, each carries `?` and its own label | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` asserts `✓` and `done` for a done row, and `?` with `scheduled` and with `recurring` for those two rows | Unmet | - |
| AC-006 | REQ-006 | Given an item whose options are `["ship it", "hold"]`, When `2` is pressed, Then `bots answer <id> hold --scope once` runs; When `n` is pressed, Then `bots answer <id> deny --scope deny` runs | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test cli_client` asserts the recorded argv is `answer <id> hold --scope once` and `answer <id> deny --scope deny`, with the client pointed at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")` | Unmet | - |
| AC-007 | REQ-007 | Given `bots routines --json` returns one routine, When the routines pane draws, Then the bot id, the four-part sentence and the state appear | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` asserts the bot id, the sentence and the state string in the buffer | Unmet | - |
| AC-008 | REQ-008 | Given one open item, When the frame draws, Then the banner row above the input reads `! 1 pending approval · Ctrl+P → inbox`; with no open item the row is blank | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` asserts that exact string with one item and an empty row with none | Unmet | - |
| AC-009 | REQ-009 | Given an item selected, When Enter is pressed, Then the overlay draws `1 approve once`, `n deny` and `Esc close` and no `always` label; When Esc is pressed, Then the overlay closes and the item stays open | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` asserts the three labels and no `always`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib esc` prints `test result: ok` and names `esc_closes_overlay_and_writes_nothing`, which feeds the loop an Esc event with the overlay open, asserts the overlay closed, and asserts the fixture recorded no `answer` argv, so no tty is needed | Unmet | - |
| AC-010 | REQ-010 | Given any frame, When it is drawn, Then every label the key table binds appears in the buffer | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and iterates the key table rather than a hand-written list | Unmet | - |
| AC-011 | REQ-011 | Given an item selected, When the input closes, Then nothing is written, the binary exits 0 and the item stays open | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`: the test drives the loop with a closed-input event and an item selected, asserts the loop returns 0, and asserts the fixture recorded no `answer` argv, with the client pointed at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, so no tty is needed | Unmet | - |
| AC-012 | REQ-012 | Given `bots status --json` exits 1 with stderr, When the refresh runs, Then the status row shows that stderr and the previous rows stay | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test cli_client` asserts the error carries the stderr text and the state keeps its rows, with the client pointed at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")` | Unmet | - |
| AC-013 | REQ-013 | Given the screen idle, When five seconds pass, Then each surface is re-read once, and a tab switch re-reads at once | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib app` asserts the poll interval is five seconds and one tick issues four reads | Unmet | - |
| AC-014 | REQ-014 | Given a status value the table does not name, When the row draws, Then it carries `?` and the raw value beside it | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib activity` asserts `?` and the raw value for `some-new-state` | Unmet | - |
| AC-015 | REQ-015 | Given the binary exits or panics, When the process ends, Then raw mode is off, the alternate screen is left and the cursor is shown | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib restore` prints `test result: ok` and names `restore_runs_on_exit` and `restore_runs_on_panic`, which assert the guard ran on each path | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

The crate does not exist yet, so AC-001 is unmet and every later criterion depends on it. Nothing is waived, so no decision record carries a closure ADR.
<!-- /ANCHOR:closure -->
