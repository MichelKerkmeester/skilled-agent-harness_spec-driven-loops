---
title: "Design: the surfaces an operator reads"
description: "The bots inbox line and its JSON row, the bots answer stdout lines, the usage text, the resumed prompt and the ladder doc, each drawn before and after this phase with the exact column layout."
trigger_phrases:
  - "inbox grant column"
  - "inbox json row"
  - "answer stdout lines"
  - "ladder doc shape"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The surfaces an operator reads

Five surfaces change and one is new. The inbox line gains three columns, the inbox `--json` row gains one key, `bots answer` gains no line but its existing lines gain a meaning, the usage text gains one note, the resumed prompt gains one line and the ladder doc is written from nothing.

Every sample uses the packet's one data set: clock `2026-11-25T21:14:04Z`, identity `skilled-scratch/hello`, operator `ada`, bot `hello`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:30]

---

## 1. THE `bots inbox` LINE

The line is today's, with three columns inserted after `botId`. The columns are the grant's `kind`, its `rung` and its `scope`, and a scope that was never granted prints `-`. [SOURCE: .skilled/bin/bots.cjs:468]

### 1.1 Before this phase

```text
open	20261125T211204Z-7c1e9a40	hello	created 2026-11-25T21:12:04.000Z	expires 2026-11-26T21:12:04.000Z
	Ship the release?
```

### 1.2 After this phase, an open item

```text
open	20261125T211204Z-7c1e9a40	hello	send	kind	-	created 2026-11-25T21:12:04.000Z	expires 2026-11-26T21:12:04.000Z
	Ship the release?
```

### 1.3 After this phase, an answered item under `--all`

```text
answered	20261125T211204Z-7c1e9a40	hello	send	kind	deny	created 2026-11-25T21:12:04.000Z	expires 2026-11-26T21:12:04.000Z
	Ship the release?
```

### 1.4 The column layout

| Position | Field | Separator after | Absent value |
|----------|-------|-----------------|--------------|
| 1 | the item's derived state | tab | never absent |
| 2 | the item's `id` | tab | never absent |
| 3 | the item's `botId` | tab | never absent |
| 4 | `grants.kind` | tab | `-` when `grants` is `null` |
| 5 | `grants.rung` | tab | `-` when `grants` is `null` |
| 6 | `grants.scope` | tab | `-` when the scope is `null` or `grants` is `null` |
| 7 | `created <createdAt>` | tab | never absent |
| 8 | `expires <expiresAt>` | newline | never absent |

The second line of each item is unchanged: a tab, then the question. The option lines under it are unchanged.

### 1.5 Why the columns sit there

`grep` on the third field still finds every item of a bot, and `grep` on the fourth finds every item of a kind. A column appended at the end would make the kind the last thing on a line whose tail is two timestamps, which is the part a reader skims.

---

## 2. THE `bots inbox --json` ROW

The row is 001's ten keys plus `grants`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md:26]

```json
{
  "id": "20261125T211204Z-7c1e9a40",
  "botId": "hello",
  "kind": "decision",
  "question": "Ship the release?",
  "state": "open",
  "at": "2026-11-25T21:12:04.000Z",
  "options": null,
  "createdAt": "2026-11-25T21:12:04.000Z",
  "expiresAt": "2026-11-26T21:12:04.000Z",
  "answer": null,
  "grants": {
    "kind": "send",
    "action": "Ship the release?",
    "rung": "kind",
    "scope": null,
    "grantedBy": null,
    "grantedAt": null
  }
}
```

The envelope is `{"version": 1, "items": [...]}` and the empty shape is `{"version": 1, "items": []}`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md:26]

### 2.1 The two `kind` keys on one row

The row carries `kind` and `grants.kind` and they do not share a vocabulary. `kind` is the review kind, `decision` here. `grants.kind` is the action kind, `send` here. A reader that means the action says `grants.kind`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:64]

### 2.2 An item written before this phase

The row carries `"grants": null` and every other key is unchanged, so a reader that predates this phase sees one extra key with a null value and a reader that follows this phase sees no grant to draw.

---

## 3. THE `bots answer` STDOUT LINES

No line changes. What changes is that the grant is written before the line is printed, so a line that says the answer landed means the grant landed too. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md:48]

| Path | stdout | Exit |
|------|--------|------|
| A resume was queued | `bots: item 20261125T211204Z-7c1e9a40 answered; resume request rq-aafe0522ffd550ba61ea1d9bb914aea0 enqueued` | 0 |
| The same answer again | `bots: item 20261125T211204Z-7c1e9a40 answered; resume request rq-aafe0522ffd550ba61ea1d9bb914aea0 duplicate: already queued` | 0 |
| A review kind settled it | `bots: item 20261125T211204Z-7c1e9a40 answered; memory-proposal review recorded` | 0 |
| The no-resume option | `bots: item 20261125T211204Z-7c1e9a40 answered; decision review recorded` | 0 |
| Any refusal | `bots: <reason>` or `bots: <reason>: <detail>` on stderr | 4, or 2 for a parse refusal |

The fourth row is the one this phase's no-resume path reaches. `bots enable` passes the option for 002's fatigue item, and the line names the item's review kind, which is `decision` for that item.

---

## 4. THE USAGE TEXT

One note is added under the `answer` verb, and one under `inbox`. The note names the two scopes and the three rungs that are not implemented.

### 4.1 The `answer` entry

```text
  answer <item-id> <text> [--scope once|deny] [--as <name>]
                 answer a needs-you item and queue the run that continues it;
                 --scope records what the answer grants, once or deny, and a
                 NO with no --scope records deny; always and conversation are
                 refused grant-scope-unsupported because no rule store lands
```

### 4.2 The `inbox` entry

```text
  inbox [--json] [--all]
                 list open and expired needs-you items, each with the kind of
                 action it approves, the rung that made the bot ask and the
                 scope granted; --all adds the answered ones
```

### 4.3 The ladder note

The note sits at the end of the usage text, after the verbs, so a reader who reaches it has already seen the two scopes.

```text
approvals: a bot asks before an action in this order, and the first answer wins:
  1. a kind of action: pay, credentials, delete, send, share or post
  2. a rule, 3. auto-review, 4. extra vigilant
rungs 2 to 4 are not implemented in this phase, because no store supplies them.
```

The phrase `not implemented in this phase` is the one the acceptance criteria grep for, so it is written here and in the ladder doc and nowhere else.

---

## 5. THE RESUMED PROMPT

The prompt is today's with one line added after the answer line. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:335]

### 5.1 An item whose grant records `deny`

```text
Ship the release when the checks pass.

An earlier run of this bot stopped to ask the operator a question. The operator has answered it.
Question: Ship the release?
Answer: no
Granted scope: deny
Continue the work from where that run stopped, following the answer.
```

### 5.2 An item written before this phase

```text
Ship the release when the checks pass.

An earlier run of this bot stopped to ask the operator a question. The operator has answered it.
Question: Ship the release?
Answer: no
Continue the work from where that run stopped, following the answer.
```

The two differ by one line and nothing else, so a resumed run that predates this phase reads the prompt it read before.

---

## 6. THE LADDER DOC

`bots-run/references/approval-ladder.md` is new and is the one place the order is written for a bot author. Its shape is fixed here so the builder writes a doc rather than deciding what a doc holds.

| Section | Holds |
|---------|-------|
| 1. The order | The four rungs in OpenBot's order, one line each and the sentence that the first answer wins |
| 2. Rung 1, kinds of action | The six kinds, the words that recognize each and the rule that a kind asks in every edition |
| 3. Rungs 2 to 4 | One line each, marked `not implemented in this phase`, with the reason that no store supplies them |
| 4. The fallback | The `bot` rung, and the sentence that it is where the ladder ends rather than a fifth rung |
| 5. The two scopes | `once` and `deny`, what each records and the refusal of `always` and `conversation` as `grant-scope-unsupported` |
| 6. The strictest rule within rung 2 | The rule a later packet implements, written now so the order is complete |
| 7. What a bot may declare | The `[ACTION: <kind>]` line, its grammar and the floor rule |

The doc names no file path and no function name, because a bot author reads it rather than a builder.

---

## 7. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The three grant columns sit after `botId` and before the timestamps | `grep` on the third field still finds a bot's items and `grep` on the fourth finds a kind's, and the timestamps stay at the tail where a reader skims |
| An absent grant prints `-` in all three columns rather than an empty field | A tab-separated line with two adjacent tabs is unreadable and a `cut` on the field returns nothing either way |
| The `--json` row carries `grants` as an object or `null` and never as an empty object | `null` is the contract's absent value, and an empty object would fail the grant's own validation [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:117] |
| The usage note names the three unimplemented rungs | An operator who expects a standing allow learns at the help text rather than at the refusal |
| The ladder doc names no path and no function | A bot author reads it, and a path in it would go stale the first time a module moves |
| The resumed prompt line is the last line before the closing instruction | The closing instruction is the sentence a run acts on, so nothing sits after it |
