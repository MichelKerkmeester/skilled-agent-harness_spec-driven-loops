---
title: "Feature Specification: Automatic Drift Self-Healing [template:level_2/spec.md]"
description: "The memory index's stale-row detection, move-reconciliation, and orphan-sweep machinery already exists but only runs when a human manually calls memory_index_scan; nothing triggers it automatically, the sweep is capped at 200 rows/scan, and the query path never checks file existence at all. This phase closes the loop with three layers -- query-time existence filtering, a git-hook-triggered scoped scan, and a full-sweep backstop -- so drift stops silently re-accumulating after 007/008 clear today's backlog."
trigger_phrases:
  - "automatic drift self-healing"
  - "query-time existence filtering"
  - "post-commit dirty-paths marker"
  - "orphan sweep backstop"
  - "memory index drift never re-accumulates"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/014-automatic-drift-self-healing"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers:
      - "007/008 dependency shipped; no longer blocking (tasks.md T001/T002)"
      - "REQ-008 numeric latency benchmark satisfied via sibling packet 020-query-time-filter-benchmark; no longer blocking (CHK-064)"
      - "lint/test:core not fully green; failures confirmed pre-existing/unrelated"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-011-automatic-drift-self-healing"
      parent_session_id: null
    completion_pct: 88
    open_questions:
      - "Graduate Layer 1 to default-on now, or stay opt-in until production volume validates it?"
      - "Suspect-row grace period: shipped as confirm-at-next-scan, no wall-clock window added"
      - "post-rewrite vs post-commit double-fire: shipped mitigation is dedupe-by-key in the marker"
answered_questions:
  - "Layer 1 ships default-off via SPECKIT_QUERY_TIME_EXISTENCE_FILTER"
  - "Git hooks write only a marker; never delete/truncate the memory DB (NFR-S01)"
  - "No watcher/timer/daemon added (REQ-007); Layer 2 runs at boot, Layer 3 runs inside a scan"
---
# Feature Specification: Automatic Drift Self-Healing

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
| **Status** | In Progress |
| **Created** | 2026-07-09 |
| **Branch** | `011-automatic-drift-self-healing` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../013-retention-forgetting/spec.md |
| **Successor** | ../015-procedural-reliability-benchmark/spec.md |

> **Implementation status (2026-07-09):** All three layers described below are implemented and independently
> re-verified against the live tree in this reconciliation pass -- Layer 1 (`memory-search.ts:372-433`,
> gated by `capability-flags.ts:238`), Layer 2 (`lib/memory-drift-marker.sh` + `post-commit`/`post-merge`/
> `post-rewrite`, consumed at boot via `startup-checks.ts` + `context-server.ts:2233-2256`), and Layer 3
> (`memory-index.ts:811-853` sweep-to-completion loop, `memory-index.ts:862-920` suspect confirm/tombstone
> pass). `npm run typecheck`, `npm run build`, and the packet's targeted vitest suite all pass clean (110/138
> tests passed, 0 failed, 28 skipped -- re-run fresh in this pass). Status is **In Progress**, not Complete,
> because three checklist items remain open: `npm run lint` and `npm run test:core` are not fully green (CHK-010/CHK-011 -- the lint failures
> were re-checked in this pass and confirmed to sit outside this packet's diff), and a scratch-cleanup audit
> was not separately performed (CHK-051). See `implementation-summary.md` for full evidence and
> `checklist.md` for the itemized gap list.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: related prior art (do not duplicate)
This is the sixth and final phase of this planning batch under `029-memory-search-intelligence`.
Two sibling phases, `007-search-index-integrity-sweep` and `008-metadata-rename-reconciliation`, do a
**one-time** cleanup of today's existing drift (42% of the search index and 1,064+ JSON metadata files
reference stale/moved paths from a July `system-spec-kit` -> `system-speckit` rename). This phase is the
**permanent** fix so that drift stops silently re-accumulating after 007/008 clear the backlog, per the
operator's own framing: "I dont want users to manually do things to heal their database after deleting a
spec folder, renaming, etc." This phase does **not** re-run or duplicate 007/008's one-time cleanup; it
depends on their output being a clean baseline (see Risks & Dependencies).

**Key finding: the self-healing machinery mostly already exists — it just never triggers.** The scan path
(`mcp_server/lib/storage/incremental-index.ts`) already implements:
- stale-row detection via `listStaleIndexedPaths()` (`:366`) feeding `categorizeFilesForIndexing()`'s
  `toDelete` set (`:314`);
- move reconciliation via `reconcileMoves()` (`:704`) that repoints rows by `graph-metadata.json`'s
  `packet_id` when old and new paths appear in the same scan — renames are healed in place, not
  delete-and-reindex;
- `sweepOrphanIndexRows()` (`:524`), a batch `fs.existsSync` check with a persisted cursor, wrapped by
  `runGlobalOrphanSweep()` (`mcp_server/handlers/memory-index.ts:704`) and called from two sites in the
  scan handler (`:864`, `:1332`);
- `buildPathExistenceCache()` (`incremental-index.ts:190`), an existing batched-existence-check helper,
  already exported and already used internally by the sweep, but not yet imported anywhere in the query
  path.

Also already built and unused in production: `verify_integrity({ autoClean, cleanFiles })`
(`mcp_server/lib/search/vector-index-queries.ts:1603`, per-row `existsSync` at `:1693`) and the
`memory_health` handler's `autoRepair` orphan-edge/vector/chunk cleanup (`mcp_server/handlers/
memory-crud-health.ts:1342-1376`) — but both sit behind a hard `autoRepair && !confirmed` gate
(`:1244`) and are manual-only, human-confirmed operations.

### Problem Statement
Nobody wired any of this machinery to run without a human typing a command, so drift silently
re-accumulates after every rename or delete:

1. **No auto-trigger.** Scans only run when someone manually calls `memory_index_scan` — there is no
   hook, bootstrap check, or scheduler that ever triggers one.
2. **The sweep is capped too low to ever finish.** `ORPHAN_SWEEP_LIMIT = 200`
   (`memory-index.ts:238`) means one full pass over the ~23k-row index needs roughly 116 manual scan
   calls, which — unsurprisingly — never happened.
3. **The one reactive patch that does exist doesn't generalize.** `legacyTrackPath()`
   (`incremental-index.ts:498`) hardcodes only the `system-spec-kit` -> `system-speckit` rename as a
   one-off string substitution, not a general move-detection mechanism; it does nothing for the next
   rename.
4. **The query path never checks existence at all.** `ACTIVE_ROW_SQL()`
   (`mcp_server/lib/search/active-row-predicate.ts:41-54`) filters only `deleted_at IS NULL` plus
   importance tier — no file-existence check — and `mcp_server/handlers/memory-search.ts` has zero
   `existsSync` calls anywhere in its result path (confirmed via a full-file grep), even though it already
   has a per-row path accessor, `resolveFilePath()` (`:272`). Dead rows are served as live results to
   users today, independent of whether a scan has ever run.

### Purpose
Close the loop with three layers so the machinery that already exists actually runs, without adding a
filesystem watcher, a new timer, or a new daemon responsibility: (1) a query-time existence check as the
safety net that catches every cause of drift regardless of origin, (2) a git-hook-triggered scoped scan
that heals the common case (a committed rename or delete) promptly instead of waiting for a human, and
(3) a backstop that makes an explicitly invoked full scan actually finish a full pass instead of requiring
~116 repeated manual calls.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Layer 1 — query-time existence filtering (primary safety net).** In `memory-search.ts`'s final result
assembly (post-ranking, top-k only — reusing the existing `resolveFilePath()` helper at `:272`),
`existsSync` each of the ~10-50 result paths via the existing `buildPathExistenceCache()`
(`incremental-index.ts:190`) and exclude dead rows from what is returned to the user. Excluded ids are
appended to a suspect queue (reusing the config-table pattern already used for the orphan-sweep cursor at
`memory-index.ts:239`) rather than tombstoned immediately, because a file can be transiently absent
mid-rebase or mid-checkout — exclude now, confirm permanently-gone at the next scan (Layer 3). This is a
query-time change to a hot path, so it ships behind a new capability flag, default-off at first ship.

**Layer 2 — post-commit/post-merge/post-rewrite git hook (event-triggered cleanup, not detection-only).**
Precedent already exists and works: `.opencode/scripts/git-hooks/post-commit` (`:35` counts changed files
via `git diff-tree`, `:65` deletes the code-graph SQLite outright) — acceptable there because that index is
fully regenerable from source. **The memory DB is NOT regenerable** (it holds saved session memories), so
the new hook must never copy that delete-the-whole-DB semantic. Instead: run
`git diff-tree -r -M --name-status HEAD -- .opencode/specs`, and on any `R###` (rename) or `D` (delete)
row, atomically write a dirty-marker JSON (old-path -> new-path pairs for renames, old-path alone for
deletes) into the memory DB directory (`mcp_server/database/`, which already holds precedent dotfile
markers such as `.crash-probe-receipt` and `.unclean-shutdown`) via temp-file-plus-rename — this must be
safe under concurrent sessions, since this repo routinely runs multiple simultaneous Claude Code/OpenCode
sessions. The MCP server consumes this marker at next boot (new check in `startup-checks.ts`, wired into
`context-server.ts`'s existing boot sequence alongside `checkJournalMode()` at `:2224`) and runs a
**scoped** `memory_index_scan` covering just the marked paths — reusing the existing move-reconcile and
stale-delete logic already in `incremental-index.ts`, not a new algorithm — then re-runs the description
generator for any moved folders. Regeneration is required in addition to the scan because
`specFolder`/`parentChain` are derived from the caller-supplied path at write time
(`scripts/spec-folder/generate-description.ts:78-80`, the exact code 008 is also fixing) — the scan alone
heals the DB rows, it does not touch the JSON files. The hook is wired to `post-commit`, `post-merge`, AND
`post-rewrite` (covers rebase/amend) to match this repo's actual git-heavy, worktree-heavy workflow. Layer
1 is what covers everything Layer 2 structurally cannot see: uncommitted deletes, non-git file operations,
and worktree teardown that never produces a commit under the primary checkout.

**Layer 3 — backstop.** During an explicit full `memory_index_scan`, loop the existing
`sweepOrphanIndexRows()` (`memory-index.ts` orphan-sweep path) to completion — or substantially raise the
current 200-row-per-scan cap (`ORPHAN_SWEEP_LIMIT`, `:238`) — so a single invoked scan actually finishes a
full pass instead of requiring ~116 repeated manual calls to clear a large backlog. This layer also owns
confirming Layer 1's suspect queue: a suspect row that is still missing at the next full or scoped scan is
tombstoned (soft-deleted via the existing `deleted_at` semantics already read by `ACTIVE_ROW_SQL()`); a
suspect row whose file has reappeared is cleared from the queue with no write.

### Out of Scope
- Re-running or duplicating 007/008's one-time cleanup of today's existing 42%-drifted backlog — this
  phase assumes that baseline is clean going in (see Risks & Dependencies).
- Any filesystem watcher (`fs.watch`/`chokidar`/similar). Explicitly rejected — see Non-Goals below.
- Any new always-on timer or new daemon responsibility. The git hook only **writes** a marker file; all
  actual consumption happens through existing entry points (boot, first tool call, existing scan
  machinery), not a new always-on process.
- A database schema migration. The suspect-row queue reuses the existing config-table pattern
  (`memory-index.ts:239`'s `CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)`), so no
  new table or column is added.
- Rewriting `verify_integrity()`'s or `memory_health`'s `autoRepair` machinery — both are reused as-is by
  Layer 3's confirm-and-tombstone step, not rebuilt.
- Any change to embedding generation, ranking algorithms, or the presentation layer (owned by sibling
  phase `006-presentation-layer-fixes`).

### Non-Goals (explicit)
- **NO filesystem watcher.** Given the daemon/lease architecture's demonstrated fragility — three real
  daemon reliability bugs found and fixed earlier in this same session, under sibling phases
  `system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/{032,033,034}` — adding a
  new always-on watch process is treated as an unacceptable reliability risk for the return it buys over
  Layers 1+2.
- **NO new timers.** No `setInterval`/`setTimeout`-driven background loop is introduced anywhere in this
  design.
- **NO new daemon responsibilities.** The daemon's boot sequence gains one more startup check (consistent
  with the existing `checkJournalMode`/`checkSqliteVersion`/`detectNodeVersionMismatch` pattern in
  `startup-checks.ts`); it does not gain a new subsystem, process, or long-running loop.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Layer 1: add post-ranking, top-k-only existence filtering using `resolveFilePath()`/`buildPathExistenceCache()`; append excluded ids to the suspect queue |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Add a new default-off capability flag gating Layer 1's query-time filter |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Add suspect-queue config-table read/write helpers (same pattern as `ORPHAN_SWEEP_CURSOR_KEY`); Layer 3 confirm-and-tombstone/clear pass |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts` | Modify | Layer 3: loop `sweepOrphanIndexRows()` to completion (or raise `ORPHAN_SWEEP_LIMIT`) within one invoked scan; accept a scoped path list from the Layer 2 marker for a targeted (not tree-wide) reconcile pass |
| `.opencode/skills/system-spec-kit/mcp_server/startup-checks.ts` | Modify | New boot check that reads and consumes the Layer 2 dirty-paths marker, following the existing `checkJournalMode()` pattern |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Wire the new boot check into the existing startup sequence alongside `checkJournalMode()` (`:2224`) |
| `.opencode/scripts/git-hooks/post-commit` | Modify | Add the scoped `git diff-tree -M` check for `.opencode/specs` renames/deletes and the atomic marker write |
| `.opencode/scripts/git-hooks/post-merge` | New | Same scoped-diff-and-marker-write logic, triggered after merges |
| `.opencode/scripts/git-hooks/post-rewrite` | New | Same scoped-diff-and-marker-write logic, triggered after rebase/amend |
| `.opencode/scripts/install-git-hooks.sh` | Modify | Update the header comment's hook inventory; the install loop itself already generically symlinks every file in the source directory, so no functional change is required |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Query-time existence filtering (Layer 1) SHALL exclude any top-k search result whose file no longer exists on disk, and SHALL NOT tombstone the underlying row on first miss. | A search result set built from a fixture with one deleted-but-still-indexed file never includes that file's row; a repeat query for the same fixture 1 second later (simulating a transient mid-checkout absence) still excludes it without a database write occurring. |
| REQ-002 | Layer 1 SHALL be gated behind a capability flag that defaults OFF at first ship, following the existing `capability-flags.ts` doc-comment/env-var pattern. | The flag's default resolves to disabled with no env var set; setting the flag's env var to an explicit enable value activates the filter; a test asserts both states. |
| REQ-003 | The post-commit/post-merge/post-rewrite git hook (Layer 2) SHALL detect renames (`R###`) and deletes (`D`) under `.opencode/specs` via `git diff-tree -M` and SHALL be a no-op (zero marker writes, zero side effects) for any commit that does not touch that path. | A commit touching only files outside `.opencode/specs` produces no marker file and no hook output; a commit with an `R100` rename row under `.opencode/specs` produces a marker containing that old-path/new-path pair. |
| REQ-004 | The dirty-marker write SHALL be atomic (temp-file-plus-rename) and safe under concurrent sessions writing to the same marker path. | A simulated concurrent-write test (two writers targeting the same marker file in quick succession) never leaves a partially-written or corrupt marker file readable by the consumer. |
| REQ-005 | The MCP server SHALL consume the dirty-marker at boot (or first tool call if boot-time consumption is not feasible) and run a scoped `memory_index_scan` covering only the marked paths, then re-run description generation for any moved folders. | A synthetic marker naming one renamed spec folder, present at boot, results in that folder's index rows and `description.json`/`graph-metadata.json` being reconciled without a full tree-wide scan being triggered. |
| REQ-006 | Layer 3 SHALL make a single explicitly invoked full `memory_index_scan` complete a full orphan-sweep pass over the index (via looping `sweepOrphanIndexRows()` to completion or raising `ORPHAN_SWEEP_LIMIT`), instead of requiring repeated manual invocations. | A full scan against a fixture index larger than the current 200-row cap completes the orphan sweep in one invocation, confirmed by the sweep's returned cursor/completion state. |
| REQ-007 | This design SHALL introduce no filesystem watcher, no new `setInterval`/`setTimeout`-driven timer, and no new daemon process or long-running subsystem. | A code review of the diff confirms zero new watch/timer/process primitives; the only new boot-time work is a synchronous check inside the existing `startup-checks.ts` sequence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Layer 1's added query latency SHALL stay within a documented, small budget relative to the existing search-plus-ranking cost. | A benchmark comparing search latency with the flag on vs. off over a representative query set shows the existence-check overhead is a small fraction of total query time, captured with numbers in `implementation-summary.md`. |
| REQ-009 | Layer 1 SHALL be rollback-safe: disabling the capability flag SHALL fully restore pre-Layer-1 query behavior with no residual state change. | Flipping the flag off after having run with it on produces search results identical to a build that never had Layer 1, on the same fixture. |
| REQ-010 | This phase's dependency on 007 and 008 having shipped SHALL be verified before implementation begins, not assumed. | Before Phase 2 of `plan.md` starts, `validate.sh --strict` and a fresh `migrate-generated-json.js --dry-run` both confirm the tree is at the clean baseline 007/008 were expected to produce. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After this phase ships, a spec folder rename or delete committed through normal git usage is
  reflected in memory-search results within one MCP server boot/first-tool-call cycle, with zero manual
  `memory_index_scan` invocation required.
- **SC-002**: A file deleted or moved outside of git (manual `rm`, external editor move, worktree teardown)
  never appears as a live search result once Layer 1 is enabled, regardless of whether a scan has run.
- **SC-003**: A single explicitly invoked full `memory_index_scan` against a large backlog completes an
  entire orphan-sweep pass, down from the current ~116-manual-scans-required state.
- **SC-004**: Disabling the Layer 1 capability flag fully restores prior query behavior with no residual
  effect, verified per REQ-009.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Layer 1 touches the hot query path (`memory-search.ts`); a mistake here degrades every search call, not just drift-affected ones. | High blast radius on a frequently-hit path | Feature-flagged default-off at first ship (REQ-002); latency budget captured with real numbers (REQ-008); rollback is a flag flip with no residual state (REQ-009) |
| Risk | Given the daemon/lease architecture's demonstrated fragility (three real daemon reliability bugs found and fixed earlier this session, sibling phases `027-graph-and-context-optimization/007-mcp-daemon-reliability/{032,033,034}`), any new boot-time or daemon-adjacent code is a candidate for a fourth. | Could introduce a new daemon reliability bug | Explicitly no watcher/timer/new process (REQ-007); the new boot check follows the existing `checkJournalMode()`-style synchronous, side-effect-scoped pattern rather than inventing a new subsystem |
| Risk | The git hook mis-detects a rename that is actually a delete-plus-unrelated-add (git's rename heuristic is similarity-based, not exact), producing an incorrect old-path/new-path pair in the marker. | A scoped scan could reconcile the wrong pair | The scoped scan reuses the existing `reconcileMoves()` logic, which itself confirms a move via both paths appearing together with a matching `packet_id` in the same scan rather than trusting the marker blindly — the marker only tells the scan where to look, it does not replace the existing safety check |
| Risk | Layer 2's marker write races against a concurrent session's own commit/marker write, since this repo routinely runs multiple simultaneous Claude Code/OpenCode sessions. | Corrupt or lost marker data | Temp-file-plus-rename atomic write (REQ-004); marker format supports appending/merging multiple pending entries rather than single-writer-assumed overwrite |
| Dependency | `007-search-index-integrity-sweep` and `008-metadata-rename-reconciliation` (both planned, not yet shipped) | This phase cannot start implementation until both land — auto-healing on top of a still-42%-drifted baseline would just keep re-triggering on the existing backlog instead of catching new drift | Hard dependency noted here and in `plan.md`; REQ-010 requires re-verifying the clean baseline immediately before implementation starts |
| Dependency | `scripts/spec-folder/generate-description.ts`'s `parentChain` resolver-routing fix, which `008` ships (spec.md F1, same lines `:78-80` this phase's Layer 2 regeneration step relies on) | Without 008's fix, Layer 2's post-move regeneration step would write JSON with the same class of drift bug it is trying to heal | Covered by the same 007/008 dependency above; not a separate risk, called out here for the specific mechanism |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Layer 1's added per-query cost is bounded by result-set size only (10-50 warm
  `existsSync` calls on already-resolved paths), not by index size — it runs after ranking has already
  narrowed to top-k, not before.
- **NFR-P02**: Layer 3's full-sweep-to-completion loop must itself stay bounded (a documented iteration cap
  or time budget) so a pathologically large backlog cannot turn one `memory_index_scan` call into an
  unbounded hang.

### Security
- **NFR-S01**: The git hook only ever writes a marker file inside the existing memory DB directory; it
  never deletes or truncates the memory database itself, unlike the code-graph hook's precedent (this is a
  deliberate, explicit divergence from that pattern — see spec.md Scope, Layer 2).
- **NFR-S02**: Marker file writes are atomic (temp-file-plus-rename) so a crash or concurrent write mid-write
  never leaves a partially-written file that a consumer could misparse.

### Reliability
- **NFR-R01**: A missing, malformed, or unreadable marker file at boot is treated as "nothing to consume,"
  not a boot failure — consumption is best-effort and never blocks server startup.
- **NFR-R02**: Layer 1's existence check failing for any single row (e.g. a transient filesystem error) must
  not fail the whole query; that row is treated conservatively (excluded, queued as suspect) and the rest
  of the result set is returned normally.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A file transiently absent mid-rebase or mid-checkout: excluded from that query's results but not
  tombstoned; a subsequent query after the operation completes finds it present again and clears the
  suspect entry with no write (per the open question on grace period).
- A commit that touches `.opencode/specs` but with no `R`/`D` rows (pure additions/modifications): the hook
  writes no marker — this is the common case and must stay a true no-op, not a marker with an empty list.
- A rename detected by git with low similarity confidence, bordering on a delete-plus-add: the scoped scan
  still requires both paths to appear together with a matching `packet_id` (existing `reconcileMoves()`
  behavior) before treating it as a move, so a false-positive rename in the marker degrades to "scan both
  paths and let the existing logic decide," not a blind repoint.

### Error Scenarios
- `git diff-tree` unavailable or the hook running in an environment without `node`/the expected shell:
  the hook must fail silently (matching the existing `post-commit` hook's `set -euo pipefail` plus guarded
  early-exit style) rather than blocking the commit.
- Two sessions commit within the same second and both trigger a hook write to the same marker path: the
  atomic temp-file-plus-rename write, combined with an append/merge-capable marker format, must not lose
  either session's entries.
- The MCP server boots while a marker exists but the paths it names have since been fixed by an unrelated
  manual `memory_index_scan`: the scoped scan is idempotent (rescanning an already-consistent path is a
  no-op in the existing scan machinery), so this degrades to a wasted-but-harmless scoped scan, not a
  false repair.

### State Transitions
- A suspect-queue entry that is confirmed gone at the next scan transitions to tombstoned via the existing
  `deleted_at` soft-delete semantics already honored by `ACTIVE_ROW_SQL()` — no new deletion mechanism is
  introduced.
- A suspect-queue entry whose file reappears (e.g. a `git stash pop` restoring it) is cleared from the
  queue with no database write, since the row was never modified while suspect — only excluded from query
  results.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Three small, additive layers across roughly 3 TypeScript files (~200-250 LOC total) plus one new/extended bash git hook plus a feature flag; no schema migration, no new abstraction beyond an existing config-table key |
| Risk | 17/25 | Layer 1 touches a hot, frequently-hit query path and Layer 2 touches boot sequencing adjacent to a daemon architecture with a recent reliability-bug history; mitigated by feature-flagging, reuse of existing safety mechanisms (reconcileMoves' own move-confirmation logic), and an explicit no-watcher/no-timer/no-new-process constraint |
| Research | 7/20 | Root cause and every cited mechanism confirmed against the live tree at spec time (direct file:line reads); the design itself was produced by a prior architecture investigation and is being transcribed/structured here, not re-derived |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the Layer 1 query-time filter default ON at ship time, or stay an explicit opt-in until it has run
  against production query volume for a while? (Mirrors the same graduation-timing question 008's spec.md
  raised for its own prune capability.)
- What grace period should a Layer 1 suspect-row carry before Layer 3 treats it as confirmed-gone and
  tombstones it, given files can be transiently absent mid-rebase or mid-checkout? A fixed number of scan
  cycles, a wall-clock window, or both?
- Does `post-rewrite` fire redundantly alongside `post-commit` during an interactive rebase that also
  amends, and if so does the marker-write need explicit idempotency against a double-fire producing
  duplicate entries in the same marker within the same second?
<!-- /ANCHOR:questions -->
