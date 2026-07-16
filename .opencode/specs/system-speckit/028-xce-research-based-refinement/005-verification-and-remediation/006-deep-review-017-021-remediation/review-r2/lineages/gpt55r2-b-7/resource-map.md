# Review Evidence Resource Map - gpt55r2-b-7

## Scope Snapshot
- Target scope: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002`
- Resource map in target scope: absent
- Coverage gate: skipped

## Evidence Paths
| Path | Role | Findings |
|------|------|----------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Background/sync index scan governed ingest caller | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Async ingest worker wiring | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Shared index/save implementation and direct-save counterpath | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Single delete tombstone helper | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Tier bulk delete tombstone helper | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Projection-backed count/list/path prepared statements | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Projection-backed vector query shapes | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Active projection schema | F002 |

## Empty Result Cases
- No P0 findings.
- No P2 findings.
- No confirmed issue in retention hard-delete transaction cleanup.
- No confirmed issue in background scan cancellation batch abort handling.
