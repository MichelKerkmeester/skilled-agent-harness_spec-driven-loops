# Iteration 007 — correctness

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:28:35.928Z
- New findings: 3 (of 3 reported; prior total 20)
- Coverage: {"filesExamined":21,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/deep-improvement-common-ledger-schema.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-reducers/deep-improvement-common-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-artifact-material.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-resume-adapter/deep-improvement-common-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-certificates/model-benchmark-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-reducers/skill-benchmark-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-certificates/skill-benchmark-certificates.ts"]}

## Summary
I traced the common ledger, reducers, sealed-artifact readers, certificate issuance, rollback/resume adapters, and agent/model/skill variants. Three concrete correctness gaps remain. Mode certificates synthesize ledger head sequences, artifact provenance is not bound to scoped identities, and Model Benchmark score references lack source ownership validation. No known finding was reclassified in this pass.

## Findings
- [P1] F-007-01 Mode certificate receipts fabricate ledger head sequences @ .opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts:1026
  - evidence: certificateUnsignedReceipt() sets result_head.sequence to body.receiptDigests.length even though finalHeadHash comes from the covered ledger frame at lines 1193-1230; transition receipts similarly derive head sequences from attemptNumber at lines 359 and 364 instead of resultEvent.frame.sequence. Verification re-derives the same synthetic values, so signatures remain valid for false ledger positions. The agent, model, and skill certificate emitters contain the same receipt-count sequence pattern.
  - recommendation: Derive certificate head sequences from the actual replay range and transition head sequences from the verified ledger frame. Enforce those equalities during offline verification across all four mode emitters.
- [P1] F-007-02 Artifact origin validation omits scoped identity binding @ .opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts:630
  - evidence: assertArtifactOrigin() checks only origin eventId, eventStem, and payloadDigest at lines 634-643. It never compares the authorized event scope or data to the material's candidateId, evaluatorEpochId, canaryEpochId, or promotion identity. The certificate then copies candidateMaterial.candidateId directly into the body at line 1204 without comparing it with the replayed projection. A candidate artifact for B can therefore name an exact authorized event for A as its origin while the certificate reports B.
  - recommendation: Add per-artifact-kind origin constraints that validate run, lineage, candidate, epoch, and promotion identities against the origin event scope/data and the reducer projection; apply the same checks in agent, model, and skill certificate paths.
- [P1] F-007-03 Model score references are not ownership-bound to the target trial @ .opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts:480
  - evidence: assertSource() only checks event ID, stem, and optional payload digest at lines 377-395. score_vector_observed calls it with the observation event and digest at lines 478-483, but does not compare candidateId, trialId, taskInstanceId, or trialMatrixKey. The reducer then records the target scope's candidate/trial together with the referenced observationEventId at lines 1141-1161, while the projection validator performs no semantic reference validation. A score for one candidate can therefore cite an observation from another candidate's trial and enter ranking.
  - recommendation: Resolve the referenced event's full typed scope and require ownership equality with the scoring event, including candidate, trial, task, and matrix identity. Apply equivalent checks to usage and judge references.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 7,
  "dimension": "correctness",
  "summary": "I traced the common ledger, reducers, sealed-artifact readers, certificate issuance, rollback/resume adapters, and agent/model/skill variants. Three concrete correctness gaps remain. Mode certificates synthesize ledger head sequences, artifact provenance is not bound to scoped identities, and Model Benchmark score references lack source ownership validation. No known finding was reclassified in this pass.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Mode certificate receipts fabricate ledger head sequences",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts",
      "line": 1026,
      "evidence": "certificateUnsignedReceipt() sets result_head.sequence to body.receiptDigests.length even though finalHeadHash comes from the covered ledger frame at lines 1193-1230; transition receipts similarly derive head sequences from attemptNumber at lines 359 and 364 instead of resultEvent.frame.sequence. Verification re-derives the same synthetic values, so signatures remain valid for false ledger positions. The agent, model, and skill certificate emitters contain the same receipt-count sequence pattern.",
      "recommendation": "Derive certificate head sequences from the actual replay range and transition head sequences from the verified ledger frame. Enforce those equalities during offline verification across all four mode emitters."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Artifact origin validation omits scoped identity binding",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts",
      "line": 630,
      "evidence": "assertArtifactOrigin() checks only origin eventId, eventStem, and payloadDigest at lines 634-643. It never compares the authorized event scope or data to the material's candidateId, evaluatorEpochId, canaryEpochId, or promotion identity. The certificate then copies candidateMaterial.candidateId directly into the body at line 1204 without comparing it with the replayed projection. A candidate artifact for B can therefore name an exact authorized event for A as its origin while the certificate reports B.",
      "recommendation": "Add per-artifact-kind origin constraints that validate run, lineage, candidate, epoch, and promotion identities against the origin event scope/data and the reducer projection; apply the same checks in agent, model, and skill certificate paths."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Model score references are not ownership-bound to the target trial",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts",
      "line": 480,
      "evidence": "assertSource() only checks event ID, stem, and optional payload digest at lines 377-395. score_vector_observed calls it with the observation event and digest at lines 478-483, but does not compare candidateId, trialId, taskInstanceId, or trialMatrixKey. The reducer then records the target scope's candidate/trial together with the referenced observationEventId at lines 1141-1161, while the projection validator performs no semantic reference validation. A score for one candidate can therefore cite an observation from another candidate's trial and enter ranking.",
      "recommendation": "Resolve the referenced event's full typed scope and require ownership equality with the scoring event, including candidate, trial, task, and matrix identity. Apply equivalent checks to usage and judge references."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 21,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/deep-improvement-common-ledger-schema.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-reducers/deep-improvement-common-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-artifact-material.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-resume-adapter/deep-improvement-common-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-certificates/model-benchmark-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-reducers/skill-benchmark-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-certificates/skill-benchmark-certificates.ts"
    ]
  }
}
```