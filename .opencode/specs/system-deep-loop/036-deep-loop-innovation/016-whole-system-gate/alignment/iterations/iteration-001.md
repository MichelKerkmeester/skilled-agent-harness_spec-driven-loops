# Alignment iteration 001 — sk-code

- Lane: sk-code::code::.opencode/skills/system-deep-loop/runtime/lib, .opencode/skills/system-deep-loop/runtime/scripts
- Completed: 2026-07-30T09:58:01.756Z
- Artifacts checked: 60
- Findings: 47 (47 new)

## Summary
All 60 artifacts were examined; the adapter returned no deterministic findings and the runtime TypeScript typecheck passed. Eight files use only a one-line MODULE marker instead of the required three-line TypeScript header block. Thirty artifacts contain exported functions, interfaces, or classes without required TSDoc; two artifacts also contain unjustified non-null assertions and one contains an untyped catch variable. No forbidden artifact identifiers or public any types were found.

## Findings
- [P0] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-types.ts
  - rule: sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.
  - The file has only a single-line MODULE comment.
  - evidence: Line 1 is `// MODULE: Agent Improvement Certificate Types`; the required divider lines are absent.
- [P0] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-validation.ts
  - rule: sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.
  - The file has only a single-line MODULE comment.
  - evidence: Line 1 is `// MODULE: Agent Improvement Certificate Validation`; the required divider lines are absent.
- [P0] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts
  - rule: sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.
  - The file has only a single-line MODULE comment.
  - evidence: Line 1 is `// MODULE: Agent Improvement Certificates and Receipts`; the required divider lines are absent.
- [P0] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/index.ts
  - rule: sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.
  - The file has only a single-line MODULE comment.
  - evidence: Line 1 is `// MODULE: Agent Improvement Certificates Public API`; the required divider lines are absent.
- [P0] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-artifact-material.ts
  - rule: sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.
  - The file has only a single-line MODULE comment.
  - evidence: Line 1 is `// MODULE: Agent Improvement Artifact Material`; the required divider lines are absent.
- [P0] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifact-types.ts
  - rule: sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.
  - The file has only a single-line MODULE comment.
  - evidence: Line 1 is `// MODULE: Agent Improvement Sealed Artifact Types`; the required divider lines are absent.
- [P0] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifacts.ts
  - rule: sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.
  - The file has only a single-line MODULE comment.
  - evidence: Line 1 is `// MODULE: Agent Improvement Sealed Artifact Adapter`; the required divider lines are absent.
- [P0] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/index.ts
  - rule: sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.
  - The file has only a single-line MODULE comment.
  - evidence: Line 1 is `// MODULE: Agent Improvement Sealed Artifacts Public API`; the required divider lines are absent.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts
  - rule: sk-code-opencode TypeScript checklist §3: non-null assertions require a justification comment on the preceding line.
  - Multiple non-null assertions are used without preceding justification comments.
  - evidence: Assertions occur at lines 465, 678, 947-948, 956, 1004, 1044, 1058, and 1315-1316.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/agent-improvement-resume-adapter.ts
  - rule: sk-code-opencode TypeScript checklist §3: non-null assertions require a justification comment on the preceding line.
  - A non-null assertion is used without a preceding justification comment.
  - evidence: Line 498 uses `streamIds[index - 1]!` with no justification comment.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts
  - rule: sk-code-opencode TypeScript checklist §3: catch blocks use unknown and narrow with instanceof.
  - The catch variable is not explicitly typed as unknown.
  - evidence: Line 167 uses `catch (error)`; line 175 narrows with instanceof but does not declare `error: unknown`.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-types.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces and classes require TSDoc.
  - Sixteen exported interfaces/classes lack TSDoc.
  - evidence: Examples include `AgentImprovementReceiptIdentity` at line 76 and `AgentImprovementCertificateError` at line 268.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-validation.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.
  - Three exported parser functions lack TSDoc.
  - evidence: Missing documentation at lines 270, 353, and 371.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.
  - Four exported certificate/receipt functions lack TSDoc.
  - evidence: Missing documentation at lines 347, 601, 822, and 1149.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-schema.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported functions and interfaces require TSDoc.
  - Eight exported declarations lack TSDoc.
  - evidence: Missing documentation includes `AgentImprovementEventInput` at line 68 and registry/payload functions at lines 865-997.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-types.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Thirty-eight exported interfaces lack TSDoc.
  - evidence: Missing documentation starts with `AgentImprovementReplayMetadata` at line 45 and continues through the exported ledger payload types.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.
  - Two exported compatibility functions lack TSDoc.
  - evidence: Missing documentation at lines 144 and 182.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-projection-schema.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported classes require TSDoc.
  - The exported reducer error class lacks TSDoc.
  - evidence: `AgentImprovementReducerError` is exported at line 730 without a TSDoc block.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-projection-types.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Twenty-nine exported projection interfaces lack TSDoc.
  - evidence: Missing documentation includes `AgentImprovementMutationRecord` at line 90 and the projection result/state types through line 509.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/types.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Fifteen exported resume interfaces lack TSDoc.
  - evidence: Missing documentation includes `AgentImprovementResumeComponentFact` at line 50 and resume decision/result types through line 256.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported functions and classes require TSDoc.
  - The exported rollback-window function and migration-gate class lack TSDoc.
  - evidence: Missing documentation at lines 759 and 771.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/rollback-switch.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported classes require TSDoc.
  - The exported rollback switch class lacks TSDoc.
  - evidence: `AgentImprovementRollbackSwitch` is exported at line 246 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/types.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Fourteen exported rollback-gate interfaces lack TSDoc.
  - evidence: Missing documentation includes `AgentImprovementGateInputDisposition` at line 51 and gate/certificate types through line 283.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-artifact-material.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported functions and interfaces require TSDoc.
  - Five exported declarations lack TSDoc.
  - evidence: Missing documentation includes `AgentImprovementNamedReferenceExpectation` at line 207 and artifact canonicalization functions at lines 1146-1390.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifact-types.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Twenty-two exported sealed-artifact interfaces lack TSDoc.
  - evidence: Missing documentation includes `AgentImprovementArtifactKindRegistration` at line 88 and material/binding types through line 378.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifacts.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.
  - Four exported sealed-artifact adapter functions lack TSDoc.
  - evidence: Missing documentation at lines 366, 372, 380, and 388.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/types.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Thirty-one exported parity interfaces lack TSDoc.
  - evidence: Missing documentation includes `AgentImprovementLifecycleEventMapping` at line 73 and parity fixture/certificate/result types through line 515.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Two exported gateway result interfaces lack TSDoc.
  - evidence: `GatewayAllowResult` and `GatewayDenyResult` are exported at lines 292 and 298 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - The exported adapter-options interface lacks TSDoc.
  - evidence: `DarkLedgerAdapterOptions` is exported at line 99 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Two exported storage interfaces lack TSDoc.
  - evidence: `StoredFrameFile` and `StoredRecoveryEvidence` are exported at lines 49 and 57 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - The exported authorization-audit interface lacks TSDoc.
  - evidence: `VerifiedAuthorizationAudit` is exported at line 60 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Two exported policy-registry interfaces lack TSDoc.
  - evidence: `RegisteredTransitionPolicy` and `TransitionPolicyInspectionEntry` are exported at lines 21 and 33 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/blinding.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Two exported blinding interfaces lack TSDoc.
  - evidence: `BlindedPresentationEvidence` and `DeblindedIdentity` are exported at lines 74 and 88 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/event-registry.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Two exported event-registry interfaces lack TSDoc.
  - evidence: `AdjudicationPolicyVersions` and `AdjudicationEventPayload` are exported at lines 87 and 94 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/mode-adapters.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported functions and interfaces require TSDoc.
  - Seven exported declarations lack TSDoc.
  - evidence: Missing documentation includes `ModeRequestInput` at line 28, five verdict adapters at lines 151-167, and `ModelBenchmarkCostJoin` at line 175.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/replay.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Two exported replay interfaces lack TSDoc.
  - evidence: `AdjudicationReplayProjection` and `TypedAdjudicationEvent` are exported at lines 70 and 171 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/service.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Three exported service-option/authorization interfaces lack TSDoc.
  - evidence: Missing documentation at lines 88, 95, and 101.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/validation.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.
  - Six exported validation functions lack TSDoc.
  - evidence: Missing documentation at lines 90, 96, 114, 121, 128, and 135.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-continuity-types.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - Fourteen exported claim-continuity interfaces lack TSDoc.
  - evidence: Missing documentation includes write inputs at lines 216-274 and frontier/result types at lines 281-344.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-frontier.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - The exported frontier input interface lacks TSDoc.
  - evidence: `CreateClaimContinuityFrontierInput` is exported at line 40 without TSDoc.
- [P1] .opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-matching.ts
  - rule: sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.
  - The exported match-result interface lacks TSDoc.
  - evidence: `EvaluatedClaimMatch` is exported at line 31 without TSDoc.
- [P2] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-types.ts
  - rule: sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.
  - The 289-line type module has no numbered section divider.
  - evidence: The file contains the MODULE marker and declarations but no `// N. SECTION NAME` divider.
- [P2] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-validation.ts
  - rule: sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.
  - The 386-line validation module has no numbered section divider.
  - evidence: No numbered uppercase section divider appears after the header.
- [P2] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts
  - rule: sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.
  - The 1,373-line certificate module has no numbered section divider.
  - evidence: No numbered uppercase section divider appears anywhere in the file.
- [P2] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-artifact-material.ts
  - rule: sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.
  - The 1,401-line artifact-material module has no numbered section divider.
  - evidence: No numbered uppercase section divider appears anywhere in the file.
- [P2] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifact-types.ts
  - rule: sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.
  - The 403-line sealed-artifact type module has no numbered section divider.
  - evidence: No numbered uppercase section divider appears after the header.
- [P2] .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifacts.ts
  - rule: sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.
  - The 410-line sealed-artifact adapter module has no numbered section divider.
  - evidence: No numbered uppercase section divider appears after the header.

## Leaf output (verbatim)
```json
{
  "iteration": 1,
  "laneId": "sk-code::code::.opencode/skills/system-deep-loop/runtime/lib, .opencode/skills/system-deep-loop/runtime/scripts",
  "authority": "sk-code",
  "artifactsChecked": [
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-validation.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-schema.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-projection-schema.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-projection-types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-reducer.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/agent-improvement-resume-adapter.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/rollback-switch.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-artifact-material.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifact-types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifacts.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-decision-event.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-replay.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-errors.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/deterministic-reducer.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/blinding.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/contracts.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/event-data.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/event-registry.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/judging.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/mode-adapters.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/reducer.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/replay.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/service.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/validation.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/errors.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/event-contract.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/index.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/ledger-fold.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/logical-branch-registry.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-continuity-events.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-continuity-types.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-frontier.ts",
    ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-matching.ts"
  ],
  "summary": "All 60 artifacts were examined; the adapter returned no deterministic findings and the runtime TypeScript typecheck passed. Eight files use only a one-line MODULE marker instead of the required three-line TypeScript header block. Thirty artifacts contain exported functions, interfaces, or classes without required TSDoc; two artifacts also contain unjustified non-null assertions and one contains an untyped catch variable. No forbidden artifact identifiers or public any types were found.",
  "findings": [
    {
      "severity": "P0",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-types.ts",
      "rule": "sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.",
      "message": "The file has only a single-line MODULE comment.",
      "evidence": "Line 1 is `// MODULE: Agent Improvement Certificate Types`; the required divider lines are absent.",
      "recommendation": "Wrap the MODULE marker in the standard three-line header block."
    },
    {
      "severity": "P0",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-validation.ts",
      "rule": "sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.",
      "message": "The file has only a single-line MODULE comment.",
      "evidence": "Line 1 is `// MODULE: Agent Improvement Certificate Validation`; the required divider lines are absent.",
      "recommendation": "Wrap the MODULE marker in the standard three-line header block."
    },
    {
      "severity": "P0",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts",
      "rule": "sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.",
      "message": "The file has only a single-line MODULE comment.",
      "evidence": "Line 1 is `// MODULE: Agent Improvement Certificates and Receipts`; the required divider lines are absent.",
      "recommendation": "Wrap the MODULE marker in the standard three-line header block."
    },
    {
      "severity": "P0",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/index.ts",
      "rule": "sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.",
      "message": "The file has only a single-line MODULE comment.",
      "evidence": "Line 1 is `// MODULE: Agent Improvement Certificates Public API`; the required divider lines are absent.",
      "recommendation": "Wrap the MODULE marker in the standard three-line header block."
    },
    {
      "severity": "P0",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-artifact-material.ts",
      "rule": "sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.",
      "message": "The file has only a single-line MODULE comment.",
      "evidence": "Line 1 is `// MODULE: Agent Improvement Artifact Material`; the required divider lines are absent.",
      "recommendation": "Wrap the MODULE marker in the standard three-line header block."
    },
    {
      "severity": "P0",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifact-types.ts",
      "rule": "sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.",
      "message": "The file has only a single-line MODULE comment.",
      "evidence": "Line 1 is `// MODULE: Agent Improvement Sealed Artifact Types`; the required divider lines are absent.",
      "recommendation": "Wrap the MODULE marker in the standard three-line header block."
    },
    {
      "severity": "P0",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifacts.ts",
      "rule": "sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.",
      "message": "The file has only a single-line MODULE comment.",
      "evidence": "Line 1 is `// MODULE: Agent Improvement Sealed Artifact Adapter`; the required divider lines are absent.",
      "recommendation": "Wrap the MODULE marker in the standard three-line header block."
    },
    {
      "severity": "P0",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/index.ts",
      "rule": "sk-code-opencode TypeScript style guide §2: every TypeScript file MUST begin with the three-line MODULE header block.",
      "message": "The file has only a single-line MODULE comment.",
      "evidence": "Line 1 is `// MODULE: Agent Improvement Sealed Artifacts Public API`; the required divider lines are absent.",
      "recommendation": "Wrap the MODULE marker in the standard three-line header block."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts",
      "rule": "sk-code-opencode TypeScript checklist §3: non-null assertions require a justification comment on the preceding line.",
      "message": "Multiple non-null assertions are used without preceding justification comments.",
      "evidence": "Assertions occur at lines 465, 678, 947-948, 956, 1004, 1044, 1058, and 1315-1316.",
      "recommendation": "Replace the assertions with guarded access where practical, or add durable WHY comments immediately before each justified assertion."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/agent-improvement-resume-adapter.ts",
      "rule": "sk-code-opencode TypeScript checklist §3: non-null assertions require a justification comment on the preceding line.",
      "message": "A non-null assertion is used without a preceding justification comment.",
      "evidence": "Line 498 uses `streamIds[index - 1]!` with no justification comment.",
      "recommendation": "Use guarded access or add a durable WHY comment immediately before the assertion."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts",
      "rule": "sk-code-opencode TypeScript checklist §3: catch blocks use unknown and narrow with instanceof.",
      "message": "The catch variable is not explicitly typed as unknown.",
      "evidence": "Line 167 uses `catch (error)`; line 175 narrows with instanceof but does not declare `error: unknown`.",
      "recommendation": "Change the clause to `catch (error: unknown)` and retain the existing narrowing."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-types.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces and classes require TSDoc.",
      "message": "Sixteen exported interfaces/classes lack TSDoc.",
      "evidence": "Examples include `AgentImprovementReceiptIdentity` at line 76 and `AgentImprovementCertificateError` at line 268.",
      "recommendation": "Add TSDoc summaries to every exported interface and class, including relevant type parameters and invariants."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-validation.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.",
      "message": "Three exported parser functions lack TSDoc.",
      "evidence": "Missing documentation at lines 270, 353, and 371.",
      "recommendation": "Document each parser's input, returned value, and validation failure behavior."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.",
      "message": "Four exported certificate/receipt functions lack TSDoc.",
      "evidence": "Missing documentation at lines 347, 601, 822, and 1149.",
      "recommendation": "Add TSDoc with parameters, return values, and thrown certificate errors."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-schema.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported functions and interfaces require TSDoc.",
      "message": "Eight exported declarations lack TSDoc.",
      "evidence": "Missing documentation includes `AgentImprovementEventInput` at line 68 and registry/payload functions at lines 865-997.",
      "recommendation": "Add TSDoc to the exported input interface and all registry, payload, digest, and type-guard functions."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-types.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Thirty-eight exported interfaces lack TSDoc.",
      "evidence": "Missing documentation starts with `AgentImprovementReplayMetadata` at line 45 and continues through the exported ledger payload types.",
      "recommendation": "Add concise TSDoc to each exported interface, documenting lifecycle role and cross-module invariants."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.",
      "message": "Two exported compatibility functions lack TSDoc.",
      "evidence": "Missing documentation at lines 144 and 182.",
      "recommendation": "Document compatibility decisions, legacy input expectations, and upcast behavior."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-projection-schema.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported classes require TSDoc.",
      "message": "The exported reducer error class lacks TSDoc.",
      "evidence": "`AgentImprovementReducerError` is exported at line 730 without a TSDoc block.",
      "recommendation": "Add a TSDoc summary describing the reducer failure contract."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/agent-improvement-projection-types.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Twenty-nine exported projection interfaces lack TSDoc.",
      "evidence": "Missing documentation includes `AgentImprovementMutationRecord` at line 90 and the projection result/state types through line 509.",
      "recommendation": "Document each exported projection shape and its reducer/state semantics."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-resume-adapter/types.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Fifteen exported resume interfaces lack TSDoc.",
      "evidence": "Missing documentation includes `AgentImprovementResumeComponentFact` at line 50 and resume decision/result types through line 256.",
      "recommendation": "Add TSDoc describing resume inputs, compatibility decisions, and result invariants."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported functions and classes require TSDoc.",
      "message": "The exported rollback-window function and migration-gate class lack TSDoc.",
      "evidence": "Missing documentation at lines 759 and 771.",
      "recommendation": "Document rollback-window evaluation inputs, outputs, and gate failure behavior."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/rollback-switch.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported classes require TSDoc.",
      "message": "The exported rollback switch class lacks TSDoc.",
      "evidence": "`AgentImprovementRollbackSwitch` is exported at line 246 without TSDoc.",
      "recommendation": "Add TSDoc describing switch authority, rollback constraints, and emitted evidence."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/types.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Fourteen exported rollback-gate interfaces lack TSDoc.",
      "evidence": "Missing documentation includes `AgentImprovementGateInputDisposition` at line 51 and gate/certificate types through line 283.",
      "recommendation": "Add TSDoc documenting the gate input, evidence, certificate, and decision contracts."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-artifact-material.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported functions and interfaces require TSDoc.",
      "message": "Five exported declarations lack TSDoc.",
      "evidence": "Missing documentation includes `AgentImprovementNamedReferenceExpectation` at line 207 and artifact canonicalization functions at lines 1146-1390.",
      "recommendation": "Document the named-reference contract and canonicalizer/parser behavior."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifact-types.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Twenty-two exported sealed-artifact interfaces lack TSDoc.",
      "evidence": "Missing documentation includes `AgentImprovementArtifactKindRegistration` at line 88 and material/binding types through line 378.",
      "recommendation": "Add TSDoc describing artifact kinds, material shapes, bindings, and visibility constraints."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifacts.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.",
      "message": "Four exported sealed-artifact adapter functions lack TSDoc.",
      "evidence": "Missing documentation at lines 366, 372, 380, and 388.",
      "recommendation": "Document binding parsing, artifact reads, returned material, and failure behavior."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/types.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Thirty-one exported parity interfaces lack TSDoc.",
      "evidence": "Missing documentation includes `AgentImprovementLifecycleEventMapping` at line 73 and parity fixture/certificate/result types through line 515.",
      "recommendation": "Add TSDoc describing parity evidence, fixture, execution, and receipt contracts."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Two exported gateway result interfaces lack TSDoc.",
      "evidence": "`GatewayAllowResult` and `GatewayDenyResult` are exported at lines 292 and 298 without TSDoc.",
      "recommendation": "Document the allow/deny result discriminants and their authority guarantees."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "The exported adapter-options interface lacks TSDoc.",
      "evidence": "`DarkLedgerAdapterOptions` is exported at line 99 without TSDoc.",
      "recommendation": "Add TSDoc describing adapter construction options and legacy boundary behavior."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Two exported storage interfaces lack TSDoc.",
      "evidence": "`StoredFrameFile` and `StoredRecoveryEvidence` are exported at lines 49 and 57 without TSDoc.",
      "recommendation": "Document persisted-frame and recovery-evidence shapes."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "The exported authorization-audit interface lacks TSDoc.",
      "evidence": "`VerifiedAuthorizationAudit` is exported at line 60 without TSDoc.",
      "recommendation": "Add TSDoc describing the verified authorization audit contract."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Two exported policy-registry interfaces lack TSDoc.",
      "evidence": "`RegisteredTransitionPolicy` and `TransitionPolicyInspectionEntry` are exported at lines 21 and 33 without TSDoc.",
      "recommendation": "Document policy registration and inspection semantics."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/blinding.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Two exported blinding interfaces lack TSDoc.",
      "evidence": "`BlindedPresentationEvidence` and `DeblindedIdentity` are exported at lines 74 and 88 without TSDoc.",
      "recommendation": "Document blinded evidence and deblinded identity boundaries."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/event-registry.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Two exported event-registry interfaces lack TSDoc.",
      "evidence": "`AdjudicationPolicyVersions` and `AdjudicationEventPayload` are exported at lines 87 and 94 without TSDoc.",
      "recommendation": "Document policy-version and event-payload contracts."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/mode-adapters.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported functions and interfaces require TSDoc.",
      "message": "Seven exported declarations lack TSDoc.",
      "evidence": "Missing documentation includes `ModeRequestInput` at line 28, five verdict adapters at lines 151-167, and `ModelBenchmarkCostJoin` at line 175.",
      "recommendation": "Add TSDoc for the mode input, adapter functions, and post-blind cost-join contract."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/replay.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Two exported replay interfaces lack TSDoc.",
      "evidence": "`AdjudicationReplayProjection` and `TypedAdjudicationEvent` are exported at lines 70 and 171 without TSDoc.",
      "recommendation": "Document replay projection and typed event contracts."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/service.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Three exported service-option/authorization interfaces lack TSDoc.",
      "evidence": "Missing documentation at lines 88, 95, and 101.",
      "recommendation": "Document deblinding authorization requests, authenticated results, and service options."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/blinded-adjudication/validation.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported functions require TSDoc.",
      "message": "Six exported validation functions lack TSDoc.",
      "evidence": "Missing documentation at lines 90, 96, 114, 121, 128, and 135.",
      "recommendation": "Document validation predicates, accepted inputs, and thrown error conditions."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-continuity-types.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "Fourteen exported claim-continuity interfaces lack TSDoc.",
      "evidence": "Missing documentation includes write inputs at lines 216-274 and frontier/result types at lines 281-344.",
      "recommendation": "Add TSDoc describing claim write inputs, results, frontier state, and shadow comparison contracts."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-frontier.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "The exported frontier input interface lacks TSDoc.",
      "evidence": "`CreateClaimContinuityFrontierInput` is exported at line 40 without TSDoc.",
      "recommendation": "Document frontier construction inputs and identity/digest invariants."
    },
    {
      "severity": "P1",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/claim-continuity/claim-matching.ts",
      "rule": "sk-code-opencode TypeScript quality standards §2: exported interfaces require TSDoc.",
      "message": "The exported match-result interface lacks TSDoc.",
      "evidence": "`EvaluatedClaimMatch` is exported at line 31 without TSDoc.",
      "recommendation": "Document match decision, reason, and evidence fields."
    },
    {
      "severity": "P2",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-types.ts",
      "rule": "sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.",
      "message": "The 289-line type module has no numbered section divider.",
      "evidence": "The file contains the MODULE marker and declarations but no `// N. SECTION NAME` divider.",
      "recommendation": "Add sequential numbered sections such as IMPORTS, TYPE DEFINITIONS, and EXPORTS."
    },
    {
      "severity": "P2",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificate-validation.ts",
      "rule": "sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.",
      "message": "The 386-line validation module has no numbered section divider.",
      "evidence": "No numbered uppercase section divider appears after the header.",
      "recommendation": "Organize imports, type definitions, validation helpers, and exported parsers into numbered sections."
    },
    {
      "severity": "P2",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts",
      "rule": "sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.",
      "message": "The 1,373-line certificate module has no numbered section divider.",
      "evidence": "No numbered uppercase section divider appears anywhere in the file.",
      "recommendation": "Split the module into sequential IMPORTS, TYPE DEFINITIONS, HELPERS, CORE LOGIC, VERIFICATION, and EXPORTS sections."
    },
    {
      "severity": "P2",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-artifact-material.ts",
      "rule": "sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.",
      "message": "The 1,401-line artifact-material module has no numbered section divider.",
      "evidence": "No numbered uppercase section divider appears anywhere in the file.",
      "recommendation": "Organize the large module into sequential type, registry, validation, canonicalization, and export sections."
    },
    {
      "severity": "P2",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifact-types.ts",
      "rule": "sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.",
      "message": "The 403-line sealed-artifact type module has no numbered section divider.",
      "evidence": "No numbered uppercase section divider appears after the header.",
      "recommendation": "Add sequential TYPE DEFINITIONS and EXPORTS sections, grouping related artifact shapes."
    },
    {
      "severity": "P2",
      "artifactPath": ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/agent-improvement-sealed-artifacts.ts",
      "rule": "sk-code-opencode shared code-organization §2 and TypeScript style guide §4: significant files use numbered uppercase section dividers.",
      "message": "The 410-line sealed-artifact adapter module has no numbered section divider.",
      "evidence": "No numbered uppercase section divider appears after the header.",
      "recommendation": "Organize binding parsing, store construction, reads, and exports into numbered sections."
    }
  ]
}
```