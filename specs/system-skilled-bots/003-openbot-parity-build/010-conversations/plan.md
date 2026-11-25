---
title: "Implementation Plan: Phase 10: conversations"
description: "One `conversation.ts` module holding an append-only JSONL, one `chat` verb in the bots CLI that appends a message and drains exactly the run it queued, one `answer` field on the runner's completed outcome, and the chat pane in the phase 003 crate."
trigger_phrases:
  - "conversations plan"
  - "bots chat plan"
  - "conversation jsonl plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: conversations

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22+ for the runtime, CommonJS for the CLI, Rust 2021 for the crate |
| **Framework** | None in the runtime; ratatui 0.30 with crossterm 0.29 in `crates/bots-tui` |
| **Storage** | One append-only JSONL per conversation under the user-level state root, beside the run records |
| **Testing** | vitest for the runtime and the CLI, `cargo test` for the crate |

### Overview
`conversation.ts` owns the whole file contract: the message record, one `appendFileSync` per message, a read that returns every whole line and skips a trailing partial one, the `@bot` parse and the transcript bound. The `chat` verb appends the human message, enqueues one request whose event id is that message's id, and drains exactly that request through a new `requestIds` filter on `drainQueue`, so a chat message reuses the claim, retry and quarantine routing instead of a second dispatch path. The reply comes from the runner's `completed` outcome, which gains the `answer` text the runner already extracts, and the crate's chat pane calls the same two verbs the loop calls.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs chat my-bot` prints `bots: unknown verb: chat` and exits 2, the measured gap this phase closes
- [ ] `rg -c 'conversation' .skilled/skills/system-skilled-bots/runtime/lib/` exits 1, so no module owns a conversation today
- [ ] Phase 003 is closed, so `bots ui` and `crates/bots-tui/` exist and the chat tab draws its placeholder
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx tsc --noEmit` exits 0
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` for every target
- [ ] `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Append-only log, one writer, one reader.

### Key Components
- **`conversation.ts`**: the message record, the append, the read, the `@bot` parse and the transcript bound. It imports `state-root.ts` and nothing else, so the file contract has one owner.
- **The `chat` verb in `bots.cjs`**: the loop, the one-message path and the transcript read. It holds argv and printing, and no rule the module could hold.
- **`requestIds` on `DrainInput`**: one filter over `listInbox`, so a chat message runs through the same claim, retry and quarantine routing a drained request does, and the run record's request join names a real request.
- **`answer` on the `completed` outcome**: the reply text, taken from the `finalAnswerText` the runner already computes, so the chat module never learns an executor's log format.
- **The crate's chat pane**: `cli.rs` reads and sends, `ui_state.rs` holds the draft and the scroll offset, `panes.rs` draws the transcript, `keys.rs` binds the keys and draws their labels.

The loop follows turnstone's `TerminalUI` shape: readline with a history length, a completer over a fixed command list, and one line classified before it is dispatched. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:176-181] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1276-1305] The lift is Apache-2.0, so the notice names the file and the changes. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:132]

### Data Flow
A line typed at the loop reaches the `chat` verb, which parses a leading `@<bot-id>` and appends one human message. The verb enqueues one request with `source: 'chat'` and `eventId` set to that message's id, then drains exactly that request. The drain claims it and calls `runBot` with the transcript as the request prompt; the runner composes the BOT.md body, then `REQUEST_PROMPT_HEADER`, then the transcript, so the standing role is never replaced. When the run ends the verb reads the outcome and appends one bot message carrying the run id and the answer text, or the question and item id, or the failure reason. The pane calls `bots chat <id> --transcript --json` to draw and `bots chat <id> --message <text>` to send, so it holds no file knowledge.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Names every per-identity folder and creates it | update - add `conversations` to the paths and to `ensureIdentityState` | `rg -n 'conversations' .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` prints the field and the `mkdirSync` |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Owns the claim, retry and quarantine routing | update - add the `requestIds` filter | `rg -n 'requestIds' .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` prints the input field and the filter |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Owns the prompt composition and the outcome union | update - return `answer` on the `completed` outcome | `rg -n 'answer' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints the outcome field and its fill |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Owns `buildBotPrompt` and `finalAnswerText` | unchanged - the chat reads both and changes neither | `rg -n 'buildBotPrompt\|finalAnswerText' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` prints both |
| `.skilled/bin/bots.cjs` | Owns the verb set, the usage text and the exit codes | update - add the `chat` verb | `node .skilled/bin/bots.cjs chat --help` exits 0 and names `--message`, `--transcript` and `--conversation` |
| `.opencode/bin/bots.cjs` | Byte-identical mirror of the CLI | update - copy the edited file | `diff -q .skilled/bin/bots.cjs .opencode/bin/bots.cjs` prints nothing |
| `crates/bots-tui/` | Draws the four panes over `bots ... --json` | update - the chat pane replaces the placeholder | `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok` |
| `bots status --json` | Producer of the header's bot count | not a consumer - this phase reads it and changes none | `node .skilled/bin/bots.cjs status --json` still exits 0 |
| `bots answer` | The one write path the screen had | unchanged | `node .skilled/bin/bots.cjs answer <id> deny` still exits 0 |
| `bots run`, `bots enqueue`, `bots drain` | The existing dispatch paths | unchanged - the chat reuses `drainQueue` and adds no second path | `node .skilled/bin/bots.cjs drain` still exits 0 |

Required inventories:
- Same-class producers: `rg -n 'appendFileSync|writeStateAtomic' .skilled/skills/system-skilled-bots/runtime/lib/` lists every writer, so a new append cannot be added without naming its mode.
- Consumers of changed symbols: `rg -n 'RunOutcome|DrainInput|IdentityStatePaths' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader of the three changed types.
- Matrix axes: two roles (human, bot) by four outcomes (completed, failed, awaiting-decision, refused) by two addressing modes (`@bot`, default bot), plus the torn-line, empty-message and unknown-bot cases.
- Algorithm invariant: the file is append-only, so a message's line is written once and never rewritten; the read returns every whole line and skips only a trailing partial one.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the state layout, the drain's claim loop, the runner's prompt composition and the turnstone loop, then captures the baseline suite result. Implementation writes `conversation.ts`, the `conversations` folder, the `requestIds` filter and the `answer` field, then the `chat` verb and the crate's chat pane. Verification runs the runtime suite, the crate's tests, one live message against a temporary state root, and the packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `conversation.ts`: the message shape, the append, the torn-line read, the `@bot` parse and the bound | `npx vitest run tests/conversation.vitest.ts` |
| Unit | `request-drain.ts`: the `requestIds` filter runs one request and leaves the rest queued | `npx vitest run tests/queued-run.vitest.ts` |
| Unit | `runner.ts`: the `completed` outcome carries the answer text | `npx vitest run tests/runner.vitest.ts` |
| Integration | `bots chat` argv, the one-message path, the loop's `/exit`, the unknown-bot refusal and the duplicate send | `npx vitest run tests/cli-chat.vitest.ts` |
| Render | the chat pane draws the transcript and the footer names its keys | `cargo test --manifest-path crates/bots-tui/Cargo.toml` |
| Manual | one message sent from the loop and one from the pane, read back through `--transcript` | `bots chat <id>`, then `bots chat <id> --transcript` |

The torn-line test writes a whole line, then a partial line with no newline, and asserts the read returns the whole message and reports the partial one. The duplicate test enqueues the same message id twice and asserts the second result is `duplicate` with no second run record.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node 22+ with `tsx` | External | Green | The runtime modules do not load |
| `better-sqlite3` | External | Green | Only `bots status` needs it, and the chat does not |
| Phase 003's `bots ui` verb and crate | Internal | Yellow | The chat pane has no screen; the verb and the file are still provable |
| The queue's claim and routing | Internal | Green | A chat message would need a second dispatch path |
| Rust stable toolchain | External | Green | The crate's tests cannot run; the runtime is unaffected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a chat message writes a line the read cannot parse, or a message dispatches a run the queue cannot account for.
- **Procedure**: revert the commit that adds `conversation.ts`, the `chat` verb and the crate's pane. The conversation files under the state root are left in place and read by nothing, and the queue, the runner and the status index are unchanged by the revert.
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
| Setup | Phase 003 closed, and the baseline suite green | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The phase handoff, which closes the program |
<!-- /ANCHOR:phase-deps -->

---

