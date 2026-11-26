---
title: "Design: the user-facing output of phase 2"
description: "The literal stdout and stderr of bots routines, bots routines --json, bots inbox with the fatigue item, bots enable, bots status with a completed row, the two run refusals and the checker and install floor lines, on one fixed data set."
trigger_phrases:
  - "bots routines output"
  - "routine mockups"
  - "fatigue item inbox line"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The user-facing output of phase 2

Five surfaces a person reads: the `bots routines` list, its `--json` payload, the fatigue item in `bots inbox`, `bots enable`'s lines, and the `completed` row in `bots status`. Each one is drawn below on one data set, so a builder writes a string rather than choosing one.

The `--json` field table is `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` section 7 and this file copies none of it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/contracts.md:584] The record shapes are `design/records.md`. The refusal names are `design/refusals.md`.

---

## 1. THE DATA SET

| Item | Value |
|------|-------|
| Checkout | `/tmp/routine-clean`, a copy of `routine-clean` from `design/fixtures.md` |
| Identity | `local/tool` |
| State root | `/tmp/routine-state`, empty before the first command |
| Clock | `2026-11-25T21:14:04Z` |
| Operator | `ada` |
| Bots | `digest`, `nightly-report` and `plain`, the three `routine-clean` holds |

The two routine bots are the ones `design/fixtures.md` section 1 fixes. `plain` carries a `trigger` and no `routine` block, so it is not a row.

---

## 2. `bots routines`

```text
$ node .skilled/bin/bots.cjs routines --repo /tmp/routine-clean
digest	every 6h	tell	the digest is sent	-	enabled	streak 0
nightly-report	daily 02:00	act	the report is filed	-	enabled	streak 0
$ echo $?
0
```

Seven tab-separated fields, in this order: `botId`, the `starts[0].summary` phrase, `does`, `until` or `-`, `untilMetAt` or `-`, `switch`, and `streak <n>`. The shape is the one `bots inbox` and `bots status` already use, one tab-separated line per row with no header. [SOURCE: .skilled/bin/bots.cjs:467-470] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:479-486]

**Why `until` is bare.** The screen draws it in double quotes because the pane has no column delimiter. A tab-separated line does, and a quoted field would make the value differ from the payload's.

**An empty checkout.**

```text
$ node .skilled/bin/bots.cjs routines --repo /tmp/empty
bots: no routines
$ echo $?
0
```

The line matches `bots: no open or expired needs-you items`, which is the shape `bots inbox` prints when it has nothing to show. [SOURCE: .skilled/bin/bots.cjs:466]

**A damaged state file.** The row still prints, with `-` for `untilMetAt` and the switch read from the switches alone, and one stderr line names the bot.

```text
$ node .skilled/bin/bots.cjs routines --repo /tmp/routine-clean
digest	every 6h	tell	the digest is sent	-	enabled	streak 0
nightly-report	daily 02:00	act	the report is filed	-	enabled	streak 0
bots: routine state digest did not read
$ echo $?
0
```

---

## 3. `bots routines --json`

```text
$ node .skilled/bin/bots.cjs routines --json --repo /tmp/routine-clean
{
  "version": 1,
  "routines": [
    {
      "botId": "digest",
      "what": "the morning digest",
      "starts": [
        { "kind": "cron", "expression": "15 */6 * * *", "summary": "every 6h" }
      ],
      "does": "tell",
      "until": "the digest is sent",
      "untilMetAt": null,
      "failureStreak": 0,
      "switch": "enabled"
    },
    {
      "botId": "nightly-report",
      "what": "the nightly report",
      "starts": [
        { "kind": "cron", "expression": "0 2 * * *", "summary": "daily 02:00" }
      ],
      "does": "act",
      "until": "the report is filed",
      "untilMetAt": null,
      "failureStreak": 0,
      "switch": "enabled"
    }
  ]
}
$ echo $?
0
```

The keys and their types are the screen contract's section 7. The values are this data set's. The screen's own sample carries `failureStreak` 1 for `nightly-report` because its data set holds one failed run, and the type is the same integer. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/routines.json:1]

**An empty checkout.**

```text
$ node .skilled/bin/bots.cjs routines --json --repo /tmp/empty
{
  "version": 1,
  "routines": []
}
$ echo $?
0
```

**stdout carries the document and nothing else.** A warning or a progress note goes to stderr, the rule every `--json` verb follows. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "1. THE RULE"]

---

## 4. THE FATIGUE ITEM IN `bots inbox`

After the tenth consecutive failure of `nightly-report`, whose tenth run id is `20261125T210204Z-0b6e5f72`:

```text
$ node .skilled/bin/bots.cjs inbox
open	20261125T210204Z-0b6e5f72	nightly-report	created 2026-11-25T21:02:04.000Z	expires 2026-12-02T21:02:04.000Z
	This bot failed 10 runs in a row. Enable it again?
$ echo $?
0
```

Two lines, the shape `bots inbox` already prints: the state, the id, the `botId`, the two instants, then the question on its own indented line. [SOURCE: .skilled/bin/bots.cjs:467-470] No option line follows, because `options` is `null`. `design/records.md` section 3 fixes the values.

**Why the item names the bot and not a sentinel.** The operator who has to act on it reads `bots inbox` and sees the bot's own id, and `bots enable nightly-report` finds it. A sentinel would list it under a queue that has no bot to enable.

---

## 5. `bots enable`

```text
$ node .skilled/bin/bots.cjs enable nightly-report
bots: enabled and loaded
bots: next fire: 2026-11-26T02:00:00.000Z
bots: check: ok
$ echo $?
0
```

The three lines are the ones `bots enable` prints today and this phase adds none of them. [SOURCE: .skilled/bin/bots.cjs:336-339] What the phase adds is the work behind them: the item is answered, `enabledAt` is written, `fatiguedAt` and `fatigueItemId` are cleared, and the `disabled` and `completed` switches are cleared, in the order `design/state-machines.md` section 3 fixes.

**With an expired item.** The enable still succeeds and one stderr line says the item was not answered.

```text
$ node .skilled/bin/bots.cjs enable nightly-report
bots: enabled and loaded
bots: next fire: 2026-11-26T02:00:00.000Z
bots: check: ok
bots: item 20261125T210204Z-0b6e5f72 expired; not answered
$ echo $?
0
```

**With a roster that does not admit the actor.** The answer is step 1, so the enable stops before the switch is cleared and the bot stays stopped.

```text
$ node .skilled/bin/bots.cjs enable nightly-report
bots: answer-not-approver: ada is not on the roster
$ echo $?
4
```

---

## 6. THE `completed` ROW IN `bots status`

`BOT_ROW_STATES` gains `completed` after `held`, so a bot stopped by its own outcome reads as its own state rather than as `ok` or `held`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:42-53]

```text
$ node .skilled/bin/bots.cjs status
index built 2026-11-25T21:14:04.000Z (/tmp/routine-state/index/status.sqlite)
completed	local/tool	digest	/tmp/routine-clean/bots/digest	last 20261125T210204Z-0b6e5f72 completed
ok	local/tool	nightly-report	/tmp/routine-clean/bots/nightly-report	last 20261125T210204Z-1c7d9e33 completed
ok	local/tool	plain	/tmp/routine-clean/bots/plain	no run
$ echo $?
0
```

The row shape is `formatStatus`'s: the state, the identity, the bot id, the path, then the last run. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:479-486] The phase changes the first field for a completed bot and nothing else.

---

## 7. THE REFUSAL LINES

**A run refused by the fatigue switch.**

```text
$ node .skilled/bin/bots.cjs run nightly-report
bots: nightly-report refused before dispatch (routine-fatigued)
$ echo $?
4
```

**A run refused by the completed switch.**

```text
$ node .skilled/bin/bots.cjs run digest
bots: digest refused before dispatch (routine-completed)
$ echo $?
4
```

Both are the existing `describeOutcome` line with the new cause in the parentheses. [SOURCE: .skilled/bin/bots.cjs:404]

**The floor at install.**

```text
$ node .skilled/bin/bots.cjs install digest
bots: routine-floor-15-minutes: bots/digest/BOT.md: "*/5 * * * *" is under the 900-second floor
$ echo $?
4
```

**The floor in the checker.**

```text
$ node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor
PASS: config: bots/config.json reads cleanly
PASS: identity: local/tool (from config)
PASS: definition: bots/digest/BOT.md parses as digest
FAIL: routine-floor-15-minutes: bots/digest/BOT.md: "*/5 * * * *" is under the 900-second floor
$ echo $?
1
```

The `PASS:` lines before the failure are the ones the checker prints as it walks the checkout, and the `FAIL:` line is the one `design/refusals.md` section 2 fixes. [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:110-113]

---

## 8. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| `bots routines` prints seven tab-separated fields with no header | `bots inbox` and `bots status` already print tab-separated rows with no header, and a header would be a second format to keep in step [SOURCE: .skilled/bin/bots.cjs:467-470] |
| `until` is bare in the human line and quoted only in the screen's pane | A tab-separated line has a delimiter and the pane does not. A quoted field would make the human value differ from the payload's |
| An empty checkout prints `bots: no routines` | It is the shape `bots inbox` prints when it has nothing to show, so a reader learns one convention |
| A damaged state file prints its row and one stderr line | A read verb that failed on one damaged file would hide every other routine |
| `bots enable` keeps its three existing lines and adds none | The phase changes what the verb does, not what it says. A new line would break a script that reads the current output |
| The expired-item warning goes to stderr and the verb exits 0 | The operator asked for the bot to be enabled and the item is a notice rather than a gate. `design/state-machines.md` section 3 fixes the three outcomes |
| `completed` sits after `held` in `BOT_ROW_STATES` | `held` is a bot waiting on a person and `completed` is a bot that reached its own outcome. The order puts the person's state first |

---

## 9. CHECK THIS FILE

Each command prints the number on the line after it.

```bash
rg -c '^\$ node \.skilled/bin/bots\.cjs routines' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/mockups.md
# prints 5
rg -c '^## ' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/mockups.md
# prints 9
```
