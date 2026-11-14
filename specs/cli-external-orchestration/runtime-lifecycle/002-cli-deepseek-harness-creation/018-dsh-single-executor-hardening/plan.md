---
title: "Implementation Plan: Phase 18: dsh-single-executor-hardening"
description: "Thirteen edits across the deep-loop runtime, four workflow assets, two reducers and the hub's changelog close five Fable P2 items and three faults a live harness review exposed. Each edit names its search text and its test."
trigger_phrases:
  - "dsh single executor hardening plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: dsh-single-executor-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS on Node, YAML workflow assets |
| **Framework** | The deep-loop runtime under `.skilled/skills/system-deep-loop/runtime` |
| **Storage** | JSONL state logs, the coverage graph SQLite store and temp folders |
| **Testing** | Vitest through `npx vitest run` in the runtime folder |

### Overview
The runner gets a per-kind key list for `dispatchEnv` and an opt-out for its stdout echo. Fan-out gets an exported sweep of stale harness homes that both auto workflows also call. Both `:confirm` workflows refuse an executor kind they have no branch for. Two reducers get the fixes the live review showed, and the hub gets changelog `v1.6.26.0`. Every edit has a test, and the contract drift check and the full suite close it.

Shell variables, set from the worktree root: `DL=.skilled/skills/system-deep-loop/runtime`, `A=.skilled/commands/deep/assets`, `C=specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/018-dsh-single-executor-hardening`, `REV=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/review`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Every search text in section 4 counts 1 in its file (T001)
- [ ] The baselines in section 5 print their recorded values (T002)
- [ ] The operator's answer on C6 is in `goal.md` section 4, or C6 is recorded as deferred (T003)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run tests/unit/executor-branch-contract.vitest.ts tests/executor-audit-cli-branch-receipts.test.ts` in `$DL` prints `16 passed` and no failure
- [ ] `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`
- [ ] The full `$DL` suite shows only the known `fanout-pool.vitest.ts` timing failure
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Guard at the source. Each fix sits where the fault is produced, not in the step that observed it.

### Key Components
- **`executor-audit.ts` `runAuditedExecutorCommand`**: the one synchronous runner every non-native step calls. Without a key check here, any later caller can pass `PATH` or a secret past the allowlist.
- **`fanout-run.cjs` `sweepStaleDshHomes`**: one sweep both fan-out and the auto workflows call. Without it, a killed step's home stays in the temp folder for good, as the six 196-hour homes show.
- **`unsupported_executor_guard` in both `:confirm` workflows**: without it, a harness kind reaches a `branch_on` with no matching branch.
- **`reduce-state.cjs` `upsertFinding` and `upsert.cjs`**: without these, a re-verified finding doubles and a leaf's own dimension ids double the dimension count, so the graph veto blocks STOP on covered dimensions.

### Data Flow
A workflow step builds the command and calls the runner. The runner checks the env keys, writes the intent receipt, spawns, judges the output with `completionCheck` and then echoes or counts it. Before the step makes a harness home, it sweeps stale ones. After each iteration the reducer folds findings into the registry, the graph upsert stores the iteration's nodes and edges and the convergence script reads the graph.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-audit.ts:1229` env merge | Merges `dispatchEnv` after the allowlist | update, E1 | `rg -n 'DISPATCH_ENV_KEYS' $DL/lib/deep-loop/executor-audit.ts` prints 2 lines |
| `fanout-run.cjs:3765` fan-out env merge | Merges `extraEnv` built inside fan-out | unchanged, fan-out builds its own keys | not a consumer of `dispatchEnv` |
| `executor-audit.ts` async runner at line 1370 | Writes its own receipt | unchanged, the field comment says only the synchronous runner reads `dispatchEnv` | `rg -n 'dispatchEnv' $DL/lib/deep-loop/executor-audit.ts` lists the field, the merge and the E1 check, none inside the async runner |
| Both auto workflows, harness branch | Pass `dispatchEnv`, make the home | update, E4 and E5 | E13 contract test |
| Both `:confirm` workflows | Branch only `native`, `cli-claude-code` and `cli-opencode` | update, E6 | E13 contract test |
| `upsert.cjs` node and edge loop | Stores every review node under the id it was given | update, E11 | E13 test |
| `convergence.cjs` `buildReviewSignals` and the `coverage-graph-signals.ts` query | Count DIMENSION nodes and `COVERS` edges from them | unchanged, they read correct numbers once ids are canonical | the live graph projection in `spec.md` reads `1` |
| `step_graph_upsert` transform in both review workflows | Merges leaf graph events, DIMENSION nodes included | unchanged, `upsert.cjs` is the one deterministic boundary every merge passes | E13 test |
| Compiled contracts | Generated from the YAMLs | regenerate, E9 | drift check |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json` | Pins a hash of the hub's routing inputs | re-minted by the pre-commit hook when E12 is committed | `node .skilled/bin/compiled-route-guard.cjs` prints `system-deep-loop            fresh` after the commit |

Required inventories:
- Same-class producers of review DIMENSION nodes: `rg -n 'DIMENSION' .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml` lists the seed and the graph upsert steps, and both reach the graph through `upsert.cjs`.
- Consumers of `dispatchEnv`: `rg -n 'dispatchEnv' .skilled -g '!**/node_modules/**' -g '!**/dist/**'` lists the runner, both auto workflows and the receipts test.
- Matrix axes for C2: kind (harness, another CLI kind), key (on the list, off the list). Rows: harness with its four keys passes, harness with `PATH` throws, `cli-codex` with any key throws.
- Invariant for C1: the sweep removes only a direct child of `os.tmpdir()` whose name matches `^dsh-home-[A-Za-z0-9]{6}$`, that is a real folder and not a link, and whose modified time is more than 24 hours old.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Each edit below names its file and a search text that counts 1 at `1bedb33577`.

### E1. Per-kind `dispatchEnv` keys (C2)
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
  // Pre-dispatch INTENT receipt (engine-signed, no child id yet). Null when the
  // caller did not opt into receipts.
  const receiptCtx = beginReceipt(input);
```
Insert above it a call to a new `assertDispatchEnvAllowed(input)`. Above `runAuditedExecutorCommand`, add `const DISPATCH_ENV_KEYS: Readonly<Partial<Record<ExecutorKind, readonly string[]>>> = { 'cli-deepseek-harness': ['DSH_HOME', 'DSH_SPEC_FOLDER', 'SYSTEM_SPEC_GATE_DISABLED', 'AI_SESSION_CHILD'] }` and the function, which throws `dispatchEnv key <KEY> is not allowed for <kind>` for each key not on the kind's list. A kind with no entry allows no key. Update the `dispatchEnv` field comment to name the list.

### E2. Stdout echo opt-out (C3)
Same file. After the search text `  dispatchEnv?: Record<string, string>;` add `echoStdout?: boolean;` with a comment that the harness prints a JSON event stream the orchestrator never reads. Replace:
```text
  if (typeof result.stdout === 'string' && result.stdout.length > 0) {
    process.stdout.write(result.stdout);
  }
```
with a branch: when `input.echoStdout === false`, write `[executor-audit] child stdout <n> bytes, not echoed` to stderr, where `<n>` is `Buffer.byteLength(result.stdout)`. Otherwise echo as today. `completionCheck` and `classifyExecutorUnavailable` still read `result.stdout`.

### E3. Stale home sweep (C1)
File: `$DL/scripts/fanout-run.cjs`. Search text:
```text
function createDshHome() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-home-'));
```
Add above it `const STALE_DSH_HOME_MS = 24 * 60 * 60 * 1000;` and `function sweepStaleDshHomes(now = Date.now(), tmpRoot = os.tmpdir())`, which follows the invariant in the addendum, skips any folder in `pendingDshHomes`, catches each removal error and writes one `[fanout-run] could not sweep <name>: <message>` line to stderr, and returns the removed names. Call it as the first line of `createDshHome`. After the export search text `  validateDshCompletion,` add `  sweepStaleDshHomes,`.

### E4. Sweep call in both auto workflows (C1)
Files: `$A/deep-review-auto.yaml` and `$A/deep-research-auto.yaml`. In each, replace the search text
```text
            const { buildLineageCommand, withAgentPersona, validateDshCompletion } = require('./.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs');
```
with the same line that also destructures `sweepStaleDshHomes`. Above the search text `            const dshHome = mkdtempSync(path.join(os.tmpdir(), 'dsh-home-'));` add `            sweepStaleDshHomes();`.

### E5. Echo off in both harness branches (C3)
Same two files. After the search text `                completionCheck: validateDshCompletion,` add `                echoStdout: false,`. Add one clause to the step's existing note that starts `The harness starts in the artifact directory`, saying the event stream is judged and counted, not echoed.

### E6. `:confirm` refusal (C5)
Files: `$A/deep-review-confirm.yaml` and `$A/deep-research-confirm.yaml`. Search text in each:
```text
        resolve_executor:
          source: "config.executor"
          loader: ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts#parseExecutorConfig"
        pre_dispatch:
```
Insert between the loader line and `pre_dispatch:`:
```text
        unsupported_executor_guard:
          skip_when: "config.executor.kind in ['native', 'cli-claude-code', 'cli-opencode']"
          message: "UNSUPPORTED_EXECUTOR: :confirm has no branch for {config.executor.kind}. Run it with :auto, which branches every executor kind."
          exit_code: 2
          halt: true
```

### E7. Presentation clause (C5)
Files: `$A/deep-review-presentation.txt` line 122 and `$A/deep-research-presentation.txt` line 95. Search text in each: `the last one a single lineage in \`:auto\` or a fan-out;`. Replace with `the last one a single lineage in \`:auto\` or a fan-out, and \`:confirm\` runs only \`native\`, \`cli-claude-code\` and \`cli-opencode\`;`.

### E8. Field comment and step notes check
Before E9, run `rg -n 'echoStdout|sweepStaleDshHomes|unsupported_executor_guard' $A $DL/lib $DL/scripts -g '!**/dist/**'`. It lists the E1 to E7 lines and nothing else.

### E9. Regenerate the compiled contracts
Run `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review --write`, then `--command deep/research --write` and `--command deep/ai-council --write`. Then `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`.

### E10. Fold a finding at a shifted line (C7)
File: `$DL/scripts/reduce-state.cjs`. Search text:
```text
    const isSameFinding = !existing || findingDedupKey(existing) === findingDedupKey(finding);
```
Replace with a check that is also true when `sameFindingAtAnotherLine(existing, finding)` holds. Add that function next to `findingDedupKey`: true when neither record has a `contentHash`, both name the same `file` and their titles match after `normalizeText(...).toLowerCase().slice(0, 80)`. The fold keeps the first row and moves `lastSeen`, as a same-key fold does today. `collapseFindingsByDedupKey` is unchanged.

### E11. Canonical review dimension ids (C8)
File: `$DL/scripts/upsert.cjs`. Search text:
```text
    for (const e of rawEdges) {
      const sourceId = e.sourceId || e.source;
      const targetId = e.targetId || e.target;
```
Add a `canonicalReviewDimensionId(id)` near the top that returns `dimension:` plus the lowercase name after a `dimension:`, `dim:` or `dim-` prefix, matched without regard to case. In the node loop, when `loopType === 'review'` and the kind is `DIMENSION`, store the node under that id and record the old id in a map. Before the edge loop reads `sourceId` and `targetId`, map each through it. Two nodes that fold to one id are written once, as the upsert already dedupes by id.

### E12. Changelog and version (C4)
Create `.skilled/skills/system-deep-loop/changelog/v1.6.26.0.md` in the `v1.6.25.0.md` shape, titled `system-deep-loop v1.6.26.0, one harness lineage runs in review and research`. It says the harness now runs as a single lineage in `:auto`, which corrects `v1.6.24.0.md:25`, and lists C1 to C5, C7 and C8, and C6 when built. Route the file through `sk-doc`'s changelog mode before writing it. In `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` under `.skilled/skills/system-deep-loop/`, replace `1.6.25.0` with `1.6.26.0`, one match per file.

### E13. Tests
- `$DL/tests/executor-audit-cli-branch-receipts.test.ts`: one test for C2, where the harness kind with `PATH` in `dispatchEnv` throws before a receipt file exists, and one for C3, where a stub child printing 4096 bytes with `echoStdout: false` leaves stdout empty, prints `4096 bytes` on stderr and still lets `completionCheck` read the stream. The C2 matrix row for another kind goes in the same test.
- `$DL/tests/unit/fanout-run.vitest.ts`: one test with a temp `tmpRoot` holding a 25-hour default home, a 1-hour default home, a 25-hour named home and a link. Only the first is removed.
- `$DL/tests/unit/executor-branch-contract.vitest.ts`: three tests. Both auto workflows call `sweepStaleDshHomes()` before `mkdtempSync` and pass `echoStdout: false`. Both confirm workflows hold `unsupported_executor_guard` with the three branched kinds in its `skip_when`.
- `$DL/tests/unit/deep-review-state-reducer.vitest.ts`: one test through `reduceReviewState` with `R1-P1-001` at lines 27 and 24 of one file with one title, which yields one row, and a second id reused with another title, which yields two.
- `$DL/tests/integration/upsert-script.vitest.ts`: one test that upserts the four `dimension:<name>` seeds with `COVERS` edges, then `dim:security`, `DIM-TRACEABILITY`, `dim:maintainability` and `dim:correctness` with an edge to each. The graph holds four DIMENSION nodes, the edges end at the canonical ids and `convergence.cjs --read-only` prints `"dimensionCoverage":1`.

### C6, gated
No edit runs until `goal.md` section 4 records the operator's choice from `spec.md` section 10. Option A adds an executor-carrying event in `writeFirstRecordExecutor` (`executor-audit.ts:1061`) through the gateway, with a projection test that the event survives a refresh. Option B stops the direct append in that function, documents the receipts as the identity record in the deep-review state reference and points the report's Executor Evidence section at them. Either option adds its files to `spec.md` section 3 before its edit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Baselines, run from the worktree root on 2026-11-14 at `1bedb33577`:

| Command | Before | After |
|---------|--------|-------|
| `cd $DL && npx vitest run tests/unit/executor-branch-contract.vitest.ts tests/executor-audit-cli-branch-receipts.test.ts` | `11 passed` (6 and 5) | `16 passed` (9 and 7) |
| `cd $DL && npx vitest run` on the drift and compile tests | `23 passed` | `23 passed` |
| `node $DL/scripts/check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3` | the same |
| `cd $DL && npm run typecheck` | exit 0 | exit 0 |
| `cd $DL && npx vitest run` | `1 failed \| 2893 passed \| 8 skipped (2902)` at planning. At the build start, after phase 019, it printed `Test Files  173 passed (173)` and `Tests  2894 passed \| 8 skipped (2902)`, so the timing test passed that run | no new failure, more passed. The `fanout-pool.vitest.ts` timing test may fail alone, as at planning |
| `node .skilled/bin/compiled-route-guard.cjs` | `system-deep-loop            fresh`, exit 0 | the same after the commit hook re-mints |
| `convergence.cjs --read-only` on the `$REV` session graph | `"dimensionCoverage":0.5`, `STOP_BLOCKED` | unchanged, the stored graph is not rebuilt. The E13 graph built the same way reads `1` |

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The runner, the sweep, the reducer and the graph upsert | Vitest |
| Integration | The four workflow assets, read by the branch contract test, and the compiled contracts | Vitest, `check-contract-drift.cjs` |
| Manual | One `:auto` harness review of one iteration on a scratch target, then `ls` of the temp folder and a read of the step output | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 017 at `1bedb33577` | Internal | Green | The search texts would not match |
| The operator's C6 choice | Internal | Yellow | C6 is recorded as deferred and the rest ships |
| A harness login for the manual run | External | Yellow | The manual run is skipped and recorded. The unit tests still cover each change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a harness review fails with a `dispatchEnv` refusal, a live home is swept, or the graph veto lifts on an iteration that did not review its dimension.
- **Procedure**: revert the phase commit with `git revert <sha>` and rerun E9's drift check. The changes add no stored state, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 017 committed | Implementation |
| Implementation | Every search text counting 1, and the C6 answer for C6 only | Verification |
| Verification | E1 to E13 | Close |
<!-- /ANCHOR:phase-deps -->

---
