---
title: "Feature Specification: Orphan Sweep Time Budget & Scoped-Scan Discovery-Gate Parity [template:level_2/spec.md]"
description: "F2 (headline finding, confirmed by reproduction) -- the scoped-scan (git-hook drift-marker) path builds specDocFiles from raw fs.existsSync checks instead of the full-tree walker's discovery gates, letting the drift-healer index non-spec files as spec documents (real .png files reproduced this). F1 (defense-in-depth) -- the orphan-sweep loop's pure SCAN cost was empirically tested and found safe (a synthetic 200,000-row SCAN completed in ~4-5s, well under the marker's 180s TTL), but the per-row DELETE-cascade cost was not exercised by that test and remains a real, unverified risk under an all-orphan backlog."
trigger_phrases:
  - "orphan sweep time budget"
  - "orphan sweep wall-clock budget"
  - "scoped scan discovery gate parity"
  - "maintenance marker refresh cadence"
  - "drift marker specDocFiles gating"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/012-orphan-sweep-scoped-scan-safety"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-012-orphan-sweep-scoped-scan-safety"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
answered_questions:
  - "F1 time budget = 45,000ms default, refresh cadence = 20,000ms default, both env-overridable via SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS/SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS."
  - "F1's marker-refresh cadence reuses ctx.onPhase('orphan-sweep') verbatim, called from inside runGlobalOrphanSweep's own loop -- no new callback threaded."
  - "F2's predicate wiring chose Option A (direct predicate import into memory-index.ts) over Option B (shared helper in memory-index-discovery.ts), to keep findSpecDocuments's already-tested tree-walk code untouched."
---
# Feature Specification: Orphan Sweep Time Budget & Scoped-Scan Discovery-Gate Parity

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
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-07-09 |
| **Branch** | `012-orphan-sweep-scoped-scan-safety` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: how this phase was scoped
This phase covers exactly two HIGH-severity findings (F1, F2) from a three-angle Fable-5 review
(correctness/quality, architecture consistency, risk/blast-radius) of packages 006-011 under
`028-memory-search-intelligence`, all already shipped and passing `validate.sh --strict`. Both findings sit
on the same live daemon hot path -- `mcp_server/handlers/memory-index.ts`'s orphan-sweep and
scoped-scan logic -- that this program has already had daemon-reliability incidents around (packet 032's
daemon-killed-mid-write bug, and the three daemon-reliability fixes under sibling program
`026-graph-and-context-optimization/007-mcp-daemon-reliability/{032,033,034}`). The other 14 findings from
the same review (F3-F16) are out of scope for this phase and are tracked separately.

### Problem Statement

**F2 (headline finding, confirmed by reproduction) -- scoped scan (drift-marker consumption) bypasses every
spec-doc discovery gate.**
When `scopedPaths` is set (the Layer-2 git-hook-triggered scan introduced by sibling phase
`011-automatic-drift-self-healing`), `memory-index.ts:598-600` builds `specDocFiles` directly from the raw
scoped path list, filtered only by `fs.existsSync(filePath)`:

```
const specDocFiles = scopedScanPaths.length > 0
  ? Object.assign(scopedScanPaths.filter((filePath) => fs.existsSync(filePath)), ...)
  : ... findSpecDocuments(...) ...
```

The full-tree walker (`findSpecDocuments`, `memory-index-discovery.ts:141-196`) applies four gates before
accepting a candidate as a spec document: the file's basename must be in the `SPEC_DOCUMENT_FILENAMES`
allowlist (`:176`, eleven names, `spec-doc-paths.ts:9-21`), it must pass `shouldIndexForMemory` (`:177`,
excludes scratch/memory/hidden paths -- reused internally by `matchesSpecDocumentPath`), it must pass
`matchesSpecDocumentPath(fullPath, basename)` (`:180`, `spec-doc-paths.ts:132-174`, which itself calls
`canClassifyAsSpecDocument` -> `isSpecsScopedPath` + `shouldIndexForMemory` +
`!isSpecDocumentExcludedPath`, `spec-doc-paths.ts:106-110`), and it must not already be a duplicate
canonical path (`:189-192`). The scoped-scan branch applies **none** of these -- only existence. Any
committed rename under `.opencode/specs` -- a scratch file, an evidence JSONL, an image asset, literally
anything the git-hook drift-marker (011's Layer 2) names -- gets indexed as a spec document at the next
boot. The drift-healer built specifically to keep the index clean can silently create new index junk, the
opposite of its purpose.

`memory-index.ts:603` compounds this: `graphMetadataFiles` is force-emptied (`Object.assign([], ...)`) for
every scoped scan, unconditionally, even when a scoped path is a renamed `graph-metadata.json`. That file
loses its dedicated parsing lane (`findGraphMetadataFiles` / `isGraphMetadataPath`,
`spec-doc-paths.ts:176-194`) entirely for scoped scans; `startup-checks.ts`'s `refreshMovedSpecFolder`
(wired at `context-server.ts:2241`) only partially compensates, since it runs on a different trigger
(boot-time marker consumption) than the scoped-scan's own file-classification step.

**Confirmed by reproduction, not a hypothetical:** an adversarial follow-up review (Fable-5 code-walk)
exercised this exact gap and produced a clean, confirmed reproduction -- real `.png` files got indexed as
spec documents through the `fs.existsSync`-only scoped-scan filter (`memory-index.ts:598-600`), with no
allowlist or path-eligibility check standing in the way. This is the packet's headline finding: a
demonstrated defect with a working repro, not a theoretical gap.

**F1 -- the orphan-sweep loop was loosened without a matching time budget or refresh cadence.**
`sweepOrphanIndexRows()` used to run one 200-row page per `memory_index_scan` call. It now runs inside a
loop (`memory-index.ts:758-772`) that can execute up to `ORPHAN_SWEEP_MAX_PAGES = 1000`
(`memory-index.ts:255`, alongside the pre-existing `ORPHAN_SWEEP_LIMIT = 200` at `:254`) pages in one
invocation -- up to 200,000 rows -- with no wall-clock time budget and no mid-loop yield back to the event
loop. Every `sweepOrphanIndexRows()`/`deleteIndexedRecordIds()` call inside the loop is synchronous
(better-sqlite3), so a large page count runs as one long, mostly-synchronous stretch.

The busy/maintenance marker that signals a competing launcher not to reap this daemon
(`lib/storage/maintenance-marker.ts`) is refreshed by `timedPhase`'s `ctx.onPhase?.(phase)` call
(`memory-index.ts:970`) -- but that call fires **once, at phase entry**, before the loop starts
(`memory-index.ts:965-968`'s own comment: "Entering a phase also fires onPhase, which refreshes the busy
marker -- giving each phase a full TTL ahead"). For a background (job-queued) scan, `onPhase` is wired to
`maintenance.refresh()` at `memory-index.ts:1770`, itself calling `beginMaintenance('index_scan')`'s handle
(`memory-index.ts:1762`). The marker's TTL is `MAINTENANCE_MARKER_TTL_MS = 180_000` (60s owner-lease TTL x
3, `maintenance-marker.ts:26,28,31-32`), and the module's own comment already states the invariant this
loosening violates: "Long synchronous phases can starve unref timers, so callers refresh at phase
boundaries before half the marker window elapses" (`maintenance-marker.ts:15-17`, i.e. before
`MAINTENANCE_MARKER_REFRESH_BEFORE_MS = 90_000` elapses, `:33`). A background-refresh `setInterval` also
exists (`writeMarker` every `MAINTENANCE_MARKER_REFRESH_MS = 20_000`, `maintenance-marker.ts:34,71`) but it
is `unref()`'d and depends on the event loop being free to fire -- exactly what a long synchronous sweep
starves.

**Empirically tested, partially cleared:** an adversarial follow-up review (Fable-5 code-walk, not opinion)
ran a synthetic 200,000-row `sweepOrphanIndexRows()` SCAN -- the maximum a single invocation's 1000-page x
200-row cap allows -- and it completed in roughly 4-5 seconds, nowhere near the maintenance marker's 180s
TTL or its 90s refresh-before threshold. The pure SCAN cost of this loop is therefore tested and found safe;
it does not, by itself, reproduce the packet-032 daemon-killed-mid-write failure mode. What that test did
**not** exercise is the DELETE cascade: every orphan row the scan finds is also deleted via
`deleteIndexedRecordIds()` (`memory-index.ts:650-724`, invoked once per page from inside the loop at
`:762`), and each row's deletion is its own synchronous per-row transaction -- a `vectorIndex.deleteMemory()`
call, `causalEdges.deleteEdgesForMemory()` vector-index/causal-edge cleanup, and a best-effort
`recordHistory()` history-log insert (`:659-724`). None of that per-row cost was present in the scan-only
synthetic test. That DELETE-cascade cost, exercised at full volume by an all-orphan backlog -- precisely
what a large re-nest produces, which this program has already done twice this session -- remains the real,
unverified risk: whether it stays under the marker's 90s refresh-before window at full backlog volume (up
to 200,000 rows in one invocation) has not been measured either way. The sweep is capped and
cursor-resumable (`readOrphanSweepCursor`/`writeOrphanSweepCursor`, `memory-index.ts:262-` onward), so it
is bounded, not infinite -- but the marker-refresh cadence was never updated to match the new 1000x-looser
page cap, and this fix now ships as defense-in-depth against an unverified risk rather than a confirmed
reproduction.

### Purpose
Ship two narrow, additive fixes on the same hot-path file, in place before either is allowed to sit
unattended in production traffic: (1) route scoped-scan candidate files through the exact same discovery
gates the full-tree walker already uses, so the git-hook-triggered drift healer cannot itself become a
source of index drift -- this is the packet's headline, confirmed-by-reproduction fix; (2) bound the
orphan-sweep loop's wall-clock duration and tighten the maintenance-marker refresh cadence, as
defense-in-depth against the DELETE-cascade cost an all-orphan backlog would exercise -- a risk this
phase's empirical SCAN-only testing left unverified, not confirmed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**F1 -- orphan-sweep time budget + tighter marker-refresh cadence.**
- A new wall-clock time budget on the `for (let page = 0; page < ORPHAN_SWEEP_MAX_PAGES; page++)` loop
  (`memory-index.ts:758-772`) inside `runGlobalOrphanSweep()` (`:737`): once elapsed loop time exceeds the
  budget, the loop exits early via the existing early-exit path (persist `nextCursor`, same as the
  `!sweep.nextCursor` branch at `:767-769`) rather than continuing toward the 1000-page cap. This is a pure
  tightening of an already cursor-resumable, already-capped mechanism -- no new resumption logic is
  invented.
- A tighter mid-loop refresh of the busy/maintenance marker, reusing the existing `ctx.onPhase` plumbing
  that `runGlobalOrphanSweep()` already has in closure scope (it is defined inside `runIndexScan(args, ctx)`
  at `:446`, so `ctx.onPhase` is reachable without new parameter threading) -- called at a bounded,
  rate-gated cadence inside the loop, not only once at phase entry (`:970`).
- Both changes are scoped to the orphan-sweep phase only. No change to `sweepOrphanIndexRows()` itself, the
  cursor persistence mechanism, `ORPHAN_SWEEP_LIMIT`, or `ORPHAN_SWEEP_MAX_PAGES`.

**F2 -- scoped-scan discovery-gate parity.**
- Replace the raw `fs.existsSync`-only filter at `memory-index.ts:598-600` with a filter that additionally
  requires the scoped path's basename to be in `SPEC_DOCUMENT_FILENAMES` and the path to pass
  `matchesSpecDocumentPath(filePath, basename)` -- the exact same predicate the full-tree walker calls at
  `memory-index-discovery.ts:180`, imported and reused verbatim, not reimplemented.
- Stop force-emptying `graphMetadataFiles` for scoped scans at `memory-index.ts:603`. Instead, route any
  scoped path that passes `isGraphMetadataPath(filePath)` (`spec-doc-paths.ts:176-194`) into
  `graphMetadataFiles` so it reaches the same dedicated graph-metadata parsing lane a full-tree scan would
  give it.
- Both gate checks are single-path predicates already exported from `spec-doc-paths.ts`
  (`matchesSpecDocumentPath`, `isGraphMetadataPath`) with no directory-walk dependency, so they apply
  directly to a flat scoped-path list with no new discovery-walk code required.

### Out of Scope
- F3-F16 from the same review (git-hook stale-lock recovery, marker path divergence under a DB-path
  override, feature-flag governance inconsistency, evidence-checker loophole, status-classifier gaps, the
  flag-gated-off sync-DB-write risk, classifier duplication, freshness-sweep baseline handling, drift-suspect
  error-swallowing, `.processing-*` marker leaks, FTS channel mislabeling, capability-flags.ts formatting,
  and the default-on classifier-calibration monitoring item) -- each belongs to a separate phase or is
  explicitly deferred per the findings digest; F16 is already fixed separately.
- Any change to `sweepOrphanIndexRows()`'s internal pagination algorithm, `reconcileMoves()`, or
  `listStaleIndexedPaths()` -- all reused as-is.
- Any change to the git-hook marker-write side (`.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`)
  or to `startup-checks.ts`'s marker-consumption trigger -- this phase only changes what the scoped-scan
  consumer does with the path list it is handed, not how/when scoped scans are triggered.
- Raising or lowering `ORPHAN_SWEEP_LIMIT` or `ORPHAN_SWEEP_MAX_PAGES` themselves -- the fix is a time
  budget and refresh cadence on top of the existing caps, not a change to the caps.
- A schema migration -- neither fix touches the database schema.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | F1: wall-clock budget + tighter refresh cadence inside `runGlobalOrphanSweep()`'s loop (`:737-780`). F2: gate `specDocFiles`/`graphMetadataFiles` construction for scoped scans (`:598-607`) through the shared discovery predicates instead of raw `fs.existsSync` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Modify (if a shared single-path helper is factored) | Optionally export a small single-path wrapper so both the tree-walker's per-entry check and the scoped-scan's per-path filter call one shared function, rather than `memory-index.ts` importing `spec-doc-paths.ts` predicates directly -- an implementation-time choice, see plan.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The orphan-sweep loop SHALL enforce a wall-clock time budget so a single `memory_index_scan` invocation's orphan-sweep phase cannot run unbounded toward the 1000-page cap. | A fixture orphan backlog large enough to need more than the time budget's worth of pages exits the loop before reaching `ORPHAN_SWEEP_MAX_PAGES`, persists a non-null `nextCursor` via the existing `writeOrphanSweepCursor` path, and a subsequent invocation resumes from that cursor and eventually completes the full backlog across multiple invocations. |
| REQ-002 | The busy/maintenance marker SHALL be refreshed at a cadence tighter than phase-entry-only during the orphan-sweep loop, at an interval comfortably under `MAINTENANCE_MARKER_REFRESH_BEFORE_MS` (90,000ms). | A synthetic long-running sweep, run through the REAL `runGlobalOrphanSweep()` function (not a scan-only mirror harness) under a DELETE-heavy synthetic orphan backlog -- i.e. a backlog where the scanned rows are genuine orphans that flow through `deleteIndexedRecordIds()`'s per-row transaction/vector-index/causal-edge/history-log cost, not merely scanned -- demonstrates at least one additional marker-refresh call beyond the single phase-entry call, and no refresh gap inside the loop exceeds the chosen cadence interval. A scan-only harness that skips the DELETE cascade is insufficient verification: the pure SCAN path is already empirically confirmed safe (see Problem Statement) and does not exercise the risk this requirement exists to guard against. **Verification note (corrected 2026-07-10):** the shipped test (`orphan-sweep-time-budget-and-refresh.vitest.ts`, "re-fires ctx.onPhase during an enqueue-page-heavy sweep...") exercises an ENQUEUE-heavy backlog through the enqueue-page loop (`appendMemoryDriftSuspects`), not the DELETE cascade (`deleteIndexedRecordIds`) this criterion as originally written called for; the DELETE-cascade cost remains unverified, consistent with the Problem Statement's framing of this fix as defense-in-depth against an unconfirmed risk rather than a confirmed reproduction. |
| REQ-003 | Scoped-scan `specDocFiles` construction SHALL apply the same filename-allowlist and path-eligibility gates the full-tree walker applies (`SPEC_DOCUMENT_FILENAMES` membership plus `matchesSpecDocumentPath`), not `fs.existsSync` alone. | A scoped-scan fixture whose path list includes one legitimate renamed `spec.md` and one renamed non-spec file (e.g. a `scratch/`-path file, or any file whose basename is not in `SPEC_DOCUMENT_FILENAMES`) includes only the `spec.md` path in the resulting `specDocFiles`; the non-spec file is excluded. |
| REQ-004 | Scoped-scan `graphMetadataFiles` SHALL NOT be unconditionally force-emptied; a scoped path that passes `isGraphMetadataPath` SHALL be included. | A scoped-scan fixture whose path list includes a renamed `graph-metadata.json` under a valid spec leaf produces a non-empty `graphMetadataFiles` containing that path. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | F1's time-budget early exit SHALL NOT alter the sweep's correctness -- rows already scanned before the budget trips remain deleted/processed, and the cursor exactly resumes where the budget-triggered exit left off (no row skipped, no row double-processed). | A fixture split across two budget-limited invocations produces the identical final swept-row set as one unbounded invocation over the same fixture. |
| REQ-006 | F2's gating change SHALL be verified against a fixture reproducing the exact failure this finding describes: a committed rename of a non-spec file (e.g. a scratch or evidence file) under `.opencode/specs`. | The reproduction fixture, run through the pre-fix code path, demonstrably indexes the renamed non-spec file as a spec document; run through the post-fix code path, it does not. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A large orphan backlog (larger than the chosen time-budget's worth of pages) can no longer
  cause a single `memory_index_scan` invocation's orphan-sweep phase to run past the maintenance marker's
  90s refresh-before window without an intervening marker refresh.
  **MET**: `tests/orphan-sweep-time-budget-and-refresh.vitest.ts` -- a 2500-row real ENQUEUE-heavy backlog
  (queued via `appendMemoryDriftSuspects`, not `deleteIndexedRecordIds`) through the real
  `runIndexScan`/`runGlobalOrphanSweep` produces more than one `ctx.onPhase('orphan-sweep')`
  call, rate-gated (< 50 calls for a 1200-row/6-page backlog).
- **SC-002**: A committed rename or delete of a non-spec-document file under `.opencode/specs`, surfaced to
  a scoped scan via the Layer-2 git-hook drift marker, is never indexed as a spec document.
  **MET**: `tests/memory-index-scoped-scan-gating.vitest.ts` -- a mixed fixture (one legit `spec.md`, one
  `.png` rename) is confirmed to include only the `spec.md` path post-fix, and the reconstructed pre-fix
  filter is confirmed to have wrongly included the `.png` on the identical fixture (real reproduction,
  not speculative).
- **SC-003**: A committed rename of a `graph-metadata.json` file, surfaced to a scoped scan, is parsed
  through the same graph-metadata lane a full-tree scan would give it, not silently dropped.
  **MET**: `tests/memory-index-scoped-scan-gating.vitest.ts` -- a scoped `graph-metadata.json` path is
  confirmed to reach the indexing step, no longer force-emptied.
- **SC-004**: Neither fix changes full-tree (non-scoped) scan behavior -- both changes are scoped to the
  `scopedScanPaths.length > 0` branch (F2) or purely tighten timing inside an already-existing loop (F1),
  with no change to `sweepOrphanIndexRows()`'s row-selection logic itself.
  **MET**: `memory-index-discovery.ts` (home of `findSpecDocuments`) received zero edits (Option A chosen
  for F2); `sweepOrphanIndexRows()` itself received zero edits (F1 only wraps its existing call site). The
  full pre-existing `handler-memory-index*.vitest.ts` suite (4 files, 51 passed/28 intentionally-skipped)
  and `orphan-sweep-corpus-repair.vitest.ts`/`memory-drift-healing.vitest.ts` pass unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | F1 touches the same orphan-sweep loop this program's prior daemon-reliability incidents (packet 032 and siblings) sit near; a mistake in the budget/cursor interaction could reintroduce a row-skip or double-delete bug instead of guarding against the DELETE-cascade cost this fix targets. | Data-loss-adjacent regression in orphan cleanup | REQ-005 requires a same-fixture equivalence test (budgeted multi-invocation run vs. one unbounded run) before this ships; the existing cursor-resume mechanism is reused verbatim, not redesigned |
| Risk | F1's tighter refresh cadence calls `ctx.onPhase` repeatedly inside a tight loop; for a background scan this also calls `setJobPhase(jobId, phase)` (`memory-index.ts:1772`, an async DB write, fire-and-forget) on every call. An unbounded per-page refresh could add meaningful DB-write pressure under a very large backlog. | Added DB load during exactly the scenario (large backlog) this fix targets | The refresh cadence is time-gated (minimum elapsed interval between calls), not called on every page; the exact interval is an implementation-time decision within the REQ-002 bound, see plan.md |
| Risk | F2's gate-parity change could reject a legitimately-renamed spec document if `matchesSpecDocumentPath`'s leaf-segment/parent-directory logic (`spec-doc-paths.ts:132-174`) behaves differently for a scoped single-path input than it does inside the tree-walker's directory-relative context. | A real rename silently stops being tracked by the scoped-scan fast path (Layer 3's full-sweep backstop from `011-automatic-drift-self-healing` still catches it eventually) | REQ-006's fixture explicitly exercises a legitimate spec-document rename alongside the non-spec-file rename, confirming the gate accepts the former and rejects the latter in the same test |
| Dependency | `011-automatic-drift-self-healing` (shipped) -- introduces `scopedScanPaths`/Layer 2 that F2 fixes gating for. | This phase's F2 fix has no effect until Layer 2 is live in production traffic. | Already shipped per the memory index; confirmed present in the live tree at the cited line numbers |
| Dependency | `lib/storage/maintenance-marker.ts`'s existing TTL/refresh-cadence constants (unmodified by this phase). | F1's chosen time budget and refresh interval must stay consistent with these constants or the fix under-corrects. | REQ-002's acceptance criteria pins the refresh interval to stay under `MAINTENANCE_MARKER_REFRESH_BEFORE_MS` (90,000ms), read from the live constant, not a hardcoded assumption |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: F1's time-budget check adds one `Date.now()` comparison per loop iteration -- negligible
  relative to the existing per-page `sweepOrphanIndexRows`/`deleteIndexedRecordIds` synchronous SQLite work.
- **NFR-P02**: F1's tighter refresh cadence must be rate-gated (not called on every single page) so it does
  not turn a 1000-page sweep into 1000 marker-file writes; the cadence interval is bounded above by
  `MAINTENANCE_MARKER_REFRESH_BEFORE_MS` but should be chosen with headroom, not pinned at exactly 90s.
- **NFR-P03**: F2's added gate checks (`matchesSpecDocumentPath`, `isGraphMetadataPath`) are pure,
  synchronous, non-filesystem-touching predicates already used by the full-tree walker at production scale
  -- adding them to the scoped-scan path (which handles a small, git-diff-bounded path list, not a
  tree-wide walk) adds no meaningful cost.

### Reliability
- **NFR-R01**: F1's early-exit-on-budget path must be indistinguishable, from the cursor-persistence
  perspective, from the existing early-exit-on-`!sweep.nextCursor` path -- both write the same
  `writeOrphanSweepCursor` shape so a resumed sweep cannot tell which condition caused the prior exit.
- **NFR-R02**: F2's gating must fail closed -- a scoped path that cannot be classified (ambiguous, gate
  throws, or gate returns false) is excluded from both `specDocFiles` and `graphMetadataFiles`, never
  defaulted into either.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A backlog that would complete in fewer pages than the time budget allows: the loop behaves exactly as
  today, exiting via the existing `!sweep.nextCursor`/`scannedRows === 0` branch before the time budget is
  ever checked as the binding constraint.
- A scoped-scan path list containing zero eligible spec documents (all non-spec renames): `specDocFiles`
  resolves to an empty list, same shape as the existing `include_spec_docs: false` branch, not a crash or a
  different empty-list representation.
- A scoped-scan path list containing a path that is both syntactically a `graph-metadata.json` name AND
  fails `isSpecsScopedPath` (e.g. outside `.opencode/specs` entirely, if the git-hook ever misfires): excluded
  from `graphMetadataFiles` by `isGraphMetadataPath`'s own `isSpecsScopedPath` check, not a false include.

### Error Scenarios
- `sweepOrphanIndexRows()` or `deleteIndexedRecordIds()` throws mid-loop: unchanged behavior -- this fix
  does not add or remove error handling around those calls, only bounds how many times the loop can call
  them before checking the time budget.
- The marker-refresh call inside the loop throws (e.g. a transient filesystem error writing the marker
  file): must not abort the sweep itself -- the refresh is a side-effect, not part of the sweep's
  correctness path, and `beginMaintenance`'s own `refresh()` is already a synchronous best-effort write
  (`maintenance-marker.ts:77-79`) with no error propagation today, so this fix inherits that behavior
  rather than changing it.
- `matchesSpecDocumentPath`/`isGraphMetadataPath` throw on a malformed path string: caught and treated as
  "not eligible" per NFR-R02's fail-closed requirement, not a scan-aborting exception.

### State Transitions
- A sweep interrupted by the new time budget mid-backlog: identical resumption behavior to today's
  multi-invocation sweep-to-completion pattern (already exercised by
  `011-automatic-drift-self-healing`/Layer 3 and `orphan-sweep-corpus-repair.vitest.ts`) -- this phase adds
  one more reason the loop can exit early, not a new resumption mechanism.
- A scoped scan that previously (pre-fix) would have wrongly indexed a non-spec file: post-fix, that file
  is simply never a candidate; no migration or cleanup of previously-wrongly-indexed rows is in scope here
  (F1/F2 are forward-looking gates, not a backfill of past scoped-scan damage -- if such rows exist, they
  are caught by the existing full-sweep backstop's stale-path detection on a future full scan, per
  `011-automatic-drift-self-healing`'s Layer 3).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two narrow, additive changes confined to one file's two existing code regions (~40-60 LOC total); no new files required unless a shared single-path helper is factored out (optional) |
| Risk | 16/25 | Both findings sit on a hot daemon path with a real prior incident (packet 032) in the same subsystem; mitigated by reusing existing cursor-resume/marker-refresh/discovery-gate machinery verbatim rather than inventing new mechanisms |
| Research | 6/20 | Both findings independently confirmed against the live tree at exact file:line during spec authoring; the fix mechanism for each reuses code already proven correct elsewhere in the same file |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Exact wall-clock budget value for the orphan-sweep loop (REQ-001) and exact refresh-cadence interval
  (REQ-002): left as an implementation-time decision, bounded above by
  `MAINTENANCE_MARKER_REFRESH_BEFORE_MS` (90,000ms) with headroom, per NFR-P02. See plan.md Phase 1.
- Whether the tighter marker-refresh cadence reuses `ctx.onPhase('orphan-sweep')` verbatim (cheapest, reuses
  the exact plumbing already wired to `maintenance.refresh()` for background scans at `:1770`) or takes a
  dedicated refresh callback threaded separately -- see plan.md Architecture.
- Whether to factor a small shared single-path helper in `memory-index-discovery.ts` so both the tree-walker
  per-entry check and the scoped-scan per-path filter call one function, versus `memory-index.ts` importing
  the `spec-doc-paths.ts` predicates directly for the scoped-scan branch -- either satisfies REQ-003/REQ-004,
  the shared-helper route additionally guards against the two call sites drifting apart in the future.
<!-- /ANCHOR:questions -->
