---
title: "013/002 Checkpoint-v2 File Snapshot: VACUUM INTO create/restore + gate-fix + live-verify"
description: "Checkpoint-v2 (VACUUM INTO file snapshot) shipped in 7 phases (schema v29, v2 create, v2 restore, journal crash-safety). A post-deploy live verification caught and fixed a v2-selection gate bug that had left the feature inert on sharded runtimes; full-DB create+restore round-trip proven on the production database."
trigger_phrases:
  - "checkpoint v2 file snapshot changelog"
  - "vacuum into checkpoint create restore"
  - "checkpoint v2 gate-fix sharded runtime"
  - "checkpoint restore journal crash-safety"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation`

### Summary

Shipped checkpoint-v2 — a `VACUUM INTO` file-snapshot checkpoint/restore — across Phases 1-7 (schema v29, v2 CREATE, v2 RESTORE, journal crash-safety). After deploy, a **live verification caught a v2-selection gate bug** that had left the feature **inert on sharded runtimes**, and fixed it; the full-DB create + restore round-trip was then proven on the production database. Two follow-on P2 crash-safety hardenings landed afterward.

### Added

- `VACUUM INTO` checkpoint create (consistent file snapshot of the live DB) and a v2 restore path with DB swap/reopen.
- Restore journal for crash-safety across the swap (swap-pending / swap-done states), and shard-attach handling (`active_vec`) so sharded runtimes round-trip correctly.
- vitest: checkpoint-v2 create + restore coverage.

### Changed

- Schema v29 (checkpoint-v2 metadata/shape).

### Fixed

- **v2-selection gate bug (`cce4fe931d`)**: `hasMainVectorPayloadTables()` required BOTH `vec_memories` AND `vec_metadata` in the main DB; on sharded runtimes `vec_metadata` lives in the attached `active_vec` shard, so the check failed and v2 silently never activated (the feature was inert in production). Changed the gate to require `vec_memories` only — v2 now activates on sharded runtimes. Found by post-deploy live verification.
- P2 crash-safety: `fsyncDirectoryIfPossible` on the live/shard dirs after the stale-`.bak` removal and before the journal write (`83e0661e5f`); the post-swap-done failure path now re-writes the restore journal (demote to swap-pending) before the in-process revert so a crash there is recoverable (`29160c0e50`).

### Verification

- Per-phase tests green; the gate-fix + P2 hardenings verified via daemon-independent one-shot Node harnesses (replicating `initDatabase()`), isolated to throwaway DBs.
- **Live-verified on the production DB**: full create + restore round-trip proven; the production DB stayed healthy (memory == fts, schema intact, integrity ok) throughout.

### Files Changed

| File | Change |
|------|--------|
| `mcp_server/lib/storage/checkpoints.ts` | Modify — VACUUM INTO create, v2 restore, gate-fix, swapFn fsync, post-swap-done journal demote |
| `mcp_server/lib/search/vector-index-store.ts` · `vector-index-schema.ts` | Modify — schema v29, shard-attach handling |
| `mcp_server/tests/checkpoints-v2-create.vitest.ts` (+ restore) | Create — round-trip coverage |
| `.gitignore` | Modify — ignore `.unclean-shutdown` marker (`94069f63e5`) |

### Follow-Ups

- The post-restore derived-rebuild self-heal (a `.needs-rebuild` sentinel) shipped separately as `013/005` — see `changelog-013-005-checkpoint-needs-rebuild-sentinel.md`.
