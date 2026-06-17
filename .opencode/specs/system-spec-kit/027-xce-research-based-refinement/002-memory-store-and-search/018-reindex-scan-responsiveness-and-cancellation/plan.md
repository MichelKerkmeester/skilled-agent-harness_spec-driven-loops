---
title: "Implementation Plan: reindex-scan responsiveness and cancellation [template:level_1/plan.md]"
description: "Make the background memory_index_scan yield the event loop in its all-rows tail loops and be genuinely cancellable, so a heavy reindex never wedges the daemon."
trigger_phrases:
  - "reindex scan responsiveness plan"
  - "memory_index_scan yield cancel plan"
  - "027 002/018 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "027/002/018-reindex-scan-responsiveness-and-cancellation"
    last_updated_at: "2026-06-17T14:05:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Planned tail-loop yields, processBatches early-abort, in-memory cancel flag"
    next_safe_action: "Address launcher lease-heartbeat re-election follow-on"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-027-002-018-reindex-responsiveness"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: reindex-scan responsiveness and cancellation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The background scan runs on the daemon's single event-loop thread. Its `await`s only drain microtasks (synchronous better-sqlite3 plus cache-served embeddings) and its two post-batch tail loops sweep every indexed row synchronously with no yield. On a force scan the loop is starved for the whole run, so IPC times out and cancel cannot land. The plan inserts real macrotask yields plus cancel checks at the loop-iteration boundaries, gives `processBatches` an early-abort, and mirrors the cancel flag in memory so it is deliverable without a DB round-trip. The in-tree precedent is `lib/embedders/reindex.ts`, which already yields after every batch and re-reads cancel status.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The job, batch-processor, and index-scan-jobs vitest suites pass (68 tests).
- `npm run build` exits 0.
- No yield is introduced inside an open better-sqlite3 transaction.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three cooperating pieces. `job-store.ts` keeps an in-process `Set` of cancelled job ids, populated by `requestCancel` and read by `isCancelRequestedFast`, cleared on terminal transitions. `batch-processor.ts` gains a `shouldAbort` hook checked at the top of the batch loop. `memory-index.ts` wires `shouldAbort` into the scan's `processBatches` call, adds a yield plus cancel check every ~200 rows in the metadata-edge loop and every ~50 folders in the causal-chain loop, and routes the background runner's `isCancelled` hook through the fast checker.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `handlers/memory-index.ts`: scan tail loops, the `processBatches` call site, the background dispatch hook.
- `utils/batch-processor.ts`: `processBatches` loop and `RetryOptions`.
- `lib/ops/job-store.ts`: cancel request, fast check, terminal cleanup.
- `tests/handler-memory-index-scan-jobs.vitest.ts`: mock parity for the new export.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Add `shouldAbort` to `RetryOptions` and check it at the top of the `processBatches` loop.
2. Add the in-process cancel `Set`, `isCancelRequestedFast`, and terminal cleanup to `job-store.ts`.
3. Wire `shouldAbort` and the two tail-loop yields plus cancel checks in `memory-index.ts`; route the background `isCancelled` hook through the fast checker; drop the now-unused import.
4. Update the test mock; build; run the touched-surface suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the batch-processor, job-store, job-queue, job-queue-state-edge, and handler-memory-index-scan-jobs suites. The index-scan-jobs suite exercises the background dispatch and the cancel path, so the new `isCancelRequestedFast` must be present in its job-store mock.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new packages. Uses the existing maintenance-job store, the background-scan dispatch, and `setImmediate` for macrotask yields.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is additive and behind no flag. To revert, restore the three source files and the test mock and rebuild. The prior behavior (single-task scan, DB-only cancel check) returns with no data migration.
<!-- /ANCHOR:rollback -->
