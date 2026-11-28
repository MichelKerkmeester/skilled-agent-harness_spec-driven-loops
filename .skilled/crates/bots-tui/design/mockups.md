---
title: "Design: Terminal screen mockups"
description: "One ASCII frame per screen state at 80x24 and 120x40, drawn from the runtime's own JSON, so the shell, the panes and the overlays are fixed before any Rust is written."
trigger_phrases:
  - "terminal screen mockups"
  - "bots ui mockups"
  - "80x24 120x40 frames"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Terminal screen mockups

Every frame below is a state the screen can be in, drawn at the two sizes the packet fixes. A frame is a contract: the shell, the panes and the overlays are settled here, so a later phase draws cells rather than deciding layout.

The frames are ours. openhuman's client is the design reference and is GPL-3.0-only, so no frame reproduces its text or its code. Each section names the file and line range whose shape it follows. [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2]

---

## 1. THE FRAME GRAMMAR

| Row | 80x24 | 120x40 | Content |
|-----|-------|--------|---------|
| 1 | 1 | 1 | Header: bot count, index age, and the stale flag or `status failed` from the last `status --json` read |
| 2 | 2 | 2 | Tab bar, the active tab in `[ ]` |
| 3 | 3 | 3 | Rule |
| 4 | 4-20 | 4-36 | Body: the pane, or the overlay panel |
| 5 | 21 | 37 | Banner: the open item count, or blank |
| 6 | 22 | 38 | Status row: the first stderr line of the last failed call, or blank |
| 7 | 23-24 | 39-40 | Footer, two lines, generated from the key table |

The body is 17 rows at 80x24 and 33 rows at 120x40, and the list draws `body - 2` of them, so 15 list lines at 80x24 and 31 at 120x40. The two rows the body spends are the pane title and the blank under it. At 120 columns or wider the body splits into 72 columns of list, a `│` rule and 47 columns of detail for the selected row. Below 120 columns the detail lives in the overlay instead. The split is the one openhuman draws for its transcript and composer, narrowed to a list and a detail pane. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:20-40]

Two footer lines rather than one, because the packet requires every bound key to be drawn in the frame that binds it, and one 80-column line cannot hold the tab keys, the list keys and the quit keys together. The footer is generated from the key table, so a key with no label cannot be bound. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:95-105]

Line 1 carries the tab, list and open keys, and line 2 the command and exit keys. The inbox is the one context that adds `Enter open` to line 1, because opening an item is the one action its list binds beyond moving the selection. The answer keys appear only in the overlay footers, where they are bound.

Trailing blanks are trimmed in this document. Each frame is exactly 24, 40 or 7 lines, and its longest line is at most its width, so a reader can check the height and the ceiling without counting spaces.

---

## 2. THE STATE INDEX

| # | State | Components in the frame | What the frame settles |
|---|-------|-------------------------|------------------------|
| 1 | Shell, Activity tab, rows | Header, tab bar, activity, banner, footer | The seven groups in order, one glyph per group, the detail column at 120. The list is 17 lines against a 15-line page at 80x24, so that frame shows the first 15 and the two Recurring rows sit one page-step below. The 120x40 frame shows all 17 |
| 2 | Shell, Inbox tab, open and expired items | Header, tab bar, inbox, banner, footer | An open item and an expired item side by side, the expired row with no glyph, `Enter open` in the footer |
| 3 | Shell, Routines tab, rows | Header, tab bar, routines, banner, footer | The four-part sentence on two lines, the state line under it |
| 4 | Shell, Chat tab, placeholder | Header, tab bar, chat | One line naming phase 010, no state |
| 5 | Activity, loading | Activity | The first read, before any row exists |
| 6 | Activity, empty | Activity, detail column | The empty message, and the detail column with no selection |
| 7 | Activity, stale with the rows kept | Header, activity, status row | The pane title's `stale 2m`, the kept rows, the stderr line |
| 8 | Activity, error with no rows | Header, activity, status row | The stderr line in the body, no rows |
| 9 | Inbox, loading | Inbox | The first read of the inbox, before any item exists |
| 10 | Inbox, empty, banner hidden | Inbox, banner | A blank banner row, so the body does not move when an item arrives |
| 11 | Inbox, stale with the rows kept | Header, inbox, status row | The kept items, the pane title's `stale 2m`, the stderr line |
| 12 | Inbox, error with no rows | Header, inbox, status row | The stderr line in the body, no items |
| 13 | Routines, loading | Routines | The first read of the routines, before any routine exists |
| 14 | Routines, empty | Routines | The empty message that says what a routine is |
| 15 | Routines, stale with the rows kept | Header, routines, status row | The kept routines, the pane title's `stale 2m`, the stderr line |
| 16 | Routines, error with no rows | Header, routines, status row | The stderr line in the body, no routines |
| 17 | Header, status failed, rows kept | Header, activity, status row | `status failed` in the header, the rows kept, the stderr line |
| 18 | Decision overlay, idle | Decision overlay, footer | The no-options shape: `t`, `n`, `y`, `Esc`, and no grant line |
| 19 | Decision overlay, typing | Decision overlay, footer | The typed answer, the shortcuts paused, `Enter` and `Bksp` |
| 20 | Decision overlay, sending | Decision overlay, footer | The in-flight lock: every answer key dimmed, `sending…` in the panel |
| 21 | Decision overlay, refused | Decision overlay, status row | The refusal line, the keys unlocked |
| 22 | Decision overlay, gone | Decision overlay, footer | The item closed under the overlay, every key but `Esc` and `Ctrl+C` disabled |
| 23 | Decision overlay, grant present | Decision overlay, footer | The grant kind and rung drawn because the item carries them |
| 24 | Choice overlay, numbered options | Choice overlay, footer | `1` to `9` pick, `n` denies, no `y` |
| 25 | Palette and help, filtered | Palette | The filter line, the matched commands, the palette keys |
| 26 | Too-small screen, below 24 columns or 8 rows | Too-small screen | The one message drawn below 24 columns or 8 rows |
| 27 | Inbox, answered row | Header, tab bar, inbox, banner, footer | The answered row's outcome word in place of its state word and no `!` mark, kept until the next successful inbox read. The row is not counted as open, so the pane title and the banner count one open item |

---

## 3. THE FRAMES

Each section names the state, then draws it at 80x24 and at 120x40. The too-small screen is drawn at 30x7, a size below the 8-row floor. The message is 23 columns, so it fits whole at 23 columns.

<!-- Generated frame set for the 001 design packet. Every frame is exactly 80x24, 120x40 or 30x7 cells. -->

### Shell, Activity tab, rows

**80x24**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Activity · 7 groups · 10 rows

Needs you
› ! hello            needs_you   2m ago
  ! digest           needs_you   9m ago
Working
  · nightly-report   working     now
Scheduled
  ○ digest           scheduled   in 3h
  ○ nightly-report   scheduled   in 5h
Done
  ✓ hello            done        12m ago
Stopped
  – archive          stopped     1h ago
Failed
  ✗ nightly-report   failed      4m ago
Recurring
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Activity · 7 groups · 10 rows                                           

Needs you                                                               │Detail
› ! hello            needs_you   2m ago                                 │
  ! digest           needs_you   9m ago                                 │bot       hello
Working                                                                 │identity  skilled-scratch/hello
  · nightly-report   working     now                                    │state     needs_you
Scheduled                                                               │at        2026-11-25T21:12:04Z
  ○ digest           scheduled   in 3h                                  │actor     ada
  ○ nightly-report   scheduled   in 5h                                  │runId     20261125T211204Z-7c1e9a40
Done                                                                    │
  ✓ hello            done        12m ago                                │
Stopped                                                                 │
  – archive          stopped     1h ago                                 │
Failed                                                                  │
  ✗ nightly-report   failed      4m ago                                 │
Recurring                                                               │
  ↻ digest           recurring   every 6h                               │
  ↻ nightly-report   recurring   daily 02:00                            │
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

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Shell, Inbox tab, open and expired items

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Inbox · 2 open · 1 expired

  › ! hello            open     2m ago   Ship the release?
    ! digest           open     9m ago   Which channel?
      archive          expired  1h ago   Delete the old runs?

Expired items stay listed and cannot be answered.










! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Inbox · 2 open · 1 expired                                              │Detail
                                                                        │
  › ! hello            open     2m ago   Ship the release?              │id        20261125T211204Z-7c1e9a40
    ! digest           open     9m ago   Which channel?                 │botId     hello
      archive          expired  1h ago   Delete the old runs?           │kind      decision
                                                                        │state     open
Expired items stay listed and cannot be answered.                       │at        2026-11-25T21:12:04Z
                                                                        │expiresAt 2026-11-26T21:12:04Z
                                                                        │options   none
                                                                        │
                                                                        │Enter opens the overlay.
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

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Shell, Routines tab, rows

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────
Routines · 2 routines

  › digest
    starts  every 6h · does tell · until "the digest is sent"
    state   enabled · streak 0

    nightly-report
    starts  daily 02:00 · does act · until "the report is filed"
    state   enabled · streak 1








! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Routines · 2 routines                                                   │Detail
                                                                        │
  › digest                                                              │botId     digest
    starts  every 6h · does tell · until "the digest is sent"           │what      the morning digest
    state   enabled · streak 0                                          │starts    every 6h
                                                                        │does      tell
    nightly-report                                                      │until     the digest is sent
    starts  daily 02:00 · does act · until "the report is filed"        │untilMetAt -
    state   enabled · streak 1                                          │streak    0
                                                                        │switch    enabled
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

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Shell, Chat tab, placeholder

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────
Chat

  The chat pane lands with phase 010 (`bots chat <id>`).
  This tab holds no state until then.













! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox   3 Routines  [4 Chat]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Chat                                                                    │
                                                                        │
  The chat pane lands with phase 010 (`bots chat <id>`).                │
  This tab holds no state until then.                                   │
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

Alt+1..4 tabs · [ ] cycle
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Activity, loading

**80x24**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Activity

  Loading…  bots activity --json














! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Activity                                                                │
                                                                        │
  Loading…  bots activity --json                                        │
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
                                                                        │
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Activity, empty

**80x24**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Activity

  No activity yet.
  A run appears here once a bot has run.















Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Activity                                                                │Detail
                                                                        │
  No activity yet.                                                      │No row selected.
  A run appears here once a bot has run.                                │
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


Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Activity, stale with the rows kept

**80x24**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Activity · stale 2m

Needs you
› ! hello            needs_you   2m ago
  ! digest           needs_you   9m ago
Working
  · nightly-report   working     now
Scheduled
  ○ digest           scheduled   in 3h
Done
  ✓ hello            done        12m ago
Stopped
  – archive          stopped     1h ago
Failed
  ✗ nightly-report   failed      4m ago
Recurring
  ↻ digest           recurring   every 6h
! 2 pending approvals · Alt+2 → inbox
bots: activity --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Activity · stale 2m                                                     │Detail
                                                                        │
Needs you                                                               │bot       hello
› ! hello            needs_you   2m ago                                 │identity  skilled-scratch/hello
  ! digest           needs_you   9m ago                                 │state     needs_you
Working                                                                 │at        2026-11-25T21:12:04Z
  · nightly-report   working     now                                    │actor     ada
Scheduled                                                               │runId     20261125T211204Z-7c1e9a40
  ○ digest           scheduled   in 3h                                  │
Done                                                                    │
  ✓ hello            done        12m ago                                │
Stopped                                                                 │
  – archive          stopped     1h ago                                 │
Failed                                                                  │
  ✗ nightly-report   failed      4m ago                                 │
Recurring                                                               │
  ↻ digest           recurring   every 6h                               │
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
bots: activity --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Activity, error with no rows

**80x24**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Activity

  bots: activity --json exited 1: index locked

  No rows yet. The last read failed.












! 2 pending approvals · Alt+2 → inbox
bots: activity --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Activity                                                                │
                                                                        │
  bots: activity --json exited 1: index locked                          │
                                                                        │
  No rows yet. The last read failed.                                    │
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
bots: activity --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Inbox, loading

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Inbox

  Loading…  bots inbox --json
















Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Inbox                                                                   │
                                                                        │
  Loading…  bots inbox --json                                           │
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
                                                                        │


Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Inbox, empty, banner hidden

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Inbox

  No open or expired items.
  A bot that needs an answer appears here.















Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Inbox                                                                   │
                                                                        │
  No open or expired items.                                             │
  A bot that needs an answer appears here.                              │
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


Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Inbox, stale with the rows kept

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Inbox · stale 2m

  › ! hello            open     2m ago   Ship the release?
    ! digest           open     9m ago   Which channel?
      archive          expired  1h ago   Delete the old runs?

Expired items stay listed and cannot be answered.










! 2 pending approvals · Alt+2 → inbox
bots: inbox --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Inbox · stale 2m                                                        │Detail
                                                                        │
  › ! hello            open     2m ago   Ship the release?              │id        20261125T211204Z-7c1e9a40
    ! digest           open     9m ago   Which channel?                 │botId     hello
      archive          expired  1h ago   Delete the old runs?           │kind      decision
                                                                        │state     open
Expired items stay listed and cannot be answered.                       │at        2026-11-25T21:12:04Z
                                                                        │expiresAt 2026-11-26T21:12:04Z
                                                                        │options   none
                                                                        │
                                                                        │Enter opens the overlay.
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
bots: inbox --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Inbox, error with no rows

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Inbox

  bots: inbox --json exited 1: index locked

  No rows yet. The last read failed.













bots: inbox --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Inbox                                                                   │
                                                                        │
  bots: inbox --json exited 1: index locked                             │
                                                                        │
  No rows yet. The last read failed.                                    │
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

bots: inbox --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Routines, loading

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────
Routines

  Loading…  bots routines --json














! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Routines                                                                │
                                                                        │
  Loading…  bots routines --json                                        │
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
                                                                        │
! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Routines, empty

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────
Routines

  No routine yet.
  A routine is the four-part block in a BOT.md: what it does,
  when it starts, whether it acts or tells, and when it is done.












! 2 pending approvals · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Routines                                                                │
                                                                        │
  No routine yet.                                                       │
  A routine is the four-part block in a BOT.md: what it does,           │
  when it starts, whether it acts or tells, and when it is done.        │
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

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Routines, stale with the rows kept

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────
Routines · stale 2m

  › digest
    starts  every 6h · does tell · until "the digest is sent"
    state   enabled · streak 0

    nightly-report
    starts  daily 02:00 · does act · until "the report is filed"
    state   enabled · streak 1








! 2 pending approvals · Alt+2 → inbox
bots: routines --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Routines · stale 2m                                                     │Detail
                                                                        │
  › digest                                                              │botId     digest
    starts  every 6h · does tell · until "the digest is sent"           │what      the morning digest
    state   enabled · streak 0                                          │starts    every 6h
                                                                        │does      tell
    nightly-report                                                      │until     the digest is sent
    starts  daily 02:00 · does act · until "the report is filed"        │untilMetAt -
    state   enabled · streak 1                                          │streak    0
                                                                        │switch    enabled
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
bots: routines --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Routines, error with no rows

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────
Routines

  bots: routines --json exited 1: index locked

  No rows yet. The last read failed.












! 2 pending approvals · Alt+2 → inbox
bots: routines --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity   2 Inbox  [3 Routines]  4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Routines                                                                │
                                                                        │
  bots: routines --json exited 1: index locked                          │
                                                                        │
  No rows yet. The last read failed.                                    │
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
bots: routines --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Header, status failed, rows kept

**80x24**

```text
bots · 4 bots · index 12s ago                                      status failed
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Activity · 7 groups · 10 rows

Needs you
› ! hello            needs_you   2m ago
  ! digest           needs_you   9m ago
Working
  · nightly-report   working     now
Scheduled
  ○ digest           scheduled   in 3h
  ○ nightly-report   scheduled   in 5h
Done
  ✓ hello            done        12m ago
Stopped
  – archive          stopped     1h ago
Failed
  ✗ nightly-report   failed      4m ago
Recurring
! 2 pending approvals · Alt+2 → inbox
bots: status --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago                                                                              status failed
 [1 Activity]  2 Inbox   3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Activity · 7 groups · 10 rows                                           

Needs you                                                               │Detail
› ! hello            needs_you   2m ago                                 │
  ! digest           needs_you   9m ago                                 │bot       hello
Working                                                                 │identity  skilled-scratch/hello
  · nightly-report   working     now                                    │state     needs_you
Scheduled                                                               │at        2026-11-25T21:12:04Z
  ○ digest           scheduled   in 3h                                  │actor     ada
  ○ nightly-report   scheduled   in 5h                                  │runId     20261125T211204Z-7c1e9a40
Done                                                                    │
  ✓ hello            done        12m ago                                │
Stopped                                                                 │
  – archive          stopped     1h ago                                 │
Failed                                                                  │
  ✗ nightly-report   failed      4m ago                                 │
Recurring                                                               │
  ↻ digest           recurring   every 6h                               │
  ↻ nightly-report   recurring   daily 02:00                            │
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
bots: status --json exited 1: index locked
Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

### Decision overlay, idle

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
 ┌ Approval ──────────────────────────────────────────────────────────────────┐
 │ hello · open · 2m ago                                                      │
 │                                                                            │
 │ Ship the release?                                                          │
 │                                                                            │
 │ options  none                                                              │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │ status   ready                                                             │
 └────────────────────────────────────────────────────────────────────────────┘


t type · n deny · y approve once · Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────








          ┌ Approval ────────────────────────────────────────────────────────────────────────────────────────┐
          │ hello · open · 2m ago                                                                            │
          │                                                                                                  │
          │ Ship the release?                                                                                │
          │                                                                                                  │
          │ options  none                                                                                    │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │ status   ready                                                                                   │
          └──────────────────────────────────────────────────────────────────────────────────────────────────┘










t type · n deny · y approve once · Esc close
Ctrl+C close · Ctrl+D exit
```

### Decision overlay, typing

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
 ┌ Approval ──────────────────────────────────────────────────────────────────┐
 │ hello · open · 2m ago                                                      │
 │                                                                            │
 │ Ship the release?                                                          │
 │                                                                            │
 │ options  none                                                              │
 │                                                                            │
 │ answer   > ship it after the freeze                                        │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │ status   typing · single-key shortcuts paused                              │
 └────────────────────────────────────────────────────────────────────────────┘


type answer · Enter send · Bksp delete · Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────








          ┌ Approval ────────────────────────────────────────────────────────────────────────────────────────┐
          │ hello · open · 2m ago                                                                            │
          │                                                                                                  │
          │ Ship the release?                                                                                │
          │                                                                                                  │
          │ options  none                                                                                    │
          │                                                                                                  │
          │ answer   > ship it after the freeze                                                              │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │ status   typing · single-key shortcuts paused                                                    │
          └──────────────────────────────────────────────────────────────────────────────────────────────────┘










type answer · Enter send · Bksp delete · Esc close
Ctrl+C close · Ctrl+D exit
```

### Decision overlay, sending

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
 ┌ Approval ──────────────────────────────────────────────────────────────────┐
 │ hello · open · 2m ago                                                      │
 │                                                                            │
 │ Ship the release?                                                          │
 │                                                                            │
 │ options  none                                                              │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │ status   sending…  keys locked                                             │
 └────────────────────────────────────────────────────────────────────────────┘


Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────








          ┌ Approval ────────────────────────────────────────────────────────────────────────────────────────┐
          │ hello · open · 2m ago                                                                            │
          │                                                                                                  │
          │ Ship the release?                                                                                │
          │                                                                                                  │
          │ options  none                                                                                    │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │ status   sending…  keys locked                                                                   │
          └──────────────────────────────────────────────────────────────────────────────────────────────────┘










Esc close
Ctrl+C close · Ctrl+D exit
```

### Decision overlay, refused

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
 ┌ Approval ──────────────────────────────────────────────────────────────────┐
 │ hello · open · 2m ago                                                      │
 │                                                                            │
 │ Ship the release?                                                          │
 │                                                                            │
 │ options  none                                                              │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │ status   bots: answer-not-approver                                         │
 └────────────────────────────────────────────────────────────────────────────┘

bots: answer-not-approver
t type · n deny · y approve once · Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────








          ┌ Approval ────────────────────────────────────────────────────────────────────────────────────────┐
          │ hello · open · 2m ago                                                                            │
          │                                                                                                  │
          │ Ship the release?                                                                                │
          │                                                                                                  │
          │ options  none                                                                                    │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │ status   bots: answer-not-approver                                                               │
          └──────────────────────────────────────────────────────────────────────────────────────────────────┘









bots: answer-not-approver
t type · n deny · y approve once · Esc close
Ctrl+C close · Ctrl+D exit
```

### Decision overlay, gone

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
 ┌ Approval ──────────────────────────────────────────────────────────────────┐
 │ hello · open · 2m ago                                                      │
 │                                                                            │
 │ Ship the release?                                                          │
 │                                                                            │
 │ options  none                                                              │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │ status   This item is no longer open. Esc closes.                          │
 └────────────────────────────────────────────────────────────────────────────┘


Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────








          ┌ Approval ────────────────────────────────────────────────────────────────────────────────────────┐
          │ hello · open · 2m ago                                                                            │
          │                                                                                                  │
          │ Ship the release?                                                                                │
          │                                                                                                  │
          │ options  none                                                                                    │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │ status   This item is no longer open. Esc closes.                                                │
          └──────────────────────────────────────────────────────────────────────────────────────────────────┘










Esc close
Ctrl+C close · Ctrl+D exit
```

### Decision overlay, grant present

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
 ┌ Approval ──────────────────────────────────────────────────────────────────┐
 │ hello · open · 2m ago                                                      │
 │                                                                            │
 │ Ship the release?                                                          │
 │                                                                            │
 │ options  none                                                              │
 │ grant    kind send · rung kind                                             │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │ status   ready                                                             │
 └────────────────────────────────────────────────────────────────────────────┘


t type · n deny · y approve once · Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────








          ┌ Approval ────────────────────────────────────────────────────────────────────────────────────────┐
          │ hello · open · 2m ago                                                                            │
          │                                                                                                  │
          │ Ship the release?                                                                                │
          │                                                                                                  │
          │ options  none                                                                                    │
          │ grant    kind send · rung kind                                                                   │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │ status   ready                                                                                   │
          └──────────────────────────────────────────────────────────────────────────────────────────────────┘










t type · n deny · y approve once · Esc close
Ctrl+C close · Ctrl+D exit
```

### Choice overlay, numbered options

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
 ┌ Approval ──────────────────────────────────────────────────────────────────┐
 │ digest · open · 9m ago                                                     │
 │                                                                            │
 │ Which channel?                                                             │
 │                                                                            │
 │   1  email                                                                 │
 │   2  chat                                                                  │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │                                                                            │
 │ status   ready                                                             │
 └────────────────────────────────────────────────────────────────────────────┘


n deny · 1-9 pick · Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────








          ┌ Approval ────────────────────────────────────────────────────────────────────────────────────────┐
          │ digest · open · 9m ago                                                                           │
          │                                                                                                  │
          │ Which channel?                                                                                   │
          │                                                                                                  │
          │   1  email                                                                                       │
          │   2  chat                                                                                        │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │                                                                                                  │
          │ status   ready                                                                                   │
          └──────────────────────────────────────────────────────────────────────────────────────────────────┘










n deny · 1-9 pick · Esc close
Ctrl+C close · Ctrl+D exit
```

### Palette and help, filtered

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────




 ┌ Commands ──────────────────────────────────────────────────────────────────┐
 │ > ex                                                                       │
 │                                                                            │
 │   Ctrl+C exit                                                              │
 │   Ctrl+D exit                                                              │
 │                                                                            │
 │                                                                            │
 └────────────────────────────────────────────────────────────────────────────┘







↑↓ select · type to filter · Bksp delete · Enter select · Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────












          ┌ Commands ────────────────────────────────────────────────────────────────────────────────────────┐
          │ > ex                                                                                             │
          │                                                                                                  │
          │   Ctrl+C exit                                                                                    │
          │   Ctrl+D exit                                                                                    │
          │                                                                                                  │
          │                                                                                                  │
          └──────────────────────────────────────────────────────────────────────────────────────────────────┘















↑↓ select · type to filter · Bksp delete · Enter select · Esc close
Ctrl+C close · Ctrl+D exit
```

### Too-small screen, below 24 columns or 8 rows

**30x7**

```text
Too small · Ctrl+D exit






```

### Inbox, answered row

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Inbox · 1 open · 1 expired

  ›   hello            approved 2m ago   Ship the release?
    ! digest           open     9m ago   Which channel?
      archive          expired  1h ago   Delete the old runs?

Expired items stay listed and cannot be answered.










! 1 pending approval · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Inbox · 1 open · 1 expired                                              │Detail
                                                                        │
  ›   hello            approved 2m ago   Ship the release?              │id        20261125T211204Z-7c1e9a40
    ! digest           open     9m ago   Which channel?                 │botId     hello
      archive          expired  1h ago   Delete the old runs?           │kind      decision
                                                                        │state     approved
Expired items stay listed and cannot be answered.                       │at        2026-11-25T21:12:04Z
                                                                        │expiresAt 2026-11-26T21:12:04Z
                                                                        │options   none
                                                                        │
                                                                        │Enter shows it is no longer open.
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
! 1 pending approval · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

---

## 4. WHAT THE FRAMES DO NOT SHOW

| Not shown | Why, and where it is settled |
|-----------|------------------------------|
| Colour | System is the default palette and Mono is the one the `ui` verb selects when `NO_COLOR` is set, by passing `--mono`. Meaning is always in the glyph and the label, so a Mono frame is the same frame with every colour reset. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:61-82] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:61-62] |
| Reverse video on the focused row | Drawn here as `›` in the gutter and `[ ]` on the active tab, so the frame reads the same in a plain-text diff. The reverse video is added on top of the mark, never instead of it. |
| The cursor in free text | Drawn as `> ` before the typed text. The real cursor sits after the last character. |
| The 5-second refresh | No frame changes when a read returns the same rows. The header's index age is the only cell that moves. |
| A 2,000-row list | The frame shows 15 list lines at 80x24 and 31 at 120x40. The list scrolls, and the selection stays visible. The frame is the window, not the list. |
| The too-small screen at 20 columns | The message is drawn truncated to the frame width, so at 20 columns it reads `Too small · Ctrl+D e`. It fits whole from 23 columns up. |
| The overlay over a scrolled list | The panel clears its own area, so the rows behind it are not drawn. The header, the tabs and the footer stay visible, which is how the operator keeps their place. |
| A grant the item does not carry | The overlay and the detail column draw a grant's kind and rung only when the item carries them. Frame 18's item carries none, so no grant line is drawn. Frame 23's item carries one, so the line is. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-001] |
| The detail column's grant lines | Frame 2's item carries no grant, so the detail column draws none. When an item carries one, the detail column draws the same grant line frame 23 draws in the overlay. |

---

## 5. THE VISUAL REFERENCES

The frames above are drawn from the payload shapes and the reference sources, not traced from a picture. These are the pictures they were checked against, and each one is named so a reader can open it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:72] The pictures are gitignored and stay local. Rows I01 to I04 and section 4 of `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md` give each one's source and sha256.

| Reference | What it shows | What the frames take from it |
|-----------|---------------|------------------------------|
| `context/screenshots/openmaus-approval-card.png` | A question card with lettered choices and a free-text field | The choice overlay's order: the question, then the numbered options |
| `context/screenshots/openmaus-moca-282-expired-card-ios.jpg` | A schedule proposal card after it expired: still visible, no longer answerable | The expired inbox row: the word `expired`, dimmed, its keys disabled |
| `context/screenshots/openmaus-tasks-routines.png` | The empty Tasks and routines page: a one-line definition of a routine, a calendar toolbar and one empty message with one action | The Routines empty frame (frame 14): say what a routine is in one line |
| `context/screenshots/rakazo-routines.png` | One routine's detail panel whose trigger reads as a schedule sentence | The trigger summary's order, schedules first |
| `context/screenshots/openhuman-demo/` | 28 captures of openhuman's own TUI, 8 at 80x24 and 20 at 120x40, each as a `.txt` and an `.ansi` | The frame grammar: the header, the tab bar, the rule, the body, the footer, and the minimum-size screen |

The openhuman captures are the only place a real terminal's output is compared with a frame here. They are read for shape, never copied: the `.ansi` files carry openhuman's own text and colour codes, and this document reproduces neither.

---

## 6. SOURCES

Every pointer below resolves in a checkout that has the gitignored `specs/system-skilled-bots/context/` folder. Section 2 of `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md` names each repo's upstream and the commit, where one is recorded. The openhuman rows are design references only: the shape is followed, the code and the text are not copied.

| What the frame follows | Pointer |
|------------------------|---------|
| The minimum-size screen and its one message | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:26-35] |
| The footer key line | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:95-105] |
| The banner above the input | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:221-229] |
| The overlay panel: list, detail, prompt, status, buttons | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/overlay.rs:2-142] |
| The numbered approval choices | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/overlay.rs:96-109] |
| The six status markers and their labels | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:6-33] |
| The System and Mono palettes | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:61-82] |
| `NO_COLOR` starting in Mono | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:61-62] |
| The seven activity groups, in order | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:17-41] |
| The routine row: what it does, when it starts, that it acts | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/routines/routines-list.tsx:57-61] |
| The routine trigger summary, schedules first | [SOURCE: specs/system-skilled-bots/context/rakazo-main/apps/web/src/pages/routines/RoutineList.tsx:15-30] |
| The activity panel's rows and error state | [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/src/components/ActivityPanel.tsx:34-50] |
| The expired card, visible and unanswerable | [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/src/components/ApprovalCard.tsx:93-95] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/src/components/ApprovalCard.tsx:466-467] |
| The card that folds away when the item is no longer pending | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/inline-approval.tsx:77-81] |
| The number key that takes the choice it stands at | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/ask-card.js:264-268] |
| Deny placed first | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:129-130] |
| The keys that lock after the first press | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:136-140] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:182-190] |
| The `typing` guard that pauses the single-key shortcuts | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:354-370] |
| The `y`/`n` prompt and the closed input that answers nothing | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:431-447] |
| The default deny this screen does not copy | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:476-487] |
| Control characters replaced with `?` before drawing | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/ui/colors.py:76-89], the nearest source, which keeps line feed and tab. The openhuman filter `safe_text` drops them and is not the model |
| The activity row shape the pane draws | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-002] |
| The routine row shape the pane draws | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-007] |
| The inbox item shape, and the grant the overlay shows | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-003] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md, REQ-001] |
| The chat verb the placeholder names | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md, REQ-001] |
| The banner's key, corrected from `Ctrl+P` | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:250] |
| The three glyphs this phase adds | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:249] |
