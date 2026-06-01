---
title: "032/004: Failed Embedding Cleanup"
description: "A one-shot repair script was written and verified in dry-run mode for 214 failed memory_index rows. Live cleanup is blocked by the local llama-cpp runtime failing to initialize on both Metal and CPU backends."
trigger_phrases:
  - "failed embedding cleanup"
  - "repair-failed-embeddings script"
  - "memory_index embedding_status failed"
  - "one-shot embedding retry script"
  - "llama-cpp Metal context repair"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups`

### Summary

The active Memory MCP database had 214 rows stuck at `embedding_status='failed'`, well above the expected 24. A one-shot repair script was built and confirmed correct in dry-run mode: it resolves the active profile DB path, selects failed rows, embeds normalized content via the shared embedding provider, writes vectors into `vec_memories` then marks rows `success` only after the vector write completes.

Live cleanup did not complete. The Metal backend failed to create a command queue on this machine. A CPU-backend fallback was attempted by setting `NODE_LLAMA_CPP_GPU=false` in the script, but the CPU path required CMake to build from source and the network was restricted. All 214 rows remain at `failed` status. The script artifact is ready to execute once the llama-cpp runtime is repaired.

### Added

- `repair-failed-embeddings.mjs` one-shot ESM script under `mcp_server/scripts` with `--dry-run`, `--batch-size` and `--db-path` CLI flags (NEW)
- Per-row error logging including row id, `file_path` and error message
- Profile-aware active DB path resolution matching the live vector index convention
- CPU-backend guard via `NODE_LLAMA_CPP_GPU=false` default to avoid Metal context failure in sandboxed sessions

### Changed

- Packet status updated from Planned to Blocked after live runs failed
- `graph-metadata.json` updated to reflect blocked rather than planned state

### Fixed

- Write ordering aligned with the live vector index contract: `vec_memories` insert before `memory_index` status update. Earlier investigation confirmed `vec_index_store` is not the live table name.

### Verification

| Check | Result |
|-------|--------|
| Script file exists | PASS |
| Script has shebang | PASS |
| Script executable | PASS |
| Dry-run preview (`failed_count=214`, no writes) | PASS |
| Live repair, Metal backend | FAIL: `ggml_metal_init: error: failed to create command queue` |
| Live repair, CPU fallback | FAIL: CMake download blocked by restricted network |
| Ending failed count | FAIL: remains 214 |
| `memory_health` MCP call | BLOCKED: tool not exposed in session. Direct SQLite status-count query used instead. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs` (NEW) | Created | 367-line one-shot repair script with dry-run mode, batch control, profile-aware DB resolution and per-row error logging |
| `004-failed-embedding-cleanup/plan.md` (NEW) | Created | Design rationale and blocked runtime dependency documentation |
| `004-failed-embedding-cleanup/tasks.md` (NEW) | Created | Acceptance task tracking with blocked items noted |
| `004-failed-embedding-cleanup/checklist.md` (NEW) | Created | PASS/FAIL evidence per acceptance criterion |
| `004-failed-embedding-cleanup/implementation-summary.md` (NEW) | Created | Dry-run and live-run output logs, per-row error pattern, final DB counts |

### Follow-Ups

- Repair the llama-cpp runtime before re-running the script. The three unblocking paths are: (a) install CMake locally to unlock the CPU build, (b) provide a prebuilt CPU binary, (c) restore Metal context creation access.
- Prove idempotence after a successful repair run. The selection and status re-check logic is idempotent in theory, but the success path has not executed yet.
- Consider adding a fail-fast path when the embedding provider cannot initialize, rather than logging the same provider error for every one of the 214 rows.
