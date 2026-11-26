---
title: "Design: Chat pane mockups"
description: "One ASCII frame per chat pane state at 80x24 and 120x40, drawn in the terminal screen's frame grammar, with the rule for how each message role draws in the transcript."
trigger_phrases:
  - "chat pane mockups"
  - "bots ui chat frames"
  - "chat tab 80x24 120x40"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Chat pane mockups

Every frame below is a state the Chat tab can be in, drawn at the two sizes the terminal screen fixes. The frames replace the one placeholder frame the screen draws today. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:311-386] A frame is a contract in the same sense the screen's frames are: the build draws cells and decides no layout.

The frames are ours. openhuman's composer is a design reference for the draft line and its history, and its client is GPL-3.0-only, so no frame reproduces its text or code. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/composer.rs:45-53] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2]

---

## 1. THE FRAME GRAMMAR

The bands are the screen's seven, unchanged: header, tab bar, rule, body, banner, status row, two footer lines. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:21-39] The body is 17 rows at 80x24 and 33 rows at 120x40, as the screen's `body_rows()` gives. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:167] The Chat tab only decides what the body holds.

| Body row | 80x24 | 120x40 | Content |
|----------|-------|--------|---------|
| Title | 1 | 1 | `Chat · <conversation> · <n> messages`, then `· sending…` while a send is out, or `· stale <n>m` after a failed read |
| Blank | 2 | 2 | Nothing |
| Transcript window | 3 to 15 | 3 to 31 | The newest messages that fit, bottom aligned, so the newest line sits just above the composer |
| Blank | 16 | 32 | Nothing |
| Composer | 17 | 33 | `[<bot>] > ` and the draft, or `(Enter to type)` while the pane is not in text entry |

At 120 columns the body splits as the screen's does: 72 columns on the left, a `│` rule and 47 columns of detail on the right. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:33] The transcript and the composer live in the left 72 columns. The detail column draws facts about the conversation and its newest bot message, because the transcript has no selected row.

The banner, the status row and the footer do not move. The banner still counts open items, because a parked chat message is an inbox item like any other.

Trailing blanks are trimmed, as in the screen's mockups. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:39] Each frame is exactly 24 or 40 lines and its longest line is exactly its width, because the rule row is drawn full width.

---

## 2. HOW ONE MESSAGE DRAWS

A message is a label line, then its text on lines indented four columns and wrapped at the column width. One blank line separates two messages. The text is the stored `text` split on each line feed, and each line is run through the screen's control character rule before it is drawn, so a reply keeps its paragraph breaks (D10 in `contracts/decisions.md`). [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:79] The message record and its nine keys are `contracts/records.md` section 10.

| Message | Label line | Glyph | How the pane knows |
|---------|------------|-------|--------------------|
| Human message with a later bot message | `  <by> → <botId> · <HH:MM>` | none, two blank gutter columns | `role` is `human` |
| Human message with no later bot message, no send in flight | `  <by> → <botId> · <HH:MM> · no reply yet` | none | `role` is `human` and no bot message follows it in file order, which is the unanswered rule of `contracts/cli-json.md` section 3.1 |
| Human message whose send is in flight | as the first row, then one line `· <botId> · working…` under it | `·` on the working line | The pane sent it and its `ChatSent` result has not landed |
| Bot message, a reply | `✓ <botId> · <HH:MM>` | `✓` | `role` is `bot` and `text` starts with neither fixed form below |
| Bot message, a parked question | `! <botId> · <HH:MM>` | `!` | `text` starts with `needs you: `, the fixed form of `contracts/records.md` section 10 |
| Bot message, a failed run | `✗ <botId> · <HH:MM>` | `✗` | `text` starts with `failed: `, the same section's second fixed form |
| Bot message, a redacted reply | as a reply | `✓` | Nothing. The `[redacted: <name>]` token is drawn as stored, and the detail column names the secret |

The glyphs are the screen's own: `✓` done, `✗` failed, `!` needs you, `·` working, each with its ASCII fallback from the screen's glyph table. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/glyph-table.md:25-30] `<HH:MM>` is the message's `at` in UTC, read by the crate's existing `model::parse_utc`, because the crate adds no time crate (A6) and every other frame is drawn in UTC.

A window that cannot hold every message drops whole messages from the top and draws `  ↑ <n> earlier messages · PgUp` in their place, followed by a blank line, so no message is ever drawn without its label.

The composer shows the tail of a draft that is wider than its row, so the newest typed character is always on screen. A draft is one line, because `Enter` sends it and no key inserts a line feed. A stored message can still hold line feeds, which a bot reply brings (D10 in `contracts/decisions.md`).

---

## 3. THE STATE INDEX

| # | State | Context | What the frame settles |
|---|-------|---------|------------------------|
| C1 | Chat, loading | `main` | The first transcript read, before any message exists. No composer yet |
| C2 | Chat, empty | `main` | A conversation file that does not exist or holds no line. The composer is ready |
| C3 | Chat, loaded | `main` | Four messages, two bots, the human label with its arrow and the reply glyph |
| C4 | Chat, composing | `chat`, typing | The draft in the composer and the typing footer |
| C5 | Chat, sending | `chat`, typing | The human message already appended, the `working…` line, `sending…` in the title and `Enter send` gone from the footer |
| C6 | Chat, reply arrived | `main` | The new reply under the human message, the count at 6, the detail column naming the run |
| C7 | Chat, parked with its item id | `main` | The `!` glyph, the item id inside the text and the detail column pointing to the inbox |
| C8 | Chat, failed with its reason | `main` | The `✗` glyph, the reason inside the text and the status row line |
| C9 | Chat, redacted reply | `main` | The token drawn as stored and the secret's name in the detail column |
| C10 | Chat, unanswered message | `main` | A human message with no reply and no send in flight, read back after a crash or from another process |
| C11 | Chat, stale with the rows kept | `main` | A failed read that keeps the last messages, `stale 2m` in the title and the stderr line in the status row |
| C12 | Chat, load error with no rows | `main` | A failed first read: the stderr line in the body and no composer |
| C13 | Chat, bot picker | `chat`, picking | The bot list with the `›` mark, the picker footer and no composer |

Every frame uses one data set, the screen's: clock `2026-11-25T21:14:04Z`, operator `ada`, bots `archive`, `digest`, `hello` and `nightly-report`, and the open item `20261125T211204Z-7c1e9a40` that the screen's inbox frame already lists for `hello`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:159-175] The conversation is `hello`, whose default bot is `hello`.

---

## 4. THE FRAMES

Each section names the state, then draws it at 80x24 and at 120x40.

### Chat, loading

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello

  Loading…  bots chat hello --transcript --json














! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello                                                            │Detail
                                                                        │
  Loading…  bots chat hello --transcript --json                         │conversation  hello
                                                                        │default bot   hello
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, empty

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 0 messages

  No messages yet.
  Press Enter, type a line and press Enter to send it to hello.












[hello] > (Enter to type)
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 0 messages                                               │Detail
                                                                        │
  No messages yet.                                                      │conversation  hello
  Press Enter, type a line and press Enter to send it to hello.         │default bot   hello
                                                                        │messages      0
                                                                        │file          conversations/hello.jsonl
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
[hello] > (Enter to type)                                               │
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, loaded

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 4 messages



  ada → hello · 21:02
    what changed on main since yesterday?

✓ hello · 21:03
    Three merges: the lint fix, the changelog and the CI cache bump.

  ada → digest · 21:04
    @digest summarize the open review threads

✓ digest · 21:04
    Two threads wait on you: the release notes and the cache key.

[hello] > (Enter to type)
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 4 messages                                               │Detail
                                                                        │
                                                                        │conversation  hello
                                                                        │default bot   hello
                                                                        │messages      4
                                                                        │last reply    digest · 21:04
                                                                        │run           20261125T210410Z-c2a81f3e
                                                                        │file          conversations/hello.jsonl
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
  ada → hello · 21:02                                                   │
    what changed on main since yesterday?                               │
                                                                        │
✓ hello · 21:03                                                         │
    Three merges: the lint fix, the changelog and the CI cache bump.    │
                                                                        │
  ada → digest · 21:04                                                  │
    @digest summarize the open review threads                           │
                                                                        │
✓ digest · 21:04                                                        │
    Two threads wait on you: the release notes and the cache key.       │
                                                                        │
[hello] > (Enter to type)                                               │
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, composing

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 4 messages



  ada → hello · 21:02
    what changed on main since yesterday?

✓ hello · 21:03
    Three merges: the lint fix, the changelog and the CI cache bump.

  ada → digest · 21:04
    @digest summarize the open review threads

✓ digest · 21:04
    Two threads wait on you: the release notes and the cache key.

[hello] > is the release ready?
! 2 pending approvals · Alt+2 → inbox

type message · Enter send · ↑↓ history · Bksp delete · Esc leave
Ctrl+C leave · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 4 messages                                               │Detail
                                                                        │
                                                                        │conversation  hello
                                                                        │default bot   hello
                                                                        │messages      4
                                                                        │last reply    digest · 21:04
                                                                        │run           20261125T210410Z-c2a81f3e
                                                                        │file          conversations/hello.jsonl
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
  ada → hello · 21:02                                                   │
    what changed on main since yesterday?                               │
                                                                        │
✓ hello · 21:03                                                         │
    Three merges: the lint fix, the changelog and the CI cache bump.    │
                                                                        │
  ada → digest · 21:04                                                  │
    @digest summarize the open review threads                           │
                                                                        │
✓ digest · 21:04                                                        │
    Two threads wait on you: the release notes and the cache key.       │
                                                                        │
[hello] > is the release ready?                                         │
! 2 pending approvals · Alt+2 → inbox

type message · Enter send · ↑↓ history · Bksp delete · Esc leave
Ctrl+C leave · Ctrl+D exit
```

### Chat, sending

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 5 messages · sending…


  ↑ 2 earlier messages · PgUp

  ada → digest · 21:04
    @digest summarize the open review threads

✓ digest · 21:04
    Two threads wait on you: the release notes and the cache key.

  ada → hello · 21:12
    is the release ready?

· hello · working…

[hello] >
! 2 pending approvals · Alt+2 → inbox

type message · ↑↓ history · Bksp delete · Esc leave
Ctrl+C leave · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 5 messages · sending…                                    │Detail
                                                                        │
                                                                        │conversation  hello
                                                                        │default bot   hello
                                                                        │messages      5
                                                                        │sending       to hello, since 21:12
                                                                        │file          conversations/hello.jsonl
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
  ada → hello · 21:02                                                   │
    what changed on main since yesterday?                               │
                                                                        │
✓ hello · 21:03                                                         │
    Three merges: the lint fix, the changelog and the CI cache bump.    │
                                                                        │
  ada → digest · 21:04                                                  │
    @digest summarize the open review threads                           │
                                                                        │
✓ digest · 21:04                                                        │
    Two threads wait on you: the release notes and the cache key.       │
                                                                        │
  ada → hello · 21:12                                                   │
    is the release ready?                                               │
                                                                        │
· hello · working…                                                      │
                                                                        │
[hello] >                                                               │
! 2 pending approvals · Alt+2 → inbox

type message · ↑↓ history · Bksp delete · Esc leave
Ctrl+C leave · Ctrl+D exit
```

### Chat, reply arrived

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 6 messages

  ↑ 2 earlier messages · PgUp

  ada → digest · 21:04
    @digest summarize the open review threads

✓ digest · 21:04
    Two threads wait on you: the release notes and the cache key.

  ada → hello · 21:12
    is the release ready?

✓ hello · 21:14
    Yes. CI is green and the changelog is merged.

[hello] > (Enter to type)
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 6 messages                                               │Detail
                                                                        │
                                                                        │conversation  hello
                                                                        │default bot   hello
                                                                        │messages      6
                                                                        │last reply    hello · 21:14
                                                                        │run           20261125T211204Z-7c1e9a40
                                                                        │file          conversations/hello.jsonl
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
  ada → hello · 21:02                                                   │
    what changed on main since yesterday?                               │
                                                                        │
✓ hello · 21:03                                                         │
    Three merges: the lint fix, the changelog and the CI cache bump.    │
                                                                        │
  ada → digest · 21:04                                                  │
    @digest summarize the open review threads                           │
                                                                        │
✓ digest · 21:04                                                        │
    Two threads wait on you: the release notes and the cache key.       │
                                                                        │
  ada → hello · 21:12                                                   │
    is the release ready?                                               │
                                                                        │
✓ hello · 21:14                                                         │
    Yes. CI is green and the changelog is merged.                       │
                                                                        │
[hello] > (Enter to type)                                               │
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, parked with its item id

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 6 messages

  ↑ 2 earlier messages · PgUp

  ada → digest · 21:04
    @digest summarize the open review threads

✓ digest · 21:04
    Two threads wait on you: the release notes and the cache key.

  ada → hello · 21:12
    is the release ready?

! hello · 21:12
    needs you: Ship the release? (item 20261125T211204Z-7c1e9a40)

[hello] > (Enter to type)
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 6 messages                                               │Detail
                                                                        │
                                                                        │conversation  hello
                                                                        │default bot   hello
                                                                        │messages      6
                                                                        │last reply    hello · 21:12 · needs you
                                                                        │run           20261125T211204Z-7c1e9a40
                                                                        │item          20261125T211204Z-7c1e9a40
                                                                        │answer in     Inbox, Alt+2
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
  ada → hello · 21:02                                                   │
    what changed on main since yesterday?                               │
                                                                        │
✓ hello · 21:03                                                         │
    Three merges: the lint fix, the changelog and the CI cache bump.    │
                                                                        │
  ada → digest · 21:04                                                  │
    @digest summarize the open review threads                           │
                                                                        │
✓ digest · 21:04                                                        │
    Two threads wait on you: the release notes and the cache key.       │
                                                                        │
  ada → hello · 21:12                                                   │
    is the release ready?                                               │
                                                                        │
! hello · 21:12                                                         │
    needs you: Ship the release? (item 20261125T211204Z-7c1e9a40)       │
                                                                        │
[hello] > (Enter to type)                                               │
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, failed with its reason

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 6 messages

  ↑ 2 earlier messages · PgUp

  ada → digest · 21:04
    @digest summarize the open review threads

✓ digest · 21:04
    Two threads wait on you: the release notes and the cache key.

  ada → hello · 21:12
    is the release ready?

✗ hello · 21:12
    failed: executor exited 1

[hello] > (Enter to type)
! 2 pending approvals · Alt+2 → inbox
bots: chat --message exited 1: executor exited 1
Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 6 messages                                               │Detail
                                                                        │
                                                                        │conversation  hello
                                                                        │default bot   hello
                                                                        │messages      6
                                                                        │last reply    hello · 21:12 · failed
                                                                        │run           20261125T211204Z-7c1e9a40
                                                                        │reason        executor exited 1
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
  ada → hello · 21:02                                                   │
    what changed on main since yesterday?                               │
                                                                        │
✓ hello · 21:03                                                         │
    Three merges: the lint fix, the changelog and the CI cache bump.    │
                                                                        │
  ada → digest · 21:04                                                  │
    @digest summarize the open review threads                           │
                                                                        │
✓ digest · 21:04                                                        │
    Two threads wait on you: the release notes and the cache key.       │
                                                                        │
  ada → hello · 21:12                                                   │
    is the release ready?                                               │
                                                                        │
✗ hello · 21:12                                                         │
    failed: executor exited 1                                           │
                                                                        │
[hello] > (Enter to type)                                               │
! 2 pending approvals · Alt+2 → inbox
bots: chat --message exited 1: executor exited 1
Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, redacted reply

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 6 messages

  ↑ 2 earlier messages · PgUp

  ada → digest · 21:04
    @digest summarize the open review threads

✓ digest · 21:04
    Two threads wait on you: the release notes and the cache key.

  ada → hello · 21:12
    where is the release token kept?

✓ hello · 21:13
    It is [redacted: release-token], kept in the vault.

[hello] > (Enter to type)
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 6 messages                                               │Detail
                                                                        │
                                                                        │conversation  hello
                                                                        │default bot   hello
                                                                        │messages      6
                                                                        │last reply    hello · 21:13
                                                                        │run           20261125T211302Z-9e0f6b21
                                                                        │redacted      release-token
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
  ada → hello · 21:02                                                   │
    what changed on main since yesterday?                               │
                                                                        │
✓ hello · 21:03                                                         │
    Three merges: the lint fix, the changelog and the CI cache bump.    │
                                                                        │
  ada → digest · 21:04                                                  │
    @digest summarize the open review threads                           │
                                                                        │
✓ digest · 21:04                                                        │
    Two threads wait on you: the release notes and the cache key.       │
                                                                        │
  ada → hello · 21:12                                                   │
    where is the release token kept?                                    │
                                                                        │
✓ hello · 21:13                                                         │
    It is [redacted: release-token], kept in the vault.                 │
                                                                        │
[hello] > (Enter to type)                                               │
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, unanswered message

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 5 messages

  ↑ 1 earlier message · PgUp

✓ hello · 21:03
    Three merges: the lint fix, the changelog and the CI cache bump.

  ada → digest · 21:04
    @digest summarize the open review threads

✓ digest · 21:04
    Two threads wait on you: the release notes and the cache key.

  ada → hello · 21:12 · no reply yet
    is the release ready?

[hello] > (Enter to type)
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 5 messages                                               │Detail
                                                                        │
                                                                        │conversation  hello
                                                                        │default bot   hello
                                                                        │messages      5
                                                                        │unanswered    1, ada · 21:12
                                                                        │file          conversations/hello.jsonl
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
  ada → hello · 21:02                                                   │
    what changed on main since yesterday?                               │
                                                                        │
✓ hello · 21:03                                                         │
    Three merges: the lint fix, the changelog and the CI cache bump.    │
                                                                        │
  ada → digest · 21:04                                                  │
    @digest summarize the open review threads                           │
                                                                        │
✓ digest · 21:04                                                        │
    Two threads wait on you: the release notes and the cache key.       │
                                                                        │
  ada → hello · 21:12 · no reply yet                                    │
    is the release ready?                                               │
                                                                        │
[hello] > (Enter to type)                                               │
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, stale with the rows kept

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello · 4 messages · stale 2m

  ada → hello · 21:02
    what changed on main since yesterday?

✓ hello · 21:03
    Three merges: the lint fix, the changelog and the CI cache bump.

  ada → digest · 21:04
    @digest summarize the open review threads

✓ digest · 21:04
    Two threads wait on you: the release notes and the cache key.

  Messages from the last successful read stay on screen.

[hello] > (Enter to type)
! 2 pending approvals · Alt+2 → inbox
bots: chat --transcript --json exited 1: conversation file unreadable
Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello · 4 messages · stale 2m                                    │Detail
                                                                        │
                                                                        │conversation  hello
                                                                        │default bot   hello
                                                                        │messages      4
                                                                        │last reply    digest · 21:04
                                                                        │run           20261125T210410Z-c2a81f3e
                                                                        │file          conversations/hello.jsonl
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
  ada → hello · 21:02                                                   │
    what changed on main since yesterday?                               │
                                                                        │
✓ hello · 21:03                                                         │
    Three merges: the lint fix, the changelog and the CI cache bump.    │
                                                                        │
  ada → digest · 21:04                                                  │
    @digest summarize the open review threads                           │
                                                                        │
✓ digest · 21:04                                                        │
    Two threads wait on you: the release notes and the cache key.       │
                                                                        │
  Messages from the last successful read stay on screen.                │
                                                                        │
[hello] > (Enter to type)                                               │
! 2 pending approvals · Alt+2 → inbox
bots: chat --transcript --json exited 1: conversation file unreadable
Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, load error with no rows

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · hello

  bots: chat --transcript --json exited 1: conversation file unreadable

  No messages yet. The last read failed.












! 2 pending approvals · Alt+2 → inbox
bots: chat --transcript --json exited 1: conversation file unreadable
Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · hello                                                            │Detail
                                                                        │
  bots: chat --transcript --json exited 1: conversation file unreadable │conversation  hello
                                                                        │default bot   hello
  No messages yet. The last read failed.                                │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
! 2 pending approvals · Alt+2 → inbox
bots: chat --transcript --json exited 1: conversation file unreadable
Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type
Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit
```

### Chat, bot picker

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat · choose a bot

  archive
  digest
› hello
  nightly-report

  The bot you pick is the default bot of its own conversation.









! 2 pending approvals · Alt+2 → inbox

↑↓ select · Enter choose · Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat · choose a bot                                                     │Detail
                                                                        │
  archive                                                               │bot           hello
  digest                                                                │conversation  hello
› hello                                                                 │messages      4
  nightly-report                                                        │
                                                                        │
  The bot you pick is the default bot of its own conversation.          │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
                                                                        │
! 2 pending approvals · Alt+2 → inbox

↑↓ select · Enter choose · Esc close
Ctrl+C close · Ctrl+D exit
```

## 5. WHAT THE FRAMES DO NOT SHOW

| Not shown | Why, and where it is settled |
|-----------|------------------------------|
| Colour | As in the screen: meaning is in the glyph and the label, so a Mono frame is the same frame with every colour reset. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:2079] |
| The cursor in the composer | Drawn as `> ` before the draft, as the screen draws free text. The real cursor sits after the last character. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:2081] |
| A scrolled transcript | `↑` and `↓` move the window one line and `PgUp` and `PgDn` one window in the `main` context. A new message moves the window back to the bottom only when it was already at the bottom, so reading an older message is never interrupted |
| The palette over the Chat tab | The screen's palette frame, unchanged, because the palette is reached from `main` only. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:1907] |
| A send refused before anything was appended | It draws frame C4 with the refusal's first stderr line in the status row, the draft kept and no new message. `key-map-delta.md` section 4 has the rule |
| Quitting while a send is out | The screen exits at once and draws nothing more. The run goes on and its reply lands in the file, as `pane-contract.md` section 5 says, and the next open draws C6, C7 or C8 |
| The too-small screen | The screen's own frame, unchanged |

---

## 6. SOURCES

| What the frame follows | Pointer |
|------------------------|---------|
| The seven bands and their rows | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:21-39] |
| The 72 and 47 column split | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:33] |
| The placeholder these frames replace | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:311-386] |
| The five pane states and the stale title | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:45-61] |
| A transcript and a composer in one split body | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:20-40] |
| A one-line draft with a history | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/composer.rs:45-53] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/composer.rs:157-196] |
| The message record the label reads | `contracts/records.md` section 10 |
| The parked and failed text forms | `contracts/records.md` section 10 and section 17 |
| The unanswered rule | `contracts/cli-json.md` section 3.1 |
