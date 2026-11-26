---
title: "Implementation Plan: Phase 4: computer-exposure"
description: "One working-place line in `buildBotPrompt` plus `evidence.branch` filled for every dispatched run plus two appended parts on a `bots status` row, across five runtime modules with no new file, dependency or index schema change, and a design folder that fixes every shape before the first edit."
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
| **Testing** | `vitest` through `npm --prefix .skilled/skills/system-skilled-bots/runtime test`, plus the runtime's `typecheck` script through `run typecheck` |

### Overview
The change is one line in a prompt plus one field filled on a path that already exists plus two parts appended to a status row. `dispatch.ts` gains `workingPlaceLine` and one prefix constant beside the `checkoutLine` it already has, and `buildBotPrompt` gains a `workingPlace` input that carries the directory, the branch and the run folder. `runner.ts` passes the `workDir` it already computes and the branch it already knows for a worktree run, and reads the checkout's branch once through a new `checkoutBranch` in `isolation.ts` for a shared run. `status-index.ts` adds the two fields to `RunSummary`, which rides in a JSON column, so no schema version moves. `status.ts` adds them to `LastRun`, coalesces an absent summary key to null, and appends the two parts to the row. The proof is the runtime suite: a worktree run's prompt names its tree, a shared run's record carries the checkout branch, and a status row prints both.

**The design folder comes first.** Six documents and twelve goldens under `design/` fix every shape this phase writes, so no builder decides one. They are listed in `spec.md` section 4 and each is cited by the requirement it serves. A builder reads the one its task names before its first edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/bin/bots.cjs status` prints a row with no `branch` part, the measured gap this phase closes
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` passes before the first edit, so a later failure is this phase's
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0 before the first edit
- [ ] The six design documents and the twelve goldens exist, and every golden parses

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
One line builder, one record field, one appended row part, and one design folder that fixes all three before the first edit.

### Key Components
- **`dispatch.ts`**: owns the prompt. `workingPlaceLine` sits beside `checkoutLine`, and `buildBotPrompt` takes the working place as an input rather than reading the filesystem, so the prompt stays a pure function of what the runner resolved. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:306-334] The two shapes, the prefix constant and the four slot assertions are [`design/prompt-line.md`](design/prompt-line.md) sections 1 and 2.
- **`isolation.ts`**: owns every git read about where a run works. `checkoutBranch` is the one read of a checkout's branch, it runs through the module's existing `git` helper, and it returns null rather than a refusal, because a null branch is a legal record value. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:1-24] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:171-181] The five git answers are [`design/prompt-line.md`](design/prompt-line.md) section 3.
- **`runner.ts`**: owns the order. It already computes `workDir` as the tree or the checkout, so the line and the child's `cwd` read one value. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1038] The three steps and their order are [`design/prompt-line.md`](design/prompt-line.md) section 3.
- **`status-index.ts`**: owns the run summary. The summary is a JSON column, so a field costs no migration and no schema version. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:266-295] The two fields are [`design/records.md`](design/records.md) section 2.
- **`status.ts`**: owns the row. `LastRun` gains the two fields, `lastRunOf` coalesces an absent summary key to null, and `formatStatus` appends two parts after every part it already prints. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:479-486] The part order and the seven mockups are [`design/status-row.md`](design/status-row.md) sections 1 to 3.

### Data Flow
The runner resolves the posture, makes or reopens a tree, and sets `workDir` to the tree or the checkout. It then resolves the branch in one step: the tree's branch when there is a tree, else `checkoutBranch(checkoutRoot, env)`. It writes that value into `seed.evidence.branch` and passes it, with `workDir` and `evidence.runFolder`, to `buildBotPrompt`, which emits the working-place line in its slot in the shared section order, after the spec-folder line and before the checkout line, which is emitted only for a child that starts outside the checkout. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md, section "The nine prompt sections"] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:323-326] The record is written, the index reads it through `summarizeRecord`, and `bots status` reads the index, coalesces each summary field to a string or null, and appends `branch <name>` and `worktree <path>` to the row. A resumed run reuses the parked prompt, so the runner inspects it for the prefix constant and inserts the current line when it is absent, or refuses `resume-item-invalid` when it names another place.

The four sequences are drawn in [`design/sequences.md`](design/sequences.md) and the five machines in [`design/state-machines.md`](design/state-machines.md).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `dispatch.ts` | Builds the prompt and the filtered environment | update - `workingPlaceLine`, the prefix constant and the `workingPlace` input, in the shared order's working-place slot | `rg -n 'workingPlaceLine' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` prints the definition and its one call site |
| `isolation.ts` | Creates, reopens, inspects and removes a bot tree | update - `checkoutBranch` | `rg -n 'export function checkoutBranch' .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts` prints one line |
| `runner.ts` | Runs one bot in a fixed order | update - resolve the branch, fill `evidence.branch`, add the line to a resumed prompt | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner` prints no `failed` |
| `status-index.ts` | Builds and reads the SQLite index | update - two `RunSummary` fields | `rg -n "SCHEMA_VERSION = '2'" .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line |
| `status.ts` | Builds the report and formats the row | update - two `LastRun` fields, the coalescing read and two appended parts | `node .skilled/bin/bots.cjs status` prints `branch <name>` on a row whose last run recorded one |
| `bots.cjs` | Owns the verb set and the usage text | not a consumer - it calls `formatStatus` and prints the report as JSON | `rg -n 'formatStatus' .skilled/bin/bots.cjs` prints one line and no new verb |
| `run-record.ts` | Validates and writes the record | unchanged - `evidence.branch` already exists and is already nullable, and the string requirement sits inside the tree block | `rg -n 'branch: string \| null' .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` prints one line |
| `posture.ts` | Decides whether a run gets a tree | not a consumer - it answers isolation and this phase reads the answer | `rg -n 'resolveIsolation' .skilled/skills/system-skilled-bots/runtime/lib/posture.ts` prints one line |
| `needs-you.ts` | Parks a run and builds the resumed prompt | not a consumer - the resumed prompt is the parked one, and the runner adds the line | `rg -n 'buildResumedPrompt' .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` prints one line |
| `design/` | The phase's own shape authority | create - six documents and twelve goldens | `ls specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design` prints six documents and `fixtures` |
| `.opencode/skills`, `.opencode/bin` | Relative symlinks to `.skilled/` | not a consumer - one edit reaches both paths | `readlink .opencode/skills` prints `../.skilled/skills` |

Required inventories:
- Same-class producers: `rg -n 'evidence\.branch|evidence\.worktreePath' .skilled/skills/system-skilled-bots/runtime/lib` lists every writer and reader of the two fields, so a new writer cannot be added without seeing the others.
- Consumers of changed symbols: `rg -n 'buildBotPrompt|formatStatus|summarizeRecord|LastRun|RunSummary' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names every caller and every test that reads the shape.
- Matrix axes: two isolation answers (`worktree`, `shared`) by three branch answers (a branch, a detached HEAD, a git read that fails), plus the resumed prompt in three states (absent, equal, different) and the index in two states (built before, built after).
- Algorithm invariant: the line names the directory the child starts in. `workDir` is the only value that decides it, so the prompt and the `cwd` cannot disagree. A branch read that fails yields null and never a refusal.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the five modules, reads the design folder and records the baseline: the status row with no branch, the shared run's record with `branch: null`, and the runtime suite green before the first edit. Implementation adds `workingPlaceLine` and the `workingPlace` input to `dispatch.ts`, `checkoutBranch` to `isolation.ts`, the branch resolution and the resumed-prompt check to `runner.ts`, the two `RunSummary` fields to `status-index.ts`, and the two `LastRun` fields, the coalescing read and the row parts to `status.ts`. Verification runs the runtime suite and typecheck, reads a worktree run's prompt and record, reads a shared run's record, prints a status row, and confirms an index built before the change still opens.

**The order inside a module.** `dispatch.ts` first, because `runner.ts` calls it. `isolation.ts` before `runner.ts`, because the runner imports `checkoutBranch`. `status-index.ts` before `status.ts`, because `lastRunOf` reads the summary the index writes. A worker that owns two of these follows that order within its own group.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:external-orchestration -->
## External orchestration

Every task in `tasks.md` is dispatched, not hand-run. The hub owns the routing and each mode owns its dispatch contract, so this section names the executor, the model, the effort and the worker count, and never restates a mode's flags [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:26]. Two hub rules bind every dispatch: the target mode's `SKILL.md` is read before its prompt is composed [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198], and the executor CLI is the HOW, so it never overrides this phase's own workflow [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

**The roster.** Five executors, no sixth. `cli-mistral-vibe` at `deepseek-flash` runs at `max` only, because the tier is the roster row's `thinking` field and no flag moves it [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67] [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89]. `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017` takes `--thinking high` or `max`, the one effort lever that is a standalone flag [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:101] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:157]. `cli-opencode` at `opencode-go/deepseek-v4.1-flash` takes `#high` or `#max` on the model id [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:142]. `cli-devin` at `deepseek-v4-1-flash-max` bakes `max` into the model uid and has no headless effort flag [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:152] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156]. `cli-codex` at `gpt-6-luna` takes `xhigh` on the `fast` service tier, and it is the only route to a GPT model [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:165].

**The tier rule.** DeepSeek Flash at `high` carries a small mechanical task: an edit to a settled module, a test that mirrors an existing one, a doc line. DeepSeek Flash at `max` carries a design or tricky task: a new module, a new shared record, a seam between two phases. `gpt-6-luna` at `xhigh` on `fast` carries the hardest task and is the last fallback for every wave [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"].

**The worker rule.** Parallelism follows file overlap: no two workers touch one file, so a wave's worker count is the number of disjoint file groups its tasks fall into [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"]. The phase's primary executor is `cli-opencode` at `opencode-go/deepseek-v4.1-flash`, and its parent row fixes three workers in parallel [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION", row 004]. No wave below exceeds three.

**The effort the route actually runs.** `opencode-go/deepseek-v4.1-flash` is pinned to the max tier by policy, and the fan-out builder upgrades a lower request [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:142]. The `#high` cells below name the tier the task earns under the tier rule. On this route they run at max, and the parent row's `#high` cell reads the same way. `cli-pi` is the route that delivers a real `high`, which is why it is the first fallback for a mechanical wave.

The shell variables are the two `tasks.md` sets: `LIB=.skilled/skills/system-skilled-bots/runtime/lib` and `TESTS=.skilled/skills/system-skilled-bots/runtime/tests`. The two multi-word commands, `npm --prefix .skilled/skills/system-skilled-bots/runtime` and `node .skilled/bin/bots.cjs`, are written in full at every use, because a variable holding either one would need word splitting and zsh does not do it.

### W0 Setup, orchestrator, no dispatch

Tasks T001 to T008. One worker, the orchestrator, because the wave writes no file: it records the measured gap, the baseline suite and the baseline typecheck, reads the five modules and reads the design folder.

Verify, each command on its own line:

```text
node .skilled/bin/bots.cjs status | rg -c 'branch '
npm --prefix .skilled/skills/system-skilled-bots/runtime test
npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck
rg -n 'export function checkoutLine|export function buildBotPrompt' $LIB/dispatch.ts
rg -n 'const workDir = tree' $LIB/runner.ts
rg -n 'const parts = \[row.state' $LIB/status.ts
rg -n "SCHEMA_VERSION = '2'" $LIB/status-index.ts
ls specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design
```

The first prints nothing and exits 1. The second prints a `Tests` line with no `failed`. The third exits 0. The fourth prints two lines. The fifth prints one line. The sixth prints one line. The seventh prints one line. The eighth prints six documents and `fixtures`.

### W1 Implementation, `cli-opencode` at `opencode-go/deepseek-v4.1-flash`, three workers

The wave brief fixes the three interfaces before any worker starts: `workingPlace` as `{ path, branch, runFolder }`, `checkoutBranch(root, env)` returning `string | null`, and `RunSummary` and `LastRun` carrying `worktreePath` and `branch` as `string | null`. With those fixed, the three groups share no file.

| Worker | Task ids | Files | Effort | Fallback if `cli-opencode` runs out |
|--------|----------|-------|--------|--------------------------------------|
| W1a | T009, T010, T018 | `$LIB/dispatch.ts`, `$TESTS/dispatch.vitest.ts` | `#high` | `cli-pi` `--thinking high`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |
| W1b | T011, T012, T013, T014, T019, T020 | `$LIB/isolation.ts`, `$LIB/runner.ts`, `$TESTS/isolation.vitest.ts`, `$TESTS/runner.vitest.ts` | `#high` | `cli-pi` `--thinking high`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |
| W1c | T015, T016, T017, T021, T022 | `$LIB/status-index.ts`, `$LIB/status.ts`, `$TESTS/status-index.vitest.ts`, `$TESTS/status.vitest.ts` | `#high` | `cli-pi` `--thinking high`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |

All three carry `#high`, which is the parent row's cell for this phase and its note that the work is edits to settled modules only [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION", row 004]. The tier rule would put W1a and W1b at `max`, because W1a fixes a slot in the shared prompt order that 005 owns and W1b adds the line to a parked prompt while keeping a refusal's two nulls. The parent row is frozen and it wins, and the difference costs nothing here: `opencode-go/deepseek-v4.1-flash` is pinned to max by policy, so all three run at max on this route whatever the cell says. The cell matters only on the fallback, where `cli-pi --thinking high` is the route that delivers a real high.

Verify, each command on its own line:

```text
npm --prefix .skilled/skills/system-skilled-bots/runtime test
npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck
rg -n 'workingPlaceLine' $LIB/dispatch.ts $LIB/runner.ts
rg -n 'export function checkoutBranch' $LIB/isolation.ts
rg -n "SCHEMA_VERSION = '2'" $LIB/status-index.ts
```

The first prints no `failed`. The second exits 0. The third prints the definition and its two call sites. The fourth prints one line. The fifth prints one line.

### W2 Docs, `cli-opencode` at `opencode-go/deepseek-v4.1-flash`, two workers

| Worker | Task ids | Files | Effort | Fallback if `cli-opencode` runs out |
|--------|----------|-------|--------|--------------------------------------|
| W2a | T023 | `$LIB/README.md` | `#high` | `cli-pi` `--thinking high`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |
| W2b | T024 | `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | `#high` | `cli-pi` `--thinking high`, then `cli-mistral-vibe` `deepseek-flash`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |

The two files are disjoint, so both workers run at once.

Verify, each command on its own line:

```text
rg -n 'working place' $LIB/README.md
rg -n 'branch <name>' .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md
```

The first prints one line. The second prints one line.

### W3 Verification, orchestrator, no dispatch

Tasks T025 to T032. One worker, the orchestrator, because the wave writes no file: it runs the whole suite and the typecheck, reads a worktree run's prompt and record, reads a shared run's record, prints a status row and its JSON, opens an index built before the change, and validates the packet.

Verify, each command on its own line:

```text
npm --prefix .skilled/skills/system-skilled-bots/runtime test
npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck
node .skilled/bin/bots.cjs status
node .skilled/bin/bots.cjs status --json
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure --strict
```

The first prints no `failed`. The second exits 0. The third prints `branch <name>` on a row whose last run recorded one and exits 0 without `--rebuild`. The fourth carries `lastRun.branch` and `lastRun.worktreePath`. The fifth prints `RESULT: PASSED`.

**What the orchestrator does between waves.** It reads each worker's own suite slice before the wave's verify: `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch` for W1a, `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- isolation runner` for W1b, `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status status-index` for W1c. A slice that prints `failed` sends that one group back with its own output, and the other two groups are not re-run. The wave's verify runs only after all three slices are green, so a red whole-suite run names the group that broke it rather than the wave.

**Fallback order.** Every wave uses the same ladder, and a wave that moves down it keeps its task ids, its files and its verify step: `cli-opencode`, then `cli-pi`, then `cli-mistral-vibe`, then `cli-devin`, then `cli-codex` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"]. The phase's primary sits first and the parent's relative order holds for the four behind it. `cli-devin` is probed with a trivial read-only call before a wave spends it, because a quota banner alone is not a refusal [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237]. `cli-codex` is last because it is the hardest-task row and the one a build should not spend on a mechanical edit. It is also the escalation for W1b if that group fails twice, at `gpt-6-luna` `xhigh` on `fast` [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125]. A wave that reaches the end of the ladder without a working executor stops and reports the wave, its task ids and the last refusal rather than authoring a file by hand outside the dispatch contract.
<!-- /ANCHOR:external-orchestration -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `workingPlaceLine` in both shapes and its slot after the spec-folder line and before the checkout line, `checkoutBranch` on a branch and on a detached HEAD, `summarizeRecord` with and without the two fields | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch isolation status-index` |
| Integration | A worktree run through the runner: the prompt names the tree and the record carries its branch. A shared run: the record carries the checkout branch. A refusal before the isolation step: neither | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner isolation` |
| Integration | A status row and its JSON over a fixture index, including a summary written without the two fields | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status` |
| Golden | The twelve files in `design/fixtures/`, each compared the way its README says | The same five suites |
| Type | Every changed signature | `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` |
| Manual | One real run of each isolation answer, read back through `bots status` and the record | `node .skilled/bin/bots.cjs run <id>`, then `node .skilled/bin/bots.cjs status` |

The suites already own these modules, so each case lands in the file that already drives it rather than in a new one. The worktree case belongs in `isolation.vitest.ts`, which already runs a bot through the runner against a stub numbering script and already asserts the child's `cwd` equals `evidence.worktreePath`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:411-425] The shared case belongs in `runner.vitest.ts`, which already drives a run with no tree.

**The goldens.** `design/fixtures/` holds one file per shape this phase writes, and `design/fixtures/README.md` names the test that reads each and how it compares. A shape change edits the golden in the same change, which is REQ-010.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` on the PATH, for one `rev-parse` per shared run | External | Green | A shared run records a null branch and its row omits the part |
| `better-sqlite3`, already installed for the status index | External | Green | Status cannot read the index at all, which is today's behavior too |
| `vitest` in the runtime's dev dependencies, and the `tsc` its `typecheck` script borrows from `.skilled/skills/system-spec-kit/node_modules/.bin/tsc` | External | Green | No test or type gate can run. A fresh clone needs `npm install` in `system-spec-kit` before `run typecheck` resolves |
| `isolation.ts`'s tree branch | Internal | Green | A worktree run records a null branch |
| `posture.ts`'s isolation answer | Internal | Green | The line names the checkout for a run that has a tree |
| `buildBotPrompt`'s section order, owned by 005 and fixed in `contracts/prompt-sections.md` section 1 | Internal | Green | The line lands in the wrong slot and 005's memory block has to move it |
| The design folder under `design/` | Internal | Green | A builder decides a shape the phase already decided, which is the gap this phase's design work closes |

No dependency is added. The change reads what the tree already installs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a dispatched prompt names a directory the child does not start in, or a status row prints a branch the run did not use.
- **Procedure**: revert the one commit. The record field and the index column already existed, so the revert leaves every record and every index readable. A row written by the reverted code keeps its two fields and prints them again once the change returns.
- **No manual step**: this phase adds no closed-list key, so `contracts/versioning.md` section 2 has no row for it and no file needs stripping before a revert.
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
| Setup | A green runtime suite and typecheck before the first edit, and the design folder present | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The phase handoff to 005-memory |
<!-- /ANCHOR:phase-deps -->

---
