---
title: "Design: Terminal screen component inventory"
description: "Every component the screen draws, what it reads, the keys it binds and every state it can be in, with the frame that draws each state."
trigger_phrases:
  - "terminal screen components"
  - "component inventory"
  - "component states"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Terminal screen component inventory

Thirteen components, and every one of them lists its states. A component with no state list is a component whose failure path was never designed, so the list is the point of this document rather than a summary of it.

The frame numbers in the last column are the state index in `mockups.md` section 2.

---

## 1. THE INVENTORY

| # | Component | Reads | Keys | States | Frames |
|---|-----------|-------|------|--------|--------|
| 1 | Header | `bots status --json`: the bot count, `stale`, `updatedAt` or `builtAt` when it is absent | None | `ok`, `stale`, `error` | 1, 17 |
| 2 | Tab bar | None | `Alt+1..4`, `[` `]` | `activity`, `inbox`, `routines`, `chat`; exactly one is active | 1, 2, 3, 4 |
| 3 | Activity | `bots activity --json`, its `groups[]` in payload order | `Up`, `Down`, `PgUp`, `PgDn` | `loading`, `empty`, `rows`, `stale`, `error` | 1, 5, 6, 7, 8 |
| 4 | Inbox | `bots inbox --json`, its `items[]` | `Up`, `Down`, `PgUp`, `PgDn`, `Enter` | `loading`, `empty`, `rows`, `stale`, `error`, and a row in `answered` that draws its outcome word until the next successful inbox read | 2, 9, 10, 11, 12, 27 |
| 5 | Routines | `bots routines --json` | `Up`, `Down`, `PgUp`, `PgDn` | `loading`, `empty`, `rows`, `stale`, `error` | 3, 13, 14, 15, 16 |
| 6 | Chat | None | None | `placeholder` | 4 |
| 7 | Banner | The open item count from the inbox | The inbox tab key, drawn | `hidden`, `count` | 1, 2, 10 |
| 8 | Decision overlay | The selected item, its `question`, and its `grants` when it carries them | `t`, `y`, `n`, typing, `Enter`, `Backspace`, `Esc`, `Ctrl+C`, `Ctrl+D` | `idle`, `typing`, `sending`, `refused`, `gone`, `grant present`. An expired item opens in `gone` and draws frame 22. Transitions: `../../005-answer-flow/design/state-machines.md` section 1 | 18, 19, 20, 21, 22, 23 |
| 9 | Choice overlay | The selected item's `options` | `1` to `9`, `n`, `Esc`, `Ctrl+C`, `Ctrl+D` | `idle`, `sending`, `refused`, `gone`. Transitions: `../../005-answer-flow/design/state-machines.md` section 1 | 24, 20, 21, 22 |
| 10 | Palette and help | The key table | `Ctrl+P`, `?`, `Up`, `Down`, typing, `Backspace`, `Enter`, `Esc`, `Ctrl+C`, `Ctrl+D` | `filtered` | 25 |
| 11 | Status row | The first stderr line of the last failed call | None | `blank`, `message` | 7, 8, 11, 12, 15, 16, 17, 21 |
| 12 | Detail column | The selected row | None | `shown`, `hidden`, `no selection` | 1, 6 |
| 13 | Too-small screen | None | `Ctrl+D` | `below 24 columns or 8 rows` | 26 |

Every component's state list is closed: a state not in this table is a state the screen does not have, and a frame that shows one is a defect in the frame.

The choice overlay's `sending`, `refused` and `gone` states name frames 20, 21 and 22, which draw the decision shape. The state changes the panel's status line and the footer, not the body, so the choice shape in those three states draws the same panel with its option rows in place of `options  none`. Frame 24 is the choice shape's `idle` state, and it is the one frame where the two shapes differ in the body.

---

## 2. THE FIVE STATES EVERY DATA PANE SHARES

Each surface is one value: the rows, when they were last read successfully, the last error, and whether a read is in flight. Five states fall out of that shape, and every data pane draws all five.

| State | What is true | What the pane draws |
|-------|--------------|---------------------|
| `loading` | No rows yet, a read in flight | The pane title and one line naming the verb being read |
| `empty` | A successful read with no rows, and no error | The pane title and one line saying what would appear here |
| `rows` | At least one row | The rows, the selection, and the detail column at 120 columns or wider |
| `stale` | An error, and the rows from the last successful read | The `rows` drawing unchanged, the selection and the detail column included, with the pane title reading `<Pane> · stale <n>m` in place of its counts, and the stderr line in the status row |
| `error` | An error, and no rows from the last successful read | The pane title and the first stderr line in the body |

In the `stale` state the pane's own title carries `stale <n>m` from the failed read. The `error` state has no successful read to age, so its title carries no flag. The header carries `stale <n>m` only from `status --json`, so a pane failure never puts a flag in the header.

A failed read never blanks a pane that has rows. The rows from the last successful read stay until a later read succeeds, because a screen that empties itself on a transient failure tells the operator their bots vanished. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:40]

The first stderr line goes to the status row and the rest is dropped, so a stack trace cannot push the footer off the screen. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:208]

The inbox's rows carry one more state, `answered`, and it is a row state rather than a pane state. The pane is in `rows`, and the row that was just answered draws its outcome word, `approved`, `denied` or `answered`, until the next successful inbox read. The row is not counted as open, so the banner count drops at once. The screen issues no read of its own after an answer, because the inbox read filters answered items out and an immediate read would drop the row before the word could be read. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/design/state-machines.md:253]

---

## 3. THE RULES THAT APPLY TO EVERY COMPONENT

| Rule | Why |
|------|-----|
| At most one read in flight per surface | A second request for a surface already being read is dropped, so a slow runtime cannot queue four reads of the same verb |
| Selection is the pane's row key, never a row index | The 5-second poll reorders rows, so a row index would move under the operator |
| Every drawn runtime string is sanitized | A control character in a bot id or a question moves the cursor and corrupts the frame |
| A key with no binding does nothing | Never a default deny, and never a default approve |
| Every bound key is drawn in the frame that binds it | A key the operator cannot see is a key they cannot use |
| The overlay captures the item id when it opens | A refresh that closes the item under the overlay is detected, and the overlay says so instead of writing, except while sending, where the answer's own result decides |
| A grant is drawn only when the item carries it | Packet phase 006 lands `grants` and the ladder, so a screen that required them would not build before it. The overlay and the detail column draw a grant's kind and rung when the item carries them and draw nothing where they are absent, so one frame builds now and lights up after 006. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153] |

The sanitize rule is the one with a reference implementation to follow: replace each control character, line breaks included, with `?`, and keep ordinary Unicode. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:87-93] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/ui/colors.py:4-6]

---

## 4. THE LAYOUT RULES

| Rule | 80x24 | 120x40 |
|------|-------|--------|
| Body rows | 17 | 33 |
| Detail column | Hidden; the detail lives in the overlay | 47 columns to the right of a `│` rule |
| Overlay panel | 78 wide and 17 tall, centred in the body | 100 wide and 17 tall, centred in the body. Both clip to the body when it is shorter |
| Footer | Two lines | Two lines |
| Too-small screen | Below 24 columns or 8 rows, one message and nothing else | Same |

The overlay panel is capped at 100 columns and centred, so a wide terminal does not stretch a two-line question across the whole screen. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/overlay.rs:2-12]

---

## 5. WHAT IS NOT A COMPONENT

| Thing | Why it is not one |
|-------|-------------------|
| The rule under the tabs | A divider with no state and no content |
| The refresh timer | The event source sends a Tick each second and the reducer's `next_poll_at` issues the reads. It draws nothing |
| The terminal guard | It owns no cells; it restores the terminal on exit and on panic |
| The palette's filter line | Part of the palette, not a component of its own |
| The `›` focus mark | A property of the selected row, drawn by the pane that owns the row |

---

## 6. SOURCES

| What the inventory follows | Pointer |
|----------------------------|---------|
| The component list and the keys each binds | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/ui-advisory.md:47-60] |
| The header's bot count and stale flag | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:103-114] |
| The activity groups and their order | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:17-41] |
| The activity panel's rows and error state | [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/src/components/ActivityPanel.tsx:34-50] |
| The routine row's four parts | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/routines/routines-list.tsx:57-61] |
| The routine trigger summary, schedules first | [SOURCE: specs/system-skilled-bots/context/rakazo-main/apps/web/src/pages/routines/RoutineList.tsx:15-30] |
| The item that folds away when it is no longer pending | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/approvals/inline-approval.tsx:77-81] |
| The expired card, visible and unanswerable | [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/src/components/ApprovalCard.tsx:93-95] |
| The keys that lock after the first press | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:136-140] |
| The overlay panel's cap and centring | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/overlay.rs:2-12] |
| The minimum-size screen | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:26-35] |
| Control characters replaced before drawing | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:87-93] |
| The activity row shape | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152] |
| The inbox item shape | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] |
| The routine row shape | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:173] |
| The grant the overlay shows when the item carries one | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153] |
| The chat verb the placeholder names | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:152] |
| The refusal line in the status row | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:208] |
