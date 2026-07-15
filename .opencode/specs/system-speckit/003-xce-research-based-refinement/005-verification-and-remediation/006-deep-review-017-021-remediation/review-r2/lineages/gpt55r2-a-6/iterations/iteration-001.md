# Deep Review Iteration 001 - gpt55r2-a-6

## Dispatcher

BINDING: target=.opencode/skills/system-spec-kit/mcp_server search/retrieval surface
BINDING: maxIterations=1
BINDING: convergence=0.10
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval

- Session: `fanout-gpt55r2-a-6-1781761314338-6u1ztm`
- Executor: `cli-opencode model=openai/gpt-5.5-fast`
- Artifact directory: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-a-6`
- Budget profile: verify
- Dimension focus: correctness, numeric score-scale contracts and ranking/fallback seams

## Files Reviewed

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:1-18`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:651-676`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:880-1149`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1200-1271`
- `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:80-103`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:57-95`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1326-1334`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:49-55`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:266-365`
- `.opencode/skills/system-spec-kit/mcp_server/tests/openltm-retrieval-observability.vitest.ts:96-124`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Folder boost demotes scoped hits by capping 0-100 similarity at 1.0** - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:651-676` - `applyFolderBoostRanking` multiplies matching rows' `similarity` by the folder factor, caps the result at `1.0`, then sorts all results by `similarity` descending. That assumes `similarity` is already normalized to 0-1. The same subsystem documents raw result similarity as 0-100 in the formatter [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:85-103`], the canonical score resolver divides similarity by 100 [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:57-75`], and a stage-1 summary path emits `similarity: sr.similarity * 100` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1326-1334`]. With production-scale rows, an in-folder hit at 80 becomes 1 while an out-of-folder hit at 70 stays 70, so the boost can push scoped hits below every non-scoped hit whose similarity is above 1. The existing test masks this because it uses 0.7 and 0.6 inputs instead of the documented 0-100 scale [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/openltm-retrieval-observability.vitest.ts:96-124`].

Finding class: numeric-score-scale-contract

Scope proof: The defect is in `handlers/memory-search.ts`, a search/query handler included by the scope's `.opencode/skills/system-spec-kit/mcp_server/` search/retrieval target [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:6-15`].

Affected surface hints: `memory_search` calls using `folderBoost`; `memory_context` folder-discovery prioritization that passes folder boosts into search; formatted ranking diagnostics and `finalRankScore`; retrieval observability tests.

```json
{
  "type": "gate-relevant-P1",
  "claim": "Folder boost can invert intended ranking because it caps boosted in-folder rows to 1.0 while production similarity contracts use 0-100 values.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:651-676",
    ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:85-103",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:57-75",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1326-1334",
    ".opencode/skills/system-spec-kit/mcp_server/tests/openltm-retrieval-observability.vitest.ts:96-124"
  ],
  "counterevidenceSought": "Checked the direct test for applyFolderBoostRanking. It verifies the behavior only with 0.7/0.6 similarity rows, which are not enough to disprove the 0-100 production-scale failure.",
  "alternativeExplanation": "If every production row reaching applyFolderBoostRanking were normalized before the call, the cap would be safe. The formatter, pipeline resolver, and stage-1 producer evidence show the surrounding contract is 0-100 or mixed, not guaranteed normalized.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if a complete production-path trace proves all rows are normalized to 0-1 immediately before applyFolderBoostRanking."
}
```

### P2 Findings

None.

## Traceability Checks

- The scope explicitly emphasizes numeric correctness and cross-module seams [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:14-15`]. F001 is a numeric score-scale seam between handler ranking, formatter contract, pipeline score resolution, and a stage-1 producer.
- No checklist was present in the review scope folder, so checklist evidence is not applicable for this lineage.

## Integration Evidence

- `applyFolderBoostRanking` runs after community fallback merge and before final rank stamping [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1200-1271`]. That means the corrupted order can become the final displayed rank for folder-boosted results.
- `resolveEffectiveScore` says the canonical fallback chain is `intentAdjustedScore -> rrfScore -> score -> similarity/100`, making raw `similarity` a percentage-scale fallback input [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:57-75`].

## Edge Cases

- Code graph was stale, so structural graph evidence was not used for final claims.
- The handler may receive some 0-1 rows from selected fallback paths; this does not clear the bug because the function sorts mixed/prod-scale rows directly by the mutated `similarity` field.

## Confirmed-Clean Surfaces

- Memory search limit validation clamps positive numeric limits to a maximum of 100 and defaults invalid limits to 10 [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:904-907`].
- Community fallback applies governed retrieval scope to member rows before merge [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1198`].
- Trigger embedding backfill is default-off and chunked [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:49-55`], checks cancellation during phrase sync [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:266-275`], yields between chunks [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:277-282`], limits pending embedding work [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:285-293`], and checks cancellation during embedding generation [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:298-306`].

## Ruled Out

- No active limit-validation finding was recorded.
- No active community-fallback governed-scope leak was recorded.
- No active trigger embedding backfill cancellation/boundedness finding was recorded in this single iteration.

## Next Focus

- Dimension: correctness or maintainability
- Focus area: repair/adjudicate folder boost scale handling and add a regression test with production-scale similarity values such as 80 and 70.
- Reason: active P1 remains open.
- Rotation status: maxIterations reached for this lineage.
- Blocked/productive carry-forward: score-scale contract tracing was productive.
- Required evidence: prove the exact scale of rows entering `applyFolderBoostRanking` on all paths, or make the function scale-aware without damaging formatted similarity contracts.
- Recovery note: none.

Review verdict: CONDITIONAL
