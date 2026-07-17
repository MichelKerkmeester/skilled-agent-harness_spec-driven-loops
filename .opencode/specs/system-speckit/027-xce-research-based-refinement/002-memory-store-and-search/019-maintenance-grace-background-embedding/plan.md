---
title: "Implementation Plan: maintenance-grace covers background embedding"
description: "Extract the maintenance-marker writer into a shared, reference-counted module, refactor the scan IIFE onto it, and wire the post-scan background-embedding queue into it after the empty-queue guard, so a reindex's scan and its deferred-embedding burst both hold the marker through their overlap and the daemon is adopted rather than reaped end to end."
trigger_phrases:
  - "maintenance grace background embedding plan"
  - "reference-counted marker embedding queue plan"
  - "027 002/020 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-background-embedding"
    last_updated_at: "2026-06-17T16:05:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Planned the shared reference-counted marker plus the scan and embedding-queue wiring"
    next_safe_action: "Confirm a full reindex plus its post-scan embedding burst survives at deploy time"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-027-002-020-maintenance-grace-embedding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: maintenance-grace covers background embedding

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

019 made a reindex's scan survive launcher re-election, but its marker was scoped to the scan job. Because the scan defers embeddings (`asyncEmbedding`), the real vector writes run in the POST-scan background-embedding queue, which stayed busy-but-unprotected: a separate re-election recycled the daemon during the post-scan embedding burst. The plan extracts the marker writer into a shared, reference-counted module, refactors the scan IIFE onto it, and wires the embedding queue into it after the empty-queue guard. Reference counting lets the scan and the embedding queue both hold the marker through their overlap, so the daemon is adopted rather than reaped through the whole reindex, not just the scan. The 019 launcher-side guard is unchanged; this plan only widens who writes the marker.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The daemon `npm run build` exits 0.
- The new marker unit test plus the existing scan-job and launcher-guard suites pass.
- An idle embedding tick never writes the marker (`beginMaintenance` runs only after the empty-queue guard).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three cooperating pieces. The shared module in `lib/storage/maintenance-marker.ts` exposes `beginMaintenance(label) -> { refresh(), end() }`: it writes `<DATABASE_DIR>/.maintenance-active.json` (180s TTL) and self-refreshes every 20s, keeps the file present while >=1 holder is active, removes it at 0, and is idempotent on `end()`. The scan IIFE in `handlers/memory-index.ts` is refactored to call this module instead of its inline writer. The background-embedding queue in `lib/providers/retry-manager.ts` calls `beginMaintenance('embedding-queue')` in `runBackgroundJob` ONLY after its empty-queue guard (so an idle tick never marks) and `end()`s in its existing `finally`. Because the scan defers embeddings the queue later drains, the scan and the queue overlap; reference counting lets both hold the marker through that overlap without one clobbering the other's marker. The launcher-side adopt guard from 019 reads the same marker file unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `lib/storage/maintenance-marker.ts`: the new shared, reference-counted writer (`beginMaintenance` / `refresh` / `end`, 180s TTL, 20s self-refresh, present while >=1 holder, removed at 0, idempotent end).
- `handlers/memory-index.ts`: the scan IIFE refactored onto the shared module, replacing its inline writer.
- `lib/providers/retry-manager.ts`: `runBackgroundJob` wired into `beginMaintenance('embedding-queue')` after the empty-queue guard, ending in the existing `finally`.
- `tests/maintenance-marker.vitest.ts`: unit coverage for the reference-counted lifecycle (present while held, removed at 0, idempotent end).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Add the shared `lib/storage/maintenance-marker.ts`: `beginMaintenance(label)` returns `{ refresh(), end() }`, writes `.maintenance-active.json` with a 180s TTL and a 20s self-refresh, reference-counts holders so the file is present while >=1 is active and removed at 0, and makes `end()` idempotent.
2. Refactor the scan IIFE in `memory-index.ts` to call `beginMaintenance` and `end()` in its existing terminal path, removing the inline marker writer.
3. Wire `runBackgroundJob` in `retry-manager.ts`: call `beginMaintenance('embedding-queue')` only after the empty-queue guard and `end()` in the existing `finally`.
4. Add the marker unit test; build the daemon and run the marker, scan-job, and launcher-guard suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The unit test (`maintenance-marker.vitest.ts`) exercises the reference-counted lifecycle directly: the file is present while >=1 holder is active, two overlapping holders keep it present until both `end()`, it is removed at zero holders, and `end()` is idempotent. The existing scan-job and launcher-guard suites confirm the scan refactor and the unchanged launcher read still pass. A pre-existing cross-file test-isolation flake in `retry-manager.vitest.ts` T49 (present without these changes) is noted, not introduced. Full live reindex-plus-embedding survival is the deploy-time confirmation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new packages. Builds on the 019 launcher adopt guard and the same marker file, reusing its launcher-read fields (`childPid`, `activeUntilMs`), TTL, and dir resolution unchanged (the `labels[]` auxiliary payload was already introduced in 019's writer), plus the existing background scan IIFE in `handlers/memory-index.ts`, and the existing `runBackgroundJob` empty-queue guard and `finally` in `lib/providers/retry-manager.ts`. Uses Node's `fs` and a timer for the 20s self-refresh. The default retry batch and interval here are tuned (`SPECKIT_RETRY_BATCH_SIZE=100`, `SPECKIT_RETRY_INTERVAL_MS=5000`); with the stock 300s interval each busy tick still re-marks via the per-tick `beginMaintenance`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is additive and the marker is advisory. To revert, restore the three source files (delete the new `maintenance-marker.ts`, restore the inline writer in `memory-index.ts`, and remove the `beginMaintenance` call in `retry-manager.ts`) plus the new test, and rebuild. With the shared module absent, the scan falls back to 019's inline marker behavior and the embedding queue is unprotected as before, with no data migration.
<!-- /ANCHOR:rollback -->
