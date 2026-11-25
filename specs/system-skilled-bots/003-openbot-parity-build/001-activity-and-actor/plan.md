---
title: "Implementation Plan: Phase 1: activity-and-actor"
description: "Adds a grouping module and an actor resolver to the bots runtime, extends the needs-you item and the run record with a by: field, records the answer's scope, carries the actor inside the status index run summary, and exposes bots activity, bots activity --json, bots inbox --json and bots answer --scope once|deny through the CLI."
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
Two new runtime modules carry the work: `activity.ts` holds the seven group ids and the rule that puts an index row in one of them, and `actor.ts` resolves a name from `--as`, the OS user or the operator pinned in a job's environment. The needs-you item gains `by` and `scope` on its answer and `kind` in its key list, the run record gains `actor` and `answeredBy`, the status index gains `actor` inside the run summary JSON without moving `SCHEMA_VERSION` or the DDL, `posture.ts` caps a declared sandbox at `workspace-write`, and `bots.cjs` gains the `activity` verb, `--json` and `--all` on `inbox`, `--as` on `answer` and `run`, `--scope once|deny` on `answer`, and the tty refusal. The proof is the runtime suite plus three CLI probes whose output the acceptance criteria name.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs activity` prints `bots: unknown verb: activity` and exits 2
- [ ] `node .skilled/bin/bots.cjs inbox --json` prints `bots: inbox takes no --json` and exits 2
- [ ] `node .skilled/bin/bots.cjs answer item-1 yes --scope once` prints `bots: unknown option: --scope` and exits 2
- [ ] `rg -n 'SCHEMA_VERSION' .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints three lines: the constant, the reader and the writer, and the constant reads `'2'`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints `Test Files` with no `failed` line
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0
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
- **`status-index.ts`**: owns the index schema. It gains `actor` as a nullable field inside the `summary` JSON, the way `RunSummary` carries its fields, and neither `SCHEMA_VERSION` nor the DDL moves, so the activity read needs no second pass over run records and an index built before this phase still opens and still accepts a write.
- **`posture.ts`**: owns the sandbox cap. A definition's declared sandbox is capped at `workspace-write`, and `danger-full-access` is honored only when the operator installed the bot with full access, so a definition cannot grant itself full access.
- **`bots.cjs`**: owns argument parsing, the exit codes and the tty refusal. It gains one verb and four options and no grouping or naming rule of its own. Its JSON inbox keeps the text form's open-and-expired filter, and `--all` adds the answered items, so the readback that shows who answered an item needs no second reader of the item file.

`actor` is a nullable top-level field on the run record, `schemaVersion` stays 1, and `actor.vitest.ts` asserts a record written before this phase still validates. `answeredBy` is the second nullable field, filled when an answer resumes the run, so a run requested by one person and approved by another carries both names. `scope` is a field on the answer, `once` or `deny`, and `answerItem` takes both the actor and the scope as arguments, so a channel daemon or a test passes them with no tty; the tty refusal is `bots.cjs`'s alone.

### Data Flow
`bots answer --as ada --scope deny` → `bots.cjs` refuses `--as` outside a tty unless it matches the OS user, then `actor.ts` resolves `ada` → `answer.ts` writes `by: "ada"` and `scope: "deny"` on the item's answer and stamps `answeredBy: "ada"` on the run record the item names → `bots inbox --json --all` prints that item's row with the `by` and the `scope`, because the default form leaves the answered ones out. A channel daemon or a test skips the CLI and calls `answerItem` with the actor and the scope it already holds, so no tty is needed. A run dispatches → `runner.ts` asks `actor.ts` for the actor, which reads the pinned operator from the job environment when the run is scheduled and the OS user otherwise → the record carries `actor` → `status-index.ts` writes it into the row's `summary` JSON → `bots activity` groups the row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a field inside a persisted index row's `summary` JSON, a field to the answer and two fields to a stored record, so every producer and consumer of all of them is named here before implementation.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/status-index.ts` | Owns the index schema, `SCHEMA_VERSION` and `RunRow` | update | `rg -n "SCHEMA_VERSION = " runtime/lib/status-index.ts` prints `'2'`, `rg -n "actor" runtime/lib/status-index.ts` prints the summary field and the read, and `rg -n "ALTER TABLE\|ADD COLUMN" runtime/lib/status-index.ts` prints nothing |
| `runtime/lib/run-record.ts` | Owns `RunRecord` and `validateRunRecord` | update | `rg -n "actor\|answeredBy" runtime/lib/run-record.ts` prints both fields, their checks and their null defaults |
| `runtime/lib/needs-you.ts` | Owns `NeedsYouItem`, `NeedsYouAnswer` and `ITEM_KEYS` | update | `rg -n "'by'\|'kind'\|'scope'" runtime/lib/needs-you.ts` prints all three keys and the checks for `by` and `scope`, and `rg -n "memory-proposal\|skill-proposal" runtime/lib/needs-you.ts` prints nothing because 005 owns `kind`'s values |
| `runtime/lib/answer.ts` | Writes the answer onto the item | update | `rg -n "actor\|answeredBy\|scope" runtime/lib/answer.ts` prints the input fields, the write and the record stamp |
| `runtime/lib/posture.ts` | Owns `validatePosture` and the sandbox values | update | `rg -n "workspace-write\|fullAccess" runtime/lib/posture.ts` prints the cap and the install-time flag |
| `runtime/lib/runner.ts` | Writes the run record at dispatch | update | `rg -n "actor" runtime/lib/runner.ts` prints the fill |
| `runtime/lib/plist-render.ts` | Renders and reads back the job environment | update | `rg -n "OPERATOR\|FULL_ACCESS" runtime/lib/plist-render.ts` prints the render and the read-back of both pinned values |
| `runtime/lib/installer.ts` | Builds `PinnedJobValues` for a job | update | `rg -n "operator\|fullAccess" runtime/lib/installer.ts` prints both pinned values |
| `runtime/lib/status.ts` | Reads the index and formats `bots status` | unchanged | `rg -n "actor" runtime/lib/status.ts` prints nothing; status shows no actor |
| `runtime/lib/state-root.ts` | Owns the state root and its 0700 mode | not a consumer | `rg -n "actor" runtime/lib/state-root.ts` prints nothing |
| `bin/bots.cjs` | Parses verbs and options, maps exit codes, holds the tty and scope refusals | update | `node .skilled/bin/bots.cjs activity` exits 0, `node .skilled/bin/bots.cjs answer item-1 yes --as "$(whoami)"` prints `bots: item-unknown: item-1` with no tty, `node .skilled/bin/bots.cjs answer item-1 yes --as ada < /dev/null` prints `bots: --as needs a tty`, and `rg -n "inbox.*--all" .skilled/bin/bots.cjs` prints the inbox usage line |
| `crates/bots-tui/tests/fixtures/bots` | The screen's fake CLI, the copy of every `--json` contract it reads | not this phase's | `test ! -e crates/bots-tui/tests/fixtures/bots && echo absent` prints `absent`; 003 creates the fixture and this phase asserts its payloads through `bots ... --json` instead |
| `bots-status` skill docs | Name the status verbs | update | `rg -n "bots activity" .skilled/skills/system-skilled-bots/bots-status/` prints the verb |
| `bots-run` skill docs | Name the run verbs | update | `rg -n -- "--as\|--scope" .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` prints both options |

Required inventories:
- Same-class producers: `rg -n 'answeredAt|answer:' .skilled/skills/system-skilled-bots/runtime/lib/` names every place an answer is written; `rg -n 'writeRunRecord' .skilled/skills/system-skilled-bots/runtime/lib/` names every place a record is written.
- Consumers of changed symbols: `rg -n 'NeedsYouAnswer|RunRecord|RunRow|SCHEMA_VERSION|validatePosture' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every reader.
- Matrix axes: actor source (3: `--as`, OS user, pinned operator) × run kind (2: interactive, scheduled) × record age (2: written now, written before this phase) = 12 rows, and `actor.vitest.ts` covers all 12. Scope axis: `--scope` (3: `once`, `deny`, absent) × answer path (2: `bots.cjs`, `answerItem` called directly) = 6 rows, and `answer.vitest.ts` covers all 6.
- Algorithm invariant: the actor is a name and never a path. `--as` is validated against `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$` before it is stored, and no filesystem call takes it. Adversarial cases: an empty value, a value holding `/`, a value holding `..`, a value over 64 characters, and a value holding a newline.
- Algorithm invariant: a missing scope is never an allow. `answerItem` writes `once` when no scope is passed, and `bots.cjs` refuses a value outside `once|deny` before the item is read, so no answer records an empty scope. Adversarial cases: `--scope ''`, `--scope always`, `--scope conversation`, `--scope ONCE`, and a scope passed with no `--as`.
- Algorithm invariant: a declared sandbox is a request, not a grant. `validatePosture` caps it at `workspace-write` and honors `danger-full-access` only when the job's pinned full-access flag is set, so the cap is read from the install and never from the definition. Adversarial cases: a definition declaring `danger-full-access` on a bot installed without the flag, and a definition declaring it on a bot installed with it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `status-index.ts`, `run-record.ts`, `needs-you.ts`, `posture.ts` and `bots.cjs` and records the current schema version, the record shape, the sandbox values and the verb list. Implementation adds `activity.ts` and `actor.ts`, the `by`, `scope`, `kind`, `actor` and `answeredBy` fields, the index summary field, the sandbox cap and the CLI surfaces. Verification runs the runtime suite, the typecheck, the CLI probes and the notices check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `activity.ts` grouping and order, `actor.ts` precedence and pattern, `validateNeedsYouItem`, `validateRunRecord`, `validatePosture`'s sandbox cap, the answer's `scope` default and refusal | Vitest |
| Integration | `bots answer --as` and `--scope` through the item file, `answerItem` called with an explicit actor and no tty, the answered item `bots inbox --json --all` prints, `bots activity` over a built index, a write into an index built by the old DDL, a scheduled run's pinned operator, a `danger-full-access` definition on a bot installed without the flag | Vitest with a temporary state root |
| Manual | `bots activity`, `bots activity --json`, `bots inbox --json` and `bots answer --scope deny` against the live state root | The `bots` CLI |

The one command that decides the phase is `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run`, which must print no `failed` line, followed by `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck`, which must exit 0, and `node .skilled/bin/bots.cjs activity`, which must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` | External | Green | The index cannot open, so `bots activity` has no rows; the module already loads it through `loadBinding` |
| `tsx` | External | Green | The CLI cannot load a `.ts` runtime module; `bots.cjs` already registers it |
| `vitest` | External | Green | No test runs; the runtime's `package.json` already declares it |
| OpenBot's two MIT files | External | Green | The rule is written from the research and the notice entry is still written, naming the two files as the source of the rule |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `bots activity` misgroups a row, or a run record written before this phase is refused by `bots status --rebuild`.
- **Procedure**: Revert the one commit. `actor`, `answeredBy` and `scope` are additive, so an older reader ignores them; `SCHEMA_VERSION` stays `'2'` and the DDL does not change, so an index built before this phase still opens and still accepts a write, and no stored file needs a manual edit.
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
