---
title: "Goal: Phase 4: approval-index-and-send-queue"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "approval index and send queue goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-004-approval-queue"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: approval-index-and-send-queue

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Land the approval index and the durable send queue: every prompt a chat receives has an index entry a restart cannot lose, every outbound message is a file before it is sent, a send that may have happened is never repeated, the four channel names reach `delivery.ts` with the choice block under the secret-literal check and `bots channel list`, `send` and `drain` work.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `delivery.ts` imports `channel-queue.ts` and no other channel module, and writes a channel target as the queue entry `notice-<runId>-<channel>`. |
| D2 | The drain has `channel-approval.ts` write the index entry before the entry goes `sending`. |
| D3 | The action id `approval-v1:<item-id>:<index>` is derived with a 1-based index and never stored. |
| D4 | The choice block is appended before the literal check, and a hit withholds the whole prompt. |
| D5 | An uncertain send and a `sending` entry found at start are `unknown`, never resent and written to the run record. A send error with `sentBeforeError: true` is uncertain whatever `retryable` says, so a landed chunk is never sent twice. |
| D6 | The index holds one channel per item. |
| D7 | A Slack prompt with an option over 75 characters is queued in the M01 text form and raises no refusal. The reply grammar answers it on Slack, and any other typed Slack line is a chat message. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] T020 in `tasks.md` prints `exit=0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue --strict` prints `RESULT: PASSED`.
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
| Build | Not started | The child was planned on 2026-11-26 and no code has landed |

### Deviations and findings

| Item | Note |
|------|------|
| Tasks moved from the pre-expansion list | T003, T005, T011, T020 to T023, T031, the list half of T033, the send and drain half of T034, T038, T039, T053, T055 to T057, T059, T065, T067 and T072. Each new task names its old id. |
| The write order changed | The pre-expansion plan wrote the index before the queue entry. `delivery.ts` may not import `channel-approval.ts`, so the drain writes it. `../002-adapter-and-record-contracts/design/records.md` section 9 was corrected to match. |
| Two requirement ids | REQ-028 is the parent's, and REQ-034 is new for `send` and `drain`, which had no requirement. |
| The group refusal | AC-005 of the pre-expansion list checked `channel-group-approval` in `channel-approval.vitest.ts`, so that clause is AC-006 here. |
| F-011, the reply target | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: the reply target is `<channel>:<chatId>` from the request, never from the bot definition, and the run record's delivery entry reads `queued` between the enqueue and the drain's terminal write. |
| F-013, the queued text | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: the literal check always runs over the text form, the queued `text` is the M02 button form when the channel's capability says `buttons: yes` and the M01 text form otherwise, and `delivery.ts` reads that capability from the descriptor table in `channel.ts` so it imports no transport. |
| F-020, the delivered-only reply | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: a reply resolves only against an entry whose queue file is `delivered`, the drain removes `prompts.<itemId>` when an entry ends `failed`, and two delivered prompts open in one conversation make a bare number or `YES` answer nothing with catalog row M23. |
| F-024, the index lock | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: every read-modify-write of `channels/approvals.json` holds `channels/approvals.lock`, on the model of `needs-you/<item-id>.lock`, and a lock still held after 2,000 ms refuses the write rather than forcing it. |
| F-062, the drain exit rule | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `bots channel drain` exits 1 when any due entry ended `failed` or `unknown` in that pass, else 0, and a refusal it returns exits 4 per `contracts/refusals.md` section 3.10. An entry that merely stays `queued` changes no exit code. |
| F-064, the verb seam | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: the first alternative, one in-process `runChannelVerb(argv, transports)` that takes the transport table, which child 005 creates, so a test never spawns `bots.cjs` and never reaches a real provider. |
| F-064, the missing entry | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: a press or a reply whose item has no entry falls through to `answerItem`, so the reply is the existing answered or expired row. |
| F-071, the counter reader | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `bots channel list` prints one `notApprover <actor> <count>` line per actor with a count above zero, which is the only reader of the counter, and `--json` gains no key because `contracts/cli-json.md` section 3.3 is frozen. |
| F-012, the terminal exception | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `DELIVERY_CHANNELS` keeps its four chat names and never gains `terminal`, because the terminal transport reads the open needs-you items directly and writes no index entry. |
| The queue and Slack rules, amended on 2026-11-27 | D5 gains the maybe-sent rule of REQ-013 and AC-013. D7 records operator answer Q015 in the packet decision record, carried by REQ-008, REQ-028, AC-008 and AC-028. The F-013 row above predates it: the button form is also skipped on Slack when an option is over 75 characters. |
<!-- /ANCHOR:log -->
