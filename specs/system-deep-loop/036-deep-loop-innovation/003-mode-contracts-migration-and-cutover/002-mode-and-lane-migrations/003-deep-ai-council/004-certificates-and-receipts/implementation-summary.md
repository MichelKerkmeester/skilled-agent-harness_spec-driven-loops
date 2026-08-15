---
title: "Implementation Summary: Deep AI Council Certificates and Receipts"
description: "Delivered additive-dark Deep AI Council transition receipts and run certificates with dependency-digest closure, council-specific evidence fields, replay-bound offline verification, and durable conflict detection."
trigger_phrases:
  - "deep ai council certificates implementation"
  - "deep-ai-council receipt issuer"
  - "deep ai council offline certificate verification"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
    last_updated_at: "2026-08-15T13:39:57Z"
    last_updated_by: "codex"
    recent_action: "Reverified certificates receipts and offline verifier at HEAD"
    next_safe_action: "Successor 005-resume-adapter consumes exported evidence contracts"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Plain-digest dependency closure uses an empty named map and resolves every material dependencyDigests entry through the real sealed store"
      - "Trusted completion requires complete terminal status converged eligible gate pass and no untrusted receipts"
      - "Missing sealed bytes offline map to unverifiable rather than invalid"
      - "Council identity uses runId roundId and generation without lineageId"
      - "Projection events must exactly match the verified ledger replay range"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-certificates-and-receipts |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Authority** | Additive-dark evidence only; legacy writers and authority are unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The leaf exports a closed Deep AI Council evidence surface for lifecycle transition receipts, one run certificate, and
offline verification. Issuance re-derives transition facts from `VerifiedLedgerEvent` values read through the real
`AppendOnlyLedger`, verifies every artifact through `readDeepAiCouncilArtifact`, derives the replay fingerprint through
the shared replay walker combined with `orderedDependencyClosureDigest`, and certifies receipts with the registered
durable provider. Council certificate bodies carry `convergenceEvidence`, `statusEvidence`, and `testGateEvidence` plus
`orderedDependencyClosureDigest` without any named plain-digest closure rules.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-ai-council-certificates/deep-ai-council-certificate-types.ts` | Created | Declares closed receipt, certificate, lifecycle, verifier, error, and receipt-substrate types |
| `runtime/lib/deep-ai-council-certificates/deep-ai-council-certificate-validation.ts` | Created | Enforces exact fields, bounded values, closed enums, and strict transport parsing |
| `runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts` | Created | Issues durable receipts and run certificates, folds lifecycle trust, and verifies bundles offline |
| `runtime/lib/deep-ai-council-certificates/index.ts` | Created | Exports the public certificate, receipt, parser, error, and verifier contracts |
| `runtime/tests/unit/deep-ai-council-certificates.vitest.ts` | Created | Drives the real ledger, sealer, replay, HMAC certification, reducer, and tamper paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is a new dark-only runtime package. Transition issuance receives the shared authorized writer, registry, and
producer as an explicit substrate port; it does not create a second ledger or authority path. Verification is local and
read-only over the supplied ledger range, sealed artifacts, provider registry, reducer inputs, and receipt events.
Dependency closure walks each sealed material `dependencyDigests` entry through the run artifact set with epoch and
predecessor-order checks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep logical transition identity independent of result facts | A changed result must collide with the existing durable receipt key instead of minting another valid identity |
| Use empty plain-digest closure map with full dependencyDigests enforcement | Council sealed leaf has no named digest rules; closure still resolves every dependency through the real store |
| Combine substrate replay with dependency closure in replay fingerprint | Offline verification must re-derive the same combined digest without live services |
| Bind verified artifact material to ledger-event identity | Kind-only validation permits a same-kind decoy to attest an unrelated result event |
| Map missing sealed bytes to unverifiable offline | Distinguishes absent evidence from tampered or inconsistent evidence |
| Require exact projection and ledger event equality | Projection-derived status convergence and gate evidence must come from the same authorized history as receipt facts |
| Model repeatable versus once-per-run transition cardinality separately | Multi-seat dispatch and return need distinct logical receipts without weakening singleton boundaries |
<!-- /ANCHOR:decisions -->

---

## Successor Contract

Successor `005-resume-adapter` consumes these public names:

- `DeepAiCouncilTransitionReceiptInput`, `DeepAiCouncilTransitionReceiptFacts`, and `DeepAiCouncilTransitionReceipt`
  recover logical operation identity, attempt history, prior and result heads, authorized result identity and digest,
  replay fingerprint, authority epoch, artifact references, and trusted or unresolved disposition.
- `DeepAiCouncilRunCertificateBody`, `DeepAiCouncilRunCertificate`, and `DeepAiCouncilCertificateBundle` recover the
  run, round, generation, final ledger head, receipt chain, verified artifact set, replay and projection commitments,
  convergence, status, and test-gate evidence, dependency closure digest, outputs, obligations, and lifecycle result.
- `DeepAiCouncilOfflineVerificationInput` and `DeepAiCouncilOfflineVerificationResult` let the adapter validate a local
  bundle before choosing reuse, reconciliation, migration, re-execution, or block.
- `DeepAiCouncilCertificateError` and `DeepAiCouncilCertificateFailureCodes` keep certificate-chain failures distinct
  from the substrate typed `ReceiptEffectError` with `RECEIPT_CONFLICT`.
- `DEEP_AI_COUNCIL_REQUIRED_TRANSITION_ORDER` and `DeepAiCouncilTransitionKinds` define the closed lifecycle profile
  the adapter must honor when rehydrating council runs.

The adapter does not infer success from a resume label. It recovers from verified receipt facts and may treat only
`applied` or `succeeded` dispositions as trusted reuse; `blocked`, `in_doubt`, failed, incomplete, or unverifiable
evidence prevents trusted completion and automatic replay.

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: `deep-ai-council-certificates.vitest.ts` — unverifiable pruned store, dependency closure negatives, forged binding, positive trusted-completion |
| Substrate imports | Real `AppendOnlyLedger`, `AuthorizedEvidenceWriter`, HMAC certification, `deriveReplayFingerprint`, filesystem sealed store, council reducers |
| HEAD closeout | PASS at `5a7ae9a87c04f29db91d5365c6015f2778602080`: 16/16 focused tests in 226.11s; whole-runtime TypeScript exit 0 |

`substrateImportsReal: true`. The suite uses real authorized ledger append, sealed artifact store reads, replay
fingerprint derivation, and council reducer folding without test-local digest or signature substitutes.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The module remains additive-dark and cannot move execution authority or modify the legacy writer.
2. The resume adapter owns re-entry actions, effect reconciliation, and runtime recovery execution; this leaf supplies
   verified evidence and dispositions only.
3. A certificate attests coherent ledger-aligned recorded evidence, not the external truth or completeness of council
   deliberation claims.
<!-- /ANCHOR:limitations -->
