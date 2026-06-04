# Iteration 002 - Security

Focus: input validation, path safety, SQL construction, transaction boundaries, and destructive-operation guards.

## Findings

No P0, P1, or P2 security findings were supported by the reviewed evidence.

## Evidence Checked

- `memory_save` validates `filePath` before indexing, resolves the canonical path, rejects non-indexable paths, enforces canonical spec/constitutional memory scope, and validates governed ingest before mutation: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2980`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3000`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3004`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3010`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3051`.
- `memory_delete` requires an id or spec folder and `confirm:true`, parses ids as positive integers, and wraps delete plus edge cleanup in a transaction: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:37`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:73`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:98`.
- `memory_bulk_delete` validates tier against an explicit list, requires confirmation, blocks unscoped constitutional/critical deletes, and forbids checkpoint skipping for those tiers: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:89`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:94`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:98`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:103`.
- Reconcile dynamic SQL interpolates only `active_vec` and a validated `vec_<dim>` table derived from active embedder metadata, and verifies table existence before use: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:111`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:114`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:188`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:189`.
- Apply mode fails closed when the active shard cannot be verified: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:335`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:336`.

## Residual Risk

No live MCP invocation was run in this lineage because writes had to remain confined to the lineage artifact directory. This pass is therefore source-audit evidence, not runtime exploit testing.

Review verdict: PASS
