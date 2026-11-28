---
title: "Implementation Summary"
description: "bots chat gives a person one append-only conversation with their bots, one headless run per message, @bot routing and a transcript the pane and the channels read."
trigger_phrases:
  - "conversation runtime implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb"
    last_updated_at: "2026-11-28T10:40:00Z"
    last_updated_by: "openbot-build-010-002"
    recent_action: "Built the conversation runtime and the chat verb and closed every acceptance row"
    next_safe_action: "Merge the unit branch into system-skilled-bots"
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-bots/runtime/lib/conversation.ts"
      - ".skilled/bin/bots.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-conversations"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-conversation-runtime-and-chat-verb |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now talk to your bots. `bots chat my-bot --message hello` appends your message to one append-only file under the state root, runs the bot once with the conversation in its prompt and prints `my-bot › <reply>`. Without `--message` you get a terminal loop with history, completion and bracketed paste.

### Phase 2: conversation-runtime-and-chat-verb

A conversation belongs to your identity and lives at `<stateRoot>/<identity>/conversations/<id>.jsonl`, one nine-key message per line. The bot id is the default conversation name, so several bots share one file, and `--conversation` names another. A line that starts with `@other-bot` sends that one message to another bot. A bot id that fails the id pattern or has no `BOT.md` refuses `bot-unknown`, a message holding a stored secret refuses `body-secret` and a prompt over the bound refuses `prompt-over-budget`, all with exit 4 and all before anything is appended, so pressing Enter again is safe.

Each run receives the newest 40 messages or 8,000 characters inside one `<conversation id="...">` block, with the untrusted label on the next line and one `<human>` or `<bot>` line per message, every reserved tag written as `&lt;`. The reply is the answer text the runner already redacted, so an echoed secret reaches the file as `[redacted: <name>]`. A parked run appends `needs you: <question> (item <id>)` and also raises its inbox item, and after `bots answer <item> yes` the resumed run's reply lands in the same conversation, because the conversation id rides on the request, the item and the resume request. `--transcript` prints the messages, and `--transcript --json` prints `{"version": 1, "conversationId": ..., "messages": [...]}`. A torn last line is skipped and reported on stderr, and the file's bytes never change on a read.

For phase 011: `renderChannelBlock` is exported and renders `<conversation channel="<name>">` with the same label, and the drain appends a bot message for any request that carries `conversationId`, whatever its source. A request from a channel therefore gets its reply appended once it carries that key.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/conversation.ts` | Created | The message record, the append, the read with the torn-line skip, the routing parse, the bound, the block and its channel form and the checks before the append |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modified | The identity's `conversations` folder |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts` | Modified | `conversationId` on the request, in `RECORD_KEYS` and in its validator |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Modified | `conversationId` on the item, in `ITEM_KEYS` and in its validator |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified | The `answer` on the completed outcome and the key on both run request kinds and on the item literal |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modified | Stamps the item's `conversationId` on the resume request |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Modified | The `requestIds` filter, the `run` and `reply` on each drain line, no retry for a chat request and the single appender of bot messages |
| `.skilled/bin/bots.cjs` | Modified | The `chat` verb: one message, `--message -`, the transcript, the loop and the paste |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modified | The module row and the topology edges |
| `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` | Modified | The `## 010-conversations` section for the turnstone loop |
| `.skilled/skills/system-skilled-bots/SKILL.md`, `bots-run/SKILL.md`, `bots-run/references/run-queue-and-answer.md` | Modified | Name `bots chat` as a run-mode verb |
| `runtime/tests/conversation.vitest.ts`, `runtime/tests/cli-chat.vitest.ts` | Created | 30 module tests and 11 CLI tests |
| `runtime/tests/queued-run.vitest.ts`, `runtime/tests/runner.vitest.ts`, `runtime/tests/state-root.vitest.ts` | Modified | Four drain tests, two outcome tests and the folder list |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`cli-mistral-vibe` workers on `deepseek-flash` wrote the code and the tests, one file per worker, in waves whose workers wrote disjoint files. The setup tasks T001 to T005 write nothing, so the orchestrator ran them itself. Wave A had ten workers on the new module, the record and item keys, the identity folder and the four docs. Waves B to D added the append, the read, the routing and the bound, the drain and runner changes and the two extended test files. The block, the secret check, the channel form, the CLI paths, the module tests, the README and the CLI tests followed, the last with the paste beside it. Every Vibe worker finished with `exit_code=0 outcome=finished`. After each wave the orchestrator read the diff and ran the verify commands itself.

One verify failed. The paste worker's change passed the piped probe, but a probe through a pseudo terminal made by `script` sent a three-line paste as three runs. The one retry ran on cli-pi with `llmgateway/deepseek-v4.1-flash-1017` and passed both forms. The live probes ran on a scratch checkout with its own state root, a scratch Skilled tree and the stub executor, so no model was called and the operator's state was untouched. The whole gate ran last.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The drain is the only writer of bot messages | A reply then lands the same way for a typed message, a resumed run and a later channel request, and the verb reads it back from the drain line |
| A chat request never retries, and a would-be retry quarantines with its cause | A retry would run the same message twice and append two replies to one question |
| An empty reply is stored as `(no reply)` | The completed exit reason is the internal word `converged`, which would mean nothing to the person reading |
| A reply that starts with a reserved prefix gets a leading backslash | `needs you:` and `failed:` are then never forged by a bot's own text |
| The check before the append composes the body, the spec folder and the block only | Memory and skills load in the runner after the append, so a prompt they push over the bound appends `failed: prompt-over-budget` rather than refusing up front |
| `--message -` reads all of stdin and strips one trailing line feed | A piped stack trace stays one message with its inner line feeds |
| `conversation.ts` imports `memory.ts` | The reserved-tag escape already lives there, and the README records the extra edge |
| The `conversations` folder is made by `ensureIdentityState`, and a read creates no file | The folder belongs to the identity like its siblings, and a transcript of a new conversation prints the empty shape |
| A paste at a terminal is tagged when readline emits each line | The loop body runs after the paste has ended, so a flag read there is already false |
| `bots chat` is not in `CHILD_REFUSED_VERBS` | It dispatches runs the way `bots run` does, and `bots run` is open inside a bot run, with the runner's recursion guard reading the process ancestry |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd $R && npm test` | PASS, `Test Files  55 passed (55)` and `Tests  742 passed (742)`, exit 0. Baseline 53 files and 695 tests, so +2 files and +47 tests with none lost |
| `cd $R && npm run typecheck` | PASS, exit 0, baseline exit 0 |
| `cargo test --locked --manifest-path crates/bots-tui/Cargo.toml` | PASS, exit 0, every `test result: ok` |
| `parent-skill-check.cjs .skilled/skills/system-skilled-bots` | PASS, `all hard invariants passed, 0 warnings`, exit 0 |
| Named filters | `conversation.vitest.ts`: torn 1, bound 1, injection 8, channel 1, escape 1, routing 8, adversarial 1. `cli-chat.vitest.ts`: one message, routing, parked, duplicate, resumed, secret, three-line paste and bot-unknown 1 each. The T020 and T021 filters 1 each |
| Live probes on a scratch checkout | One message exit 0 and 2 messages, `@other-bot` routed, 9 keys and `by` `bot`, `/exit` exit 0 with nothing appended, the envelope keys `conversationId messages version`, a control character dropped and the line feed kept |
| Paste through a pseudo terminal | One human message `one\ntwo\nthree` and one run, then a typed `hi` as its own message |
| Temp folders | The five touched test files alone leave none. The 200 `bots-*` folders the full suite left and the 106 the crate tests left were removed, so the count is back at 6,203 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The resumed message links to its item through the run record.** REQ-012 reads as if the resumed run's id were the item id, but a resumed run gets a fresh id. The item link is `request.resumedItemId` on that run's record, which the test checks. The alignment phase can reword REQ-012.
2. **The tasks.md builder is not enough for a live probe.** A probe also needs an identity in the scratch config, a scratch Skilled tree passed as `--skilled-tree`, the stub executor on PATH and one approval run, because a worktree checkout refuses `skilled-tree-is-worktree`. The acceptance commands that name no `--repo` read the operator's own checkout.
3. **The suite proves the piped paste only.** The terminal form depends on readline's paste keys, so it is proven by the `script` probe and not by a test.
4. **A run that memory or skills push over the bound appends `failed: prompt-over-budget`.** The check before the append cannot see those blocks, so this refusal is the one that appends.
5. **A bot run can chat.** With `SKILLED_BOT_RUN_ID` set, `bots chat my-bot --message hi` appended two messages and exited 0 on the scratch checkout, as `bots run` completes there too. `bots.cjs` says each later write verb joins `CHILD_REFUSED_VERBS`, and no task in this phase names the verb for it, so whether a bot run may append to a conversation is left for the review phase.
6. **`state-root.vitest.ts` was edited outside the owner rows.** Its folder list had to include `conversations` for the suite to stay green.
<!-- /ANCHOR:limitations -->

---
