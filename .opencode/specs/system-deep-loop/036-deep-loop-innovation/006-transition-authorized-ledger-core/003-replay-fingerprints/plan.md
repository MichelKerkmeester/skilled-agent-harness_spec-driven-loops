---
title: "Implementation Plan: Replay Fingerprints"
description: "Implementation plan for independently versioned replay fingerprint derivation, immutable ledger attestation, and fail-closed verification over typed-ledger ranges."
trigger_phrases:
  - "replay fingerprints implementation plan"
  - "deep-loop replay digest implementation"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned fingerprint derivation, attestation storage, and mismatch verification"
    next_safe_action: "Implement the registry and verifier against the typed ledger contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Replay Fingerprints

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop typed-ledger replay boundary |
| **Change class** | Deterministic derivation, typed attestation, and verification logic |
| **Execution** | Additive-dark; legacy execution remains authoritative |

### Overview
Implement one versioned replay-fingerprint registry and canonical descriptor pipeline over the verified stream from `../002-typed-append-only-ledger/spec.md`. The pipeline commits immutable record bytes, effective upcast events, registered replay dependencies, and canonical projection bytes; appends a typed attestation after the covered range; and exposes one fail-closed verifier for the phase-008 shadow-parity harness and phase-016 whole-system gate named in `../../manifest/phase-tree.json`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The sibling envelope contract exposes canonical stored/effective bytes and registry/upcaster identities
- [ ] The sibling ledger contract exposes a verified ordered range with stable ledger ID, sequence, record hashes, and head hash
- [ ] The upstream transition/versioning policy remains normative for historical-version refusal and registered evolution
- [ ] The fingerprint descriptor, version registry, serializer, attestation range rule, and typed mismatch vocabulary are frozen
- [ ] Every replay-affecting reducer, schema, configuration, policy, and artifact input has a registered or ledger-addressed identity

### Definition of Done
- [ ] Identical verified inputs reproduce byte-identical component and final digests across supported platforms
- [ ] The typed attestation is immutable, idempotent, after-range, and excluded from its own fingerprint
- [ ] Every corruption, version, contract, effective-event, and projection mismatch fails closed with bounded diagnostics
- [ ] Phase 008 and phase 016 fixtures consume the same verifier and cannot rebaseline during comparison
- [ ] Dark-path failure changes no legacy output, state, schema, or authority
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Fingerprint registry**: maps each positive `fingerprint_version` to its canonical serializer, hash algorithm, required descriptor fields, component fold rules, and historical verifier. It is independent of `envelope_version` and per-type `event_version`.
- **Verified-range adapter**: accepts only the typed ledger reader's integrity-checked ascending stream and rejects an open range, gap, fork, unchecked record, unknown envelope/type version, or invalid authorization linkage before hashing.
- **Component folds**: stream length-delimited canonical data into separate stored-frame, effective-event, and replay-result digests. The fold binds ledger/range identity, record hashes, registry/upcaster identities, reducer/projection versions, and ledger-addressed configuration/artifact digests.
- **Canonical descriptor builder**: serializes the complete component manifest with explicit field order, normalized unordered maps, preserved ordered arrays, and the final-digest field omitted; the final digest commits those descriptor bytes.
- **Attestation writer**: appends `deep-loop.replay.fingerprint-recorded` after the inclusive covered range through the authorized typed-ledger boundary. The attestation names the range and cannot be included in the fingerprint it records.
- **Verifier**: resolves the recorded historical fingerprint version, validates the ledger range and replay dependencies, recomputes component/final digests, compares them, and returns either a trusted replay result or a typed non-zero mismatch with no partial success.
- **Diagnostic boundary**: reports bounded expected/actual digests and the earliest determinable divergent sequence or replay stage without modifying a corrupted ledger or promoting a new baseline.
- **Consumer seam**: exposes one verified-result API to phase 008 shadow parity and phase 016 whole-system replay; caches and indexes remain rebuildable and non-authoritative.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the envelope, ledger, and transition/versioning contracts are pinned and mutually consistent.
- Inventory replay-affecting inputs and classify each as stored bytes, registered code/schema identity, or immutable referenced digest.
- Freeze descriptor fields, `fingerprint_version` registry behavior, canonical serializer, error codes, and attestation event contract.

### Phase 2: Implementation
- Implement the fingerprint-version registry and historical-version resolver without coupling it to envelope versions.
- Implement the verified-range adapter and streaming stored/effective/projection component folds.
- Implement canonical descriptor serialization and final digest derivation with deterministic fixtures.
- Implement the authorized after-range attestation append and exact-repeat idempotency/conflict behavior.
- Implement fail-closed verification, component comparison, earliest-divergence diagnostics, and the trusted-result type.
- Wire one read-only verification seam for phase 008 and phase 016 consumers while preserving dark non-authority.

### Phase 3: Verification
- Prove same-input byte parity across repeated processes and supported platforms.
- Mutate, delete, insert, reorder, fork, and tear covered ledger fixtures; require stored-component failure.
- Drift the envelope registry, upcaster chain, reducer, projection schema, canonicalizer, and ledger-addressed configuration independently; require the responsible component failure.
- Exercise historical/current/unknown fingerprint versions, missing implementations, conflicting attestations, self-inclusion attempts, and missing replay inputs.
- Verify mismatches yield no projection, shadow-parity certificate, cutover evidence, or whole-system success and never rewrite the expected attestation.
- Verify fingerprint-path failures leave legacy results and authority unchanged.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Golden closed-range fixtures prove every sequence and record mutation changes the stored component |
| REQ-002 | Registry/upcaster/reducer/projection/config drift fixtures prove every replay dependency is committed |
| REQ-003 | Golden descriptor fixtures expose and independently compare stored, effective, and projected byte digests |
| REQ-004 | Historical/current/future/missing fingerprint-version matrices prove explicit independent evolution |
| REQ-005 | Cross-process and supported-platform fixtures compare exact canonical descriptor bytes and final digest |
| REQ-006 | Attestation fixtures prove after-range storage, self-exclusion, exact-repeat idempotency, and conflict refusal |
| REQ-007 | Fault matrices assert a typed non-zero result and absence of all trusted downstream evidence |
| REQ-008 | Diagnostics identify the earliest determinable sequence/stage without ledger or attestation mutation |
| REQ-009 | Uncommitted configuration/artifact inputs block derivation; ledger-addressed digests restore determinism |
| REQ-010 | Phase-008 and phase-016 contract fixtures call the same verifier and reject alternate digest paths |
| REQ-011 | Dark coexistence tests compare legacy outputs/state before and after every fingerprint-path failure |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase declares no hard dependency (`depends_on: []`), while implementation composes at the phase-006 parent gate with `../001-versioned-event-envelope/spec.md`, `../002-typed-append-only-ledger/spec.md`, and the successor authorization gateway. The upstream transition/versioning policy fixes registered historical compatibility. Downstream, the phase-tree makes phase 008 the first shadow-parity consumer and phase 016 the whole-system replay consumer; both depend on this verifier's exact contract rather than a sibling-specific digest.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation is additive and dark. Roll back by disabling fingerprint attestation generation and verifier consumption, then reverting the phase's path-scoped commits; legacy runtime state and authority remain unchanged. Existing fingerprint attestations and covered ledger bytes are never deleted or rewritten. A reverted runtime must continue to refuse unsupported fingerprint versions rather than reinterpret them, and later restoration must re-enable the same registered historical implementations before those attestations can verify again.
<!-- /ANCHOR:rollback -->
