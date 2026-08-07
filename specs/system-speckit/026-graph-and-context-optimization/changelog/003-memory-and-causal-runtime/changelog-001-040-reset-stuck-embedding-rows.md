---
title: "Reset Stuck Embedding Rows"
description: "789 memory_index rows stuck on the old null-embedding failure were reset to pending so the retry-manager could re-process them under the 038 and 039 pipeline fixes. Ten orphan rows pointing at deleted files were intentionally preserved."
trigger_phrases:
  - "reset stuck embedding rows"
  - "Embedding generation returned null reset"
  - "retry-manager stuck embedding rows"
  - "040 embedding row reset"
  - "memory index orphan rows"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

After packets 038 and 039 corrected the embedding pipeline error-propagation and token-aware truncation paths, 799 rows in `memory_index` remained stuck with `failure_reason='Embedding generation returned null'` and `embedding_status` of `failed` or `retry`. Those rows would not automatically re-enter the retry-manager queue without a bounded database reset. The reset script backed up the live SQLite database, partitioned the 799 candidate rows by `file_path` existence, then updated the 789 live-file rows to `pending` with `retry_count=0` and cleared failure metadata in a single transaction. The 10 remaining rows all referenced deleted files under the 028 orphan cleanup folder and were left untouched intentionally. After the reset the post-counts read `failed=0`, `retry=10`, `pending=0`, confirming only the orphan rows remained out of the retry queue.

### Added

- Level 1 packet folder with spec, plan, tasks plus implementation summary recording the reset evidence
- Pre-flight database backup at `.pre-040-reset-20260514T151344Z.bak` before any mutation

### Changed

- `memory_index` rows matching the old null-embedding failure reason and with live `file_path` targets: `embedding_status` reset to `pending`, `retry_count` reset to `0`, `failure_reason` cleared, `last_retry_at` cleared

### Fixed

- 789 `memory_index` rows with `failure_reason='Embedding generation returned null'` were permanently stuck outside the retry-manager queue after the 038 and 039 pipeline corrections. The reset returned them to `pending` so the manager could re-process them.

### Verification

| Check | Result |
|-------|--------|
| Required pre-check for existing `040-` folder | PASS, grep found no existing `040-` folder. |
| Reset script post-count query | PASS, post stuck counts are `failed=0`, `retry=10`, `pending=0`. The ten remaining rows are skipped orphans. |
| Strict validation on 040 packet | PASS, exit 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` | Modified | 789 stuck rows reset to pending via a single `better-sqlite3` transaction. |
| `.opencode/skills/system-spec-kit/mcp_server/database/.pre-040-reset-20260514T151344Z.bak` | Created (NEW) | Pre-flight copy of the SQLite database taken before any mutation. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows/spec.md` (NEW) | Created | Scope, requirements, plus acceptance criteria for the reset. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows/implementation-summary.md` (NEW) | Created | Pre-counts, post-counts, rows reset, rows skipped. Backup path evidence included. |

### Follow-Ups

- Monitor the retry-manager to confirm the 789 reset rows complete embedding generation under the 038 and 039 corrections.
- Clean up the 10 orphan rows pointing at deleted files under `.opencode/specs/system-spec-kit/028-orphan-code-graph-db-cleanup/` in a dedicated orphan-cleanup packet.
