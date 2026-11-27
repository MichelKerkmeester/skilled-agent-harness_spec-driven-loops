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

- [x] The frame check in `tasks.md` prints `frames=26 bad=0`.
- [x] The label check in `tasks.md` prints `0`, and T014 prints 67.
- [x] The payload check in `tasks.md` prints `1 4 9`.
- [x] The `node -e` in `tasks.md` T011 prints `26846 35152 31968 43142`.
- [x] `rg -n '^\| \*\*Approved\*\* \| Met \|' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/key-map-delta.md` prints one line.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map --strict` prints `RESULT: PASSED`.
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
| Operator approval of the key map delta | Done | `design/key-map-delta.md` section 6 reads `Met`, dated 2026-11-26, covering the 19 key rows of section 2. The source is row Q001 of `specs/system-skilled-bots/003-openbot-parity-build/decision-record.md`. AC-008 prints one line |
| Build checks | Done | On 2026-11-27 three `cli-mistral-vibe` runs at `deepseek-flash`: the wave 0 setup checks, then the approval row and the T002 count repair as two parallel one-change briefs. Each `export.json` read `exit_code` 0 and `outcome` `finished`. The unit orchestrator reran every verify command itself in the build worktree |

### Deviations and findings

| Item | Note |
|------|------|
| A seventh design file | The work order names six files. `design/prompt-boundary.md` was added because the budget and the injection boundary had no designed artifact in any research lineage. |
| Thirteen states, not ten | The work order lists ten pane states. Loading, stale and the unanswered message were added so every state the component rows name has a frame, which is the screen's closed-state rule. |
| A contract sentence read one way | `contracts/prompt-sections.md` section 4.3 step 5 can mean the running length or the whole length. `design/prompt-boundary.md` section 3.1 takes the whole length and names phase 005 as the owner who may override it. |
| The goldens' times now run forwards | `contracts/fixtures/chat-transcript.json` and `conversation.jsonl` read 21:12:00 for the human message and 21:12:04 for the bot message that follows it, so the backwards pair an earlier row recorded is gone. |
| The pane sends on stdin | F-071 offered stdin or dropping the claim. The first was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: `chat --message -` reads one line from stdin, so the draft never sits in the process table. |
| The digest exchange moved earlier | O-010 offered moving it before 21:05:04 or replacing it with a `needs you:` message. The first was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: the sample and the frames now read 21:04:08 and 21:04:31. |
| The source check compares lines | O-011 offered a line comparison in place of a keyword grep. It was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: T015 compares every source line over 30 characters against the design. |
| The arithmetic left T011 | O-012 offered dropping the constant arithmetic or keeping it as a note. The first was taken by the assistant on 2026-11-26 under the operator's do-not-ask directive: T011 greps the four derived numbers out of `prompt-boundary.md`. |
| Serial commas dropped | O-022. The comma before the last list item was dropped in this child's prose by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| No rewrite for waves 1 and 2 | The wave table names writers for T004 to T011, but the seven documents and the sample were already written and every verify printed its expected value on 2026-11-27. No write brief was dispatched for them, so nothing written and checked on 2026-11-26 was redrawn. |
| The approval row was a write outside the wave table | T006 owns `design/key-map-delta.md`, and section 6 needed one edit to record Q001. It ran as its own one-change brief on the wave's executor, beside the T002 repair. |
| T002's count was stale | `contracts/verification.md` landed at 07:32 on 2026-11-26, after T002 was written with 9, so `ls contracts/*.md \| wc -l` prints 10. T002 and the Definition of Ready in `plan.md` now say ten. The nine files the count first meant are still there. |
| Criterion 4 names a command T011 dropped | O-012 swapped T011's `node -e` for an `rg -o` that proves the four numbers appear, not that they add up. On 2026-11-27 a `node -e` over the section 3 table of `design/prompt-boundary.md` recomputed `26846 35152 31968 43142`, which is what the criterion asks. The criterion text is left as written. |
| The Verification Summary totals were wrong | The table read 10 P0 and 11 P1 items. The checklist lines carry 8 P0, 10 P1 and 1 P2, and the table now says so. |
| The zero-output checks were shown to fail | The label pipeline up to `sort -u` lists 15 real labels, so its `0` is not an empty-string match. T015 printed the line when one `composer.rs` line was appended to a scratch copy of the design. |
<!-- /ANCHOR:log -->
