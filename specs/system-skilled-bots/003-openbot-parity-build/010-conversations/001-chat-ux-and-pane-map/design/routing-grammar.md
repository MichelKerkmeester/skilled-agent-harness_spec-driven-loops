---
title: "Design: @bot routing grammar"
description: "The @<bot-id> address grammar of a chat message: where it may stand, what may follow it, whether it stays in the stored text, what an invalid or unknown id does and the default conversation and default bot of bots chat <id>."
trigger_phrases:
  - "bot routing grammar"
  - "at bot address"
  - "chat default conversation"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The `@<bot-id>` routing grammar

`@<bot-id>` at the start of a human message routes that message to that bot, and a message with no address goes to the conversation's bot (`../../002-conversation-runtime-and-chat-verb/spec.md` REQ-004). The requirement left four things open: whether the prefix is stored, what follows it, what an invalid id does and which conversation `bots chat <id>` opens. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:191] This file closes them. The record keeps the question open for this file to answer. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:368]

One parser in `conversation.ts` applies this grammar to every human message, from the loop, from `--message` and from the pane, so one line routes one way everywhere.

---

## 1. THE GRAMMAR

The parse runs on the text after every control character but the line feed is dropped (D10 in `contracts/decisions.md`) and before anything is appended.

```text
message  = [ space* address ( space+ rest | end ) ] | rest
address  = "@" token
token    = one or more characters that are not whitespace
```

| # | Rule | Example in | Routed to | Stored `text` |
|---|------|------------|-----------|---------------|
| 1 | An address is `@` as the first character after leading whitespace, followed at once by a token | `@digest summarize the threads` | `digest` | `@digest summarize the threads` |
| 2 | The token runs to the first whitespace character or the end of the text | `@digest, are you there?` | Refused: the token is `digest,` | Nothing |
| 3 | A token is a bot id only when it matches the runtime's bot id pattern `^[a-z0-9][a-z0-9-]*$` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:88] and the checkout defines that bot | `@other-bot hello` | `other-bot` | `@other-bot hello` |
| 4 | Only the first address routes. A later `@` is text | `@digest ask @hello first` | `digest` | `@digest ask @hello first` |
| 5 | An `@` that is not the first character is text | `mail ada@example.com the notes` | The default bot | The same |
| 6 | An `@` followed by whitespace or by nothing is text, not an address | `@ 5pm works for me` | The default bot | The same |
| 7 | An address with nothing after it is an empty message | `@digest` | Refused, usage | Nothing |
| 8 | No address | `is the release ready?` | The default bot | The same |

The stored `text` is the text as typed after that drop, the prefix included. The routing result is the message's `botId`, so the prefix is never the only record of where a message went. Keeping it means the bot reads `<human> @digest summarize the threads` in its block (`prompt-boundary.md` section 1) and so knows the message was addressed to it by name. This matches the record's sample line. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:364]

---

## 2. WHAT AN ADDRESS CHANGES

An address routes one message. It does not change the conversation's default bot, so the next line with no address goes back to the default. The loop's prompt keeps showing the default bot for that reason (`loop-transcript.md` section 1). A sticky address would make one typed line change where every later line goes without the person seeing it.

An address never changes the conversation. A message to `@digest` typed in conversation `hello` is appended to `hello.jsonl`, and `digest`'s reply is appended there too. That is what lets several bots share one thread.

---

## 3. THE DEFAULT CONVERSATION AND THE DEFAULT BOT

| Command | Default bot | Conversation file |
|---------|-------------|-------------------|
| `bots chat <id>` | `<id>` | `<identity>/conversations/<id>.jsonl` |
| `bots chat <id> --conversation <name>` | `<id>` | `<identity>/conversations/<name>.jsonl` |

A conversation belongs to the identity, not to one bot. The bot id is its default name, which is decision D1 of `../../002-conversation-runtime-and-chat-verb/goal.md`. `<name>` must be a safe path segment, the runtime's own check. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:166-168] The file path is `contracts/records.md` section 10's.

`<id>` itself is checked first: a positional bot the checkout does not define is refused `bot-unknown` before the loop starts or the message is read.

---

## 4. THE REFUSALS

| Case | Refusal | Exit | Appended | Why this layer |
|------|---------|------|----------|----------------|
| A token that fails the bot id pattern: `@Hello`, `@digest,`, `@../x` | `bots: bot-unknown: <token>` | 4 | Nothing | `contracts/refusals.md` section 3.9 gives the chat verb one name for an id it cannot route, and the frozen contract names no second one. A malformed id is an id the checkout does not define |
| A well-formed token with no bot behind it: `@ghost` | `bots: bot-unknown: ghost` | 4 | Nothing | The same row |
| The positional `<id>` is not defined | `bots: bot-unknown: <id>` | 4 | Nothing | The same row |
| An address with nothing after it: `@digest` | `bots: chat needs a message after @digest`, then the usage text | 2 | Nothing | A check `bots.cjs` makes on its own input, so the usage layer (`contracts/refusals.md` section 2), as `--message ""` is |
| `--conversation` that is not a safe segment | `bots: --conversation takes a safe name`, then the usage text | 2 | Nothing | The same layer |

The token is printed after control characters are stripped, so a refusal line cannot move the cursor. The refusal happens before the secret check and before the append, so a refused message leaves no line and starts no run, which is REQ-004's "nothing is appended".

---

## 5. TESTS THE GRAMMAR NEEDS

`../../002-conversation-runtime-and-chat-verb/tasks.md` carries one test per rule in section 1 and one per row in section 4, in `conversation.vitest.ts` and `cli-chat.vitest.ts`. The eight rules and five refusals are the routing axis of that phase's matrix.

---

## 6. SOURCES

| What the grammar follows | Pointer |
|--------------------------|---------|
| The gap this file closes | [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:191] |
| The bot id pattern | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:88] |
| The safe segment check | [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:166-168] |
| The record's sample, prefix kept | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:364] |
| The one refusal name for an unroutable id | `contracts/refusals.md` section 3.9 |
| The usage layer and its exit | `contracts/refusals.md` section 2 |
