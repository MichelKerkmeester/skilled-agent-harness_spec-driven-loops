---
title: "Implementation Plan: maintenance-grace daemon survives re-election"
description: "Have the daemon advertise a live background scan via a refreshed maintenance-active marker, and teach both launcher reap paths to adopt a busy-but-healthy daemon instead of reaping it, so a heavy reindex survives launcher contention."
trigger_phrases:
  - "maintenance grace daemon survives re-election plan"
  - "maintenance-active marker adopt guard plan"
  - "027 002/019 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/018-maintenance-grace-daemon-survives-reelection"
    last_updated_at: "2026-06-17T16:05:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Planned marker writer, pure adopt predicate, and both launcher guard sites"
    next_safe_action: "Confirm a full reindex completes end-to-end on the live daemon at deploy time"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-027-002-019-maintenance-grace"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: maintenance-grace daemon survives re-election

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

After 018 made the scan cooperative, a full reindex still could not finish: when a second launcher appears mid-scan it tries to adopt the live daemon, its JSON-RPC liveness probe times out during a CPU block, and the daemon is reaped+respawned, which marks the running scan failed. The plan gives the daemon a maintenance-active marker it refreshes on a fixed cadence during a background scan, and teaches both launcher reap paths to read that marker and adopt a busy-but-healthy daemon instead of reaping it. The 018 cooperative yields are the discriminator: a healthy scan keeps refreshing the marker, while a genuinely wedged daemon cannot, so its marker expires and the normal reap resumes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The daemon `npm run build` exits 0.
- `node --check` passes on both touched `.cjs` files.
- The new unit test plus the isolated harness adopt and stale-marker negative-control cases pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three cooperating pieces. A shared reference-counted writer module `lib/storage/maintenance-marker.ts` (`beginMaintenance(label) -> { refresh(), end() }`) writes `<DATABASE_DIR>/.maintenance-active.json` (`{ childPid, activeUntilMs, labels, refreshedAtIso }`, 180s TTL) and self-refreshes every 20s; the background scan in `handlers/memory-index.ts` calls `beginMaintenance('index_scan')` and `end()`s it on every terminal exit. (`labels` is a `string[]` so the same module can later hold the marker for the post-scan embedding queue; the launcher reads only `childPid`/`activeUntilMs`.) The pure predicate in `model-server-supervision.cjs` (`maintenanceMarkerPath` / `readMaintenanceMarker` / `shouldAdoptDespiteProbe`, with injectable fs/now) reads the marker and decides adopt-vs-reap. The launcher in `mk-spec-memory-launcher.cjs` resolves the marker dir with the same DB-dir precedence, re-exports the predicate, and calls it at both reap sites — the stale-reclaim adopt path and the dead-socket respawn path — so a fresh marker naming the live child adopts or refuses respawn instead of reaping.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `lib/storage/maintenance-marker.ts`: the shared reference-counted writer module (`beginMaintenance` / `refresh` / `end`, 180s TTL, 20s self-refresh) consumed by the scan and (in 020) the embedding queue.
- `handlers/memory-index.ts`: the background scan calls `beginMaintenance('index_scan')` on the shared module plus the `finally` `end()`.
- `lib/providers/retry-manager.ts`: `runBackgroundJob` calls `beginMaintenance('embedding-queue')`, ending in its existing `finally` (the post-scan embedding-queue holder).
- `.opencode/bin/lib/model-server-supervision.cjs`: the pure `maintenanceMarkerPath` / `readMaintenanceMarker` / `shouldAdoptDespiteProbe` plus their exports.
- `.opencode/bin/mk-spec-memory-launcher.cjs`: env-aware `maintenanceMarkerDir()`, the two guard sites, and the re-exports.
- `tests/launcher-maintenance-guard.vitest.ts` and `stress_test/durability/daemon-reelection-adoption-live.vitest.ts`: predicate coverage and isolated-harness adopt plus negative-control cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Add the shared reference-counted writer module `lib/storage/maintenance-marker.ts` (`beginMaintenance(label) -> { refresh(), end() }`, 180s TTL, 20s self-refresh), and have the background scan in `memory-index.ts` call `beginMaintenance('index_scan')` on start, refresh at phase boundaries, and `end()` it in a `finally` on every terminal exit.
2. Add the pure `maintenanceMarkerPath` / `readMaintenanceMarker` / `shouldAdoptDespiteProbe` predicate (injectable fs/now) and its exports to `model-server-supervision.cjs`.
3. Wire the launcher: env-aware `maintenanceMarkerDir()` with the same DB-dir precedence, re-exports, and the guard call at both the stale-reclaim adopt path and the dead-socket respawn path.
4. Add the unit test; extend the isolated harness with adopt and stale-marker negative-control cases; build and `node --check`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The unit test (`launcher-maintenance-guard.vitest.ts`) exercises the pure predicate through the launcher require, covering the adopt case (fresh marker, live child) and the fail-safe cases (missing/expired marker, childPid mismatch, non-`alive` child). The isolated harness (`daemon-reelection-adoption-live.vitest.ts`) extends the real-copy launcher+dist fake-root setup with an adopt case and a stale-marker negative control so a stale marker provably never pins a dead daemon.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new packages. Builds on the 018 cooperative tail-loop yields, the existing launcher adopt (stale-reclaim) and dead-socket respawn paths, and the existing `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` resolution. Uses Node's `fs` and a timer for the 20s refresh.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is additive: the marker is advisory and the predicate fails safe toward the prior reap behavior. To revert, restore the three source files and the two test files and rebuild. With the marker absent, both launcher paths fall back to the original probe-then-reap behavior with no data migration.
<!-- /ANCHOR:rollback -->
