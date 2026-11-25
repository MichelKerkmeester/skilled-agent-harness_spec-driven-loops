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
| **Handoff Criteria** | Every needs-you item written after this phase carries `grants`, `bots answer --scope` records the scope on it, and `bots-run/references/approval-ladder.md` names the four rungs in OpenBot's order |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: The `grants` field on a needs-you item, the action-kind classifier, the precedence ladder as a doc and at the needs-you gate, and the scope an answer records. Per-action policy inside the executor, a rules store, an auto-review or extra-vigilant switch, and the status index's item row are other phases or later packets.

**Dependencies**:
- The needs-you item and its validator, which the grant extends [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29-47]
- The gate that writes the item from the child's decision marker, which classifies the question [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1099-1119]
- The answer path, which rewrites the item and queues the resume [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:65-119]
- The inbox read, which prints one line per item [SOURCE: .skilled/bin/bots.cjs:458-478]

**Deliverables**:
- `grants` on a needs-you item: the action kind, the action in the bot's words, the rung that made it ask, and the scope the answer granted
- `action-kind.ts` and `approval-ladder.ts` in the runtime library
- `bots answer --scope once|conversation|always|deny`, and the grant on the `bots inbox` line
- `bots-run/references/approval-ladder.md`, the ladder written as a doc
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A needs-you item names a question, its options, its evidence and the parked prompt, and nothing else, so an approval cannot say what kind of action it approves [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29-47]. `bots answer` records the answer text alone, so nothing distinguishes an operator who allowed this once from one who allowed it always, and the resumed run cannot tell either [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:92-97]. OpenBot decides what asks in a fixed order — kinds of action, then rules, then auto-review, then extra vigilant, first answer wins — and skilled bots has no written order at all, so nothing says whether a kind beats a rule [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-13].

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
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `grants` to a needs-you item, holding the action kind, the action in the bot's own words, the rung of the ladder that made it ask, and the scope the answer granted
- Add `action-kind.ts`, which reads an action's name and returns one of OpenBot's six kinds or `other`, testing them in OpenBot's order so a payment that also sends reads as `pay` [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:125]
- Add `approval-ladder.ts`, which walks kinds, then rules, then auto-review, then extra vigilant, and lets the first rung that says ask decide
- Apply the ladder at the needs-you gate: classify the parked question and write the grant on the item the gate already writes
- Add `bots answer --scope once|conversation|always|deny`, record the scope on the grant, and refuse a standing allow on an item that names no kind
- Write the ladder as a doc at `bots-run/references/approval-ladder.md`, and name the granted scope in the resumed run's prompt

### Out of Scope
- Per-action policy inside the executor (send, delete, pay) - the research defers it to a later packet, with OpenGhost's MIT rules engine as the liftable layer [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:93]
- A rules store, an auto-review switch and an extra-vigilant switch - the ladder takes all three as inputs and no store supplies them yet, because the research sizes this slice as a doc plus one check [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/lineages/vibe-1/research.md:166]
- A saved rule that outlives its item - rung 2 has no store in this phase, so an `always` scope is recorded on the item and read by the resumed prompt, not by a later item
- `bots activity`, `bots inbox --json` and the seven activity groups - phase 001-activity-and-actor owns all three, and this phase extends the item and the inbox it reads [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:126]
- The status index's `items` row - it keeps ids and times and never the question or answer text, so the kind is read from the item file rather than stored twice [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:319]
- The two-role `operators.json` and the shared-host 0770 mode - phase 001 lands the actor field, and neither is needed to name an approval
- A team rule that closes a kind for everybody - the research puts the admin tier on the skip list, and there is no sign-in to govern [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:110]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/action-kind.ts` | Create | The six kinds, their word lists and `classifyAction` |
| `.skilled/skills/system-skilled-bots/runtime/lib/approval-ladder.ts` | Create | The four rungs in order, `decideApproval` and the scope rule |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Modify | `grants` on the item, its key and its validation, and the scope in the resumed prompt |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Classify the parked question and write the grant at the gate |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modify | Accept a scope, refuse a standing allow with no kind, write the scope |
| `.skilled/bin/bots.cjs` | Modify | `--scope` on `answer`, and the grant on the `inbox` line |
| `.skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` | Create | The ladder as a doc: four rungs, first answer wins, four answers |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | Modify | `--scope` on `bots answer` |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | Modify | The grant on the `bots inbox` line |
| `.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-items.md` | Modify | The `grants` field in the item contract |
| `.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/needs-you-answer.md` | Modify | The scope an answer records |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | Two module rows |
| `.skilled/skills/system-skilled-bots/runtime/tests/action-kind.vitest.ts` | Create | The six kinds, their order and the `other` fallback |
| `.skilled/skills/system-skilled-bots/runtime/tests/approval-ladder.vitest.ts` | Create | The four rungs, first answer wins, the scope rule |
| `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts` | Modify | The grant's validation, the null default and the resumed prompt |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Modify | The scope written and the standing-allow refusal |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modify | The grant written at the gate |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-run.vitest.ts` | Modify | `--scope` parsing and the inbox line |
| `THIRD_PARTY_NOTICES.md` | Create | The MIT notice for the lifted classifier, appended when 001 has already created the file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A needs-you item carries `grants`, holding `kind` (one of `pay`, `credentials`, `delete`, `send`, `share`, `post` or `other`), `action` (the question's first sentence, clipped to 120 characters), `rung` (one of `kind`, `rule`, `auto-review`, `extra-vigilant` or `bot`) and `scope` (`once`, `conversation`, `always`, `deny`, or `null` while the item is open) |
| REQ-002 | `classifyAction` reads an action's name and returns one of the six kinds or `other`, testing `pay`, `credentials`, `delete`, `send`, `share` and `post` in that order, so a payment that also sends reads as `pay` |
| REQ-003 | `decideApproval` walks kinds, then rules, then auto-review, then extra vigilant, and the first rung that says ask decides; a later rung never overrides an earlier one, and within rules the strictest matching rule wins |
| REQ-004 | The needs-you gate classifies the parked question and writes `grants` on the item, so every item written after this phase names what it approves and which rung made it ask |
| REQ-005 | `bots answer <item-id> <text> --scope once\|conversation\|always\|deny` records the scope on the item's grant, and an answer with no `--scope` records `once` |
| REQ-006 | A standing allow (`conversation` or `always`) on an item whose `grants.kind` is `other` is refused as `grant-kind-unknown`, because an allow reaches a kind of action only when it was given on that kind's card |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `bots inbox` prints each item's grant on the item's own line: its kind, its rung and its scope, with `-` for a scope not yet granted |
| REQ-008 | An item written before this phase reads with `grants: null` and still validates, so an existing inbox keeps listing |
| REQ-009 | `bots-run/references/approval-ladder.md` names the four rungs in OpenBot's order, the first-answer-wins rule, the strictest-rule rule within rung 2, and the four answers |
| REQ-010 | The lifted classifier carries an MIT notice in `THIRD_PARTY_NOTICES.md` naming `shared/tool-name.ts`, OpenBot's copyright line and the licence |
| REQ-011 | `buildResumedPrompt` names the granted scope when the item carries one, so a resumed run knows what the operator allowed |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A run parked on a question naming a delete writes an item whose `grants` reads `"kind":"delete"` and `"rung":"kind"`, and `bots inbox` prints `delete` on that item's line
- **SC-002**: `bots answer <item-id> yes --scope always` on a `delete` item records `"scope":"always"`, and the same command on an `other` item exits 2 with `bots: grant-kind-unknown`
- **SC-003**: One ladder test proves a kind beats a rule, a rule beats auto-review, and auto-review beats extra vigilant, in a single run
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The needs-you item's validator, which rejects an unknown key | A grant written by a newer runtime is refused by an older one | Add `grants` to `ITEM_KEYS` in the same commit as the field, and read a missing one as `null` |
| Dependency | The gate's decision marker, which carries free text | The classifier reads a question, not a tool name, so a vague question classifies as `other` | Treat `other` as a valid answer, and refuse only a standing allow on it |
| Risk | A question names two kinds, as a payment that also sends does | The wrong kind is recorded, so a standing allow attaches to the wrong action | Test the kinds in OpenBot's order, which puts `pay` first, and prove it with a two-kind case |
| Risk | The grant's `action` carries text the answer later repeats | A secret the operator typed reaches the grant | Clip `action` from the question only, never from the answer, and test that an answer's text never appears in the grant |
| Risk | A standing allow is recorded and no rule store reads it | An operator believes `always` took effect when only the resumed run sees it | Say so in the ladder doc and in the answer reference, and name the rules store as the next packet's work |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `classifyAction` over a 4,000-character question returns in under 1 ms, because it is a fixed word-list scan with no I/O
- **NFR-P02**: The gate adds no file read and no process: the classifier reads the question the runner already holds in `signal.question`

### Security
- **NFR-S01**: The grant stores the question's first sentence clipped to 120 characters and never the answer's text, so no secret the operator typed reaches the grant
- **NFR-S02**: A grant is a kind, a phrase, a rung and a scope, never a credential; no secret is read to fill it, and no secret value reaches the item

### Reliability
- **NFR-R01**: An item written before this phase reads with `grants: null` and still validates, so `bots inbox` and `bots status` keep listing it
- **NFR-R02**: A malformed grant refuses the item with `item-field-invalid: grants`, and the item is then reported as unreadable and holds its bot, the same as any other bad field
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a question with no words classifies as `other`, and the item still writes with `rung: "bot"`, because the bot asked and the ladder only names why
- Maximum input: a 4,000-character question is classified whole, and its `action` is clipped to the first sentence at 120 characters
- Failure path: `bots answer <item-id> yes --scope sometimes` exits 2 with `bots: --scope takes once, conversation, always or deny`
- Failure path: `bots answer <item-id> yes --scope always` on an item whose kind is `other` exits 2 with `bots: grant-kind-unknown: the item names no kind of action`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 19 files, about 300 lines, two new modules, one stored field and one CLI option |
| Risk | 6/25 | One stored field on a file the runtime already rewrites; no schema bump, no network, no auth |
| Research | 3/20 | The 002 packet names the lift, the six kinds and the four rungs; no new investigation |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does rung 2 need a rules store before a standing allow means anything? Decision: no. This phase records the scope and the resumed prompt reads it; a rules store is its own slice, and the research sizes this one as a doc plus one check.
- Is the bot's question the right place to read the action kind from? Decision: yes. It is the only text the gate holds, and a tool name would need the executor's tool surface, which the research puts out of scope.
- Should `bots inbox` print the grant on the item line or on a second line? Decision: the item line, so one `grep` finds every item of a kind.
<!-- /ANCHOR:questions -->

---
