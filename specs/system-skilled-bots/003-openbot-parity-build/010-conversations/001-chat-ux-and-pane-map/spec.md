---
title: "Feature Specification: Phase 1: chat-ux-and-pane-map"
description: "The design documents that fix the chat surface before any code is written: the chat pane's frames at 80x24 and 120x40, the seventh key context, the component rows, the pane contract with its send worker, the loop's printed form, the @bot routing grammar and the conversation block's budget and injection boundary."
trigger_phrases:
  - "chat ux and pane map"
  - "phase 1 chat ux and pane map"
  - "chat pane mockups"
  - "bots chat routing grammar"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: chat-ux-and-pane-map

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-conversation-runtime-and-chat-verb |
| **Handoff Criteria** | The seven design documents and the sample payload exist in `design/`, the frame check prints `frames=26 bad=0`, every drawn label of the key map delta is in a frame, and the operator approves the key map delta in `design/key-map-delta.md` section 6 before `003-chat-pane-and-proof` starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the conversations phase parent: the chat design, the runtime and the chat verb, then the pane and its proof.

**Scope Boundary**: Design documents in `design/` and nothing else. No TypeScript, no Rust, no CLI verb, no test. The frames, the keys, the component states, the pane's calls, the loop's printed form, the routing grammar and the conversation block's budget are fixed here. `002-conversation-runtime-and-chat-verb` builds the runtime half against the grammar, the loop form and the budget and `003-chat-pane-and-proof` builds the pane against the rest.

**Dependencies**:
- The terminal screen's frame grammar, key map, glyph table and component inventory, which this phase extends and does not change. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/mockups.md:21-39] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md:21-34]
- The screen's architecture: the worker and its deadlines, the owner map and the types. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md:367-470]
- The packet contracts: the transcript envelope in `contracts/cli-json.md` section 3.1, the message record in `contracts/records.md` section 10, the prompt blocks and budget in `contracts/prompt-sections.md`, the refusals in `contracts/refusals.md` section 3.9 and decision D2 in `contracts/decisions.md`.

**Deliverables**:
- `design/mockups.md`, thirteen chat states, each at 80x24 and 120x40
- `design/key-map-delta.md`, the seventh context `chat` and the keys `main` gains on the Chat tab
- `design/component-rows.md`, six component rows and the retired placeholder row
- `design/pane-contract.md` and `design/chat-transcript.sample.json`, the two calls, the payload, the send worker and the edits the screen's files need
- `design/loop-transcript.md`, a literal `bots chat <id>` session and the text forms of `--message` and `--transcript`
- `design/routing-grammar.md`, the `@<bot-id>` grammar and its refusals
- `design/prompt-boundary.md`, the conversation block rendered, its cap, a worked overflow and the injection boundary
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 010 had a chat pane and a chat loop and no design artifact for either. The screen drew one placeholder line for the Chat tab, so no mockup, state list, key map row or component row existed for it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:30] Sending from the pane runs a call that blocks for a whole bot run, and the screen's one worker kills a write at 30 seconds. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/architecture.md, section "2.3 The worker rules"] The `@<bot-id>` grammar, the loop's printed form, the per-block budget and the injection boundary were each stated as a requirement with no designed artifact. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:183-193]

### Purpose
One approved design for the chat surface, so the two build children draw cells and parse lines rather than deciding layout, keys or grammar.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Taken on 2026-11-26 in this worktree.

```text
$ rg -n '^\| 6 \| Chat' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md
30:| 6 | Chat | None | None | `placeholder` | 4 |
EXIT=0

$ rg -c '^\| `chat` \|' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/key-map.md
EXIT=1
```

The first line is the gap: the screen's inventory gives the Chat tab one state and reads nothing. The second is the missing input context: the screen's key map has no `chat` row, so typing on the Chat tab is bound nowhere. After this phase, `ls` of `design/` lists the seven documents and `chat-transcript.sample.json`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Draw the chat pane in thirteen states at 80x24 and 120x40 in the screen's frame grammar, with the rule for how each message role draws.
- Add the seventh key context, `chat`, with its typing and picking modes, its drawn labels and the footer lines they make.
- Add the component rows for the transcript list, the composer, the bot label, the chat status line, the bot picker and the detail column, each with a closed state list.
- Fix the pane's two calls, the transcript payload with a sample, the sending state and the rule that a send runs on a chat worker thread of its own.
- Write a literal `bots chat <id>` session, the stream of each line and the text forms of `--message` and `--transcript`.
- Fix the `@<bot-id>` grammar, its refusals and the default conversation and default bot.
- Render the conversation block literally, fix what its 8,000 character cap counts and how one oversized message is cut, work the 32,000 character overflow on a real prompt, and list the injection cases.

### Out of Scope
- Any code, crate change or test - the two build children own them, and a design phase that ships code has two sources of truth.
- Any edit to phase 003's documents - `design/pane-contract.md` section 7 lists the edits the screen's files need, and `003-chat-pane-and-proof` makes them in its own change.
- Any edit to `contracts/` - the contracts are frozen. Where this phase reads a contract sentence one way, the reading is recorded as a decision and named for its owner.
- Picking a conversation other than the bot's default from the pane - the pane opens the chosen bot's default conversation, and `--conversation` stays a CLI option.
- Streaming a reply as it arrives - one message is one run, and the reply is appended when the run ends.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design/mockups.md` | Create | The frame grammar delta, the message drawing rule, the state index and thirteen states at both sizes |
| `design/key-map-delta.md` | Create | The `chat` context, nineteen key rows, the four footer lines, the rules and the approval record |
| `design/component-rows.md` | Create | Six component rows and the retired placeholder row, with every state |
| `design/pane-contract.md` | Create | The two calls, the payload, the drawing per message, the chat worker, quitting with a send out, the types and the edits the screen's files need |
| `design/chat-transcript.sample.json` | Create | The four-message payload the frames draw |
| `design/loop-transcript.md` | Create | The sample session, the streams, the loop's commands and the text forms |
| `design/routing-grammar.md` | Create | The grammar, what an address changes, the defaults and the refusals |
| `design/prompt-boundary.md` | Create | The rendered block, the cap, the worked overflow and the injection boundary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `design/mockups.md` draws each of the thirteen chat states at 80x24 and 120x40 in the screen's seven bands, one fenced block per state per size, each block exactly 24 or 40 lines with its longest line exactly its width, and no other fenced block in the file |
| REQ-002 | `design/key-map-delta.md` adds one context, `chat`, binds every key with its context, action, drawn label and footer line, keeps every footer line at 67 columns or less, and leaves no key with two meanings inside one context and mode |
| REQ-003 | `design/component-rows.md` gives each chat component what it reads, the keys it binds and a closed state list, and each state names the frame that draws it |
| REQ-004 | `design/pane-contract.md` fixes the two calls with their argv, the payload as the three-key envelope of `contracts/cli-json.md` section 3.1 with a field table and a sample, what the pane draws for each message role and for an unanswered human message, the `sending` state and the rule that a send runs on a chat worker thread of its own |
| REQ-005 | `design/routing-grammar.md` fixes where an address may stand, what may follow it, that the prefix stays in the stored `text`, the refusal for an invalid or unknown id and the default conversation and default bot of `bots chat <id>` |
| REQ-006 | `design/prompt-boundary.md` renders the conversation block with the literal label and escape of `contracts/prompt-sections.md`, states what the 8,000 character cap counts, how one oversized message is cut and works the 32,000 character overflow rule on a prompt whose sizes add up |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `design/loop-transcript.md` holds a literal session of `bots chat <id>` with the prompt string, a reply, the line shown while a run executes, a parked question, a failure, a refusal and `/exit`, and names the stream each line goes to |
| REQ-008 | The operator approves the key map delta, and the approval names the date and the key set it covers |
| REQ-009 | No openhuman code or text is copied: every openhuman pointer is a path and a line range, and no fenced block reproduces a line of its source |
| REQ-010 | Every acceptance criterion is answered by a command that runs without a tty |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The frame check in `tasks.md` prints `frames=26 bad=0` on `design/mockups.md`
- **SC-002**: The label check in `tasks.md` prints `0`, so every drawn label of the key map delta is in a frame
- **SC-003**: `rg -c '^### Chat, ' design/mockups.md` prints 13
- **SC-004**: `node -e` over `design/chat-transcript.sample.json` prints `1 4 9`: the version, four messages and nine keys on the first
- **SC-005**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The screen's design documents | The frames would follow a grammar that moved | The frames cite the grammar by line, and a change there is a design change with a diff here |
| Dependency | The frozen contracts | A design that contradicts a contract would be wrong on arrival | Every payload, record, refusal and prompt rule is cited from `contracts/`, and two readings of a contract sentence are recorded as decisions for the owner |
| Risk | The send worker changes screen files whose owner map says no later edit | Medium | `design/pane-contract.md` section 7 lists each edit with its reason, and `003-chat-pane-and-proof` owns them as a later phase |
| Risk | A GPL-3.0 design reference invites copying | Medium | Pointers only, and the composer is read for shape |
| Risk | The key map delta is built before it is approved | Medium | The handoff to `003-chat-pane-and-proof` waits on the approval record |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A frame is 24 or 40 lines and at most 120 columns, so a reader checks one without scrolling
- **NFR-P02**: The design adds no runtime cost: markdown and one JSON sample

### Security
- **NFR-S01**: No credential, token or real state-root path appears in `design/`. The frames use the screen's invented data set
- **NFR-S02**: The injection table in `design/prompt-boundary.md` section 4.2 lists every reserved tag a message can carry and what it becomes

### Reliability
- **NFR-R01**: Every `SOURCE` pointer resolves in a checkout that has the gitignored reference folder
- **NFR-R02**: Every component state names a frame, so no state is described without being drawn
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty draft sends nothing, and an empty conversation draws frame C2
- Maximum input: a draft wider than the composer shows its tail, and a 100,000 character message is stored whole and cut only in the block a run receives
- Failure path: a send refused before anything was appended puts the draft back and draws the stderr line, and a failed run draws its `failed:` message
- Quitting with a send out: the screen exits at once, the run goes on and the reply lands in the file
- Adversarial input: a message holding `</conversation>` or `<bot>` reaches the run escaped, as `design/prompt-boundary.md` section 4.2 shows
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Seven design documents and one sample in one folder, no code |
| Risk | 7/25 | A worker rule that edits closed screen files, and an approval gate |
| Research | 11/20 | The screen's four design documents, two contracts read closely, turnstone's loop and openhuman's composer |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the send share the screen's worker? Decision: no. A chat worker thread of its own, because a run lasts up to sixteen minutes and the screen's worker kills a write at 30 seconds (`design/pane-contract.md` section 4).
- Does quitting wait for a send? Decision: no. The reply is appended by the CLI and lands in the file whether or not the screen is open.
- Does an address stick? Decision: no. An address routes one message, so a line with no address always goes to the default bot (`design/routing-grammar.md` section 2).
- Is the `@` prefix stored? Decision: yes, as typed. `botId` records the route.
- What does a malformed id do? Decision: `bot-unknown` with exit 4, the one name `contracts/refusals.md` section 3.9 gives the chat verb.
- Which length does a `prompt-over-budget` detail print? Decision: the whole prompt's length after the conversation gave way, a reading of `contracts/prompt-sections.md` section 4.3 that phase 005 may override.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Design documents**: the seven files in `design/` and `design/chat-transcript.sample.json`
- **Parent Spec**: `../spec.md`
- **Sibling children**: `../002-conversation-runtime-and-chat-verb/`, `../003-chat-pane-and-proof/`
- **Screen design**: `../../003-terminal-screen/001-ux-and-component-map/design/`
