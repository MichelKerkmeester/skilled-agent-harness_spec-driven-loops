---
title: "Feature Specification: Phase 5: memory"
description: "Adds two bounded memory files under the state root, one shared and one per bot, prepended to the prompt with typed entries carrying an actor, a source and a date, a bots remember verb, and a needs-you item that confirms a fact a bot proposes."
trigger_phrases:
  - "bot memory files"
  - "phase 5 memory"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: memory

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 10 |
| **Predecessor** | 004-computer-exposure |
| **Successor** | 006-approval-grants |
| **Handoff Criteria** | `bots remember`, `bots remember --list`, the two memory files and the `memory-proposal` item pass every acceptance criterion, and a bot with no memory file gets a prompt byte-identical to the one it gets today |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: The two memory files, the entry shape and its bound, the `bots remember` verb, the `memory` key in BOT.md, the prompt block, and the needs-you item that confirms a fact a bot proposes. The tidy rewrite, a memory service, an import or sync, a per-person file and the terminal screen's panes are other phases or no phase.

**Dependencies**:
- The state root's shared level and its per-identity level, which already sit beside each other [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:135]
- The one prompt builder and its one caller, which the block extends [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1044]
- The needs-you item and `bots answer`, which the confirmation extends [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:65]
- Phase 001's `by` on a needs-you answer, which names the operator who confirms a fact [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:125]

**Deliverables**:
- `memory/shared.md` under the state root and `memory/<bot-id>.md` under the identity folder, both owner-only
- Typed entries carrying a type, a date, an actor, a source and the text, bounded per file
- `bots remember <text>`, `--bot`, `--type`, `--as`, `--list`, `--json` and `--forget`
- The memory block in `buildBotPrompt`, and `memory: true` or `false` in BOT.md
- A `memory-proposal` needs-you item, and `bots answer <item-id> confirm` or `reject`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A bot starts every run with its BOT.md body, the bound spec folder and the decision rule, and nothing else [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315]. So a fact the operator told it last week is gone by the next run: the runtime has no memory module and BOT.md has no memory field [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92]. OpenBot splits memory by origin, where facts a person adds are shared with all their bots and facts a bot picks up stay with that bot [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:59-63], and skilled bots has neither half [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:55].

### Purpose
Give a bot two bounded memory files, one shared and one its own, prepended to its prompt, with a verb to add a fact and a needs-you item to confirm one a bot proposes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/bin/bots.cjs remember "the sales sheet is Q3" 2>&1 | head -1
bots: unknown verb: remember
$ node .skilled/bin/bots.cjs remember "the sales sheet is Q3" >/dev/null 2>&1; echo "exit=$?"
exit=2
$ rg -n -i 'memory' .skilled/skills/system-skilled-bots/runtime/lib/*.ts; echo "exit=$?"
exit=1
$ rg -n 'memory' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts; echo "exit=$?"
exit=1
```

The first two commands are the verb: the CLI has no `remember` and refuses it as a usage error [SOURCE: .skilled/bin/bots.cjs:64]. The third is the module: no file under `runtime/lib/` holds the word `memory` in any case, so there is no store to read [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:15]. The fourth is the prompt: `buildBotPrompt` names no memory, so a bot's prompt carries none [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:315].
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `memory/shared.md` under the state root and `memory/<bot-id>.md` under the identity folder, created owner-only on the first append and never created by a read
- Add one entry per line, carrying a type from `user`, `general`, `feedback` and `reference`, a `YYYY-MM-DD` date, an actor, a source and the text, and bound each file at 60 entries and 3,600 bytes with 400 characters per text
- Add `bots remember <text>` with `--bot <id>`, `--type <type>`, `--as <name>`, `--list`, `--json` and `--forget <n>`
- Prepend both files to the prompt in `buildBotPrompt`, shared first, and check the block for secret literals before dispatch
- Add `memory: true` or `false` to BOT.md, default true, so a bot can be kept from reading the shared file
- Turn a bot's `[REMEMBER] <type> <fact>` line into a `memory-proposal` needs-you item that `bots answer` confirms or rejects

### Out of Scope
- The tidy rewrite, where a model rewrites a crowded file shorter - OpenGhost's `tidy` needs a model call inside a verb, and this phase refuses an append at the bound instead [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11]
- A memory service, embeddings or ranked recall - OpenBot's content and recall live in CopilotKit Intelligence, and a small team reads two files [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:370-383]
- An import or a source sync - the lineage that ranked the store first puts the source sync fourth, and no source is named for this phase [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/lineages/vibe-1/research.md:308]
- A per-person memory file - the state root is already per OS user, so a second level buys nothing until a shared host lands [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/lineages/devin-2/research.md:95]
- The spec-kit's continuity writer - it writes session context into a packet's own documents, not into a per-bot memory [SOURCE: .skilled/skills/system-spec-kit/references/memory/memory-system.md:17]
- A `bots memory` verb beside `bots remember` - `--list` covers the read, and a second verb is a second parser for one file shape [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/lineages/devin-1/research.md:51]
- The terminal screen's memory pane - phase 003 draws activity, inbox and routine panes, and no memory pane is among them [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:123]
- A `THIRD_PARTY_NOTICES.md` entry for the bound - three numbers are not a lifted file, and the parent's notices table does not name this phase [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:109]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/memory.ts` | Create | The entry shape, the parser, the renderer, the bound, the append and the forget |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modify | Name the shared `memory/` folder and file and the identity's `memory/` folder, and create the identity's |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modify | Insert the memory block into the prompt, and parse the `[REMEMBER]` marker |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Read both files, check the block for secret literals, and write a `memory-proposal` item |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Modify | Add `kind` and `proposal` to the item, default `kind`, and ignore a proposal in the hold and the resume wait |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Confirm or reject a proposal instead of enqueuing a resume |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modify | Accept `memory` as a boolean, default true |
| `.skilled/bin/bots.cjs` | Modify | Add the `remember` verb and its options |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | Add the commented `memory` line |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | Add the `memory.ts` row to the module table |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | Modify | Name `bots remember` and the confirm and reject answers |
| `.skilled/skills/system-skilled-bots/bots-run/SKILL.md` | Modify | Add `bots remember` to the mode's verbs |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modify | Name `memory` in the template's field list |
| `.skilled/skills/system-skilled-bots/runtime/tests/memory.vitest.ts` | Create | The entry shape, the bound, the append, the forget and the render |
| `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts` | Modify | The block's place in the prompt, the unchanged prompt, and the `[REMEMBER]` parse |
| `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts` | Modify | `kind`, `proposal`, the default, and a proposal that holds nothing |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Modify | Confirm and reject, and the absent resume request |
| `.skilled/skills/system-skilled-bots/runtime/tests/definition.vitest.ts` | Modify | The `memory` key and its refusal |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modify | The block in the prompt, the secret check and the proposal item |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts` | Modify | The `remember` verb and its exit codes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bots remember <text>` appends one entry to `memory/shared.md` under the state root, carrying type `general` unless `--type` names `user`, `general`, `feedback` or `reference`, today's date as `YYYY-MM-DD`, the actor from `--as` or the OS user, the source `bots remember` and the text, then prints the entry's index and the file path and exits 0 |
| REQ-002 | `bots remember <text> --bot <id>` appends the same entry to `<stateRoot>/<identityKey>/memory/<id>.md`, with the same fields and the same source |
| REQ-003 | An append that would take a file past 60 entries or 3,600 bytes is refused with `bots: memory-full: <path> (<n> entries, <b> bytes)` and exit 1, leaving the file unchanged, and a text over 400 characters is refused with `bots: memory-entry-too-long: <n>` and exit 1 |
| REQ-004 | `bots remember --list [--bot <id>] [--json]` prints each entry with its index, type, date, actor, source and text, then the file path with its entry and byte counts against the bounds, and writes nothing |
| REQ-005 | `bots remember --forget <n> [--bot <id>]` removes entry `n` and rewrites the file, and refuses an index that names no entry with `bots: memory-entry-unknown: <n>` and exit 2 |
| REQ-006 | `buildBotPrompt` inserts the shared file's entries and then the bot's file's entries between the protocol lines and the body, each under a heading that names its file, omits a heading for an empty file, and returns today's prompt byte for byte when both files are empty or absent |
| REQ-007 | A `[REMEMBER] <type> <fact>` line in a clean run's answer becomes a `memory-proposal` needs-you item carrying the type, the fact and the proposing bot, and the run ends `completed` rather than `awaiting-decision`, while a `[NEEDS-DECISION]` line in the same answer outranks it and a `[REMEMBER]` line in a failed run writes no item |
| REQ-008 | `bots answer <item-id> confirm` on a `memory-proposal` item appends the fact to the proposing bot's file with the answering operator as actor and `bot:<bot-id>` as source, `reject` appends nothing, neither enqueues a resume request, and any other answer is refused with exit 2 |
| REQ-009 | A `memory-proposal` item holds no bot and awaits no resume, so `holdForBot` and `itemAwaitingResume` ignore it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | BOT.md accepts `memory` as a boolean, default true, where `false` injects neither file into that bot's prompt and any other value is refused as `memory-invalid` |
| REQ-011 | The memory block is checked for secret literals before dispatch, and a match refuses the run as `body-secret` naming the memory file rather than the value |
| REQ-012 | Both files are created owner-only, a 0700 folder and a 0600 file, and a bot id that is not a safe segment is refused by name instead of becoming a path |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a state root holding no memory, `bots remember "the sales sheet is Q3"` exits 0, and `bots remember --list` prints one `general` entry dated today with the OS user as its actor
- **SC-002**: A bot whose two files hold one entry each gets a prompt holding both entries between the decision rule and its body, and a bot with no file gets the prompt it gets today
- **SC-003**: A run whose child prints `[REMEMBER] user Prefers ISO dates.` leaves one open `memory-proposal` item, and `bots answer <item-id> confirm` appends that fact to the bot's file with the operator as its actor
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The state root's shared and per-identity levels | There is nowhere to put either file | Name both through `sharedStatePaths` and `identityStatePaths`, and create the identity's folder in `ensureIdentityState` |
| Dependency | `buildBotPrompt` and its one caller | The block reaches no prompt | Add the block to the builder and pass it from the one call site, so no second prompt path exists |
| Dependency | The needs-you item and `bots answer` | A proposal has no way to be confirmed | Add `kind` and `proposal` to the item, and branch `answerItem` on `kind` |
| Risk | A memory file holds a secret literal and reaches the prompt | A key reaches a child's context | Add the block to the secret check's text list and test a fact holding a key |
| Risk | The prompt grows without bound | A child's context is spent on memory | Bound each file at 3,600 bytes, so the block is at most 7,200 bytes plus two headings |
| Risk | A `memory-proposal` item holds its bot forever | The bot never runs again | Filter both `holdForBot` and `itemAwaitingResume` on `kind`, and test that a proposal holds nothing |
| Risk | An item written before this phase carries no `kind` | Every existing item is refused | Read a missing `kind` as `decision`, and test one |
| Risk | A hand-edited line does not parse | The whole file is refused and memory is lost | Skip the line, count it, and print the count in `--list` rather than refusing the file |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `bots remember --list` over a file at its bound, 60 entries and 3,600 bytes, prints in under 100 ms on the reference machine, measured with `time`
- **NFR-P02**: The prompt block adds at most 7,200 bytes plus two headings, so a run's prompt grows by a bounded amount and never by the file's history

### Security
- **NFR-S01**: Both files are created 0600 inside a 0700 folder, the same rule the state root already applies to its own folders
- **NFR-S02**: The block is checked for secret literals before dispatch, and the refusal names the file and the key, never the value
- **NFR-S03**: A bot id is validated as a safe segment before it becomes a file name, so no id can escape the memory folder

### Reliability
- **NFR-R01**: A missing memory folder or file reads as empty and creates nothing, so a read never writes
- **NFR-R02**: A line the parser cannot read is skipped and counted, and the rest of the file still reaches the prompt
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a state root with no memory folder prints `bots: no memory` and exits 0 from `--list`, and the prompt carries no block
- Maximum input: a file at 60 entries or 3,600 bytes refuses the next append with `memory-full` and leaves the file unchanged
- Failure path: `bots remember` with no text and neither `--list` nor `--forget` exits 2 with `bots: remember needs a fact`
- Failure path: `bots remember --forget 99` exits 2 with `bots: memory-entry-unknown: 99`
- Failure path: `bots remember x --bot ../etc` exits 2 with `bots: --bot takes a bot id`
- Failure path: `bots answer <item-id> maybe` on a `memory-proposal` item exits 2 with `bots: answer takes confirm or reject`
- Failure path: a run that prints `[REMEMBER]` and then fails writes no item, so a half-finished proposal is never offered
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 20 files, about 700 lines, one new module, one CLI verb and one item field |
| Risk | 8/25 | A new file shape and a prompt change; no schema, no network, no migration of stored files |
| Research | 3/20 | The 002 research names the split, the bound and the review item; no new investigation |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- How large may a file grow before it is rewritten shorter? Decision: 60 entries and 3,600 bytes per file, and 400 characters per text, taken from OpenGhost's `LIMITS`; an append past either bound is refused rather than rewritten, because a rewrite needs a model call inside a verb.
- Does the bound need a `THIRD_PARTY_NOTICES.md` entry? Decision: no, three numbers are not a lifted file, and the parent's notices table does not name this phase.
- Where does `bots remember` live in the hub? Decision: the run mode, because it writes state and the operator who confirms a proposal is already there; the status mode keeps its two read commands.
- Does a confirmed proposal resume the run that proposed it? Decision: no, that run already ended `completed`, and there is nothing to continue.
- Does a proposal name its own type, or does the runtime pick one? Decision: the child names it in the `[REMEMBER]` line, and a line naming no type is refused as `remember-type-invalid` rather than guessed.
<!-- /ANCHOR:questions -->

---
