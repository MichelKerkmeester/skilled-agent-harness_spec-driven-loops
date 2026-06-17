---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "The daemon now writes a refreshed maintenance-active marker during a background scan, and both launcher reap paths adopt a busy-but-healthy daemon instead of reaping it, so a heavy reindex survives launcher contention. The 018 cooperative yields plus a phase-boundary refresh keep a healthy scan's marker fresh; a wedged daemon's marker expires within its TTL and is reaped as before. Confirmed live: a full reindex completed in 330s without the daemon being reaped."
trigger_phrases:
  - "maintenance grace daemon survives re-election summary"
  - "maintenance-active marker launcher adopt shipped"
  - "027 002/019 shipped"
  - "daemon reaped mid-scan re-election fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "027/002/019-maintenance-grace-daemon-survives-reelection"
    last_updated_at: "2026-06-17T16:05:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped marker writer, pure adopt predicate, and both launcher guard sites"
    next_safe_action: "Confirm a full reindex completes end-to-end on the live daemon at deploy time"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-019-maintenance-grace"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should the launcher tolerate a busy maintenance scan instead of recycling the daemon?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-maintenance-grace-daemon-survives-reelection |
| **Completed** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A maintenance-grace marker that lets the launcher tell a busy maintenance scan apart from a wedged daemon. Three changes:

- **A daemon marker writer** in `handlers/memory-index.ts`. When a background scan runs, the scan IIFE writes `<DATABASE_DIR>/.maintenance-active.json` (`{ childPid, activeUntilMs, jobId, refreshedAtIso }`, 180s TTL) and refreshes it both on a 20s interval timer and at every scan phase boundary. A `finally` clears the refresh timer and removes the marker on every terminal exit, so the marker exists only while a scan is genuinely running. The TTL must exceed the longest single synchronous scan phase: a phase that does not yield cannot fire the interval timer, so it only gets the phase-boundary refresh at its start, and the marker must outlast that phase. The first live run exposed this — a 60s TTL lapsed during a ~79s blocking tail phase and the daemon was reaped — which is why the TTL is 180s and the phase-boundary refresh was added.
- **A pure supervision predicate** in `bin/lib/model-server-supervision.cjs`. `maintenanceMarkerPath`, `readMaintenanceMarker`, and `shouldAdoptDespiteProbe` (with injectable fs/now) read the marker and decide adopt-vs-reap, and are exported for both the launcher and the unit test.
- **Adopt guards at both launcher reap sites** in `bin/mk-spec-memory-launcher.cjs`. An env-aware `maintenanceMarkerDir()` resolves the marker dir with the same DB-dir precedence as the daemon, and the guard is called at both the stale-reclaim adopt path and the dead-socket respawn path. A daemon with a fresh marker naming the live child is treated as alive-busy and adopted (or respawn is refused) instead of being reaped.

The 018 cooperative yields plus the phase-boundary refresh are the discriminator: a healthy scan keeps its marker fresh, so the daemon is protected; a genuinely wedged daemon stops emitting phases and stops firing the timer, so its marker expires within the TTL and it is reaped exactly as before.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Traced the re-election to `mk-spec-memory-launcher.cjs` (~line 1680) and `lib/launcher-ipc-bridge.cjs`: a second launcher's adopt path requires a JSON-RPC liveness reply the busy daemon cannot give during a CPU block, so the probe deems it wedged and reaps it. Added the daemon marker writer, the pure predicate, and the two launcher guard sites, keeping the marker-dir resolution identical on both sides. Built the daemon, ran `node --check` on both `.cjs` files, and the unit plus isolated-harness tests (written and run by sibling agents) cover the adopt and stale-marker negative-control cases.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Pure predicate, injectable fs/now, unit-tested via the launcher require.** The decision logic lives in `model-server-supervision.cjs` and is re-exported through the launcher, the established codebase convention, so it is unit-testable without spawning a daemon.
- **Guard at both reap paths.** The marker is checked at the stale-reclaim adopt path and the dead-socket respawn path, because a busy daemon can be reaped from either, and protecting only one would still let the other recycle it.
- **Fail-safe toward reaping.** A missing or expired marker, a childPid mismatch, or a non-`alive` child all fall through to the normal reap, so a stale marker can never pin a dead or wedged daemon.
- **Identical marker-dir precedence on both sides.** The writer and the launcher resolve the marker dir with the same `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` precedence, so the isolated fake-root harness resolves the same path and the guard is testable in isolation.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build | PASS: daemon `npm run build` exit 0 |
| Syntax | PASS: `node --check` OK on both touched `.cjs` files |
| Unit test | PASS (see test files): `tests/launcher-maintenance-guard.vitest.ts` |
| Isolated harness | PASS (see test files): `stress_test/durability/daemon-reelection-adoption-live.vitest.ts` adopt and stale-marker negative-control cases |
| Full live reindex completion | PASS: a full force reindex completed in 330s on the live daemon (pid unchanged throughout — survived contention; the launcher log shows the marker driving repeated adopt/refuse-respawn decisions) after the TTL was raised to 180s |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The marker protects a recently-wedged daemon for up to its TTL (<=180s) before expiry-driven reaping resumes. This is an accepted bounded window: a daemon that wedges between refreshes keeps a fresh marker until it expires, after which the normal reap fires.
- The guarantee is that the busy daemon is not reaped, not that the contending launcher gets a live transport. A launcher that finds a marker-protected daemon reports lease-held and exits cleanly rather than bridging into a non-responsive socket, so a client reconnecting mid-scan (for example the editor MCP) is refused until the scan finishes and the daemon answers again. The running scan completes either way, which is the point.
- The 180s TTL is a margin over the longest blocking tail phase observed (~79s), not a guarantee. The exact phase that blocks was not pinned down on the live daemon: the strongest static candidate is `runTriggerEmbeddingBackfill`'s unbounded `syncPhraseRows` transaction (`lib/search/trigger-embedding-backfill.ts`), but that path is gated by `SPECKIT_TRIGGER_EMBEDDING_BACKFILL`, which is off in this daemon, so the live blocker is elsewhere. Identifying it and making it cooperative (chunk-and-yield between transactions, as in 018) so the daemon stays responsive through it — rather than only unreaped — is the open follow-on. The unbounded trigger-backfill transaction should also be chunked before that flag is ever enabled.
<!-- /ANCHOR:limitations -->
