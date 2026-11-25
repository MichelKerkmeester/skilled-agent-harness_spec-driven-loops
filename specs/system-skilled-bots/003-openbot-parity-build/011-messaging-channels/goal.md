---
title: "Goal: Phase 11: messaging-channels"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels"
    last_updated_at: "2026-11-25T20:01:13Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-011-messaging-channels"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 11: messaging-channels

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Put a bot in a chat — one `channel.ts` adapter contract, a file-backed identity link with its lockout and the `operators.json` roster, a file-backed approval index and a durable send queue, five transports (terminal, Telegram, Slack, Signal and WhatsApp) and the four channel names on `delivery.ts` — so a person can answer a bot's needs-you question from the chat where it was asked, as phase 11 of the parent goal's OpenBot parity build.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `channel.ts` owns the one adapter contract and the one message model, and an operation a transport does not declare returns `unsupported: true` with `retryable: false` and `sentBeforeError: false` rather than throwing, so a text-only transport still answers every call. |
| D2 | A channel belongs to the identity, so `channels/config.json`, `links.json`, `approvals.json` and `queue/` sit under the identity's state root, and `channel.ts` is the only reader and writer of `channels/config.json`, which holds a secret name and never a value. |
| D3 | The link record carries both the actor who ran `link` and the provider-asserted sender id, and `isApprover` resolves the sender id through that record before it matches the actor against the roster, so a chat cannot borrow another person's name. |
| D4 | The roster is the minimal `owner`/`members` shape and `bots channel roster` is its only writer; an absent roster refuses every channel answer `channel-roster-missing` and refuses `link`, while a terminal answer needs no roster because the host is the authority. |
| D5 | The approval index entry is written before the send and is the only record a press resolves through, so a restart loses no prompt; an entry expires with its item and a press after `expiresAt` is refused `item-expired`. |
| D6 | A send is written to the queue before the I/O, an uncertain result is recorded `unknown` and never retried, and that `unknown` state also reaches the run record's delivery entry, so a lost notice is visible in `bots status`. |
| D7 | A token is a phase 008 secret name in the config and never a value; it is read at `start` and at every send, and every URL renders `bot<redacted>` before it reaches an error, a log or a queue entry. |
| D8 | An inbound chat message is labelled untrusted before it becomes a request prompt, and a closing tag in its text is escaped so it cannot end its own block. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0, and `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel.vitest.ts tests/channel-conformance.vitest.ts` prints a `Test Files` line with no `failed` count, covering `ChannelInbound`, `ChannelOutbound`, `ChannelSendResult`, `unsupported`, `readChannelConfig`, `writeChannelConfig`, `untrusted` and five conformance rules.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-link.vitest.ts tests/cli-channel.vitest.ts` prints a `Test Files` line with no `failed` count, covering `channel-locked`, `channel-unlinked`, `channel-roster-missing`, `channel-roster-owner`, a six-digit one-use code and a per-actor lockout.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-approval.vitest.ts tests/answer.vitest.ts` prints a `Test Files` line with no `failed` count, covering `approval-v1`, `item-expired`, `channel-group-approval`, `item-answered-differently`, `answer-not-approver` on both surfaces and the YES/NO grammar.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts tests/channel-transports.vitest.ts` prints a `Test Files` line with no `failed` count, covering `unknown`, `BACKOFF_MS`, the delivery entry, `TELEGRAM_MAX_MESSAGE_LENGTH`, `SLACK_TEXT_CHUNK_CHARS`, `SIGNAL_TEXT_CHUNK_CHARS`, `TEXT_LIMIT` and `channel-signature`.
- [ ] `T=$(mktemp -d) && mkdir -p "$T/checkout" && XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets node .skilled/bin/bots.cjs channel roster add ada --role owner --repo "$T/checkout" && XDG_STATE_HOME="$T/state" SKILLED_BOTS_IDENTITY=acme/widgets node .skilled/bin/bots.cjs channel link telegram --repo "$T/checkout"` exits 0 and prints one six-digit code.
- [ ] `awk '/^## 011-messaging-channels$/{f=1;next} /^## /{f=0} f' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md | rg -c 'Apache License'` prints 4 or more, and `rg -n 'tinychannels' .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` exits 1.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels --strict` prints `RESULT: PASSED`.
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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels` prints `RESULT: PASSED` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels --strict` prints `RESULT: PASSED` |
| Implementation | Pending | `node .skilled/bin/bots.cjs channel list` prints `bots: unknown verb: channel` and exits 2, the measured gap `spec.md` records |
| Acceptance criteria | Pending | All twenty-three rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal | `specs/system-skilled-bots/003-openbot-parity-build/goal.md` binds this phase through its row `011-messaging-channels/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Plan section added | `plan.md` §8 External orchestration was added in the same run, so the wave assignment and the executor roster sit beside the plan that owns the module order. |
| Wave order departs from the task numbering | `tasks.md` numbers T050 after the docs and T074 after T060, but T050 is the roster verb group in `bots.cjs` and T074 is the config read and write in `channel.ts`, so `plan.md` §8 runs them in waves 5 and 1 and keeps every task id. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
<!-- /ANCHOR:log -->
