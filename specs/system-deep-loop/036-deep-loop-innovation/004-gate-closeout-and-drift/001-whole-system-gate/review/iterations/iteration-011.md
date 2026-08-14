# Iteration 011 — correctness

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:52:17.813Z
- New findings: 4 (of 4 reported; prior total 36)
- Coverage: {"filesExamined":34,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts",".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts",".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-reference-set.ts",".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-retention.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-sealed-artifacts/deep-alignment-sealed-artifact-types.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-research-certificates/deep-research-certificates.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts"]}

## Summary
I examined the shared sealed-artifact store, lifecycle authorization paths, artifact-event evidence, and the certificate/offline-verifier closure logic across the common, alignment, council, research, review, model-benchmark, skill-benchmark, and agent-improvement modules. The sealed substrate verifies byte hashes but does not re-run canonicalization before releasing bytes. Two authority-boundary gaps remain: store deletion/restoration accepts caller-shaped authorization data, and the common offline verifier does not re-derive several certificate identity and artifact-reference fields. Alignment output provenance also accepts broad lifecycle events without binding the artifact identity to the event.

## Findings
- [P0] F-011-01 Public deletion and restoration cutovers trust unverified authorization objects @ .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts:680
  - evidence: deleteAuthorized reads the artifact, then validates only the shape of authorization.eventId, ledgerId, ledgerSequence, ledgerRecordHash, and authorizedAt before copying those caller-supplied values into a tombstone and removing the reference, blob, and descriptor at lines 686-715. restoreAuthorized similarly checks only eventId and ledgerRecordHash at lines 730-739; it never resolves either authorization against an AppendOnlyLedger or verifies the exact lifecycle event, action, and reference.
  - recommendation: Make these filesystem cutovers private or require a verified ledger receipt/proof. Validate the durable event type, exact artifact reference, lifecycle action, ledger identity, sequence, record hash, and authorization before mutating storage.
- [P1] F-011-02 Verified sealed reads do not enforce the claimed canonicalization profile @ .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts:838
  - evidence: The read path calls canonicalizers.describe at lines 838-841 and 907-910, which checks only registered metadata. It then accepts blob bytes after checking byte length and SHA-256 equality at lines 926-937. It never runs the registered canonicalizer or compares canonicalized bytes with the stored blob, so a coherent reference, descriptor, and blob can claim a profile without satisfying its canonical byte contract.
  - recommendation: Re-run the registered canonicalizer or an equivalent verified decoder/re-encoder during read and require byte-for-byte equality before returning VerifiedSealedArtifact.
- [P0] F-011-03 Common offline certificates leave semantic artifact identity fields unchecked @ .opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts:1485
  - evidence: The offline verifier rereads artifactClaims and checks only the recomputed claims and artifactSetDigest at lines 1485-1506. It re-derives the promotion verdict at lines 1567-1576, then verifies the body digest and certification receipt at lines 1578-1607, but never reads or compares body.evaluatorEpochId, candidateId, baselineId, canaryEpochId, evaluatorCapsuleQualifiedDigest, candidateInputQualifiedDigest, baselineInputQualifiedDigest, rawObservationQualifiedDigests, canaryEpochQualifiedDigest, promotionEvidenceQualifiedDigest, evaluatorPolicyDigest, budgetDigest, or vetoEvidenceDigests. These fields are emitted into the certificate body at lines 1203-1229, so a syntactically valid signed certificate can carry false semantic bindings and still return valid.
  - recommendation: Re-derive every semantic body field from the verified typed artifact materials, projection, and closure map, then compare the complete derived body before accepting the certificate.
- [P1] F-011-04 Alignment output provenance accepts lifecycle events without artifact identity binding @ .opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts:717
  - evidence: artifactCorrespondsToEvent checks only the envelope stem/type, material.authorityEpochId versus event scope authorityEpochId, and presence of data at lines 690-705. For LANE_CONFIGURATION, lines 717-724 return true for run_initialized, scope_resolved, dimension_ordered, or lane_completed without requiring laneId or a digest match. requireArtifactEventCorrespondence applies this predicate to every output artifact at lines 1184-1199. The shared alignment material base contains artifactId and authorityEpochId but no runId or sessionId at deep-alignment-sealed-artifact-types.ts lines 84-92.
  - recommendation: Require each artifact kind to bind to event-specific identity data, including run/session scope where applicable. Remove broad lifecycle fallbacks and require exact digest, lane, artifact, or source-event correspondence for every output.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 11,
  "dimension": "correctness",
  "summary": "I examined the shared sealed-artifact store, lifecycle authorization paths, artifact-event evidence, and the certificate/offline-verifier closure logic across the common, alignment, council, research, review, model-benchmark, skill-benchmark, and agent-improvement modules. The sealed substrate verifies byte hashes but does not re-run canonicalization before releasing bytes. Two authority-boundary gaps remain: store deletion/restoration accepts caller-shaped authorization data, and the common offline verifier does not re-derive several certificate identity and artifact-reference fields. Alignment output provenance also accepts broad lifecycle events without binding the artifact identity to the event.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Public deletion and restoration cutovers trust unverified authorization objects",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts",
      "line": 680,
      "evidence": "deleteAuthorized reads the artifact, then validates only the shape of authorization.eventId, ledgerId, ledgerSequence, ledgerRecordHash, and authorizedAt before copying those caller-supplied values into a tombstone and removing the reference, blob, and descriptor at lines 686-715. restoreAuthorized similarly checks only eventId and ledgerRecordHash at lines 730-739; it never resolves either authorization against an AppendOnlyLedger or verifies the exact lifecycle event, action, and reference.",
      "recommendation": "Make these filesystem cutovers private or require a verified ledger receipt/proof. Validate the durable event type, exact artifact reference, lifecycle action, ledger identity, sequence, record hash, and authorization before mutating storage."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Verified sealed reads do not enforce the claimed canonicalization profile",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts",
      "line": 838,
      "evidence": "The read path calls canonicalizers.describe at lines 838-841 and 907-910, which checks only registered metadata. It then accepts blob bytes after checking byte length and SHA-256 equality at lines 926-937. It never runs the registered canonicalizer or compares canonicalized bytes with the stored blob, so a coherent reference, descriptor, and blob can claim a profile without satisfying its canonical byte contract.",
      "recommendation": "Re-run the registered canonicalizer or an equivalent verified decoder/re-encoder during read and require byte-for-byte equality before returning VerifiedSealedArtifact."
    },
    {
      "severity": "P0",
      "dimension": "correctness",
      "title": "Common offline certificates leave semantic artifact identity fields unchecked",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts",
      "line": 1485,
      "evidence": "The offline verifier rereads artifactClaims and checks only the recomputed claims and artifactSetDigest at lines 1485-1506. It re-derives the promotion verdict at lines 1567-1576, then verifies the body digest and certification receipt at lines 1578-1607, but never reads or compares body.evaluatorEpochId, candidateId, baselineId, canaryEpochId, evaluatorCapsuleQualifiedDigest, candidateInputQualifiedDigest, baselineInputQualifiedDigest, rawObservationQualifiedDigests, canaryEpochQualifiedDigest, promotionEvidenceQualifiedDigest, evaluatorPolicyDigest, budgetDigest, or vetoEvidenceDigests. These fields are emitted into the certificate body at lines 1203-1229, so a syntactically valid signed certificate can carry false semantic bindings and still return valid.",
      "recommendation": "Re-derive every semantic body field from the verified typed artifact materials, projection, and closure map, then compare the complete derived body before accepting the certificate."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Alignment output provenance accepts lifecycle events without artifact identity binding",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts",
      "line": 717,
      "evidence": "artifactCorrespondsToEvent checks only the envelope stem/type, material.authorityEpochId versus event scope authorityEpochId, and presence of data at lines 690-705. For LANE_CONFIGURATION, lines 717-724 return true for run_initialized, scope_resolved, dimension_ordered, or lane_completed without requiring laneId or a digest match. requireArtifactEventCorrespondence applies this predicate to every output artifact at lines 1184-1199. The shared alignment material base contains artifactId and authorityEpochId but no runId or sessionId at deep-alignment-sealed-artifact-types.ts lines 84-92.",
      "recommendation": "Require each artifact kind to bind to event-specific identity data, including run/session scope where applicable. Remove broad lifecycle fallbacks and require exact digest, lane, artifact, or source-event correspondence for every output."
    }
  ],
  "refutations": [
    {
      "id": "F-007-02",
      "verdict": "confirmed",
      "reason": "deep-improvement-common-certificates.ts assertArtifactOrigin resolves only origin.eventId and compares payload stem and payloadDigest at lines 630-643; it does not bind the origin to the expected run, lineage, scope, or authority identity."
    },
    {
      "id": "F-006-04",
      "verdict": "confirmed",
      "reason": "deep-ai-council-certificates.ts sourceRangeMatchesEvent checks only sourceRange.lastEventId, lastStem, and authorityEpoch at lines 454-464. artifactCorrespondsToEvent then uses that result without comparing the artifact material scope.runId or scope.roundId to the event scope at lines 466-475."
    }
  ],
  "coverage": {
    "filesExamined": 34,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-reference-set.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-retention.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-sealed-artifacts/deep-alignment-sealed-artifact-types.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-research-certificates/deep-research-certificates.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts"
    ]
  }
}
```