---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "The maintenance-marker writer is now a shared, reference-counted module so both the reindex scan and the post-scan background-embedding queue hold it through their overlap. 019 protected only the scan; because the scan defers embeddings, the real vector writes ran unprotected in the embedding queue and a separate re-election could interrupt them. The scan IIFE was refactored onto the shared module and the embedding queue now begins maintenance only after its empty-queue guard. Confirmed live: a full force reindex plus its post-scan embedding burst ran with the daemon surviving (deploy verification)."
trigger_phrases:
  - "maintenance grace background embedding summary"
  - "reference-counted marker embedding queue shipped"
  - "027 002/020 shipped"
  - "post-scan embedding burst re-election fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "027/002/020-maintenance-grace-background-embedding"
    last_updated_at: "2026-06-17T16:05:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped the shared reference-counted marker plus the scan and embedding-queue wiring"
    next_safe_action: "Confirm a full reindex plus its post-scan embedding burst survives at deploy time"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-020-maintenance-grace-embedding"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should the maintenance marker protect the post-scan background-embedding queue, not just the scan?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-maintenance-grace-background-embedding |
| **Completed** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The maintenance marker now covers the post-scan background-embedding queue, not just the scan. 019 made a reindex's scan survive launcher re-election with a marker scoped to the scan job, but because the scan defers embeddings (`asyncEmbedding`) the real vector writes happen in the POST-scan background-embedding queue (`lib/providers/retry-manager.ts` draining `embedding_status='pending'` rows), which stayed busy-but-unprotected. A live run saw a separate re-election recycle the daemon DURING the post-scan embedding burst. Three changes close that gap:

- **A shared, reference-counted marker module** in `lib/storage/maintenance-marker.ts`. It exposes `beginMaintenance(label) -> { refresh(), end() }`: writes `<DATABASE_DIR>/.maintenance-active.json` (180s TTL) and self-refreshes every 20s, keeps the file present while >=1 holder is active, removes it at 0, and is idempotent on `end()`. Reference counting lets the scan and the embedding queue both hold the marker through their overlap (the scan defers embeddings the queue later drains) without one clobbering the other's marker.
- **The scan IIFE refactored onto the shared module** in `handlers/memory-index.ts`. The inline marker writer from 019 is replaced by a `beginMaintenance` holder ended in its existing terminal path, so the scan keeps exactly the protection it had while now sharing one writer with the embedding queue.
- **The background-embedding queue wired in** in `lib/providers/retry-manager.ts`. `runBackgroundJob` calls `beginMaintenance('embedding-queue')` ONLY after its empty-queue guard — so an idle tick never marks — and `end()`s in its existing `finally`. The daemon now holds the marker through the post-scan embedding burst and is adopted rather than reaped.

The launcher-side adopt guard from 019 is unchanged: this phase only widens WHO writes the marker. The reference count is the discriminator that lets the scan and the embedding queue overlap under one marker.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Confirmed the gap 019 flagged: the scan defers embeddings, so the live re-election interruption was hitting the post-scan embedding queue, not the scan. Extracted the marker writer into the shared, reference-counted `maintenance-marker.ts`, refactored the scan IIFE onto it (replacing 019's inline writer), and wired `runBackgroundJob` into `beginMaintenance('embedding-queue')` after its empty-queue guard with `end()` in the existing `finally`. A sibling agent wrote the marker unit test. Built the daemon and ran the marker, scan-job, and launcher-guard suites.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Shared reference-counted module so scan and embedding queue overlap.** Both the scan (which defers embeddings) and the embedding queue (which drains them) can hold the marker through their overlap; reference counting means neither one's `end()` removes the file while the other still holds it, so the daemon stays protected across the whole reindex.
- **Begin only when a tick has work; end in the existing finally.** In the embedding job, `beginMaintenance('embedding-queue')` is called after the empty-queue guard, so an idle tick never writes or leaves a lingering marker, and the holder is ended in the job's existing `finally` so it is always released.
- **The 019 launcher guard is unchanged.** This phase only widens who writes the marker. The marker file, schema, TTL, and dir resolution are reused exactly, so the launcher reads it as before and the change stays additive.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build | PASS: daemon `npm run build` exit 0 |
| Marker unit test | PASS (see test file): `tests/maintenance-marker.vitest.ts` |
| Existing scan-job + launcher-guard suites | PASS: the scan-job and launcher-guard suites still pass after the refactor |
| Pre-existing flake (not introduced) | NOTED: a cross-file test-isolation flake in `retry-manager.vitest.ts` T49 is present without these changes |
| Full live reindex + post-scan embedding burst | PASS (deploy verification): a full force reindex plus its post-scan embedding burst ran with the daemon surviving |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The marker makes the daemon un-reaped while busy, it does not make it responsive. A future refinement is to make the heaviest synchronous phases cooperative (chunk-and-yield, as in 018) so the daemon stays responsive through the embedding burst rather than only un-reaped.
- The default retry batch and interval here are tuned (`SPECKIT_RETRY_BATCH_SIZE=100`, `SPECKIT_RETRY_INTERVAL_MS=5000`). With the stock 300s interval the per-tick marker still applies, since each busy tick re-marks via `beginMaintenance` after the empty-queue guard; the protection does not depend on the tuned interval.
<!-- /ANCHOR:limitations -->
