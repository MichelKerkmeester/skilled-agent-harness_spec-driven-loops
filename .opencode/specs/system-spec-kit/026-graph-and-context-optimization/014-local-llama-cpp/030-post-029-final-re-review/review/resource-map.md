# Deep Review Resource Map: Post-029 Final Re-Review

Source integrity note: observed iteration files report 43,788 aggregate file-scan events across 10 source iteration files. They do not emit exact per-surface scan counts, so the `Files Scanned` column records coverage from the iteration focus/summary text without inventing per-surface totals.

| Surface | Files Scanned | P0 | P1 | P2 | Notes |
|---------|---------------|----|----|----|-------|
| Embedding provider code and profile metadata | Covered; per-surface count not itemized | 0 | 4 | 2 | Includes `providers/voyage.ts`, `providers/openai.ts`, `shared/types.ts`, `shared/embeddings/factory.ts`, and `providers/hf-local.ts`; issues center on cloud dtype, fallback order, and misleading fallback/default labels. |
| Profile filename regression tests | Covered; per-surface count not itemized | 0 | 2 | 0 | `profile-db-filename.vitest.ts` still expects cloud filenames without the `__cloud` slug. |
| Setup/install scripts and package metadata | Covered; per-surface count not itemized | 0 | 2 | 1 | `mcp-coco-index` package metadata and setup installer output still omit or misstate the canonical local/cloud provider set. |
| Root and system-spec-kit README documentation | Covered; per-surface count not itemized | 0 | 0 | 4 | Root and skill README wording still describes llama-cpp selection as Apple-Silicon/no-setup specific rather than GGUF runtime/model probe based. |
| Shared embedding and MCP README documentation | Covered; per-surface count not itemized | 0 | 0 | 4 | Shared/MCP docs still underdescribe resolver inputs, overfit Apple Silicon wording, or call hf-local the old provider. |
