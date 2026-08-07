# Deep Review Resource Map

## Scope
Review lineage `gpt-3` for `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights`.

## Resource Map Coverage Gate
The target spec folder did not contain `resource-map.md` at init, so the first-class resource-map coverage audit was skipped per deep-review protocol.

## Reviewed Artifacts
| Path | Role | Iterations |
|------|------|------------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/spec.md` | Normative requirements | 003, 006 |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/tasks.md` | Completion evidence | 003, 005, 006 |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/implementation-summary.md` | Delivery summary | 005 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | Packed engine | 001, 002, 005, 006 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Hybrid fallback routing | 003, 006 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | FTS5 comparison path | 002, 003, 006 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts` | Eval helper | 006 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts` | Eval fixtures | 006 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts` | Packed tests | 001, 004, 006 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts` | Existing BM25 tests | 004 |

## Novel Logic Gaps
- F001: async startup rebuild does not compact the final batch and clear mutable postings.
- F002: in-memory fallback limits before applying scope/deprecated filters.
- F003: tests do not cover startup rebuild finalization semantics.
