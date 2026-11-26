---
title: "Design: Chat pane key map delta"
description: "The seventh key context, chat, added to the terminal screen's six, with every key it binds, the keys the main context gains on the Chat tab, the drawn label of each and the rules for entering and leaving text entry."
trigger_phrases:
  - "chat key map"
  - "chat input context"
  - "bots ui chat keys"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Chat pane key map delta

The screen's key map has six exclusive contexts and binds typing only inside the overlay and the palette. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:21-34] A text entry pane on a screen whose `main` context binds bare `[`, `]` and `?` needs a context of its own, or the first `?` of a question opens the palette. This file adds that context, `chat`, and the keys `main` gains on the Chat tab. Every other row of the screen's key table stays as it is.

The screen's rule holds here: a key that is not in a table is not bound, and a key that is in one is drawn in the frame that binds it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:15]

---

## 1. THE SEVENTH CONTEXT

| Context | Where it is | What is bound |
|---------|-------------|---------------|
| `chat` | The Chat tab, after `Enter` or `b` in `main` | Two modes. Typing: printable keys, `Enter`, `Backspace`, `Up`, `Down`, `Esc`, `Ctrl+C`, `Ctrl+D`. Picking: `Up`, `Down`, `Enter`, `Esc`, `Ctrl+C`, `Ctrl+D` |

The context is exclusive, like the other six. While it is active no `main` key is bound, so `Alt+2` and `[` do nothing in it. The two modes follow the overlay's pattern of one context with a typing mode inside it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:34]

The screen's `context_stack` for the Chat tab changes from `[Main]` to `[Main]` before `Enter` and `[Chat]` after it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md, section "1.12 The reducer layout", row `context_stack`] `Context` gains the variant `Chat` beside the six. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:212]

---

## 2. THE KEY TABLE

| Key | Context | Action | Drawn label | Drawn in |
|-----|---------|--------|-------------|----------|
| `Up` | `main`, Chat tab | Move the transcript window up one line | `↑↓ scroll` | Footer line 1 |
| `Down` | `main`, Chat tab | Move the transcript window down one line | `↑↓ scroll` | Footer line 1 |
| `PgUp` | `main`, Chat tab | Move the transcript window up one window | `PgUp/PgDn page` | Footer line 1 |
| `PgDn` | `main`, Chat tab | Move the transcript window down one window | `PgUp/PgDn page` | Footer line 1 |
| `Enter` | `main`, Chat tab, a bot chosen | Enter `chat` in typing mode, the draft kept from the last time | `Enter type` | Footer line 1 |
| `b` | `main`, Chat tab | Enter `chat` in picking mode | `b bot` | Footer line 2 |
| `a` to `z`, `A` to `Z`, `0` to `9`, space and punctuation | `chat`, typing | Append it to the draft | `type message` | Footer line 1 |
| `Enter` | `chat`, typing, no send in flight | Send the draft. A draft blank after trimming sends nothing | `Enter send` | Footer line 1 |
| `Up` | `chat`, typing | Put the previous sent line in the draft | `↑↓ history` | Footer line 1 |
| `Down` | `chat`, typing | Put the next sent line in the draft, or the saved draft after the newest | `↑↓ history` | Footer line 1 |
| `Backspace` | `chat`, typing | Delete the last character of the draft | `Bksp delete` | Footer line 1 |
| `Esc` | `chat`, typing | Leave `chat` for `main` and keep the draft | `Esc leave` | Footer line 1 |
| `Ctrl+C` | `chat`, typing | Leave `chat` for `main` and keep the draft, writing nothing | `Ctrl+C leave` | Footer line 2 |
| `Up` | `chat`, picking | Move the bot selection up one row | `↑↓ select` | Footer line 1 |
| `Down` | `chat`, picking | Move the bot selection down one row | `↑↓ select` | Footer line 1 |
| `Enter` | `chat`, picking | Choose the selected bot, read its conversation and return to `main` | `Enter choose` | Footer line 1 |
| `Esc` | `chat`, picking | Return to `main` and keep the bot chosen before | `Esc close` | Footer line 1 |
| `Ctrl+C` | `chat`, picking | Return to `main` and keep the bot chosen before | `Ctrl+C close` | Footer line 2 |
| `Ctrl+D` | `chat` | Quit, as in every context | `Ctrl+D exit` | Footer line 2 |

The history is the lines sent from this pane in this session, newest last and a line equal to the newest is not added twice. It follows openhuman's composer, read for shape only. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/composer.rs:157-196]

Three keys gain a meaning on the Chat tab, and each new meaning has its own context and label. `Up` and `Down` scroll in `main`, recall history while typing and select while picking. `Enter` enters typing in `main`, sends while typing and chooses while picking. `Esc` leaves typing and closes picking. No key carries two meanings inside one context and mode.

---

## 3. THE FOOTER LINES

| Context and mode | Footer line 1 | Width | Footer line 2 | Width |
|------------------|---------------|-------|---------------|-------|
| `main`, Chat tab | `Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type` | 67 | `Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit` | 53 |
| `chat`, typing | `type message · Enter send · ↑↓ history · Bksp delete · Esc leave` | 64 | `Ctrl+C leave · Ctrl+D exit` | 26 |
| `chat`, typing, a send in flight | `type message · ↑↓ history · Bksp delete · Esc leave` | 51 | `Ctrl+C leave · Ctrl+D exit` | 26 |
| `chat`, picking | `↑↓ select · Enter choose · Esc close` | 37 | `Ctrl+C close · Ctrl+D exit` | 26 |

Every line is at most 67 columns, so at 67 columns or wider every bound key is in the footer, which is the screen's REQ-010. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:207] The palette label still leads footer line 2 in `main`, so the narrow-screen rule that drops labels from the right keeps the palette reachable. `b bot` sits second on line 2 because line 1 is already 67 columns wide.

---

## 4. THE RULES

### 4.1 Entering and leaving text entry

`Enter` on the Chat tab enters typing and nothing else does. `Esc` and `Ctrl+C` leave it and keep the draft, so a half-written message survives a look at the Inbox. `Ctrl+D` quits from typing as it does from every context.

### 4.2 No tab key works while typing

`Alt+1..4`, `[`, `]`, `?` and `Ctrl+P` are unbound in `chat`. `[`, `]` and `?` are text, because a question ends in `?`. `Alt+1..4` is unbound for a second reason: on macOS, Terminal.app and iTerm send `¡™£¢` for Option+1..4 unless Option is Meta, so those keys arrive as printable characters and are typed into the draft like any other. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:88] The way to another tab is `Esc`, then the tab key, which the typing footer draws as `Esc leave`.

### 4.3 While a send is in flight

`Enter` is unbound while a send is in flight, and the footer drops `Enter send`, so one pane has at most one send out. Typing, history, `Backspace`, `Esc` and `Ctrl+C` stay bound, so the next message can be written while the bot works. Leaving `chat`, switching tabs and opening the palette are all allowed while a send is out, because the send runs on its own thread and its result lands whichever tab is drawn (`pane-contract.md` section 5).

### 4.4 A refused send

A send that exits 2 or 4 appended nothing, so the pane puts the draft back, stays in typing and draws the first stderr line in the status row. A send that exits 0, 1 or 5 appended a reply, so the draft is cleared and the pane reads the transcript again. The exit codes are the runtime's own (`contracts/refusals.md` section 1).

### 4.5 Picking a bot

The picker lists every bot id of the `kind: "bot"` rows in the last `bots status --json` read, sorted and without repeats, with the chosen bot marked `›`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:126] Choosing a bot makes it the conversation's default bot and the conversation id, because `bots chat <id>` uses the bot id as its default conversation (`routing-grammar.md` section 3). The pane opens in picking mode when the Chat tab is first selected and more than one bot is listed. With one bot listed, that bot is chosen and the pane opens in `main`. With none, the body draws `No bots installed.` and `Enter` is unbound.

---

## 5. KEYS WE DO NOT BIND

| Key | Why not |
|-----|---------|
| `Tab` for completion | The loop completes `@<bot-id>` and `/` commands with Tab, but the pane has no completion list to draw, and the screen binds no Tab anywhere. A person types the id. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:114] |
| `Left`, `Right`, `Home`, `End` | The draft is edited at its end only, which is what the screen's overlay does. A cursor that moves would need a drawn cursor position |
| `Ctrl+Enter` or `Shift+Enter` for a new line | The composer sends one line, and `Enter` sends it. A stored message can hold line feeds from a bot reply (D10 in `contracts/decisions.md`), but a typed draft has no key that inserts one |
| `PgUp`, `PgDn` while typing | They would need a label on a footer line already at 64 columns, and `Esc` then `PgUp` reaches the same scroll |
| A key that cancels a send | The run is a bot run with its own lease and record. Stopping it is not a chat action, and a killed send could leave a human message with no reply for no reason the person chose |

---

## 6. THE APPROVAL RECORD

The screen's key map is the operator's to approve, and its approval names the key set it covers, so this delta is a new approval rather than a silent edit. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:123-135]

| Field | Value |
|-------|-------|
| **Approved** | Unmet |
| **Approved by** | - |
| **Approved on** | - |
| **Key set approved** | - |
| **Recorded in** | This table and `acceptance-criteria.md` AC-008 |

---

## 7. SOURCES

| What the delta follows | Pointer |
|------------------------|---------|
| The six contexts and the exclusive rule | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:21-34] |
| The footer line rule and the 67-column floor | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:74] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:207] |
| The macOS Option key behaviour | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:88] |
| The `Context` type and the context stack | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:212] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md, section "1.12 The reducer layout", row `context_stack`] |
| The draft history | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/composer.rs:157-196] |
| The bot count the picker reads | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:126] |
