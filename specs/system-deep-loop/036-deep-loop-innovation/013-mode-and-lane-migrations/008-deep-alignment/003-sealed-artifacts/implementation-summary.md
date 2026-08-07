---
title: "Implementation Summary: Deep Alignment Sealed Artifacts"
description: "Delivered additive-dark Deep Alignment artifact bindings over the shared phase-007 sealer, with closed material validation, exact provenance ownership, authority-liveness reads, and an accepted successor-owned boundary for every plain cross-artifact digest closure."
trigger_phrases:
  - "deep alignment sealed artifacts implementation"
  - "deep-alignment artifact bindings"
  - "deep alignment verified sealed reads"
  - "deep alignment authority liveness reads"
  - "deep alignment all plain cross-artifact digest closure"
  - "applicability decision digest boundary"
  - "subject snapshot digest boundary"
  - "convergence snapshot digest boundary"
  - "alignment report digest boundary"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
    last_updated_at: "2026-07-24T04:17:18Z"
    last_updated_by: "codex"
    recent_action: "Rejected rolled-back authority capsules across direct and provenance-bound reads"
    next_safe_action: "Leaf 004 must resolve every deferred plain cross-artifact digest before authority cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-sealed-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-sealed-artifacts.vitest.ts"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Deep Alignment material is sealed as closed digest/reference capsules through the real shared store"
      - "Missing dependencies and unexpected authority epochs fail before verified bytes reach a consumer"
      - "Finding authority and governed-exception finding, authority, and issuer claims require exact verified owners"
      - "Authority reads require valid status, no rollback reference, and a future expiry boundary"
      - "Every plain scalar or array digest that names another sealed artifact is shape-checked here and requires certificate-time closure in leaf 004"
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
| **Spec Folder** | 003-sealed-artifacts |
| **Completed** | Additive-dark adapter slice delivered on 2026-07-23; the plain cross-digest closure boundary and authority-liveness read invariant were accepted on 2026-07-24; sibling-owned integration remains unclaimed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep Alignment now exposes a four-file sealed-artifact binding surface over the real shared phase-007 sealer. Fourteen
alignment-specific kinds cover authority capsules, lane configuration and scope, compiled rule manifests, applicability
decisions, discovery manifests, target snapshots, detector and verifier inputs, witness matrices, finding evidence,
governed exceptions, convergence snapshots, alignment reports, and resume/save handoffs.

The material contract is closed by kind. It accepts digests, bounded identifiers, closed enums, bounded numeric ratios,
structured locators, and digest-addressed dependency references. Mutable bodies, open objects, prose-like selectors,
wrong-kind values, and unregistered kinds are rejected before canonical bytes are submitted to the store. Named
cross-artifact claims also require an exact dependency owner: finding authority binds an authority capsule; governed
exceptions bind their finding and authority content digests plus the issuer publisher identity on that exact authority
dependency. Every other plain scalar or array digest that names another sealed artifact remains shape-checked and sealed
as a value without dependency backing in this leaf. Examples include `applicabilityDecisionDigest` and
`subjectSnapshotDigest`, plus `CONVERGENCE_SNAPSHOT`'s `orderedInputDigests`, `findingsViewDigest`,
`exceptionViewDigest`, and `unresolvedFindingDigests`, and `ALIGNMENT_REPORT`'s ordered-input, convergence, findings-view,
exception-view, unresolved-finding, and report digest set. The examples are not exhaustive; leaf 004 owns the
certificate-time closure of every such field, including existence, expected-kind matching, and freshness. The binding
imports the landed Deep Alignment ledger types for event and locator identity, but carries only the shared sealed
reference and the generated `artifact:sha256:<digest>` event reference.

### Shared-Sealer Read Boundary

`sealDeepAlignmentArtifact` invokes `SealedArtifactStore.seal` after verifying every declared dependency through the
same store. `readDeepAlignmentArtifact` invokes `SealedArtifactStore.readVerified`, decodes and re-validates the closed
material, checks expected authority epoch and expiry context, then verifies dependencies recursively before returning
bytes. Parser-time ownership checks reject missing and wrong-digest dependency entries before publication. Recursive
verification then resolves the exact declared owner and compares governed-exception `issuerId` with the verified
authority capsule's `publisherId`. Plain cross-artifact digests are sealed as values but are not resolved here.
No second digest, descriptor, store, or verification implementation was introduced.

Authority capsules must also be live at every read boundary. Their closed material shape permits only `status: valid`,
requires `rollbackRef` to be null for live use, and requires `expiresAt` to remain in the future. A non-null rollback
reference now yields the typed `INVALID_INPUT` read refusal with reason `rolled_back_authority`. The same recursive
context check runs for a direct authority read and for authority dependencies selected by finding or governed-exception
provenance, so no parent releases bytes from a rolled-back authority chain. Superseded, revoked, and retired fields are
not legal members of the closed authority shape; mixed reference or descriptor versions are rejected by the shared
store, and mixed authority epochs are rejected by the adapter's existing epoch checks. This typed-reference liveness
rule does not expand the successor-owned plain-digest closure boundary.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-sealed-artifacts/deep-alignment-sealed-artifact-types.ts` | Created | Declares the alignment kind matrix, closed material types, dependency references, and verified binding types |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-sealed-artifacts/deep-alignment-artifact-material.ts` | Created, hardened | Validates and canonicalizes each alignment kind and declares named dependency ownership rules |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-sealed-artifacts/deep-alignment-sealed-artifacts.ts` | Created, hardened | Creates the shared store adapter and recursively verifies dependency content, publisher identities, and authority liveness |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-sealed-artifacts/index.ts` | Created | Publishes the alignment binding API for later consumers |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-sealed-artifacts.vitest.ts` | Created, expanded | Proves deterministic seals, real-substrate use, live-authority controls, and fail-closed rolled-back, named-claim, mutable, unsealed, tampered, truncated, stale-epoch, and wrong-kind paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module is unreferenced by legacy execution, so it remains dark and non-authoritative. Tests drive the real
filesystem-backed `SealedArtifactStore`, including its publication fault boundary and immutable blob verification;
there are no test doubles for hashing, publication, or verified reads. The suite asserts
`substrateImportsReal === true` through a real `SealedArtifactStore` instance.

Deep Alignment does not import a Deep Review sealed-artifacts module and does not fork the shared phase-012 review-loop
contract. Reducers, projections, replay/parity consumers, resume decision algebra, certificates, receipts, remediation,
and mode-gate behavior remain with their owning leaves.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bind alignment material to the shared content-addressed reference | The phase-007 store remains the only integrity authority and later consumers receive stable digest identities |
| Include artifact kind in canonical capsule bytes | Equivalent fields under different lifecycle kinds must not share one content address |
| Verify declared dependencies before seal and before read release | A parent artifact is not usable when any referenced capsule is missing, corrupt, or from another authority epoch |
| Require ownership for direct provenance claims | A same-kind dependency cannot validate a fabricated authority or finding scalar; the exact content digest or publisher identity must match |
| Require authority capsules to be live at read time | A cryptographically intact capsule cannot authorize output after rollback or expiry, whether read directly or through finding and exception provenance |
| Defer every plain cross-artifact digest closure to leaf 004 | Keeps this adapter's dependency contract narrow while requiring certificates and receipts to authenticate the complete cross-artifact evidence set, including expected kind and freshness |
| Keep event references digest-qualified and body-free | Ledger and later receipts need immutable identity without embedding mutable source or report content |
| Leave certificates, receipts, reducers, projections, replay, parity, resume policy, and gates to sibling leaves | Those contracts are outside this adapter-only binding surface |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Regression falsifier | PASS: the two required rolled-back rejection tests failed against the prior adapter while the live-authority finding control passed |
| Targeted Vitest | PASS: 1 file and 17 tests, including direct authority, finding provenance, governed-exception provenance, and live-authority control coverage |
| Whole-runtime TypeScript compile | PASS: exit 0; zero diagnostics, including zero errors under `runtime/lib/deep-alignment-sealed-artifacts/` |
| Strict packet validation | PASS: exit 0, zero errors and zero warnings |
| Real sealer path | PASS: `substrateImportsReal === true`; seal, derive/unsealed, recursive dependency reads, fault-injected publication, tampered reference, tampered bytes, and expected-kind reads all use `SealedArtifactStore` |
| Plain cross-digest boundary review | PASS: every plain scalar/array digest that names another sealed artifact is shape-checked and sealed here without dependency backing; reviewed examples include `CONVERGENCE_SNAPSHOT`'s `orderedInputDigests`, `findingsViewDigest`, `exceptionViewDigest`, `unresolvedFindingDigests`, and `ALIGNMENT_REPORT`'s ordered-input/report digest set; leaf 004 owns existence, kind-match, and freshness closure before authority cutover |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Sibling integration is intentionally absent.** The ledger, reducer, projection, replay, parity, resume, and mode-gate
   consumers must bind their own typed records to these immutable references.
2. **Plain cross-artifact digest closure is intentionally absent here.** This leaf shape-validates and seals every plain
   scalar/array digest that names another sealed artifact without resolving it to backing content. That includes the
   applicability/target examples, the `CONVERGENCE_SNAPSHOT` ordered-input/findings-view/exception-view/unresolved-finding
   examples, and the `ALIGNMENT_REPORT` ordered-input/report digest set; the list is not exhaustive. Leaf 004 must bind all
   such fields to existing, expected-kind, fresh sealed content in its certificate and receipts and reject incomplete
   closure before authority cutover.
3. **Certificate and receipt semantics are intentionally absent.** Leaf 004 should certify the binding's artifact kind,
   reference, descriptor digest, content digest, authority epoch context, and successful shared verified-read result.
4. **The broader planning checklist remains unclaimed.** Its cross-leaf integration, report projection, replay/parity,
   rollback, and mode-gate rows are not implemented by this four-file adapter.
<!-- /ANCHOR:limitations -->
