# Iteration 006 — correctness

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:19:00.113Z
- New findings: 4 (of 4 reported; prior total 16)
- Coverage: {"filesExamined":24,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers/deep-ai-council-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-reducers/deep-alignment-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-sealed-artifacts/deep-ai-council-artifact-material.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/deep-ai-council-resume-adapter.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-rollback-gate/mode-gate.ts"]}

## Summary
Examined the council and alignment parity harnesses, typed reducers, certificate/artifact correspondence, resume paths, and rollback evaluators. Both parity harnesses derive the legacy comparison from the same typed replay state, while the council reducer permits cross-round references and unstarted rounds. Council certificates also fail to bind artifact scope to the covered event scope. The rollback-window trust issue appears in both target families, deepening F-005-02.

## Findings
- [P1] F-006-01 Council parity discards the real reducer projection @ .opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts:1263
  - evidence: councilLedgerProjection calls foldDeepAiCouncilEvents only to check that folding succeeds, then returns councilProjectionFromEvents; councilLegacyProjection returns the same helper directly. replayState therefore fingerprints identical raw-event projections for both paths, so reducer-specific semantic divergence cannot produce a parity diff.
  - recommendation: Use the actual folded council projection for the ledger path and an independently implemented legacy oracle for the legacy path; compare their canonical projections and event observations before issuing parity evidence.
- [P1] F-006-02 Alignment parity derives both paths from one typed projection @ .opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts:793
  - evidence: legacyProjection first calls foldProjection, which invokes foldDeepAlignmentEvents, then creates projectDeepAlignmentLegacyView from that already-folded state and returns projectionView of the same state. ledgerProjection also returns projectionView(foldProjection(events)), so the legacy and ledger fingerprints share the same reducer output.
  - recommendation: Make the legacy executor replay an independent legacy representation or oracle and make only the ledger executor depend on foldDeepAlignmentEvents; compare the independent outputs rather than a view of the same state.
- [P1] F-006-03 Council source references ignore round identity @ .opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers/deep-ai-council-reducer.ts:651
  - evidence: assertProposalReferences builds a Set of proposalId values without roundId. The same reducer stores proposals with the composite roundId:proposalId key at lines 562 and 639, while candidate, judgment, and stance checks likewise compare only candidateId or judgmentId. A round-B event can therefore cite an identically named proposal, candidate, or judgment captured only in round A.
  - recommendation: Resolve every round-owned reference with a composite roundId plus local ID and require referenced events and projection rows to share the source event's round.
- [P1] F-006-04 Council certificates do not bind artifact scope to event scope @ .opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts:454
  - evidence: sourceRangeMatchesEvent checks only sourceEventRange.lastEventId, lastStem, and authorityEpoch. It never compares the artifact material scope.runId or scope.roundId with the matched event payload scope. verifiedArtifactSet and verifyArtifacts read artifacts without expectedScope, and assertArtifactEventsAuthorized accepts any artifact with exactly one such match.
  - recommendation: Require artifact scope.runId and scope.roundId to match the covered run and event, validate the complete source range on the same stream, and pass explicit scope expectations through both issuance and offline verification.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 6,
  "dimension": "correctness",
  "summary": "Examined the council and alignment parity harnesses, typed reducers, certificate/artifact correspondence, resume paths, and rollback evaluators. Both parity harnesses derive the legacy comparison from the same typed replay state, while the council reducer permits cross-round references and unstarted rounds. Council certificates also fail to bind artifact scope to the covered event scope. The rollback-window trust issue appears in both target families, deepening F-005-02.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Council parity discards the real reducer projection",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts",
      "line": 1263,
      "evidence": "councilLedgerProjection calls foldDeepAiCouncilEvents only to check that folding succeeds, then returns councilProjectionFromEvents; councilLegacyProjection returns the same helper directly. replayState therefore fingerprints identical raw-event projections for both paths, so reducer-specific semantic divergence cannot produce a parity diff.",
      "recommendation": "Use the actual folded council projection for the ledger path and an independently implemented legacy oracle for the legacy path; compare their canonical projections and event observations before issuing parity evidence."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Alignment parity derives both paths from one typed projection",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts",
      "line": 793,
      "evidence": "legacyProjection first calls foldProjection, which invokes foldDeepAlignmentEvents, then creates projectDeepAlignmentLegacyView from that already-folded state and returns projectionView of the same state. ledgerProjection also returns projectionView(foldProjection(events)), so the legacy and ledger fingerprints share the same reducer output.",
      "recommendation": "Make the legacy executor replay an independent legacy representation or oracle and make only the ledger executor depend on foldDeepAlignmentEvents; compare the independent outputs rather than a view of the same state."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Council source references ignore round identity",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers/deep-ai-council-reducer.ts",
      "line": 651,
      "evidence": "assertProposalReferences builds a Set of proposalId values without roundId. The same reducer stores proposals with the composite roundId:proposalId key at lines 562 and 639, while candidate, judgment, and stance checks likewise compare only candidateId or judgmentId. A round-B event can therefore cite an identically named proposal, candidate, or judgment captured only in round A.",
      "recommendation": "Resolve every round-owned reference with a composite roundId plus local ID and require referenced events and projection rows to share the source event's round."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Council certificates do not bind artifact scope to event scope",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts",
      "line": 454,
      "evidence": "sourceRangeMatchesEvent checks only sourceEventRange.lastEventId, lastStem, and authorityEpoch. It never compares the artifact material scope.runId or scope.roundId with the matched event payload scope. verifiedArtifactSet and verifyArtifacts read artifacts without expectedScope, and assertArtifactEventsAuthorized accepts any artifact with exactly one such match.",
      "recommendation": "Require artifact scope.runId and scope.roundId to match the covered run and event, validate the complete source range on the same stream, and pass explicit scope expectations through both issuance and offline verification."
    }
  ],
  "refutations": [
    {
      "id": "F-005-02",
      "verdict": "deepened",
      "reason": "The same rollback-window logic appears in both target families: deep-alignment mode-gate.ts counts syntactically valid trusted-completion rows at lines 718-768, and deep-ai-council mode-gate.ts does so at lines 637-690 without authenticating the referenced certificate or execution attestation."
    }
  ],
  "coverage": {
    "filesExamined": 24,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers/deep-ai-council-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-reducers/deep-alignment-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-sealed-artifacts/deep-ai-council-artifact-material.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-resume-adapter/deep-ai-council-resume-adapter.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-rollback-gate/mode-gate.ts"
    ]
  }
}
```