---
title: "Acceptance Criteria: Phase 4: panes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one, and every check runnable without a tty."
trigger_phrases:
  - "pane states acceptance criteria"
  - "activity pane acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: panes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every Verification cell is a command that runs without a tty. `$CRATE` is `crates/bots-tui`, set once per shell.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-003 | Given the panes drawing, When they read, Then every read is one `bots ... --json` call through `cli.rs` and no pane opens a state file | `rg -n 'Command::new' $CRATE/src` prints only `cli.rs`, and `rg -n 'read_to_string\|File::open\|fs::read' $CRATE/src/view/panes.rs` prints nothing | Unmet | - |
| AC-002 | REQ-016 | Given `bots activity --json` returns the seven groups, When the activity pane draws, Then the groups appear in payload order with their titles, and each row carries its marker, its label and its bot id | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- activity` prints `test result: ok` and names `activity_groups_draw_in_payload_order` | Unmet | - |
| AC-003 | REQ-016 | Given rows whose states are `scheduled`, `recurring` and `some-new-state`, When they draw, Then they carry `○`, `↻` and `?`, and the unknown one carries its raw value beside it | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- markers` prints `test result: ok` and names `scheduled_recurring_and_unknown_carry_their_own_glyph` | Unmet | - |
| AC-004 | REQ-017 | Given `bots inbox --json` returns one open and one expired item, When the inbox pane draws, Then both appear, the open one with `!` in the gutter and the word `open`, the expired one dimmed, with no glyph and no answer key | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- inbox` prints `test result: ok` and names `expired_item_draws_dimmed_without_answer_key` | Unmet | - |
| AC-005 | REQ-018 | Given `bots routines --json` returns one routine, When the routines pane draws, Then the bot id, the four-part sentence and the state appear | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- routines` prints `test result: ok` and names `routine_row_draws_bot_id_sentence_and_state` | Unmet | - |
| AC-006 | REQ-018 | Given `bots routines --json` returns an empty `routines` array, When the routines pane draws, Then one line says what a routine is and the body is not blank | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- routines` prints `test result: ok` and names `routines_empty_line_says_what_a_routine_is` | Unmet | - |
| AC-007 | REQ-019 | Given the chat tab is active, When the frame draws, Then one line names phase 010 and `bots chat`, and the pane holds no state | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- chat` prints `test result: ok` and names `chat_placeholder_names_phase_010` | Unmet | - |
| AC-008 | REQ-020 | Given a pane whose first read is in flight, When it draws, Then it draws a named loading line rather than a blank body | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- states` prints `test result: ok` and names `loading_draws_a_named_line` | Unmet | - |
| AC-009 | REQ-020 | Given a read that exits non-zero with stderr, When the frame draws, Then the rows of the last successful read stay and the stale state draws the label `stale_label` returns | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- states` prints `test result: ok` and names `error_keeps_rows_and_sets_stale` | Unmet | - |
| AC-010 | REQ-021 | Given a bot id carrying `\u{1b}[2J`, When the row draws, Then the buffer holds `?[2J` in place of the escape and no control byte | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- sanitize` prints `test result: ok` and names `control_characters_never_reach_the_buffer` | Unmet | - |
| AC-011 | REQ-022 | Given two polls whose rows are reversed, When the second poll lands, Then the selection still names the same row key, and a selection whose item leaves the payload falls to the nearest surviving row | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- reorder` prints `test result: ok` and names `selection_survives_reorder` | Unmet | - |
| AC-012 | REQ-023 | Given the ASCII set, When the activity pane draws one row of each of the eight states, Then each row carries `*`, `+`, `x`, `!`, `-`, `o`, `r` and `?` | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- markers` prints `test result: ok` and names `panes_draw_the_ascii_markers` | Unmet | - |
| AC-013 | REQ-024 | Given a 120-column terminal, When the activity pane draws with a row selected, Then the selected row's detail draws as a right column, and an inbox item's grant kind and rung draw only when the item carries them; at 80 columns the body is one column | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- wide` prints `test result: ok` and names `detail_draws_as_a_right_column_at_120` | Unmet | - |
| AC-014 | REQ-025 | Given 2,000 activity rows, When the frame draws at 120x40, Then the draw visits at most the body height's rows | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- budget` prints `test result: ok` and names `two_thousand_rows_visit_at_most_the_body_height`, and `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- budget --ignored` names `two_thousand_rows_draw_under_16ms` | Unmet | - |
| AC-015 | REQ-026 | Given the activity tab is active, When the frame draws, Then the pane footer names Up, Down, PgUp and PgDn and no Enter. On the inbox tab it also names Enter. On the routines tab it names Up, Down, PgUp and PgDn. On the chat tab it names no list key, and no pane footer names an answer key | `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and names `list_keys_move_the_selection`, and `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and names `every_bound_label_is_drawn`, which iterates the table and asserts each `list` row's label appears in the frame drawn for its context | Unmet | - |
| AC-016 | REQ-020 | Given each pane and each of its states, When the frame draws at 80x24 and at 120x40, Then one buffer snapshot per pane per state matches its frame cell for cell, sixteen per size | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- snapshot` prints `test result: ok` and the test names 32 cases, each loaded from `design/mockups.md` through 002's `tests/common/frames.rs` | Unmet | - |
| AC-017 | REQ-003 | Given the packet, When the validator runs, Then it passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes --strict` prints `RESULT: PASSED` | Unmet | - |

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
