---
title: "Implementation Summary: Skill Benchmark Certificates and Receipts"
description: "Authored additive-dark Skill Benchmark run certificates, transition receipts, offline verification, deferred plain-digest closure enforcement, and shared common-service delegation."
trigger_phrases:
  - "skill benchmark certificates implementation"
  - "skill-benchmark receipt issuer"
  - "skill benchmark offline certificate verification"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-07-27T21:30:36Z"
    last_updated_by: "codex"
    recent_action: "Verified 19 certificate tests"
    next_safe_action: "Successor 005-resume-adapter can consume verified bundles"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-certificates/skill-benchmark-certificates.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deferred assignment and skill-bundle pairs resolve through the real sealed store"
      - "Mode receipts preserve shared evaluator canary and promotion receipt identities"
      - "Trusted issuance requires reducer-derived complete unblocked evidence"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-certificates-and-receipts |
| **Implemented** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Authority** | Additive-dark evidence only; legacy writers and runtime authority are unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The leaf adds the `runtime/lib/skill-benchmark-certificates` adapter with one per-run
`skill-effect-certificate.v1`, authorized transition receipts, strict parsers, typed failures, replay commitments, and
an offline verifier. The adapter folds the landed Skill Benchmark reducer, reads the landed sealed-artifact bindings,
replays the real authorized ledger, derives the shared replay fingerprint, persists certified boundary receipts, and
delegates shared evaluator, canary, scoring, and promotion verification to
`deep-improvement-common-certificates`.

The certificate binds the reducer-derived run and validity slice, treatment-arm coverage, artifact claims, ordered
receipt closure, projection digest, replay fingerprint, common certificate digest, common receipt identities, and the
final authorized ledger heads. The terminal guard rejects blocked, incomplete, incompatible, unresolved, non-scored,
non-converged, withheld, expired, uncertain, or vetoed evidence.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/skill-benchmark-certificates/skill-benchmark-certificate-types.ts` | Created | Closed certificate, receipt, verifier, transition, failure, and closure-map types |
| `runtime/lib/skill-benchmark-certificates/skill-benchmark-certificate-validation.ts` | Created | Exact-field parsers and bounded semantic validation |
| `runtime/lib/skill-benchmark-certificates/skill-benchmark-certificates.ts` | Created | Issuance, receipt persistence, real-store closure, lifecycle guard, and offline verifier |
| `runtime/lib/skill-benchmark-certificates/index.ts` | Created | Public export surface |
| `runtime/tests/unit/skill-benchmark-certificates.vitest.ts` | Created | Real-substrate issuance plus verifier-driven closure and fail-closed fixtures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- ANCHOR:closure -->
### Cross-Artifact Closure

The certificate publishes and re-verifies this frozen field-to-kind map:

| Containing kind | Plain reference pair | Expected sealed kind |
|-----------------|----------------------|----------------------|
| `EXPOSURE_OBSERVATION` | `assignmentId` + `assignmentDigest` | `RUN_ASSIGNMENT` |
| `CAUSAL_SCORE_OBSERVATION` | `assignmentId` + `assignmentDigest` | `RUN_ASSIGNMENT` |
| `RUN_ASSIGNMENT` | `skillBundleRef` + `skillBundleDigest` | `SKILL_BUNDLE_SNAPSHOT` |

For each pair, the verifier resolves one real sealed target, compares the semantic reference and digest, checks the
registered kind, requires predecessor ordering, verifies the target bytes, and recomputes the composite replay
fingerprint over artifact claims plus the ordered receipt dependency closure. Missing store bytes are classified as
`unverifiable`; fabricated, wrong-kind, mutated, stale, reordered, or unauthorized evidence fails closed.
<!-- /ANCHOR:closure -->

---

<!-- ANCHOR:shared-reuse -->
### Shared-Service Reuse

The adapter consumes `parseDeepImprovementCommonCertificateBundle` and
`verifyDeepImprovementCommonCertificateOffline`, embeds `DeepImprovementCommonCertificateBundle`, and carries
`DeepImprovementCommonReceiptIdentity` values without rewriting them. Evaluator establishment, candidate scoring,
canary checking, promotion proposal, promotion authorization or blocking, guarded promotion, abort, restoration,
shared receipt persistence, and shared offline-verifier behavior remain owned by the common module.

Mode receipt fingerprints include the unchanged common receipt identities. The offline verifier compares those
identities against the embedded common certificate before accepting Skill Benchmark evidence.
<!-- /ANCHOR:shared-reuse -->

### Fail-Closed Fixture Matrix

The scoped test authors nineteen expanded cases: a valid issuance and offline replay, one blocked terminal fixture,
one coherently signed non-`PASS` disposition rejection,
missing offline bytes, six field-specific fabricated or wrong-kind closure replacements, forged claim binding,
unauthorized origin, reordered receipts, broken predecessor linkage, mutated claims, stale canary evidence, malformed
certificate input, unsupported bundle version, and the frozen closure-map contract. These cases use the real authorized
ledger, reducer, replay fingerprint, sealed store, receipt issuer, certification provider, common certificate verifier,
and mode offline verifier.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Resolve deferred plain-reference pairs through the real sealed store | The certificate verifier must authenticate named closure, not trust duplicated ids or digests |
| Reuse the common certificate parser and offline verifier | Evaluator, canary, scoring, promotion, and receipt semantics remain owned by the shared service |
| Classify missing offline bytes as `unverifiable` | A pruned verifier store is different from fabricated or cryptographically invalid evidence |
| Reject a coherent non-`PASS` disposition after cryptographic verification | A genuine lifecycle failure cannot be promoted to success by valid signatures or receipt bindings |
| Keep the accepted golden/common exclusions outside this leaf | Visibility, authority revocation, selector semantics, and schema-incompatibility distinction remain inherited boundaries |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:successor -->
## Successor Contract

Successor `005-resume-adapter` consumes:

- `SkillBenchmarkTransitionReceiptInput`, `SkillBenchmarkTransitionReceiptFacts`,
  `SkillBenchmarkTransitionReceipt`, and `SkillBenchmarkReceiptIdentity`.
- `SkillBenchmarkRunCertificateBody`, `SkillBenchmarkRunCertificate`, and
  `SkillBenchmarkCertificateBundle`.
- `SkillBenchmarkOfflineVerificationInput`, `SkillBenchmarkOfflineVerificationResult`, and
  `SkillBenchmarkOfflineVerifierReceipt`.
- `SkillBenchmarkCertificateError`, `SkillBenchmarkCertificateFailureCodes`, and
  `SkillBenchmarkTransitionKinds`.
- `issueSkillBenchmarkTransitionReceipt`, `issueSkillBenchmarkRunCertificate`,
  `verifySkillBenchmarkCertificateOffline`, and the three exported parse functions.

Resume checkpoints over the verified certificate digest, composite replay fingerprint, projection integrity digest,
receipt-chain digest, final ledger head, mode receipt identities, and preserved common receipt identities. A `valid`
offline result can be evaluated for reuse. `invalid`, `incomplete`, `unverifiable`, or `unsupported` evidence requires
reconciliation, quarantine, or re-execution; this leaf does not choose or perform the resume action.
<!-- /ANCHOR:successor -->

---

<!-- ANCHOR:verification -->
## Verification

Fresh verification completed on 2026-07-27:

- `.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts .opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-certificates.vitest.ts`
  passed `19/19` tests in `216.96s`.
- `.opencode/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json`
  exited `0`; the `skill-benchmark-certificates` error filter returned `0` matches.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <leaf> --strict --verbose`
  passed with `Errors: 0` and `Warnings: 0` after generated-metadata reconciliation.

The visibility-redaction, authority-revocation, locator-selector semantic, and schema-incompatibility distinction remain
inherited from the accepted golden/common boundaries and were intentionally not reimplemented or retested in this leaf.

`substrateImportsReal: true`. Runtime imports cover `skill-benchmark-ledger-schema`,
`skill-benchmark-reducers`, `skill-benchmark-sealed-artifacts`, `authorized-ledger`, `event-envelope`,
`replay-fingerprint`, `sealed-reference-artifacts`, `receipts-and-effect-recovery`, and
`deep-improvement-common-certificates`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The module remains additive-dark and cannot move execution authority or retire the legacy writer.
2. Resume policy, checkpoint persistence, unknown-effect reconciliation, and re-entry execution remain successor-owned.
3. The accepted golden/common visibility, authority, selector, and schema-incompatibility boundaries remain outside this leaf.
<!-- /ANCHOR:limitations -->
