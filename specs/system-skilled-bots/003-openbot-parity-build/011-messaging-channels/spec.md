---
title: "Feature Specification: Phase 11: messaging-channels"
description: "A Level 3 phase parent for messaging channels: one adapter contract, a file-backed identity link and roster, an approval index and a durable send queue, then Telegram, Slack, the terminal, Signal and WhatsApp, split into two design children, four build children and a proof child."
trigger_phrases:
  - "messaging channels"
  - "phase 11 messaging channels"
  - "bots channel"
  - "messaging channels phase parent"
  - "telegram long polling"
  - "slack socket mode"
  - "signal-cli daemon"
  - "whatsapp cloud api webhook"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels"
    last_updated_at: "2026-11-26T06:00:00Z"
    last_updated_by: "wo-09-writer"
    recent_action: "Split the phase into seven children"
    next_safe_action: "Start child 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->
<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: Phase 11: messaging-channels

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
| **Phase** | 11 of 14 |
| **Predecessor** | `010-conversations` |
| **Successor** | `012-manual-testing-scenarios` |
| **Handoff Criteria** | A chat linked to a roster member answers a parked question by button or by reply, a restart loses no prompt and no queued send, an uncertain send is never retried, every message matches its golden in child 001 and the conformance suite passes on all five transports |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A bot reaches a person only through a macOS desktop notice and asks a question only through `bots inbox` on the host, so a team that works in a chat client walks to the machine to answer. `delivery.ts` names one channel, `desktop` and marks every other target `channel-unsupported`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:139-142] Nothing links a chat identity to a person and nothing records which prompt a button belongs to. The reference keeps that index in memory and loses it on restart. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:58-70] The pre-expansion phase was the widest leaf of the packet, with 29 file rows, 23 requirements, nine modules and five transports in one Level 2 folder and no message a person reads was designed. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:201-209]

### Purpose
Put a bot in the chat the team already uses, so a question is answered where it was asked by a person the roster allows, with every message designed before it is built.

> **Phase-parent note:** This `spec.md` and `goal.md` are the authored documents at the parent level. `decision-record.md` stays here because its twelve operator answers span the whole phase. The plan, tasks, acceptance criteria and continuity of each work stream live in the seven child folders of the Phase Documentation Map.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/bots.cjs channel list
bots: unknown verb: channel
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
...
exit=2
$ rg -c 'ChannelAdapter' .skilled/skills/system-skilled-bots/runtime/lib/
exit=1
$ rg -c 'approval-v1' .skilled/skills/system-skilled-bots/runtime/lib/
exit=1
$ rg -n 'DELIVERY_CHANNELS =' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts
45:export const DELIVERY_CHANNELS = ['desktop'] as const;
```

Taken on 2026-11-26 in this worktree. The CLI has no `channel` verb, no runtime module names an adapter or an approval action id and delivery knows one channel.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every message a person reads or sends on the five surfaces, designed as literal text, mockups and a reply grammar before any code (child 001)
- The capability vocabulary and matrix, every channel record with its lifecycle, the inbound acknowledge sequence, the five numbered conformance rules and the operator runbook (child 002)
- `channel.ts`, the identity link and its lockout, the `operators.json` roster and its verbs and the roster check in `answer.ts` (child 003)
- The file-backed approval index, the reply grammar, the durable send queue and the four channel names on `delivery.ts` (child 004)
- Telegram long polling, Slack Socket Mode and the terminal transport, none of which needs a public URL (child 005)
- Signal through a local `signal-cli` daemon and the WhatsApp Cloud API webhook (child 006)
- The conformance suite on the fake transport, the third-party notices and the operator documents (child 007)

### Out of Scope
- Discord and the other tinychannels providers [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/long_tail.rs:1-7]
- A hosted relay or a web UI [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:164]
- The WhatsApp Web linked-device client, streaming output into a chat, attachments and a per-channel approval policy beyond the roster. Child 003's spec section 3 names each and why
- A shared-host roster. The roster stays single-operator until a later packet lands the 0770 mode

### Files to Change
Each child's `spec.md` section 3 lists its own rows. Children 001 and 002 write only their own `design/` folders. The 29 rows of the pre-expansion table are spread across children 003 to 007 as section 5 below assigns them.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-threshold -->
## 3A. WHY THIS IS A PHASE PARENT

`phase-definitions.md` section 2 splits a phase only when the phase score is at least 25 and the level is at least 3. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:57-62] (the two thresholds, at lines 61 and 62)

The estimate behind the inputs, in lines added:

| Part | Lines |
|------|-------|
| `channel.ts`: contract, message model, capability constant, config read and write, reply table, redaction | 320 |
| `channel-link.ts`: code, link record, lockout, roster | 300 |
| `channel-approval.ts`: index, reply grammar, choice block | 240 |
| `channel-queue.ts`: queue, state machine, backoff, drain | 260 |
| `channel-telegram.ts` | 260 |
| `channel-slack.ts` | 280 |
| `channel-signal.ts` | 200 |
| `channel-whatsapp.ts` | 260 |
| `channel-terminal.ts` | 140 |
| Edits to `state-root.ts`, `delivery.ts` and `answer.ts` | 220 |
| The `channel` verb group in `bots.cjs` | 320 |
| Tests: seven new files, `answer.vitest.ts` and `channel-support.ts` | 1,700 |
| Runtime and skill documents and the notices | 290 |
| **Total** | **4,790** |

The file count is 29, the rows of the pre-expansion table. `--auth` applies because the pairing code, the roster and the roster check in `answer.ts` decide who may approve a bot's action.

```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 4790 --files 29 --auth --api --architectural
Recommended Level: 3 (Full)
Score: 92/100 | Confidence: 95%
...
- Phase Score: 50/50 (threshold: 25)
- Recommended: YES
- Suggested Phases: 4
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 800 --files 29 --auth --api --architectural
Recommended Level: 3 (Full)
- Phase Score: 30/50 (threshold: 25)
- Recommended: YES
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 4790 --files 29 --api --architectural
- Phase Score: 40/50 (threshold: 25)
```

Both thresholds pass. Unlike 010, the verdict does not rest on the line estimate: at `--loc 800` the score is still 30. It rests on `--auth`. Without it, `--loc 800` prints `Phase Score: 20/50`. The tool suggests four phases. Seven are taken because the work order fixes seven and the screen's design, contracts, build slices and proof shape needs them. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:70]
<!-- /ANCHOR:phase-threshold -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS THE CHILDREN INHERIT

Requirement ids of the build children are unique across 003 to 007 and keep their pre-expansion numbers, so a citation of `REQ-013` still means the send queue. New requirements start at REQ-024. Acceptance ids follow their requirement: AC-NNN checks REQ-NNN. Children 001 and 002 number their own REQ-001 and AC-001 upward inside their folders, so a citation of those ids names the child.

| REQ | Subject | Child |
|-----|---------|-------|
| REQ-001, REQ-002 | The adapter contract, the unsupported result and the message model | 003 |
| REQ-003, REQ-004 | The pairing code, the link record and the lockout | 003 |
| REQ-005 | Only a roster member answers from a channel | 003 |
| REQ-006 | The approval index written before the send | 004 |
| REQ-007 | Telegram and Slack buttons | 005 |
| REQ-008 | The numbered and YES or NO reply grammar | 004 |
| REQ-009, REQ-010 | Telegram long polling and Slack Socket Mode | 005 |
| REQ-011, REQ-012 | Signal and WhatsApp | 006 |
| REQ-013 | The durable send queue | 004 |
| REQ-014 | Token handling and the `deliveryMessage()`-only send | 005, and 006 inherits it by the rule below |
| REQ-015 | The terminal transport | 005 |
| REQ-016 | The four channel names on `delivery.ts` | 004 |
| REQ-017 | The five conformance rules | 007 |
| REQ-018 | The third-party notices | 007 |
| REQ-019 | `bots channel list` | 004 |
| REQ-020, REQ-021 | The roster verbs and the roster check in `answer.ts` | 003 |
| REQ-022 | The untrusted block around an inbound message, rendered by the transports through `conversation.ts` | 005, and 006 inherits it |
| REQ-023 | `channels/config.json` | 003 |
| REQ-024, REQ-025 | The Telegram and Slack wire table and the start probe | 005 |
| REQ-026, REQ-027 | The Signal and WhatsApp wire table and the start probe | 006 |
| REQ-028 | The choice block and button labels pass the secret-literal check | 004 |
| REQ-029 | Every chat message matches its golden | 005 |
| REQ-030, REQ-031 | The three conformance cases beyond the rules, and the operator documents | 007 |
| REQ-032, REQ-033 | The reply table in `channel.ts` and `redactToken` | 003 |
| REQ-034 | `bots channel send` and `drain` | 004 |

| Rule every child carries | From |
|--------------------------|------|
| Every channel record carries `schemaVersion: 1` and keeps the shape of `contracts/records.md` sections 11 to 16 | `contracts/versioning.md` rule 3 |
| `bots channel list --json` prints `{"version": 1, "channels": [...]}` | `contracts/cli-json.md` section 3.3, `contracts/decisions.md` D2 |
| A channel answer calls `answerItem` with the linked actor and the surface `channel`, in the order of `contracts/answer-seam.md` section 1 | `contracts/answer-seam.md` |
| An inbound message becomes a `<conversation channel="...">` block through 010's renderer, with the label and escape of `contracts/prompt-sections.md` sections 2 and 3 | `contracts/prompt-sections.md` section 1.9, `../010-conversations/002-conversation-runtime-and-chat-verb/spec.md` section 9 |
| Every refusal name, layer and exit is `contracts/refusals.md` section 3.10 | `contracts/refusals.md` |
| A token is read at `start` and at every send, never stored and every URL renders it as `bot<redacted>` | REQ-014 in child 005 |
| Every message text is a row of `001-channel-ux-and-message-map/design/message-catalog.md` | child 001 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:decisions -->
## 5. DECISIONS TAKEN IN THE SPLIT

| Decision | Why |
|----------|-----|
| Seven children, not a `design/` folder | Both thresholds in section 3A pass |
| `channel.ts` and `state-root.ts` land in child 003, in its first wave | No child row of the work order owns them, and 003 and 004 both import `channel.ts`. Child 004 starts when 003's first wave lands, so the two run partly side by side rather than fully |
| `bots.cjs` is edited in one order: 003 adds the verb group, `link`, `unlink` and `roster`, then 004 adds `list`, `send` and `drain`, then 005 adds `listen` with its transport table, then 006 adds two rows to that table | Four children edit one file, and the screen's rule is that no two workers touch one file at once |
| `tests/channel-support.ts` is created by 003, with the temporary state root and the scripted fake transport. 007 extends it with the capability-matrix driver | Every test from 003 on imports it. The work order places the fake transport in 007, which would leave 003 to 006 without a fixture until the end |
| `tests/cli-channel.vitest.ts` is created by 003 and extended by 004. `tests/channel-transports.vitest.ts` is created by 005 and extended by 006 | Each file is created by the first child that needs it, and each later child appends its own `describe` block in order |
| 005 and 006 build their modules side by side and serialize the shared test file and `bots.cjs` | The work order runs them in parallel. The two shared files make that only partly true |
| REQ-008, the reply grammar, moves to 004 and not to a transport child | Its code is `channel-approval.ts`, which 004 owns. The work order moves a requirement to the child that owns its file row |
| A channel needing more than one credential derives further secret names by a fixed suffix | `contracts/records.md` section 11 gives each channel one `secret`, and Slack and WhatsApp need more. `002-adapter-and-record-contracts/design/records.md` section 1.1 is the table |
| A run a chat starts ends in a notice with its outcome and record pointer, not the bot's reply text | REQ-014 sends only `deliveryMessage()` output, and that output holds no reply. The pre-expansion out-of-scope line said the reply is sent when the run ends. The security rule wins here, and section 7 asks the operator. The terminal keeps the reply through 010's chat path |
| The approval index holds one channel per item | The contract keys it by item id. A bot with two channel targets gets the prompt in both chats and the answer surface in the first one only |
| Chunks cut at the limit, never at a newline | One rule gives the same sizes on every transport, and `001-channel-ux-and-message-map/design/mockups.md` computes them |
| Every refusal reply names no bot-authored text, and the echo names a number, not an option | So the secret-literal check is needed only on the prompt |
| The drain writes the approval index entry, after the queue entry and before the send | `delivery.ts` may import only `channel-queue.ts` (`contracts/runtime-architecture.md` section 1.3) and only `channel-approval.ts` writes the index (`contracts/records.md` section 13) |
| The terminal transport answers on the `channel` surface with the OS user as actor | `contracts/answer-seam.md` step 1 gives every transport the `channel` surface, so the roster must name that user |
| `decision-record.md` stays at the parent | Its twelve answers span the whole phase, which `phase-definitions.md` section 3 allows as the one optional parent document |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:defects -->
## 6. CONTRADICTIONS AND DEFECTS THE SPLIT FIXES

| Defect in the pre-expansion phase | Fixed in |
|-----------------------------------|----------|
| REQ-005, REQ-023, AC-023 and the plan wrote the `operators.json` and `channels/config.json` literals without `schemaVersion` | 003: both literals carry `"schemaVersion": 1`, matching `contracts/fixtures/operators.json` and `channels-config.json` |
| REQ-019 said `--json` prints "an object" with no keys | 004: the `{"version": 1, "channels": [...]}` envelope, D2 |
| `declaredCapabilities` had no vocabulary | 002: `design/capabilities.md` |
| The acknowledge boundary and the `seen/` record had no design | 002: `design/inbound-sequence.md` |
| REQ-017 said five rules in one sentence | 002: `design/conformance-rules.md` numbers them R1 to R5 |
| No message text existed | 001: `design/message-catalog.md` and 21 goldens |
| The phase called itself 11 of 11 with no successor | This spec: 11 of 14, successor `012-manual-testing-scenarios` |
| The chat path was cited as `010-conversations/spec.md:96` | Every child cites `../010-conversations/002-conversation-runtime-and-chat-verb/spec.md` section 9, anchor `chat-path` |
| REQ-004 counted a failed code attempt for any message from an unlinked chat | 003: only a six-digit attempt counts (`002-adapter-and-record-contracts/design/records.md` section 2) |
| T060 put the untrusted wrap in `channel.ts`, which imports `state-root.ts` alone | 005: the transports render the block through `conversation.ts`, as `contracts/runtime-architecture.md` section 4 decides |
<!-- /ANCHOR:defects -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-channel-ux-and-message-map/ | Every message a person reads on the five surfaces: catalog, mockups, reply grammar and 21 goldens | Draft, written |
| 2 | 002-adapter-and-record-contracts/ | The capability matrix, the channel records, the inbound sequence, the five conformance rules and the operator runbook | Draft, written |
| 3 | 003-link-roster-and-answer-gate/ | `channel.ts`, `channel-link.ts`, `operators.json`, the roster verbs and the roster check in `answer.ts` | Draft |
| 4 | 004-approval-index-and-send-queue/ | `channel-approval.ts`, `channel-queue.ts`, the `delivery.ts` change and `list`, `send` and `drain` | Draft |
| 5 | 005-polling-transports/ | Telegram, Slack and the terminal | Draft |
| 6 | 006-daemon-and-webhook-transports/ | Signal and WhatsApp | Draft |
| 7 | 007-conformance-hardening-and-proof/ | The conformance suite, the notices and the documents | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

Order: 001 and 002 side by side, then 003, then 004 once 003's first wave lands, then 005 and 006 side by side, then 007.

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-channel-ux-and-message-map | 003-link-roster-and-answer-gate | The catalog and its 21 goldens exist | `ls specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design/golden/*.txt \| wc -l` prints 21 |
| 002-adapter-and-record-contracts | 003-link-roster-and-answer-gate | The five design documents exist | `ls specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/*.md \| wc -l` prints 5 |
| 003-link-roster-and-answer-gate | 004-approval-index-and-send-queue | `channel.ts` and the state folders land | `rg -n 'ChannelAdapter' .skilled/skills/system-skilled-bots/runtime/lib/channel.ts` prints the contract |
| 004-approval-index-and-send-queue | 005-polling-transports | The queue and the index land | `rg -n 'BACKOFF_MS' .skilled/skills/system-skilled-bots/runtime/lib/channel-queue.ts` prints the table |
| 004-approval-index-and-send-queue | 006-daemon-and-webhook-transports | The same | The same |
| 005-polling-transports | 007-conformance-hardening-and-proof | The three transports and the transport test file land | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-transports.vitest.ts` prints no `failed` |
| 006-daemon-and-webhook-transports | 007-conformance-hardening-and-proof | The two transports land | `rg -n 'X-Hub-Signature-256' .skilled/skills/system-skilled-bots/runtime/lib/channel-whatsapp.ts` prints the check |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Does a chat see the bot's reply?** REQ-014 sends only `deliveryMessage()` output, which holds the outcome and a record pointer. The pre-expansion out-of-scope list promised the reply. This split follows REQ-014. Reversal condition: the operator accepts sending the run's final answer text through the same secret-literal check, and child 001 adds a reply row to the catalog.
- **Are the derived secret names acceptable, or should `contracts/records.md` section 11 gain keys?** Settled by `contracts/records.md` section 11, "Derived secret names" and "Fixed addresses": the suffix names of `002-adapter-and-record-contracts/design/records.md` section 1.1 stand, `channels/config.json` gains no key, a `whatsapp` entry's `secret` is at most 48 characters and the Signal daemon and the WhatsApp listener keep fixed loopback addresses.
- **Does signal-cli keep events for a client that was disconnected?** UNKNOWN. `002-adapter-and-record-contracts/design/inbound-sequence.md` section 4 names the manual run that would confirm it.
- **Should the terminal transport answer on the `terminal` surface?** Settled by `contracts/answer-seam.md` section 1, step 1 "Surface", and its decisions table: the terminal transport answers on the surface `channel` with the OS user as the actor, so an absent roster refuses it `channel-roster-missing` while `bots answer` refuses nothing. Changing it is a change to that row and to child 005 REQ-015 together.
- **Which refusal name covers a credential the provider rejects at start?** Settled by `contracts/refusals.md` section 3.10, the rejected credential row: no refusal name. `channel listen` prints `bots: <channel> rejected the credential`, releases the lease and exits 1, which is what children 005 and 006 specify. A later name would be a new row there and a new exit here.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-file -->
## 8. FIXES NEEDED OUTSIDE THIS PHASE

This phase edits nothing outside its folder. Each row is for the owner of the file.

| File | Line | Change |
|------|------|--------|
| `contracts/README.md` | 51, the `011-messaging-channels` row | Remove the row: the `schemaVersion` literals are fixed in child 003 |
| `contracts/fixtures/channel-queue-entry.json` | 6, `text` | The text is not what `deliveryMessage()` builds. Replace it with the M02 text of `001-channel-ux-and-message-map/design/golden/M02-prompt-options-buttons.txt`, the one `records.md` section 14 says it is |
| `contracts/records.md` | 446, the queue entry sample line and section 11 | Name the derived secret names of `002-adapter-and-record-contracts/design/records.md` section 1.1, or add keys for the extra credentials and the two addresses |
| `contracts/refusals.md` | section 3.10 | A name for a credential the provider rejects at `listen` start |
| `../010-conversations/002-conversation-runtime-and-chat-verb/spec.md` | 268 | "drawn in `contracts/runtime-architecture.md` section 3.3" should read section 3.4, the channel inbound sequence |
| `../003-terminal-screen/005-answer-flow/design/state-machines.md` | 294 and 308 | The cites of `011-messaging-channels/spec.md:119` and `:153` move to `003-link-roster-and-answer-gate/spec.md` REQ-005 and REQ-021 |
| `../spec.md` | the phase map row for 011 | Mark 011 a phase parent with seven children |
| `contracts/answer-seam.md`, `records.md`, `refusals.md`, `runtime-architecture.md`, `cli-json.md`, `prompt-sections.md`, `fixtures/README.md` | every `011-messaging-channels/spec.md:<n>`, `plan.md:<n>` and `tasks.md:<n>` cite | Repoint by the map below |
| `../003-terminal-screen/`, `../006-approval-grants/`, `../008-vault/design/names-and-keys.md`, `../012-manual-testing-scenarios/`, `../014-deep-review/design/fixtures/deep-review-config.json`, `../goal.md` and three playbook files under `.skilled/skills/system-skilled-bots/manual-testing-playbook/` | the same cites | Repoint by the map below |

**Where each pre-expansion line went.** A cite of pre-expansion `spec.md` REQ-NNN now names the child of section 4 that holds REQ-NNN, at the same id. A cite of pre-expansion `plan.md` lines 63 to 80 names the plan of the child that owns the module. A cite of pre-expansion `tasks.md` T001 to T014 names child 003's setup, T015 to T024, T051 to T054, T058, T060 and T074 name child 003 or 004 by file, T025 to T031 name 005 or 006 by transport and T035 to T049 name the child that owns the test or document. The pre-expansion text is at commit `de601a1b444` for a cite that must keep its line.
<!-- /ANCHOR:cross-file -->

---

## RELATED DOCUMENTS

- **Phase children**: the seven `[0-9][0-9][0-9]-*/` folders beside this file
- **Parent Spec**: `../spec.md`
- **Parent Goal**: `../goal.md`, whose row for this phase binds this packet's `goal.md`
- **Operator answers**: `decision-record.md`
- **Contracts**: `../contracts/`
- **The chat path this phase reuses**: `../010-conversations/002-conversation-runtime-and-chat-verb/spec.md` section 9
