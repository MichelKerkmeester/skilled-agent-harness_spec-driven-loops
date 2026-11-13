---
title: "Implementation Plan: Phase 10: fanout-orphan-liveness"
description: "Reproduce the double writer with the adapter shim first, then record each lineage pid in a spawned ledger row, read it back with a signal-0 probe, and refuse a re-run while any lineage is alive. Every source edit follows a failing test."
trigger_phrases:
  - "fanout orphan liveness plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: fanout-orphan-liveness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS scripts, TypeScript tests |
| **Framework** | None, Node built-in modules |
| **Storage** | The JSON-lines status ledger `orchestration-status.log` under the base artifact dir (fanout-run.cjs:3366) |
| **Testing** | Vitest 4 from the runtime root `.skilled/skills/system-deep-loop/runtime` |

### Overview
The phase first proves the double writer with the existing adapter shim in a temporary root. It then adds one `spawned` ledger row that carries the lineage pid, a liveness read in `fanout-pool.cjs` that skips a label whose pid still answers, and a refusal in `fanout-run.cjs` that stops a re-run before any orphan mark or dispatch. The proof is the before and after reproduction, five unit tests, one end-to-end test and the named suites.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `scratch/repro.txt` shows two live shim pids for one label before any source edit
- [ ] `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts` from the runtime root prints `37 passed` at baseline

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/observability-events.vitest.ts tests/stress/cli-adapter/fanout.vitest.ts` from the runtime root exits 0
- [ ] `scratch/repro-after.txt` shows one shim pid and a second runner exit code of 3
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/010-fanout-orphan-liveness --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ledger-recorded liveness guard.

### Key Components
- **`scripts/fanout-run.cjs`**: owns the spawn and the re-run start. It gains the `spawned` row in `onSpawn` (fanout-run.cjs:3920) and the refusal before the orphan mark (fanout-run.cjs:3520). Without the row there is no pid on disk to check, because the `started` row fires before the spawn (fanout-pool.cjs:369).
- **`scripts/fanout-pool.cjs`**: owns the ledger reads. It gains `isLineageAlive` and `detectLiveLineages`, and `detectOrphanedLineages` (fanout-pool.cjs:284) and `markOrphanedLineages` (fanout-pool.cjs:307) skip a live label. Without the skip a direct caller of `markOrphanedLineages` still charges a retry to a live lineage.

### Data Flow
The pool emits `started`, the worker spawns the lineage detached, and `onSpawn` appends `spawned` with the pid. A later run reads the ledger, finds each open label, takes the pid from the `spawned` row after its latest `started` row and probes the group and the pid with signal 0. Any live label stops the run with exit 3 before the orphan mark. Labels with no `spawned` row or a dead pid flow into `markOrphanedLineages` and are requeued as today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `detectOrphanedLineages` in `fanout-pool.cjs` | Builds the open-label list from ledger rows alone | update | `npx vitest run --no-coverage tests/unit/fanout-pool.vitest.ts` |
| `markOrphanedLineages` in `fanout-pool.cjs` | Writes `orphan_requeued` for every open label | update | Test `markOrphanedLineages leaves a live lineage unmarked` |
| `onSpawn` in the `fanout-run.cjs` worker | Holds the pid in memory only | update | Test `refuses a re-run while a lineage from the earlier run is alive` reads the `spawned` row |
| The re-run start in `fanout-run.cjs` | Marks orphans, then dispatches every lineage | update | The same end-to-end test asserts exit 3 and one capture |
| `readRetryCountsFromLedger` in `fanout-pool.cjs` | Charges a retry per `orphan_requeued` row | unchanged | Test `counts orphan_requeued rows toward retry credit` |
| `statusForLedgerEvent` in `fanout-run.cjs` | Maps a ledger row to a status, honoring an explicit `status` (fanout-run.cjs:424) | not a consumer | The `spawned` row carries `status: 'running'` |
| `eventStatus` in `lib/deep-loop/observability-events.cjs` | Maps known events and returns `null` for others (observability-events.cjs:42-52) | unchanged | `npx vitest run --no-coverage tests/unit/observability-events.vitest.ts` |
| `updateLineageSnapshot` in `fanout-run.cjs` | Updates snapshots for known events only | not a consumer | `rg -n "event.event === 'spawned'" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` prints no line |

Required inventories:
- Finding class: `class-of-bug`. The open-label rule trusts the ledger with no process check, and the dispatch list ignores the mark.
- Same-class producers: `rg -n "event: 'started'|event: 'spawned'" .skilled/skills/system-deep-loop/runtime/scripts` lists the one `started` producer before the edit and both producers after it.
- Consumers of changed symbols: `rg -n 'markOrphanedLineages|detectOrphanedLineages|detectLiveLineages|isLineageAlive' .skilled --glob '!**/node_modules/**'` lists `fanout-run.cjs` and `tests/unit/fanout-pool.vitest.ts` only.
- Matrix axes: ledger shape (no `spawned` row, `spawned` row), process state (alive, exited, `EPERM`), attempt (single, retried) and run (first, re-run with runner alive, re-run with runner killed). The end-to-end test covers the killed-runner row, the unit tests cover the rest.
- Algorithm invariant: a re-run dispatches no lineage while the pid in the `spawned` row after that label's latest `started` row answers signal 0, and a ledger with no `spawned` row gives today's orphan list.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the test baseline and runs the double-writer reproduction into `scratch/repro.txt`, stopping the phase if it does not reproduce. Implementation adds each failing test, then the `fanout-pool.cjs` liveness functions, then the `spawned` row and the refusal in `fanout-run.cjs`. Verification reruns the reproduction into `scratch/repro-after.txt`, the named suites and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `isLineageAlive`, `detectLiveLineages`, the skip in `detectOrphanedLineages` and `markOrphanedLineages` | Vitest, `tests/unit/fanout-pool.vitest.ts` |
| Integration | A re-run of `fanout-run.cjs` against a live shim lineage | Vitest, `tests/stress/cli-adapter/fanout.vitest.ts` with the adapter shim |
| Manual | The before and after reproduction | `node scratch/repro-double-writer.cjs` |

Each must-fail test runs first from the runtime root as `npx vitest run --no-coverage <file> -t '<title>'` and must exit 1 with its assertion in the failure, saved to `scratch/red.txt`. After the source edit the same command must exit 0, saved to `scratch/green.txt`. The two guard tests may pass at once because they pin today's behavior.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Adapter shim harness (`tests/stress/cli-adapter/fixtures/adapter-fixture.ts:88`) | Internal | Green | No reproduction and no end-to-end test without a real executor |
| Vitest in the runtime `node_modules` | Internal | Green | No test can run |
| POSIX signal 0 on macOS and Linux | External | Green | The liveness read has no answer |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fan-out run that should start is refused with no live lineage, or a named suite fails after the change.
- **Procedure**: revert the phase's one local commit. The `spawned` rows already written stay in old ledgers and are ignored by the reverted code, so no data is migrated.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The baseline run and the reproduction | Implementation |
| Implementation | A reproduced double writer in `scratch/repro.txt` | Verification |
| Verification | Every source edit green | Close |
<!-- /ANCHOR:phase-deps -->

---
