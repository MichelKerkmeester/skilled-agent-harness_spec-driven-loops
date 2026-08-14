---
title: "Checklist: Substrate Identity Fail-Closed"
description: "Blocking verification checklist for shared-gateway identity denial, prepared-decision matching, rollback-certificate trust, and four typed rollback switches."
trigger_phrases:
  - "substrate identity checklist"
  - "rollback identity verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed"
    last_updated_at: "2026-08-14T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the planned substrate identity verification contract"
    next_safe_action: "Complete predecessor evidence and implement fail-closed identity controls"
    blockers:
      - "Predecessor 001-measurement-and-traceability must complete"
    key_files: []
    completion_pct: 0
    open_questions:
      - "Required resolver dependency or fail-closed default resolver?"
    answered_questions: []
---
# Checklist: Substrate Identity Fail-Closed

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for fail-closed identity at the shared transition-authorization and
rollback trust boundaries. Every item remains pending until focused tests prove deterministic denial for unusable or
unverified identity, positive allowance only for three independently matched identities, refusal by all four typed
rollback switches, certificate-trust rejection, documentation alignment, and no live authority mutation. A resolver
absence, malformed verification state, or digest-valid but identity-unverified certificate can never pass.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `001-measurement-and-traceability` completes the gateway-construction and certificate-consumer inventory before identity behavior changes (REQ-001, REQ-006)
- [ ] CHK-002 [P0] The implementation choice is recorded as either a required resolver dependency or a shared deny-only default, with no path that preserves missing-resolver allowance (REQ-001, SC-001)
- [ ] CHK-003 [P0] The current `matchesPreparedAuthorizationDecision` consumers and authoritative rollback-certificate trust boundary are confirmed before editing (REQ-004, REQ-006)
- [ ] CHK-004 [P1] Existing focused gateway, mode-contract, four rollback-gate, and certificate-trust test baselines are recorded without enabling a live authority path (SC-007)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The shared `TransitionAuthorizationGateway` returns a typed denial before policy evaluation when no usable identity resolver exists (REQ-001)
- [ ] CHK-006 [P0] Resolver exceptions, null results, partial results, and any actor, capability, or evidence mismatch share deterministic fail-closed behavior with no durable domain mutation (REQ-002)
- [ ] CHK-007 [P0] An `allow` decision requires `actor_id_verified`, `capability_id_verified`, and `evidence_digest_verified` all to be true after independent value matching (REQ-003, SC-002)
- [ ] CHK-008 [P0] `matchesPreparedAuthorizationDecision` requires verification truth in addition to its existing request-field and deterministic-digest bindings (REQ-004, SC-003)
- [ ] CHK-009 [P0] Rollback-certificate trust rejects missing, false, malformed, or tampered verification evidence while retaining existing digest and request checks (REQ-006, SC-005)
- [ ] CHK-010 [P1] The invariant is enforced in the shared substrate rather than duplicated as separate mode-local identity logic (REQ-001, REQ-005)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] A missing identity resolver denies before policy evaluation and returns no authorization proof (REQ-001, SC-001)
- [ ] CHK-012 [P0] Independent negative controls cover a throwing resolver, null result, and omission of actor, capability, or evidence identity (REQ-002, SC-001)
- [ ] CHK-013 [P0] Independent mismatch controls for actor, capability, and evidence identity each deny deterministically with no durable mutation (REQ-002)
- [ ] CHK-014 [P0] A positive gateway control allows only after all three independently resolved values match and records all verification flags as true (REQ-003, SC-002)
- [ ] CHK-015 [P0] Prepared-decision tests reject each one-false verification flag and malformed verification state even when request fields and both deterministic digests match (REQ-004, SC-003)
- [ ] CHK-016 [P0] Deep Research, Deep Review, Deep AI Council, and Deep Alignment rollback-switch tests each emit no certificate from an authorization decision missing any verified identity flag (REQ-005, SC-004)
- [ ] CHK-017 [P0] Certificate-trust tests reject a digest-valid certificate whose authorization identity is not fully verified (REQ-006, SC-005)
- [ ] CHK-018 [P0] Certificate-trust tests also reject missing, malformed, and tampered verification evidence without weakening request or digest validation (REQ-006)
- [ ] CHK-019 [P0] The focused gateway, mode-contract, four rollback-gate, and certificate-trust suites all pass with no live authority path enabled (SC-007)
- [ ] CHK-020 [P1] Positive rollback controls still issue and trust evidence when all three identities, request bindings, and deterministic digests verify (REQ-005, REQ-006)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-021 [P0] Every inventoried shared-gateway construction site supplies complete identity or receives deterministic denial; no unreviewed fail-open caller remains (REQ-001, REQ-002)
- [ ] CHK-022 [P0] All four typed rollback switches and every confirmed certificate-trust consumer use the strengthened identity condition (REQ-005, REQ-006)
- [ ] CHK-023 [P1] Any repaired identity or certificate defect reruns the complete focused caller matrix, not only the initially failing mode (SC-007)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P0] Matching raw strings or valid deterministic digests cannot substitute for positive actor, capability, and evidence verification (REQ-003, REQ-006)
- [ ] CHK-025 [P0] Denied, exceptional, partial, mismatched, or tampered identity paths create no authorization proof, rollback certificate, durable domain mutation, or authority mutation (REQ-001, REQ-002, REQ-005)
- [ ] CHK-026 [P1] Persisted pre-remediation decisions or certificates never treat absent verification fields as true (REQ-006)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P0] The identity-and-lock ownership ADR states the prior resolver behavior as opt-in and fail-open in practice and the remediated shared gateway as fail closed (REQ-007, SC-006)
- [ ] CHK-028 [P1] Documentation makes no claim that per-mode wiring or live authority cutover was completed by this substrate phase (REQ-007)
- [ ] CHK-029 [P1] ADR text, implementation evidence, and focused test results agree on the before-and-after runtime boundary (REQ-007, SC-006)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-030 [P0] Shared identity enforcement remains at the gateway, prepared-decision, and certificate-trust boundaries named by the specification; no parallel per-mode mechanism is introduced
- [ ] CHK-031 [P1] Focused fixtures separate missing, null, partial, mismatched, malformed, tampered, and fully verified identity cases so each failure class remains auditable
- [ ] CHK-032 [P1] Verification leaves no unexpected tracked mutation or live authority-state artifact (SC-007)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when unusable identity denies at the shared gateway, every allowed decision carries three true
verification flags, prepared-decision matching and certificate trust reject unverified identity, all four typed rollback
switches refuse certificate issuance, focused suites pass, the ADR describes the actual boundary, and no live authority
state changes.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the verifier records the full negative identity matrix, the fully verified positive control, all four
rollback-switch outcomes, certificate-trust results, focused suite commands and exits, documentation agreement, and zero
live authority mutation. Until then the phase remains Planned and every checklist item stays unchecked.
<!-- /ANCHOR:sign-off -->
