# Review Resource Map

## Scope
Fan-out lineage artifacts for `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights`.

## Reviewed Files
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/plan.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/tasks.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/implementation-summary.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts`

## Finding Map
- F001: `spec.md:102`, `tests/bm25-packed-inmemory.vitest.ts:117`, `fixtures/bm25-packed-fixture.ts:102`
- F002: `plan.md:139`, `spec.md:49`, `implementation-summary.md:101`
- F003: `spec.md:137`, `implementation-summary.md:91`, `implementation-summary.md:116`

## Phase-5 Augmentation
- Novel logic gaps: F001 only.
- Empty-result cases: no P0/security findings; no checklist evidence gap; no resource-map coverage gate because packet `resource-map.md` is absent.
