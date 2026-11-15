---
title: "Implementation Plan: Phase 19: dsh-single-executor-hardening"
description: "Thirteen edits across the deep-loop runtime, four workflow assets, two reducers and the hub's changelog close five Fable P2 items and three faults a live harness review exposed. Nine more, E14 to E22, build C6 Option A so the executor row reaches the ledger. Each edit names its search text and its test."
trigger_phrases:
  - "dsh single executor hardening plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: dsh-single-executor-hardening

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
The runner gets a per-kind key list for `dispatchEnv` and an opt-out for its stdout echo. Fan-out gets an exported sweep of stale harness homes that both auto workflows also call. Both `:confirm` workflows refuse an executor kind they have no branch for. Two reducers get the fixes the live review showed, and the hub gets changelog `v1.6.26.0`. For C6 the pre-dispatch audit hands its executor row to the append gateway on a ledger-backed state log, and the research upcaster and projection learn to carry it. Every edit has a test, and the contract drift check and the full suite close it.

Shell variables, set from the worktree root: `DL=.skilled/skills/system-deep-loop/runtime`, `A=.skilled/commands/deep/assets`, `C=specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-single-executor-hardening`, `REV=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/review`.
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
- [ ] `npx vitest run tests/unit/executor-audit-ledger-projection.vitest.ts` in `$DL` prints `3 passed (3)`, and the three tests fail with `executor-audit.ts` at its start copy
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
| Compiled contracts | Generated from the YAMLs | regenerate, E9 and E21 | drift check |
| `writeFirstRecordExecutor`, called as `pre_dispatch_audit` in all four workflows | Appends or patches the `iteration_start` row straight into the state log, which the next projection refresh drops | update, E14 and E20 | E22 test |
| `append-mode-event.cjs` review bare-record branch | Records a bare `type: iteration` row whole under `deep_review.iteration_recorded` | update, E15, also takes `type: iteration_start` | E22 review case |
| Research upcaster, `legacy-compatibility.ts` | Pins every `iteration_start` row as having no lossless stem | update, E16, a row with run identity upcasts to `deep_research.iteration_started` and one without it stays pinned | E22 research case, and the captured-log replay test in `deep-research-ledger-schema.vitest.ts` stays green |
| Research schema, types and stem census | `deep_research.iteration_started` is reserved with no producer and takes no `executor` | update, E17 and E18 | `check-ledger-stem-producers.cjs` prints `"ok":true` |
| Research state projection, `deep-research-contract.ts` | Writes `iteration_start` rows without `executor` | update, E19 | E22 research case |
| Review ledger reducer, `deep-review-reducer.ts` | Treats `deep_review.iteration_recorded` as a no-op for loop state | unchanged, an opening row changes no review state | not a consumer of the executor |
| Research ledger reducer, `deep-research-reducer.ts` `foldIteration` | Folds `iteration_started` and throws on a second started event for one iteration | unchanged, E14 appends no second row once one names the executor | E22 calls the audit twice and finds one row |
| `post-dispatch-validate.ts` `executor_missing` | Fails a non-native run whose last `type: iteration` record has no `executor`, only when a caller passes `executorKind` | unchanged, no workflow passes `executorKind` and `verify-iteration.cjs` never reads `executor` | not a consumer of the opening row |
| `verify-iteration.cjs` and `reduce-state.cjs` | Read `type: iteration` rows and skip others | unchanged | not consumers of the opening row |
| `emitDispatchFailure`, `appendExecutorAuditToLastRecord` and the `record_executor_audit` step | Write straight into the state log too | unchanged, outside C6 | same class, raised in `goal.md` section 4 for the operator |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json` | Pins a hash of the hub's routing inputs | re-minted by the pre-commit hook when E12 is committed | `node .skilled/bin/compiled-route-guard.cjs` prints `system-deep-loop            fresh` after the commit |

Required inventories:
- Same-class producers of review DIMENSION nodes: `rg -n 'DIMENSION' .skilled/commands/deep/assets/deep-review-auto.yaml .skilled/commands/deep/assets/deep-review-confirm.yaml` lists the seed and the graph upsert steps, and both reach the graph through `upsert.cjs`.
- Consumers of `dispatchEnv`: `rg -n 'dispatchEnv' .skilled -g '!**/node_modules/**' -g '!**/dist/**'` lists the runner, both auto workflows and the receipts test.
- Matrix axes for C2: kind (harness, another CLI kind), key (on the list, off the list). Rows: harness with its four keys passes, harness with `PATH` throws, `cli-codex` with any key throws.
- Invariant for C1: the sweep removes only a direct child of `os.tmpdir()` whose name matches `^dsh-home-[A-Za-z0-9]{6}$`, that is a real folder and not a link, and whose modified time is more than 24 hours old.
- Callers of `writeFirstRecordExecutor` for C6: `rg -n 'writeFirstRecordExecutor' .skilled -g '!**/node_modules/**' -g '!**/dist/**' -g '!**/changelog/**'` lists the function, the four `pre_dispatch_audit` steps and the unit tests, nothing else.
- Invariant for C6: the gateway path runs only when a `deep-review-ledger/frames` or `deep-research-ledger/frames` folder with a `.frame` file sits beside the state log, and it appends at most one `iteration_start` row per iteration.
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

### C6, Option A

The operator chose Option A on 2026-11-14. On a state log that sits beside a ledger, the pre-dispatch audit hands the append gateway the same `iteration_start` row it writes today, now with the run's ids. Review records it whole under `deep_review.iteration_recorded`. Research upcasts it to `deep_research.iteration_started`, a registered stem nothing spoke before. The projection writes the row back with its `executor` on every refresh. A state log with no ledger keeps today's direct write, as the research reducer's `recordReducerRows` already does. Native runs skip the audit step and the function returns before any read, so they are unchanged.

Each search text below is the exact text between its fences, and every line in it ends in a line break. Each counts 1 in its file at `6fb0f2c502` (T021). Replace it with the replacement text byte for byte. Every edit was applied and tested on a copy of the runtime before this plan was written.

#### E14a. Imports
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
```
Replacement:
```text
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
```

#### E14b. Gateway write of the executor row
File: `$DL/lib/deep-loop/executor-audit.ts`. Search text:
```text
/**
 * Write the first executor provenance record for an iteration.
 *
 * Updates the iteration start record in the JSONL state log with executor
 * audit data, or creates a new iteration_start record if none exists.
 *
 * @param stateLogPath - Path to the JSONL state log.
 * @param executor - Executor configuration.
 * @param iteration - Current iteration number.
 */
export function writeFirstRecordExecutor(stateLogPath: string, executor: ExecutorConfig, iteration: number): void {
  if (getExecutorKind(executor) === 'native') {
    return;
  }

```
Replacement:
```text
const APPEND_GATEWAY_PATH = fileURLToPath(new URL('../../scripts/append-mode-event.cjs', import.meta.url));
// The gateway binds each append to the checkout's identity, so it runs from the repository root.
const REPOSITORY_ROOT = fileURLToPath(new URL('../../../../../../', import.meta.url));
const LEDGER_MODES = Object.freeze([
  { ledgerDirectory: 'deep-review-ledger', mode: 'review' },
  { ledgerDirectory: 'deep-research-ledger', mode: 'research' },
] as const);

// A state log beside a ledger with frames is a projection the append gateway
// rebuilds from that ledger, so a row written straight into it is dropped at
// the next refresh.
function ledgerModeFor(stateLogPath: string): 'review' | 'research' | null {
  for (const { ledgerDirectory, mode } of LEDGER_MODES) {
    try {
      if (readdirSync(join(dirname(stateLogPath), ledgerDirectory, 'frames')).some((name) => name.endsWith('.frame'))) {
        return mode;
      }
    } catch {
      // No ledger of this mode sits beside the state log.
    }
  }
  return null;
}

function iterationNamesExecutor(lines: string[], iteration: number): boolean {
  return lines.some((line) => {
    const record = line.trim() ? parseJsonlObjectLine(line) : null;
    return record !== null
      && record.iteration === iteration
      && (record.type === 'iteration' || record.type === 'iteration_start')
      && isObjectRecord(record.executor);
  });
}

function appendThroughGateway(mode: 'review' | 'research', stateLogPath: string, record: Record<string, unknown>): void {
  const eventDir = mkdtempSync(join(tmpdir(), 'executor-audit-event-'));
  const eventPath = join(eventDir, 'event.json');
  try {
    writeFileSync(eventPath, JSON.stringify(record), 'utf8');
    const result = spawnSync(process.execPath, [
      APPEND_GATEWAY_PATH,
      '--mode', mode,
      '--run-directory', dirname(stateLogPath),
      '--event-json', eventPath,
    ], { cwd: REPOSITORY_ROOT, encoding: 'utf8' });
    if (result.status !== 0) {
      const outcome = String(result.stdout || '').trim().split('\n').at(-1) || String(result.stderr || '').trim();
      throw new Error(`append gateway refused the executor row for iteration ${String(record.iteration)}: ${outcome}`);
    }
  } finally {
    rmSync(eventDir, { recursive: true, force: true });
  }
}

/**
 * Write the first executor provenance record for an iteration.
 *
 * On a ledger-backed state log the iteration_start row goes through the append
 * gateway, so the projection writes it back on every refresh. A state log with
 * no ledger keeps the direct write: the iteration start record gets the
 * executor audit data, or a new iteration_start record is created.
 *
 * @param stateLogPath - Path to the JSONL state log.
 * @param executor - Executor configuration.
 * @param iteration - Current iteration number.
 * @param sessionId - The run's session id, which scopes the ledger event.
 */
export function writeFirstRecordExecutor(
  stateLogPath: string,
  executor: ExecutorConfig,
  iteration: number,
  sessionId?: string,
): void {
  if (getExecutorKind(executor) === 'native') {
    return;
  }

  const ledgerMode = ledgerModeFor(stateLogPath);
  if (ledgerMode !== null) {
    if (iterationNamesExecutor(readJsonlFile(stateLogPath).lines, iteration)) {
      return;
    }
    if (!sessionId) {
      throw new Error('writeFirstRecordExecutor needs the run session id for a ledger-backed state log');
    }
    appendThroughGateway(ledgerMode, stateLogPath, {
      type: 'iteration_start',
      iteration,
      runId: sessionId,
      sessionId,
      lineageId: sessionId,
      executor: buildExecutorAuditRecord(executor),
      timestamp: new Date().toISOString(),
    });
    return;
  }

```

#### E15. The review gateway takes the opening row
File: `$DL/scripts/append-mode-event.cjs`. Search text:
```text
    && rawEvent.type === 'iteration'
  ) {
    // The review agent, its iteration prompt and its workflow all hand the gateway the canonical
    // iteration record itself. Its optional fields vary with review depth and executor, so it
    // travels whole under one stem, and the state projection writes it back as the same row.
```
Replacement:
```text
    && (rawEvent.type === 'iteration' || rawEvent.type === 'iteration_start')
  ) {
    // The review agent, its iteration prompt and its workflow all hand the gateway the canonical
    // iteration record itself, and the pre-dispatch executor audit hands it the iteration's
    // opening row. Their optional fields vary with review depth and executor, so each travels
    // whole under one stem, and the state projection writes it back as the same row.
```

#### E16a. Drop the pinned record type
File: `$DL/lib/deep-research-ledger-schema/legacy-compatibility.ts`. Search text:
```text
const PINNED_LEGACY_TYPES = new Set([
  'iteration_start',
]);

const PINNED_LEGACY_EVENTS = new Set([
```
Replacement:
```text
const PINNED_LEGACY_EVENTS = new Set([
```

#### E16b. Drop the pinned-type check
File: `$DL/lib/deep-research-ledger-schema/legacy-compatibility.ts`. Search text:
```text
  if (typeof input.type === 'string' && PINNED_LEGACY_TYPES.has(input.type)) {
    return decision('pin-old-runtime', 'legacy-record-has-no-lossless-mode-event', null, version);
  }

  if (input.type === 'event' && isNonEmptyString(input.event)
```
Replacement:
```text
  if (input.type === 'event' && isNonEmptyString(input.event)
```

#### E16c. Route the opening row to its stem
File: `$DL/lib/deep-research-ledger-schema/legacy-compatibility.ts`. Search text:
```text
  if (record.type === 'iteration') return 'deep_research.iteration_completed';
```
Replacement:
```text
  if (record.type === 'iteration') return 'deep_research.iteration_completed';
  if (record.type === 'iteration_start') return 'deep_research.iteration_started';
```

#### E16d. The opening row needs iteration identity
File: `$DL/lib/deep-research-ledger-schema/legacy-compatibility.ts`. Search text:
```text
  if (targetStem === 'deep_research.iteration_completed'
    || targetStem === 'deep_research.convergence_blocked') {
```
Replacement:
```text
  if (targetStem === 'deep_research.iteration_completed'
    || targetStem === 'deep_research.iteration_started'
    || targetStem === 'deep_research.convergence_blocked') {
```

#### E16e. Upcast the opening row
File: `$DL/lib/deep-research-ledger-schema/legacy-compatibility.ts`. Search text:
```text
    case 'deep_research.iteration_completed':
      if (iteration === null) return Object.freeze({
```
Replacement:
```text
    case 'deep_research.iteration_started':
      if (iteration === null) return refusedUpcast(compatibility, 'iteration-scope-missing');
      // The opening row names only its iteration and the executor that runs it,
      // so the stem's references are derived from the row and the ledger tail.
      data = {
        focusRef: `legacy-jsonl:${recordDigest}:focus`,
        stateTailDigest: context.prevEventHash,
        strategyDigest: recordDigest,
        status: 'started',
        ...(isObject(input.executor) ? { executor: input.executor as JsonObject } : {}),
      };
      break;
    case 'deep_research.iteration_completed':
      if (iteration === null) return Object.freeze({
```

#### E17. The stem accepts an executor
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`. Search text:
```text
  'deep_research.iteration_completed': Object.freeze({
    focus: 'prose',
    answeredQuestions: 'prose-array',
  }),
```
Replacement:
```text
  'deep_research.iteration_started': Object.freeze({
    executor: 'json',
  }),
  'deep_research.iteration_completed': Object.freeze({
    focus: 'prose',
    answeredQuestions: 'prose-array',
  }),
```

#### E18a. The data type carries the executor
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`. Search text:
```text
export interface IterationStartedData extends JsonObject {
  readonly focusRef: string;
  readonly stateTailDigest: Digest;
  readonly strategyDigest: Digest;
  readonly status: 'started';
}
```
Replacement:
```text
interface IterationStartedCoreData extends JsonObject {
  readonly focusRef: string;
  readonly stateTailDigest: Digest;
  readonly strategyDigest: Digest;
  readonly status: 'started';
}

// The opening row names its executor only when a non-native executor runs the
// iteration, so each persisted shape is modeled without an optional property.
export type IterationStartedData =
  | IterationStartedCoreData
  | (IterationStartedCoreData & { readonly executor: JsonObject });
```

#### E18b. Census reason
File: `$DL/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`. Search text:
```text
  'deep_research.iteration_started': { status: 'reserved', reason: 'No writer emits it today: iteration opening is a flat row. An iteration step would speak it once a pass opens with its focus ref.' },
```
Replacement:
```text
  'deep_research.iteration_started': { status: 'reserved', reason: 'No workflow stages it: the pre-dispatch executor audit hands the gateway the legacy iteration_start row, which the gateway upcasts to this stem. An iteration step would speak it once it stages the stem itself.' },
```

#### E19. The research projection writes the executor back
File: `$DL/lib/legacy-projections/deep-research-contract.ts`. Search text:
```text
          type: 'iteration_start',
          iteration: iter,
          run: iter,
          focus: typeof data.focusRef === 'string' ? data.focusRef : '',
          timestamp: occurredAt,
```
Replacement:
```text
          type: 'iteration_start',
          iteration: iter,
          run: iter,
          focus: typeof data.focusRef === 'string' ? data.focusRef : '',
          ...(data.executor && typeof data.executor === 'object' && !Array.isArray(data.executor)
            ? { executor: data.executor as JsonObject }
            : {}),
          timestamp: occurredAt,
```

#### E20a. Session id for the review audit, auto
File: `$A/deep-review-auto.yaml`. Search text:
```text
            executor: "{config.executor}"
            iteration: "{current_iteration}"
        branch_on: "config.executor.kind"
```
Replacement:
```text
            executor: "{config.executor}"
            iteration: "{current_iteration}"
            sessionId: "{session_id}"
        branch_on: "config.executor.kind"
```

#### E20b. Session id for the review audit, confirm
File: `$A/deep-review-confirm.yaml`. Search text:
```text
            executor: "{config.executor}"
            iteration: "{current_iteration}"
        branch_on: "config.executor.kind"
```
Replacement:
```text
            executor: "{config.executor}"
            iteration: "{current_iteration}"
            sessionId: "{session_id}"
        branch_on: "config.executor.kind"
```

#### E20c. Session id for the research audit, auto
File: `$A/deep-research-auto.yaml`. Search text:
```text
            executor: "{config.executor}"
            iteration: "{current_iteration}"
        branch_on: "config.executor.kind"
```
Replacement:
```text
            executor: "{config.executor}"
            iteration: "{current_iteration}"
            sessionId: "{config.lineage.sessionId}"
        branch_on: "config.executor.kind"
```

#### E20d. Session id for the research audit, confirm
File: `$A/deep-research-confirm.yaml`. Search text:
```text
            executor: "{config.executor}"
            iteration: "{current_iteration}"
        branch_on: "config.executor.kind"
```
Replacement:
```text
            executor: "{config.executor}"
            iteration: "{current_iteration}"
            sessionId: "{config.lineage.sessionId}"
        branch_on: "config.executor.kind"
```

#### E21. Regenerate the compiled contracts
The review and research contracts pin the digest of each workflow file. Run `node $DL/scripts/compile-command-contracts.cjs --command deep/review --write`, then `--command deep/research --write` and `--command deep/ai-council --write`. Then `node $DL/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`.

#### E22. Create the survival test
Create `$DL/tests/unit/executor-audit-ledger-projection.vitest.ts` with exactly this content:
```ts
// ───────────────────────────────────────────────────────────────────
// MODULE: Executor Audit Ledger Projection Tests
// ───────────────────────────────────────────────────────────────────
//
// A ledger-backed state log is a projection the append gateway rebuilds from
// the ledger, so the pre-dispatch executor row has to reach the ledger to
// survive the next refresh. Each test opens a real run through the gateway,
// writes the executor row, then hands the gateway the leaf's iteration record,
// which rebuilds the state log.

import { describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { writeFirstRecordExecutor } from '../../lib/deep-loop/executor-audit.js';
import type { ExecutorConfig } from '../../lib/deep-loop/executor-config.js';

type Mode = 'review' | 'research';

const GATEWAY = fileURLToPath(new URL('../../scripts/append-mode-event.cjs', import.meta.url));
const REPOSITORY_ROOT = fileURLToPath(new URL('../../../../../../', import.meta.url));
const DIGEST = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

const EXECUTOR: ExecutorConfig = {
  kind: 'cli-claude-code',
  model: 'claude-opus-4-6',
  configDir: null,
  reasoningEffort: 'high',
  serviceTier: null,
  sandboxMode: null,
  timeoutSeconds: 900,
};

function runOpenEvent(mode: Mode, sessionId: string): Record<string, unknown> {
  if (mode === 'review') {
    return {
      stem: 'deep_review.run_initialized',
      scope: { runId: sessionId, sessionId, generation: 1 },
      data: {
        target: {
          targetId: 'review-target',
          targetType: 'file',
          artifactRef: 'deep-review-config.json#reviewTarget',
          sourceDigest: DIGEST,
          contentDigest: DIGEST,
        },
        lineageMode: 'fresh',
        maxIterations: 3,
        convergencePolicyVersion: 'convergence-policy@default',
        reviewModeContractDigest: DIGEST,
        initialReleaseReadinessState: 'not-assessed',
      },
    };
  }
  return {
    stem: 'deep_research.run_initialized',
    scope: { runId: sessionId, lineageId: sessionId },
    data: {
      generation: 1,
      charterDigest: DIGEST,
      configDigest: DIGEST,
      executorFingerprint: DIGEST,
      replayFingerprint: DIGEST,
      maxIterations: 3,
      convergencePolicyVersion: '1.0.0',
    },
  };
}

function leafIterationRecord(mode: Mode, sessionId: string): Record<string, unknown> {
  const shared = {
    type: 'iteration',
    iteration: 1,
    run: 1,
    mode,
    status: mode === 'review' ? 'complete' : 'insight',
    focus: 'executor identity',
    sessionId,
    timestamp: '2026-11-14T12:00:00Z',
  };
  return mode === 'review'
    ? shared
    : { ...shared, runId: sessionId, lineageId: sessionId, newInfoRatio: 0.5 };
}

function appendThroughGateway(mode: Mode, runDirectory: string, event: Record<string, unknown>): void {
  const eventPath = join(runDirectory, '..', 'event.json');
  writeFileSync(eventPath, JSON.stringify(event), 'utf8');
  const result = spawnSync(process.execPath, [
    GATEWAY, '--mode', mode, '--run-directory', runDirectory, '--event-json', eventPath,
  ], { cwd: REPOSITORY_ROOT, encoding: 'utf8' });
  expect(result.status, `${result.stdout}${result.stderr}`).toBe(0);
}

function stateRows(stateLogPath: string): Array<Record<string, unknown>> {
  return readFileSync(stateLogPath, 'utf8').trimEnd().split('\n').map((line) => JSON.parse(line));
}

describe('writeFirstRecordExecutor on a ledger-backed state log', () => {
  it.each(['review', 'research'] as const)('keeps the %s executor row through a projection refresh', (mode) => {
    const root = mkdtempSync(join(tmpdir(), 'executor-audit-ledger-'));
    try {
      const runDirectory = join(root, mode);
      mkdirSync(runDirectory);
      const stateLogPath = join(runDirectory, `deep-${mode}-state.jsonl`);
      const sessionId = `session-executor-${mode}`;
      appendThroughGateway(mode, runDirectory, runOpenEvent(mode, sessionId));

      writeFirstRecordExecutor(stateLogPath, EXECUTOR, 1, sessionId);
      appendThroughGateway(mode, runDirectory, leafIterationRecord(mode, sessionId));
      // A second audit of the same iteration finds the row and appends nothing.
      writeFirstRecordExecutor(stateLogPath, EXECUTOR, 1, sessionId);

      const rows = stateRows(stateLogPath);
      const opening = rows.filter((row) => row.type === 'iteration_start' && row.iteration === 1);
      expect(opening).toHaveLength(1);
      expect(opening[0].executor).toMatchObject({ kind: 'cli-claude-code', model: 'claude-opus-4-6' });
      expect(rows.at(-1)).toMatchObject({ type: 'iteration', iteration: 1 });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('refuses a ledger-backed write that names no session id', () => {
    const root = mkdtempSync(join(tmpdir(), 'executor-audit-ledger-'));
    try {
      const runDirectory = join(root, 'review');
      mkdirSync(runDirectory);
      appendThroughGateway('review', runDirectory, runOpenEvent('review', 'session-executor-none'));
      const stateLogPath = join(runDirectory, 'deep-review-state.jsonl');
      const before = readFileSync(stateLogPath, 'utf8');

      expect(() => writeFirstRecordExecutor(stateLogPath, EXECUTOR, 1)).toThrow('needs the run session id');
      expect(readFileSync(stateLogPath, 'utf8')).toBe(before);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
```

The two `it.each` cases open a real run through the gateway, write the executor row, hand the gateway the leaf's iteration record and read the rebuilt state log. On the start code both find no `iteration_start` row and the session-id case does not throw, so all three fail before E14.

#### Count and apply script
Save this outside the repository, for example as `$TMPDIR/c6-edits.cjs`. `node $TMPDIR/c6-edits.cjs $C/plan.md .` from the worktree root counts every E14 to E20 search text and exits 0 only when all sixteen count 1. Adding `--apply` also makes each replacement. Applying the edits by hand from the fences above gives the same files.
```js
// Usage: node c6-edits.cjs <plan.md> <worktree root> [--apply]
const fs = require('node:fs');
const path = require('node:path');

const [planPath, root] = process.argv.slice(2);
const apply = process.argv.includes('--apply');
const prefixes = [
  ['$DL/', '.skilled/skills/system-deep-loop/runtime/'],
  ['$A/', '.skilled/commands/deep/assets/'],
];
const fence = '`'.repeat(3);
const plan = fs.readFileSync(planPath, 'utf8');
const section = plan.slice(plan.indexOf('### C6, Option A'), plan.indexOf('#### E21.'));
const pattern = new RegExp(
  '#### (E\\d+[a-e]?)\\. [^\\n]*\\nFile: `([^`]+)`\\. Search text:\\n'
  + `${fence}text\\n([\\s\\S]*?)${fence}\\nReplacement:\\n${fence}text\\n([\\s\\S]*?)${fence}\\n`,
  'g',
);
let edits = 0;
let bad = 0;
for (const [, id, file, search, replacement] of section.matchAll(pattern)) {
  edits += 1;
  const relative = prefixes.reduce((value, [from, to]) => value.replace(from, to), file);
  const target = path.join(root, relative);
  const text = fs.readFileSync(target, 'utf8');
  const count = text.split(search).length - 1;
  console.log(`${id} count=${count}`);
  if (count !== 1) {
    bad += 1;
    continue;
  }
  if (apply) fs.writeFileSync(target, text.replace(search, () => replacement), 'utf8');
}
console.log(`edits=${edits}`);
process.exit(bad === 0 && edits === 16 ? 0 : 1);
```
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
| `cd $DL && npx vitest run` | `1 failed \| 2893 passed \| 8 skipped (2902)` at planning. At the build start, after the rc.3 repin, it printed `Test Files  173 passed (173)` and `Tests  2894 passed \| 8 skipped (2902)`, so the timing test passed that run | no new failure, more passed. The `fanout-pool.vitest.ts` timing test may fail alone, as at planning |
| `node .skilled/bin/compiled-route-guard.cjs` | `system-deep-loop            fresh`, exit 0 | the same after the commit hook re-mints |
| C6: `cd $DL && npx vitest run tests/unit/executor-audit.vitest.ts`, at `6fb0f2c502` | `75 passed (75)` | `75 passed (75)`, the no-ledger path is unchanged |
| C6: `cd $DL && npx vitest run` on the seven gateway, schema, projection and reducer files named in T022 | `153 passed (153)` (30, 4, 8, 8, 52, 47 and 4) | `153 passed (153)` |
| C6: `cd $DL && npx vitest run tests/unit/executor-audit-ledger-projection.vitest.ts` | the file does not exist | `3 passed (3)`, and `3 failed` with `executor-audit.ts` at its start copy |
| C6: `cd $DL && npx vitest run`, at `6fb0f2c502` | `Test Files  173 passed (173)` and `Tests  2904 passed \| 8 skipped (2912)` | `2907 passed \| 8 skipped (2915)`. The `fanout-pool.vitest.ts` timing test may fail alone |
| C6: `node $DL/scripts/check-ledger-stem-producers.cjs` and `check-protocol-append-sites.cjs` | `"ok":true` and `"violations":[]` each | the same |
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
| Phase 018 at `1bedb33577` | Internal | Green | The search texts would not match |
| The operator's C6 choice | Internal | Green | Option A, chosen on 2026-11-14 |
| A harness login for the manual run | External | Yellow | The manual run is skipped and recorded. The unit tests still cover each change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a harness review fails with a `dispatchEnv` refusal, a live home is swept, or the graph veto lifts on an iteration that did not review its dimension.
- **Procedure**: revert the phase commit with `git revert <sha>` and rerun E9's drift check. C1 to C8 add no stored state. C6 does: a research run started after the build holds `deep_research.iteration_started` events with an `executor` field, which the reverted schema refuses on replay. Finish or archive those runs before a revert of E17, or revert E14 alone so no new rows are written.
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
| Setup | Phase 018 committed | Implementation |
| Implementation | Every search text counting 1, and for C6 the count script exiting 0 | Verification |
| Verification | E1 to E22 | Close |
<!-- /ANCHOR:phase-deps -->

---
