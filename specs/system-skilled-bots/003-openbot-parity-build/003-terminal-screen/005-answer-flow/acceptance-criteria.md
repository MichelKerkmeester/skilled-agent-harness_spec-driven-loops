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
    last_updated_at: "2026-11-25T20:22:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
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

Every Verification cell below is a command that runs with no tty. The one step that needs a terminal - answering an item from the overlay by hand - is a task in `tasks.md`, not a criterion here, because a criterion that cannot be run in this environment cannot decide closure.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-003 | Given the client pointed at the fixture, When the overlay answers with `n`, Then the recorded argv is exactly `answer <item-id> deny --scope deny`; When it answers with `y`, Then the recorded argv is exactly `answer <item-id> approve --scope once`; and no module outside `cli.rs` spawns a process | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `argv_is_exactly_answer_id_text_scope`, and `rg -n 'Command::new' crates/bots-tui/src` prints only `cli.rs` | Unmet | - |
| AC-002 | REQ-006 | Given an item whose options are `["ship it", "hold"]`, When `2` is pressed inside the overlay, Then `bots answer <item-id> hold --scope once` runs; When `2` is pressed with no overlay open, Then no `answer` argv is recorded | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `digit_picks_option_inside_overlay_only`, which asserts both the recorded argv and the empty log for the no-overlay case | Unmet | - |
| AC-003 | REQ-010 | Given the overlay open, When the frame draws, Then the buffer carries `1`, `n` and `Esc` with their labels, and the inbox footer carries `1-9`, `y`, `n` and `Esc` | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` prints `test result: ok` and names `overlay_labels_are_drawn`, which iterates the `keys.rs` overlay rows rather than a hand-written list | Unmet | - |
| AC-004 | REQ-011 | Given an item selected, When the input closes, Then nothing is written, the loop returns 0 and the item stays open | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib closed_input` prints `test result: ok` and names `closed_input_writes_nothing`, which drives the loop with a closed-input event, asserts the return is 0 and asserts the fixture recorded no `answer` argv | Unmet | - |
| AC-005 | REQ-013 | Given an item selected, When Enter is pressed, Then the overlay draws `1 approve once`, `n deny` and `Esc close` with deny before approve and no `always` label; When Esc is pressed, Then the overlay closes and no `answer` argv is recorded | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` prints `test result: ok` and names `overlay_draws_deny_first`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `esc_closes_overlay_and_writes_nothing` | Unmet | - |
| AC-006 | REQ-014 | Given an item whose `options` array is empty, When `hold` is typed and Enter is pressed, Then `bots answer <item-id> hold --scope once` runs; When `y` and `n` are typed inside that line, Then they stay part of the text and no decision is taken | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `free_text_answer_writes_typed_line` and `typing_pauses_single_key_shortcuts` | Unmet | - |
| AC-007 | REQ-015 | Given the overlay sending, When a second key arrives before the result returns, Then no second `answer` argv is recorded and the overlay draws its sending state | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `second_press_writes_nothing`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` names `sending_dims_every_key` | Unmet | - |
| AC-008 | REQ-016 | Given the fixture answers `answer` with exit 4 and `bots: answer-not-approver`, When the overlay sends, Then the status row carries that line, the overlay stays open and the item stays open | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `refusal_shows_stderr_and_keeps_item`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` names `refused_adds_the_stderr_line` | Unmet | - |
| AC-009 | REQ-017 | Given the item is answered elsewhere and the next refresh drops it, When a key is pressed, Then the overlay says the item is no longer open and no `answer` argv is recorded; Given an item whose `state` is `expired`, Then it stays visible and every answer key is disabled | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `gone_item_disables_keys` and `expired_item_cannot_be_answered`, and `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib overlay` names `gone_replaces_the_choices` | Unmet | - |
| AC-010 | REQ-018 | Given the overlay open, When Ctrl+C is pressed, Then the overlay closes, no `answer` argv is recorded and the loop keeps running; When a key that binds no action is pressed, Then no `answer` argv is recorded | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test answer_flow` prints `test result: ok` and names `ctrl_c_closes_overlay_and_writes_nothing` and `unbound_key_writes_nothing` | Unmet | - |
| AC-011 | REQ-012 | Given one open item, When the frame draws, Then the banner row reads `! 1 pending approval · Alt+2 → inbox`; Given two, Then it reads `! 2 pending approvals · Alt+2 → inbox`; Given none, Then the row is blank | `cargo test --manifest-path crates/bots-tui/Cargo.toml --lib banner` prints `test result: ok` and names `banner_counts_open_items` and `banner_is_blank_with_none` | Unmet | - |

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
