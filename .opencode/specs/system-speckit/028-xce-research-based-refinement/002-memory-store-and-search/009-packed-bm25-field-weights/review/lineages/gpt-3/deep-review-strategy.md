# Deep Review Strategy: Packed In-Memory BM25 Engine with Field Weights

## Topic
Review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights` and its shipped packed BM25 implementation.

## Review Dimensions
- [x] Correctness: async rebuild, packed postings, BM25F score path.
- [x] Security: SQL/FTS routing, query sanitization boundaries, env-gated engine selection.
- [x] Traceability: spec claims against code and verification evidence.
- [x] Maintainability: regression coverage and fallback observability.

## Completed Dimensions
| Dimension | Iterations | Verdict |
|-----------|------------|---------|
| correctness | 001, 006 | CONDITIONAL, F001 active |
| security | 002, 006 | PASS, no P0/P1 security finding |
| traceability | 003, 005, 006 | CONDITIONAL, F002 active |
| maintainability | 004, 005, 006 | PASS with advisory F003 |

## Running Findings
| Severity | Active | Findings |
|----------|--------|----------|
| P0 | 0 | None |
| P1 | 2 | F001, F002 |
| P2 | 1 | F003 |

## What Worked
- Direct comparison of async warmup control flow against the finalization contract exposed a memory-boundary regression.
- Comparing FTS5 SQL filtering order to in-memory fallback routing exposed an FTS5-equivalence gap.

## What Failed
- Budget evidence in the spec does not prove startup rebuild compaction because the benchmark calls `finalizePackedPostings()` directly, while production startup goes through `rebuildFromDatabase()`.

## Exhausted Approaches
- No external research or WebFetch used; this review is code-only.
- No nested agent dispatch used; this lineage is LEAF-only.

## Ruled-Out Directions
- P0 severity for F001 was rejected because search lazily materializes dirty terms and correctness results can still be returned; the confirmed impact is memory-boundary and budget validity.
- P0 severity for F002 was rejected because the issue under-returns scoped fallback results rather than corrupting data or exposing cross-scope rows.

## Next Focus
Synthesis complete. Remediation should first patch `rebuildFromDatabase()` final-batch finalization, then move in-memory fallback filtering before the effective result limit or over-fetch safely before filtering.

## Known Context
- Spec claims current corpus RSS spike 111,017,984 bytes and warmup 809.17 ms.
- Resource map was absent at init; resource-map coverage gate skipped.

## Cross-Reference Status
| Protocol | Gate | Status | Evidence |
|----------|------|--------|----------|
| spec_code | hard | partial | F001 and F002 keep two shipped claims only partially satisfied. |
| checklist_evidence | hard | pass | Level 1 tasks contain evidence rows; no checklist.md required. |
| feature_catalog_code | advisory | partial | Implementation summary compaction claim is not true for startup rebuild. |
| playbook_capability | advisory | pass | Engine selection paths are explicit and logged. |

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` | reviewed | F001 active. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | reviewed | F002 active. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` | reviewed | Used as FTS5 comparison evidence. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts` | reviewed | No active finding. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts` | reviewed | No active finding. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-packed-inmemory.vitest.ts` | reviewed | Direct benchmark path misses startup rebuild finalization. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts` | reviewed | F003 active. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/spec.md` | reviewed | Scope and acceptance claims checked. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/tasks.md` | reviewed | Evidence rows checked. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/implementation-summary.md` | reviewed | F001 contradicts compaction claim for startup path. |

## Review Boundaries
- Max iterations: 6.
- Artifact directory: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/review/lineages/gpt-3`.
- Target files were read-only.
- Outputs were written only inside the lineage artifact directory.

## Non-Goals
- No code fixes.
- No changes to spec docs outside the lineage output directory.
- No external dependency evaluation.

## Stop Conditions
- Stopped at `config.maxIterations = 6` with full dimension coverage and active P1 findings.
