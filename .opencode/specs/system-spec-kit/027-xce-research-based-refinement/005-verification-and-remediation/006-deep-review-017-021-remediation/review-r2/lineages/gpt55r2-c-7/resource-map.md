# Review Resource Map - gpt55r2-c-7

## Resource Map Coverage Gate
The target scope packet did not contain `resource-map.md` at init, so the formal resource-map coverage gate is not active for this lineage.

## Phase-5 Augmentation
- Novel logic gaps: F001 (`tcp://` IPC contract drift), F002 (`memory_save` replay idempotency gap).
- Iteration source: `iterations/iteration-001.md`.
- Evidence rows are listed in `deep-review-findings-registry.json` and `review-report.md`.

## Files Sampled
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts`
- `.opencode/bin/spec-memory.cjs`
- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/bin/lib/launcher-session-proxy.cjs`
- `.opencode/bin/lib/model-server-supervision.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/embeddings.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
