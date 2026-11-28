---
title: "Acceptance Criteria: Phase 3: chat-pane-and-proof"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "chat pane acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations/003-chat-pane-and-proof"
    last_updated_at: "2026-11-26T01:30:00Z"
    last_updated_by: "wo-08-writer"
    recent_action: "Authored one row per approved chat frame"
    next_safe_action: "Start after the key map approval and the two predecessors ship"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo08-010-003-pane"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: chat-pane-and-proof

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/010-conversations/003-chat-pane-and-proof
**Level:** 2
**Status:** Draft
**Date:** 2026-11-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. AC-008 keeps its pre-expansion id. AC-015 to AC-027 are one row per state C1 to C13 of `../001-chat-ux-and-pane-map/design/mockups.md` section 3, each covering both sizes.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-008 | REQ-008 | Given the crate built and a conversation holding two messages, When `bots ui` opens the chat tab, Then the pane draws both messages and a line typed there appears in `bots chat <id> --transcript` | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat send_reads_back` prints `test result: ok. 1 passed`. Observed 2026-11-28: `test result: ok. 1 passed`. Live: a line typed in `bots-ui` on a scratch checkout read back as `messages[-2].text` = `hello` | Met | - |
| AC-015 | REQ-016 | Given the payload for state C1, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, loading` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c01_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-016 | REQ-016 | Given the payload for state C2, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, empty` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c02_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-017 | REQ-016 | Given the payload for state C3, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, loaded` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c03_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-018 | REQ-016 | Given the payload for state C4, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, composing` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c04_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-019 | REQ-016 | Given the payload for state C5, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, sending` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c05_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-020 | REQ-016 | Given the payload for state C6, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, reply arrived` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c06_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-021 | REQ-016 | Given the payload for state C7, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, parked with its item id` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c07_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-022 | REQ-016 | Given the payload for state C8, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, failed with its reason` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c08_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-023 | REQ-016 | Given the payload for state C9, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, redacted reply` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c09_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-024 | REQ-016 | Given the payload for state C10, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, unanswered message` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c10_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-025 | REQ-016 | Given the payload for state C11, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, stale with the rows kept` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c11_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-026 | REQ-016 | Given the payload for state C12, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, load error with no rows` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c12_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-027 | REQ-016 | Given the payload for state C13, When the chat tab draws at 80x24 and at 120x40, Then both buffers match the frames under `### Chat, bot picker` in `design/chat-mockups.md` cell for cell | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat frame_c13_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed`, every row of both frames equal | Met | - |
| AC-028 | REQ-017 | Given a fixture send that sleeps 60 seconds, When it is out, Then the header's index age still updates, and the send runs with no deadline in its own process group | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat worker_` prints `test result: ok. 2 passed`. Observed 2026-11-28: `test result: ok. 2 passed` | Met | - |
| AC-029 | REQ-018 | Given `CHAT_ROWS`, When the footer is drawn for each chat mode, Then every bound key is labelled and the four lines are the ones `design/key-map-delta.md` section 3 lists | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat keys_` prints `test result: ok. 4 passed`. Observed 2026-11-28: `test result: ok. 4 passed` | Met | - |
| AC-030 | REQ-019 | Given a send that exits 0, 5, 1, 2 or 4, When `Msg::ChatSent` arrives, Then the first three re-read the transcript and the last two appended nothing, so the draft goes back with the stderr line in the status row | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat exit_` prints `test result: ok. 5 passed`. Observed 2026-11-28: `test result: ok. 5 passed` | Met | - |
| AC-031 | REQ-020 | Given a send in flight, When `Ctrl+D` is pressed, Then the screen quits at once and the fake CLI still records the send's argv | `cargo test --manifest-path .skilled/crates/bots-tui/Cargo.toml --test chat quit_` prints `test result: ok. 1 passed`. Observed 2026-11-28: `test result: ok. 1 passed` | Met | - |
| AC-032 | REQ-021 | Given the crate README, When it is read, Then it names the chat tab's keys and the two calls | `rg -n 'bots chat' .skilled/crates/bots-tui/README.md` prints the two calls. Observed 2026-11-28: lines 17, 121 and 122 name `bots chat <bot> --transcript --json` and `bots chat <bot> --message -` | Met | - |

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

Every row is Met with observed evidence from 2026-11-28. The whole crate gate passed from the final state: `cargo fmt --check` and `cargo clippy --locked --all-targets -- -D warnings` exit 0, and `cargo test --locked` passes every target.
<!-- /ANCHOR:closure -->
