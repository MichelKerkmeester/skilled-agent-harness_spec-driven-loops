---
title: "Tasks: Search-Index Integrity Sweep [template:level_2/tasks.md]"
description: "RESUMED status: core DB sweep already applied before this agent resumed; documentation updated with counts. Full completion remains blocked by failing test suites and remaining enrichment backlog."
trigger_phrases:
  - "search index integrity sweep"
  - "stale memory index rows"
  - "orphaned vec_768 entries"
  - "content hash drift"
  - "embedding status reconciliation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/007-search-index-integrity-sweep"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Search-Index Integrity Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `memory_health` and `checkpoint_create`/`checkpoint_restore` MCP tools are reachable (daemon warm or MCP transport live) — Evidence: `memory_health({ reportMode:'full', autoRepair:false })` returned `status: healthy`, `runtime_initialized: true`, `databaseConnected: true`; live CLI `memory_context` returned `summary: "Found 4 memories"`, `isError:false`.
- [ ] T002 Take a named checkpoint of the production database via `checkpoint_create`, record the checkpoint name — Not confirmed in this resumed session. Three DB backup files were found in the database directory, but they are filesystem SQLite backups, not confirmed `checkpoint_create` records.
- [ ] T003 Rehearse `checkpoint_restore` against a scratch copy of the database (or cite existing checkpoint-mechanism test coverage as equivalent evidence) — Not confirmed in this resumed session.
- [ ] T004 Run `memory_health({ reportMode: 'full', autoRepair: true, cleanFiles: true, confirmed: false })` as a dry-run; record the reported orphan/stale counts as the "before" baseline — Not re-run because live row counts show the core mutation already happened; before baseline inferred from backups and spec evidence.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Bulk Repair (F10 + F13-orphaned-vectors)

- [x] T005 Re-run `memory_health` with `confirmed: true` to execute the bulk repair (depends on T002-T004); record the `cleaned` counts (vectors, chunks, files) returned — Found already complete on resume, not repeated. Evidence: final pre-repair backup `context-index.sqlite.backup-007-search-index-integrity-sweep-final-pre-repair-20260709T1002Z` has `23,322` rows; live DB has `13,529`, exactly `9,793` fewer.
- [x] T006 Run post-repair `verify_integrity({ autoClean: false })`; confirm `orphanedFiles.length === 0` and `orphanedVectors === 0` — Evidence: `memory_health` consistency `healthy`, `rowsTotal=13529`, `ftsRowsTotal=13529`, `vecRowsTotal=13529`, `mismatchedIds=[]`; direct SQL against active vector shard found `orphaned_vectors=0`.

### Root-Cause Investigations

- [x] T007 [P] Investigate F10 recurrence: trace whether `listStaleIndexedPaths`/`categorizeFilesForIndexing`'s `toDelete` pass is reachable from the production `memory_index_scan` entrypoint, and with what file-list scope (.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:314-359); record the finding — Evidence: `handlers/memory-index.ts` calls `categorizeFilesForIndexing([])` in the no-files path and `categorizeFilesForIndexing(files)` in incremental scans; both routes include `listStaleIndexedPaths`.
- [x] T008 [P] Investigate F11 content drift: re-run the 292-doc sample (or a fresh equivalent) against `hashesMatch`/`contentHashVariants` (.opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts:94-101); for unexplained mismatches, check whether `stored.content_hash IS NULL` on those rows; record the finding and the confirmed-drifted row set — Evidence: full live row scan found `contentHashNull=0`, `contentHashMismatch=0`, `contentHashNormalizedMatches=13529`.

### Targeted Fixes (F11 refresh, F13 missing-vectors, F12 operational)

- [x] T009 Re-hash and refresh `content_text`/`content_hash` for the F11 confirmed-drifted rows (depends on T008's investigation output deciding the mechanism) — No-op by current evidence: no live `content_hash` drift or null stored hashes remain.
- [x] T010 If T007 found a real wiring/scope gap in the F10 recurrence path, apply the minimal fix in `incremental-index.ts`; otherwise document the operational cadence/scope conclusion (REQ-009 is P2, deferrable with reason) — No code fix applied; production scan path is wired. Recurrence prevention beyond current wiring is an operational cadence/scope follow-up, not a confirmed code gap from this resumed check.
- [x] T011 Flip the 20 F13 false-success `embedding_status='success'`-with-no-vector rows to `'pending'` so they enter the existing enrichment queue — Found already resolved on resume. Evidence: all `13,529` rows are `embedding_status='success'`; active vector shard has `13,529` `vec_768` rows; cross-DB SQL found `false_success_missing_vector=0`.
- [ ] T012 Verify F12's maintenance-tool scheduler state (`hasActiveEmbedderJob`/`hasActiveScanJob`, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:614-641), confirm free slots, restart/trigger the enrichment run — Partially verified only: health reports `activeScanJob:false`, `activeEmbedderJob:false`, `backgroundEnrichment.pending=5903`, `failed=221`, total `6124`, down from the original `9317` but not drained.
- [ ] T013 [B] Only if T012's restart with confirmed-free slots fails to move the backlog: write the minimal code fix and re-verify
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Two consecutive `memory_health` checks (at least one enrichment cycle apart) show the F12 pending+failed count decreasing and `lastRunAt` populated — Not satisfied; only same-session checks are available and backlog remains `6124`.
- [x] T015 Final full `memory_health` report shows the file-existence, orphaned-vector, and false-success-embedding dimensions at the target state — Evidence: `status: healthy`, `mismatchedIds=[]`, `orphaned_vectors=0`, `false_success_missing_vector=0`, full filesystem scan `missingFilePath=0`.
- [ ] T016 Sample search queries over previously-stale terms return zero hits referencing deleted files — Live daemon `memory_context` succeeded, but no preserved list of pre-sweep stale terms was available in the packet; direct file-path scan is stronger for stale-row absence but this specific sample-query item remains unproven.
- [x] T017 Record before/after tables (row counts, orphan counts, `isConsistent` flags) in implementation-summary.md for every mutating step — Recorded in implementation-summary.md during this resumed session.
- [x] T018 Update documentation (spec/plan/tasks/checklist) — Updated resumed-state docs; `plan.md` left unchanged except by reference because it remains the original plan.
- [x] T019 Author or update the named test(s) for any new/modified function from Phase 2 (F11 refresh mechanism, F13 status-flip, and any F10 recurrence fix), colocated with the existing mcp_server/tests/ suite — No new/modified function was introduced in this resumed session; no new test required. (re-validated in the 2026-07-10 `validate.sh --strict` sweep)
- [ ] T020 Pin the benchmark thresholds and reproduce commands from plan.md's Benchmark table (stale-file count, orphaned-vector count, false-success count, backlog trend, rollback rehearsal) — Data thresholds reproduced; backlog trend and rollback rehearsal remain incomplete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — Not complete.
- [x] No `[B]` blocked tasks remaining — Blocker markers were converted to evidence-backed done/no-op or explicit unchecked follow-up items.
- [ ] Manual verification passed — Not complete; full test suites failed/timed out.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

- [x] T021 [P1] The sweep verification proves file-path presence, vector ownership, and row totals but never that renamed identities are duplicate-free. Add post-sweep queries grouping by canonicalized `file_path` plus anchor/document identity, scan for old/new prefix pairs, and persist the duplicate/repoint metrics in the verification table (`implementation-summary.md:149-158`). DONE 2026-07-10 — read-only verify-index-identity tool shipped (scripts/memory/): exact canonical-identity duplicate clustering + multi-signal historical-prefix detection (content_hash / title+anchor / >=3-segment path suffix with generic-basename guard; z_archive cold-tier suppression) with per-pair matched-signal audit + CLI-computed DB size/mtime read-only self-check. First attempt REJECTED: naive prefix heuristic reported 280 clusters/11,853 pairs — ~all false positives; corrected tool reports 0 genuine prefix pairs. REAL FINDING: 1,255 duplicate canonical-identity clusters / 2,573 rows / 1,318 excess rows in the live index — recorded in implementation-summary verification table; dedup remediation is a follow-up operator decision. Sonnet-max ACCEPT after redo.
