---
title: "Implementation Summary: Deep Improvement Common Certificates and Receipts"
description: "The additive-dark shared contract now issues run certificates and transition receipts and independently verifies their authorized sealed dependency closure."
trigger_phrases:
  - "deep improvement common certificate implementation"
  - "deep improvement offline verifier implementation"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Verified certificates/receipts closeout; suite 22/22 passed, exit 0"
    next_safe_action: "Deep-improvement-common complete; close benchmark variant modes next"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Plain unresolved and veto evidence digests resolve to sealed raw-trial-output artifacts"
      - "The three variants reuse one frozen certificate, receipt identity, and offline-verifier surface"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-certificates-and-receipts |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; certificates attest evidence and never authorize production |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The four-file module `runtime/lib/deep-improvement-common-certificates/` now owns one stable certificate, receipt,
receipt-identity, replay-closure, and offline-verification contract for agent improvement, model benchmark, and skill
benchmark.

- `DeepImprovementCommonRunCertificate` records run lineage, base and candidate inputs, evaluator and canary epochs,
  retained raw observations, promotion evidence, verdict, reducer projection digest, real replay fingerprint, ordered
  dependency closure, and the complete receipt chain.
- `DeepImprovementCommonTransitionReceipt` binds one authorized result event to ordered input, output, evidence, and
  predecessor receipt identities. `DeepImprovementCommonReceiptIdentity` makes duplicate delivery reproducible.
- `issueDeepImprovementCommonRunCertificate` and `issueDeepImprovementCommonTransitionReceipt` use the real authorized
  ledger, common reducer, sealed store, replay-fingerprint service, and receipt certification provider.
- `verifyDeepImprovementCommonCertificateOffline` re-reads all immutable inputs without a network or mutable evaluator,
  recomputes raw-to-normalized score relations, both replay fingerprints, receipt identities and chain links, policy
  verdict, certificate digest, and certifications, then emits its own deterministic verifier receipt.
- `DEEP_IMPROVEMENT_COMMON_SHARED_CERTIFICATE_CONTRACT` freezes the unchanged owner and consumer set for all three
  variants.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-improvement-common-certificates/` | Created | Shared types, closed parsers, issuers, and verifier |
| `runtime/tests/unit/deep-improvement-common-certificates.vitest.ts` | Created | Real-substrate positive and fail-closed coverage |
| `004-certificates-and-receipts/*.md` | Updated | Completion evidence and successor handoff |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation mirrors the landed deep-research certificate module's four-file public shape, then substitutes the
common improvement ledger transitions and six-kind sealed taxonomy. Every transition result is resolved from verified
authorized-ledger records. Every artifact is read through `readDeepImprovementCommonArtifact`, matched to an authorized
origin event, and assigned to one receipt output owner.

The field-to-kind closure map binds `PROMOTION_EVIDENCE.unresolvedEvidenceDigests[]` and
`PROMOTION_EVIDENCE.vetoEvidenceDigests[]` to `deep-improvement-common-raw-trial-output`. Each element resolves through
the real store and must have one claim owner, the expected kind, a matching evaluator epoch, and valid lifecycle state.
The predecessor adapter continues to verify fully qualified embedded references.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep authority `dark-evidence-only` | A certificate attests completed evidence but cannot become a promotion authority |
| Export one stable receipt identity | The three variants and resume adapter can deduplicate shared transitions without redefining identity |
| Layer the closure fingerprint over the real replay fingerprint | Ledger replay stays substrate-owned while ordered artifacts and transition dependencies become explicit |
| Resolve plain promotion digests as raw trial outputs | The predecessor deferred these named fields, and the shared taxonomy identifies raw trials as their evidence kind |
| Require real artifact origins in the authorized ledger | Store membership alone does not prove run ownership or transition authorization |
| Emit a verifier receipt | Later audits can bind verifier version and ruleset to the exact certificate evidence |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 18 tests, 18 passed |
| Real substrate | PASS: authorization gateway, append-only ledger, reducer, replay registry, sealed store, and certification provider exercised |
| Fail-closed inputs | PASS: missing offline bytes return `unverifiable`; both named-digest fields reject fabricated and wrong-kind evidence; forged artifact bindings fail at the exact-reference store guard |
| Unknown version | PASS: offline verifier returns typed `unsupported` with `UNSUPPORTED_VERSION` |
| Runtime TypeScript | PARTIAL: project-pinned TypeScript 5.9.3 reports missing linked dependency types across the runtime; `deep-improvement-common-certificates` diagnostics grep is 0 |
| Comment hygiene | PASS: no packet, requirement, checklist, or spec-path markers in runtime code comments |
| Scope audit | PASS: this coverage fix modifies only the focused unit test, checklist, and implementation summary |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. The contract remains additive-dark. A later cutover must explicitly accept it before any production authority changes.
2. Variant-specific candidate or task evidence must layer outside this shared receipt vocabulary and cannot redefine the
   shared evaluator, canary, or promotion identities.
3. The successor resume adapter must replay exact predecessor identities, treat `uncertain` as blocked until a
   `recovered` receipt exists, and reject unsupported or unverifiable bundles.
<!-- /ANCHOR:limitations -->

### Successor Contract

`005-resume-adapter` checkpoints `certificateDigest`, `replayFingerprint`, ordered `receiptIdentities`,
`receiptDigests`, terminal verdict, authority epoch, and `verificationReceipt`. It resumes only an exact verified chain,
salvages unknown effects through an explicit recovery receipt, and never infers success from a process exit.
