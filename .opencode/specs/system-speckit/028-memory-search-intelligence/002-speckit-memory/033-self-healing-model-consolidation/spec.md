---
title: "Feature Specification: Self-Healing Model Consolidation [template:level_2/spec.md]"
description: "Of the self-healing system's three discovery layers, only Layer 1 (query-time existence filtering) is a pure discoverer that enqueues into the shared suspect queue for a later confirmed look. Layer 3's own orphan sweep and Layer 2's marker-triggered scoped delete each independently decide-and-delete on first detection, bypassing the confirm-and-tombstone step Layer 3 already owns for Layer 1's suspects."
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
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation"
    last_updated_at: "2026-07-10T09:45:40.000Z"
    last_updated_by: "opencode"
    recent_action: "Implemented and verified the sole suspect-confirmation funnel"
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
# Feature Specification: Self-Healing Model Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `023-self-healing-model-consolidation` |
| **Verdict** | COMPLETE — all five decisions implemented and verified |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../032-new-feature-research-build/spec.md |
| **Successor** | ../034-reranker-research/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The self-healing system ships in three layers (`011-automatic-drift-self-healing/spec.md` section 3), and its own
design already establishes the correct model for one of them: Layer 1 (query-time existence filtering,
`memory-search.ts:372-441`) never deletes on first miss. It appends the excluded row's id to a shared suspect
queue (`appendMemoryDriftSuspects`, `mcp_server/lib/storage/memory-drift-healing.ts:106`) and Layer 3 is the
layer documented to own "confirming Layer 1's suspect queue: a suspect row that is still missing at the next
full or scoped scan is tombstoned" (`011-automatic-drift-self-healing/spec.md:187-190`). That confirm-and-tombstone
step is `runSuspectConfirmation` (`mcp_server/handlers/memory-index.ts:862-921`), which reads the queue
(`readMemoryDriftSuspects`, `memory-drift-healing.ts:76`), re-checks each row's path existence with a fresh
`buildPathExistenceCache` (`incremental-index.ts:194`, called at `memory-index.ts:888`), and only then calls
the one shared delete path, `deleteIndexedRecordIds` (`memory-index.ts:698-775`).

The other two layers do not go through that funnel, even though nothing prevents them from doing so:

- **Layer 3's own orphan sweep decides and deletes on first detection.** `runGlobalOrphanSweep`
  (`memory-index.ts:785-853`) pages through `sweepOrphanIndexRows()` and calls
  `deleteIndexedRecordIds(sweep.orphanRecordIds ?? [])` directly at `memory-index.ts:815`, in the same loop
  iteration that discovered the candidates. There is no second, later look before the row is gone — Layer 3
  confirms Layer 1's candidates but not its own.
- **Layer 2's marker-triggered scoped scan decides and deletes on first detection.** When the git-hook dirty
  marker is consumed at boot (`consumeMemoryDriftDirtyMarker`, `startup-checks.ts:254-324`, wired at
  `context-server.ts:2237-2256`), it drives a scoped `memory_index_scan` whose `files.length === 0` branch
  calls `categorizeFilesForIndexing([], { staleCandidatePaths: scopedScanPaths })` and then
  `deleteStaleIndexedRecords(categorized.toDelete)` directly (`memory-index.ts:1059-1069`). The categorizer's
  own field name — `staleCandidatePaths` — says these are candidates, but the scoped-scan branch treats them
  as final. The candidate signal itself comes from a committed git diff (`.opencode/scripts/git-hooks/lib/
  memory-drift-marker.sh:16`, `git diff-tree --name-status`), which can be stale relative to an uncommitted
  local revert, a detached checkout, or a worktree the hook fired in but the running server reads a different
  tree from — exactly the kind of transient mismatch the suspect-queue's "exclude now, confirm later" model
  exists to absorb (`011-automatic-drift-self-healing/spec.md:158-159`).

Three discovery paths, three different amounts of safety before an authored memory row is gone for good. The
underlying idiom is also split three ways for a decision that is conceptually the same everywhere ("is this
row's file really gone"): Layer 1/3's shared confirm state lives as suspect JSON in the `config` table
(`memory-drift-healing.ts:9,61-73`), Layer 2's pending-work state lives as a sibling marker file plus a
separate lock directory the write side manages (`memory-drift-marker.sh:91`) plus a `.processing-*` recovery
sweep for a killed boot (`memory-drift-processing-sweep.ts:49-135`), and Layer 3's orphan-sweep pagination
state lives as a raw integer cursor, also in `config` but under its own key
(`ORPHAN_SWEEP_CURSOR_KEY`, `memory-index.ts:287,310-330`). All three converge on the same shared delete
primitive and the same shared existence-check primitive, but decide independently whether to call the first
one — the discovery/confirmation split is what is fragmented, not the underlying mechanics.

### Purpose

Make the suspect queue the sole confirmation funnel across all three layers. Marker consumption and the
orphan sweep become pure discoverers that enqueue candidate ids into the existing queue; `runSuspectConfirmation`
becomes the one place in the codebase that verifies-and-tombstones. Three candidate discoverers, one confirmer
— not three semi-independent healing paths that happen to share a delete function.

### Implementation Result

`runGlobalOrphanSweep` now enqueues candidates at
`mcp_server/handlers/memory-index.ts:821-826`; the scoped path resolves ids and enqueues at
`mcp_server/handlers/memory-index.ts:1075-1080`. Confirmation precedes orphan discovery at
`memory-index.ts:1064-1065` and `:1565-1576`, guaranteeing next-scan confirmation. The queue is capped at
1,000 entries in `memory-drift-healing.ts:10,131-134`, and `suspectQueueSize` is returned in the scan
envelope at `memory-index.ts:1160-1167,1571-1576`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `runGlobalOrphanSweep` (`memory-index.ts:785-853`) stops calling `deleteIndexedRecordIds` on
  `sweep.orphanRecordIds` directly (`:815`). It calls `appendMemoryDriftSuspects` with those same ids instead,
  leaving the tombstone decision to `runSuspectConfirmation`.
- The marker-triggered scoped-delete branch inside `handleMemoryIndexScan`'s `files.length === 0` path
  (`memory-index.ts:1059-1069`) stops calling `deleteStaleIndexedRecords(categorized.toDelete)` directly. It
  resolves `categorized.toDelete` (file paths) to record ids via the same
  `incrementalIndex.listIndexedRecordIdsForDeletedPaths()` helper `deleteStaleIndexedRecords` already calls
  internally (`memory-index.ts:782`), then enqueues those ids via `appendMemoryDriftSuspects` instead of
  deleting.
- A phase-order (or explicit same-cycle-acceptance) decision for orphan-sweep-discovered suspects. Today
  `runGlobalOrphanSweep` runs immediately before `runSuspectConfirmation` in the same scan invocation
  (`memory-index.ts:1054-1055` and `:1542,1549`). Once orphan-sweep only enqueues, confirming those suspects
  in that same call gives them no time-separated second look — the one property that makes Layer 1's
  suspect-then-confirm model safe against transient absence. This packet decides, and plan.md records, whether
  to defer orphan-discovered suspects to the *next* scan invocation's confirmation pass or to accept same-cycle
  confirmation with a stated reason (e.g. because `sweepOrphanIndexRows`'s own existence check is already
  independent evidence).
- A size cap and/or an observable metric on the suspect queue (`memory-drift-healing.ts:61-73,106-131`).
  Today the queue is a single JSON blob with no upper bound, and `runSuspectConfirmation` reads the whole
  queue into one `WHERE id IN (...)` statement per scan (`memory-index.ts:882-886`) with no batching. That was
  a theoretical-only risk while the only writer was Layer 1's top-k-per-query trickle (~10-50 ids). Once
  Layer 3's orphan sweep — which pages up to `ORPHAN_SWEEP_LIMIT * ORPHAN_SWEEP_MAX_PAGES` (200 x 1000 =
  200,000) candidate rows per invocation (`memory-index.ts:285-286`) — also enqueues instead of deleting, a
  single large backlog sweep can push far more ids into the queue between confirmation passes than before.
- Reconsidering the drift-suspect write path's busy-timeout override
  (`DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS = 25`, `memory-search.ts:224,429`). That 25ms fast-fail was tuned
  for exactly one caller: a read-hot-path search response that must not block on a lock for its full 10s
  `busy_timeout`. The two new callers this packet adds (orphan sweep, marker-triggered scoped delete) run
  inside an already-serialized scan/write phase, not a latency-sensitive read path, so the same 25ms tail may
  silently drop their enqueue under any lock contention where a longer wait would have succeeded. This packet
  decides whether the override stays a blanket 25ms for every caller, or becomes caller-specific.

### Out of Scope

- The full-corpus scan's definitive stale-delete path (`memory-index.ts:1531-1539`,
  `deleteStaleIndexedRecords(filesToDelete)` when `results.failed === 0`). `filesToDelete` there comes from
  diffing an explicit, just-walked file listing against the index — a ground-truth corpus comparison, not a
  heuristic candidate — so it stays a direct delete. Only the two heuristic/candidate paths (orphan sweep,
  marker-triggered scoped delete) convert to discoverers.
- Layer 1 itself (`memory-search.ts:372-441`). It is already the reference model this packet extends to the
  other two layers; no behavior change there.
- The git-hook's own lock-directory coordination (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh:91`,
  the `${markerPath}.lock` mkdir-based mutex with stale-lock reclaim). That guards concurrent git-hook
  *writers* racing on the marker file itself — a different problem from the confirmation funnel this packet
  consolidates — and is not touched.
- The `.processing-*` recovery sweep (`memory-drift-processing-sweep.ts:49-135`). It only merges
  orphaned `.processing-*` claim files back into the canonical marker so a killed boot's entries still reach
  the normal consume path on the next boot; it never itself decides to delete anything, so there is nothing
  to fold into the confirmation funnel there.
- Any database schema or table change. The suspect queue keeps living in the existing `config` table
  (`memory-drift-healing.ts:9,27-29`); a size cap or metric is enforced/emitted in code, not via a new column.
- Re-running or duplicating any prior backlog cleanup (007/008/011-014's own scope).
- **Sequencing dependency**: per the parent scope's framing at plan authoring, this packet was "not urgent —
  schedule after 017/018/019 land." At that time, those former root phases did not yet exist as spec folders
  and the parent's newest built child was `016-cross-package-flag-governance`, so the original spec could not
  cite their concrete diffs. They now exist at the topology manifest's canonical locations: former 017 at
  `005-dark-flag-graduation/010-flag-vocabulary-consolidation`, former 018 at
  `002-speckit-memory/025-git-hooks-reinstall-and-guard`, and former 019 at
  `003-spec-data-quality/010-validation-enforce-graduation`. Any future overlap review must use those current
  folders rather than the historical nonexistence assumption.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | `runGlobalOrphanSweep` enqueues instead of deleting (`:815`); marker-triggered scoped-delete branch enqueues instead of deleting (`:1059-1069`); phase-order/same-cycle decision for orphan-discovered suspects; suspect-queue size cap or metric surfaced through the scan result |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts` | Modify | `appendMemoryDriftSuspects` enforces the size cap and/or records a queue-size signal; busy-timeout override policy point, if relocated out of `memory-search.ts` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify (maybe) | `DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS` reconsidered now that it gates more than one caller; only touched if the decision moves or parameterizes the constant rather than keeping it caller-local |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `runGlobalOrphanSweep` SHALL enqueue its discovered orphan candidate ids into the shared suspect queue via `appendMemoryDriftSuspects` instead of calling `deleteIndexedRecordIds` on them directly. | Against a synthetic orphan backlog, immediately after `runGlobalOrphanSweep` returns, the discovered ids are present in `readMemoryDriftSuspects()` and the corresponding `memory_index` rows are still present (not yet deleted). |
| REQ-002 | The marker-triggered scoped-delete branch (the `files.length === 0`, `scopedScanPaths.length > 0` path) SHALL resolve `categorized.toDelete` paths to record ids and enqueue them via `appendMemoryDriftSuspects` instead of calling `deleteStaleIndexedRecords` directly. | Against a synthetic git-hook marker (rename/delete entries) driving a scoped scan, immediately after the scoped-delete phase, the resolved ids are present in `readMemoryDriftSuspects()` and the corresponding rows are still present. |
| REQ-003 | `runSuspectConfirmation` SHALL be the only call site that invokes `deleteIndexedRecordIds` for drift-suspected rows, excluding the out-of-scope full-corpus definitive stale-delete path. | `rg -n "deleteIndexedRecordIds\(" mcp_server/handlers/memory-index.ts` post-change shows exactly two call sites: the unchanged full-scan `filesToDelete` path (`:1531-1539` today) and `runSuspectConfirmation`'s own call (`:913` today); `runGlobalOrphanSweep` and the marker-triggered scoped-delete branch no longer appear. |
| REQ-004 | A row enqueued by orphan sweep or the marker-triggered scoped-delete path SHALL only be tombstoned by a `runSuspectConfirmation` pass that re-checks its path existence with a freshly built `buildPathExistenceCache`, not by the enqueueing call itself. | For an id enqueued by either new discoverer, the row remains present until a subsequent (same-cycle-accepted-and-documented, or next-cycle) `runSuspectConfirmation` invocation re-confirms absence and calls `deleteIndexedRecordIds`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The suspect queue SHALL enforce a documented size cap or emit an observable size metric, so a large orphan-sweep backlog funneled through `appendMemoryDriftSuspects` cannot grow the `config`-table JSON blob or `runSuspectConfirmation`'s single `WHERE id IN (...)` statement without bound. | A synthetic backlog at/above the chosen cap either has enqueue behavior that truncates/rejects the excess with a logged warning, or the scan result includes a queue-size field an operator can alert on; a test asserts the boundary behavior. |
| REQ-006 | The orphan-sweep-to-confirmation phase-order decision (same-cycle vs. next-cycle) SHALL be explicit and recorded, not an accidental byproduct of call order. | `plan.md` and `implementation-summary.md` state which behavior was chosen and why; a test demonstrates the actual observed timing (whether an orphan-discovered id is confirmable in the same scan invocation that enqueued it, or only in a later one). |
| REQ-007 | The drift-suspect-write busy-timeout policy SHALL be an explicit decision for the two new (non-search) callers, not an unexamined reuse of a constant tuned for a different caller's latency profile. | `plan.md`/`implementation-summary.md` states whether `DRIFT_SUSPECT_WRITE_BUSY_TIMEOUT_MS` stays a single 25ms value for every caller (with a stated reason it is still appropriate for scan-phase writers) or is parameterized per caller; a test exercises a lock-contention scenario for at least one non-search caller under the chosen value. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three discovery paths (Layer 1 query-time filter, Layer 3 orphan sweep, Layer 2
  marker-triggered scoped delete) enqueue into the same suspect queue and no longer independently call
  `deleteIndexedRecordIds`/`deleteStaleIndexedRecords` on their own discovered candidates — proven by REQ-001
  through REQ-003's grep and behavioral evidence.
- **SC-002**: `runSuspectConfirmation` is the mechanically verifiable single confirm-and-tombstone site for
  all suspect-queue-sourced deletes (REQ-003, REQ-004).
- **SC-003**: The suspect queue has a bounded worst case under its new, higher-volume callers (REQ-005), and
  the busy-timeout and phase-order behaviors for those callers are explicit decisions with test coverage
  (REQ-006, REQ-007), not silent carryovers from a single-caller design.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deferring orphan-sweep and marker-triggered deletes to a confirmation pass, instead of deleting on first detection, delays when a truly-gone row is actually removed from `memory_index` and from search results. | A confirmed-orphan row could still surface in a search hit for up to one extra scan cycle before Layer 3 or Layer 1's own query-time filter catches it. | Layer 1's query-time existence filter (`memory-search.ts:372-441`, already shipped) independently excludes dead-path rows from what a search *returns*, regardless of `memory_index` row state, so the user-visible staleness window does not widen even though the underlying delete is deferred. |
| Risk | Routing Layer 3's own orphan-sweep volume (up to 200,000 candidate ids per invocation, `memory-index.ts:285-286`) through the same queue Layer 1 uses for a top-k trickle (~10-50 ids/query) can make `runSuspectConfirmation`'s single unbounded `WHERE id IN (...)` (`:882-886`) hit SQLite's per-statement bound-parameter limit or run slow. | A confirmation pass could fail outright on a very large backlog, or degrade scan latency. | REQ-005's size cap/metric; if a cap alone is insufficient, `runSuspectConfirmation`'s `IN (...)` construction may need chunking — left as an implementation-time decision in `plan.md`, not solved here. |
| Dependency | Former root phases 017/018/019 (declared sequencing dependency; not yet built at plan authoring, now present at manifest-resolved canonical locations) | The original overlap risk was unverified because their specs did not yet exist; current lineage resolves them to `005-dark-flag-graduation/010-flag-vocabulary-consolidation`, `002-speckit-memory/025-git-hooks-reinstall-and-guard`, and `003-spec-data-quality/010-validation-enforce-graduation`. | Use the canonical folders for any future overlap review and re-verify current `memory-index.ts` seams rather than relying on the plan-time file:line snapshot. |
| Dependency | `deleteIndexedRecordIds` and `buildPathExistenceCache` (both already shipped, shared primitives) | Reused as-is; this packet adds no new delete or existence-check logic of its own. | N/A — reuse only, no new algorithm |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Converting orphan sweep to an enqueue-only discoverer must not materially change
  `runGlobalOrphanSweep`'s own wall-clock time budget (`ORPHAN_SWEEP_TIME_BUDGET_MS_DEFAULT`, `memory-index.ts:293`)
  — an `appendMemoryDriftSuspects` write per page is expected to be cheap relative to the per-row DELETE
  cascade it replaces, not more expensive.
- **NFR-P02**: `runSuspectConfirmation`'s existence recheck stays a single fresh `buildPathExistenceCache`
  batch call per confirmation pass (as it already is), not one filesystem stat per suspect id, even after
  the queue's typical size grows with the new callers.

### Reliability
- **NFR-R01**: A crash or restart between an enqueue (orphan sweep or marker-triggered) and the next
  confirmation pass must leave the suspect queue's persisted state consistent — the existing `config`-table
  write already covers this; this packet must not introduce an in-memory-only staging step between enqueue
  and persistence.
- **NFR-R02**: The consolidation must not regress Layer 1's existing suspect-then-confirm safety property
  (`011-automatic-drift-self-healing` REQ-001/SC-001) — a row a search excluded as missing must still only be
  tombstoned by a later confirmed re-check, never immediately.

### Observability
- **NFR-O01**: Whatever size-cap or metric REQ-005 lands on must be visible in the existing scan result
  envelope (the same object that already carries `orphanSwept`, `suspectTombstoned`, `suspectCleared`,
  `suspectFailed` at `memory-index.ts:1543-1552`) rather than only in a log line, so an operator or a future
  `/doctor` route can read it without grepping server logs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An id discovered by both orphan sweep and the marker-triggered path in the same scan cycle (same
  underlying deleted file, different signal source): `appendMemoryDriftSuspects` already dedups by id and
  refreshes `lastSeenAt` on re-observation (`memory-drift-healing.ts:106-131`), so a double-enqueue is a
  no-op merge, not a duplicate row.
- An empty orphan-sweep page or an empty scoped-delete candidate set: both call `appendMemoryDriftSuspects`
  with an empty array, which is already a safe no-op (`memory-drift-healing.ts:116-126` iterates zero ids).
- The suspect queue at exactly the chosen size cap boundary: REQ-005's test must assert the at-cap and
  one-over-cap behavior explicitly, not just an arbitrarily-large backlog.

### Error Scenarios
- `appendMemoryDriftSuspects`'s write fails under lock contention (the busy-timeout scenario REQ-007
  targets): today this is caught and logged as a warning in Layer 1's caller (`memory-search.ts:431-432`);
  the two new callers need the same best-effort, non-fatal handling — a failed enqueue must not abort the
  scan or silently re-introduce a direct-delete fallback.
- `runSuspectConfirmation` itself errors mid-pass on a very large queue (the SQLite parameter-limit risk in
  Risks & Dependencies): must fail closed (rows stay present, re-attempted next pass), never fail open into
  an unconfirmed delete.

### State Transitions
- A suspect enqueued by orphan sweep whose file reappears before the next confirmation pass (e.g. a
  restore): `removeMemoryDriftSuspects` already clears without a write on reappearance
  (`memory-index.ts:895-911`); this path is unchanged, only the volume of callers feeding it changes.
- The phase-order decision (REQ-006) itself is a state-machine question: same-cycle confirmation means an
  orphan-discovered id can be enqueued and tombstoned within one `memory_index_scan` call; next-cycle
  confirmation means it is guaranteed to survive at least until the following invocation. `plan.md` must name
  which one this packet implements.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two call-site conversions in one already-open file (`memory-index.ts`), one size-cap/metric addition, one busy-timeout policy decision — no new files, no schema change |
| Risk | 12/25 | Touches the shared delete-decision path for authored, non-regenerable memory rows; mitigated by REQ-004's confirm-before-tombstone invariant and Layer 1's independent query-time filter already covering user-visible staleness |
| Research | 8/20 | Every cited seam verified to file:line against the live tree; the design intent (Layer 3 as confirmer) is drawn from 011's own shipped spec, not invented here |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

_All three questions below are resolved; kept under this heading per the template's fixed section contract._


- **Confirmation timing:** next-cycle. `suspect-confirmation` runs before `orphan-sweep` in both scan shapes;
  `orphan-sweep-time-budget-and-refresh.vitest.ts:131-172` proves a queued row survives the first scan and is
  tombstoned on the second.
- **Queue bound:** a 1,000-entry hard cap preserves already-queued confirmation work and defers excess ids with
  a warning. `memory-drift-healing.vitest.ts:67-91` asserts at-cap and one-over-cap behavior.
- **Busy timeout:** `memory-search.ts:224,421-437` retains its 25ms search-hot-path override. The two scan
  discoverers make no override, using the connection default; `suspect-confirmation.vitest.ts:252-289` proves
  scoped enqueue waits at least 280ms under contention.
<!-- /ANCHOR:questions -->
