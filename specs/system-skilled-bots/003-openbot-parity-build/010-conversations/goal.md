---
title: "Goal: Phase 10: conversations"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations"
    last_updated_at: "2026-11-25T19:59:14Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-010-conversations"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 10: conversations

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a person one conversation with their bots — `bots chat <id>` appends each message to an append-only file under the state root, dispatches one headless run per human message with the BOT.md body as the standing role, routes `@bot` to another bot, appends the resumed run's answer where the person asked, and draws the transcript in the phase 003 chat pane — as phase 10 of the parent goal's OpenBot parity build.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A conversation belongs to the identity, not to one bot, and the bot id is the default conversation name, so several bots share one file and `--conversation` names a second. |
| D2 | The reply is the run's final answer text through the runner's existing `finalAnswerText`, never the whole stdout, so a JSON-log executor's envelope never reaches the conversation. |
| D3 | The append is the commit point: a message is appended before its run is enqueued, so a crash between the two leaves a message with no run, which `--transcript` reports as unanswered rather than re-dispatching. |
| D4 | The transcript a run receives is bounded to the newest 40 messages or 8,000 characters, and the composed prompt to the 32,000 characters 005 fixed, where the conversation block gives way first from its oldest message and a prompt still over the bound with the conversation empty is refused `prompt-over-budget`. |
| D5 | A parked question is both a bot message and a needs-you item, because the conversation is where the person is looking when the run parks. |
| D6 | `conversationId` is one field with three readers — the item, the resume request and the drain — and `ITEM_KEYS` and `RECORD_KEYS` gain it with their two validators in the same change, so no second lookup exists. |
| D7 | `bots chat` lives in the run mode beside `bots answer`, because it dispatches runs; no fifth hub mode is added. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/conversation.vitest.ts` prints a `Test Files` line with no `failed` count, covering message shape, append, torn-line read, `@bot` parse, bound, `<conversation>` block and closing-tag escape.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/cli-chat.vitest.ts` prints a `Test Files` line with no `failed` count, covering one-message path, loop `/exit`, `bot-unknown` refusal, duplicate send, parked-then-resumed answer and secret refusal.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/queued-run.vitest.ts tests/runner.vitest.ts` prints a `Test Files` line with no `failed` count, covering `requestIds` filter over one request, resumed answer appended to `conversationId`, and redacted answer text on the `completed` outcome.
- [ ] `printf '/exit\n' | node .skilled/bin/bots.cjs chat my-bot; echo "exit=$?"` prints `exit=0` on a state root holding a `my-bot` `BOT.md`, and appends no message.
- [ ] `cargo test --manifest-path crates/bots-tui/Cargo.toml` prints `test result: ok`, so `crates/bots-tui` draws a transcript and sends a typed line.
- [ ] `rg -n '^## 010-conversations|turnstone/cli.py|Apache License|Statement of changes' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints a heading, a source path, a licence and a statement of changes.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations --strict` prints `RESULT: PASSED`.
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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/010-conversations` prints `RESULT: PASSED` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations --strict` prints `RESULT: PASSED` |
| Implementation | Pending | `node .skilled/bin/bots.cjs chat my-bot` prints `bots: unknown verb: chat` and exits 2, the measured gap `spec.md` records |
| Acceptance criteria | Pending | All fourteen rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal | `specs/system-skilled-bots/003-openbot-parity-build/goal.md` binds this phase through its row `010-conversations/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Plan section added | `plan.md` §8 External orchestration was added in the same run, so the wave assignment and the executor roster sit beside the plan that owns the prompt order. |
| Wave order departs from the task numbering | `tasks.md` numbers T033–T035 after the tests and the docs, but those three tasks are the module work T015 and T019 verify, so `plan.md` §8 runs them in wave 2 and keeps every task id. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
<!-- /ANCHOR:log -->
