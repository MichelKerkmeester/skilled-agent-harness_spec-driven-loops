---
title: "Tasks: Replay Fingerprints"
description: "Tasks for versioned replay-fingerprint derivation, immutable attestation storage, fail-closed mismatch detection, and downstream replay-verification integration."
trigger_phrases:
  - "replay fingerprints tasks"
  - "deep-loop replay digest tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
    last_updated_at: "2026-07-20T23:18:42Z"
    last_updated_by: "codex"
    recent_action: "Completed the replay-fingerprint implementation and verification tasks"
    next_safe_action: "Use the verified-result API from later dark consumers"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/replay-fingerprint.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Replay Fingerprints

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin the sibling envelope/ledger contracts, upstream transition/versioning policy, and phase-tree consumer obligations. [evidence: The implementation imports the existing envelope, ledger, gateway, and reducer boundaries without modifying them; the shared consumer seam is recorded in `implementation-summary.md`.]
- [x] T002 Inventory every replay-affecting input and map it to stored ledger bytes, a registered identity/version, or an immutable referenced digest. [evidence: `ReplayComponentRegistry` requires reducer, schema, initial-state, configuration, and artifact digests; missing-input tests pass.]
- [x] T003 Freeze `fingerprint_version`, descriptor fields, canonical serializer rules, hash registration, typed mismatch codes, and the after-range attestation event. [evidence: The eight-module ownership and complete descriptor component list are recorded in `implementation-summary.md`; 24/24 focused tests pass.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement the independent fingerprint-version registry and historical verifier resolution. [evidence: `fingerprint-version-registry.ts` retains historical definitions while selecting one current writer; historical/current/future/missing-version fixtures pass.]
- [x] T005 Implement a verified-range adapter that rejects open, gapped, forked, unchecked, unknown-version, or unauthorized input. [evidence: `derive-replay-fingerprint.ts` accepts the real ledger and calls its verified ascending reader; the combined ledger/fingerprint matrix passes 100/100.]
- [x] T006 Implement streaming stored-frame and ordered-sequence component folds over canonical ledger bytes. [evidence: The derivation streams sequence-delimited stored bytes, record hashes, and authorization links; mutation/deletion/insertion/reorder fixtures pass in Vitest 24/24.]
- [x] T007 Implement effective-event folds that bind envelope registry, observed type/version set, and ordered upcaster-chain identities. [evidence: Envelope-registry, upcaster-registry, and authorized false effective-digest fixtures surface their named components; Vitest 24/24 passed.]
- [x] T008 Implement replay-result folds that bind reducer/schema versions, ledger-addressed inputs, and canonical projection bytes. [evidence: Reducer, schema, replay-input, and projection-drift fixtures pass in Vitest 24/24.]
- [x] T009 Implement canonical descriptor serialization and the final digest over descriptor bytes with the final field omitted. [evidence: Repeated derivations are byte-identical, and the explicit self-omission fixture proves commitment bytes ignore only `final_digest`.]
- [x] T010 Implement authorized `deep-loop.replay.fingerprint-recorded` append after the covered range with self-exclusion and idempotency checks. [evidence: The `1..3` fixture appends at sequence `4`; exact retry keeps head `4`, while conflict fails with head unchanged.]
- [x] T011 Implement fail-closed verification, trusted-result typing, bounded component diagnostics, and earliest-divergence reporting. [evidence: The fault matrix in `implementation-summary.md` maps every tested fault to a typed component and no-trust result.]
- [x] T012 Expose one verifier seam for phase 008 shadow parity and phase 016 whole-system replay without moving authority. [evidence: Both consumer literals call `verifyReplayFingerprint()` and receive the same verified-result type in the focused suite.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify repeated and supported-platform derivations produce byte-identical descriptor bytes and final digests. [evidence: The supported OpenCode/Node fixture proves descriptor/core/final byte equality despite replay-map insertion-order changes; 24/24 focused tests pass.]
- [x] T014 Verify mutation, deletion, insertion, reordering, fork, torn-tail, and range-drift fixtures fail in the stored component. [evidence: On-disk frame fault fixtures plus the existing ledger integrity matrix pass in the 100/100 combined gate.]
- [x] T015 Verify registry, upcaster, reducer, projection-schema, canonicalizer, and committed-configuration drift fail in the responsible component. [evidence: Each named contract component has a focused negative fixture and the component matrix is recorded in `implementation-summary.md`.]
- [x] T016 Verify historical/current/unknown/missing fingerprint versions follow registered compatibility and fail-closed rules. [evidence: A registry with historical version `1` and current version `2` verifies history and writes `2`; future and missing versions fail independently.]
- [x] T017 Verify attestations are after-range, self-excluding, immutable, exact-repeat idempotent, and conflict-detecting. [evidence: Sequence/head and immutable-byte assertions pass for after-range, duplicate, conflict, and mismatch cases; Vitest 24/24 passed.]
- [x] T018 Verify missing replay inputs and every mismatch produce no trusted projection, parity certificate, cutover evidence, or whole-system pass. [evidence: Failure is a disjoint result variant containing only exit code and typed failure; both downstream consumer fixtures use it.]
- [x] T019 Verify mismatch diagnostics never mutate or rebaseline the ledger/attestation and dark failures leave legacy behavior unchanged. [evidence: Two repeated mismatches leave the ledger head and attestation file byte-identical; dependency matrix 100/100 passed and scoped git status proves no existing writer changed.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. [evidence: T001-T019 are checked above with source or executable receipts.]
- [x] All requirements in spec.md met with evidence. [evidence: `implementation-summary.md` maps descriptor, determinism, mismatch, attestation, consumer, and dark-authority requirements to passing tests.]
- [x] Phase gate green (validate/build/test as applicable). [evidence: Runtime Vitest 100/100 and TypeScript exit `0`; the strict-validation receipt is recorded in `implementation-summary.md`.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
