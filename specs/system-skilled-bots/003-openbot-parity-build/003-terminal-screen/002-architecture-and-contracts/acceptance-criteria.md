---
title: "Acceptance Criteria: Phase 2: architecture-and-contracts"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "architecture and contracts acceptance criteria"
  - "bots-tui crate acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts"
    last_updated_at: "2026-11-25T23:40:00Z"
    last_updated_by: "review-fix-pass"
    recent_action: "Added AC-016 and widened four criteria"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-003-002-architecture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: architecture-and-contracts

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every Verification cell is a command that runs without a tty. The loop takes its events from a source the caller supplies, so a closed input and an Esc are lib tests rather than keystrokes, and the guard's restore is driven through `catch_unwind` rather than a real terminal.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `BOTS_UI_BIN` naming a stub binary, When `node .skilled/bin/bots.cjs ui --repo .` runs, Then the stub starts with `--repo . --skilled-tree <root>` and the CLI exits with the stub's code; with `NO_COLOR` set the stub's argv also carries `--mono`, and with `--ascii` on the verb it carries `--ascii`; with `BOTS_UI_BIN` unset and a `--skilled-tree` holding `crates/bots-tui` but no binary it refuses `ui-not-built`, prints the build command and exits 4; with `BOTS_UI_BIN` unset and a `--skilled-tree` holding no `crates/bots-tui` it refuses `ui-unavailable` and exits 4 | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts` prints one passing test per case: the stub records its argv and exits 7, so the CLI's status is 7, the `NO_COLOR` case asserts `--mono` in that argv, the `--ascii` case asserts `--ascii`, and both refusals run against a temp `--skilled-tree`, so no file is moved and no tty is needed | Unmet | - |
| AC-002 | REQ-002 | Given the crate, When its manifest and sources are read, Then the manifest declares MIT and no source file carries openhuman code | `rg -n '^license' crates/bots-tui/Cargo.toml` prints `license = "MIT"`, `rg -n 'openhuman' crates/bots-tui/src` prints only comment lines, and `rg -n 'GNU GENERAL PUBLIC LICENSE' crates/bots-tui/src crates/bots-tui/Cargo.toml crates/bots-tui/Cargo.lock` prints nothing, so the licence-header grep covers the code and the manifest rather than `design/`, which names the reference and its licence on purpose | Unmet | - |
| AC-003 | REQ-003 | Given the binary running, When it refreshes, Then every read is one `bots ... --json` call through a client that takes the program and its arguments, defaulting to `node <skilled-tree>/.skilled/bin/bots.cjs`, and no state file is opened | `rg -n 'Command::new' crates/bots-tui/src` prints only `cli.rs`, `rg -n 'bots\.cjs' crates/bots-tui/src/cli.rs` prints the default program, and `rg -n 'read_to_string\|File::open\|fs::read' crates/bots-tui/src` prints nothing outside `#[cfg(test)]` blocks | Unmet | - |
| AC-004 | REQ-004 | Given the crate, When it is built and its library tested, Then the release build writes `bots-ui` and the library target compiles | `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` exits 0, `ls crates/bots-tui/target/release/bots-ui` prints the path, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib` exits 0 | Unmet | - |
| AC-005 | REQ-005 | Given the binary exits, panics or is killed, When the process ends, Then raw mode is off, the alternate screen is left and the cursor is shown | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib terminal` prints `test result: ok` and names `restore_runs_on_exit`, `restore_runs_on_panic` and `restore_runs_on_signal`, which assert the guard ran on each path; the signal test raises `SIGTERM` through the installed handler rather than killing the test process | Unmet | - |
| AC-006 | REQ-006 | Given a refresh in flight, When a second refresh is issued, Then the loop thread spawns no process and a result from the older generation is dropped | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib data` prints `test result: ok` and names `stale_generation_is_dropped` and `loop_thread_spawns_nothing` | Unmet | - |
| AC-007 | REQ-007 | Given a source the caller supplies, When it yields a key, a resize or a closed input, Then the loop consumes each without a terminal and returns 0 on the closed input | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib event` prints `test result: ok` and names `closed_input_is_one_event`, and `--lib app` names `closed_input_writes_nothing` | Unmet | - |
| AC-008 | REQ-008 | Given the fixture, When each verb is called, Then it answers the documented payload, its `status --json` carries `lastRun.branch` and `lastRun.worktreePath`, and it records its argv | `bash crates/bots-tui/tests/fixtures/bots status --json \| jq -e '.rows'` exits 0, the same call with `jq -e '.rows[0].lastRun \| has("branch") and has("worktreePath")'` exits 0, `activity --json \| jq -e '.groups'` exits 0, `inbox --json \| jq -e '.items'` exits 0, `routines --json \| jq -e 'type == "array"'` exits 0, and `git ls-files -s crates/bots-tui/tests/fixtures/bots` prints `100755` | Unmet | - |
| AC-009 | REQ-009 | Given the workflow, When it is read, Then it carries two `bots-tui` path entries and one job that installs a pinned toolchain with `clippy` and `rustfmt` and runs fmt, clippy and test | `rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml` prints one line and `rg -c -e "- 'crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml` prints 2, `rg -n 'dtolnay/rust-toolchain@1.92.0' .github/workflows/bots-runtime.yml` prints the toolchain step, `rg -n 'dtolnay/rust-toolchain@stable' .github/workflows/bots-runtime.yml` prints nothing, and `rg -n 'cargo fmt --check\|cargo clippy\|cargo test' .github/workflows/bots-runtime.yml` prints the three steps | Unmet | - |
| AC-010 | REQ-010 | Given a payload with a missing optional key and a state value the mapping does not name, When it is parsed, Then the missing key takes its default and the unknown state is kept as `Unknown(raw)` rather than dropped | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib model` prints `test result: ok` and names `missing_key_takes_default` and `unknown_state_keeps_raw` | Unmet | - |
| AC-011 | REQ-011 | Given an item selected, When the input closes, Then nothing is written, the binary exits 0 and the item stays open | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`: the test drives the loop with a closed-input event and an item selected, asserts the loop returns 0, and asserts the fixture recorded no `answer` argv, with the client pointed at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, so no tty is needed | Unmet | - |
| AC-012 | REQ-012 | Given a state and a message, When the reducer runs, Then it returns the next state and its effects, an Esc produces no `Answer` effect, and the selection is an item id rather than a row index | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib state` prints `test result: ok` and names `esc_produces_no_answer_effect` and `selection_is_an_item_id` | Unmet | - |
| AC-013 | REQ-013 | Given the screen idle, When five seconds pass, Then at most three reads are issued, the inbox is read first, and a surface already in flight is not fetched again | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib state` prints `test result: ok` and names `refresh_issues_at_most_three_fetches` and `in_flight_surface_is_not_fetched_twice` | Unmet | - |
| AC-014 | REQ-014 | Given `bots status --json` exits 1 with stderr, When the refresh runs, Then the status row shows the first stderr line and the previous rows stay | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test cli_client` prints `test result: ok` and names `non_zero_exit_carries_stderr`, and `--lib state` names `failed_fetch_keeps_rows`, with the client pointed at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")` | Unmet | - |
| AC-015 | REQ-015 | Given any read or write, When `cli.rs` spawns the child, Then the child's stdin is null and its argv carries no `--as` | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib cli` prints `test result: ok` and names `child_stdin_is_null` and `argv_never_carries_as`, and `rg -n '\-\-as' crates/bots-tui/src` prints nothing outside `#[cfg(test)]` blocks | Unmet | - |
| AC-016 | REQ-016 | Given the crate, When its `design/` folder is read, Then it holds 001's four documents unchanged | `ls crates/bots-tui/design` prints `component-inventory.md`, `glyph-table.md`, `key-map.md` and `mockups.md`, and `diff -r specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design crates/bots-tui/design` prints nothing, so a later edit to one of the four is made in 001's copy and copied again | Unmet | - |

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

The crate does not exist yet, so AC-004 is unmet and every later criterion depends on it. Nothing is waived, so no decision record carries a closure ADR. The handoff to 003-shell-and-navigation needs AC-001, AC-004 and AC-008 met, because those three are the crate, the verb and the fixture the next child draws into. AC-016 is 006's input rather than 003's: its pointer check reads the copied folder, so a missing copy fails that gate rather than this handoff.
<!-- /ANCHOR:closure -->
