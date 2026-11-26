---
title: "Design: channel reply grammar"
description: "The replies a person may send to an open approval prompt, as a table with the text each one passes to answerItem, which prompt a reply answers when several are open, and what a line that matches none becomes."
trigger_phrases:
  - "channel reply grammar"
  - "numbered reply yes no"
  - "chat reply to prompt"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Channel reply grammar

A press carries its action id and needs no grammar. A typed reply does. This file is the grammar `channel-approval.ts` applies on every transport whose `numberedReply` is `yes` in `../../002-adapter-and-record-contracts/design/capabilities.md` section 2: `signal`, `whatsapp` and `terminal`. On `telegram` and `slack` a typed line is always a chat message, and the buttons are the one answer surface.

---

## 1. THE OPEN PROMPT A REPLY ANSWERS

A reply answers **the newest open prompt in its conversation**: the approval index entry with this channel and this conversation whose `sentAt` is latest and whose `expiresAt` is still ahead. No open prompt means the line is a chat message. The echo M07 names the item id, so a person who meant an older prompt sees which one was answered. To answer an older prompt the person uses `bots answer` on the host. A grammar that named an item in the reply would put a 25-character id in a chat line, which nobody types.

## 2. THE ACCEPTED REPLIES

The line is trimmed of leading and trailing whitespace and compared without regard to case. Nothing else is stripped, so `2.` and `#2` are not replies.

| # | Line | On a prompt with options `o1` to `on` | On a prompt with no options | Text passed to `answerItem` |
|---|------|---------------------------------------|-----------------------------|-----------------------------|
| 1 | `1` to `n`, digits only, no leading zero | Choice `k` | `1` is YES, `2` is NO | The option `ok` as stored, or `yes` or `no` |
| 2 | `YES` or `Y` | Not a choice. Reply M20 | YES | `yes` |
| 3 | `NO` or `N` | The refusal of the prompt | NO | `no` |
| 4 | A number above `n`, `0` or a number with a leading zero | Not a choice. Reply M20 | Not a choice. Reply M20 | Nothing |
| 5 | Anything else | A chat message | A chat message | Nothing |

Row 3 maps `N` to `no` before the call. `answerItem` derives the scope `deny` from `deny`, `no` or `n` (`contracts/answer-seam.md` step 8), so the refusal is recorded by phase 006's rule and never by a second copy of it and the channel passes no scope of its own. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:163] A refusal is therefore never recorded as an approval on any surface.

Row 2 on a prompt with options is refused with M20 rather than treated as a chat message. A person who types `yes` under `Which channel?` meant to answer, and a run started with the text `yes` would surprise them more than a one-line hint.

Rows 2 and 4 send M20, `Reply with a number from 1 to n, or NO.` and the prompt stays open. M20 counts no failure and locks nothing.

## 3. WHAT A LINE THAT MATCHES NONE BECOMES

Row 5 is a chat message. On `signal` and `whatsapp` it becomes one request through `bots enqueue` with the provider message id as its event id and the `<conversation channel="...">` block as its prompt (`contracts/prompt-sections.md` section 1.9). On the terminal it goes through the 010 chat path. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:253-269] The open prompt stays open either way.

## 4. WHO MAY REPLY

A reply is an answer only after the chat is resolved. The order is the one `contracts/answer-seam.md` section 1 numbers: an unlinked chat gets M11 or M12 and its line is never parsed as a reply, a locked chat gets M13 and a group chat on a transport whose `groupKnown` is `yes` gets M16. A linked direct chat's reply then calls `answerItem` with the linked actor and the surface `channel`, which checks the roster (step 5) before the lock (step 6).

## 5. CHECKS

```bash
D=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design
rg -c '^\| [1-5] \| ' $D/reply-grammar.md
```

It prints 5.
