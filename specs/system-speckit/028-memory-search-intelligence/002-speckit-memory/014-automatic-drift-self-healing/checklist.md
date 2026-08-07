---
title: "Verification Checklist: Automatic Drift Self-Healing [template:level_2/checklist.md]"
description: "Verification Date: 2026-07-09. Targeted implementation verification passed; numeric latency benchmark completed via sibling packet 020; lint and broad core suite remain open."
trigger_phrases:
  - "automatic drift self-healing"
  - "query-time existence filtering"
  - "post-commit dirty-paths marker"
  - "orphan sweep backstop"
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
      - "lint fails on pre-existing unused-variable errors, confirmed outside this diff"
      - "test:core timed out with unrelated existing failures outside this packet"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-011-automatic-drift-self-healing"
      parent_session_id: null
    completion_pct: 94
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Automatic Drift Self-Healing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. [evidence: spec.md:220-241, REQ-001 through REQ-010]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [evidence: plan.md:104-168, Architecture section]
- [x] CHK-003 [P0] 007-search-index-integrity-sweep and 008-metadata-rename-reconciliation confirmed shipped before Phase 2. Evidence: both dependency packets passed `validate.sh --strict`; generated metadata dry-run reported `migrated: 0`, `failed: 0` with unrelated archived verify violations.
- [x] CHK-004 [P1] Dependencies identified and available. Evidence: implementation reused existing scan machinery, git-hook precedent, and startup-check pattern. [evidence: `memory-index.ts`, `incremental-index.ts`, `startup-checks.ts`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks. Status: `npm run lint` fails with 12 errors across 6 files. Re-checked 2026-07-09: the only match inside a packet-011-touched file is `context-server.ts:244` (`GRAPH_ENRICHMENT_SYMBOL_LIMIT` unused), and `git diff -- context-server.ts` confirms that line is absent from this packet's uncommitted diff (pre-existing, not introduced here). The remaining 5 errored files (db-state, session-stop, batch-learning, orchestrator, the archived-check migration script -- named without paths here to avoid false key-file linkage) are entirely outside this packet's file set.
- [ ] CHK-011 [P0] No console errors or warnings. Status: targeted suites pass but emit existing diagnostic logs; broad suite emits unrelated failures/warnings.
- [x] CHK-012 [P1] Error handling implemented. Evidence: malformed marker JSON is non-fatal; suspect confirmation no-ops when the config key/table is unavailable; stale-delete falls back when a DB mock/handle has no transaction support. [evidence: `memory-drift-healing.vitest.ts`, `handler-memory-index-cooldown.vitest.ts`]
- [x] CHK-013 [P1] Code follows project patterns. Evidence: default-off capability flag, config-table suspect queue, startup-check integration, and statediff invalidation reuse existing project patterns. [evidence: `capability-flags.ts`, `memory-drift-healing.ts`, `startup-checks.ts`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance criteria REQ-001 through REQ-007 met by targeted tests and implementation review. REQ-008 numeric latency is tracked separately under CHK-064, satisfied via sibling packet 020-query-time-filter-benchmark. [evidence: `npx vitest run ...` re-run fresh 2026-07-09, 110 passed, 0 failed, 28 skipped]
- [x] CHK-021 [P0] Manual testing complete for hook smoke and synthetic marker boot consumption. Evidence: scratch repo smoke verified unrelated commit no marker, rename marker, delete marker, concurrent writes preserving two entries, and post-merge/post-rewrite smoke; `memory-drift-healing.vitest.ts` verifies boot consumption.
- [x] CHK-022 [P1] Edge cases tested. Evidence: flag-off rollback, file reappeared suspect clearing, missing file tombstone confirmation, marker already-consistent no-op behavior. [evidence: `memory-drift-healing.vitest.ts`]
- [x] CHK-023 [P1] Error scenarios validated. Evidence: malformed marker boot input is a non-fatal no-op; concurrent marker writes preserve entries; delete failures are counted without aborting scan. [evidence: `memory-drift-healing.vitest.ts`, `handler-memory-index-cooldown.vitest.ts`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the three gaps has a finding class: no-auto-trigger is `class-of-bug`, the 200-row sweep cap is `instance-only`, and the query-path blind spot is `class-of-bug`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: implementation touched the single production scan path and git-hook/startup trigger points only. [evidence: `handlers/memory-index.ts`, `.opencode/scripts/git-hooks/`]
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: suspect key readers/writers live in `memory-drift-healing.ts`, Layer 1 flag is read in `memory-search.ts`/flag helpers/tests, marker schema is written by git-hook helper and consumed by startup/context-server path.
- [x] CHK-FIX-004 [P0] Path-existence and concurrency-sensitive changes include adversarial tests. Evidence: `memory-drift-healing.vitest.ts` and shell smoke cover exists/missing, concurrent writer race, and malformed marker.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. Evidence: existence tested as flag on/off plus missing/reappeared; marker tested as unrelated/rename/delete/concurrent writes. [evidence: `memory-drift-healing.vitest.ts`, shell smoke]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed for the new capability flag. Evidence: `memory-roadmap-flags.vitest.ts` covers default-off/explicit-enable behavior.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit uncommitted diff scope, not a moving branch claim. Evidence: changed files are enumerated in implementation-summary.md; no commit SHA exists because commit/push were explicitly not requested. [evidence: implementation-summary.md:78-98, Files Changed table]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [evidence: diff review]
- [x] CHK-031 [P0] The git hook never deletes or truncates the memory database itself. Evidence: hook writes only a dirty marker via shared helper; no DB delete/truncate logic added. [evidence: `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`]
- [x] CHK-032 [P1] Input validation implemented. Evidence: marker JSON parsed defensively; malformed marker cannot crash boot or corrupt the config table. [evidence: `memory-drift-healing.vitest.ts`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized for implementation state and remaining blockers [evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`]
- [x] CHK-041 [P1] Code comments adequate. Evidence: no new comment embeds spec paths or requirement/task IDs; comments describe durable behavior only. [evidence: diff review]
- [x] CHK-042 [P2] README updated where applicable. Evidence: `install-git-hooks.sh` header/comment surface updated for new hooks and bypass env.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ or system temp only. Evidence: hook smoke used a scratch temp repo outside source paths. [evidence: `/var/folders/.../T`]
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Status: no repository scratch path was created by this implementation; system temp cleanup not separately audited.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:layer-verification -->
## Layer-Specific Verification Evidence

**Layer 1 -- query-time filtering correctness and performance**
- [x] CHK-060 [P0] A search fixture with one deleted-but-still-indexed file never includes that row when the capability flag is on (REQ-001). [evidence: `memory-drift-healing.vitest.ts`]
- [x] CHK-061 [P0] The same fixture still excludes the row without a premature delete; tombstone is deferred to scan confirmation. [evidence: `memory-drift-healing.vitest.ts`]
- [x] CHK-062 [P0] Capability flag defaults to disabled with no env var set; explicit-enable override verified (REQ-002). [evidence: `memory-roadmap-flags.vitest.ts`]
- [x] CHK-063 [P0] Flag off after having run with it on restores pre-Layer-1 query behavior (REQ-009). [evidence: `memory-roadmap-flags.vitest.ts`]
- [x] CHK-064 [P1] Latency budget measured: search-with-filter-on vs. filter-off over a representative query set. Evidence: `020-query-time-filter-benchmark/implementation-summary.md` records OFF mean 274.034ms, ON mean 288.022ms, and 5.1045% mean overhead from 64 samples per state on a read-only corpus backup.

**Layer 2 -- hook detects renames vs. deletes vs. unrelated commits**
- [x] CHK-065 [P0] A commit touching only files outside .opencode/specs produces zero marker writes and zero hook side effects (REQ-003). [evidence: `git commit` scratch smoke]
- [x] CHK-066 [P0] A commit with an R### rename row under .opencode/specs produces a marker containing the correct old-path/new-path pair (REQ-003). [evidence: `git mv` scratch smoke]
- [x] CHK-067 [P0] A commit with a D row under .opencode/specs produces a marker naming the deleted path (REQ-003). [evidence: `git rm` scratch smoke]
- [x] CHK-068 [P1] post-merge and post-rewrite trigger the same detection/write logic as post-commit. Evidence: scratch smoke test passed for both hook entrypoints. [evidence: `post-merge`, `post-rewrite` scratch smoke] Note: code-complete and smoke-tested, but not yet installed into this repo's live `.git/hooks/` (only `post-commit` is currently symlinked) -- re-running `install-git-hooks.sh` activates them here.

**Layer 2 -- concurrent-session-safe marker writes**
- [x] CHK-069 [P0] Marker writes use temp-file-plus-rename and are never readable in a partially-written state (REQ-004, NFR-S02). [evidence: `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh`]
- [x] CHK-070 [P0] A simulated concurrent-write test never loses either writer's entries and never corrupts the file. Evidence: smoke reported `concurrent marker entries=2`.
- [x] CHK-071 [P1] A missing, malformed, or unreadable marker file at boot is treated as nothing-to-consume and never blocks server startup (NFR-R01). [evidence: `memory-drift-healing.vitest.ts`]

**Layer 2 -- scoped scan actually heals a marked rename/delete**
- [x] CHK-072 [P0] A synthetic marker naming one renamed spec folder, present at boot, results in scoped scan delegation and description/graph metadata refresh, without a full tree-wide scan being triggered (REQ-005). [evidence: `memory-drift-healing.vitest.ts`]
- [x] CHK-073 [P0] A synthetic marker naming one deleted spec folder results in scoped stale candidate handling; stale delete is verified in handler cooldown tests. [evidence: `handler-memory-index-cooldown.vitest.ts`]
- [x] CHK-074 [P1] Post-move regeneration uses the existing generated-metadata path after 008 validation passed. [evidence: `migrate-generated-json.ts`]

**Layer 3 -- backstop**
- [x] CHK-075 [P0] A fixture index larger than the current 200-row cap is fully swept within one explicitly invoked memory_index_scan call (REQ-006, SC-003). [evidence: `orphan-sweep-corpus-repair.vitest.ts`]
- [x] CHK-076 [P1] A suspect-queue entry still missing at the next scan is tombstoned via the existing soft-delete path; a suspect-queue entry whose file reappeared is cleared with no database write. [evidence: `memory-drift-healing.vitest.ts`]

**Feature-flag rollback path**
- [x] CHK-077 [P0] Disabling the Layer 1 capability flag fully restores pre-Layer-1 query behavior with no residual state change (REQ-009, SC-004). [evidence: `memory-roadmap-flags.vitest.ts`]
- [x] CHK-078 [P1] The git hook's bypass mechanism is documented and covered in hook helper behavior. [evidence: `.opencode/scripts/install-git-hooks.sh`]

**Non-goal compliance**
- [x] CHK-079 [P0] Code-review pass confirms zero new filesystem watcher, zero new setInterval/setTimeout timer, and zero new daemon process or long-running subsystem were introduced (REQ-007) (re-validated in the 2026-07-10 `validate.sh --strict` sweep)
<!-- /ANCHOR:layer-verification -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 25/27 |
| P1 Items | 19 | 18/19 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-09 (implementation); independently re-verified 2026-07-09 in a documentation-reconciliation pass (typecheck/build/targeted-vitest re-run fresh, lint re-checked line-by-line against the diff; no source code touched). CHK-064 numeric latency benchmark subsequently completed via sibling packet `020-query-time-filter-benchmark` (see CHK-064 evidence above) and is no longer an open gap.

Open completion gaps: CHK-010 lint baseline, CHK-011 clean broad-console/broad-suite state, and CHK-051 temp cleanup audit.
<!-- /ANCHOR:summary -->
