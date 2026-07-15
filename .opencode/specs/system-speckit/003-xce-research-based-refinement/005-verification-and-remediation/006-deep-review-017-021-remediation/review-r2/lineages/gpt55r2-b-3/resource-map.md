# Review Resource Map

`resource-map.md` was not present in the scope folder at init, so the formal Resource Map Coverage Gate was skipped.

## Reviewed Inputs
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts`

## Finding Links
- F001: atomic save commit-before-promote ordering.
- F002: soft-delete tombstone propagation for chunk children.
