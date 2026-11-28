---
title: "Design: Terminal screen key map"
description: "Every key the screen binds, the context it binds in, the action it runs and the label the frame draws for it, with the four rules that fix the pre-expansion key defects."
trigger_phrases:
  - "terminal screen key map"
  - "bots ui keys"
  - "key bindings and labels"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Terminal screen key map

This is the one table the footer is generated from. A key that is not in it is not bound, and a key that is in it must be drawn in the frame that binds it, so the label column is part of the binding rather than a caption added later.

The map is the operator's to approve. Section 6 holds the approval record, and `acceptance-criteria.md` AC-007 is the criterion that reads it.

---

## 1. THE SIX CONTEXTS

| Context | Where it is | What is bound |
|---------|-------------|---------------|
| `main` | The Activity, Routines and Chat tabs, no overlay | Tabs, list movement, palette, quit |
| `inbox` | The Inbox tab, no overlay | Tabs, list movement, open, palette, quit |
| `list` | Any pane with rows, inside `main` or `inbox` | Up, Down, PgUp, PgDn, and Enter in the inbox only |
| `overlay` | The decision or choice overlay, open | `t`, `y`, `n`, `1` to `9`, typing, Enter, Backspace, Esc, Ctrl+C, Ctrl+D |
| `palette` | The command palette, open | Typing to filter, Backspace, Up, Down, Enter, Esc, Ctrl+C, Ctrl+D |
| `too-small` | Below 24 columns or 8 rows | Ctrl+D only |

A context is exclusive. While an overlay is open, no `main` key is bound, so `Alt+2` does nothing until the overlay closes. That is what keeps one key from meaning two things. `../../005-answer-flow/design/state-machines.md` section 2 draws the contexts and every key that moves between them.

The `overlay` context has two modes inside it. Before text mode, `t`, `y`, `n`, the digits and `Esc` are shortcuts. In text mode, every printable character is text and only `Enter`, `Backspace`, `Esc`, `Ctrl+C` and `Ctrl+D` are bound. Section 3.4 says why.

A bracketed paste is not a key and has no row in the key table. It is never split into keys and it never sends. In the overlay's text mode it is appended to the typed line, each carriage return or line feed written as one space. In every other phase, on every tab and in the palette it does nothing, so a pasted `y` cannot approve and a pasted line feed cannot open the selected row. The terminal guard turns bracketed paste on, so a paste never arrives as keys. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md, section "1.7 Msg (`state.rs`)"]

---

## 2. THE KEY TABLE

| Key | Context | Action | Drawn label | Drawn in |
|-----|---------|--------|-------------|----------|
| `Alt+1` | `main`, `inbox` | Select the Activity tab | `Alt+1..4 tabs` | Footer line 1 |
| `Alt+2` | `main`, `inbox` | Select the Inbox tab | `Alt+1..4 tabs` | Footer line 1 |
| `Alt+3` | `main`, `inbox` | Select the Routines tab | `Alt+1..4 tabs` | Footer line 1 |
| `Alt+4` | `main`, `inbox` | Select the Chat tab | `Alt+1..4 tabs` | Footer line 1 |
| `[` | `main`, `inbox` | Select the previous tab, wrapping from the first to the last | `[ ] cycle` | Footer line 1 |
| `]` | `main`, `inbox` | Select the next tab, wrapping from the last to the first | `[ ] cycle` | Footer line 1 |
| `Up` | `list` | Move the selection up one row | `↑↓ select` | Footer line 1 |
| `Down` | `list` | Move the selection down one row | `↑↓ select` | Footer line 1 |
| `PgUp` | `list` | Move the selection up one page | `PgUp/PgDn page` | Footer line 1 |
| `PgDn` | `list` | Move the selection down one page | `PgUp/PgDn page` | Footer line 1 |
| `Enter` | `list`, in `inbox` | Open the selected item's overlay | `Enter open` | Footer line 1 |
| `Up` | `palette` | Move the selection up one command | `↑↓ select` | Palette footer line 1 |
| `Down` | `palette` | Move the selection down one command | `↑↓ select` | Palette footer line 1 |
| `a` to `z`, `A` to `Z`, `0` to `9`, space and punctuation | `palette` | Filter the command list | `type to filter` | Palette footer line 1 |
| `Enter` | `palette` | Run the selected command | `Enter select` | Palette footer line 1 |
| `Enter` | `overlay`, typing | Send the typed answer. A line blank after trimming sends nothing | `Enter send` | Overlay footer line 1 |
| `Esc` | `overlay`, `palette` | Close the overlay and write nothing | `Esc close` | Overlay footer line 1 |
| `t` | `overlay`, no options, not typing | Enter text mode | `t type` | Overlay footer line 1 |
| `n` | `overlay`, not typing | Answer `deny` with `--scope deny` | `n deny` | Overlay footer line 1 |
| `y` | `overlay`, no options, not typing | Answer `approve` with `--scope once` | `y approve once` | Overlay footer line 1 |
| `1` to `9` | `overlay`, options | Pick the option at that position | `1-9 pick` | Overlay footer line 1 |
| `a` to `z`, `A` to `Z`, `0` to `9`, space and punctuation | `overlay`, typing | Append it to the answer | `type answer` | Overlay footer line 1 |
| `Backspace` | `overlay`, typing | Delete the last character | `Bksp delete` | Overlay footer line 1 |
| `Backspace` | `palette` | Delete the last filter character | `Bksp delete` | Palette footer line 1 |
| `Ctrl+P` | `main`, `inbox` | Open the command palette | `Ctrl+P/? commands` | Footer line 2 |
| `?` | `main`, `inbox` | Open the command palette | `Ctrl+P/? commands` | Footer line 2 |
| `Ctrl+C` | `main`, `inbox` | Quit, writing nothing | `Ctrl+C exit` | Footer line 2 |
| `Ctrl+C` | `overlay`, `palette` | Close the overlay, writing nothing | `Ctrl+C close` | Overlay footer line 2 |
| `Ctrl+D` | Every context | Quit | `Ctrl+D exit` | Footer line 2, and the too-small message |

Two keys carry more than one meaning, and each meaning has its own context and its own label. `Enter` opens in a list, selects in the palette and sends in free text. `Ctrl+C` quits from a pane and closes from an overlay. No key carries two meanings inside one context.

The footer is two lines, and the line a label lands on follows the context rather than the key. Line 1 carries the tab and list keys and line 2 the command and exit keys. Activity and Routines draw `Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page` on line 1. The inbox draws the same line with `Enter open` added, because it is the one pane whose rows open. Chat draws `Alt+1..4 tabs · [ ] cycle` alone, because it has no rows to move through. All three draw `Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit` on line 2. The answer keys appear only in the overlay footers, so no pane footer offers a key the pane does not bind. `design/mockups.md` section 1 draws the three arrangements.

---

## 3. THE FOUR RULES THAT FIX THE PRE-EXPANSION KEYS

### 3.1 Digits pick options only inside an overlay

`1` to `9` are unbound in `main` and `inbox`. In the pre-expansion phase, REQ-006 picked option 1 with `1` and REQ-009 bound `1` to approve once, so one key answered two different questions. Here the digit is bound in `overlay` alone, and the overlay's shape decides what it means: with options, `1` picks the first option. With no options, `1` is unbound and does nothing. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:243]

The reference does the same: a number takes the choice it stands at, and only while a number is not being typed into the line. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/ask-card.js:264-268]

### 3.2 `[` and `]` are the fallback tab pair

Alt+1..4 is the primary binding and stays. On macOS, Terminal.app and iTerm send `¡™£¢` for Option+1..4 unless Option is set to Meta, and Ctrl+Tab is rarely delivered, so a tab bar reachable only through Alt+1..4 can be unreachable. `[` and `]` cycle the tabs and are drawn beside the Alt keys in the same label. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:244] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:351-364]

### 3.3 Ctrl+C closes or quits, and never writes

Ctrl+C has one meaning per context and neither writes. In `main` and `inbox` it quits. In `overlay` and `palette` it closes the overlay and leaves the item open. Esc does the same thing inside an overlay, so the operator has two ways out and no way to answer by accident.

The rule that makes this safe is the one the reference breaks: an unbound key does nothing. turnstone's prompt falls through to a denial for any answer that is not `y`, `yes`, `a` or `always`, so a mistyped key denies. This screen never denies on an unbound key. Only `n` denies. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:476-487]

### 3.4 A drawn key enters text mode, so an answer may start with `y` or `n`

`y` and `n` are shortcuts only while the overlay is not in text mode. `t` enters text mode, and from then on every printable character is text: a `y` or an `n` at the start of an answer is the first letter of the answer, not a decision. `Enter` sends the line, `Backspace` deletes, and `Esc` closes without writing.

The footer changes with the mode, so the operator can see which keys are live: `t type · n deny · y approve once · Esc close` before, and `type answer · Enter send · Bksp delete · Esc close` after. Without the mode, an answer that begins with either letter would be a decision the operator did not make, and the only way to send such an answer would be to type a leading space. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:354-370]

---

## 4. THE SELECTION SURVIVES A REFRESH

`Up`, `Down`, `PgUp` and `PgDn` move a selection held as the pane's row key, never a row index. The 5-second poll reorders rows as runs finish, so a row-index selection would move under the operator's finger. When the selected id is no longer in the list, the selection falls to the nearest surviving row, and only an empty list draws `No row selected.` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:245]

---

## 5. KEYS WE DO NOT BIND

| Key | Why not |
|-----|---------|
| `Tab`, `Shift+Tab` | openhuman cycles a focus ring with them. This screen has no hit testing and no focus ring, so Tab would move nothing and would still have to be drawn. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:307-322] |
| `Delete` | openhuman denies with it. It is not on every keyboard and a terminal may not deliver it, so `n` denies and `Delete` is unbound. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:366] |
| `Ctrl+Tab` | Rarely delivered, and `[` `]` already cycle. |
| `a`, `always` | No rule store lands in this phase, so a standing grant cannot be recorded. The overlay offers `once` and `deny` only. |
| `q` | `Ctrl+D` quits. A bare letter would collide with the palette's filter line. |
| Mouse | Out of scope: no hit testing, no click targets. |

---

## 6. THE APPROVAL RECORD

The operator approves this map, and the approval names the key set it covers so a later addition is visibly a new approval rather than a silent one.

| Field | Value |
|-------|-------|
| **Approved** | Met |
| **Approved by** | The operator, who answered "Approve both (Recommended)" when asked to approve this terminal key map and the conversations key map delta [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/decision-record.md:37] |
| **Approved on** | 2026-11-26 |
| **Key set approved** | The 29 bindings in section 2 across the six contexts in section 1 |
| **Recorded in** | This table, `acceptance-criteria.md` AC-007 and row Q001 of the build packet's `specs/system-skilled-bots/003-openbot-parity-build/decision-record.md`. The verbatim answer is in that file's appendix |

The operator approved this map on 2026-11-26 in row Q001 of the build packet's `decision-record.md`, one answer that approved this terminal key map and the conversations key map delta together. This packet's own `decision-record.md` carries an unrelated Q001 about the Inbox tab count, so the source is named by its full path. A key added to section 2 after that date is outside this approval.

---

## 7. SOURCES

| What the map follows | Pointer |
|----------------------|---------|
| Alt+1..4 selects a tab, and Ctrl+Tab cycles | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:351-364] |
| Ctrl+P opens the command palette | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:300-306] |
| Ctrl+D quits | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:295-298] |
| The decision shortcut table, and the `typing` guard that pauses it | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app/overlays.rs:354-370] |
| The footer key line | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render.rs:95-105] |
| The numbered approval choices | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/render/overlay.rs:96-109] |
| A number takes the choice it stands at | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/ask-card.js:264-268] |
| Deny placed first | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:129-130] |
| The keys that lock after the first press | [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:136-140] |
| `y`/`n` answer, and closed input answers nothing | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:431-447] |
| The default deny this screen does not copy | [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:476-487] |
| The tab keys, the fallback pair and the Ctrl+C rule | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:205] |
| The answer keys and the scope each writes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:206] |
| Every bound key drawn in the frame that binds it, deny before approve | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:207] |
