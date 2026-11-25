---
title: "Contract: the runtime answer seam"
description: "The numbered answerItem sequence after every phase lands, with the owner phase, the refusal and the on-disk state per step, the needs-you item state transitions and the four-row grant lifecycle."
trigger_phrases:
  - "answerItem sequence"
  - "answer review seam"
  - "grant lifecycle"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The runtime answer seam

`answerItem` is assembled from six phases: 001 adds the actor and the scope, 002 the no-resume option, 005 the review seam, 006 the grant and the guarded write, 010 the conversation id and 011 the roster check and the channel surface. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:156] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:62] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:163] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:63] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:168] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:208] This file is the one place the whole order is written.

The screen's side of an answer is drawn in [state-machines.md](../003-terminal-screen/005-answer-flow/design/state-machines.md): its section 3 is the sequence and its section 4 is the answer contract, the argv per answer kind in 4.1 and every return in 4.2. This file keeps those names: the worker's `Answer` effect, the `Answered` message and the three result classes `done`, `gone` and `refused`. It does not copy the screen's tables.

Field names of the item, the answer object and the grant object are owned by [records.md](records.md). Refusal rows are in [refusals.md](refusals.md).

---

## 1. THE SEQUENCE

Every step runs inside `answerItem` unless its owner column says `bots.cjs` or a transport. Steps 6 to 18 hold the item lock, and step 18 runs on every exit after step 6.

| # | Step | Owner | Refusal on failure | On disk if the process stops after this step |
|---|------|-------|--------------------|----------------------------------------------|
| 1 | **Surface.** The terminal path parses argv: `--scope`, `--as` and the tty rule. A channel transport calls `answerItem` directly with the linked actor, the surface `channel` and the text, after its grammar maps `N` to `no`. | `bots.cjs` (001), transport (011) | `grant-scope-unsupported`, `bots: --scope takes once or deny`, `bots: --as needs a tty`, `bots: --as takes a name`, all exit 2 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:156] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:190] | Nothing |
| 2 | **Blank text.** | existing | `answer-empty` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:69] | Nothing |
| 3 | **Repository.** Resolve config, identity and state root through `queueContext`. | existing | `identity-unknown`, `config-unreadable`, `config-invalid`, `unknown-key` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:71-73] | Nothing |
| 4 | **Actor.** `actor.ts` takes `--as`, then the operator pinned in the job's environment, then the OS user. A channel passes its linked actor as an argument. | 001, 011 | The name pattern refusal in step 1 | Nothing |
| 5 | **Roster.** On the `terminal` surface an absent roster refuses nothing. A present roster must name the actor as `owner` or in `members` on either surface. On the `channel` surface an absent, unreadable or empty roster refuses. | 011, the model 006 names | `answer-not-approver`, `channel-roster-missing` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:187] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:208] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:103] | Nothing, except that a channel refusal counts one failed attempt against the actor in the approval index's `notApprover` counter, which [records.md](records.md) section 13 holds [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:186] |
| 6 | **Lock.** Check the item id is a safe segment, then create `needs-you/<item-id>.lock` exclusively, holding the pid, a nonce and the instant. A lock whose owner pid is alive is waited on for up to 2,000 ms. A lock whose owner is gone, or that is older than 60 s, is reclaimed by rename. | 006 | `item-unknown` for an unsafe id [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:75], `item-busy` when the wait runs out | A lock file. The next answer sees its owner gone and reclaims it. The inbox ignores it, because the listing reads `.json` files only [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:229] |
| 7 | **Read.** Read and validate the item. An answer written before 001 has no `by` and no `scope`, and is read by the rule in [records.md](records.md). | existing | `item-unknown`, `item-unreadable`, `item-invalid`, `item-field-invalid` and the other validation reasons [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:76-79] | The lock only |
| 8 | **Answer identity.** Derive the scope: `--scope` when given, else `deny` for the text `deny`, `no` or `n` in any case after trim, else `once`. Then judge the state. Expired refuses. Answered with another text or another scope refuses. Answered with the same text and scope takes the duplicate path, which skips steps 9 to 11. The no-resume option on an already answered item skips this judgement and goes to step 13. | existing, 006 | `item-expired`, `item-answered-differently` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:82-86] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:157] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:170] | The lock only |
| 9 | **Secret check.** The known-secret map includes every value the vault stores. | existing, 008 | `answer-secret` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:88-89] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:159] | The lock only |
| 10 | **Review claim**, the first half of the seam. Each registered review kind is asked in order, and the first that claims the item by its `kind` checks the answer before anything is written: a memory proposal takes `confirm` or `reject` only, and a skill proposal checks its pin. Both review kinds take `confirm` or `reject`, and the NO set (`deny`, `no`, `n`) reads as `reject` with the scope `deny`. Any other text is refused. A `decision` item has no claimant. | 005, 009 | `review-answer-invalid`, `proposal-stale` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:153] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:165] | The lock only. The item stays open, as 009 requires [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:191] |
| 11 | **Write.** On an open item only, one atomic write sets the answer (`text`, `answeredAt`, `by`, `scope`) and the grant (`scope`, `grantedBy`, `grantedAt`). | 001, 006 | A throw from the atomic write, exit 1 | An answered item and nothing else. A `decision` item now holds the bot's unattended runs until its resume runs [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:320-333] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:867-880]. Sending the same answer again resumes at step 12 |
| 12 | **Stamp the run record.** Write `answeredBy` on the run record the item's `runId` names. Idempotent. | 001 | A throw, exit 1 | The answered item and the stamped record [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:69] |
| 13 | **Review settle**, the second half of the seam. The claimant applies its effect: a confirmed fact is appended to `proposalBotId`'s memory file, and a skill decision is recorded beside `proposal.json`. A claimed item then skips to step 16 with no resume. The no-resume option `bots enable` passes for the fatigue item also skips to step 16, after dropping any resume already queued for that item. | 005, 009, 002, 006 | `memory-full`, `memory-secret` for a fact the file cannot take | The answered item. A settle that stopped before its effect is applied again when the same answer is sent, and the effect checks first whether it already landed [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:153] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:63] |
| 14 | **Conversation stamp.** Build the resume request and copy the item's `conversationId` onto it. Skipped when the item already names a `resumeRequestId`. | existing, 010 | `resume-source-invalid`, `resume-item-id-invalid`, `resume-key-invalid` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:148-157] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:168] | As step 13. Nothing is queued yet |
| 15 | **Enqueue.** Write the seen marker, then rename the request into the watched folder. A marker that exists already returns `duplicate`. | existing | `seen-marker-failed`, `enqueue-rename-failed` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:133-150] | A queued resume and an item with no `resumeRequestId`. The bot stays held because a null id counts as waiting. The queued resume still runs. A stop between the marker and the rename loses the request while the marker stays, which the screen's table already names |
| 16 | **Request id.** Write `resumeRequestId` on the item. On the no-resume path it is the id the request would have had, so nothing waits on it. | existing, 002 | A throw, exit 1 [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:113-117] | The settled item |
| 17 | **Generation stamp.** Advance the stamp when anything changed. | existing | A throw, exit 1 [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:118] | Everything but the stamp. The next write that changes state advances it |
| 18 | **Release.** Remove the lock file, on every exit path after step 6. | 006 | None | Nothing extra |

### 1.1 What the caller sees

| Path | `status` | stdout of `bots answer` | Exit | Screen class |
|------|----------|-------------------------|------|--------------|
| A resume was queued | `enqueued` | `bots: item <id> answered; resume request <rid> enqueued` [SOURCE: .skilled/bin/bots.cjs:298-300] | 0 | `done` |
| The same answer again | `duplicate` | `bots: item <id> answered; resume request <rid> duplicate: already queued` | 0 | `done` |
| A review kind settled it, or the no-resume option | `reviewed` | `bots: item <id> answered; <kind> review recorded` | 0 | `done` |
| Any refusal | none | `bots: <reason>` or `bots: <reason>: <detail>` on stderr | 4, or 2 for step 1 | `gone` for `item-unknown`, `item-expired` and `item-answered-differently`, `refused` for the rest, as section 4.2 of the screen contract rules |

`item-busy` reaches the screen as `refused`, and a retry with the same key is safe, because the answer is idempotent for one text and one scope.

---

## 2. ITEM STATE TRANSITIONS

`open`, `answered` and `expired` are derived on every read and never stored. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:135-138] Whether an answered item still waits on its resume is derived too, by `itemAwaitingResume`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:320-333] Review kinds never hold a bot, because 005's kind filter skips every item whose `kind` is not `decision`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:154]

| From | Event | To | Writer | Holds the bot's unattended runs |
|------|-------|----|--------|---------------------------------|
| none | A run parks a `[NEEDS-DECISION]` question | `open`, kind `decision` | the runner's gate | Yes |
| none | A clean run prints `[REMEMBER] <type> <fact>` | `open`, kind `memory-proposal`, `botId` `memory-proposals` | the runner, 005 | No |
| none | `bots skill propose <run-id>` | `open`, kind `skill-proposal`, `botId` `skill-proposals` | `skill-proposal.ts`, 009 | No |
| none | The tenth consecutive failure | `open`, kind `decision`, `botId` the bot's own | `routine-state.ts`, 002 | Yes, and the `disabled` switch is set as well |
| `open` | Any refusal in steps 1 to 10 | `open` | none | unchanged |
| `answered`, awaiting resume | `bots enable` with the no-resume option on the fatigue item | `answered`, settled, the queued resume dropped | `answerItem` | No |
| `open` | Step 11 on a `decision` item | `answered`, awaiting resume | `answerItem` | Yes, until the resume leaves the queue |
| `answered`, awaiting resume | The resume request is claimed and finished | `answered`, settled | the drain | No |
| `open` | Steps 11 and 13 on a review kind, or the no-resume option | `answered`, settled | `answerItem` | No |
| `open` | `now` reaches `expiresAt` | `expired` | none, derived | No [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:243-246] |
| `answered` | The same text and scope again | `answered` | `answerItem`, duplicate path | unchanged |
| `answered` | Another text or scope | `answered` | none, refused `item-answered-differently` | unchanged |
| `expired` | Any answer | `expired` | none, refused `item-expired` | No |

---

## 3. GRANT LIFECYCLE

A grant is never a standing allow in this packet: its scope is `once` or `deny`, and an answer asking for more is refused `grant-scope-unsupported`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:158] The `kind`, `action` and `rung` keys are set at birth and never change.

| State | `scope` | `grantedBy` | `grantedAt` | Entered when | Writer |
|-------|---------|-------------|-------------|--------------|--------|
| Born open | `null` | `null` | `null` | The item is written | Every item writer: the gate, the memory-proposal branch, `bots skill propose` and the fatigue item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:156] |
| Granted | `once` | the actor | the answer's `answeredAt` | Step 11 with the scope `once` | `answerItem` |
| Denied | `deny` | the actor | the answer's `answeredAt` | Step 11 with the scope `deny`, given or derived from a NO | `answerItem` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:157] |
| Expired with its item | `null` | `null` | `null` | The item passes `expiresAt` unanswered | none, the grant is never written again |

---

## 4. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The review seam has two halves: a claim before the write and a settle after it | 009 requires a stale pin to leave the item open and write nothing [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:165] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:191], while 005 places the seam after the answer and the scope are written [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:163]. Only a split satisfies both, and the same split carries 005's refusal of an answer other than `confirm` or `reject` |
| The lock is taken before the read, not just before the write | Two answers that both read `open` before either locks would both write, which is the race 006 closes [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:171] |
| A stale lock is reclaimed when its pid is gone or it is older than 60 s, waited on for 2,000 ms otherwise, then `item-busy` | 006 states no stale rule [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:129]. The run lease already reclaims by owner pid and nonce, and this reuses that model [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:12-16]. An answer holds the lock for milliseconds, so 60 s is long |
| The repository identity (step 3) and the answer identity (step 8) are two steps | The plan-depth research lists one "identity check" [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:255], and the runtime has both checks |
| The roster check runs before the lock | It reads no item and refuses most often, so it never makes a second answerer wait |
| Steps 14 and 15 are skipped when the item already names a `resumeRequestId` | The no-resume path sets that id with no request behind it. Re-sending the answer would otherwise enqueue a resume of the tenth failed run, because no seen marker exists for it |
| The no-resume path writes the id the resume would have had | `itemAwaitingResume` treats a null id as waiting [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:323-330], so an answered fatigue item with a null id would hold the bot's scheduled runs after `bots enable`. The derived id names no queued file, so nothing waits on it [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:126] |
| `grantedAt` equals the answer's `answeredAt` | 006 writes the grant and the answer in one write so the two cannot disagree [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153] |
| A settle effect checks whether it already landed before it applies | A stop between steps 11 and 13 must not append the same fact twice when the answer is re-sent |
| Review items are born with `options: ["confirm", "reject"]`, and `reject` derives the scope `deny` | The screen sends `approve`, `deny`, an option text or free text [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/005-answer-flow/design/state-machines.md:264-269], and 011 sends a number or YES/NO [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:190]. With the two options set, the screen's digit key and 011's numbered reply and buttons send the literal. 005 accepts `confirm` and `reject` only [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:153] and 009 names no vocabulary, so a reject would otherwise record `once`, an approval, against 006 REQ-005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:157] |
| The no-resume option on an item already answered skips the answer-identity judgement, drops any queued resume and goes to step 16 | 006 lets `bots answer` or the screen answer the fatigue item first, which queues a resume [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:156]. `bots enable` then answers with its own text [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:66], and step 8 would refuse it `item-answered-differently`, so the resume would never be dropped. The text `enable` passes is still 002's to fix |
| A settled review prints `<kind> review recorded` with status `reviewed` | 009 says the verb reports a recorded review instead of a request and fixes no text [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:129] |
