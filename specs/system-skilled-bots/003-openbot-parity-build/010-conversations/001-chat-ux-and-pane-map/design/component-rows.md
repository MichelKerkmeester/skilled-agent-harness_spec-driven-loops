---
title: "Design: Chat pane component rows"
description: "The rows the chat pane adds to the terminal screen's component inventory: the transcript list, the composer, the bot label, the chat status line, the bot picker and the chat detail column, each with its data source, its keys and its closed state list."
trigger_phrases:
  - "chat pane components"
  - "chat component states"
  - "transcript list composer"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Chat pane component rows

The screen's inventory lists thirteen components, and its row 6 is the Chat placeholder with one state, `placeholder`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:30] This file retires that row and adds six. The screen's rule applies: every state list is closed, and a frame that shows a state not listed is a defect in the frame. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:39]

The frame ids in the last column are the state index in `mockups.md` section 3.

---

## 1. THE ROWS

| # | Component | Reads | Keys | States | Frames |
|---|-----------|-------|------|--------|--------|
| 6 | Chat placeholder | Retired by this phase | None | None. The row stays in the screen's inventory with the note `retired by 010` so its number does not move | - |
| 14 | Transcript list | `bots chat <bot> --transcript --json`, its `messages[]` in file order (`contracts/cli-json.md` section 3.1) | `Up`, `Down`, `PgUp`, `PgDn` in `main` | `loading`, `empty`, `rows`, `stale`, `error` | C1, C2, C3, C11, C12 |
| 15 | Composer | The draft and the history the pane holds, and the chosen bot | `Enter` in `main`, then the typing rows of `key-map-delta.md` section 2 | `idle`, `typing`, `sending`, `refused`, `hidden` | C3, C4, C5, C4 with a status line, C1 |
| 16 | Bot label | The chosen bot id, and the conversation id, which is the same string | `b` in `main` | `chosen`, `none` | C3, C13 |
| 17 | Chat status line | The pane's own send state and the last failed chat call | None | `blank`, `sending`, `message` | C3, C5, C8 |
| 18 | Bot picker | The `kind: "bot"` rows of `bots status --json`, their `botId`, sorted and without repeats | The picking rows of `key-map-delta.md` section 2 | `listed`, `no bots` | C13 |
| 19 | Chat detail column | The newest bot message of the transcript, and the pane's send state | None | `shown`, `hidden` | C3 at 120x40, C3 at 80x24 |

The transcript list holds no selection. Its keys move a window over the messages, so the screen's rule that a selection is an id and never a row index has nothing to hold here. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:72]

---

## 2. WHAT EACH STATE MEANS

### 2.1 Transcript list

The list shares the five states every data pane shares, with the same meaning and the same drawing rule. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:45-61]

| State | What is true | What the list draws |
|-------|--------------|---------------------|
| `loading` | No messages yet, a read in flight | `  Loading…  bots chat <bot> --transcript --json` |
| `empty` | The read returned `messages: []` | `  No messages yet.` and one line saying how to send one |
| `rows` | At least one message | The messages, drawn by `mockups.md` section 2 |
| `stale` | A read failed and messages from the last good read exist | Those messages, `stale <n>m` in the title, the stderr line in the status row |
| `error` | A read failed and no good read happened yet | The stderr line in the body and `  No messages yet. The last read failed.` |

A failed read never blanks a list that has messages, which is the screen's rule. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:59]

The unanswered human message is a row state, not a pane state, as the screen's answered row is. It is derived on every draw: a `human` message with no `bot` message after it in file order, and no send in flight from this pane, draws `· no reply yet` on its label (C10).

### 2.2 Composer

| State | What is true | What the composer draws |
|-------|--------------|-------------------------|
| `idle` | A bot is chosen, the context is `main` | `[<bot>] > (Enter to type)` |
| `typing` | The context is `chat`, typing mode, no send in flight | `[<bot>] > <draft>` |
| `sending` | A `ChatSend` is out and its `ChatSent` has not landed | `[<bot>] > <draft>`, where the draft is the next message being written. `Enter` is unbound |
| `refused` | The last send exited 2 or 4 | `[<bot>] > <draft>` with the refused text put back. The first stderr line is in the status row |
| `hidden` | The list is `loading` or `error`, or the picker is open | No composer row |

### 2.3 Bot label

`chosen` draws the bot id in the title as the conversation and in the composer prefix as the bot. `none` happens only while the picker is open on first use, so it draws `Chat · choose a bot`.

### 2.4 Chat status line

The title suffix is the status line. `blank` adds nothing, `sending` adds `· sending…`, and `message` is the screen's own status row carrying the first stderr line of a failed chat read or send. The status row keeps the screen's source rule, so a clean transcript read never wipes a refused send's line. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:158]

### 2.5 Bot picker

`listed` draws one bot per row, the chosen one marked `›`. `no bots` draws `  No bots installed.` and binds only `Esc`, `Ctrl+C` and `Ctrl+D`.

### 2.6 Chat detail column

`shown` at 120 columns or wider: the conversation id, the default bot, the message count, then the newest bot message's bot and time, its run id and its item id with `answer in  Inbox, Alt+2` when it parked, its reason when it failed or the redacted secret's name when it holds a `[redacted: <name>]` token. `hidden` below 120 columns, where the same facts are in the transcript itself.

---

## 3. THE RULES THE SCREEN'S INVENTORY ALREADY HOLDS

| Rule | How the chat pane keeps it |
|------|----------------------------|
| At most one read in flight per surface | The transcript is one new surface, `Chat`, with its own in-flight flag |
| Every drawn runtime string is sanitized | Message text, bot ids and stderr lines go through the screen's `printable` before they are drawn [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:73] |
| A key with no binding does nothing | No chat key sends by default. Only `Enter` in typing sends |
| Every bound key is drawn in the frame that binds it | `key-map-delta.md` section 3 lists each footer line, and every label is in a frame |

---

## 4. SOURCES

| What the rows follow | Pointer |
|----------------------|---------|
| The inventory columns and the closed state rule | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:23-39] |
| The placeholder row this file retires | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:30] |
| The five data pane states | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:45-61] |
| The status row's source rule | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:158] |
| The transcript payload | `contracts/cli-json.md` section 3.1 |
| The message record | `contracts/records.md` section 10 |
