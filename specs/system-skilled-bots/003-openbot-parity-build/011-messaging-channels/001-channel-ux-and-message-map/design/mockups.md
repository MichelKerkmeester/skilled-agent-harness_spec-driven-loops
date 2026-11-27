---
title: "Design: channel mockups per surface"
description: "One mockup per surface, the Telegram inline keyboard, Slack Block Kit and the plain text form for Signal, WhatsApp and the terminal, each for a two-option item, a yes or no item, a question over the chunk limit and an expired prompt. Each shows the wire payload and what the person sees."
trigger_phrases:
  - "channel mockups"
  - "telegram inline keyboard mockup"
  - "slack block kit mockup"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Channel mockups per surface

Three surfaces, four situations each, twelve mockups. The text inside every mockup is a row of `message-catalog.md` and is never restated differently here. A wire block is the request body the transport sends. A view block is what the person sees, drawn at 73 columns at most. In a view, a line in square brackets is a button and a line starting `>` is what the person sends.

**Notation for a long text.** `[... 3,958 characters of the question ...]` in a mockup stands for that many characters of the question and is not literal. It is the only non-literal form in this file.

**Situations.**

| Code | Situation | Item |
|------|-----------|------|
| S1 | Two-option item | `20261125T210504Z-3f9d2b11`, `Which channel?`, options `email` and `chat` |
| S2 | Yes or no item | `20261125T211204Z-7c1e9a40`, `Ship the release?`, no options |
| S3 | A question over the chunk limit | S1's item with a 4,500-character question |
| S4 | An expired prompt | S1's item, answered after its `expiresAt` of `2026-11-26T21:05:04Z` |

**Chunking, one rule for every surface.** A text over the transport's `chunkLimit` (`../../002-adapter-and-record-contracts/design/capabilities.md` section 2) is cut into messages of exactly the limit, the last one shorter. A cut falls on a code point boundary and never looks for a newline, so the sizes below follow from the limit alone. The choice block, or the buttons, always travel on the last chunk, so the answer surface sits under the end of the question. One queue entry covers every chunk.

---

## 1. TELEGRAM, INLINE KEYBOARD

Plain text, no `parse_mode`, so no character of a bot-authored question needs MarkdownV2 escaping. The reference sends MarkdownV2 and retries without it when Telegram rejects the markup. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_send.rs:375-392] Sending plain text from the start removes that second request. One button per row, each carrying its action id as `callback_data`, which fits Telegram's 64-byte limit. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs:8-20]

### 1.1 Telegram, S1

Wire, `POST /bot<redacted>/sendMessage`:

```json
{
  "chat_id": "81234567",
  "text": "Skilled bot digest\nRun 20261125T210504Z-3f9d2b11: needs your decision\nReason: awaiting-decision\nNeeds-you item 20261125T210504Z-3f9d2b11: Which channel?\nRecord: <bots state>/skilled-scratch%2Fhello/records/20261125T210504Z-3f9d2b11.json\n\nPress a button to answer.",
  "reply_markup": { "inline_keyboard": [
    [ { "text": "1  email", "callback_data": "approval-v1:20261125T210504Z-3f9d2b11:1" } ],
    [ { "text": "2  chat",  "callback_data": "approval-v1:20261125T210504Z-3f9d2b11:2" } ]
  ] }
}
```

View, after `ada` presses `2  chat`:

```text
+-- digest bot ---------------------------------------------------------+
| Skilled bot digest                                                    |
| Run 20261125T210504Z-3f9d2b11: needs your decision                    |
| Reason: awaiting-decision                                             |
| Needs-you item 20261125T210504Z-3f9d2b11: Which channel?              |
| Record: <bots state>/skilled-scratch%2Fhello/records/2026112...json   |
|                                                                       |
| Press a button to answer.                                             |
|   [ 1  email ]                                                        |
|   [ 2  chat  ]                                                        |
|                                                                       |
| > (presses 2  chat)                                                   |
| Answer 2 recorded for item 20261125T210504Z-3f9d2b11 by ada. The      |
| run resumes.                                                          |
+-----------------------------------------------------------------------+
```

The record line is cut in the view only, because the client wraps it. The wire carries it whole.

### 1.2 Telegram, S2

Wire: the M04 text, and the keyboard `[[{"text": "YES", "callback_data": "approval-v1:20261125T211204Z-7c1e9a40:1"}], [{"text": "NO", "callback_data": "approval-v1:20261125T211204Z-7c1e9a40:2"}]]`.

```text
+-- hello bot ----------------------------------------------------------+
| Skilled bot hello                                                     |
| Run 20261125T211204Z-7c1e9a40: needs your decision                    |
| Reason: awaiting-decision                                             |
| Needs-you item 20261125T211204Z-7c1e9a40: Ship the release?           |
| Record: <bots state>/skilled-scratch%2Fhello/records/2026112...json   |
|                                                                       |
| Press a button to answer.                                             |
|   [ YES ]                                                             |
|   [ NO  ]                                                             |
|                                                                       |
| > (presses NO)                                                        |
| Answer 2 recorded for item 20261125T211204Z-7c1e9a40 by ada. The      |
| run resumes.                                                          |
+-----------------------------------------------------------------------+
```

`NO` sends the text `no`, which `answerItem` records with the scope `deny` (`reply-grammar.md` section 2).

### 1.3 Telegram, S3

The M02 form is 4,749 bytes: 4,500 of question and 249 of the other lines, 138 before the question and 111 after it. The limit is 4,096 bytes, so two messages: 4,096 and 653.

```text
+-- digest bot ---------------------------------------------------------+
| Skilled bot digest                                                    |
| Run 20261125T210504Z-3f9d2b11: needs your decision                    |
| Reason: awaiting-decision                                             |
| Needs-you item 20261125T210504Z-3f9d2b11: [... 3,958 characters of    |
| the question ...]                                                     |
+-----------------------------------------------------------------------+
+-- digest bot ---------------------------------------------------------+
| [... 542 characters of the question ...]                              |
| Record: <bots state>/skilled-scratch%2Fhello/records/2026112...json   |
|                                                                       |
| Press a button to answer.                                             |
|   [ 1  email ]                                                        |
|   [ 2  chat  ]                                                        |
+-----------------------------------------------------------------------+
```

Only the second `sendMessage` carries `reply_markup`. The receipt lists both message ids.

### 1.4 Telegram, S4

The prompt is S1's, unchanged, because `edit` is undeclared (`capabilities.md` section 2). The press is acknowledged to stop the spinner, then refused.

```text
+-- digest bot ---------------------------------------------------------+
| (the S1 prompt with its two buttons)                                  |
|                                                                       |
| > (presses 1  email, on 2026-11-26 at 22:00)                          |
| Item 20261125T210504Z-3f9d2b11 expired at 2026-11-26T21:05:04Z, so    |
| the answer was not recorded.                                          |
+-----------------------------------------------------------------------+
```

---

## 2. SLACK, BLOCK KIT

Socket Mode delivers the press as `block_actions`. The `text` field is the notification fallback and the `section` block is what the channel shows. Both escape `&`, `<` and `>` as Slack requires, so `<bots state>` arrives as `&lt;bots state&gt;` and renders as typed. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/text.rs:45-49] A button's `action_id` and `value` both carry the action id, as the reference builds them and at most five buttons share one `actions` block. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs:8-11] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs:66-72]

### 2.1 Slack, S1

Wire, `POST chat.postMessage` with the bot token:

```json
{
  "channel": "D07ADA0001",
  "text": "Skilled bot digest\nRun 20261125T210504Z-3f9d2b11: needs your decision\nReason: awaiting-decision\nNeeds-you item 20261125T210504Z-3f9d2b11: Which channel?\nRecord: &lt;bots state&gt;/skilled-scratch%2Fhello/records/20261125T210504Z-3f9d2b11.json\n\nPress a button to answer.",
  "blocks": [
    { "type": "section", "text": { "type": "mrkdwn", "text": "Skilled bot digest\nRun 20261125T210504Z-3f9d2b11: needs your decision\nReason: awaiting-decision\nNeeds-you item 20261125T210504Z-3f9d2b11: Which channel?\nRecord: &lt;bots state&gt;/skilled-scratch%2Fhello/records/20261125T210504Z-3f9d2b11.json\n\nPress a button to answer." } },
    { "type": "actions", "elements": [
      { "type": "button", "text": { "type": "plain_text", "text": "1  email" }, "action_id": "approval-v1:20261125T210504Z-3f9d2b11:1", "value": "approval-v1:20261125T210504Z-3f9d2b11:1" },
      { "type": "button", "text": { "type": "plain_text", "text": "2  chat" },  "action_id": "approval-v1:20261125T210504Z-3f9d2b11:2", "value": "approval-v1:20261125T210504Z-3f9d2b11:2" }
    ] }
  ]
}
```

View:

```text
+-- # direct message with digest --------------------------------------+
| digest  APP                                                          |
| Skilled bot digest                                                   |
| Run 20261125T210504Z-3f9d2b11: needs your decision                   |
| Reason: awaiting-decision                                            |
| Needs-you item 20261125T210504Z-3f9d2b11: Which channel?             |
| Record: <bots state>/skilled-scratch%2Fhello/records/2026112...json  |
|                                                                      |
| Press a button to answer.                                            |
| [ 1  email ]  [ 2  chat ]                                            |
|                                                                      |
| > (ada presses 1  email)                                             |
| digest  APP                                                          |
| Answer 1 recorded for item 20261125T210504Z-3f9d2b11 by ada. The     |
| run resumes.                                                         |
+----------------------------------------------------------------------+
```

### 2.2 Slack, S2

The M04 text and one `actions` block with `YES` and `NO`, action ids ending `:1` and `:2`.

```text
+-- # direct message with hello ---------------------------------------+
| hello  APP                                                           |
| Skilled bot hello                                                    |
| Run 20261125T211204Z-7c1e9a40: needs your decision                   |
| Reason: awaiting-decision                                            |
| Needs-you item 20261125T211204Z-7c1e9a40: Ship the release?          |
| Record: <bots state>/skilled-scratch%2Fhello/records/2026112...json  |
|                                                                      |
| Press a button to answer.                                            |
| [ YES ]  [ NO ]                                                      |
+----------------------------------------------------------------------+
```

### 2.3 Slack, S3

The limit is 3,900 characters and the M02 form is 4,749, so two messages: 3,900 and 849. The first is a plain `chat.postMessage` with `text` only. The second carries the rest, the button line and the `actions` block. The chunk that carries the buttons may hold at most 3,000 characters, the cap on a Block Kit section, and 849 is below it, so this prompt is not cut again.

```text
+-- # direct message with digest --------------------------------------+
| digest  APP                                                          |
| Skilled bot digest                                                   |
| Run 20261125T210504Z-3f9d2b11: needs your decision                   |
| Reason: awaiting-decision                                            |
| Needs-you item 20261125T210504Z-3f9d2b11: [... 3,762 characters of   |
| the question ...]                                                    |
| digest  APP                                                          |
| [... 738 characters of the question ...]                             |
| Record: <bots state>/skilled-scratch%2Fhello/records/2026112...json  |
|                                                                      |
| Press a button to answer.                                            |
| [ 1  email ]  [ 2  chat ]                                            |
+----------------------------------------------------------------------+
```

### 2.4 Slack, S4

```text
+-- # direct message with digest --------------------------------------+
| (the S1 prompt with its two buttons)                                 |
|                                                                      |
| > (ada presses 2  chat, on 2026-11-26 at 22:00)                      |
| digest  APP                                                          |
| Item 20261125T210504Z-3f9d2b11 expired at 2026-11-26T21:05:04Z, so   |
| the answer was not recorded.                                         |
+----------------------------------------------------------------------+
```

A press from a person who is not an approver is dropped before it is emitted, as the pre-expansion REQ-010 requires, so it draws no reply at all. That is the one refusal with no catalog text on Slack.

---

## 3. PLAIN TEXT, SIGNAL, WHATSAPP AND THE TERMINAL

The same text on all three, the M01 and M03 forms. Only the chunk limit and the frame differ: Signal cuts at 2,000 characters, WhatsApp and the terminal at 4,096. The terminal prints to stdout of `bots channel listen terminal` and reads the reply from stdin.

### 3.1 Plain text, S1

Signal wire, `POST /api/v1/rpc` on the local daemon:

```json
{ "jsonrpc": "2.0", "method": "send", "params": { "account": "+15550100", "recipient": ["+15550111"], "message": "Skilled bot digest\nRun 20261125T210504Z-3f9d2b11: needs your decision\nReason: awaiting-decision\nNeeds-you item 20261125T210504Z-3f9d2b11: Which channel?\nRecord: <bots state>/skilled-scratch%2Fhello/records/20261125T210504Z-3f9d2b11.json\n\nReply with a number:\n1  email\n2  chat" }, "id": "6f1c2e8a-0b7d-4c55-9e3a-1d2f4b6a8c90" }
```

WhatsApp wire, `POST https://graph.facebook.com/v23.0/<phone number id>/messages` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/api.rs:13-16]:

```json
{ "messaging_product": "whatsapp", "to": "15550111", "type": "text", "text": { "body": "Skilled bot digest\nRun 20261125T210504Z-3f9d2b11: needs your decision\nReason: awaiting-decision\nNeeds-you item 20261125T210504Z-3f9d2b11: Which channel?\nRecord: <bots state>/skilled-scratch%2Fhello/records/20261125T210504Z-3f9d2b11.json\n\nReply with a number:\n1  email\n2  chat" } }
```

View, the same on all three:

```text
+-- digest -------------------------------------------------------------+
| Skilled bot digest                                                    |
| Run 20261125T210504Z-3f9d2b11: needs your decision                    |
| Reason: awaiting-decision                                             |
| Needs-you item 20261125T210504Z-3f9d2b11: Which channel?              |
| Record: <bots state>/skilled-scratch%2Fhello/records/2026112...json   |
|                                                                       |
| Reply with a number:                                                  |
| 1  email                                                              |
| 2  chat                                                               |
|                                                                       |
|                                                         > 2           |
| Answer 2 recorded for item 20261125T210504Z-3f9d2b11 by ada. The      |
| run resumes.                                                          |
+-----------------------------------------------------------------------+
```

### 3.2 Plain text, S2

```text
+-- hello --------------------------------------------------------------+
| Skilled bot hello                                                     |
| Run 20261125T211204Z-7c1e9a40: needs your decision                    |
| Reason: awaiting-decision                                             |
| Needs-you item 20261125T211204Z-7c1e9a40: Ship the release?           |
| Record: <bots state>/skilled-scratch%2Fhello/records/2026112...json   |
|                                                                       |
| Reply YES or NO.                                                      |
|                                                         > n           |
| Answer 2 recorded for item 20261125T211204Z-7c1e9a40 by ada. The      |
| run resumes.                                                          |
+-----------------------------------------------------------------------+
```

`n` is `NO`, which is choice 2 on a prompt with no options.

### 3.3 Plain text, S3

The M01 form is 4,761 characters, 138 before the question and 123 after it. On Signal that is three messages: 2,000, 2,000 and 761. On WhatsApp and the terminal it is two: 4,096 and 665. The Signal form:

```text
+-- digest -------------------------------------------------------------+
| Skilled bot digest                                                    |
| Run 20261125T210504Z-3f9d2b11: needs your decision                    |
| Reason: awaiting-decision                                             |
| Needs-you item 20261125T210504Z-3f9d2b11: [... 1,862 characters of    |
| the question ...]                                                     |
+-----------------------------------------------------------------------+
+-- digest -------------------------------------------------------------+
| [... 2,000 characters of the question ...]                            |
+-----------------------------------------------------------------------+
+-- digest -------------------------------------------------------------+
| [... 638 characters of the question ...]                              |
| Record: <bots state>/skilled-scratch%2Fhello/records/2026112...json   |
|                                                                       |
| Reply with a number:                                                  |
| 1  email                                                              |
| 2  chat                                                               |
+-----------------------------------------------------------------------+
```

### 3.4 Plain text, S4

```text
+-- digest -------------------------------------------------------------+
| (the S1 prompt with its choice lines)                                 |
|                                                         > 1           |
| Item 20261125T210504Z-3f9d2b11 expired at 2026-11-26T21:05:04Z, so    |
| the answer was not recorded.                                          |
+-----------------------------------------------------------------------+
```

The expired entry is removed from the approval index on that read, so a second `1` finds no open prompt and is a chat message. It starts a run with the text `1`, which is the grammar's rule for a line that matches no open prompt.

---

## 4. CHECKS

```bash
D=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design
rg -c '^### [1-3]\.[1-4] ' $D/mockups.md
perl -CSD -ne 'if (/^```text/){$f=1;next} if (/^```/){$f=0;next} chomp; $n++ if $f && length($_) > 73; END{print $n+0, "\n"}' $D/mockups.md
node -e 'const b=4500+138+111, x=4500+138+123; console.log(b, b-4096, b-3900, x, x-4000, x-4096)'
```

The first prints 12. The second prints 0, so no line of a view is wider than 73 columns. Wire blocks are JSON and are not measured. The third prints `4749 653 849 4761 761 665`: the button form's total and its last Telegram and Slack chunks, then the text form's total and its last Signal and WhatsApp chunks.
