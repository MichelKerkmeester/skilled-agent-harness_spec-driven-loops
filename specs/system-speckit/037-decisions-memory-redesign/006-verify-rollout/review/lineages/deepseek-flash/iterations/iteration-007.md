# Iteration 7: D4 Maintainability — Test suite, eval metrics, residual literals

## Focus
Maintainability of the test layer and residual constitutional literals: all 12 manifest test files, `lib/eval/eval-metrics.ts`, and the 23 lib files with constitutional literals (census C6 mechanical-sweep residuals).

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 16
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=1 (F002 count refined)
- New findings ratio: 0.1

## Findings

### P2, Suggestion
- **F012**: Live-but-inert constitutional branches remain in ranking/normalization paths: `lib/search/hybrid-search.ts:2652` (`WHEN 'constitutional' THEN 1` tier-ordering CASE — would rank constitutional rows first if any ever enter the active projection), `lib/search/lexical-normalizer.ts:25-28` (constitutional retained in tier synonym groups), `lib/config/type-inference.ts:343` (path-based coercion for files containing 'constitutional' in path). Inert today because `active-row-predicate.ts:61` excludes constitutional and the folder is unindexed; would re-engage on legacy-row restore. Census C6 classified these TODO; executed state kept them.
  - Dimension: maintainability

## Refinements
- **F002** (refined): exact count — 26 files pass `includeConstitutional` (24 in `tests/` + 2 in `stress-test/`), all typecheck-excluded (`tsconfig.json` excludes `tests/**`, `stress-test/**`). Still references a removed option.

## Confirmed-Good Checks
- `active-row-predicate.ts:61` returns `false` for `tier === 'constitutional'` — census A8 executed (constitutional excluded from active rows).
- `eval-metrics.ts`: zero constitutional references (census C6 item already clean).
- Test constitutional fixtures are legitimate post-deprecation assertions, not stale params: `full-spec-doc-indexing.vitest.ts:97-98,232-233,302-303` (constitutional folder files classified as plain memory; constitutional README rejected from indexing); `memory-save-index-scope.vitest.ts:32-72` (governance audit `tier_downgrade_non_constitutional_path` fixtures against legacy rows — the documented audit helper).
- `checkpoint-restore-invariant-enforcement.vitest.ts:99-101` constitutional paths are DB-row fixtures only.
- Residual lib literals are: legacy DB migration (vector-index.ts:31, schema-downgrade.ts:135, vector-index-schema.ts), documented audit constants (scope-governance.ts:178-179, utils/README.md:85-86), comments (retrieval-rescue.ts:513, search-flags.ts:531, memory-parser.ts:921), and the F012 inert branches.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 003 REQ-003 learned path + census A8 verified | F001, F012 |

## Assessment
- New findings ratio: 0.1
- Dimensions addressed: maintainability (partial)
- Novelty justification: F012 latent branches; F002 refinement with exact counts.

## Ruled Out
- "Test fixtures indicate constitutional still indexed": ruled out — full-spec-doc-indexing asserts constitutional files are NOT memory/spec docs.

## Dead Ends
- eval-metrics.ts sweep: nothing to sweep.

## Recommended Next Focus
Iteration 8 — D4 Maintainability (docs census F-section): render.ts docstring (F1), injection-contract (F2), mcp-server READMEs (F4), memory-system.md (F6), session-lifecycle (F11), staleness script reference.

Review verdict: PASS
