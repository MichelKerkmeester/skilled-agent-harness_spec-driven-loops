---
title: "Implementation Plan: Substrate Identity Fail-Closed"
description: "Implementation plan for shared-gateway identity denial, verified rollback authorization, and identity ADR reconciliation."
trigger_phrases:
  - "substrate identity fail closed implementation plan"
  - "rollback certificate identity verification plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "cursor"
    recent_action: "Wired pin-from-request identityResolver at the 13 remaining production gateway sites"
    next_safe_action: "Keep the gateway dark; successor 003-pilot-mode-cutover supplies live identity wiring"
    blockers: []
    key_files:
      - "../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts"
      - "../../../../../.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/strict-gate-validator.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "T005 selected fail-closed-default: identityResolver stays optional at the type level and denies at runtime."
      - "Confirmed trust predicate is matchesPreparedAuthorizationDecision."
---
# Implementation Plan: Substrate Identity Fail-Closed

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Shared transition-authorization gateway and rollback-certificate trust path |
| **Change class** | Fail-closed authorization and certificate-verification hardening |
| **Authority** | No mode cutover; legacy authority remains unchanged |
| **Primary inputs** | Predecessor caller/consumer inventory, gateway controls, mode-contract matcher, four typed rollback switches, identity-hardening ADR |

### Overview
Replace the shared gateway's optional identity assurance with a default-deny invariant, require all three persisted
identity-verification flags when matching prepared authorization decisions, apply that trust condition to the four typed
rollback switches and the confirmed certificate trust boundary, and reconcile the identity-hardening ADR with the
runtime. The per-mode authority-flip coordinator's required resolver is precedent, but enforcement belongs in the shared
gateway so later consumers cannot bypass it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Predecessor `001-measurement-and-traceability` has enumerated every gateway construction site and rollback-certificate consumer
- [x] The real rollback-certificate trust predicate and its complete consumer set are confirmed from runtime code
- [x] Red controls reproduce allow-on-missing, allow-on-null, allow-on-partial, and certificate-from-unverified-decision behavior
- [x] The implementation choice between a required resolver dependency and a shared fail-closed default is recorded with caller-migration impact
- [x] Existing identity, mode-contract, rollback-gate, and certificate-trust suites have a captured baseline

### Definition of Done
- [x] Missing, throwing, null, partial, or mismatched identity denies at the shared gateway before policy evaluation
- [x] Every allowed authorization decision has all three identity-verification flags set to true
- [x] Prepared-decision matching and certificate trust both require all three verified flags
- [x] All four typed rollback switches refuse certificate issuance from unverified decisions
- [x] The identity-hardening ADR describes the verified before-and-after behavior without overclaim
- [x] Focused and affected-caller regression gates pass with no authority mutation or pilot wiring
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared resolver contract**: enforce complete actor, capability, and evidence identity in
  `TransitionAuthorizationGateway`. The selected constructor/default mechanism must deny on missing dependencies at
  runtime, not rely only on TypeScript types.
- **Identity decision record**: retain the existing three verification fields, but make an `allow` with any false field
  unreachable. Denials remain durable and typed through the existing gateway path.
- **Prepared-decision matcher**: extend the confirmed `matchesPreparedAuthorizationDecision` predicate with explicit
  truth checks before accepting otherwise valid request and digest bindings.
- **Typed rollback switches**: preserve their existing centralized matcher call. Add switch-level negative controls for
  Deep Research, Deep Review, Deep AI Council, and Deep Alignment so future matcher drift cannot silently restore
  certificate issuance.
- **Certificate trust boundary**: locate and tighten the actual verifier/predicate during setup. Require verified
  identity in addition to certificate shape, request binding, and digest integrity; absent legacy fields fail closed.
- **Documentation reconciliation**: amend the existing identity-hardening ADR's broad shipped-behavior claim and record
  this phase as the point where the shared fail-closed invariant becomes true.

The enforcement order is fixed: validate request and authority state -> resolve all three expected identity fields ->
deny on missing/null/partial/mismatch -> evaluate policy -> persist a fully verified allow decision -> match prepared
decision -> execute rollback controls -> emit certificate -> independently verify certificate trust. A failure at any
identity step stops downstream trust.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Consume the predecessor's exact gateway-constructor and certificate-consumer inventory.
- Confirm the authoritative certificate trust predicate and the four typed rollback-switch call paths.
- Capture focused baseline results and add red controls for missing, null, partial, mismatched, and false-flag identity.
- Select and document the smallest runtime-safe shared resolver contract without weakening the required denial outcome.

### Phase 2: Implementation
- Implement shared-gateway denial for missing resolver state, resolver exceptions, null resolution, omitted fields, and mismatches.
- Make a successful policy outcome insufficient for `allow` unless actor, capability, and evidence identities are verified.
- Add all-three-true checks to `matchesPreparedAuthorizationDecision` and the confirmed certificate trust predicate.
- Preserve centralized behavior in the four typed rollback switches and add explicit no-certificate assertions at each boundary.
- Reconcile the identity-hardening ADR and its completion wording against the final code and tests.

### Phase 3: Verification
- Run focused gateway controls, including one fully verified positive case and every required negative case.
- Run mode-contract matcher tests with each verification flag independently false, missing, malformed, and tampered.
- Run all four typed rollback-gate suites and prove no unverified decision emits a certificate or mutates rollback state.
- Run certificate-trust tests with digest-valid but identity-unverified evidence and prove rejection.
- Run the predecessor-defined affected-caller regression matrix, TypeScript checks, scoped diff review, and strict packet validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Missing resolver/default identity authority denies before policy evaluation; no proof or domain append is produced |
| REQ-002 | Throwing, null, actor-only, capability-only, evidence-only, two-of-three, and mismatch fixtures each deny deterministically |
| REQ-003 | The sole positive fixture independently pins and matches all three fields and records all flags true |
| REQ-004 | Matcher table tests toggle each verification flag and reject every non-all-true decision despite valid digests |
| REQ-005 | Deep Research, Deep Review, Deep AI Council, and Deep Alignment rollback-gate tests each assert no certificate and no rollback mutation |
| REQ-006 | Certificate trust tests reject missing/false/malformed flags and a recomputed digest over unverified identity evidence |
| REQ-007 | Documentation review compares the ADR statements with the final shared-gateway branch and named negative controls |

Use a safe negative control: first reproduce the current missing/null/partial allow behavior with the existing gateway
tests, then run the same cases after the change and require typed denial. Focused tests precede the complete
predecessor-defined caller matrix; a narrow green suite is not sufficient for this shared boundary.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The hard predecessor is `001-measurement-and-traceability`, which must provide the complete construction-site,
consumer, and test inventory needed to size the shared-gateway blast radius. The persisted architecture confirms that
legacy remains authoritative until per-mode parity and rollback evidence pass
([authority-flip spec lines 53-74](../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md#L53-L74)).

The implementation reuses the current gateway decision fields and `matchesPreparedAuthorizationDecision`; it consumes
the four existing typed rollback switches rather than introducing a fifth mode-local authorization layer. The successor
`003-pilot-mode-cutover` stays blocked until the negative identity controls, certificate trust checks, affected-caller
matrix, and ADR reconciliation are complete.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before any live wiring, rollback is a reviewed revert of this phase's runtime, tests, and ADR reconciliation as one unit,
followed by the same focused and affected-caller gates. Preserve failed identity decisions and test evidence for audit;
do not rewrite certificates to appear verified and do not add a compatibility fallback that maps absent flags to true.

If the shared change causes legitimate callers to fail, keep live authority on legacy, revert to the pre-phase dark
runtime, and use the predecessor inventory to identify the missing authoritative identity provider. Do not repair the
symptom by restoring implicit allow or by adding per-mode bypasses. No authority record, rollback window, or external
deployment is changed by this planned phase, so rollback requires no state migration.
<!-- /ANCHOR:rollback -->
