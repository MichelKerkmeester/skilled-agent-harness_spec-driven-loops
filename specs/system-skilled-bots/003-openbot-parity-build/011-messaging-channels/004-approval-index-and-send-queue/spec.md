---
title: "Feature Specification: Phase 4: approval-index-and-send-queue"
description: "Lands the approval index that resolves a press or a numbered reply after a restart, the reply grammar, the durable send queue with its backoff and its unknown state, the four channel names on delivery.ts with the choice block under the secret-literal check, and the list, send and drain verbs."
trigger_phrases:
  - "approval index and send queue"
  - "phase 4 approval index and send queue"
  - "channel send queue"
  - "channel reply grammar build"
  - "bots channel drain"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: approval-index-and-send-queue

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
| **Phase** | 4 of 7 |
| **Predecessor** | 003-link-roster-and-answer-gate |
| **Successor** | 005-polling-transports |
| **Handoff Criteria** | A parked run with a channel target leaves one queue entry, `bots channel drain` writes the index entry and sends through the fake transport, a press resolves after a restart, an uncertain send is `unknown` on the run record, every acceptance criterion is Met and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the messaging channels phase parent. It starts when child 003's first wave lands `channel.ts` and the channel folders.

**Scope Boundary**: `channel-approval.ts`, `channel-queue.ts`, the channel targets in `delivery.ts` and `list`, `send` and `drain` in the `channel` verb group. The `drain` verb in `bots.cjs` is the caller that writes the index entry through `channel-approval.ts` and then sends through the transport table, because `channel-queue.ts` may not import `channel-approval.ts`. It calls a transport through the contract of `channel.ts`, and its tests use child 003's fake transport, so no real transport is needed here. The real transports are children 005 and 006.

**Dependencies**:
- `channel.ts` and `state-root.ts` from child 003's first wave, and `channel-link.ts` for `list`'s linked chat count
- `../002-adapter-and-record-contracts/design/records.md` sections 3, 4, 8 and 9, the index, the queue, the list payload and the write order
- `../001-channel-ux-and-message-map/design/reply-grammar.md` and catalog rows M01 to M04 and M21
- `contracts/records.md` sections 13 and 14, `contracts/cli-json.md` section 3.3 and `contracts/refusals.md` section 3.10
- The delivery hook, which already gives a parked run's entry its item id [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:133-143] and the one desktop channel it knows [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45]
- The secret-literal check over the title and body [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:291]
- Phase 006's rule that `no` records `deny` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:163]

**Deliverables**:
- `channel-approval.ts`: the index, the action id, the expiry, the group refusal, the per-actor counter and the reply grammar
- `channel-queue.ts`: the exclusive-create queue, the backoff, the forward-only states and the `unknown` state on the run record
- `delivery.ts`: `telegram`, `slack`, `signal` and `whatsapp` as delivery channels, a channel target as a queue entry, the choice block under the literal check
- `bots channel list`, `bots channel send` and `bots channel drain`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A parked run's question reaches only a desktop notice today, because `desktop` is the one delivery channel [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45]. A press on a chat button would arrive with nothing on disk to say which item and which choice it means, and a message sent while the network is down would be lost or sent twice.

### Purpose
Every prompt a chat receives has an index entry a restart cannot lose, every outbound message is a file before it is sent and a send that may or may not have happened is never repeated.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Taken on 2026-11-26 in this worktree.

```text
$ rg -n 'export const DELIVERY_CHANNELS' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts
45:export const DELIVERY_CHANNELS = ['desktop'] as const;
$ ls .skilled/skills/system-skilled-bots/runtime/lib/ | rg -c '^channel-'; echo "exit=$?"
exit=1
```

One delivery channel and no channel module.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the approval index, written by the drain before a prompt is sent and resolve every press and numbered reply through it.
- Add the reply grammar of child 001.
- Add the durable send queue, the backoff and the `unknown` state and write `unknown` to the run record's delivery entry.
- Add the four channel names to `delivery.ts`, turn a channel target into a queue entry and append the choice block before the literal check.
- Add `bots channel list`, `send` and `drain`.

### Out of Scope
- A transport - children 005 and 006. The drain here calls the fake transport in tests.
- Editing a sent prompt when its item expires - `edit` is undeclared on every transport.
- One answer surface in two chats - the index holds one channel per item (parent spec section 5).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-approval.ts` | Create | The index, the action id, expiry, the group refusal, `notApprover` and the reply grammar |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-queue.ts` | Create | The queue, the backoff, the states, the drain's due-entry walk and the `unknown` write to the run record |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Modify | The four channel names, a channel target as a queue entry, the choice block under the literal check |
| `.skilled/bin/bots.cjs` | Modify | `list`, `send` and `drain` in the `channel` group, after child 003's verbs |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-approval.vitest.ts` | Create | Restart, expiry, group, grammar, counter and the concurrent answer |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-queue.vitest.ts` | Create | Exclusive create, backoff, `unknown`, the run record entry and the delivery hook |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-channel.vitest.ts` | Modify | A `describe` block for `list`, `send` and `drain` after child 003's |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids keep their pre-expansion numbers and are unique across children 003 to 007, as `../spec.md` section 4 maps them. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-006 | A prompt sent to a channel has an entry in `channels/approvals.json`, the shape of `contracts/records.md` section 13, written only by `channel-approval.ts` and written by the drain before the send, carrying the channel, the conversation, the choices and the item's `expiresAt`. The action id `approval-v1:<item-id>:<index>` is derived with a 1-based index, never stored. A press or a reply resolves through that file, so a restart loses no prompt and no press is answered from memory. A press after `expiresAt` is refused `item-expired` with reply M15 and the entry is removed on the next read. A press or reply from a group conversation is refused `channel-group-approval` with reply M16. Only a parked run's prompt has an entry, so 002's fatigue item is answered by `bots enable` and never reaches a chat and a reply naming it is a chat message [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:134]. A channel `answer-not-approver` adds one to `notApprover.<actor>` and locks no chat. A press or a reply whose item has no entry falls through to `answerItem`, so the reply is the existing answered or expired row and never a new refusal, which is what a second press, a redelivery after a crash and the second chat of a two-target bot all reach |
| REQ-008 | Signal, WhatsApp and the terminal accept the five rows of `../001-channel-ux-and-message-map/design/reply-grammar.md` section 2, case-insensitive and trimmed, answering the newest open prompt in that conversation whose queue entry is `delivered`. An entry that is still `queued`, `sending` or `unknown` is not a candidate, because the person may never have seen it, and the drain removes `prompts.<itemId>` when an entry ends `failed`, so a prompt the platform rejected is never answered. When more than one delivered entry is open for the conversation, a bare number or `YES` answers nothing and the reply is catalog row M23, which names the open item ids, because the person cannot say which prompt they mean. The grammar maps `N` to `no` before it calls `answerItem`, so a refusal is recorded `deny` by 006's rule rather than by a second copy of it and the channel passes no scope of its own [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:163]. `YES` on a prompt with options and a number out of range reply M20 and keep the prompt open. A line that is none of those is a chat message, not an answer |
| REQ-013 | Every outbound message is a file in `channels/queue/`, the shape of `contracts/records.md` section 14, created with the exclusive flag under its idempotency key before the I/O. A state only moves forward. A send whose result is uncertain is recorded `unknown` and never retried, a `sending` entry found at the start of a drain becomes `unknown` and the `unknown` state is written to the run record's delivery entry, so a lost notice is visible in `bots status`. `bots channel drain` prints M21 for each entry it turns `unknown`. A retryable failure waits the larger of the next step of `BACKOFF_MS` 0, 5,000, 25,000, 120,000 and 600,000 and the provider's own wait, for at most five attempts and a permanent failure is not retried |
| REQ-028 | `delivery.ts` builds a prompt's choice block from the item's options, the M01 and M03 form of the catalog, appends it to the `deliveryMessage()` body and runs the secret-literal check over the title, the body and the block together, so a hit withholds the whole prompt with the existing withheld evidence and no queue entry is written. The check always runs over the text form, whatever the channel draws, so the only label a chat can show is one the check saw. The queued `text` is the button form, the M02 golden, when the channel's capability says `buttons: yes` and the text form, the M01 golden, otherwise, so one entry holds exactly what its transport sends. `delivery.ts` reads that capability from the channel descriptor table in `channel.ts`, which declares it per channel name, so it never imports a transport. A transport's buttons carry the same choices, so no label reaches a chat that the check did not see |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-016 | `delivery.ts` gains the four channel names, so a run that parks a question queues its prompt for the channel that asked and a failed run's notice reaches the same place, each as the entry `notice-<runId>-<channel>`. The reply target is `<channel>:<chatId>`, taken from the request's reply target and never from the bot definition, so a chat-started run answers the chat that asked. Between the enqueue and the drain's terminal write the run record's delivery entry reads `queued`, so no reader sees a prompt as delivered before the platform accepted it |
| REQ-019 | `bots channel list` prints each channel `channels/config.json` names, whether it is enabled, its linked chat count from `links.json` and its queue depth from `queue/` and `--json` prints `{"version": 1, "channels": [...]}` with the keys of `contracts/cli-json.md` section 3.3, sorted by name. The human output also prints one `notApprover <actor> <count>` line per actor whose count is above zero, which is the only reader of the counter `channel-approval.ts` writes, and `--json` gains no key for it because `contracts/cli-json.md` section 3.3 is frozen |
| REQ-034 | `bots channel send <channel> <conversation> <text>` refuses a conversation with no link `channel-unlinked`, runs the literal check on the text, enqueues it under `send-<hash>` and drains that one entry. `bots channel drain` walks every due entry once and exits 1 when any due entry ended `failed` or `unknown` in that pass, else 0. A refusal the drain returns, such as `channel-daemon-unreachable`, exits 4 per `contracts/refusals.md` section 3.10, so the three outcomes have one rule each and an entry that merely stays `queued` changes no exit code |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A parked run with the target `telegram:81234567` leaves one `queued` entry and no index entry, and one drain writes the index entry, then sends through the fake transport
- **SC-002**: After a restart, a press carrying `approval-v1:<item-id>:2` answers the item with its second option and queues one resume request
- **SC-003**: A fake transport that reports an uncertain result leaves the entry and the run record's delivery entry `unknown`, and a second drain sends nothing
- **SC-004**: A question holding a stored secret writes no queue entry
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 003's first wave | Nothing here compiles without `channel.ts` | The parent's ordering rule, and this child's wave 0 checks for the file |
| Risk | An option text carries a stored secret | It reaches a chat as a button | REQ-028 checks the block with the body, and the buttons carry the same choices |
| Risk | A drain stops mid-send | The prompt is sent twice | `sending` at start becomes `unknown`, never resent |
| Risk | The index keeps one channel per item | A second chat's press is refused | Recorded in the parent spec section 5 as a decision |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A drain reads each due entry once and sleeps for no backoff. It skips an entry whose `nextAttemptAt` is in the future

### Security
- **NFR-S01**: No queue entry, index entry or error holds a token. Every error passes through `redactToken`
- **NFR-S02**: Every prompt text passes the literal check before it becomes a file

### Reliability
- **NFR-R01**: The index and the queue are written with `writeStateAtomic` and created 0600 through `state-root.ts`'s `writeStateFile`. Every read-modify-write of `channels/approvals.json` holds an exclusive lock file, `channels/approvals.lock`, on the model of `needs-you/<item-id>.lock`, so the drain that adds an entry and the `listen` process that removes one and bumps `notApprover` cannot lose each other's write. A lock still held after 2,000 ms is left alone and the write is refused rather than forced
- **NFR-R02**: A second enqueue of one key enqueues nothing
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `bots channel send telegram 81234567 ""` exits 2 with usage
- Maximum input: a prompt over the chunk limit is one queue entry, and the transport cuts it by the chunking rule at the head of `../001-channel-ux-and-message-map/design/mockups.md`
- Failure path: a permanent failure is `failed` with one attempt and never retried
- A press on an entry whose item was answered in the terminal: `answerItem` refuses `item-answered-differently` or reports `duplicate`, and the reply is M18 or M08
- A reply of `2` when two prompts are open: it answers the newer one, and the echo names its item
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two new modules, two edits and three test files |
| Risk | 12/25 | An uncertain send and a secret in an option |
| Research | 5/20 | The design children fix every shape |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Who writes the index entry? Decision: the drain through `channel-approval.ts`, before the entry goes `sending`, because `delivery.ts` imports only `channel-queue.ts` (`contracts/runtime-architecture.md` section 1.3). `../002-adapter-and-record-contracts/design/records.md` section 9 gives the order.
- What is `bots channel send` for? Decision: the operator's test message to a linked chat, REQ-034, so the runbook's health check has a verb.
- Does a `no` on an options prompt pass the text `no`? Decision: yes, and 006's rule records `deny`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Design children**: `../001-channel-ux-and-message-map/design/`, `../002-adapter-and-record-contracts/design/`
- **Previous child**: `../003-link-roster-and-answer-gate/`
- **Next child**: `../005-polling-transports/`
