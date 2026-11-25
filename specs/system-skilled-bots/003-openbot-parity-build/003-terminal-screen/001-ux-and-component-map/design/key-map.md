---
title: "Design: Terminal screen key map"
description: "Every key the screen binds, the context it binds in, the action it runs and the label the frame draws for it, with the three rules that fix the pre-expansion key defects."
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
| `inbox` | The Inbox tab, no overlay | Tabs, list movement, open, the answer keys as a hint, quit |
| `list` | Any pane with rows, inside `main` or `inbox` | Up, Down, PgUp, PgDn, Enter |
| `overlay` | The decision or choice overlay, open | `y`, `n`, `1` to `9`, typing, Enter, Backspace, Esc, Ctrl+C, Ctrl+D |
| `palette` | The command palette, open | Typing to filter, Enter, Esc, Ctrl+C, Ctrl+D |
| `too-small` | Below 24 columns or 8 rows | Ctrl+D only |

A context is exclusive. While an overlay is open, no `main` key is bound, so `Alt+2` does nothing until the overlay closes. That is what keeps one key from meaning two things.

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
| `Enter` | `list` | Open the selected item's overlay | `Enter open` | Footer line 1 |
| `Enter` | `palette` | Run the selected command | `Enter select` | Palette footer |
| `Enter` | `overlay`, free text | Send the typed answer | `Enter send` | Overlay footer |
| `Esc` | `overlay`, `palette` | Close the overlay and write nothing | `Esc close` | Overlay footer |
| `y` | `overlay`, no options | Answer `approve` with `--scope once` | `y approve once` | Overlay footer |
| `n` | `overlay`, both shapes | Answer `deny` with `--scope deny` | `n deny` | Overlay footer |
| `1` to `9` | `overlay`, options | Pick the option at that position | `1-9 pick` | Overlay footer |
| Any printable character | `overlay`, free text | Append it to the answer | `type answer` | Overlay footer |
| `Backspace` | `overlay`, free text | Delete the last character | `Bksp delete` | Overlay footer |
| `Ctrl+P` | `main`, `inbox` | Open the command palette | `Ctrl+P/? commands` | Footer line 2 |
| `?` | `main`, `inbox` | Open the command palette at help | `Ctrl+P/? commands` | Footer line 2 |
| `Ctrl+C` | `main`, `inbox` | Quit, writing nothing | `Ctrl+C exit` | Footer line 2 |
| `Ctrl+C` | `overlay`, `palette` | Close the overlay, writing nothing | `Ctrl+C close` | Overlay footer line 2 |
| `Ctrl+D` | Every context | Quit | `Ctrl+D exit` | Footer line 2, and `Ctrl+D exits` on the too-small screen |

Two rows carry the same key with two meanings, and each meaning has its own context and its own label: `Enter` opens in a list, selects in the palette and sends in free text; `Ctrl+C` quits from a pane and closes from an overlay. No key carries two meanings inside one context.

---

## 3. THE THREE RULES THAT FIX THE PRE-EXPANSION KEYS

### 3.1 Digits pick options only inside an overlay

`1` to `9` are unbound in `main` and `inbox`. In the pre-expansion phase, REQ-006 picked option 1 with `1` and REQ-009 bound `1` to approve once, so one key answered two different questions. Here the digit is bound in `overlay` alone, and the overlay's shape decides what it means: with options, `1` picks the first option; with no options, `1` is unbound and does nothing. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:212]

The reference does the same: a number takes the choice it stands at, and only while a number is not being typed into the line. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/ask-card.js:264-268]

### 3.2 `[` and `]` are the fallback tab pair

Alt+1..4 is the primary binding and stays. On macOS, Terminal.app and iTerm send `¡™£¢` for Option+1..4 unless Option is set to Meta, and Ctrl+Tab is rarely delivered, so a tab bar reachable only through Alt+1..4 can be unreachable. `[` and `]` cycle the tabs and are drawn beside the Alt keys in the same label. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:213] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:351-364]

### 3.3 Ctrl+C closes or quits, and never writes

Ctrl+C has one meaning per context and neither writes. In `main` and `inbox` it quits. In `overlay` and `palette` it closes the overlay and leaves the item open. Esc does the same thing inside an overlay, so the operator has two ways out and no way to answer by accident.

The rule that makes this safe is the one the reference breaks: an unbound key does nothing. turnstone's prompt falls through to a denial for any answer that is not `y`, `yes`, `a` or `always`, so a mistyped key denies. This screen never denies on an unbound key; only `n` denies. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:476-487]

---

## 4. THE SELECTION SURVIVES A REFRESH

`Up`, `Down`, `PgUp` and `PgDn` move a selection held as an item id, never a row index. The 5-second poll reorders rows as runs finish, so a row-index selection would move under the operator's finger. When the selected id is no longer in the list, the selection falls to the nearest surviving row and the detail column says `No row selected.` rather than showing a stale row. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:214]

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
| **Approved** | Unmet |
| **Approved by** | - |
| **Approved on** | - |
| **Key set approved** | - |
| **Recorded in** | This table, and `acceptance-criteria.md` AC-007 |

The parent's phase handoff names a `decision-record.md` in this folder. This child carries none, so the same answer is also recorded as a row in the parent's `decision-record.md` when it is given, and `spec.md` section 6 names that as a deviation from the handoff's wording.

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
| The tab keys, the fallback pair and the Ctrl+C rule | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:176] |
| The answer keys and the scope each writes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:177] |
| Every bound key drawn in the frame that binds it | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:178] |
