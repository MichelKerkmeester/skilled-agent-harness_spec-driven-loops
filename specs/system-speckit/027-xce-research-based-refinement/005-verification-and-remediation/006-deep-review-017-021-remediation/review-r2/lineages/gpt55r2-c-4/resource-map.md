# Resource Map - gpt55r2-c-4

Source scope did not contain `resource-map.md`; this lineage emitted a minimal review evidence map from iteration delta evidence.

## Reviewed Evidence Paths
| Path | Role | Iteration |
|------|------|-----------|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | daemon-backed CLI session proxy and replay classifier | 001 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | memory save handler and receipt gate | 001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts` | receipt lookup/store implementation | 001 |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | default feature flag state | 001 |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | lease-holder probe/bridge support | 001 |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | owner lease and daemon supervision | 001 |

## Phase-5 Augmentation
Novel logic gaps:
- F001: `memory_save` replayability depends on default-off idempotency receipts, leaving daemon recycle replay unsafe for a mutating tool under default settings.
