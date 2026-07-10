---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status In Progress: all 3 layers implemented and targeted-verification passing. Remaining completion gates: lint baseline, broad core-suite failures, numeric latency benchmark."
trigger_phrases:
  - "automatic drift self-healing"
  - "query-time existence filtering"
  - "post-commit dirty-paths marker"
  - "orphan sweep backstop"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/011-automatic-drift-self-healing"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers:
      - "lint fails on pre-existing unused-variable errors, confirmed outside this diff"
      - "test:core timed out with unrelated existing failures, not re-run this pass"
      - "Numeric Layer 1 latency benchmark has not been executed"
    key_files:
      - "mcp_server/lib/storage/memory-drift-healing.ts"
      - "mcp_server/handlers/memory-search.ts"
      - "mcp_server/handlers/memory-index.ts"
      - "mcp_server/startup-checks.ts"
      - "mcp_server/context-server.ts"
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-011-automatic-drift-self-healing"
      parent_session_id: null
    completion_pct: 88
    open_questions:
      - "Run and record a numeric query latency benchmark for flag off vs. flag on."
      - "Decide whether unrelated lint/broad-suite failures should be fixed in this packet or tracked separately."
    answered_questions:
      - "Layer 1 ships behind default-off SPECKIT_QUERY_TIME_EXISTENCE_FILTER."
      - "Git hooks write only a marker; they never delete or truncate the memory database."
      - "No filesystem watcher, timer, daemon, or always-on subsystem was introduced."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-automatic-drift-self-healing |
| **Status** | In Progress |
| **Completed** | No, remaining gates are listed below |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Layer 1: query-time existence filtering

Implemented a default-off capability flag, `SPECKIT_QUERY_TIME_EXISTENCE_FILTER`, for the hot `memory_search` path. When enabled, final top-k rows whose backing `file_path` no longer exists are filtered from the response and added to a config-table suspect queue. The query path does not delete rows; deletion is deferred until a later scan confirms the absence.

**Confirmed evidence (re-verified 2026-07-09, direct code read):**
- Flag definition: `lib/config/capability-flags.ts:238` (`QUERY_TIME_EXISTENCE_FILTER_ENV = 'SPECKIT_QUERY_TIME_EXISTENCE_FILTER'`), reader at `:251` (`isQueryTimeExistenceFilterEnabled`).
- Filter implementation: `handlers/memory-search.ts:372-433` (`applyQueryTimeExistenceFilter`), using `resolveFilePath()` (`:292-297`) and the existing `buildPathExistenceCache()` import (`:116`).
- Wired into the live result path, not dead code: `handlers/memory-search.ts:1401` reads the flag, `:1597-1598` calls the filter on `resultsForFormatting` immediately after canonical-source filtering and before response formatting.
- Suspect-queue write on exclusion: `handlers/memory-search.ts:421-432` (`appendMemoryDriftSuspects(db, stats.suspectIds)`), with a shortened `busy_timeout` so a held write lock fails fast instead of blocking the search response.
- Suspect-queue storage: new module `lib/storage/memory-drift-healing.ts:61-143` (`readMemoryDriftSuspects`, `appendMemoryDriftSuspects`, `removeMemoryDriftSuspects`) against the existing `config` table (`CREATE TABLE IF NOT EXISTS config`, `:28`) — no schema migration, matching the plan.

### Layer 2: git-hook marker and boot consumption

Added a shared git-hook helper that detects `.opencode/specs` rename/delete changes and writes an atomic dirty-marker JSON file into the memory DB directory. `post-commit`, `post-merge`, and `post-rewrite` now share this marker behavior. Startup consumption parses the marker defensively, renames it to a processing file, delegates a scoped `memory_index_scan`, refreshes moved-folder generated metadata, and removes/restores the marker according to success or failure.

**Confirmed evidence (re-verified 2026-07-09, direct code read):**
- Shared marker writer: `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh` — `git diff-tree -M --name-status` parsed into rename/delete entries (`:38-47`), atomic temp-file-plus-rename write (`:136-138`), `mkdirSync`-based lock with a 45s stale-lock reclaim that renames-then-removes rather than deleting a lock a concurrent process may be mid-acquiring (`:74-110`). Never deletes or truncates the memory DB itself (NFR-S01) -- only writes the marker file.
- Hook wiring, all three sourcing the shared helper: `post-commit:28-32` (`mark_memory_drift_from_diff HEAD`), `post-merge:19-30` (diffs `ORIG_HEAD..HEAD` when available), `post-rewrite:19-30` (loops every rewritten commit pair from stdin, covering rebase/amend).
- Marker parsing/schema: `lib/storage/memory-drift-healing.ts:174-198` (`parseMemoryDriftMarker`, drops any entry failing shape validation, returns `null` on malformed input rather than throwing).
- Boot consumption, genuinely wired (not dead code): `context-server.ts:2233-2235` calls `sweepStaleMemoryDriftProcessingMarkers` (recovers a `.processing-*` claim file orphaned by a killed prior boot) immediately after `checkJournalMode(database)` at `:2227`; `:2237-2256` calls `consumeMemoryDriftDirtyMarker` with `runScopedScan` delegating to `handleMemoryIndexScan({ scopedPaths, incremental: true, force: false })` and `refreshMovedSpecFolder` calling `generatePerFolderDescription`/`savePerFolderDescription`/`refreshGraphMetadata` for confirmed moves.
- Scoped-scan restriction (not a tree-wide walk): `handlers/memory-index.ts:519-521` threads `scopedPaths` from the marker into `scopedScanPaths`; `:646-652` restricts file discovery to those paths when non-empty; `:1060-1061`/`:1230-1231` pass them as `staleCandidatePaths` into `categorizeFilesForIndexing`. `lib/storage/incremental-index.ts:57` declares the `staleCandidatePaths` option, `:358` consumes it in `listStaleIndexedPaths`.
- **Operational note:** the hook source files are code-complete and smoke-tested, but only `post-commit` is currently symlinked into this repo's live `.git/hooks/` (confirmed via `ls -la .git/hooks/`); `post-merge` and `post-rewrite` are not yet installed here. Re-running `bash .opencode/scripts/install-git-hooks.sh` picks them up via its existing generic per-file install loop -- no code change needed, just a re-run of the installer in this working tree.

### Layer 3: sweep-to-completion backstop

Changed orphan sweep from one 200-row page per scan to a bounded cursor loop. Added scan-time suspect confirmation: rows whose files still exist are cleared from the suspect queue; rows whose files remain missing are tombstoned through the existing memory delete path.

**Confirmed evidence (re-verified 2026-07-09, direct code read):**
- Cap raised from a single 200-row page to a bounded multi-page loop: `handlers/memory-index.ts:285-286` (`ORPHAN_SWEEP_LIMIT = 200` unchanged as the per-page size; new `ORPHAN_SWEEP_MAX_PAGES = 1000` bounds the loop), `:811-841` (`for (let page = 0; page < ORPHAN_SWEEP_MAX_PAGES; page++)`, with both a completion exit and a wall-clock time-budget exit that persists a resumable cursor, satisfying NFR-P02).
- Suspect confirm-and-tombstone/clear pass: `handlers/memory-index.ts:862-920` (`runSuspectConfirmation`) reads the suspect queue, batch-checks existence via `incrementalIndex.buildPathExistenceCache`/`cachedPathExists`, clears reappeared rows with no DB write beyond the queue removal, and tombstones confirmed-gone rows through the existing `deleteIndexedRecordIds` soft-delete path (`:698`, same function the orphan sweep itself uses -- no new deletion mechanism).
- Genuinely wired into both scan entry points, not a standalone unused function: `runSuspectConfirmation()` called at `:1055` and `:1549`.

### Files Changed

| File | Purpose |
|------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts` | New marker parsing/path helpers and config-table suspect queue helpers |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Added default-off `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Added flag-gated top-k file-existence filtering and suspect queue writes |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts` | Added scoped stale-candidate support and exact-path existence fallback |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Added scoped scan plumbing, bounded orphan sweep loop, suspect confirmation, and stale-delete robustness |
| `.opencode/skills/system-spec-kit/mcp_server/startup-checks.ts` | Added dirty-marker consumption helper |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Wired startup marker consumption to scoped scan and metadata refresh |
| `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh` | New shared hook marker writer with lock/temp/rename flow |
| `.opencode/scripts/git-hooks/post-commit` | Added scoped spec rename/delete marker write |
| `.opencode/scripts/git-hooks/post-merge` | Added marker hook entrypoint |
| `.opencode/scripts/git-hooks/post-rewrite` | Added marker hook entrypoint |
| `.opencode/scripts/install-git-hooks.sh` | Documented new hook surface and bypass env |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-drift-healing.vitest.ts` | Added drift helper, filtering, suspect, and marker-consumption tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts` | Added feature-flag tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/orphan-sweep-corpus-repair.vitest.ts` | Added sweep-to-completion/scoped stale detection coverage |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Updated stale-delete expectations for statediff action payloads |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-needs-rebuild.vitest.ts` | Updated governance mock shape for current handler imports |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed within existing operational surfaces. It adds no filesystem watcher, no timer, no daemon, and no long-running process. Query-time behavior is default-off and rollback is a flag flip. Destructive cleanup remains scan-time only and uses existing soft-delete semantics.

The git hook intentionally diverges from the code-graph hook precedent: it never deletes the memory database. It only writes a dirty marker that the memory server can consume later through existing scan machinery.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep Layer 1 behind `SPECKIT_QUERY_TIME_EXISTENCE_FILTER` | It touches the hot search path; default-off enables safe rollback |
| Store suspects in the existing `config` table | Avoids schema migration and matches the orphan-sweep cursor pattern |
| Defer deletes from query-time to scan-time confirmation | Avoids tombstoning rows during transient checkout/rebase absence |
| Use git-hook marker writes, not DB deletion | Memory DB contains saved continuity and is not fully regenerable |
| Consume marker at startup via scoped scan | Reuses existing scan machinery without a watcher/timer/daemon |
| Bound orphan sweep with `ORPHAN_SWEEP_MAX_PAGES` | Completes large backlogs while retaining a hard per-scan cap |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Dependency `007-search-index-integrity-sweep` strict validation | PASS |
| Dependency `008-metadata-rename-reconciliation` strict validation | PASS |
| Generated metadata dry-run | PASS for generation: `enumerated: 2508`, `migrated: 0`, `skippedNoop: 2508`, `failed: 0`; unrelated archived verify violations remain |
| `npm run typecheck` | PASS (re-run fresh 2026-07-09, this reconciliation pass) |
| `npm run build` | PASS (re-run fresh 2026-07-09, this reconciliation pass) |
| Targeted drift/index/search/startup tests | PASS: 13 files, **110 passed**, 28 skipped, 0 failed (re-run fresh 2026-07-09, this reconciliation pass -- 7 more passing tests than the prior 103-test snapshot, 0 regressions) |
| Focused stale-delete handler test | PASS: 9 passed (included in the 110 above via `handler-memory-index-cooldown.vitest.ts`) |
| Hook smoke tests | PASS (prior pass): unrelated commit no marker, rename marker, delete marker, concurrent entries preserved, post-merge/post-rewrite smoke passed |
| `npm run lint` | FAIL (re-run fresh 2026-07-09): 12 errors across 6 files. Re-checked each: only `context-server.ts:244` (`GRAPH_ENRICHMENT_SYMBOL_LIMIT` unused) falls inside a file this packet touched, and `git diff` confirms that specific line is absent from this packet's diff (pre-existing, untouched). The other 5 errored files (db-state, session-stop, batch-learning, orchestrator, and the archived-check migration script -- named without paths here to avoid false key-file linkage in generated metadata) are outside this packet's file set entirely. |
| `npm run test:core` | NOT GREEN: timed out after 120s and surfaced unrelated existing failures across hook autosave, BM25, launcher, feature-flag docs, older regression suites, and other areas. Not independently re-run in this reconciliation pass (bounded scope); the narrower targeted suite covering every file this packet touched was re-run fresh above and is fully green. |
| Git hooks installed in this repo's live `.git/hooks/` | PARTIAL: only `post-commit` is currently symlinked (confirmed via `ls -la .git/hooks/`); `post-merge`/`post-rewrite` exist as code-complete, smoke-tested source files but are not yet installed here -- `bash .opencode/scripts/install-git-hooks.sh` needs a re-run to pick them up. |
| Numeric Layer 1 latency benchmark | NOT RUN |

Targeted passing command:

```bash
npx vitest run tests/handler-memory-index.vitest.ts tests/handler-memory-index-needs-rebuild.vitest.ts tests/handler-memory-index-scan-jobs.vitest.ts tests/handler-memory-index-async-scan.vitest.ts tests/handler-memory-index-cooldown.vitest.ts tests/handler-memory-search.vitest.ts tests/handler-memory-search-live-envelope.vitest.ts tests/memory-search-retrieval-level-schema.vitest.ts tests/memory-search-scoring-observability.vitest.ts tests/memory-search-quality-filter.vitest.ts tests/memory-drift-healing.vitest.ts tests/orphan-sweep-corpus-repair.vitest.ts tests/startup-checks.vitest.ts --reporter=verbose
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Completion is not claimed because lint and broad `test:core` are not green.
2. The Layer 1 latency budget still needs numeric measurement with the flag off vs. on.
3. Broad-suite failures appear unrelated to this packet based on affected files and test areas, but they remain unresolved in the working tree.
4. No commit SHA exists because commit/push were explicitly not requested; all evidence above is against the current uncommitted working-tree diff.
5. `post-merge` and `post-rewrite` are implemented and smoke-tested but not yet installed into this repo's live `.git/hooks/` -- re-running `install-git-hooks.sh` is required before Layer 2 is actually active for merges/rebases in this checkout (`post-commit` alone is already live).
<!-- /ANCHOR:limitations -->
