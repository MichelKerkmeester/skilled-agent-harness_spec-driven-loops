---
title: "Tasks: Automatic Drift Self-Healing [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
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
      - "test:core timed out with unrelated existing failures outside this packet"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-011-automatic-drift-self-healing"
      parent_session_id: null
    completion_pct: 88
    open_questions: []
    answered_questions: []
---
# Tasks: Automatic Drift Self-Healing

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

Implementation tasks are grouped by layer within Phase 2, ordered per the operator's stated sequencing:
Layer 1 first (independent, primary safety net), Layer 2 second, Layer 3 last (smallest, cheapest).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm 007-search-index-integrity-sweep and 008-metadata-rename-reconciliation have both shipped and merged (hard precondition, REQ-010). Evidence: both dependency packets passed `validate.sh --strict`.
- [x] T002 Re-verify the tree baseline with dependency strict validation and generated-metadata dry-run. Evidence: dependency strict validation passed; generated metadata dry-run enumerated 2508 files, migrated 0, skipped 2508, failed 0; unrelated archived verify violations remain outside this packet. [evidence: `validate.sh --strict`, `migrate-generated-json.ts --dry-run --verify`]
- [x] T003 [P] Re-confirm the existing scan-machinery call graph against the live tree. Evidence: implementation reused `sweepOrphanIndexRows`, `reconcileMoves`, stale indexed-row lookup, and path-existence cache call sites.
- [x] T004 [P] Decide and document the marker file schema and suspect-queue policy. Evidence: marker schema uses atomic JSON entries with old/new/status fields; suspect queue is config-table backed and only tombstoned after scan-time confirmation. [evidence: `memory-drift-healing.ts`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Layer 1 -- Query-Time Existence Filtering (independent, primary safety net)

- [x] T005 Add a new default-off capability flag gating Layer 1, following the existing capability-flag pattern (.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts). [evidence: `capability-flags.ts:238`]
- [x] T006 Add the top-k existence filter to memory-search.ts's final result assembly, reusing existing path resolution/cache helpers (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts). [evidence: `memory-search.ts:372-433`]
- [x] T007 Add suspect-queue config-table read/write/clear helpers under a new key, reusing the existing config table (.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts). [evidence: `memory-drift-healing.ts:61-143`]
- [x] T008 Wire filtered-out row ids from T006 into the suspect queue from T007. [evidence: `memory-search.ts`]
- [x] T009 [P] Unit tests: filter correctness with the flag on/off, no residual delete on first miss (REQ-001). Evidence: `memory-drift-healing.vitest.ts`, `memory-roadmap-flags.vitest.ts`.
- [x] T010 [P] Unit tests: suspect-queue append/read-back/clear round-trip (REQ-002). Evidence: `memory-drift-healing.vitest.ts`.
- [x] T011 [P] Latency benchmark: search with the flag on vs. off over a representative query set, numbers captured for implementation-summary.md (REQ-008). Status: satisfied via sibling packet `020-query-time-filter-benchmark` — OFF mean 274.034ms, ON mean 288.022ms, 5.1045% mean overhead, 64 samples/state (see `020-query-time-filter-benchmark/implementation-summary.md` REQ-001 row and CHK-064).
- [x] T012 Rollback test: flag off after having run with it on produces results identical to a build that never had Layer 1 (REQ-009). Evidence: feature flag default-off and rollback tests in targeted suite.

### Layer 2 -- Git Hook + Boot Consumption (event-triggered cleanup)

- [x] T013 Extend post-commit with a scoped rename/delete check that is a no-op unless an R### or D row is present (.opencode/scripts/git-hooks/post-commit). [evidence: `.opencode/scripts/git-hooks/post-commit`]
- [x] T014 Implement the atomic dirty-marker JSON write into the memory DB directory, safe under concurrent sessions (.opencode/scripts/git-hooks/lib/memory-drift-marker.sh). [evidence: `memory-drift-marker.sh:74-141`]
- [x] T015 [P] Add post-merge sharing the T013/T014 detection-and-write logic (.opencode/scripts/git-hooks/post-merge). [evidence: `.opencode/scripts/git-hooks/post-merge`]
- [x] T016 [P] Add post-rewrite sharing the T013/T014 detection-and-write logic, covering rebase/amend (.opencode/scripts/git-hooks/post-rewrite). [evidence: `.opencode/scripts/git-hooks/post-rewrite`]
- [x] T017 Update install-git-hooks.sh's header comment to list the new hooks; confirm the existing generic symlink-install loop picks them up with no code change (.opencode/scripts/install-git-hooks.sh). [evidence: `install-git-hooks.sh:7-10`]
- [x] T018 Add a new marker-consumption check to startup-checks.ts, following existing boot-check patterns (.opencode/skills/system-spec-kit/mcp_server/startup-checks.ts). [evidence: `startup-checks.ts:271`, `startup-checks.ts:360`]
- [x] T019 Wire the new check into context-server.ts's existing boot sequence (.opencode/skills/system-spec-kit/mcp_server/context-server.ts). [evidence: `context-server.ts:2233-2256`]
- [x] T020 Implement the scoped-scan path in incremental-index.ts: restrict stale candidate detection to the marker path list instead of a tree-wide stale walk (.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts). [evidence: `incremental-index.ts:358`]
- [x] T021 Wire post-move JSON regeneration (description.json/graph-metadata.json) for paths T020 confirms as genuine moves. [evidence: `context-server.ts:2249-2254`]
- [x] T022 [P] Shell-level smoke tests: no-op commit produces no marker, rename commit produces a correct marker, delete commit produces a correct marker (REQ-003). [evidence: `git commit`, `git mv`, `git rm` scratch smoke]
- [x] T023 [P] Concurrency test: two near-simultaneous marker writes to the same path never leave a corrupt or partially-written file (REQ-004). [evidence: `concurrent marker entries=2`]
- [x] T024 Integration test: synthetic marker naming one renamed spec folder, present at boot, results in scoped scan delegation and JSON refresh with no full tree-wide scan triggered (REQ-005). [evidence: `memory-drift-healing.vitest.ts`]

### Layer 3 -- Sweep-to-Completion Backstop (smallest, cheapest, ships last)

- [x] T025 Wrap the existing sweepOrphanIndexRows() call in a bounded loop that continues until the cursor signals completion, within one memory_index_scan invocation (REQ-006) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts). [evidence: `memory-index.ts:811-841`]
- [x] T026 Document and enforce the loop's iteration cap (NFR-P02). Evidence: bounded by `ORPHAN_SWEEP_MAX_PAGES`.
- [x] T027 Implement the suspect-queue confirm-and-tombstone/clear pass as part of the same full scan, using existing soft-delete semantics. [evidence: `memory-index.ts`]
- [x] T028 [P] Unit test: fixture index larger than 200 rows fully swept in one invocation (SC-003). Evidence: `orphan-sweep-corpus-repair.vitest.ts`.
- [x] T029 [P] Unit test: a suspect entry still missing at the next scan is tombstoned; a suspect entry whose file reappeared is cleared with no write. [evidence: `memory-drift-healing.vitest.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Code-review pass confirming zero new watcher/timer/daemon-process primitives were introduced (REQ-007). Evidence: implementation uses git hooks, startup consumption, and explicit scan only. [evidence: diff review]
- [x] T031 Run bash validate.sh --strict, capture the output (REQ requirements evidence). Evidence: re-run 2026-07-09 in this reconciliation pass, `validate.sh --strict` reports Errors: 0.
- [x] T032 [P] Confirm SC-001/SC-002/SC-003/SC-004 from spec.md each have concrete evidence, not just an unverified checkbox. Evidence recorded in checklist.md and implementation-summary.md, including the numeric latency benchmark, satisfied via sibling packet `020-query-time-filter-benchmark` (CHK-064). [evidence: checklist.md:132-168, Layer-Specific Verification Evidence]
- [x] T033 Update spec/plan/tasks/checklist/implementation-summary with final evidence. [evidence: `implementation-summary.md`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` -- T011 satisfied via sibling packet `020-query-time-filter-benchmark` (CHK-064)
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed -- targeted verification passed; lint/core-suite gates still not clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

- [x] T012 [P1] Scoped (drift-marker) scans run global destructive maintenance: `runGlobalOrphanSweep()` and `runSuspectConfirmation()` execute unconditionally on both handler branches (`mcp_server/handlers/memory-index.ts:1054,1542`), violating this packet's scoped-trigger contract (`spec.md:248`, `plan.md:198-200`). Add a dedicated scoped-repair mode that skips global sweep, suspect confirmation, and unrelated backfills; reserve those phases for explicit full scans. Evidence: test asserting global phases are not invoked on a scoped scan. DONE 2026-07-10 — scoped scans skip all global maintenance phases on both handler branches (memory-index.ts:1200-1233, 1704-1736; gate at :609); asserted via phase-callback list + not-called live stubs (memory-index-scoped-scan-gating.vitest.ts:298). Sonnet-max verified ACCEPT.
- [x] T013 [P1] Startup discards the scan response and consumes the drift marker even for coalesced/cooldown/contended scans that performed no repair (`mcp_server/context-server.ts:2241`). Return a typed internal repair result; preserve/restore the marker unless the scoped scan actually completed. DONE 2026-07-10 — typed repairStatus complete|partial|coalesced|contended|failed threaded scan->startup; marker consumed only on complete, restored via atomic rename otherwise (memory-index.ts:491, startup-checks.ts:376-417, context-server.ts:2247); it.each over all non-complete statuses in memory-index-startup-repair-status.vitest.ts. Sonnet-max verified ACCEPT.
- [x] T014 [P1] Failed tombstone deletions are dequeued anyway — `removeMemoryDriftSuspects(db, [...idsToClear, ...idsToTombstone])` ignores `deleteResult.failed` (`handlers/memory-index.ts:913`). Dequeue only cleared and successfully deleted IDs; partial-failure test must assert the failed ID remains queued. DONE 2026-07-10 — dequeue is now cleared IDs + per-row deletedIds only (memory-index.ts:1062); real-SQLite partial-failure tests keep exactly the failed id queued (suspect-confirmation.vitest.ts:259-338). Sonnet-max verified ACCEPT.
- [x] T015 [P1] Transient filesystem errors (permissions, I/O) collapse to `exists=false` and can tombstone valid rows (`mcp_server/lib/storage/incremental-index.ts:215`). Use a tri-state existence result; delete only on confirmed absence (ENOENT/ENOTDIR); report unknown-status rows. DONE 2026-07-10 — tri-state existence with universal definitive-stat fallback on any listing miss (ENOENT/ENOTDIR->absent, other errors->unknown; real-filesystem NFC/NFD regression test); unknown rows never enter orphanRecordIds, unknownCount surfaced (incremental-index.ts; incremental-index-existence.vitest.ts 11/11, tsc clean). First attempt REJECTED by Sonnet-max for a case-fold-gated absence path; fixed and re-verified ACCEPT.
- [x] T016 [P1] Cache hits bypass the query-time existence filter — a deleted file keeps serving from cache until expiry (`mcp_server/handlers/memory-search.ts:1455`). Apply the filter at the common response boundary or bypass result caching while the filter is enabled. DONE 2026-07-10 — cache reads AND writes both gated off while the existence filter is enabled (single cacheEnabled predicate, memory-search.ts:1643,2015); flag-off behavior byte-identical (25/25 pre-existing cache tests); stale-row-99 test proves no dead cache serves. Sonnet-max verified ACCEPT.
- [x] T017 [P1] A time-budget-expired sweep breaks with a non-null resumable cursor but the envelope still reports `status: 'complete'` (`handlers/memory-index.ts:838` vs `:1682,:1779`). Return an explicit partial/resumable status whenever the cursor is non-null. DONE 2026-07-10 — budget-expired sweep now reports status/repairStatus partial with orphanSweepResumable + explicit incomplete summary on BOTH response branches; genuinely-finished sweeps stay complete; scoped scans structurally unaffected (memory-index.ts:1246-1341,1872-1992); real-SQLite budget-exit-then-converge test. Sonnet-max verified ACCEPT incl. envelope field-by-field compatibility and marker-livelock analysis (unreachable from scoped marker scans).
- [x] T018 [P2] Suspect-queue append/remove is an unlocked JSON read-modify-write; concurrent writers lose updates (`mcp_server/lib/storage/memory-drift-healing.ts:111`). Wrap in `BEGIN IMMEDIATE` or store suspects as upsertable rows keyed by ID; add a two-connection concurrency test. DONE 2026-07-10 — suspect-queue mutations wrapped in immediate transactions (memory-drift-healing.ts:106-148); nesting with the deferred-write outer transaction proven safe via better-sqlite3 savepoint downgrade (verifier read the library source); two-connection race test stash-demonstrated RED pre-fix (lost update [1,2,3] vs [2,3]) and green post-fix 8/8. Sonnet-max verified ACCEPT.
