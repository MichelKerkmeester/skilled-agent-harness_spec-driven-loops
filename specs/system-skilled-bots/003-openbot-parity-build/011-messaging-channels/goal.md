---
title: "Goal: Phase 11: messaging-channels"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "messaging channels goal"
  - "phase 11 goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Bound the seven child goals"
    next_safe_action: "Start child 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: messaging-channels

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver Phase 11 of `../goal.md`: put a bot in a chat. One `channel.ts` adapter contract, a file-backed link with its lockout and the `operators.json` roster, a file-backed approval index, a durable send queue, five transports (terminal, Telegram, Slack, Signal and WhatsApp) and four channel names on `delivery.ts`, so a person answers a bot's needs-you question from the chat where it was asked.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every message text and every record shape is fixed in children 001 and 002 before any code, and the build children decide none of their own. |
| D2 | An undeclared operation returns the unsupported result and reaches no provider. |
| D3 | A chat answers only as the actor it linked, by sender id and only when the roster names that actor. A terminal answer needs no roster. |
| D4 | Every prompt has an index entry before it is sent, and every outbound message is a file before it is sent. An uncertain send is `unknown`, never retried and reaches the run record. |
| D5 | A token is a phase 008 secret name, read at `start` and at every send, never stored and rendered `bot<redacted>`. |
| D6 | An inbound chat message is an untrusted, escaped `<conversation channel="...">` block. |
| D7 | A chat sees the run's outcome and record pointer, never the reply text. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-channel-ux-and-message-map | `001-channel-ux-and-message-map/goal.md` |
| 002-adapter-and-record-contracts | `002-adapter-and-record-contracts/goal.md` |
| 003-link-roster-and-answer-gate | `003-link-roster-and-answer-gate/goal.md` |
| 004-approval-index-and-send-queue | `004-approval-index-and-send-queue/goal.md` |
| 005-polling-transports | `005-polling-transports/goal.md` |
| 006-daemon-and-webhook-transports | `006-daemon-and-webhook-transports/goal.md` |
| 007-conformance-hardening-and-proof | `007-conformance-hardening-and-proof/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-conformance.vitest.ts -t "^R2 "` prints `Tests  18 passed`.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels --strict --recursive` prints `RESULT: PASSED`.
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
| Phase parent authored | Done | `spec.md` carries the threshold evidence, the requirement map and the map for seven children |
| Children 001 and 002 design | Written | Each child's checks printed their expected output on 2026-11-26, recorded in its `goal.md` |
| Children 003 to 007 | Planned | `node .skilled/bin/bots.cjs channel list` prints `bots: unknown verb: channel` and exits 2 |

### Deviations and findings

| Item | Note |
|------|------|
| The pre-expansion decisions | D1 to D8 of the pre-expansion goal are kept in substance: D2 and D3 here, D4 in children 003 and 004, D5 and D6 in D4 here, D7 in D5 and D8 in D6. |
| Documents moved | The pre-expansion `plan.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md` were split by file into children 003 to 007. Each task names its old id. |
| D7 | Recorded in `spec.md` section 5 and asked in section 7. |
| Slack redelivery, open | `spec.md` section 7 asks whether a Slack press redelivered after a reconnect carries the same `envelope_id` and so could answer an approval twice. It is UNKNOWN and is settled before child 005 is dispatched. |
| The R2 check, aligned on 2026-11-27 | The first criterion now uses child 007's anchored filter `-t "^R2 "` and its `Tests  18 passed` line, because an unanchored `R2` filter can match more test names. |
<!-- /ANCHOR:log -->
