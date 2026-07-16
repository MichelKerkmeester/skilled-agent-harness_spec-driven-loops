---
title: "Single-writer durability cluster (coordinated remediation)"
description: "Coordinated fix for a cluster of single-writer and durability defects across the embedding-stack launcher, supervision, and WAL surfaces. All five families landed as one change set with deterministic regression tests."
trigger_phrases:
  - "single writer durability cluster"
  - "respawn lock idle eviction reap root"
  - "embedding stack concurrency fix"
  - "shutdown marker atomic swap reindex"
  - "launcher lease child pid supervision"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/009-single-writer-durability-cluster` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening`

### Summary

A deep review identified a cluster of single-writer and durability defects across the embedding-stack launcher, supervision, and WAL surfaces. These defects shared resources, including the respawn lock, root-liveness authority, leases, and the shutdown marker. They were landed as one coordinated change set rather than piecemeal to prevent re-collision. Each finding was re-validated at HEAD before editing and is now covered by a deterministic regression test.

### Added

- Deterministic concurrency test harness (Harness A and Harness B) with injected time, liveness, spawn function, and signal to force races without real sleeps
- Staging-shard atomic-swap mechanism for safe same-dimension reindex
- 26 new deterministic tests across 4 suites covering all five remediation families

### Changed

- Respawn-lock staleness bounded by listener liveness instead of a fixed TTL in model server supervision
- Idle eviction reaps the root process through the shared authority, not just descendants
- Clean-shutdown marker deleted only after a confirmed-successful close in the vector index store
- Direct-startup unlink path applies the ownership perimeter guard in the model server
- TCP listener targets enforce loopback and auth binding

### Fixed

- Lazy demand listener re-arms on a failed spawn, preventing a stranded listener
- Same-dimension reindex no longer partially overwrites the live shard on failure
- The reindex worker re-reads the cancel flag mid-run
- A stale launcher lease with a live recorded childPid no longer treated as reclaimable

### Verification

- Finding-state re-validation at HEAD: complete (OR-R-01 already O_EXCL at HEAD, DR-012 mechanism confirmed as root-exclusion, remaining findings confirmed open)
- Builds (mcp, shared, scripts): PASS
- `node --check` on both `.cjs` files: PASS
- New deterministic suites (4 suites, 26 tests): PASS
- Regression suites (execution-router, reindex, auto-selection, 29 tests): PASS
- Leases suite (daemon-detect, 9 tests): PASS
- `validate.sh --strict` (this packet): PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `009-.../spec.md`, `plan.md`, `tasks.md` | Created | Coordinated design, concurrency-test design, apply ordering, and per-family task list |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | Respawn-lock liveness bounding, listener re-arm, and root process reaping on idle eviction |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modified | Clean-shutdown marker gated on confirmed-successful close |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | Staging-shard atomic-swap and cancel-flag re-read mid-run |
| `.opencode/bin/hf-model-server.cjs` | Modified | Ownership perimeter guard on direct-startup unlink and TCP loopback/auth enforcement |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/daemon-detect.ts` | Modified | Stale launcher lease with live childPid no longer reclaimable |

### Follow-Ups

- A live two-launcher integration run with real processes remains gated on a working onnxruntime tree. The deterministic unit-level suites assert the corrected logic, not end-to-end residency.
- Family-3 cross-launcher coordination (OR-R-01 residual) is tracked in the adjacent code-graph launcher packet and was re-validated only.
- The `reindex.ts` cluster fix and the C2 cancel edit (packet 008) were re-validated together so the staging-swap and cancel-re-read remain consistent.
