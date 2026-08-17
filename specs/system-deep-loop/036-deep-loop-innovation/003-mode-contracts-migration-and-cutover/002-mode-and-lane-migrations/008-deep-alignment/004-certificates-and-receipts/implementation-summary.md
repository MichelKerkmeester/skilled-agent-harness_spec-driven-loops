---
title: "Implementation Summary: Deep Alignment Certificates and Receipts"
description: "Delivered additive-dark Deep Alignment receipts, a per-run certificate, named-digest closure enforcement, and independent offline verification over the landed alignment contracts."
trigger_phrases:
  - "deep alignment certificates implementation"
  - "deep-alignment receipt issuer"
  - "deep alignment offline certificate verification"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/008-deep-alignment/004-certificates-and-receipts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Verified the cited suite and reconciled closeout evidence"
    next_safe_action: "No leaf-local closeout action remains"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The certificate remains additive-dark evidence and never becomes an evaluator or authority"
      - "Every covered authorized alignment event requires exactly one immutable transition receipt"
      - "Reducer-derived authority applicability conformance convergence and status evidence gates trusted completion"
      - "Named plain digests resolve through verified sealed bytes with kind epoch order and dependency ownership checks"
      - "The replay fingerprint commits to the shared replay result and ordered named-digest dependency closure"
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
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Authority** | Additive-dark evidence only; legacy writers and authority are unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The new `runtime/lib/deep-alignment-certificates` package follows the four-file certificate layout. It exports closed
certificate, receipt, parser, error, transition-kind, closure-rule, issuer, and offline-verifier contracts. Receipt issuance
re-derives authorization, ledger heads, event identity, disposition, artifact inputs and outputs, replay commitment, and the
predecessor receipt from real authorized-ledger records.

The per-run certificate binds the reducer-derived run and session identity, authority validation, applicability coverage,
conformance state, convergence state, terminal status, finalized ledger range, sealed artifact set, receipt chain, projection
integrity digest, and replay fingerprint. Trusted completion requires a complete terminal projection, a valid active authority,
stop-eligible convergence, passing terminal decision, complete lanes, no unresolved applicability, no active or veto findings,
no open obligations, and no non-trusted receipt disposition.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-alignment-certificates/deep-alignment-certificate-types.ts` | Created | Declares the closed certificate, receipt, closure, verifier, and failure contracts |
| `runtime/lib/deep-alignment-certificates/deep-alignment-certificate-validation.ts` | Created | Parses exact transport fields and rejects unregistered shapes or values |
| `runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts` | Created | Issues receipts and certificates and independently verifies their dependency closure |
| `runtime/lib/deep-alignment-certificates/index.ts` | Created | Exports the public alignment certificate surface |
| `runtime/tests/unit/deep-alignment-certificates.vitest.ts` | Created | Pins the transition vocabulary, closure registry, parsers, and typed verifier failures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The certificate package was implemented against the real authorized ledger, reducer, replay, receipt-certification, and
sealed-artifact stores. Verification uses an issued 20-receipt bundle and mutates its sealed dependency closure only at the
declared fail-closed boundaries.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep certificates additive-dark | Evidence can be independently verified without moving execution authority |
| Recompute the ordered named-digest closure | Certificate fields cannot substitute caller-declared kinds or unsealed bytes |
| Treat repeated lane and pass receipts as one ordered lifecycle family | Later completion receipts retain chronology without becoming false order regressions |
| Bind final evidence as verified transition inputs | Completion can attest sealed evidence without pretending each input is the result artifact of the terminal event |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:closure -->
## Named-Digest Closure

The verifier resolves the predecessor-deferred fields through `readDeepAlignmentArtifact`. The frozen map covers:

- applicability, detector, verifier, witness, finding, and exception subject references to target snapshots;
- detector, verifier, and finding applicability references to applicability decisions;
- finding and exception authority references to authority capsules and exception finding references to finding evidence;
- convergence ordered inputs and finding, exception, and unresolved views;
- report ordered inputs, convergence input, finding and exception views, unresolved findings, and the report identity;
- handoff affected lanes, affected findings, and offered alignment-report view.

Each reference must resolve to actually sealed bytes of an allowed kind at the same authority epoch. The containing artifact
must own the dependency, the referenced claim must precede the container, arrays preserve element order, and the ordered
closure is committed into the replay fingerprint. The predecessor's authority, finding, and issuer dependency checks remain
active because all reads use the landed verified reader.
<!-- /ANCHOR:closure -->

---

<!-- ANCHOR:substrate -->
## Substrate and Boundaries

`substrateImportsReal: true`. The implementation imports `deep-alignment-ledger-schema`,
`deep-alignment-reducers`, `deep-alignment-sealed-artifacts`, `authorized-ledger`, `event-envelope`,
`replay-fingerprint`, `sealed-reference-artifacts`, and `receipts-and-effect-recovery`.

The module adds alignment certificate and receipt bindings only. It does not import Deep Review certificates, fork the shared
review-loop contract, implement a reducer or sealed store, prescribe resume decisions, move authority, or alter the legacy
writer.
<!-- /ANCHOR:substrate -->

---

<!-- ANCHOR:successor -->
## Successor Contract

Successor `005-resume-adapter` consumes:

- `DeepAlignmentTransitionReceiptInput`, `DeepAlignmentTransitionReceiptFacts`, and
  `DeepAlignmentTransitionReceipt` for logical operation, attempts, authorized result, heads, artifact closure, disposition,
  replay fingerprint, authority epoch, and predecessor receipt;
- `DeepAlignmentRunCertificateBody`, `DeepAlignmentRunCertificate`, and `DeepAlignmentCertificateBundle` for run identity,
  terminal evidence, finalized range, artifact set, receipt chain, closure digest, projection digest, and replay commitment;
- `DeepAlignmentOfflineVerificationInput` and `DeepAlignmentOfflineVerificationResult` before choosing reuse,
  reconciliation, migration, old-runtime pinning, re-execution, or block;
- `DeepAlignmentCertificateError` and `DeepAlignmentCertificateFailureCodes` for typed fail-closed recovery decisions.

The adapter checkpoints and resumes over verified certificate and receipt facts. It must not infer success from a resume label,
an artifact under audit, or an incomplete lifecycle.
<!-- /ANCHOR:successor -->

---

<!-- ANCHOR:verification -->
## Verification

The focused Vitest suite passes `92/92` in 61.37s. It issues a real 20-receipt bundle and exercises all 25 declared closure fields
with wrong-kind and fabricated or missing evidence through `verifyDeepAlignmentCertificateOffline`. It also covers a pruned
offline store returning `unverifiable`, a forged binding rejected during verified reads, and a genuine incomplete terminal
disposition rejected by the verifier lifecycle guard.

Whole-runtime TypeScript passes with `tsc --noEmit --ignoreDeprecations 6.0` at exit 0. The compile repair added transition input
digests to the internal ownership claim, while the issued-bundle fixture also verified repeated lane and pass receipts,
completion-input closure ownership, and lane-completion artifact correspondence.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The package is additive-dark and cannot move execution authority.
2. The successor owns resume planning and effect reconciliation.
3. A certificate attests recorded process integrity rather than independent semantic truth.
4. Visibility redaction, authority revocation, selector-semantic resolution, and a distinct schema-incompatible outcome remain
   inherited or substrate-limited boundaries.
<!-- /ANCHOR:limitations -->
