# Iteration 1: Correctness

## Focus

- Dimension: Correctness
- Scope: confidence rebalance and calibration loader/wiring surfaces named by the target packet.
- Boundaries: target files read-only; outputs only under the lineage artifact directory.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Starter labeled set cannot be loaded by the shipped loader. `loadLabeledSet()` rejects anything that is not a top-level array [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts:73-76], but the bundled generator writes an object with metadata and a `pairs` array [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs:168-181], and the checked-in starter artifact has that object shape [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json:1-5]. This breaks the shipped end-to-end starter path unless every consumer manually unwraps `.pairs`, which is not covered by the loader contract or tests.

### P2, Suggestion

- None.

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "The bundled starter labeled-set artifact cannot be accepted by the shipped loadLabeledSet() API because the loader requires a top-level array while the generator and artifact emit an object containing pairs.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts:73-76",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs:168-181",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json:1-5"
  ],
  "counterevidenceSought": "Read confidence-calibration.vitest.ts loader tests, fit-calibration.mjs writer code, the generated starter JSON header, spec.md scope, and implementation-summary.md delivery claims. No adapter or loader branch accepting { pairs: [...] } was found in the reviewed files.",
  "alternativeExplanation": "The starter artifact may have been intended for human inspection with callers manually passing .pairs, but the delivered loader and tests do not document or enforce that adapter path, while the packet presents the starter set and loader as a shipped end-to-end path.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade to P2 if a documented consumer unwraps the pairs field before calling loadLabeledSet(), or if loadLabeledSet() is updated and tested to accept the generated starter artifact shape.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:78-79; confidence-calibration.ts:73-76 | Calibration infrastructure exists, but the starter labeled-set artifact does not load through the shipped loader. |
| checklist_evidence | partial | hard | tasks.md:65-78 | Checked task rows exist; target strict validation later passed with 0 errors and 0 warnings. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: one new P1 with direct source and artifact evidence.
- Provisional verdict: CONDITIONAL

## Ruled Out

- Calibration accidentally default-on: `maybeCalibrate()` returns early when `SPECKIT_CONFIDENCE_CALIBRATION` is not truthy and the flag helper is explicit opt-in.

## Dead Ends

- Memory retrieval through the provided/blank session id failed with `E_SESSION_SCOPE`; direct packet/source reads were used instead.

## Recommended Next Focus

Run traceability after remediating or accepting F001: check whether task completion criteria and implementation-summary verification claims still match the corrected starter-set path.
Review verdict: CONDITIONAL
