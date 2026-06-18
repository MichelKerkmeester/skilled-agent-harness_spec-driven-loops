# Iteration 1: Search/Retrieval Scope, Recall, and Contract Drift

## Focus

- Dimension(s): correctness, security, traceability, maintainability.
- Scope: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`, `lib/search/**`, and public `memory_search` schema/test seams named by the A-search-retrieval scope.
- Code graph status: stale, so structural graph answers were not used for findings. Direct Grep/Glob/Read evidence was used.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 14
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Community fallback bypasses the caller's specFolder boundary. The public schema says `specFolder` limits search to a folder [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:236`], but the weak-result fallback calls `searchCommunities(effectiveQuery, requireDb(), 5)` without passing `specFolder` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1166-1171`]. It then fetches rows with `WHERE id IN (...)` and no folder/tier/context predicate [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1177-1183`], applies only tenant/user/agent governance filtering [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1199`], and appends new community rows to the response candidate set [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1214-1219`]. The community search itself scans global community summaries and returns member ids without a scope argument [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101-170`]. A scoped `memory_search({ specFolder })` can therefore return out-of-folder results whenever the main pipeline is weak enough to trigger community fallback.

Claim adjudication packet:

```json
{
  "findingId": "F001",
  "claim": "The memory_search community fallback can append rows outside the caller's specFolder because it searches communities globally and fetches member rows only by id before appending them.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:236",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1166-1183",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1185-1219",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101-170"
  ],
  "counterevidenceSought": "Read the community fallback block, the community search implementation, and the later canonical filter; found governance filtering but no specFolder/tier/context filter on injected community rows.",
  "alternativeExplanation": "The fallback may be intended as global retrieval, but the public memory_search specFolder contract is an explicit result boundary and no response metadata marks community rows as out-of-scope exceptions.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if community fallback is changed to pass/spec-filter community membership or is documented as a separate global-only retrieval mode that is skipped for scoped searches.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F002**: Summary-embedding channel only ranks an arbitrary first-1000 row sample. The channel activates only when the memory index has more than 5000 successful embeddings [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:210-218`] and Stage 1 then calls `querySummaryEmbeddings(db, summaryEmbedding, limit)` as a recall channel [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1301-1310`]. However, `querySummaryEmbeddings` reads `SELECT id, memory_id, summary_embedding FROM memory_summaries WHERE summary_embedding IS NOT NULL LIMIT ?` with `fetchCap = max(limit * 10, 1000)` and no `ORDER BY` or scope constraint before computing cosine [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-175`]. It sorts and slices only that prefix [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:190-192`], and Stage 1 applies archive/folder/tier/context/governance filters only after those sampled winners have been chosen [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341-1357`]. On a large corpus, any relevant summary outside the arbitrary first 1000 rows is unreachable, and scoped searches can get zero summary hits even when matching summaries exist later in the table.

Claim adjudication packet:

```json
{
  "findingId": "F002",
  "claim": "The summary-embedding channel is activated only for large corpora but ranks only the first fetchCap memory_summaries rows with no ordering or pre-scope constraint, making later summaries unreachable.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-175",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:190-192",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:210-218",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1301-1357"
  ],
  "counterevidenceSought": "Read stage1 summary-channel integration and memory-summaries query implementation; found post-ranking filters but no earlier scope/order/candidate partition that would make the sample representative.",
  "alternativeExplanation": "The cap was added to prevent full-table scans, but without an indexed nearest-neighbor query, deterministic shard rotation, or prefiltering it turns a recall channel into an arbitrary prefix sample.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if the summary table gains an indexed vector search or querySummaryEmbeddings prefilters/orders by eligible scoped rows before cosine ranking.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- **F003**: `includeArchived` is still advertised as functional while the handler deliberately ignores it. The public `memory_search` schema describes `includeArchived` as "Include archived spec-doc records in search results" [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:336-340`]. The handler destructures the caller value into `includeArchivedRequested`, then hard-sets `const includeArchived = false` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:818-831`]. Response metadata explicitly reports requested `includeArchived: true` as `ignored` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1334-1339`], and the regression test asserts the cache key normalizes it back to false [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:225-238`]. If the no-op is intentional, the schema should say so or remove the field; otherwise callers have a false recovery knob.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:3-18` | Audit scope was applied to selected search/retrieval seams; maxIterations=1 prevents exhaustive file coverage. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:4` | No checklist in this audit-only scope; no completion marks to validate. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:336-340` | F003 records public schema drift. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: Findings hit two independent retrieval seams: weak-result community fallback and large-corpus summary recall.
- Verdict basis: active P1 findings require remediation planning, but no P0 was confirmed.

## Ruled Out

- Confidence calibration PAV monotonicity: read `confidence-calibration.ts`; sorting, pooling, and interpolation preserve monotonicity in this pass.
- Stage2 hybrid intent double-weighting recurrence: read `stage2-fusion.ts`; intent weights are guarded by `!isHybrid` in this pass.

## Dead Ends

- Code graph structural route: blocked by stale graph readiness. Direct file reads were used instead.
- Spec Memory context route: rejected session ids with `E_SESSION_SCOPE`. Direct spec and source reads were used instead.

## Recommended Next Focus

Remediate F001 first by making community fallback scope-aware or disabling it when `specFolder`, `tier`, or `contextType` narrows the query. Then fix F002 by using a scoped/indexed summary retrieval strategy instead of arbitrary prefix sampling.

Review verdict: CONDITIONAL
