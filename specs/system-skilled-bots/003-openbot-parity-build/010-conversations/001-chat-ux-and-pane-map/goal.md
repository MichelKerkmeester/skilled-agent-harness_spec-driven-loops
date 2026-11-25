---
title: "Goal: Phase 1: chat-ux-and-pane-map"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "chat ux and pane map goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map"
    last_updated_at: "2026-11-26T00:30:00Z"
    last_updated_by: "wo-08-writer"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo08-010-001-chat-ux"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: chat-ux-and-pane-map

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the chat surface before any code is written, in seven design documents that draw the chat pane at 80x24 and 120x40, add the chat key context, list each chat component's states and settle the pane's calls, the loop's printed form, the routing grammar and the conversation block's budget, so the runtime child and the pane child build without a design decision of their own.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A chat send runs on a chat worker thread of its own, because a bot run lasts up to sixteen minutes and the screen's worker kills a write at 30 seconds. |
| D2 | Quitting the screen does not wait for a chat send. The CLI appends the reply, so it lands in the file whether or not the screen is open. |
| D3 | The `chat` context binds no tab key, because `[`, `]` and `?` are text and Option+1..4 arrives as printable characters on macOS. `Esc` is the way out. |
| D4 | An `@<bot-id>` address routes one message, is stored in `text` as typed, and does not move the default bot. |
| D5 | Every id the chat verb cannot route is refused `bot-unknown` with exit 4, the one name `contracts/refusals.md` section 3.9 gives it. |
| D6 | The conversation block's 8,000 character cap counts rendered message lines after the escape, and only the newest message is ever cut, from its start. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The frame check in `tasks.md` prints `frames=26 bad=0`.
- [ ] The label check in `tasks.md` prints `0`, and T014 prints 67.
- [ ] The payload check in `tasks.md` prints `1 4 9`.
- [ ] The `node -e` in `tasks.md` T011 prints `26846 35152 31968 43142`.
- [ ] `rg -n '^\| \*\*Approved\*\* \| Met \|' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/key-map-delta.md` prints one line.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map --strict` prints `RESULT: PASSED`.
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
| Seven design documents and the sample | Written | `ls design` lists them, and the frame check printed `frames=26 bad=0` on 2026-11-26 |
| Operator approval of the key map delta | Pending | `design/key-map-delta.md` section 6 reads `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| A seventh design file | The work order names six files. `design/prompt-boundary.md` was added because the budget and the injection boundary had no designed artifact in any research lineage. |
| Thirteen states, not ten | The work order lists ten pane states. Loading, stale and the unanswered message were added so every state the component rows name has a frame, which is the screen's closed-state rule. |
| A contract sentence read one way | `contracts/prompt-sections.md` section 4.3 step 5 can mean the running length or the whole length. `design/prompt-boundary.md` section 3.1 takes the whole length and names phase 005 as the owner who may override it. |
| A golden whose times run backwards | `contracts/fixtures/chat-transcript.json` and `conversation.jsonl` give the bot message an `at` of 21:12:04, before the human message at 21:13:00 that it follows. The frames use their own sample, and the finding is for the contract owner. |
<!-- /ANCHOR:log -->
