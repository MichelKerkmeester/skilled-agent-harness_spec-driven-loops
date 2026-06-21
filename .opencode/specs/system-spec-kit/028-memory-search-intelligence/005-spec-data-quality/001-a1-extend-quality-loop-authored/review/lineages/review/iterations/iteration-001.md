# Iteration 1: Correctness

## Focus
Correctness of the proposed A1 approach as documented in `spec.md` and `plan.md`. The phase is PLANNED (no code shipped), so correctness here means: does the documented build logic hold against the real shipped symbols it reuses, and are the named reuse seams behaviourally what the spec claims?

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 7 (spec.md, plan.md, tasks.md, implementation-summary.md + 3 cited source files)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker
- None.

### P1, Required
- None.

### P2, Suggestion
- **F002**: Scorer input shape unspecified for the JSON payload, `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:398`. REQ-001 says H1 will "compute `computeMemoryQualityScore` on the payload" (`spec.md:107`). The shipped scorer's signature is `computeMemoryQualityScore(content, metadata)` (`mcp_server/handlers/quality-loop.ts:392`) and every existing caller passes a **string** `content` (`quality-loop.ts:596`, `:609`). The H1 seam scores a metadata **object**, not a string body, so the plan must state how the object is rendered into the scorer's `content` argument (e.g. `JSON.stringify`) or the score will be computed over an unintended shape. Build-detail ambiguity, not a logic error.

#### Claim Adjudication
```json
{
  "findingId": "F002",
  "claim": "H1 must serialize the metadata JSON object before passing it to computeMemoryQualityScore, but neither spec.md nor plan.md states how, leaving the scorer's content argument shape undefined.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:392",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:596",
    ".opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-a1-extend-quality-loop-authored/spec.md:107"
  ],
  "counterevidenceSought": "Read the computeMemoryQualityScore signature and its two in-repo call sites in runQualityLoop; checked spec.md REQ-001 and plan.md H1 architecture bullet for any serialization note. None found.",
  "alternativeExplanation": "The implementer may treat 'payload' as already-stringified at the atomicWriteJson seam (atomicWriteJson serializes internally at generate-context.ts:405), in which case the score would run over the serialized form by convention. Plausible but undocumented, so the ambiguity stands as advisory.",
  "finalSeverity": "P2",
  "confidence": 0.74,
  "downgradeTrigger": "Resolved (not merely downgraded) once plan.md names the serialization step or the scorer overload accepting an object.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | quality-loop.ts:392, generate-context.ts:398 | Reuse symbols exist and are correctly located; one input-shape gap (F002) |
| checklist_evidence | pass | hard | checklist.md:81-85 | Checklist items map to acceptance criteria; all PENDING as expected for PLANNED |

## Assessment
- New findings ratio: 1.0 (first pass, all-new)
- Dimensions addressed: correctness
- Novelty justification: First dimension pass. The reuse-first logic is sound: the spec correctly excludes the destructive `runQualityLoop` (`quality-loop.ts:582`) whose `attemptAutoFix` trims via `substring` to an 8000-char budget (`quality-loop.ts:465-467`, budget `DEFAULT_CHAR_BUDGET` at `:85`). The amputation hazard the spec cites is real and accurately characterised. Only the scorer input-shape detail is under-specified.

## Ruled Out
- "The plan reaches the destructive loop": ruled out. `spec.md:79` and `plan.md:108` explicitly fence `runQualityLoop`/`attemptAutoFix` out of scope, and the reuse is import-only of the pure export. No correctness P0/P1.

## Dead Ends
- Searching for a shipped object-accepting overload of `computeMemoryQualityScore`: only the `(content: string, metadata)` form exists.

## Recommended Next Focus
Security dimension: confirm the report-only, default-off-warn posture introduces no new trust-boundary or secret-exposure surface, and that the malformed-JSON edge case fails open (writes) rather than blocking.

Review verdict: PASS
