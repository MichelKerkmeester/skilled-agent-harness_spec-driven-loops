---
title: "Contract: refusals and exit codes for the parity build"
description: "Every refusal the fourteen phases add with its phase, layer, failure class, exit code and whether it enters the runner's typed registry, plus every exit code the runtime has today."
trigger_phrases:
  - "bots refusal table"
  - "bots exit codes"
  - "refusal causes registry"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Refusals and exit codes

One table of every refusal the packet adds, and one table of the exit codes the runtime already has. A phase that adds, renames or reclasses a refusal edits this file in the same change, per the rule in [README.md](README.md).

Paths in citations are repository-relative. `L/` below means `.skilled/skills/system-skilled-bots/runtime/lib/` and `B/` means `specs/system-skilled-bots/003-openbot-parity-build/`, the same prefixes the plan-depth research uses.

---

## 1. EXIT CODES THAT EXIST TODAY

The runner exports six codes, and the CLI returns them. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:113-120]

| Code | Name in `EXIT_CODES` | Meaning | Who returns it |
|------|----------------------|---------|----------------|
| 0 | `completed` | The run completed, or the verb did what it was asked | `exitCodeFor` for a completed run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:318-321] and every verb on success |
| 1 | `runFailure` | A dispatched run failed, or the CLI caught a throw | `exitCodeFor` for a failed run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:326-327] and the top-level catch in the CLI [SOURCE: .skilled/bin/bots.cjs:542-545] |
| 2 | `usage` | The command line itself is wrong: an unknown option, a missing value, a malformed request shape | `usageExit` prints `bots: <message>` then the usage text [SOURCE: .skilled/bin/bots.cjs:94-98], and the enqueue verb maps request-shape reasons to 2 [SOURCE: .skilled/bin/bots.cjs:200-206] [SOURCE: .skilled/bin/bots.cjs:252] |
| 3 | `recursionGuard` | A failed run whose runner exit was the recursion guard | `exitCodeFor` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:327] |
| 4 | `refused` | A run refused before dispatch, or a verb whose runtime call returned a refusal | `exitCodeFor` for a refused run [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:322-323] and `describeRefusal` callers such as the answer verb [SOURCE: .skilled/bin/bots.cjs:208-214] [SOURCE: .skilled/bin/bots.cjs:292-297] |
| 5 | `awaitingDecision` | The run parked a needs-you item and exited | `exitCodeFor` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:324-325] |

The definition checker keeps its own codes: 0 when every invariant passes, 1 when any `FAIL:` line printed and 2 when it stopped before auditing. [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:118] [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:168] A checker invariant below therefore exits 1.

The answer verb's own returns, line by line, are drawn in the screen's answer contract and are not copied here: [state-machines.md section 4.2](../003-terminal-screen/005-answer-flow/design/state-machines.md). Every refusal from `answerItem` exits 4 there, and that rule binds the rows below that reach the answer verb.

---

## 2. LAYERS AND THE EXIT RULE

| Layer | Where it is decided | How it surfaces | Exit | Enters `REFUSAL_CAUSES` |
|-------|---------------------|-----------------|------|-------------------------|
| Definition parse | `parseDefinition` and the parsers it calls | At run time as the run refusal `definition-malformed` with the parse reason as its detail [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:125] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:789], and in the checker as `definition.<reason>` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:150] | 4 at run time, 1 in the checker | No. The parse reason is a detail of `definition-malformed` |
| Checker invariant | `bot-check.cjs` | One `FAIL: <id>: <message>` line [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:110-113] | 1 | No |
| Run refusal | `runBot` before dispatch | A run record whose exit names the cause, and no child started | 4 | Yes |
| Verb refusal | `bots.cjs` or the runtime call a verb makes | `bots: <reason>` or `bots: <reason>: <detail>` on stderr [SOURCE: .skilled/bin/bots.cjs:208-214] | 2 when `bots.cjs` refuses before any runtime call, 4 when a runtime `Result` refused | No |
| Post-run cause | `runBot` after the child exited | A named cause on the run record. The run's own outcome and exit stand | The run's own exit | No |

The exit rule for a verb refusal is the one the CLI already follows: the parser and any check `bots.cjs` makes on its own input exit 2, and a refusal that comes back from a runtime call exits 4. A new verb follows the same rule unless its row below says otherwise and gives the reason.

---

## 3. REFUSALS THE PACKET ADDS

Class is the failure class the run record carries, one of `author`, `operator`, `environment`, `hub` or `budget`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:50] A dash means the layer carries no class. `null` means a run refusal whose class is null, as `disabled` and `lease-held` are today. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:130] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:136]

### 3.1 Phase 001, activity and actor

| Name or message | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|-----------------|-------|-------|------|------------------|--------|
| `bots: --as needs a tty` | Verb refusal (`answer`, `run`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:179] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:231] |
| `bots: --as takes a name` | Verb refusal | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:230] |
| `bots: option --as needs a value` | Verb refusal | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:230] |
| `grant-scope-unsupported` | Verb refusal (`answer`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:156] |
| `bots: --scope takes once or deny` | Verb refusal (`answer`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:156] |
| `bots: <reason>` for an index that cannot be opened | Verb refusal (`activity`) | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:229] |

The `activity` index failure keeps exit 1 because `bots status` already uses 1 for an index failure and the phase matches it on purpose. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:229]

### 3.2 Phase 002, routine layer

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `routine-trigger-conflict` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:163] |
| `routine-tell-with-targets` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:164] |
| `routine-starts-empty` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:174] |
| `routine-starts-multiple-cron` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:175] |
| `routine-starts-cron-not-first` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:175] |
| `routine-starts-multiple` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:175] |
| `routine-until-check-without-outcome` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:177] |
| `routine-until-shell-metacharacters` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:177] |
| `routine-floor-15-minutes` | Checker invariant, and an install refusal | - | 1 checker, 4 `bots install` | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:166] |
| `routine-fatigued` | Run refusal | `null` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:130] |
| `routine-completed` | Run refusal | `null` | 4 | Yes | Decided here, see section 5 |

### 3.3 Phase 004, computer exposure

Phase 004 adds no refusal. Its requirements add a prompt line and two record fields. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:140-148]

### 3.4 Phase 005, memory

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `memory-full` | Verb refusal (`remember`, `answer confirm`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:148] |
| `memory-entry-too-long` | Verb refusal (`remember`), checked in `bots.cjs` on its argument | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:148] |
| `memory-entry-unknown` | Verb refusal (`remember --forget`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150] |
| `memory-invalid` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:160] |
| `memory-secret` | Verb refusal (`remember`, `answer confirm`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:161] |
| `memory-proposal-secret` | Post-run cause | - | The run's own, 0 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:161] |
| `remember-type-invalid` | Post-run cause | - | The run's own, 0 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:264] |
| `review-answer-invalid` | Verb refusal (`answer` on a `memory-proposal` item, text other than `confirm` or `reject`) | - | 4 | No | Named here, see section 5 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:153] |
| `bot-id-invalid` | Verb refusal (`remember --bot`) | - | 2 | No | Named here, see section 5 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:162] |
| `prompt-over-budget` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:165] |
| `body-secret` for a memory file | Run refusal, existing cause | `author` | 4 | Already there [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:141] | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:161] |

The prompt budget and its overflow rule are in [prompt-sections.md](prompt-sections.md).

### 3.5 Phase 006, approval grants

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `answer-not-approver` | Verb refusal (`answer`, `enable`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:103] |
| `item-answered-differently` for a second answer with the same text and another scope, and for the loser of a race | Verb refusal (`answer`), existing reason | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:170-171] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:84-86] |
| `item-busy` | Verb refusal (`answer`), the item lock is held by a live process past the wait | - | 4 | No | Named here, see [answer-seam.md](answer-seam.md) step 5 |
| `action-kind-invalid` | Run failure reason after dispatch, for a run that parked a question with an `[ACTION: <kind>]` line naming no known kind | - | 1, the run is failed with class `author` | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:169] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:235] |
| `grant-kind-unknown` | Verb refusal, reserved. No rule store lands in this packet, so nothing can raise it yet | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:158] |

### 3.6 Phase 007, per-bot apps

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `apps-invalid` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:140] |
| `apps-unknown-server` | Checker invariant, failing closed | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:141] |
| `apps-refused` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:151] |
| `apps-unenforceable` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:144] |
| `utcp-config-missing`, `utcp-config-invalid` | Detail of `apps-refused` | `author` | 4 | No, they are details | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:182] |

### 3.7 Phase 008, vault

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `secret-no-input` | Verb refusal (`secret set`), in `bots.cjs` | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:146] |
| `secret-empty` | Verb refusal (`secret set`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:160] |
| `secret-placeholder` | Verb refusal (`secret set`) | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:160] |
| `secret-too-long` | Verb refusal (`secret set`), on the value read | - | 2 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:222] |
| `secret-write-dropped` | Verb refusal (`secret set`), the read-back found no value | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:161] |
| `secret-name-invalid` | Definition parse, and a verb refusal on `secret set` | - | 4 run, 1 checker, 2 verb | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:150] |
| `secret-unknown` | Run refusal | `operator` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:151] |
| `secret-store-unreadable` | Run refusal | `environment` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:223] |
| `secret-in-output` | Post-run cause. The line is redacted and the delivery withheld | - | The run's own | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:164] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:137] |

`secret-in-output` is one cause name for the `stdout.log` scan and for 010's reply scan. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:137] It is not a refusal, because the child already ran, so it stays out of `REFUSAL_CAUSES` and the run keeps the exit its outcome gives. Its field on the run record is in [records.md](records.md).

### 3.8 Phase 009, skills

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `skills-duplicate` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:172] |
| `skills-name-invalid` | Definition parse | - | 4 run, 1 checker | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:172] |
| `skills-unknown` | Checker invariant | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:171] |
| `skills-too-large` | Checker invariant | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:171] |
| `skills-over-budget` | Checker invariant | - | 1 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:171] |
| `skill-unknown` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161] |
| `skill-too-large` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162] |
| `skills-over-budget` | Run refusal | `author` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162] |
| `skill-unreadable` | Run refusal | `environment` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:229] |
| `skill-changed` | Run refusal | `operator` | 4 | Yes | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:175] |
| `run-record-missing` | Verb refusal (`skill propose`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:211] |
| `review-already-exists` | Verb refusal (`skill propose`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:231] |
| `proposal-secret` | Verb refusal (`skill propose`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:173] |
| `proposal-stale` | Verb refusal (`answer` on a `skill-proposal` item) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:165] |

The checker names are plural (`skills-unknown`) and the run names singular (`skill-unknown`), as the phase writes them. Both spellings are kept because the checker audits the list and the runner names the one skill. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:241]

### 3.9 Phase 010, conversations

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `bot-unknown` | Verb refusal (`chat`), nothing is appended | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:155] |
| `body-secret` for a human message | Run refusal with the existing cause. Nothing is appended | `author` | 4 | Already there | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:170] |
| `prompt-over-budget` | Run refusal, 005's cause | `author` | 4 | Yes, one entry | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:165] |
| `secret-in-output` on the reply | Post-run cause, 008's name | - | The run's own | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:170] |

### 3.10 Phase 011, messaging channels

| Name | Layer | Class | Exit | `REFUSAL_CAUSES` | Source |
|------|-------|-------|------|------------------|--------|
| `channel-unlinked` | Inbound refusal. The message reaches no bot. From the CLI it is reachable only in tests | - | 4 where a verb returns it | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185] |
| `channel-locked` | Inbound refusal, with the seconds remaining | - | 4 where a verb returns it | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:186] |
| `channel-roster-missing` | Verb refusal (`channel link`, `channel roster add --role member`) and an answer refusal on the `channel` surface | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:187] |
| `channel-roster-owner` | Verb refusal (`channel roster remove`) | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:207] |
| `channel-group-approval` | Inbound answer refusal for a group chat | - | 4 where a verb returns it | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:187] |
| `channel-signature` | Inbound refusal on the WhatsApp webhook before any parse | - | None, the webhook answers the HTTP request | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:194] |
| `channel-daemon-unreachable` | Send refusal on the Signal transport. The queue keeps the entry | - | 4 on `channel send` or `channel drain` | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:240] |
| `channel-listening` | Verb refusal (`channel listen`), the per-channel lease is held | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:248] |
| `unsupported` | The adapter result for an undeclared operation, `retryable: false` | - | Not a CLI exit | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:183] |
| `answer-not-approver`, `item-expired` on a press | Answer refusals, existing names | - | 4 | No | [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:187-188] |

`channel-unsupported` is not new. It is the evidence a delivery entry on an unknown channel already records today, and it returns for a channel target if 011 is reverted. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:142] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:166]

### 3.11 Phases 012 to 014

These phases test, align and review. They add no refusal.

---

## 4. THE REGISTRY AFTER THE PACKET

`REFUSAL_CAUSES` today holds 25 causes. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:122-149] The packet adds the twelve below and removes none, so the registry ends at 37.

| Cause | Phase | Class |
|-------|-------|-------|
| `routine-fatigued` | 002 | `null` |
| `routine-completed` | 002 | `null` |
| `prompt-over-budget` | 005 | `author` |
| `apps-refused` | 007 | `author` |
| `apps-unenforceable` | 007 | `author` |
| `secret-unknown` | 008 | `operator` |
| `secret-store-unreadable` | 008 | `environment` |
| `skill-unknown` | 009 | `author` |
| `skill-too-large` | 009 | `author` |
| `skills-over-budget` | 009 | `author` |
| `skill-unreadable` | 009 | `environment` |
| `skill-changed` | 009 | `operator` |

Every entry keeps the shape `{ reason, class }` the registry already types. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:149]

---

## 5. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| `routine-fatigued` is decided at the `disabled` check: when the `disabled` switch is set and the routine state file records `fatiguedAt`, the run is refused `routine-fatigued` instead of `disabled` | Fatigue sets the `disabled` switch, and the `disabled` check refuses before anything else could name fatigue [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:822-823] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:167]. Without this the name 002 requires can never be recorded |
| The `completed` switch refuses as `routine-completed`, class `null`, checked beside `disabled` | 002 adds the switch and reads it before the lease but names no cause for it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:64] |
| Definition parse names are details of `definition-malformed`, never registry entries | The runner already folds every parse refusal into that one cause [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:789] |
| `memory-full` exits 4, not 1 | Exit 1 means a run failure or a caught throw [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:115] [SOURCE: .skilled/bin/bots.cjs:542-545], and the screen classes exit 1 as a throw. A full file is a runtime refusal |
| `memory-entry-too-long` exits 2 | The length is checked on the argument before any file is read, which is the usage layer |
| `memory-entry-unknown` keeps the phase's exit 2 | A new verb may treat an index that names nothing as a bad argument. It does not reach the answer verb |
| A non-`confirm` answer on a memory proposal is refused `review-answer-invalid` with exit 4 | Every `answerItem` refusal exits 4 and the screen depends on it [SOURCE: .skilled/bin/bots.cjs:292-297]. The phase names no reason and says exit 2 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:153] |
| An unsafe `--bot` id on `remember` is `bot-id-invalid`, exit 2 | The phase says "refused by name" and names none [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:162] |
| `memory-proposal-secret` and `remember-type-invalid` are post-run causes: the run stays `completed`, no item is written and the cause is recorded on the run record beside `secret-in-output` | The child already ran, and 005 ends a proposing run `completed` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152] |
| `action-kind-invalid` ends the run failed with class `author`, exit 1 | The item is not written [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:235], so the run cannot park. The bot author wrote the bad line |
| `item-busy` is a new answer refusal, exit 4 | The lock that [answer-seam.md](answer-seam.md) takes needs a name for a holder that is still alive |
| `secret-too-long` exits 2 and `secret-write-dropped` exits 4 | The first is a check on input read before any store is touched. The second is a runtime finding after a write |
| `secret-unknown` is class `operator`, `secret-store-unreadable` is `environment` | The operator sets the missing name. A folder that cannot be read is the host's |
| `skill-changed` is class `operator` | The operator reinstalls to record the new digest |
| `channel-signature` has no CLI exit | It is answered inside the webhook handler before any verb sees the body |
