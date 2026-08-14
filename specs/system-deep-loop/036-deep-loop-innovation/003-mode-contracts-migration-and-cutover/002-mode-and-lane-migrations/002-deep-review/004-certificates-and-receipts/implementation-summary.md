---
title: "Implementation Summary: Deep Review Certificates and Receipts"
description: "Delivered additive-dark Deep Review transition receipts, run certificates, named-digest closure enforcement, and independent offline verification."
trigger_phrases:
  - "deep review certificates implementation"
  - "deep-review receipt issuer"
  - "deep review offline certificate verification"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
    last_updated_at: "2026-07-27T19:35:04Z"
    last_updated_by: "codex"
    recent_action: "Implemented receipts, certificates, and offline closure verification"
    next_safe_action: "Successor 005 can consume verified checkpoint evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Certificates remain dark-only attestations and carry no execution authority"
      - "Every authorized typed transition in the pinned range requires exactly one receipt"
      - "Receipt predecessor links and ordering are recomputed from durable ledger evidence"
      - "Named plain digests resolve to actually sealed predecessor content of exact expected kinds"
      - "Missing offline artifact bytes return unverifiable rather than valid or invalid"
      - "Replay fingerprints bind the shared replay result to the ordered artifact dependency closure"
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

The leaf adds a four-file `deep-review-certificates` package matching the landed Deep Research certificate package's
public shape. It exports closed certificate and receipt types, strict parsers, a typed error and failure-code vocabulary,
one receipt issuer per authorized transition, one certificate issuer per run, and
`verifyDeepReviewCertificateOffline`.

Issuance and verification both read the real append-only authorized ledger, fold the landed Deep Review reducer, read
artifacts through the landed Deep Review sealed-artifact binding, derive the shared replay fingerprint, and certify
durable receipt events through the shared receipt provider. No reducer, sealed store, ledger, replay walker, effect
recovery implementation, resume policy, or authority path is duplicated.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-review-certificates/deep-review-certificate-types.ts` | Created | Declares closed receipts, certificates, closure rules, verifier results, and typed errors |
| `runtime/lib/deep-review-certificates/deep-review-certificate-validation.ts` | Created | Parses exact fields, bounded tokens, digests, enums, receipts, certificates, and bundles |
| `runtime/lib/deep-review-certificates/deep-review-certificates.ts` | Created | Issues receipts and certificates and independently re-verifies their complete evidence closure |
| `runtime/lib/deep-review-certificates/index.ts` | Created | Exports the public certificate, receipt, parser, closure-map, error, and verifier surface |
| `runtime/tests/unit/deep-review-certificates.vitest.ts` | Created | Drives real ledger, reducer, replay, sealing, certification, receipt, and offline tamper paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation mirrors the landed Deep Research package's four-file structure while using only Deep Review
contracts. Receipt issuance derives transition facts from verified authorized-ledger events, seals and rereads
mode-owned evidence through the Deep Review artifact store, folds the Deep Review reducer, and delegates durable
receipt certification and replay derivation to the frozen shared substrate.

Offline verification starts from copied certificate, receipt, ledger, and sealed-artifact inputs. It reparses signed
bodies, revalidates the pinned ledger range and authorization records, replays the reducer, reconstructs transition
coverage and predecessor order, resolves every named digest through the sealed store, and recomputes both replay
fingerprints before accepting trusted completion.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. Certificate presence is evidence, not authority; the package remains additive-dark.
2. Missing referenced bytes produce `unverifiable`, while contradictory or forged evidence produces `invalid`.
3. Every authorized typed transition in the certificate range owns exactly one receipt and one exact predecessor link.
4. Plain named digests are accepted only when a unique earlier sealed claim of an allowed kind and matching authority
   epoch owns the dependency.
5. The replay fingerprint commits to both the shared ledger replay descriptor and the ordered named-digest closure.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:closure -->
## Named-Digest Closure

`DEEP_REVIEW_NAMED_DIGEST_CLOSURE_RULES` freezes all 24 deferred field rules. The verifier resolves every scalar and
array element by content digest against verified certificate claims, requires a unique sealed owner of an allowed kind,
checks authority epoch equality, requires predecessor ordering, and requires the containing artifact to own the exact
sealed dependency reference.

| Containing kind | Fields | Expected kinds |
|-----------------|--------|----------------|
| `DIMENSION_PASS` | `orderedInputDigests` | Scope-init kinds |
| `DIMENSION_PASS` | `selectedTargetDigests` | `TARGET_SNAPSHOT` |
| `DIMENSION_PASS` | `searchLedgerDigest` | `SCOPE_REFERENCE_SET` |
| `DIMENSION_PASS` | `diagnosticsDigest`, `observationDigests`, `graphEventDigest`, `deltaDigest` | `CONTEXT_SNAPSHOT` |
| `DIMENSION_PASS` | `iterationDigest` | `REVIEW_CONTRACT` |
| `CANDIDATE_EVIDENCE` | `claimDigest`, `evidenceDigests`, `intermediateFactDigests`, `reproductionDigest`, `refutationDigest` | `DIMENSION_PASS` |
| `ADJUDICATION_EVIDENCE` | `claimDigest`, `evidenceDigests`, `intermediateFactDigests`, `reproductionDigest`, `refutationDigest` | `CANDIDATE_EVIDENCE` |
| `CONVERGENCE_WITNESS` | `orderedInputDigests` | Pass, candidate, or adjudication evidence |
| `CONVERGENCE_WITNESS` | `gateResultDigests` | `ADJUDICATION_EVIDENCE` |
| `SYNTHESIS_VIEW`, `SYNTHESIS_REPORT` | `reportDigest` | `DIMENSION_PASS` |
| `RESUME_HANDOFF` | `priorReferenceSetDigest` | `SYNTHESIS_REPORT` |
| `RESUME_HANDOFF` | `changedInputDigest` | `TARGET_SNAPSHOT` |

The ordered resolution trace is hashed into `orderedDependencyClosureDigest`. The run replay fingerprint then commits to
both the real shared replay descriptor and that closure digest. Reordering claims, substituting another kind, changing
an epoch, removing bytes, fabricating a digest, or detaching a dependency changes or invalidates the result.
<!-- /ANCHOR:closure -->

---

<!-- ANCHOR:successor -->
## Successor Contract

Successor `005-resume-adapter` consumes:

- `DeepReviewTransitionReceiptInput`, `DeepReviewTransitionReceiptFacts`, and
  `DeepReviewTransitionReceipt` for logical transition identity, attempt history, authorized result event, ledger heads,
  input/output artifacts, predecessor receipt, disposition, replay fingerprint, and authority epoch.
- `DeepReviewRunCertificateBody`, `DeepReviewRunCertificate`, and `DeepReviewCertificateBundle` for session and
  generation identity, finalized ledger heads, artifact and receipt roots, ordered dependency closure, replay and
  projection commitments, convergence and status evidence, outputs, obligations, and lifecycle result.
- `DeepReviewOfflineVerificationInput` and `DeepReviewOfflineVerificationResult` to verify a copied checkpoint before
  choosing reuse, re-execution, reconciliation, migration, runtime pinning, or block.
- `DeepReviewCertificateError`, `DeepReviewCertificateFailureCodes`, and
  `DEEP_REVIEW_NAMED_DIGEST_CLOSURE_RULES` for typed refusal and stable field-kind expectations.

The adapter checkpoints over certificate-pinned ledger heads, receipt predecessor chains, verified sealed artifact
references, and the replay plus dependency-closure fingerprints. It must not treat a resume label or certificate
presence as authority; only a `valid` offline result with trusted completion is eligible evidence for a later policy
decision.
<!-- /ANCHOR:successor -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 58 tests |
| Per-field closure negatives | PASS: 24 fabricated or missing and 24 wrong-kind verifier cases |
| Missing offline bytes | PASS: separate pruned store returns `unverifiable` |
| Receipt-chain negatives | PASS: mutation, reordering, forged authorization, and broken predecessor link fail closed |
| Artifact negatives | PASS: forged binding, mutation, stale epoch, unauthorized provenance, and wrong kind fail closed |
| Runtime TypeScript compile | PASS: pinned TypeScript 5.9.3, exit 0, zero module diagnostics |
| Comment hygiene and diff check | PASS |
| Strict packet validation | PASS: external primary runner, exit 0, zero errors |

`substrateImportsReal: true`. Runtime imports include the landed `deep-review-ledger-schema`,
`deep-review-reducers`, and `deep-review-sealed-artifacts` packages plus the real `authorized-ledger`,
`event-envelope`, `replay-fingerprint`, `sealed-reference-artifacts`, and
`receipts-and-effect-recovery` substrate. The module imports no other mode's certificate package.

The pinned TypeScript 5.9.3 launcher and type roots were resolved from the primary checkout because this worktree omits
the corresponding dependency links. The targeted Vitest package was run directly with its runner config loader because
`.bin` is absent and the default loader cannot create a cache directory through the read-only dependency symlink.
The prescribed in-worktree validation launcher hit the documented `@spec-kit/shared` linked-worktree dependency gap;
the primary checkout's same validator then checked this worktree's absolute packet path. No packages were installed.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The package remains additive-dark and cannot move execution authority or change the legacy writer.
2. Resume reuse, effect reconciliation, migration execution, and authority cutover remain owned by later leaves.
3. The certificate attests recorded process integrity and closure, not the semantic truth of a finding.
4. Visibility, lifecycle, freshness, and authority-liveness checks apply where those properties are borne by the landed
   artifact and ledger contracts; this leaf does not invent missing authority or visibility fields.
<!-- /ANCHOR:limitations -->
