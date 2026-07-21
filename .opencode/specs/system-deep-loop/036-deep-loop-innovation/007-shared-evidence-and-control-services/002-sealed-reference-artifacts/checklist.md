---
title: "Checklist: Sealed Reference Artifacts"
description: "Blocking verification checklist for immutable sealing, digest-addressed reads, replay binding, shadow-input parity, and conservative artifact retention."
trigger_phrases:
  - "sealed reference artifacts checklist"
  - "deep-loop artifact verification checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
    last_updated_at: "2026-07-21T00:32:18Z"
    last_updated_by: "codex"
    recent_action: "Verified every sealed-artifact blocking check against the focused contract"
    next_safe_action: "Retain this evidence while later dark consumers adopt the contract"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/sealed-reference-artifacts.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
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

- [x] CHK-001 [P0] The phase-003 census identifies artifact kinds, mutable input sources, protected replay roots, rollback holds, and archival requirements [EVIDENCE: `state-backend-census.json`, `replay-rollback-manifest.json`, and `phase-tree.json` reviewed]
- [x] CHK-002 [P0] Seal descriptor, canonicalization registry, digest grammar, typed errors, reference-set order, and lifecycle contract are frozen before publication code lands [EVIDENCE: `sealed-artifact-types.ts`, `artifact-registries.ts`, and `artifact-events.ts`]
- [x] CHK-003 [P1] The integration boundary cites the phase-004 sealed-artifact primitive, phase-006 fingerprints, phase-008 parity, and the phase-tree manifest [EVIDENCE: `spec.md`, `plan.md`, and `artifact-reference-set.ts`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Changes stay inside the approved service and integration surfaces with no adjacent cleanup or authority transfer [EVIDENCE: scoped Git status command exit code 0 lists only new runtime files and this leaf's docs]
- [x] CHK-005 [P1] Canonicalization and descriptor serialization use explicit field order, length boundaries, registered versions, and platform-neutral inputs [EVIDENCE: `deep-loop-json@1` four-kind canonicalization matrix passes]
- [x] CHK-006 [P1] Error paths are typed, bounded, non-destructive, and never return fallback, nearest-match, repaired, or partially verified content [EVIDENCE: focused Vitest 45/45; 11 corruption/per-kind cases return typed failures with no bytes]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Equivalent prompt-set, fixture, prior-run-output, and config inputs produce byte-identical canonical bytes, descriptors, and digests across supported platforms [EVIDENCE: four-kind canonicalization matrix passes in focused Vitest]
- [x] CHK-008 [P0] Crash injection before blob write, descriptor write, persistence verification, and reference publication exposes no partial consumable seal [EVIDENCE: focused Vitest 45/45; four crash-boundary fixtures pass]
- [x] CHK-009 [P0] Published bytes and identity metadata cannot be overwritten; identical sealing is idempotent; forced collision or conflict quarantines and fails closed [EVIDENCE: focused Vitest 45/45; idempotency and forced-collision quarantine fixtures pass]
- [x] CHK-010 [P0] Path-only, alias-only, tag-only, `latest`, malformed, unsupported-algorithm, and unsupported-canonicalization references are rejected before execution [EVIDENCE: mutable-reference and unsupported-identity matrices pass]
- [x] CHK-011 [P0] Missing, changed, truncated, substituted, wrong-kind, wrong-size, descriptor-drifted, or corrupted objects release zero bytes and return a typed failure [EVIDENCE: focused Vitest 45/45; verified-read failure matrix passes]
- [x] CHK-012 [P0] The exact bytes returned by verified read are the bytes hashed, closing time-of-check/time-of-use substitution paths [EVIDENCE: focused Vitest 45/45; returned-byte copy and digest fixture passes]
- [x] CHK-013 [P0] Phase-006 fingerprints commit ordered artifact digests and descriptor versions; changed order, digest, version, or verification state changes or blocks the fingerprint [EVIDENCE: focused Vitest 45/45; replay fingerprint order-drift fixture passes]
- [x] CHK-014 [P0] Phase-008 parity refuses comparison unless legacy and dark paths cite the same verified artifact-reference set [EVIDENCE: input-equivalence mismatch fixture returns `INPUT_EQUIVALENCE_FAILURE`]
- [x] CHK-015 [P0] Same sealed inputs plus the same registered replay contract reproduce byte-identical effective events and projections; mismatch evidence never becomes a new baseline [EVIDENCE: focused Vitest 45/45; repeated replay fingerprint is stable and reverse order differs]
- [x] CHK-016 [P0] Reachability marks live runs, fingerprints, receipts/certificates, rollback windows, archival readers, and explicit holds; incomplete scans retain every candidate [EVIDENCE: focused Vitest 45/45; six protected-root fixtures plus incomplete scan pass]
- [x] CHK-017 [P0] Sweep deletes only complete-mark, horizon-expired, unheld objects and emits a durable deletion receipt plus a typed tombstone read result [EVIDENCE: focused Vitest 45/45; eligible sweep fixture binds tombstone to ledger receipt]
- [x] CHK-018 [P0] Restoration under an existing digest accepts only byte-identical canonical content; any changed byte or identity field requires a new digest [EVIDENCE: exact restoration passes and changed content returns `RESTORATION_MISMATCH`]
- [x] CHK-019 [P0] Seal or verification failure blocks dark replay/parity evidence without changing the legacy result, schema, state, or authority [EVIDENCE: focused Vitest 45/45; denied and unrecorded seal fixtures leave trusted domain evidence absent]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P1] Every artifact-kind and consumer row in the reviewed manifest has positive, negative, corruption, and unsupported-version fixtures [EVIDENCE: four per-kind matrix rows pass within focused Vitest 45/45]
- [x] CHK-021 [P1] Every lifecycle state and retention root has a named owner, transition event, verification case, and recovery path [EVIDENCE: focused Vitest 45/45; lifecycle action validators and all six retention-root fixtures pass]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P1] Digest verification does not substitute for authorization; access checks occur without changing content identity or leaking protected bytes in diagnostics [EVIDENCE: focused Vitest 45/45; gateway denial writes no domain ledger event and errors contain no bytes]
- [x] CHK-023 [P1] Canonicalization rejects traversal, symlink escape, unsafe archives, decompression abuse, ambiguous encodings, and unbounded artifact size before publication [EVIDENCE: focused Vitest 45/45; JSON-only registry, size, and symlink-boundary fixtures pass]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-024 [P2] Artifact descriptor, verified-read errors, lifecycle states, retention policy, replay binding, and operator recovery are documented for later mode consumers [EVIDENCE: `implementation-summary.md` modules, decisions, and recovery limitations]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-025 [P1] Blob, descriptor, lifecycle record, quarantine, tombstone, and rebuildable index ownership remain distinct and path-scoped [EVIDENCE: `ArtifactStorePaths` and `inspectPaths` enforce disjoint root-scoped ownership]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, canonicalization and verified-read matrices are non-empty,
the phase-006 fingerprint and phase-008 parity gates consume the same verified reference set, retention keeps every
protected root, sweep evidence is auditable, and legacy authority remains unchanged.
<!-- /ANCHOR:summary -->

### Bound Evidence

- Candidate baseline: `d1a3f0323c3635f24c3560feaeda839522ececf0`; scoped runtime/test tree digest:
  `6826b361ae3e9d60118e0be05709a6b576e39e7fb6f013c36c26877b6e136303`.
- Versions: descriptor/reference/tombstone `1`, canonicalization `deep-loop-json@1`, media type
  `application/json`, digest algorithm `sha256`.
- Focused fixtures: 45 passing tests; 4 artifact kinds; 4 crash boundaries; 7 named corruption variants plus 4
  per-kind negative/corruption/version rows; 6 protected-root types; 7 retained discovery cases; 1 eligible deletion;
  1 byte-identical restoration path.
- Runtime gates: full `tsc --noEmit -p tsconfig.json` exit 0; alignment verifier 0 errors and 0 warnings; comment
  hygiene 0 violations across all new TypeScript files.
- Scope gate: the consumed phase-006 substrate and existing runtime writers have no modifications. The new service
  has no legacy-path registration or authority switch.

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier binds the artifact-kind matrix, descriptor/canonicalization versions, digest
algorithm, replay/parity results, retention discovery counts, deletion receipts, candidate SHA, and clean post-gate
worktree state into one phase receipt.
<!-- /ANCHOR:sign-off -->
