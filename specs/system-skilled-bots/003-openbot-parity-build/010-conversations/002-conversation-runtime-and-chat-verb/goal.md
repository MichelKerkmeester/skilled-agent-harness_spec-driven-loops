---
title: "Goal: Phase 2: conversation-runtime-and-chat-verb"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "conversation runtime goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb"
    last_updated_at: "2026-11-26T01:00:00Z"
    last_updated_by: "wo-08-writer"
    recent_action: "Moved the runtime directive here from the phase parent"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo08-010-002-runtime"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: conversation-runtime-and-chat-verb

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a person one conversation with their bots. `bots chat <id>` appends each message to an append-only file under the state root, dispatches one headless run per human message with the BOT.md body as the standing role, routes `@bot` to another bot, appends the resumed run's answer where the person asked and prints the transcript as the object envelope the pane and phase 011 read.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A conversation belongs to the identity, not to one bot. The bot id is the default conversation name, so several bots share one file and `--conversation` names a second. |
| D2 | The reply is the run's final answer text through the runner's existing `finalAnswerText`, never the whole stdout, so a JSON-log executor's envelope never reaches the conversation. |
| D3 | The append is the commit point. A message is appended before its run is enqueued, so a crash between the two leaves a message with no run, which `--transcript` reports as unanswered rather than re-dispatching. |
| D4 | The block a run receives holds the newest 40 messages or 8,000 characters, and the composed prompt is bounded to 32,000 characters, where the block gives way first and a prompt still over the bound with the block removed is refused `prompt-over-budget`. |
| D5 | A parked question is both a bot message and a needs-you item, because the conversation is where the person is looking when the run parks. |
| D6 | `conversationId` is one field with three readers, the item, the resume request and the drain and `ITEM_KEYS` and `RECORD_KEYS` gain it with their two validators in the same change. |
| D7 | `bots chat` lives in the run mode beside `bots answer`, because it dispatches runs. No fifth hub mode is added. |
| D8 | The transcript prints as the three-key object of `contracts/cli-json.md` section 3.1, never a bare array, per `contracts/decisions.md` D2. |
| D9 | A bracketed paste is one draft with its line feeds kept, and the next Enter sends that draft as one message, so a pasted stack trace starts one run and not one run per line. When stdin is a terminal the loop turns bracketed paste on at start and off at exit. The design mirrors a GPL reference, so no code is copied. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/conversation.vitest.ts` prints a `Test Files` line with no `failed` count, covering the message shape, the append, the torn line, the routing rules, the bound, the block and its `channel` form.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-chat.vitest.ts` prints a `Test Files` line with no `failed` count, covering the one-message path, `/exit`, `bot-unknown`, the duplicate send, the resumed answer, `body-secret` and the three-line paste that dispatches exactly one run and appends one human message holding the three lines.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/queued-run.vitest.ts tests/runner.vitest.ts` prints a `Test Files` line with no `failed` count.
- [ ] `printf '/exit\n' | node .skilled/bin/bots.cjs chat my-bot; echo "exit=$?"` prints `exit=0` on a state root holding a `my-bot` `BOT.md`, and appends no message.
- [ ] `node .skilled/bin/bots.cjs chat my-bot --transcript --json | jq -r 'keys | join(" ")'` prints `conversationId messages version`.
- [ ] `rg -n '^## 010-conversations|turnstone/cli.py' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints the heading and the source path.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Implementation | Pending | `node .skilled/bin/bots.cjs chat my-bot` printed `bots: unknown verb: chat` and exited 2 on 2026-11-26, the measured gap `spec.md` records |
| Acceptance criteria | Pending | All fourteen rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Moved from the phase parent | `plan.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md` were the parent's, moved here when 010 became a phase parent. REQ-008, AC-008, SC-004 and the crate tasks moved to `../003-chat-pane-and-proof/` with their ids. |
| Envelope changed | The pre-expansion REQ-006 printed a JSON array. It now prints the object of `contracts/cli-json.md` section 3.1, and AC-003, AC-006 and T016 read `.messages`. |
| Refusal exit changed | The pre-expansion T015 exited 2 on a secret. `contracts/refusals.md` section 3.9 gives `body-secret` exit 4. |
| Wave order departs from the task numbering | `tasks.md` numbers T033 to T035 after the tests and the docs, but those three are module work, so `plan.md` section 8 runs them in waves 1 and 2 and keeps every task id. |
| The drain's result carries the outcome | F-010 offered adding the run outcome to the drain's result or having the verb read the reply from the file. The first was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `DrainLine` gains the outcome and the answer text, and `request-drain.ts` is the single appender. |
| The request carries the conversation id | F-058. The chat request is enqueued with `conversationId`, so the key reaches the run through the request rather than a second write, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| Every exit 4 appends nothing | F-059 offered running the knowable refusals before the append or appending `failed: <cause>` for a run refusal. The first was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `bot-unknown`, `body-secret` and `prompt-over-budget` all refuse before the append, so a re-press is safe. |
| The import row widened, REQ-011 dropped | F-060 offered widening the import row or passing the secret map and a bot-exists predicate from the caller, and offered dropping REQ-011 or adding `--message-id`. The first of each was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `conversation.ts` imports `state-root.ts`, `definition.ts` and `dispatch.ts`, and the verb mints the id through `newRunId`. |
| The resumed message's text forms | F-061. REQ-012 now states that the resumed message's `text` is the reply, a second `needs you:` form or the `failed:` form, and that the item link is `runId`, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The extended tests verify by name | O-005. T020 and T021 name the tests they add and filter them with a stated pass count, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| Serial commas dropped | O-022. The comma before the last list item was dropped in this child's prose by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
<!-- /ANCHOR:log -->
