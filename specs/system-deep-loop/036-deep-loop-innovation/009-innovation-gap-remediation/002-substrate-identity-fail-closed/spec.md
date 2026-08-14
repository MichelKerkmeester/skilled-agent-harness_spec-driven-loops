---
title: "Feature Specification: Substrate Identity Fail-Closed"
description: "Plan shared-gateway fail-closed identity resolution and rollback-certificate identity verification before any pilot mode cutover."
trigger_phrases:
  - "substrate identity fail closed"
  - "transition authorization identity resolver"
  - "rollback certificate verified identity"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed"
    last_updated_at: "2026-08-14T00:00:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Authored the planned shared-gateway identity remediation contract"
    next_safe_action: "Complete predecessor evidence, then implement negative identity controls"
    blockers:
      - "Predecessor 001-measurement-and-traceability must complete"
    key_files: []
    completion_pct: 0
    open_questions:
      - "Required resolver dependency or fail-closed default resolver?"
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Substrate Identity Fail-Closed

> Phase sequence under `009-innovation-gap-remediation`: predecessor `001-measurement-and-traceability`; successor `003-pilot-mode-cutover`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | Innovation-gap findings F2 and F7, recommendations rec2 and rec3, and the identity-hardening ADR overstatement |
| **Depends on** | `001-measurement-and-traceability` |
| **Successor** | `003-pilot-mode-cutover` |
| **Authority posture** | Remediation only; no mode cutover or live authority mutation |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The program architecture calls for a typed append-only ledger behind a fail-closed transition-authorization gateway,
followed by per-mode cutover only after evidence and rollback controls pass
([`goal.md:25-29`](../../goal.md#L25-L29)). The shared gateway does not currently meet that identity posture. It calls
identity checking only when `identityResolver` is configured, treats a missing resolver or null resolution as no denial,
and marks only positively pinned fields as verified
([`transition-authorization-gateway.ts:747-797`](../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts#L747-L797)).
The current unit controls confirm that missing, null, and partial resolution can still produce `allow` while one or more
verification flags remain false
([`authorized-ledger.vitest.ts:542-601`](../../../../../.opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts#L542-L601)).

Rollback trust compounds the gap. `matchesPreparedAuthorizationDecision` verifies request bindings and deterministic
digests but does not require `actor_id_verified`, `capability_id_verified`, or `evidence_digest_verified` to be true
([`strict-gate-validator.ts:147-217`](../../../../../.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/strict-gate-validator.ts#L147-L217)).
The Deep Research, Deep Review, Deep AI Council, and Deep Alignment rollback switches all rely on that predicate before
constructing rollback certificates
([Deep Research `rollback-switch.ts:258-276`](../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts#L258-L276),
[Deep Review `rollback-switch.ts:308-326`](../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/rollback-switch.ts#L308-L326),
[Deep AI Council `rollback-switch.ts:286-304`](../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-rollback-gate/rollback-switch.ts#L286-L304),
[Deep Alignment `rollback-switch.ts:321-339`](../../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-rollback-gate/rollback-switch.ts#L321-L339)).
Digest integrity can therefore coexist with unverified identity.

This phase moves the invariant to the shared substrate: authorization must deny unless actor, capability, and evidence
identity are all positively resolved and matched. It also makes verified identity part of rollback-certificate trust and
reconciles the identity-hardening ADR, whose current text says unresolved required identity is denied even though its
implementation summary correctly records the resolver path as opt-in and fail-open in practice
([`decision-record.md:64-66`](../../006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/decision-record.md#L64-L66),
[`implementation-summary.md:60-68`](../../006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/implementation-summary.md#L60-L68)).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make identity resolution mandatory in effect at the shared `TransitionAuthorizationGateway`: absence of a resolver,
  a resolver exception, a null result, a partial result, or any mismatch denies before policy evaluation or mutation.
- Require positive truth for `actor_id_verified`, `capability_id_verified`, and `evidence_digest_verified`; matching raw
  strings or a valid decision digest is not sufficient.
- Tighten `matchesPreparedAuthorizationDecision` so all four typed rollback switches reject an authorization decision
  with any false identity-verification flag before emitting a rollback certificate.
- Tighten the rollback-certificate trust predicate so replayed or externally supplied certificate evidence is not
  trusted on digest integrity alone when its authorization identity was unverified.
- Add unit and rollback-gate negative controls for missing, null, partial, mismatched, and tampered verification state,
  plus a positive control where all three identities are independently pinned and matched.
- Correct the identity-and-lock ownership ADR to describe the shipped opt-in behavior before this remediation and the
  fail-closed behavior after it, without claiming an unwired control was already complete.

### Out of Scope
- Adding identity checks separately inside individual modes when the shared gateway can enforce the invariant.
- Executing a mode cutover, changing an authority record, opening a rollback window, or wiring the successor pilot.
- Redesigning policy identity, lock ownership, durable append fencing, certificate signatures, or rollback state
  machines beyond the identity-verification trust condition.
- Reclassifying the recommendation ledger. Its persisted contract establishes stable recommendation provenance and one
  disposition per row ([`recommendation-ledger` spec lines 53-73](../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/spec.md#L53-L73)); this phase consumes the supplied rec2/rec3 disposition rather than minting new ledger identities.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared-gateway identity is fail closed by default | A gateway authorization attempt with no usable identity resolver returns a typed denial before policy evaluation and produces no authorization proof |
| REQ-002 | Null, throwing, partial, and mismatched resolution deny | Resolver exception, null result, omission of actor, capability, or evidence identity, and mismatch of any field each produce a deterministic denial with no durable domain mutation |
| REQ-003 | Every allowed decision carries fully verified identity | An `allow` decision is possible only when `actor_id_verified`, `capability_id_verified`, and `evidence_digest_verified` are all true and the resolved values match the prepared request |
| REQ-004 | Prepared-decision matching includes identity truth | `matchesPreparedAuthorizationDecision` returns false when any verification flag is false, even if request fields and both deterministic digests match |
| REQ-005 | Typed rollback switches cannot certify unverified identity | The Deep Research, Deep Review, Deep AI Council, and Deep Alignment rollback switches each refuse certificate issuance when the gateway decision lacks any verified identity flag |
| REQ-006 | Certificate trust includes identity verification | The rollback-certificate trust predicate rejects missing, false, malformed, or tampered identity-verification evidence and still validates the existing digest and request bindings |
| REQ-007 | Documentation states the actual control boundary | The identity-hardening ADR distinguishes its prior opt-in/fail-open runtime state from this phase's fail-closed shared-gateway result and makes no per-mode-wiring completion claim |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Unit tests prove the shared gateway denies when the resolver is missing, throws, returns null, or omits any
  of actor, capability, or evidence identity.
- **SC-002**: A positive unit test proves an allowed decision records all three verification flags as true only after
  independent values match the prepared request.
- **SC-003**: `matchesPreparedAuthorizationDecision` rejects each one-false and malformed verification-flag case while
  preserving its existing request and digest checks.
- **SC-004**: Negative tests prove all four typed rollback switches emit no rollback certificate from an unverified
  authorization decision.
- **SC-005**: The certificate trust predicate rejects a digest-valid certificate whose authorization identity is not
  fully verified.
- **SC-006**: The identity-hardening ADR and implementation evidence agree on the before-and-after runtime behavior.
- **SC-007**: The focused gateway, mode-contract, four rollback-gate, and certificate-trust suites pass without enabling
  a live authority path.

**Given** the gateway has no resolver or receives a null or partial result, **When** authorization is requested, **Then**
the request is denied before policy evaluation and no authorization proof is returned.

**Given** a prepared allow decision has valid raw fields and deterministic digests but any verification flag is false,
**When** rollback evidence is matched or trusted, **Then** the decision and resulting certificate are rejected.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Implementation depends on predecessor `001-measurement-and-traceability` completing the gateway-construction and
certificate-consumer inventory. This is load-bearing because the prior identity-hardening work recorded that no
production gateway construction site configured a resolver and that earlier broad changes caused a large per-mode
regression ([`implementation-summary.md:60-68`](../../006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/implementation-summary.md#L60-L68)).

The primary risk is an indiscriminate shared default that breaks intentionally unbound fixtures without establishing a
real deployment identity source. The mitigation is to preserve one invariant across either allowed implementation:
make `identityResolver` a required constructor dependency, or install a shared fail-closed default that can never return
an allow from missing/null/partial identity. The predecessor inventory determines the smaller safe migration, and the
full affected caller matrix must prove that legitimate sites provide complete identity rather than receiving an
exception.

The per-mode authority-flip coordinator is confirmed precedent, not the implementation target: it already requires an
identity resolver and denies throwing, null, partial, or mismatched actor/capability results
([`cutover-coordinator.ts:61-81`](../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts#L61-L81),
[`cutover-coordinator.ts:291-316`](../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts#L291-L316)).
This phase must not leave evidence-digest verification or certificate trust outside the shared contract.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- After predecessor inventory, which implementation has the smaller verified blast radius: a required constructor
  dependency or an optional option with a shared deny-only default? Either choice must satisfy the same runtime denial
  tests and may not preserve fail-open behavior.
- Which existing runtime predicate is the authoritative rollback-certificate trust boundary? Implementation must confirm
  the real symbol and all consumers before editing; this plan intentionally does not invent one from the gap summary.
- Does any persisted pre-remediation authorization decision or rollback certificate require a versioned compatibility
  disposition? Confirm through the predecessor inventory; never treat absent verification fields as true.
<!-- /ANCHOR:questions -->
