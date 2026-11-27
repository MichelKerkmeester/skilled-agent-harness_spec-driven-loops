---
title: "Implementation Plan: Phase 3: chat-pane-and-proof"
description: "Edits six crate files to draw the chat body, bind the chat context and run the send on a worker of its own, then proves the thirteen chat states at both sizes through the screen's frame loader."
trigger_phrases:
  - "chat pane plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: chat-pane-and-proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Rust, the phase 003 crate on ratatui 0.30 and crossterm 0.29 |
| **Framework** | The screen's state, effect and message loop |
| **Storage** | None. The pane reads the conversation through the CLI |
| **Testing** | `cargo test` with ratatui's `TestBackend` compared to the approved frames cell for cell |

### Overview
The pane is a fourth body for the screen's existing shell. `cli.rs` gains the two calls, `model.rs` the three payload types, `state.rs` the chat state and its two new messages, `keys.rs` the chat context, `data.rs` a chat worker beside the read worker, and `view/panes.rs` the body. Every layout value, label and exit rule comes from `../001-chat-ux-and-pane-map/design/`, and each section of `design/pane-contract.md` maps to one file here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -n '^\| \*\*Approved\*\* \| Met \|' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/key-map-delta.md` prints one line
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok`, so phase 003 has shipped
- [ ] `node .skilled/bin/bots.cjs chat --help` exits 0, so the runtime child has shipped

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok`
- [ ] `cargo clippy --manifest-path crates/bots-tui/Cargo.toml --all-targets -- -D warnings` exits 0
- [ ] `cargo fmt --manifest-path crates/bots-tui/Cargo.toml --check` exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The screen's own loop: a key becomes an action, an action becomes an effect, a worker turns the effect into a message and the message updates state.

### Key Components
- **`Context::Chat`**: one context with two modes, typing and picking, generated into the footer from `CHAT_ROWS` like every other context.
- **The chat worker**: one thread with one job channel. It runs `chat_send`, waits with no deadline and sends `Msg::ChatSent` with the exit code and the last stderr line. Quit drops its sender and does not join it (`design/pane-contract.md` sections 4.2 and 5).
- **The chat body**: the transcript window over the body rows, the composer row inside the body and at 120 columns the 47-column detail column naming the selected message's run, item or secret.

### Data Flow
Opening the tab or choosing a bot queues a transcript read on the screen's read worker. `Enter` in typing mode moves the draft into `Effect::ChatSend`, the state draws the sending frame and the chat worker runs the send. When `Msg::ChatSent` arrives the state queues a re-read for exit 0, 5 or 1 or puts the draft back for exit 2 or 4.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `crates/bots-tui/src/view/panes.rs` | Draws the chat placeholder | update - the chat body | `rg -n 'phase 010' crates/bots-tui/src/view/panes.rs` exits 1 |
| `crates/bots-tui/src/keys.rs` | Holds the key table | update - the chat context | `rg -n 'CHAT_ROWS' crates/bots-tui/src/keys.rs` prints the slice |
| `crates/bots-tui/src/data.rs` | Runs the read worker | update - the chat worker | `rg -n 'chat' crates/bots-tui/src/data.rs` prints the worker and its channel |
| `crates/bots-tui/src/view/footer.rs` | Generates the footer from the key table | unchanged | `git diff --stat crates/bots-tui/src/view/footer.rs` prints nothing |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the approval, the crate and the verb. Implementation edits the six source files, adds the fixtures and copies the frames. Verification runs the chat suite, the whole crate suite, clippy and fmt and one live send.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Snapshot | The thirteen states at 80x24 and 120x40, one row per state and size in a table, each loaded by heading from `design/chat-mockups.md` | `cargo test --test chat` |
| Unit | The send's exit routing, the quit with a send out and the key rows | `cargo test --test chat` |
| Manual | One line typed in `bots ui` read back with `bots chat <id> --transcript` | `bots ui` |

The snapshot table is data, as phase 003's panes table is: one row names the state, the frame heading and the payload and one loop compares every cell at both sizes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The key map approval | Internal | Red | The phase does not start |
| Phase 003's crate | Internal | Yellow | No crate to edit |
| The runtime child's verb | Internal | Yellow | No call to make |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the chat tab breaks another tab's frame, or the worker blocks quit.
- **Procedure**: revert this phase's commit. The placeholder body returns and the runtime verb keeps working from the terminal.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

This phase uses the roster, the effort policy, the fallback order and the self-invocation guards of `../002-conversation-runtime-and-chat-verb/plan.md` section 8.

| Wave | Task ids | Files | Executor | Effort | Workers in parallel | Verify |
|------|----------|-------|----------|--------|---------------------|--------|
| 0 | T001 to T003 | none, three reads | the orchestrator | none | 1 | T001 to T003 |
| 1 | T004 to T009 | `src/model.rs` with `src/cli.rs`, `src/state.rs` with `src/keys.rs`, `src/data.rs` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `max` | 3 | `cargo check` exits 0 |
| 2 | T010 to T013 | `src/view/panes.rs`, the fixtures and `design/chat-mockups.md` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `max` | 2 | T010 to T013 |
| 3 | T014, T015 | `tests/common/frames.rs`, `tests/chat.rs`, `README.md` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `high` | 2 | T014, T015 |
| 4 | T016 to T020 | none | the orchestrator | none | 1 | T016 to T020 |
<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The key map approval, phase 003 and the runtime child shipped | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The conversations parent's close |
<!-- /ANCHOR:phase-deps -->

---
