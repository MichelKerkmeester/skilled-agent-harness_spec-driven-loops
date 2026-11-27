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
| D1 | Every acknowledge, offset move or `envelope_id` echo follows the seen record. The Telegram offset also moves past a duplicate the seen record drops, so the poll after a dropped duplicate of update 20 carries `offset` 21. |
| D2 | Every network call is injected, so every test replays a recorded fixture and none reaches a network. |
| D3 | An inbound message that is not an answer is rendered through `conversation.ts` as a `<conversation channel="...">` block. |
| D4 | The terminal transport answers with the OS user on the surface `channel`, so the roster must name that user. |
| D5 | A rejected credential at the probe exits 1 with a plain line until the contract names a refusal. |
| D6 | This child creates `tests/channel-transports.vitest.ts` and edits `bots.cjs` before child 006. |
| D7 | Telegram and Slack sort a send error three ways. A transport error, an unreadable `200` body and a `5xx` set `sentBeforeError: true`. A `429` or Slack's `ratelimited` sets `retryable: true`. Every other error sets both false. Once any chunk of the entry landed, `sentBeforeError` is `true` whatever the later error is. |
| D8 | Slack text is cut at 3,900 characters, and the chunk that carries the buttons is cut again at 3,000. |
| D9 | One worker reads the tinychannels source and writes `design/wire-notes.md` in its own words with one `[SOURCE:]` per fact. A different worker writes the Telegram and Slack transports from that note and the Wire Table, and its brief names no tinychannels path. |

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
| F-011, the bot address | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: the first alternative, an `@<bot-id>` address is required, so a message without one reaches no bot and is answered with catalog row M22. REQ-035 also fixes the `<channel>:<chatId>` reply target and the terminal's `terminal:<os-user>` conversation id. |
| F-012, the terminal prompts | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: the terminal lists the open needs-you items at start and on a 60 s tick and resolves a reply against that list, so it writes no approval index entry and no drain process prints to its stdout. |
| F-013, the queued text | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: a transport sends only the queued text, which is the M02 button form on a channel whose capability says `buttons: yes` and the M01 text form otherwise. |
| F-019, the sender rule | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: every event is checked against the link record, a typed line and a press alike, so a sender id that is not the link's is refused `channel-unlinked` on every transport. |
| F-062, the drain tick | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `listen` runs one drain pass for its own channel after each inbound turn and on a 60 s tick. |
| O-001, the anchored filters | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: every filter names its full test name and states its pass count, and the file gains a sixth `transport shared` block so a per-transport filter cannot match a shared rule. |
| O-019, the legacy ids | Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: T016 is `was T058's proof and the token half of T071` and T017 is `was T060 and the injection half of T071`. |
| The wire and worker rules, amended on 2026-11-27 | D1 gains the offset clause of REQ-009 and AC-009. D7 is REQ-036 and AC-036. D8 is REQ-010 and AC-010. D9 is the GPL rule of `../003-link-roster-and-answer-gate/plan.md`, applied by T002, T003, T005 and T007. |
| Before dispatch | `../spec.md` section 7 asks whether a Slack press redelivered after a reconnect carries the same `envelope_id`. It is UNKNOWN and is settled before this child is dispatched. |
<!-- /ANCHOR:log -->
