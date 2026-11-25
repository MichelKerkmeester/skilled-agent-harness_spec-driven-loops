---
title: "Design: Terminal screen glyph table"
description: "The eight glyphs the screen draws, the ASCII set that replaces them, the label each carries, and the rule that meaning is never in colour alone."
trigger_phrases:
  - "terminal screen glyphs"
  - "status markers"
  - "ascii fallback set"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Terminal screen glyph table

A glyph is a shorthand for a state, and it is never the only thing that says which state. Every row that carries a glyph also carries the state's own word, so a reader who cannot see the glyph, or whose terminal renders it as a box, still reads the state.

---

## 1. THE GLYPH TABLE

The seven group ids are phase 001's, in the order `bots activity --json` returns them. The group header draws the payload's `title`; the row draws the payload's `state` id beside the glyph. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:17-41]

| Group id | Glyph | ASCII | Label drawn on the row | Meaning |
|----------|-------|-------|------------------------|---------|
| `needs_you` | `!` | `!` | `needs_you` | A run is parked on an answer |
| `working` | `·` | `*` | `working` | A run is in flight |
| `scheduled` | `○` | `o` | `scheduled` | A run is lined up and has not begun |
| `done` | `✓` | `+` | `done` | A run finished |
| `stopped` | `–` | `-` | `stopped` | The operator stopped it |
| `failed` | `✗` | `x` | `failed` | A run ended in failure |
| `recurring` | `↻` | `r` | `recurring` | A routine that runs again |
| A state the mapping does not name | `?` | `?` | the raw value | A value this table does not know |

Two characters in the table are easy to get wrong and are named here so a test can assert them: `–` is U+2013 EN DASH, not a hyphen, and `·` is U+00B7 MIDDLE DOT, not a period. The ASCII column's `-` is the hyphen-minus, which is the point of the fallback.

The first six glyphs are openhuman's, and the labels are ours: openhuman labels its six statuses `running`, `done`, `failed`, `needs input`, `cancelled` and `stale`, while this screen draws the runtime's own group id so the row and the payload cannot drift apart. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:6-33]

---

## 2. THE THREE GLYPHS THIS PHASE ADDS

The pre-expansion table had six markers and used `?` for three different things: a run that had not begun, a routine that runs again, and a value the mapping did not name. The operator approved three new glyphs so each reads as itself. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:218]

| Glyph | Replaces | Why it is its own glyph |
|-------|----------|-------------------------|
| `○` | `?` for `scheduled` | A run that has not begun is a known state with a known meaning, not an unknown value |
| `↻` | `?` for `recurring` | A routine that runs again is a different thing from a run that has not started |
| `?` | `?` for all three | `?` now means one thing only: a value this table does not name |

---

## 3. THE UNKNOWN VALUE

A `state` the table does not name draws `?` and the raw value beside it, never a blank cell and never a guess. The row reads `? some-new-state`, so a runtime that adds a group id is visible on the screen the day it ships rather than silently dropped. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:218]

The same rule covers a missing field: a row with no `state` draws `?` and the word `missing`, so an incomplete payload is a visible row rather than a skipped one.

---

## 4. THE INBOX DOES NOT USE THESE GLYPHS

An inbox item's `state` is `open`, `answered` or `expired`, and the pane lists the open and the expired ones. None of those is one of the seven group ids, so the inbox draws its state as a word and no glyph. Reusing `–` for `expired` would read as `stopped`, which is a different fact about a different record. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153]

| Item state | Drawn | Answerable |
|------------|-------|------------|
| `open` | `!` in the gutter, the word `open`, the question | Yes |
| `expired` | No glyph, the word `expired`, dimmed | No: the keys are disabled and the overlay says the item is no longer open |
| `answered` | Not listed by `bots inbox --json`; `--all` lists it with the word `answered` | No |

An expired item stays visible because the operator needs to know it existed and went unanswered. It cannot be answered because the runtime would refuse it, and a screen that offers a key the runtime refuses is a screen that lies. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/src/components/ApprovalCard.tsx:93-95] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/src/components/ApprovalCard.tsx:466-467]

---

## 5. THE ASCII FALLBACK SET

`* + x ! - o r ?` replaces `· ✓ ✗ ! – ○ ↻ ?` in the same order. The set is chosen by one flag, `--ascii`, and never by an environment variable: the binary reads no environment variable of its own, so the `ui` verb translates the operator's request into the flag. The same rule gives `--mono` its route, described in section 6.

| Selector | Where it is read | What it changes |
|----------|------------------|-----------------|
| `bots ui --ascii` | The `ui` verb, then the binary's `--ascii` flag | Every glyph draws its ASCII column |
| `NO_COLOR` | The `ui` verb, then the binary's `--mono` flag | Every colour resets, as section 6 says |

The fallback is a whole set rather than a per-glyph substitution, because a frame that mixes `✓` with `x` reads as two different tables. A test asserts that every glyph in the Unicode column has a non-empty ASCII column and that the two columns are the same length.

---

## 6. COLOUR IS NEVER THE MEANING

System is the default palette and Mono is the one `NO_COLOR` selects. In Mono every colour resets, so a frame drawn in Mono is the same frame with the same glyphs and the same labels. That is the test of whether colour was carrying meaning: if the Mono frame still reads, colour was decoration. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:61-82] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:61-62]

| Element | System | Mono | What carries the meaning |
|---------|--------|------|--------------------------|
| A row's state | The glyph's colour | Reset | The glyph and the state word |
| The focused row | Reverse video | Reverse video | The `›` mark in the gutter |
| The active tab | Reverse video | Reverse video | The `[ ]` around the tab name |
| The stale flag | Yellow | Reset | The words `stale 2m` |
| A refusal | Red | Reset | The stderr line in the status row |

Focus is a `›` mark plus reverse video, never reverse video alone, because a terminal that ignores the reverse attribute would otherwise show no focus at all.

---

## 7. SOURCES

| What the table follows | Pointer |
|------------------------|---------|
| The six status markers and their labels | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/activity.rs:6-33] |
| The seven activity groups, in order | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:17-41] |
| The activity row shape, whose `state` is a group id | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:152] |
| The inbox item shape, whose `state` is `open`, `answered` or `expired` | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:153] |
| The System and Mono palettes | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:61-82] |
| `NO_COLOR` starting in Mono | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:61-62] |
| Control characters stripped before drawing | [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:87-93] |
| The expired card, visible and unanswerable | [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/src/components/ApprovalCard.tsx:93-95] |
| The three glyphs this phase adds | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:218] |
| The unknown value drawn with its raw text | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:218] |
