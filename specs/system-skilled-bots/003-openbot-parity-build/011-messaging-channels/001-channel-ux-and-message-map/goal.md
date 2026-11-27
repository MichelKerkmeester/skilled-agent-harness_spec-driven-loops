---
title: "Goal: Phase 1: channel-ux-and-message-map"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "channel ux and message map goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-001-channel-ux"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: channel-ux-and-message-map

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every channel message before any code is written: the literal text of each message a bot sends or a host prints, one mockup per surface and situation, the reply grammar and one golden file per message, so the build children compare bytes rather than choose words.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A run message is the title and body of `deliveryMessage()`, unchanged, plus the choice block or the buttons. The question is never re-rendered. |
| D2 | The choice block and every button label pass the secret-literal check with the rest of the prompt, and a hit withholds the whole prompt. |
| D3 | Every reply a channel sends of its own is a fixed string with named fields and no bot-authored text. The echo names the choice number. |
| D4 | A chat sees the run's outcome and record pointer, not the reply text. The terminal keeps the reply through 010's chat path. |
| D5 | A typed reply answers the newest open prompt in its conversation. A typed `YES` on a prompt with options gets M20. |
| D6 | A text over the chunk limit is cut at the limit on a code point boundary, and the answer surface rides on the last chunk. On Slack the chunk that carries the buttons holds at most 3,000 characters. |
| D7 | On Telegram and Slack a typed line is a chat message and the buttons are the answer surface. The one exception is a Slack prompt with an option label over 75 characters. It goes out in the M01 text form, and the reply grammar answers it. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The catalog check in `tasks.md` prints 40 and 23 and no `MISSING` or `DRIFT` line.
- [x] The mockup check in `tasks.md` prints 12, 0 and no `MISSING` line.
- [x] `rg -c '^\| [1-5] \| ' specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design/reply-grammar.md` prints 5.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map --strict` prints `RESULT: PASSED`.
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
| Catalog, mockups, grammar and goldens | Written | On 2026-11-26 the catalog check printed 40 and 23 with no other line, the mockup check printed 12, 0 and no `MISSING` line and the grammar check printed 5 |
| Build run against the merged capability matrix | Complete | On 2026-11-27, after 011.002 merged, every chunk size in `design/mockups.md` matched `../002-adapter-and-record-contracts/design/capabilities.md` section 2. One Vibe worker named the Slack surface of rows M01 and M02 in the catalog. The catalog check then printed 40 and 23 with no other line, the mockup check printed 12, 0 and no `MISSING` line, the grammar check printed 5, the copy check printed 0 and `validate.sh --strict` printed `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| 23 messages, not the work order's twelve | The work order lists the approval prompt, the numbered prompt, the link lines, four refusals, the failure notice and the uncertain delivery. The catalog adds the button forms, the completed notice, the echo and its duplicate, the wrong code, the group, roster, race and busy refusals, the not-a-choice hint, the bot-address usage reply and the ambiguous-reply hint, because each is a message a person reads. |
| The contract's queue sample text | `contracts/fixtures/channel-queue-entry.json` writes `digest needs you: Which channel?`, which is not what `deliveryMessage()` builds. The parent spec lists the fix. |
| A promise the split cannot keep | The pre-expansion out-of-scope line said the reply is sent when the run ends. REQ-014 sends only `deliveryMessage()` output. D4 follows REQ-014 and the parent spec asks the operator. |
| M22 added, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | F-011's first alternative makes an `@<bot-id>` address required, so a message without one needs a reply. M22 is that reply and carries no refusal name, because the message reaches no bot and no verb returns it. |
| M23 added, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | F-020's fix makes an ambiguous reply answer nothing and names the open item ids in a new catalog row. M23 is that row. It also covers `NO`, which the finding does not name, because a `NO` with two prompts open is as ambiguous as a number. |
| The mockup check reads the file, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | O-012's first alternative drops the constant arithmetic from the check. The six chunk sizes are now searched for in `mockups.md`, and the arithmetic stays as a note. |
| The copy check compares lines, taken by the assistant on 2026-11-26 under the operator's do-not-ask directive | O-011's first alternative replaces the keyword grep with a `comm -12` comparison of the design's lines against the reference sources. |
| The Slack limits, amended on 2026-11-27 | D6 gains the 3,000-character cap on the Slack button chunk from `design/mockups.md`. D7 records operator answer Q015 in the packet decision record, carried by `design/reply-grammar.md`. On 2026-11-27 the catalog check printed 40 and 23, the mockup check printed 12 and 0 and the grammar check printed 5. |
| The catalog names Slack for the text form, on 2026-11-27 | The merged `capabilities.md` line 85 and Q015 send a Slack prompt with an option label over 75 characters in the M01 text form. The catalog's M01 row named only Signal, WhatsApp and the terminal, so REQ-001's surface was incomplete. The M01 and M02 surface cells and the choice-lines paragraph now name the exception. No golden changed. |
| Two stale verify expectations, on 2026-11-27 | T002 counted every `.md` file in `contracts/`, which holds nine contracts and `README.md`, so it printed 10. Its command now leaves `README.md` out and prints 9. T005 expected 15 one-line rows, which predates M22 and M23. It prints 17, which matches the catalog check's 40 as 23 plus 17. `spec.md` SC-002 and the plan's Definition of Done now match the mockup check as `tasks.md` writes it. |
| The status stays Draft, on 2026-11-27 | With the status at Complete, `validate.sh --strict` failed `SCAFFOLD_NEVER_TOUCHED` on the scaffold continuity block of `implementation-summary.md`. Continuity frontmatter is written only by the continuity save the build runs per unit at the end, so `spec.md` and `acceptance-criteria.md` keep the status Draft until then. Every acceptance row is Met and the packet is closeable. |
| Waves 0 and 2 not dispatched, on 2026-11-27 | Wave 0 is three reads and wave 2's two files were already written and passing, so the orchestrator ran their verifies and sent no worker. A Vibe run that writes nothing counts as a failed rung under the build plan. |
<!-- /ANCHOR:log -->
