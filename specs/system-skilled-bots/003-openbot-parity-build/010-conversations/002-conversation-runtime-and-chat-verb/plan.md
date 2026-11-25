---
title: "Implementation Plan: Phase 2: conversation-runtime-and-chat-verb"
description: "One conversation.ts module holding an append-only JSONL and the conversation block renderer, one chat verb in the bots CLI that appends a message and drains exactly the run it queued, one answer field on the runner's completed outcome, and the conversation id carried from the parked item to the resumed answer."
trigger_phrases:
  - "conversations plan"
  - "bots chat plan"
  - "conversation jsonl plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: conversation-runtime-and-chat-verb

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22+ for the runtime, CommonJS for the CLI |
| **Framework** | None |
| **Storage** | One append-only JSONL per conversation under the user-level state root, beside the run records |
| **Testing** | vitest for the runtime and the CLI |

### Overview
`conversation.ts` owns the whole file contract: the message record, one `appendFileSync` per message, a read that returns every whole line and skips a trailing partial one, the `@bot` parse, the bound and the conversation block the prompt carries. The `chat` verb appends the human message, enqueues one request whose event id is that message's id, and drains exactly that request through a new `requestIds` filter on `drainQueue`, so a chat message reuses the claim, retry and quarantine routing instead of a second dispatch path. The reply comes from the runner's `completed` outcome, which gains the `answer` text the runner already extracts and redacts when it holds a known secret literal. A run that parks records its conversation id on the needs-you item, `answerItem` stamps that id on the resume request, and the drain appends the resumed run's answer to the same conversation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs chat my-bot` prints `bots: unknown verb: chat` and exits 2, the measured gap this phase closes
- [ ] `rg -c 'conversation' .skilled/skills/system-skilled-bots/runtime/lib/` exits 1, so no module owns a conversation today
- [ ] `../001-chat-ux-and-pane-map/design/routing-grammar.md`, `design/loop-transcript.md` and `design/prompt-boundary.md` exist
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0
- [ ] `test -L .opencode/bin && test -L .opencode/skills` exits 0, so the mirrors are the symlinks they are rather than files to copy
- [ ] Docs updated (spec, plan and tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Append-only log, one writer, one reader.

### Key Components
- **`conversation.ts`**: the message record, the append, the read, the `@bot` parse, the bound and the block renderer with its `id` and `channel` forms. It imports `state-root.ts` and nothing else, so the file contract has one owner (`contracts/runtime-architecture.md` section 1.2).
- **The `chat` verb in `bots.cjs`**: the loop, the one-message path and the transcript read. It holds argv and printing, and no rule the module could hold.
- **`requestIds` on `DrainInput`**: one filter over `listInbox`, so a chat message runs through the same claim, retry and quarantine routing a drained request does, and the run record's request join names a real request.
- **`answer` on the `completed` outcome**: the reply text, taken from the `finalAnswerText` the runner already computes and redacted when it holds a known secret literal, so the chat module never learns an executor's log format and the conversation never holds a value.
- **The conversation id on the resume request**: the parked run writes it on the needs-you item, `answerItem` stamps it at step 14 of `contracts/answer-seam.md`, and the drain appends the answer to that conversation. One field, three readers and no second lookup. Both records hold a closed key list that refuses an unknown key, so `ITEM_KEYS` and `RECORD_KEYS` gain the key and their two validators gain its check in the same change [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:97] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:190].

The loop follows turnstone's `TerminalUI` shape: readline with a history length, a completer over a fixed command list and one line classified before it is dispatched. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:176-181] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1276-1305] The lift is Apache-2.0, so the notice names the file and the changes. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:132]

### Data Flow
A line typed at the loop reaches the `chat` verb, which strips control characters, parses a leading `@<bot-id>`, runs the secret check and appends one human message. The verb enqueues one request with `source: 'chat'` and `eventId` set to that message's id, then drains exactly that request. The drain claims it and calls `runBot` with the rendered conversation block as the request prompt. `buildBotPrompt` joins the body, the blank line, `REQUEST_PROMPT_HEADER` and the block, so the standing role is never replaced and the 32,000 character check sees the whole prompt. That join moves into `buildBotPrompt` in phase 005 (`contracts/prompt-sections.md` section 6). When the run ends the verb reads the outcome and appends one bot message carrying the run id and the answer text, or the `needs you:` form with the item id, or the `failed:` form with the reason. A run that parks writes its conversation id on the item. `bots answer` stamps that id on the resume request it builds, and the drain appends the resumed run's answer to the same conversation. The sequence is drawn in `contracts/runtime-architecture.md` section 3.3.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Names every per-identity folder and creates it | update - add `conversations` to the paths and to `ensureIdentityState` | `rg -n 'conversations' .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` prints the field and the `mkdirSync` |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Owns the claim, retry and quarantine routing | update - add the `requestIds` filter and the resumed run's append | `rg -n 'requestIds\|conversationId' .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` prints the input field, the filter and the append |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Owns the answer write, the review seam and the resume request | update - stamp the item's conversation id on the resume request | `rg -n 'conversationId' .skilled/skills/system-skilled-bots/runtime/lib/answer.ts` prints the stamp |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Owns the item shape, `ITEM_KEYS` and `validateNeedsYouItem` | update - add `conversationId` to the key list and to the validator | `rg -n 'conversationId' .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` prints the field, the key and the check |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts` | Owns the request shape, `RECORD_KEYS` and `validateRequest` | update - add `conversationId` to the key list and to the validator | `rg -n 'conversationId' .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts` prints the field, the key and the check |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Owns the prompt composition and the outcome union | update - return `answer` on the `completed` outcome, redacted when it holds a known secret literal | `rg -n 'answer\|redacted' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints the outcome field, its fill and the redaction |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Owns `buildBotPrompt` and `finalAnswerText` | read - phase 005 moves the request join into `buildBotPrompt`, and this phase passes the rendered block to it | `rg -n 'buildBotPrompt\|finalAnswerText' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` prints both |
| `.skilled/bin/bots.cjs` | Owns the verb set, the usage text and the exit codes | update - add the `chat` verb | `node .skilled/bin/bots.cjs chat --help` exits 0 and names `--message`, `--transcript` and `--conversation` |
| `bots answer` | The one write path the screen had | unchanged as a verb - the module behind it gains the conversation id stamp | `node .skilled/bin/bots.cjs answer <id> deny` still exits 0 |
| `bots run`, `bots enqueue`, `bots drain` | The existing dispatch paths | unchanged - the chat reuses `drainQueue` and adds no second path | `node .skilled/bin/bots.cjs drain` still exits 0 |

Required inventories:
- Same-class producers: `rg -n 'appendFileSync|writeStateAtomic' .skilled/skills/system-skilled-bots/runtime/lib/` lists every writer, so a new append cannot be added without naming its mode.
- Consumers of changed symbols: `rg -n 'RunOutcome|DrainInput|IdentityStatePaths' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader of the three changed types.
- Matrix axes: two roles (human, bot) by four outcomes (completed, failed, awaiting-decision, resumed) by two addressing modes (`@bot`, default bot), plus the eight routing rules and five refusals of `../001-chat-ux-and-pane-map/design/routing-grammar.md`, the torn-line, empty-message, injection and secret-literal cases.
- Algorithm invariant: the file is append-only, so a message's line is written once and never rewritten. The read returns every whole line and skips only a trailing partial one. The append is the commit point, so a message with no run is reported rather than re-dispatched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the state layout, the drain's claim loop, the runner's prompt composition, the answer path and the turnstone loop, then captures the baseline suite result. Implementation writes `conversation.ts` with the block and the literal check, the `conversations` folder, the `requestIds` filter, the `answer` field with its redaction, the conversation id on the resume request and the two closed key lists it needs, then the `chat` verb. Verification runs the runtime suite, one live message against a temporary state root, one parked-then-resumed message and the packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `conversation.ts`: the message shape, the append, the torn-line read, the routing rules, the bound and the cut, the block and its `channel` form | `npx vitest run tests/conversation.vitest.ts` |
| Unit | `request-drain.ts`: the `requestIds` filter runs one request and leaves the rest queued, a resumed run's answer reaches its conversation, and an item and a request carrying `conversationId` both validate against their closed key lists | `npx vitest run tests/queued-run.vitest.ts` |
| Unit | `runner.ts`: the `completed` outcome carries the answer text, redacted when it holds a known secret literal | `npx vitest run tests/runner.vitest.ts` |
| Integration | `bots chat` argv, the one-message path, the loop's `/exit`, the refusals, the duplicate send, the parked-then-resumed answer, the secret refusal and the envelope against `contracts/fixtures/chat-transcript.json` | `npx vitest run tests/cli-chat.vitest.ts` |
| Manual | one message sent from the loop and read back through `--transcript` | `bots chat <id>`, then `bots chat <id> --transcript` |

The torn-line test writes a whole line and then a partial line with no newline. It asserts the read returns the whole message and reports the partial one. The duplicate test enqueues the same message id twice and asserts the second result is `duplicate` with no second run record and no second line. The injection test sends the eight cases of `../001-chat-ux-and-pane-map/design/prompt-boundary.md` section 4.2 and asserts each reaches the block as that table writes it, with no posture change and that the message's own text is the only record of the attempt. The secret test sends a message holding a stored literal and asserts nothing is appended and the run is refused `body-secret`, then makes a reply echo the value and asserts the appended line reads `[redacted: <name>]` and the record's `postRunCauses` carries `secret-in-output`. The reader test parses `contracts/fixtures/conversation.jsonl` line by line.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node 22+ with `tsx` | External | Green | The runtime modules do not load |
| `better-sqlite3` | External | Green | Only `bots status` needs it, and the chat does not |
| The design child's grammar, loop form and budget | Internal | Written, awaiting the key map approval that binds only the pane | The verb would decide them itself |
| Phase 005's request join in `buildBotPrompt` | Internal | Yellow | The total bound cannot see the block, so AC-009 stays unmet |
| The queue's claim and routing | Internal | Green | A chat message would need a second dispatch path |
| The answer path and the review seam 005 owns | Internal | Green | A resumed run's answer has no conversation to reach |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a chat message writes a line the read cannot parse, or a message dispatches a run the queue cannot account for.
- **Procedure**: follow `contracts/versioning.md` section 2. Run `bots disable` on each bot, strip `conversationId` from each item that carries it, then revert the commit that adds `conversation.ts`, the `chat` verb, the `requestIds` filter and the conversation id stamp, and re-send any quarantined chat request with `bots enqueue`. The conversation files under the state root are left in place and read by nothing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

This phase's build is dispatched, not hand-run. The hub owns the routing and each mode owns its dispatch contract, so this section names the executor, the model, the effort and the wave and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:16]. Two hub rules bind every dispatch: the target mode's `SKILL.md` is read before its prompt is composed [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198], and the executor CLI is the HOW, so it never overrides this packet's workflow [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206]. The two sibling children use this roster and this ladder.

### Executor roster

| Executor | Model | Effort lever | Dispatch shape | Source |
|----------|-------|--------------|----------------|--------|
| `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` or `--thinking max`, a standalone flag | `pi -p "<prompt>" --model llmgateway/deepseek-v4.1-flash-1017 --thinking <level> --mode text --offline </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157] |
| `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `#high` or `#max` on the model id | `opencode run --standalone -m opencode-go/deepseek-v4.1-flash#<level> --format json "<prompt>" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:142] |
| `cli-mistral-vibe` | `deepseek-flash` | none. The row's `thinking` is `max` and no flag moves it | `vibe -p "<prompt>" --model deepseek-flash --output-dir "$RUN_DIR/out" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:72] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] |
| `cli-devin` | `deepseek-v4-1-flash-max` | none. The max tier is baked into the uid | `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous -- "<prompt>" </dev/null` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:85] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md:59] |
| `cli-codex` | `gpt-6-luna` | `-c model_reasoning_effort="xhigh"` with `-c service_tier="fast"` | `codex exec --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "<prompt>"` | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:138] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:161] |

**Effort policy.** DeepSeek Flash at `high` carries a small mechanical task: a verb option, a doc line, a test that mirrors an existing one. DeepSeek Flash at `max` carries a design or tricky task: the new `conversation.ts` and its bound, the conversation block, the `requestIds` filter, the conversation id seam between this phase and 005's review seam. `gpt-6-luna` at `xhigh` on the `fast` service tier carries the hardest task and is the last fallback for every wave. GPT models go through `cli-codex` alone, because it is the hub's OpenAI-backed mode and no other row in this roster reaches an OpenAI model [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:28]. The parent's row for this phase names `--thinking max` as the phase's primary effort [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:206]. The mechanical waves below drop to `high` under the parent's own tier rule, which gives `high` to a small mechanical task and `max` to a design or tricky one [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:191].

**The worker rule.** Parallelism follows file overlap: no two workers touch one file, so a wave's worker count is the number of disjoint file groups its tasks fall into. The parent fixes this phase at three workers, which is the bound every wave below stays under [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:193] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:206].

### Waves

`tasks.md` owns the task ids and their verify clauses, and this table owns the assignment. Every wave walks the ladder in the fallback order below, and its executor column is that wave's entry point. The Files column names each file relative to the directory its task line gives: `lib/` and `tests/` sit under `$RT`, `bin/bots.cjs` under `.skilled/`, and the rest under `.skilled/skills/system-skilled-bots/`. The pane's crate tasks moved to `../003-chat-pane-and-proof/tasks.md` with their old ids T022 to T026 and T032, so this list skips those ids.

| Wave | Task ids | Files | Executor | Model | Effort | Workers in parallel | Verify |
|------|----------|-------|----------|-------|--------|---------------------|--------|
| 0 | T001 to T006 | none, six reads | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 1, because the six reads feed one baseline record and no file is written | V0 |
| 1 | T007 to T012, T033 | `lib/conversation.ts`, `lib/state-root.ts`, `lib/request-drain.ts` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 3, the file-overlap bound | V1 |
| 2 | T013, T034, T035 | `lib/runner.ts`, `lib/conversation.ts`, `lib/needs-you.ts`, `lib/request-record.ts`, `lib/answer.ts`, `lib/request-drain.ts` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 2: `runner.ts` with `conversation.ts`, and the four record files | V2 |
| 3 | T014 to T017 | `bin/bots.cjs` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking max` | 1, because all four tasks edit one file | V3 |
| 4 | T018 to T021 | `tests/conversation.vitest.ts`, `tests/cli-chat.vitest.ts`, `tests/queued-run.vitest.ts`, `tests/runner.vitest.ts` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 3: `conversation`, `cli-chat`, and `queued-run` with `runner` | V4 |
| 5 | T027 to T031 | `THIRD_PARTY_NOTICES.md`, `lib/README.md`, `bots-run/references/run-queue-and-answer.md`, `bots-run/SKILL.md`, `SKILL.md` | `cli-pi` | `llmgateway/deepseek-v4.1-flash-1017` | `--thinking high` | 2: the notices file, and the four doc files | V5 |
| 6 | T036, T037, T039 to T044 | none. The suite, three probes and the validator | the orchestrator, no external executor | none | none | 1 | V6 |

- **V0**: `rg -n 'VERB_SPECS|FLAG_OPTIONS' .skilled/bin/bots.cjs` prints both declarations and no `chat` entry. `rg -n 'conversations' $RT/lib/state-root.ts` exits 1. `rg -n 'listInbox' $RT/lib/request-drain.ts` prints the loop and no `requestIds`. `rg -n 'REQUEST_PROMPT_HEADER|kind: .completed.' $RT/lib/runner.ts` prints the header and the completed line. `rg -n 'setup_readline|SLASH_COMMANDS' specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py` prints both. `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count.
- **V1**: T007 to T012 and T033 each print what their verify clause says, and `cd $RT && npm run typecheck` exits 0.
- **V2**: T013, T034 and T035 each print what their verify clause says, and `cd $RT && npm run typecheck` exits 0.
- **V3**: `node .skilled/bin/bots.cjs chat --help` exits 0 and names `--message`, `--transcript` and `--conversation`. `printf '/exit\n' | node .skilled/bin/bots.cjs chat my-bot` exits 0 and appends nothing. `node .skilled/bin/bots.cjs chat my-bot --transcript --json | jq -r '.version, (.messages | type)'` prints `1` then `array`. `cd $RT && npm run typecheck` exits 0.
- **V4**: `cd $RT && npx vitest run tests/conversation.vitest.ts tests/cli-chat.vitest.ts tests/queued-run.vitest.ts tests/runner.vitest.ts` prints a `Test Files` line with no `failed` count.
- **V5**: `rg -n '^## 010-conversations|turnstone/cli.py' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints the heading and the source path. `rg -n 'conversation.ts' $RT/lib/README.md` prints the row. `rg -n 'bots chat' .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md .skilled/skills/system-skilled-bots/bots-run/SKILL.md .skilled/skills/system-skilled-bots/SKILL.md` prints three lines.
- **V6**: `cd $RT && npx vitest run` prints a `Test Files` line with no `failed` count. `cd $RT && npm run typecheck` exits 0. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb --strict` prints `RESULT: PASSED`.

Wave 6 runs in the orchestrator because each of its tasks reads the finished tree, so a dispatch would add a hop without adding evidence. `$RT` is `.skilled/skills/system-skilled-bots/runtime`, the same variable `tasks.md` uses.

### Fallback order

When a CLI runs out of usage, the wave moves down this ladder and keeps its task ids, its files and its verify step. The order is the parent's, not this phase's, so a phase that falls back still finishes at the effort it was planned for [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:212].

1. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017`, `--thinking high` or `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101]
2. `cli-opencode` at `opencode-go/deepseek-v4.1-flash#high` or `#max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78]
3. `cli-mistral-vibe` at `deepseek-flash`, always at the row's `max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89]
4. `cli-devin` at `deepseek-v4-1-flash-max`, probed first with a trivial read-only call, because a quota banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]
5. `cli-codex` at `gpt-6-luna`, `xhigh`, `fast`, the last fallback [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]

A wave that reaches the end of the ladder without a working executor stops and reports the wave, its task ids and the last refusal rather than authoring a file by hand outside the dispatch contract.

### Dispatch rules every worker carries

- Read the target mode's `SKILL.md` before composing the prompt, and attach the resolved agent persona to every dispatch [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198].
- Compose every prompt as the child preamble, then the inlined persona, then the task and set `AI_SESSION_CHILD=1` on the run [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:38] [SOURCE: .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:58].
- One change per brief: the file, the edit and the check that proves it.
- Read the outcome record, not stdout. `cli-mistral-vibe` counts a run complete only when `export.json` records `exit_code` 0 and `outcome` `finished` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:72].

### Self-invocation guards

A running CLI skill never dispatches itself, so the orchestrator removes its own row from the roster before the first wave. The ladder above is written to survive one row being gone.

| Executor | Refuses when | Source |
|----------|--------------|--------|
| `cli-pi` | never for being inside Pi, only from inside a fan-out lineage or when `cli-pi` already appears in the dispatch stack | [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:10] |
| `cli-opencode` | any `OPENCODE_*` env var other than `OPENCODE_API_KEY` is set, `opencode` is in the process ancestry, or `~/.opencode/state/<id>/lock` exists | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md:187] |
| `cli-mistral-vibe` | `VIBE_SESSION=1` is set, or `vibe-rs` or `vibe-app-server` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:16] |
| `cli-devin` | `$DEVIN_PROJECT_DIR` is set, or `devin` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:35] |
| `cli-codex` | `$CODEX_SESSION_ID` or any `CODEX_*` env var is set, or `codex` is in the process ancestry | [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:35] |

<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The design child's runtime-facing documents, and the baseline suite green | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | `../003-chat-pane-and-proof/`, and phase 011's chat path |
<!-- /ANCHOR:phase-deps -->

---
