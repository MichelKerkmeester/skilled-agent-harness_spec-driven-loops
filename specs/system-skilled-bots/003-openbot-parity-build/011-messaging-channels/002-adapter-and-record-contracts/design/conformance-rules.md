---
title: "Design: the five channel conformance rules"
description: "The five conformance rules the pre-expansion REQ-017 stated in one sentence, numbered, each with the fixture that proves it and the cell of the capability matrix that drives it."
trigger_phrases:
  - "channel conformance rules"
  - "fake transport fixture"
  - "unsupported result rule"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The five channel conformance rules

The pre-expansion REQ-017 carried five assertions in one sentence: an unsupported result, no platform reached, no provider error, one matching observation and a receipt. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:208] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:562] They match the reference checker. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:374-470] This file numbers them. `../../007-conformance-hardening-and-proof/` builds the suite, `tests/channel-conformance.vitest.ts`, over the fake transport in `tests/channel-support.ts`.

---

## 1. THE RULES

An operation is **declared** when its key in `capabilities.md` section 2 is `yes` for the transport under test.

| # | Applies to | Rule | Fails when |
|---|------------|------|------------|
| R1 | An undeclared operation | The result is the explicit unsupported result: `unsupported: true`, `retryable: false` and `sentBeforeError: false`, with an empty receipt. No throw escapes | Any of the three flags differs, the call throws or the receipt lists a platform id [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:396-418] |
| R2 | An undeclared operation | The fake platform records no wire call | One or more wire observations exist after the call [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:419-423] |
| R3 | A declared operation | The call returns a receipt and no send error | The result carries an error [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:426-434] |
| R4 | A declared operation | At least one wire observation matches the operation, the channel and the conversation the intent named and every observation the call made carries the intent's one idempotency key | No observation matches, or the call made observations under two keys. The reference asks for one match. The key clause is this phase's, because a second send of one message is the failure `channel-queue.ts` exists to prevent [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:435-445] |
| R5 | A declared `sendText` or `buttons` operation | The receipt's `platformMessageIds` is not empty and `primaryPlatformMessageId` is its first entry | Either is missing [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:446-490] |

---

## 2. THE FIXTURE

The fake transport is one object per channel name, built from that name's column of `capabilities.md` section 2. It records each wire call as `{operation, channel, conversation, idempotencyKey}` and returns a scripted result. It opens no socket and reads no token.

The suite is the product of five transports and five operations. `sendText`, `buttons`, `edit`, `react` and `file` are the five, because `receiveText`, `numberedReply` and `groupKnown` are inbound facts with no `send` intent.

| Operation | `terminal` | `telegram` | `slack` | `signal` | `whatsapp` |
|-----------|------------|------------|---------|----------|------------|
| `sendText` | R3 R4 R5 | R3 R4 R5 | R3 R4 R5 | R3 R4 R5 | R3 R4 R5 |
| `buttons` | R1 R2 | R3 R4 R5 | R3 R4 R5 | R1 R2 | R1 R2 |
| `edit` | R1 R2 | R1 R2 | R1 R2 | R1 R2 | R1 R2 |
| `react` | R1 R2 | R1 R2 | R1 R2 | R1 R2 | R1 R2 |
| `file` | R1 R2 | R1 R2 | R1 R2 | R1 R2 | R1 R2 |

That is 25 cases: 7 declared and 18 undeclared. Each case is one `it` named `<channel> <operation> R<n>[ R<n>]`, so `-t "R2"` runs the 18 undeclared cases.

Three cases ride on the same fake and are not rules, because the reference has no counterpart. They are `../../007-conformance-hardening-and-proof/` requirements:

- A press whose sender id differs from the link record's `senderId` is refused `answer-not-approver` and records no wire call.
- A parked question whose text holds a stored secret literal is withheld and records no wire call.
- A chunked send of 5,000 characters on `telegram` records two wire calls that carry one idempotency key, which R4 accepts as one send.

---

## 3. CHECKS

```bash
D=specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design
rg -c '^\| R[1-5] \|' $D/conformance-rules.md
awk '/^## 2\. THE FIXTURE/,/^That is 25/' $D/conformance-rules.md | rg -o 'R1 R2|R3 R4 R5' | sort | uniq -c
```

The first prints 5. The second prints 18 for `R1 R2` and 7 for `R3 R4 R5`.
