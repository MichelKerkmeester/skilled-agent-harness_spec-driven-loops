# Review Resource Map

## Phase-5 Augmentation

No packet `resource-map.md` or `applied/T-*.md` files were present during init, so the resource-map coverage gate is explicitly skipped for this lineage.

## Reviewed Surfaces

| Surface | Role | Iterations |
|---------|------|------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts` | VectorStore implementation | 001, 003, 006 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/contention-policy.ts` | ContentionPolicy implementation | 002, 004 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/maintenance.ts` | Maintenance implementation | 002 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts` | Contract tests | 001, 003, 006 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts` | Port fakes | 004, 006 |

## Novel Logic Gaps

- F001: BetterSqliteVectorStore ignores caller supplied record IDs.
- F002: VectorStore.clear deletes memory metadata, not just vector records.
- F003: Contract tests do not assert caller-ID semantics.
- F004: FakeContentionPolicy omits retryDelaysMs and shouldAbort parity.
