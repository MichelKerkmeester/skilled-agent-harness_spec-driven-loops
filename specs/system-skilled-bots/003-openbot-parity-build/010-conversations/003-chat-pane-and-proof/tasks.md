---
title: "Tasks: Phase 3: chat-pane-and-proof"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "chat pane tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: chat-pane-and-proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`CRATE` is `crates/bots-tui` and `P` is `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/003-chat-pane-and-proof`. Every command runs from the repository root with no tty.

The pre-expansion phase's crate tasks T022 to T026, T032 and T038 are folded into the tasks below, which name phase 003's file names. The old list named `ui_state.rs` and `render/panes.rs`, which the crate does not have.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the key map delta is approved (`../001-chat-ux-and-pane-map/design/key-map-delta.md`). Verify: `rg -n '^\| \*\*Approved\*\* \| Met \|' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/key-map-delta.md` prints one line
- [ ] T002 Confirm the crate and its frame loader exist (`$CRATE`). Verify: `ls $CRATE/src/view/panes.rs $CRATE/tests/common/frames.rs` prints two paths, and `rg -n 'phase 010' $CRATE/src/view/panes.rs` prints the placeholder line
- [ ] T003 Confirm the runtime verb exists (`.skilled/bin/bots.cjs`). Verify: `node .skilled/bin/bots.cjs chat --help` exits 0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `Transcript`, `Message` and `Role` (`$CRATE/src/model.rs`). Verify: `rg -n 'struct Transcript|struct Message|enum Role' $CRATE/src/model.rs` prints three lines
- [ ] T005 Add `chat_transcript` and `chat_send` with the argv of `design/pane-contract.md` section 1 (`$CRATE/src/cli.rs`). Verify: `rg -n 'fn chat_transcript|fn chat_send' $CRATE/src/cli.rs` prints both
- [ ] T006 Add the chat state, `Effect::ChatSend` and `Msg::ChatSent` (`$CRATE/src/state.rs`). Verify: `rg -n 'ChatView|ChatMode|ChatSend|ChatSent' $CRATE/src/state.rs` prints all four
- [ ] T007 Add `Context::Chat`, `CHAT_ROWS` and the four guards (`$CRATE/src/keys.rs`). Verify: `rg -n 'Context::Chat|CHAT_ROWS|When::Typing|When::Picking' $CRATE/src/keys.rs` prints all four
- [ ] T008 Add the chat worker and its job channel (`$CRATE/src/data.rs`). Verify: `rg -n 'chat' $CRATE/src/data.rs` prints the worker and the channel
- [ ] T009 Route the send's exit code (`$CRATE/src/state.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test chat exit_` prints `test result: ok. 5 passed`
- [ ] T010 Replace the placeholder with the chat body (`$CRATE/src/view/panes.rs`). Verify: `rg -n 'phase 010' $CRATE/src/view/panes.rs` exits 1
- [ ] T011 Add the `chat` branch to the fake CLI (`$CRATE/tests/fixtures/bots`). Verify: `rg -n 'chat' $CRATE/tests/fixtures/bots` prints the transcript and the send branches
- [ ] T012 Add one payload per state (`$CRATE/tests/fixtures/payloads/`). Verify: `ls $CRATE/tests/fixtures/payloads/chat-*.json | wc -l` prints the count the snapshot table names
- [ ] T013 Copy the approved frames into the crate (`$CRATE/design/chat-mockups.md`). Verify: `cmp $CRATE/design/chat-mockups.md specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md` prints nothing
- [ ] T014 Let the frame loader take a document name and write the chat suite (`$CRATE/tests/common/frames.rs`, `$CRATE/tests/chat.rs`). Verify: `rg -c '^### Chat, ' $CRATE/design/chat-mockups.md` prints 13
- [ ] T015 Document the chat tab's keys and calls (`$CRATE/README.md`). Verify: `rg -n 'bots chat' $CRATE/README.md` prints the two calls
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run the chat suite (`$CRATE/tests/chat.rs`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml --test chat frame_` prints `test result: ok. 26 passed`
- [ ] T017 Run the whole crate suite (`$CRATE`). Verify: `cargo test --manifest-path $CRATE/Cargo.toml` prints `test result: ok` for every target
- [ ] T018 Run clippy and fmt (`$CRATE`). Verify: `cargo clippy --manifest-path $CRATE/Cargo.toml --all-targets -- -D warnings` exits 0, and `cargo fmt --manifest-path $CRATE/Cargo.toml --check` exits 0
- [ ] T019 Prove one live send from the screen (`bots ui`). Verify: after typing `hello` in the chat tab, `node .skilled/bin/bots.cjs chat my-bot --transcript --json | jq -r '.messages[-2].text'` prints `hello`
- [ ] T020 Run the packet validator (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Design child**: See `../001-chat-ux-and-pane-map/design/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' $P/spec.md` prints 7
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4\. IMPLEMENTATION PHASES' $P/plan.md` prints one line
- [ ] CHK-003 [P1] The key map approval is recorded. Verify: T001 prints one line
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Clippy passes. Verify: T018 exits 0
- [ ] CHK-011 [P1] The footer is generated, not typed. Verify: `git diff --stat $CRATE/src/view/footer.rs` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Verify: `rg -c '\| Met \|' $P/acceptance-criteria.md` prints 19
- [ ] CHK-021 [P0] Manual testing complete. Verify: T019 prints `hello`
- [ ] CHK-022 [P1] Every frame is proven. Verify: T016 prints `26 passed`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The pane passes the draft as one argv value after `--message`, never through a shell. Verify: `rg -n 'sh -c|Command::new\("sh"' $CRATE/src/cli.rs` prints nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The README names the chat tab. Verify: T015 prints the two calls
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] scratch/ cleaned before completion. Verify: `find $P/scratch -type f ! -name .gitkeep` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | [ ]/6 |
| P1 Items | 6 | [ ]/6 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-11-26
<!-- /ANCHOR:summary -->

---
