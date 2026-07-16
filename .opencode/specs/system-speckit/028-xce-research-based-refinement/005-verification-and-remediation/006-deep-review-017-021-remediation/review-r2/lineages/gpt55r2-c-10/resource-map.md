# Review Resource Map - gpt55r2-c-10

## Phase-5 Augmentation
- Novel logic gaps: F001 daemon tcp endpoint resolution split, F002 async ingest path TOCTOU.
- Iteration sources: `iterations/iteration-001.md`.
- Resource map coverage gate: skipped because the scope folder did not contain a resource-map.md at init.

## Files Reviewed
| File | Reason |
|------|--------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md` | Scope source |
| `.opencode/bin/spec-memory.cjs` | CLI shim tcp endpoint contract |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Launcher bridge endpoint resolution |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | Daemon-side IPC resolver and listener |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Daemon bind and ingest worker dispatch |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | Async ingest validation and job creation |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | `indexSingleFile` handoff |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Indexing parse entry |
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Final file read behavior |
