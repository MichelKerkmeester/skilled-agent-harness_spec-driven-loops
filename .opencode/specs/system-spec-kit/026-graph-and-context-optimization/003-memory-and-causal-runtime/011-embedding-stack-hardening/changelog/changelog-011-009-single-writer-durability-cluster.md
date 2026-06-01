# Changelog , , ,  009: Single-writer / durability cluster

**Shipped**: 2026-05-30
**Commit**: 4b2c5de6a3

## What Changed
- Modified `.opencode/bin/lib/model-server-supervision.cjs` to bound respawn-lock staleness by listener liveness (DR-005), re-arm lazy demand listener on failed spawn (DR-006), and route idle eviction through reapBeforeRespawn root authority (DR-012)
- Modified `mcp_server/lib/search/vector-index-store.ts` to delete clean-shutdown marker only after confirmed-successful close (DR-011)
- Modified `mcp_server/lib/embedders/reindex.ts` to write staging shard and atomic-swap on success for same-dimension reindex, and worker re-reads cancel flag mid-run (DR-020 + DR-001-P1-002)
- Modified `.opencode/bin/hf-model-server.cjs` to apply ownership/live-resident perimeter guard to direct-startup unlink path, and tcp targets enforce loopback/auth (DR-001-P2-001 + DR-002-P1-001)
- Modified `scripts/core/daemon-detect.ts` to treat stale-looking launcher lease with live recorded childPid as not reclaimable (DR-016)
- OR-R-01 re-validated as already O_EXCL-remediated at HEAD , , ,  no change
- Added 4 new deterministic suites (26 tests) + 3 regression suites (29 tests) + leases suite (9 tests)

## Why
The deep review found a cluster of single-writer / durability defects across the embedding-stack launcher + supervision + WAL surfaces. These share resources (respawn lock, root-liveness authority, leases, shutdown marker) and must land as one coordinated change set to avoid re-collision. This is the highest-blast-radius surface in the repo (the program exists because of a DB-corruption incident here).

## Verification
- Builds (mcp + shared + scripts): PASS , , ,  exit 0
- node --check (2 .cjs): PASS
- New deterministic suites: PASS , , ,  4 suites, 26 tests
- Regression suites (execution-router / reindex / auto-selection): PASS , , ,  29 tests
- Leases suite (daemon-detect): PASS , , ,  9 tests
- validate.sh --strict (this packet): PASS
