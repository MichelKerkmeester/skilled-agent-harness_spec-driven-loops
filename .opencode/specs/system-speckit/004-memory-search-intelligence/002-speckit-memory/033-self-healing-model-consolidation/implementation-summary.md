---
title: "Implementation Summary"
description: "Status COMPLETE. All discoverers enqueue bounded drift suspects; confirmation is next-cycle and remains the sole tombstone path."
trigger_phrases:
  - "self-healing model consolidation"
  - "suspect queue sole confirmation funnel"
  - "runSuspectConfirmation one confirmer"
  - "orphan sweep discoverer not deleter"
  - "drift suspect queue size cap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation"
    last_updated_at: "2026-07-10T09:45:40.000Z"
    last_updated_by: "opencode"
    recent_action: "Implemented and verified all five decisions"
    next_safe_action: "No further implementation work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 023-self-healing-model-consolidation |
| **Status** | COMPLETE |
| **Completed** | 2026-07-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Consolidated Discovery

`runGlobalOrphanSweep` enqueues orphan ids at `memory-index.ts:819-827` and reports `enqueued` plus queue
size through `OrphanSweepDeleteResult` at `:265-271`. The scoped empty-files branch resolves candidate paths
through `listIndexedRecordIdsForDeletedPaths()` and enqueues them at `:1074-1081`. Neither path directly
deletes a heuristic candidate.

### Bounded Confirmation Queue

`MEMORY_DRIFT_SUSPECT_QUEUE_MAX_SIZE` is 1,000 at `memory-drift-healing.ts:10`. Existing queued ids remain
when full; new excess ids are deferred and warned at `:131-151`. The resulting `suspectQueueSize` is included
in both scan envelopes at `memory-index.ts:1160-1167,1571-1577`.

### Timing And Timeout Decisions

Confirmation runs before orphan discovery at `memory-index.ts:1064-1065,1565-1576`, so newly discovered rows
can only be tombstoned by a later invocation. `memory-search.ts:224,421-437` keeps its existing 25ms override
only for the search hot path; new scan callers use the connection default. The scoped lock test proves a wait
of at least 280ms at `suspect-confirmation.vitest.ts:252-289`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| memory-index.ts | Modified | Queue-only orphan and scoped discovery, next-cycle ordering, envelope metric |
| memory-drift-healing.ts | Modified | 1,000-entry bounded queue and append statistics |
| memory-drift-healing.vitest.ts | Modified | At-cap and one-over-cap coverage |
| orphan-sweep-time-budget-and-refresh.vitest.ts | Modified | Enqueue-then-next-scan confirmation coverage |
| suspect-confirmation.vitest.ts | Modified | Orphan/scoped discovery fixtures and lock contention coverage |
| spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md | Modified | Completion state and evidence |

`memory-search.ts` is intentionally unmodified; the 25ms override remains scoped to its original caller.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in one coherent change. The full required Vitest command passed 26/26 tests across five files,
with 0 skipped. `npm run typecheck` and scoped ESLint passed. Repository-wide `npm run lint` still reports 12
unrelated existing errors outside this packet; none were modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the suspect queue the sole confirmation funnel for all three self-healing layers, not just Layer 1 | Implemented at `memory-index.ts:819-827,1074-1081`; the two discoverers no longer delete on first detection |
| Keep the out-of-scope full-corpus `filesToDelete` stale-delete path as a direct delete | It is a ground-truth corpus diff from an explicit file walk, not a heuristic candidate, so it does not need the same transient-absence protection the other two paths do |
| Use next-cycle confirmation | `memory-index.ts:1064-1065,1565-1576` prevents a new orphan from being immediately confirmed; vitest proves the two-scan behavior |
| Cap the queue at 1,000 and surface its size | `memory-drift-healing.ts:10,131-151` bounds JSON and SQL input size while `memory-index.ts:1164,1576` exposes the count |
| Keep the 25ms timeout caller-local | `memory-search.ts:224,421-437` remains the sole fast-fail path; new callers retain normal SQLite waiting |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Mechanical delete inventory | `rg -n "deleteIndexedRecordIds\("` output: `785` helper call and `923` confirmation call only |
| Required regression suite | `npx vitest run ...`: 26/26 tests, 5/5 files, 0 skipped |
| Type safety | `npm run typecheck` exited 0 |
| Scoped lint and comment hygiene | `npx eslint ...` and `python3 check-comment-hygiene.sh`: 5/5 changed files clean |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deferred candidates await a later sweep cycle.** At capacity, new candidates are deferred rather than
   evicting confirmation work; the next cursor cycle can rediscover them (`memory-drift-healing.ts:131-151`).
2. **Repository-wide lint remains noisy.** `npm run lint` reports 12 existing errors in unrelated files;
   targeted lint for this packet's five TypeScript files passes.
<!-- /ANCHOR:limitations -->
