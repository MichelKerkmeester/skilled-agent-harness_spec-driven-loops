---
title: "Checklist: Shadow-Parity Harness"
description: "Blocking verifier checklist for sealed-input legacy-versus-dark parity, divergence handling, and certificate freshness before authority cutover."
trigger_phrases:
  - "shadow parity harness checklist"
  - "pre-cutover parity verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking pre-cutover parity verification contract"
    next_safe_action: "Execute sealed-case parity fixtures before certificate issuance"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Shadow-Parity Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the shadow-parity harness. Every item remains pending until the
implementation exists and the paired verifier runs it against the exact candidate and immutable BASE. The verifier
records commands, exit codes, discovered/required case counts, build and contract identities, sealed-input manifest
digest, fingerprint attestations, projection digests, divergence counts, and tracked/live-state mutation checks. A
zero-case run, skipped required case, unverifiable input, open divergence, stale certificate, or unexpected mutation
fails the gate. No parity means no phase-014 cutover.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-003 baseline is pinned to one immutable BASE and exposes stable scenario IDs, protected observables, initial-state fixtures, state surfaces, readers, effects, and rollback anchors
- [ ] CHK-002 [P0] The case manifest closes every required mode/workstream and baseline row with zero unexplained or silently excluded coverage gaps
- [ ] CHK-003 [P0] Phase-006 replay verification, phase-007 verified sealed reads, and sibling-002 legacy projection contracts are available under registered versions
- [ ] CHK-004 [P0] Legacy and dark execution roots, effect sinks, and path guards cannot resolve to each other or to a live authoritative target
- [ ] CHK-005 [P1] Case, transcript, divergence, certificate, and freshness-response schemas are versioned and reject unknown required fields or versions
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] One comparator path serves every mode; no mode bypasses sealed-input preflight, phase-006 verification, divergence recording, or certificate freshness
- [ ] CHK-007 [P0] Fail-closed branches return typed failures and no trusted partial result after input, capture, replay, projection, byte, rerun, or certificate validation failure
- [ ] CHK-008 [P1] Harness code separates run-specific fingerprint identity from comparable observable component digests and retains both complete attestations
- [ ] CHK-009 [P1] Comparison exclusions exist only in a registered baseline/observable contract; runtime triage cannot add tolerances or ignore fields
- [ ] CHK-010 [P1] Evidence writers are idempotent for exact duplicates, reject conflicting duplicates, and never rewrite source ledgers, seals, legacy artifacts, or expected attestations
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Altered BASE, initial state, seal order, seal bytes, descriptor version, or ledger-addressed configuration blocks before either path executes
- [ ] CHK-012 [P0] Identical verified case capsules create independent legacy/dark roots and share only immutable input references
- [ ] CHK-013 [P0] Positive fixtures cover terminal values, errors/halts, ordered transitions, effects/receipts, budgets, emitted artifacts, and all declared reader-facing shapes
- [ ] CHK-014 [P0] Both path transcripts verify through the phase-006 API; unknown fingerprint, registry, upcaster, reducer, projection, or canonicalizer versions fail closed
- [ ] CHK-015 [P0] Effective-event and canonical-projection component digests match for every positive case while complete run-specific fingerprint attestations remain independently auditable
- [ ] CHK-016 [P0] Authoritative legacy and sibling-002 projected JSONL/JSON match bytes, order, whitespace, newlines, suppression, integrity, timing, watermarks, and unchanged-reader results
- [ ] CHK-017 [P0] One injected fixture for every divergence class produces the expected classification, earliest deterministic mismatch evidence, owner, and certificate refusal
- [ ] CHK-018 [P0] Removing each required observation in turn yields `missing-observation`; the available subset can never pass as complete parity
- [ ] CHK-019 [P0] Repeated sealed-case runs reproduce both transcripts, component digests, legacy bytes, projected bytes, and classifications across supported processes/platforms
- [ ] CHK-020 [P0] An induced rerun difference is classified `nondeterministic`, preserves both evidence sets, and blocks certificate issuance
- [ ] CHK-021 [P0] Partial, skipped, failed, open-divergence, duplicate-conflict, zero-discovery, and unverifiable case sets cannot emit a parity certificate
- [ ] CHK-022 [P0] A complete green mode set emits one idempotent certificate bound to the full manifest, BASE, build, seals, contracts, attestations, projections, and zero-divergence result
- [ ] CHK-023 [P0] Mutating each bound identity independently makes the certificate stale; phase 014 rejects missing, partial, superseded, wrong-mode, unverifiable, and stale certificates
- [ ] CHK-024 [P0] Positive and negative runs produce no live external effect, authoritative file change, authority flag change, or unexpected tracked mutation
- [ ] CHK-025 [P1] Divergence reproduction and repair cannot close a case until the complete affected closure reruns green under the current manifest and identities
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-026 [P0] Every divergence is either open and certificate-blocking or closed by current green rerun evidence; no waived, suppressed, unexplained, or auto-rebaselined result exists
- [ ] CHK-027 [P1] Every repaired divergence reruns all affected cases and any mode certificate is reissued under the new evidence identity
- [ ] CHK-028 [P1] Known-defect rows follow the versioned phase-003 disposition and are not silently normalized, fixed, or excluded by the harness
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-029 [P0] Verified sealed bytes are released only after digest and descriptor validation; mutable paths, aliases, host state, credentials, and unledgered environment values cannot enter a trusted case
- [ ] CHK-030 [P0] Shadow effect sinks prevent duplicate network, process, filesystem, or external-service effects while preserving comparable effect intent and receipt evidence
- [ ] CHK-031 [P1] Divergence diagnostics are bounded and redact secrets, host paths, and protected payload bytes without omitting identity digests needed for reproduction
- [ ] CHK-032 [P1] Certificate issuance and verification cannot write an authority control, disable a legacy writer, or redirect an authoritative reader
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-033 [P1] The implemented manifest, divergence taxonomy, observation boundary, certificate schema, and phase-014 freshness contract match `spec.md` and `plan.md`
- [ ] CHK-034 [P1] Verification evidence cites the phase-003 baseline, phase-006 fingerprints, phase-007 sealed artifacts, sibling-002 projections, and `manifest/phase-tree.json`
- [ ] CHK-035 [P2] Operator diagnostics explain the failing case, class, first divergence, owner, and rerun command without suggesting a waiver or rebaseline shortcut
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-036 [P0] Fixtures, shadow outputs, fingerprints, divergences, and certificates resolve to declared isolated roots and never collide with authoritative packet/runtime artifacts
- [ ] CHK-037 [P1] Generated caches and indexes are rebuildable; immutable seals, attestations, divergence records, certificates, and audit receipts remain authoritative
- [ ] CHK-038 [P1] Verification cleanup leaves no unexpected tracked mutation and retains evidence required by replay, rollback, audit, or certificate freshness policy
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the closed required case count is non-zero and complete, every case proves identical sealed
inputs, all registered replay components and legacy-shaped outputs match, deterministic reruns are stable, every
injected divergence fails closed, zero open divergences remain, and every mode certificate is current and rejected on
drift. The verifier must also prove that harness execution changed no authoritative state or cutover control.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier binds the exact BASE and candidate identities, records full case discovery and
zero-divergence closure, verifies the mode certificate and phase-014 drift matrix, and confirms no tracked, live-state,
external-effect, or authority mutation. Until then the phase remains Planned and every checklist item stays unchecked.
<!-- /ANCHOR:sign-off -->
