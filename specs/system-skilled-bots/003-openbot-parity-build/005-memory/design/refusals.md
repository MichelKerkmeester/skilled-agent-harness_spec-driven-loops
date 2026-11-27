---
title: "Design: the memory refusal catalogue"
description: "Every refusal this phase adds or reuses, with its layer, failure class, exit code, registry entry, exact stderr text, trigger and the test that proves it, plus the exit map for the remember verb and the answer verb's review path."
trigger_phrases:
  - "memory refusals"
  - "remember exit codes"
  - "memory-full message"
  - "review answer invalid"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The memory refusal catalogue

The packet's table owns the names, the layers, the classes and the exits. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.4 Phase 005, memory"] This note adds the three things a builder needs and the table does not carry: the exact stderr text, the trigger that produces each one and the test that proves it.

The exit rule is the CLI's own. A check `bots.cjs` makes on its own input exits 2. A refusal that comes back from a runtime call exits 4. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "2. LAYERS AND THE EXIT RULE"]

---

## 1. THE NAMED REFUSALS

### 1.1 Verb refusals, exit 4

| Name | Trigger | Exact stderr | Test |
|------|---------|--------------|------|
| `memory-full` | An append would take the file past 60 entries or 3,600 bytes | `bots: memory-full: <path> (<n> entries, <b> bytes), free a line with bots remember --forget <entry-id>`, with ` --bot <botId>` at the end for a bot's own file | `memory.vitest.ts`, `bound` |
| `memory-secret` | A fact `bots remember` or `bots answer confirm` would append holds a known secret literal | `bots: memory-secret: <key>` | `memory.vitest.ts` `secret` and `answer.vitest.ts` `proposal secret` |
| `review-answer-invalid` | `bots answer` on a `memory-proposal` item with a text other than `confirm` or `reject` | `bots: review-answer-invalid: <text>` | `answer.vitest.ts`, `proposal answer invalid` |

`memory-full` exits 4 and not 1 because exit 1 means a run failure or a caught throw, and a full file is a runtime refusal. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "5. DECISIONS TAKEN"]

`review-answer-invalid` exits 4 because every `answerItem` refusal exits 4 and the screen depends on it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "5. DECISIONS TAKEN"]

### 1.2 Verb refusals, exit 2

| Name | Trigger | Exact stderr | Test |
|------|---------|--------------|------|
| `memory-entry-too-long` | The fact argument is over 400 characters, checked before any file is read | `bots: memory-entry-too-long: <n>` | `cli-run.vitest.ts`, `remember too long` |
| `memory-entry-unknown` | `--forget <entry-id>` names an id no entry in the file has | `bots: memory-entry-unknown: <entry-id>` | `memory.vitest.ts`, `forget` |
| `bot-id-invalid` | `--bot <id>` is not a safe segment | `bots: bot-id-invalid: <id>` | `cli-run.vitest.ts`, `remember bot id` |

`memory-entry-too-long` exits 2 because the length is checked on the argument before any file is read, which is the usage layer. `memory-entry-unknown` keeps exit 2 because a new verb may treat an id that names nothing as a bad argument. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "5. DECISIONS TAKEN"]

### 1.3 The definition parse

| Name | Trigger | Exact stderr | Exit | Test |
|------|---------|--------------|------|------|
| `memory-invalid` | The `memory` key holds a value that is not a boolean | `bots: definition-malformed: memory-invalid` at run time, `FAIL: definition.memory-invalid` in the checker | 4 at run time, 1 in the checker | `definition.vitest.ts`, `memory` |

The parse reason is a detail of `definition-malformed` and never a registry entry, which is the packet's rule for every parse refusal. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "4. THE REGISTRY AFTER THE PACKET"]

### 1.4 Post-run causes

| Name | Trigger | Effect on the run | Test |
|------|---------|-------------------|------|
| `memory-proposal-secret` | A `[REMEMBER]` fact holds a known secret literal | The run stays `completed`, no item is written, the cause is recorded on the run record | `runner.vitest.ts`, `proposal secret` |
| `remember-type-invalid` | A `[REMEMBER]` line names no type, or a type outside the four | The run stays `completed`, no item is written, the cause is recorded | `runner.vitest.ts`, `remember type` |
| `remember-fact-too-long` | A `[REMEMBER]` fact is over 400 characters | The run stays `completed`, no item is written, the cause is recorded | `runner.vitest.ts`, `remember fact too long` |

All three are post-run causes because the child already ran and this phase ends a proposing run `completed`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "5. DECISIONS TAKEN"] None enters `REFUSAL_CAUSES`, because none refuses a run. Each is written to the run record's top-level `postRunCauses` as one `{cause, names, detail}` entry, and a run with no cause reads `[]` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS", row `postRunCauses`].

### 1.5 The run refusals

| Name | Class | Exit | Registry | Trigger | Exact stderr | Test |
|------|-------|------|----------|---------|--------------|------|
| `prompt-over-budget` | `author` | 4 | Yes, one of the packet's twelve | The composed prompt is over 32,000 characters after the conversation gave way | `bots: prompt-over-budget: <block> at <n> of 32000 characters` | `dispatch.vitest.ts`, `over budget` |
| `body-secret` | `author` | 4 | Already there | A rendered memory block holds a known secret literal | `bots: body-secret: memory <path> holds a literal of <kind> <name>` | `runner.vitest.ts`, `memory secret` |

`prompt-over-budget` is the only registry entry this phase adds, and the registry ends at 37 causes. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "4. THE REGISTRY AFTER THE PACKET"] The block names are `exemption`, `spec-folder`, `working-place`, `checkout`, `memory`, `skills`, `decision-marker`, `body`, `request-prompt` and `resume`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md, section "4.3 The overflow rule"]

---

## 2. THE USAGE LAYER, EXIT 2, NO NAME

These are the parser's own refusals. They carry no name because they never reach a runtime call, and the CLI prints them in the `bots: <message>` form the usage exit already uses. [SOURCE: .skilled/bin/bots.cjs:94]

| Trigger | Exact stderr |
|---------|--------------|
| No fact and neither `--list` nor `--forget` | `bots: remember needs a fact` |
| `--list` with a fact | `bots: remember --list takes no fact` |
| `--forget` with a fact | `bots: remember --forget takes no fact` |
| `--list` and `--forget` together | `bots: remember takes --list or --forget, not both` |
| `--json` without `--list` | `bots: --json needs --list` |
| `--type` outside the four | `bots: --type takes user, general, feedback or reference` |
| `--as` empty | `bots: --as takes a name` |
| `--forget` not eight lowercase hex characters | `bots: --forget takes an entry id` |
| Two positionals | `bots: unexpected argument: <second>` |
| An option the verb does not take | `bots: remember takes no --<option>` |

Each of these prints the usage text after the message, which is what `usageExit` already does. [SOURCE: .skilled/bin/bots.cjs:94]

---

## 3. THE REFUSALS THIS PHASE'S PATHS REUSE

A builder must not invent a new name where one of these already fits.

| Name | Where it reaches this phase | Exit | Owner |
|------|-----------------------------|------|-------|
| `answer-empty` | `bots answer <id> ""` on a proposal item | 4 | today |
| `item-unknown` | `bots answer` on an id that names no item, or an unsafe id | 4 | today |
| `item-expired` | `bots answer` on a proposal item past its expiry | 4 | today |
| `item-answered-differently` | A second answer with another text or scope | 4 | today |
| `answer-secret` | The answer text holds a known secret literal | 4 | today |
| `item-busy` | The item lock's holder is alive and the 2,000 ms wait ran out | 4 | 006 |
| `item-field-invalid` | A proposal item whose `proposalFact` is over 400 characters | 4 | today |
| `unknown-key` | A definition carrying a key the parser does not know, or an item carrying one | 4 run, 1 checker | today |

`item-field-invalid` is the backstop that makes `memory-entry-too-long` unreachable from the settle path, because the item's validator refuses an over-long `proposalFact` before the settle reads it.

---

## 4. THE EXIT MAP FOR THE TWO VERBS

### 4.1 `bots remember`

| Outcome | Exit | stdout | stderr |
|---------|------|--------|--------|
| An append landed | 0 | `bots: entry <n> in <path> (<n> of 60 entries, <b> of 3600 bytes)` | nothing |
| A list printed | 0 | `bots: <path> (<n> of 60 entries, <b> of 3600 bytes)` as the header, then one line per entry, and `, <k> line skipped` inside the header's bracket when the parser skipped any | nothing |
| A list found no file | 0 | `bots: no memory in <path>` | nothing |
| A forget landed | 0 | `bots: entry <entry-id> forgotten from <path> (<n> of 60 entries, <b> of 3600 bytes)` | nothing |
| A bound was reached | 4 | nothing | `bots: memory-full: <path> (<n> entries, <b> bytes), free a line with bots remember --forget <entry-id>` |
| A secret literal was found | 4 | nothing | `bots: memory-secret: <key>` |
| The argument was wrong | 2 | nothing | `bots: <message>` then the usage text |
| The file could not be written | 1 | nothing | `bots: <the throw's message>` |

### 4.2 `bots answer` on a `memory-proposal` item

| Outcome | Exit | stdout | stderr |
|---------|------|--------|--------|
| `confirm` settled the fact | 0 | `bots: item <id> answered; memory-proposal review recorded` | nothing |
| `reject` settled the item | 0 | `bots: item <id> answered; memory-proposal review recorded` | nothing |
| The same answer again | 0 | `bots: item <id> answered; memory-proposal review recorded` | nothing |
| Any other text | 4 | nothing | `bots: review-answer-invalid: <text>` |
| The file is full | 4 | nothing | `bots: memory-full: <path> (<n> entries, <b> bytes), free a line with bots remember --forget <entry-id>` |
| The fact holds a secret literal | 4 | nothing | `bots: memory-secret: <key>` |
| The item is expired | 4 | nothing | `bots: item-expired: expired at <instant>` |
| The item was answered differently | 4 | nothing | `bots: item-answered-differently: answered at <instant>` |

The `reviewed` status and the `<kind> review recorded` line are the packet's, and this phase supplies the kind's name. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE", row 13]

---

## 5. WHAT THE SCREEN SEES

The screen classes every answer refusal as `gone` or `refused`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "1. THE SEQUENCE", row 10]

| Refusal | Screen class |
|---------|--------------|
| `item-unknown` | `gone` |
| `item-expired` | `gone` |
| `item-answered-differently` | `gone` |
| `review-answer-invalid` | `refused` |
| `memory-full` | `refused` |
| `memory-secret` | `refused` |
| `item-busy` | `refused`, and a retry with the same key is safe |

A `refused` class leaves the item open, so the operator can answer again with a text the review accepts. The bound and secret pre-check runs in the claim half, before the item is claimed and before the append, so a full file or a secret literal refuses without claiming the item and the item stays open with no settle to undo. The settle half keeps the same two checks as a backstop, because a file can fill between the claim and the write.

---

## 6. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| `memory-full` exits 4 | Exit 1 means a run failure or a caught throw, and a full file is a runtime refusal |
| `memory-entry-too-long` exits 2 and `memory-entry-unknown` exits 2 | Both are checks on the argument, and the packet's table fixes both |
| `review-answer-invalid` exits 4 | Every `answerItem` refusal exits 4 and the screen's `gone` and `refused` split depends on it |
| `bot-id-invalid` exits 2 | The id is an argument, and the packet names the refusal without an exit |
| The two post-run causes leave the run `completed` | The child already ran, and a proposing run ends `completed` by design |
| The usage layer carries no names | A parser refusal never reaches a runtime call, so a name would be a name nothing records |
