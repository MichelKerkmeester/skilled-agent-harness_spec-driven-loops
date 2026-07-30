# Iteration 014 — security

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:10:25.269Z
- New findings: 3 (of 3 reported; prior total 50)
- Coverage: {"filesExamined":13,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-replay.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-decision-event.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/index.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/protected-resource-registry.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts"]}

## Summary
I traced authorization from caller-supplied transition requests through policy evaluation, durable audit decisions, domain-ledger append verification, replay, and the separate fencing layer. Head and authority-epoch checks prevent several ordinary proof replays, but neither caller authority nor fencing authority is inseparable from the ledger append capability. The policy registry also labels closure-dependent evaluators immutable while hashing only their source text. These gaps permit false authorization or mutation by a superseded writer under concrete conditions.

## Findings
- [P0] F-014-01 Ledger append can bypass the fencing-token boundary @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:298
  - evidence: AppendOnlyLedger.appendAuthorized accepts only an EventWritePreflight and GatewayAllowProof. Its locked verification checks the decision's event, prior head, expiry, authority state, and authority epoch, but never requires or checks a FencedLease or the ledger resource's durable fencing-token high-water mark. FencedLedgerWriter.append is only a separate optional wrapper, and the protected-surface manifest merely names it as a direct replacement. Therefore, after a successor lease is granted but before it changes the ledger head, a superseded writer holding an unexpired proof can call appendAuthorized directly and commit despite its stale fencing token.
  - recommendation: Make the fenced append gateway the only exported domain mutation capability. Bind the ledger resource identity and fencing token into the authorization request, durable decision, audit frame, domain frame, and proof; revalidate the token against the coordinator high-water mark inside the same protected commit boundary.
- [P0] F-014-02 Caller-controlled identity strings can forge writer authority @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:113
  - evidence: isTransitionRequest treats actorId and capabilityId as authorized inputs when they are merely bounded non-empty strings, and requestEvaluationInput forwards them directly to the policy evaluator. evidenceDigest is likewise caller-supplied without evidence verification. AuthorizationGatewayOptions supplies only an authorityProvider for mode state and epoch; it has no trusted principal or capability verifier. A caller can therefore copy identifiers accepted by a policy and obtain a durable allow decision without proving possession of that identity or capability.
  - recommendation: Resolve the principal and capabilities from a trusted, unforgeable credential outside the request payload. Verify its signature, audience, scope, expiry, authority epoch, and fencing token, then bind the verified credential digest and principal identity into the decision and append proof.
- [P0] F-014-03 Policy identity omits captured authorization state @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts:97
  - evidence: registerPolicy computes implementationDigest from Function.prototype.toString.call(definition.evaluate) and derives the policy digest from that source string plus declared metadata. Captured closure values, environment-derived configuration, mutable allowlists, and imported mutable state are absent. An evaluator closing over a Set can have that Set changed to authorize another actor while retaining the same policy digest; authorization replay invokes the same current evaluator, so it can also report parity under the unchanged supposedly immutable policy identity.
  - recommendation: Require policy definitions to include a canonical, immutable configuration or authority-material digest and incorporate it into the registry digest. Reject evaluators whose authorization result depends on unbound ambient or mutable state, and replay against the exact sealed policy artifact referenced by the decision.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 14,
  "dimension": "security",
  "summary": "I traced authorization from caller-supplied transition requests through policy evaluation, durable audit decisions, domain-ledger append verification, replay, and the separate fencing layer. Head and authority-epoch checks prevent several ordinary proof replays, but neither caller authority nor fencing authority is inseparable from the ledger append capability. The policy registry also labels closure-dependent evaluators immutable while hashing only their source text. These gaps permit false authorization or mutation by a superseded writer under concrete conditions.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Ledger append can bypass the fencing-token boundary",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts",
      "line": 298,
      "evidence": "AppendOnlyLedger.appendAuthorized accepts only an EventWritePreflight and GatewayAllowProof. Its locked verification checks the decision's event, prior head, expiry, authority state, and authority epoch, but never requires or checks a FencedLease or the ledger resource's durable fencing-token high-water mark. FencedLedgerWriter.append is only a separate optional wrapper, and the protected-surface manifest merely names it as a direct replacement. Therefore, after a successor lease is granted but before it changes the ledger head, a superseded writer holding an unexpired proof can call appendAuthorized directly and commit despite its stale fencing token.",
      "recommendation": "Make the fenced append gateway the only exported domain mutation capability. Bind the ledger resource identity and fencing token into the authorization request, durable decision, audit frame, domain frame, and proof; revalidate the token against the coordinator high-water mark inside the same protected commit boundary."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Caller-controlled identity strings can forge writer authority",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts",
      "line": 113,
      "evidence": "isTransitionRequest treats actorId and capabilityId as authorized inputs when they are merely bounded non-empty strings, and requestEvaluationInput forwards them directly to the policy evaluator. evidenceDigest is likewise caller-supplied without evidence verification. AuthorizationGatewayOptions supplies only an authorityProvider for mode state and epoch; it has no trusted principal or capability verifier. A caller can therefore copy identifiers accepted by a policy and obtain a durable allow decision without proving possession of that identity or capability.",
      "recommendation": "Resolve the principal and capabilities from a trusted, unforgeable credential outside the request payload. Verify its signature, audience, scope, expiry, authority epoch, and fencing token, then bind the verified credential digest and principal identity into the decision and append proof."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Policy identity omits captured authorization state",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts",
      "line": 97,
      "evidence": "registerPolicy computes implementationDigest from Function.prototype.toString.call(definition.evaluate) and derives the policy digest from that source string plus declared metadata. Captured closure values, environment-derived configuration, mutable allowlists, and imported mutable state are absent. An evaluator closing over a Set can have that Set changed to authorize another actor while retaining the same policy digest; authorization replay invokes the same current evaluator, so it can also report parity under the unchanged supposedly immutable policy identity.",
      "recommendation": "Require policy definitions to include a canonical, immutable configuration or authority-material digest and incorporate it into the registry digest. Reject evaluators whose authorization result depends on unbound ambient or mutable state, and replay against the exact sealed policy artifact referenced by the decision."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 13,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-replay.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorization-decision-event.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/index.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/protected-resource-registry.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts"
    ]
  }
}
```