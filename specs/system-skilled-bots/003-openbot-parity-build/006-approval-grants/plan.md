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
Two new runtime modules carry the work: `action-kind.ts` holds OpenBot's six kinds and the word lists that recognize them, and `approval-ladder.ts` holds the four rungs in order and the rule that a standing allow attaches to a kind. The needs-you item gains a `grants` field that the gate fills from the parked question, `bots answer` gains `--scope`, and the ladder is written once as a doc the run mode reads. The proof is the runtime suite plus three CLI probes whose output the acceptance criteria name.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs answer item-1 yes --scope once` prints `bots: unknown option: --scope` and exits 2
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
- **`action-kind.ts`**: owns the six kinds, their order and their word lists, and the one function that reads an action's name. It is the only place a kind is decided, so the gate and the ladder cannot disagree about what a delete is.
- **`approval-ladder.ts`**: owns the four rungs, the first-answer-wins rule and the rule that a standing allow attaches to a kind. It is a pure function over four inputs, so the order is testable before any store supplies them.
- **`needs-you.ts`**: owns the item's shape. It gains `grants`, its key and its validation, and the resumed prompt names the granted scope.
- **`runner.ts`**: owns the gate. It classifies the question it already holds and writes the grant on the item it already writes.
- **`answer.ts`**: owns the answer. It records the scope and refuses a standing allow on an item that names no kind.
- **`bots.cjs`**: owns argument parsing and the inbox line. It gains one option and one column and no rule of its own.

### Data Flow
A child prints `[NEEDS-DECISION] delete the stale branch?` → `runner.ts` reads the marker → `action-kind.ts` classifies the question as `delete` → `approval-ladder.ts` returns `{ asks: true, rung: 'kind' }` → the item is written with `grants: { kind: 'delete', action: 'delete the stale branch?', rung: 'kind', scope: null }`. The operator runs `bots answer <item> yes --scope always` → `answer.ts` checks that a standing allow names a kind → the item is rewritten with `scope: 'always'` → the resume request is queued → `buildResumedPrompt` names the scope → `bots inbox` prints `delete kind always` on the item's line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes a stored record shape and a CLI surface, so every producer and consumer of both is named here before implementation.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/needs-you.ts` | Owns `NeedsYouItem`, `ITEM_KEYS`, `validateNeedsYouItem` and `buildResumedPrompt` | update | `rg -n "grants" runtime/lib/needs-you.ts` prints the field, its key, its check and the resumed-prompt line |
| `runtime/lib/runner.ts` | Writes the item at the gate | update | `rg -n "classifyAction\|decideApproval" runtime/lib/runner.ts` prints both calls |
| `runtime/lib/answer.ts` | Rewrites the item with the answer | update | `rg -n "scope" runtime/lib/answer.ts` prints the input field, the refusal and the write |
| `runtime/lib/status-index.ts` | Indexes the item's ids and times only | unchanged | `rg -n "grants" runtime/lib/status-index.ts` prints nothing |
| `runtime/lib/delivery.ts` | Reads the item's id and question for a notice | not a consumer | `rg -n "grants" runtime/lib/delivery.ts` prints nothing |
| `runtime/lib/status.ts` | Reads the index and formats `bots status` | not a consumer | `rg -n "grants" runtime/lib/status.ts` prints nothing |
| `bin/bots.cjs` | Parses verbs and options, prints the inbox | update | `node .skilled/bin/bots.cjs answer item-1 yes --scope once` prints `bots: item-unknown: item-1`, not `unknown option` |
| `bots-run` skill docs | Name the run verbs and their flags | update | `rg -n -- "--scope" .skilled/skills/system-skilled-bots/bots-run/references/` prints the option and the ladder doc |
| `bots-status` skill docs | Name the inbox verb | update | `rg -n "grant" .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints the column |
| `feature-catalog/operator-loop` | Documents the item and the answer | update | `rg -n "grants\|--scope" .skilled/skills/system-skilled-bots/feature-catalog/operator-loop/` prints both |

Required inventories:
- Same-class producers: `rg -n 'writeNeedsYouItem' .skilled/skills/system-skilled-bots/runtime/lib/` names every place an item is written, which is the gate, the answer and the resume stamp; each one must carry the grant forward rather than drop it.
- Consumers of changed symbols: `rg -n 'NeedsYouItem|ITEM_KEYS|buildResumedPrompt' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader of the item's shape.
- Matrix axes: kind (7: `pay`, `credentials`, `delete`, `send`, `share`, `post`, `other`) × scope (5: `once`, `conversation`, `always`, `deny`, `null`) = 35 rows, and `approval-ladder.vitest.ts` covers the 35 as a table, with the standing-allow refusal asserted on the `other` row.
- Algorithm invariant: a standing allow attaches to a kind and never to a phrase. `decideApproval` returns the rung, `classifyAction` returns the kind, and `answer.ts` refuses `conversation` or `always` when the kind is `other`. Adversarial cases: an empty question, a question naming two kinds, a question naming a kind only in a quoted example, a grant whose `kind` is not one of the seven, and a grant whose `scope` is not one of the five.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `needs-you.ts`, `runner.ts`, `answer.ts` and `bots.cjs` and records the item's key list, the gate's write, the answer's rewrite and the inbox line. Implementation adds `action-kind.ts` and `approval-ladder.ts`, the `grants` field, the gate's classification, `--scope` on `answer` and the grant on the inbox line. Verification runs the runtime suite, the three CLI probes, the ladder doc's four rungs and the notices check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `classifyAction` over the six kinds and `other`, `decideApproval` over the four rungs, `validateNeedsYouItem` with a grant, `buildResumedPrompt` with a scope | Vitest |
| Integration | The gate writing a grant from a parked question, `bots answer --scope` through the item file, the standing-allow refusal, the inbox line | Vitest with a temporary state root |
| Manual | `bots inbox` against the live state root, and `bots answer --scope` against a scratch item | The `bots` CLI |

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
| Phase 001-activity-and-actor | Internal | Yellow | `bots inbox --json` and the activity groups are 001's; this phase prints the grant on the text inbox line and needs nothing from 001 to do it |
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
