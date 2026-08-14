# Iteration 039 — correctness

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T09:17:24.991Z
- New findings: 2 (of 2 reported; prior total 162)
- Coverage: {"filesExamined":13,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs",".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs",".opencode/commands/deep/assets/deep-alignment-auto.yaml",".opencode/skills/system-deep-loop/runtime/tests/unit/leaf-artifact-writer.vitest.ts"]}

## Summary
I traced the alignment artifact path end to end through scoping, read-only leaf persistence, reduction, convergence, and terminal synthesis. The known sealing, failed-iteration, and lane-identity defects remain reproducible, while the earlier missing-corpus and out-of-corpus coverage defects have been corrected. A separate schema-reconciliation gap still permits a leaf to report findings that disappear before verdict calculation, producing an authoritative false PASS. The writer's non-atomic persistence sequence also contradicts its retry contract and can permanently strand an iteration after a partial filesystem failure.

## Findings
- [P0] F-039-01 Reported finding counts can disappear before verdict reduction @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts:145
  - evidence: validateReported requires findingsCount only by field presence and validates neither its numeric shape nor equality with findingDetails/deltaFindings. Lines 228-237 then permit an empty delta when findingDetails is absent. reduce-alignment-state.cjs lines 396-404 and 450-465 derive blockers exclusively from structured finding rows, never findingsCount, so a payload with findingsCount:1, full artifactsChecked coverage, and no details is accepted and can reduce to PASS.
  - recommendation: Require a non-negative integer findingsCount, validate findingDetails and deltaFindings schemas, require both representations to describe the same lane and findings, and fail reducer integrity whenever the count, embedded details, and delta rows disagree.
- [P1] F-039-02 Leaf artifact persistence is not all-or-nothing @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts:253
  - evidence: writeLeafArtifacts writes the narrative, then the write-once delta, then appends the state record at lines 253-255. Any failure after the first write returns ok:false without rollback; a retry then fails immediately because the delta already exists at lines 250-252, leaving the iteration permanently unpersistable despite the documented all-or-nothing and redispatch contract.
  - recommendation: Stage all three artifacts under temporary names, append or replace through a recoverable transaction protocol, and remove staged/partial outputs on failure. Make retry detection distinguish a complete committed iteration from recoverable partial files.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 39,
  "dimension": "correctness",
  "summary": "I traced the alignment artifact path end to end through scoping, read-only leaf persistence, reduction, convergence, and terminal synthesis. The known sealing, failed-iteration, and lane-identity defects remain reproducible, while the earlier missing-corpus and out-of-corpus coverage defects have been corrected. A separate schema-reconciliation gap still permits a leaf to report findings that disappear before verdict calculation, producing an authoritative false PASS. The writer's non-atomic persistence sequence also contradicts its retry contract and can permanently strand an iteration after a partial filesystem failure.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Reported finding counts can disappear before verdict reduction",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",
      "line": 145,
      "evidence": "validateReported requires findingsCount only by field presence and validates neither its numeric shape nor equality with findingDetails/deltaFindings. Lines 228-237 then permit an empty delta when findingDetails is absent. reduce-alignment-state.cjs lines 396-404 and 450-465 derive blockers exclusively from structured finding rows, never findingsCount, so a payload with findingsCount:1, full artifactsChecked coverage, and no details is accepted and can reduce to PASS.",
      "recommendation": "Require a non-negative integer findingsCount, validate findingDetails and deltaFindings schemas, require both representations to describe the same lane and findings, and fail reducer integrity whenever the count, embedded details, and delta rows disagree."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Leaf artifact persistence is not all-or-nothing",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",
      "line": 253,
      "evidence": "writeLeafArtifacts writes the narrative, then the write-once delta, then appends the state record at lines 253-255. Any failure after the first write returns ok:false without rollback; a retry then fails immediately because the delta already exists at lines 250-252, leaving the iteration permanently unpersistable despite the documented all-or-nothing and redispatch contract.",
      "recommendation": "Stage all three artifacts under temporary names, append or replace through a recoverable transaction protocol, and remove staged/partial outputs on failure. Make retry detection distinguish a complete committed iteration from recoverable partial files."
    }
  ],
  "refutations": [
    {
      "id": "F-RES-04",
      "verdict": "deepened",
      "reason": "LeafArtifactContext contains only output paths and iteration number; validateReported accepts any laneId and any artifactsChecked string array without binding either to the dispatched slice. The same validation also fails to reconcile findingsCount with structured evidence."
    },
    {
      "id": "F-RES-03",
      "verdict": "confirmed",
      "reason": "reduce-alignment-state.cjs lines 393-425 includes every matching iteration regardless of status when crediting artifacts. check-convergence.cjs lines 84-99 and 236-247 likewise includes timeout/error/stuck records in iteration counts and dry-run stability."
    },
    {
      "id": "F-RES-02",
      "verdict": "confirmed",
      "reason": "buildOverallRollup computes sealed as integrity.sealed === true && !integrityFault at line 641. discoveryIncomplete and incompleteCoverage are separate conditions, so direct --seal invocation can mark pre-discovery or incomplete evidence authoritative."
    },
    {
      "id": "F-RES-01",
      "verdict": "confirmed",
      "reason": "deep-alignment-auto.yaml invokes the reducer with --seal at line 777 and then unconditionally advances to step_mark_config_complete at lines 785-787; no branch checks the returned sealed value or reducer verdict before completion."
    },
    {
      "id": "F-009-01",
      "verdict": "refuted",
      "reason": "check-convergence.cjs now distinguishes absent discovery at lines 285-355 and corrupt corpus/config at lines 278-324, returning DISCOVERY_INCOMPLETE or INTEGRITY_FAILURE with zero authoritative coverage instead of 100%."
    },
    {
      "id": "F-009-02",
      "verdict": "refuted",
      "reason": "reduce-alignment-state.cjs lines 440-492 intersects reported identifiers with the canonical corpus and credits only that intersection. check-convergence.cjs lines 388-401 additionally requires identityVerified before coverage can converge."
    },
    {
      "id": "F-009-03",
      "verdict": "confirmed",
      "reason": "scoping.cjs lines 55-68 and 181-200 supports multiple adapter variants for one authority, but reduce-alignment-state.cjs laneKey lines 107-115 omits adapter and resolveRequiredLanes lines 310-315 discards it. Two otherwise identical lanes using different adapters therefore share one identity."
    }
  ],
  "coverage": {
    "filesExamined": 13,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",
      ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs",
      ".opencode/commands/deep/assets/deep-alignment-auto.yaml",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/leaf-artifact-writer.vitest.ts"
    ]
  }
}
```