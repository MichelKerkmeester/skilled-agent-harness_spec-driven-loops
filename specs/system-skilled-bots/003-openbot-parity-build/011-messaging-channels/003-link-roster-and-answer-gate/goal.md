---
title: "Goal: Phase 3: link-roster-and-answer-gate"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "link roster and answer gate goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-003-link-roster"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: link-roster-and-answer-gate

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Land the channel contract and the gate every answer passes: `channel.ts` with the adapter contract, the capability keys, the config file and the reply table, then the pairing code, the link record and its lockout, the `operators.json` roster and its verbs and the roster check in `answer.ts`, so a chat can only answer as the person who linked it and only when the roster names that person.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `channel.ts` and the channel folders in `state-root.ts` land in the first wave, and child 004 starts when they do. |
| D2 | `channel.ts` imports `state-root.ts` alone and owns the only reader and writer of `channels/config.json`. |
| D3 | A link binds a chat to the actor who ran `link` and to the provider-asserted sender id, and an event resolves only when both match, a press and a typed line alike. |
| D4 | Only a six-digit attempt counts toward the 5-attempt 300 s lockout, and the lockout is a file. |
| D5 | `answerItem` takes the surface as an argument: an absent roster refuses a `channel` answer and refuses nothing on `terminal`, and a present roster is checked on both. |
| D6 | Every reply a channel sends of its own is a template in `channel.ts` that equals its golden in child 001. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] T024 in `tasks.md` prints one line matching `^bots: telegram link code [0-9]{6}, valid for 5 minutes$` on a temporary state root.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate --strict` prints `RESULT: PASSED`.
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
| Tasks moved from the pre-expansion list | T001, T004, T012 to T019, T024, T032, the link half of T033, T035 to T037, T042, T050 to T052, T054, T058, T061 to T064, T066, T069, T070 and T074. Each new task names its old id. |
| T053 moved to child 004 | The per-actor counter lives in the approval index as `notApprover`, `contracts/records.md` section 13, which child 004 owns. |
| REQ-022 moved to child 005 | The untrusted wrap is rendered by the transports through `conversation.ts`, because `channel.ts` imports `state-root.ts` alone. |
| Two new requirements | REQ-032 for the reply table and REQ-033 for `redactToken`, both code in `channel.ts`. |
| F-021, the member link | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: the first alternative, `bots channel link <channel> --as <actor>` under 001's tty rule, with a link whose actor is neither owner nor member refused `answer-not-approver` and an AC-003 case that links a member. The second alternative, dropping the `members` path, was not taken because it cuts scope. |
| F-063, the link resolver | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `isApprover` splits into `resolveLink(channel, conversationId, senderId)` and `isApprover(actor)`, so `answer.ts` calls the roster check alone and a transport calls the resolver before it emits an event. |
| F-063, the verb cases | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: one decision sentence per case in REQ-020, and seven `bots channel roster` tests rather than six, because the absent-roster refusal for `add --role member` is a case of its own. |
| F-071, the required surface | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `surface` is a required key on `answerItem` with no default, so a transport that omits it cannot skip the absent-roster refusal. |
| F-071, the code void | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: a pending code is voided once five wrong attempts are counted across every chat for that channel, not five per chat. |
| F-071, the WhatsApp secret bound | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `bots channel link whatsapp --secret <name>` refuses a name over 48 characters `secret-name-invalid` with exit 4, because the longest derived suffix is `-phone-number-id` and the whole name must stay inside the 64 characters of `contracts/records.md` section 8. |
| F-024, the 0600 mechanism | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: one `writeStateFile` helper in `state-root.ts` that chmods the temporary file to 0600 before the rename, and CHK-031 extended to `config.json`, `links.json` and child 004's `approvals.json`. |
| F-013, the outbound intent | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: the intent gains `kind`, and a `buttons` intent also carries `itemId` and `choices`. |
| F-019, the sender rule | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: NFR-S02 covers every event kind, so a typed line from a sender who is not the link's `senderId` is refused the same way a press is. D3 is amended from "a press" to "an event" to match. |
<!-- /ANCHOR:log -->
