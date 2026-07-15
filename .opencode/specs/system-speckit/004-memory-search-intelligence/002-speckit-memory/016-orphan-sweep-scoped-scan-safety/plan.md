---
title: "Implementation Plan: Orphan Sweep Time Budget & Scoped-Scan Discovery-Gate Parity"
description: "F1: a wall-clock budget plus a rate-gated mid-loop marker refresh on the orphan-sweep loop, reusing the existing cursor-resume and ctx.onPhase plumbing verbatim. F2: route scoped-scan specDocFiles/graphMetadataFiles through the same matchesSpecDocumentPath/isGraphMetadataPath predicates the full-tree walker already calls, instead of a raw fs.existsSync filter."
trigger_phrases:
  - "orphan sweep time budget plan"
  - "maintenance marker refresh cadence plan"
  - "scoped scan discovery gate parity plan"
  - "drift marker specDocFiles gating plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/016-orphan-sweep-scoped-scan-safety"
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
    answered_questions: []
---
# Implementation Plan: Orphan Sweep Time Budget & Scoped-Scan Discovery-Gate Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node (MCP server, `mcp_server/**`, compiled to `mcp_server/dist/**`) |
| **Framework** | None -- direct edits to two existing code regions inside `handlers/memory-index.ts`; no new abstraction layer |
| **Storage** | No schema change. F1 reuses the existing `config`-table cursor (`ORPHAN_SWEEP_CURSOR_KEY`, `memory-index.ts:256`) and the existing `.maintenance-active.json` marker file (`maintenance-marker.ts:25`). F2 reads only, no storage change of its own |
| **Testing** | vitest, extending `orphan-sweep-corpus-repair.vitest.ts` (F1) and `memory-drift-healing.vitest.ts` / a new scoped-scan gating test (F2) |

### Overview
Both fixes are narrow, additive tightenings of code that already exists and is already substantially
correct -- neither finding calls for a redesign. F1 adds a time-bounded early exit to a loop that is already
cursor-resumable, and repeats an existing refresh callback (`ctx.onPhase`) at a bounded cadence instead of
once. F2 replaces one filter predicate (`fs.existsSync` alone) with the same two predicates
(`matchesSpecDocumentPath`, `isGraphMetadataPath`) the full-tree walker already calls, both already exported
as single-path (non-directory-walk) functions from `spec-doc-paths.ts` -- no new discovery-walk logic is
written.

**Ready to implement directly** (mechanism confirmed against the live tree, no further investigation
needed): F1's time-budget check (one `Date.now()` comparison per loop iteration, reusing the existing
early-exit-and-persist-cursor branch shape at `:767-769`); F2's predicate swap (both predicates already
exist, pure, and single-path).

**Needs a light design decision during implementation, not a redesign**: the exact numeric time-budget and
refresh-cadence values for F1 (bounded above by `MAINTENANCE_MARKER_REFRESH_BEFORE_MS = 90_000`, per
spec.md's open questions), and whether F2's predicate calls are made directly from `memory-index.ts` against
`spec-doc-paths.ts`, or wrapped in one small shared single-path helper inside `memory-index-discovery.ts` so
the tree-walker's per-entry check and the scoped-scan's per-path filter provably call the same function.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, grounded in direct code reads of the orphan-sweep
  loop, the `timedPhase`/`onPhase`/marker-refresh chain, and the discovery-gate functions)
- [x] Success criteria measurable
- [x] Dependencies identified (F2 depends on `011-automatic-drift-self-healing` having shipped `scopedPaths`
  -- confirmed already live in the tree at the cited lines)

### Definition of Done
- [x] F1: wall-clock time budget added to the orphan-sweep loop, early-exit persists the cursor identically
  to the existing early-exit path (REQ-001, REQ-005)
- [x] F1: mid-loop, rate-gated marker-refresh added, verified to fire more than once for a long synthetic
  sweep (REQ-002)
- [x] F2: scoped-scan `specDocFiles` gated through `SPEC_DOCUMENT_FILENAMES` + `matchesSpecDocumentPath`
  (REQ-003, REQ-006)
- [x] F2: scoped-scan `graphMetadataFiles` no longer force-emptied; gated through `isGraphMetadataPath`
  (REQ-004)
- [x] Full-tree (non-scoped) scan behavior unchanged by either fix (SC-004)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two independent, additive tightenings on one existing file -- no new abstraction, no new storage, no new
process. F1 and F2 touch disjoint code regions of `memory-index.ts` (`:598-607` for F2, `:737-780` for F1)
and have no ordering dependency on each other.

### Key Components

**F1 -- time budget + refresh cadence inside `runGlobalOrphanSweep()` (`memory-index.ts:737-780`).**
The existing loop (`:758-772`) already tracks `cursor`/`nextCursor`/`scannedRows`/`swept`/`failed` across
iterations and already has one early-exit branch (`:767-769`, on `!sweep.nextCursor ||
sweep.scannedRows === 0`) that persists the cursor via `writeOrphanSweepCursor` after the loop
(`:774-776`). The plan adds:
1. A `loopStartedAt = Date.now()` captured immediately before the `for` loop.
2. A time-budget check at the top of each iteration (or immediately after each page's work, mirroring the
   existing `if (!sweep.nextCursor || sweep.scannedRows === 0)` early-exit shape): if
   `Date.now() - loopStartedAt` exceeds the budget, set `nextCursor` from the just-completed page (not
   `null`) and `break` -- this is a **budget-exit**, distinct from the existing **completion-exit**
   (`nextCursor = null`), because a budget-exit must persist a resumable cursor while a completion-exit
   correctly persists `null` (nothing left to resume). `writeOrphanSweepCursor(database, nextCursor)` at
   `:774-776` already handles both shapes identically -- no change needed there.
3. A rate-gated repeat of the phase-boundary refresh: `runGlobalOrphanSweep` is a closure inside
   `runIndexScan(args, ctx)` (`:446`), so `ctx.onPhase` is already reachable without new parameter
   threading. Track `lastRefreshAt` (seeded to `loopStartedAt`); inside the loop, if
   `Date.now() - lastRefreshAt` exceeds the chosen refresh interval, call `ctx.onPhase?.('orphan-sweep')`
   again and update `lastRefreshAt`. For a background (job-queued) scan this reaches the exact same
   `maintenance.refresh()` call the phase-entry invocation already uses (`:1762,1770`) -- no new marker
   plumbing, just a bounded repeat of an existing call.

**F2 -- discovery-gate parity for scoped-scan file lists (`memory-index.ts:598-607`).**
Today: `specDocFiles` filters `scopedScanPaths` by `fs.existsSync` only (`:598-600`); `graphMetadataFiles`
is unconditionally `Object.assign([], ...)` for scoped scans (`:603`). The plan replaces both:
- `specDocFiles`: filter `scopedScanPaths` by `fs.existsSync(filePath) && SPEC_DOCUMENT_FILENAMES.has(basename)
  && matchesSpecDocumentPath(filePath, basename)`, where `basename = path.basename(filePath).toLowerCase()`
  -- the exact allowlist-membership-plus-predicate combination the tree-walker applies at
  `memory-index-discovery.ts:176,180`. `matchesSpecDocumentPath` already internally calls
  `canClassifyAsSpecDocument` (-> `isSpecsScopedPath` + `shouldIndexForMemory` + `!isSpecDocumentExcludedPath`,
  `spec-doc-paths.ts:106-110`), so importing this one function reuses all three of the finding's cited gates
  (allowlist membership is checked separately via `SPEC_DOCUMENT_FILENAMES.has`, since
  `matchesSpecDocumentPath` takes the basename as a parameter rather than re-deriving the allowlist check
  itself).
- `graphMetadataFiles`: filter `scopedScanPaths` by `fs.existsSync(filePath) && isGraphMetadataPath(filePath)`
  (`spec-doc-paths.ts:176-194`), replacing the unconditional empty assignment.
- Both `SPEC_DOCUMENT_FILENAMES`, `matchesSpecDocumentPath`, and `isGraphMetadataPath` are already exported
  from `spec-doc-paths.ts` and already imported into `memory-index-discovery.ts` (`:11-18`);
  `memory-index.ts` already imports `findSpecDocuments`/`findGraphMetadataFiles` from
  `memory-index-discovery.ts` (`:44-53`), so the same relative-import path is available for whichever import
  route the implementer picks (see the open question below).

### Decision: direct predicate import vs. a shared single-path helper
Two options, both satisfy REQ-003/REQ-004:
- **Option A (minimal diff)**: `memory-index.ts` imports `SPEC_DOCUMENT_FILENAMES`,
  `matchesSpecDocumentPath`, `isGraphMetadataPath` directly from `../lib/config/spec-doc-paths.js` and
  applies them inline in the `scopedScanPaths.length > 0` branches at `:598-607`.
- **Option B (drift-resistant)**: factor one small exported helper in `memory-index-discovery.ts`, e.g.
  `isEligibleSpecDocumentPath(filePath)` and `isEligibleGraphMetadataPath(filePath)`, each wrapping the same
  predicate calls Option A would inline. The tree-walker's per-entry check (`:176-187`) and the scoped-scan's
  per-path filter then both route through the same two functions, so a future change to the gate logic
  cannot update one call site and silently miss the other.

Option B is the safer default: it guarantees the tree-walker and the scoped-scan path can never independently
drift on what counts as an eligible spec document, since both would call the identical function. Final
choice is an implementation-time decision; either satisfies every REQ/SC in this spec.

### Data Flow
F1: `runIndexScan` enters the `orphan-sweep` phase -> `ctx.onPhase('orphan-sweep')` fires once (phase-entry
refresh, existing behavior) -> `runGlobalOrphanSweep()`'s loop runs pages -> **new**: each iteration checks
elapsed wall-time against the budget and elapsed time-since-last-refresh against the cadence interval ->
budget exceeded: exit early with a resumable cursor (same shape as today's completion-exit) -> cadence
interval exceeded: re-fire `ctx.onPhase('orphan-sweep')`, refreshing the marker again before continuing the
loop. F2: a scoped scan's candidate path list (from the Layer-2 git-hook drift marker) reaches
`memory-index.ts:598-607` -> **new**: each path is checked for existence AND spec-document/graph-metadata
eligibility via the shared predicates -> only eligible paths populate `specDocFiles`/`graphMetadataFiles` ->
downstream indexing proceeds exactly as it already does for a full-tree-discovered file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runGlobalOrphanSweep()` loop (`memory-index.ts:737-780`) | Runs up to 1000 pages with no wall-clock budget, one phase-entry-only marker refresh | Add a time-budget early exit (persisting a resumable cursor) and a rate-gated mid-loop `ctx.onPhase` re-fire | Fixture forcing a budget-exit persists a resumable cursor and resumes correctly on a follow-up invocation; synthetic long sweep shows more than one refresh call |
| `timedPhase`/`ctx.onPhase` wiring (`memory-index.ts:965-980`, `:1762-1770`) | Refreshes the marker once per phase, at entry | No change to `timedPhase` itself -- F1 calls `ctx.onPhase` a second (and further) time from inside `runGlobalOrphanSweep`'s own loop, reusing the existing callback | Background-scan job-phase/marker-refresh call count increases for a long sweep, verified via a spy/mock on `ctx.onPhase` in a unit test |
| `specDocFiles` construction for scoped scans (`memory-index.ts:598-600`) | `fs.existsSync` only | Replace with allowlist + `matchesSpecDocumentPath` gating, reusing `memory-index-discovery.ts`'s existing predicates | Fixture with one legit spec-doc rename and one non-spec-file rename in the same scoped-path list: only the spec-doc path survives |
| `graphMetadataFiles` construction for scoped scans (`memory-index.ts:603`) | Unconditionally empty | Replace with `isGraphMetadataPath` gating over `scopedScanPaths` | Fixture with a renamed `graph-metadata.json` in the scoped-path list: it appears in `graphMetadataFiles`, not silently dropped |
| `findSpecDocuments` (`memory-index-discovery.ts:141-196`) | The full-tree walker's per-entry gate logic | Unchanged in behavior; optionally its per-entry gate calls are factored into a shared helper F2 also calls (Option B) | No behavior change for full-tree scans; a regression test confirms `findSpecDocuments`'s own output is byte-identical pre/post this change |

Required inventories:
- Existing orphan-sweep call sites: `rg -n "runGlobalOrphanSweep|sweepOrphanIndexRows" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` -- confirms both invocation sites (`:985`, `:1473`) inherit the fix uniformly since both call the same closure.
- Existing scoped-scan consumers: `rg -n "scopedScanPaths" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` -- confirms `specDocFiles`/`graphMetadataFiles` construction (`:598-607`) are the only two sites this fix needs to touch; the later `categorizeFilesForIndexing({ staleCandidatePaths: scopedScanPaths })` call sites (`:992`, `:1162`) are a separate, already-correct consumer not affected by this fix.
- Existing discovery-gate precedent: `rg -n "SPEC_DOCUMENT_FILENAMES|matchesSpecDocumentPath|isGraphMetadataPath|shouldIndexForMemory" .opencode/skills/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` -- confirms the exact predicates this plan reuses and that no third, parallel gate-check mechanism exists that would need matching.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-confirm the live line numbers cited in spec.md/plan.md against the current tree in case a
  concurrent session has touched `memory-index.ts` since this plan was written (`rg -n
  "ORPHAN_SWEEP_MAX_PAGES|scopedScanPaths|runGlobalOrphanSweep" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`)
  -- confirmed unchanged
- [x] Decide the F1 time-budget value and refresh-cadence interval (bounded above by
  `MAINTENANCE_MARKER_REFRESH_BEFORE_MS = 90_000`, with headroom per NFR-P02), documenting the chosen
  numbers and rationale before writing code -- 45,000ms / 20,000ms defaults, env-overridable
- [x] Decide Option A vs. Option B for F2's predicate wiring (direct import vs. shared helper in
  `memory-index-discovery.ts`) -- Option A (direct import), minimal-diff, findSpecDocuments untouched

### Phase 2: F1 -- Orphan-Sweep Time Budget + Refresh Cadence
- [x] Add the wall-clock budget check inside `runGlobalOrphanSweep()`'s loop, persisting a resumable cursor
  on budget-exit (REQ-001)
- [x] Add the rate-gated `ctx.onPhase('orphan-sweep')` re-fire inside the loop (REQ-002)
- [x] Unit test: fixture larger than the time budget exits early with a resumable cursor, and a follow-up
  invocation resumes and completes (REQ-001, REQ-005)
- [x] Unit test: synthetic long sweep, run through the REAL `runGlobalOrphanSweep()` function under an
  ENQUEUE-heavy synthetic orphan backlog (not a scan-only mirror harness), shows more than one
  `ctx.onPhase`/refresh call (REQ-002), via a spy on the `onPhase` callback passed into `runIndexScan`'s
  `ctx` -- rows are queued via `appendMemoryDriftSuspects`, not `deleteIndexedRecordIds`; the DELETE-cascade
  cost this fix was originally motivated by remains unverified (see spec.md REQ-002 verification note)
- [x] Equivalence test: a fixture split across two budget-limited invocations produces the identical final
  swept-row set as one unbounded invocation over the same fixture (REQ-005)

### Phase 3: F2 -- Scoped-Scan Discovery-Gate Parity
- [x] Implement the chosen Option (A or B) for `specDocFiles` gating (REQ-003)
- [x] Implement the chosen Option (A or B) for `graphMetadataFiles` gating, removing the unconditional
  empty-assignment (REQ-004)
- [x] Unit test: scoped-path fixture with one legit spec-doc rename plus one non-spec-file rename --
  correct split (REQ-003, REQ-006)
- [x] Unit test: scoped-path fixture with a renamed `graph-metadata.json` -- lands in `graphMetadataFiles`,
  not dropped (REQ-004)
- [x] Regression test: `findSpecDocuments`'s full-tree-walk output is unchanged by this fix (SC-004)

### Phase 4: Verification
- [x] `bash validate.sh --strict` run, evidence captured
- [x] Confirm both invocation sites of `runGlobalOrphanSweep()` (`:985`, `:1473`) inherit the F1 fix
  uniformly (code-review pass, since both call the same closure)
- [x] Documentation updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | F1 budget-exit correctness, refresh-cadence call count (verified via the real `runGlobalOrphanSweep()` under an ENQUEUE-heavy synthetic backlog, not a scan-only mirror harness; the DELETE-cascade path remains unverified), cursor-resume equivalence; F2 gate-parity correctness for both `specDocFiles` and `graphMetadataFiles` | vitest, extending `orphan-sweep-corpus-repair.vitest.ts` and `memory-drift-healing.vitest.ts` |
| Regression | Full-tree (non-scoped) scan output unchanged by F2; existing orphan-sweep tests (`orphan-sweep-corpus-repair.vitest.ts`, `launcher-stop-hook-orphan-sweep.vitest.ts`, `orphan-sweeper-ipc-preserve.vitest.ts`) still pass unmodified | vitest |
| Manual | Code-review pass confirming both `runGlobalOrphanSweep()` call sites (`:985`, `:1473`) inherit F1 uniformly | Direct read |
| Strict validation | `validate.sh --strict` sweep after implementation | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `011-automatic-drift-self-healing` (Layer 2, `scopedPaths`) | Internal | Shipped -- confirmed live in the tree at `memory-index.ts:471,598-607` | F2 fixes gating for a mechanism that must already exist; if it were somehow reverted, F2 would have no live consumer to protect (not a blocker for authoring the fix, only for its production impact) |
| `lib/storage/maintenance-marker.ts` (`beginMaintenance`, TTL/refresh constants) | Internal | Shipped, unmodified by this phase | F1's chosen time-budget/refresh-interval values are meaningless without these constants to bound them against |
| `lib/config/spec-doc-paths.ts` (`matchesSpecDocumentPath`, `isGraphMetadataPath`, `SPEC_DOCUMENT_FILENAMES`) | Internal | Shipped, already used by the full-tree walker | F2 has no alternate implementation path without these -- they are the entire fix |
| Existing cursor-persistence mechanism (`readOrphanSweepCursor`/`writeOrphanSweepCursor`) | Internal | Shipped, unmodified by this phase | F1's budget-exit reuses this verbatim; without it, a budget-exit would need a new resumption mechanism instead of reusing the proven one |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: F1's equivalence test (REQ-005) finds a row-skip or double-delete under the budgeted
  multi-invocation path; or F2's fixture test (REQ-006) finds a legitimate spec-document rename incorrectly
  excluded.
- **Procedure**: Both fixes are confined to two small, disjoint regions of one file with no schema or
  external-interface change -- `git revert` the specific commit(s). F1's time-budget/refresh-cadence code is
  purely additive around the existing loop and can be reverted independently of F2's gating change, and vice
  versa, since neither depends on the other's code.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (F1) ──► Phase 4 (Verify)
                └──► Phase 3 (F2) ──►
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | F1, F2 |
| F1 | Setup | Verify |
| F2 | Setup | Verify |
| Verify | F1, F2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| F1 (time budget + refresh cadence) | Low-Med | 2-4 hours |
| F2 (discovery-gate parity) | Low | 1-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **4.5-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] F1's chosen time-budget/refresh-interval values documented with rationale before merge
- [ ] F2's Option A/B decision documented before merge
- [ ] Both invocation sites of `runGlobalOrphanSweep()` confirmed to inherit F1 uniformly

### Rollback Procedure
1. `git revert` the F1 commit if the equivalence test regresses row-processing correctness -- the loop
   reverts to today's unbounded-but-capped-at-1000-pages behavior, no data-loss risk since nothing about
   row deletion logic changes, only the loop's exit conditions
2. `git revert` the F2 commit independently if the gate-parity change rejects a legitimate rename -- the
   scoped-scan reverts to `fs.existsSync`-only filtering; Layer 3's full-sweep backstop (from
   `011-automatic-drift-self-healing`) still eventually catches drift either way, so this is a
   fast-path-only regression, not a correctness loss
3. Re-run `validate.sh --strict` to confirm the revert restored expected behavior

### Data Reversal
- **Has data migrations?** No -- neither fix touches the database schema.
- **Reversal procedure**: N/A. F1's cursor value is self-correcting on the next scan regardless of which
  code version wrote it (same config-table shape before and after). F2 has no persisted side effect of its
  own to reverse -- it only changes which paths become scan input.
<!-- /ANCHOR:enhanced-rollback -->
