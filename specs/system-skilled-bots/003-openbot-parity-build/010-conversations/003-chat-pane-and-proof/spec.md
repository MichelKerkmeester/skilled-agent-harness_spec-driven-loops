---
title: "Feature Specification: Phase 3: chat-pane-and-proof"
description: "Replaces the phase 003 chat placeholder in bots ui with a transcript pane, a one-line composer and a bot picker over the two bots chat calls, sends on a chat worker of its own and proves every approved chat frame cell for cell at 80x24 and 120x40."
trigger_phrases:
  - "chat pane and proof"
  - "bots ui chat tab"
  - "phase 3 chat pane and proof"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: chat-pane-and-proof

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-conversation-runtime-and-chat-verb |
| **Successor** | None |
| **Handoff Criteria** | `cargo test --manifest-path crates/bots-tui/Cargo.toml --test chat` prints `test result: ok` with 26 frame snapshots, one per chat state per size, each matching its approved frame cell for cell. `cargo clippy --all-targets -- -D warnings` and `cargo fmt --check` pass. A line typed in the chat tab reads back through `bots chat <id> --transcript` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the conversations phase parent. It builds the pane the design child drew over the verb the runtime child ships.

**Scope Boundary**: The chat tab of `bots ui` in `crates/bots-tui/`, its key context, its worker and its proof. The verb, the conversation file and the prompt block are `../002-conversation-runtime-and-chat-verb/`. Every value this phase draws comes from `../001-chat-ux-and-pane-map/design/`, so this phase decides no layout, label or call of its own.

**Dependencies**:
- `../001-chat-ux-and-pane-map/design/mockups.md`, the thirteen states at both sizes, approved with the key map delta
- `../001-chat-ux-and-pane-map/design/key-map-delta.md`, the `chat` context and its nineteen key rows, whose approval (AC-008 of that child) gates the start of this phase
- `../001-chat-ux-and-pane-map/design/pane-contract.md`, the two calls, the payload, the drawing per message, the chat worker, the types and the edits section 7 lists
- `../001-chat-ux-and-pane-map/design/component-rows.md`, rows 14 to 19 and their closed states
- `../002-conversation-runtime-and-chat-verb/`, shipped, so `bots chat <id> --transcript --json` and `--message` exist
- The screen's crate from phase 003: its seven bands, its key table, its read worker and its frame loader `tests/common/frames.rs` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:459]

**Deliverables**:
- The chat body in place of the placeholder: transcript window, composer, bot label, status line and the detail column at 120 columns
- `Context::Chat` with its typing and picking modes, generated into the footer from the key table
- The chat worker thread that runs `--message` with no deadline beside the screen's read worker
- `tests/chat.rs`: 26 frame snapshots and the send, quit and refusal tests
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 draws a Chat tab whose body is a placeholder naming phase 010, so a person who opens `bots ui` sees the tab and cannot read or send a message there. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:30] The screen's one worker kills a write at 30 seconds, and a bot run lasts up to sixteen minutes, so the send cannot ride the path the answer flow uses. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/pane-contract.md:78]

### Purpose
Let a person read a conversation and send a line from the screen they already watch, drawn exactly as the approved frames show it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Taken on 2026-11-26 in this worktree.

```text
$ test -d crates/bots-tui; echo "exit=$?"
exit=1
```

The crate does not exist yet. Phase 003 builds it, so this phase starts when 003 has shipped and 002 has shipped, and its first task records the placeholder line it replaces.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the chat placeholder body with the transcript window, the composer, the bot label, the status line and the detail column, drawn as `../001-chat-ux-and-pane-map/design/mockups.md` draws them
- A bracketed paste into the composer follows the screen's paste rule (`../../003-terminal-screen/005-answer-flow/spec.md` REQ-022): it is appended to the draft with each carriage return or line feed as one space, and it never sends. Only Enter sends the draft
- Add `Context::Chat` and its nineteen key rows from `design/key-map-delta.md` section 2, so the footer lines of section 3 are generated and never typed
- Read the transcript with `bots chat <id> --transcript --json` on the screen's read worker, and send with `bots chat <id> --message <text>` on a chat worker of its own with no deadline
- Re-read the transcript after a send exits 0, 5 or 1 and put the draft back after a send exits 2 or 4, as `design/pane-contract.md` section 4.3 says
- Quit without waiting for a send in flight, as `design/pane-contract.md` section 5 says
- Prove each of the thirteen states at both sizes against its approved frame

### Out of Scope
- Parsing `@<bot-id>` in the pane - the runtime owns the one parser (`design/pane-contract.md` section 8)
- Picking a conversation other than the chosen bot's - the conversation id is the bot id (`design/routing-grammar.md` section 3)
- Completion, cursor movement inside the draft and a multi-line draft - `design/key-map-delta.md` section 5 names each one and why
- Any edit to phase 003's spec documents - this phase edits crate files in its own change (`design/pane-contract.md` section 7)

### Files to Change

`$CRATE` is `crates/bots-tui`. The file names are phase 003's, from its owner map. The pre-expansion phase named `ui_state.rs` and `render/panes.rs`, which the crate does not have.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `$CRATE/src/state.rs` | Modify | `Surface::Chat`, `State.chat`, `State.chat_view`, `ChatView`, `ChatMode`, `Effect::ChatSend`, `Msg::ChatSent` and the `on_chat_action` arm |
| `$CRATE/src/keys.rs` | Modify | `Context::Chat`, the `CHAT_ROWS` slice and the four `When` guards |
| `$CRATE/src/app.rs` | Modify | The chat worker's job sender, the `Effect::ChatSend` hand-off, the `Msg::ChatSent` reply in `App::settle`, and a shutdown that drops the sender and does not join the worker |
| `$CRATE/src/data.rs` | Modify | The chat worker and its job channel, started beside the read worker and dropped, not joined, on quit |
| `$CRATE/src/cli.rs` | Modify | `chat_transcript(bot)` and `chat_send(bot, text)` with the argv of `design/pane-contract.md` section 1, the draft written to the child's stdin |
| `$CRATE/src/model.rs` | Modify | `Transcript`, `Message` and `Role` |
| `$CRATE/src/view/panes.rs` | Modify | The chat body in place of the placeholder |
| `$CRATE/tests/panes.rs` | Modify | The placeholder test `chat_placeholder_names_phase_010` is replaced by one that asserts the chat body draws the transcript's first message |
| `$CRATE/tests/render_keys.rs` | Modify | The four chat footer lines of `design/key-map-delta.md` section 3, generated from `CHAT_ROWS` |
| `$CRATE/tests/fixtures/bots` | Modify | A `chat` branch that prints a scenario's transcript and records a `--message -` argv and the stdin line |
| `$CRATE/tests/fixtures/payloads/chat-*.json` | Create | One transcript payload per state, starting from `design/chat-transcript.sample.json` |
| `$CRATE/design/chat-mockups.md` | Create | A copy of `../001-chat-ux-and-pane-map/design/mockups.md`, so the frame loader reads the approved chat frames inside the crate |
| `$CRATE/tests/common/frames.rs` | Modify | Take the design document's name, keeping `mockups.md` as the default |
| `$CRATE/tests/chat.rs` | Create | The 26 frame snapshots and the send, quit and refusal tests |
| `$CRATE/README.md` | Modify | The chat tab's keys and the two calls |

Three of those files are closed to later edits by phase 003's owner map: `src/app.rs` is 002's with no later editor, `tests/panes.rs` is 004's and `tests/render_keys.rs` is 003's. This phase edits them in its own change because the chat pane cannot be built without them, and `design/pane-contract.md` section 7 is the named right it takes.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ-008 keeps the id it had in the pre-expansion phase. New requirements take ids from REQ-016, the next id after the REQ-015 of `../002-conversation-runtime-and-chat-verb/spec.md`, so no id means two things inside 010.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-008 | The chat pane in `bots ui` draws the transcript from `bots chat <id> --transcript --json` and sends a typed line through `bots chat <id> --message <text>`, replacing the phase 003 placeholder |
| REQ-016 | Every one of the thirteen states in `../001-chat-ux-and-pane-map/design/mockups.md` section 3 draws its frame cell for cell at 80x24 and at 120x40 |
| REQ-017 | A send runs on a chat worker thread of its own with no deadline, in its own process group, with stdout to null, the draft written to the child's stdin and stderr to a temporary file, so the screen's reads stay live while a run lasts minutes and the draft never reaches a process table |
| REQ-018 | The `chat` context's keys and footer lines come from one `CHAT_ROWS` slice holding `design/key-map-delta.md` section 2, and every bound key is labelled in the footer at 67 columns or wider |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-019 | After a send exits 0, 5 or 1 the pane re-reads the transcript. After it exits 2 or 4 nothing was appended, so the draft is put back with the stderr line in the status row and pressing `Enter` again writes one message and not two |
| REQ-020 | Quitting with a send in flight does not wait for it, and the reply still lands in the conversation file |
| REQ-021 | The crate README names the chat tab's keys and the two calls |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-004**: `bots ui` draws the chat tab with the transcript's lines, and a line typed there appears in `bots chat <id> --transcript`
- **SC-007**: `cargo test --manifest-path crates/bots-tui/Cargo.toml --test chat` prints `test result: ok` and runs 26 frame snapshots
- **SC-008**: With a fixture send that sleeps 60 seconds, the header's index age still updates while the send is out

SC-004 keeps its pre-expansion id. New criteria take ids from SC-007, after the runtime child's SC-006.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The key map approval in the design child | The pane would bind keys nobody approved | This phase does not start until that child's AC-008 is Met |
| Dependency | Phase 003's crate and frame loader | No crate to edit and no loader to compare with | The first task checks both exist |
| Risk | The chat worker outlives the screen | A run keeps going after quit | That is intended. The CLI appends the reply, and the process group lets the operator stop it by hand |
| Risk | A send's stderr grows large | The temporary file fills | Only the last line is read for the status row, and the file is removed after the send ends |
| Risk | Edits to files phase 003 closed | 003's owner map is broken | `design/pane-contract.md` section 7 lists each edit and why, and this phase makes them in its own change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Drawing a transcript of 1,000 messages visits at most the body's rows, as phase 003's 2,000-row test measures for the other panes

### Reliability
- **NFR-R01**: A failed read keeps the last messages and marks the title stale, as frame C11 draws it
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `Enter` on a draft blank after trimming sends nothing
- A send in flight: `Enter send` leaves the footer and `Enter` does nothing, as frame C5 draws it
- Failure path: a first read that fails draws the stderr line with no composer, frame C12
- A message with no reply and no send in flight draws as unanswered, frame C10
- The screen below 80x24 shows the too-small screen as every other tab does
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Six crate files, one new test file, one fixture branch |
| Risk | 6/25 | A second worker thread, no network, no schema |
| Research | 3/20 | Every value is fixed by the design child |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The design child settled the layout, the keys, the calls and the worker and this phase builds them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Design child**: `../001-chat-ux-and-pane-map/design/`
- **Runtime child**: `../002-conversation-runtime-and-chat-verb/spec.md`
