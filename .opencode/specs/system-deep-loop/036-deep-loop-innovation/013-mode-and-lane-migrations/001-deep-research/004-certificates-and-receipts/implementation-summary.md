---
title: "Implementation Summary: Deep Research Certificates and Receipts"
description: "Delivered additive-dark Deep Research receipts and certificates with event-bound artifacts, real memory-handoff digest sources, exact provenance sets, replay-bound offline verification, and durable conflict detection."
trigger_phrases:
  - "deep research certificates implementation"
  - "deep-research receipt issuer"
  - "deep research offline certificate verification"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
    last_updated_at: "2026-07-22T06:26:51Z"
    last_updated_by: "codex"
    recent_action: "Closed handoff digest, initialization-kind, and provenance-set correspondence"
    next_safe_action: "Successor 005-resume-adapter can consume the exported evidence contracts"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-certificates/deep-research-certificates.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The signed durable evidence digest commits to each prior receipt digest without changing shared types"
      - "Trusted completion requires an empty final open-obligation set"
      - "A sealed transition output has one logical receipt owner per certificate"
      - "Projection events exactly match the verified ledger replay range"
      - "Every receipt output is bound to its selected result event and every input resolves to authorized provenance"
      - "Memory final references derive from the ordered memory-save inputs and offered view derives from their verified synthesis output"
      - "Initialization kinds use exact event-field ownership without inventing plan or recipe fields"
      - "Convergence and synthesis provenance uses exact set equality"
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
| **Completed** | 2026-07-22 |
| **Level** | 2 |
| **Status** | Complete |
| **Authority** | Additive-dark evidence only; legacy writers and authority are unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The leaf exports a closed Deep Research evidence surface for lifecycle transition receipts, one run certificate, and
offline verification. Issuance re-derives transition facts from `VerifiedLedgerEvent` values read through the real
`AppendOnlyLedger`, verifies every artifact through `readDeepResearchArtifact`, derives the replay fingerprint through
the shared replay walker, and certifies receipts with the registered durable provider. Both issuance and offline
verification decode the verified canonical material identity and bind it to the selected result event before accepting
receipt facts; input references must also resolve to authorized provenance, with declared analysis, convergence, and
synthesis input lineage checked against the result artifact. Memory handoff correspondence independently derives the
ordered final-reference-set digest from the memory-save receipt inputs and requires the offered view to match a verified
synthesis output digest among those same inputs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-research-certificates/deep-research-certificate-types.ts` | Created and finalized | Declares closed receipt, certificate, lifecycle, verifier, error, and receipt-substrate types |
| `runtime/lib/deep-research-certificates/deep-research-certificate-validation.ts` | Created | Enforces exact fields, bounded values, closed enums, and strict transport parsing |
| `runtime/lib/deep-research-certificates/deep-research-certificates.ts` | Created and fixed | Issues durable receipts and run certificates, folds lifecycle trust, and verifies bundles offline |
| `runtime/lib/deep-research-certificates/index.ts` | Created | Exports the public certificate, receipt, parser, error, and verifier contracts |
| `runtime/tests/unit/deep-research-certificates.vitest.ts` | Created and expanded | Drives the real ledger, sealer, replay, HMAC certification, durable receipt, reducer, and tamper paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is a new dark-only runtime package. Transition issuance receives the shared authorized writer, registry, and
producer as an explicit substrate port; it does not create a second ledger or authority path. Verification is local and
read-only over the supplied ledger range, sealed artifacts, provider registry, reducer inputs, and receipt events.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep logical transition identity independent of result facts | A changed result must collide with the existing durable receipt key instead of minting another valid identity |
| Map incompatible recovery decisions to non-trusted dispositions | A recorded resume event proves a decision occurred; it does not prove stale state is safe to reuse |
| Preserve retryable persistence failure as `in_doubt` | Unknown external outcome requires reconciliation before any replay or trusted completion |
| Verify the durable shared receipt event offline | Certification alone cannot prove the receipt was appended through the authorized ledger path |
| Bind the prior receipt through the existing shared evidence digest | The domain receipt digest already commits to `priorReceiptDigest`; the signed durable payload and issuer conflict comparison both bind that digest without changing the frozen shared payload type |
| Model completeness cardinality separately from logical-operation uniqueness | Multi-source and iterative work needs distinct repeatable receipts without weakening once-per-run boundaries or duplicate-identity rejection |
| Require exact projection/ledger event equality | Projection-derived status and obligations must come from the same authorized history as receipt facts, heads, and replay |
| Make transition output ownership certificate-wide | A sealed artifact cannot truthfully represent the distinct output of two logical transitions |
| Bind verified artifact material to ledger-event identity | Kind-only validation permits a same-kind decoy to attest an unrelated result event; sealed material and authorized payload identity must correspond in issuance and offline verification |
| Derive memory handoff facts from receipt-attested values | Target and continuity event fields cannot prove final-reference or offered-view digests; the ordered memory-save inputs and their verified synthesis output can |
| Assign initialization digests by artifact kind | An objective, configuration, capability, or policy artifact must not borrow another kind's authorized initialization field |
| Require exact convergence and synthesis input sets | Presence-only checks permit undeclared provenance padding in sealed result material |
<!-- /ANCHOR:decisions -->

---

## Correctness Fixes

| Defect | Final behavior | Evidence |
|--------|----------------|----------|
| Recovery disposition ignored compatibility | `exact` and `compatible` map to `applied`; `migrate` and `pin-old-runtime` map to `in_doubt`; `blocked` maps to `blocked` | All five decisions are issued from authorized `run_resumed` events; blocked receipt evidence forces lifecycle `incomplete` and offline verdict `incomplete` |
| Receipt key was derived from protected facts | Stable transition identity excludes the result event; `BoundaryReceiptIssuer` derives the durable key and performs its existing-receipt lookup | Exact repeat returns the same receipt; changed result event throws typed `RECEIPT_CONFLICT`; only one boundary-receipt event exists |
| Memory-save failure ignored retryability | `retryable:true` maps to `in_doubt`; `retryable:false` maps to `failed` | Authorized failure events prove both outcomes |
| Transition artifact checks accepted any verified run artifact | Each reference resolves to an exact verified claim and its registered artifact kind must be valid for the transition role and lifecycle | A real sealed objective is rejected as a gather output with typed `ARTIFACT_INVALID`; the sealed source capture is accepted |
| Receipt ordering was checked after positional chain recomputation | Required lifecycle order and logical-operation uniqueness are asserted before the per-slot prior-digest thread is recomputed | The reordered-chain fixture remains rejected, now without depending on positional mismatch precedence |
| Completeness treated every required transition kind as a singleton | `gather` and `analyze` require one or more distinct logical receipts; `init`, terminal convergence, synthesis, and memory-save still require exactly one | A two-source run issues and offline-verifies successfully; missing synthesis, reused gather identity, and same-length missing-analyze distributions retain typed rejection |
| Gather ignored the source instruction scan | `clean` maps to `succeeded`, `flagged` to `quarantined`, and `unknown` to `in_doubt`; unregistered values fail closed | Authorized source-capture receipts cover all three schema values, and a flagged full run cannot reach trusted completion |
| Analyze honored only part of the source-quality signal class | Admission `admit` with `clean` contamination succeeds; `degrade` is `in_doubt`; `quarantine` and `contaminated` are `quarantined`; `suspected` and `unknown` contamination are `in_doubt`; claim `contested` and `unresolved` remain non-trusted across assertion and relation events | Authorized admission events cover all three dispositions and all four contamination values, including quarantine precedence; claim events cover every registered status without changing the exported disposition union |
| Prior receipt linkage was not an explicit shared-payload field | `receiptDigest` commits to all domain facts including `priorReceiptDigest`, and the durable shared receipt stores and signs that value as `evidence_digest` | A changed prior digest with the same facts-independent receipt key throws typed `RECEIPT_CONFLICT`; the durable event's evidence digest equals the domain receipt digest |
| Open obligations did not block trusted completion | The final trust gate requires the reducer-derived open-obligation set to be empty | An unresolved coverage gap yields lifecycle `incomplete` and offline verdict `incomplete`; the empty-obligation case remains trusted and valid |
| Output uniqueness stopped at one receipt | Certificate issuance and offline verification enforce one logical owner for each sealed transition output | Two distinct gather receipts claiming the same source-capture artifact fail with typed `ARTIFACT_INVALID` |
| Projection input was independent of receipt-ledger evidence | Both issuance and offline verification require exact ordered equality with the verified ledger range before folding | A metadata-only event mismatch fails with `PROJECTION_INVALID` at `projection:ledger-events` in both paths |
| Receipt references proved kind but not event correspondence | The verified sealed material for every output is matched to the selected result event across init, gather, analyze, convergence, synthesis, memory-save, and recovery; inputs must resolve to authorized provenance and declared result-artifact lineage | Same-kind gather and convergence decoys are rejected at issuance, a forged offline gather substitution returns `ARTIFACT_INVALID`, the matching gather artifact remains valid, and an unproven input decoy is rejected; deleting the correspondence gate makes all four negative tests fail |
| Memory handoff digests were format-valid but unbound | `finalReferenceSetDigest` equals the canonical digest of the ordered memory-save input qualified digests; `offeredViewDigest` equals the `outputDigest` of a verified synthesis artifact among those inputs | Fabricated values with truthful target and continuity fields fail issuance at `transition:memory-save:outputs`; the real handoff issues and verifies `valid`; weakening the gate makes the negative test fail |
| Initialization correspondence used an OR across four distinct facts | `OBJECTIVE`, `MODE_CONFIGURATION`, `CAPABILITY_COMMITMENT`, and `POLICY_INPUT` map exactly to charter, configuration, executor, and replay fields; plan frontier and search recipe stay seal-bound because no distinct event fields exist | An objective carrying the distinct executor fingerprint is rejected while the charter-bound objective remains valid; weakening the map makes the negative test fail |
| Convergence and synthesis accepted provenance supersets | Declared receipt input identities and sealed `orderedInputDigests` must be equal sets | Extra unrelated convergence and synthesis digests are rejected; exact sets verify `valid`; weakening equality to a subset test makes both padded cases fail their test |

The boundary-issuer adapter projects only the generic result fields consumed by the frozen shared issuer while retaining
the original authorized event identity, stored digest, authorization reference, and ledger heads. The shared receipt is
appended through `AuthorizedEvidenceWriter`; offline verification resolves that durable receipt event and invokes
`verifyBoundaryReceiptEvent`, so the issuer's facts-independent key and conflict machinery remain authoritative.

---

## Successor Contract

Successor `005-resume-adapter` consumes these public names:

- `DeepResearchTransitionReceiptInput`, `DeepResearchTransitionReceiptFacts`, and `DeepResearchTransitionReceipt`
  recover logical operation identity, attempt history, prior/result heads, authorized result identity and digest,
  replay fingerprint, authority epoch, artifact references, and trusted or unresolved disposition.
- `DeepResearchRunCertificateBody`, `DeepResearchRunCertificate`, and `DeepResearchCertificateBundle` recover the run,
  lineage, generation, final ledger head, receipt chain, verified artifact set, replay and projection commitments,
  convergence/status evidence, outputs, obligations, and lifecycle result.
- `DeepResearchOfflineVerificationInput` and `DeepResearchOfflineVerificationResult` let the adapter validate a local
  bundle before choosing reuse, reconciliation, migration, old-runtime pinning, re-execution, or block.
- `DeepResearchCertificateError` and `DeepResearchCertificateFailureCodes` keep certificate-chain failures distinct
  from the substrate's typed `ReceiptEffectError` with `RECEIPT_CONFLICT`.

The adapter does not infer success from a resume label. It recovers from verified receipt facts and may treat only
`applied` as trusted reuse; `blocked`, `in_doubt`, failed, incomplete, or unverifiable evidence prevents trusted
completion and automatic replay.

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 31 tests; round-eight baseline was 28 tests |
| Mutation falsifier | PASS: weakening all three new gates produced 3 targeted failures with 28 tests skipped |
| Runtime TypeScript compile | PASS: pinned TypeScript 5.9.3, zero errors, exit 0 |
| Comment hygiene | PASS for the changed runtime module and targeted test |
| Leaf document validation | PASS: six authored documents, zero issues |
| Whitespace/error diff check | PASS |
| Strict packet validation | PASS: zero errors |

`substrateImportsReal: true`. The suite uses `AppendOnlyLedger`, `AuthorizedEvidenceWriter`, `BoundaryReceiptIssuer`,
real HMAC certification and verification, `deriveReplayFingerprint`, filesystem-backed sealed artifacts with byte
tampering, and the real Deep Research reducer. No test-local digest, signature, ledger, artifact reader, receipt key, or
replay implementation substitutes for the shared substrate.

The receipt parser rejection case contains only its unregistered-field assertion. Transition artifact validation uses the
predecessor's frozen kind registry, verified claims, and canonical sealed material bytes without changing that sibling.
Result-event quality, handoff derivation, initialization mapping, and artifact-correspondence mapping are private runtime policy, and the
prior-link proof uses the existing signed `evidence_digest`, so no exported certificate, receipt, or shared-substrate type
changed; the successor `005-resume-adapter` contract remains stable.

Projection-ledger equality, open-obligation gating, certificate-wide output ownership, and artifact-event
correspondence are private issuance/verifier checks. They add no field, enum member, public type, digest algorithm,
certification provider, or shared-substrate change.

All previously confirmed robust paths remain green: recovery dispositions, durable `BoundaryReceiptIssuer` conflict
handling, retryable memory-save uncertainty, artifact kind gating, repeatable-versus-once cardinality, real HMAC/ledger/
sealed substrates, exact-field parsing, forged-fact rejection, open-obligation gating, cross-receipt output uniqueness,
per-kind receipt cardinality, and round-seven artifact-to-result-event correspondence across issuance and offline
verification.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The module remains additive-dark and cannot move execution authority or modify the legacy writer.
2. The resume adapter owns re-entry actions, effect reconciliation, branch retry policy, and runtime pin or migration
   execution; this leaf supplies verified evidence and dispositions only.
3. A certificate attests coherent ledger-aligned recorded evidence, not the external truth or completeness of research claims.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Low-level transition receipt certification | Durable transition receipts run through `BoundaryReceiptIssuer` | The shared issuer is the frozen owner of facts-independent idempotency keys, durable lookup, exact-repeat acceptance, and typed conflict detection |
| Blanket successful recovery disposition | Compatibility-specific trusted and unresolved dispositions | Resume evidence must preserve incompatibility and recovery uncertainty |
<!-- /ANCHOR:deviations -->
