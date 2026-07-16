# Iteration 002 - Security

Focus: active-shard trust boundary, path authority, transaction safety, and provider/error leakage in the write path.

## Files Reviewed

| File | Coverage |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` | Handler-level active shard attach and apply abort behavior |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | Shard verification and guarded apply transaction |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Path validation, save transaction ordering, entity-density invalidation |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Confirmation gates, checkpoint safety, delete transaction |

## Result

No new security findings.

The reconcile handler resolves the active vector shard through runtime metadata rather than accepting a caller path, and apply mode aborts when attach/verification fails. The library validates active shard model/dimension/provider metadata and checks that both vector tables exist before counting or mutating rows. Apply mutations run through a `database.transaction(...).immediate()` lock.

Bulk delete has confirmation gates, refuses high-safety tiers without a spec-folder scope, and requires checkpoints for constitutional/critical tiers. Save continues to use the shared path validator and its main record creation happens under a database transaction plus spec-folder locking.

## Security Notes

- No caller-controlled shard path was found in `memory_embedding_reconcile`.
- Provider failure messages in save/retry paths are sanitized before persistence or response in the checked paths.
- The active findings from iteration 001 are correctness/contract issues, not direct injection, auth, or data-exfiltration issues.

Review verdict: PASS
