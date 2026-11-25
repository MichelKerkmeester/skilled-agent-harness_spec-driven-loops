---
title: "Implementation Plan: Phase 5: memory"
description: "Adds one memory module holding the entry shape, the parser, the renderer and the bound, names the shared and per-bot files in the state root, inserts the block into the one prompt builder, and turns a bot's remember line into a needs-you item that bots answer confirms or rejects."
trigger_phrases:
  - "bot memory files plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: memory

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, run through `tsx` from a Node 22 CLI |
| **Framework** | None; the runtime is plain modules with a `Result<T>` return convention |
| **Storage** | Two markdown files under the user-level state root, and JSON needs-you items beside them |
| **Testing** | Vitest, in `.skilled/skills/system-skilled-bots/runtime/tests/` |

### Overview
One new module, `memory.ts`, owns the entry shape, the parser, the renderer, the bound and the two writes, so no caller can write an entry the reader cannot read. `state-root.ts` names the shared file beside the identity folders and the per-bot file inside one, `dispatch.ts` inserts the rendered block into the one prompt builder and parses the `[REMEMBER]` marker, and `runner.ts` reads both files, checks the block for secret literals and writes a `memory-proposal` item. The needs-you item gains `kind` and `proposal`, `answer.ts` branches on `kind`, `definition.ts` gains the `memory` key, and `bots.cjs` gains the `remember` verb. The proof is the runtime suite plus four CLI probes whose output the acceptance criteria name.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs remember "the sales sheet is Q3"` prints `bots: unknown verb: remember` and exits 2
- [ ] `rg -n -i 'memory' .skilled/skills/system-skilled-bots/runtime/lib/*.ts` prints nothing and exits 1
- [ ] `rg -n 'memory' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` prints nothing and exits 1
- [ ] `rg -n 'ITEM_KEYS' .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` prints the declaration and no `'kind'` entry

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints `Test Files` with no `failed` line
- [ ] `node .skilled/bin/bots.cjs remember --list` exits 0 against a temporary state root
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered runtime modules behind one CLI.

### Key Components
- **`memory.ts`**: owns the entry line, its five fields, the four types, the three bounds, the parser, the renderer and the append and forget writes. It is the only place an entry is built or read, so the file a verb writes is the file the prompt renders.
- **`state-root.ts`**: owns where the two files live. The shared file sits beside the identity folders and the per-bot file inside one, which is the shape the root already has, so this adds two names and one `mkdir` rather than a subsystem.
- **`dispatch.ts`**: owns the prompt. It gains one input, one insert and one marker, so the block cannot reach a prompt by a second path.
- **`needs-you.ts`**: owns the item. It gains `kind` and `proposal`, and the two filters that keep a proposal from holding a bot.
- **`answer.ts`**: owns what an answer does. It branches on `kind`, so a proposal is confirmed or rejected and a decision still enqueues its resume.
- **`runner.ts`**: owns the run. It reads the two files, adds the block to the secret check's text list, and writes the proposal item when the child asks to remember.
- **`bots.cjs`**: owns argument parsing and the exit codes. It gains one verb and its options and no rule of its own.

### Data Flow
`bots remember "the sales sheet is Q3"` → `memory.ts` builds one entry, checks the bound, appends it to the shared file → the next run's `runner.ts` reads both files → `memory.ts` renders the block → `buildBotPrompt` inserts it between the decision rule and the body → the child reads it. A child that prints `[REMEMBER] user Prefers ISO dates.` → `parseDecisionMarker` returns `remember` → `runner.ts` writes a `memory-proposal` item and ends the run `completed` → `bots answer <item-id> confirm` → `answer.ts` calls `memory.ts` to append the fact to that bot's file with the operator as actor.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a persisted file shape, a prompt input and a needs-you item field, so every producer and consumer of all three is named here before implementation.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/memory.ts` | Does not exist | create | `rg -n "MEMORY_LIMITS\|parseMemory\|renderMemory\|appendEntry" runtime/lib/memory.ts` prints all four |
| `runtime/lib/state-root.ts` | Names the shared and per-identity folders | update | `rg -n "memory" runtime/lib/state-root.ts` prints the shared file, the identity folder and the create |
| `runtime/lib/dispatch.ts` | Builds the one prompt and parses the decision marker | update | `rg -n "memory\|REMEMBER_MARKER" runtime/lib/dispatch.ts` prints the input, the insert and the marker |
| `runtime/lib/runner.ts` | Reads the definition, checks secrets, writes the item | update | `rg -n "memory\|remember" runtime/lib/runner.ts` prints the read, the secret-check entry and the proposal branch |
| `runtime/lib/needs-you.ts` | Owns `NeedsYouItem` and `ITEM_KEYS` | update | `rg -n "'kind'\|'proposal'" runtime/lib/needs-you.ts` prints both keys and their checks |
| `runtime/lib/answer.ts` | Answers an item and enqueues its resume | update | `rg -n "memory-proposal\|confirm" runtime/lib/answer.ts` prints the branch and both answers |
| `runtime/lib/definition.ts` | Owns `FRONTMATTER_KEYS` and `BotDefinition` | update | `rg -n "'memory'" runtime/lib/definition.ts` prints the key and the boolean check |
| `runtime/lib/status.ts` | Reads the index and formats `bots status` | unchanged | `rg -n "memory" runtime/lib/status.ts` prints nothing; status shows no memory |
| `runtime/lib/status-index.ts` | Owns the index schema | not a consumer | `rg -n "memory" runtime/lib/status-index.ts` prints nothing; no column is added |
| `runtime/lib/run-record.ts` | Owns the run record | not a consumer | `rg -n "memory" runtime/lib/run-record.ts` prints nothing; a proposal is an item, not a record field |
| `scripts/bot-check.cjs` | Calls `parseDefinition` for every body | not a consumer | `rg -n "memory" scripts/bot-check.cjs` prints nothing; the key is validated by the parser it already calls |
| `bin/bots.cjs` | Parses verbs and options, maps exit codes | update | `node .skilled/bin/bots.cjs remember --list` exits 0 |
| `assets/bot-template.txt` | Names every field and its default | update | `rg -n "memory" assets/bot-template.txt` prints the commented line |
| `bots-run` skill docs | Name the run verbs | update | `rg -n "bots remember" .skilled/skills/system-skilled-bots/bots-run/` prints the reference row and the SKILL line |
| `bots-author` reference | Names the template's fields | update | `rg -n "memory" .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints the field |
| `bots-status` skill docs | Name the two read verbs | unchanged | `rg -n "remember" .skilled/skills/system-skilled-bots/bots-status/` prints nothing; the status mode keeps its two commands |

Required inventories:
- Same-class producers: `rg -n 'writeNeedsYouItem' .skilled/skills/system-skilled-bots/runtime/lib/` names every writer of an item, and `rg -n 'buildBotPrompt' .skilled/skills/system-skilled-bots/runtime/lib/` names the one builder and its one caller.
- Consumers of changed symbols: `rg -n 'NeedsYouItem|NeedsYouAnswer|parseDecisionMarker|buildBotPrompt|BotDefinition' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader.
- Matrix axes: file (2: shared, per-bot) × entry state (3: absent, one entry, at the bound) × bot key (2: `memory: true`, `memory: false`) = 12 rows, and `memory.vitest.ts` covers all 12.
- Algorithm invariant: the block a bot sees is a function of the two files and nothing else, and it is bounded. Adversarial cases: a line with no metadata, a line whose text holds a `|`, a text at 400 characters, a file at exactly 3,600 bytes, a bot id holding `..`, and a fact holding a secret literal.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `state-root.ts`, `dispatch.ts`, `needs-you.ts`, `answer.ts`, `definition.ts` and `bots.cjs` and records the current prompt, item keys, state paths, verb list and definition keys. Implementation adds `memory.ts`, the two paths, the prompt block, the `[REMEMBER]` marker, the item's `kind` and `proposal`, the answer branch, the `memory` key and the `remember` verb. Verification runs the runtime suite, the four CLI probes, the bound and the secret check, and the packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `memory.ts` entry parse and render, the three bounds, the append and the forget, `parseDecisionMarker`'s `remember` kind, `validateNeedsYouItem`'s `kind` and `proposal` | Vitest |
| Integration | `bots remember` through the file, the block in a built prompt, a proposal item written by a run, `bots answer confirm` through the file | Vitest with a temporary state root |
| Manual | `bots remember`, `bots remember --list`, `bots remember --forget`, `bots answer confirm` against a temporary state root | The `bots` CLI |

The one command that decides the phase is `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run`, which must print no `failed` line, followed by `node .skilled/bin/bots.cjs remember --list` against a temporary state root, which must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `tsx` | External | Green | The CLI cannot load a `.ts` runtime module; `bots.cjs` already registers it |
| `vitest` | External | Green | No test runs; the runtime's `package.json` already declares it |
| `node:fs` and `node:path` | Internal | Green | The two files cannot be read or written; both are already imported across the runtime |
| OpenGhost's `memory.js` | External | Green | The bound must be chosen without a reference; the numbers are read from the file and no code is copied |

No new package is added. The reference repository is read-only under `specs/system-skilled-bots/context/`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a bot with no memory file gets a prompt that differs from today's, or a `memory-proposal` item holds its bot so the bot never runs again.
- **Procedure**: delete any `memory-proposal` item file under the identity's `needs-you/` folder first, then revert the one commit. The two memory files stay on disk and the reverted runtime ignores them, so no stored fact is lost. An item carrying `kind` reads as an unknown key after the revert, and `holdForBot` then holds that bot as an unreadable item, which is why the item files go first.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing; it only reads | Implementation |
| Implementation | Setup's recorded prompt, item keys, state paths, verb list and definition keys | Verification |
| Verification | Implementation's module, prompt block, item fields and CLI verb | The phase handoff to 006-approval-grants |
<!-- /ANCHOR:phase-deps -->

---
