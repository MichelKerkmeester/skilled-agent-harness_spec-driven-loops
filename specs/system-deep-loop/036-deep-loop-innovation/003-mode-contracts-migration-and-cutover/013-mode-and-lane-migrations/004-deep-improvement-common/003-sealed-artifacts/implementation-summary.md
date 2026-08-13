---
title: "Implementation Summary: Deep Improvement Common Sealed Reference Artifacts"
description: "The additive-dark deep-improvement common adapter binds evaluator, candidate, baseline, trial, canary, and promotion evidence to the landed content-addressed sealer."
trigger_phrases:
  - "deep improvement common sealed artifact implementation"
  - "deep improvement sealed artifact contract"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
    last_updated_at: "2026-07-24T03:42:00Z"
    last_updated_by: "codex"
    recent_action: "Closed access-role variants and unknown-role visibility fallthrough"
    next_safe_action: "Bind successor certificates and receipts to cross-artifact closure evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-sealed-artifacts/deep-improvement-common-sealed-artifacts.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-sealed-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-sealed-artifacts.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-improvement-common-sealed-artifacts-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Six common kinds use the shared phase-007 sealer"
      - "Dependencies are recursively kind-checked before release"
      - "Candidate views expose commitments and bounded budgets only"
      - "Promotion requires fresh, complete, passing evidence"
      - "Evaluator capsule epochs must match their consumers"
      - "Access roles normalize against a closed enum before reads"
      - "Unknown roles inherit candidate-restricted visibility"
      - "Frozen-store reference borrowing is mitigated on read"
      - "The successor owns full cross-artifact digest closure"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-sealed-artifacts |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
| **Status** | Complete |
| **Posture** | Additive-dark; no legacy authority, reducer, receipt, certificate, or gate changes |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The four-file module `runtime/lib/deep-improvement-common-sealed-artifacts/` exports one stable contract for the common evaluator-first loop:

- `DeepImprovementCommonArtifactKinds` covers evaluator capsules, candidate inputs, baseline inputs, raw trial outputs, canary epochs, and promotion evidence.
- `DeepImprovementCommonSealedArtifactBinding`, `DeepImprovementVerifiedSealedArtifact`, and `DeepImprovementCommonSealedArtifactContract` are the shared binding/read/ownership types for the three downstream variants.
- `sealDeepImprovementCommonArtifact` and `createDeepImprovementCommonSealedArtifactStore` drive the landed `SealedArtifactStore`; no local digest, signature, manifest, storage, or verification scheme exists.
- `readDeepImprovementCommonArtifact` normalizes and validates the access role, applies restricted visibility before artifact or dependency reads, then verifies the binding, shared descriptor and bytes, closed material envelope, every embedded reference's expected kind, ordered dependency closure, evaluator-capsule epoch equality, caller-required evaluator epoch, and canary freshness before returning bytes. Unknown or malformed roles use candidate-restricted behavior. This read-time kind check remains the leaf mitigation for the frozen store's seal-time acceptance of a borrowed digest pair under a mismatched kind label.
- `readDeepImprovementCandidateView` returns only evaluator commitments, withheld-visibility policy, and bounded query/byte budgets.
- `readDeepImprovementPromotionEvidence` requires complete passing evidence, a fresh matching canary, sufficient uncertainty lower bound, cost compliance, and empty unresolved/veto sets.

All material payloads use exact object keys, typed digest/token/enum/ratio/count rules, structured locators, and sealed references. The semantic field map fixes `candidateInputReference` to candidate input, `baselineInputReference` to baseline input, `evaluatorCapsuleReference` to evaluator capsule, `canaryEpochReference` to canary epoch, `parentCandidateReference` to candidate input, and `supersedesReference` to canary epoch. Generic evidence, output, trace, source, incumbent, rollback, and dependency references are still kind-checked against the kind declared by their sealed reference because those fields intentionally accept multiple artifact families. Mutable bodies, open objects, prose selectors, and incomplete dependency coverage are rejected before publication.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The focused suite proves deterministic re-sealing, all six kind bindings, unsealed and tampered references, truncated bytes, interrupted publication, missing dependency closure, stale caller-required evaluator epoch, stale canary lifecycle, candidate leakage prevention, and promotion admissibility. Candidate role controls plus `Candidate`, `CANDIDATE`, leading/trailing whitespace variants, and unknown `xyz` are refused without bytes or material; the evaluator control receives the full capsule fields and budget policy. A denied variant also wins before an intentionally missing off-limits dependency, proving a stable typed veto. The suite additionally binds a real raw-trial reference into each of the candidate, baseline, and evaluator fields and proves typed rejection, then binds a genuinely sealed epoch-2 evaluator capsule into epoch-1 promotion evidence and proves `EPOCH_MISMATCH`. A correct-kind, matching-epoch promotion remains eligible. The real store is used for every seal/read path.

The module imports the landed `deep-improvement-common-ledger-schema` types and event stems, the phase-007 `SealedArtifactStore`, its canonicalizer/reference types, and the frozen event-envelope canonicalization path. `substrateImportsReal: true`. The adapter does not claim to make the frozen store reject every seal-time cross-artifact reference borrow; the successor certificates-and-receipts leaf owns closure over named artifacts and authenticated evidence.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep the phase-007 store as the only sealer | Shared digest, descriptor, publication, quarantine, and verified-read behavior stays authoritative |
| Put dependency references inside closed canonical material | Ordered dependency closure changes the content identity and remains replayable after policy changes |
| Enforce expected kinds at embedded reference fields | Existence and digest verification cannot prove that a candidate, baseline, evaluator, or canary slot names the required semantic artifact |
| Compare the resolved evaluator capsule epoch to its consumer | A promotion's self-declared epoch cannot prove that its bound evaluator actually belongs to the same epoch |
| Normalize and validate consumer roles before reads | Case, whitespace, unknown, or malformed role input must never inherit unrestricted visibility; one normalized value also controls canary freshness |
| Accept the frozen store's seal-time borrowing boundary and mitigate on read | The shared substrate is frozen; wrong-kind declared references fail before byte release, while full cross-artifact closure remains successor-owned |
| Separate candidate views from artifact reads | Candidate generators receive commitments and bounded budgets without hidden fixtures, exact scores, or evaluator internals |
| Keep promotion admissibility in the common reader | All downstream variants consume one non-overridable evidence contract before certificates or receipts bind it |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 12 tests, including role variants, unknown-role refusal, evaluator-full control, and pre-dependency veto |
| Common + extension Vitest | PASS: 4 files, 81 tests across common, agent-improvement, model-benchmark, and skill-benchmark |
| Runtime TypeScript | PASS: project-pinned `tsc --noEmit -p runtime/tsconfig.json`, whole runtime exit 0; common, agent, model, and skill sealed-artifact module errors 0 |
| Shared sealer | PASS: phase-007 `SealedArtifactStore.seal`, `readVerified`, and canonicalizer registry are invoked directly |
| Fail-closed reads | PASS: tampered, unsealed, truncated, missing-dependency, stale-epoch, stale-canary, wrong-kind embedded fields, mixed evaluator epoch, canonical/case/whitespace candidate roles, and unknown roles release no bytes; frozen-store seal-time cross-artifact borrowing is documented as a boundary and mitigated on read |
| Matching control | PASS: the evaluator role receives full evaluator material; correct candidate, baseline, evaluator, and canary kinds with a matching evaluator epoch remain promotion-eligible |
| Strict packet validation | PASS: exit 0 with 0 errors and 0 warnings after description and graph metadata refresh |
<!-- /ANCHOR:verification -->

### NFR Verification

| NFR | Result |
|-----|--------|
| No mutable artifact bodies or open material shapes | PASS: closed field and kind validators reject unknown keys and prose selectors |
| No second sealing scheme | PASS: adapter invokes the real phase-007 store and fixed canonicalizer registry |
| Additive-dark behavior | PASS: no authority, ledger, reducer, certificate, receipt, resume, parity, or gate code added; no consumer treats the unresolved cross-artifact closure as authoritative before cutover |

<!-- ANCHOR:limitations -->
## Known Limitations

1. The adapter does not materialize certificates or receipts; the successor owns those bindings.
2. The adapter does not write typed ledger events or alter reducers; it binds event stems and payload digests as immutable material metadata.
3. Downstream variant modules are consumers of the exported contract and remain outside this additive leaf.
4. The frozen phase-007 store can accept a seal-time reference whose digest pair belongs to another sealed artifact under a mismatched kind label. Leaf-003 rejects that declared reference on verified read before releasing bytes; full cross-artifact digest closure for plain named digests remains a forward obligation of `004-certificates-and-receipts`.
<!-- /ANCHOR:limitations -->

### Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| `dist/context/generate-description.js` | `dist/spec-folder/generate-description.js` | The requested path is absent in this checkout; the compiled script exposes the same two-argument interface. |

### Successor Contract

`004-certificates-and-receipts` should consume `DeepImprovementCommonSealedArtifactBinding`, `DeepImprovementVerifiedSealedArtifact`, `DeepImprovementCommonSealedArtifactContract`, `DeepImprovementCommonArtifactKinds`, `readDeepImprovementCommonArtifact`, and `readDeepImprovementPromotionEvidence` unchanged. Certificates and receipts should bind the returned reference/descriptor digests and promotion evidence, resolve every named cross-artifact digest to authenticated sealed content of the expected kind, and reject missing, reordered, mutated, stale, or unauthorized backing evidence before authority cutover. They must not re-seal, re-hash, inline mutable bodies, or widen the closed material shapes.
