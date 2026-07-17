---
title: "014/004 Durability Stress Domain"
description: "A new durability stress domain and stress:durability script were added for checkpoint v2 contention, enrichment marker backfill, index-scan coalescing and front-proxy recycle transparency."
trigger_phrases:
  - "durability stress domain"
  - "stress durability checkpoint enrichment recycle"
  - "014 004 stress test changelog"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh`

### Summary

Added a new `mcp_server/stress_test/durability/` domain with four load, soak and concurrency cases over the 013 durability surfaces. The phase also added a `stress:durability` npm script that uses the existing stress vitest config. No production runtime code changed.

The domain covers checkpoint v2 contention, schema v30 enrichment marker backfill, `index_scan` lease coalescing and front-proxy recycle transparency. Each case uses a throwaway temp database, an in-memory database or pure-logic helpers so the production memory store and live daemon socket are not touched.

### Added

- New durability stress test directory with a README, scope table, run recipe and isolation boundary.
- Checkpoint v2 contention stress case for interleaved create and restore round trips.
- Enrichment marker backfill stress case for bounded repair of pending markers.
- `index_scan` coalescing stress case for concurrent lease acquisition, cooldown and stale-lease reclaim.
- Front-proxy recycle transparency stress case for replayable reads, refused unsafe mutations and terminal protocol mismatch.
- `stress:durability` npm script.

### Changed

- Reused the existing `vitest.stress.config.ts` instead of adding a new stress config.
- Asserted deterministic durability invariants rather than throughput.
- Kept all stress inputs bounded: 40 checkpoint round trips, 300 pending marker rows, a 64-wide lease burst and 200 in-flight proxy requests.

### Fixed

- Closed the missing stress coverage for durability surfaces shipped in the 013 roadmap.
- Added evidence that durability tests can run beside an existing pure-logic stress domain without shared config breakage.

### Verification

| Check | Result |
|-------|--------|
| Packet docs | PASS - spec, plan, tasks, checklist, decision record and implementation summary authored |
| `npm run stress:durability` | PASS - 12 tests passed across 4 files in about 2.9 seconds |
| Mixed-domain stress run | PASS - 31 tests passed across 7 files through the shared stress config |
| Checkpoint contention | PASS - lossless round trips, no orphan temp dirs, bounded on-disk snapshots and observable restore barrier |
| Enrichment backfill | PASS - 300 pending markers drained to complete, with bounded per-pass work |
| Index scan coalescing | PASS - exactly one writer admitted and structured back-off for the rest |
| Front-proxy recycle | PASS - reads replayed, unsafe mutations returned `-32001`, pending requests drained and `-32002` remained terminal |
| Isolation | PASS - no case touches `~/.mk-spec-memory` or the live daemon socket |
| Typecheck | PASS - isolated `tsc --noEmit` over the four stress files reported 0 errors |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Added the `stress:durability` npm script |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md` | Added | Documented domain scope, run recipe and isolation boundary |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts` | Added | Tested checkpoint v2 create and restore contention invariants |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts` | Added | Tested bounded enrichment marker repair under load |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts` | Added | Tested index scan lease coalescing, cooldown and stale-lease reclaim |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts` | Added | Tested pure-logic front-proxy recycle replay and refusal behavior |

### Follow-Ups

- Deep review later flagged stress-test fidelity work: the recycle case models replay behavior through helpers, the checkpoint assertion can be stricter and enrichment deferred-row coverage needs clearer wording.
- Optional larger soak counts and CI wiring remain deferred to a future orchestrator decision.
- This domain does not measure throughput. A performance signal would need a separate benchmark domain.
