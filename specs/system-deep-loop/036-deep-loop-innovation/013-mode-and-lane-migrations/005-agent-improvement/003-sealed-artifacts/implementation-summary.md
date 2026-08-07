---
title: "Implementation Summary: Agent Improvement Sealed Reference Artifacts"
description: "The additive-dark agent-improvement adapter binds AgentIR, change, improver, causal, proposal, trial, coverage, and four-ring references to the shared sealed artifact contract."
trigger_phrases:
  - "agent improvement sealed artifact implementation"
  - "agent improvement artifact binding"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/003-sealed-artifacts"
    last_updated_at: "2026-07-23T21:06:42Z"
    last_updated_by: "codex"
    recent_action: "Enforced expected artifact kinds for every named reference"
    next_safe_action: "Consume verified agent bindings from the certificate and receipt successor"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-sealed-artifacts.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-improvement-sealed-artifacts-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Eight agent-specific artifact kinds use closed, kind-dispatched material validators"
      - "Common evaluator visibility, common lifecycle, and common promotion reads delegate to the deep-improvement-common adapter"
      - "All 37 named reference positions are kind-checked before sealing and through verified store reads"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-sealed-artifacts |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; no ledger, reducer, projection, certificate, receipt, resume, parity, rollback, or gate changes |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The four-file module `runtime/lib/agent-improvement-sealed-artifacts/` exposes closed bindings for:

- the base AgentIR bundle;
- the typed change-contract bundle;
- the frozen improver-lane reference;
- causal failure analysis inputs;
- candidate proposal outputs;
- trial and normalized trajectory references;
- behavior-family coverage; and
- four-ring exposure manifests.

The adapter validates typed digests, bounded tokens, structured selectors, enumerated states, bounded budgets, closed nested
objects, ordered dependencies, typed ledger event stems, and digest/reference agreement. It emits only content-addressed
bindings; mutable source, report, trace, and package bodies are represented by sealed references and digests.

Named references now have an explicit expected-kind contract at both canonicalization and verified read:

| Expected kind | Named reference fields |
|---|---|
| `agent-improvement-base-agent-bundle` | base `parentAgentReference`; change `agentIrReference`; proposal `parentAgentReference`; trial `baselineAgentReference` |
| `agent-improvement-change-contract-bundle` | change `parentLineageReference`; proposal `changeContractReference`, `atomicPatchLineageReference` |
| `agent-improvement-improver-lane-reference` | proposal `improverLaneReference` |
| `agent-improvement-causal-analysis-input` | proposal `causalAnalysisReference`, `proposalRationaleReference` |
| `agent-improvement-candidate-proposal` | improver, causal, and proposal `parentCandidateReference`; trial `candidateProposalReference` |
| `prior-run-output` | causal `failureClusterReference`, `firstDivergentTraceReference`, `proposalVisibleEvidenceReference`; trial `normalizedTraceReference`, `sideEffectObservationReference`, `integrityObservationReference` |
| `configuration` | causal `counterfactualInterventionReference`; trial `executorReference`, `environmentReference`, `receiptPredicateReference` |
| `fixture` | trial `taskManifestReference`, `semanticVariantReference`, `authorityConflictReference`, `negativeCapabilityReference`; every ring `fixtureSetReference` |
| `deep-improvement-common-evaluator-capsule` | trial and exposure `evaluatorCapsuleReference` |
| `deep-improvement-common-raw-trial-output` | trial `commonRawTrialReference` |
| `deep-improvement-common-canary-epoch` | coverage `rotatingCanaryReference`; exposure `canaryEpochReference` |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module consumes `createDeepImprovementCommonArtifactCanonicalizerRegistry`, the common artifact registry and media/version
constants, `DeepImprovementCommonArtifactKinds`, `createDeepImprovementCommonSealedArtifactStore`,
`parseDeepImprovementCommonSealedArtifactBinding`, `readDeepImprovementCommonArtifact`,
`readDeepImprovementCandidateView`, `readDeepImprovementPromotionEvidence`, the common read failure types, and
`DEEP_IMPROVEMENT_COMMON_SEALED_ARTIFACT_CONTRACT`. Common evaluator, candidate-view, canary, and promotion semantics stay
in that adapter. The agent store composes its canonicalizer registry with the common registry and invokes the landed
phase-007 `SealedArtifactStore` for derive, seal-on-write, publication, and verified reads.

`004-certificates-and-receipts` should consume `AgentImprovementSealedArtifactBinding`,
`AgentImprovementVerifiedSealedArtifact`, `AgentImprovementSuccessorReferenceBundle`,
`AgentImprovementCommonServiceBindings`, `readAgentImprovementCommonArtifact`, and
`readAgentImprovementPromotionEvidence`. Certificates and receipts should bind the returned reference, descriptor digest,
candidate/base lineage, behavior coverage, evaluator epoch, canary, transfer, executor/environment, and rollback references.
They must not re-seal, re-hash, inline mutable bodies, or widen the closed material shapes.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep phase-007 as the only sealer | Digest, descriptor, publication, and verified-read behavior remain shared and tamper-evident |
| Compose the common canonicalizer registry | Common evaluator, canary, candidate-view, and promotion semantics remain delegated without forking their adapter |
| Bind each named reference to one expected artifact kind | Digest coverage alone cannot distinguish a semantically wrong artifact whose dependency declaration is internally consistent |
| Verify named references through the real store before dependency recursion | Existing and newly sealed artifacts both receive descriptor, content, and expected-kind checks before bytes are returned |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 45 tests |
| Isolated strict TypeScript check | PASS: new module and test diagnostics 0 |
| Whole-runtime TypeScript | PASS: exit 0; grep-own for the agent module 0 errors |
| Real sealer | PASS: phase-007 `SealedArtifactStore` derive, seal, `readVerified`, and canonicalizer registry are invoked |
| Named reference integrity | PASS: 37 field positions reject a real sealed wrong-kind artifact and seal/read their correct-kind control |
| Fail-closed reads | PASS: tampered, unsealed, truncated, missing-dependency, stale-epoch, executor-mismatch, binding wrong-kind, and named-reference wrong-kind cases release no bytes |
| Shared adapter boundary | PASS: `deep-improvement-common-sealed-artifacts` was consumed unchanged; common candidate, baseline, evaluator, raw-trial, and canary controls use its public sealer |
| Comment hygiene | PASS: all modified TypeScript files report 0 violations |
| Strict packet validation | PASS: exit 0 with 0 errors and 0 warnings |

`substrateImportsReal: true`. The landed agent-improvement ledger schema supplies typed event stems and AgentIR reference value
objects; the phase-007 sealer remains the only digest, canonicalization, publication, and verified-read primitive.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. This leaf does not materialize certificates, receipts, effect recovery, ledger events, reducers, projections, resume state,
   shadow parity, rollback, or mode-gate behavior.
2. No certificate or receipt materialization is included; the successor consumes stable verified references instead.
<!-- /ANCHOR:limitations -->
