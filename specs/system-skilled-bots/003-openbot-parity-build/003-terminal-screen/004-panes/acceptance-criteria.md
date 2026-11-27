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

Every Verification cell is a command that runs without a tty, except AC-001, whose two commands sit in the block below because a pipe cannot live in a table cell and still be copyable. `$CRATE` is `crates/bots-tui`, set once per shell.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-003 | Given the panes drawing, When they read, Then every read is one `bots ... --json` call through `cli.rs` and no pane opens a state file | AC-001 block prints only `cli.rs` for the first command and nothing for the second. Observed 2026-11-27: the first command printed only `crates/bots-tui/src/cli.rs:95` and the second printed nothing, exit 1 | Met | - |
| AC-002 | REQ-016 | Given `bots activity --json` returns the seven groups, When the activity pane draws, Then the groups appear in payload order with their titles, and each row carries its marker, its label and its bot id | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- activity` prints `test result: ok` and names `activity_groups_draw_in_payload_order`. Observed 2026-11-27: `-- activity` printed `test result: ok. 13 passed`, naming `activity::activity_groups_draw_in_payload_order`, `activity::activity_rows_match_the_frame` and `activity::down_moves_the_mark_and_the_detail` beside the ten activity snapshot cases (`tests/panes/activity.rs`) | Met | - |
| AC-003 | REQ-016 | Given rows whose states are `scheduled`, `recurring` and `some-new-state`, When they draw, Then they carry `○`, `↻` and `?`, and the unknown one carries its raw value beside it | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- markers` prints `test result: ok` and names `scheduled_recurring_and_unknown_carry_their_own_glyph`. Observed 2026-11-27: `-- markers` printed `test result: ok. 2 passed`, naming `markers::scheduled_recurring_and_unknown_carry_their_own_glyph` (`tests/panes/markers.rs`), which also asserts that a row with an empty state draws `?` and `missing` | Met | - |
| AC-004 | REQ-017 | Given `bots inbox --json` returns one open and one expired item, When the inbox pane draws, Then both appear, the open one with `!` in the gutter and the word `open`, the expired one dimmed, with no glyph and no answer key | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- inbox` prints `test result: ok` and names `expired_item_draws_dimmed_without_answer_key`. Observed 2026-11-27: `-- inbox` printed `test result: ok. 14 passed`, naming `inbox::expired_item_draws_dimmed_without_answer_key`, which asserts the blank gutter, `Modifier::DIM` on the row and the detail line `Enter shows it is no longer open.` | Met | - |
| AC-005 | REQ-018 | Given `bots routines --json` returns one routine, When the routines pane draws, Then the bot id, the four-part sentence and the state appear | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- routines` prints `test result: ok` and names `routine_row_draws_bot_id_sentence_and_state`. Observed 2026-11-27: `-- routines` printed `test result: ok. 12 passed`, naming `routines::routine_row_draws_bot_id_sentence_and_state` (`tests/panes/routines.rs`) | Met | - |
| AC-006 | REQ-018 | Given `bots routines --json` returns an empty `routines` array, When the routines pane draws, Then one line says what a routine is and the body is not blank | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- routines` prints `test result: ok` and names `routines_empty_line_says_what_a_routine_is`. Observed 2026-11-27: `-- routines` printed `test result: ok. 12 passed`, naming `routines::routines_empty_line_says_what_a_routine_is`, which compares the "Routines, empty" frame at both sizes | Met | - |
| AC-007 | REQ-019 | Given the chat tab is active, When the frame draws, Then one line names phase 010 and `bots chat`, and the pane holds no state | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- chat` prints `test result: ok` and names `chat_placeholder_names_phase_010`. Observed 2026-11-27: `-- chat` printed `test result: ok. 3 passed`, naming `chat::chat_placeholder_names_phase_010`, which asserts the draw returns 0 and leaves every pane view unchanged | Met | - |
| AC-008 | REQ-020 | Given a pane whose first read is in flight, When it draws, Then it draws a named loading line rather than a blank body | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- states` prints `test result: ok` and names `loading_draws_a_named_line`. Observed 2026-11-27: `-- states` printed `test result: ok. 3 passed`, naming `states::loading_draws_a_named_line` for all three data panes in both glyph sets | Met | - |
| AC-009 | REQ-020 | Given a read that exits non-zero with stderr, When the frame draws, Then the rows of the last successful read stay and the stale state draws the label `stale_label` returns | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- states` prints `test result: ok` and names `error_keeps_rows_and_sets_stale`. Observed 2026-11-27: `-- states` printed `test result: ok. 3 passed`, naming `states::error_keeps_rows_and_sets_stale`, which asserts the title `Activity · stale 2m` from the one `stale_label` call in `src/view/panes.rs` | Met | - |
| AC-010 | REQ-021 | Given a bot id carrying `\u{1b}[2J`, When the row draws, Then the buffer holds `?[2J` in place of the escape and no control byte | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- sanitize` prints `test result: ok` and names `control_characters_never_reach_the_buffer`. Observed 2026-11-27: `-- sanitize` printed `test result: ok. 1 passed`, naming `sanitize::control_characters_never_reach_the_buffer`, which asserts that `evil?[2J` and `Ship?it?now??` are drawn and that no cell holds a control character | Met | - |
| AC-011 | REQ-022 | Given two polls whose rows are reversed, When the second poll lands, Then the selection still names the same row key, and a selection whose item leaves the payload falls to the nearest surviving row | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- reorder` prints `test result: ok` and names `selection_survives_reorder`. Observed 2026-11-27: `-- reorder` printed `test result: ok. 1 passed`, naming `reorder::selection_survives_reorder`. Run in a lane copy, the same test failed against the stubbed reducer this unit replaced and against a reconcile that keeps the row index | Met | - |
| AC-012 | REQ-023 | Given the ASCII set, When the activity pane draws one row of each of the eight states, Then each row carries `*`, `+`, `x`, `!`, `-`, `o`, `r` and `?` | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- markers` prints `test result: ok` and names `panes_draw_the_ascii_markers`. Observed 2026-11-27: `-- markers` printed `test result: ok. 2 passed`, naming `markers::panes_draw_the_ascii_markers`. It draws at 80x40 because eight one-row groups need sixteen list lines and the 80x24 page holds fifteen | Met | - |
| AC-013 | REQ-024 | Given a 120-column terminal, When the activity pane draws with a row selected, Then the selected row's detail draws as a right column, and an inbox item's grant kind and rung draw only when the item carries them. At 80 columns the body is one column | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- wide` prints `test result: ok` and names `detail_draws_as_a_right_column_at_120`. Observed 2026-11-27: `-- wide` printed `test result: ok. 2 passed`, naming `wide::detail_draws_as_a_right_column_at_120`, which also asserts the line `grant     kind send · rung kind` appears only on an item that carries a grant | Met | - |
| AC-014 | REQ-025 | Given 2,000 activity rows, When the frame draws at 120x40, Then the draw visits at most the body height's rows | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- budget` prints `test result: ok` and names `two_thousand_rows_visit_at_most_the_body_height`, and `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- budget --ignored` names `two_thousand_rows_draw_under_16ms`. Observed 2026-11-27: `-- budget` printed `test result: ok. 1 passed; 0 failed; 1 ignored`, naming `budget::two_thousand_rows_visit_at_most_the_body_height`, and `-- budget --ignored` printed `budget::two_thousand_rows_draw_under_16ms ... ok`. The count is the length of the window the draw builds line by line (`activity_body` in `src/view/panes.rs`), never a cut of a fully built list | Met | - |
| AC-015 | REQ-026 | Given the activity tab is active, When the frame draws, Then the pane footer names Up, Down, PgUp and PgDn and no Enter. On the inbox tab it also names Enter. On the routines tab it names Up, Down, PgUp and PgDn. On the chat tab it names no list key, and no pane footer names an answer key | `cargo test --manifest-path $CRATE/Cargo.toml --lib keys` prints `test result: ok` and names `list_keys_move_the_selection`, and `cargo test --manifest-path $CRATE/Cargo.toml --test render_keys` prints `test result: ok` and names `every_bound_label_is_drawn`, which iterates the table and asserts each `list` row's label appears in the frame drawn for its context. Observed 2026-11-27: `--lib keys` printed `test result: ok. 19 passed`, naming `keys::tests::list_keys_move_the_selection`, which also asserts footer line 1 per tab, and `--test render_keys` printed `test result: ok. 16 passed`, naming `every_bound_label_is_drawn` over the five new `LIST_ROWS` | Met | - |
| AC-016 | REQ-020 | Given each pane and each of its states, When the frame draws at 80x24 and at 120x40, Then one buffer snapshot per pane per state matches its frame cell for cell, sixteen per size | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- snapshot` prints `test result: ok` and the test names 32 cases, each loaded from `design/mockups.md` through 002's `tests/common/frames.rs`. Observed 2026-11-27: `-- snapshot` printed `test result: ok. 33 passed`, the 32 cases `snapshot::<pane>_<state>_80x24` and `_120x40` plus `corrections_name_only_real_frames`, each comparing every row of the whole frame. Eleven lines of frame "Shell, Activity tab, rows" compare against corrected lines in `tests/panes/support.rs` `CORRECTIONS`, because that mockup draws `in 5h` where the rounded-down age is `in 4h` and draws its 120x40 detail column two rows low. Each correction asserts the mockup still differs, and removing the `in 4h` correction in a lane copy failed `activity_rows_80x24` on that cell | Met | - |
| AC-017 | REQ-003 | Given the packet, When the validator runs, Then it passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes --strict` prints `RESULT: PASSED`. Observed 2026-11-27: `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` | Met | - |
| AC-018 | REQ-017 | Given an inbox item whose id has a mark in `state.answered`, When the inbox pane draws, Then the row carries a blank gutter and its outcome word in the state column, dimmed, the title's open count leaves it out and the detail column draws the same word as its `state` | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- inbox` prints `test result: ok` and names `answered_row_draws_its_outcome_word`. Observed 2026-11-27: `-- inbox` printed `test result: ok. 14 passed`, naming `inbox::answered_row_draws_its_outcome_word`, which compares the "Inbox, answered row" frame at both sizes | Met | - |
| AC-019 | REQ-027 | Given one open item, When the frame draws, Then the banner row reads `! 1 pending approval · Alt+2 → inbox`. Given two, Then it reads `! 2 pending approvals · Alt+2 → inbox`. Given none, Then the row is blank | `cargo test --manifest-path $CRATE/Cargo.toml --lib banner` prints `test result: ok` and names `banner_counts_open_items` and `banner_is_blank_with_none`. Observed 2026-11-27: `--lib banner` printed `test result: ok. 2 passed`, naming `view::banner::tests::banner_counts_open_items` and `view::banner::tests::banner_is_blank_with_none`. The key label is read from the key table row that selects the inbox tab | Met | - |
| AC-020 | REQ-017 | Given an inbox item whose `state` is `some-new-state`, When the inbox pane draws, Then the row is dimmed, its state column holds `some-new-state` and it carries no answer key | `cargo test --manifest-path $CRATE/Cargo.toml --test panes -- inbox` prints `test result: ok` and names `unknown_state_draws_dimmed_without_answer_key`. Observed 2026-11-27: `-- inbox` printed `test result: ok. 14 passed`, naming `inbox::unknown_state_draws_dimmed_without_answer_key` | Met | - |
| AC-021 | REQ-021 | Given an inbox question wider than the body with an emoji and a combining mark at the clip column, When the pane draws at 80x24, Then the line ends with `…` inside the width, no double-width cell is split and nothing panics. Given the same question under `--ascii`, Then the line ends with `...` | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib panes` prints `test result: ok` and names `clips_by_display_width`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --test panes -- clip` prints `test result: ok` and names `clip_never_splits_a_wide_cell`. Observed 2026-11-27: `--lib panes` printed `test result: ok. 1 passed`, naming `view::panes::tests::clips_by_display_width`, and `-- clip` printed `test result: ok. 1 passed`, naming `clip::clip_never_splits_a_wide_cell` | Met | - |

### The commands

**AC-001**: the panes read through `cli.rs` and open no state file.

```bash
rg -n 'Command::new' $CRATE/src
rg -n 'read_to_string|File::open|fs::read' $CRATE/src/view/panes.rs
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

Every row is `Met` with evidence observed on 2026-11-27 in the unit worktree. AC-016 holds through eleven corrected lines for frame "Shell, Activity tab, rows", because that mockup draws `in 5h` where the rounded-down age is `in 4h` and draws its 120x40 detail column two rows low. The corrections live in `tests/panes/support.rs`, each one asserting the mockup still differs, so the fix to `001-ux-and-component-map/design/mockups.md` removes them by failing them. Nothing is waived, so no decision record carries a closure ADR.
<!-- /ANCHOR:closure -->
