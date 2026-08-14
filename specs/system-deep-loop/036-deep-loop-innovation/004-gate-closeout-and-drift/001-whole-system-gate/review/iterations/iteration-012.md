# Iteration 012 — correctness

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:57:42.398Z
- New findings: 4 (of 4 reported; prior total 40)
- Coverage: {"filesExamined":20,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/agent-improvement-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/deep-ai-council-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-resume-adapter/deep-alignment-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-resume-adapter/deep-improvement-common-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-resume-adapter/model-benchmark-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-resume-adapter/skill-benchmark-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts"]}

## Summary
The resume adapters and shadow-parity harnesses were examined across reducer folding, effect recovery, lease checks, and comparator construction. The strongest new risk is parity false confidence: several ledger paths execute the typed reducer only as a validity gate, then return the legacy projection as the ledger result. Deep Review additionally converts reducer exceptions and rebuild outcomes into legacy success, allowing reducer failure to pass parity. Common and Research mappings were materially distinct; the known Council and Alignment parity defects were confirmed and deepened.

## Findings
- [P1] F-012-01 Agent-improvement ledger parity returns the legacy projection @ .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts:850
  - evidence: ledgerProjection calls foldAgentImprovementEvents and stores folded.projection in state, but computes stateDigest only as a SHA-256 availability check and returns legacyProjection(events, resumeEvidence) spread into the result. The typed reducer projection is never mapped into the ledger parity output.
  - recommendation: Construct the ledger projection from folded.projection, compare its complete semantic surface against the independent legacy projection, and remove the no-op digest gate.
- [P1] F-012-02 Model-benchmark ledger parity discards the reducer projection @ .opencode/skills/system-deep-loop/runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts:784
  - evidence: After foldModelBenchmarkEvents succeeds, ledgerProjection assigns projection = legacyProjection(events, resumeEvidence) and returns it. The folded reducer projection is used only to reject non-projected outcomes, so semantic reducer drift cannot be observed by the parity comparator.
  - recommendation: Map folded.projection into the protected ledger projection and compare all protected fields against the legacy projection before issuing parity evidence.
- [P1] F-012-03 Skill-benchmark ledger parity discards the reducer projection @ .opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts:788
  - evidence: ledgerProjection folds the events, rejects non-projected results, then assigns and returns legacyProjection(events, resumeEvidence). No field from folded.projection contributes to the returned ledger projection.
  - recommendation: Derive the ledger side from folded.projection, retain an independent legacy projection, and fail parity when their full semantic projections differ.
- [P1] F-012-04 Deep-review parity converts reducer failure into legacy success @ .opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts:1637
  - evidence: ledgerProjection catches foldDeepReviewEvents exceptions and returns legacyReviewProjection; it also returns the legacy projection when folded.outcome is not projected. When folding succeeds, it compares only run identity, generation, dimensions, and active finding IDs, then returns the canonical legacy projection.
  - recommendation: Propagate reducer exceptions and rebuild outcomes as parity failures, materialize the ledger projection from folded.projection, and compare the complete protected semantic surface rather than returning the legacy projection.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 12,
  "dimension": "correctness",
  "summary": "The resume adapters and shadow-parity harnesses were examined across reducer folding, effect recovery, lease checks, and comparator construction. The strongest new risk is parity false confidence: several ledger paths execute the typed reducer only as a validity gate, then return the legacy projection as the ledger result. Deep Review additionally converts reducer exceptions and rebuild outcomes into legacy success, allowing reducer failure to pass parity. Common and Research mappings were materially distinct; the known Council and Alignment parity defects were confirmed and deepened.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Agent-improvement ledger parity returns the legacy projection",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts",
      "line": 850,
      "evidence": "ledgerProjection calls foldAgentImprovementEvents and stores folded.projection in state, but computes stateDigest only as a SHA-256 availability check and returns legacyProjection(events, resumeEvidence) spread into the result. The typed reducer projection is never mapped into the ledger parity output.",
      "recommendation": "Construct the ledger projection from folded.projection, compare its complete semantic surface against the independent legacy projection, and remove the no-op digest gate."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Model-benchmark ledger parity discards the reducer projection",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts",
      "line": 784,
      "evidence": "After foldModelBenchmarkEvents succeeds, ledgerProjection assigns projection = legacyProjection(events, resumeEvidence) and returns it. The folded reducer projection is used only to reject non-projected outcomes, so semantic reducer drift cannot be observed by the parity comparator.",
      "recommendation": "Map folded.projection into the protected ledger projection and compare all protected fields against the legacy projection before issuing parity evidence."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Skill-benchmark ledger parity discards the reducer projection",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts",
      "line": 788,
      "evidence": "ledgerProjection folds the events, rejects non-projected results, then assigns and returns legacyProjection(events, resumeEvidence). No field from folded.projection contributes to the returned ledger projection.",
      "recommendation": "Derive the ledger side from folded.projection, retain an independent legacy projection, and fail parity when their full semantic projections differ."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Deep-review parity converts reducer failure into legacy success",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts",
      "line": 1637,
      "evidence": "ledgerProjection catches foldDeepReviewEvents exceptions and returns legacyReviewProjection; it also returns the legacy projection when folded.outcome is not projected. When folding succeeds, it compares only run identity, generation, dimensions, and active finding IDs, then returns the canonical legacy projection.",
      "recommendation": "Propagate reducer exceptions and rebuild outcomes as parity failures, materialize the ledger projection from folded.projection, and compare the complete protected semantic surface rather than returning the legacy projection."
    }
  ],
  "refutations": [
    {
      "id": "F-006-01",
      "verdict": "deepened",
      "reason": "At .opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts:1254-1263, ledgerProjection folds the events only as a gate and then returns councilProjectionFromEvents; the typed folded projection is not used to build the parity result."
    },
    {
      "id": "F-006-02",
      "verdict": "confirmed",
      "reason": "At .opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts:793-807, both legacyProjection and ledgerProjection derive their output through the same foldProjection/projectionView path, so the comparator lacks an independent legacy-versus-ledger projection."
    }
  ],
  "coverage": {
    "filesExamined": 20,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/agent-improvement-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/deep-ai-council-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-resume-adapter/deep-alignment-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-resume-adapter/deep-improvement-common-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-resume-adapter/deep-review-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-resume-adapter/model-benchmark-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-resume-adapter/skill-benchmark-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts"
    ]
  }
}
```