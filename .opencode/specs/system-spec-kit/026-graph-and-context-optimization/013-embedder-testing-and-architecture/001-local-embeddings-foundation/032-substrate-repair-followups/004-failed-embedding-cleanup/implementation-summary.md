---
title: "Implementation Summary: 004 failed-embedding-cleanup"
description: "A repair script now exists for failed memory embeddings, but live cleanup is blocked by the local llama-cpp runtime rather than row content."
trigger_phrases:
  - "failed embedding cleanup summary"
  - "repair failed embeddings outcome"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup"
    last_updated_at: "2026-05-14T11:12:59Z"
    last_updated_by: "cli-codex"
    recent_action: "Script implemented; live cleanup blocked"
    next_safe_action: "Install CMake or restore working Metal backend, then rerun script"
    blockers:
      - "llama-cpp Metal context creation failed"
      - "CPU fallback attempted to download CMake through npm and failed under restricted network"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite"
    session_dedup:
      fingerprint: "sha256:4444444444444444444444444444444444444444444444444444444444444444"
      session_id: "cli-codex-004-failed-embedding-cleanup"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "Should the llama-cpp runtime be fixed via `brew install cmake`, a prebuilt CPU binary, or Metal access repair?"
    answered_questions:
      - "The active profile DB path resolves to the llama-cpp q8 database."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup` |
| **Completed** | Blocked on 2026-05-14 |
| **Level** | 2 |
| **Starting Failed Count** | 214 |
| **Ending Failed Count** | 214 |
| **Rows Repaired** | 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repair script now exists and follows the same vector write contract as the live vector index: write the vector first, then mark the memory row `success`. The actual cleanup did not complete because the active embedding provider could not generate a single vector in this environment.

### One-Shot Repair Script

`repair-failed-embeddings.mjs` resolves the active profile DB path, loads `sqlite-vec`, selects failed rows, embeds normalized `content_text`, writes `vec_memories`, and updates `memory_index`. It supports `--dry-run`, `--batch-size N`, and `--db-path PATH`.

The script defaults `NODE_LLAMA_CPP_GPU=false` to avoid the observed Metal command-queue failure in headless/sandboxed sessions. That moved the failure from Metal to the CPU backend dependency path, where `node-llama-cpp` tried to fetch CMake and failed because network access is restricted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs` | Created | One-shot failed embedding repair script |
| `plan.md` | Created | Documents design and blocked runtime dependency |
| `tasks.md` | Created | Tracks acceptance tasks and blocked items |
| `checklist.md` | Created | Records PASS/FAIL evidence per acceptance criterion |
| `implementation-summary.md` | Created | Captures dry-run/live output and final counts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was delivered as a standalone ESM script under `mcp_server/scripts`, with no changes to shared embedding source or retry-manager TypeScript. Live execution was attempted twice: first with the default Metal-backed llama-cpp runtime, then with a CPU-backend guard in the script.

### Dry-Run Output

```text
[repair-failed-embeddings] mode=dry-run
[repair-failed-embeddings] db_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite
[repair-failed-embeddings] vector_table=vec_memories
[repair-failed-embeddings] failed_count=214
[repair-failed-embeddings] batch_size=10
[repair-failed-embeddings] preview id=2496 file_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/014-onnx-cross-platform-backend/plan.md content_chars=8021
[repair-failed-embeddings] preview id=2497 file_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/014-onnx-cross-platform-backend/spec.md content_chars=12084
[repair-failed-embeddings] preview id=2498 file_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/015-node-llama-cpp-evaluation/plan.md content_chars=8788
[repair-failed-embeddings] preview id=2499 file_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/016-llama-cpp-retrieval-quality-probe/plan.md content_chars=5935
[repair-failed-embeddings] preview id=2500 file_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/018-llama-cpp-auto-migration/spec.md content_chars=9233
[repair-failed-embeddings] preview_remaining=209
[repair-failed-embeddings] summary processed=0 succeeded=0 skipped=0 errored=0 elapsed_ms=0 dry_run=true
```

### Live-Run Output

First live run:

```text
[repair-failed-embeddings] starting_failed_count=214
[factory] Using provider: llama-cpp (Default local provider (llama-cpp GGUF q8))
[node-llama-cpp] ggml_metal_init: error: failed to create command queue
[node-llama-cpp] ggml_backend_metal_device_init_backend: error: failed to allocate context
[llama-cpp] Generation failed: Failed to create context
[repair-failed-embeddings] ERROR id=2496 file_path=.../014-onnx-cross-platform-backend/plan.md error="Embedding provider returned null"
...
[repair-failed-embeddings] summary processed=214 succeeded=0 skipped=0 errored=214 dry_run=false
```

Second live run after CPU-backend guard:

```text
[repair-failed-embeddings] starting_failed_count=214
[node-llama-cpp] A prebuilt binary was not found, falling back to building from source
[node-llama-cpp] Downloading cmake
npm error code ENOTFOUND
npm error network request to https://registry.npmjs.org/xpm failed
[node-llama-cpp] Failed to build llama.cpp with no GPU support.
[repair-failed-embeddings] ERROR id=2496 file_path=.../014-onnx-cross-platform-backend/plan.md error="Embedding provider returned null"
...
[repair-failed-embeddings] summary processed=214 succeeded=0 skipped=0 errored=214 dry_run=false
```

### Per-Row Error Pattern

All 214 rows failed with the same provider-level error after embedding generation returned null. This is not evidence of corrupt memory row content; it is evidence that no local llama-cpp embedding backend was available.

Representative per-row errors:

| Row ID | File Path | Error |
|--------|-----------|-------|
| 2496 | `.../014-onnx-cross-platform-backend/plan.md` | `Embedding provider returned null` |
| 2497 | `.../014-onnx-cross-platform-backend/spec.md` | `Embedding provider returned null` |
| 2498 | `.../015-node-llama-cpp-evaluation/plan.md` | `Embedding provider returned null` |
| 2499 | `.../016-llama-cpp-retrieval-quality-probe/plan.md` | `Embedding provider returned null` |
| 2500 | `.../018-llama-cpp-auto-migration/spec.md` | `Embedding provider returned null` |
| 2501 | `.../001-rename-mcp-namespace-mk-spec-memory/plan.md` | `Embedding provider returned null` |
| 2502 | `.../002-feedback-p0-correctness/checklist.md` | `Embedding provider returned null` |
| 2503 | `.../003-memoization-dependency-dag-foundation/plan.md` | `Embedding provider returned null` |
| 2504 | `.../004-causal-graph-lifecycle-tombstones/plan.md` | `Embedding provider returned null` |
| 2505 | `.../005-frontmatter-causal-edge-promoter/plan.md` | `Embedding provider returned null` |

Final DB-equivalent health check:

```json
{
  "embeddingRetry": {
    "failed": 214,
    "pending": 0,
    "retry": 430
  },
  "statusCounts": [
    { "embedding_status": "failed", "count": 214 },
    { "embedding_status": "retry", "count": 430 },
    { "embedding_status": "success", "count": 2720 }
  ]
}
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Write directly to `vec_memories`, not `vec_index_store` | The actual schema and vector mutation path use `vec_memories`; `vec_index_store` is not the live table name. |
| Use `content_text` as the content source | The active DB has `content_text`, not a `content` column. |
| Fall back to reading `file_path` when content is empty | This preserves repair capability for legacy rows with missing `content_text`. |
| Keep one row per transaction | This keeps SQLite write locks short and safer alongside the live Memory MCP daemon. |
| Default `NODE_LLAMA_CPP_GPU=false` in the script | The first live run proved Metal context creation fails in this execution environment. |
| Do not mark packet complete | The live repair acceptance criterion failed; marking complete would make packet metadata false. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Script file exists | PASS |
| Script has shebang | PASS |
| Script executable | PASS |
| Dry-run preview | PASS: `failed_count=214`, no writes |
| Live repair default backend | FAIL: Metal context creation failed |
| Live repair CPU fallback | FAIL: CMake download blocked by restricted network |
| Ending failed count | FAIL: remains 214 |
| MCP memory_health call | BLOCKED: memory MCP tool was not exposed in this Codex session; direct DB-equivalent check used instead |
| Acceptance criteria overall | FAIL: script exists, but cleanup did not complete |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime blocker.** The active llama-cpp provider cannot generate embeddings here. Metal fails with command-queue/context errors; CPU fallback needs CMake and cannot fetch it under restricted network.
2. **Idempotence not proven after success.** The code is idempotent by selection and status re-check, but the success path did not execute because no vector was generated.
3. **MCP health tool unavailable in this session.** Tool discovery did not expose `mcp__mk_spec_memory__memory_health`, so verification used a direct read-only SQLite status-count query.
<!-- /ANCHOR:limitations -->
