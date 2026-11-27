---
title: "Feature Specification: Phase 1: channel-ux-and-message-map"
description: "The design documents that fix every channel message before any code is written: the literal text of every message a bot sends or a host prints, one mockup per surface and situation, the reply grammar and one golden text file per message."
trigger_phrases:
  - "channel ux and message map"
  - "phase 1 channel ux and message map"
  - "channel message catalog"
  - "channel reply grammar"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: channel-ux-and-message-map

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-26 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-adapter-and-record-contracts |
| **Handoff Criteria** | The catalog, the mockups, the reply grammar and 23 goldens exist in `design/`, the catalog check prints 40 and 23 with no drift line and the mockup check prints 12, 0 and no `MISSING` line |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the messaging channels phase parent: two design children, four build children and a proof child.

**Scope Boundary**: Design documents and golden text files in `design/` and nothing else. No TypeScript, no CLI verb, no test. Every message text, every surface's form and the reply grammar are fixed here. `003-link-roster-and-answer-gate` builds the reply table in `channel.ts` from the catalog, `004-approval-index-and-send-queue` builds the choice block and the reply grammar and `005-polling-transports` and `006-daemon-and-webhook-transports` build the wire forms the mockups draw and compare every message to its golden.

**Dependencies**:
- `deliveryMessage()`, whose title and body are the text of every run message [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:171-189]
- The secret-literal check `delivery.ts` runs before a send [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:291]
- The packet contracts: the refusals of `contracts/refusals.md` section 3.10, the answer sequence of `contracts/answer-seam.md` section 1, the sample data of `contracts/records.md` and the conversation block of `contracts/prompt-sections.md` section 1.9
- The chat path of `../../010-conversations/002-conversation-runtime-and-chat-verb/spec.md` section 9, anchor `chat-path`, which the terminal transport reuses
- The screen's answer overlay, whose losing answer goes to `Gone` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/design/state-machines.md:290-292]
- The capability matrix of `../002-adapter-and-record-contracts/design/capabilities.md` section 2, for the chunk limits and which surface has buttons

**Deliverables**:
- `design/message-catalog.md`, 23 messages with their producer, their bot-authored text and their golden
- `design/mockups.md`, twelve mockups: three surfaces by four situations, each with its wire payload and its view
- `design/reply-grammar.md`, the accepted replies and what a line that matches none becomes
- `design/golden/`, one text file per catalog row
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No message a person reads in a chat was designed. Three research lineages agree, and a search for message text in the pre-expansion phase found none. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:205] Behavior was stated and text was not, so five transports would each have chosen their own words for the same refusal. The fatigue notice that never reaches a chat was a rule with no line a reader of the operator documents would find. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:207]

### Purpose
One approved text for every channel message, so the build children compare bytes rather than choose words.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Taken on 2026-11-26 in this worktree, before this phase wrote `design/`.

```text
$ git show de601a1b444:specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md | rg -c 'This chat is|Reply with a number|Press a button'
EXIT=1
$ rg -c 'approval-v1' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts
EXIT=1
```

The first line is the gap: the pre-expansion spec holds no message text. The second shows delivery builds no prompt with an answer surface today. After this phase, `ls design/golden | wc -l` prints 23.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write the literal text of every outbound message, every refusal reply a person in a chat can cause and the two host lines, with the module that builds each and whether it carries bot-authored text.
- Draw each of three surfaces, Telegram, Slack and the plain text form, in four situations, with the wire payload and the view.
- Fix the reply grammar: the accepted replies, the text each passes to `answerItem`, which open prompt a reply answers and what an unmatched line becomes.
- Write one golden text file per catalog row for the transport tests to compare.
- State in one line that the fatigue notice never reaches a chat, and record why a chat sees the run's outcome rather than its reply text.

### Out of Scope
- Any code or test - the build children own them.
- Any edit to `contracts/` - the contracts are frozen. Where a contract sample disagrees with this design, the parent spec lists the fix for the owner.
- A message for an attachment, a reaction or an edit - those capabilities are undeclared on every transport.
- Localized text - one language, as every other runtime message.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design/message-catalog.md` | Create | The source of every message, the 23-row catalog, the literal text and the rules for the varying fields |
| `design/mockups.md` | Create | The chunking rule and twelve mockups with wire and view |
| `design/reply-grammar.md` | Create | The open prompt a reply answers, the five-row grammar and who may reply |
| `design/golden/M01-prompt-options-text.txt` to `design/golden/M23-reply-ambiguous.txt` | Create | 23 golden files, one per catalog row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `design/message-catalog.md` lists every message a channel sends a person and the two host lines, one row each, naming its surface, the module that builds it, whether it carries bot-authored text, the fields that vary and its golden file |
| REQ-002 | Every catalog row has one golden file in `design/golden/`, and the first line of each golden appears verbatim in the catalog |
| REQ-003 | Every refusal of `contracts/refusals.md` section 3.10 that a person in a chat can cause, and every `answerItem` refusal the `channel` surface reaches in `contracts/answer-seam.md` section 1, has a catalog row |
| REQ-004 | `design/mockups.md` draws Telegram, Slack and the plain text form each for a two-option item, a yes or no item, a question over the chunk limit and an expired prompt, twelve mockups, each with its wire payload or a pointer to one and a view no wider than 73 columns |
| REQ-005 | `design/reply-grammar.md` gives the accepted replies as a table with the text each passes to `answerItem`, which open prompt a reply answers and what a line that matches none becomes. The prompt a reply answers is the newest **delivered** one, an entry whose queue file is `delivered`, so a prompt still queued, in backoff or failed is never answered by a reply meant for another. Two delivered prompts open in one conversation make a bare number, `YES` or `NO` answer nothing and send M23. The terminal is the one exception: it lists the open needs-you items itself and resolves against that list, because no index entry reaches its stdout |
| REQ-006 | The catalog states that the 002 fatigue notice never reaches a chat, and that a chat sees the run's outcome and record pointer and not its reply text, with the reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The chunk sizes in the mockups follow from the limits of `../002-adapter-and-record-contracts/design/capabilities.md` section 2 and the cut rule, and a `node -e` recomputes them |
| REQ-008 | No tinychannels code is copied: every reference pointer is a path and a line range and no fenced block reproduces a line of its source |
| REQ-009 | Every acceptance criterion is answered by a command that runs without a tty, a token or a network |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The catalog check in `tasks.md` prints 40 and 23 and its two loops print nothing
- **SC-002**: The mockup check in `tasks.md` prints 12, 0 and no `MISSING` line, so the six chunk sizes `4,749`, `653`, `849`, `4,761`, `761` and `665` are all in `design/mockups.md`
- **SC-003**: `rg -c '^\| [1-5] \| ' design/reply-grammar.md` prints 5
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `deliveryMessage()` | A change to its lines changes four goldens | The catalog cites the function by line, and a change there is a design change with a diff here |
| Dependency | The frozen contracts | A contract sample that disagrees with the catalog misleads a builder | The parent spec lists the queue entry sample's text as a fix for its owner |
| Risk | A chat sees no reply text | A person who asked a bot something reads an outcome and a pointer | Recorded as an open question in the parent spec with its reversal condition |
| Risk | A GPL-3.0 reference invites copying | A license problem | Pointers only, and the check in `tasks.md` T013 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A view is at most 73 columns, so a reader checks it without scrolling
- **NFR-P02**: The design adds no runtime cost: markdown and 23 text files

### Security
- **NFR-S01**: No credential, token or real state-root path appears in `design/`. Samples use the contract's invented data set and `<bots state>` pointers
- **NFR-S02**: Every message that carries bot-authored text is marked in the catalog and passes the secret-literal check before it is queued

### Reliability
- **NFR-R01**: Every golden's first line is in the catalog, so the two cannot drift silently
- **NFR-R02**: Every `SOURCE` pointer resolves in a checkout that has the gitignored reference folder
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty reply is a chat message, and an empty chat message is dropped by the transport before the grammar runs
- Maximum input: a 4,500-character question is cut into two or three messages with the answer surface on the last one
- Failure path: every refusal a person in a chat can cause has one fixed reply, and a non-approver's Slack press draws none, because it is dropped before it is emitted
- Two answerers at once: the chat loser gets M18 or M19 and the terminal loser goes to `Gone`
- Adversarial input: a reply of `2.` or `#2` is a chat message, never an answer
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three design documents and 23 golden files in one folder, no code |
| Risk | 6/25 | A security rule decides what a chat sees |
| Research | 10/20 | `delivery.ts`, four contracts, the screen's overlay and three reference providers |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a chat see the bot's reply text? Decision: no, the outcome and the record pointer, because REQ-014 sends only `deliveryMessage()` output. The parent spec section 7 holds the reversal condition.
- Does a typed `YES` answer a prompt with options? Decision: no, it gets M20, because the person meant to answer and a run started with `yes` would surprise them.
- Which open prompt does a typed reply answer? Decision: the newest open one in that conversation, and the echo names the item.
- Does the echo name the option text? Decision: no, the number, so the echo carries no bot-authored text.
- Does an expired prompt get edited? Decision: no. `edit` is undeclared, so the prompt stays and a later press gets M15.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Design documents**: `design/message-catalog.md`, `design/mockups.md`, `design/reply-grammar.md` and `design/golden/`
- **Parent Spec**: `../spec.md`
- **Sibling children**: `../002-adapter-and-record-contracts/` to `../007-conformance-hardening-and-proof/`
