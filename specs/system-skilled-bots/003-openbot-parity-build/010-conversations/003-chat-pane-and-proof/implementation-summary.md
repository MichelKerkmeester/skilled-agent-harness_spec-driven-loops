---
title: "Implementation Summary"
description: "The Chat tab of bots ui now reads a conversation and sends a line through the two bots chat calls, on a chat worker of its own, and all thirteen approved chat states match their frames cell for cell at 80x24 and 120x40."
trigger_phrases:
  - "chat pane and proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations/003-chat-pane-and-proof"
    last_updated_at: "2026-11-28T13:10:00Z"
    last_updated_by: "openbot-build-010-003"
    recent_action: "Built the chat pane and closed every row"
    next_safe_action: "Merge the unit branch into system-skilled-bots"
    blockers: []
    key_files:
      - ".skilled/crates/bots-tui/src/view/panes.rs"
      - ".skilled/crates/bots-tui/src/state.rs"
      - ".skilled/crates/bots-tui/tests/chat.rs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-chat-pane-and-proof"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-chat-pane-and-proof |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now talk to a bot from the screen you already watch. Open the Chat tab in `bots ui`, press `Enter`, type a line and press `Enter` again: the line goes to `bots chat <bot> --message -` on a worker of its own and the reply shows up in the transcript a moment later, while every other tab keeps reading.

### Phase 3: chat-pane-and-proof

The placeholder body is gone. The tab draws a title with the conversation and its message count, a transcript window that keeps the newest line just above a one-line composer, and at 120 columns a detail column that names the newest reply, its run, a parked item with `answer in  Inbox, Alt+2`, a failed run's reason or a redacted secret's name. Opening the tab with four bots listed opens the bot picker, and one listed bot is chosen for you.

The send never rides the read worker. A second thread runs it with no deadline, in its own process group, with stdout closed, the draft on stdin and stderr in a temporary file that is read and removed afterwards. A send that exits 0, 1 or 5 makes the pane read the transcript again. A send that exits 2 or 4 appended nothing, so the line goes back into the draft with the first stderr line in the status row and pressing `Enter` again sends it once. Quitting never waits: the run goes on and its reply lands in the conversation file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/crates/bots-tui/src/model.rs` | Modified | `Transcript`, `Message` and `Role`, with an unknown role kept as it arrived |
| `.skilled/crates/bots-tui/src/state.rs` | Modified | `Surface::Chat`, `State.chat`, `ChatView`, `ChatMode`, `ChatOk`, `ChatError`, `Effect::ChatSend`, `Msg::ChatSent`, the chat context and conditions, `on_chat_action`, `on_chat_sent`, the first-visit picker rule, the paste rule and the transcript window functions |
| `.skilled/crates/bots-tui/src/keys.rs` | Modified | `Context::Chat`, `When::ChatTab`, `When::Picking`, the four chat actions, the 19-row `CHAT_ROWS` and the table order that puts `b bot` second on footer line 2 |
| `.skilled/crates/bots-tui/src/cli.rs` | Modified | `chat_transcript` and `chat_send` with the argv of the pane contract, one shared read path and the conversation check |
| `.skilled/crates/bots-tui/src/data.rs` | Modified | The chat read route on the read worker and the `ChatWorker` thread that is dropped, never joined, on quit |
| `.skilled/crates/bots-tui/src/app.rs` | Modified | The chat worker's sender, the `Effect::ChatSend` hand-off, idle counting a chat read and a send, and a shutdown that lets the chat worker go |
| `.skilled/crates/bots-tui/src/view/panes.rs` | Modified | The chat body in place of the placeholder |
| `.skilled/crates/bots-tui/src/view/footer.rs` | Modified | One expected string in its own test, the chat tab's new footer line 1 |
| `.skilled/crates/bots-tui/tests/chat.rs`, `tests/chat/support.rs`, `tests/chat/snapshot.rs`, `tests/chat/flow.rs` | Created | The 26 frame snapshots and the exit, key, worker, quit, paste and read-back tests |
| `.skilled/crates/bots-tui/tests/common/frames.rs` | Modified | `load_frame_in` takes the design document's name, `mockups.md` stays the default |
| `.skilled/crates/bots-tui/tests/fixtures/bots` | Modified | A `chat` branch: the transcript read, the `--message -` send with its stdin line, and seven chat scenarios |
| `.skilled/crates/bots-tui/tests/fixtures/payloads/chat-*.json` | Created | Eight transcript payloads, starting from the design sample |
| `.skilled/crates/bots-tui/design/chat-mockups.md` | Created | A byte-for-byte copy of the approved chat frames |
| `.skilled/crates/bots-tui/tests/panes/chat.rs`, `snapshot.rs`, `support.rs`, `wide.rs` | Modified | The placeholder test, its two snapshots, its frame state and its wide-layout entry retired, and one chat body test in their place |
| `.skilled/crates/bots-tui/tests/render_keys.rs` | Modified | The chat rows in the drawn-label test, the chat tab's real footer in the shell snapshot and `chat_footer_draws_the_four_lines` |
| `.skilled/crates/bots-tui/README.md` | Modified | The chat tab's keys, the two calls and the worker rules |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`cli-mistral-vibe` workers on `deepseek-flash` wrote every file, in three internal waves whose live workers never shared a file. The orchestrator ran the three setup reads itself as wave 0 and read every diff and verify command after each wave. All 13 workers finished with `exit_code=0 outcome=finished`, every wave's verify passed on the first run and no retry was spent.

The plan's wave table ran its model, cli, state and data workers side by side, but the new types touch every exhaustive match in the crate, so no one of them could build alone. The build ran one vocabulary slot first instead: wave A added the types with stub arms and held every target at the floor, beside the fixture and the copied frames. Wave B added the behaviour in five files at once and wrote the frame table before the pane existed. Wave C drew the pane against those 26 frame tests, rewrote the shell and pane tests and added the flow tests. The README ran beside wave B.

The live send ran last. It used a scratch checkout with its own state root, a scratch Skilled tree and the stub executor, so no model was called. `bots-ui` ran in a pseudo terminal: `Alt+4`, `Enter`, `hello`, `Enter`, then `Ctrl+D`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One vocabulary slot before the behaviour | `Surface::Chat`, `Payload::Chat` and the `bot` field on `Fetch` break every exhaustive match, so parallel workers on cli, state and data could not have compiled one by one |
| The frame tests were written before the pane | The pane worker iterated against 26 cell-for-cell tests instead of a grep, so the frames decided the drawing |
| `rows()` splits `SHELL_ROWS` at `SHELL_SPLIT` and puts `CHAT_ROWS` between | The footer keeps table order, and `b bot` must sit after the palette label and before the two quit labels |
| The palette lists only the screen's own rows | The chat rows bind in the chat tab's own context, and the palette frame stays as it was |
| `Enter type` is guarded by `When::ChatTab` only, and the reducer does nothing without a chosen bot | The pane contract names four guards. A bot is always chosen in every approved main-context frame |
| `ChatView` gains `saved_draft` | The key map puts the saved draft back after the newest recalled line, and the frozen field list had nowhere to keep it |
| `sending to <bot>, since <HH:MM>` reads the newest human message's time | The frozen `ChatView` holds no send time, and the human message is appended before the run starts |
| The transcript window lives in `state.rs` as pure functions | The reducer clamps the scroll with the same line count the view draws |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cargo test --test chat frame_` | PASS, `test result: ok. 26 passed`, each `frame_c01_` to `frame_c13_` filter `2 passed` |
| `cargo test --test chat` filters `exit_`, `keys_`, `worker_`, `quit_`, `send_reads_back` | PASS, 5, 4, 2, 1 and 1 passed |
| `cargo test --test render_keys chat_footer` | PASS, `1 passed` |
| `cargo test --locked` whole crate | PASS. lib 148 (floor 120), answer_flow 24, chat 41 (new), cli_client 8, end_to_end 2, panes 51 with 1 ignored (floor 53, see limitations), pty_smoke 1, render_keys 17 (floor 16) |
| `cargo clippy --locked --all-targets -- -D warnings` and `cargo fmt --check` | PASS, both exit 0 |
| Runtime `npm test` and `npm run typecheck` | PASS, 55 files, 742 passed, typecheck exit 0, equal to the floor |
| Live send from the screen (T019) | PASS, `bots chat my-bot --transcript --json --repo <scratch> --skilled-tree <scratch>` piped to `jq -r '.messages[-2].text'` printed `hello`, and the stub reply landed after it |
| `rg -n 'sh -c|Command::new\("sh"' src/cli.rs` | PASS, no match, and the draft write is the one stdin line |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The pane test count went down by two.** `tests/panes` runs 51 passed and 1 ignored against a floor of 53. The two retired tests were the placeholder's own frame snapshots. The chat frames are proven by the 26 tests of `tests/chat.rs` against the chat mockups instead.
2. **A bot appears in the picker only after its first run.** The picker reads the status index, and a freshly installed bot has no row until it has run. The live probe ran the bot once with `bots run` before it opened the tab.
3. **Two literal verify lines cannot pass as written.** CHK-011 asks for an empty `footer.rs` diff, but that file's own test asserted the old chat footer, so one expected string changed and the code did not. T028 asks `rg -n 'chat'` to print four lines in `render_keys.rs`, and it prints nine. The alignment phase can reword both.
4. **The screen's own design records still name the placeholder.** `design/mockups.md` keeps the frame `Shell, Chat tab, placeholder` and `design/architecture.md` still names `chat_placeholder_names_phase_010`. Both belong to the screen's design and are left for the alignment phase.
5. **A send's stderr file outlives a quit.** The chat worker removes it after the child exits, but when the screen has already quit nobody reads it, so the file stays in the temp folder.
6. **Two unframed states draw copy the frames do not show.** No bot chosen with bots listed draws `No bot chosen. Press b to choose one.`, and the footer still draws `Enter type` there though the key does nothing. A refused send while a new draft is being written puts the refused line in front of it, joined by one space.
<!-- /ANCHOR:limitations -->

---
