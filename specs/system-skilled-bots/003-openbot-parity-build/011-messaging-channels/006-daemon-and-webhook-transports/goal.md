---
title: "Goal: Phase 6: daemon-and-webhook-transports"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "daemon and webhook transports goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-006-daemon-webhook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: daemon-and-webhook-transports

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Ship the two transports that need something beside this runtime: Signal through a local `signal-cli` daemon on loopback and WhatsApp through the Cloud API webhook on a loopback listener, each following its Wire Table row, where an unsigned body is never parsed and a send whose outcome is unknown is never repeated.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Both transports bind or connect to loopback only, and the operator owns the daemon and the tunnel. |
| D2 | The WhatsApp signature is checked over the raw bytes in constant time before any parse, and every failure answers `401`. |
| D3 | A WhatsApp `200` is written only after every message of its body is durable. |
| D4 | A WhatsApp `4xx` other than `408` left the account untouched: `429` retries and any other is `failed`. A `5xx`, `408` or lost response is `unknown`. |
| D5 | Signal's JSON-RPC id is no idempotency key, so an uncertain send is `unknown`. |
| D6 | Child 005's token, injection and golden rules hold unchanged for both transports. |
| D7 | One worker reads the tinychannels source and writes `design/wire-notes.md` in its own words with one `[SOURCE:]` per fact. A different worker writes the Signal and WhatsApp transports from that note and the Wire Table, and its brief names no tinychannels path. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts` prints a `Test Files` line with no `failed` count.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports --strict` prints `RESULT: PASSED`.
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
| Tasks moved from the pre-expansion list | T009, T010, T028 and T030. Each new task names its old id. |
| UNKNOWN | Whether signal-cli keeps events for a disconnected client. |
| Not stated in the reference | Signal's and Meta's own send limits. |
| F-022, the Signal group | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: the first alternative, the Out of Scope line is corrected to WhatsApp only and a Signal group event is refused `channel-group-approval` with reply M16, because the capability matrix declares `groupKnown` yes for Signal. |
| F-023, the failed status | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: a `statuses` entry whose status is `failed` for a known platform message id maps onto that queue entry and the run record, so a prompt Meta accepted and then rejected is never left `delivered`. |
| F-064, the two addresses | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: both loopback addresses are injected arguments of the transport, fixed at `127.0.0.1:8787` and `127.0.0.1:8080` in production, so a test binds an ephemeral port. |
| O-001, the anchored filters | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: every filter names its full test name and states its pass count, and the shared cases are one `transport shared` block that runs over every transport in the table. |
| The worker rule, amended on 2026-11-27 | D7 is the GPL rule of `../003-link-roster-and-answer-gate/plan.md`, applied by T002 to T005. D4 already matches the Telegram `5xx` rule child 005 now cites. |
<!-- /ANCHOR:log -->
