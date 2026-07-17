---
title: "Implementation Summary: Embedding Coverage and Vector-Shard Consistency"
description: "Closes the embedding drain/reconcile coverage gaps and the vector-shard desync so rows stop landing success-without-vector, stale-model vectors are not compared against a different query embedder, retry@max rows are rescuable, and the auto shard-repair sentinel actually clears."
trigger_phrases:
  - "embedding coverage reconcile"
  - "vector shard desync"
  - "embedder identity guard"
  - "embedding model provenance backfill"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency"
    last_updated_at: "2026-07-04T17:51:11.401Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Integrated + verified 004; ran model backfill under backup; 122 tests green"
    next_safe_action: "Daemon-side embedding reconcile re-embeds the missing-vector rows; then phase 005"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/embedding-reconcile.ts"
      - "mcp_server/lib/search/vector-index-store.ts"
      - "mcp_server/scripts/migrations/normalize-embedding-model-provenance.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-004-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001 fork: chose single-vector truncation + FTS/BM25 tail coverage over scan-path chunking (reversible, no migration)"
      - "The embedding reconcile resets missing-vector rows to retry for the async drain; its apply runs daemon-side with embedder context"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-embedding-coverage-and-vector-shard-consistency |
| **Completed** | 2026-07-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Rows stop falling into the gap between "indexed" and "actually embedded." Drains no longer produce success-without-vector rows, a stale-model vector is never silently compared against a different query embedder, retry-exhausted rows are rescuable instead of stranded, and the auto shard-repair sentinel finally clears because it counts the shard the writes actually land in.

### Coverage: drains, reconcile, and rescue

The chunking safe-swap no longer deletes the row it just wrote, and the drain scales its batch and interval by queue size so a large backlog clears without starving the loop. `memory_embedding_reconcile` is corrected and gated: it is dry-run by default and, on apply, reconciles vector-present-but-stale rows to success and resets the vector-missing rows to retry so the async drain re-embeds them — it never re-embeds synchronously and never runs from a build or test. Retry-exhausted rows are made visible to the rescue path instead of being invisible to both scan reindex and the retry queue. The sync and drain paths now embed the same weighted text and hash it into the same cache key, so the shared embedding cache is not poisoned by two different texts under one key.

### Shard consistency and identity

The 'auto' shard-repair sentinel now counts `vec_memories` — the surface writes target — instead of a `vec_<dim>` table it never populated, so it actually clears once vectors exist. Query time asserts embedder identity, so a vector produced by one model is not compared against a query embedded by another. `embedding_model` is normalized to one canonical spelling, and a dry-run-default, checkpoint-gated, audited migration backfills the model from each row's real shard provenance (leaving genuinely-unknowable rows untouched and reported).

### Scan lifecycle

Scan coalescing is now scope-aware, so a scan for one scope no longer swallows a concurrent scan for a different scope, and `pendingVectors` counts updated rows whose embeddings are still pending rather than undercounting them.

### ADR-001: single-vector truncation

Over-threshold documents keep one truncated vector while FTS/BM25 covers the full text tail, so the tail stays retrievable lexically. Scan-path chunking is deliberately not activated (the reversible, migration-free choice); a later phase can add it if denser vector coverage is wanted.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-5.5-fast (high) implemented and captured a baseline first (correctly declining to fold unrelated fixes); GPT-5.5-fast (xhigh) passed seven REQs and failed five (the ADR fork left undecided, retry@max still stranded, the backfill hard-coding a model, the sentinel counting the wrong shard, and coalescing still scope-blind). GPT-high remediated all five against the file:line evidence; Opus 4.8 made the ADR-001 decision, final-verified, integrated, and ran the model backfill on the live index under an atomic backup.

The backfill normalized 1,026 long-spelling rows, derived the model from shard provenance for ~9,465 previously-empty rows (nomic and voyage-code-3), left 9,817 genuinely-unembedded rows untouched, recorded 10,491 audit rows, and integrity stayed clean. As a bonus, 004 fixed two pre-existing failing tests that were phase-002 mock drift (the memory_search includeArchived cache-key and a retry-manager BM25 spy). Only the nineteen in-scope mcp_server files plus the decision-record were integrated; the description.json regeneration and package bump were excluded.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| ADR-001: single-vector truncation + FTS/BM25 tail coverage | Reversible and migration-free; over-threshold tails stay retrievable lexically, and scan-path chunking can be added later if denser vectors are wanted |
| Reconcile resets missing-vector rows to retry, not synchronous re-embed | Keeps the operation fast and safe; the async drain does the actual embedding, so a 12k-row desync does not block a save or a build |
| Backfill derives the model from shard provenance, never a constant | A row embedded by a different model must not be mislabeled; genuinely-unknowable rows are left and reported rather than guessed |
| Run the model backfill now, defer the reconcile apply to daemon-side | The backfill is a standalone script; the reconcile needs live embedder context, so its one-time apply belongs to the daemon running this code |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (integrated main) | PASS (clean) |
| 004 vitest (7 files) | PASS (122/122) |
| REQ-001..REQ-012 xhigh review | PASS after remediation (7/12 first pass, 5 remediated) |
| Model backfill (live, under backup) | PASS (1,026 normalized + ~9,465 provenance-derived; integrity ok; 10,491 audit rows) |
| Reconcile dry-run (live) | PASS (12,226 missing-vector rows identified; apply is daemon-side) |
| Phase-002 mock-drift tests | FIXED (includeArchived cache-key + retry-manager spy) |
| `validate.sh --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The reconcile apply is daemon-side.** The code is verified and the dry-run confirms 12,226 vector-missing rows, but the one-time reconcile-apply (which resets those rows to retry) needs live embedder context, so it runs when the daemon picks up this code; the async drain then re-embeds them over time.
2. **~9,817 rows remain without an embedding model or vector.** These have no provenance to derive from; they are reported by the backfill and will get a model and vector the next time they are embedded through the drain.
3. **Rollback is the named backup.** The model backfill is reversible from `embedding_model_backfill_audit` or by restoring `context-index.sqlite.pre-004-model-backfill-20260703`.
<!-- /ANCHOR:limitations -->
