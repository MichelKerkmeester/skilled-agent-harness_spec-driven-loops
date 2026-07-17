---
title: "Checklist: Deep AI Council - Sealed Reference Artifacts"
description: "Checklist for the Deep AI Council sealed reference artifact phase: shared content-addressed sealing, immutable input and output manifests, tamper-evident reads, replay-safe reuse, information-surface isolation, and dark shadow verification."
trigger_phrases:
  - "Deep AI Council sealed artifacts checklist"
  - "deep-ai-council tamper-evident read gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
    last_updated_at: "2026-07-15T22:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined blocking seal-write and verified-read checks"
    next_safe_action: "Verify every council artifact row against shared seal contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep AI Council - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 006. The verifier pins the phase-006 primitive revision,
phase-012 shared-contract revisions, candidate input-manifest hash, artifact-inventory hash, and legacy comparison fixture.
It records seal and read commands, exit codes, object and digest counts, visibility decisions, replay outcomes, shadow-parity
differences, and tracked mutation. It must fail on any second sealing scheme, mutable-path fallback, digest or manifest mismatch,
missing required input, identity leakage, unsafe reuse, certificate issuance, authority change, zero or skipped fixtures, or
unscoped mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-006 sealing primitives and phase-012 shared identity, artifact-reference, replay, receipt, authorization, and write-set contracts are pinned as read-only inputs
- [ ] CHK-002 [P0] The phase boundary with `002-reducers-and-projections` and `004-certificates-and-receipts` is recorded; this phase neither indexes projections nor issues certificates
- [ ] CHK-003 [P1] The complete council artifact inventory and visibility matrix are present for run inputs, seats, critiques, blinded judgments, convergence, synthesis, minority records, council artifacts, and test-gate evidence
- [ ] CHK-004 [P1] Legacy `ai-council/**` artifacts, state rows, replay fixtures, and protected-vs-known-defect decisions are available for shadow comparison
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] No mode-local digest, seal record, manifest format, object store, verifier, or persistence authority duplicates the phase-006 sealing primitive
- [ ] CHK-006 [P0] Seal-on-write canonicalization, digest computation, atomic create, idempotence, manifest binding, and append-only supersession ordering are explicit and deterministic
- [ ] CHK-007 [P0] Every seal binds stable logical identity, council scope, source-event range, schema and policy versions, replay fingerprint, content digest, visibility, and lineage
- [ ] CHK-008 [P1] Immutable inputs and outputs are separated from derived reducer projections, certificate evidence, mutable caches, and current packet paths
- [ ] CHK-009 [P1] Private seat evidence, identity mappings, peer scores, vote counts, blinded candidate data, and judge inputs are scoped to declared information surfaces
- [ ] CHK-010 [P1] Missing or changed content is quarantined or superseded append-only; no prior sealed object or source event is repaired in place
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Identical canonical bytes produce one stable content-addressed object and digest across repeated seal-on-write attempts
- [ ] CHK-012 [P0] Changed bytes produce a new digest and manifest with explicit supersession lineage while the prior sealed object remains readable
- [ ] CHK-013 [P0] Input inventory fixtures seal target, strategy, prompt/tool/model capability, seat roster, budget, convergence policy, shared contracts, control arms, and test fixtures before dependent use
- [ ] CHK-014 [P0] Output inventory fixtures seal proposals, critiques, blinded candidates, pairwise judgments, bias probes, counterfactuals, convergence evidence, synthesis, minority records, council artifacts, and gate evidence
- [ ] CHK-015 [P0] Tamper-evident reads fail closed for digest mismatch, manifest mismatch, missing object, unsafe path, wrong scope, stale replay fingerprint, wrong visibility, malformed metadata, and quarantine
- [ ] CHK-016 [P0] No invalid read returns bytes from a mutable current path, empty success, guessed artifact, or unverified legacy fallback
- [ ] CHK-017 [P0] Private and blinded read fixtures prevent unauthorized consumers from receiving identity mappings, peer scores, vote counts, hidden rationales, or unblinded candidate provenance
- [ ] CHK-018 [P0] Replaying one sealed input manifest and output set twice returns identical bytes, reference identities, manifest digests, verification results, and replay decisions
- [ ] CHK-019 [P0] Resume fixtures distinguish compatible reuse, re-execution, compensation, quarantine, and rejection after prompt, model, tool, policy, fixture, or output drift
- [ ] CHK-020 [P0] Concurrent duplicate writes, partial writes, late outputs, superseding test-gate evidence, and historical as-of reads preserve immutable prior evidence
- [ ] CHK-021 [P0] Shadow parity compares legacy and typed identity, scope, content, required sections, availability, and digest references without changing legacy authority
- [ ] CHK-022 [P0] Certificate, mode-gate, authority-cutover, and legacy-retirement fixtures prove this phase cannot authorize any of those outcomes
- [ ] CHK-023 [P1] Zero-object, zero-read, skipped-fixture, malformed-manifest, and unexpected tracked-mutation conditions fail the verifier rather than passing vacuously
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-024 [P1] The shared-contract map names every inventory field and rejects local aliases for digest, seal, reference, replay, receipt, authorization, visibility, and supersession semantics
- [ ] CHK-025 [P1] The artifact inventory covers the complete lifecycle from immutable run inputs through the council test gate and names the owner of every seal decision
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-026 [P0] A digest or manifest mismatch cannot be hidden by path fallback, cache reuse, transcript reconstruction, or a nominally successful council result
- [ ] CHK-027 [P1] Access scope and blinded information surfaces are verified before bytes are returned to seats, critics, judges, reducers, resume adapters, or gates
- [ ] CHK-028 [P1] Seal verification is not treated as certification, test-gate sign-off, authority, or permission to bypass the shared transition gateway
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-029 [P2] The phase outcome, shared sealing boundary, artifact inventory, read failure taxonomy, replay rules, successor handoff, and unresolved contract questions are reflected consistently in the packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-030 [P1] Runtime implementation and fixture changes, when authorized later, remain path-scoped to Deep AI Council sealing and do not modify shared primitive or sibling certificate contracts
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

Signed off when the verifier confirms phase-006 and phase-012 contract reuse, immutable seal-on-write, tamper-evident reads,
replay-safe reuse, information-surface isolation, shadow parity, no certificate or authority change, and no unscoped tracked
mutation.
<!-- /ANCHOR:sign-off -->
