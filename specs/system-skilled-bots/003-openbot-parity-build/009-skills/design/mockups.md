---
title: "Design: the user-facing surfaces of phase 9"
description: "The terminal transcripts and the two screen frames a skill proposal produces: the propose verb at 80x24 and 120x40, the inbox listing, the answer output, the inbox row and the choice overlay the terminal screen draws."
trigger_phrases:
  - "skill propose output"
  - "skill proposal inbox row"
  - "skill proposal overlay"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The user-facing surfaces of phase 9

Two surfaces show a proposal: the `bots` command line and the terminal screen. The command line is this phase's, and the screen is phase 003's, which reads only what `bots ... --json` prints. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:41] This note draws both, so a builder of either surface has the text in front of it.

The frames follow the grammar of `003-terminal-screen/001-ux-and-component-map/design/mockups.md`: 80 columns by 24 rows and 120 columns by 40 rows, the header line, the tab line, the separator, the pane title, the rows, the banner and the two key lines. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md, section "1. THE FRAME GRAMMAR"] The row columns are the same widths that file uses: a six-character prefix, a seventeen-character `botId`, a nine-character `state` and a nine-character age.

---

## 1. `bots skill propose`, SUCCESS

**80x24**

```text
$ bots skill propose 20261125T210204Z-0b6e5f72 --name report
bots: proposal for skill report written at proposals/20261125T210204Z-0b6e5f72
```

The success line is 78 columns, so it fits an 80-column terminal without wrapping. It names the skill and the folder, and the folder is the run id.

**120x40**

```text
$ bots skill propose 20261125T210204Z-0b6e5f72 --name report
bots: proposal for skill report written at proposals/20261125T210204Z-0b6e5f72
```

The same two lines. A wider terminal changes nothing, because the verb prints one line and no table.

---

## 2. `bots skill propose`, REFUSED

**80x24**

```text
$ bots skill propose run-1
bots: run-record-missing: run-1
$ echo $?
4
```

**120x40**

```text
$ bots skill propose run-1
bots: run-record-missing: run-1
$ echo $?
4
```

The refusal prints nothing on stdout and one line on stderr, and exits 4. A usage error would exit 2 and print the usage text after its message, which is how `bots: unknown verb: skill` reads today. [SOURCE: .skilled/bin/bots.cjs:94-98]

---

## 3. `bots inbox`, THE REVIEW ITEM

**80x24**

```text
$ bots inbox
open	20261125T210204Z-0b6e5f72	skill-proposals	created 2026-11-25T21:13:30.000Z	expires 2026-11-26T21:13:30.000Z
	Propose skill report?
	- confirm
	- reject
```

The first line is 112 columns and wraps on an 80-column terminal. That is today's format for every item and not this phase's to change: the line is `state`, the id, the `botId`, `created` and `expires`, separated by tabs. [SOURCE: .skilled/bin/bots.cjs:468-473] The two option lines are new for a review item, because `options` is `["confirm", "reject"]` and the verb prints one line per option.

**120x40**

```text
$ bots inbox
open	20261125T210204Z-0b6e5f72	skill-proposals	created 2026-11-25T21:13:30.000Z	expires 2026-11-26T21:13:30.000Z
	Propose skill report?
	- confirm
	- reject
```

The same five lines. The 112-column line fits a 120-column terminal.

---

## 4. THE SCREEN'S INBOX ROW

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
Inbox · 1 open

  › ! skill-proposals  open     2m ago   Propose skill report?














! 1 pending approval · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Inbox · 1 open                                                          │Detail
                                                                        │
  › ! skill-proposals  open     2m ago   Propose skill report?          │id        20261125T210204Z-0b6e5f72
                                                                        │botId     skill-proposals
                                                                        │kind      skill-proposal
                                                                        │state     open
                                                                        │at        2026-11-25T21:13:30Z
                                                                        │expiresAt 2026-11-26T21:13:30Z
                                                                        │options   confirm, reject
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
! 1 pending approval · Alt+2 → inbox

Alt+1..4 tabs · [ ] cycle · ↑↓ select · PgUp/PgDn page · Enter open
Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit
```

The row's first column is the item's `botId`, which is the sentinel `skill-proposals`, and the detail column's `kind` line reads `skill-proposal`. The screen draws the sentinel as it draws any other `botId`, because the payload carries no flag that says the item is a review. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:545-563]

The banner counts the item, so an open review reads as one pending approval. That is the screen's rule for every open item and this phase adds no exception.

---

## 5. THE SCREEN'S CHOICE OVERLAY

A review item carries two options, so the screen draws the choice overlay rather than the free-text one.

**80x24**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────
 ┌ Approval ───────────────────────────────────────────────────────────────────┐
 │ skill-proposals · open · 2m ago                                             │
 │                                                                             │
 │ Propose skill report?                                                       │
 │                                                                             │
 │   1  confirm                                                                │
 │   2  reject                                                                 │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 │                                                                             │
 │ status   ready                                                              │
 └─────────────────────────────────────────────────────────────────────────────┘


1-9 pick · n deny · Esc close
Ctrl+C close · Ctrl+D exit
```

**120x40**

```text
bots · 4 bots · index 12s ago
  1 Activity  [2 Inbox]  3 Routines   4 Chat
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────








          ┌ Approval ─────────────────────────────────────────────────────────────────────────────────────────────────┐
          │ skill-proposals · open · 2m ago                                                                            │
          │                                                                                                            │
          │ Propose skill report?                                                                                      │
          │                                                                                                            │
          │   1  confirm                                                                                               │
          │   2  reject                                                                                                │
          │                                                                                                            │
          │                                                                                                            │
          │                                                                                                            │
          │                                                                                                            │
          │                                                                                                            │
          │                                                                                                            │
          │                                                                                                            │
          │                                                                                                            │
          │ status   ready                                                                                             │
          └────────────────────────────────────────────────────────────────────────────────────────────────────────────┘










1-9 pick · n deny · Esc close
Ctrl+C close · Ctrl+D exit
```

The overlay's first line is `botId · state · age`, the second block is the question, and the numbered rows are the item's `options` in order. Pressing `1` sends the literal `confirm` and pressing `2` sends `reject`, because the screen sends the option's own text. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/design/state-machines.md, section "4.1 The argv per answer kind"] `n` sends `deny`, which the claim reads as `reject` with the scope `deny`.

---

## 6. `bots answer`, THE RECORDED REVIEW

**80x24**

```text
$ bots answer 20261125T210204Z-0b6e5f72 confirm
bots: item 20261125T210204Z-0b6e5f72 answered; skill-proposal review recorded
```

The line is 77 columns. It is the text `contracts/answer-seam.md` fixes for a settled review, with the kind filled in. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1.1 What the caller sees"]

**120x40**

```text
$ bots answer 20261125T210204Z-0b6e5f72 confirm
bots: item 20261125T210204Z-0b6e5f72 answered; skill-proposal review recorded
```

---

## 7. `bots answer`, THE STALE PIN

**80x24**

```text
$ bots answer 20261125T210204Z-0b6e5f72 confirm
bots: proposal-stale: report
$ echo $?
4
```

**120x40**

```text
$ bots answer 20261125T210204Z-0b6e5f72 confirm
bots: proposal-stale: report
$ echo $?
4
```

The item stays open, so `bots inbox` still lists it and the operator can propose again against the new revision.

---

## 8. WHAT THE FRAMES DO NOT SHOW

- **The draft.** No surface prints the draft's text. The operator opens `proposals/<runId>/SKILL.md` in an editor, and the item's `evidence` names the path.
- **The digest.** No surface prints `revisionRead` or the current digest. A stale pin names the skill and not the two digests, because the operator's fix is to propose again.
- **The proposals folder in the screen.** The screen reads four payloads and none of them lists a proposal. A pane for proposals would be a fifth payload and this phase adds none. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:114]

---

## 9. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The success line names the skill and the folder and not the run id twice | The folder is the run id, so naming both would repeat 24 characters and push the line past 80 columns |
| The refusal prints one stderr line and nothing on stdout | `contracts/cli-json.md` rule 3 fixes it for every verb, and a refusal that printed a partial path would invite a reader to use it |
| The screen draws the sentinel as an ordinary `botId` | The payload carries no flag that says the item is a review, and adding one would be a fifth payload key this phase does not own |
| The overlay is the choice overlay, not the free-text one | The item carries two options, and the screen draws numbered rows whenever `options` is a list |
| No frame shows the draft or the digest | Neither is a screen surface, and a frame that drew one would promise a payload this phase does not add |
