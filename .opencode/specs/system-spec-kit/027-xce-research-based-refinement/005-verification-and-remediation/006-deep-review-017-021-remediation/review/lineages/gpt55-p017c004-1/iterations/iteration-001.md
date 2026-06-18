# Iteration 001: Correctness And Starter-Artifact Contract

## Focus

- Dimension: correctness
- Scope: calibration loader, starter labeled-set generator, starter JSON artifact, feature spec, implementation summary
- Bound artifact directory: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review/lineages/gpt55-p017c004-1`
- Constraint: target files were read-only; only lineage artifacts were written.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 5 primary files plus exact-search corroboration
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0
- Stop condition: maxIterationsReached after this single fan-out lineage iteration

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Starter labeled-set file is not loadable by the shipped labeled-set loader, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json:1-5`. `loadLabeledSet()` rejects anything except a top-level array [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts:73-76`]. The generator advertises the starter as `({query, memoryId, relevant}[])` [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs:5-6`] but writes an object wrapper with metadata and `pairs` [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs:168-181`], and the shipped starter file starts with that object shape [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json:1-5`]. A read-only reproduction that parsed the starter file and called `loadLabeledSet()` returned `labeled set must be a JSON array of {query, memoryId, relevant}`. This breaks the handoff path for the documented follow-up: the delivered starter labeled-set artifact cannot be consumed by the delivered loader without an undocumented unwrap step.

```json
{
  "findingId": "F001",
  "claim": "The shipped starter labeled-set artifact cannot be loaded by the shipped loadLabeledSet() contract because the artifact is metadata-wrapped while the loader only accepts a top-level pair array.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts:73-76",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs:5-6",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs:168-181",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json:1-5"
  ],
  "counterevidenceSought": "Searched the repo for loadLabeledSet consumers and starter-file loading tests; read confidence-calibration.vitest.ts and found only top-level array tests, not the shipped starter artifact. Ran a read-only Node reproduction against the shipped starter file and loader.",
  "alternativeExplanation": "The metadata wrapper may be intentional for provenance, but then the loader contract or docs need to accept that wrapper. Today the only exported loader rejects it, so the starter artifact is not self-consumable.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if a documented separate normalizer or CLI path is identified that is the intended consumer of confidence-labeled-set.starter.json and is covered by a regression test.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery in correctness pass"
    }
  ]
}
```

### P2, Suggestion

- None new in this lineage. Existing sibling lineages already recorded model bloat and boolean-edge test coverage; this pass did not duplicate those findings.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `confidence-calibration.ts:73-76`, `confidence-labeled-set.starter.json:1-5` | Core code is production-inert, but the starter labeled-set artifact does not satisfy the loader contract. |
| `checklist_evidence` | notApplicable | hard | target folder has no `checklist.md` | Level 1 packet; no checklist evidence protocol to execute. |
| `feature_catalog_code` | pass | advisory | `search-flags.ts:613-644`, `confidence-scoring.ts:217-222` | Calibration remains opt-in and additionally requires a model path. |

## Assessment

- New findings ratio: 1.0
- Dimensions addressed: correctness
- Novelty justification: This pass adds a compatibility finding not present in the inspected sibling lineage summaries. It is not a production hot-path failure, but it breaks the labeled-set follow-up artifact/loader contract.
- Provisional verdict for this iteration: CONDITIONAL because one P1 finding is active.

## Ruled Out

- Production flag unsafe by default: ruled out. `isConfidenceCalibrationEnabled()` is explicit opt-in [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:613-623`], and `maybeCalibrate()` returns the rebalance-only value when the flag is off or no model is available [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:217-222`].
- Request-quality S2 regression: not supported by this pass. `assessRequestQuality()` remains separate and was not modified by the labeled-set loader issue [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:385-436`].

## Dead Ends

- Code graph outline could not be used because the graph reported stale readiness and required a full scan. Direct reads and exact Grep supplied the evidence for this lineage.
- `memory_context` prior-context loading was blocked by `E_SESSION_SCOPE`; packet-local docs supplied the prior context.

## Recommended Next Focus

Fix F001 by aligning the asset shape with `loadLabeledSet()` or widening `loadLabeledSet()` to accept the shipped wrapper. Add a regression that parses `confidence-labeled-set.starter.json` and verifies the loader returns 100 pairs.
Review verdict: CONDITIONAL
