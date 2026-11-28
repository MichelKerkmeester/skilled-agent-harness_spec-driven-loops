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
    last_updated_at: "2026-11-25T23:44:25Z"
    last_updated_by: "review-fix-pass-3"
    recent_action: "Applied the third review findings that edit this child"
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
| AC-001 | REQ-001 | Given `BOTS_UI_BIN` naming a stub binary, When `node .skilled/bin/bots.cjs ui --repo .` runs, Then the stub starts with an absolute `--repo` naming the resolved checkout root and `--skilled-tree <root>`, and the CLI exits with the stub's code. With `NO_COLOR` set the stub's argv also carries `--mono`, and with `--ascii` on the verb it carries `--ascii`. With `BOTS_UI_BIN` unset and a `--skilled-tree` holding `.skilled/crates/bots-tui` but no binary it refuses `ui-not-built`, prints the build command and exits 4. With `BOTS_UI_BIN` unset and a `--skilled-tree` holding no `.skilled/crates/bots-tui` it refuses `ui-unavailable` and exits 4. With a stub whose `--version` prints another contract number it refuses `ui-contract-mismatch` and exits 4. With an unknown option it exits 2 and prints the usage text | AC-001 block prints `Tests  8 passed` and no `failed`, one test per case: the stub answers `--version` with the verb's own contract number, then records its argv and exits 7, so the CLI's status is 7, the `NO_COLOR` case asserts `--mono` in that argv, the `--ascii` case asserts `--ascii`, the mismatch case asserts the refusal line and exit 4, the unknown-option case asserts exit 2 and the two `--skilled-tree` refusals run against a temp `--skilled-tree`, so no file is moved and no tty is needed Observed 2026-11-27: the block printed `Tests  8 passed (8)` and no `failed`, and the whole-file run printed `Tests  8 passed (8)` | Met | - |
| AC-002 | REQ-002 | Given the crate, When its manifest and sources are read, Then the manifest declares MIT and no source file carries openhuman code | `rg -n '^license' .skilled/crates/bots-tui/Cargo.toml` prints `license = "MIT"`, `rg -n 'openhuman' .skilled/crates/bots-tui/src` prints only comment lines, and `rg -n 'GNU GENERAL PUBLIC LICENSE' .skilled/crates/bots-tui/src .skilled/crates/bots-tui/Cargo.toml .skilled/crates/bots-tui/Cargo.lock` prints nothing, so the licence-header grep covers the code and the manifest rather than `design/`, which names the reference and its licence on purpose Observed 2026-11-27: `license = "MIT"` at Cargo.toml:6, the openhuman grep exited 1 with no match and the GPL grep exited 1 with no match | Met | - |
| AC-003 | REQ-003 | Given the binary running, When it refreshes, Then every read is one `bots ... --json` call through a client that takes the program and its arguments, defaulting to `node <skilled-tree>/.skilled/bin/bots.cjs`, and no state file is opened | AC-003 block prints only `cli.rs` for the first command, the default program for the second and nothing outside `#[cfg(test)]` blocks for the third Observed 2026-11-27: `Command::new` only at `src/cli.rs:95`, the default program at `src/cli.rs:37`, and the four file reads sit inside the test modules of `cli.rs`, `app.rs` and `data.rs` | Met | - |
| AC-004 | REQ-004 | Given the crate, When it is built and its library tested, Then the release build writes `bots-ui` and the library target compiles | `cargo build --release --manifest-path .skilled/crates/bots-tui/Cargo.toml` exits 0, `ls .skilled/crates/bots-tui/target/release/bots-ui` prints the path, and `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib` exits 0 Observed 2026-11-27: the release build printed `Finished`, `ls` printed `.skilled/crates/bots-tui/target/release/bots-ui` and `--lib` printed `test result: ok. 57 passed` | Met | - |
| AC-005 | REQ-005 | Given the binary exits, panics or is killed, When the process ends, Then raw mode is off, the alternate screen is left, bracketed paste is off and the cursor is shown | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib terminal` prints `test result: ok` and names `restore_runs_on_exit`, `restore_runs_on_panic` and `signal_becomes_terminate_event`, which assert the guard ran on each path and turned bracketed paste off. The signal test raises `SIGTERM` through the installed handler, asserts the flag became a `Terminate` message and asserts the loop returns 128 plus the signal, rather than killing the test process Observed 2026-11-27: `--lib terminal` printed `test result: ok. 5 passed` naming `restore_runs_on_exit`, `restore_runs_on_panic` and `signal_becomes_terminate_event`, which asserts the loop returns 143 | Met | - |
| AC-006 | REQ-006 | Given a refresh in flight, When a second refresh is issued, Then the loop thread spawns no process, an answer jumps queued reads and a child past its timeout is killed | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib data` prints `test result: ok` and names `answer_jumps_queued_reads`, `child_past_timeout_is_killed` and `loop_thread_spawns_nothing` Observed 2026-11-27: `--lib data` printed `test result: ok. 4 passed` naming `answer_jumps_queued_reads`, `child_past_timeout_is_killed` and `loop_thread_spawns_nothing` | Met | - |
| AC-007 | REQ-007 | Given a source the caller supplies, When it yields a key, a resize or a closed input, Then the loop consumes each without a terminal and returns 0 on the closed input | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib event` prints `test result: ok` and names `closed_input_is_one_event`, and `--lib app` names `closed_input_writes_nothing` Observed 2026-11-27: `--lib event` passed `closed_input_is_one_event` and `--lib app` passed `closed_input_writes_nothing` | Met | - |
| AC-008 | REQ-008 | Given the fixture, When each verb is called, Then it prints the payload file for its verb, every payload carries `version` 1, its `status --json` carries `lastRun.branch` and `lastRun.worktreePath`, and it takes `--fixture-log` and `--fixture-scenario` as leading arguments | AC-008 block exits 0 on every `jq` check and prints `100755` Observed 2026-11-27: all six `jq` checks exited 0 and `git ls-files -s` printed `100755` | Met | - |
| AC-009 | REQ-009 | Given the workflow, When it is read, Then it carries two `bots-tui` path entries and two packet design path entries, and one job that installs a commit-pinned toolchain with `clippy` and `rustfmt`, runs fmt with no `--locked` and clippy and test with it, builds the release profile, runs the design `diff` checks SC-006 names and names its runner, cache and timeout | AC-009 block prints one job line, then `2`, then `2`, the toolchain step, nothing, the three steps, the cargo steps, the release build, `3` and at least `2` Observed 2026-11-27: the block printed one job line at 128, `2`, `2`, the toolchain line, nothing with exit 1, the three cargo steps, the `--locked` lines, the release build, `3` and `4` | Met | - |
| AC-010 | REQ-010 | Given a payload with a missing optional key and a state value the mapping does not name, When it is parsed, Then the missing key takes its default and the unknown state is kept as `Unknown(raw)` rather than dropped | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib model` prints `test result: ok` and names `missing_key_takes_default` and `unknown_state_keeps_raw` Observed 2026-11-27: `--lib model` printed `test result: ok. 6 passed` naming `missing_key_takes_default` and `unknown_state_keeps_raw` | Met | - |
| AC-011 | REQ-011 | Given an item selected, When the input closes, Then nothing is written, the binary exits 0 and the item stays open | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`: the test drives the loop with a closed-input event and an item selected, asserts the loop returns 0, and asserts the fixture recorded no `answer` argv, with the client pointed at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")`, so no tty is needed Observed 2026-11-27: `--lib closed_input` printed `test result: ok. 2 passed` naming `closed_input_writes_nothing`, which asserts exit 0, the reads in the log and no `answer` line | Met | - |
| AC-012 | REQ-012 | Given a state and a message, When the reducer runs, Then it returns the next state and its effects, an Esc produces no `Answer` effect, and each pane's selection is its row key rather than a row index | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib state` prints `test result: ok` and names `esc_produces_no_answer_effect`, `selection_is_a_row_key_per_pane` and `stale_generation_is_dropped` Observed 2026-11-27: `--lib state` passed 11 tests naming `esc_produces_no_answer_effect`, `selection_is_a_row_key_per_pane` and `stale_generation_is_dropped` | Met | - |
| AC-013 | REQ-013 | Given the screen idle, When five seconds pass, Then at most three reads are issued, the inbox is read first, and a surface already in flight is not fetched again | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib state` prints `test result: ok` and names `refresh_issues_at_most_three_fetches` and `in_flight_surface_is_not_fetched_twice` Observed 2026-11-27: `--lib state` passed `refresh_issues_at_most_three_fetches` and `in_flight_surface_is_not_fetched_twice` | Met | - |
| AC-014 | REQ-014 | Given `bots status --json` exits 1 with stderr, When the refresh runs, Then the status row shows the first stderr line and the previous rows stay | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test cli_client` prints `test result: ok` and names `non_zero_exit_carries_stderr`, and `--lib state` names `failed_fetch_keeps_rows`, with the client pointed at `bash` plus `concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots")` Observed 2026-11-27: `--test cli_client` printed `test result: ok. 8 passed` naming `non_zero_exit_carries_stderr`, and `--lib state` passed `failed_fetch_keeps_rows` | Met | - |
| AC-015 | REQ-015 | Given any read or write, When `cli.rs` spawns the child, Then the child's stdin is null and its argv carries no `--as` | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib cli` prints `test result: ok` and names `child_stdin_is_null` and `argv_never_carries_as`, and `rg -n -e '--as\b' .skilled/crates/bots-tui/src` prints nothing outside `#[cfg(test)]` blocks. The check is word-bounded because the `--ascii` flag REQ-001 requires starts with `--as`, so the earlier pattern `'\-\-as'` matched it (amended 2026-11-27 by the build orchestrator). Observed 2026-11-27: `--lib cli` printed `test result: ok. 12 passed` naming `child_stdin_is_null` and `argv_never_carries_as`, and the word-bounded grep printed only `src/cli.rs:521`, `:525` and `:627`, all inside the `mod tests` block that opens at `src/cli.rs:453` | Met | - |
| AC-016 | REQ-016 | Given the crate, When its `design/` folder is read, Then it holds 001's four documents plus this child's `architecture.md` and `contracts.md`, all unchanged | `ls .skilled/crates/bots-tui/design` prints `architecture.md`, `component-inventory.md`, `contracts.md`, `glyph-table.md`, `key-map.md` and `mockups.md`, `diff -r -x architecture.md -x contracts.md specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design .skilled/crates/bots-tui/design` prints nothing, and `diff` of each of `architecture.md` and `contracts.md` against `002-architecture-and-contracts/design/` prints nothing, so a later edit to one of the six is made in the packet's copy and copied again, and `diff` of each of the four canonical payload files in `002-architecture-and-contracts/design/payloads/` against `.skilled/crates/bots-tui/tests/fixtures/payloads/` prints nothing, because the payload files are copied into the fixtures folder and not into `.skilled/crates/bots-tui/design/` Observed 2026-11-27: `ls` printed the six names, and the `diff -r`, the two per-file diffs and the four payload diffs each printed nothing with exit 0 | Met | - |
| AC-017 | REQ-017 | Given the crate, When its `tests/common/` helpers are read, Then the frame loader reads a frame from `design/mockups.md` by its heading and its size, and the fixture helper builds a `Program` with a temp log and a scenario | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test cli_client` prints `test result: ok` and names `frame_loader_reads_frame_1`, and `rg -n 'fixture-log' .skilled/crates/bots-tui/tests/common/fixture.rs` prints the argument the helper passes Observed 2026-11-27: `--test cli_client` passed `frame_loader_reads_frame_1`, and the grep printed `tests/common/fixture.rs:38` | Met | - |
| AC-018 | REQ-013 | Given an answer that exits 0, When the reducer handles `Answered`, Then it returns no `Fetch` effect, the row keeps its outcome word, and a read issued before the answer does not clear it | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --lib state` prints `test result: ok` and names `answered_issues_no_fetch` and `outcome_word_survives_an_older_read` Observed 2026-11-27: `--lib state` passed `answered_issues_no_fetch` and `outcome_word_survives_an_older_read` | Met | - |

### The commands

**AC-001**: the verb passes an absolute `--repo`, passes the binary's exit code through and refuses before dispatch.

```bash
(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-ui.vitest.ts -t "^bots ui ")
```

**AC-003**: the only module that spawns a process is `cli.rs`, and no state file is opened.

```bash
rg -n 'Command::new' .skilled/crates/bots-tui/src
rg -n 'bots\.cjs' .skilled/crates/bots-tui/src/cli.rs
rg -n 'read_to_string|File::open|fs::read' .skilled/crates/bots-tui/src
```

**AC-008**: the fixture prints the payload file for its verb, every payload carries `version` 1 and it takes its log and its scenario as leading arguments.

```bash
bash .skilled/crates/bots-tui/tests/fixtures/bots status --json | jq -e '.version == 1 and .rows'
bash .skilled/crates/bots-tui/tests/fixtures/bots status --json | jq -e '.rows[0].lastRun | has("branch") and has("worktreePath")'
bash .skilled/crates/bots-tui/tests/fixtures/bots activity --json | jq -e '.version == 1 and .groups'
bash .skilled/crates/bots-tui/tests/fixtures/bots inbox --json | jq -e '.version == 1 and .items'
bash .skilled/crates/bots-tui/tests/fixtures/bots routines --json | jq -e '.version == 1 and (.routines | type == "array")'
bash .skilled/crates/bots-tui/tests/fixtures/bots --fixture-log "$(mktemp)" --fixture-scenario empty status --json | jq -e '.rows | length == 0'
git ls-files -s .skilled/crates/bots-tui/tests/fixtures/bots
```

**AC-009**: the workflow carries the job, the pinned toolchain and the locked cargo steps.

```bash
rg -n '^  bots-tui:' .github/workflows/bots-runtime.yml
rg -c -e "- '.skilled/crates/bots-tui/\*\*'" .github/workflows/bots-runtime.yml
rg -c -e "- 'specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/00[12]-[a-z-]*/design/\*\*'" .github/workflows/bots-runtime.yml
rg -n 'dtolnay/rust-toolchain' .github/workflows/bots-runtime.yml
awk '/^  bots-tui:/,0' .github/workflows/bots-runtime.yml | rg -c 'uses: [^ ]+@v[0-9]'
rg -n 'cargo fmt --check|cargo clippy|cargo test' .github/workflows/bots-runtime.yml
rg -n -e '--locked' .github/workflows/bots-runtime.yml
rg -n 'cargo build --release' .github/workflows/bots-runtime.yml
awk '/^  bots-tui:/,0' .github/workflows/bots-runtime.yml | rg -c 'runs-on|timeout-minutes|actions/cache'
awk '/^  bots-tui:/,0' .github/workflows/bots-runtime.yml | rg -c 'diff '
```

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

**Closeable:** Yes

Every row is Met with the evidence observed on 2026-11-27. Nothing is waived, so no decision record carries a closure ADR. The handoff to 003-shell-and-navigation needs AC-001, AC-004, AC-008 and AC-017 met, because those four are the crate, the verb, the fixture and the frame loader the next child draws into. AC-016 is 006's input rather than 003's: its pointer check reads the copied folder, so a missing copy fails that gate rather than this handoff.
<!-- /ANCHOR:closure -->
