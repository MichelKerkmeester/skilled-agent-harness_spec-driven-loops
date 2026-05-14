---
title: "004 failed-embedding-cleanup (one-shot repair script)"
description: "Write a one-shot Node script that queries `memory_index` for rows with `embedding_status='failed'`, re-embeds them via the current provider, writes the new vector to vec_index_store, and updates the row. Clears the remaining 24 historical failures."
trigger_phrases:
  - "repair failed embeddings script"
  - "memory_index embedding_status failed cleanup"
  - "one-shot embedding retry"
importance_tier: "normal"
status: "planned"
---

# 004 — Failed-embedding cleanup

## Goal

Clear the remaining ~24 historical failed embeddings in `memory_index` (was 214 before today's retry-throughput patch; 190 cleared naturally). The remaining ones likely have content that doesn't embed cleanly under standard retry (corrupt frontmatter, oversize body, etc.) and need a targeted re-embed pass.

No existing MCP tool does this (per Explore findings); needs a new one-shot Node script.

## Source anchors

- `.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` — the active profile DB.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` — vec_index write path (read-only reference).
- `.opencode/skills/system-spec-kit/shared/dist/embeddings/index.js` — current embedding provider entrypoint.
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts` — retry logic (for reference; this script is a one-shot, not a retry loop).

## Implementation

New script at `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs`:

```js
#!/usr/bin/env node
// Reads memory_index for embedding_status='failed' rows, re-embeds them inline,
// writes vec to vec_index_store, updates row to 'success'. Idempotent.

// 1. Open the active profile DB (use the same path resolution as memory MCP)
// 2. SELECT id, content, file_path FROM memory_index WHERE embedding_status='failed';
// 3. For each row, in batches of 10 with 1s sleeps:
//    a. Re-embed content via shared/dist/embeddings/index.js generateQueryEmbedding()
//    b. Write vec to vec_index_store (or via the appropriate write API)
//    c. UPDATE memory_index SET embedding_status='success', updated_at=now WHERE id=?
// 4. Log per-row outcome (success/skip/error)
// 5. Final summary: N processed, N succeeded, N skipped, N errored
```

Acceptance behavior:
- Idempotent: re-running has no effect (rows already 'success' are skipped).
- Safe-batched: groups of 10 with 1s sleeps between batches to avoid OOM/contention.
- Reports per-row outcome so any rows that genuinely can't embed are visible.

## Acceptance criteria

1. Script exists at `mcp_server/scripts/repair-failed-embeddings.mjs` and is executable.
2. `node mcp_server/scripts/repair-failed-embeddings.mjs --dry-run` previews the work without writing.
3. `node mcp_server/scripts/repair-failed-embeddings.mjs` (live mode) drops `memory_health.embeddingRetry.failed` from current count (~24) toward 0.
4. Idempotent: re-running shows 0 processed.
5. Per-row error log captures any rows that genuinely can't embed (these become future findings, not blockers).
6. `implementation-summary.md` includes: starting failed count, ending failed count, per-row outcomes summary, and a list of any rows that couldn't be repaired.

## Out of scope

- Adding a new MCP tool that exposes this (script lives in mcp_server/scripts/ for direct invocation).
- Fixing the underlying CAUSE of why those 24 embeddings failed originally (separate investigation).
- Bulk-clear of memory_index (we want to RECOVER the rows, not delete them).
