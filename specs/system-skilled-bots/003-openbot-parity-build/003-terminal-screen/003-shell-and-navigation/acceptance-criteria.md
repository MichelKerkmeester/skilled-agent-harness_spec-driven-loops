---
title: "Acceptance Criteria: Phase 3: shell-and-navigation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "shell and navigation acceptance criteria"
  - "bots ui shell acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation"
    last_updated_at: "2026-11-25T22:10:00Z"
    last_updated_by: "spec-authoring"
    recent_action: "Authored the criteria for the shell and navigation child"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-003-shell-and-navigation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: shell-and-navigation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation
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
| AC-001 | REQ-004 | Given the shell open, When Alt+2 is pressed, Then the inbox tab is active; When `]` is pressed, Then the next tab is active and `[` returns; When Ctrl+P is pressed, Then the palette opens; When Ctrl+D is pressed, Then the loop quits | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` prints `test result: ok` and names `alt_2_selects_inbox`, `bracket_right_cycles_forward`, `bracket_left_cycles_back`, `ctrl_p_opens_palette` and `ctrl_d_quits`, each asserting the action the table returns for that key | Unmet | - |
| AC-002 | REQ-010 | Given any shell frame, When it is drawn, Then every label the key table binds appears in the buffer | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `every_bound_label_is_drawn`, which iterates `keys::rows()` rather than a hand-written list and asserts each row's label appears in the frame drawn for that row's context | Unmet | - |
| AC-003 | REQ-012 | Given the Activity, Routines, inbox and chat tabs, When each footer is drawn, Then its key line is generated from the table, so a row added to the table appears without a second edit, and the three arrangements are fixed: Activity and Routines draw `Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page` over `Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit`, the inbox adds `Enter open` to line 1, and the chat draws `Alt+1..4 tabs · [ ] cycle` over the same line 2 | `rg -n 'keys::' crates/bots-tui/src/view/footer.rs` prints the table read, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` names `footer_names_alt_1_4_brackets_ctrl_p_ctrl_d`, which asserts `Alt+1..4 tabs`, `[ ] cycle`, `Ctrl+P/? commands`, `Ctrl+C exit` and `Ctrl+D exit` in the buffer, the labels this phase's rows draw in every ruled footer. The `list` labels `↑↓ select`, `PgUp/PgDn page` and `Enter open` reach the footer from 004's rows, and 004's AC-015 asserts them | Unmet | - |
| AC-004 | REQ-013 | Given `bots status --json` returns three bot rows and `stale: false`, When the header draws, Then it reads `bots · 3 bots · index 12s ago`; given `stale: true` and an `updatedAt` two minutes before the state's `now`, Then `stale_label` returns `stale 2m` and the header draws it; given the call exits 1, Then the header keeps the last count and the status row carries the first stderr line | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `header_draws_bot_count`, `header_draws_stale_age` and `header_keeps_the_count_on_error`, each asserting the string in the `TestBackend` buffer, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib header` names `stale_label_formats_the_age` | Unmet | - |
| AC-005 | REQ-014 | Given the last call exited 1 with stderr `bots: index locked`, When the frame draws, Then the status row reads `bots: index locked`; given no call has failed, Then the row is blank | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `status_row_draws_first_stderr_line` and `status_row_is_blank_without_error` | Unmet | - |
| AC-006 | REQ-015 | Given the shell open, When Ctrl+P is pressed, Then the palette lists the `main`, `inbox` and `list` rows, one per label. When `ex` is typed, Then only the rows whose label holds `ex` remain, which are `Ctrl+C exit` and `Ctrl+D exit`, and no single-key binding fires. When Down is pressed, Then the selection moves to the next row. When Enter is pressed, Then the selected row's action runs, and a row bound in another context does nothing. When Esc or Ctrl+C is pressed, Then the palette closes and the context it was opened from is live again | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `palette_lists_every_binding`, `palette_filters_as_the_operator_types`, `palette_enter_runs_the_selected_action`, which also asserts a row bound in another context runs nothing, and `palette_esc_closes`. `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` names `palette_filter_pauses_shortcuts` and `palette_up_and_down_move_the_selection`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib state` names `palette_opens_and_closes` | Unmet | - |
| AC-007 | REQ-016 | Given an area of 23x8 or 24x7, When the frame draws, Then the buffer holds `Too small · Ctrl+D exit` and no tab label, and the draw returns without panicking | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `too_small_draws_resize_line_only`, which renders both sizes and asserts the line is present and `Activity` is absent | Unmet | - |
| AC-008 | REQ-017 | Given the shell open with neither an overlay nor the palette open, When Ctrl+C is pressed, Then the table returns `Action::Quit` and the reducer produces no `Answer` effect, so nothing is written | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib keys` prints `test result: ok` and names `ctrl_c_quits_and_emits_no_answer`, which asserts the action is `Quit` and that `state::update` with that action returns no `Effect::Answer` | Unmet | - |
| AC-009 | REQ-018 | Given a 80x24 area and a 120x40 area, When the shell draws, Then both buffers hold the seven bands in order - header, tabs, rule, body, banner row, status row, footer - and the body takes the rows the other six leave | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `shell_snapshot_80x24` and `shell_snapshot_120x40`, each comparing the buffer's lines to an expected block held in the test file | Unmet | - |
| AC-010 | REQ-019 | Given `--mono`, When the theme is built, Then every palette field is `Color::Reset`; given the same state, When the System and Mono frames draw, Then their symbols are identical, so no meaning is carried by colour alone | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib theme` prints `test result: ok` and names `mono_resets_every_colour` and `mono_draws_the_same_symbols`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib args` names `mono_flag_selects_mono`, which 002 owns because it parses the flag | Unmet | - |
| AC-011 | REQ-020 | Given the glyph table, When it is read, Then it holds the eight approved markers with `* + x ! - o r ?` as their ASCII column, every ASCII entry is ASCII, and every Unicode marker has a counterpart; given `--ascii`, Then the ASCII column is selected | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib theme` prints `test result: ok` and names `ascii_glyphs_are_ascii` and `every_marker_has_an_ascii_counterpart`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib args` names `ascii_flag_selects_the_ascii_glyphs`, which 002 owns because it parses the flag | Unmet | - |
| AC-012 | REQ-021 | Given stderr holding `bots: bad\u{1b}[2Jvalue`, When the status row draws, Then the buffer holds `bots: bad?[2Jvalue` and no escape byte, so the message cannot move the cursor | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `status_row_strips_control_characters`, which asserts the `?` replacement and the absence of the control character in the buffer | Unmet | - |
| AC-013 | REQ-004 | Given the chat tab active, When the shell draws, Then the Chat tab carries the active mark and the body slot holds no pane text, because 004 draws the one line naming phase 010 | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test render_keys` prints `test result: ok` and names `chat_tab_carries_the_active_mark`, which asserts `[4 Chat]` in the tab bar and an empty body row beneath it | Unmet | - |

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

The shell does not exist yet, so AC-001 is unmet and every later criterion depends on it. Nothing is waived, so no decision record carries a closure ADR.
<!-- /ANCHOR:closure -->
