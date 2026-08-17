---
title: "Checklist: Deep AI Council - Sealed Reference Artifacts"
description: "Checklist for the Deep AI Council sealed reference artifact phase: shared content-addressed sealing, immutable input and output manifests, tamper-evident reads, replay-safe reuse, information-surface isolation, and dark shadow verification."
trigger_phrases:
  - "Deep AI Council sealed artifacts checklist"
  - "deep-ai-council tamper-evident read gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "codex"
    recent_action: "Verified complete ordered council reference-set binding"
    next_safe_action: "Preserve additive-dark posture in successor integration"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-sealed-artifacts/deep-ai-council-artifact-set.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-sealed-artifacts.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep AI Council - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 013's `003-deep-ai-council/003-sealed-artifacts` child. The verifier pins the phase-007 primitive revision,
phase-012 shared-contract revisions, candidate input-manifest hash, artifact-inventory hash, and legacy comparison fixture.
It records seal and read commands, exit codes, object and digest counts, visibility decisions, replay outcomes, shadow-parity
differences, and tracked mutation. It must fail on any second sealing scheme, mutable-path fallback, digest or manifest mismatch,
missing required input, identity leakage, unsafe reuse, certificate issuance, authority change, zero or skipped fixtures, or
unscoped mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase-007 sealing primitives and phase-012 shared identity, artifact-reference, replay, receipt, authorization, and write-set contracts are pinned as read-only inputs [EVIDENCE: completed shared substrate and sibling contracts reviewed; focused Vitest 13/13]
- [x] CHK-002 [P0] The phase boundary with `002-reducers-and-projections` and `004-certificates-and-receipts` is recorded; this phase neither indexes projections nor issues certificates [EVIDENCE: final scoped diff excludes reducer, certificate, and authority paths]
- [x] CHK-003 [P1] The complete council artifact inventory and visibility matrix are present for run inputs, seats, critiques, blinded judgments, convergence, synthesis, minority records, council artifacts, and test-gate evidence [EVIDENCE: focused Vitest 13/13; 25-kind registry and all-kind focused fixture]
- [x] CHK-004 [P1] Legacy `ai-council/**` artifacts, state rows, replay fixtures, and protected-vs-known-defect decisions are available for shadow comparison [EVIDENCE: exact parity comparator consumes complete typed and legacy-shaped reference sets]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] No mode-local digest, seal record, manifest format, object store, verifier, or persistence authority duplicates the phase-007 sealing primitive [EVIDENCE: runtime imports shared `ArtifactReferenceSet`, `SealedArtifactStore`, replay, and evidence APIs only]
- [x] CHK-006 [P0] Seal-on-write canonicalization, digest computation, atomic create, idempotence, manifest binding, and append-only supersession ordering are explicit and deterministic [EVIDENCE: focused Vitest 13/13; repeated-seal and partial-publication focused fixtures]
- [x] CHK-007 [P0] Every seal binds stable logical identity, council scope, source-event range, schema and policy versions, replay fingerprint, content digest, visibility, and lineage [EVIDENCE: focused Vitest 13/13; closed council material parser and all-kind focused fixture]
- [x] CHK-008 [P1] Immutable inputs and outputs are separated from derived reducer projections, certificate evidence, mutable caches, and current packet paths [EVIDENCE: focused Vitest 13/13; module exports sealed bindings and shared set evidence only]
- [x] CHK-009 [P1] Private seat evidence, identity mappings, peer scores, vote counts, blinded candidate data, and judge inputs are scoped to declared information surfaces [EVIDENCE: focused Vitest 13/13; closed visibility registration and allowed-visibility read fixture]
- [x] CHK-010 [P1] Missing or changed content is quarantined or superseded append-only; no prior sealed object or source event is repaired in place [EVIDENCE: focused Vitest 13/13; shared store publish-once contract and fail-closed missing/tamper fixtures]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-011 [P0] Identical canonical bytes produce one stable content-addressed object and digest across repeated seal-on-write attempts [EVIDENCE: focused Vitest 13/13; repeated equivalent seal fixture returns the same shared reference]
- [x] CHK-012 [P0] Changed bytes produce a new digest and manifest with explicit supersession lineage while the prior sealed object remains readable [EVIDENCE: focused Vitest 13/13; shared content-addressed store contract plus explicit supersession field]
- [x] CHK-013 [P0] Input inventory fixtures seal target, strategy, prompt/tool/model capability, seat roster, budget, convergence policy, shared contracts, control arms, and test fixtures before dependent use [EVIDENCE: focused Vitest 13/13; focused all-kind fixture seals every registered input]
- [x] CHK-014 [P0] Output inventory fixtures seal proposals, critiques, blinded candidates, pairwise judgments, bias probes, counterfactuals, convergence evidence, synthesis, minority records, council artifacts, and gate evidence [EVIDENCE: focused Vitest 13/13; focused all-kind fixture seals every registered output]
- [x] CHK-015 [P0] Tamper-evident reads fail closed for digest mismatch, manifest mismatch, missing object, unsafe path, wrong scope, stale replay fingerprint, wrong visibility, malformed metadata, and quarantine [EVIDENCE: focused suite 13/13 plus shared typed store failures]
- [x] CHK-016 [P0] No invalid read returns bytes from a mutable current path, empty success, guessed artifact, or unverified legacy fallback [EVIDENCE: every focused rejection asserts `SealedArtifactError` without a `bytes` property]
- [x] CHK-017 [P0] Private and blinded read fixtures prevent unauthorized consumers from receiving identity mappings, peer scores, vote counts, hidden rationales, or unblinded candidate provenance [EVIDENCE: focused Vitest 13/13; closed per-kind visibility and allowed-visibility read checks]
- [x] CHK-018 [P0] Replaying one sealed input manifest and output set twice returns identical bytes, reference identities, manifest digests, verification results, and replay decisions [EVIDENCE: two complete-set builds are byte-identical and share one `reference_set_digest`]
- [x] CHK-019 [P0] Resume fixtures distinguish compatible reuse, re-execution, compensation, quarantine, and rejection after prompt, model, tool, policy, fixture, or output drift [EVIDENCE: stale replay context returns byte-free `EVIDENCE_CONFLICT` before replay]
- [x] CHK-020 [P0] Concurrent duplicate writes, partial writes, late outputs, superseding test-gate evidence, and historical as-of reads preserve immutable prior evidence [EVIDENCE: focused Vitest 13/13; focused partial-publication fixture and shared publish-once store contract]
- [x] CHK-021 [P0] Shadow parity compares legacy and typed identity, scope, content, required sections, availability, and digest references without changing legacy authority [EVIDENCE: focused Vitest 13/13; exact set comparator gates parity before behavior comparison]
- [x] CHK-022 [P0] Certificate, mode-gate, authority-cutover, and legacy-retirement fixtures prove this phase cannot authorize any of those outcomes [EVIDENCE: focused Vitest 13/13; exported surface contains no certificate, cutover, writer, or authority mutation]
- [x] CHK-023 [P1] Zero-object, zero-read, skipped-fixture, malformed-manifest, and unexpected tracked-mutation conditions fail the verifier rather than passing vacuously [EVIDENCE: focused Vitest 13/13; missing, reordered, unknown-field, stale, and tamper cases are required green negatives]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P1] The shared-contract map names every inventory field and rejects local aliases for digest, seal, reference, replay, receipt, authorization, visibility, and supersession semantics [EVIDENCE: focused Vitest 13/13; exact mode and shared closed-field parsers]
- [x] CHK-025 [P1] The artifact inventory covers the complete lifecycle from immutable run inputs through the council test gate and names the owner of every seal decision [EVIDENCE: focused Vitest 13/13; all 25 kinds are mandatory in canonical lifecycle order]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-026 [P0] A digest or manifest mismatch cannot be hidden by path fallback, cache reuse, transcript reconstruction, or a nominally successful council result [EVIDENCE: focused Vitest 13/13; tampered reference and bytes fail through the shared store with no fallback]
- [x] CHK-027 [P1] Access scope and blinded information surfaces are verified before bytes are returned to seats, critics, judges, reducers, resume adapters, or gates [EVIDENCE: focused Vitest 13/13; scope, replay, authority, dependency, and visibility expectations precede verified result return]
- [x] CHK-028 [P1] Seal verification is not treated as certification, test-gate sign-off, authority, or permission to bypass the shared transition gateway [EVIDENCE: focused Vitest 13/13; real test harness records creation through the shared transition gateway; module has no authority API]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-029 [P2] The phase outcome, shared sealing boundary, artifact inventory, read failure taxonomy, replay rules, successor handoff, and resolved contract questions are reflected consistently in the packet docs [EVIDENCE: packet docs and runtime README reconciled]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-030 [P1] Runtime implementation and fixture changes remain path-scoped to Deep AI Council sealing and do not modify shared primitive or sibling certificate contracts [EVIDENCE: focused Vitest 13/13; final scoped diff and status audit]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, all council inputs and outputs have shared digest-bound seal
references, repeated writes and reads are deterministic, tampering and unsafe reuse fail closed, private and blinded surfaces
remain isolated, shadow parity is recorded without authority change, and the successor can consume the sealed manifest without
redefining the sealing scheme.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier confirms phase-007 and phase-012 contract reuse, immutable seal-on-write, tamper-evident reads,
replay-safe reuse, information-surface isolation, shadow parity, no certificate or authority change, and no unscoped tracked
mutation.
<!-- /ANCHOR:sign-off -->
