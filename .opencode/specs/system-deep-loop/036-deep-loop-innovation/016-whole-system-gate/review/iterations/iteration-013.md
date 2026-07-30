# Iteration 013 — correctness

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:07:05.881Z
- New findings: 6 (of 6 reported; prior total 44)
- Coverage: {"filesExamined":52,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts",".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/context.ts",".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/budgets.ts",".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/projections.ts",".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts",".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/mode-contract-types.ts"]}

## Summary
Examined all rollback-gate families, the shared closure implementation, and the mode-contract conformance path. Standalone gates independently accept a valid certificate bundle and a complete sealed-artifact set, then combine them without proving they describe the same run. Standalone rollback switches also fail to rebind allow decisions to their prepared requests, while shared contexts retain mutable nested trust inputs. The conformance harness omits reducer event and certificate evidence identity checks, and older gate evaluators can throw on malformed top-level input. F-005-02 is broader than the listed deep-review instance: the same unauthenticated execution-count pattern recurs across rollback-window implementations.

## Findings
- [P0] F-013-01 Standalone readiness gates do not bind sealed artifacts to the verified certificate @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts:389
  - evidence: `evaluateSealed` verifies caller-supplied bindings and returns their digests at lines 389-410, while `evaluateCertificates` independently accepts any offline-valid certificate bundle at lines 443-484. The final readiness certificate copies `sealed.artifactDigests` at line 739 and the separately verified `runCertificateDigest` at line 744, without comparing the sealed digest set to the certificate's `artifactClaims` or `artifactSetDigest`.
  - recommendation: Require exact equality between the verified sealed-artifact set, certificate artifact claims, artifact-set digest, and semantic run or lineage identity before issuing readiness. Apply the same binding in deep-review, deep-ai-council, and deep-alignment gates.
- [P0] F-013-02 Standalone rollback switches trust an unbound allow decision @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts:263
  - evidence: The request is validated against mode, authority epoch, and evidence digest at lines 231-235, but after gateway authorization the switch only checks `authorization.verdict` at lines 263-270. It never compares the returned decision's mode, authority epoch, evidence digest, or request digest with the prepared request before using those returned fields to build the rollback certificate at lines 293-314. The same omission exists in the deep-review, deep-ai-council, and deep-alignment switches.
  - recommendation: Reject any allow response whose decision identity does not exactly match the prepared request, including mode, epoch, evidence digest, request digest, and decision correlation, before acquiring a fence or issuing a certificate.
- [P1] F-013-03 Closure context is only shallowly immutable @ .opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/context.ts:163
  - evidence: The context freezes its outer object and arrays, but stores `input.lifecycleEvent`, `input.budgetScope`, and each `input.sealedReferences` element by reference at lines 163-180. Later closure code reads mutable nested values such as `context.budgetScope.scope.scopeId` and sealed-reference fields after context creation, so a caller retaining the original input can redirect budget scope or artifact identity after validation.
  - recommendation: Canonicalize and deeply clone/freeze all identity-bearing inputs before binding the context, or store immutable canonical digests and validated snapshots rather than caller-owned objects.
- [P1] F-013-04 Reducer conformance accepts an event-unbound reducer @ .opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts:739
  - evidence: `runReducerFixtures` invokes the reducer twice and checks determinism, input immutability, freezing, reducer identity, and owned changed fields at lines 739-768, but never checks `first.appliedEventId` or `second.appliedEventId` against the fixture event identity. A deterministic reducer that ignores the supplied event and returns an unchanged state can therefore satisfy an accept fixture.
  - recommendation: Require the reduction result's applied event identity to equal the verified fixture event and require the returned reducer to declare the fixture event type; add an explicit contract for legitimate no-op events.
- [P1] F-013-05 Certificate conformance accepts evidence-unbound certificates @ .opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts:855
  - evidence: `runCertificateFixtures` calls `issueCertificate(fixture.evidence)` and only checks closed shape, authority neutrality, and non-empty evidence references and invalidation conditions at lines 855-864. It never checks that certificate evidence references derive from or cover the fixture's `evidenceReferences` and `inputDigests`, so a constant certificate containing unrelated non-empty references can pass.
  - recommendation: Validate the certificate's evidence references against the fixture evidence and reject outputs whose identity, referenced digests, or invalidation scope are unrelated to the supplied evidence.
- [P1] F-013-06 Deep-research and deep-review gates throw on malformed top-level input @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts:683
  - evidence: `evaluate` starts `Promise.all` over component evaluators at lines 682-697 and only performs guarded top-level validation at lines 711-717. Component access such as `input.parity` at line 267 occurs outside an outer catch, so `null` or `undefined` input rejects the promise instead of returning a blocked gate result. Deep-review has the same structure.
  - recommendation: Guard the entire public evaluation boundary with a fail-closed top-level type check and return a deterministic blocked or malformed disposition for every invalid runtime input.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 13,
  "dimension": "correctness",
  "summary": "Examined all rollback-gate families, the shared closure implementation, and the mode-contract conformance path. Standalone gates independently accept a valid certificate bundle and a complete sealed-artifact set, then combine them without proving they describe the same run. Standalone rollback switches also fail to rebind allow decisions to their prepared requests, while shared contexts retain mutable nested trust inputs. The conformance harness omits reducer event and certificate evidence identity checks, and older gate evaluators can throw on malformed top-level input. F-005-02 is broader than the listed deep-review instance: the same unauthenticated execution-count pattern recurs across rollback-window implementations.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Standalone readiness gates do not bind sealed artifacts to the verified certificate",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",
      "line": 389,
      "evidence": "`evaluateSealed` verifies caller-supplied bindings and returns their digests at lines 389-410, while `evaluateCertificates` independently accepts any offline-valid certificate bundle at lines 443-484. The final readiness certificate copies `sealed.artifactDigests` at line 739 and the separately verified `runCertificateDigest` at line 744, without comparing the sealed digest set to the certificate's `artifactClaims` or `artifactSetDigest`.",
      "recommendation": "Require exact equality between the verified sealed-artifact set, certificate artifact claims, artifact-set digest, and semantic run or lineage identity before issuing readiness. Apply the same binding in deep-review, deep-ai-council, and deep-alignment gates."
    },
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Standalone rollback switches trust an unbound allow decision",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts",
      "line": 263,
      "evidence": "The request is validated against mode, authority epoch, and evidence digest at lines 231-235, but after gateway authorization the switch only checks `authorization.verdict` at lines 263-270. It never compares the returned decision's mode, authority epoch, evidence digest, or request digest with the prepared request before using those returned fields to build the rollback certificate at lines 293-314. The same omission exists in the deep-review, deep-ai-council, and deep-alignment switches.",
      "recommendation": "Reject any allow response whose decision identity does not exactly match the prepared request, including mode, epoch, evidence digest, request digest, and decision correlation, before acquiring a fence or issuing a certificate."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Closure context is only shallowly immutable",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/context.ts",
      "line": 163,
      "evidence": "The context freezes its outer object and arrays, but stores `input.lifecycleEvent`, `input.budgetScope`, and each `input.sealedReferences` element by reference at lines 163-180. Later closure code reads mutable nested values such as `context.budgetScope.scope.scopeId` and sealed-reference fields after context creation, so a caller retaining the original input can redirect budget scope or artifact identity after validation.",
      "recommendation": "Canonicalize and deeply clone/freeze all identity-bearing inputs before binding the context, or store immutable canonical digests and validated snapshots rather than caller-owned objects."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Reducer conformance accepts an event-unbound reducer",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts",
      "line": 739,
      "evidence": "`runReducerFixtures` invokes the reducer twice and checks determinism, input immutability, freezing, reducer identity, and owned changed fields at lines 739-768, but never checks `first.appliedEventId` or `second.appliedEventId` against the fixture event identity. A deterministic reducer that ignores the supplied event and returns an unchanged state can therefore satisfy an accept fixture.",
      "recommendation": "Require the reduction result's applied event identity to equal the verified fixture event and require the returned reducer to declare the fixture event type; add an explicit contract for legitimate no-op events."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Certificate conformance accepts evidence-unbound certificates",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts",
      "line": 855,
      "evidence": "`runCertificateFixtures` calls `issueCertificate(fixture.evidence)` and only checks closed shape, authority neutrality, and non-empty evidence references and invalidation conditions at lines 855-864. It never checks that certificate evidence references derive from or cover the fixture's `evidenceReferences` and `inputDigests`, so a constant certificate containing unrelated non-empty references can pass.",
      "recommendation": "Validate the certificate's evidence references against the fixture evidence and reject outputs whose identity, referenced digests, or invalidation scope are unrelated to the supplied evidence."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Deep-research and deep-review gates throw on malformed top-level input",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",
      "line": 683,
      "evidence": "`evaluate` starts `Promise.all` over component evaluators at lines 682-697 and only performs guarded top-level validation at lines 711-717. Component access such as `input.parity` at line 267 occurs outside an outer catch, so `null` or `undefined` input rejects the promise instead of returning a blocked gate result. Deep-review has the same structure.",
      "recommendation": "Guard the entire public evaluation boundary with a fail-closed top-level type check and return a deterministic blocked or malformed disposition for every invalid runtime input."
    }
  ],
  "refutations": [
    {
      "id": "F-005-02",
      "verdict": "deepened",
      "reason": "The deep-review rollback window counts rows from caller-supplied `executionId`, authority state, epoch, result, and `certificateDigest` fields at lines 605-612 without authenticating the execution or resolving the certificate digest. The same pattern recurs in deep-research and sibling rollback-window implementations."
    }
  ],
  "coverage": {
    "filesExamined": 52,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/context.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/budgets.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/projections.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/mode-contract-types.ts"
    ]
  }
}
```