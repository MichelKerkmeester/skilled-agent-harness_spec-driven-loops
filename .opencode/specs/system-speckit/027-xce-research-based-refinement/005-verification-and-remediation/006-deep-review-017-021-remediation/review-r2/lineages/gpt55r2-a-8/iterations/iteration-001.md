# Iteration 1: Search Retrieval Scope-Boundary Audit

## Focus
Reviewed security, correctness, and traceability of post-candidate-generation fallback paths in the search/retrieval subsystem. The pass focused on whether later rescue/fallback layers preserve the scoped candidate set established by Stage 1.

## Scorecard
- Dimensions covered: security, correctness, traceability
- Files reviewed: 7
- New findings: P0=1 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- **F001**: Retrieval rescue bypasses governed scope after Stage 1 filtering, `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:302`. Stage 1 explicitly applies tenant/user/agent scope to candidates when a governed retrieval scope exists [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1072-1091`]. Stage 2 then calls `applyRetrievalRescueLayer()` with only `db` and `artifactClass`, not the normalized governance scope [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1369-1373`]. Inside the rescue layer, `fetchLexicalBackfillRows()` selects from `memory_index` using only query-token `LIKE` clauses [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:292-319`], and `mergeSiblingCandidates()` adds those rows to the result map when their lexical rescue score is high enough [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:338-363`]. Because no later governance filter is applied to the rescue additions before formatting, a scoped `memory_search` can return rows outside the caller's tenant/user/agent boundary.

Adversarial self-check for F001:
- Hunter: The bypass is on a default-on path because `isRetrievalRescueEnabled()` only disables when `SPECKIT_RERANK_LAYER=false` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:74-81`].
- Skeptic: Stage 1 governance filtering is real, but it only covers the candidate set that exists before Stage 2 [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1084-1091`]. It does not cover rows fetched by `fetchLexicalBackfillRows()` later.
- Referee: P0 stands because the code can append rows fetched from `memory_index` without the active tenant/user/agent predicate after governed filtering was already required.

Claim adjudication packet for F001:
```json
{
  "findingId": "F001",
  "claim": "Stage 2 can append rows from memory_index without tenant/user/agent filtering after Stage 1 already enforced governed retrieval scope.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1072-1091",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1369-1373",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:292-319",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:338-363"
  ],
  "counterevidenceSought": "Checked Stage 1 scope filtering, Stage 2 rescue invocation, retrieval-rescue SQL, merge logic, and post-pipeline canonical filtering in memory-search; no tenant/user/agent replay is present for rescue-added rows.",
  "alternativeExplanation": "The rescue layer might be intended to operate only on already-scoped rows, but fetchLexicalBackfillRows performs a fresh memory_index query and mergeSiblingCandidates adds rows not present in the scoped input set, so that explanation is rejected.",
  "finalSeverity": "P0",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade only if rescue options carry normalized tenant/user/agent scope and both backfill plus sibling SQL or post-fetch filtering enforce that scope before rows are merged.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P0", "reason": "Initial discovery" }
  ]
}
```

### P1, Required
- **F002**: Community fallback appends rows outside caller retrieval filters, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1177`. When weak results trigger community fallback, the handler fetches member rows by id only [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1177-1183`]. It then applies tenant/user/agent governance filtering when present [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1192-1198`], but it never reapplies `specFolder`, `tier`, `contextType`, `includeArchived`, or `minQualityScore` before appending new community rows [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1214-1219`]. The upstream community search scans all `community_summaries` without a spec-folder filter [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124-128`]. This can make a scoped or tier-filtered `memory_search` return unrelated canonical documents whenever the fallback fires.

Claim adjudication packet for F002:
```json
{
  "findingId": "F002",
  "claim": "The weak-result community fallback fetches and appends member rows without reapplying specFolder, tier, contextType, or archive filters requested by the caller.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1177-1183",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1192-1198",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1214-1219",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124-128"
  ],
  "counterevidenceSought": "Checked the community fallback fetch, its governance-only filter, append site, and subsequent canonical-source filtering; no replay of specFolder/tier/contextType/includeArchived filters is present before append.",
  "alternativeExplanation": "Community fallback could be a global retrieval level by design, but the code runs in retrievalLevel='auto' as a weak-result fallback and the handler still receives caller filters, so returning rows outside those filters violates the search contract.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade if the fallback is explicitly documented as global-only and disabled for scoped/tier/context-filtered calls, or if the handler applies all caller filters before appending community rows.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:7-13` | Scope matched search/retrieval files; fallback layers violate scoped retrieval expectations. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:3-4` | No checklist claims in this review-scope packet. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1069-1091` | Governed retrieval exists in Stage 1 but is not preserved by rescue. |
| playbook_capability | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1158-1219` | Weak-result fallback needs scoped-filter regression coverage. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: security, correctness, traceability
- Novelty justification: The pass focused on late fallback insertion paths outside round-1 fixes and found two independent scope-preservation gaps.

## Ruled Out
- Stage 1 scope filtering as sufficient proof: ruled out because Stage 2 and handler fallback append new candidate rows after Stage 1 [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1369-1373`].
- Community fallback as tenant bypass: downgraded from P0 because the handler does replay tenant/user/agent filtering on community member rows [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1192-1198`]. The remaining defect is caller-filter bypass.

## Dead Ends
- Confidence calibration and BM25 weight review did not produce a supported active finding in this one-pass lineage.

## Recommended Next Focus
Fix and regression-test F001 first. Then add a scoped community fallback test proving `specFolder`, `tier`, `contextType`, archive policy, and quality threshold survive fallback append.
Review verdict: FAIL
