---
title: "Implementation Summary: Reset Stuck Embedding Rows"
description: "Reset eligible memory_index rows stuck on the old synthetic null embedding failure and recorded the skipped orphan rows for later cleanup."
trigger_phrases:
  - "040 reset stuck embedding rows summary"
  - "Embedding generation returned null reset summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows"
    last_updated_at: "2026-05-14T15:15:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-040"
    recent_action: "Reset stuck embedding rows and documented counts"
    next_safe_action: "Monitor retry-manager processing of reset rows"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite"
      - ".opencode/skills/system-spec-kit/mcp_server/database/.pre-040-reset-20260514T151344Z.bak"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-040-reset-stuck-embedding-rows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The remaining retry rows are orphan rows with missing file_path targets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-reset-stuck-embedding-rows |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The llama-cpp memory index now has its recoverable null-failure rows back in the retry-manager queue. Rows whose files still exist were reset to pending with clean retry metadata; rows pointing at deleted files were left untouched as orphans.

### Reset Result

| Metric | Value |
|--------|-------|
| `ROWS_RESET` | 789 |
| `ROWS_SKIPPED_AS_ORPHAN` | 10 |
| `DB_BACKUP_PATH` | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/.pre-040-reset-20260514T151344Z.bak` |
| `PRE_COUNTS` | `failed=30`, `retry=769`, `pending=0` |
| `POST_COUNTS` | `failed=0`, `retry=10`, `pending=0` |

The ten skipped rows all point at missing files under `.opencode/specs/system-spec-kit/028-orphan-code-graph-db-cleanup/`, so this packet preserved them instead of turning orphan work into retry-manager work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` | Modified | Reset eligible stuck embedding rows. |
| `.opencode/skills/system-spec-kit/mcp_server/database/.pre-040-reset-20260514T151344Z.bak` | Created | Pre-flight copy of the sqlite database. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows/` | Created | Packet docs and metadata for this reset. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The reset used one Node script with `better-sqlite3` and `sqlite-vec`, loaded the sqlite-vec extension before database work, partitioned candidates by `file_path` existence, and updated the live-file ids in a transaction.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reset only rows with the old null failure reason | This keeps the data repair tied to the 038 and 039 recovery path instead of changing unrelated retry state. |
| Skip missing `file_path` targets | Orphan cleanup is a separate concern; retrying deleted files would recreate noise. |
| Leave live MCP processes alone | The dispatch explicitly forbids killing launcher child processes. |
| Stage only this packet folder | The working tree contains unrelated and forbidden dirty files. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Required pre-check for existing `040-` folder | PASS, grep found no existing `040-` folder. |
| Reset script post-count query | PASS, post stuck counts are `failed=0`, `retry=10`, `pending=0`; the ten remaining rows are skipped orphans. |
| Strict validation on 040 packet | PASS, exit 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Retry-manager throughput is unchanged.** The manager still processes normal batches on its five-minute cadence.
2. **Ten orphan rows remain.** They were intentionally skipped because their `file_path` targets no longer exist.
<!-- /ANCHOR:limitations -->
