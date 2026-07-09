---
title: "Implementation Plan: Search-Index Integrity Sweep [template:level_2/plan.md]"
description: "Checkpoint the database, then run the already-wired verify_integrity/memory_health repair path for F10's stale-file rows and F13's orphaned vectors; root-cause F11's content drift and F10's recurrence before scoping their fixes; verify and restart the F12 enrichment backlog operationally."
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
    last_updated_at: "2026-07-09T06:21:23.000Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the technical approach and phased plan"
    next_safe_action: "Hold for implementation, no code has landed"
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
# Implementation Plan: Search-Index Integrity Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node (mk-spec-memory MCP server), better-sqlite3 storage |
| **Framework** | None new — the sweep drives the existing MCP tool surface (`memory_health`, `checkpoint_create`/`checkpoint_restore`) plus, where F11/F13 need a targeted change, the existing incremental-scan and enrichment-queue modules |
| **Storage** | `memory_index` (sqlite) + `vec_768` vector shard — the two surfaces this phase reconciles |
| **Testing** | vitest for any new/modified function; before/after `verify_integrity` snapshots as the operational proof for the bulk repair itself (this is a data-repair operation, not a pure code change, so its primary evidence is measured row counts, not a unit test) |

### Overview

The majority of F10 (stale-file rows) and F13's orphaned-vector half is already-built, already-wired repair machinery: `verify_integrity({ autoClean: true, cleanFiles: true })` (`vector-index-queries.ts:1603-1798`) called through `memory_health`'s `autoRepair`/`cleanFiles`/`confirmed` gate (`memory-crud-health.ts:1244-1399`). The plan's Phase 1 stands up a safety net (checkpoint) and runs a dry-run report; Phase 2 executes the confirmed bulk repair and separately root-causes F10's recurrence and F11's content drift before scoping their fixes; Phase 3 closes F13's missing-vector reporting-vs-repair gap and confirms F12's enrichment backlog is draining; Phase 4 verifies the whole sweep against the spec's acceptance criteria and records before/after evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Checkpoint-gated invocation of existing repair primitives, plus two bounded investigations that each resolve to either "confirm and operationally close" or "small targeted fix" — not a new engine or a new store.

### Key Components

- **Checkpoint boundary**: `checkpoint_create` before the first mutating call; `checkpoint_restore` is the named rollback path, rehearsed against a scratch copy per SC-003.
- **Bulk repair call**: one `memory_health({ reportMode: 'full', autoRepair: true, cleanFiles: true, confirmed: false })` dry-run, inspected, then re-run with `confirmed: true` — this single call closes F10 (stale files) and the orphaned-vector half of F13 together (`verify_integrity` cleans both `orphaned_vectors` and, with `cleanFiles`, `orphaned_files` in the same pass).
- **F10 recurrence investigation**: read `categorizeFilesForIndexing`'s call sites to determine whether `listStaleIndexedPaths` (`incremental-index.ts:346-356`) is reachable from the production `memory_index_scan` entrypoint, and with what file-list scope. Resolves to either "already wired, cadence/scope gap only" (operational fix — schedule or widen scope) or "not wired" (small code change to call it from the scan entrypoint).
- **F11 content-drift investigation**: re-run the 292-doc sample (or a fresh equivalent sample if the original isn't reproducible) through `hashesMatch`/`contentHashVariants` (`content-id.ts:94-101`) instead of the scan path's single raw hash, to see how much of the 25-doc mismatch it explains; for the remainder, inspect whether `stored.content_hash` is `NULL` on those rows (the fast-path-skip hypothesis at `incremental-index.ts:254-268`). Resolves to a scoped re-hash/refresh of the confirmed-drifted rows, or a small guard fix if the `NULL`-hash fast-path-skip is confirmed as the cause.
- **F13 missing-vector fix**: a small, targeted change (new script or a flag on an existing repair path) that flips the 20 `embedding_status='success'`-with-no-vector rows to `'pending'`, routing them into the same queue F12's restart drains — no new embed-now code path.
- **F12 operational check**: inspect `hasActiveEmbedderJob`/`hasActiveScanJob` (`memory-crud-health.ts:614-641`) and each maintenance tool's `lastRunAt`; trigger a manual run or restart the scheduler; confirm the pending+failed count is shrinking across two checks.

### Data Flow

Checkpoint → dry-run health report (evidence: current row counts, orphan counts) → confirmed bulk repair (F10 + F13-orphaned-vectors) → post-repair `verify_integrity({ autoClean: false })` re-check → F10-recurrence and F11-drift investigations run against the now-cleaned corpus (so their findings aren't confounded by the stale-file noise) → F11's confirmed-drift rows re-hashed/refreshed → F13's 20 false-success rows flipped to `pending` → F12 restart triggered and monitored → final full `memory_health` report as closing evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `memory_index` table (sqlite, `schema-downgrade.ts:114` carries the canonical `CREATE TABLE`) | Owns every search-indexed row, including the 9,793 stale-file rows and the 20 false-success embedding rows | Mutated (rows deleted for F10, `embedding_status` flipped for F13) via existing functions only | Before/after row count, `verify_integrity` snapshot, and per-row `recordHistory` entries (already emitted by `delete_memory_from_database`) reviewed |
| `vec_768` vector shard | Owns embeddings; carries 1,374 orphaned rows with no owning `memory_index` row | Mutated (orphaned rows deleted) via `verify_integrity`'s existing `autoClean` vector-cleanup path | `orphanedVectors === 0` in the post-repair report |
| `ACTIVE_ROW_SQL` / `active-row-predicate.ts` | Query-time filter every ranked/constitutional search uses | Not modified — this phase makes the underlying data conform to what the predicate already assumes (no live row should reference a deleted file), it does not change the predicate itself | REQ-003's sample-query check confirms no stale-file row surfaces post-sweep |
| `incremental-index.ts` (`shouldReindex`, `categorizeFilesForIndexing`, `listStaleIndexedPaths`) | Owns the routine per-scan reindex decision, including an existing stale-path detection pass | Investigated; modified only if the investigation confirms a wiring or scope gap | grep + read the scan entrypoint's call graph; if changed, a before/after scan run on a fixture with a deleted file confirms the `toDelete` pass now fires |
| `content-id.ts` (`hashesMatch`, `contentHashVariants`) | Owns the two-variant hash comparison, currently used only at save-time dedup | Not modified — reused (read-only call) in the F11 investigation to test whether it explains part of the sample's mismatch | The investigation's own before/after count of "explained by variant mismatch" vs "genuinely stale" |
| `memory-crud-health.ts` (`handleMemoryHealth`) | Owns the `autoRepair`/`cleanFiles`/`confirmed` MCP-facing repair gate | Not modified — invoked as-is for the F10/F13-orphaned-vector bulk repair | The dry-run vs confirmed two-step is exercised exactly as the existing code requires, no bypass added |
| `checkpoints.ts` (`checkpoint_create`/`checkpoint_restore`) | Owns gzip-compressed DB snapshots | Not modified — invoked as-is for REQ-001/SC-003 | A named checkpoint exists and is recorded before the first mutating call; a restore is rehearsed against a scratch copy |

Required inventories:
- Same-class producers: `rg -n "verifyIntegrity|verify_integrity" .opencode/skills/system-spec-kit/mcp_server` to confirm no other call site invokes the same repair function with conflicting options during the sweep window.
- Consumers of changed rows: `ACTIVE_ROW_SQL` (ranked search), `memory_search`/`memory_context` (both read `memory_index` through it), and vector search (reads `vec_768` filtered against `memory_index`) are the three consumers whose output this phase's mutation is meant to correct — no other consumer needs a separate check.
- Matrix axes: F10 (stale-file rows) × F13-orphaned-vectors (single bulk pass) vs F11 (content drift, separate targeted pass) vs F13-missing-vectors (separate targeted pass) vs F12 (operational, no row mutation) — four distinct action classes, tracked separately in the checklist even though F10/F13-orphaned-vectors share one call.
- Algorithm invariant: a second confirmed repair run on an already-clean corpus is a no-op (0 rows affected) — this is `verify_integrity`'s existing idempotent behavior, not new logic this phase must build.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and Safety Net
- [ ] Confirm `memory_health` and `checkpoint_create`/`checkpoint_restore` MCP tools are reachable (daemon warm or MCP transport live)
- [ ] Take a named checkpoint of the production database (`checkpoint_create`) and record its name
- [ ] Rehearse a `checkpoint_restore` against a scratch copy of the database (or cite the checkpoint mechanism's own existing test coverage as equivalent evidence, per spec.md's open question)
- [ ] Run `memory_health({ reportMode: 'full', autoRepair: true, cleanFiles: true, confirmed: false })` as a dry-run and record the reported orphan/stale counts as the "before" baseline

### Phase 2: Bulk Repair (F10 + F13-orphaned-vectors) and Root-Cause Investigations
- [ ] Re-run `memory_health` with `confirmed: true` to execute the bulk repair; record the `cleaned` counts (vectors, chunks, files) it returns
- [ ] Run a post-repair `verify_integrity({ autoClean: false })` and confirm `orphanedFiles.length === 0` and `orphanedVectors === 0` (REQ-002, REQ-004)
- [ ] Investigate F10 recurrence: trace whether `listStaleIndexedPaths`/`categorizeFilesForIndexing`'s `toDelete` pass is reachable from the production scan entrypoint, and with what scope; record the finding
- [ ] Investigate F11 content drift: re-run the sample against `hashesMatch`/`contentHashVariants`; for unexplained mismatches, check whether `stored.content_hash IS NULL` on those rows; record the finding and the confirmed-drifted row set

### Phase 3: Targeted Fixes (F11 refresh, F13 missing-vectors, F12 operational)
- [ ] Re-hash and refresh `content_text`/`content_hash` for the F11 confirmed-drifted rows (mechanism decided by Phase 2's investigation output — existing scan re-index call vs a small new scoped script)
- [ ] If Phase 2 found a real wiring/scope gap in the F10 recurrence path, apply the minimal fix; otherwise document the operational cadence/scope conclusion (REQ-009 is P2, deferrable with reason)
- [ ] Flip the 20 F13 false-success `embedding_status` rows to `'pending'` so they enter the existing enrichment queue
- [ ] Verify F12's maintenance-tool scheduler state (`hasActiveEmbedderJob`/`hasActiveScanJob`), confirm free slots, and restart/trigger the enrichment run; only write a code fix if the restart with confirmed-free slots does not move the backlog

### Phase 4: Verification
- [ ] Two consecutive `memory_health` checks (at least one enrichment cycle apart) show the F12 pending+failed count decreasing and `lastRunAt` populated (REQ-007)
- [ ] Final full `memory_health` report shows the file-existence, orphaned-vector, and false-success-embedding dimensions at the target state (SC-001, SC-002)
- [ ] Sample search queries over previously-stale terms return zero hits referencing deleted files (REQ-003)
- [ ] Before/after tables (row counts, orphan counts, `isConsistent` flags) recorded in implementation-summary.md for every mutating step
- [ ] Documentation updated (spec/plan/tasks/checklist)

### Benchmark (SPECIFIED, not run)

This is a data-integrity repair operation over an existing search backend, not a new retrieval-ranking change, so the primary metric is measured row-count reconciliation, not a recall benchmark. No retrieval-class detector or ranking logic is added; the `015-prodmode-recall-gate` completeRecall@3 instrument is not triggered by this phase.

| Metric | Pass threshold | Regress threshold | Reproduce |
|--------|----------------|--------------------|-----------|
| Stale-file row count | 0 after sweep (or fully logged exemptions) | any unaccounted stale-file row remains | `verify_integrity({ autoClean: false }).orphanedFiles.length` post-sweep |
| Orphaned-vector count | 0 after sweep | any orphaned vector remains | `verify_integrity({ autoClean: false }).orphanedVectors` post-sweep |
| False-success embedding count | 0 after sweep (all re-queued or re-embedded) | any row still `success` with no vector | the `missing_vectors` SQL (`vector-index-queries.ts:1655-1661`) post-sweep |
| Enrichment backlog trend | pending+failed count strictly decreasing across two checks | flat or increasing after a confirmed restart with free slots | two `memory_health` calls separated by one enrichment cycle |
| Rollback rehearsal | a `checkpoint_restore` against a scratch copy succeeds and reproduces the pre-sweep row count | restore fails or row count mismatches | `checkpoint_restore` against the scratch copy, then `SELECT COUNT(*) FROM memory_index` |

**Default-safety**: no new always-on mutation path is introduced. Every mutating call in this phase is an explicit, operator-invoked, `confirmed: true`-gated MCP tool call — the existing gate this codebase already requires for `autoRepair`, unchanged by this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Any new/modified function from Phase 3 (F11 refresh mechanism, F13 status-flip, and any F10 recurrence fix) | vitest, colocated with the existing `mcp_server/tests/` suite (e.g. alongside `run-enrichment-step.vitest.ts`, `enrichment-state.vitest.ts` for anything touching the enrichment queue) |
| Integration | The full checkpoint → dry-run → confirmed-repair → post-check sequence | Manual MCP tool invocation against a scratch or staging copy of the database first, per SC-003 |
| Data verification | Before/after row counts, orphan counts, `isConsistent` flags | `verify_integrity` snapshots recorded directly in implementation-summary.md, not a pass/fail test artifact |
| Manual | Sample search queries over previously-stale terms; two-cycle enrichment-drain observation | MCP `memory_search`/`memory_context` calls, `memory_health` polling |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|---------------------|
| `memory_health` MCP tool (`autoRepair`/`cleanFiles`/`confirmed`) | Internal | Green — already shipped and wired | Would require building the bulk-repair call chain from scratch instead of invoking it |
| `checkpoint_create`/`checkpoint_restore` MCP tools | Internal | Green — already shipped | No rollback path for the bulk mutation; phase would need a manual `cp`-based DB backup instead |
| `verify_integrity` (`vector-index-queries.ts`) | Internal | Green — already shipped | No orphan/stale-file detection or cleanup primitive to build on |
| `content-id.ts` (`hashesMatch`/`contentHashVariants`) | Internal | Green — already shipped | F11's investigation would need to reimplement the two-variant comparison |
| `incremental-index.ts` (`categorizeFilesForIndexing`, `listStaleIndexedPaths`) | Internal | Green — already shipped, wiring status unconfirmed | If not wired into production scans, F10's recurrence fix scope grows from "confirm/schedule" to "wire in" |
| Enrichment maintenance job / scheduler | Internal (operational) | Unknown — F12 reports `lastRunAt: null` across all three tools | If the scheduler itself is broken (not just idle), REQ-007 needs a code fix, escalated per the master scope's own instruction |
| JSON-metadata sibling phase (F1-F9) | Internal (parallel) | Independent | None — different data store and tooling, explicitly no hard dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The post-repair `verify_integrity` check shows a worse or unexpected state (e.g. a non-stale row was deleted, or `isConsistent` stays false after the confirmed repair), or a search-result sample check (REQ-003) still surfaces stale-file content after the sweep claims completion.
- **Procedure**: `checkpoint_restore` to the pre-sweep checkpoint taken in Phase 1. Because `delete_memory_from_database` records history for every deleted row (`vector-index-queries.ts:1720`, `recordHistory(...,'mcp:integrity_check_files',...)`), a narrower row-level recovery is also possible if a full checkpoint restore is judged too broad for the actual scope of the problem.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup/Checkpoint) ──► Phase 2 (Bulk Repair + Investigations) ──► Phase 3 (Targeted Fixes) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup/Checkpoint | Reachable `memory_health`/checkpoint MCP tools | Bulk Repair |
| Bulk Repair + Investigations | Setup/Checkpoint | Targeted Fixes |
| Targeted Fixes | Bulk Repair + Investigations (investigation findings scope the fixes) | Verify |
| Verify | Targeted Fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup/Checkpoint | Low | 1-2 hours |
| Bulk Repair + Investigations | Med | 4-6 hours |
| Targeted Fixes | Med | 3-6 hours (variable — depends on what the investigations find) |
| Verification | Low-Med | 2-3 hours |
| **Total** | | **10-17 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created and its name recorded before any `confirmed: true` call
- [ ] Checkpoint restore rehearsed against a scratch copy
- [ ] Dry-run (`confirmed: false`) report reviewed and its counts sanity-checked against the digest's known figures (9,793 stale files, 1,374 orphaned vectors, 20 false-success) before the confirmed run

### Rollback Procedure
1. `checkpoint_restore` to the pre-sweep checkpoint
2. Confirm restored row counts match the Phase 1 "before" baseline
3. If only a subset of rows needs reverting, use the per-row history entries `delete_memory_from_database` already records instead of a full restore
4. No external stakeholder notification needed — this is an internal search-backend data-quality operation

### Data Reversal
- **Has data migrations?** No schema migration; row-level delete and `embedding_status` updates only
- **Reversal procedure**: `checkpoint_restore`, or targeted row recovery from the recorded history entries
<!-- /ANCHOR:enhanced-rollback -->
