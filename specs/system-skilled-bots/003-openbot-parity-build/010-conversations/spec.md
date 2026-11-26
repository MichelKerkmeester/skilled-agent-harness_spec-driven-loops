---
title: "Feature Specification: Phase 10: conversations"
description: "A Level 3 phase parent for bots chat: a conversation file under the state root, one headless run per human message, @bot routing across several bots and a chat pane in bots ui, split into a design child, a runtime child and a pane child."
trigger_phrases:
  - "conversations"
  - "phase 10 conversations"
  - "bots chat"
  - "conversations phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/010-conversations"
    last_updated_at: "2026-11-26T02:00:00Z"
    last_updated_by: "wo-08-writer"
    recent_action: "Split the phase into three children and moved the runtime docs into child 002"
    next_safe_action: "Get the operator's approval of child 001's key map delta"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo08-010-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->
<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: Phase 10: conversations

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-skilled-bots/003-openbot-parity-build` |
| **Phase** | 10 of 14 |
| **Predecessor** | `009-skills` |
| **Successor** | `011-messaging-channels` |
| **Handoff Criteria** | `bots chat <id> --message` appends one human and one bot message, `--transcript --json` prints the three-key envelope, `@bot` routes to another bot, a parked message's answer reaches its conversation, and the chat tab of `bots ui` draws all thirteen approved frames cell for cell |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled bots is headless by contract. One run is one executor call and the CLI has no conversation verb, so a person who wants to give a bot work and read what it said composes a `bots run` invocation and opens the run folder by hand. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:5-6] [SOURCE: .skilled/bin/bots.cjs:64-76] Nothing records a sequence of exchanges, so a second message cannot refer to the first and several bots cannot share one thread. The screen phase 003 builds holds a Chat tab whose body is only a placeholder naming this phase. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:30]

### Purpose
One conversation verb and one file, so a message becomes a run and a reply becomes the next line, readable from the terminal loop and from the screen.

> **Phase-parent note:** This `spec.md` is the only authored document at the parent level beside `goal.md`. The plan, tasks, acceptance criteria and continuity of each work stream live in the three child folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/bots.cjs chat my-bot
bots: unknown verb: chat
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
...
exit=2
$ rg -c 'conversation' .skilled/skills/system-skilled-bots/runtime/lib/
exit=1
```

Taken on 2026-11-26 in this worktree. No `chat` verb exists and no runtime module mentions a conversation.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The chat surface designed before code: frames at 80x24 and 120x40, the `chat` key context, the component states, the pane's calls, the loop's printed form, the `@bot` routing grammar and the conversation block's budget and injection boundary (child 001)
- `bots chat <id>` with `--message`, `--transcript`, `--json` and `--conversation` over an append-only conversation file, `@bot` routing, the resumed run's answer and the block renderer phase 011 reuses (child 002)
- The chat tab of `bots ui` over that verb, proven frame by frame (child 003)

### Out of Scope
- A server, a database or a transcript shared across machines [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:164]
- Streaming a reply as it arrives, attachments, a bot naming a peer to hand off and a conversation-scoped grant. Child 002's spec section 3 names each and why
- The desktop shell [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:151]

### Files to Change
Child 002's `spec.md` section 3 lists the runtime and CLI files. Child 003's `spec.md` section 3 lists the crate files. Child 001 writes only its own `design/` folder.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-threshold -->
## 3A. WHY THIS IS A PHASE PARENT

`phase-definitions.md` section 2 splits a phase only when the phase score is at least 25 and the level is at least 3. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:61-62]

The estimate behind the inputs, in lines added:

| Part | Lines |
|------|-------|
| `conversation.ts`: record, append, read, parse, bound, renderer | 300 |
| The `chat` verb and loop in `bots.cjs` | 220 |
| Edits to `request-drain.ts`, `answer.ts`, `needs-you.ts`, `request-record.ts`, `runner.ts` and `state-root.ts` | 120 |
| Runtime tests: `conversation`, `cli-chat`, `queued-run`, `runner` | 650 |
| Runtime docs | 60 |
| Crate edits: `state.rs`, `keys.rs`, `data.rs`, `cli.rs`, `model.rs`, `view/panes.rs` | 520 |
| Crate proof: `tests/chat.rs`, the loader change and the fixtures | 350 |
| **Total** | **2,220** |

The file count is 29: seventeen rows in child 002's table and twelve in child 003's.

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 2220 --files 29 --api --architectural
Recommended Level: 3 (Full)
Score: 82/100 | Confidence: 94%
...
- Phase Score: 40/50 (threshold: 25)
- Recommended: YES
- Suggested Phases: 3
```

Both thresholds pass. The result rests on the line estimate: the same command at `--loc 800` prints `Phase Score: 20/50`, below the bar. The estimate counts the tests at about the size the screen's children plan for theirs, which is why it lands above 800.
<!-- /ANCHOR:phase-threshold -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS THE CHILDREN INHERIT

Requirement ids are unique across the three children. Child 002 holds REQ-001 to REQ-007 and REQ-009 to REQ-015. Child 003 holds REQ-008, the pre-expansion pane requirement and REQ-016 to REQ-021. Acceptance ids are unique the same way: child 002 holds AC-001 to AC-007, AC-009 to AC-014 and AC-033 and child 003 holds AC-008 and AC-015 to AC-032. Child 001 numbers its own REQ-001 to REQ-010 and AC-001 to AC-010 inside its folder, so a citation of those ids names child 001, as child 003 does for its key map approval.

| Rule | Carried by |
|------|------------|
| The transcript prints as `{"version": 1, "conversationId": "<id>", "messages": [...]}` (`contracts/cli-json.md` section 3.1, `contracts/decisions.md` D2) | 002, 003 |
| A message is the nine-key record of `contracts/records.md` section 10 | 002, 003 |
| The block opens `<conversation id="...">` with the label of `contracts/prompt-sections.md` section 2 and the escape of section 3 | 001, 002 |
| Every id the verb cannot route is refused `bot-unknown` with exit 4 (`contracts/refusals.md` section 3.9) | 001, 002, 003 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:decisions -->
## 5. DECISIONS TAKEN IN THE SPLIT

| Decision | Why |
|----------|-----|
| Three children, not a `design/` folder | Both thresholds in section 3A pass, so the fallback the work order names is not needed |
| The design child adds a seventh file, `prompt-boundary.md` | The budget and the injection boundary had no designed artifact, and the work order asks for both |
| Thirteen pane states, not ten | Loading, stale and the unanswered message each have a component state, and the screen draws every state it names |
| A send runs on a chat worker of its own | A run lasts up to sixteen minutes and the screen's worker kills a write at 30 seconds (`001-chat-ux-and-pane-map/design/pane-contract.md` section 4.1) |
| A malformed id folds into `bot-unknown` | `contracts/refusals.md` is frozen and names no second refusal |
| The block's 8,000 cap counts rendered lines after the escape, and only the newest message is cut | `001-chat-ux-and-pane-map/design/prompt-boundary.md` section 2 |
| `bots chat` stays in the run mode | It dispatches runs, beside `bots answer` |
| No `decision-record.md` at the parent | No operator answer was taken in this split. Each decision above is recorded in the child that owns it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:defects -->
## 6. CONTRADICTIONS AND DEFECTS THE SPLIT FIXES

| Defect in the pre-expansion phase | Fixed in |
|-----------------------------------|----------|
| REQ-006, AC-003 and AC-006 printed a bare JSON array | 002: the three-key object, and the `jq` checks read `.messages` |
| The plan joined the transcript in `runner.ts` after the builder, so the 32,000 check never saw it | 002: the join moves into `buildBotPrompt`, phase 005's change (`contracts/prompt-sections.md` section 6) |
| "Control characters" did not say whether the newline is one, and stripping it would cost every stored reply its paragraph breaks | 002 REQ-003: a stored message keeps each line feed and drops every other control character, the chat pane draws each line and the prompt renderer writes each line feed as one space (D10 in `contracts/decisions.md`) |
| The redaction token was spelled `[redacted: <key>]` | 002: `[redacted: <name>]` and `secret-in-output` in `postRunCauses` (`contracts/records.md` sections 4 and 17) |
| The block opened `<conversation>` with no id | 002: `<conversation id="...">` with the label line |
| A secret in a human message exited 2 | 002: `body-secret` exits 4 |
| The crate tasks named `ui_state.rs` and `render/panes.rs` | 003: phase 003's `state.rs` and `view/panes.rs` |
| The parked and failed bot messages had no fixed text | 002: `needs you: <question> (item <itemId>)` and `failed: <exit reason>` |
<!-- /ANCHOR:defects -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-chat-ux-and-pane-map/ | Seven design documents: thirteen states at both sizes, the `chat` key context, component rows, the pane contract, the loop transcript, the routing grammar and the prompt boundary | Draft, awaiting the key map approval |
| 2 | 002-conversation-runtime-and-chat-verb/ | `conversation.ts`, the `chat` verb, `@bot` routing, the resumed answer and the renderer phase 011 reuses | Draft |
| 3 | 003-chat-pane-and-proof/ | The chat tab of `bots ui`, its worker and 26 frame snapshots | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-chat-ux-and-pane-map | 002-conversation-runtime-and-chat-verb | The routing grammar, the loop transcript and the prompt boundary are written | `ls specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/routing-grammar.md specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/loop-transcript.md specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/prompt-boundary.md` prints three paths |
| 001-chat-ux-and-pane-map | 003-chat-pane-and-proof | The operator approved the key map delta | `rg -n '^\| \*\*Approved\*\* \| Met \|' specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/key-map-delta.md` prints one line |
| 002-conversation-runtime-and-chat-verb | 003-chat-pane-and-proof | The verb ships | `node .skilled/bin/bots.cjs chat my-bot --transcript --json \| jq -r '.version'` prints `1` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The operator's approval of `001-chat-ux-and-pane-map/design/key-map-delta.md` is outstanding, and it gates child 003.
- `contracts/fixtures/chat-transcript.json` and `conversation.jsonl` give the bot message an `at` before the human message it follows. The contract owner decides whether to fix them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: the three `[0-9][0-9][0-9]-*/` folders beside this file
- **Parent Spec**: `../spec.md`
- **Parent Goal**: `../goal.md`, whose row for this phase binds this packet's `goal.md`
- **Contracts**: `../contracts/`
- **The chat path phase 011 reuses**: `002-conversation-runtime-and-chat-verb/spec.md` section 9
