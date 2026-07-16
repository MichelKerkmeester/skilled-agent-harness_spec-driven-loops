# Iteration 002 - Security

## Focus

Security pass over write gates, destructive mutation confirmation, active vector shard authority, raw SQL interpolation, and file-path mutation surfaces in the scoped MCP core files.

## Findings

No P0/P1/P2 security findings were recorded in this pass.

## Evidence Checked

- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:94] Bulk delete requires an explicit confirmation gate.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:99] High-safety tier bulk deletes require a `specFolder` scope.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:103] High-safety tier bulk deletes cannot skip checkpoint creation.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:76] Single/folder delete requires `confirm: true`.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:43] The reconcile handler attaches the active vector shard from runtime profile authority rather than caller input.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:46] Apply mode fails closed if active shard attachment fails.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:188] The dimension table name is derived from the active embedder dimension.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:189] The active shard guard verifies the expected dimension table and rowid table before reconcile SQL runs.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1097] Active shard attachment quotes the resolved shard path before SQL interpolation.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:190] `memory_save` uses a local path validator built from allowed base paths.

## Notes

The raw SQL interpolation that remains in the reconcile path is schema/table interpolation, not direct user input. The table name is constructed from a numeric active embedder dimension and verified before use. I did not find evidence of a caller-supplied path or table name entering the mutation SQL.

Review verdict: PASS
