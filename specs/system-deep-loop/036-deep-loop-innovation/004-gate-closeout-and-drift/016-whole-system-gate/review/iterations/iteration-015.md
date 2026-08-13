# Iteration 015 — security

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:12:39.742Z
- New findings: 2 (of 2 reported; prior total 53)
- Coverage: {"filesExamined":13,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts",".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts",".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-reference-set.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-sealed-artifacts/deep-review-sealed-artifacts.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificate-validation.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts"]}

## Summary
I traced the generic sealed-artifact evidence path and Deep Review certificate issuance and offline verification. Blob, descriptor, and certificate-body digest recomputation is comparatively strong, but two provenance boundaries compare only partial identities. An authorized decoy creation event can therefore stand in for a different sealed reference, and a decoy mode artifact can be attributed to a legitimate result event without matching that event's substantive payload. These defects can produce cryptographically coherent certificates for false evidence, and the latter deepens F-011-04 from an alignment-specific issue into a cross-mode pattern.

## Findings
- [P0] F-015-01 Creation evidence accepts a different full reference sharing partial digests @ .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts:460
  - evidence: readVerifiedArtifactEvidence filters sealed events only by payload.reference.qualified_digest at lines 461-466, then checks only descriptor_digest and qualified_digest at lines 483-495. It never compares the complete event reference with the requested reference. A ledger event can copy those two digests while changing artifact_kind or canonicalization_version; the subsequent store read verifies the requested reference, so the unrelated event is returned as its creation evidence.
  - recommendation: Require canonical equality of the complete parsed event reference and requested reference. Prefer additionally resolving the event reference through the store and checking its descriptor before accepting the event as creation evidence.
- [P0] F-015-02 Deep Review certificates bind artifacts to events using metadata only @ .opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts:602
  - evidence: artifactCorrespondsToEvent compares only the event stem, event ID, and authority epoch at lines 607-617. It does not compare the artifact's report, delta, claim, convergence, dependency, or content digests with fields in the ledger event. Both requireArtifactEventCorrespondence at lines 906-945 and assertArtifactEventsAuthorized at lines 1279-1291 rely on this predicate, so a newly sealed decoy artifact carrying copied event metadata can satisfy issuance and offline verification against a legitimate event.
  - recommendation: Define a closed per-event-stem correspondence map that recomputes every load-bearing artifact identity from the typed ledger payload, including named digests and dependency closure. Reject artifacts when the event lacks an exact digest commitment instead of accepting metadata-only correspondence.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 15,
  "dimension": "security",
  "summary": "I traced the generic sealed-artifact evidence path and Deep Review certificate issuance and offline verification. Blob, descriptor, and certificate-body digest recomputation is comparatively strong, but two provenance boundaries compare only partial identities. An authorized decoy creation event can therefore stand in for a different sealed reference, and a decoy mode artifact can be attributed to a legitimate result event without matching that event's substantive payload. These defects can produce cryptographically coherent certificates for false evidence, and the latter deepens F-011-04 from an alignment-specific issue into a cross-mode pattern.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Creation evidence accepts a different full reference sharing partial digests",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts",
      "line": 460,
      "evidence": "readVerifiedArtifactEvidence filters sealed events only by payload.reference.qualified_digest at lines 461-466, then checks only descriptor_digest and qualified_digest at lines 483-495. It never compares the complete event reference with the requested reference. A ledger event can copy those two digests while changing artifact_kind or canonicalization_version; the subsequent store read verifies the requested reference, so the unrelated event is returned as its creation evidence.",
      "recommendation": "Require canonical equality of the complete parsed event reference and requested reference. Prefer additionally resolving the event reference through the store and checking its descriptor before accepting the event as creation evidence."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Deep Review certificates bind artifacts to events using metadata only",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts",
      "line": 602,
      "evidence": "artifactCorrespondsToEvent compares only the event stem, event ID, and authority epoch at lines 607-617. It does not compare the artifact's report, delta, claim, convergence, dependency, or content digests with fields in the ledger event. Both requireArtifactEventCorrespondence at lines 906-945 and assertArtifactEventsAuthorized at lines 1279-1291 rely on this predicate, so a newly sealed decoy artifact carrying copied event metadata can satisfy issuance and offline verification against a legitimate event.",
      "recommendation": "Define a closed per-event-stem correspondence map that recomputes every load-bearing artifact identity from the typed ledger payload, including named digests and dependency closure. Reject artifacts when the event lacks an exact digest commitment instead of accepting metadata-only correspondence."
    }
  ],
  "refutations": [
    {
      "id": "F-011-04",
      "verdict": "deepened",
      "reason": "The same provenance weakness is present outside Deep Alignment: Deep Review's artifactCorrespondsToEvent predicate at deep-review-certificates.ts:602-617 binds artifacts to authorized events using only stem, event ID, and authority epoch. The defect is therefore a cross-mode certificate pattern rather than an alignment-only omission."
    }
  ],
  "coverage": {
    "filesExamined": 13,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-reference-set.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-sealed-artifacts/deep-review-sealed-artifacts.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificate-validation.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts"
    ]
  }
}
```