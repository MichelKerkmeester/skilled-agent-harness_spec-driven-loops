# Iteration 001: Correctness of the cosine-primary head reorder

## Focus
- **Dimension:** D1 Correctness (primary), D4 Maintainability (secondary)
- **Files reviewed:**
  - `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/tests/cosine-topn-reorder.vitest.ts`
  - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/005-cosine-topn-reorder/{spec.md,plan.md,tasks.md,implementation-summary.md}`
- **Scope:** Verify that the reorder preserves length/membership, is stable, respects evaluation mode, and falls back safely for lexical hits; surface maintainability gaps.

## Scorecard
- Dimensions covered: correctness, maintainability
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.15

## Findings

### P2, Suggestion
- **F001**: Reorder depth is a hard-coded module constant, `COSINE_TOPN_REORDER_DEPTH = 10` (`hybrid-search.ts:2416`). There is no environment variable or caller option to adjust the head size. If the planned labeled-set measurement (see `implementation-summary.md` Known Limitations) suggests a different depth, the change requires editing source rather than a flag. This matches the implementer’s own acknowledged limitation.
  - Evidence: `mcp_server/lib/search/hybrid-search.ts:2416`
  - Recommendation: Consider exposing `SPECKIT_COSINE_TOPN_REORDER_DEPTH` (with the current 10 as default) so the depth can be tuned without a code change.

- **F002**: The target spec-folder docs (`spec.md`, `plan.md`, `tasks.md`) still contain scaffold template placeholders (e.g. `[P0/P1/P2]`, `[Deliverable 1]`, `[Implement core feature 1]`). While the `implementation-summary.md` captures what was built, the canonical spec documents do not yet state the normative requirements or acceptance criteria for this phase.
  - Evidence: `spec.md:49`, `spec.md:97`, `plan.md:64`, `plan.md:121`, `tasks.md:53`, `tasks.md:63`
  - Recommendation: Backfill the spec documents with the actual problem statement, in-scope files, acceptance criteria, and completed task list now that implementation is done.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | not-executed | hard | — | Skipped in this single-iteration correctness pass |
| checklist_evidence | not-executed | hard | — | No `checklist.md` exists in target folder |

## Assessment
- **New findings ratio:** 0.15
- **Dimensions addressed:** correctness, maintainability
- **Novelty justification:** Two low-severity maintainability findings; no correctness or security regressions detected. The reorder’s invariants (pure permutation, stable tiebreak, evaluation-mode exclusion, lexical fallback) are supported by both the code and the new unit tests.

## Ruled Out
- **Length/membership violation:** `reorderTopNByCosine` returns `[...reordered, ...results.slice(headCount)]` and the unit test asserts length and set equality. Ruled out.
- **Evaluation-mode contamination:** The reorder is inside the `else` branch of `if (evaluationMode)` (`hybrid-search.ts:1992-2025`), so labeled-set windows remain fused. Ruled out.
- **Unstable tie handling:** The decorator includes the original index and uses it as an explicit tiebreaker (`hybrid-search.ts:2441`), so stability does not depend on engine sort stability. Ruled out.

## Dead Ends
- None.

## Recommended Next Focus
Synthesize report; iteration budget exhausted (`maxIterations: 1`).

Review verdict: PASS
