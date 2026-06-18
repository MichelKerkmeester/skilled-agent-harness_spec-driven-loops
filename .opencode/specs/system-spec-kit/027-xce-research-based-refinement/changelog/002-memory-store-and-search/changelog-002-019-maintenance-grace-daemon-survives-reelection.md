---
title: "Maintenance Grace: A Busy Daemon Survives Launcher Re-election Mid-Reindex"
description: "After 018 made the background scan cooperative, a full reindex still could not complete because a competing launcher needs a JSON-RPC liveness reply to adopt the daemon, and a daemon in a CPU block cannot reply, so its probe deems it wedged and reaps it mid-scan. The daemon now writes a refreshed maintenance-active marker that both launcher adopt paths honor, refusing to reap a busy daemon that names the live child."
trigger_phrases:
  - "002/019 maintenance grace daemon survives reelection changelog"
  - "daemon reaped mid-reindex by contending launcher fix"
  - "maintenance-active marker launcher adopt guard"
  - "027 002/019 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

After 018 made the background scan cooperative, a full reindex still could not run to completion. A competing launcher, for example the editor MCP reconnecting mid-scan, requires a JSON-RPC liveness reply to adopt the daemon, and a daemon busy inside a scan cannot reply during a CPU block. Its probe therefore deems the daemon wedged and reaps and respawns it, and the new daemon's boot marks the running scan failed. This packet teaches the launcher to recognize legitimate maintenance work. While a background scan runs, the daemon writes a maintenance-active marker at `<DATABASE_DIR>/.maintenance-active.json` holding `{childPid, activeUntilMs, jobId, refreshedAtIso}`, refreshed on a 20s timer and again at every scan phase boundary. The launcher consults this marker at both the stale-reclaim adopt path and the dead-socket respawn path, and it refuses to reap a busy daemon that holds a fresh marker naming the live child. The guard fails safe toward reaping: a missing or expired marker, a childPid mismatch, or a non-alive child all fall through to the normal reap, so a genuinely wedged daemon is never protected. The marker TTL is 180s, raised from an initial 60s after the first live run reaped the daemon when a roughly 79s blocking tail phase outlived the 60s TTL.

### Added

- `maintenanceMarkerPath`, `readMaintenanceMarker`, and the pure predicate `shouldAdoptDespiteProbe` in `bin/lib/model-server-supervision.cjs`, with injectable fs and now for unit testing
- An env-aware `maintenanceMarkerDir()` resolver in the launcher
- The daemon-side marker writer plus a `finally` cleanup in the scan IIFE, so the marker is always cleared when the scan ends

### Changed

- `bin/mk-spec-memory-launcher.cjs` - the adopt path and the dead-socket respawn path both consult the marker through the re-exported `shouldAdoptDespiteProbe`, declining to reap a busy daemon that names the live child
- `handlers/memory-index.ts` - the background scan writes the marker, refreshes it on a 20s timer and at each phase boundary, and clears it on completion, with the TTL set to 180s

### Fixed

- A busy daemon mid-reindex is no longer reaped by a contending launcher, so a full force reindex now runs to completion

### Verification

| Check | Result |
|-------|--------|
| Build | PASS: `npm run build` exit 0 |
| Syntax | PASS: `node --check` on both `.cjs` files |
| Unit test | PASS: `tests/launcher-maintenance-guard.vitest.ts`, 12 tests |
| Isolated harness | PASS: `stress_test/durability/daemon-reelection-adoption-live.vitest.ts`, 6 tests including adopt plus stale-marker negative control, run twice |
| Live reindex | PASS: a full force reindex completed in 330s with the daemon pid unchanged throughout |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts` | Added |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Modified |

### Follow-Ups

- The exact blocking tail phase on the live daemon is not yet pinned. The trigger-embedding-backfill's unbounded transaction is the static candidate, but its flag is off in this daemon, so it is not the confirmed cause. Making that phase cooperative through chunk-and-yield, so the daemon stays responsive through it rather than only unreaped, is the deeper follow-on. The unbounded trigger-backfill transaction should be chunked before that flag is ever enabled.
- The marker is scoped to the scan job, so it does not cover the post-scan background-embedding queue. The scan defers embeddings, so the vector writes happen after the scan completes, and a live run saw a separate re-election fire during that post-scan burst and recycle the daemon. Search stayed functional and the deferred-embedding gap drains on the next queue pass, but extending the marker to the background-embedding queue, or making that queue cooperative, is the follow-on that makes a reindex re-election-proof end to end.
