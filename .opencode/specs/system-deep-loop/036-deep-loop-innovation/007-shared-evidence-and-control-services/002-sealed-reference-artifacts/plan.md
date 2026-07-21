---
title: "Implementation Plan: Sealed Reference Artifacts"
description: "Implementation plan for sealing immutable reference inputs, consuming them by verified digest, and retaining them for deterministic replay and shadow parity."
trigger_phrases:
  - "sealed reference artifacts implementation plan"
  - "deep-loop artifact sealing plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
    last_updated_at: "2026-07-21T01:33:45Z"
    last_updated_by: "codex"
    recent_action: "Hardened fixed hashing, immutable reads, and replay resolution"
    next_safe_action: "Keep the service dark and track ordered-digest durability in replay-fingerprint"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/sealed-reference-artifacts.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop shared evidence/control services |
| **Change class** | Additive-dark immutable artifact service and integration contracts |
| **Execution** | Content-addressed publication, verified consumption, replay binding, conservative retention |

### Overview
Implement one shared service for prompts, fixtures, prior-run outputs, configuration, and later mode artifacts. The
service canonicalizes and seals exact bytes, publishes an algorithm-qualified digest only after atomic persistence and
verification, resolves runtime inputs only by that digest, verifies again before releasing bytes, and records lifecycle
changes separately from immutable identity. The phase-006 replay descriptor consumes the ordered verified digest set;
phase 008 may compare legacy and dark outputs only when both cite the same set. The plan is grounded in
`../../006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md`,
`../../004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md`,
`../../spec.md`, and `../../manifest/phase-tree.json`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Artifact kinds and canonicalization profiles are inventoried from the phase-003 census and later mode contracts
- [x] The seal descriptor has explicit identity, algorithm, canonicalization, media, size, and provenance fields
- [x] Atomic publish-once storage and fail-closed mutation detection are selected for the supported runtime
- [x] Run/event schemas reject path-only, alias-only, tag-only, or `latest` references
- [x] Verified-read failures are typed and release no unverified bytes
- [x] Replay fingerprints define an ordered artifact-reference input and phase 008 defines input-equivalence gating
- [x] Retention roots, horizons, holds, quarantine, tombstones, and deletion receipts have explicit ownership

### Definition of Done
- [x] Sealing, digest references, verified reads, replay/parity integration, and lifecycle retention pass their P0 fixtures
- [x] The service remains additive-dark; legacy execution stays authoritative and unchanged
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Canonicalizer registry**: maps `artifact_kind` plus canonicalization version to deterministic bytes; unknown kinds or versions fail closed, and platform-dependent inputs are excluded.
- **Seal descriptor**: canonical metadata containing descriptor version, artifact kind, media type, byte length, fixed SHA-256 content digest, canonicalization version, and bounded provenance commitments.
- **Atomic sealer**: stages bytes, canonicalizes once, computes SHA-256 internally, writes publish-once blob plus descriptor, verifies persisted bytes, and only then publishes the qualified digest reference.
- **Content-addressed store**: returns frozen byte snapshots by exact digest; identical writes are idempotent, while conflicting or externally changed bytes quarantine the key before use.
- **Verified reader**: resolves exact digest, validates descriptor compatibility, streams and recomputes length/SHA-256, and releases a frozen byte copy only after all checks pass.
- **Reference-set binder**: resolves every ordered reference through the store and authorized ledger before emitting digest-only replay input for phase-006 fingerprints and phase-008 parity preconditions.
- **Lifecycle ledger**: records seal creation, protected references, retention class, holds, quarantine, eligibility, deletion receipts, tombstones, and exact-content restoration without changing the blob or descriptor.
- **Retention collector**: conservative mark-and-sweep over run, fingerprint, receipt, rollback, archival, and hold roots; incomplete scans retain objects, and sweep cannot proceed without a complete mark plus elapsed horizon.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Inventory artifact kinds, mutable input paths, existing run/config references, replay roots, rollback holds, and archival requirements against the pinned phase-003 baseline.
- Freeze seal descriptor, canonicalization registry, typed error taxonomy, reference-set ordering, and lifecycle-state contracts before adding a publisher.

### Phase 2: Implementation
- Implement deterministic canonicalizers and fixed internal SHA-256 derivation for the initial prompt-set, fixture, prior-run-output, and configuration kinds.
- Implement staged atomic publication, publish-once blob/descriptor storage, idempotent duplicate handling, mutation/conflict quarantine, and verified read-before-release.
- Replace dark-path input capture with digest references while preserving legacy authority and rejecting mutable-only references from replay/parity evidence.
- Resolve and re-verify artifact-reference sets before binding their ordered digests into phase-006 fingerprints and the phase-008 shadow-parity input-equivalence gate.
- Implement append-only lifecycle records, protected-root discovery, audit and rollback holds, conservative mark-and-sweep, deletion receipts, tombstones, and byte-identical restoration.

### Phase 3: Verification
- Prove deterministic canonical bytes and digests across supported platforms and equivalent source representations.
- Prove mutation, truncation, substitution, missing data, unsupported versions, descriptor drift, and digest conflicts fail before any bytes reach a consumer.
- Prove a run cannot create trusted replay or parity evidence from a mutable-only, unsealed, missing, or unverifiable input.
- Prove identical verified artifact sets plus the same registered replay contract reproduce byte-identical effective events and projections; changed inputs produce a bounded mismatch.
- Prove retention keeps every protected root, uncertainty deletes nothing, eligible unreachable data emits a deletion receipt, and restoration accepts only byte-identical content.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Golden and cross-platform canonicalization fixtures produce byte-identical content, descriptor, and digest |
| REQ-002 | Crash injection at every seal stage exposes no partial reference; service overwrites are absent and out-of-band mutation is detected before use |
| REQ-003 | Schema and runtime negative tests reject path-only, alias-only, tag-only, `latest`, malformed, and unsupported digest references |
| REQ-004 | Missing, truncated, corrupted, substituted, wrong-kind, wrong-size, and unsupported-version reads return typed failures and zero released bytes |
| REQ-005 | Duplicate identical seals are idempotent; caller digest injection is rejected and conflicting bytes under an existing identity quarantine the object |
| REQ-006 | Replay adapters resolve store bytes and ledger evidence before input; order changes alter fingerprints while missing, substituted, or forged sets fail closed |
| REQ-007 | Shadow-parity fixtures require identical verified reference sets before comparing output and report input-equivalence failures separately |
| REQ-008 | Lifecycle transition tests append records while immutable blob and descriptor hashes remain unchanged |
| REQ-009 | Reachability fixtures cover live runs, attestations, receipts, rollback windows, archival readers, explicit holds, and incomplete scans |
| REQ-010 | Sweep tests delete only complete-mark, horizon-expired, unheld objects and emit durable deletion receipts and tombstone read failures |
| REQ-011 | Restoration accepts exact canonical bytes under the original digest and rejects any changed byte or descriptor identity |
| REQ-012 | Additive-dark integration tests show verification failures block new evidence without changing legacy results or authority |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase has no hard execution dependency (`depends_on: []`) and is an independent sibling planning contract. Its
implementation composes with the phase-006 event envelope, typed ledger, and replay-fingerprint APIs; the phase-004
ADR fixes immutable digest addressing as a spine invariant. Phase 008 consumes verified reference sets for shadow
parity, phase 013 specializes artifact kinds, and phases 014-016 preserve retained inputs through rollback, archival
replay, and whole-system verification. The phase-003 census supplies concrete storage and legacy-reference evidence.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Land the service additively behind the dark ledger path. Before phase 014, rollback disables new sealing and verified
reference capture while leaving legacy reads authoritative; already sealed objects, descriptors, and lifecycle records
remain immutable for audit and replay. Revert integration commits rather than deleting sealed data. A collector rollout
starts in mark/report-only mode, then quarantine, and only later sweep after retention fixtures pass; disabling sweep
and restoring an exact byte-identical object from protected storage reverses an erroneous deletion without changing its
digest. Any evidence issued against a failed or disabled seal gate remains invalid and is never promoted automatically.
<!-- /ANCHOR:rollback -->
