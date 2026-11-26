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
| D5 | An uncertain send and a `sending` entry found at start are `unknown`, never resent and written to the run record. |
| D6 | The index holds one channel per item. |

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
<!-- /ANCHOR:log -->
