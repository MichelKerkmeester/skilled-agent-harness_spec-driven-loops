---
title: "Feature Specification: Phase 6: approval-grants"
description: "Adds a grants field to needs-you items so an approval names the kind of action it approves, the rung of OpenBot's precedence ladder that made it ask, and the scope the answer granted, with the ladder written as a doc and applied at the needs-you gate."
trigger_phrases:
  - "approval grants"
  - "phase 6 approval grants"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: approval-grants

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
| **Phase** | 6 of 10 |
| **Predecessor** | 005-memory |
| **Successor** | 007-per-bot-apps |
| **Handoff Criteria** | Every needs-you item written after this phase carries `grants`, 001's `bots answer --scope once\|deny` records the scope and its actor on it, and `bots-run/references/approval-ladder.md` names the four rungs in OpenBot's order and marks rungs 2 to 4 not implemented in this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: The `grants` field on a needs-you item, the action-kind classifier, rung 1 of the precedence ladder at the needs-you gate with the whole ladder written as a doc, the scope an answer records, and the guarded item write. Per-action policy inside the executor, a rules store, an auto-review or extra-vigilant switch, and the status index's item row are other phases or later packets.

**Dependencies**:
- Phase 001's `bots answer --scope once|deny --as <name>` and `bots inbox --json --all`, which this phase extends with the grant and the ladder, and whose `--as` fills the grant's `grantedBy` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "In Scope"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-004] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-010]
- The needs-you item and its validator, which the grant extends [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29-47]
- The gate that writes the item from the child's decision marker, which classifies the question [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1099-1119]
- The answer path, which rewrites the item and queues the resume [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:65-119]
- The inbox read, which prints one line per item [SOURCE: .skilled/bin/bots.cjs:458-478]

**Deliverables**:
- `grants` on a needs-you item: the action kind, the action in the bot's words, the rung that made it ask, and the scope the answer granted
- `action-kind.ts` and `approval-ladder.ts` in the runtime library
- The grant on 001's `bots answer --scope once|deny`, and the grant on the `bots inbox` line and on its `--json` row
- `bots-run/references/approval-ladder.md`, the ladder written as a doc
- `design/`, the folder a builder reads before writing any of the above: the record schemas with every field, the state machines and sequences in Mermaid, the refusal catalogue, the surfaces an operator reads and the goldens a test asserts against
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A needs-you item names a question, its options, its evidence and the parked prompt, and nothing else, so an approval cannot say what kind of action it approves [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29-47]. `bots answer` records the answer text, its actor and its scope, so a deny is distinguishable from an approval, but nothing says what kind of action was approved or which rung made the bot ask [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:82-86] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-010]. OpenBot decides what asks in a fixed order — kinds of action, then rules, then auto-review, then extra vigilant, first answer wins — and skilled bots has no written order at all, so nothing says whether a kind beats a rule [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-13].

### Purpose
Give every approval a name and a rung, so an operator can read what a bot is asking to do and why it is asking, and so a later packet has a record to honour.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ node .skilled/bin/bots.cjs answer item-1 yes --scope once
bots: unknown option: --scope
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
exit=2
$ node .skilled/bin/bots.cjs inbox --json
bots: inbox takes no --json
usage: bots <verb> [id] [--repo <path>] [--skilled-tree <path>]
exit=2
$ rg -c 'grants' .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts
exit=1
$ ls .skilled/skills/system-skilled-bots/bots-run/references/
run-queue-and-answer.md
```

The first refusal is the measured behavior the Problem Statement rests on: `answer` accepts no scope, because its verb spec lists no options [SOURCE: .skilled/bin/bots.cjs:73]. The second is the inbox's: it takes no `--json`, so a grant could not be read by a machine either [SOURCE: .skilled/bin/bots.cjs:458]. The third is the item's: the word `grants` appears nowhere in the module that owns the item's shape, so no item can carry one [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-65]. The fourth is the ladder's: the run mode's reference folder holds one file, and it is not the ladder.

The first two are measured before 001 lands. 001 adds `--scope` and `--as` to `answer` and `--json` and `--all` to `inbox`, so this phase starts from `bots: item-unknown: item-1` and a JSON row that carries no grant, and it adds the grant rather than the flag [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "In Scope"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-003] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-004] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-010]. The third and fourth are this phase's own.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `grants` to a needs-you item, holding the action kind, the action in the bot's own words, the rung of the ladder that made it ask, and the scope the answer granted
- Add `action-kind.ts`, which reads the whole question and returns the strictest of OpenBot's six kinds found anywhere in it, or `other`, testing them in OpenBot's order so a payment that also deletes reads as `pay` [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:125]
- Add `approval-ladder.ts`, which implements rung 1 (kinds) and the `bot` fallback, and names rungs 2 to 4 in the ladder doc and the help text as not implemented in this phase because no store supplies them
- Apply the ladder at the needs-you gate: classify the parked question and write the grant on the item the gate already writes, and fill it on the memory-proposal branch 005 lands, which writes no `grants` field of its own [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md, T021]
- Extend 001's `bots answer --scope once|deny` with the grant: record the scope and its actor on it, and keep 001's refusal of `always` and `conversation` as `grant-scope-unsupported` because no rule store lands in this phase [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-010]
- Guard the item write, so two answers that both read `open` cannot both land and the loser is refused `item-answered-differently`, and keep one write path: 002 answers the fatigue item through `answerItem`'s no-resume option rather than a second write, so this phase fills the grant on that answer and on the item `evaluateFatigue` writes, and neither queues a resume [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md, T010] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md, T021]. The no-resume option also drops a resume still queued for that item, so a resume an earlier answer queued cannot dispatch the tenth failed run once `bots enable` clears the switch [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-006]
- Name the authority model: the host is the authority, so a terminal answer needs no roster to exist and an absent roster refuses nothing there, while a present roster is checked on either surface, so an actor who is neither `owner` nor a `members` entry is refused `answer-not-approver` on the terminal too, and a channel answer adds the `operators.json` roster 011 lands and is refused `channel-roster-missing` when it is absent [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md, REQ-021]. `bots enable`'s fatigue answer takes the same check, so a present roster that names neither the owner nor the OS user refuses it `answer-not-approver` and the item stays open, and the screen answers through `bots answer`, so the same refusal reaches it as that verb's exit code and its stderr in the status row while the item stays open [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md, REQ-014]. A bot child writes the same state root only on an executor kind whose read-only posture is a tool or approval gate rather than an OS boundary — `cli-claude-code`, `cli-opencode`, `cli-devin`, `cli-pi` and `cli-mistral-vibe` — so a capped child on one of those keeps the filesystem reach of the user it runs as [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:42] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:62], while `cli-codex`, `cli-cursor` and `cli-deepseek-harness` confine writes at the OS level, so a capped child on one of those cannot write the state root — and `cli-deepseek-harness` leaves OS temp writable — but it can still read it, and `native` honors no sandbox class at all [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:299-323]. The model is a boundary and not an authentication, and the grant's `grantedBy` records the actor the answer claimed
- Write the ladder as a doc at `bots-run/references/approval-ladder.md`, name the granted scope in the resumed run's prompt, and carry one line per grant on the resumed run's record

### Out of Scope
- Per-action policy inside the executor (send, delete, pay) - the research defers it to a later packet, with OpenGhost's MIT rules engine as the liftable layer [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:93]
- A rules store, an auto-review switch and an extra-vigilant switch - no store supplies them, so rungs 2 to 4 are named in the ladder doc and the help text as not implemented in this phase, and the research sizes this slice as a doc plus one check [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-1/research.md:166]
- A saved rule that outlives its item - rung 2 has no store in this phase, so 001's refusal of `always` and `conversation` as `grant-scope-unsupported` stands and only `once` and `deny` are recorded
- `bots activity`, the `bots inbox --json` row shape and the seven activity groups - phase 001-activity-and-actor owns all three, and this phase adds the `grants` key to the row it reads [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Shared Records"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "PHASE DOCUMENTATION MAP", row 6]
- The status index's `items` row - it keeps ids and times and never the question or answer text, so the kind is read from the item file rather than stored twice [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:319]
- The shared-host 0770 mode - no child builds it, and phase 011 lands the `operators.json` roster its channel check needs [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Out of Scope"]
- A team rule that closes a kind for everybody - the research puts the admin tier on the skip list, and there is no sign-in to govern [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:110]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/action-kind.ts` | Create | The six kinds, their word lists and `classifyAction` |
| `.skilled/skills/system-skilled-bots/runtime/lib/approval-ladder.ts` | Create | The four rungs in order, `decideApproval` over rung 1 and the `bot` fallback, and the scope rule |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Modify | `grants` on the item, its key and its validation, and the scope in the resumed prompt |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Classify the parked question and write the grant at the gate, and fill it on the memory-proposal branch 005 lands |
| `.skilled/skills/system-skilled-bots/runtime/lib/routine-state.ts` | Modify | The fatigue item 002 raises in `evaluateFatigue` carries the grant, so it is not born with `grants: null` |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Write 001's scope and its actor on the grant, keep the standing-allow refusal, derive `deny` from a NO, guard the write, take the no-resume option `bots enable` passes, and drop a resume still queued for that item |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | One line per grant on the resumed run's record |
| `.skilled/bin/bots.cjs` | Modify | The grant on the `answer` scope 001 lands, the grant on the `inbox` line and its `--json` row, and `enable`'s fatigue answer through `answerItem`'s no-resume option |
| `.skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` | Create | The ladder as a doc: four rungs, first answer wins, rungs 2 to 4 marked not implemented in this phase, and the two scopes |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | Modify | The grant 001's `--scope` records on `bots answer` |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | Modify | The grant on the `bots inbox` line and its `--json` row |
| `.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md` | Modify | The `grants` field in the item contract |
| `.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md` | Modify | The scope an answer records |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | Two module rows |
| `.skilled/skills/system-skilled-bots/runtime/tests/action-kind.vitest.ts` | Create | The six kinds, their order and the `other` fallback |
| `.skilled/skills/system-skilled-bots/runtime/tests/approval-ladder.vitest.ts` | Create | Rung 1 and the `bot` fallback, rungs 2 to 4 named as not implemented, the scope rule |
| `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts` | Modify | The grant's validation, the null default and the resumed prompt |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Modify | The scope written, the standing-allow refusal, the NO that records `deny`, the answer identity and the guarded write |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modify | The grant written at the gate and on the memory-proposal branch, the `[ACTION: <kind>]` line and the grant line on the resumed record |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts` | Modify | The grant on the inbox line and row, and 001's `--scope` reaching it |
| `crates/bots-tui/tests/fixtures/bots` | Modify | The `grants` key on the `inbox --json` payload the screen reads, so the fake CLI serves the shape this phase ships |
| `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` | Modify | Append a `## 006-approval-grants` section holding the MIT notice for the lifted classifier; 001 creates the file |
| `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/records.md` | Create | Every field of the six shapes this phase writes, with the validation order and the refusal detail for each |
| `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/state-machines.md` | Create | The grant lifecycle, the item and lock machine, the answer sequence, the gate sequence, the classifier flow and the ladder flow, in Mermaid |
| `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/refusals.md` | Create | The nine refusals this phase raises or reuses, with the trigger, the exact text, the exit, the state on disk and the test |
| `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/mockups.md` | Create | The inbox line and its JSON row, the answer stdout lines, the usage text, the resumed prompt and the ladder doc's shape |
| `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/design/fixtures/` | Create | Eleven goldens: three grant states, one item, the lock file, the run record's grant line, the kind table, the ladder matrix, the inbox line, the inbox row and the resumed prompt |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A needs-you item carries `grants`, holding `kind` (one of `pay`, `credentials`, `delete`, `send`, `share`, `post` or `other`), `action` (the whole question, clipped to 120 characters), `rung` (one of `kind`, `rule`, `auto-review`, `extra-vigilant` or `bot`), `scope` (`once`, `deny`, or `null` while the item is open), `grantedBy` and `grantedAt` (both `null` while the item is open). The grant's `scope` is the value 001 writes on the item's answer, written in the same write, so the two cannot disagree. The field table is `contracts/records.md` section 3 and the ten-check validation order is `design/records.md` section 1.1. The item carries two keys named `kind` with different vocabularies: the item's `kind` is the review kind (`decision`, `memory-proposal`, `skill-proposal`) and `grants.kind` is the action kind, so a reader that means the action says `grants.kind` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "1. NEEDS-YOU ITEM"] |
| REQ-002 | `classifyAction` reads the whole question and returns the strictest kind found anywhere in it, testing `pay`, `credentials`, `delete`, `send`, `share` and `post` in that order, so a payment that also deletes reads as `pay` and a benign first sentence cannot hide a delete |
| REQ-003 | `decideApproval` implements rung 1 (kinds) and the `bot` fallback, and returns `rung: "kind"` when a kind asks and `rung: "bot"` when no kind matches; rungs 2 to 4 (`rule`, `auto-review`, `extra-vigilant`) are named in the ladder doc and the help text as not implemented in this phase, because no store supplies them, and the function never returns them. The `rung` enum's fifth value `bot` is the fallback the ladder ends at, not a rung, so four rungs and five values are one list |
| REQ-004 | The needs-you gate classifies the parked question and writes `grants` on the item, and every item writer this phase can see fills it — the gate, the answer, the resume stamp, the memory-proposal branch 005 lands in `runner.ts`, and the fatigue item 002 raises in `routine-state.ts`'s `evaluateFatigue` — so no writer drops the grant and every item written after this phase names what it approves and which rung made it ask [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "Shared Records"]. The fatigue item is born with a grant because its writer classifies the question it writes, and 002 answers it through `answerItem`'s no-resume option rather than a second write path, so that answer records the grant and queues no resume [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md, T010] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md, T021]. An answer to that item from `bots answer` or the screen passes no no-resume option, so a resume request is queued, and a drain that runs before `bots enable` refuses that run `routine-fatigued` because the switch is still set, so the bot stays off and the item stays answered. `bots enable` then runs with the no-resume option on an item that is already answered, and that option skips the answer-identity judgement, drops the queued resume and goes to the request-id step, so the tenth failed run is never dispatched and `bots enable` is never refused `item-answered-differently` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "4. DECISIONS TAKEN"]. A channel never answers that item: 011 writes a prompt file only for a parked run, so the fatigue notice never reaches a chat and a chat's reply naming it is a chat message rather than an answer [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md, REQ-006]. The no-resume option drops any resume still queued for that item before the answer returns, so `bots enable` cannot leave a resume behind that dispatches the tenth failed run once it clears the switch, which 002 REQ-006 forbids [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-006]; a resume request keys on its item id, so the drop finds it by that key [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:143-160]. 005 writes no `grants` field of its own, so an item it writes reads with `grants: null` until this phase fills it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md, T021]. A writer a later phase adds fills the field with this phase's `classifyAction` and `decideApproval` rather than writing `null`, because the field is this phase's to own |
| REQ-005 | 001's `bots answer <item-id> <text> --scope once\|deny` records the scope on the item's grant with `grantedBy` and `grantedAt`, and an answer with no `--scope` records `once` — except a NO, the text `deny`, `no` or `n`, case-insensitive and trimmed, which the screen and the channel grammar both send, and which records `deny`, so a refusal is never recorded as an approval on any surface [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md, REQ-006] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md, REQ-006]. The rule lives in `answerItem`, so a channel answer that passes no scope records `deny` too. The scope is written before the review seam 005 owns runs and before the resume request is built, and the resumed run's record carries one line per grant naming the item id, the kind, the scope and the actor, so a grant can be read back after the item is gone |
| REQ-006 | 001's refusal of `--scope always` and `--scope conversation` as `grant-scope-unsupported` stands on every item, because no rule store lands in this phase, so a standing allow cannot be recorded; when a store lands, a standing allow on an item whose `grants.kind` is `other` is refused `grant-kind-unknown`, because an allow reaches a kind of action only when it was given on that kind's card |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `bots inbox` prints each item's grant on the item's own line — its kind, its rung and its scope, with `-` for a scope not yet granted — and `bots inbox --json` carries the same `grants` object on each item row, so a machine reads the grant the line prints |
| REQ-008 | An item written before this phase reads with `grants: null` and still validates, so an existing inbox keeps listing |
| REQ-009 | `bots-run/references/approval-ladder.md` names the four rungs in OpenBot's order, the first-answer-wins rule, the strictest-rule rule within rung 2, and the two scopes, and marks rungs 2 to 4 not implemented in this phase |
| REQ-010 | The lifted classifier carries an MIT notice in `THIRD_PARTY_NOTICES.md` naming `shared/tool-name.ts`, OpenBot's copyright line and the licence |
| REQ-011 | `buildResumedPrompt` names the granted scope when the item carries one, so a resumed run knows what the operator allowed |
| REQ-012 | A question may carry one `[ACTION: <kind>]` line, which the gate parses; the grant records the stricter of the declared kind and the kind the word lists find, where stricter is the one earlier in `classifyAction`'s order, so a declaration can raise a kind and never lower it, and a benign first sentence cannot hide a delete behind `[ACTION: other]`. A line naming a kind outside the six is refused `action-kind-invalid` |
| REQ-013 | The answer's identity is its text and its scope: a second answer with the same text and a different scope is refused `item-answered-differently`, so a scope is never silently dropped |
| REQ-014 | The item write is guarded by one mechanism and not two: an exclusive lock file beside the item, at `<identity>/needs-you/<item-id>.lock`, created with the exclusive flag so a second creator fails rather than overwriting, and holding the writer's `pid`, a `nonce` and the instant it was created. The lock's lifetime is fixed: a lock whose owner pid is gone, or whose `createdAt` is more than 60 seconds before now, is reclaimed by rename before the acquisition is retried, so a lock left by a killed process never blocks the next answer. A lock whose owner is alive and whose age is under the bound is waited on for up to 2,000 ms and then refused `item-busy`. The lock is released on every exit path after it is taken. Two answers that both read `open` therefore cannot both land, and the concurrent loser is refused `item-answered-differently`. The contents and the lifetime are `design/records.md` section 3, the machine is `design/state-machines.md` section 2 and the sequence is `design/state-machines.md` section 3 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "4. DECISIONS TAKEN"] |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A run parked on a question naming a delete writes an item whose `grants` reads `"kind":"delete"` and `"rung":"kind"`, and `bots inbox` prints `delete` on that item's line
- **SC-002**: `bots answer <item-id> yes --scope deny` on a `delete` item records `"scope":"deny"` with its actor, and `--scope always` on the same item exits 2 with `bots: grant-scope-unsupported`
- **SC-003**: One ladder test proves rung 1 decides when a kind asks and the `bot` fallback names the bot when no kind matches, and the ladder doc names rungs 2 to 4 as not implemented in this phase
- **SC-004**: A lock file naming a dead pid is reclaimed, so the next answer to that item lands and is not refused `item-busy`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The needs-you item's validator, which rejects an unknown key | A grant written by a newer runtime is refused by an older one | Add `grants` to `ITEM_KEYS` in the same commit as the field, and read a missing one as `null` |
| Dependency | The gate's decision marker, which carries free text | The classifier reads a question, not a tool name, so a vague question classifies as `other` | Treat `other` as a valid answer, and let a bot that knows its kind say so on one `[ACTION: <kind>]` line, which the gate takes as a floor: the recorded kind is the stricter of the declared and the classified one |
| Risk | A question names two kinds, as a payment that also deletes does | The wrong kind is recorded, so a deny or a later allow attaches to the wrong action | Classify the whole question and test the kinds in OpenBot's order, which puts `pay` first, and prove it with a two-kind case |
| Risk | The grant's `action` carries text the answer later repeats | A secret the operator typed reaches the grant | Clip `action` from the question only, never from the answer, and test that an answer's text never appears in the grant |
| Risk | An operator expects a standing allow | `always` and `conversation` are refused, so the operator learns at the answer rather than after believing a grant took effect | Keep 001's refusal as `grant-scope-unsupported`, and name the rules store with `bots grants list\|revoke`, a 30-day default expiry, a scope bound to bot plus kind and an audit row as the next packet's work |
| Risk | Two surfaces answer the same item at once | The last write wins and the first decision is lost with no error | Guard the write with an exclusive lock file beside the item, and refuse the loser `item-answered-differently` |
| Risk | A process is killed while it holds the item lock | The lock file stays and every later answer to that item is refused `item-busy`, so the item can never be answered | Reclaim a lock whose owner pid is gone or whose age is past 60 seconds, by rename before the acquisition is retried, and prove it with a lock file naming a dead pid [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/answer-seam.md, section "4. DECISIONS TAKEN"] |
| Risk | A resume queued by an answer to 002's fatigue item outlives `bots enable` | The switch is cleared, so the next drain dispatches the tenth failed run, which 002 REQ-006 forbids | Drop any resume still queued for that item in `answerItem`'s no-resume path, and prove the enable-before-drain case |
| Risk | A bot child reaches the state root on the five gate-only executor kinds, because there a read-only posture is a tool or approval gate rather than an OS boundary [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:42] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:62], so the host-authority rule does not tell an operator from a bot; `cli-codex`, `cli-cursor` and `cli-deepseek-harness` confine writes at the OS level, so a capped child on one of those cannot write the state root but can still read it [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:299-323] | A child answers its own item, and the grant records the OS user as the actor when no `--as` is passed | Name the model as a boundary and not an authentication, record `grantedBy` as the actor the answer claimed, and leave the roster 011 lands as the one check that separates a person from a child: a present roster is checked on the terminal surface too, so an actor who is neither `owner` nor a member is refused `answer-not-approver` there, and a later packet caps a bot's reach to the state root |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `classifyAction` over a 4,000-character question returns in under 1 ms, because it is a fixed word-list scan with no I/O
- **NFR-P02**: The gate adds no file read and no process: the classifier reads the question the runner already holds in `signal.question`

### Security
- **NFR-S01**: The grant stores the whole question clipped to 120 characters and never the answer's text, so no secret the operator typed reaches the grant
- **NFR-S02**: A grant is a kind, a phrase, a rung, a scope and its actor, never a credential; no secret is read to fill it, and no secret value reaches the item
- **NFR-S03**: The answer's identity is its text and its scope, and the item write is guarded, so a second answer cannot replace a recorded decision silently

### Reliability
- **NFR-R01**: An item written before this phase reads with `grants: null` and still validates, so `bots inbox` and `bots status` keep listing it
- **NFR-R02**: A malformed grant refuses the item with `item-field-invalid: grants`, and the item is then reported as unreadable and holds its bot, the same as any other bad field
- **NFR-R03**: A lock file left by a killed process never blocks the next answer, because a lock whose owner pid is gone or whose age is past 60 seconds is reclaimed before the acquisition is retried, so no item becomes permanently unanswerable
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a question with no words classifies as `other`, and the item still writes with `rung: "bot"`, because the bot asked and the ladder only names why
- Maximum input: a 4,000-character question is classified whole, and its `action` is clipped to 120 characters
- Failure path: `bots answer <item-id> yes --scope sometimes` exits 2 with `bots: --scope takes once or deny`
- Failure path: `bots answer <item-id> yes --scope always` exits 2 with `bots: grant-scope-unsupported: no rule store lands in this phase`
- Failure path: a question carrying `[ACTION: transfer]` is refused `action-kind-invalid`, and the item is not written
- Failure path: a second answer with the same text and a different scope exits 2 with `bots: item-answered-differently`
- Boundary: a question carrying `[ACTION: other]` that names a delete records `delete`, because the stricter of the declared and the classified kind wins
- Boundary: a NO with no `--scope` records `deny`, so a refusal is never recorded as an approval
- Boundary: a lock file left by a killed process names a dead pid, so the next answer reclaims it and lands rather than being refused `item-busy`
- Boundary: a lock file whose owner is alive and whose age is under 60 seconds makes the next answer wait, and a wait past 2,000 ms is refused `item-busy` with the holder's pid and the lock's instant
- Boundary: `bots answer` answers 002's fatigue item and queues a resume, then `bots enable` runs before the next drain, so the queued resume is dropped and the tenth failed run is never dispatched
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 27 files, about 350 lines, two new modules, one stored field, one inbox column, one guarded write and one design folder |
| Risk | 6/25 | One stored field on a file the runtime already rewrites; no schema bump, no network, no auth |
| Research | 3/20 | The 002 packet names the lift, the six kinds and the four rungs; no new investigation |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does rung 2 need a rules store before a standing allow means anything? Decision: yes, so no standing allow is recorded. Rungs 2 to 4 are named in the ladder doc and the help text as not implemented in this phase, 001's refusal of `always` and `conversation` as `grant-scope-unsupported` stands, and the store returns with `bots grants list|revoke`, a 30-day default expiry, a scope bound to bot plus kind and an audit row on every grant and revoke.
- Is the bot's question the right place to read the action kind from? Decision: yes. It is the only text the gate holds, and a tool name would need the executor's tool surface, which the research puts out of scope. A bot that knows its kind may say so on one `[ACTION: <kind>]` line, which the gate takes as a floor: the recorded kind is the stricter of the declared and the classified one, so a declaration can raise a kind and never lower it.
- Should `bots inbox` print the grant on the item line or on a second line? Decision: the item line, so one `grep` finds every item of a kind, and the same object rides the `--json` row so a machine reads what the line prints.
- What happens to a lock file left by a killed process? Decision: it is reclaimed, because a lock that outlives its owner would make the item permanently unanswerable. A lock whose owner pid is gone, or whose age is past 60 seconds, is renamed away before the acquisition is retried, and a lock whose owner is alive is waited on for up to 2,000 ms and then refused `item-busy`. The contents and the lifetime are `design/records.md` section 3.
- Does the grant's `action` keep the bot's `[ACTION: <kind>]` line? Decision: yes. The contract says the question, and a reader that stripped the line would disagree with the stored `question`. The consequence is that the inbox line shows the bot's own declaration, which tells the operator what the bot believed it was asking about.
<!-- /ANCHOR:questions -->

---
