---
title: "Acceptance Criteria: Phase 5: answer-flow"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "answer flow acceptance criteria"
  - "approval overlay acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow"
    last_updated_at: "2026-11-25T21:21:04Z"
    last_updated_by: "review-fix-pass"
    recent_action: "Aligned AC-003, AC-005 and AC-006 to the key map and added AC-012 for the grant row"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-answer-flow"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: answer-flow

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Every Verification cell below is a command that runs with no tty. The one step that needs a terminal - answering an item from the overlay by hand - is the final operator acceptance step after 006, not a criterion here, because a criterion that cannot be run in this environment cannot decide closure.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-003 | Given the client pointed at the fixture, When the overlay answers with `n`, Then the recorded argv is exactly `answer --scope deny --repo <repo> -- <item-id> deny`; When it answers with `y`, Then the recorded argv is exactly `answer --scope once --repo <repo> -- <item-id> approve`; and no module outside `cli.rs` spawns a process | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `argv_is_exactly_answer_id_text_scope`, and `rg -n 'Command::new' crates/bots-tui/src` prints only `cli.rs` | Unmet | - |
| AC-002 | REQ-006 | Given an item whose options are `["email", "chat"]`, When `2` is pressed inside the overlay, Then `bots answer --scope once --repo <repo> -- <item-id> chat` runs; When `2` is pressed with no overlay open, Then no `answer` argv is recorded | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `digit_picks_option_inside_overlay_only`, which asserts both the recorded argv and the empty log for the no-overlay case | Unmet | - |
| AC-003 | REQ-010 | Given the decision overlay open, When the frame draws, Then the buffer carries `t`, `n`, `y` and `Esc` with their labels and draws `n deny` before `y approve once`; Given the choice overlay open, Then the buffer carries `1-9`, `n` and `Esc` and draws `n deny` before any approve key | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` prints `test result: ok` and names `overlay_labels_are_drawn`, which asserts the decision frame's four labels and the choice frame's three against the `keys.rs` overlay rows rather than a hand-written list. The inbox footer's `Enter open` label is 003's `--test render_keys` row, because `view/footer.rs` is 003's | Unmet | - |
| AC-004 | REQ-011 | Given an item selected, When the input closes, Then nothing is written, the loop returns 0 and the item stays open | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`, which drives the loop with a closed-input event, asserts the return is 0 and asserts the fixture recorded no `answer` argv | Unmet | - |
| AC-005 | REQ-013 | Given an item selected, When Enter is pressed, Then the overlay draws `n deny` before `y approve once`, draws `1-9 pick` for an item that carries options, draws `Esc close` and draws no `always` label; When Esc is pressed, Then the overlay closes and no `answer` argv is recorded | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` prints `test result: ok` and names `overlay_draws_deny_first`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `esc_closes_overlay_and_writes_nothing` | Unmet | - |
| AC-006 | REQ-014 | Given an item whose `options` array is empty, When the frame draws, Then it carries a `t type` row; When `t` is pressed and `hold` is typed and Enter is pressed, Then `bots answer --scope once --repo <repo> -- <item-id> hold` runs; When a line beginning `yes, after the freeze` is typed, Then the leading `y` and the `n` inside it stay part of the text and no decision is taken | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `free_text_answer_writes_typed_line`, `typing_pauses_single_key_shortcuts` and `text_mode_accepts_a_leading_y`, and `--lib overlay` names `overlay_labels_are_drawn`, which iterates the `keys.rs` overlay rows and so covers the `t` row | Unmet | - |
| AC-007 | REQ-015 | Given the overlay sending, When a second key arrives before the result returns, Then no second `answer` argv is recorded and the overlay draws its sending state | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `second_press_writes_nothing`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` names `sending_dims_every_key` | Unmet | - |
| AC-008 | REQ-016 | Given the fixture answers `answer` with exit 4 and `bots: answer-not-approver`, When the overlay sends, Then the status row carries that line, the overlay stays open and the item stays open | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `refusal_shows_stderr_and_keeps_item`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` names `refused_adds_the_stderr_line` | Unmet | - |
| AC-009 | REQ-017 | Given the item is answered elsewhere and the next refresh drops it, When a key is pressed, Then the overlay says the item is no longer open and no `answer` argv is recorded; Given an item whose `state` is `expired`, Then it stays visible and every answer key is disabled | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `gone_item_disables_keys` and `expired_item_cannot_be_answered`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` names `gone_replaces_the_choices` | Unmet | - |
| AC-010 | REQ-018 | Given the overlay open, When Ctrl+C is pressed, Then the overlay closes, no `answer` argv is recorded and the loop keeps running; When a key that binds no action is pressed, Then no `answer` argv is recorded | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `ctrl_c_closes_overlay_and_writes_nothing` and `unbound_key_writes_nothing` | Unmet | - |
| AC-011 | REQ-012 | Given one open item, When the frame draws, Then the banner row reads `! 1 pending approval · Alt+2 → inbox`; Given two, Then it reads `! 2 pending approvals · Alt+2 → inbox`; Given none, Then the row is blank | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib banner` prints `test result: ok` and names `banner_counts_open_items` and `banner_is_blank_with_none` | Unmet | - |
| AC-012 | REQ-019 | Given an item carrying a grant, When the overlay draws, Then one `grant` row names its kind and its rung; Given an item carrying none, Then no `grant` row is drawn and every key still works | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` prints `test result: ok` and names `grant_row_draws_only_when_present`, which asserts both buffers | Unmet | - |
| AC-013 | REQ-015 | Given the overlay sending, When an inbox refresh that no longer lists the item lands before the answer result, Then the overlay stays sending and the answer result alone decides the next phase | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `refresh_while_sending_keeps_sending` | Unmet | - |
| AC-014 | REQ-016 | Given the fixture refuses `item-answered-differently` with exit 4, When the overlay sends, Then the overlay is gone, the status row carries the line and no answer key is live | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `gone_class_refusal_moves_to_gone` | Unmet | - |
| AC-015 | REQ-014 | Given text mode with a line of spaces, When Enter is pressed, Then no `answer` argv is recorded and the overlay stays in text mode | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `blank_line_sends_nothing` | Unmet | - |
| AC-016 | REQ-015 | Given an answer in flight and the overlay closed with Esc, When Enter reopens the same item, Then the overlay opens sending and a key press records no second `answer` argv | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `reopen_while_in_flight_stays_locked` | Unmet | - |
| AC-017 | REQ-003 | Given text mode, When `-1` is typed and sent, Then the recorded argv is exactly `answer --scope once --repo <repo> -- <item-id> -1` | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `dash_led_text_follows_the_terminator` | Unmet | - |
| AC-018 | REQ-015 | Given the overlay sending, When Esc or Ctrl+C is pressed, Then the overlay closes, the item id stays in `pending_answers` and the answer result still writes the status row | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib state` prints `test result: ok` and names `close_while_sending_keeps_the_answer` | Unmet | - |
| AC-019 | REQ-020 | Given a successful answer, When the result lands, Then the overlay closes and the row carries its outcome word until the next successful inbox read, and no read is issued | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib state` prints `test result: ok` and names `outcome_word_stays_until_the_next_poll` | Unmet | - |

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
