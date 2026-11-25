---
title: "Implementation Plan: Phase 4: computer-exposure"
description: "One working-place line in `buildBotPrompt`, `evidence.branch` filled for every dispatched run, and two appended parts on a `bots status` row, across five runtime modules with no new file, dependency or index schema change."
trigger_phrases:
  - "computer exposure plan"
  - "bot working place plan"
  - "worktree in bots status plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: computer-exposure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, ESM, Node 22 or later, run through the runtime's own `tsx` |
| **Framework** | None. Five flat modules under `runtime/lib/`, one concern per file |
| **Storage** | The run record JSON under the state root, and the SQLite status index whose run summary is a JSON column |
| **Testing** | `vitest` through `npm --prefix .skilled/skills/system-skilled-bots/runtime test`, plus `tsc --noEmit` through `run typecheck` |

### Overview
The change is one line in a prompt, one field filled on a path that already exists, and two parts appended to a status row. `dispatch.ts` gains `workingPlaceLine` beside the `checkoutLine` it already has, and `buildBotPrompt` gains a `workingPlace` input that carries the directory, the branch and the run folder. `runner.ts` passes the `workDir` it already computes and the branch it already knows for a worktree run, and reads the checkout's branch once through a new `checkoutBranch` in `isolation.ts` for a shared run. `status-index.ts` adds the two fields to `RunSummary`, which rides in a JSON column, so no schema version moves. `status.ts` adds them to `LastRun` and appends them to the row. The proof is the runtime suite: a worktree run's prompt names its tree, a shared run's record carries the checkout branch, and a status row prints both.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs status` prints a row with no `branch` part, the measured gap this phase closes
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` passes before the first edit, so a later failure is this phase's
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0 before the first edit

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints no `failed`
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0
- [ ] `node .skilled/bin/bots.cjs status` exits 0 against the index built before the change, without `--rebuild`
- [ ] `rg -n "SCHEMA_VERSION = '2'" .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One line builder, one record field, one appended row part.

### Key Components
- **`dispatch.ts`**: owns the prompt. `workingPlaceLine` sits beside `checkoutLine`, and `buildBotPrompt` takes the working place as an input rather than reading the filesystem, so the prompt stays a pure function of what the runner resolved. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:301-332]
- **`isolation.ts`**: owns every git read about where a run works. `checkoutBranch` is the one read of a checkout's branch, and it returns null rather than a refusal, because a null branch is a legal record value. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:3-30]
- **`runner.ts`**: owns the order. It already computes `workDir` as the tree or the checkout, so the line and the child's `cwd` read one value. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1038]
- **`status-index.ts`**: owns the run summary. The summary is a JSON column, so a field costs no migration and no schema version. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:266-292]
- **`status.ts`**: owns the row. `LastRun` gains the two fields and `formatStatus` appends two parts after every part it already prints. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:479-486]

### Data Flow
The runner resolves the posture, makes or reopens a tree, and sets `workDir` to the tree or the checkout. It resolves the branch: the tree's branch when there is a tree, else `checkoutBranch(checkoutRoot, env)`. It writes both into `seed.evidence` and passes them to `buildBotPrompt`, which emits the working-place line above the bot body. The record is written, the index reads it through `summarizeRecord`, and `bots status` reads the index and appends `branch <name>` and `worktree <path>` to the row. A resumed run reuses the parked prompt, so the runner checks for the line by exact text and adds it when the parked prompt predates this phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `dispatch.ts` | Builds the prompt and the filtered environment | update - `workingPlaceLine` and the `workingPlace` input | `rg -n 'workingPlaceLine' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` prints the definition and its one call site |
| `isolation.ts` | Creates, reopens, inspects and removes a bot tree | update - `checkoutBranch` | `rg -n 'export function checkoutBranch' .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts` prints one line |
| `runner.ts` | Runs one bot in a fixed order | update - pass the working place, fill `evidence.branch`, add the line to a resumed prompt | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner` prints no `failed` |
| `status-index.ts` | Builds and reads the SQLite index | update - two `RunSummary` fields | `rg -n "SCHEMA_VERSION = '2'" .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line |
| `status.ts` | Builds the report and formats the row | update - two `LastRun` fields and two appended parts | `node .skilled/bin/bots.cjs status` prints `branch <name>` on a row whose last run recorded one |
| `bots.cjs` | Owns the verb set and the usage text | not a consumer - it calls `formatStatus` and prints the report as JSON | `rg -n 'formatStatus' .skilled/bin/bots.cjs` prints one line and no new verb |
| `run-record.ts` | Validates and writes the record | unchanged - `evidence.branch` already exists and is already nullable | `rg -n 'branch: string \| null' .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` prints one line |
| `posture.ts` | Decides whether a run gets a tree | not a consumer - it answers isolation and this phase reads the answer | `rg -n 'resolveIsolation' .skilled/skills/system-skilled-bots/runtime/lib/posture.ts` prints one line |
| `needs-you.ts` | Parks a run and builds the resumed prompt | not a consumer - the resumed prompt is the parked one, and the runner adds the line | `rg -n 'buildResumedPrompt' .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` prints one line |
| `.opencode/skills`, `.opencode/bin` | Relative symlinks to `.skilled/` | not a consumer - one edit reaches both paths | `readlink .opencode/skills` prints `../.skilled/skills` |

Required inventories:
- Same-class producers: `rg -n 'evidence\.branch|evidence\.worktreePath' .skilled/skills/system-skilled-bots/runtime/lib` lists every writer and reader of the two fields, so a new writer cannot be added without seeing the others.
- Consumers of changed symbols: `rg -n 'buildBotPrompt|formatStatus|summarizeRecord|LastRun|RunSummary' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every caller and every test that reads the shape.
- Matrix axes: two isolation answers (`worktree`, `shared`) by three branch answers (a branch, a detached HEAD, a git read that fails), plus the resumed prompt in two states (carries the line, does not) and the index in two states (built before, built after).
- Algorithm invariant: the line names the directory the child starts in. `workDir` is the only value that decides it, so the prompt and the `cwd` cannot disagree; a branch read that fails yields null and never a refusal.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the five modules and records the baseline: the status row with no branch, the shared run's record with `branch: null`, and the runtime suite green before the first edit. Implementation adds `workingPlaceLine` and the `workingPlace` input to `dispatch.ts`, `checkoutBranch` to `isolation.ts`, the branch resolution and the resumed-prompt check to `runner.ts`, the two `RunSummary` fields to `status-index.ts`, and the two `LastRun` fields and row parts to `status.ts`. Verification runs the runtime suite and typecheck, reads a worktree run's prompt and record, reads a shared run's record, prints a status row, and confirms an index built before the change still opens.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `workingPlaceLine` in both shapes, `checkoutBranch` on a branch and on a detached HEAD, `summarizeRecord` with and without the two fields | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch isolation status-index` |
| Integration | A worktree run through the runner: the prompt names the tree and the record carries its branch; a shared run: the record carries the checkout branch; a refusal: neither | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner isolation` |
| Integration | A status row and its JSON over a fixture index, including a summary written without the two fields | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status` |
| Type | Every changed signature | `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` |
| Manual | One real run of each isolation answer, read back through `bots status` and the record | `node .skilled/bin/bots.cjs run <id>`, then `node .skilled/bin/bots.cjs status` |

The suites already own these modules, so each case lands in the file that already drives it rather than in a new one. The worktree case belongs in `isolation.vitest.ts`, which already runs a bot through the runner against a stub numbering script and already asserts the child's `cwd` equals `evidence.worktreePath`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:421-424] The shared case belongs in `runner.vitest.ts`, which already drives a run with no tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` on the PATH, for one `rev-parse` per shared run | External | Green | A shared run records a null branch and its row omits the part |
| `better-sqlite3`, already installed for the status index | External | Green | Status cannot read the index at all, which is today's behavior too |
| `vitest` and `tsc`, already in the runtime's dev dependencies | External | Green | No test or type gate can run |
| `isolation.ts`'s tree branch | Internal | Green | A worktree run records a null branch |
| `posture.ts`'s isolation answer | Internal | Green | The line names the checkout for a run that has a tree |

No dependency is added. The change reads what the tree already installs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a dispatched prompt names a directory the child does not start in, or a status row prints a branch the run did not use.
- **Procedure**: revert the one commit. The record field and the index column already existed, so the revert leaves every record and every index readable; a row written by the reverted code keeps its two fields and prints them again once the change returns.
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
| Setup | A green runtime suite and typecheck before the first edit | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The phase handoff to 005-memory |
<!-- /ANCHOR:phase-deps -->

---
