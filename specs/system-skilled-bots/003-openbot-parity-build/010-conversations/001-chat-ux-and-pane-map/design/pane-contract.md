---
title: "Design: Chat pane contract"
description: "What the chat pane reads and writes: the two bots chat calls and their argv, the transcript payload with its field table and sample, what the pane draws for each message role, the sending state and the rule that a send runs on its own worker thread, quitting with a send out and the edits the terminal screen's files need."
trigger_phrases:
  - "chat pane contract"
  - "chat transcript json"
  - "chat send worker"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Chat pane contract

The pane is a client of two `bots chat` calls and of nothing else, which is the screen's rule for every surface: it reads only through `bots ... --json`, it writes only through one verb and it opens no file under the state root. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:204] The chat verb itself is built by `../../002-conversation-runtime-and-chat-verb/`. This file fixes what the pane may assume about it.

---

## 1. THE TWO CALLS

| Call | Argv | When | Runs on | Deadline |
|------|------|------|---------|----------|
| Read | `<program> chat --transcript --json --repo <repo> -- <bot>` | On the first draw of the Chat tab, on choosing a bot, on every 5-second poll while the Chat tab is active, and once after each `ChatSent` | The screen's worker, as one `Fetch` for the new surface `Chat` | 10 seconds, the screen's read deadline [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md, section "2.3 The worker rules"] |
| Send | `<program> chat --message <text> --repo <repo> -- <bot>` | `Enter` in typing mode with a non-blank draft and no send in flight | The chat worker, section 4 | None of its own. The run's own bound applies |

`<program>` is the screen's caller-supplied program, and `<repo>` its `--repo`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:204] The `--` ends the options, so a bot id is never read as a flag. [SOURCE: .skilled/bin/bots.cjs:118-121] The text follows `--message` as one argv element and is never passed through a shell. A text that starts with `-` is accepted because `--message` joins the CLI's free-text options (`../../002-conversation-runtime-and-chat-verb/spec.md` REQ-005).

The pane sends the draft as typed, trimmed of leading and trailing whitespace. It does not parse `@<bot-id>`. The verb routes it (`routing-grammar.md`), so the pane and the loop route a line the same way.

---

## 2. THE PAYLOAD

The read prints the envelope that `contracts/cli-json.md` section 3.1 fixes and `contracts/decisions.md` D2 takes: one object with `version`, `conversationId` and `messages`. A bare array is never a payload.

| Key | Type | Null | What the pane does with it |
|-----|------|------|----------------------------|
| `version` | integer | no | Checked on read. A version above 1 is a failed read, as the screen's versioning rule says [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:660] |
| `conversationId` | string | no | Checked against the chosen bot. A mismatch is a failed read |
| `messages` | array | no | Drawn in array order, which is file order, oldest first |
| `messages[].schemaVersion` | integer | no | Not drawn |
| `messages[].id` | string | no | Not drawn. Used to keep the window still when the same messages arrive again |
| `messages[].conversationId` | string | no | Not drawn |
| `messages[].botId` | string | no | The label's bot: the addressed bot on a human message, the replying bot on a bot message |
| `messages[].role` | string, `human` or `bot` | no | Picks the label form. Any other value draws `? <raw role>` as the label and the text as stored |
| `messages[].text` | string, which may hold line feeds (D10 in `contracts/decisions.md`) | no | Split on each line feed and drawn line by line, each line after the screen's control character rule. Its prefix picks the bot glyph (section 3) |
| `messages[].at` | string, ISO 8601 UTC | no | Drawn as local `HH:MM` |
| `messages[].runId` | string | yes, every human message | Drawn in the detail column for the newest bot message |
| `messages[].by` | string | no | The human label's actor. The literal `bot` on a bot message, not drawn |

The record behind each message is `contracts/records.md` section 10. The golden the runtime's tests read is `contracts/fixtures/chat-transcript.json`. The sample the frames draw is `chat-transcript.sample.json` beside this file, and it is the file the crate's fixture copies to `tests/fixtures/payloads/chat-transcript.json`.

A missing conversation file prints the empty shape and creates nothing (`contracts/cli-json.md` section 3.1), which draws frame C2. A torn last line goes to stderr and the read still exits 0, so the pane draws the whole messages and puts that stderr line in the status row, as the screen does for a read that exits 0 and writes stderr. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md, section "1.6 State (`state.rs`)"]

---

## 3. WHAT THE PANE DRAWS PER MESSAGE

| Message | Drawn as | Frame |
|---------|----------|-------|
| `role: human` with a bot message after it | `  <by> → <botId> · <HH:MM>`, then the text | C3 |
| `role: human` with no bot message after it, no send in flight | The same label plus `· no reply yet` | C10 |
| `role: human` whose send this pane has in flight | The label, the text, then `· <botId> · working…` | C5 |
| `role: bot`, text starts `needs you: ` | `! <botId> · <HH:MM>`, then the text with its item id. The detail column names the item and `answer in  Inbox, Alt+2` | C7 |
| `role: bot`, text starts `failed: ` | `✗ <botId> · <HH:MM>`, then the text with its reason | C8 |
| `role: bot`, any other text | `✓ <botId> · <HH:MM>`, then the text. A `[redacted: <name>]` token is drawn as stored and named in the detail column | C3, C6, C9 |

The two text forms are fixed by `contracts/records.md` section 17, so the pane reads them from `text` and the record needs no tenth key. The unanswered state is derived by the reader and never printed as a key (`contracts/cli-json.md` section 3.1).

A resumed run's answer arrives as one more bot message after the parked one, in the same conversation, so an answered question draws `!` then `✓` and the pane needs no rule for it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE", row 14]

---

## 4. THE SENDING STATE AND THE CHAT WORKER

### 4.1 Why the send cannot share the screen's worker

One `bots chat --message` blocks for a whole bot run. A run is bounded by the smaller of its budget and its executor timeout, 900 seconds by default, plus a precheck of up to 60 seconds. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:80-83] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:885-887] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:155] The screen's worker runs one job at a time with a 10-second read deadline and a 30-second answer deadline. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:391-397] A send on that worker would either be killed at 30 seconds or hold every read of every pane for up to sixteen minutes. Blocking work on the UI thread is the defect the screen's worker was built to remove. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:246]

### 4.2 The rule

**A send runs on a chat worker thread of its own, never on the UI thread and never on the screen's read worker.**

| Rule | Detail |
|------|--------|
| One chat worker | `data.rs` starts a second worker beside the first, with its own job channel. The UI thread sends it `Effect::ChatSend` and nothing else |
| One send at a time | The pane binds `Enter` only when no send is in flight, so the chat worker never holds two jobs |
| Reads go on | The transcript read stays a `Fetch` on the screen's worker. The 5-second poll keeps reading while the send runs, so the human message, appended before the run starts, is drawn at the first poll after `Enter` |
| No deadline | The chat worker waits for the child however long the run takes. The run's own bound ends it |
| The result is never dropped | `Msg::ChatSent` carries no generation, as `Answered` carries none [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md, section "2.3 The worker rules"] |
| A read follows | `ChatSent` makes the reducer issue one `Fetch` for `Chat` at once, unlike an answer, because the reply is a new line the person is waiting for |
| Its own process group | The send's child starts in a process group of its own, so a signal sent to the screen's group does not stop the run |
| No stdout pipe | The child's stdout goes to null, because the pane reads the reply from the transcript, not from the send. Its stderr goes to a temporary file the worker reads after the child exits and then removes, so no pipe reader has to outlive the screen |

### 4.3 What the result does

| Send exit | Meaning (`contracts/refusals.md` section 1) | The pane |
|-----------|---------------------------------------------|----------|
| 0 | The run completed and a reply was appended | Clears the sent draft, reads the transcript, draws C6 |
| 5 | The run parked and a `needs you:` message was appended | Clears the draft, reads the transcript, draws C7 |
| 1 | The run failed and a `failed:` message was appended, or the CLI threw | Clears the draft, reads the transcript, draws C8 and puts `bots: chat --message exited 1: <first stderr line>` in the status row |
| 2 | Usage: an empty message after the address, a bad `--conversation` | Puts the draft back, appends nothing, draws the first stderr line |
| 4 | Refused: `bot-unknown`, `body-secret`, `prompt-over-budget` or another run refusal | Puts the draft back, draws the first stderr line. `bot-unknown` and `body-secret` append nothing. Any other run refusal leaves the human message with no reply, which the next read draws as C10 |
| Spawn failure | The program could not start | Puts the draft back, draws `bots-ui: chat send did not start: <error>` |

---

## 5. QUITTING WITH A SEND OUT

`Ctrl+D`, a closed input and a signal quit the screen at once even while a send is out. The screen does not wait for the chat worker, unlike an answer in flight, which it waits up to 30 seconds for. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:405-414] The send's child is not killed: it holds no pipe to the screen, it sits in its own process group and `bots chat --message` appends the reply to the file before it prints anything. So the run finishes, the reply lands in the conversation and the next open of the Chat tab, or `bots chat <bot> --transcript`, shows it. A reply that has not landed yet draws as `no reply yet` (C10) until it does.

Before it quits with a send out, the screen writes `bots-ui: a chat send is still running; its reply lands in the transcript` to the status row and draws one frame, as it does for an answer in flight.

---

## 6. THE TYPES

The screen's vocabulary gains these names. Each sits in the file the screen's owner map gives its kind. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:435-470]

```rust
pub enum Surface { Status, Activity, Inbox, Routines, Chat }   // Chat is the transcript read
pub enum Tab { Activity, Inbox, Routines, Chat }              // unchanged. Tab::Chat.surface() now answers Some(Surface::Chat)

pub struct Transcript { pub conversation_id: String, pub messages: Vec<Message> }   // model.rs, the payload of section 2
pub struct Message {                                          // model.rs, one record of contracts/records.md section 10
    pub id: String, pub bot_id: String, pub role: Role, pub text: String,
    pub at: String, pub run_id: Option<String>, pub by: String,
}
pub enum Role { Human, Bot, Unknown(String) }                 // model.rs, an unknown role kept as its raw value

pub struct ChatView {                                         // state.rs, held in State.chat_view
    pub bot: Option<BotId>,                                   // the chosen bot, which is also the conversation id
    pub mode: ChatMode,                                       // where the pane is
    pub draft: String,                                        // the line being written, kept across Esc and tab switches
    pub history: Vec<String>,                                 // lines sent from this pane, newest last
    pub history_index: Option<usize>,                         // the recalled line, None while editing the draft
    pub scroll_from_bottom: usize,                            // 0 keeps the newest message above the composer
    pub sending: Option<String>,                              // the text of the send in flight
    pub picker_selected: usize,                               // the picker's row
}
pub enum ChatMode { Main, Typing, Picking }                   // Main is the main context. Typing and Picking are the chat context's two modes

pub enum Effect { /* the screen's three, plus */ ChatSend { bot: BotId, text: String } }
pub enum Msg { /* the screen's eight, plus */ ChatSent { bot: BotId, text: String, outcome: Result<ChatOk, ChatError> } }
pub struct ChatOk { pub code: i32, pub warning: Option<String> }        // exit 0, 1 or 5: a reply was appended
pub struct ChatError { pub kind: FailKind, pub line: String }           // exit 2 or 4, or a spawn failure: nothing to read back
pub enum Context { Main, Inbox, List, Overlay, Palette, TooSmall, Chat }   // keys.rs, the seventh context
```

`State` gains `chat: Remote<Transcript>` beside the four surfaces and `chat_view: ChatView` beside the three pane views. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:127-146]

---

## 7. EDITS THE SCREEN'S FILES NEED

The screen's owner map closes most of its files to later edits inside phase 003. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:435-470] Phase 010 is a later phase with its own scope, so `../../003-chat-pane-and-proof/` makes these edits in its own change. Nothing here edits phase 003's documents.

| Screen file | Edit | Why |
|-------------|------|-----|
| `src/state.rs` | `Surface::Chat`, `Tab::Chat.surface()` returning it, `State.chat`, `State.chat_view`, `ChatView`, `ChatMode`, `Effect::ChatSend`, `Msg::ChatSent`, and an `on_chat_action` arm owned by 010 | Section 6 |
| `src/keys.rs` | `Context::Chat`, a `CHAT_ROWS` slice holding `key-map-delta.md` section 2, and `When::ChatTab`, `When::Typing`, `When::Picking`, `When::NotSending` | `key-map-delta.md` section 2 |
| `src/data.rs` | The chat worker of section 4.2 and its job channel, started and joined beside the read worker. Shutdown drops its job sender and does not join it | Sections 4 and 5 |
| `src/cli.rs` | `chat_transcript(bot)` and `chat_send(bot, text)` with the argv of section 1. `chat_send` sets the process group, stdout null and stderr to a temporary file | Section 1 and 4.2 |
| `src/model.rs` | `Transcript`, `Message`, `Role` | Section 6 |
| `src/view/panes.rs` | The chat body replaces the placeholder body: title, window, composer, the detail column at 120 | `mockups.md` |
| `tests/fixtures/bots` | A `chat` branch: `--transcript --json` prints `tests/fixtures/payloads/chat-transcript.json`, and `--message` records its argv and exits as the scenario says | The screen's fixture rule [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:212] |
| `tests/fixtures/payloads/chat-transcript.json` | A new scenario file copied from `chat-transcript.sample.json` | The screen lets a later child add a payload file and never edit one [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md, section "3. THE OWNER MAP", row `tests/fixtures/payloads/*.json`] |
| `README.md` | The chat tab's keys and the two calls | The pre-expansion phase listed it |

`src/view/footer.rs` needs no edit, because the footer is generated from the key table. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:35]

---

## 8. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| A second worker thread for the send, not the screen's worker | Section 4.1. The work order asks that the send run on a worker thread, and the screen's one worker cannot carry a call that lasts minutes. A second worker is the smallest change that keeps reads live |
| No deadline on the send | Any deadline shorter than the run's own bound would kill a run the person asked for. The runner already bounds it |
| The pane reads the reply from the transcript, never from the send's stdout | One payload shape for every message, and a send whose screen went away loses nothing |
| Quit does not wait for a send | A send can last sixteen minutes. The reply is in the file either way |
| The pane does not parse `@<bot-id>` | One parser, in the runtime, so the pane and the loop cannot route one line two ways |
| The conversation id is the chosen bot's id | It is the verb's default (`routing-grammar.md` section 3). A pane that picks another conversation is out of scope |
