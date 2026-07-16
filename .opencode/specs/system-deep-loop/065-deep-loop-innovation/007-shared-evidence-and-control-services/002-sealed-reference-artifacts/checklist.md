---
title: "Checklist: Sealed Reference Artifacts"
description: "Blocking verification checklist for immutable sealing, digest-addressed reads, replay binding, shadow-input parity, and conservative artifact retention."
trigger_phrases:
  - "sealed reference artifacts checklist"
  - "deep-loop artifact verification checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the planned sealed-artifact verification contract"
    next_safe_action: "Run sealing and verified-read fixtures during implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 007 child 002. Execution evidence must pin the candidate
SHA, descriptor/canonicalization versions, digest algorithm, artifact-kind matrix, fixture corpus, commands and exit
codes, and retained/deleted discovery counts. Verification fails on zero fixtures, unverified byte release, mutable-only
input acceptance, silent rebaseline, incomplete reachability sweep, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-003 census identifies artifact kinds, mutable input sources, protected replay roots, rollback holds, and archival requirements
- [ ] CHK-002 [P0] Seal descriptor, canonicalization registry, digest grammar, typed errors, reference-set order, and lifecycle contract are frozen before publication code lands
- [ ] CHK-003 [P1] The integration boundary cites the phase-004 sealed-artifact primitive, phase-006 fingerprints, phase-008 parity, and the phase-tree manifest
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes stay inside the approved service and integration surfaces with no adjacent cleanup or authority transfer
- [ ] CHK-005 [P1] Canonicalization and descriptor serialization use explicit field order, length boundaries, registered versions, and platform-neutral inputs
- [ ] CHK-006 [P1] Error paths are typed, bounded, non-destructive, and never return fallback, nearest-match, repaired, or partially verified content
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Equivalent prompt-set, fixture, prior-run-output, and config inputs produce byte-identical canonical bytes, descriptors, and digests across supported platforms
- [ ] CHK-008 [P0] Crash injection before blob write, descriptor write, persistence verification, and reference publication exposes no partial consumable seal
- [ ] CHK-009 [P0] Published bytes and identity metadata cannot be overwritten; identical sealing is idempotent; forced collision or conflict quarantines and fails closed
- [ ] CHK-010 [P0] Path-only, alias-only, tag-only, `latest`, malformed, unsupported-algorithm, and unsupported-canonicalization references are rejected before execution
- [ ] CHK-011 [P0] Missing, changed, truncated, substituted, wrong-kind, wrong-size, descriptor-drifted, or corrupted objects release zero bytes and return a typed failure
- [ ] CHK-012 [P0] The exact bytes returned by verified read are the bytes hashed, closing time-of-check/time-of-use substitution paths
- [ ] CHK-013 [P0] Phase-006 fingerprints commit ordered artifact digests and descriptor versions; changed order, digest, version, or verification state changes or blocks the fingerprint
- [ ] CHK-014 [P0] Phase-008 parity refuses comparison unless legacy and dark paths cite the same verified artifact-reference set
- [ ] CHK-015 [P0] Same sealed inputs plus the same registered replay contract reproduce byte-identical effective events and projections; mismatch evidence never becomes a new baseline
- [ ] CHK-016 [P0] Reachability marks live runs, fingerprints, receipts/certificates, rollback windows, archival readers, and explicit holds; incomplete scans retain every candidate
- [ ] CHK-017 [P0] Sweep deletes only complete-mark, horizon-expired, unheld objects and emits a durable deletion receipt plus a typed tombstone read result
- [ ] CHK-018 [P0] Restoration under an existing digest accepts only byte-identical canonical content; any changed byte or identity field requires a new digest
- [ ] CHK-019 [P0] Seal or verification failure blocks dark replay/parity evidence without changing the legacy result, schema, state, or authority
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-020 [P1] Every artifact-kind and consumer row in the reviewed manifest has positive, negative, corruption, and unsupported-version fixtures
- [ ] CHK-021 [P1] Every lifecycle state and retention root has a named owner, transition event, verification case, and recovery path
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P1] Digest verification does not substitute for authorization; access checks occur without changing content identity or leaking protected bytes in diagnostics
- [ ] CHK-023 [P1] Canonicalization rejects traversal, symlink escape, unsafe archives, decompression abuse, ambiguous encodings, and unbounded artifact size before publication
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P2] Artifact descriptor, verified-read errors, lifecycle states, retention policy, replay binding, and operator recovery are documented for later mode consumers
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-025 [P1] Blob, descriptor, lifecycle record, quarantine, tombstone, and rebuildable index ownership remain distinct and path-scoped
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, canonicalization and verified-read matrices are non-empty,
the phase-006 fingerprint and phase-008 parity gates consume the same verified reference set, retention keeps every
protected root, sweep evidence is auditable, and legacy authority remains unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier binds the artifact-kind matrix, descriptor/canonicalization versions, digest
algorithm, replay/parity results, retention discovery counts, deletion receipts, candidate SHA, and clean post-gate
worktree state into one phase receipt.
<!-- /ANCHOR:sign-off -->
