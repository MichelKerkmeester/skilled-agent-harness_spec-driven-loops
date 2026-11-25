---
title: "Implementation Plan: Phase 6: approval-grants"
description: "Adds an action-kind classifier and a precedence-ladder module to the bots runtime, extends the needs-you item with a grants field written at the gate, records the answer's scope through bots answer --scope, and writes the ladder as a doc."
trigger_phrases:
  - "approval grants plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: approval-grants

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, run through `tsx` from a Node 22 CLI |
| **Framework** | None; the runtime is plain modules with a `Result<T>` return convention |
| **Storage** | JSON item files under the user-level state root; no index change |
| **Testing** | Vitest, in `.skilled/skills/system-skilled-bots/runtime/tests/` |

### Overview
Two new runtime modules carry the work: `action-kind.ts` holds OpenBot's six kinds and the word lists that recognize them, and `approval-ladder.ts` holds the four rungs in order, implements rung 1 and the `bot` fallback, and names rungs 2 to 4 as not implemented in this phase because no store supplies them. The needs-you item gains a `grants` field that the gate fills from the parked question, 001's `bots answer --scope once|deny` gains the grant record and a guarded write, and the ladder is written once as a doc the run mode reads. The proof is the runtime suite plus three CLI probes whose output the acceptance criteria name.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs answer item-1 yes --scope once` prints `bots: item-unknown: item-1`, because 001 lands the flag and this phase extends it
- [ ] `rg -c 'grants' .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` prints nothing and exits 1
- [ ] `ls .skilled/skills/system-skilled-bots/bots-run/references/` lists `run-queue-and-answer.md` and no ladder doc

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count
- [ ] `node .skilled/bin/bots.cjs inbox` prints a grant column on every item line and exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered runtime modules behind one CLI.

### Key Components
- **`action-kind.ts`**: owns the six kinds, their order and their word lists, and the one function that reads the whole question. It is the only place a kind is decided, so the gate and the ladder cannot disagree about what a delete is, and it takes a bot's own `[ACTION: <kind>]` line as a floor rather than an override: the recorded kind is the stricter of the declared and the classified one, so a declaration can raise a kind and never lower it.
- **`approval-ladder.ts`**: owns the four rungs, the first-answer-wins rule and the rule that a standing allow attaches to a kind. It implements rung 1 and the `bot` fallback and never returns rungs 2 to 4, which the ladder doc and the help text name as not implemented in this phase. It is a pure function, so the order is testable before any store supplies the inputs it does not read.
- **`needs-you.ts`**: owns the item's shape. It gains `grants`, its key and its validation, and the resumed prompt names the granted scope.
- **`runner.ts`**: owns the gate. It classifies the question it already holds and writes the grant on the item it already writes, and it fills the grant on the memory-proposal branch 005 lands, which writes no `grants` field of its own.
- **`routine-state.ts`**: 002's module, which raises the fatigue item. It gains the grant on that item, so the item is born naming its kind and its rung rather than with `grants: null`, and the question it writes is the text the classifier reads [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md:61].
- **`answer.ts`**: owns the answer. It records 001's scope and its actor on the grant, keeps 001's refusal of `always` and `conversation` as `grant-scope-unsupported`, derives `deny` from a NO so a refusal is never recorded as an approval, compares the answer's text and its scope as one identity, and guards the write with an exclusive lock file beside the item so a concurrent loser is refused `item-answered-differently`. The scope is written before the review seam 005 owns runs and before the resume request is built. 002 lands its no-resume option, so `bots enable`'s answer to the fatigue item takes the same write, and this phase fills the grant on that answer so it records the grant without queueing a resume [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:66]. The no-resume option also drops a resume still queued for that item, because a resume request keys on its item id and would otherwise dispatch the tenth failed run once `bots enable` clears the switch [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:143-160] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:167].
- **`bots.cjs`**: owns argument parsing, the inbox line and the inbox `--json` row. It gains one column and one key and no rule of its own; the `--scope` option is 001's, and 002 already routes `enable`'s fatigue answer through `answerItem` with the no-resume option instead of writing the item itself, so this phase adds the grant to that answer and no second write path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:66].

### Data Flow
A child prints `[NEEDS-DECISION] delete the stale branch?` → `runner.ts` reads the marker → `action-kind.ts` classifies the whole question as `delete` → `approval-ladder.ts` returns `{ asks: true, rung: 'kind' }` → the item is written with `grants: { kind: 'delete', action: 'delete the stale branch?', rung: 'kind', scope: null, grantedBy: null, grantedAt: null }`. The operator runs `bots answer <item> yes --scope deny` → `answer.ts` takes the lock beside the item, keeps 001's refusal of `always` and `conversation` as `grant-scope-unsupported`, rewrites the item with `scope: 'deny'`, `grantedBy` and `grantedAt`, and releases the lock → the resume request is queued → `buildResumedPrompt` names the scope → the resumed run's record carries one line naming the item, the kind, the scope and the actor → `bots inbox` prints `delete kind deny` on the item's line and the same object on its `--json` row. A NO with no `--scope` takes the same path and records `deny`, so a channel answer that passes no scope records a refusal rather than an approval. `bots enable` takes the same path with the no-resume option, so 002's fatigue item is answered with a grant and no resume is queued, and any resume an earlier answer queued for that item is dropped before the switch is cleared, so the tenth failed run is never dispatched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes a stored record shape and a CLI surface, so every producer and consumer of both is named here before implementation.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/needs-you.ts` | Owns `NeedsYouItem`, `ITEM_KEYS`, `validateNeedsYouItem` and `buildResumedPrompt` | update | `rg -n "grants" runtime/lib/needs-you.ts` prints the field, its key, its check and the resumed-prompt line |
| `runtime/lib/runner.ts` | Writes the item at the gate, and on the memory-proposal branch 005 lands | update | `rg -n "classifyAction\|decideApproval" runtime/lib/runner.ts` prints both calls, and `rg -n "memory-proposals" runtime/lib/runner.ts` prints the branch that fills the grant |
| `runtime/lib/routine-state.ts` | Raises the fatigue item 002 writes | update | `rg -n "classifyAction\|decideApproval" runtime/lib/routine-state.ts` prints both calls on the item it writes |
| `runtime/lib/answer.ts` | Rewrites the item with the answer | update | `rg -n -e scope -e grant-scope-unsupported -e lock -e "input.resume" -e "queueFolders" runtime/lib/answer.ts` prints the scope 001 passes, the standing-allow refusal, the NO that records `deny`, the identity check, the lock, the no-resume option, the queued resume it drops and the write |
| `runtime/lib/run-record.ts` | Records the run, its request join and its exit | update | `rg -n "grant" runtime/lib/run-record.ts` prints the optional grant line on the request join |
| `runtime/lib/status-index.ts` | Indexes the item's ids and times only | unchanged | `rg -n "grants" runtime/lib/status-index.ts` prints nothing |
| `runtime/lib/delivery.ts` | Reads the item's id and question for a notice | not a consumer | `rg -n "grants" runtime/lib/delivery.ts` prints nothing |
| `runtime/lib/status.ts` | Reads the index and formats `bots status` | not a consumer | `rg -n "grants" runtime/lib/status.ts` prints nothing |
| `bin/bots.cjs` | Parses verbs and options, prints the inbox line and its `--json` row | update | `node .skilled/bin/bots.cjs answer item-1 yes --scope once` prints `bots: item-unknown: item-1`, not `unknown option` |
| `bots-run` skill docs | Name the run verbs and their flags | update | `rg -n -- "--scope" .skilled/skills/system-skilled-bots/bots-run/references/` prints the option and the ladder doc |
| `bots-status` skill docs | Name the inbox verb and its `--json` row | update | `rg -n "grant" .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints the column |
| `feature-catalog/operator-loop` | Documents the item and the answer | update | `rg -n "grants\|--scope" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/` prints both |
| `crates/bots-tui/tests/fixtures/bots` | The fake CLI that serves every `--json` contract the screen reads | update | `rg -n "grants" crates/bots-tui/tests/fixtures/bots` prints the key on the `inbox --json` payload |

> **Authority:** the host is the authority. A terminal answer needs no roster to exist and an absent roster refuses nothing there, while a present roster is checked on either surface, so an actor who is neither `owner` nor a `members` entry is refused `answer-not-approver` on the terminal too, and a channel answer adds the `operators.json` roster 011 lands, which calls the same `answerItem` rather than a second write path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:206]. `bots enable`'s fatigue answer takes the same check, so a present roster that names neither the owner nor the OS user refuses it `answer-not-approver` and the item stays open, and the screen answers through `bots answer`, so the same refusal reaches it as that verb's exit code and its stderr in the status row while the item stays open [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:178]. A bot child writes the same state root only on an executor kind whose read-only posture is a tool or approval gate rather than an OS boundary — `cli-claude-code`, `cli-opencode`, `cli-devin`, `cli-pi` and `cli-mistral-vibe` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:42] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:62] — while `cli-codex`, `cli-cursor` and `cli-deepseek-harness` confine writes at the OS level, so a capped child on one of those cannot write the state root — and `cli-deepseek-harness` leaves OS temp writable — but it can still read it, and `native` honors no sandbox class at all [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:299-323]. The model is a boundary and not an authentication: `grantedBy` records the actor the answer claimed, and the roster is the one check that separates a person from a child.

Required inventories:
- Same-class producers: `rg -n 'writeNeedsYouItem' .skilled/skills/system-skilled-bots/runtime/lib/` names every place an item is written, which is the gate, the answer, the resume stamp, the memory-proposal branch 005 lands and the fatigue item 002 raises in `routine-state.ts`'s `evaluateFatigue`; each one must carry the grant forward rather than drop it, and the answer's write is the one that takes the lock. 002 raises that item and answers it through `answerItem`'s no-resume option, so this phase fills the grant on the item that writer creates and on that answer, which records the grant and queues no resume [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md:61] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md:81]. The no-resume option also drops a resume still queued for that item, so a resume an earlier answer queued cannot dispatch the tenth failed run after `bots enable` clears the switch [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:167]. 005 writes no `grants` field, so this phase fills the grant on the branch it lands. A writer a later phase adds fills the field with this phase's `classifyAction` and `decideApproval` rather than writing `null`.
- Consumers of changed symbols: `rg -n 'NeedsYouItem|ITEM_KEYS|buildResumedPrompt' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader of the item's shape.
- Matrix axes: kind (7: `pay`, `credentials`, `delete`, `send`, `share`, `post`, `other`) × scope (3: `once`, `deny`, `null`) = 21 rows, and `approval-ladder.vitest.ts` covers the 21 as a table, with 001's `grant-scope-unsupported` refusal asserted on the `always` and `conversation` inputs.
- Algorithm invariant: a standing allow attaches to a kind and never to a phrase, and no standing allow is recorded in this phase. `decideApproval` returns rung 1 or the `bot` fallback, `classifyAction` returns the strictest kind anywhere in the question, `[ACTION: <kind>]` is a floor rather than an override, and `answer.ts` keeps 001's refusal of `conversation` and `always` as `grant-scope-unsupported` before the kind is read. Adversarial cases: an empty question, a question naming two kinds, a question naming a kind only in a quoted example, a benign first sentence followed by a delete, an `[ACTION: other]` line on a question that names a delete, an `[ACTION: <kind>]` line naming a kind outside the six, a grant whose `kind` is not one of the seven, a grant whose `scope` is not one of the three, a NO with no `--scope`, and two answers that both read `open`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `needs-you.ts`, `runner.ts`, `answer.ts`, `run-record.ts` and `bots.cjs` and records the item's key list, the gate's write, the answer's rewrite, the record's request join and the inbox line. Implementation adds `action-kind.ts` and `approval-ladder.ts`, the `grants` field, the gate's classification and its `[ACTION: <kind>]` floor, the grant on 001's `--scope once|deny`, the standing-allow refusal, the NO that records `deny`, the answer identity, the guarded write, the grant on the fatigue item `routine-state.ts` writes and on its answer through `answerItem`'s no-resume option, the queued resume that option drops, the grant on the memory-proposal branch 005 lands, the grant line on the resumed record, and the grant on the inbox line and its `--json` row. Verification runs the runtime suite, the CLI probes, the fatigue answer's grant with no resume queued, the resume an answer from another surface queues and the drop that stops it dispatching the tenth failed run, the inbox line and row on a temporary state root, the ladder doc's four rungs with rungs 2 to 4 marked not implemented, the fixture payload and the notices check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `classifyAction` over the six kinds and `other` including a benign first sentence and an `[ACTION: <kind>]` floor, `decideApproval` over rung 1 and the `bot` fallback, `validateNeedsYouItem` with a grant, `buildResumedPrompt` with a scope | Vitest |
| Integration | The gate writing a grant from a parked question, the memory-proposal branch filling one, `bots enable`'s fatigue answer recording a grant with no resume queued, an answer to that same item from `bots answer` queueing a resume the runner refuses `routine-fatigued`, that queued resume dropped when `bots enable` runs before the next drain, 001's `--scope` through the item file, the standing-allow refusal, the NO that records `deny`, the answer identity, two concurrent answers against one item, the grant line on the resumed record, the inbox line and its `--json` row | Vitest with a temporary state root |
| Manual | `bots inbox` and `bots inbox --json` against a temporary state root seeded with one item, and `bots answer --scope` against a scratch item | The `bots` CLI |

The one command that decides the phase is `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run`, which must print no `failed` line, followed by `node .skilled/bin/bots.cjs inbox`, which must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `tsx` | External | Green | The CLI cannot load a `.ts` runtime module; `bots.cjs` already registers it |
| `vitest` | External | Green | No test runs; the runtime's `package.json` already declares it |
| OpenBot's `shared/tool-name.ts` | External | Green | The classifier's word lists must be written from `docs/approvals.md` alone; the notice entry is then dropped |
| Phase 001-activity-and-actor | Internal | Green | `bots answer --scope once|deny`, `bots answer --as`, `bots inbox --json` and `bots inbox --json --all` are 001's; this phase extends the scope with the grant and the ladder, fills `grantedBy` from `--as`, and adds the grant to the row 001 prints [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:81] |
| Phase 002-routine-layer | Internal | Green | 002 raises the fatigue item in `routine-state.ts`'s `evaluateFatigue` and answers it from `bots enable` through `answerItem`'s no-resume option, so this phase fills the grant on the item that writer creates and on that answer [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md:61] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/tasks.md:81] |
| Phase 005-memory | Internal | Green | 005 lands the memory-proposal branch in `runner.ts` and writes no `grants` field, so this phase fills the grant on that branch; an item 005 writes reads with `grants: null` until then [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/tasks.md:63] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `bots inbox` refuses an item written before this phase, or `bots answer` refuses an item whose grant it cannot read.
- **Procedure**: Revert the one commit. An item carrying `grants` then reads as an unknown key and is reported as unreadable, which holds its bot, so the revert also needs the item files written after this phase removed or their `grants` key stripped; `bots inbox` names each one it cannot read, so the list is the command's own output.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing; it only reads | Implementation |
| Implementation | Setup's recorded key list, gate write and inbox line | Verification |
| Verification | Implementation's modules, field and CLI option | The phase handoff to 007-per-bot-apps |
<!-- /ANCHOR:phase-deps -->

---
