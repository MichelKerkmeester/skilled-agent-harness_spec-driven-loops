# Deep Review Strategy: Phase 5 cosine-topn-reorder

## Topic
Review of the cosine-primary top-N head reorder implementation in `mcp_server/lib/search` and its spec-folder continuity.

## Review Dimensions
- [x] D1 Correctness — logic, edge cases, ordering invariants
- [ ] D2 Security — input validation, trust boundaries
- [ ] D3 Traceability — spec/code alignment, checklist evidence
- [x] D4 Maintainability — configurability, documentation, test coverage

## Completed Dimensions
- [x] D1 Correctness — reviewed in iteration-001; no P0/P1 blockers
- [x] D4 Maintainability — two P2 advisories recorded

## Running Findings
- P0: 0 active
- P1: 0 active
- P2: 2 active (F001 hard-coded depth, F002 spec-template placeholders)

## What Worked
- Direct read of `hybrid-search.ts` around the reorder call-site plus `pipeline/types.ts` for `resolveAbsoluteRelevance` gave a complete correctness picture in one pass.
- The new unit test file `cosine-topn-reorder.vitest.ts` covers the public invariants explicitly.

## What Failed
- None.

## Exhausted Approaches
- None.

## Ruled Out Directions
- No evidence that the reorder violates length/membership invariants; stable-index tiebreaker makes the sort deterministic independent of engine stability.
- No evidence that evaluation mode is contaminated; the reorder is inside the non-evaluation branch (`hybrid-search.ts:1992-2025`).

## Next Focus
SYNTHESIS — `maxIterations: 1` reached. Generate `review-report.md` and final state event.

## Known Context
- Implementation shipped behind `SPECKIT_COSINE_TOPN_REORDER`, default-ON, reversible.
- Key files: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/search/search-flags.ts`, `mcp_server/tests/cosine-topn-reorder.vitest.ts`.
- Verification in `implementation-summary.md` reports typecheck and test suites passing; one pre-existing `adaptive-ranking-e2e` schema failure is unrelated.
- `resource-map.md` not present at init; skipping coverage gate.

## Cross-Reference Status
| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | not-executed | Not executed in this single-iteration run |
| checklist_evidence | core | not-executed | No `checklist.md` exists in target folder |

## Files Under Review
| File | Status | Dimensions |
|------|--------|------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | reviewed | correctness, maintainability |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | reviewed | correctness, maintainability |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts` | reviewed | correctness |
| `.opencode/skills/system-spec-kit/mcp_server/tests/cosine-topn-reorder.vitest.ts` | reviewed | correctness, maintainability |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder/spec.md` | reviewed | maintainability |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder/plan.md` | reviewed | maintainability |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder/tasks.md` | reviewed | maintainability |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder/implementation-summary.md` | reviewed | correctness, maintainability |

## Review Boundaries
- Max iterations: 1
- Severity threshold: P2
- Convergence threshold: 0.10
- Target files are read-only; no code changes during audit.
- Resource map coverage gate skipped (map absent).
