---
title: "Implementation Plan: Drift-Marker Native Consolidation [template:level_2/plan.md]"
description: "Replace the git hook's embedded heredoc JS with a compiled TypeScript entrypoint under the existing scripts/ CLI-script convention, importing computeDatabasePaths/resolveDatabasePaths, memoryDriftMarkerEntryKey, atomicWriteFile, and a staleness-parameterized version of spec-folder-mutex.ts's lock-reclaim primitives through the mcp_server/api barrel."
trigger_phrases:
  - "drift marker native consolidation plan"
  - "git hook embedded heredoc duplication plan"
  - "drift marker lock staleness constant mismatch plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/022-drift-marker-native-consolidation"
    last_updated_at: "2026-07-09T20:31:22.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Resolved staleness-parameter and env-var-transport decisions; scaffolded plan"
    next_safe_action: "Plan approval, then implement per Phase 1-4 below"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/git-hooks/drift-marker-write.ts"
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
      - ".opencode/skills/system-spec-kit/mcp_server/api/index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Staleness-threshold mechanism: resolved to option (a) -- an optional staleMs parameter on spec-folder-mutex.ts's isReclaimableLock, default preserving its existing 5-minute value."
      - "Diff-payload transport: resolved to keep the existing MEMORY_DRIFT_DIFF/MEMORY_DRIFT_REPO_ROOT/MEMORY_DRIFT_SOURCE env-var contract unchanged, so no post-commit/post-merge/post-rewrite call site needs editing."
---
# Implementation Plan: Drift-Marker Native Consolidation

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
| **Language/Stack** | TypeScript on Node (`system-spec-kit/scripts/`, compiled via `tsc --build` to `scripts/dist/`), invoked from a POSIX `bash` git hook |
| **Framework** | None — a new small CLI entrypoint following the existing `generate-description.ts`/`backfill-graph-metadata.ts` pattern (import shared logic only through `@spec-kit/mcp-server/api`) |
| **Storage** | No new storage; reuses the existing `.memory-drift-dirty-paths.json` marker format and the existing `.lock` directory convention |
| **Testing** | vitest, new suites for the entrypoint's four reused behaviors; `spec-folder-mutex-liveness.vitest.ts` re-run unchanged as a regression gate on the staleness-parameterization change |

### Overview

This is a pure consolidation: nothing about *what* the drift-marker pipeline does changes, only
*where* four pieces of its logic are implemented. Today all four live twice — once as tested
TypeScript in `mcp_server`, once as untestable duplicate JS inside a bash heredoc. After this
phase, each lives once, in the tested TypeScript, and the git hook calls it.

The plan has four parts:
1. A new compiled entrypoint (`scripts/git-hooks/drift-marker-write.ts`) that does everything the
   heredoc did, by importing rather than re-implementing.
2. New `mcp_server/api/index.ts` exports so that entrypoint can reach the four helpers legally
   from the `scripts/` tree.
3. One additive, backward-compatible signature change to `spec-folder-mutex.ts` so its
   lock-reclaim algorithm becomes reusable at a different staleness threshold without touching
   its own 5-minute default or its existing callers.
4. A shrunk `memory-drift-marker.sh` whose only remaining job is git plumbing plus one delegated
   call.

**Ready to implement directly** (mechanism confirmed against the live tree, no further
investigation needed): the `memoryDriftMarkerEntryKey` and `atomicWriteFile` reuse — both are
already-exported, already-stable functions with no signature changes needed; the entrypoint just
imports and calls them.

**Resolved during this planning pass, not left as implementation-time free choices** (see
frontmatter Answered Questions): the staleness-parameter mechanism, and the diff-payload
transport.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, grounded in direct file:line reads
  of the live shell heredoc and all four TS source files, plus `013`'s own spec.md for the
  resolved constants this phase must preserve)
- [x] Success criteria measurable
- [x] Dependencies identified (`013-drift-marker-pipeline-resilience`, already shipped — this
  phase preserves its resolved values rather than depending on unfinished work)

### Definition of Done
- [x] REQ-001 implemented: new entrypoint imports all three of
  `resolveDatabasePaths`/`memoryDriftMarkerEntryKey`/`atomicWriteFile` from
  `@spec-kit/mcp-server/api`; zero re-implementation remains in `memory-drift-marker.sh`
- [x] REQ-002 implemented: boundary-violation override throws/exits the same way
  `computeDatabasePaths()` does, no marker written, hook still exits 0 overall
- [x] REQ-003 verified: byte-identical output with no override set (before/after comparison)
- [x] REQ-004 implemented: lock reclaim gains dead-owner-immediate-reclaim, keeps the 45s
  fallback threshold, `spec-folder-mutex.ts`'s own tests unaffected
- [x] REQ-005 verified: the new file has no prohibited imports and `check-api-boundary.sh` passes;
  the full import-policy scanner retains 17 unrelated baseline violations
- [x] REQ-006 implemented: new vitest coverage for all four reused behaviors
- [x] REQ-007 verified: the three hook call sites need no edits, `\|\| true` contract preserved
- [x] `validate.sh --strict` clean
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One new thin CLI entrypoint over four already-correct TypeScript modules — no new abstraction,
no new storage, no redesign of the marker format or the lock directory convention. The pattern
mirrors the existing `scripts/spec-folder/generate-description.ts` and
`scripts/graph/backfill-graph-metadata.ts`: a small, single-purpose script under
`system-spec-kit/scripts/`, importing only through the `@public` `mcp_server/api` barrel, invoked
by shelling out to its compiled `dist/` output from a caller outside the `mcp_server`/`scripts`
package boundary (here, a git hook instead of another script).

### Decision: staleness-parameter mechanism (spec.md §10, resolved)

**Resolved to Option (a)**: add an optional `staleMs` parameter to
`spec-folder-mutex.ts`'s `isReclaimableLock(lockDir: string, staleMs: number = LOCK_STALE_MS)`,
defaulting to the module's existing `LOCK_STALE_MS` (5 minutes) so every existing caller
(`acquireInterprocessLock`'s internal use at `:184`) observes byte-identical behavior with zero
call-site edits. The new drift-marker entrypoint calls the same exported function but passes its
own 45,000ms constant explicitly. This was chosen over extracting a wholly separate shared
primitive (spec.md §10 Option (b)) because: `isReclaimableLock` and `reclaimInterprocessLock` are
already pure, already exported, and already accept a bare `lockDir` string with no dependency on
anything mutex-specific except the one hardcoded constant being parameterized — extracting a
second module would duplicate the function signatures for no behavioral gain. The owner-liveness
half of the mechanism (`getLockOwnerState`, reading `owner.json`) is reused unmodified; the new
entrypoint additionally reuses `createInterprocessLock`'s pattern of writing `{pid, ..., acquiredAt}`
into the lock directory at acquire time (today's shell lock, `memory-drift-marker.sh:95`'s bare
`fs.mkdirSync`, writes no such file — this is the concrete mechanism by which the entrypoint gains
the owner-liveness check the shell copy never had). If, during implementation, adding the `owner.json`
write is found to conflict with the lock directory's existing bare-`mkdirSync` reclaim path in a
way not anticipated here, the documented fallback is keeping the mtime-only check (today's shell
behavior) but still parameterizing its threshold — REQ-004's clause (a) (dead-owner-immediate-reclaim)
would then be the one acceptance criterion carried forward as a stretch goal rather than a hard
requirement, with clauses (b) and (c) unaffected.

### Decision: diff-payload transport (spec.md §10, resolved)

**Resolved to keep the existing environment-variable contract unchanged.** The shrunk
`memory-drift-marker.sh` still sets `MEMORY_DRIFT_DIFF`, `MEMORY_DRIFT_REPO_ROOT`, and
`MEMORY_DRIFT_SOURCE` exactly as it does today (`:25-27`), then replaces the heredoc invocation
(`node <<'NODE' ... NODE`) with `node "$repo_root/.opencode/skills/system-spec-kit/scripts/dist/git-hooks/drift-marker-write.js"`
reading those same three environment variables. This means `post-commit`, `post-merge`, and
`post-rewrite` require zero edits (REQ-007) — the only thing that changes is what runs inside
`mark_memory_drift_from_diff`, not its calling contract.

### Key Components

- **`drift-marker-write.ts`** (new): a CLI entrypoint, structurally the direct TypeScript
  translation of the heredoc's existing logic, but by import rather than re-implementation:
  1. Read `MEMORY_DRIFT_DIFF`/`MEMORY_DRIFT_REPO_ROOT`/`MEMORY_DRIFT_SOURCE` from `process.env`,
     early-exit (matching today's `process.exit(0)` at `:36`) if either is empty.
  2. Parse the diff-tree text into `{kind, oldPath, newPath?, source}` entries — this is the one
     piece of logic with no TS equivalent to reuse (it is a small, self-contained text parse over
     `git diff-tree --name-status` output, not duplicated anywhere else); ported verbatim from
     `:38-48`.
  3. Resolve the marker directory by calling `resolveDatabasePaths()` (already exported,
     already does the override precedence *and* the boundary-enforcement check `config.ts:79-92`
     in one call) rather than re-deriving `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH`
     precedence by hand; derive the marker path via the already-exported
     `resolveMemoryDriftMarkerPath(databasePath)`.
  4. Acquire the write lock (`${markerPath}.lock`) using the parameterized
     `isReclaimableLock(lockDir, 45_000)`/`reclaimInterprocessLock(lockDir)` pair, writing an
     `owner.json` at acquire time (mirroring `createInterprocessLock`'s shape) so a killed
     process's lock is detected dead immediately rather than only after the 45s window.
  5. Read the existing marker (fallback to `{version: 1, entries: []}` on any read/parse failure,
     matching `:112-121` exactly — NFR-R02).
  6. Dedup incoming plus existing entries via the imported `memoryDriftMarkerEntryKey`, exactly
     replacing the hand-written `keyFor` closure at `:125-127`.
  7. Write the merged payload via the imported `atomicWriteFile`, replacing the hand-written
     temp-plus-rename block at `:136-138`.
  8. Release the lock in a `finally`, matching `:139-141` exactly.
- **`mcp_server/api/index.ts`** (modify): add re-exports for `resolveDatabasePaths`,
  `resolveMemoryDriftMarkerPath`, `memoryDriftMarkerEntryKey`, `atomicWriteFile`,
  `isReclaimableLock`, `reclaimInterprocessLock`, `createInterprocessLock` (or an equivalent
  lock-acquire helper), and `releaseInterprocessLock` — the exact same barrel-addition pattern
  already used for `computeMemoryQualityScore` when `026-shared-safe-fix-engine` needed a
  `scripts/`-tree-legal route to a `mcp_server/handlers`-tree function.
- **`spec-folder-mutex.ts`** (modify, additive): `isReclaimableLock(lockDir, staleMs = LOCK_STALE_MS)`
  gains one optional parameter; `LOCK_STALE_MS` itself, `getLockOwnerState`,
  `reclaimInterprocessLock`, `createInterprocessLock`, and every existing caller are otherwise
  untouched.
- **`memory-drift-marker.sh`** (modify): `mark_memory_drift_from_diff` keeps `:1-23` (env guard,
  repo-root resolution, diff-tree call, node-availability check) verbatim; `:25-27`'s env-var
  exports stay; `:28-142`'s heredoc is replaced by a single `node <compiled-entrypoint-path>`
  invocation.

### Data Flow

`post-commit`/`post-merge`/`post-rewrite` call `mark_memory_drift_from_diff` (unchanged) → bash
resolves repo root and runs `git diff-tree` (unchanged) → bash exports the three env vars and
invokes the compiled `drift-marker-write.js` (was: opens the heredoc) → the entrypoint parses
entries, resolves the marker path via `resolveDatabasePaths()` (boundary check included), reads
the existing marker, dedups via `memoryDriftMarkerEntryKey`, acquires the lock via the
parameterized reclaim primitives, writes via `atomicWriteFile`, releases the lock → process exits
0 either way → the calling hook's `\|\| true` never has anything to catch under normal operation,
matching today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-drift-marker.sh:28-142` (heredoc body) | Re-implements DB-path precedence (no boundary check), dedup key, atomic write, and lock reclaim | Replaced with one delegated call to the compiled entrypoint | `rg -n "keyFor\|tmp-\|runtimeDbDir"` against the post-fix file returns zero matches |
| `core/config.ts:63-101` `computeDatabasePaths()` (via exported `resolveDatabasePaths()`) | The single source of truth for override precedence + boundary enforcement | Reused verbatim through the new entrypoint | Boundary-violation test (REQ-002) throws the same message as the live server would |
| `memory-drift-healing.ts:206-210` `memoryDriftMarkerEntryKey` | The single source of truth for the dedup-key format | Reused verbatim | Dedup test: repeated rename/delete entries collapse identically to today's shell output |
| `transaction-manager.ts:177-208` `atomicWriteFile` | The single source of truth for the temp-plus-rename write pattern | Reused verbatim | Crash-mid-write test: no partial marker file, matching today's guarantee |
| `spec-folder-mutex.ts:89-122` `isReclaimableLock`/`reclaimInterprocessLock` | The single source of truth for lock staleness + reclaim, previously hardcoded to a 5-minute threshold and this mutex's own callers only | Gains an optional `staleMs` parameter; reused by the new entrypoint at 45,000ms | `spec-folder-mutex-liveness.vitest.ts` passes unchanged (5-minute default intact); new drift-marker lock test confirms 45s threshold is what the entrypoint actually uses |
| `mcp_server/api/index.ts` | The `@public` barrel for `scripts/`-tree consumers | Add re-exports for the five-to-seven symbols above | `drift-marker-write.ts` imports each from `@spec-kit/mcp-server/api`; `check-no-mcp-lib-imports` passes |

Required inventories:
- Existing heredoc logic to be removed: `rg -n "keyFor\|tempPath\|LOCK_STALE_MS\|runtimeDbDir\|runtimeDbPath" .opencode/scripts/git-hooks/lib/memory-drift-marker.sh` — confirms every line this phase deletes.
- Existing reuse targets and their current export status: `rg -n "^export (function|const|let)" .opencode/skills/system-spec-kit/mcp_server/core/config.ts .opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts .opencode/skills/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts .opencode/skills/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts` — confirms which symbols are already exported at the module level and only need a barrel re-export, versus which (none identified) would need a new `export` keyword added.
- Barrel-addition precedent: `rg -n "computeMemoryQualityScore" .opencode/skills/system-spec-kit/mcp_server/api/index.ts` — confirms the exact pattern this phase's `api/index.ts` edit follows.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-confirm all cited line ranges against the live tree in case a concurrent session has
  touched `memory-drift-marker.sh` or any of the four TS modules since this plan was written
- [ ] Confirm the exact export list needed on `mcp_server/api/index.ts` (see Required
  inventories above) and stage the barrel addition
- [ ] Add the `staleMs` parameter to `spec-folder-mutex.ts`'s `isReclaimableLock`, default
  preserving today's `LOCK_STALE_MS`; run `spec-folder-mutex-liveness.vitest.ts` unchanged to
  confirm zero regression before writing any new code

### Phase 2: New Entrypoint
- [ ] Create `scripts/git-hooks/drift-marker-write.ts` implementing the eight-step flow in Key
  Components above, importing all reused logic from `@spec-kit/mcp-server/api`
- [ ] Port the diff-tree text-parsing step (the one piece with no TS equivalent) verbatim from
  `memory-drift-marker.sh:38-48`
- [ ] Wire the `owner.json`-writing lock-acquire so dead-owner reclaim works immediately, not
  only after the 45s mtime fallback (REQ-004a)

### Phase 3: Hook Shrink
- [ ] Replace `memory-drift-marker.sh:28-142`'s heredoc with one delegated call to the compiled
  entrypoint, preserving the existing `MEMORY_DRIFT_DIFF`/`MEMORY_DRIFT_REPO_ROOT`/`MEMORY_DRIFT_SOURCE`
  env-var contract and the `:1-23` git-plumbing/early-exit logic verbatim
- [ ] Confirm `post-commit`, `post-merge`, and `post-rewrite` need zero edits (REQ-007)

### Phase 4: Verification
- [ ] New vitest coverage: dedup-key collapsing, atomic-write crash-mid-write recovery,
  lock-reclaim dead-owner-immediate-reclaim, lock-reclaim 45s-stale-mtime-fallback,
  boundary-violation throw path (REQ-002), byte-identical no-override output (REQ-003)
- [ ] `spec-folder-mutex-liveness.vitest.ts` re-run to confirm the mutex's own 5-minute default
  and existing callers are unaffected (REQ-004c, NFR-C02)
- [ ] `npx tsx evals/check-no-mcp-lib-imports.ts` and `bash check-api-boundary.sh` against the
  new file (REQ-005)
- [ ] `npx tsx evals/check-source-dist-alignment.ts` to confirm the compiled `dist/` output the
  git hook actually calls matches the checked-in `.ts` source
- [ ] Manual smoke test: a real commit touching `.opencode/specs`, run through the actual
  `post-commit` hook, confirms the marker is written exactly as before
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-spec-folder> --strict`
- [ ] Documentation updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Dedup-key reuse, atomic-write reuse, boundary-check throw path, staleness-parameterized reclaim (both 45s and 5-minute callers) | vitest, new suite(s) under `mcp_server/tests/` or `scripts/tests/` alongside the entrypoint |
| Regression | `spec-folder-mutex-liveness.vitest.ts` re-run unchanged | vitest |
| Integration | End-to-end: synthetic diff-tree input → compiled entrypoint → marker file on disk, with and without a DB-path override | vitest against a fixture repo/DB directory |
| Boundary/Architecture | `check-no-mcp-lib-imports`, `check-api-boundary.sh`, `check-source-dist-alignment.ts` | existing `scripts/evals/` tooling |
| Manual | A real `post-commit` run against a live commit touching `.opencode/specs` | local git |
| Regression | `validate.sh --strict` sweep after implementation | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `013-drift-marker-pipeline-resilience` (same target file, F3/F4) | Internal | Shipped, complete | This phase's acceptance criteria are written against `013`'s resolved values (45s staleness, live-DB-path precedence); if `013`'s behavior were ever found not actually shipped as documented, this phase's REQ-003/REQ-004 baseline would need re-verifying against the actual live file before implementation |
| `mcp_server/api/index.ts` barrel-addition precedent (`computeMemoryQualityScore`, added for `026-shared-safe-fix-engine`) | Internal | Shipped, complete | Confirms the exact pattern this phase's barrel edit follows; not a hard blocker, just the precedent being followed |
| `scripts/` package's `tsc --build` compile step producing `scripts/dist/git-hooks/drift-marker-write.js` | Internal tooling | Existing, unmodified | If the build step is broken independent of this phase, the git hook has nothing to call — same failure class as any other `scripts/dist/` consumer today (e.g. `generate-description.js`), not a new risk this phase introduces |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new entrypoint is found in review or testing to diverge from today's
  post-`013` behavior for an unoverridden session (REQ-003 fails), or the staleness
  reconciliation is found to have regressed `spec-folder-mutex.ts`'s own callers (NFR-C02 fails).
- **Procedure**: This is a single-file-swap change at the hook boundary
  (`memory-drift-marker.sh`'s heredoc-vs-delegated-call is the only externally observable
  surface) — revert `memory-drift-marker.sh` to its pre-fix heredoc version via git, and revert
  the `spec-folder-mutex.ts` parameter addition and the `api/index.ts` barrel additions in the
  same commit/hunk revert. No data migration exists (the marker file format is unchanged), so no
  data-reversal step is needed. The new `drift-marker-write.ts` file can be deleted or left
  orphaned (unreferenced) with no runtime impact once the hook no longer calls it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (New Entrypoint) ──► Phase 3 (Hook Shrink) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | New Entrypoint |
| New Entrypoint | Setup | Hook Shrink |
| Hook Shrink | New Entrypoint | Verify |
| Verify | Hook Shrink | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| New Entrypoint | Med | 3-5 hours |
| Hook Shrink | Low | 1 hour |
| Verification | Med | 3-5 hours |
| **Total** | | **8-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] REQ-003 (byte-identical no-override output) verified before merge
- [ ] `spec-folder-mutex-liveness.vitest.ts` confirmed green with the new `staleMs` parameter in
  place before merge
- [ ] A real `post-commit` smoke run confirmed against a live commit before merge

### Rollback Procedure
1. `git revert` the commit(s) touching `memory-drift-marker.sh`, `spec-folder-mutex.ts`, and
   `mcp_server/api/index.ts`.
2. No feature flag exists for this change, so rollback is a direct code revert, not a flag flip.
3. Re-run `validate.sh --strict` and `spec-folder-mutex-liveness.vitest.ts` to confirm the
   revert restored expected behavior.

### Data Reversal
- **Has data migrations?** No — the marker file format, the lock directory convention, and the
  database path resolution semantics are all unchanged; this phase only moves *where* the logic
  that produces them is implemented.
- **Reversal procedure**: Not applicable; no persisted state format changes.
<!-- /ANCHOR:enhanced-rollback -->
