---
title: "Feature Specification: Search-Index Integrity Sweep [template:level_2/spec.md]"
description: "RESUMED verification found the core search-index sweep already applied: the final pre-repair backup had 23,322 memory_index rows and the live DB has 13,529 rows, a 9,793-row drop. Completion remains blocked by failing full test suites and remaining enrichment backlog."
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
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/active-row-predicate.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Search-Index Integrity Sweep

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
| **Priority** | P0 |
| **Status** | Core DB sweep already applied; verification blocked |
| **Created** | 2026-07-09 |
| **Branch** | `007-search-index-integrity-sweep` |
| **Verdict** | GO — CRITICAL, reviewer-flagged live-result contamination |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mk-spec-memory search backend (`memory_index` + `vec_768`) has drifted from the current on-disk spec corpus, primarily as a side effect of the July 2026 `system-spec-kit` → `system-speckit` re-nest, which moved and renamed thousands of spec folders without reconciling their old index rows. Four confirmed defects (F10-F13 in the review-round findings digest):

- **F10 (CRITICAL):** 9,793/23,284 rows (42%; 8,899/21,078 distinct paths) reference files that no longer exist on disk. 8,905 of those sit in SEARCHABLE importance tiers (only 888 are filtered as deprecated), and `ACTIVE_ROW_SQL` (`mcp_server/lib/search/active-row-predicate.ts:42`) filters only on `deleted_at IS NULL` and importance tier — it never checks file existence at query time, so stale content is actively served as live results. `memory_health` independently corroborates this: `orphaned_files_more` in the consistency report (`mcp_server/handlers/memory-crud-health.ts:1203`) and an overall `degraded` status. Concentrated in the re-nest trees (system-speckit 3,260, deep-loop 2,344, design 1,517, skilled-agent 1,080) plus deleted tracks.
- **F11:** ~8.6% of a 292-doc sample (25 docs) have a `content_hash` matching neither the normalized nor the legacy raw sha256 of current disk content (`content-id.ts:94-101` defines the two accepted variants via `contentHashVariants`); 50/292 show >2s mtime drift. Outdated `content_text` is being served for these rows.
- **F12:** 9,317 rows (40%; 8,901 pending + 416 failed) are unenriched, the oldest pending row is 4+ days old, and all three maintenance tools report `lastRunAt: null` with 0/4 active enrichment slots in use — the pipeline is not draining despite free capacity.
- **F13:** 20 rows claim `embedding_status = 'success'` with no backing vector in any shard (a `missing_vectors` count the health check already computes at `vector-index-queries.ts:1655-1661` but never repairs), invisible to vector search and never retried. Separately, `vec_768` carries 1,374 more rows than `memory_index` (24,638 vs 23,284) — orphaned vectors with no owning row, recall-benign but dead scan weight.

### Purpose

Reconcile `memory_index` and `vec_768` against current disk state: retire the stale-file backlog so `ACTIVE_ROW_SQL` can no longer surface deleted content, refresh content on the confirmed-drifted existing-file rows, correct the false-success embedding-status rows, and drain the orphaned-vector and enrichment backlogs — using the repair machinery this codebase already ships wherever it already exists, snapshotted before any bulk mutation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **F10** — Retire the 9,793 stale-file rows via the existing `verify_integrity({ autoClean: true, cleanFiles: true })` repair path (`mcp_server/lib/search/vector-index-queries.ts:1603-1798`, wired through `memory_health`'s `autoRepair` + `cleanFiles` args at `mcp_server/handlers/memory-crud-health.ts:1361-1399`), run against a full-corpus health scan and gated behind the tool's existing `confirmed: true` two-step (dry-run report, then confirmed apply) at `memory-crud-health.ts:1244`.
- **F10 (root-cause)** — Investigate why the incremental scanner's own stale-path detection (`categorizeFilesForIndexing`'s `toDelete` pass and `listStaleIndexedPaths`, `mcp_server/lib/storage/incremental-index.ts:314-359`) has not kept this class of drift near zero on its own during routine scans; fix only if that investigation finds a real gap in the routine path (see plan.md — this is the one item in scope that may resolve as "confirm and schedule" rather than "write code").
- **F11** — Sample-verify the 292-doc drift set against `hashesMatch`/`contentHashVariants` (`content-id.ts:94-101`, the two-variant comparison already used at save-time dedup) to rule that out as the mismatch cause; root-cause the remainder (leading hypothesis: `stored.content_hash` is `NULL` on some rows, which silently short-circuits the mtime-fast-path content check at `incremental-index.ts:260` and returns `'skip'` instead of `'modified'`); then re-hash and refresh `content_text` for the confirmed-drifted rows via a scoped re-index pass.
- **F13** — Fix the 20 false-success `embedding_status` rows by flipping them to `'pending'` so they enter the same enrichment queue F12 restarts (reuses the queue, adds no bespoke embed-now path); confirm they clear on the next enrichment pass. Prune the 1,374 orphaned `vec_768` rows in the same `verify_integrity({ autoClean: true })` pass used for F10 (one bulk operation, one before/after snapshot, covers both).
- **F12 (operational)** — Verify the three maintenance tools' scheduler/cron state, confirm 4 enrichment slots are actually free (`hasActiveEmbedderJob`, `memory-crud-health.ts:619-641`), and restart or manually trigger the enrichment run. Only pursue a code fix if a restart with free slots fails to move the backlog.
- A checkpoint snapshot (`checkpoint_create` / `checkpoint_restore` MCP tools, `mcp_server/lib/storage/checkpoints.ts`) taken immediately before the first bulk-mutating repair call, so the entire sweep is one-command reversible.
- Before/after row counts and a full `verify_integrity({ autoClean: false })` re-check after each mutating step, recorded in the checklist.

### Out of Scope

- **F14** (channel-skip calibration) — a query-time ranking/routing concern, disjoint data path from this phase's row-reconciliation scope; not addressed here.
- The JSON-metadata phase (F1-F9, `description.json`/`graph-metadata.json` drift) — a different data store (spec-doc JSON sidecars) and different tooling (`generate-description.ts`, `backfill-graph-metadata.ts`) from this phase's daemon/sqlite/vector-store scope. Independent and parallelizable; tracked as a sibling phase, not here.
- Track 2 presentation-layer findings (P1-P3: breadcrumb suppression, result-count cap, field-shape asymmetry) — these are formatter/token-budget concerns over the *served* result shape, not the underlying index data; out of scope for a data-integrity sweep.
- Any new detector, engine, or scoring logic — this phase calls existing repair primitives (`verify_integrity`, `memory_health` autoRepair, checkpoints) and, where F11/F13 need a small targeted fix, extends the existing incremental-scan and enrichment-queue paths rather than adding parallel machinery.
- A permanent scheduled sweep to prevent this class of drift from recurring — F10's root-cause investigation may recommend one, but standing it up (new cron/workflow) is a follow-up decision, not pre-committed scope here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (operational) `memory_health` MCP tool invocation | Run, not modify | Bulk repair call for F10 (stale files) and F13 (orphaned vectors) via existing `autoRepair`/`cleanFiles`/`confirmed` args |
| (operational) `checkpoint_create` / `checkpoint_restore` MCP tool invocation | Run, not modify | Pre-mutation snapshot and rollback path |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts` | Modify (conditional) | Only if the F10 root-cause investigation confirms `listStaleIndexedPaths`/`categorizeFilesForIndexing` is not wired into the routine scan entrypoint, or if F11's `NULL content_hash` hypothesis is confirmed and the fast-path check needs a guard |
| A scoped re-index/repair script or existing CLI invocation (target TBD by plan.md Phase 1 investigation) | Create or reuse | Refreshes `content_text`/`content_hash` for F11's confirmed-drifted rows and flips F13's 20 false-success rows to `pending` |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/` | Modify (conditional) | Record the new integrity-sweep procedure if it becomes a repeatable operator playbook entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Before any bulk-mutating repair runs, the system SHALL have a restorable checkpoint of the memory database. | A `checkpoint_create` call succeeds and its name is recorded in the checklist before the first `autoRepair: true, confirmed: true` call executes. |
| REQ-002 | When the sweep completes, the count of `memory_index` rows whose `file_path` does not exist on disk SHALL be 0 (excluding any row explicitly exempted and logged, e.g. a known in-flight rename). | A post-sweep `verify_integrity({ autoClean: false })` reports `orphanedFiles.length === 0`, or every remaining entry is logged with a documented exemption reason. |
| REQ-003 | When the sweep completes, `ACTIVE_ROW_SQL`-served search results SHALL NOT include any row referencing a deleted file. | A search run over a sample of pre-sweep known-stale query terms returns zero hits whose `file_path` fails `fs.existsSync`. |
| REQ-004 | The count of orphaned `vec_768` rows (vectors with no owning `memory_index` row) SHALL be 0 after the sweep. | Post-sweep `verify_integrity({ autoClean: false }).orphanedVectors === 0`. |
| REQ-005 | None of the 20 rows with `embedding_status = 'success'` and no backing vector SHALL remain in that false-success state. | Post-sweep, the `missing_vectors` SQL (`vector-index-queries.ts:1655-1661`) returns 0, or every remaining row is confirmed re-embedded (vector present) or explicitly re-queued as `pending`/`failed`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The system SHALL re-hash and refresh `content_text` for every row in the F11 sample confirmed to have genuine content drift (post root-cause). | Re-running the F11 sample-verification check against the refreshed rows shows `hashesMatch(currentDiskContent, storedHash) === true` for all of them. |
| REQ-007 | The enrichment backlog SHALL be actively draining, confirmed by a non-null `lastRunAt` on all three maintenance tools and a shrinking pending+failed count. | Two consecutive `memory_health` checks, taken at least one enrichment cycle apart, show the pending+failed total decreasing and `lastRunAt` populated. |
| REQ-008 | Every mutating step in the sweep SHALL be preceded and followed by a recorded row count and `verify_integrity` snapshot. | The checklist/implementation-summary carries a before/after table for each mutating step (row counts, orphan counts, `isConsistent` flag). |

### P2 - Optional (nice to have)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | If the F10 root-cause investigation finds the routine scan's stale-path detection is not wired into production scans, the system SHOULD schedule or wire it so the 42% backlog does not reaccumulate. | A follow-up phase or a wired fix is proposed with evidence from the investigation; deferring is acceptable with a documented reason. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `memory_health` full report run after the sweep shows overall status no worse than `healthy` on the consistency dimensions this phase owns (file-existence, orphaned vectors, false-success embeddings) — `degraded` solely due to F12's enrichment lag (if still draining) or F1-F9 JSON-metadata drift (owned by the sibling phase) is acceptable.
- **SC-002**: The stale-file row count drops from 9,793 to 0 (or to a documented, logged exemption set), verified by before/after `verify_integrity` snapshots taken across the same checkpoint boundary.
- **SC-003**: A rollback via `checkpoint_restore` has been rehearsed at least once against a non-production scratch copy of the database (or the checkpoint mechanism's own test coverage is cited as equivalent evidence) before the production sweep runs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bulk delete of 9,793 production index rows | Wrong scoping or a race with a concurrent write could destroy live rows, not just stale ones | Checkpoint before mutation (REQ-001); dry-run report (`confirmed: false`) inspected before the confirmed apply; `delete_memory_from_database` already records history per deleted row for forensic recovery |
| Risk | F11's root cause is broader than the sampled 292 docs suggest | A narrow fix could leave a larger population of stale `content_text` unaddressed | Root-cause first (in scope), then decide whether the confirmed-drift fix generalizes to a full-corpus re-hash pass or stays scoped to the sample-derived set — this decision is explicitly deferred to plan.md, not pre-committed here |
| Dependency | `verify_integrity`'s `autoClean`/`cleanFiles` and `memory_health`'s `autoRepair`/`confirmed` gates already exist and are wired together | If this call chain has a latent bug at 9,793-row scale (never previously exercised at this size), the bulk repair could partially fail mid-run | Snapshot first; verify the post-repair report (`memory-crud-health.ts:1386-1399` already emits a "still degraded" warning) instead of trusting the repair's own success claim |
| Dependency | F12's maintenance-job restart | If the scheduler itself is broken (not just idle), REQ-007 cannot be met without a code fix that is explicitly out of this phase's default scope | Escalate to a code fix only if a restart with confirmed-free slots does not move the backlog, per the master scope's own instruction |
| Risk | Concurrent sessions writing to `memory_index` during the sweep | A row inserted or updated mid-sweep could be miscounted in before/after snapshots | Coordinate the sweep window; note in tasks.md that this is a single-operator, quiet-window operation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The bulk repair pass is a single `verify_integrity`/`memory_health` invocation over the existing corpus, not a per-row RPC loop; it should complete within a single interactive session without a custom batch runner.
- **NFR-P02**: `check_orphaned_files` (`vector-index-queries.ts:1688-1703`) does a synchronous `fs.existsSync` per `memory_index` row (23,284 rows) — expected to be fast (sub-second class), but the sweep should record actual wall-clock time in case corpus growth changes that assumption later.

### Reliability
- **NFR-R01**: A second `verify_integrity({ autoClean: true, cleanFiles: true })` run on an already-clean corpus is a no-op (0 rows cleaned), matching the function's existing idempotent design (it only acts on rows it currently finds orphaned).

### Safety
- **NFR-S01**: No mutating repair call runs without a preceding checkpoint and without the `confirmed: true` explicit-apply gate already built into `memory_health` — this phase adds no new bypass of that gate.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A row whose `file_path` is `NULL` or empty: `check_orphaned_files` (`vector-index-queries.ts:1692-1699`) skips it (the `memory.file_path &&` guard), so it is neither counted nor cleaned — confirm this class is small and separately accounted for, not silently invisible to the sweep.
- A row referencing a file that was renamed (not deleted) mid-sweep, e.g. an in-flight concurrent session's own re-nest work: treat as a documented exemption per REQ-002, not a sweep failure.

### Error Scenarios
- `verify_integrity` throws partway through the `cleanFiles` loop (e.g. a `delete_memory_from_database` failure on one row): the function already catches per-row and continues (`vector-index-queries.ts:1727-1729`) — confirm the partial-cleanup count is captured accurately in the checklist rather than assumed complete.
- The `confirmed: true` call is issued without a preceding checkpoint (operator error): treat as a hard stop — REQ-001 makes the checkpoint a precondition, not a parallel step.

### State Transitions
- A row flipped from `embedding_status = 'success'` to `'pending'` (F13 fix) that then fails enrichment again: it re-enters the F12 backlog under its existing `failed` handling, not a new state this phase invents.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Mostly invoking existing repair primitives (`verify_integrity`, `memory_health`, checkpoints); F11's fix and any F10 root-cause code change are the open-ended pieces |
| Risk | 16/25 | Real production blast radius (9,793-row bulk delete against a live search backend), mitigated by an existing checkpoint/rollback mechanism and a dry-run-first gate |
| Research | 8/20 | F10/F13/F12 root causes and fix mechanisms are already confirmed against real file:line evidence; F11 is the one genuinely open investigation |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 7. CONCRETE CHANGE AND SEAMS

The exact seams, verified to file:line against the live tree.

- `ACTIVE_ROW_SQL(alias, options)` (`mcp_server/lib/search/active-row-predicate.ts:42-51`) builds the `deleted_at IS NULL AND <tier filter>` predicate every ranked/constitutional search query uses. The tombstone column (`deleted_at`) already exists and is already the enforcement point — the sweep's job is to make sure the 9,793 stale rows actually carry a terminal state (deleted, per this phase's chosen mechanism) rather than sitting `deleted_at IS NULL` with a nonexistent backing file.
- `verify_integrity(options, database)` (`mcp_server/lib/search/vector-index-queries.ts:1603-1798`) is the single existing function that already detects and, with `autoClean`, cleans: orphaned vectors (`:1619-1651`), orphaned `memory_index` rows for deleted files when `cleanFiles: true` (`:1688-1736`), and orphaned parent-less chunks (`:1738-1783`). It reports but does not clean `missing_vectors` (`:1655-1661`, the F13 false-success class) — that gap is what REQ-005's fix targets.
- `handleMemoryHealth` (`mcp_server/handlers/memory-crud-health.ts:851+`) is the MCP-facing wrapper: `autoRepair` + `cleanFiles` args flow into a call to `verifyIntegrity({ autoClean: true, cleanFiles })` at `:1361-1399`, gated by a `confirmed` flag two-step at `:1244-1266` (an unconfirmed `autoRepair: true` call returns a dry-run report and asks for `confirmed: true` to actually execute).
- `checkpoints.ts` (`mcp_server/lib/storage/checkpoints.ts`) already implements gzip-compressed database checkpoints with embedding preservation, exposed as the `checkpoint_create`/`checkpoint_restore` MCP tools (`tool-schemas.ts:562,597`) — this is the rollback mechanism REQ-001/SC-003 rely on; the phase does not need to build a new backup path.
- `incremental-index.ts`'s `shouldReindex` (`:236-272`) and `categorizeFilesForIndexing` (`:314-359`) already implement a 6-path reindex decision including a `'deleted'` path and an explicit `listStaleIndexedPaths` pass (`:346-356`, comment: "Without this pass, removed files never enter toDelete during normal scans because discovery only returns files that currently exist") — this is the mechanism that, if actually wired into routine production scans, should have been catching F10's drift class already. Confirming whether it is wired in, and why 42% drift accumulated despite it, is the F10 root-cause task.
- `content-id.ts`'s `contentHashVariants`/`hashesMatch` (`:94-101`) is the two-hash-variant comparison (normalized + legacy raw) already used at save-time dedup (`handlers/memory-save.ts`, `handlers/save/dedup.ts`) but NOT currently applied in the scan-path content-drift check, which instead uses a single raw sha256 via `computeFileContentHash` (`incremental-index.ts:181-188`). Whether applying the two-variant comparison closes part of F11's gap, or whether the real cause is the `NULL content_hash` fast-path skip at `:254-268`, is this phase's one open investigation.

## 8. DEPENDENCIES AND VERDICT

- **No hard dependency on the JSON-metadata phase.** Different data store (sqlite `memory_index`/`vec_768` vs `description.json`/`graph-metadata.json` sidecars) and different tooling, so this phase can run in parallel with it.
- **Depends on operator coordination, not a code dependency**: the bulk-mutation window should be a quiet window (no concurrent `memory_save`/`memory_index_scan` activity) to keep before/after row counts meaningful, per the Risks table.
- **Verdict: GO — CRITICAL.** F10 is reviewer-flagged CRITICAL because it means the search backend is *actively serving deleted content as live results* to every query that hits those tiers. The fix mechanism for the majority of the phase (F10, F13's orphaned-vector half) is already built and wired; the remaining work is safe invocation (checkpoint-gated), root-causing F11 and F10's recurrence, and closing F13's missing-vector reporting-vs-repair gap.

---

## 10. OPEN QUESTIONS

- Does the F10 root-cause investigation find `listStaleIndexedPaths`/`categorizeFilesForIndexing`'s `toDelete` pass is simply not invoked by the production scan entrypoint (a wiring gap), or is it invoked but scoped to a `--roots`/candidate-file list that never included the pre-rename paths (a scope gap)? The fix differs: wire it in, versus widen its scan scope.
- For F11, once root-caused, does the fix stay scoped to the confirmed-drifted rows found in the 292-doc sample, or does the same root cause imply a larger silent population that needs a full-corpus re-hash pass? Plan.md Phase 1 must answer this before Phase 2 scopes the fix.
- Should the checkpoint taken for REQ-001 be restored-tested against a scratch copy of the production database before the real sweep runs, or is the checkpoint mechanism's own existing test coverage sufficient evidence of restorability? (Leans toward a scratch-copy rehearsal given the blast radius, per SC-003, but this is a checklist call, not pre-decided here.)
<!-- /ANCHOR:questions -->
