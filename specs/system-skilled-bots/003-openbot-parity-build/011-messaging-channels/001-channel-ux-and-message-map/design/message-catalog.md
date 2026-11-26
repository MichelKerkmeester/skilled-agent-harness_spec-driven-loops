---
title: "Design: channel message catalog"
description: "The literal text of every message a channel sends a person or prints on the host: approval prompts in text and button form, run results, the answer echo, link pairing, every refusal reply and the uncertain delivery line. Each row names the module that builds it, whether it carries bot-authored text and its golden file."
trigger_phrases:
  - "channel message catalog"
  - "channel refusal replies"
  - "approval prompt text"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Channel message catalog

No message a person reads in a chat was designed. Three research lineages agree. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:205] This file is every one of them, as literal text. `mockups.md` draws how each surface shows them, `reply-grammar.md` fixes what a person may send back and `golden/` holds one text file per row, which `tests/channel-transports.vitest.ts` compares byte for byte after removing the file's one final newline.

The samples use the screen's data set: identity `skilled-scratch/hello`, operator `ada`, member `grace`, bots `digest`, `hello` and `nightly-report`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:30] The two items are the contract's: `20261125T210504Z-3f9d2b11` asks `Which channel?` with options `email` and `chat`, and `20261125T211204Z-7c1e9a40` asks `Ship the release?` with no options. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures/channel-approvals.json:1-16] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/fixtures/needs-you-item.final.json:1-8]

---

## 1. WHERE THE TEXT COMES FROM

**Run messages are `deliveryMessage()` and nothing else.** A prompt, a completed notice and a failure notice are the title line of `deliveryMessage()`, a newline, then its body, unchanged. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:171-189] REQ-014, now in `../../005-polling-transports/spec.md`, forbids re-rendering the question (pre-expansion `spec.md` line 201 at commit `de601a1b444`), so a channel never writes `digest needs you: Which channel?` the way the contract's queue sample does. That sample is a cross-file fix in the parent spec.

**Choice lines are the one addition.** A prompt on a transport without buttons appends a blank line and the choice block of rows M01 or M03. A prompt with buttons appends `Press a button to answer.` and carries the choices as buttons. The choice block is built by `channel-approval.ts` from the approval index entry. The option text is bot-authored, because the runner fills `options` from the bot's `[OPTION]` lines. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1105] So the whole outbound text, `deliveryMessage()` plus the choice block and every button label pass `findSecretLiteral` against the known secrets before the queue entry is written. Today's check covers the title and the body only. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:291] A hit withholds the whole prompt with the evidence `delivery.ts` already writes: `withheld: the message holds a literal of <kind> <name>`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:341-343]

**Replies are constants.** The echo and every refusal reply are fixed strings in one table in `channel.ts`, filled with an item id, an instant, an actor name, a channel name, a count or seconds. None carries bot-authored text, so none needs the literal check. The echo names the chosen number and never the option text for the same reason.

**Host lines go to the terminal, not to a chat.** Rows M09 and M21 are printed by `bots.cjs` on the host.

**The run's reply text is not sent.** A run a chat message starts ends with M05 or M06, the outcome and a record pointer. `deliveryMessage()` carries no reply text, and the pre-expansion out-of-scope list promised that "the reply is sent when the run ends" (pre-expansion `spec.md` line 132 at commit `de601a1b444`). The two cannot both hold. This catalog follows REQ-014, the security rule and the parent spec records the conflict for the operator. The terminal transport is the exception: it goes through the 010 chat path, which appends the redacted reply to the conversation file. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:265]

**The fatigue notice never reaches a chat.** Phase 002's fatigue item is answered by `bots enable` on the host and has no parked run, so no approval index entry and no channel message is ever written for it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:167]

---

## 2. THE CATALOG

`Varies` names the fields a builder fills. Everything else is literal.

| ID | Message | Surface | Built by | Bot-authored text | Varies | Golden |
|----|---------|---------|----------|-------------------|--------|--------|
| M01 | Approval prompt with options, text form | `signal`, `whatsapp`, `terminal` | `delivery.ts`, then `channel-approval.ts` | Question and options, checked | run, bot, item, question, options | `golden/M01-prompt-options-text.txt` |
| M02 | Approval prompt with options, button form | `telegram`, `slack` | `delivery.ts`, then `channel-approval.ts` | Question and button labels, checked | as M01 | `golden/M02-prompt-options-buttons.txt` |
| M03 | Approval prompt with no options, text form | `signal`, `whatsapp`, `terminal` | `delivery.ts`, then `channel-approval.ts` | Question, checked | run, bot, item, question | `golden/M03-prompt-yesno-text.txt` |
| M04 | Approval prompt with no options, button form | `telegram`, `slack` | `delivery.ts`, then `channel-approval.ts` | Question, checked | as M03 | `golden/M04-prompt-yesno-buttons.txt` |
| M05 | Run completed | every channel target | `delivery.ts` | None | run, bot | `golden/M05-run-completed.txt` |
| M06 | Run failed | every `onFailure` target | `delivery.ts` | None | run, bot, class, reason | `golden/M06-run-failed.txt` |
| M07 | Answer recorded, the echo | the chat that answered | `channel.ts` table | None | number, item, actor | `golden/M07-answer-recorded.txt` |
| M08 | Same answer again, the duplicate path | the chat that answered | `channel.ts` table | None | item | `golden/M08-answer-duplicate.txt` |
| M09 | Link code | host stdout | `bots.cjs` | None | channel, code | `golden/M09-link-code.txt` |
| M10 | Link confirmed | the chat that sent the code | `channel.ts` table | None | actor | `golden/M10-link-confirmed.txt` |
| M11 | `channel-unlinked` | an unlinked chat | `channel.ts` table | None | channel | `golden/M11-channel-unlinked.txt` |
| M12 | A wrong code | an unlinked chat | `channel.ts` table | None | codes left | `golden/M12-link-code-wrong.txt` |
| M13 | `channel-locked` | a locked chat | `channel.ts` table | None | seconds left | `golden/M13-channel-locked.txt` |
| M14 | `answer-not-approver` | a linked chat | `channel.ts` table | None | actor | `golden/M14-answer-not-approver.txt` |
| M15 | `item-expired` | a linked chat | `channel.ts` table | None | item, instant | `golden/M15-item-expired.txt` |
| M16 | `channel-group-approval` | a group chat | `channel.ts` table | None | none | `golden/M16-channel-group-approval.txt` |
| M17 | `channel-roster-missing` | a linked chat | `channel.ts` table | None | none | `golden/M17-channel-roster-missing.txt` |
| M18 | `item-answered-differently`, answered elsewhere | a linked chat | `channel.ts` table | None | item, instant | `golden/M18-item-answered-differently.txt` |
| M19 | `item-busy` | a linked chat | `channel.ts` table | None | item | `golden/M19-item-busy.txt` |
| M20 | A reply that is not a choice of the open prompt | a linked chat | `channel.ts` table | None | highest number | `golden/M20-reply-not-a-choice.txt` |
| M21 | Uncertain delivery | host stderr of `bots channel drain` | `bots.cjs` | None | channel, key | `golden/M21-delivery-unknown.txt` |

The refusal rows are every refusal `contracts/refusals.md` section 3.10 lists that a person in a chat can cause, plus every `answerItem` refusal the `channel` surface can reach in `contracts/answer-seam.md` section 1: `item-answered-differently` and `item-busy`. `channel-signature`, `channel-daemon-unreachable`, `channel-listening` and `unsupported` have no chat row, because no person in a chat causes them. The first answers an HTTP request and the other three are host lines `refusals.md` already fixes as `bots: <reason>`.

---

## 3. THE LITERAL TEXT

Each block is the golden file's content.

**M01**, approval prompt with options, text form:

```text
Skilled bot digest
Run 20261125T210504Z-3f9d2b11: needs your decision
Reason: awaiting-decision
Needs-you item 20261125T210504Z-3f9d2b11: Which channel?
Record: <bots state>/skilled-scratch%2Fhello/records/20261125T210504Z-3f9d2b11.json

Reply with a number:
1  email
2  chat
```

**M02**, approval prompt with options, button form. The buttons are `1  email` and `2  chat`, drawn in `mockups.md`:

```text
Skilled bot digest
Run 20261125T210504Z-3f9d2b11: needs your decision
Reason: awaiting-decision
Needs-you item 20261125T210504Z-3f9d2b11: Which channel?
Record: <bots state>/skilled-scratch%2Fhello/records/20261125T210504Z-3f9d2b11.json

Press a button to answer.
```

**M03**, approval prompt with no options, text form:

```text
Skilled bot hello
Run 20261125T211204Z-7c1e9a40: needs your decision
Reason: awaiting-decision
Needs-you item 20261125T211204Z-7c1e9a40: Ship the release?
Record: <bots state>/skilled-scratch%2Fhello/records/20261125T211204Z-7c1e9a40.json

Reply YES or NO.
```

**M04**, approval prompt with no options, button form. The buttons are `YES` and `NO`:

```text
Skilled bot hello
Run 20261125T211204Z-7c1e9a40: needs your decision
Reason: awaiting-decision
Needs-you item 20261125T211204Z-7c1e9a40: Ship the release?
Record: <bots state>/skilled-scratch%2Fhello/records/20261125T211204Z-7c1e9a40.json

Press a button to answer.
```

**M05**, run completed. `converged` is the stop reason a completed run records. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1131]

```text
Skilled bot nightly-report
Run 20261125T200000Z-1a2b3c4d: completed
Reason: converged
Record: <bots state>/skilled-scratch%2Fhello/records/20261125T200000Z-1a2b3c4d.json
```

**M06**, run failed. The class and the reason are the run record's, here a run stopped at its time budget:

```text
Skilled bot nightly-report
Run 20261125T193000Z-5e6f7a8b: failed (budget)
Reason: maxDurationReached
Record: <bots state>/skilled-scratch%2Fhello/records/20261125T193000Z-5e6f7a8b.json
```

**M07** to **M21**, one line each:

| ID | Text |
|----|------|
| M07 | `Answer 2 recorded for item 20261125T210504Z-3f9d2b11 by ada. The run resumes.` |
| M08 | `Item 20261125T210504Z-3f9d2b11 already has this answer. Nothing changed.` |
| M09 | `bots: telegram link code 482913, valid for 5 minutes` |
| M10 | `Linked. This chat now answers as ada.` |
| M11 | `This chat is not linked. Ask the operator to run bots channel link telegram on the host, then send the code here.` |
| M12 | `That code did not match. 2 more wrong codes lock this chat for 300 seconds.` |
| M13 | `This chat is locked for 247 more seconds after five wrong codes.` |
| M14 | `mallory is not an owner or member of this host's roster, so the answer was not recorded.` |
| M15 | `Item 20261125T210504Z-3f9d2b11 expired at 2026-11-26T21:05:04Z, so the answer was not recorded.` |
| M16 | `Approvals are not taken in a group chat. Answer in a direct chat with the bot.` |
| M17 | `The host has no roster, so answers from a chat are refused. The operator runs bots channel roster add <name> --role owner.` |
| M18 | `Item 20261125T210504Z-3f9d2b11 was already answered at 2026-11-25T21:06:30Z from another surface. Your answer was not recorded.` |
| M19 | `Item 20261125T210504Z-3f9d2b11 is being answered elsewhere right now. Send your answer again in a few seconds.` |
| M20 | `Reply with a number from 1 to 2, or NO.` |
| M21 | `bots: channel telegram: notice-20261125T210504Z-3f9d2b11-telegram is unknown: the send may have landed, so it is not retried` |

Rules for the varying fields:

- M07 names the 1-based choice number the press or reply chose. A `NO` on a prompt with options is no choice number, so M07 reads `Answer NO recorded for item <id> by <actor>. The run resumes.` there.
- M12 counts down from 4 to 1. The fifth wrong code sends M13 instead, with 300 seconds.
- M13 rounds the seconds left up to a whole number, so it never prints 0.
- M14 names the linked actor, never the chat's display name, so a chat cannot claim another person's name in the reply either.
- M20 names the highest choice number of the newest open prompt in that conversation. On a prompt with no options every reply `reply-grammar.md` accepts is a choice, so M20 is never sent there.
- M18 is the chat side of a race with the terminal. When the screen's overlay and a chat answer one item, the lock and the answer-identity check of `contracts/answer-seam.md` steps 6 and 8 let one win. A losing terminal answer goes to `Gone` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/design/state-machines.md:292], and a losing chat answer gets M18. A second answerer that finds the lock held for more than 2,000 ms gets M19.

---

## 4. CHECKS

Run from the repository root with no tty.

```bash
D=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design
rg -c '^\| M[0-9]{2} \| ' $D/message-catalog.md
ls $D/golden/*.txt | wc -l | tr -d ' '
for r in channel-unlinked channel-locked answer-not-approver item-expired channel-group-approval channel-roster-missing item-answered-differently item-busy; do rg -q "\`$r\`" $D/message-catalog.md || echo "MISSING $r"; done
for f in $D/golden/*.txt; do id=$(basename "$f" | cut -c1-3); t=$(sed -n '1p' "$f"); rg -qF -- "$t" $D/message-catalog.md || echo "DRIFT $id"; done
```

The first prints 36: 21 catalog rows and 15 one-line rows. The second prints 21. The two loops print nothing.
