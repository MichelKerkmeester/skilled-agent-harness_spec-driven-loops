# Iteration 001: Correctness

## Focus

Dimension: correctness. Reviewed advisor BM25 phase implementation against production scorer wiring and phase 003 acceptance claims.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0000

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: Advisor BM25 shadow lane is never consumed by production fusion. `fusion.ts` imports only `scoreLexicalLane`, not `scoreLexicalShadowLanes`, and `buildLaneScores` assigns `scores.lexical = scoreLexicalLane(...)` with no BM25/shadow branch [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:17`, `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:191-194`]. The BM25 wrapper exists behind `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW` [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts:99-107`] and registry metadata exists [SOURCE: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:21-28`], but Grep found production references only in tests and the wrapper module. This means phase 003's "shadow lane" is unit-testable but not observable through `advisor_recommend` or production `scoreAdvisorPrompt`, so the feature cannot generate the shadow telemetry needed for future validation.

#### Claim Adjudication Packet: F001

```json
{
  "findingId": "F001",
  "claim": "The advisor BM25 shadow lane is implemented as a helper but is not consumed by the production scorer fusion path.",
  "evidenceRefs": [
    ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:17",
    ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:191-194",
    ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts:99-107",
    ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:21-28"
  ],
  "counterevidenceSought": "Searched system-skill-advisor for scoreLexicalShadowLanes, SHADOW_SCORER_LANE_DEFINITIONS, ADVISOR_BM25_LEXICAL_SHADOW, scoreBm25LexicalShadowLane, and bm25_lexical_shadow; non-test production usage was not found outside metadata/helper definitions.",
  "alternativeExplanation": "The phase summary says scoreAdvisorPrompt intentionally does not consume BM25 in this phase; that explains the current code but contradicts the spec's shadow-validation purpose and leaves no production shadow signal.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if the phase is formally re-scoped as a library-only helper, or if production scorer output exposes BM25 shadow telemetry without affecting live weights.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical/spec.md:103-106` | BM25 helper exists, but production shadow validation path is absent. |

## Assessment

- New findings ratio: 1.0000
- Dimensions addressed: correctness
- Novelty justification: Found a production reachability gap not covered by focused helper tests.

## Ruled Out

- Prompt-safety leak in BM25 helper: no raw prompt exposure was found in public output because BM25 is not production-consumed.

## Dead Ends

- Code graph structural query: readiness was stale, so direct Grep/Read evidence was used.

## Recommended Next Focus

Review code-graph trace/default-off surfaces and public schema reachability.
Review verdict: CONDITIONAL
