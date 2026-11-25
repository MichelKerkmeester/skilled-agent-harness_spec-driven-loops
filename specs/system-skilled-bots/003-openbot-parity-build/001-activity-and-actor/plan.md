---
title: "Implementation Plan: Phase 1: activity-and-actor"
description: "Adds a grouping module and an actor resolver to the bots runtime, extends the needs-you item and the run record with a by: field, carries it on the status index, and exposes bots activity, bots activity --json and bots inbox --json through the CLI."
trigger_phrases:
  - "activity and actor plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: activity-and-actor

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, run through `tsx` from a Node 22 CLI |
| **Framework** | None; the runtime is plain modules with a `Result<T>` return convention |
| **Storage** | SQLite through `better-sqlite3` for the status index, and JSON files under the user-level state root |
| **Testing** | Vitest, in `.skilled/skills/system-skilled-bots/runtime/tests/` |

### Overview
Two new runtime modules carry the work: `activity.ts` holds the seven group ids and the rule that puts an index row in one of them, and `actor.ts` resolves a name from `--as`, the OS user or the operator pinned in a job's environment. The needs-you item and the run record each gain a `by` field, the status index gains an `actor` column, and `bots.cjs` gains the `activity` verb, `--json` on `inbox` and `--as` on `answer` and `run`. The proof is the runtime suite plus three CLI probes whose output the acceptance criteria name.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs activity` prints `bots: unknown verb: activity` and exits 2
- [ ] `node .skilled/bin/bots.cjs inbox --json` prints `bots: inbox takes no --json` and exits 2
- [ ] `rg -n 'SCHEMA_VERSION' .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line reading `'2'`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints `Test Files` with no `failed` line
- [ ] `node .skilled/bin/bots.cjs activity` prints at least one group heading and exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered runtime modules behind one CLI.

### Key Components
- **`activity.ts`**: owns the seven group ids, their order and titles, and the rule that maps one index row to one group. It is the only place the grouping rule lives, so the text and JSON forms cannot disagree.
- **`actor.ts`**: owns the precedence `--as` then the pinned operator then the OS user, and the name pattern. It is the only place a name is validated, so no caller can write an unvalidated one.
- **`status-index.ts`**: owns the index schema. It gains the `actor` column and a `SCHEMA_VERSION` bump, so the activity read needs no second pass over run records.
- **`bots.cjs`**: owns argument parsing and the exit codes. It gains one verb and two options and no rule of its own.

### Data Flow
`bots answer --as ada` → `actor.ts` resolves `ada` → `answer.ts` writes `by: "ada"` on the item's answer → `bots inbox --json` prints it. A run dispatches → `runner.ts` asks `actor.ts` for the actor, which reads the pinned operator from the job environment when the run is scheduled and the OS user otherwise → the record carries `actor` → `status-index.ts` indexes it → `bots activity` groups the row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes a persisted schema and a stored record shape, so every producer and consumer of both is named here before implementation.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/status-index.ts` | Owns the index schema, `SCHEMA_VERSION` and `RunRow` | update | `rg -n "SCHEMA_VERSION = " runtime/lib/status-index.ts` prints `'3'` |
| `runtime/lib/run-record.ts` | Owns `RunRecord` and `validateRunRecord` | update | `rg -n "actor" runtime/lib/run-record.ts` prints the field, its check and its null default |
| `runtime/lib/needs-you.ts` | Owns `NeedsYouItem`, `NeedsYouAnswer` and `ITEM_KEYS` | update | `rg -n "'by'" runtime/lib/needs-you.ts` prints the key and its check |
| `runtime/lib/answer.ts` | Writes the answer onto the item | update | `rg -n "actor" runtime/lib/answer.ts` prints the input field and the write |
| `runtime/lib/runner.ts` | Writes the run record at dispatch | update | `rg -n "actor" runtime/lib/runner.ts` prints the fill |
| `runtime/lib/plist-render.ts` | Renders and reads back the job environment | update | `rg -n "OPERATOR" runtime/lib/plist-render.ts` prints the render and the read-back |
| `runtime/lib/installer.ts` | Builds `PinnedJobValues` for a job | update | `rg -n "operator" runtime/lib/installer.ts` prints the pinned value |
| `runtime/lib/status.ts` | Reads the index and formats `bots status` | unchanged | `rg -n "actor" runtime/lib/status.ts` prints nothing; status shows no actor |
| `runtime/lib/state-root.ts` | Owns the state root and its 0700 mode | not a consumer | `rg -n "actor" runtime/lib/state-root.ts` prints nothing |
| `bin/bots.cjs` | Parses verbs and options, maps exit codes | update | `node .skilled/bin/bots.cjs activity` exits 0 |
| `bots-status` skill docs | Name the status verbs | update | `rg -n "bots activity" .skilled/skills/system-skilled-bots/bots-status/` prints the verb |
| `bots-run` skill docs | Name the run verbs | update | `rg -n -- "--as" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints the option |

Required inventories:
- Same-class producers: `rg -n 'answeredAt|answer:' .skilled/skills/system-skilled-bots/runtime/lib/` names every place an answer is written; `rg -n 'writeRunRecord' .skilled/skills/system-skilled-bots/runtime/lib/` names every place a record is written.
- Consumers of changed symbols: `rg -n 'NeedsYouAnswer|RunRecord|RunRow|SCHEMA_VERSION' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader.
- Matrix axes: actor source (3: `--as`, OS user, pinned operator) × run kind (2: interactive, scheduled) × record age (2: written now, written before this phase) = 12 rows, and `actor.vitest.ts` covers all 12.
- Algorithm invariant: the actor is a name and never a path. `--as` is validated against `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$` before it is stored, and no filesystem call takes it. Adversarial cases: an empty value, a value holding `/`, a value holding `..`, a value over 64 characters, and a value holding a newline.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `status-index.ts`, `run-record.ts`, `needs-you.ts` and `bots.cjs` and records the current schema version, the record shape and the verb list. Implementation adds `activity.ts` and `actor.ts`, the `by` and `actor` fields, the index column and the three CLI surfaces. Verification runs the runtime suite, the three CLI probes and the notices check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `activity.ts` grouping and order, `actor.ts` precedence and pattern, `validateNeedsYouItem`, `validateRunRecord` | Vitest |
| Integration | `bots answer --as` through the item file, `bots activity` over a built index, a scheduled run's pinned operator | Vitest with a temporary state root |
| Manual | `bots activity`, `bots activity --json`, `bots inbox --json` against the live state root | The `bots` CLI |

The one command that decides the phase is `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run`, which must print no `failed` line, followed by `node .skilled/bin/bots.cjs activity`, which must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` | External | Green | The index cannot open, so `bots activity` has no rows; the module already loads it through `loadBinding` |
| `tsx` | External | Green | The CLI cannot load a `.ts` runtime module; `bots.cjs` already registers it |
| `vitest` | External | Green | No test runs; the runtime's `package.json` already declares it |
| OpenBot's two MIT files | External | Green | The grouping rule must be written from the research instead of lifted; the notice entry is then dropped |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `bots status` fails on an index built before this phase, or a run record written before this phase is refused by `bots status --rebuild`.
- **Procedure**: Revert the one commit. The index rebuilds itself from run records on the next open, so no stored file needs a manual edit; a record carrying `actor` reads as an unknown key only if the revert lands after a run wrote one, and `bots status --rebuild` then skips that record and names it.
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
| Implementation | Setup's recorded schema version and verb list | Verification |
| Verification | Implementation's modules and CLI surfaces | The phase handoff to 002-routine-layer |
<!-- /ANCHOR:phase-deps -->

---
