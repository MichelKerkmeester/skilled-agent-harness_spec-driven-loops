# Iteration 1: Search/Retrieval Ranking, Cache, and Schema Seams

## Focus
Reviewed the search/retrieval scope with emphasis on numeric correctness, cache separation, public tool schema parity, and cross-module seams between `memory_context`, `memory_search`, and search pipeline utilities.

## Scorecard
- Dimensions covered: correctness, traceability, maintainability
- Files reviewed: 17
- New findings: P0=0 P1=3 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: `folderBoost` responses collide in the `memory_search` cache. `memory_context` discovers a folder and stores it as `options.folderBoost` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1276-1279`], forwards it to `handleMemorySearch` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:993-997`], and `memory_search` applies it as a ranking mutation [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:651-678`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1230`]. The cache key is built without `folderBoost` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1070-1101`] and the formatted boosted response is cached under that key [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1443-1445`]. A boosted response can therefore be replayed for the same query without that boost, or with a different discovered folder, corrupting retrieval ranking and response metadata.
- **F002**: `folderBoost` clamps raw `0..100` similarity to `1.0`, which can demote the rows it is supposed to boost. Vector search emits `similarity` as `ROUND((1 - distance / 2) * 100, 2)` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:446-448`], and the formatter contract documents similarity as `0-100` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:77-88`]. The canonical pipeline normalizes `similarity / 100` only when resolving effective scores [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:64-75`], but `applyFolderBoostRanking` multiplies the raw `similarity` and clamps the result to `1.0`, then sorts by raw `similarity` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:651-678`]. A matching vector hit with similarity `80` becomes `1.0`, while an unboosted non-matching hit with similarity `70` remains `70` and sorts above it. This undermines the folder-discovery recovery path that intentionally relies on `folderBoost` rather than exact `specFolder` filtering [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1664-1729`].
- **F003**: `retrievalLevel` is advertised and implemented but rejected by strict public schemas. Server instructions tell clients that `memory_search` supports `retrievalLevel (local/global/auto)` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:919-925`], and the memory hook repeats the same guidance [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts:447-453`]. The handler type includes `retrievalLevel` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:320-358`], defaults it to `auto` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:827`], and uses it to decide whether community/global fallback runs [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1160-1168`]. However schemas are strict by default [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:28-32`], `memorySearchSchema` omits `retrievalLevel` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:186-220`], the allow-list omits it [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:620-623`], and the JSON schema exposed to clients also omits it [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:240-351`]. The documented global/local graph retrieval mode is therefore not callable through the public MCP surface.

### P2, Suggestion
- None.

## Claim Adjudication Packets
```json
[
  {
    "findingId": "F001",
    "claim": "folderBoost changes memory_search ranking after cache-key construction but is absent from the cache key, so boosted and unboosted responses collide.",
    "evidenceRefs": [
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1276-1279",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:993-997",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:651-678",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1070-1101",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1230",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1443-1445"
    ],
    "counterevidenceSought": "Checked buildCacheArgs inputs, memory_search cache set path, and all folderBoost references under mcp_server; no cache key inclusion or cache bypass for folderBoost was found.",
    "alternativeExplanation": "folderBoost could be intentionally presentation-only, but it mutates similarity, sorts results, stamps final rank scores, and the response is cached, so it is ranking-affecting.",
    "finalSeverity": "P1",
    "confidence": 0.9,
    "downgradeTrigger": "Downgrade if cache writes are proven disabled for every folderBoost call path or folderBoost is added to the cache key before formatted response caching.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
    ]
  },
  {
    "findingId": "F002",
    "claim": "folderBoost multiplies raw 0..100 similarity and clamps to 1.0, so matching vector hits can be ranked below unboosted vector hits.",
    "evidenceRefs": [
      ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:446-448",
      ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:77-88",
      ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:64-75",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:651-678",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1664-1729"
    ],
    "counterevidenceSought": "Checked the vector similarity producer, formatter type contract, canonical score resolver, and folderBoost implementation; only the canonical resolver normalizes similarity/100, while folderBoost uses raw similarity.",
    "alternativeExplanation": "Some non-vector rows may carry 0..1 similarity, but vector search and the formatter explicitly use 0..100, so mixed result sets remain vulnerable.",
    "finalSeverity": "P1",
    "confidence": 0.88,
    "downgradeTrigger": "Downgrade if all rows reaching applyFolderBoostRanking are normalized to 0..1 before that function or if folderBoost is rewritten to use the canonical effective score aliases.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
    ]
  },
  {
    "findingId": "F003",
    "claim": "memory_search documents and implements retrievalLevel, but strict public schemas omit it, so public callers cannot select local/global/auto retrieval.",
    "evidenceRefs": [
      ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:919-925",
      ".opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts:447-453",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:320-358",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:827",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1160-1168",
      ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:28-32",
      ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:186-220",
      ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:620-623",
      ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:240-351"
    ],
    "counterevidenceSought": "Checked the strict Zod schema, allowed parameter list, JSON tool schema, handler type, handler destructuring, and advertised server/hook instructions.",
    "alternativeExplanation": "retrievalLevel might be internal-only, but server instructions and hook routing explicitly instruct clients to pass it to memory_search.",
    "finalSeverity": "P1",
    "confidence": 0.9,
    "downgradeTrigger": "Downgrade if the public instructions remove retrievalLevel guidance or the public schemas and cache key are updated to accept it consistently.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
    ]
  }
]
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:6-13` | Search/retrieval scope maps to shipped code; public retrievalLevel contract drift recorded as F003. |
| checklist_evidence | blocked | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/A-search-retrieval/spec.md:3-18` | Scope folder has no checklist. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, traceability, maintainability
- Novelty justification: findings require cross-file reasoning across handler, cache key, schema, and producer score-scale contracts.

## Ruled Out
- P0 severity: no evidence of data loss, privilege bypass, or security exploit in this iteration.
- Inference-only issues in calibration, trigger embedding backfill, and recovery payload SQL were not recorded.

## Dead Ends
- Full security review was not completed because `config.maxIterations=1` stopped the loop after this pass.

## Recommended Next Focus
Run a security-focused pass over governed retrieval fallback/community search, plus regression tests around cache keys for `folderBoost` and any future `retrievalLevel` exposure.
Review verdict: CONDITIONAL
