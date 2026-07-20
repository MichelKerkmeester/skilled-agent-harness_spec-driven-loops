---
title: "Feature Specification: Transition-Authorization Gateway"
description: "Define the fail-closed gateway that authorizes every typed state transition before ledger append, records allow and deny verdicts as auditable non-domain ledger events, and remains dark until phase 014."
trigger_phrases:
  - "transition authorization gateway"
  - "default deny ledger append"
  - "authorization decision events"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the fail-closed authorization gateway and auditable decision events"
    next_safe_action: "Implement the gateway and ledger decision-event integration as one dark unit"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Transition-Authorization Gateway

> Phase adjacency under `006-transition-authorized-ledger-core` (navigation order, not a hard runtime dependency): predecessor `003-replay-fingerprints`; successor none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Fourth child of the phase-006 transition-authorized ledger-core parent |
| **Depends on** | None (`[]`); sibling contracts compose at the phase-006 parent gate |
| **Authority posture** | Enforces only dark-ledger appends through phase 013; legacy remains authoritative until phase 014 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shared spine cannot treat a structurally valid event as proof that a requested state transition is legal. The phase-004 spine ADR therefore requires explicit authorization for every state transition and makes missing, unknown, malformed, stale, unsupported, or failed evaluation default to denial. The transition policy further fixes the decision inputs, the one-writer authority epoch, and the rule that a denial must never advance domain state (`../../004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md`, `../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`).

This phase defines the checkpoint between a validated transition request and the typed ledger append boundary. The gateway binds the exact canonical request, current verified state, actor capability, authority epoch, evidence, and immutable policy version into one decision. It records both allow and deny verdicts as typed first-class events in a dedicated non-domain authorization-audit stream, then permits the requested domain event only when a durable allow event matches the exact request digest and current head. A denied request records audit evidence but advances no domain sequence, projection, idempotency success, receipt, or side effect.

The gateway and sibling ledger must co-land as one dark unit: the ledger rejects every direct or unproved domain append, while authorization-decision events have one narrow gateway-owned emission path that cannot trigger domain reducers. Until phase 014, a dark denial or gateway failure blocks only the parallel typed append and cannot change the authoritative legacy outcome. This preserves the additive-dark migration model in the program parent and `manifest/phase-tree.json` while making unauthorized typed history impossible from the first writer onward (`../../spec.md`, `../../manifest/phase-tree.json`, `../002-typed-append-only-ledger/spec.md`).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A single `authorize` boundary invoked after envelope validation and before ledger sequence allocation, durable domain append, projection, receipt, or side effect.
- Default-deny evaluation over the exact canonical request, verified prior-state identity and head, registered policy, actor/capability, authority epoch, and supplied invariant evidence.
- A versioned authorization-decision record containing input identities and digests, policy identity/version/digest, matched rules, verdict, reason code, decision digest, and evaluation time.
- Typed allow and deny decision events in a dedicated non-domain ledger stream; the gateway is the only emitter, and those events never enter domain reducers or advance a domain sequence.
- Exact linkage from an allowed decision event to one requested domain event; replay rejects missing, later, expired, stale-head, stale-epoch, mismatched, duplicated-with-different-content, or tampered linkage.
- Denial behavior that records bounded audit metadata without copying sensitive payload content and returns a typed rejection without appending the domain event.
- Replay and audit that re-evaluate deterministic policy inputs where the registered policy is available and always verify stored decision, request, policy, authority, and ledger linkage.
- Crash and partial-write semantics: an allow event without its target event remains visibly unapplied; inability to durably record the decision prevents the domain append.
- A reusable additive-dark adapter and frozen transition-boundary census in which authorization gates only the new typed ledger and cannot alter legacy authority before phase 014.

### Out of Scope
- Event-envelope fields and registry/upcast mechanics owned by `001-versioned-event-envelope`.
- Ledger framing, locking, sequence assignment, integrity, and recovery owned by `002-typed-append-only-ledger`.
- Replay-fingerprint composition owned by predecessor `003-replay-fingerprints`; this phase supplies decision inputs and linkage for that fingerprint.
- Domain-specific transition policies for later orchestration, projection, convergence, or mode schemas; this phase defines the common evaluator and policy contract.
- Compatibility adapters, shadow-parity decisions, rollback rehearsal, authority cutover, or legacy-writer retirement owned by program phases 005, 011, and 012.
- Treating an authorization verdict, dark ledger, or audit projection as runtime authority before phase 014, or wiring the reusable adapter into existing runtime writers in this core landing.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every typed state transition passes one gateway before append | The ledger exposes no domain append path that succeeds without an exact, valid, durable allow decision reference |
| REQ-002 | Authorization defaults to denial | Missing input, unknown policy or rule, malformed request, stale state/head/epoch, unsupported type/version, evaluator exception, timeout, or storage failure yields a typed deny and no domain append |
| REQ-003 | Decision inputs are complete and exact | Each decision binds decision/request IDs, mode and stream, prior version/head/fingerprint, requested event type/version and digest, actor/capability, authority epoch, evidence digest, and correlation/causation identity |
| REQ-004 | Policy identity is immutable and replayable | Each decision binds policy ID, policy version, policy digest, evaluator version, and matched rule IDs; an unknown or digest-mismatched policy cannot authorize |
| REQ-005 | Verdicts are explicit, bounded, and auditable | Each decision records allow/deny, stable reason code, bounded explanation metadata, evaluation timestamp, and decision digest without copying sensitive payload content |
| REQ-006 | Both verdicts are first-class ledger events | Allow and deny decisions use a registered typed event in a non-domain audit stream; only the gateway-owned emitter can append them and domain reducers ignore them |
| REQ-007 | Denial never becomes domain history | A deny event may advance the audit stream but cannot allocate a domain sequence, append the requested event, update a projection, consume idempotency success, issue an effect receipt, or trigger a side effect |
| REQ-008 | Allow linkage is single-use and request-exact | The domain append verifies decision ID/digest, verdict, request digest, prior head, authority epoch, policy digest, event identity, and freshness, then consumes the proof for that exact append only |
| REQ-009 | Replay and audit detect authorization drift | Replay reconstructs decision order, verifies every domain event has an earlier matching allow event, verifies denied requests have no linked domain event, and reports policy or verdict divergence without rewriting history |
| REQ-010 | Partial failure is explicit and fail closed | Decision-audit append failure prevents domain append; a durable allow with no target append remains an auditable unapplied authorization and may be retried only through exact idempotency rules |
| REQ-011 | Dark operation preserves legacy authority | Through phase 013, gateway outcomes govern only the dark typed ledger and never change legacy JSONL state, mode control flow, user-visible result, or effect execution |
| REQ-012 | The gateway co-lands with the ledger core | The phase-006 parent gate rejects any composition where a typed writer can land before the gateway or where the gateway cannot durably emit both verdict classes |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every successful typed domain append has one earlier durable allow event bound to the exact request, policy, state head, and authority epoch.
- **SC-002**: Every evaluated denial is durably auditable without a corresponding domain append or domain-state mutation.
- **SC-003**: Direct, stale, malformed, mismatched, unknown-policy, evaluator-failure, and decision-storage-failure paths all fail closed before domain sequence allocation.
- **SC-004**: Deterministic replay verifies allow linkage, deny absence, policy identity, and verdict parity while preserving original history.
- **SC-005**: The reusable dark adapter returns the exact legacy result for gateway allow, deny, and typed-ledger failure while recording observable telemetry.
- **SC-006**: The ledger, gateway, envelope, and replay-fingerprint contracts pass one co-landing gate with no authorization bypass.

**Given** a complete request whose deterministic policy evaluation allows the transition, **When** the gateway runs, **Then** it durably records an allow event before the exact domain event and the ledger receipt links both.

**Given** a request whose policy evaluation denies the transition, **When** the gateway runs, **Then** it records a deny event and advances no domain sequence, projection, receipt, or effect.

**Given** missing inputs, an unknown policy, stale head or authority epoch, an unsupported event version, or an evaluator failure, **When** authorization is attempted, **Then** the gateway denies by default and no domain append occurs.

**Given** an allow decision for another digest, head, epoch, policy, event identity, or prior use, **When** the ledger verifies it, **Then** the append fails closed and the mismatch is auditable.

**Given** a durable allow event followed by a crash before domain append, **When** replay runs, **Then** it reports an unapplied authorization without inventing, deleting, or applying a domain transition.

**Given** the legacy path and dark typed path disagree before phase 014, **When** runtime behavior is selected, **Then** legacy remains authoritative and the disagreement becomes shadow evidence only.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main security risk is an accidental bypass: a convenience append API, permissive fallback, stale proof, or recursive decision authorization would allow ungoverned history. The composition therefore exposes one domain append boundary, treats every uncertainty as deny, and grants the gateway a schema-closed capability only for non-domain authorization-decision events. That capability cannot emit domain types, call reducers, authorize effects, or authorize itself recursively.

Audit ordering creates a deliberate partial-failure state: an allow event can exist without an applied domain event, but the inverse can never exist. Replay treats that state as unapplied authorization, and exact idempotency may retry the target append without minting a conflicting decision. Decision records also risk leaking sensitive payloads; only canonical request and evidence digests plus bounded reason metadata are retained.

This child declares `depends_on: []`, matching the independent sibling planning contract. Implementation co-lands with the sibling envelope, ledger, and replay-fingerprint work at the phase-006 parent gate. Normative inputs are the phase-004 spine ADR and transition policy, the program invariants, `manifest/phase-tree.json`, and `../002-typed-append-only-ledger/spec.md`. Phase 008 later proves shadow parity, and phase 014 alone may make these decisions authoritative for runtime state.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The implementation selected module names, a typed policy registry, a separate audit stream, and immutable decision linkage without weakening default-deny behavior, exact request/policy/state binding, durable audit of both verdicts, non-domain denial semantics, single-use allow linkage, deterministic replay, or dark non-authority before phase 014.
<!-- /ANCHOR:questions -->
