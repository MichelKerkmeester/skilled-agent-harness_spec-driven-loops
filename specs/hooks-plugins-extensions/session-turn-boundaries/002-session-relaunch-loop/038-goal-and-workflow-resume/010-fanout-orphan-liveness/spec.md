---
title: "Feature Specification: Phase 10: fanout-orphan-liveness"
description: "A fan-out re-run marks every lineage that has a started row and no terminal row as orphaned, with no check that its process is gone, and then dispatches every lineage again under the stored session id. A lineage that outlived a hop is therefore run a second time into the same lineage directory while the first process still writes there. No ledger row carries a pid today, so the check needs a new record written after the spawn."
trigger_phrases:
  - "fanout orphan liveness"
  - "phase 10 fanout orphan liveness"
  - "fan-out lineage requeued while alive"
  - "spawned ledger row with pid"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: fanout-orphan-liveness

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 17 |
| **Predecessor** | 009-nudge-note-lines |
| **Successor** | 011-permission-mode-carry |
| **Handoff Criteria** | The double-writer reproduction is recorded in `scratch/repro.txt`, every acceptance row is Met, and `validate.sh 010-fanout-orphan-liveness --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the State a session hop drops: running workers, session names, permission mode and schedules specification.

**Scope Boundary**: Rank 2 of `research/research.md` section 9 and item 1 of its section 7. The fan-out orphan detection in `fanout-pool.cjs`, the one pid-carrying ledger row it needs from `fanout-run.cjs`, and the re-run refusal that turns a live label into no second dispatch. Four files in the Files to Change table are the whole change.

**Dependencies**:
- The reproduction in `REQ-001` shows the double writer before any source edit. If it does not, the phase stops and changes no code.
- The 37 tests in `tests/unit/fanout-pool.vitest.ts` pass at baseline.
- The adapter shim harness in `tests/stress/cli-adapter/fixtures/adapter-fixture.ts:88` can run `fanout-run.cjs` with a fake `opencode`.

**Deliverables**:
- A recorded reproduction of two live writers in one lineage directory, made in a temporary root, never a real packet.
- A `spawned` ledger row with the lineage pid, written after the spawn.
- A liveness read that skips a label whose latest pid still answers.
- A re-run that refuses to dispatch while any lineage from an earlier run is alive.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`detectOrphanedLineages` counts a label as orphaned when it has a `started` row and no later `completed`, `failed` or `orphan_requeued` row, and it never asks whether the process is alive. A re-run calls `markOrphanedLineages` and then dispatches every lineage again under the stored session id, so a lineage that outlived a hop gets a second writer in the same lineage directory. The `started` row fires before the spawn and carries no pid, and the only pid the runner holds lives in an in-memory map that dies with the runner.

### Purpose
A re-run never starts a second process for a lineage whose recorded process is still alive, and a lineage whose process is gone is requeued exactly as today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
rg -n -o --sort path -F -e 'function detectOrphanedLineages' -e 'function markOrphanedLineages' -e "onEvent({ event: 'started'" -e 'const orphanedLineages = markOrphanedLineages(ledgerPath)' -e 'const cliLineages = allLineages' -e 'readStoredLineageSessionId(loopType, lineageDir) ||' -e 'lineageProcessLiveness.set(livenessKey, { alive: true, pid })' -e "detached: process.platform !== 'win32'," -e 'process.kill(-child.pid, signal)' .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:284:function detectOrphanedLineages
.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:307:function markOrphanedLineages
.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:369:onEvent({ event: 'started'
.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:719:process.kill(-child.pid, signal)
.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2113:detached: process.platform !== 'win32',
.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3478:const cliLineages = allLineages
.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3520:const orphanedLineages = markOrphanedLineages(ledgerPath)
.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3620:readStoredLineageSessionId(loopType, lineageDir) ||
.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3921:lineageProcessLiveness.set(livenessKey, { alive: true, pid })

cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts
 Test Files  1 passed (1)
      Tests  37 passed (37)
```

Read from that code: `detectOrphanedLineages` (fanout-pool.cjs:284-305) builds its list from ledger rows alone. The `started` row is emitted at fanout-pool.cjs:369, before the worker runs and so before the spawn. The pid exists only from `onSpawn` (fanout-run.cjs:2121) into the in-memory map at fanout-run.cjs:3921, and no ledger row carries it. The re-run marks orphans at fanout-run.cjs:3520, but the lineage list it dispatches is every lineage (fanout-run.cjs:3478), each under `lineagesDir/<label>` (fanout-run.cjs:3583) with the stored session id (fanout-run.cjs:3620). Lineages spawn detached as process group leaders (fanout-run.cjs:2113) and are killed by group (fanout-run.cjs:719). The double writer itself was never observed: `REQ-001` reproduces it before any edit.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reproduce two live writers in one lineage directory with the adapter shim in a temporary root, before any source edit.
- Write a `spawned` ledger row with `label`, `attempt`, `pid` and `at` from the `onSpawn` callback in `fanout-run.cjs`.
- Add `isLineageAlive` and `detectLiveLineages` to `fanout-pool.cjs`, and make `detectOrphanedLineages` and `markOrphanedLineages` skip a live label.
- Refuse a re-run in `fanout-run.cjs` with exit 3 and a message naming each live label and pid, before any orphan mark or dispatch.
- Add the failing unit tests and one end-to-end refusal test before the source edits.

### Out of Scope
- The nudge wording about stopping the runner - phase 009 owns it.
- `fanout-run.cjs` signal handling (`installFanoutSignalHandlers`, `stopActiveLineageProcesses`) - the brief keeps it out beyond what the liveness record needs.
- Pid reuse protection through process start time - the research names it as a limit of this change, and it needs a platform-specific read.
- Skipping a live label and dispatching the rest - decision D3 in `goal.md` chooses refusal of the whole run.
- An override flag for a refused run - the open question in `goal.md` asks the operator first.
- Windows liveness - lineages are not detached there (fanout-run.cjs:2113), and no Windows run is planned.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs` | Modify | Add `isLineageAlive` and `detectLiveLineages`, and skip a live label in `detectOrphanedLineages` and `markOrphanedLineages`. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Append a `spawned` row from `onSpawn`, and refuse a re-run while a lineage is live. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-pool.vitest.ts` | Modify | Add the liveness, skip and guard tests. |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts` | Modify | Add the end-to-end re-run refusal test. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The double writer is reproduced before any source edit. `scratch/repro-double-writer.cjs` creates a temporary root with `mkdtemp` under the prefix `fanout-repro-`, installs the `opencode` shim from `tests/stress/cli-adapter/shims/` in mode `timeout`, runs `fanout-run.cjs` for one `cli-opencode` lineage against `specs/fanout-repro` inside that root, waits for the shim pid file, sends SIGKILL to the first runner, then runs the same command again. It prints the capture count, each shim pid with its `process.kill(pid, 0)` answer, and every `orphan_requeued` row of the ledger, then kills both shim process groups and removes the root. The output is saved in `scratch/repro.txt`. The claim holds when it shows two shim pids for the same label, both alive, and one `orphan_requeued` row. If it does not hold, the phase stops and changes no code. |
| REQ-002 | `fanout-run.cjs` appends one ledger row `{ event: 'spawned', label, attempt, pid, at, status: 'running' }` through `appendFanoutStatusLedger` from the `onSpawn` callback at fanout-run.cjs:3920, beside the existing in-memory set. The end-to-end test in `REQ-006` reads it back from the ledger. |
| REQ-003 | `fanout-pool.cjs` exports `isLineageAlive(pid, { kill })`. It returns `false` for a pid that is not a positive integer. On a platform other than Windows it probes the process group with `kill(-pid, 0)` and then the pid with `kill(pid, 0)`. No throw or an `EPERM` error means alive, `ESRCH` on both means dead. Test `isLineageAlive reads ESRCH as dead and EPERM as alive` in `tests/unit/fanout-pool.vitest.ts` injects `kill` and asserts each answer. Today the function does not exist. |
| REQ-004 | `fanout-pool.cjs` exports `detectLiveLineages(records, { isAlive })`. For each label whose latest `started` row has no later terminal row, it reads the latest `spawned` row after that `started` row and returns `{ label, pid, started_at_iso }` when `isAlive(pid)` is `true`. A label with no `spawned` row is never live. Test `detectLiveLineages returns a started label whose spawned pid is alive` asserts one live label from rows with an injected `isAlive`, including a label retried as `attempt: 2` whose first `spawned` pid is dead and whose second is alive. Today the function does not exist. |
| REQ-005 | `detectOrphanedLineages(records, { isAlive })` and `markOrphanedLineages(ledgerPath, { now, isAlive })` leave a live label out. `isAlive` defaults to `isLineageAlive`. Test `markOrphanedLineages leaves a live lineage unmarked` starts a real detached `node -e 'setInterval(() => {}, 1000)'` child, writes its `started` and `spawned` rows, and asserts the call returns `[]` and the ledger gains no `orphan_requeued` row. Today the call returns the label and writes the row. |
| REQ-006 | `fanout-run.cjs` calls `detectLiveLineages` on the ledger before the call at fanout-run.cjs:3520. When it returns any label, the run throws an input error, so the process exits 3 with a JSON `status: 'error'` whose message names each live label and pid. No `orphan_requeued` row and no new `started` row is written, and no lineage is dispatched. Test `refuses a re-run while a lineage from the earlier run is alive` in `tests/stress/cli-adapter/fanout.vitest.ts` repeats the `REQ-001` sequence and asserts exit 3, one shim capture, a `spawned` row with the first shim pid, and no `orphan_requeued` row. Today the second run dispatches a second shim. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | A lineage whose process is gone is still requeued as today. Test `markOrphanedLineages requeues a lineage whose spawned pid has exited` writes `started` and `spawned` rows for a child that has exited and asserts one `orphan_requeued` row. Test `a label with no spawned record is still an orphan` asserts that a ledger written before this change keeps today's result. The three existing orphan tests in `tests/unit/fanout-pool.vitest.ts` (`counts orphan_requeued rows toward retry credit`, `sums retry_scheduled and orphan_requeued rows`, `detects and marks started lineages without terminal ledger events`) keep their assertions and pass. |
| REQ-008 | The whole runtime unit suite and the fan-out stress file pass after the change. `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/observability-events.vitest.ts tests/stress/cli-adapter/fanout.vitest.ts` from the runtime root exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/repro.txt` holds the before-change run and shows two live shim pids for one label and one `orphan_requeued` row.
- **SC-002**: `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts` from the runtime root exits 0 with 42 tests passed, the 37 at baseline plus the five new ones.
- **SC-003**: `npx vitest run --no-coverage tests/stress/cli-adapter/fanout.vitest.ts -t 'refuses a re-run while a lineage from the earlier run is alive'` from the runtime root exits 0.
- **SC-004**: `node specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness/scratch/repro-double-writer.cjs` run again after the change shows one shim pid, a second runner exit code of 3 and no `orphan_requeued` row, saved in `scratch/repro-after.txt`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The adapter shim harness runs `fanout-run.cjs` with a fake `opencode` | Without it the reproduction and the refusal test need a real executor | `tests/stress/cli-adapter/fanout.vitest.ts:63` already drives the runner this way. If the shim is refused, record why in `goal.md` and stop |
| Risk | Pid reuse makes a dead lineage look alive and blocks every re-run | Medium | The refusal names the pid and label so the operator can check it. The open question in `goal.md` asks whether an override is wanted |
| Risk | The runner is killed between spawn and the `spawned` row, so a live lineage has no pid on disk | Low | The label is then treated as today, an orphan. The window is one synchronous append after `spawn` returns |
| Risk | A new ledger event confuses a ledger reader | Low | `statusForLedgerEvent` honors the explicit `status` (fanout-run.cjs:424), `updateLineageSnapshot` ignores unknown events, and `observability-events.vitest.ts` runs in `REQ-008` |
| Risk | A test passes for the wrong reason | High | Each must-fail test holds a recorded failing run in `scratch/red.txt` before its source edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The liveness read adds at most two signal-0 `process.kill` calls per open label at the start of a run.
- **NFR-P02**: N/A: the dispatch path gains one ledger append per spawn and nothing else.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: Signal 0 sends nothing to the probed process. No other signal is added.

### Reliability
- **NFR-R01**: A re-run never dispatches a label whose recorded process group or pid is alive.
- **NFR-R02**: A ledger written before this change gives the same orphan list as today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an absent or empty ledger returns no live and no orphaned label, as `readLedgerRecords` does today (fanout-pool.cjs:235-238).
- Maximum input: a label retried several times reads only the `spawned` row after its latest `started` row, so an old dead attempt never hides a live one.
- Failure path: a live label makes the run exit 3 with a JSON error naming the label and pid, before any ledger write.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two source files and two test files, one new ledger event |
| Risk | 9/25 | A shared ledger format gains an event and a re-run can now refuse |
| Research | 6/20 | The double writer is inferred and needs a live reproduction first |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should a re-run refused by a reused pid have an override? Answered by the operator on 2026-11-13: no. The refusal names the label and the pid, and no override is built.
<!-- /ANCHOR:questions -->

---
