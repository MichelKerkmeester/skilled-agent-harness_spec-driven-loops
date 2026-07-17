---
title: "Implementation Plan: Automatic Drift Self-Healing [template:level_2/plan.md]"
description: "Three layers -- query-time existence filtering as the safety net, a git-hook-triggered scoped scan as the event-driven fast path, and a full-sweep backstop -- wired onto the scan/reconcile/sweep machinery that already exists in incremental-index.ts, without adding a filesystem watcher, a new timer, or a new daemon responsibility."
trigger_phrases:
  - "automatic drift self-healing plan"
  - "query-time existence filtering plan"
  - "post-commit dirty-paths marker plan"
  - "orphan sweep backstop plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/014-automatic-drift-self-healing"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers:
      - "007/008 dependency shipped; no longer blocking (tasks.md T001/T002)"
      - "REQ-008 numeric latency benchmark satisfied via sibling packet 020-query-time-filter-benchmark; no longer blocking (CHK-064)"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts"
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
      - ".opencode/scripts/git-hooks/post-commit"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-011-automatic-drift-self-healing"
      parent_session_id: null
    completion_pct: 88
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Automatic Drift Self-Healing

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
| **Language/Stack** | TypeScript on Node (MCP server, `mcp_server/**`, compiled to `mcp_server/dist/**`); bash for the git hooks (`.opencode/scripts/git-hooks/**`) |
| **Framework** | None — direct handler/module edits plus a new startup check; no new abstraction layer |
| **Storage** | Existing `config` SQLite table (`memory-index.ts:239`'s `CREATE TABLE IF NOT EXISTS config`) for the suspect-row queue; a plain JSON dotfile in the memory DB directory (`mcp_server/database/`) for the Layer 2 marker |
| **Testing** | vitest for the Layer 1 filter, the suspect-queue helpers, and the Layer 3 loop-to-completion logic; a shell-level smoke test for the git hook (mirrors the existing `post-commit` hook's own test discipline) |

### Overview
All three layers wire onto machinery that already exists and already works — `reconcileMoves()`,
`sweepOrphanIndexRows()`, `listStaleIndexedPaths()`, `buildPathExistenceCache()` — none of which is
rebuilt here. What's missing is exclusively the **trigger**: nothing calls this machinery automatically,
the one call site that does run it caps out after 200 rows, and the query path never consults it at all.
This plan closes exactly those three gaps, one gap per layer, and explicitly does not touch the
already-correct reconciliation algorithms themselves.

**Ready to implement directly** (mechanism confirmed against the live tree, no further investigation
needed): Layer 1's existence filter (reuses `resolveFilePath()` and `buildPathExistenceCache()`
verbatim), Layer 3's loop-to-completion change to the existing sweep call, and the git hook's
`diff-tree -M`-based rename/delete detection (the existing `post-commit` hook already demonstrates the
exact `git diff-tree` invocation pattern to extend).

**Needs a light design decision during implementation, not a redesign**: the exact marker file schema
(single pending-list vs. append log) and the suspect-queue's grace-period policy (see spec.md Open
Questions) are intentionally left as an implementation-time decision within the constraints REQ-004 and
NFR-R01/R02 already set, rather than over-specified here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, grounded in direct code reads of the existing
  scan/reconcile/sweep/query machinery)
- [x] Success criteria measurable
- [x] Dependencies identified (007/008 must land first; confirmed as a hard blocker, not a soft preference)

### Definition of Done
- [x] Layer 1 query-time existence filter implemented, flag-gated default-off (REQ-001, REQ-002). Evidence:
  `capability-flags.ts:238` (`SPECKIT_QUERY_TIME_EXISTENCE_FILTER`), `memory-search.ts:372-433`
  (`applyQueryTimeExistenceFilter`), wired at `memory-search.ts:1597-1598`.
- [x] Layer 1 latency budget measured and documented (REQ-008). Status: satisfied via sibling packet
  `020-query-time-filter-benchmark` — OFF mean 274.034ms, ON mean 288.022ms, 5.1045% mean overhead
  (CHK-064, T011 satisfied).
- [x] Layer 2 git hook (post-commit/post-merge/post-rewrite) detects renames/deletes and writes an atomic
  marker, no-op on unrelated commits (REQ-003, REQ-004). Evidence: `.opencode/scripts/git-hooks/lib/
  memory-drift-marker.sh` (temp-file-plus-rename write, `mkdirSync` lock with stale-lock reclaim), sourced
  by `post-commit:28-32`, `post-merge:19-30`, `post-rewrite:19-30`.
- [x] Layer 2 boot-time consumption implemented in `startup-checks.ts`/`context-server.ts`, scoped scan plus
  regeneration wired (REQ-005). Evidence: `context-server.ts:2233-2256` calls
  `sweepStaleMemoryDriftProcessingMarkers` then `consumeMemoryDriftDirtyMarker` with `runScopedScan` ->
  `handleMemoryIndexScan({ scopedPaths })` and `refreshMovedSpecFolder` ->
  `generatePerFolderDescription`/`savePerFolderDescription`/`refreshGraphMetadata`.
- [x] Layer 3 full-sweep-to-completion implemented (REQ-006). Evidence: `memory-index.ts:285-286`
  (`ORPHAN_SWEEP_MAX_PAGES = 1000`), `memory-index.ts:811-841` (bounded page loop with a time-budget exit),
  suspect confirm/tombstone pass at `memory-index.ts:862-920`, wired into both scan entry points
  (`memory-index.ts:1054-1055`, `:1542-1549`).
- [x] Zero new watcher/timer/daemon-process primitives introduced (REQ-007). Evidence: `rg -n
  "setInterval|setTimeout|fs.watch|chokidar"` over the packet's changed files returns no new matches; Layer 2
  consumption runs at existing MCP boot, Layer 3 runs inside an explicitly invoked `memory_index_scan`.
- [x] Rollback verified: flag off restores prior behavior exactly (REQ-009). Evidence:
  `memory-roadmap-flags.vitest.ts` asserts default-off/explicit-enable behavior; re-run fresh in this pass
  (0 failures).
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary). Evidence: this reconciliation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three independent, additive wiring changes onto existing machinery — no new abstraction, no new storage
engine, no new process. Each layer can ship and be verified on its own; Layer 1 has no dependency on
Layers 2/3, Layer 3 has no dependency on Layer 2, and only Layer 2's regeneration step depends on 008's
`parentChain` fix having landed.

### Key Components

**Layer 1 — `memory-search.ts` result assembly.** Today, ranked results are returned with no existence
check. The plan adds one step after ranking narrows to top-k: build a path-existence cache via the already
-exported `buildPathExistenceCache()` (`incremental-index.ts:190`) over the `resolveFilePath()`-derived
paths (`memory-search.ts:272`) of just those top-k rows, filter out any row whose path resolves to
non-existent, and append the excluded row ids to the suspect queue. Gated by a new capability flag
following the exact doc-comment/env-var pattern already used for `SPECKIT_IDENTITY_MERGE_SAFETY`
(`capability-flags.ts`), default-off at first ship.

**Suspect queue — `memory-index.ts` config-table helpers.** Reuses the existing `config` table
(`CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)`, `:239`-adjacent) with a new key
(mirroring `ORPHAN_SWEEP_CURSOR_KEY`'s naming style) storing a small JSON list of `{id, firstSeenAt}`
entries. No schema migration — this is exactly the same pattern the orphan-sweep cursor already
established, just a second key under the same table.

**Layer 2a — git hooks.** `post-commit` gains a scoped `git diff-tree -r -M --name-status HEAD --
.opencode/specs` check (extending the existing file-count-threshold check already at `:35`, not replacing
it) that only proceeds when an `R###` or `D` row exists. On a hit, the hook builds a small JSON payload of
old-path/new-path pairs and writes it via a temp-file-plus-`mv` (atomic on the same filesystem) into
`mcp_server/database/` — a new dotfile alongside the existing `.crash-probe-receipt`/`.unclean-shutdown`
precedent. Two new hook files, `post-merge` and `post-rewrite`, share the same detection-and-write logic
(likely factored into a small shared shell function or a common sourced file under
`.opencode/scripts/git-hooks/`, to avoid duplicating the `diff-tree`/atomic-write logic three times) so
merges and rebases/amends are covered too. `install-git-hooks.sh`'s install loop already symlinks every
file present in its source directory generically — no logic change needed there, only its header comment's
hook inventory needs updating for accuracy.

**Layer 2b — boot-time consumption.** `startup-checks.ts` gains one new function, following the exact
shape of the existing `checkJournalMode()` (`:178`) / `checkSqliteVersion()` (`:138`) /
`detectNodeVersionMismatch()` (`:81`) checks: read the marker file if present, and if so, hand its
path list to a new scoped-scan entry point. `context-server.ts` wires the new check into its existing boot
sequence alongside the current `checkJournalMode(database)` call (`:2224`) — same call site pattern, one
more line, no new subsystem. The scoped scan itself reuses `reconcileMoves()`/`listStaleIndexedPaths()`
from `incremental-index.ts`, restricted to the marker's path list instead of a tree-wide walk, and — for
any path the reconcile confirms as a genuine move — triggers a regeneration of that folder's
`description.json`/`graph-metadata.json` (the same generator 008 fixes), since the scan alone repoints DB
rows but does not touch the JSON files.

**Layer 3 — sweep-to-completion.** `sweepOrphanIndexRows()`'s existing cursor-based pagination
(`incremental-index.ts:524`, driven by `ORPHAN_SWEEP_LIMIT = 200` in `memory-index.ts:238`) already
supports being called repeatedly with an advancing cursor — that's how it currently makes any progress at
all across manual invocations. The plan wraps the existing call in a loop that keeps calling it (bounded by
NFR-P02's documented cap) until the cursor signals completion, within a single `memory_index_scan`
invocation, instead of returning after one 200-row page. This layer also runs the suspect-queue
confirm-and-tombstone/clear pass described above as a small additional step in the same scan.

### Data Flow
Layer 1: query -> rank -> top-k -> `resolveFilePath()` per row -> `buildPathExistenceCache()` batched
check -> filter dead rows out of the response, push their ids into the suspect-queue config key. Layer 2:
commit/merge/rewrite -> hook's `diff-tree -M` check -> (no-op if no `.opencode/specs` R/D rows) -> atomic
marker write -> next MCP boot reads marker via `startup-checks.ts` -> scoped `reconcileMoves()`/
`listStaleIndexedPaths()` pass restricted to marker paths -> regenerate JSON for confirmed moves -> marker
cleared. Layer 3: explicit full scan invocation -> looped `sweepOrphanIndexRows()` until cursor completes
-> suspect-queue confirm pass (tombstone confirmed-gone rows, clear reappeared rows).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-search.ts` result assembly | Returns ranked results with no existence check | Add flag-gated top-k existence filter, suspect-queue append | Fixture with a deleted-but-indexed file never appears in results when flag is on; identical output to today when flag is off |
| `capability-flags.ts` | No flag for query-time filtering | Add new default-off flag following the existing doc-comment/env-var pattern | Unit test asserts default-off resolution and explicit-enable override |
| `memory-index.ts` | `config` table only holds the orphan-sweep cursor | Add suspect-queue read/write helpers under a new key | Unit test: append, read-back, clear all round-trip correctly |
| `incremental-index.ts` | `sweepOrphanIndexRows()` returns after one page; `reconcileMoves()`/`listStaleIndexedPaths()` only run tree-wide | Loop the sweep to completion; accept an optional scoped path list to restrict the reconcile/stale-detection pass | Fixture larger than 200 rows fully swept in one invocation; a scoped path list restricts the pass to only those paths |
| `startup-checks.ts` | Has `checkJournalMode`/`checkSqliteVersion`/`detectNodeVersionMismatch`, no marker check | Add a new check following the same synchronous, side-effect-scoped pattern | Marker present at boot triggers the scoped scan; marker absent is a silent no-op; malformed marker does not crash boot (NFR-R01) |
| `context-server.ts` boot sequence | Calls `checkJournalMode(database)` at `:2224` | Add one call to the new `startup-checks.ts` function alongside it | Boot completes normally with and without a marker present |
| `.opencode/scripts/git-hooks/post-commit` | Already has a `diff-tree`-based file-count check (`:35`) unrelated to `.opencode/specs` | Add the scoped `.opencode/specs` rename/delete check and marker write | No-op commit produces no marker; a rename commit produces a correct marker |
| `.opencode/scripts/git-hooks/post-merge`, `post-rewrite` | Do not exist | New files sharing the detection/write logic | Same verification as `post-commit`, triggered via merge/rebase instead of a direct commit |
| `.opencode/scripts/install-git-hooks.sh` | Header comment lists only `pre-commit` | Update header comment's hook inventory | Running the installer symlinks all four hooks (pre-commit, post-commit, post-merge, post-rewrite) with no code change required |

Required inventories:
- Existing scan-machinery entry points: `rg -n "sweepOrphanIndexRows|reconcileMoves|listStaleIndexedPaths|buildPathExistenceCache" .opencode/skills/system-spec-kit/mcp_server` — confirms the exact call sites this plan reuses and that no third mechanism exists that would need parallel wiring.
- Existing boot-check precedent: `rg -n "checkJournalMode|checkSqliteVersion|detectNodeVersionMismatch" .opencode/skills/system-spec-kit/mcp_server/startup-checks.ts .opencode/skills/system-spec-kit/mcp_server/context-server.ts` — confirms the exact pattern the new marker-consumption check follows.
- Existing git hook precedent: `cat .opencode/scripts/git-hooks/post-commit` — confirms the `diff-tree`/atomic-invalidation pattern this plan extends (and deliberately does NOT copy the delete-the-whole-DB step from).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-verify 007 and 008 have both shipped and the tree is at a clean baseline (`validate.sh --strict`,
  fresh `migrate-generated-json.js --dry-run` reporting a near-zero residual) — hard precondition, not a
  soft check (REQ-010). Evidence: tasks.md T001/T002.
- [x] Re-confirm the scan-machinery call graph against the live tree in case a concurrent session has
  touched these files since this plan was written (`rg -n "sweepOrphanIndexRows|reconcileMoves|
  listStaleIndexedPaths"`). Evidence: tasks.md T003.
- [x] Decide the marker file schema (single pending-list vs. append log) and the suspect-queue grace-period
  policy (spec.md Open Questions), documenting the decision before writing code. Evidence: tasks.md T004
  (shipped: append-log marker with dedup keys, grace period = confirmation at next scan, no fixed
  wall-clock window).

### Phase 2: Layer 1 — Query-Time Existence Filtering
- [x] Add the new capability flag to `capability-flags.ts`, default-off (REQ-002). Evidence:
  `capability-flags.ts:238` (`SPECKIT_QUERY_TIME_EXISTENCE_FILTER_ENV`), `:251`
  (`isQueryTimeExistenceFilterEnabled`).
- [x] Add the top-k existence filter to `memory-search.ts`'s result assembly, reusing `resolveFilePath()`
  and `buildPathExistenceCache()` (REQ-001). Evidence: `memory-search.ts:372-433`
  (`applyQueryTimeExistenceFilter`), called at `:1597-1598`.
- [x] Add the suspect-queue config-table helpers to `memory-index.ts`. Evidence: implemented in a dedicated
  new module, `lib/storage/memory-drift-healing.ts:61-143` (`readMemoryDriftSuspects`,
  `appendMemoryDriftSuspects`, `removeMemoryDriftSuspects` against the existing `config` table), imported
  by both `memory-search.ts` and `memory-index.ts`.
- [x] Wire filtered-out row ids into the suspect queue. Evidence: `memory-search.ts:421-432`
  (`appendMemoryDriftSuspects(db, stats.suspectIds)`).
- [x] Unit tests: filter correctness with the flag on/off, suspect-queue append, latency benchmark
  (REQ-008). Status: filter-correctness and suspect-queue-append tests exist and pass
  (`memory-drift-healing.vitest.ts`, `memory-roadmap-flags.vitest.ts`); the numeric latency benchmark
  was subsequently completed via sibling packet `020-query-time-filter-benchmark` (CHK-064).

### Phase 3: Layer 2 — Git Hook + Boot Consumption
- [x] Extend `post-commit` with the scoped `.opencode/specs` rename/delete detection and atomic marker
  write (REQ-003, REQ-004). Evidence: `post-commit:28-32` sources and calls
  `mark_memory_drift_from_diff HEAD`.
- [x] Add `post-merge` and `post-rewrite`, sharing the detection/write logic. Evidence: both files exist and
  source the same `lib/memory-drift-marker.sh` helper.
- [x] Update `install-git-hooks.sh`'s header comment. Evidence: header comment lists all four hooks plus the
  `SPECKIT_SKIP_MEMORY_DRIFT_GIT_HOOK` bypass.
- [x] Add the marker-consumption check to `startup-checks.ts`, wire into `context-server.ts`'s boot
  sequence (REQ-005). Evidence: `context-server.ts:2233-2256`, immediately after `checkJournalMode(database)`
  at `:2227`.
- [x] Implement the scoped-scan path (restricted stale-candidate detection) in `incremental-index.ts` and
  the `memory-index.ts` scan handler. Evidence: `incremental-index.ts:57` (`staleCandidatePaths` option),
  `:358`; `memory-index.ts:519-521` (`scopedPaths` threading), `:646-652`, `:1060-1061`, `:1230-1231`.
- [x] Wire post-move JSON regeneration for confirmed moves. Evidence: `context-server.ts:2249-2254`
  (`generatePerFolderDescription`/`savePerFolderDescription`/`refreshGraphMetadata` in
  `refreshMovedSpecFolder`).
- [x] Shell-level smoke test for the hook (no-op case, rename case, delete case); vitest for the
  boot-consumption path. Evidence: tasks.md T022-T024, `startup-checks.vitest.ts` (re-run fresh, passing in
  this reconciliation pass). Note: post-merge/post-rewrite are code-complete and smoke-tested but not yet
  installed into this repo's live `.git/hooks` — only `post-commit` is currently symlinked; re-running
  `install-git-hooks.sh` picks up the other two via its existing generic install loop.

### Phase 4: Layer 3 — Sweep-to-Completion Backstop
- [x] Loop `sweepOrphanIndexRows()` to completion (bounded by a documented cap, NFR-P02) inside one
  `memory_index_scan` invocation (REQ-006). Evidence: `memory-index.ts:285-286`
  (`ORPHAN_SWEEP_MAX_PAGES = 1000`), `:811-841` (bounded loop with time-budget exit).
- [x] Implement the suspect-queue confirm-and-tombstone/clear pass as part of the same scan. Evidence:
  `memory-index.ts:862-920` (`runSuspectConfirmation`), called at `:1055` and `:1549`.
- [x] Unit test: fixture larger than 200 rows fully swept in one call; suspect entries correctly
  tombstoned or cleared. Evidence: `orphan-sweep-corpus-repair.vitest.ts`, `memory-drift-healing.vitest.ts`
  (re-run fresh, passing).

### Phase 5: Verification
- [x] Confirm zero new watcher/timer/process primitives introduced (REQ-007, code-review pass). Evidence:
  `rg -inE "setInterval|setTimeout|fs\.watch|chokidar"` over every changed/new file in this packet's diff
  returns zero matches (re-checked in this pass).
- [x] Confirm flag-off rollback restores identical behavior (REQ-009). Evidence:
  `memory-roadmap-flags.vitest.ts` (re-run fresh, passing).
- [ ] `bash validate.sh --strict` run, evidence captured. Status: this reconciliation pass runs it against
  the 011 folder itself (see implementation-summary.md); a full-tree strict run was not re-executed here.
- [x] Documentation updated (spec/plan/tasks/checklist/implementation-summary). Evidence: this
  reconciliation pass.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Layer 1 filter correctness (flag on/off), suspect-queue helpers, Layer 3 loop-to-completion, marker schema parse/write round-trip | vitest |
| Integration | Boot-time marker consumption end-to-end (marker present -> scoped scan -> JSON regenerated -> marker cleared) | vitest against a fixture spec-folder tree |
| Manual/Shell | Git hook behavior: no-op commit, rename commit, delete commit, merge, rebase/amend | Direct `git commit`/`git merge`/`git rebase` against a scratch repo or worktree |
| Performance | Layer 1 latency budget with flag on vs. off | Benchmark harness against a representative query set, numbers captured in `implementation-summary.md` |
| Regression | `validate.sh --strict` sweep after implementation | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `007-search-index-integrity-sweep` | Internal | At plan authoring: planned, not yet shipped. Current phase-local evidence: shipped before implementation began. | This was a hard blocker until it landed and the tree reached a clean baseline; it no longer blocks this packet. |
| `008-metadata-rename-reconciliation` (specifically its `parentChain` resolver-routing fix) | Internal | At plan authoring: planned, not yet shipped. Current phase-local evidence: shipped before implementation began. | This was a hard blocker for Layer 2's post-move JSON regeneration; it no longer blocks this packet. |
| Existing scan/reconcile/sweep machinery (`reconcileMoves`, `sweepOrphanIndexRows`, `listStaleIndexedPaths`, `buildPathExistenceCache`) | Internal | Green (shipped, already correct — this phase only wires triggers onto it) | Without it, this phase would need to build the reconciliation algorithms from scratch instead of just triggering them |
| `.opencode/scripts/git-hooks/post-commit` + `install-git-hooks.sh` precedent | Internal | Green (shipped, working) | Without it, Layer 2 would need to design the hook-install mechanism from scratch instead of extending the existing generic symlink-install loop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Layer 1's latency measurement (REQ-008) exceeds an acceptable budget once enabled, or the
  filter produces unexpected false-exclusions in production query traffic.
- **Procedure**: Flip the new capability flag off — this is Layer 1's designed rollback path (REQ-009), not
  a code revert, so it can happen instantly without a deploy. If Layer 2's hook produces bad markers, the
  hook can be bypassed the same way the existing `post-commit` check already supports bypass (an env-var
  opt-out, matching `SPECKIT_SKIP_CODE_GRAPH_POST_COMMIT`'s precedent), and any stray marker file can be
  deleted directly with no data-loss risk since it names paths, not data. Layer 3's sweep-to-completion
  loop is bounded (NFR-P02), so a runaway loop is prevented by design rather than requiring a rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Layer 1) ──► Phase 5 (Verify)
                └──► Phase 3 (Layer 2) ──►
                └──► Phase 4 (Layer 3) ──►
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 007/008 shipped (external) | Layer 1, Layer 2, Layer 3 |
| Layer 1 | Setup | Verify |
| Layer 2 | Setup (plus 008's parentChain fix specifically, for the regeneration step) | Verify |
| Layer 3 | Setup | Verify |
| Verify | Layer 1, Layer 2, Layer 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Layer 1 (query-time filter) | Med | 3-5 hours |
| Layer 2 (git hook + boot consumption) | Med-High | 5-8 hours |
| Layer 3 (sweep-to-completion) | Low | 1-3 hours |
| Verification | Low-Med | 2-3 hours |
| **Total** | | **12-21 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] 007/008 confirmed shipped and tree at clean baseline before Phase 2 starts (REQ-010)
- [ ] Layer 1 flag confirmed default-off before merge
- [ ] Git hook bypass env-var documented and tested before install

### Rollback Procedure
1. Layer 1: flip the capability flag off (instant, no deploy) — REQ-009's designed rollback path
2. Layer 2: use the hook's bypass env-var, or run `install-git-hooks.sh --uninstall` to remove the
   symlinks entirely if a full revert is needed; delete any stray marker file directly (no data-loss risk)
3. Layer 3: no rollback needed by design — the loop is bounded (NFR-P02), not a new always-on process
4. `git revert` any code-fix commits if the flag-flip/bypass path alone is insufficient
5. Re-run `validate.sh --strict` to confirm the revert restored expected behavior

### Data Reversal
- **Has data migrations?** No — the suspect queue reuses the existing `config` table with a new key; no
  schema change, so no migration to reverse.
- **Reversal procedure**: Deleting the new config-table key (if ever needed) is a single `DELETE FROM
  config WHERE key = '<new-key>'`; the marker file is a plain JSON dotfile, deletable directly with no
  cascading effect on the memory database itself.
<!-- /ANCHOR:enhanced-rollback -->
