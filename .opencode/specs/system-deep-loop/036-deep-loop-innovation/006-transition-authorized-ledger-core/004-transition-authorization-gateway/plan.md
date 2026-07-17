---
title: "Implementation Plan: Transition-Authorization Gateway"
description: "Implementation plan for the default-deny gateway, versioned decision events, exact allow linkage, replay audit, and additive-dark integration with the typed ledger."
trigger_phrases:
  - "transition authorization gateway implementation plan"
  - "default deny gateway plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the gateway call flow, decision schema, and replay checks"
    next_safe_action: "Implement policy evaluation and the gateway-owned decision audit emitter"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Transition-Authorization Gateway

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime |
| **Change class** | Security-sensitive state-transition control and audit |
| **Execution** | Co-landed dark unit with the versioned envelope, ledger, and replay fingerprints |

### Overview
Implement one fail-closed checkpoint between validated transition requests and the typed ledger's domain append. The gateway canonicalizes the authorization inputs, loads an exact immutable policy version, evaluates deterministic rules, and durably emits a typed allow or deny event to the ledger's non-domain authorization-audit stream. Only an earlier, exact, single-use allow decision can unlock the requested domain append. The whole path stays non-authoritative for runtime behavior until phase 014, even though it is authoritative over what may enter the dark ledger.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-004 spine ADR and transition/versioning policy are ratified and their authorization fields are frozen
- [ ] The versioned envelope exposes canonical request bytes and stable event/type/version identities
- [ ] The ledger exposes a proof-required domain append and a gateway-only non-domain decision-event emitter
- [ ] Replay fingerprints can incorporate decision, policy, prior-head, authority-epoch, and target-event linkage
- [ ] The dark/legacy boundary is explicit: gateway outcomes cannot affect legacy mode behavior before phase 014

### Definition of Done
- [ ] Every typed domain append is preceded by one durable, exact, valid allow event
- [ ] Allow and deny verdicts are both typed first-class ledger events with complete bounded audit fields
- [ ] Default-deny, proof-linkage, replay/audit, partial-failure, and direct-bypass tests pass
- [ ] A dark gateway denial or failure leaves the authoritative legacy result unchanged and emits observable shadow evidence
- [ ] The phase-006 co-landing gate proves no typed writer exists without the gateway
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Gateway call flow
1. Accept a validated envelope request plus verified prior ledger head/state identity, actor/capability, authority epoch, and invariant evidence.
2. Canonicalize and hash the complete authorization request before evaluation; reject incomplete or non-canonical input.
3. Resolve an exact registered policy ID/version/digest and run a deterministic evaluator over the immutable input snapshot.
4. Convert every non-allow outcome, unknown, stale value, exception, timeout, or evaluator ambiguity to an explicit deny reason code.
5. Durably append `authorization.decision.recorded@1` through the gateway-owned audit emitter before any domain sequence allocation.
6. For deny, return the typed rejection and stop. For allow, pass the decision reference and exact request digest to the ledger's proof-required append.
7. Verify the decision again under the ledger lock against current head, epoch, event identity, policy digest, verdict, freshness, and prior use; append the domain event or fail closed.

### Decision record shape

| Group | Required fields |
|-------|-----------------|
| Identity | decision ID, request ID, mode, stream, correlation/causation IDs, evaluated timestamp |
| Inputs | prior state version/fingerprint, ledger head sequence/hash, requested event ID/type/version, canonical request digest, actor/capability, authority epoch, evidence digest |
| Policy | policy ID, policy version, policy digest, evaluator version, matched rule IDs |
| Verdict | allow/deny, stable reason code, bounded metadata, decision digest |
| Linkage | target event identity/digest, decision-event sequence/hash, application state derived from presence or absence of the target domain event |

### Boundaries and invariants
- The gateway owns the only capability that emits authorization decision types. The capability is schema-closed and cannot emit a domain type, trigger a reducer, authorize an effect, or recursively authorize itself.
- The ledger owns sequence allocation and revalidates allow linkage under its exclusive append lock. A pre-lock allow against a changed head or epoch becomes stale and cannot append.
- Audit-stream progress and domain-stream progress are distinct. A denial or unapplied allow may advance audit order but never domain sequence or projection state.
- Replay verifies stored verdict/linkage and may deterministically re-evaluate against the registered historical policy. Divergence is reported as evidence; history is never rewritten.
- Dark integration observes legacy emission boundaries, but gateway errors change only the typed shadow record. Legacy control flow, persistence, outputs, and effects remain authoritative until phase 014.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the authorization field/vocabulary matrix against the phase-004 ADR and transition policy.
- Confirm the envelope, ledger, and replay-fingerprint sibling interfaces compose without a direct append path.
- Inventory every dark state-transition emission boundary that will call the gateway.
- Define typed reason codes and fixtures for allow, policy deny, malformed input, unknown policy, stale head/epoch, evaluator failure, decision-storage failure, and proof mismatch.

### Phase 2: Implementation
- Implement the canonical authorization-request builder and digest validation.
- Implement the immutable versioned policy registry and deterministic evaluator interface.
- Implement default-deny normalization for every non-allow and failure path.
- Register the authorization-decision event type and gateway-only non-domain audit emitter.
- Implement proof-required domain append linkage with under-lock head, epoch, digest, verdict, and single-use validation.
- Implement typed rejection results, bounded reason metadata, and sensitive-payload exclusion.
- Implement replay/audit verification for decision order, allow-to-event linkage, deny absence, policy identity, and deterministic re-evaluation.
- Integrate the gateway at every dark transition boundary without changing legacy behavior.

### Phase 3: Verification
- Prove the ledger refuses direct, missing-proof, deny-proof, mismatched, stale, reused, tampered, and unknown-policy appends.
- Prove both verdict classes are durable typed events and only allow can precede the exact domain event.
- Prove denial advances no domain sequence, projection, idempotency success, receipt, or side effect.
- Prove a decision-audit append failure prevents domain append and a crash after allow remains visibly unapplied.
- Prove replay reproduces verdicts and detects policy, request, head, epoch, or linkage drift without rewriting history.
- Prove dark denial/failure leaves every authoritative legacy output and effect unchanged through phase 013.
- Run the phase-006 parent co-landing gate across envelope, ledger, fingerprint, and authorization fixtures.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 / REQ-012 | API-surface and integration tests show no typed domain append succeeds without the co-landed gateway |
| REQ-002 | Table-driven failure matrix covers missing, malformed, unknown, unsupported, stale, exception, timeout, and storage-failure inputs; every row denies |
| REQ-003 / REQ-004 / REQ-005 | Decision-schema fixtures round-trip every required input, policy, and verdict field and reject omitted or digest-mismatched data |
| REQ-006 | Allow and deny events pass typed ledger validation; unauthorized emitters and domain-type use through the audit capability fail |
| REQ-007 | Denial tests assert unchanged domain head, projection, idempotency success set, receipts, and effects while the audit event remains readable |
| REQ-008 | Proof matrix covers exact success plus wrong request, head, epoch, policy, event, verdict, freshness, prior use, and tampering |
| REQ-009 | Golden replay reconstructs decision order and linked application state; mutation tests expose policy/verdict/linkage drift |
| REQ-010 | Crash/fault injection covers pre-decision durability, post-allow/pre-domain append, under-lock head change, and retry idempotency |
| REQ-011 | Shadow integration compares legacy outputs/effects with gateway allow, deny, and failure cases and confirms legacy authority is unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child has `depends_on: []`; adjacency to `003-replay-fingerprints` is navigation only. Normative inputs are the program parent `../../spec.md`, `../../manifest/phase-tree.json`, the phase-004 spine ADR, and the phase-004 transition/versioning/rollback policy. Implementation composes with sibling `001-versioned-event-envelope`, `002-typed-append-only-ledger`, and `003-replay-fingerprints` at the phase-006 parent gate. Phase 008 later supplies shadow-parity and compatibility evidence; phase 014 alone changes runtime authority.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before phase 014, rollback disables the dark transition-boundary adapter and leaves authoritative legacy writers untouched. Authorization decision and domain events already recorded remain immutable audit evidence; rollback never truncates, rewrites, or deletes them. If the gateway, decision schema, or proof contract is invalid, stop new dark appends, preserve the verified ledger head and fixtures, revert the bounded implementation commits, and reopen the phase-006 co-landing gate. No authority rollback is performed here because this phase is non-authoritative.
<!-- /ANCHOR:rollback -->
