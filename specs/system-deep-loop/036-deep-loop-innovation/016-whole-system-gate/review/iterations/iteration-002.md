# Iteration 002 — correctness

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T05:57:13.224Z
- New findings: 3 (of 3 reported; prior total 3)
- Coverage: {"filesExamined":50,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts",".opencode/skills/system-deep-loop/runtime/lib/event-envelope/canonical-json.ts",".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-envelope-boundary.ts",".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/protected-resource-registry.ts",".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/transactional-projection-engine.ts",".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/transactional-projection-store.ts",".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/projection-bundle-registry.ts",".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/derive-replay-fingerprint.ts",".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/transactional-projections.vitest.ts"]}

## Summary
I traced the authorization, immutable-ledger recovery, fencing, event-envelope, replay-fingerprint, and transactional-projection paths end to end. The normal authority and projection cutovers are strongly checked, and I found no P0 unauthorized-append path. Two concrete P1 defects remain: torn-tail recovery is not crash-consistent, and malformed authorization input can escape the durable default-deny path. I also found one P2 cross-locale registry-digest determinism issue.

## Findings
- [P1] F-002-01 Torn-tail recovery can quarantine bytes without durable recovery evidence @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts:502
  - evidence: quarantineTornTailUnlocked renames the candidate into quarantine at line 502, fsyncs the directories, and only then opens and writes the recovery marker at lines 521-532. If openSync, writeFileSync, fsyncSync, or close fails after the rename, the method throws with the frame removed from frames and no recovery marker. append-only-ledger.ts scans only frames and recovery markers, so a later scan treats the prior prefix as the current head and can reuse the quarantined sequence.
  - recommendation: Make quarantine and recovery evidence crash-consistent: publish durable pending recovery state before removing the frame, or retain a blocking marker/orphan quarantine record on any post-rename failure. Never allow a subsequent scan to silently advance from an unlinked quarantined sequence.
- [P1] F-002-02 Cyclic or throwing request data bypasses durable default denial @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:130
  - evidence: isEventPreflight calls canonicalBytes(value.envelope) directly at lines 130-132. canonicalBytes rejects cyclic JSON by throwing. authorize calls #prepareContext(input) at lines 554-555 before its audit-storage catch, and #prepareContext invokes isTransitionRequest at lines 611-612. A structurally object-like request containing a cyclic envelope therefore rejects the promise before an invalid-input decision is built or audited.
  - recommendation: Make the request predicate total by catching canonicalization and property-access failures, or catch preparation failures in authorize and construct one durable INVALID_INPUT denial. The gateway contract should never throw for untrusted request data.
- [P2] F-002-03 Transition policy registry digest depends on process locale @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts:145
  - evidence: Policy identities accept arbitrary bounded strings at lines 46-55, but inspect sorts registry entries with localeCompare at lines 145-146 before computing the registry digest at line 137. The same policy definitions containing locale-sensitive Unicode identifiers can therefore produce different registry digests under different host locales.
  - recommendation: Replace localeCompare with an explicit code-unit or code-point comparator and add a hostile-locale determinism test for policy identifiers.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 2,
  "dimension": "correctness",
  "summary": "I traced the authorization, immutable-ledger recovery, fencing, event-envelope, replay-fingerprint, and transactional-projection paths end to end. The normal authority and projection cutovers are strongly checked, and I found no P0 unauthorized-append path. Two concrete P1 defects remain: torn-tail recovery is not crash-consistent, and malformed authorization input can escape the durable default-deny path. I also found one P2 cross-locale registry-digest determinism issue.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Torn-tail recovery can quarantine bytes without durable recovery evidence",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts",
      "line": 502,
      "evidence": "quarantineTornTailUnlocked renames the candidate into quarantine at line 502, fsyncs the directories, and only then opens and writes the recovery marker at lines 521-532. If openSync, writeFileSync, fsyncSync, or close fails after the rename, the method throws with the frame removed from frames and no recovery marker. append-only-ledger.ts scans only frames and recovery markers, so a later scan treats the prior prefix as the current head and can reuse the quarantined sequence.",
      "recommendation": "Make quarantine and recovery evidence crash-consistent: publish durable pending recovery state before removing the frame, or retain a blocking marker/orphan quarantine record on any post-rename failure. Never allow a subsequent scan to silently advance from an unlinked quarantined sequence."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Cyclic or throwing request data bypasses durable default denial",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts",
      "line": 130,
      "evidence": "isEventPreflight calls canonicalBytes(value.envelope) directly at lines 130-132. canonicalBytes rejects cyclic JSON by throwing. authorize calls #prepareContext(input) at lines 554-555 before its audit-storage catch, and #prepareContext invokes isTransitionRequest at lines 611-612. A structurally object-like request containing a cyclic envelope therefore rejects the promise before an invalid-input decision is built or audited.",
      "recommendation": "Make the request predicate total by catching canonicalization and property-access failures, or catch preparation failures in authorize and construct one durable INVALID_INPUT denial. The gateway contract should never throw for untrusted request data."
    },
    {
      "severity": "P2",
      "dimension": "correctness",
      "title": "Transition policy registry digest depends on process locale",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts",
      "line": 145,
      "evidence": "Policy identities accept arbitrary bounded strings at lines 46-55, but inspect sorts registry entries with localeCompare at lines 145-146 before computing the registry digest at line 137. The same policy definitions containing locale-sensitive Unicode identifiers can therefore produce different registry digests under different host locales.",
      "recommendation": "Replace localeCompare with an explicit code-unit or code-point comparator and add a hostile-locale determinism test for policy identifiers."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 50,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/event-envelope/canonical-json.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-envelope-boundary.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/protected-resource-registry.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/transactional-projection-engine.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/transactional-projection-store.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/transactional-projections/projection-bundle-registry.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/derive-replay-fingerprint.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/transactional-projections.vitest.ts"
    ]
  }
}
```