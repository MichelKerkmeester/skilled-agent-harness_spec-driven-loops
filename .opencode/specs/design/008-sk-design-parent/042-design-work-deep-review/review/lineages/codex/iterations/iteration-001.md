# Iteration 1: Correctness - Guided Run Argument And Output Handling

## Focus

Dimension: correctness.

Reviewed the md-generator guided wrapper and the downstream extractor guard. The target behavior is a wrapper that checks readiness, plans extraction/write-prompt/validation, and never authors `DESIGN.md`.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 4
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.86

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: Guided-run parser accepts flag values as the URL or missing flag values as output paths. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:47]
  `parseGuidedRunArgs` sets `url` to the first non-flag token and `readValue('--output')` returns `args[index + 1]` without proving that the value exists or is not another flag. A command like `guided-run --output out --dry-run` can treat `out` as the URL, while `guided-run https://example.com --output --fast` can treat `--fast` as the output path. The wrapper later creates the output directory and writes the generated prompt path when a run proceeds. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:136]

Typed claim-adjudication packet:

```json
{
  "findingId": "F001",
  "claim": "Guided-run can accept missing positional or flag values instead of failing usage before extraction planning.",
  "evidenceRefs": [
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:47-65",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:136-143"
  ],
  "counterevidenceSought": "Checked extract.ts for downstream URL/output validation and guided-run tests for missing-value coverage.",
  "alternativeExplanation": "Downstream extract.ts has its own output guard, but guided-run still owns preflight and command planning and does not validate missing URL or missing --output values itself.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "If guided-run delegates all argument validation to extract.ts and adds tests proving no output directory or network action can start with malformed guided-run arguments, downgrade to P2.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial evidence-backed discovery"
    }
  ]
}
```

### P2, Suggestion

- **F002**: Guided-run preflight reports the exact skill root output path as safe. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:79]
  `runPreflight` rejects descendants via `startsWith(SKILL_ROOT + path.sep)`, but misses `outputPath === SKILL_ROOT`. The downstream extractor does reject both exact root and descendants, so this is not a release-blocking write bug; it is a dry-run/readiness parity problem. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:266]

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pending | hard | n/a | Deferred to traceability pass. |
| checklist_evidence | pending | hard | n/a | Deferred to traceability pass. |

## Assessment

- New findings ratio: 0.86
- Dimensions addressed: correctness
- Novelty justification: first pass found the only active required finding in the lineage.

## Ruled Out

- Exact skill-root output write from the extractor itself: `extract.ts` rejects `resolvedOut === skillRoot` before creating extraction artifacts. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:266]

## Dead Ends

- Live extraction smoke was out of scope because it would require network/browser side effects.

## Recommended Next Focus

Security and trust-boundary pass across deterministic gates and write-scope checks.
Review verdict: CONDITIONAL
