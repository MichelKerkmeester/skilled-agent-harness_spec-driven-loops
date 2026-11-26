---
title: "Goal: Phase 5: polling-transports"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "polling transports goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-005-polling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: polling-transports

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Ship the three transports that need no public URL and no local daemon: Telegram long polling, Slack Socket Mode and the terminal, each following its Wire Table row, with `bots channel listen` and its lease and probe, the untrusted wrap of every inbound message, tokens read only through phase 008 and every sent message equal to its golden.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every acknowledge, offset move or `envelope_id` echo follows the seen record. |
| D2 | Every network call is injected, so every test replays a recorded fixture and none reaches a network. |
| D3 | An inbound message that is not an answer is rendered through `conversation.ts` as a `<conversation channel="...">` block. |
| D4 | The terminal transport answers with the OS user on the surface `channel`, so the roster must name that user. |
| D5 | A rejected credential at the probe exits 1 with a plain line until the contract names a refusal. |
| D6 | This child creates `tests/channel-transports.vitest.ts` and edits `bots.cjs` before child 006. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts` prints a `Test Files` line with no `failed` count.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports --strict` prints `RESULT: PASSED`.
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
| Tasks moved from the pre-expansion list | T007, T008, T025 to T027, T029, the listen half of T034, T040, T060 and the injection half of T071. Each new task names its old id. |
| REQ-022 moved here from child 003 | The parent map was corrected, because `channel.ts` imports `state-root.ts` alone. |
| Not stated in the reference | Telegram's own rate limits, and how long Slack waits for an acknowledge. The design depends on neither. |
<!-- /ANCHOR:log -->
