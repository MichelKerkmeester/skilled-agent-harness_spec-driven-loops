---
title: "Implementation Plan: Self-Healing Model Consolidation"
description: "Convert runGlobalOrphanSweep and the marker-triggered scoped-delete branch from direct deleters into suspect-queue enqueuers, leaving runSuspectConfirmation as the sole confirm-and-tombstone site. Add a suspect-queue size cap/metric and resolve the busy-timeout and phase-order questions the new callers raise."
trigger_phrases:
  - "self-healing model consolidation"
  - "suspect queue sole confirmation funnel"
  - "runSuspectConfirmation one confirmer"
  - "orphan sweep discoverer not deleter"
  - "drift suspect queue size cap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation"
    last_updated_at: "2026-07-10T09:45:40.000Z"
    last_updated_by: "opencode"
    recent_action: "Implemented all five architectural decisions and completed verification"
    next_safe_action: "No further implementation work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Self-Healing Model Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, `better-sqlite3`, part of the spec-kit MCP server (`mcp_server/handlers`, `mcp_server/lib/storage`) |
| **Framework** | None new — modifies existing closures inside `handleMemoryIndexScan` (`memory-index.ts`) and existing functions in `memory-drift-healing.ts` |
| **Storage** | The existing `config` table (`key TEXT PRIMARY KEY, value TEXT`), already holding `MEMORY_DRIFT_SUSPECT_QUEUE_KEY` and `ORPHAN_SWEEP_CURSOR_KEY`. No new table or column. |
| **Testing** | vitest against a real SQLite fixture DB, following the existing pattern in `orphan-sweep-time-budget-and-refresh.vitest.ts` and `suspect-confirmation.vitest.ts` (drive the real closures via the exported scan test seam, mock only lease/checkpoint/embedding-profile scaffolding) |

### Overview

No new module. Two existing call sites inside `memory-index.ts` stop calling the delete primitives directly
and instead call the existing `appendMemoryDriftSuspects` — the same function Layer 1's query-time filter
already calls. `runSuspectConfirmation` is otherwise unchanged: it remains the one place that reads the
queue, rebuilds a fresh existence cache, and calls `deleteIndexedRecordIds`. The two watch-list items
(suspect-queue size cap/metric, busy-timeout reconsideration) are additive changes to
`memory-drift-healing.ts` and/or `memory-search.ts` that make the now-larger set of callers safe, not new
subsystems.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md:59-223`)
- [x] Success criteria measurable (`spec.md:213-223`)
- [x] Dependencies identified (`spec.md:229-236`; 017/018 were complete and 019 had no overlapping source changes)

### Definition of Done
- [x] All acceptance criteria in spec.md REQ-001 through REQ-007 met (`implementation-summary.md:68-94`)
- [x] Existing orphan-sweep and suspect-confirmation vitest suites updated to assert the new
       discover-then-confirm flow, not direct deletion, and passing
       (`npx vitest run ...`: 26/26 tests)
- [x] Docs updated (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Three candidate discoverers, one confirmer. Every discovery path that currently decides "this row's file is
gone" converges on `appendMemoryDriftSuspects(database, ids)` instead of on `deleteIndexedRecordIds(ids)`
directly. `runSuspectConfirmation` is the only code path allowed to call `deleteIndexedRecordIds` for
suspect-sourced rows (the out-of-scope full-corpus `filesToDelete` path keeps its own direct call, since it
is a ground-truth corpus diff, not a candidate).

### Decision 1: orphan-sweep conversion is a one-line substitution at the call site, not a rewrite of the sweep

`runGlobalOrphanSweep` (`memory-index.ts:785-853`) keeps its existing pagination, time-budget, and
cursor-persistence logic untouched — `sweepOrphanIndexRows()` still determines *which* ids are orphan
candidates. Only the line that acts on the result changes: `deleteIndexedRecordIds(sweep.orphanRecordIds ?? [])`
(`:815`) becomes `appendMemoryDriftSuspects(database, sweep.orphanRecordIds ?? [])`. The function's return
shape (`OrphanSweepDeleteResult`: `swept, failed, scannedRows, nextCursor, actions`) needs a field-meaning
change, not a shape change: `swept` no longer means "rows deleted this call," it means "candidates enqueued
this call" (or the field is renamed/split — see Phase 2). `failed`/`actions` for an *enqueue* failure look
different from a *delete* failure (no `StatediffAction` from an enqueue; the shared delete's statediff
actions now only originate from `runSuspectConfirmation`'s own delete calls).

### Decision 2: the marker-triggered scoped-delete branch needs a path-to-id resolution step it does not have today

Unlike orphan sweep (which already produces `orphanRecordIds: number[]`), the scoped-delete branch
(`memory-index.ts:1059-1069`) works in file-path space: `categorized.toDelete` is `string[]`, and
`deleteStaleIndexedRecords(paths)` internally calls `incrementalIndex.listIndexedRecordIdsForDeletedPaths(paths)`
before calling `deleteIndexedRecordIds` (`:782`). The conversion calls that same
`listIndexedRecordIdsForDeletedPaths` helper directly at the scoped-delete call site, then passes the
resulting ids to `appendMemoryDriftSuspects` instead of routing through `deleteStaleIndexedRecords`. This
reuses the exact resolver `deleteStaleIndexedRecords` already depends on — no new path-to-id logic.

### Decision 3: phase order for orphan-discovered suspects (REQ-006) — recommended default is next-cycle confirmation

Today, within a single `handleMemoryIndexScan` invocation, `runGlobalOrphanSweep` runs at `onPhase`
`'orphan-sweep'` immediately before `runSuspectConfirmation` at `'suspect-confirmation'`
(`memory-index.ts:1054-1055` for the `files.length === 0` branch, `:1542,1549` for the full-scan branch). If
that call order is left unchanged, an id `appendMemoryDriftSuspects`-ed by orphan sweep would be
`readMemoryDriftSuspects`-ed and immediately re-checked by the very next line of the same function call —
technically a "confirmation," but with zero wall-clock separation from the original detection, which is the
opposite of the transient-absence protection Layer 1's design explicitly wanted (`011-automatic-drift-
self-healing/spec.md:158-159`). The recommended default is to **swap the two phase calls** so
`runSuspectConfirmation` runs *before* `runGlobalOrphanSweep` within one invocation: any suspect already
queued from a *prior* scan (Layer 1's trickle, or a prior scan's own orphan/scoped-delete enqueues) gets
confirmed with real time separation, and this cycle's fresh orphan-sweep enqueues wait for the *next*
invocation's confirmation pass. This is a two-line swap (`memory-index.ts:1054-1055` and `:1542,1549`), not a
new scheduling mechanism. The marker-triggered scoped-delete branch does not have this problem today: its
enqueue happens *after* the same call's `runSuspectConfirmation` line already ran (`:1055` runs before
`:1063`), so those suspects already get next-cycle confirmation for free once REQ-002 lands — no reorder
needed for that path.

### Decision 4: suspect-queue size cap/metric (REQ-005) — cap enforcement plus a surfaced count, not a new table

`appendMemoryDriftSuspects` (`memory-drift-healing.ts:106-131`) already builds a `Map<number, MemoryDriftSuspect>`
before writing. The cap check is a length check against that merged map immediately before `writeSuspects`
(`:61-73`): if the merged size exceeds the configured cap, log a warning and either (a) drop the
lowest-priority entries (oldest `firstSeenAt`, since those have waited longest and are most likely to be
confirmable soon anyway) or (b) refuse the write of the excess and let the next scan's orphan-sweep page
re-discover them naturally on its own cursor-resume. Whichever is chosen, the queue's resulting size is
returned up through `runGlobalOrphanSweep`'s and the scoped-delete branch's results so it can be threaded
into the scan-result envelope per NFR-O01, alongside the existing `orphanSwept`/`suspectTombstoned`/
`suspectCleared`/`suspectFailed` fields (`memory-index.ts:1543-1552`). No schema change: the cap is enforced
in the same JSON blob under the same `config` key.

### Decision 5: busy-timeout policy (REQ-007) — reconsider, do not blindly reuse

`DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS = 25` (`memory-search.ts:224`) is local to `memory-search.ts` and only
`applyQueryTimeExistenceFilter` (`:372-441`) uses it, wrapping its single `appendMemoryDriftSuspects` call in
a temporarily-shortened `busy_timeout` (`:426-436`) specifically because that call sits on a request-response
hot path where blocking is worse than a dropped enqueue (a missed Layer 1 candidate is just re-detected next
query). The two new callers run inside `handleMemoryIndexScan`, which already holds/serializes DB access
across a whole scan and is not latency-sensitive in the same way — a held write lock there is more likely to
be another concurrent scan or a normal write, and a longer wait is more likely to succeed and less costly to
wait for than in the read-hot-path case. The plan's default: give `runGlobalOrphanSweep`'s and the
scoped-delete branch's `appendMemoryDriftSuspects` calls the connection's normal `busy_timeout` (no override),
and leave `memory-search.ts`'s 25ms override exactly as-is for its one existing caller. This is a
caller-local decision (no shared constant needs to move), so it does not force Decision 4's cap logic to
also live in a new shared module — `memory-drift-healing.ts` remains the single function both callers use,
each free to wrap it in its own timeout policy or none.

### Implemented Outcomes

- **Decision 1:** `OrphanSweepDeleteResult` now reports `enqueued` and `queueSize` rather than deleted rows;
  `memory-index.ts:265-271,819-861` catches enqueue failures without aborting the scan.
- **Decision 2:** `memory-index.ts:1074-1081` resolves scoped candidate paths with the existing index helper and
  enqueues their ids.
- **Decision 3:** confirmation is first in both paths at `memory-index.ts:1064-1065,1565-1576`; this is the
  recommended next-cycle default, proven by vitest at
  `orphan-sweep-time-budget-and-refresh.vitest.ts:131-172`.
- **Decision 4:** `MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE = 1_000` at
  `memory-drift-healing.ts:10`; excess new ids are deferred while current entries remain, and
  `suspectQueueSize` is surfaced at `memory-index.ts:1164,1576`.
- **Decision 5:** `memory-search.ts:224,421-437` remains unchanged for its sole 25ms hot-path caller. The
  new scan callers do not override `busy_timeout`; `suspect-confirmation.vitest.ts:252-289` verifies the
  scoped path waits at least 280ms.

### Key Components (unchanged / reused verbatim)

- **`appendMemoryDriftSuspects` / `readMemoryDriftSuspects` / `removeMemoryDriftSuspects`**
  (`memory-drift-healing.ts:76,106,134`): the shared queue read/write/merge primitives. Only
  `appendMemoryDriftSuspects` gains the size-cap check (Decision 4); the other two are untouched.
- **`deleteIndexedRecordIds`** (`memory-index.ts:698-775`): the shared delete primitive. Unchanged. After
  this packet it has exactly two callers: `runSuspectConfirmation` and the out-of-scope full-corpus
  `filesToDelete` path.
- **`buildPathExistenceCache` / `cachedPathExists`** (`incremental-index.ts:194` and its export): the shared
  existence-check primitives, already used identically by Layer 1's query-time filter and by
  `runSuspectConfirmation`. Unchanged, reused as-is.

### Data Flow (post-consolidation)

A discoverer (Layer 1 query-time filter, Layer 3 orphan sweep, or Layer 2 marker-triggered scoped scan)
determines candidate ids by whatever detection method is native to it (top-k existence check, orphan-sweep
scan, or git-diff-derived path resolution) and calls `appendMemoryDriftSuspects`. It never calls
`deleteIndexedRecordIds` itself. On a later `runSuspectConfirmation` pass (next scan invocation for
orphan-sweep and scoped-delete candidates per Decision 3; already-next-cycle for Layer 1's trickle as today),
the queue is read, a fresh existence cache is built across all queued ids at once, and each id is either
cleared (file reappeared) or tombstoned via `deleteIndexedRecordIds` (file still absent).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runGlobalOrphanSweep` (`memory-index.ts:785-853`) | Discovers AND deletes orphan candidates | Discovers and enqueues only (Decision 1) | `orphan-sweep-time-budget-and-refresh.vitest.ts` updated: asserts enqueue into `readMemoryDriftSuspects`, not immediate row deletion |
| Marker-triggered scoped-delete branch (`memory-index.ts:1059-1069`) | Discovers AND deletes scoped-scan stale candidates | Resolves ids and enqueues only (Decision 2) | A new or extended test on the `files.length === 0` / `scopedScanPaths` branch asserts enqueue, not immediate deletion |
| `runSuspectConfirmation` (`memory-index.ts:862-921`) | Confirms and tombstones Layer 1's suspects | Unchanged logic; now the sole confirmer for all three layers | `suspect-confirmation.vitest.ts` extended with fixtures seeded via the new callers' enqueue path, not only via `appendMemoryDriftSuspects` called directly |
| Phase order in `handleMemoryIndexScan` (`memory-index.ts:1054-1055`, `:1542,1549`) | orphan-sweep runs immediately before suspect-confirmation | Swapped per Decision 3 (confirmation before orphan-sweep) | A test asserts an orphan-sweep-enqueued id is NOT tombstoned within the same invocation that enqueued it, only in a subsequent one |
| `appendMemoryDriftSuspects` (`memory-drift-healing.ts:106-131`) | Unbounded merge-and-write | Size cap or metric added (Decision 4) | A test seeds a backlog at/over the cap and asserts the boundary behavior; scan-result envelope carries the resulting queue size |
| `DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS` (`memory-search.ts:224,429`) | Sole existing override, tuned for the read-hot-path caller | Left as-is for its existing caller; new callers use the connection's normal timeout (Decision 5) | A lock-contention test on at least one new caller confirms it does not fast-fail at 25ms |

Required inventories:
- Same-class producers: `rg -n "deleteIndexedRecordIds|deleteStaleIndexedRecords|appendMemoryDriftSuspects" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts .opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` — re-run after each phase to confirm the call-site count matches REQ-003's expectation (exactly two `deleteIndexedRecordIds` callers left).
- Consumers of changed surfaces: `rg -n "runGlobalOrphanSweep|runSuspectConfirmation|OrphanSweepDeleteResult|SuspectConfirmationResult" .opencode/skills/system-spec-kit/mcp_server` to find every test and caller that reads the result shape, since `OrphanSweepDeleteResult`'s field meaning changes (Decision 1).
- Matrix axes: discoverer (Layer 1 / Layer 2 marker / Layer 3 orphan-sweep) x outcome (still-missing → tombstoned, reappeared → cleared, queue-at-cap → capped/metric-emitted).
- Algorithm invariant: no code path outside `runSuspectConfirmation` (and the out-of-scope full-corpus path)
  calls `deleteIndexedRecordIds` after this packet — the grep in REQ-003's acceptance criteria is the
  mechanical proof.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-verify every file:line citation in spec.md and this plan against the live tree (017/018/019 may
      have landed and shifted line numbers by the time this phase starts)
- [ ] Confirm `listIndexedRecordIdsForDeletedPaths` is safely callable standalone from the scoped-delete
      branch (it already is, via `deleteStaleIndexedRecords`'s own internal call at `:782`)
- [ ] Stand up a synthetic orphan backlog fixture and a synthetic git-hook-marker-driven scoped-delete
      fixture, reusing the existing patterns in `orphan-sweep-time-budget-and-refresh.vitest.ts` and
      `memory-drift-healing.vitest.ts`

### Phase 2: Core Implementation
- [ ] Convert `runGlobalOrphanSweep`'s delete call to an enqueue call (Decision 1); adjust
      `OrphanSweepDeleteResult`'s field semantics or add a distinct enqueue-count field
- [ ] Convert the marker-triggered scoped-delete branch to resolve paths to ids and enqueue (Decision 2)
- [ ] Swap the orphan-sweep / suspect-confirmation phase order per Decision 3's recommended default, or
      implement and document the accepted-same-cycle alternative if that is chosen instead
- [ ] Add the suspect-queue size cap and/or metric to `appendMemoryDriftSuspects` (Decision 4); thread the
      resulting count into the scan-result envelope per NFR-O01
- [ ] Decide and implement the busy-timeout policy for the two new callers (Decision 5)

### Phase 3: Verification
- [ ] Update `orphan-sweep-time-budget-and-refresh.vitest.ts` to assert enqueue-then-later-confirm instead
      of immediate deletion
- [ ] Extend `suspect-confirmation.vitest.ts` with fixtures seeded via the new discoverer paths
- [ ] Add a phase-order test proving the chosen Decision 3 behavior (same-cycle vs. next-cycle)
- [ ] Add a size-cap boundary test (at-cap and one-over-cap) for `appendMemoryDriftSuspects`
- [ ] Add a lock-contention test for at least one new caller's busy-timeout behavior
- [ ] `rg -n "deleteIndexedRecordIds\("` confirms exactly two call sites remain (REQ-003)
- [ ] Documentation updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Size-cap boundary on `appendMemoryDriftSuspects`; busy-timeout behavior for new callers | vitest |
| Integration | Real-SQLite-fixture flows for orphan-sweep enqueue-then-confirm and scoped-delete enqueue-then-confirm, following the existing `orphan-sweep-time-budget-and-refresh.vitest.ts` / `suspect-confirmation.vitest.ts` pattern (real closures via the exported scan test seam, only lease/checkpoint/embedding-profile scaffolding mocked) | vitest |
| Regression | Full existing suite for `memory-drift-healing.vitest.ts`, `memory-search-drift-suspect-write-timeout.vitest.ts`, `startup-checks-processing-marker-sigkill.vitest.ts` — none of these are expected to need behavior changes, but all exercise code paths this packet touches | vitest |
| Manual | A local scan against a workspace with a real orphaned memory row and a real git-hook-driven rename/delete, observed across two scan invocations | local shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 017/018/019 sequencing | Internal | Complete/no overlap | Fresh `rg -n` checks re-verified current seams before implementation; no overlapping orphan-sweep or confirmation change was found. |
| `deleteIndexedRecordIds`, `appendMemoryDriftSuspects`, `buildPathExistenceCache`, `listIndexedRecordIdsForDeletedPaths` (all already shipped) | Internal | Green | Nothing to build if blocked — these are reused verbatim, not extended in shape |
| `config` table (already exists) | Internal | Green | No schema dependency risk |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A discoverer's enqueue-only conversion causes confirmed-gone rows to linger in search results
  or the index longer than acceptable, or the phase-order swap causes a regression in Layer 1's existing
  suspect-confirmation timing.
- **Procedure**: Revert the two call-site conversions in `memory-index.ts` via git — `runGlobalOrphanSweep`
  and the scoped-delete branch return to calling the delete primitives directly. The suspect-queue size cap
  and busy-timeout changes are additive and safe to leave in place independently of the revert, but can be
  reverted in the same git revert if bundled in one commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup / re-verify + fixtures) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 017/018/019 landing (external) | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-7 hours |
| Verification | Med | 3-5 hours |
| **Total** | | **8-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fixture-backed tests cover both new enqueue paths before any apply against a real workspace DB
- [ ] Phase-order decision (Decision 3) documented in implementation-summary.md before Phase 2 starts, not
      discovered as a side effect during Phase 3

### Rollback Procedure
1. Revert the two `memory-index.ts` call-site conversions via git
2. Revert `appendMemoryDriftSuspects`'s size-cap change if it is implicated, via git
3. Run the existing orphan-sweep and suspect-confirmation vitest suites to confirm pre-change behavior is
   restored
4. No stakeholder notification needed — internal self-healing infra, no external contract change

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The suspect queue and orphan-sweep cursor both already exist in the `config`
  table; this packet changes who writes to them, not their shape.
<!-- /ANCHOR:enhanced-rollback -->
