# Iteration 002 - Security

Focus: validation boundaries, shard authority, and mutation safety.

## Findings

No P0/P1/P2 security findings.

## Evidence Checked
- `memory_save` validates a non-empty `filePath`, resolves it through `validateFilePathLocal()`, rejects non-indexable paths with `shouldIndexForMemory()`, and rejects non-memory files before parsing or saving. Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2984`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3000`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3004`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3010`.
- `memory_embedding_reconcile` does not accept caller-supplied shard paths. The handler attaches the active profile shard and apply fails closed when verification fails. Evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:36`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:43`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:46`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:335`.
- The reconcile library interpolates the dimension table only after active metadata is parsed as a number and the target table is verified. Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:133`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:188`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:209`.
- Strict schema validation rejects unknown parameters and logs validation failures for auditability. Evidence: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:653`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:679`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:690`.

## Ruled Out
- Caller-controlled shard attachment: ruled out by active-profile attach plus apply fail-closed behavior.
- Obvious SQL interpolation exposure in reconcile dimension table selection: ruled out by numeric dim parsing and table existence verification.
- Unsafe save path write: no finding in the reviewed entry path; canonical validation and indexability checks happen before write.

Review verdict: PASS
